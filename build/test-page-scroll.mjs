import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
const app=fs.readFileSync(path.join(root,"src","90-app.jsx"),"utf8");

let passed=0;
const ok=(condition,message)=>{
  if(!condition)throw new Error(`FAIL: ${message}`);
  passed++;
};

const pages=["home","stats","history"];
for(const page of pages){
  ok(app.includes(`data-page-scroll="${page}"`),`${page} possui scroll root proprio`);
  ok(app.includes(`page==="${page}"?"true":undefined`),`${page} so vira app scroll root quando ativa`);
}

ok((app.match(/data-page-bottom-spacer="true"/g)||[]).length===3,"cada aba possui exatamente um spacer inferior");
ok((app.match(/height:activeTimer\?"calc\(160px/g)||[]).length===3,"cada spacer reserva 160px com timer ativo");
ok(app.includes('height:"100%",overflowY:"auto",overflowX:"hidden",overscrollBehaviorY:"none"'),"slides tem altura de viewport e scroll vertical contido");
ok(app.includes('height:"var(--phys-h, 100dvh)",overflow:"hidden"'),"casca do App fica limitada ao viewport e nao rola");
ok(app.includes('if(ay>ax*1.1){st.locked="v";st.active=false;return}'),"gesto vertical continua vencendo a disputa de direcao");
ok(app.includes('if(st.locked==="h")'),"gesto horizontal continua controlando somente o trilho");

console.log(`page scroll: ${passed} asserts OK`);
