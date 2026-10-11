export type YesNo = 'yes' | 'no' | 'unsure';
export type QuizAnswers = { emergency: YesNo; fever: YesNo; nodes: YesNo; symptoms: ('cough'|'systemic'|'stomach'|'none'|'unsure')[]; exposure: ('flea'|'animal'|'contact'|'none'|'unsure')[]; activity: YesNo; onset: 'today'|'week'|'older'|'none'|'unsure' };
export type PartialAnswers = Partial<QuizAnswers>;
export const QUESTIONS = [
 {id:'emergency',title:'Any severe signs right now?',detail:'Trouble breathing, new confusion, severe chest pain, coughing blood, collapse, or rapidly worsening severe illness.',aside:'First, the serious bit.',options:[['yes','Yes'],['no','No'],['unsure','Not sure']],multi:false},
 {id:'fever',title:'Recently developed fever or chills?',detail:'Choose what you have noticed. No thermometer reading needed.',aside:'The thermostat has declined to comment.',options:[['yes','Yes'],['no','No'],['unsure','Not sure']],multi:false},
 {id:'nodes',title:'A new, painful swollen lump?',detail:'For example, in your neck, armpit, or groin.',aside:'A suspicious lump deserves a real question.',options:[['yes','Yes'],['no','No'],['unsure','Not sure']],multi:false},
 {id:'symptoms',title:'Any of these new symptoms?',detail:'Select all that apply. “None” and “Not sure” are exclusive.',aside:'Consulting literature newer than 1348.',options:[['cough','Cough'],['systemic','Weakness, headache or body aches'],['stomach','Abdominal pain, vomiting or diarrhea'],['none','None'],['unsure','Not sure']],multi:true},
 {id:'exposure',title:'Any possible exposure?',detail:'Recent flea bites; contact with sick/dead animals; or close contact with a person or animal suspected to have plague.',aside:'The fleas have declined to comment.',options:[['flea','Flea bites'],['animal','Sick or dead animal contact'],['contact','Known or suspected plague contact'],['none','None known'],['unsure','Not sure']],multi:true},
 {id:'activity',title:'Time in a place with reported plague activity?',detail:'Recently lived there or visited. No location details collected.',aside:'No need to disclose your secret base.',options:[['yes','Yes'],['no','No'],['unsure','Not sure']],multi:false},
 {id:'onset',title:'When did symptoms begin?',detail:'Timing adds context. It never rules out illness or reduces care guidance.',aside:'The horse is warming up.',options:[['today','Today'],['week','In the past week'],['older','More than a week ago'],['none','No symptoms'],['unsure','Not sure']],multi:false},
] as const;
const yesNo = (x:unknown):x is YesNo => typeof x==='string'&&['yes','no','unsure'].includes(x);
function setValid(value:unknown, allowed:readonly string[]) { return Array.isArray(value)&&value.length>0&&value.length<=allowed.length&&value.every(x=>typeof x==='string'&&allowed.includes(x))&&new Set(value).size===value.length&&(!value.includes('none')&&!value.includes('unsure')||value.length===1); }
export function validAnswers(value:unknown):value is QuizAnswers {
 if (!value || typeof value!=='object'||Array.isArray(value)) return false;
 const a=value as Record<string,unknown>;
 return Object.keys(a).length===7&&yesNo(a.emergency)&&yesNo(a.fever)&&yesNo(a.nodes)&&yesNo(a.activity)&&setValid(a.symptoms,['cough','systemic','stomach','none','unsure'])&&setValid(a.exposure,['flea','animal','contact','none','unsure'])&&typeof a.onset==='string'&&['today','week','older','none','unsure'].includes(a.onset);
}
export const hasSymptoms=(a:PartialAnswers)=>a.emergency==='yes'||a.fever==='yes'||a.nodes==='yes'||!!a.symptoms?.some(x=>!['none','unsure'].includes(x));
export const hasExposure=(a:PartialAnswers)=>a.activity==='yes'||!!a.exposure?.some(x=>!['none','unsure'].includes(x));
export function inconsistent(a:PartialAnswers) {return a.onset==='none'&&hasSymptoms(a)||['today','week','older'].includes(a.onset??'')&&a.emergency==='no'&&a.fever==='no'&&a.nodes==='no'&&a.symptoms?.[0]==='none';}
export function uncertain(a:PartialAnswers) {return !validAnswers(a)||Object.values(a).some(v=>v==='unsure'||Array.isArray(v)&&v.includes('unsure'))||inconsistent(a);}
export function localAction(a:PartialAnswers) {
 if(a.emergency==='yes')return {level:'emergency',title:'Get emergency medical help now.',body:'Call your local emergency number. These signs can signal a serious illness, whatever the cause. Do not wait for this quiz or an AI result.'};
 if(a.emergency==='unsure')return {level:'uncertain',title:'Do not wait if severe signs may be present.',body:'If any of these signs are happening, seek emergency help now. If you cannot tell, contact urgent medical help rather than relying on this quiz.'};
 if(hasSymptoms(a))return {level:'urgent',title:hasExposure(a)?'Seek immediate medical attention.':'Seek prompt medical attention.',body:'This quiz cannot determine the cause or rule out serious illness. Tell a clinician about your symptoms and any possible exposure. If severe signs develop, get emergency help immediately.'};
 if(hasExposure(a))return {level:'urgent',title:'Contact a clinician or public health service promptly.',body:'Do this even if you feel well. They can assess the possible exposure and whether follow-up care is needed.'};
 if(uncertain(a))return {level:'uncertain',title:'These answers are incomplete or uncertain.',body:'This quiz cannot rule out illness or exposure. If exposure is possible, contact a clinician or public health service promptly.'};
 return {level:'information',title:'No symptoms or known exposure reported.',body:'This is not a medical clearance. Seek care if symptoms develop or you are concerned about an exposure.'};
}
export const PATTERNS = {
 fever_swelling:{title:'Fever and painful swelling reported',explanation:'Those answers describe a symptom pattern that deserves prompt clinical assessment. Many conditions can cause it; this is not a diagnosis of bubonic plague.',url:'https://www.cdc.gov/plague/signs-symptoms/index.html',scene:'bubonic'},
 respiratory:{title:'Respiratory symptom reported',explanation:'You reported a cough. Many illnesses can cause respiratory symptoms; this does not identify pneumonic plague. Severe breathing symptoms need immediate help.',url:'https://www.cdc.gov/plague/signs-symptoms/index.html',scene:'pneumonic'},
 other_symptoms:{title:'Other acute symptoms reported',explanation:'The answers describe symptoms with many possible causes. A questionnaire cannot establish the cause; seek professional assessment.',url:'https://www.cdc.gov/plague/diagnosis-testing/index.html',scene:'neutral'},
 exposure_only:{title:'Possible exposure without reported symptoms',explanation:'A possible exposure can need professional advice even when you feel well. A clinician or public health service can assess it.',url:'https://www.who.int/news-room/fact-sheets/detail/plague',scene:'neutral'},
 uncertain:{title:'Information uncertain',explanation:'Some answers are missing, uncertain, or inconsistent. This cannot rule out illness or exposure. Clinical assessment and testing, when needed, establish a diagnosis.',url:'https://www.cdc.gov/plague/diagnosis-testing/index.html',scene:'neutral'},
 no_reported:{title:'No symptoms or known exposure reported',explanation:'That describes only the answers provided. It is not a medical clearance or proof that nothing is wrong. Seek care if symptoms develop or concerns remain.',url:'https://www.cdc.gov/plague/about/index.html',scene:'neutral'},
} as const;
export type PatternId=keyof typeof PATTERNS;
export const isPattern=(x:unknown):x is PatternId=>typeof x==='string'&&Object.hasOwn(PATTERNS,x);
/** Meaning-based output allowlist prevents the model claiming a pattern absent from answers. */
export function eligiblePatterns(a:QuizAnswers):PatternId[]{
 if(inconsistent(a))return ['uncertain'];
 const out:PatternId[]=[];
 if(a.fever==='yes'&&a.nodes==='yes')out.push('fever_swelling');
 if(a.symptoms.includes('cough'))out.push('respiratory');
 if(hasSymptoms(a)&&!out.length)out.push('other_symptoms');
 if(!hasSymptoms(a)&&a.emergency==='no'&&a.fever==='no'&&a.nodes==='no'&&a.symptoms[0]==='none'&&hasExposure(a))out.push('exposure_only');
 if(uncertain(a))out.push('uncertain');
 if(!out.length)out.push('no_reported');
 return out;
}
export const offlinePattern=(a:QuizAnswers)=>eligiblePatterns(a)[0];
export function summarizeAnswers(a:QuizAnswers){return QUESTIONS.map(q=>{const raw=a[q.id];const values:string[]=Array.isArray(raw)?raw:[raw];return {question:q.title,answer:values.map(v=>q.options.find(o=>o[0]===v)?.[1]??v).join(', ')};});}
