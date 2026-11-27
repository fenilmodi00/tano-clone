import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
for(const base of ['https://www.tano.ai','http://127.0.0.1:3000']){
 await p.goto(base+'/talk-to-us',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
 console.log(base,JSON.stringify(await p.evaluate(()=>{const s=document.querySelector('.wire-contact-sheet');const par=s.parentElement;const pc=getComputedStyle(par);const sc=getComputedStyle(s);const main=document.querySelector('main');return {parent:{cls:par.className,disp:pc.display,align:pc.alignItems,justify:pc.justifyContent,pad:pc.padding,gap:pc.gap,grid:pc.gridTemplateColumns},sheet:{alignSelf:sc.alignSelf,marginTop:sc.marginTop,marginBottom:sc.marginBottom,translate:sc.translate,y:s.getBoundingClientRect().y},kids:[...main.children].map(e=>({cls:String(e.className).slice(0,30),y:e.getBoundingClientRect().y,h:e.getBoundingClientRect().height}))}})));
}
await b.close();
