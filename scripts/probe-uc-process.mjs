import { chromium } from 'playwright';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1568,height:709}});
for(const base of ['https://www.tano.ai','http://127.0.0.1:3000']){
 await p.goto(base+'/use-cases/drive-revenue',{waitUntil:'networkidle'});await p.evaluate(()=>scrollTo(0,1496));await p.waitForTimeout(1800);
 console.log(base,JSON.stringify(await p.evaluate(()=>{
  const s=document.querySelector('.hp-uc-process');
  const els=[...s.querySelectorAll('*')];
  const cls={};for(const e of els)for(const c of e.classList)cls[c]=(cls[c]||0)+1;
  const flow=s.querySelector('.hp-flow');const scene=s.querySelector('.hp-pp,.hp-steps');
  const cands=els.filter(e=>String(e.className).match(/flow|cursor|process|step|scene|uc-/)).slice(0,40).map(e=>({tag:e.tagName,cls:String(e.className).slice(0,60),op:getComputedStyle(e).opacity,tr:getComputedStyle(e).transform,rect:(()=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]})()}));
  return {htmlLen:s.innerHTML.length,classes:cls,cands};
 })));
}
await b.close();
