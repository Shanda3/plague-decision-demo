import {PATTERNS} from './quiz.ts';
import type {PatternId} from './quiz.ts';

/** Presentation only: accepts the already validated pattern without classifying answers. */
export function resultPresentation(pattern:PatternId|null){
 if(pattern===null)return null;
 return {title:pattern==='fever_swelling'?'Your answers resemble a bubonic plague symptom pattern':PATTERNS[pattern].title,splotches:pattern==='fever_swelling'};
}
