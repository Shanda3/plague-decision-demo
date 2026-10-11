import fs from 'node:fs';
const config=JSON.parse(fs.readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
if(config.d1_databases?.some(x=>x.database_id==='00000000-0000-4000-8000-000000000000'))throw Error('Deployment blocked: replace the placeholder with your verified D1 database ID.');
if(config.preview_urls!==false)throw Error('Preview URLs must remain disabled.');
if(config.workers_dev===true&&process.env.PUBLIC_RELEASE_APPROVED!=='true')throw Error('Public deployment requires explicit release authorization.');
if(config.vars?.DECISIONS_DIAGNOSTICS==='true')throw Error('Production diagnostics must remain disabled.');
console.log('Deploy configuration checked. No secret values read. This check does not grant deployment authorization.');
