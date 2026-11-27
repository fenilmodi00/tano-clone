import { chromium } from 'playwright';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1568,height:709}});
// home cursor reference
await p.goto('https://www.tano.ai/',{waitUntil:'networkidle'});await p.evaluate(()=>scrollTo(0,1760));await p.waitForTimeout(800);
const cursor=[];
for(let i=0;i<12;i++){cursor.push(await p.evaluate(()=>{const c=document.querySelector('.hp-pp-cursor');if(!c)return null;const r=c.getBoundingClientRect();const t=document.elementFromPoint(r.x+8,r.y+8);return {op:getComputedStyle(c).opacity,tr:getComputedStyle(c).transform,rect:[Math.round(r.x),Math.round(r.y)],target:(t?.getAttribute('data-cursor')||t?.className||'').toString().slice(0,30)}}));await p.waitForTimeout(500);}
console.log('CURSOR',JSON.stringify(cursor));
// use-case process reference
await p.goto('https://www.tano.ai/use-cases/drive-revenue',{waitUntil:'networkidle'});await p.evaluate(()=>scrollTo(0,1496));await p.waitForTimeout(800);
const scenes=[];
for(let i=0;i<8;i++){scenes.push(await p.evaluate(()=>{const s=document.querySelector('.hp-pp-scene');return s?{scene:s.dataset.scene,running:s.dataset.running,op:getComputedStyle(s).opacity,children:[...s.querySelectorAll('.hp-pp-window,.hp-pp-chip,.hp-pp-score')].slice(0,4).map(e=>({cls:String(e.className).slice(0,30),op:getComputedStyle(e).opacity,tr:getComputedStyle(e).transform}))}:null}));await p.waitForTimeout(500);}
console.log('SCENES',JSON.stringify(scenes));
await b.close();
