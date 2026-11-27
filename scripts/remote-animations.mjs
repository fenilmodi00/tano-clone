import { chromium } from 'playwright';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1568,height:900}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120))});
await p.goto('https://dev.kaplun.tech/',{waitUntil:'networkidle'});await p.waitForTimeout(1800);
console.log('nav',await p.evaluate(()=>({vis:getComputedStyle(document.querySelector('.wire-nav-bar')).visibility,stage:document.querySelector('.wire-nav-bar').dataset.stage,lenis:document.documentElement.classList.contains('lenis')})));
await p.evaluate(()=>scrollTo(0,1396));await p.waitForTimeout(800);const m1=await p.evaluate(()=>document.querySelector('.wire-cases-marks-run')?.getAttribute('style'));await p.waitForTimeout(900);const m2=await p.evaluate(()=>document.querySelector('.wire-cases-marks-run')?.getAttribute('style'));console.log('marquee',m1,m2);
await p.evaluate(()=>scrollTo(0,4800));await p.waitForTimeout(1200);console.log('theme',await p.evaluate(()=>({tone:document.documentElement.dataset.groundTone,rv:document.querySelectorAll('.rv-in').length,cover:[...document.querySelectorAll('.wire-case-slot')].map(e=>e.style.getPropertyValue('--cover'))})));
await p.evaluate(()=>scrollTo(0,1760));await p.waitForTimeout(1000);console.log('cursor',await p.evaluate(()=>{const c=document.querySelector('.hp-pp-cursor');return c&&{op:getComputedStyle(c).opacity,tr:getComputedStyle(c).transform}}));
console.log('errs',errs.slice(0,4));await b.close();
