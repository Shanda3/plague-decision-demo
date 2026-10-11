import type {PartialAnswers} from './quiz.ts';

/** Decorative cartoon expression, not a medical severity/risk calculation.
 * Derived afresh from current selections; never stored or sent to a provider. */
export function bureauExpression(answers:PartialAnswers):0|1|2|3 {
 const affirmative=[answers.emergency,answers.fever,answers.nodes].filter(value=>value==='yes').length;
 const selected=new Set(answers.symptoms?.filter(value=>['cough','systemic','stomach'].includes(value))??[]).size;
 return Math.min(3,affirmative+selected) as 0|1|2|3;
}
