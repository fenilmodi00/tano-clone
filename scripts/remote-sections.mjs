import { chromium } from 'playwright';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1568,height:709}});
await p.goto('https://dev.kaplun.tech/',{waitUntil:'networkidle'});await p.evaluate(()=>scrollTo(0,1760));await p.waitForTimeout(1600);
console.log('home',await p.evaluate(()=>{const c=document.querySelector('.hp-pp-cursor');return {cursor:c&&{op:getComputedStyle(c).opacity,tr:getComputedStyle(c).transform},running:document.querySelector('.hp-pp-scene')?.dataset.running,rv:document.querySelectorAll('.rv-in').length,nav:getComputedStyle(document.querySelector('.wire-nav-bar')).visibility}}));
await p.waitForTimeout(1500);console.log('home2',await p.evaluate(()=>{const c=document.querySelector('.hp-pp-cursor');return {op:getComputedStyle(c).opacity,tr:getComputedStyle(c).transform}}));
await p.goto('https://dev.kaplun.tech/use-cases/drive-revenue',{waitUntil:'networkidle'});await p.evaluate(()=>scrollTo(0,1496));await p.waitForTimeout(1600);
console.log('drive',await p.evaluate(()=>({running:document.querySelector('.hp-pp-scene')?.dataset.running,scores:[...document.querySelectorAll('.hp-pp-score')].slice(0,3).map(e=>getComputedStyle(e).opacity),rv:document.querySelectorAll('.rv-in').length})));
await b.close();
