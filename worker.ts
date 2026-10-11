import {handleDecision,decisionStatus} from './lib/decision-service.ts';
import {d1BudgetStore} from './lib/budget-store.ts';
export interface Env {ASSETS:Fetcher;DB?:D1Database;OPENAI_API_KEY?:string;DECISIONS_ENABLED?:string;DECISIONS_PRICING_REVIEWED_UNTIL?:string;DECISIONS_DIAGNOSTICS?:string;}
export default {
 async fetch(request:Request,env:Env):Promise<Response>{
  const url=new URL(request.url);
  if(url.pathname==='/api/decision'){
   const deps={config:{apiKey:env.OPENAI_API_KEY,enabled:env.DECISIONS_ENABLED,pricingReviewedUntil:env.DECISIONS_PRICING_REVIEWED_UNTIL,diagnostics:env.DECISIONS_DIAGNOSTICS==='true'},store:env.DB?d1BudgetStore(env.DB):undefined};
   if(request.method==='GET')return decisionStatus(deps);
   if(request.method==='POST')return handleDecision(request,deps);
   return Response.json({message:'Method not allowed'},{status:405,headers:{Allow:'GET, POST','Cache-Control':'no-store'}});
  }
  if(url.pathname.startsWith('/api/'))return Response.json({message:'Not found'},{status:404,headers:{'Cache-Control':'no-store'}});
  return env.ASSETS.fetch(request);
 }
} satisfies ExportedHandler<Env>;
