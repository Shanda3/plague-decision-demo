import type {PatternId} from './quiz.ts';
export type Ending='arrival'|'gate'|'rat';
/** Decoration for an already validated pattern; never interprets symptoms or care. */
export function endingFor(pattern:PatternId):Ending{return pattern==='fever_swelling'?'arrival':pattern==='respiratory'?'gate':'rat';}
export function journeyPosition(step:number){return Math.max(0,Math.min(7,Number.isFinite(step)?Math.floor(step):0));}
export const ENDINGS={
 arrival:{title:'The Bureau has arrived.',caption:'Nobody ordered the horse.',description:'Fictional hazmat crew arrives through stylized purple and green ink clouds. A cartoon scene, not a medical assessment.'},
 gate:{title:'The fog machine is working overtime.',caption:'An excessive amount of atmosphere.',description:'A fictional gate marked КАРАНТИН (Quarantine) slides into place as fog drifts past. A cartoon scene, not isolation or treatment advice.'},
 rat:{title:'The rat has the paperwork.',caption:'The crew would like a word.',description:'A spy rat steals the КАРАНТИН (Quarantine) warning sign while the fictional crew awkwardly retreats. This joke does not mean healthy or safe.'}
} as const;
