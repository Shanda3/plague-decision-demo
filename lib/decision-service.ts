import { PATTERNS, validAnswers, isPattern, eligiblePatterns } from './quiz.ts';
import type { QuizAnswers, PatternId } from './quiz.ts';
export const MODEL='gpt-6-luna';
export const MONTHLY_CEILING_CENTS=18_000;
export const RESERVATION_CENTS=100;
export const MAX_BODY_BYTES=2048;
export const MAX_PROVIDER_BODY_BYTES=8192;
export const MAX_USAGE_TOKENS=20_000;
export interface BudgetStore { reserve(id:string,month:string):Promise<boolean>; complete(id:string):Promise<void> }
export type Config={apiKey?:string;enabled?:string;pricingReviewedUntil?:string;diagnostics?:boolean};
export type Dependencies={config:Config;store?:BudgetStore;fetcher?:typeof fetch;now?:()=>Date;requestId?:()=>string};
const reply=(status:number,payload:object)=>Response.json(payload,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export function configured(deps:Dependencies){const now=(deps.now??(()=>new Date()))();const review=Date.parse(deps.config.pricingReviewedUntil??'');return !!deps.config.apiKey&&deps.config.enabled==='true'&&!!deps.store&&Number.isFinite(review)&&review>now.getTime()&&review<=now.getTime()+32*86_400_000;}
export function decisionStatus(deps:Dependencies){return reply(200,{available:configured(deps)});}
export function providerRequest(answers:QuizAnswers){return {model:MODEL,input:JSON.stringify({schemaVersion:1,answers,supportedPatterns:eligiblePatterns(answers)}),questions:[{type:'choice',name:'educational_pattern',instructions:'Choose the most relevant educational symptom-pattern label supported explicitly by these structured answers. Do not diagnose disease, estimate medical risk, infer unreported symptoms, choose care urgency, or recommend treatment. Timing cannot rule out illness. Uncertainty is a valid answer. The caller computes medical action guidance separately.',choices:Object.entries(PATTERNS).map(([value,topic])=>({value,description:topic.title+'. '+topic.explanation}))}]};}
function record(x:unknown):x is Record<string,unknown>{return !!x&&typeof x==='object'&&!Array.isArray(x);}
const probability=(x:unknown)=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=1;
export function validateProviderResponse(data:unknown,answers:QuizAnswers):PatternId|null{
 if(!record(data)||data.model!==MODEL||!Array.isArray(data.answers)||data.answers.length!==1||!record(data.usage))return null;
 const answer=data.answers[0],allowed=eligiblePatterns(answers);
 if(!record(answer)||answer.type!=='choice'||answer.name!=='educational_pattern'||!isPattern(answer.choice)||!allowed.includes(answer.choice)||!probability(answer.confidence)||!Array.isArray(answer.probabilities))return null;
 if(answer.probabilities.length!==Object.keys(PATTERNS).length||new Set(answer.probabilities.map((p:unknown)=>record(p)?p.value:null)).size!==Object.keys(PATTERNS).length||!answer.probabilities.every((p:unknown)=>record(p)&&isPattern(p.value)&&probability(p.probability)))return null;
 const tokens=data.usage.input_tokens;
 if(typeof tokens!=='number'||!Number.isSafeInteger(tokens)||tokens<0||tokens>MAX_USAGE_TOKENS||data.usage.output_tokens!==0||data.usage.total_tokens!==tokens)return null;
 return answer.choice;
}
export async function boundedText(stream:ReadableStream<Uint8Array>|null,limit:number):Promise<string>{if(!stream)return '';const reader=stream.getReader();let size=0;const chunks:Uint8Array[]=[];try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw Error('size');}chunks.push(value);}}finally{reader.releaseLock();}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}return new TextDecoder('utf-8',{fatal:true}).decode(bytes);}

// Opt-in preview diagnostics expose only fixed categories, numeric metadata, and
// presence of known schema keys. Never serialize provider values or unknown keys.
function responseShape(data:unknown){
 const keys=(value:unknown,allowed:string[])=>record(value)?allowed.filter(key=>Object.hasOwn(value,key)):[];
 const first=record(data)&&Array.isArray(data.answers)?data.answers[0]:undefined;
 return {root:keys(data,['answers','model','usage','error']),answer:keys(first,['type','name','choice','confidence','probabilities']),usage:keys(record(data)?data.usage:undefined,['input_tokens','input_tokens_details','output_tokens','output_tokens_details','total_tokens'])};
}
const ERROR_CODES=new Set(['insufficient_quota','rate_limit_exceeded','invalid_api_key','model_not_found','permission_denied','access_denied','forbidden','unsupported_model','invalid_request_error','server_error','service_unavailable','billing_hard_limit_reached','account_deactivated','organization_deactivated','project_not_found']);
const ERROR_TYPES=new Set(['insufficient_quota','rate_limit_error','authentication_error','permission_error','invalid_request_error','server_error','not_found_error','api_error']);
function providerErrorClass(data:unknown){
 const error=record(data)&&record(data.error)?data.error:undefined;
 return {providerCode:typeof error?.code==='string'&&ERROR_CODES.has(error.code)?error.code:'unknown',providerType:typeof error?.type==='string'&&ERROR_TYPES.has(error.type)?error.type:'unknown'};
}
export async function handleDecision(request:Request,deps:Dependencies):Promise<Response>{
 if(request.method!=='POST')return reply(405,{message:'Use POST after explicit consent.'});
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return reply(403,{message:'Cross-origin requests are not accepted.'});
 if(!configured(deps))return reply(503,{message:'Live AI not connected or paused. Use the offline rules preview.'});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply(415,{message:'Only structured JSON answers are accepted.'});
 let body:unknown;try{body=JSON.parse(await boundedText(request.body,MAX_BODY_BYTES));}catch{return reply(400,{message:'Invalid structured answers.'});}
 if(!record(body)||Object.keys(body).length!==3||body.schemaVersion!==1||body.consent!==true||!validAnswers(body.answers))return reply(400,{message:'Explicit consent and the seven allowlisted answers are required. No free text or identifying details are accepted.'});
 const input=JSON.stringify(providerRequest(body.answers));if(new TextEncoder().encode(input).byteLength>MAX_PROVIDER_BODY_BYTES)return reply(503,{message:'The request exceeds its safety bounds.'});
 const id=(deps.requestId??(()=>crypto.randomUUID()))();const month=(deps.now??(()=>new Date()))().toISOString().slice(0,7);
 try{if(!await deps.store!.reserve(id,month))return reply(429,{message:'This demo’s shared monthly API allowance is used up. Continue with offline rules.'});}catch{return reply(503,{message:'The persistent spending safeguard is unavailable. Continue offline.'});}
 const started=Date.now();const signal=AbortSignal.timeout(12_000);
 let upstreamStatus:number|undefined;
 let stage:'transport'|'response_read'|'response_parse'|'ledger_complete'='transport';
 const failure=(category:string,message:string,shape?:ReturnType<typeof responseShape>,providerError?:ReturnType<typeof providerErrorClass>)=>reply(502,{message,...(deps.config.diagnostics===true?{diagnostic:{category,elapsedMs:Math.min(120000,Math.max(0,Date.now()-started)),...(upstreamStatus===undefined?{}:{upstreamStatus}),...(shape?{schemaKeys:shape}:{}),...providerError}}:{})});
 try{
  const outbound=new Request('https://api.openai.com/v1/decisions',{method:'POST',headers:{Authorization:`Bearer ${deps.config.apiKey}`,'Content-Type':'application/json'},body:input,signal,redirect:'manual'});
  // Remote previews may inject this header. Never send it to the provider.
  outbound.headers.delete('cf-workers-preview-token');
  const upstream=await(deps.fetcher?deps.fetcher(outbound):globalThis.fetch(outbound));
  upstreamStatus=upstream.status;
  if(!upstream.ok){
   let providerError:ReturnType<typeof providerErrorClass>|undefined;
   if(deps.config.diagnostics===true){providerError=providerErrorClass(null);try{providerError=providerErrorClass(JSON.parse(await boundedText(upstream.body,8192)));}catch{}}
   else{try{await upstream.body?.cancel();}catch{}}
   return failure('provider_http','The API could not complete this request. Offline guidance remains available.',undefined,providerError);
  }
  stage='response_read';const text=await boundedText(upstream.body,32768);
  stage='response_parse';const data:unknown=JSON.parse(text);
  const pattern=validateProviderResponse(data,body.answers);
  if(!pattern)return failure('schema_rejected','The response was refused, unsupported, or did not match the reported answers. Using offline guidance.',responseShape(data));
  stage='ledger_complete';await deps.store!.complete(id);return reply(200,{pattern,provider:'OpenAI Decisions API'});
 }catch(error){
  const category=stage==='ledger_complete'?'ledger_complete':signal.aborted?'timeout':stage==='response_read'&&error instanceof Error&&error.message==='size'?'response_too_large':stage==='response_parse'?'invalid_json':stage;
  return failure(category,'The API request timed out or could not be verified. Using offline guidance.');
 }
}
