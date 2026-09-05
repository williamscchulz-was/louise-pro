import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
const widgets=fs.readFileSync(path.join(root,"src","24-widgets.jsx"),"utf8");
const app=fs.readFileSync(path.join(root,"src","90-app.jsx"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");

let passed=0;
const ok=(condition,message)=>{
  if(!condition)throw new Error(`FAIL: ${message}`);
  passed++;
};

const start=widgets.indexOf("let _blockingOverlayCount=0;");
const end=widgets.indexOf("function OverlayPortal",start);
ok(start>=0&&end>start,"encontra a implementacao real da trava no fonte");
const lockSource=widgets.slice(start,end);

function fakeElement({scrollTop=0,overflowY="",inert=false}={}){
  const attrs=new Set(inert?["inert"]:[]);
  return{
    scrollTop,
    style:{overflowY},
    isConnected:true,
    hasAttribute:name=>attrs.has(name),
    setAttribute:name=>attrs.add(name),
    removeAttribute:name=>attrs.delete(name),
  };
}

function makeHarness(options={}){
  const scroller=options.scroller===null?null:fakeElement({scrollTop:options.scrollTop??137,overflowY:options.overflowY??"auto"});
  const rootEl=fakeElement({inert:options.rootInert});
  const navEl=fakeElement({inert:options.navInert});
  const classes=new Set();
  const document={
    querySelector:selector=>selector==="[data-app-scroll-root]"?scroller:null,
    getElementById:id=>id==="root"?rootEl:id==="nav-host"?navEl:null,
    body:{classList:{add:name=>classes.add(name),remove:name=>classes.delete(name)}},
  };
  const api=new Function("document","requestAnimationFrame",`${lockSource};return{lock:()=>_setBlockingOverlayLock(true),unlock:()=>_setBlockingOverlayLock(false)};`)(document,fn=>fn());
  return{...api,scroller,rootEl,navEl,classes};
}

{
  const h=makeHarness();
  h.lock();
  ok(h.scroller.style.overflowY==="hidden","primeiro overlay congela o scroll do App");
  ok(h.scroller.scrollTop===137,"trava nao desloca a tela atual");
  ok(h.rootEl.hasAttribute("inert")&&h.navEl.hasAttribute("inert"),"fundo e navegacao ficam inertes");
  ok(h.classes.has("blocking-overlay-open"),"classe global acompanha a trava");
  h.scroller.scrollTop=211;
  h.lock();
  h.unlock();
  ok(h.scroller.style.overflowY==="hidden"&&h.rootEl.hasAttribute("inert"),"fechar modal interno nao libera o externo");
  h.unlock();
  ok(h.scroller.style.overflowY==="auto","ultimo overlay restaura overflow original");
  ok(h.scroller.scrollTop===137,"ultimo overlay restaura scrollTop exato");
  ok(!h.rootEl.hasAttribute("inert")&&!h.navEl.hasAttribute("inert"),"ultimo overlay reativa o fundo");
  ok(!h.classes.has("blocking-overlay-open"),"classe global e removida no cleanup");
}

{
  const h=makeHarness({rootInert:true,navInert:true});
  h.lock();h.unlock();
  ok(h.rootEl.hasAttribute("inert")&&h.navEl.hasAttribute("inert"),"inert preexistente nunca e removido");
}

{
  const h=makeHarness({scroller:null});
  h.lock();h.unlock();
  ok(!h.classes.has("blocking-overlay-open"),"cleanup funciona mesmo antes do App scroller existir");
}

ok(html.includes('id="overlay-host"'),"index possui host dedicado fora do root");
ok(app.includes('data-app-scroll-root="true"'),"App identifica explicitamente seu scroll root");
ok(widgets.includes('ReactDOM.createPortal(children,host)'),"overlays usam Portal real");
ok(widgets.includes('overscrollBehaviorY:"contain"'),"scroll interno do Modal contem o gesto");

console.log(`overlay lock: ${passed} asserts OK`);
