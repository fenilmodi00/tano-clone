import { chromium } from 'playwright';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1568,height:709}});
for(const [route,y] of [['/',1760],['/use-cases/drive-revenue',1496]]){
 console.log('\n###',route);
 for(const base of ['https://www.tano.ai','http://127.0.0.1:3000']){
  await p.goto(base+route,{waitUntil:'networkidle'});await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(1600);
  console.log(base,JSON.stringify(await p.evaluate(()=>{
   const all=[...document.querySelectorAll('main *')];
   const cursors=all.filter(e=>String(e.className).match(/cursor/i)).map(e=>({cls:String(e.className),tag:e.tagName,op:getComputedStyle(e).opacity,tr:getComputedStyle(e).transform,html:e.outerHTML.slice(0,180)}));
   const target=all.find(e=>/Sourcing|Your setup/.test(e.textContent||'')&&String(e.className).match(/hp-(pp|flow|uc|process)/));
   return {cursors, sectionCls:target?.className, sectionTag:target?.tagName, sectionHTML:target?.outerHTML.slice(0,500)};
  })));
 }
}
await b.close();
