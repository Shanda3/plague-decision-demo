import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { RESERVE_SQL } from '../lib/budget-store.ts';
import { RESERVATION_CENTS, MONTHLY_CEILING_CENTS } from '../lib/decision-service.ts';
function database() {
  const db = new DatabaseSync(':memory:'); db.exec('CREATE TABLE decision_ledger (id TEXT PRIMARY KEY, month TEXT NOT NULL, preset TEXT NOT NULL, reserved_cents INTEGER NOT NULL, status TEXT NOT NULL, model TEXT NOT NULL, topic TEXT, input_tokens INTEGER)'); return db;
}
test('atomic SQL enforces the reservation cap and unique slot', () => {
  const db = database(); const reserve = db.prepare(RESERVE_SQL); let successes = 0;
  for (let index = 0; index < 500; index++) if (reserve.get(`2026-10:${index}`, '2026-10', 'curious_reader', RESERVATION_CENTS, 'gpt-6-luna', MONTHLY_CEILING_CENTS)) successes++;
  assert.equal(successes, 180); assert.deepEqual({ ...db.prepare('SELECT SUM(reserved_cents) AS total FROM decision_ledger').get() }, { total: 18_000 });
  assert.equal(reserve.get('2026-10:0', '2026-10', 'curious_reader', RESERVATION_CENTS, 'gpt-6-luna', MONTHLY_CEILING_CENTS), undefined);
  assert.ok(reserve.get('2026-11:0', '2026-11', 'curious_reader', RESERVATION_CENTS, 'gpt-6-luna', MONTHLY_CEILING_CENTS)); db.close();
});
test('prior fictional reservations count against new quiz requests', () => {
 const db=database();const reserve=db.prepare(RESERVE_SQL);
 for(let i=0;i<93;i++)reserve.get(`old-fictional:${i}`,'2026-10','curious_reader',100,'gpt-6-luna',18000);
 let accepted=0;for(let i=0;i<200;i++)if(reserve.get(`new-quiz:${i}`,'2026-10','interactive_quiz_v1',100,'gpt-6-luna',18000))accepted++;
 assert.equal(accepted,87);assert.equal(db.prepare('SELECT SUM(reserved_cents) AS total FROM decision_ledger').get()?.total,18000);db.close();
});
