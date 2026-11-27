import { chromium } from 'playwright';
const b=await chromium.launch();
async function full(url,out){const p=await b.newPage({viewport:{width:1568,height:709}});await p.goto(url,{waitUntil:'networkidle'});await p.evaluate(async()=>{const s=innerHeight*.8;for(let y=0;y<document.body.scrollHeight;y+=s){scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}scrollTo(0,0);await new Promise(r=>setTimeout(r,600))});await p.waitForTimeout(1000);await p.screenshot({path:out,fullPage:true});await p.close();}
for(const r of ['/use-cases/drive-revenue','/']){const slug=r==='/'?'home':'drive-revenue-source';await full('https://www.tano.ai'+r,`/tmp/src-${slug}.png`);const slug2=r==='/'?'home-local':'drive-revenue-local';await full('http://127.0.0.1:3000'+r,`/tmp/${slug2}.png`);}
await b.close();
