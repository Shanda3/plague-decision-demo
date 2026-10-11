import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PATTERNS} from '../lib/quiz.ts';
const scene=readFileSync(new URL('../components/fictional-chase.tsx',import.meta.url),'utf8');
test('only authored educational patterns map to parody art, uncertainty stays neutral',()=>{assert.equal(PATTERNS.fever_swelling.scene,'bubonic');assert.equal(PATTERNS.respiratory.scene,'pneumonic');assert.equal(PATTERNS.uncertain.scene,'neutral');assert.equal(PATTERNS.no_reported.scene,'neutral');});
test('art includes shirtless Putin on horse, original fictional crew, no actual health fields',()=>{assert.match(scene,/shirtless Vladimir Putin rides a galloping horse/);assert.match(scene,/PUTIN \(CARICATURE\)/);assert.match(scene,/FICTIONAL HAZMAT CREW/);assert.doesNotMatch(scene,/fetch\(|answers\.|OPENAI_API_KEY|paperwork/i);assert.match(scene,/Please step away from the window/);});
test('global/local pause, reduced motion, separate human and horse joints',()=>{const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');for(const joint of ['human-thigh','human-shin','human-ankle','human-arm','human-elbow','horse-hind','horse-hock','horse-front','horse-knee'])assert.ok(css.includes('@keyframes '+joint));assert.match(css,/\[data-motion=off\]/);assert.match(css,/\[data-scene-motion=off\]/);assert.match(css,/prefers-reduced-motion:reduce/);assert.doesNotMatch(css,/@keyframes parade/);});
test('one quiz flow keeps provider consent independent of decorative animations',()=>{const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');assert.doesNotMatch(page,/presetId|Run live AI|<select|paperwork/);assert.match(page,/!started&&/);assert.match(page,/<FictionalChase scene="bubonic" opening\/>/);assert.doesNotMatch(page,/FictionalChase scene=\{PATTERNS/);assert.match(page,/localAction\(answers\)/);assert.match(page,/Live OpenAI Decisions API/);assert.match(page,/Offline rules preview/);});

test('opening has immediate animation and Start; quiz unmounts it and reset returns home',()=>{const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');assert.match(page,/\[started,setStarted\]=useState\(false\)/);assert.ok(page.indexOf('<FictionalChase scene="bubonic" opening/>')<page.indexOf('Start the quiz'));assert.match(page,/onClick=\{\(\)=>setStarted\(true\)\}/);assert.match(page,/\{started&&/);assert.ok(page.includes('function restart(){setAnswers({});setConsent(false);setResult(null);setStep(0);setStarted(false);}'));assert.match(page,/quizRef.current\?\.focus\(\)/);});

test('original spy rat and red flag appear only in the opening branch',()=>{const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');assert.ok(page.indexOf('!started&&')<page.indexOf('<IntroMascot/>'));assert.ok(page.indexOf('<IntroMascot/>')<page.indexOf('{started&&'));const mascot=readFileSync(new URL('../components/intro-mascot.tsx',import.meta.url),'utf8');assert.match(mascot,/intro-spy-rat/);assert.match(mascot,/intro-flag/);});

test('rider is deliberately bald and muscular with coherent near and occluded far riding legs',()=>{assert.match(scene,/bald-scalp-highlight/);assert.doesNotMatch(scene,/#95856a/);for(const part of ['rider-muscular-torso','rider-near-arm','rider-seated-pelvis','rider-near-thigh','rider-near-calf','rider-near-boot','rider-occluded-far-leg'])assert.ok(scene.includes(part));});

test('mobile fits the complete scene without moving the SVG viewport',()=>{
 const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
 assert.ok(css.includes('.chase-artwork{min-width:0!important;width:100%!important;animation:none!important;transform:none!important}'));
 assert.ok(scene.includes('<g transform="translate(0 43)"><g className="human-foot">'));
});
