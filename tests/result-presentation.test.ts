import test from 'node:test';import assert from 'node:assert/strict';
import {resultPresentation} from '../lib/result-presentation.ts';import {PATTERNS} from '../lib/quiz.ts';import type {PatternId} from '../lib/quiz.ts';
test('only the validated swelling pattern receives the qualified headline and decoration',()=>{
 assert.deepEqual(resultPresentation('fever_swelling'),{title:'Your answers resemble a bubonic plague symptom pattern',splotches:true});
 for(const id of Object.keys(PATTERNS) as PatternId[])if(id!=='fever_swelling')assert.deepEqual(resultPresentation(id),{title:PATTERNS[id].title,splotches:false});
});
test('clearing the result removes its presentation without retaining splotches',()=>{
 assert.equal(resultPresentation('fever_swelling')?.splotches,true);assert.equal(resultPresentation(null),null);assert.equal(resultPresentation('uncertain')?.splotches,false);
});
