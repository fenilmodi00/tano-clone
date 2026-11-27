import { chromium } from 'playwright';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1568,height:829}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});
const stages=[];
for(let i=0;i<8;i++){stages.push(await p.evaluate(()=>({t:performance.now()|0,stage:document.querySelector('.wire-nav-bar')?.getAttribute('data-stage'),vis:getComputedStyle(document.querySelector('.wire-nav-bar')).visibility,op:getComputedStyle(document.querySelector('.wire-nav-bar')).opacity,rv:document.querySelectorAll('.rv-in').length})));await p.waitForTimeout(150);}
console.log('nav',stages);
await p.evaluate(()=>scrollTo(0,1745));await p.waitForTimeout(1200);
console.log('scroll1',await p.evaluate(()=>({rv:document.querySelectorAll('.rv-in').length,theme:document.documentElement.dataset.groundTone,hero:document.querySelector('.hp-camp')?.getAttribute('data-inview'),video:(()=>{const v=document.querySelector('.hp-camp-post video');return v&&{paused:v.paused,t:v.currentTime}})()})));
await p.evaluate(()=>scrollTo(0,4800));await p.waitForTimeout(1200);
console.log('scroll2',await p.evaluate(()=>({rv:document.querySelectorAll('.rv-in').length,theme:document.documentElement.dataset.groundTone,cover:[...document.querySelectorAll('.wire-case-slot')].map(e=>e.style.getPropertyValue('--cover')),marks:document.querySelector('.wire-cases-marks-run')?.getAttribute('style')})));
console.log('errs',errs.slice(0,5));await b.close();
