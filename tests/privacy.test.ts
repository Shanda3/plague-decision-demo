import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
test('consent/configuration gate precedes POST; no persistence or health analytics',()=>{const submit=page.slice(page.indexOf('async function submit'),page.indexOf('const pattern=result'));assert.ok(submit.indexOf('if(!consent||!available)return')<submit.indexOf("method:'POST'"));assert.match(page,/method:'GET'/);assert.doesNotMatch(page,/localStorage|sessionStorage|sendBeacon|console\.|gtag|analytics\(/);assert.match(page,/setAnswers\(\{\}\)/);});
test('consent identifies app server and OpenAI, edits invalidate consent',()=>{assert.match(page,/this app’s server and OpenAI/);assert.match(page,/These may be health information/);const choose=page.slice(page.indexOf('function choose'),page.indexOf('async function submit'));assert.match(choose,/setConsent\(false\)/);assert.match(page,/useState\(false\)/);});
test('frontend contains no key; persistence repository stores no health fields',()=>{assert.doesNotMatch(page,/OPENAI_API_KEY|Bearer |NEXT_PUBLIC_.*KEY/);const repo=readFileSync(new URL('../lib/budget-store.ts',import.meta.url),'utf8');assert.doesNotMatch(repo,/SET.*topic|SET.*input_tokens|JSON.stringify|answers\./);assert.match(repo,/interactive_quiz_v1/);});

test('positive symptoms/exposure show immediate guidance before submission; severe loading is neutral',()=>{assert.match(page,/severe\|\|action.level==='urgent'/);assert.match(page,/Do not delay medical help/);});
