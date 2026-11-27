import { chromium } from 'playwright';
import { PNG } from 'pngjs';import pixelmatch from 'pixelmatch';import fs from 'node:fs';
const b=await chromium.launch();
async function shot(base,route,y,out){const p=await b.newPage({viewport:{width:1568,height:709}});await p.goto(base+route,{waitUntil:'networkidle'});await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(1600);const d=await p.screenshot();fs.writeFileSync(out,d);const s=await p.evaluate(()=>({url:location.pathname,h1:getComputedStyle(document.querySelector('main h1,main h2')).opacity,cursor:(()=>{const c=document.querySelector('.hp-pp-cursor');return c&&{op:getComputedStyle(c).opacity,tr:getComputedStyle(c).transform}})(),running:document.querySelector('.hp-pp-scene')?.dataset.running,rv:document.querySelectorAll('.rv-in').length,nav:getComputedStyle(document.querySelector('.wire-nav-bar')).visibility}));await p.close();return {buf:d,state:s};}
for(const [route,y,label] of [['/',1760,'home-steps'],['/use-cases/drive-revenue',1496,'drive-process']]){
 const src=await shot('https://www.tano.ai',route,y,`/tmp/${label}-src.png`);
 const loc=await shot('http://127.0.0.1:3000',route,y,`/tmp/${label}-loc.png`);
 const A=PNG.sync.read(src.buf),B=PNG.sync.read(loc.buf);const w=Math.min(A.width,B.width),h=Math.min(A.height,B.height);const a=new PNG({width:w,height:h}),c=new PNG({width:w,height:h});for(let yy=0;yy<h;yy++){A.data.copy(a.data,yy*w*4,yy*A.width*4,yy*A.width*4+w*4);B.data.copy(c.data,yy*w*4,yy*B.width*4,yy*B.width*4+w*4)}const out=new PNG({width:w,height:h});const diff=pixelmatch(a.data,c.data,out.data,w,h,{threshold:.12,includeAA:false});fs.writeFileSync(`docs/verify/${label}-diff.png`,PNG.sync.write(out));console.log(label,'diff',(100*diff/(w*h)).toFixed(2)+'%','src',src.state,'loc',loc.state);
}
await b.close();
