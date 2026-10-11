import {bureauExpression} from '../lib/bureau-expression';
import type {PartialAnswers} from '../lib/quiz';
import {PutinHead} from './fictional-chase';

/** Decorative satire only; safety guidance renders independently and immediately. */
export function WarningPutin({answers,quizStep=0}:{answers:PartialAnswers;quizStep?:number}){
 const expression=bureauExpression(answers);
 const gritting=expression>0&&quizStep>=5;
 const motionStage=quizStep>=5?'late':quizStep>=2?'mid':'early';
 return <span className="warning-putin" data-expression={expression} data-progress={motionStage} aria-hidden="true"><svg viewBox="0 0 140 170" focusable="false">
  <ellipse cx="72" cy="155" rx="54" ry="9" fill="#8a754b" opacity=".15"/>
  <g className="warning-putin-pop"><g key={`${expression}-${motionStage}`} className="warning-body-tremble">
   <path d="M29 147l5-51c3-15 18-20 32-20 17 0 35 7 38 22l7 49Z" fill="#dfad85" stroke="#765037" strokeWidth="2.5"/>
   <path d="M47 101q12 9 24 0m3 0q13 9 24-1M72 104v26M47 135l23 4 28-5" fill="none" stroke="#aa7652" strokeWidth="2"/>
   <path d="M29 146h82v10H28Z" fill="#43503b" stroke="#30382b" strokeWidth="2"/>
   <g transform="translate(35 7) scale(.66)"><PutinHead/>
    {expression>0&&<g className="warning-face-expression">
     <ellipse cx="39" cy="73" rx="12" ry="8" fill="#c54836" opacity={expression*.14}/><ellipse cx="80" cy="74" rx="11" ry="8" fill="#c54836" opacity={expression*.14}/>
     <path d={expression===1?'M32 46l21 3m14 0 18-2':expression===2?'M32 43l21 8m14 0 18-7':'M31 40l22 12m14 0 19-11'} fill="none" stroke="#73533e" strokeWidth="3.5" strokeLinecap="round"/>
     {gritting?<><path d="M40 79h42v17H40Z" fill="#d9a88a"/>
     <g className="warning-clenched-teeth">
      <path d={expression===1?'M45 83q16-4 33 0l-1 8q-16 3-31-1Z':'M42 81q19-5 39 0l-1 13q-18 4-37-1Z'} fill="#fff4d9" stroke="#754934" strokeWidth={expression===3?3:2.5}/>
      <path d="M46 87h31m-24-5v11m9-12v13m9-12v11" fill="none" stroke="#99715a" strokeWidth="1.4"/>
     </g></>:<path className="warning-frown" d={expression===1?'M47 88q15-5 29 0':'M44 91q17-12 34 0'} fill="none" stroke="#775544" strokeWidth="2.5" strokeLinecap="round"/>}
     {expression>=2&&<path d="m36 70-5 7m55-6 5 8M54 37l5 6 5-6" fill="none" stroke="#965d44" strokeWidth="2.5" strokeLinecap="round"/>}
    </g>}
   </g>
   {expression===3&&<g className="warning-steam" fill="none" stroke="#978775" strokeWidth="2.5" strokeLinecap="round"><path d="M27 47q-10-5-4-12t-3-11"/><path d="M105 43q10-5 4-12t3-11"/></g>}
   <path d="M37 98q-9 11-6 30l22 6" fill="none" stroke="#765037" strokeWidth="16" strokeLinecap="round"/>
   <path d="M37 98q-9 11-6 30l22 6" fill="none" stroke="#dfad85" strokeWidth="11" strokeLinecap="round"/>
   <g className="warning-resting-hand">
    <path d="M49 128l9-2 10 5q3 2 2 5l-2 4-14-1-6-4Z" fill="#e5b68f" stroke="#765037" strokeWidth="2" strokeLinejoin="round"/>
    <path d="m57 129 8 4m-10 0 10 4m-12 0 8 2" fill="none" stroke="#aa7652" strokeWidth="1.3" strokeLinecap="round"/>
   </g>
   <g transform="translate(98 105)"><g className="warning-finger-wag"><g transform="translate(-98 -105)">
    <path d="M98 105l14 17 8-28" fill="none" stroke="#765037" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M98 105l14 17 8-28" fill="none" stroke="#dfad85" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
    <g transform="translate(120 99)"><g className="warning-index-wag"><g className="warning-pointing-hand" transform="translate(-120 -99)">
     <path d="M114 99l-1-9q-6-4-4-8 2-4 6-1l2 2V55q0-5 4-5t4 5v19q4-2 6 2 4-1 5 4 4 2 1 8l-3 9q-2 5-8 5Z" fill="#e5b68f" stroke="#765037" strokeWidth="2" strokeLinejoin="round"/>
     <path d="M125 75v7q0 3 4 3h6m-6-9v5m-1 7h7m-9 5h7M111 82l10 7q4 2 6-2l-6-7" fill="none" stroke="#aa7652" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
     <path d="M119 58h4m-4 11h4" fill="none" stroke="#b58363" strokeWidth="1"/>
    </g></g></g>
   </g></g></g>
  </g></g>
 </svg></span>;
}
