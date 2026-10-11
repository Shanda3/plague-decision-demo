import test from 'node:test';
import assert from 'node:assert/strict';
import {bureauExpression} from '../lib/bureau-expression.ts';
import type {PartialAnswers} from '../lib/quiz.ts';

test('all-negative, unanswered and uncertain answers keep the base expression',()=>{
 assert.equal(bureauExpression({}),0);
 assert.equal(bureauExpression({emergency:'no',fever:'no',nodes:'no',symptoms:['none']}),0);
 assert.equal(bureauExpression({emergency:'unsure',fever:'unsure',nodes:'unsure',symptoms:['unsure']}),0);
});
test('only affirmative symptom selections increase the bounded decorative expression',()=>{
 assert.equal(bureauExpression({exposure:['flea'],activity:'yes',onset:'today'}),0);
 assert.equal(bureauExpression({fever:'yes'}),1);
 assert.equal(bureauExpression({fever:'yes',nodes:'yes'}),2);
 assert.equal(bureauExpression({fever:'yes',nodes:'yes',symptoms:['cough','systemic']}),3);
});
test('backtracking, deselecting symptoms and reset recompute without retained escalation',()=>{
 let answers:PartialAnswers={fever:'yes',nodes:'yes',symptoms:['cough']};
 assert.equal(bureauExpression(answers),3);
 answers={...answers,nodes:'no'};assert.equal(bureauExpression(answers),2);
 answers={...answers,symptoms:['none']};assert.equal(bureauExpression(answers),1);
 answers={...answers,fever:'no'};assert.equal(bureauExpression(answers),0);
 answers={};assert.equal(bureauExpression(answers),0);
});
