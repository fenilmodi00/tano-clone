import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
for(const base of ['https://www.tano.ai','http://127.0.0.1:3000']){
 await p.goto(base+'/talk-to-us',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
 console.log(base,JSON.stringify(await p.evaluate(()=>{const s=document.querySelector('.wire-contact-sheet');const c=getComputedStyle(s);const a=document.querySelector('.wire-contact-art');const ca=getComputedStyle(a);const img=a.querySelector('img');return {sheet:{top:c.top,pos:c.position,margin:c.margin,pad:c.padding,transform:c.transform,height:c.height},art:{bg:ca.backgroundImage,img:img&&{src:(img.currentSrc||img.src).slice(-50),rect:(()=>{const r=img.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})(),fit:getComputedStyle(img).objectFit}},main:document.querySelector('main').getBoundingClientRect().height}})));
}
await b.close();
