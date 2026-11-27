import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
for(const base of ['https://www.tano.ai','http://127.0.0.1:3000']){
 await p.goto(base+'/talk-to-us',{waitUntil:'networkidle'}); await p.waitForTimeout(1000);
 console.log(base,await p.evaluate(()=>{const a=document.querySelector('.wire-contact-art'),s=document.querySelector('.wire-contact-sheet');const ar=a.getBoundingClientRect(),sr=s.getBoundingClientRect();const cs=getComputedStyle(a);return {art:[ar.x,ar.y,ar.width,ar.height],sheet:[sr.x,sr.y,sr.width,sr.height],artBg:cs.backgroundImage.slice(0,160),artPos:cs.backgroundPosition,artSize:cs.backgroundSize,body:document.body.scrollHeight}}));
}
await b.close();
