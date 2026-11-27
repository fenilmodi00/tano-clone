import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
for(const u of ['/playbooks/creator-discovery','/playbooks/content-analysis-framework']){
 console.log('##',u);
 for(const base of ['https://www.tano.ai','http://127.0.0.1:3000']){
  await p.goto(base+u,{waitUntil:'networkidle'}); await p.waitForTimeout(900);
  console.log(base,JSON.stringify(await p.evaluate(()=>({body:document.body.scrollHeight,secs:[...document.querySelectorAll('main>section,main>div')].map(e=>[e.className.slice(0,40),Math.round(e.getBoundingClientRect().height),getComputedStyle(e).padding])}))));
 }
}
await b.close();
