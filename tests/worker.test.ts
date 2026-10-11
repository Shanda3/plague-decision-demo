import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker.ts';
import type {Env} from '../worker.ts';
const env={ASSETS:{fetch:async()=>new Response('static site')}} as unknown as Env;
test('portable Worker reports disabled API without secrets or DB',async()=>{const r=await worker.fetch(new Request('https://example.test/api/decision'),env);assert.equal(r.status,200);assert.deepEqual(await r.json(),{available:false});});
test('portable Worker rejects disabled POST before any outbound call',async()=>{const r=await worker.fetch(new Request('https://example.test/api/decision',{method:'POST',body:'{}'}),env);assert.equal(r.status,503);});
test('portable Worker routes only API path and prevents SPA fallback for unknown API',async()=>{assert.equal((await worker.fetch(new Request('https://example.test/api/unknown'),env)).status,404);assert.equal(await(await worker.fetch(new Request('https://example.test/'),env)).text(),'static site');});
test('portable Worker rejects unhandled API methods',async()=>assert.equal((await worker.fetch(new Request('https://example.test/api/decision',{method:'DELETE'}),env)).status,405));
