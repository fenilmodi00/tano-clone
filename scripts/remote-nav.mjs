import { chromium } from 'playwright';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1568,height:829}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120))});
await p.goto('https://dev.kaplun.tech/',{waitUntil:'networkidle'});await p.waitForTimeout(1800);
await p.click('.wire-nav-menu button');await p.waitForTimeout(250);await p.click('a[href="/use-cases/drive-revenue"]');await p.waitForTimeout(1800);
console.log('nav',await p.evaluate(()=>({url:location.pathname,nav:getComputedStyle(document.querySelector('.wire-nav-bar')).visibility,h1:getComputedStyle(document.querySelector('main h1')).opacity,rv:document.querySelectorAll('.rv-in').length,scene:document.querySelector('.hp-pp-scene')?.dataset.running})));
await p.evaluate(()=>scrollTo(0,1400));await p.waitForTimeout(1200);
console.log('scroll',await p.evaluate(()=>({rv:document.querySelectorAll('.rv-in').length,tone:document.documentElement.dataset.groundTone,scene:document.querySelector('.hp-pp-scene')?.dataset.running})));console.log('errs',errs.slice(0,4));await b.close();
