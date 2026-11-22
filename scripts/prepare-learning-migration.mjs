// Read-only verification and a proposed redirect manifest. Never deploys or edits vercel.json.
import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
const destination=new URL(process.argv[2]||'http://localhost:4322');
if(destination.protocol!=='https:' && !['localhost','127.0.0.1'].includes(destination.hostname))throw new Error('Use the verified HTTPS learning origin.');
const ids=(await readdir('learning/src/content/guides')).filter(x=>x.endsWith('.md')&&x!=='how-to-read.md').map(x=>x.slice(0,-3));
const originalGuides = new Set(await readdir('src/content/guides'));
const legacyIds = ids.filter(id => originalGuides.has(`${id}.md`));
const paths=['/',...ids.map(id=>`/guides/${id}/`),'/guides/how-to-read/','/guides/sections/quickstarts/'];
for(const path of paths){const res=await fetch(new URL(path,destination),{signal:AbortSignal.timeout(15000)});const html=await res.text();if(!res.ok||!html.includes('data-site-kind="learning"')||!html.includes('data-lang="zh"'))throw new Error(`Learning readiness check failed: ${path}`);}
const config=JSON.parse(await readFile('vercel.json','utf8'));
const redirects=[...config.redirects,{source:'/guides',destination:new URL('/',destination).href,permanent:false},{source:'/guides/',destination:new URL('/',destination).href,permanent:false},...legacyIds.flatMap(id=>['','/'].map(suffix=>({source:`/guides/${id}${suffix}`,destination:new URL(`/guides/${id}/`,destination).href,permanent:false}))),...['','/'].map(suffix=>({source:`/guides/sections/quickstarts${suffix}`,destination:new URL('/guides/sections/quickstarts/',destination).href,permanent:false}))];
await mkdir('artifacts',{recursive:true});await writeFile('artifacts/vercel-after-learning-verification.json',JSON.stringify({...config,redirects},null,2)+'\n');
console.log(`Verified ${paths.length} bilingual learning routes. Proposed manifest: artifacts/vercel-after-learning-verification.json. Main research reading guide retained. No source, Git or production changes made.`);
