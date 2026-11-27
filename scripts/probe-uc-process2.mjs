import { chromium } from 'playwright';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1568,height:709}});const snaps=[];
for(const base of ['https://www.tano.ai','http://127.0.0.1:3000']){
 await p.goto(base+'/use-cases/drive-revenue',{waitUntil:'networkidle'});await p.evaluate(()=>scrollTo(0,1496));await p.waitForTimeout(1800);
 snaps.push(await p.evaluate(()=>{const s=document.querySelector('.hp-uc-process');const cls={};for(const e of s.querySelectorAll('*'))for(const c of e.classList)cls[c]=(cls[c]||0)+1;const cur=s.querySelector('.hp-pp-cursor');const sc=s.querySelector('.hp-pp-scene');return {cls,cur:cur&&{op:getComputedStyle(cur).opacity,tr:getComputedStyle(cur).transform,src:cur.querySelector('img')?.getAttribute('src')},scene:sc&&{op:getComputedStyle(sc).opacity,data:[...sc.attributes].filter(a=>a.name.startsWith('data-')).map(a=>[a.name,a.value])},live:[...s.querySelectorAll('.hp-steps-seg-button')].map(b=>b.dataset.state)}}));
}
const [a,c]=snaps;const keys=new Set([...Object.keys(a.cls),...Object.keys(c.cls)]);for(const k of keys)if((a.cls[k]||0)!==(c.cls[k]||0))console.log('MISS',k,a.cls[k]||0,'->',c.cls[k]||0);
console.log('SRC cur',a.cur,'scene',a.scene,'live',a.live);console.log('LOC cur',c.cur,'scene',c.scene,'live',c.live);
await b.close();
