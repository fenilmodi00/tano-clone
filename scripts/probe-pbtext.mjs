import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
const route='/playbooks/creator-discovery'; const texts=[]; const kids=[];
for(const base of ['https://www.tano.ai','http://127.0.0.1:3000']){
 await p.goto(base+route,{waitUntil:'networkidle'}); await p.waitForTimeout(800);
 texts.push(await p.evaluate(()=>document.querySelectorAll('main>section,main>div')[1].innerText));
 kids.push(await p.evaluate(()=>{const s=document.querySelectorAll('main>section,main>div')[1];return [...s.querySelectorAll('*')].map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,cls:String(e.className).slice(0,40),h:Math.round(r.height),w:Math.round(r.width),text:e.textContent.trim().slice(0,30)}}).slice(0,30)}));
}
console.log('TEXT src',texts[0].slice(0,600));console.log('TEXT loc',texts[1].slice(0,600));
console.log('KIDS src',kids[0]);console.log('KIDS loc',kids[1]);
await b.close();
