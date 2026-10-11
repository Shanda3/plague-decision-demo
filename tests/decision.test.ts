import test from 'node:test';
import assert from 'node:assert/strict';
import {handleDecision,decisionStatus,providerRequest,validateProviderResponse,MODEL,MAX_PROVIDER_BODY_BYTES} from '../lib/decision-service.ts';
import type {BudgetStore,Dependencies} from '../lib/decision-service.ts';
import {PATTERNS} from '../lib/quiz.ts';
import type {QuizAnswers} from '../lib/quiz.ts';
const answers:QuizAnswers={emergency:'no',fever:'yes',nodes:'yes',symptoms:['none'],exposure:['none'],activity:'no',onset:'today'};
const config={apiKey:'TEST_ONLY_NOT_A_REAL_KEY',enabled:'true',pricingReviewedUntil:'2026-10-20T00:00:00Z'};
const now=()=>new Date('2026-10-09T12:00:00Z');
function store():BudgetStore{return{async reserve(){return true;},async complete(){}};}
const valid=()=>({model:MODEL,answers:[{name:'educational_pattern',type:'choice',choice:'fever_swelling',confidence:.8,probabilities:Object.keys(PATTERNS).map(value=>({value,probability:value==='fever_swelling'?.9:.02}))}],usage:{input_tokens:350,output_tokens:0,total_tokens:350}});
const deps=(extra:Partial<Dependencies>={}):Dependencies=>({config,store:store(),now,fetcher:async()=>Response.json(valid()),...extra});
const body=()=>({schemaVersion:1,consent:true,answers});
const request=(payload:unknown=body())=>new Request('https://demo.example/api/decision',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://demo.example'},body:JSON.stringify(payload)});
test('GET availability accepts no health answers and exposes no configuration details',async()=>{assert.deepEqual(await decisionStatus(deps()).json(),{available:true});assert.deepEqual(await decisionStatus(deps({config:{}})).json(),{available:false});});
test('no key, disabled/expired/review-invalid mode or missing DB prevents API calls',async()=>{let calls=0;for(const overrides of [{config:{}},{config:{...config,enabled:'false'}},{config:{...config,pricingReviewedUntil:'2026-10-08'}},{config:{...config,pricingReviewedUntil:'2099-01-01'}},{store:undefined}])assert.equal((await handleDecision(request(),deps({fetcher:async()=>{calls++;return Response.json(valid());},...overrides}))).status,503);assert.equal(calls,0);});
test('explicit consent and exact strict schema required, no free text accepted',async()=>{for(const payload of [{...body(),consent:false},{...body(),note:'my medical history'},{...body(),answers:{...answers,name:'person'}},{presetId:'curious_reader'},{...body(),answers:{...answers,symptoms:['none','cough']}},null])assert.equal((await handleDecision(request(payload),deps())).status,400);});
test('cross-origin and non-JSON rejected',async()=>{const r=request();r.headers.set('Origin','https://foreign.example');assert.equal((await handleDecision(r,deps())).status,403);const r2=request();r2.headers.set('Content-Type','text/plain');assert.equal((await handleDecision(r2,deps())).status,415);});
test('provider input is bounded enum-only answers and supported pattern list',()=>{const p=providerRequest(answers);assert.ok(Buffer.byteLength(JSON.stringify(p))<MAX_PROVIDER_BODY_BYTES);assert.equal(p.questions[0].name,'educational_pattern');assert.deepEqual(JSON.parse(p.input).answers,answers);});
test('actual valid response returns only pattern/provider, never medical model prose or confidence',async()=>{const response=await handleDecision(request(),deps());assert.equal(response.status,200);assert.deepEqual(await response.json(),{pattern:'fever_swelling',provider:'OpenAI Decisions API'});});
test('meaning guard rejects unsupported patterns despite valid structure',()=>{const bad=valid();bad.answers[0].choice='respiratory';assert.equal(validateProviderResponse(bad,answers),null);bad.answers[0].choice='no_reported';assert.equal(validateProviderResponse(bad,answers),null);assert.equal(validateProviderResponse(valid(),answers),'fever_swelling');});
test('refusal, invalid model, probabilities or usage fail closed',()=>{for(const data of [{answers:[{type:'refusal'}]},{...valid(),model:'other'},{...valid(),usage:{input_tokens:90000,output_tokens:0,total_tokens:90000}},{...valid(),answers:[{...valid().answers[0],confidence:NaN}]}])assert.equal(validateProviderResponse(data,answers),null);});
test('only random reservation ID/month and completion ID reach persistence, never answers/result',async()=>{const recorded:unknown[]=[];const db:BudgetStore={async reserve(...args){recorded.push(args);return true;},async complete(...args){recorded.push(args);}};await handleDecision(request(),deps({store:db,requestId:()=> 'random-reservation-id'}));assert.deepEqual(recorded,[['random-reservation-id','2026-10'],['random-reservation-id']]);});
test('budget/database failure stops upstream; no retries or refunds on uncertain failures',async()=>{let calls=0;const failing:BudgetStore={async reserve(){return false;},async complete(){}};assert.equal((await handleDecision(request(),deps({store:failing,fetcher:async()=>{calls++;return Response.json(valid());}}))).status,429);assert.equal(calls,0);let reserved=0;const db:BudgetStore={async reserve(){reserved++;return true;},async complete(){assert.fail('failed response must not complete');}};const response=await handleDecision(request(),deps({store:db,fetcher:async()=>{calls++;throw Error('timeout');}}));assert.equal(response.status,502);assert.equal(calls,1);assert.equal(reserved,1);});

type DiagnosticResult={diagnostic:{category:string;upstreamStatus?:number;providerCode?:string;providerType?:string;elapsedMs:number;schemaKeys:{root:string[];answer:string[];usage:string[]}}};

test('preview diagnostics classify provider HTTP failure without retaining provider body or secrets',async()=>{
 const sentinel='NEVER_EXPOSE_SECRET_OR_HEALTH_TEXT';
 const response=await handleDecision(request(),deps({config:{...config,apiKey:sentinel,diagnostics:true},fetcher:async()=>new Response(JSON.stringify({error:{message:sentinel,code:sentinel}}),{status:401})}));
 const result=await response.json() as DiagnosticResult;assert.equal(response.status,502);assert.equal(result.diagnostic.category,'provider_http');assert.equal(result.diagnostic.upstreamStatus,401);assert.equal(typeof result.diagnostic.elapsedMs,'number');assert.ok(!JSON.stringify(result).includes(sentinel));
});
test('diagnostics are absent by default even on upstream failure',async()=>{
 const response=await handleDecision(request(),deps({fetcher:async()=>new Response('private provider body',{status:429})}));
 assert.deepEqual(Object.keys(await response.json()),['message']);
});
test('diagnostics distinguish malformed JSON, oversized response, transport, and ledger completion without retry',async()=>{
 const cases:[string,Partial<Dependencies>][]=[
  ['invalid_json',{fetcher:async()=>new Response('not json')}],
  ['response_too_large',{fetcher:async()=>new Response('x'.repeat(32769))}],
  ['transport',{fetcher:async()=>{throw Error('PRIVATE transport detail')}}],
  ['ledger_complete',{store:{async reserve(){return true},async complete(){throw Error('PRIVATE ledger detail')}}}],
 ];
 for(const [category,override] of cases){const result=await(await handleDecision(request(),deps({config:{...config,diagnostics:true},...override}))).json() as DiagnosticResult;assert.equal(result.diagnostic.category,category);assert.ok(!JSON.stringify(result).includes('PRIVATE'));}
});
test('schema diagnostics report only fixed known key names, never values or arbitrary keys',async()=>{
 const data={...valid(),model:'PRIVATE_MODEL',PRIVATE_KEY:'PRIVATE_VALUE',answers:[{...valid().answers[0],choice:'PRIVATE_ANSWER',PRIVATE_KEY:'PRIVATE_VALUE'}]};
 const response=await handleDecision(request(),deps({config:{...config,diagnostics:true},fetcher:async()=>Response.json(data)}));const result=await response.json() as DiagnosticResult;
 assert.equal(result.diagnostic.category,'schema_rejected');assert.deepEqual(result.diagnostic.schemaKeys.root,['answers','model','usage']);assert.deepEqual(result.diagnostic.schemaKeys.answer,['type','name','choice','confidence','probabilities']);assert.ok(!JSON.stringify(result).includes('PRIVATE'));
});


test('diagnostic provider errors separate quota and rate limits using exact allowlisted values only',async()=>{
 for(const [status,code,type] of [[429,'insufficient_quota','insufficient_quota'],[429,'rate_limit_exceeded','rate_limit_error'],[401,'invalid_api_key','authentication_error'],[404,'model_not_found','invalid_request_error'],[403,'permission_denied','permission_error']] as const){
  const r=await handleDecision(request(),deps({config:{...config,diagnostics:true},fetcher:async()=>Response.json({error:{code,type,message:'PRIVATE provider message',param:'PRIVATE field'}},{status})}));
  const result=await r.json() as DiagnosticResult;assert.equal(result.diagnostic.upstreamStatus,status);assert.equal(result.diagnostic.providerCode,code);assert.equal(result.diagnostic.providerType,type);assert.ok(!JSON.stringify(result).includes('PRIVATE'));
 }
});
test('unknown, malformed, and oversized provider errors never leak body content',async()=>{
 for(const value of [JSON.stringify({error:{code:'PRIVATE_KEY',type:'PRIVATE_TYPE',message:'PRIVATE_BODY'}}),'PRIVATE non-JSON', 'PRIVATE'.repeat(2000)]){
  const r=await handleDecision(request(),deps({config:{...config,diagnostics:true},fetcher:async()=>new Response(value,{status:429})}));const result=await r.json() as DiagnosticResult;
  assert.equal(result.diagnostic.category,'provider_http');assert.equal(result.diagnostic.providerCode,'unknown');assert.equal(result.diagnostic.providerType,'unknown');assert.ok(!JSON.stringify(result).includes('PRIVATE'));
 }
});

test('provider redirects fail closed in one call without following or completing reservation',async()=>{
 for(const status of [301,302,303,307,308]){
  let calls=0,reservations=0;
  const db:BudgetStore={async reserve(){reservations++;return true;},async complete(){assert.fail('redirect must not complete');}};
  const response=await handleDecision(request(),deps({store:db,fetcher:async(input)=>{
   calls++;assert.ok(input instanceof Request);assert.equal(input.url,'https://api.openai.com/v1/decisions');assert.equal(input.method,'POST');assert.equal(input.redirect,'manual');
   return new Response(null,{status,headers:{Location:'https://untrusted.example/redirect-target'}});
  }}));
  assert.equal(response.status,502);assert.equal(calls,1);assert.equal(reservations,1);
 }
});

test('injected remote preview header is removed before provider dispatch',async()=>{
 const OriginalRequest=globalThis.Request;const incoming=request();
 globalThis.Request=class extends OriginalRequest {
  constructor(input:ConstructorParameters<typeof Request>[0],init?:RequestInit){super(input,init);this.headers.set('cf-workers-preview-token','fake-preview-token');}
 };
 try{
  let calls=0;
  const response=await handleDecision(incoming,deps({fetcher:async(input)=>{
   calls++;assert.ok(input instanceof OriginalRequest);assert.equal(input.headers.has('cf-workers-preview-token'),false);assert.equal(input.headers.get('Authorization'),`Bearer ${config.apiKey}`);assert.equal(input.headers.get('Content-Type'),'application/json');
   assert.equal(input.redirect,'manual');assert.equal(input.signal.aborted,false);assert.deepEqual(JSON.parse(await input.text()),providerRequest(answers));return Response.json(valid());
  }}));
  assert.equal(response.status,200);assert.equal(calls,1);
 }finally{globalThis.Request=OriginalRequest;}
});

test('native fetch fallback retains the global receiver',async(t)=>{
 let calls=0;t.mock.method(globalThis,'fetch',async function(this:unknown,input:RequestInfo|URL){
  calls++;assert.equal(this,globalThis);assert.ok(input instanceof Request);assert.equal(input.redirect,'manual');return Response.json(valid());
 });
 assert.equal((await handleDecision(request(),deps({fetcher:undefined}))).status,200);assert.equal(calls,1);
});
