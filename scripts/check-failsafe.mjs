import { chromium } from 'playwright';
const b=await chromium.launch();
// normal hydration: no mismatch mutations
let ctx=await b.newContext({viewport:{width:1568,height:829}});let p=await ctx.newPage();const errs=[];p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});await p.waitForTimeout(2500);
console.log('normal',await p.evaluate(()=>({nav:getComputedStyle(document.querySelector('.wire-nav-bar')).visibility,stage:document.querySelector('.wire-nav-bar').dataset.stage,rv:document.querySelectorAll('.rv-in').length})),'errs',errs.slice(0,2));await ctx.close();
// block chunks
ctx=await b.newContext({viewport:{width:1568,height:829}});p=await ctx.newPage();await p.route('**/_next/static/chunks/**',r=>r.abort());
await p.goto('http://127.0.0.1:3000/',{waitUntil:'domcontentloaded'});await p.waitForTimeout(4200);
console.log('nojs',await p.evaluate(()=>({nav:getComputedStyle(document.querySelector('.wire-nav-bar')).visibility,stage:document.querySelector('.wire-nav-bar').dataset.stage,rv:document.querySelectorAll('.rv-in').length,h1:getComputedStyle(document.querySelector('.hp-hero-title')).opacity})));await ctx.close();await b.close();
