import { chromium } from 'playwright';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1568,height:829}});
const js=[];
p.on('response',async r=>{const u=r.url();if(/\.js(\?|$)/.test(u)||u.includes('/_next/static/chunks')){js.push({s:r.status(),u:u.slice(0,140),ct:r.headers()['content-type'],len:r.headers()['content-length']})}});
p.on('requestfailed',r=>{if(r.url().includes('_next'))js.push({fail:r.url().slice(0,140),err:r.failure()?.errorText})});
await p.goto('https://dev.kaplun.tech/',{waitUntil:'networkidle'});await p.waitForTimeout(3000);
console.log('JS',JSON.stringify(js.slice(0,15),null,1));
console.log('STATE',await p.evaluate(()=>({next:typeof window.next,reactKeys:Object.keys(document.querySelector('.wire-nav-bar')||{}).filter(k=>k.startsWith('__react')),scripts:[...document.scripts].map(s=>s.src).filter(Boolean).slice(-4)})));
await b.close();
