import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
for(const base of ['https://www.tano.ai','http://127.0.0.1:3000']){
 await p.goto(base+'/playbooks/creator-discovery',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
 console.log(base,await p.evaluate(()=>{const s=document.querySelectorAll('main>section,main>div')[1];const h=s.querySelector('h2');const p=s.querySelector('p');const card=s.querySelector('.wire-contact-card');return {h2:[getComputedStyle(h).fontSize,getComputedStyle(h).lineHeight,getComputedStyle(h).fontFamily],p:[getComputedStyle(p).fontSize,getComputedStyle(p).lineHeight],card:[getComputedStyle(card).fontSize,getComputedStyle(card).padding],tokens:{hmd:getComputedStyle(document.querySelector('.tano')).getPropertyValue('--size-heading-md'),body:getComputedStyle(document.querySelector('.tano')).getPropertyValue('--size-body-md')}}}));
}
await b.close();
