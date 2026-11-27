import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const routes=JSON.parse(await fs.readFile('docs/research/tano/routes.json','utf8')).map(r=>r.route);
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1568,height:900}});
const links=new Set();
for(const r of routes){
 await p.goto('http://127.0.0.1:3000'+r,{waitUntil:'domcontentloaded'}).catch(()=>{});
 for(const h of await p.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')))) if(h?.startsWith('/')) links.add(h.split('#')[0]);
}
const bad=[];
for(const h of [...links].sort()){
 if(!h||h==='/') continue;
 const res=await p.request.get('http://127.0.0.1:3000'+h).catch(()=>null);
 if(!res||res.status()>=400) bad.push([h,res?.status()]);
}
console.log('internal links',links.size,'bad',bad.length); for(const x of bad) console.log(x.join(' '));
await fs.writeFile('docs/verify/links.json',JSON.stringify(bad,null,2));
await b.close();
