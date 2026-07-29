const STARFIELD_DATA = {
  sm: Array.from({length:60},(_,i)=>({k:"s"+i,w:Math.random()*1+0.6,h:Math.random()*1+0.6,o:Math.random()*0.35+0.15,t:Math.random()*100,l:Math.random()*100})),
  md: Array.from({length:25},(_,i)=>({k:"m"+i,w:Math.random()*1.5+1.2,h:Math.random()*1.5+1.2,o:Math.random()*0.5+0.25,t:Math.random()*100,l:Math.random()*100,g:4+Math.random()*5})),
  br: Array.from({length:8},(_,i)=>({k:"b"+i,w:2.5+Math.random(),h:2.5+Math.random(),c:_STARFIELD_COLORS[i],t:Math.random()*80+10,l:Math.random()*90+5})),
};
const Starfield = React.memo(function Starfield(){
  return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
    <div style={{position:"absolute",width:"60%",height:"40%",top:"5%",right:"-10%",background:"radial-gradient(ellipse,rgba(120,80,200,0.06) 0%,transparent 70%)",filter:"blur(40px)"}}/>
    <div style={{position:"absolute",width:"50%",height:"30%",bottom:"20%",left:"-5%",background:"radial-gradient(ellipse,rgba(60,100,180,0.05) 0%,transparent 70%)",filter:"blur(30px)"}}/>
    {STARFIELD_DATA.sm.map(s=><div key={s.k} style={{position:"absolute",width:s.w,height:s.h,background:`rgba(210,220,255,${s.o})`,borderRadius:"50%",top:s.t+"%",left:s.l+"%"}}/>)}
    {STARFIELD_DATA.md.map(s=><div key={s.k} style={{position:"absolute",width:s.w,height:s.h,background:`rgba(220,230,255,${s.o})`,borderRadius:"50%",top:s.t+"%",left:s.l+"%",boxShadow:`0 0 ${s.g}px rgba(220,230,255,0.4)`}}/>)}
    {STARFIELD_DATA.br.map(s=><div key={s.k} style={{position:"absolute",width:s.w,height:s.h,background:s.c,borderRadius:"50%",top:s.t+"%",left:s.l+"%",boxShadow:`0 0 12px ${s.c}, 0 0 4px ${s.c}`}}/>)}
  </div>);
});

// ── BACKUP SECTION (v11.2) ──
// Aparece no Profile entre "View growth" e "Louise Pro version". Duas operações:
// 1) Exportar: gera JSON + dispara download (browser salva em Files/iCloud/Downloads).
// 2) Importar: file picker → confirmação explícita → restaura.
// Também faz auto-export silencioso pra IndexedDB a cada 24h pra ter snapshot local recente
// independente do Firestore. Mostra "Último backup há Xh" em todas chamadas (manual ou auto).
const BACKUP_KEY = "lp_last_backup_at";
function fmtBackupAgo(ts, lang){
  if(!ts) return lang==="en"?"never":"nunca";
  const diffMin = Math.floor((Date.now()-ts)/60000);
  if(diffMin<1) return lang==="en"?"just now":"agora";
  if(diffMin<60) return `${diffMin}min`;
  const h = Math.floor(diffMin/60);
  if(h<24) return `${h}h`;
  const d = Math.floor(h/24);
  return lang==="en"?`${d}d ago`:`${d}d atrás`;
}
function downloadJSON(obj, filename){
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(()=>{document.body.removeChild(a); URL.revokeObjectURL(url)},100);
}
function BackupSection(){
  // v11.4: backup vai pro Firestore (`config/backups/latest`, doc \u00fanico que sobrescreve).
  // Compartilhado entre os 2 devices do casal. Fallback de download local disponível pra
  // belt-and-suspenders. Auto-backup 24h no App root j\u00e1 usa saveBackup.
  const[backupMeta,setBackupMeta]=useState(null); // {updatedAt, size}
  const[busy,setBusy]=useState(false);
  const[msg,setMsg]=useState("");
  const fileRef=useRef(null);
  // Pega \u00faltimo backup do Firestore ao abrir Profile
  useEffect(()=>{
    (async()=>{
      try{
        // v11.9.0: loadBackupMeta lê só {updatedAt,size} (~80B) em vez do snapshot full (~900KB).
        const m=await FB.loadBackupMeta();
        if(m)setBackupMeta({updatedAt:m.updatedAt,size:m.size});
      }catch(e){/* offline, sem acesso — mostra "nunca" */}
    })();
  },[]);
  const lastAt=backupMeta?new Date(backupMeta.updatedAt).getTime():0;
  // "Fazer backup agora" — salva no Firestore (compartilhado entre os 2 devices).
  // v11.6: tamb\u00e9m marca a data de hoje em `lp_last_backup_date` pra o auto-backup
  // n\u00e3o rodar de novo hoje.
  const onBackupNow=async()=>{
    if(busy)return;
    setBusy(true);setMsg("");
    try{
      const data=await FB.exportAll();
      const result=await FB.saveBackup(data);
      const now=Date.now();
      try{
        localStorage.setItem(BACKUP_KEY,String(now));
        localStorage.setItem("lp_last_backup_date",todayStr());
      }catch(_){}
      setBackupMeta({updatedAt:new Date().toISOString(),size:result.size});
      setMsg(_lang==="en"?"Backup saved to cloud":"Backup salvo na nuvem");
      Haptic.success();
      setTimeout(()=>setMsg(""),3000);
    }catch(e){setMsg((_lang==="en"?"Error: ":"Erro: ")+e.message);Haptic.warning();setTimeout(()=>setMsg(""),5000)}
    setBusy(false);
  };
  // "Restaurar último backup" — pega do Firestore.
  const onRestoreCloud=async()=>{
    if(busy)return;
    if(!backupMeta){setMsg(_lang==="en"?"No cloud backup yet":"Nenhum backup na nuvem ainda");setTimeout(()=>setMsg(""),3000);return}
    if(!confirm(L("importConfirm")))return;
    setBusy(true);setMsg("");
    try{
      const b=await FB.loadBackup();
      if(!b)throw new Error(_lang==="en"?"No backup found":"Nenhum backup encontrado");
      await FB.importAll(b.data);
      setMsg(L("importedOk"));
      Haptic.success();
      setTimeout(()=>{setMsg("");window.location.reload()},1500);
    }catch(err){setMsg(L("importErr")+": "+err.message);Haptic.warning();setTimeout(()=>setMsg(""),5000)}
    setBusy(false);
  };
  // "Baixar cópia local" — fallback pra ter JSON no device.
  const onDownloadLocal=async()=>{
    if(busy)return;
    setBusy(true);setMsg("");
    try{
      const data=await FB.exportAll();
      downloadJSON(data,`louise-backup-${todayStr()}.json`);
      setMsg(_lang==="en"?"Local copy downloaded":"Cópia local baixada");
      Haptic.light();
      setTimeout(()=>setMsg(""),3000);
    }catch(e){setMsg((_lang==="en"?"Error: ":"Erro: ")+e.message);Haptic.warning();setTimeout(()=>setMsg(""),4000)}
    setBusy(false);
  };
  const onImportClick=()=>{fileRef.current?.click()};
  const onImportFile=async(e)=>{
    const f=e.target.files?.[0];if(!f)return;
    if(!confirm(L("importConfirm"))){e.target.value="";return}
    setBusy(true);setMsg("");
    try{
      const txt=await f.text();
      const data=JSON.parse(txt);
      await FB.importAll(data);
      setMsg(L("importedOk"));
      Haptic.success();
      setTimeout(()=>{setMsg("");window.location.reload()},1500);
    }catch(err){setMsg(L("importErr")+": "+err.message);Haptic.warning();setTimeout(()=>setMsg(""),5000)}
    setBusy(false);
    e.target.value="";
  };
  // Pr\u00f3ximo auto-backup: primeiro open do pr\u00f3ximo dia (v11.6).
  let lastBackupDate="";
  try{lastBackupDate=localStorage.getItem("lp_last_backup_date")||""}catch(_){}
  const nextInStr=lastBackupDate===todayStr()?(_lang==="en"?"tomorrow":"amanh\u00e3"):(_lang==="en"?"any moment":"a qualquer momento");
  return(<div style={{marginTop:16,padding:"16px 18px",borderRadius:14,background:"rgba(22,28,60,0.4)",border:`1px solid ${T.gB}`,boxShadow:T.insetTop}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
      <div style={{width:32,height:32,borderRadius:9,background:"rgba(52,211,153,0.12)",border:"1px solid rgba(52,211,153,0.28)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:T.fMD,fontWeight:700,color:T.text}}>{L("backup")}</div>
        <div style={{fontSize:T.fSM,color:T.sub,fontWeight:600,marginTop:1,fontVariantNumeric:"tabular-nums"}}>{L("lastBackup")}: {fmtBackupAgo(lastAt,_lang)}{lastAt?` \u00b7 ${_lang==="en"?"next auto":"pr\u00f3x. auto"}: ${nextInStr}`:""}</div>
      </div>
    </div>
    <div style={{fontSize:T.fSM,color:T.sub,lineHeight:1.5,marginBottom:12}}>{_lang==="en"?"Automatic backup every 24h to Firestore (shared between devices). Single latest snapshot — each new backup replaces the previous. Local file download available as fallback.":"Backup automático a cada 24h no Firestore (compartilhado entre os 2 devices). Um único snapshot mais recente — cada backup novo substitui o anterior. Download local disponível como segurança extra."}</div>
    <div style={{display:"flex",gap:8,marginBottom:8}}>
      <button onClick={onBackupNow} disabled={busy} style={{flex:1,padding:"11px 12px",borderRadius:11,background:busy?"rgba(52,211,153,0.1)":"linear-gradient(180deg,rgba(52,211,153,0.22),rgba(16,185,129,0.12))",border:"1px solid rgba(52,211,153,0.35)",color:"#6ee7b7",fontSize:T.fMD,fontWeight:700,letterSpacing:-0.1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:busy?0.6:1}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6m0 0l-3-3m3 3l3-3M5 12h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z"/></svg>
        {_lang==="en"?"Backup now":"Fazer backup agora"}
      </button>
      <button onClick={onRestoreCloud} disabled={busy||!backupMeta} style={{flex:1,padding:"11px 12px",borderRadius:11,background:"rgba(22,28,60,0.6)",border:`1px solid ${T.gBSoft}`,color:backupMeta?T.text:T.dim,fontSize:T.fMD,fontWeight:700,letterSpacing:-0.1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:busy||!backupMeta?0.5:1}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
        {_lang==="en"?"Restore last":"Restaurar último"}
      </button>
    </div>
    <div style={{display:"flex",gap:8}}>
      <button onClick={onDownloadLocal} disabled={busy} style={{flex:1,padding:"9px 10px",borderRadius:10,background:"transparent",border:`1px dashed ${T.gB}`,color:T.sub,fontSize:T.fSM,fontWeight:600,letterSpacing:-0.05,display:"flex",alignItems:"center",justifyContent:"center",gap:5,opacity:busy?0.6:1}}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        {_lang==="en"?"Local copy":"Cópia local"}
      </button>
      <button onClick={onImportClick} disabled={busy} style={{flex:1,padding:"9px 10px",borderRadius:10,background:"transparent",border:`1px dashed ${T.gB}`,color:T.sub,fontSize:T.fSM,fontWeight:600,letterSpacing:-0.05,display:"flex",alignItems:"center",justifyContent:"center",gap:5,opacity:busy?0.6:1}}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        {_lang==="en"?"From file":"De arquivo"}
      </button>
      <input ref={fileRef} type="file" accept="application/json,.json" onChange={onImportFile} style={{display:"none"}}/>
    </div>
    {msg&&<div style={{fontSize:T.fSM,color:msg.startsWith("Erro")||msg.toLowerCase().includes("inv")?"#f87171":"#6ee7b7",marginTop:10,textAlign:"center",fontWeight:600}}>{msg}</div>}
  </div>);
}

// ── RELATÓRIO DE 30 DIAS (v11.9.135) ──
// Export legível pra levar/enviar a profissional (pediatra, consultora de sono). São DOIS
// caminhos porque são dois usos distintos: TEXTO (manda no WhatsApp e a pessoa lê na hora,
// já com as médias) e CSV (abre em planilha pra analisar dia a dia). No iPhone tenta o share
// sheet nativo — inclusive com ARQUIVO; se o browser não suportar, cai pro download.
// O motor (sleepReport/CSV/Text) é puro e mora no 00-core, com harness de 26 asserts.
function ReportSection({entries,babyName}){
  const[msg,setMsg]=useState("");
  const[busy,setBusy]=useState(false);
  const flash=t=>{setMsg(t);setTimeout(()=>setMsg(""),3500)};
  const onShareText=async()=>{
    if(busy)return;setBusy(true);
    try{
      const txt=sleepReportText(sleepReport(entries,30),_lang,babyName);
      const title=_lang==="en"?"Sleep & routine report":"Relatório de sono e rotina";
      if(navigator.share){await navigator.share({title,text:txt})}
      else{await navigator.clipboard.writeText(txt);flash(_lang==="en"?"Copied to clipboard":"Copiado pra área de transferência")}
      Haptic.success();
    }catch(e){if(e&&e.name!=="AbortError"){flash((_lang==="en"?"Error: ":"Erro: ")+e.message);Haptic.warning()}}
    setBusy(false);
  };
  const onCSV=async()=>{
    if(busy)return;setBusy(true);
    try{
      // BOM (﻿): sem ele o Excel/Numbers come os acentos do cabeçalho.
      const csv="﻿"+sleepReportCSV(sleepReport(entries,30),_lang);
      const fname=`${(babyName||"louise").toLowerCase().replace(/[^a-z0-9]/g,"")||"louise"}-30d-${todayStr()}.csv`;
      let shared=false;
      try{
        const file=new File([csv],fname,{type:"text/csv"});
        if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:fname});shared=true}
      }catch(e){if(e&&e.name==="AbortError"){setBusy(false);return}}
      if(!shared){
        const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
        const a=document.createElement("a");a.href=url;a.download=fname;document.body.appendChild(a);a.click();
        setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url)},1000);
        flash(_lang==="en"?"Spreadsheet downloaded":"Planilha baixada");
      }
      Haptic.success();
    }catch(e){if(e&&e.name!=="AbortError"){flash((_lang==="en"?"Error: ":"Erro: ")+e.message);Haptic.warning()}}
    setBusy(false);
  };
  return(<div style={{marginTop:12,padding:"16px 18px",borderRadius:14,background:"rgba(22,28,60,0.4)",border:`1px solid ${T.gB}`,boxShadow:T.insetTop}}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
      <div style={{width:32,height:32,borderRadius:9,background:"rgba(139,124,246,0.12)",border:"1px solid rgba(139,124,246,0.28)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.lilac} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:T.fMD,fontWeight:700,color:T.text}}>{_lang==="en"?"30-day report":"Relatório de 30 dias"}</div>
        <div style={{fontSize:T.fSM,color:T.sub,fontWeight:600,marginTop:1}}>{_lang==="en"?"To send to the pediatrician":"Pra enviar à pediatra"}</div>
      </div>
    </div>
    <div style={{fontSize:T.fSM,color:T.sub,lineHeight:1.5,marginBottom:12}}>{_lang==="en"?"Day by day: wake-up time, naps with durations, awake windows, feeds and night sleep (duration, wakings and real sleep). Averages included.":"Dia a dia: horário de acordar, sonecas com duração, janelas de tempo acordada, mamadas e sono noturno (duração, despertares e sono real). Com médias no topo."}</div>
    <div style={{display:"flex",gap:8}}>
      <button onClick={onShareText} disabled={busy} style={{flex:1,padding:"11px 12px",borderRadius:11,background:busy?"rgba(139,124,246,0.1)":"linear-gradient(180deg,rgba(139,124,246,0.22),rgba(124,58,237,0.12))",border:"1px solid rgba(139,124,246,0.35)",color:T.lilac,fontSize:T.fMD,fontWeight:700,letterSpacing:-0.1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:busy?0.6:1}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        {_lang==="en"?"Share":"Compartilhar"}
      </button>
      <button onClick={onCSV} disabled={busy} style={{flex:1,padding:"11px 12px",borderRadius:11,background:"rgba(22,28,60,0.6)",border:`1px solid ${T.gBSoft}`,color:T.text,fontSize:T.fMD,fontWeight:700,letterSpacing:-0.1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:busy?0.5:1}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
        {_lang==="en"?"Spreadsheet":"Planilha"}
      </button>
    </div>
    {msg&&<div style={{fontSize:T.fSM,color:msg.startsWith("Erro")||msg.startsWith("Error")?"#f87171":T.lilac,marginTop:10,textAlign:"center",fontWeight:600}}>{msg}</div>}
  </div>);
}

// ── ERROR BOUNDARY (v11.0) ──
// Última linha de defesa: se qualquer componente der throw durante render,
// em vez de tela branca aparece esse fallback, e o app faz reload em 3s pra
// tentar recuperar. Logs vão pra console pra debug depois.
class ErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={hasError:false,err:null,stack:null}}
  static getDerivedStateFromError(err){return{hasError:true,err:err,stack:(err&&err.stack)||""}}
  componentDidCatch(err,info){
    console.error("[LP] ErrorBoundary caught:",err,info);
    // v11.9.13: persiste o erro em localStorage pra o usu\u00E1rio poder copiar mesmo ap\u00F3s reload.
    try{localStorage.setItem("lp_last_error",JSON.stringify({msg:String(err&&err.message||err),stack:String(err&&err.stack||""),at:new Date().toISOString()}))}catch(_){}
  }
  componentDidUpdate(_,prev){
    if(this.state.hasError&&!prev.hasError){
      // v11.9.13: para o loop infinito de reload. Tenta auto-reload 1x; se falhar de novo,
      // mostra UI est\u00E1tica com erro pra usu\u00E1rio ler/copiar e decidir o que fazer.
      try{
        const tries=parseInt(sessionStorage.getItem("lp_eb_tries")||"0",10)+1;
        sessionStorage.setItem("lp_eb_tries",String(tries));
        if(tries<=1){
          setTimeout(function(){window.location.reload()},2500);
        }
      }catch(_){}
    }
  }
  render(){
    if(this.state.hasError){
      const msg=String(this.state.err&&this.state.err.message||this.state.err||"unknown");
      const stack=String(this.state.stack||"").split("\n").slice(0,6).join("\n");
      let triesShown=0;
      try{triesShown=parseInt(sessionStorage.getItem("lp_eb_tries")||"0",10)}catch(_){}
      const willReload=triesShown<=1;
      const en=(typeof _lang!=="undefined"&&_lang==="en");
      const onCopy=()=>{
        try{
          navigator.clipboard.writeText("Louise Pro error\n\n"+msg+"\n\n"+stack);
          alert(en?"Error copied to clipboard":"Erro copiado pra \u00E1rea de transfer\u00EAncia");
        }catch(_){alert(en?"Couldn't copy \u2014 take a screenshot":"N\u00E3o consegui copiar \u2014 tira print da tela")}
      };
      const onReset=()=>{try{sessionStorage.removeItem("lp_eb_tries")}catch(_){};window.location.reload()};
      return(<div style={{position:"fixed",inset:0,background:"linear-gradient(180deg,#070b1e 0%,#0b1130 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:"calc(env(safe-area-inset-top) + 28px) 22px 28px",overflowY:"auto",WebkitOverflowScrolling:"touch",color:T.heading,fontFamily:"'Outfit',sans-serif"}}>
        <div style={{width:64,height:64,borderRadius:20,background:"rgba(248,113,113,0.1)",border:"1.5px solid rgba(248,113,113,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:T.f3XL,color:"#f87171",marginBottom:14,boxShadow:"0 0 32px -8px rgba(248,113,113,0.3)"}}>{"\u26A0"}</div>
        <div style={{fontSize:T.f2XL,fontWeight:800,letterSpacing:-0.5,marginBottom:4,textAlign:"center"}}>{"Oops!"}</div>
        <div style={{fontSize:T.fMD,color:"#a3aac8",lineHeight:1.55,marginBottom:14,maxWidth:280,textAlign:"center"}}>{willReload?(en?"Something broke. Reloading\u2026":"Algo quebrou. Tentando recarregar\u2026"):(en?"Something broke and reloading didn't fix it.":"Algo quebrou e o reload n\u00E3o resolveu.")}</div>
        {willReload&&<div style={{width:24,height:24,border:"2.5px solid rgba(139,124,246,0.2)",borderTopColor:"#a78bfa",borderRadius:"50%",animation:"spin 0.9s linear infinite",marginBottom:18}}/>}
        <div style={{width:"100%",maxWidth:380,background:"rgba(20,26,60,0.55)",border:"1px solid rgba(139,124,246,0.18)",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
          <div style={{fontSize:T.fSM,color:T.purple,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase",marginBottom:6}}>{en?"Error":"Erro"}</div>
          <div style={{fontSize:T.fSM,color:"#fda4af",fontFamily:"ui-monospace,Menlo,monospace",wordBreak:"break-word",lineHeight:1.5,marginBottom:8}}>{msg}</div>
          {stack&&<details style={{marginTop:8}}><summary style={{fontSize:T.fSM,color:"#9099c3",cursor:"pointer"}}>{"Stack trace"}</summary><pre style={{fontSize:T.fXS,color:T.label,whiteSpace:"pre-wrap",wordBreak:"break-word",margin:"6px 0 0",lineHeight:1.45,fontFamily:"ui-monospace,Menlo,monospace"}}>{stack}</pre></details>}
        </div>
        <div style={{display:"flex",gap:8,width:"100%",maxWidth:380}}>
          <button onClick={onCopy} style={{flex:1,padding:"12px 0",borderRadius:11,background:"rgba(139,124,246,0.12)",border:"1px solid rgba(139,124,246,0.32)",color:T.lilac,fontSize:T.fMD,fontWeight:700}}>{en?"Copy error":"Copiar erro"}</button>
          <button onClick={onReset} style={{flex:1,padding:"12px 0",borderRadius:11,background:"linear-gradient(180deg,#9b8df8,#7c3aed)",border:"none",color:"#fff",fontSize:T.fMD,fontWeight:800,boxShadow:"0 4px 12px -4px rgba(139,124,246,0.5)"}}>{en?"Try again":"Tentar de novo"}</button>
        </div>
        <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      </div>);
    }
    return this.props.children;
  }
}

// ── MAIN APP ──
