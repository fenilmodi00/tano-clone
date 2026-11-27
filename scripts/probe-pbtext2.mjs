import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
const route='/playbooks/creator-discovery'; const arr=[];
for(const base of ['https://www.tano.ai','http://127.0.0.1:3000']){
 await p.goto(base+route,{waitUntil:'networkidle'}); await p.waitForTimeout(800);
 arr.push(await p.evaluate(()=>{const s=document.querySelectorAll('main>section,main>div')[1];return [...s.querySelectorAll('*')].map(e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return {tag:e.tagName,cls:String(e.className).slice(0,35),h:Math.round(r.height),w:Math.round(r.width),pad:c.padding,disp:c.display,text:e.childElementCount?undefined:e.textContent.trim().slice(0,25)}})}));
}
for(let i=0;i<Math.max(arr[0].length,arr[1].length);i++){const a=arr[0][i],c=arr[1][i];if(!a||!c||a.h!==c.h||a.w!==c.w)console.log(i,JSON.stringify(a),'||',JSON.stringify(c));}
await b.close();
