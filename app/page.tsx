"use client";
import {useEffect,useRef,useState} from 'react';
import {QUESTIONS,PATTERNS,validAnswers,localAction,offlinePattern,eligiblePatterns,isPattern,summarizeAnswers} from '../lib/quiz';
import type {QuizAnswers,PartialAnswers,PatternId} from '../lib/quiz';
import {FictionalChase} from '../components/fictional-chase';
import {resultPresentation} from '../lib/result-presentation';
import {BureauEnding} from '../components/bureau-ending';
import {JourneyTrack} from '../components/journey-track';
import {WarningPutin} from '../components/warning-putin';
import {IntroMascot} from '../components/intro-mascot';
function Arrow(){return <span aria-hidden="true">→</span>;}
type Result={answers:QuizAnswers;pattern:PatternId;live:boolean;note:string};
export default function Home(){
 const [started,setStarted]=useState(false);
 const quizRef=useRef<HTMLElement>(null);
 useEffect(()=>{if(started)quizRef.current?.focus();},[started]);
 const [motion,setMotion]=useState(true),[step,setStep]=useState(0),[answers,setAnswers]=useState<PartialAnswers>({}),[consent,setConsent]=useState(false),[available,setAvailable]=useState(false),[checkedStatus,setCheckedStatus]=useState(false),[busy,setBusy]=useState(false),[result,setResult]=useState<Result|null>(null);
 useEffect(()=>{let active=true;fetch('/api/decision',{method:'GET'}).then(r=>r.json()).then((raw:unknown)=>{if(active)setAvailable(!!raw&&typeof raw==='object'&&'available' in raw&&raw.available===true);}).catch(()=>{}).finally(()=>{if(active)setCheckedStatus(true);});return()=>{active=false;};},[]);
 const question=QUESTIONS[Math.min(step,6)];
 const action=localAction(answers);
 const severe=answers.emergency==='yes'||answers.emergency==='unsure';
 const current=answers[question.id];
 const currentDone=Array.isArray(current)?current.length>0:!!current;
 function choose(value:string){setResult(null);setConsent(false);setAnswers(previous=>{
   if(!question.multi)return {...previous,[question.id]:value};
   const old=Array.isArray(previous[question.id])?previous[question.id] as string[]:[];
   const values=['none','unsure'].includes(value)?[value]:old.includes(value)?old.filter(v=>v!==value):[...old.filter(v=>!['none','unsure'].includes(v)),value];
   return {...previous,[question.id]:values};
 });}
 function back(){setConsent(false);setResult(null);setStep(s=>Math.max(0,s-1));}
 function restart(){setAnswers({});setConsent(false);setResult(null);setStep(0);setStarted(false);}
 async function submit(){
   if(!validAnswers(answers)||busy)return;
   const snapshot:QuizAnswers=structuredClone(answers),pattern=offlinePattern(snapshot);
   setResult({answers:snapshot,pattern,live:false,note:!consent?'No answers sent.':available?'AI request in progress; local rules are shown meanwhile.':'Live API not connected. No answers sent.'});
   if(!consent||!available)return;
   setBusy(true);
   try{
    const response=await fetch('/api/decision',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({schemaVersion:1,consent:true,answers:snapshot})});
    const raw:unknown=await response.json();
    const data=raw&&typeof raw==='object'?raw as Record<string,unknown>:{};
    if(!response.ok||!isPattern(data.pattern)||!eligiblePatterns(snapshot).includes(data.pattern))throw Error(typeof data.message==='string'?data.message:'The API response could not be verified.');
    setResult({answers:snapshot,pattern:data.pattern,live:true,note:'The API selected this educational pattern. The explanation below is authored and source-linked.'});
   }catch(error){setResult({answers:snapshot,pattern,live:false,note:error instanceof Error?error.message:'Live API unavailable. Using offline rules.'});}
   finally{setBusy(false);setConsent(false);}
 }
 const pattern=result?PATTERNS[result.pattern]:null;
 const presentation=resultPresentation(result?.pattern??null);
 return <div data-motion={motion?'on':'off'}><a className="skip-link" href="#main">Skip to content</a><header><a href="#" className="wordmark"><span className="brand-icon" aria-hidden="true">✦</span>PLAGUE BUREAU</a><span className="header-stamp">HIGHLY UNOFFICIAL</span><button className="motion-toggle" aria-pressed={!motion} onClick={()=>setMotion(!motion)}>{motion?'Pause motion':'Resume motion'}</button></header><main id="main">{!started&&<><section className="play-intro with-mascot"><div className="intro-copy"><span className="eyebrow">Symptom-style quiz. Deeply unserious bureaucracy.</span><h1>THE BUREAU<br/><em>HAS QUESTIONS.</em></h1><p>Seven short questions. One excessive response team.</p><p className="entertainment-note">Parody + educational patterns. Not a diagnosis or medical advice.</p></div><IntroMascot/></section><FictionalChase scene="bubonic" opening/><div className="start-quiz"><button className="primary start-button" onClick={()=>setStarted(true)}>Start the quiz <Arrow/></button></div></>}
 {started&&<><div className="quiz-stage-heading"><h1>The Bureau has questions.</h1><button className="text-button" disabled={busy} onClick={restart} title="Return to the opening screen and clear answers">← Back to opening</button></div><section ref={quizRef} tabIndex={-1} className="quiz-panel" aria-label="Interactive educational symptom quiz"><div className="quiz-top"><span className="pill">{result?'Result':step===7?'Review':`QUESTION ${step+1} / 7`}</span><span className="connection-status">OpenAI Decisions API · {checkedStatus?(available?'Available with consent':'Not connected'):'Checking connection'}</span></div>
 {(severe||action.level==='urgent')&&<div className={`result ${action.level} immediate-action`} role="alert"><div className="warning-copy"><h3>{action.title}</h3><p>{action.body}</p></div><WarningPutin answers={answers} quizStep={step}/></div>}
 {!result&&<JourneyTrack step={step}/>}
 {!result&&step<7&&<><div className="progress-track" aria-hidden="true"><span style={{width:`${(step+1)/7*100}%`}}/></div><p className="quiz-aside">{severe?'Your care guidance takes priority.':question.aside}</p><h2 className="question-title">{question.title}</h2><p className="question-detail">{question.detail}</p><div className="quiz-options" role="group" aria-label={question.title}>{question.options.map(([value,label])=><button key={value} className={(Array.isArray(current)?current.includes(value as never):current===value)?'quiz-choice selected':'quiz-choice'} aria-pressed={Array.isArray(current)?current.includes(value as never):current===value} onClick={()=>choose(value)}>{label}<span aria-hidden="true">{(Array.isArray(current)?current.includes(value as never):current===value)?'●':'○'}</span></button>)}</div><div className="quiz-nav"><button className="text-button" disabled={step===0} onClick={back}>← Back</button><button className="primary" disabled={!currentDone} onClick={()=>{setConsent(false);setStep(s=>s+1);}}>Next <Arrow/></button></div></>}
 {!result&&step===7&&validAnswers(answers)&&<div className="quiz-review"><h2>Ready for the Bureau?</h2><p>Your answers stay on this device unless you choose the optional AI step.</p><details open><summary>Review exactly what would be sent</summary><ul>{summarizeAnswers(answers).map(row=><li key={row.question}><strong>{row.question}</strong><span>{row.answer}</span></li>)}</ul></details><label className="consent-choice"><input type="checkbox" checked={consent} disabled={!available} onChange={e=>setConsent(e.target.checked)}/><span>I agree to send my selected symptom, exposure, and timing answers to this app’s server and OpenAI to choose an educational pattern, not a diagnosis. These may be health information. I can continue locally without AI.</span></label><p className="small">{!available?'Live AI is not connected. This run stays entirely on your device.':'No names, free text, or precise locations are collected.'} <a href="https://developers.openai.com/api/docs/guides/your-data" target="_blank" rel="noreferrer">OpenAI data policy ↗</a></p><div className="quiz-nav"><button className="text-button" onClick={back}>← Edit answers</button><button className="primary" onClick={submit}>{consent&&available?'Analyze with OpenAI':'See my result locally'} <Arrow/></button></div></div>}
 {result&&pattern&&<div className="quiz-result"><div className="provider-badge">{result.live?'Live OpenAI Decisions API':'Offline rules preview'}</div>{busy&&<p role="status">{severe?'Waiting for an optional educational pattern. Do not delay medical help.':'Consulting literature newer than 1348…'}</p>}<div className={`result ${localAction(result.answers).level}`}><span className="eyebrow">What to do now · Local safety rules</span><h3>{localAction(result.answers).title}</h3><p>{localAction(result.answers).body}</p></div><div className={`pattern-result${presentation?.splotches?' has-splotches':''}`} role="status">{presentation?.splotches&&<span className="pattern-splotches" aria-hidden="true"><i/><i/><i/><i/><i/></span>}<span className="eyebrow">What your answers describe · Not a diagnosis</span><h2>{presentation?.title}</h2>{presentation?.splotches&&<p className="diagnosis-note">This isn’t a diagnosis.</p>}<p>{pattern.explanation}</p><a href={pattern.url} target="_blank" rel="noreferrer">Read the source ↗</a></div><BureauEnding key={result.pattern} pattern={result.pattern}/><details><summary>How this decision was made</summary><p>{result.note}</p><p>{result.live?'Model: gpt-6-luna. Typed choice: ': 'Local rule-selected pattern: '}{result.pattern}. Care guidance is always computed locally; AI cannot change it. Clinical assessment and testing, when needed, are required for diagnosis.</p><ul>{summarizeAnswers(result.answers).map(row=><li key={row.question}><strong>{row.question}</strong> {row.answer}</li>)}</ul></details><button className="text-button restart" disabled={busy} onClick={restart}>Start again ↻</button></div>}
 </section></>}
 <div className="extras"><details><summary>What’s technical here?</summary><p className="privacy-copy">A typed OpenAI Decisions API call selects a supported symptom-pattern enum. The server checks it against your answers and shows only authored educational text. No diagnoses, probabilities, or model-written medical advice. If unavailable, local rules are labeled honestly. Live requests have a persistent $180/month app reservation ceiling, below the owner’s $200 limit.</p></details><details id="sources"><summary>Sources + limitations</summary><div className="compact-sources"><a href="https://www.cdc.gov/plague/signs-symptoms/index.html" target="_blank" rel="noreferrer">CDC: Signs & symptoms ↗</a><a href="https://www.cdc.gov/plague/diagnosis-testing/index.html" target="_blank" rel="noreferrer">CDC: Diagnosis ↗</a><a href="https://www.who.int/news-room/fact-sheets/detail/plague" target="_blank" rel="noreferrer">WHO: Plague ↗</a><a href="https://www.cdc.gov/sepsis/about/index.html" target="_blank" rel="noreferrer">CDC: Sepsis ↗</a><p>Our questions interpret public guidance; they are not a validated clinical questionnaire. Independent satire; no government or health-agency endorsement.</p></div></details><details><summary>Privacy</summary><p className="privacy-copy">Answers and results stay in browser memory and clear on restart or reload. Without consent, no answers leave the page. If you opt in and live AI is available, selected answers go to this app’s server and OpenAI. The app does not save or log answers/results; it stores only random request IDs and cost-reservation metadata. No analytics or free text. Hosting/API services may process technical metadata and retain data under their policies. Editing answers clears consent.</p></details></div>
 </main><footer><span>PLAGUE BUREAU · FICTIONAL RESPONSE TEAM</span><a href="#main">Back to the questions ↑</a></footer></div>;
}
