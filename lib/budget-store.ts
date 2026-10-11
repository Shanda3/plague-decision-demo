import {MONTHLY_CEILING_CENTS,RESERVATION_CENTS,MODEL} from './decision-service.ts';
import type {BudgetStore} from './decision-service.ts';
/** Existing table/old fictional reservations stay intact. New rows carry no answers or results. */
export const RESERVE_SQL=`INSERT INTO decision_ledger (id, month, preset, reserved_cents, status, model)
SELECT ?1, ?2, ?3, ?4, 'reserved', ?5
WHERE COALESCE((SELECT SUM(reserved_cents) FROM decision_ledger WHERE month = ?2), 0) + ?4 <= ?6
ON CONFLICT(id) DO NOTHING RETURNING id`;
export function d1BudgetStore(db:D1Database):BudgetStore{return {
 async reserve(id,month){const row=await db.prepare(RESERVE_SQL).bind(id,month,'interactive_quiz_v1',RESERVATION_CENTS,MODEL,MONTHLY_CEILING_CENTS).first<{id:string}>();return row?.id===id;},
 async complete(id){const result=await db.prepare("UPDATE decision_ledger SET status='complete' WHERE id=? AND status='reserved'").bind(id).run();if(!result.success||result.meta.changes!==1)throw Error('Reservation status unavailable');},
};}
