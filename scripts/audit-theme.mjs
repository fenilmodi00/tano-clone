import { chromium } from 'playwright';
const routes=process.argv.slice(2).length?process.argv.slice(2):['/','/guides/creator-ads','/compare/grin-vs-tano','/case-studies/papier','/use-cases/drive-revenue','/careers','/for-creators','/news/tano-raises-4m-seed-round','/playbooks','/webinars','/privacy-policy'];
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1568,height:900}});
for(const r of routes){
 const tones=[];
 for(const base of ['https://www.tano.ai','http://127.0.0.1:3000']){
  await p.goto(base+r,{waitUntil:'networkidle'}); await p.waitForTimeout(900);
  const h=await p.evaluate(()=>document.body.scrollHeight); const arr=[];
  for(let k=1;k<=5;k++){const y=Math.min(h-900,Math.round(h*k/6));await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(650);arr.push(await p.evaluate(()=>document.documentElement.dataset.groundTone));}
  tones.push(arr);
 }
 console.log(r,JSON.stringify(tones[0]),JSON.stringify(tones[1]),JSON.stringify(tones[0])===JSON.stringify(tones[1])?'OK':'DIFF');
}
await b.close();
