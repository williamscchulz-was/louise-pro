const SleepBlock = React.memo(function SleepBlock({entry,onDelete,onEdit,entries,isLive,activeTimer,onSaveTimer,onSaveEntry,showToast}){
  const[expanded,setExpanded]=useState(true); // default OPEN
  const[editingIdx,setEditingIdx]=useState(null); // waking index being edited
  const[editStart,setEditStart]=useState("");
  const[editEnd,setEditEnd]=useState("");
  const[editBusy,setEditBusy]=useState(false);
  // v11.9.38: 2-step inline confirm (substitui confirm() nativo no SleepBlock — mesma logica da v11.9.35 do med delete)
  const[confirmDelEventId,setConfirmDelEventId]=useState(null); // event id pendente de confirmacao
  const[confirmRemoveWaking,setConfirmRemoveWaking]=useState(false); // waking edit-modal pendente
  // v11.9.140: mesmo padrão 2-step pro botão "Excluir bedtime" do rodapé (achado #3 da
  // auditoria — era 1 toque só, sem confirmação, apagando a noite inteira com despertares).
  const[confirmDelBedtime,setConfirmDelBedtime]=useState(false);
  // Quando troca de waking no editor, reseta o confirm pra evitar "estado fantasma"
  useEffect(()=>{setConfirmRemoveWaking(false)},[editingIdx]);
  const wakings=entry.wakings||[];
  const totalMin=entry.durationMin||0;
  const awakeMin=awakeMinIn(entry);
  const realMin=realSleepMin(entry);
  const endMs=new Date(`${entry.date}T${entry.time}`).getTime()+totalMin*60000;
  const endD=new Date(endMs);
  const endT=`${String(endD.getHours()).padStart(2,"0")}:${String(endD.getMinutes()).padStart(2,"0")}`;
  const endDt=`${endD.getFullYear()}-${String(endD.getMonth()+1).padStart(2,"0")}-${String(endD.getDate()).padStart(2,"0")}`;
  const startMin=(()=>{const[h,m]=entry.time.split(":").map(Number);return h*60+m})();
  // Resolve linked events from entries array
  const findEvent=id=>entries.find(e=>e.id===id);
  // Compute the bedtime's time range (for retroactive discovery of events
  // that were registered without an explicit nightWake link)
  const bedStartMs=new Date(`${entry.date}T${entry.time}`).getTime();
  const bedEndMs=bedStartMs+totalMin*60000;
  // Find events that temporally fall inside this bedtime AND are NOT explicitly
  // linked to ANY waking (avoid duplicates with the explicit-link path)
  const explicitlyLinkedIds=new Set();
  wakings.forEach(w=>(w.events||[]).forEach(id=>explicitlyLinkedIds.add(id)));
  const retroactiveEvents=entries.filter(e=>{
    if(!e||NIGHT_NESTED_EXCLUDED.includes(e.type))return false;
    if(e.id===entry.id)return false; // not the bedtime itself
    if(explicitlyLinkedIds.has(e.id))return false; // already shown via w.events
    if(!e.date||!e.time)return false;
    const evMs=new Date(`${e.date}T${e.time}`).getTime();
    if(isNaN(evMs))return false;
    // Strict boundaries — match findContainingBedtime (v10.4.6).
    return evMs>bedStartMs&&evMs<bedEndMs;
  });
  // Render a small linked event row (bottle / diaper / nursing / medicine / etc)
  // Clickable to edit, with a small trash button.
  const EventMini=({le})=>{
    const cfg=TYPES[le.type]||{icon:"star",color:T.text,bg:T.glass};
    let txt="";
    if(le.type==="bottle")txt=`${_lang==="en"?"Bottle":"Mamadeira"} · ${le.ml||"?"} ml`;
    else if(le.type==="nursing")txt=`${_lang==="en"?"Nursing":"Amamentação"} · ${le.durationMin||"?"} min`;
    else if(le.type==="diaper")txt=`${_lang==="en"?"Diaper":"Fralda"}${le.subtype?` · ${L(le.subtype)||le.subtype}`:""}`;
    else if(le.type==="medicine")txt=`${le.name||""}${le.dose?` · ${le.dose}`:""}`;
    else if(le.type==="temperature")txt=`${le.value||"?"}°C`;
    else if(le.type==="bath")txt=_lang==="en"?"Bath":"Banho";
    else txt=TL(le.type);
    return(<div style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0"}}>
      <button aria-label={_lang==="en"?"Edit":"Editar"} onClick={ev=>{ev.stopPropagation();onEdit&&onEdit(le)}} className="hit44" style={{width:34,height:34,borderRadius:9,background:cfg.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",border:"none",padding:0}}>
        <Icon name={cfg.icon} size={13} color={cfg.color}/>
      </button>
      <button onClick={ev=>{ev.stopPropagation();onEdit&&onEdit(le)}} style={{flex:1,fontSize:T.fMD,color:T.text,fontWeight:500,letterSpacing:-0.1,cursor:"pointer",textAlign:"left",background:"transparent",border:"none",padding:0}}>{txt}</button>
      <div style={{fontSize:T.fSM,color:T.sub,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{le.time}</div>
      {/* v11.9.38: 2-step inline confirm (sem confirm() nativo). 1o tap = pendente (red bg + opacity 1); 2o tap = delete; auto-cancela em 3s */}
      <button aria-label={confirmDelEventId===le.id?(_lang==="en"?"Confirm delete":"Confirmar exclusao"):(_lang==="en"?"Delete":"Excluir")} onClick={ev=>{
        ev.stopPropagation();
        if(confirmDelEventId!==le.id){
          setConfirmDelEventId(le.id);
          Haptic.warning();
          setTimeout(()=>setConfirmDelEventId(prev=>prev===le.id?null:prev),3000);
          return;
        }
        setConfirmDelEventId(null);
        onDelete&&onDelete(le.id);
      }} className="hit44" style={{width:confirmDelEventId===le.id?64:34,height:34,borderRadius:9,background:confirmDelEventId===le.id?"rgba(248,113,113,0.30)":"transparent",border:confirmDelEventId===le.id?"1px solid rgba(248,113,113,0.6)":"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:confirmDelEventId===le.id?1:0.55,cursor:"pointer",padding:0,fontSize:T.fSM,fontWeight:700,color:"#fca5a5",letterSpacing:0.2,transition:"all .2s"}}>
        {confirmDelEventId===le.id?(_lang==="en"?"Sure?":"Certo?"):<Icon name="trash" size={11} color={T.dim}/>}
      </button>
    </div>);
  };
  // Pre-compute waking ranges + retroactive event distribution (avoid IIFE in JSX, Babel-safe rule)
  const wakingRanges=wakings.map(w=>{
    const[wh,wm]=w.time.split(":").map(Number);
    let wMin=wh*60+wm;
    if(wMin<startMin)wMin+=1440;
    const wStartMs=bedStartMs+(wMin-startMin)*60000;
    const wEndMs=wStartMs+(w.durationMin||0)*60000;
    return{wStartMs,wEndMs};
  });
  const _assignedRetro=new Set();
  const retroForWaking=wakingRanges.map(({wStartMs,wEndMs})=>{
    return retroactiveEvents.filter(e=>{
      if(_assignedRetro.has(e.id))return false;
      const evMs=new Date(`${e.date}T${e.time}`).getTime();
      if(isNaN(evMs))return false;
      if(evMs>=wStartMs&&evMs<=wEndMs){_assignedRetro.add(e.id);return true}
      return false;
    });
  });
  const orphanRetro=retroactiveEvents.filter(e=>!_assignedRetro.has(e.id));

  // Live mode: end label is "agora / now" instead of computed end time
  const endLabel=isLive?(_lang==="en"?"now":"agora"):endT;
  return(<div style={{position:"relative",marginBottom:8,borderRadius:18,background:"rgba(20,26,60,0.32)",border:`1px solid ${isLive?"rgba(139,124,246,0.4)":T.gBSoft}`,overflow:"hidden",contain:"layout paint"}}>
    {/* Header (refinado v11.9.37: duracao como headline, ponto pulsante no canto do icone) */}
    <button onClick={()=>setExpanded(!expanded)} style={{width:"100%",padding:"14px 18px",display:"flex",alignItems:"center",gap:13,textAlign:"left",background:"transparent",border:"none",position:"relative",cursor:"pointer"}}>
      <div style={{position:"relative",width:42,height:42,borderRadius:13,background:"rgba(167,139,250,0.16)",border:"1px solid rgba(167,139,250,0.22)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Icon name="bed" size={20} color="#c4b5fd"/>
        {isLive&&<span style={{position:"absolute",top:-2,right:-2,width:9,height:9,borderRadius:"50%",background:"#a78bfa",boxShadow:"0 0 6px #a78bfa, 0 0 0 2px rgba(7,11,30,0.95)",animation:"liveDotPulse 1.6s ease-in-out infinite"}}/>}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:T.f2XL,fontWeight:800,color:T.heading,letterSpacing:-0.5,fontVariantNumeric:"tabular-nums",lineHeight:1.1}}>
          {fmtDur(totalMin)}
          {isLive&&<span style={{fontSize:T.fSM,color:T.lilac,fontWeight:600,marginLeft:6,letterSpacing:0.2,opacity:0.85}}>{_lang==="en"?"· live":"· ao vivo"}</span>}
        </div>
        <div style={{fontSize:T.fMD,color:T.sub,marginTop:3,fontVariantNumeric:"tabular-nums",fontWeight:500}}>
          {entry.time} → {endLabel}
          {wakings.length>0&&` · ${wakings.length} ${wakings.length===1?(_lang==="en"?"waking":"despertar"):(_lang==="en"?"wakings":"despertares")}`}
        </div>
      </div>
      <div style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",color:T.dim,flexShrink:0,transform:expanded?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6"/></svg>
      </div>
    </button>
    {/* Visual timeline refinada (22px, gradient bands, pulse sutil no ativo) */}
    {wakings.length>0&&<>
      <div style={{margin:"0 18px 4px",position:"relative",height:22,borderRadius:11,background:"linear-gradient(180deg,rgba(124,58,237,0.16),rgba(124,58,237,0.06))",border:"1px solid rgba(139,124,246,0.14)",overflow:"hidden"}}>
        {(()=>{const marks=[];const totalH=totalMin/60;for(let h=1;h<totalH;h++){const pct=(h*60/totalMin)*100;marks.push(<div key={h} style={{position:"absolute",top:0,bottom:0,left:`${pct}%`,width:1,background:"rgba(255,255,255,0.04)"}}/>)}return marks})()}
        {wakings.map((w,i)=>{
          const[wh,wm]=w.time.split(":").map(Number);
          let wMin=wh*60+wm;
          if(wMin<startMin)wMin+=1440;
          const leftPct=Math.max(0,Math.min(100,((wMin-startMin)/totalMin)*100));
          const widthPct=Math.max(2,(w.durationMin/totalMin)*100);
          const isActive=w.isActive;
          return<div key={i} style={{position:"absolute",top:0,bottom:0,left:`${leftPct}%`,width:`${widthPct}%`,background:isActive?"linear-gradient(180deg,#fbbf24,#d97706)":"linear-gradient(180deg,#6ea8ff,#3b82f6)",boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.12)",animation:isActive?"liveBandPulse 2s ease-in-out infinite":"none"}}/>
        })}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",padding:"0 18px 14px",fontSize:T.fXS,color:T.dim,fontWeight:600,fontVariantNumeric:"tabular-nums",letterSpacing:0.3}}>
        <span>{entry.time}</span>
        <span>{(()=>{const midMs=new Date(`${entry.date}T${entry.time}`).getTime()+(totalMin/2)*60000;const md=new Date(midMs);return`${String(md.getHours()).padStart(2,"0")}:${String(md.getMinutes()).padStart(2,"0")}`})()}</span>
        <span>{endLabel}</span>
      </div>
    </>}
    {/* Stats row (refinado v11.9.37: Sono real / Acordada em colunas) */}
    {expanded&&wakings.length>0&&<div style={{padding:"0 18px 14px",display:"flex",gap:14}}>
      <div style={{flex:1}}>
        <div style={{color:T.dim,fontSize:T.fSM,fontWeight:600,textTransform:"uppercase",letterSpacing:0.4,marginBottom:2}}>{_lang==="en"?"Real sleep":"Sono real"}</div>
        <div style={{color:T.lilac,fontWeight:700,fontSize:T.fMD,fontVariantNumeric:"tabular-nums"}}>{fmtDur(realMin)}</div>
      </div>
      {awakeMin>0&&<div style={{flex:1,borderLeft:"1px solid rgba(139,124,246,0.1)",paddingLeft:14}}>
        <div style={{color:T.dim,fontSize:T.fSM,fontWeight:600,textTransform:"uppercase",letterSpacing:0.4,marginBottom:2}}>{_lang==="en"?"Awake":"Acordada"}</div>
        <div style={{color:"#7dd3fc",fontWeight:700,fontSize:T.fMD,fontVariantNumeric:"tabular-nums"}}>{fmtDur(awakeMin)}</div>
      </div>}
    </div>}
    {/* Wakings sections (refinado: cada waking = secao com border-top sutil, pill mostra "start → end" + duracao a direita) */}
    {expanded&&wakings.length>0&&<div>
        {wakings.map((w,i)=>{
          // Filter linked events to only those with time inside bedtime range —
          // defense against legacy data where events got wrongly linked via addEntry
          // before the v9.8.1 fix (e.g. retroactive events logged while night wake was active)
          const linkedEvents=(w.events||[]).map(findEvent).filter(le=>{
            if(!le)return false;
            if(!le.date||!le.time)return true; // can't validate, keep it
            const leMs=new Date(`${le.date}T${le.time}`).getTime();
            if(isNaN(leMs))return true; // malformed, keep it
            // Strict boundaries — match findContainingBedtime (v10.4.6).
            return leMs>bedStartMs&&leMs<bedEndMs;
          });
          const allEventsForWaking=[...linkedEvents,...retroForWaking[i]]
            .sort((a,b)=>(a.time||"").localeCompare(b.time||""));
          const isActive=w.isActive;
          // Compute end string for waking range "start → end"
          const[_swh,_swm]=(w.time||"00:00").split(":").map(Number);
          const _wEndTot=_swh*60+_swm+(w.durationMin||0);
          const _weh=Math.floor(_wEndTot/60)%24;
          const _wem=_wEndTot%60;
          const wakingEndStr=isActive?(_lang==="en"?"now":"agora"):`${String(_weh).padStart(2,"0")}:${String(_wem).padStart(2,"0")}`;
          return<div key={i} style={{borderTop:"1px solid rgba(139,124,246,0.10)",padding:"10px 18px"}}>
            {/* Waking header: tappable pill (start → end) + duration tag */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:allEventsForWaking.length>0?6:0,flexWrap:"wrap"}}>
              <button onClick={e=>{e.stopPropagation();const didx=editingIdx===i?null:i;setEditingIdx(didx);if(didx!==null){setEditStart(w.time||"");const dur=w.durationMin||0;if(isActive){const now=new Date();setEditEnd(`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`)}else{const[sh,sm]=(w.time||"00:00").split(":").map(Number);const endTot=sh*60+sm+dur;const eh=Math.floor(endTot/60)%24;const em=endTot%60;setEditEnd(`${String(eh).padStart(2,"0")}:${String(em).padStart(2,"0")}`)}}}} className="hit44" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:T.fSM,fontWeight:700,color:isActive?"#fbbf24":"#7dd3fc",padding:"4px 10px",borderRadius:9,background:isActive?"rgba(251,191,36,0.13)":"rgba(59,130,246,0.13)",border:`1px solid ${editingIdx===i?"rgba(139,124,246,0.55)":(isActive?"rgba(251,191,36,0.32)":"rgba(59,130,246,0.25)")}`,fontVariantNumeric:"tabular-nums",cursor:"pointer"}}>
                {isActive?<span style={{width:6,height:6,borderRadius:"50%",background:"#fbbf24",boxShadow:"0 0 6px #fbbf24",animation:"liveDotPulse 1.5s ease-in-out infinite"}}/>:<Icon name="sun" size={9} color="#7dd3fc"/>}
                <span>{w.time} → {wakingEndStr}</span>
                <svg viewBox="0 0 24 24" style={{width:9,height:9,stroke:isActive?"#fbbf24":"#7dd3fc",fill:"none",strokeWidth:2.5,opacity:0.55,marginLeft:2}}><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <span style={{fontSize:T.fSM,color:T.dim,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{fmtDur(w.durationMin)}{isActive?` · ${_lang==="en"?"live":"ao vivo"}`:""}</span>
            </div>
            {/* Inline waking editor */}
            {editingIdx===i&&(()=>{
              const[sh,sm]=(editStart||"00:00").split(":").map(Number);
              const[eh,em]=(editEnd||"00:00").split(":").map(Number);
              let dur=(eh*60+em)-(sh*60+sm);
              if(dur<0)dur+=1440;
              const valid=editStart&&editEnd&&dur>0&&dur<1440;
              return<div style={{margin:"6px 0 10px",padding:14,borderRadius:12,background:"linear-gradient(180deg,rgba(22,28,60,0.7),rgba(20,26,60,0.55))",border:"1px solid rgba(139,124,246,0.25)",boxShadow:"0 4px 16px -6px rgba(0,0,0,0.4), 0 1px 0 0 rgba(255,255,255,0.06) inset"}} onClick={e=>e.stopPropagation()}>
                <div style={{fontSize:T.fXS,fontWeight:700,color:T.lilac,textTransform:"uppercase",letterSpacing:1.1,marginBottom:10,display:"flex",justifyContent:"space-between"}}>
                  <span>{_lang==="en"?"Edit waking":"Editar waking"}</span>
                  <span style={{color:isActive?"#fbbf24":(isLive?"#a78bfa":"#7dd3fc")}}>{isActive?(_lang==="en"?"● Live":"● Ao vivo"):(isLive?(_lang==="en"?"Current bedtime":"Bedtime atual"):(_lang==="en"?"History":"Histórico"))}</span>
                </div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:T.fXS,color:T.label,fontWeight:600,textTransform:"uppercase",letterSpacing:0.6,marginBottom:4,paddingLeft:2}}>{_lang==="en"?"Start":"Início"}</div>
                    <input type="time" value={editStart} onChange={e=>setEditStart(e.target.value)} style={{width:"100%",padding:"11px 8px",background:"rgba(14,18,48,0.7)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,color:"#e4e6f5",fontSize:T.fLG,fontWeight:700,textAlign:"center",fontVariantNumeric:"tabular-nums",outline:"none",colorScheme:"dark",boxSizing:"border-box"}}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:T.fXS,color:T.label,fontWeight:600,textTransform:"uppercase",letterSpacing:0.6,marginBottom:4,paddingLeft:2}}>{_lang==="en"?"End":"Fim"}</div>
                    <input type="time" value={editEnd} onChange={e=>setEditEnd(e.target.value)} style={{width:"100%",padding:"11px 8px",background:isActive?"linear-gradient(180deg,rgba(56,189,248,0.15),rgba(56,189,248,0.05))":"rgba(14,18,48,0.7)",border:`1px solid ${isActive?"rgba(56,189,248,0.3)":"rgba(255,255,255,0.08)"}`,borderRadius:10,color:isActive?"#7dd3fc":"#e4e6f5",fontSize:T.fLG,fontWeight:700,textAlign:"center",fontVariantNumeric:"tabular-nums",outline:"none",colorScheme:"dark",boxSizing:"border-box"}}/>
                  </div>
                </div>
                <div style={{textAlign:"center",fontSize:T.fSM,color:valid?"#9099c3":"#f87171",fontWeight:600,margin:"6px 0 10px"}}>
                  {_lang==="en"?"Duration":"Duração"}: <strong style={{color:valid?"#c4b5fd":"#f87171",fontVariantNumeric:"tabular-nums"}}>{valid?fmtDur(dur):(_lang==="en"?"invalid":"inválido")}</strong>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {/* v11.9.38: 2-step inline confirm pra remover waking (sem confirm() nativo) */}
                  {!isActive&&<button disabled={editBusy} onClick={async e=>{
                    e.stopPropagation();
                    if(!confirmRemoveWaking){
                      setConfirmRemoveWaking(true);
                      Haptic.warning();
                      setTimeout(()=>setConfirmRemoveWaking(false),3000);
                      return;
                    }
                    setConfirmRemoveWaking(false);
                    setEditBusy(true);Haptic.medium();
                    try{
                      // v11.9.140: toast+undo (achado #4 — remover despertar era permanente e
                      // mudo, o único ponto de escrita do app sem essa rede de segurança).
                      if(isLive){
                        const prevWakings=(activeTimer?.wakings)||[];
                        const nw=prevWakings.filter((_,k)=>k!==i);
                        await onSaveTimer({...activeTimer,wakings:nw});
                        showToast&&showToast(_lang==="en"?"Waking removed":"Despertar removido",async()=>{await onSaveTimer({...activeTimer,wakings:prevWakings})});
                      }else{
                        const prevWakings=entry.wakings||[];
                        const nw=prevWakings.filter((_,k)=>k!==i);
                        await onSaveEntry({...entry,_docId:undefined,wakings:nw});
                        showToast&&showToast(_lang==="en"?"Waking removed":"Despertar removido",async()=>{await onSaveEntry({...entry,_docId:undefined,wakings:prevWakings})});
                      }
                      setEditingIdx(null);Haptic.success()
                    }catch(err){Haptic.warning()}
                    setEditBusy(false)
                  }} style={{padding:confirmRemoveWaking?"9px 12px":"9px 11px",borderRadius:9,background:confirmRemoveWaking?"rgba(248,113,113,0.32)":"rgba(248,113,113,0.1)",color:confirmRemoveWaking?"#fff":"#f87171",fontSize:T.fMD,fontWeight:700,border:`1px solid ${confirmRemoveWaking?"rgba(248,113,113,0.7)":"rgba(248,113,113,0.25)"}`,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",gap:6,transition:"all .2s"}}>
                    {confirmRemoveWaking?(_lang==="en"?"Confirm?":"Confirmar?"):<svg viewBox="0 0 24 24" style={{width:12,height:12,stroke:"#f87171",fill:"none",strokeWidth:2}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6"/></svg>}
                  </button>}
                  <button onClick={e=>{e.stopPropagation();setEditingIdx(null)}} style={{flex:1,padding:"9px 10px",borderRadius:9,background:"rgba(14,18,48,0.7)",color:"#8b90b8",fontSize:T.fMD,fontWeight:700,border:"1px solid rgba(255,255,255,0.08)",cursor:"pointer"}}>{_lang==="en"?"Cancel":"Cancelar"}</button>
                  <button disabled={!valid||editBusy} onClick={async e=>{e.stopPropagation();if(!valid)return;setEditBusy(true);Haptic.medium();try{
                    // v11.9.140: toast (+undo quando dá pra restaurar com segurança — achado #4).
                    if(isActive){
                      // Live waking (currently open): close it by pushing to wakings[] and clearing nightWake.
                      // Sem undo aqui — reabrir um waking "ao vivo" reconstruindo o nightWake original
                      // é frágil (perderia o tempo real decorrido); toast avisa, sem oferecer desfazer.
                      const newWaking={time:editStart,durationMin:dur,events:(activeTimer?.nightWake?.events)||[]};
                      const newWakings=[...((activeTimer?.wakings)||[]),newWaking];
                      await onSaveTimer({...activeTimer,nightWake:null,wakings:newWakings});
                      showToast&&showToast(_lang==="en"?"Waking ended":"Despertar encerrado",null);
                    }else if(isLive){
                      // Waking already closed but inside the live bedtime — edit activeTimer.wakings[i]
                      const prevWakings=[...((activeTimer?.wakings)||[])];
                      const nw=[...prevWakings];
                      nw[i]={...nw[i],time:editStart,durationMin:dur};
                      await onSaveTimer({...activeTimer,wakings:nw});
                      showToast&&showToast(_lang==="en"?"Waking updated":"Despertar atualizado",async()=>{await onSaveTimer({...activeTimer,wakings:prevWakings})});
                    }else{
                      // Historical bedtime: update wakings[idx] of the sleep entry
                      const prevWakings=[...(entry.wakings||[])];
                      const nw=[...prevWakings];
                      nw[i]={...nw[i],time:editStart,durationMin:dur};
                      await onSaveEntry({...entry,_docId:undefined,wakings:nw});
                      showToast&&showToast(_lang==="en"?"Waking updated":"Despertar atualizado",async()=>{await onSaveEntry({...entry,_docId:undefined,wakings:prevWakings})});
                    }
                    setEditingIdx(null);Haptic.success()
                  }catch(err){Haptic.warning()}setEditBusy(false)}} style={{flex:1,padding:"9px 10px",borderRadius:9,background:valid?"linear-gradient(180deg,#9b8df8,#7c3aed)":"rgba(14,18,48,0.6)",color:valid?"#fff":"#555a80",fontSize:T.fMD,fontWeight:700,border:`1px solid ${valid?"rgba(139,124,246,0.5)":"rgba(255,255,255,0.06)"}`,boxShadow:valid?"0 4px 12px -4px rgba(139,124,246,0.4)":"none",cursor:valid&&!editBusy?"pointer":"not-allowed",opacity:editBusy?0.6:1}}>{isActive?(_lang==="en"?"End waking":"Encerrar"):(_lang==="en"?"Save":"Salvar")}</button>
                </div>
              </div>
            })()}
            {/* Events for this waking (explicit + retroactive merged) */}
            {allEventsForWaking.length>0&&<div style={{paddingLeft:6}}>
              {allEventsForWaking.map((le,j)=><EventMini key={le.id||j} le={le}/>)}
            </div>}
          </div>
        })}
        {/* Orphan events: inside bedtime but outside any waking range (refinado: secao limpa) */}
        {orphanRetro.length>0&&<div style={{borderTop:"1px solid rgba(139,124,246,0.10)",padding:"10px 18px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{display:"inline-flex",alignItems:"center",fontSize:T.fSM,fontWeight:700,color:T.purple,padding:"4px 10px",borderRadius:9,background:"rgba(167,139,250,0.13)",border:"1px solid rgba(167,139,250,0.28)"}}>
              {_lang==="en"?"Other events":"Outros eventos"}
            </span>
          </div>
          <div style={{paddingLeft:6}}>
            {orphanRetro.slice().sort((a,b)=>(a.time||"").localeCompare(b.time||"")).map((le,j)=><EventMini key={le.id||j} le={le}/>)}
          </div>
        </div>}
    </div>}
    {/* Footer hint (refinado: sem emoji, sem italico) */}
    {isLive&&<div style={{padding:"10px 18px 12px",borderTop:"1px solid rgba(139,124,246,0.10)",fontSize:T.fSM,color:T.dim,textAlign:"center",fontWeight:500}}>
      {_lang==="en"?"Saved when bedtime ends":"Consolida quando o bedtime terminar"}
    </div>}
    {/* Actions (only when expanded AND not live) — refinado */}
    {expanded&&!isLive&&<div style={{padding:"10px 14px 12px",display:"flex",gap:8,borderTop:"1px solid rgba(139,124,246,0.10)"}}>
      <button onClick={e=>{e.stopPropagation();onEdit&&onEdit(entry)}} style={{flex:1,padding:"8px 10px",borderRadius:9,background:"rgba(167,139,250,0.07)",fontSize:T.fSM,fontWeight:600,color:T.purple,border:"none",cursor:"pointer",letterSpacing:0.1}}>{_lang==="en"?"Edit":"Editar"}</button>
      {/* v11.9.140: 2-step inline confirm (era 1 toque só — achado #3 da auditoria) */}
      <button aria-label={confirmDelBedtime?(_lang==="en"?"Confirm delete":"Confirmar exclusão"):(_lang==="en"?"Delete bedtime":"Excluir bedtime")} onClick={e=>{
        e.stopPropagation();
        if(!confirmDelBedtime){setConfirmDelBedtime(true);Haptic.warning();setTimeout(()=>setConfirmDelBedtime(false),3000);return}
        setConfirmDelBedtime(false);onDelete&&onDelete(entry.id);
      }} style={{padding:confirmDelBedtime?"8px 14px":"8px 14px",borderRadius:9,background:confirmDelBedtime?"rgba(248,113,113,0.30)":"rgba(248,113,113,0.07)",border:confirmDelBedtime?"1px solid rgba(248,113,113,0.6)":"none",fontSize:T.fSM,fontWeight:700,color:confirmDelBedtime?"#fff":T.red,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all .2s"}}>
        {confirmDelBedtime?(_lang==="en"?"Sure?":"Certo?"):<Icon name="trash" size={12} color={T.red}/>}
      </button>
    </div>}
  </div>);
});

// v11.9.140: card de noite/soneca partida por splitMidnight, sem despertar em nenhuma
// metade (achado #1 da auditoria de usabilidade — as 2 metades ficavam soltas, sem
// vínculo visual; editar/apagar uma não avisava sobre a outra). Mostra as 2 entries como
// UM cartão contínuo; expandir revela cada metade com seu próprio editar/excluir — reusa
// onEdit/onDelete já existentes por entry (sem payload novo, sem risco de perda de dado).
const MidnightMergeCard = React.memo(function MidnightMergeCard({part1,part2,onDelete,onEdit}){
  const[expanded,setExpanded]=useState(false);
  const[confirmDelId,setConfirmDelId]=useState(null);
  const totalMin=(part1.durationMin||0)+(part2.durationMin||0);
  const endMs=new Date(`${part2.date}T${part2.time}`).getTime()+(part2.durationMin||0)*60000;
  const endD=new Date(endMs);
  const endT=`${String(endD.getHours()).padStart(2,"0")}:${String(endD.getMinutes()).padStart(2,"0")}`;
  const cfg=TYPES[part1.type]||{icon:"bed",color:"#c4b5fd"};
  const FragRow=({p})=>{
    const fEndMs=new Date(`${p.date}T${p.time}`).getTime()+(p.durationMin||0)*60000;
    const fEndD=new Date(fEndMs);
    const fEndT=`${String(fEndD.getHours()).padStart(2,"0")}:${String(fEndD.getMinutes()).padStart(2,"0")}`;
    return(<div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0"}}>
      <span style={{fontSize:T.fXS,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:0.4,width:48,flexShrink:0}}>{fmtRelDate(p.date)}</span>
      <button onClick={()=>onEdit&&onEdit(p)} style={{flex:1,textAlign:"left",background:"transparent",border:"none",cursor:"pointer",padding:0}}>
        <div style={{fontSize:T.fMD,fontWeight:600,color:T.heading,fontVariantNumeric:"tabular-nums"}}>{p.time} → {fEndT}</div>
        <div style={{fontSize:T.fSM,color:T.sub,marginTop:1}}>{fmtDur(p.durationMin)}</div>
      </button>
      {/* 2-step inline confirm, mesmo padrão do EventMini acima (sem confirm() nativo) */}
      <button aria-label={confirmDelId===p.id?(_lang==="en"?"Confirm delete":"Confirmar exclusão"):(_lang==="en"?"Delete":"Excluir")} onClick={()=>{
        if(confirmDelId!==p.id){setConfirmDelId(p.id);Haptic.warning();setTimeout(()=>setConfirmDelId(prev=>prev===p.id?null:prev),3000);return}
        setConfirmDelId(null);onDelete&&onDelete(p.id);
      }} className="hit44" style={{padding:confirmDelId===p.id?"6px 12px":"6px 9px",borderRadius:9,background:confirmDelId===p.id?"rgba(248,113,113,0.30)":"rgba(248,113,113,0.08)",border:confirmDelId===p.id?"1px solid rgba(248,113,113,0.6)":"none",color:"#fca5a5",fontSize:T.fSM,fontWeight:700,flexShrink:0,transition:"all .2s"}}>
        {confirmDelId===p.id?(_lang==="en"?"Sure?":"Certo?"):<Icon name="trash" size={12} color={T.red}/>}
      </button>
    </div>);
  };
  return(<div style={{position:"relative",marginBottom:8,borderRadius:18,background:"rgba(20,26,60,0.32)",border:`1px solid ${T.gBSoft}`,overflow:"hidden",contain:"layout paint"}}>
    <button onClick={()=>setExpanded(!expanded)} style={{width:"100%",padding:"14px 18px",display:"flex",alignItems:"center",gap:13,textAlign:"left",background:"transparent",border:"none",position:"relative",cursor:"pointer"}}>
      <div style={{width:42,height:42,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,...T.iconTile(cfg.color)}}>
        <Icon name={cfg.icon} size={20} color={cfg.color}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:T.f2XL,fontWeight:800,color:T.heading,letterSpacing:-0.5,fontVariantNumeric:"tabular-nums",lineHeight:1.1}}>{fmtDur(totalMin)}</div>
        <div style={{fontSize:T.fMD,color:T.sub,marginTop:3,fontVariantNumeric:"tabular-nums",fontWeight:500,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <span>{part1.time} → {endT}</span>
          {/* mesma paleta do nightBadge (EntryRow) — anotação de "atravessa a virada" */}
          <span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:T.fXS,fontWeight:700,color:"#60a5fa",background:"rgba(96,165,250,0.14)",border:"1px solid rgba(96,165,250,0.32)",borderRadius:8,padding:"2px 7px"}}><Icon name="moon" size={8} color="#60a5fa"/>{_lang==="en"?"began yesterday":"começou ontem"}</span>
        </div>
      </div>
      <div style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",color:T.dim,flexShrink:0,transform:expanded?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6"/></svg>
      </div>
    </button>
    {expanded&&<div style={{padding:"0 18px 12px",borderTop:`1px solid ${T.gBSoft}`}}>
      <FragRow p={part1}/>
      <div style={{height:1,background:T.gBSoft}}/>
      <FragRow p={part2}/>
    </div>}
  </div>);
});

// EntryRow memoizado (v10.5.1) — props estáveis após load, skip re-render do App por outras mudanças de state.
const EntryRow = React.memo(function EntryRow({entry,onDelete,onEdit,napNum,nightBadge}){const cfg=TYPES[entry.type]||{label:entry.type,icon:"star",color:T.text,bg:T.glass};let detail="";if(entry.type==="wakeup"&&entry.nightSleepMin)detail=`${fmtDur(entry.nightSleepMin)} ${_lang==="en"?"of sleep":"de sono"}`;else if(entry.ml)detail=`${entry.ml} ml`;else if(entry.type==="tummytime"&&entry.durationMin){const m=Math.floor(entry.durationMin);const s=Math.round((entry.durationMin-m)*60);detail=s>0?`${m}min ${s}s`:`${m}min`}else if(entry.durationMin)detail=fmtDur(entry.durationMin);else if(entry.subtype)detail=L(entry.subtype)||entry.subtype;else if(entry.type==="dayevent"&&entry.tag){const _t=EVENT_TAGS[entry.tag];detail=_t?`${_t.emoji} ${_lang==="en"?_t.en:_t.pt}${entry.untilDate?` → ${entry.untilDate.slice(8,10)}/${entry.untilDate.slice(5,7)}`:""}`:entry.tag}else if(entry.name)detail=entry.name+(entry.dose?` · ${entry.dose}`:"");else if(entry.value)detail=`${entry.value}°C`;else if(entry.weightKg||entry.lengthCm||entry.headCm){const parts=[];if(entry.weightKg)parts.push(`${entry.weightKg}kg`);if(entry.lengthCm)parts.push(`${entry.lengthCm}cm`);if(entry.headCm)parts.push(`${_lang==="en"?"Head":"Cab."} ${entry.headCm}cm`);detail=parts.join(" · ")}if(entry.type==="nursing"&&entry.side){if(entry.leftMin||entry.rightMin){detail=(detail?detail+" · ":"")+(_lang==="en"?"L:":"E:")+String(entry.leftMin||0)+(_lang==="en"?"m R:":"m D:")+String(entry.rightMin||0)+"m"}else{detail=(detail?detail+" · ":"")+(L(entry.side)||entry.side)}};const napLabel=napNum?(_lang==="en"?["","1st","2nd","3rd","4th","5th","6th","7th","8th"][napNum]||napNum+"th":[""," 1a"," 2a"," 3a"," 4a"," 5a"," 6a"," 7a"," 8a"][napNum]||napNum+"a"):null;
  // ── Swipe state: positive = swiped left (delete), negative = swiped right (edit) ──
  const wrapRef=useRef(null);
  const dragRef=useRef({active:false,startX:0,startY:0,dx:0,locked:false,lockedAxis:null,committed:false});
  const[dx,setDx]=useState(0);
  const[dragging,setDragging]=useState(false);
  const lastThresholdRef=useRef(0); // -1 = past edit threshold, 0 = nothing, +1 = past delete threshold
  const DISMISS_PCT=0.60;
  const COMMIT_PCT=0.85;
  const onPtrDown=(e)=>{
    dragRef.current={active:true,startX:e.clientX,startY:e.clientY,dx:0,locked:false,lockedAxis:null,committed:false};
    lastThresholdRef.current=0;
    try{e.currentTarget.setPointerCapture(e.pointerId)}catch(_){}
  };
  const onPtrMove=(e)=>{
    const d=dragRef.current;
    if(!d.active||d.committed)return;
    const dxRaw=e.clientX-d.startX;
    const dyRaw=e.clientY-d.startY;
    // Lock axis after 8px of movement: if vertical dominates, abort drag (let scroll happen)
    if(!d.locked){
      if(Math.abs(dxRaw)<8&&Math.abs(dyRaw)<8)return;
      if(Math.abs(dyRaw)>Math.abs(dxRaw)){d.active=false;return}
      d.locked=true;d.lockedAxis="x";
      setDragging(true);
    }
    d.dx=dxRaw;
    setDx(dxRaw);
    // Threshold haptic feedback
    const w=wrapRef.current?.offsetWidth||320;
    const absPct=Math.abs(dxRaw)/w;
    const dir=dxRaw>0?-1:1; // -1 = edit (right swipe), +1 = delete (left swipe)
    let nowThreshold=0;
    if(absPct>=DISMISS_PCT)nowThreshold=dir;
    if(nowThreshold!==lastThresholdRef.current){
      lastThresholdRef.current=nowThreshold;
      if(nowThreshold!==0)Haptic.light();
    }
    // Auto-commit at 85%+ without waiting for release
    if(absPct>=COMMIT_PCT&&!d.committed){
      d.committed=true;
      d.active=false;
      Haptic.medium();
      // Slide off-screen, then fire action
      const off=dxRaw>0?w:-w;
      setDx(off);
      setTimeout(()=>{
        if(dxRaw>0){onEdit&&onEdit(entry)}
        else{onDelete&&onDelete(entry.id)}
        // Reset state shortly after action (parent will re-render or remove the row)
        setDragging(false);setDx(0);
      },180);
    }
  };
  const onPtrUp=()=>{
    const d=dragRef.current;
    if(!d.active&&!d.committed){setDragging(false);return}
    if(d.committed){d.active=false;return}
    d.active=false;
    setDragging(false);
    const w=wrapRef.current?.offsetWidth||320;
    const absPct=Math.abs(d.dx)/w;
    if(absPct>=DISMISS_PCT){
      Haptic.medium();
      const off=d.dx>0?w:-w;
      setDx(off);
      setTimeout(()=>{
        if(d.dx>0){onEdit&&onEdit(entry)}
        else{onDelete&&onDelete(entry.id)}
        setDx(0);
      },220);
    }else{
      setDx(0);
    }
  };
  // Pointer cancel = iOS cancelou o gesto (scroll conflict, visibility change, etc).
  // Nunca dispara ação — só reseta estado visualmente. v11.0.
  const onPtrCancel=()=>{
    const d=dragRef.current;
    d.active=false;d.locked=false;d.committed=false;d.dx=0;
    lastThresholdRef.current=0;
    setDragging(false);
    setDx(0);
  };
  // Reset drag se app vai pra background enquanto dedo tá no meio do gesto.
  // Senão o iOS pode dispensar o pointer e ficar com state travado.
  useEffect(()=>{
    const onVis=()=>{if(document.hidden)onPtrCancel()};
    document.addEventListener("visibilitychange",onVis);
    return()=>document.removeEventListener("visibilitychange",onVis);
  },[]);
  // Visual: opacity of overlays scales with swipe distance
  const w=wrapRef.current?.offsetWidth||320;
  const absPct=Math.min(1,Math.abs(dx)/w);
  const editVisible=dx>0;
  const deleteVisible=dx<0;
  const overlayOpacity=Math.min(1,absPct/DISMISS_PCT);
  const editPastThreshold=dx>0&&absPct>=DISMISS_PCT;
  const deletePastThreshold=dx<0&&absPct>=DISMISS_PCT;
  return(<div ref={wrapRef} style={{position:"relative",marginBottom:4,overflow:"hidden",borderRadius:14,contentVisibility:"auto",containIntrinsicSize:"auto 52px"}}>
  {/* Edit overlay (left side, revealed when swiping right) */}
  {editVisible&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:Math.abs(dx),background:editPastThreshold?"linear-gradient(90deg,rgba(96,165,250,0.32),rgba(96,165,250,0.18))":"linear-gradient(90deg,rgba(96,165,250,0.18),rgba(96,165,250,0.08))",display:"flex",alignItems:"center",justifyContent:"flex-start",paddingLeft:24,borderRadius:"18px 0 0 18px",opacity:overlayOpacity,transition:dragging?"none":"opacity .2s ease, background .2s ease"}}><div style={{display:"flex",alignItems:"center",gap:8,color:"#7dd3fc"}}><Icon name="pencil" size={20} color="#7dd3fc"/><span style={{fontSize:T.fMD,fontWeight:700,letterSpacing:-0.2,opacity:editPastThreshold?1:0,transition:"opacity .15s ease"}}>{_lang==="en"?"Edit":"Editar"}</span></div></div>}
  {/* Delete overlay (right side, revealed when swiping left) */}
  {deleteVisible&&<div style={{position:"absolute",right:0,top:0,bottom:0,width:Math.abs(dx),background:deletePastThreshold?"linear-gradient(270deg,rgba(248,113,113,0.36),rgba(248,113,113,0.2))":"linear-gradient(270deg,rgba(248,113,113,0.2),rgba(248,113,113,0.08))",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:24,borderRadius:"0 18px 18px 0",opacity:overlayOpacity,transition:dragging?"none":"opacity .2s ease, background .2s ease"}}><div style={{display:"flex",alignItems:"center",gap:8,color:T.red}}><span style={{fontSize:T.fMD,fontWeight:700,letterSpacing:-0.2,opacity:deletePastThreshold?1:0,transition:"opacity .15s ease"}}>{_lang==="en"?"Delete":"Excluir"}</span><Icon name="trash" size={20} color={T.red}/></div></div>}
  <div data-no-swipe="1" onPointerDown={onPtrDown} onPointerMove={onPtrMove} onPointerUp={onPtrUp} onPointerCancel={onPtrCancel} style={{position:"relative",display:"flex",alignItems:"center",gap:10,padding:"6px 14px 6px 16px",background:"rgba(22,28,60,0.65)",borderRadius:14,border:`1px solid ${T.gBSoft}`,boxShadow:T.insetTop,transform:`translateX(${dx}px)`,transition:dragging?"none":"transform .35s cubic-bezier(0.22,1,0.36,1)",overflow:"hidden",touchAction:"pan-y"}}>
  {/* Colored stripe (replaces borderLeft for proper rendering with overflow+transform) */}
  <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:`linear-gradient(180deg,${cfg.color},${cfg.color}50)`,borderRadius:"0 2px 2px 0",pointerEvents:"none"}}/>
  <button onClick={()=>{if(Math.abs(dx)<5)onEdit&&onEdit(entry)}} style={{width:30,height:30,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,...T.iconTile(cfg.color)}}><Icon name={cfg.icon} size={14} color={cfg.color}/></button>
  <button onClick={()=>{if(Math.abs(dx)<5)onEdit&&onEdit(entry)}} style={{flex:1,textAlign:"left",minWidth:0,lineHeight:1.2}}><div style={{fontSize:T.fMD,fontWeight:600,letterSpacing:-0.15,color:T.heading,display:"flex",alignItems:"center",gap:5,lineHeight:1.2}}>{napLabel&&<span style={{display:"inline-block",padding:"1px 5px",borderRadius:4,background:`${cfg.color}25`,color:cfg.color,fontSize:T.fXS,fontWeight:700}}>{napLabel}</span>}<span>{cfg.label[_lang]||cfg.label.en}</span>{nightBadge&&<span title={_lang==="en"?"During bedtime":"Durante bedtime"} style={{display:"inline-flex",alignItems:"center",gap:2,padding:"0 5px 0 4px",borderRadius:5,background:"rgba(96,165,250,0.14)",border:"1px solid rgba(96,165,250,0.32)",fontSize:T.fXS,fontWeight:700,color:"#60a5fa",letterSpacing:0.2}}><Icon name="moon" size={8} color="#60a5fa"/>{_lang==="en"?"night":"noite"}</span>}</div>{detail&&<div style={{fontSize:T.fSM,color:"#9099c3",marginTop:0,fontWeight:500,lineHeight:1.15}}>{detail}</div>}</button>
  <div style={{textAlign:"right",flexShrink:0,lineHeight:1.1}}>{(entry.type==="sleep"||entry.type==="nap")&&entry.durationMin?(()=>{const endMs=new Date(`${entry.date}T${entry.time}`).getTime()+entry.durationMin*60000;const endD=new Date(endMs);const endT=`${String(endD.getHours()).padStart(2,"0")}:${String(endD.getMinutes()).padStart(2,"0")}`;const endDt=`${endD.getFullYear()}-${String(endD.getMonth()+1).padStart(2,"0")}-${String(endD.getDate()).padStart(2,"0")}`;return<><div style={{fontSize:T.fMD,fontWeight:700,color:T.heading,fontVariantNumeric:"tabular-nums",letterSpacing:-0.3}}>{`${entry.time}\u2013${endT}`}</div><div style={{fontSize:T.fSM,color:T.sub,fontWeight:500,marginTop:1}}>{timeSince(endDt,endT)}</div></>})():<><div style={{fontSize:T.fMD,fontWeight:700,color:T.heading,fontVariantNumeric:"tabular-nums",letterSpacing:-0.3}}>{entry.time}</div><div style={{fontSize:T.fSM,color:T.sub,fontWeight:500,marginTop:1}}>{timeSince(entry.date,entry.time)}</div></>}</div>
</div></div>)});

