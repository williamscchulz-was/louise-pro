function AddForm({type,onSave,onSaveBatch,savedMeds,onSaveMeds,editEntry,lastBottleMl,lastBottleEntry,feedingIntervalMin,topMl,onStartTimer,suggestedMl,allEntries}){const cfg=TYPES[type];const ed=editEntry||{};
  const[date,setDate]=useState(ed.date||todayStr());
  // v11.9.3: Bottle volta a usar nowTime (revertido o smart default da v11.9.1 — usuário
  // prefere registrar no horário real, não no horário esperado).
  const[time,setTime]=useState(ed.time||nowTime());
  // v11.9.106: defaults inteligentes por horário — ml típico daquela hora (não o último ml cru)
  // e subtype de fralda mais provável da hora. Caem no fallback antigo com pouco dado.
  const _nm0=new Date(),_nowMin=_nm0.getHours()*60+_nm0.getMinutes();
  const[ml,setMl]=useState(ed.ml?String(ed.ml):(type==="bottle"&&!editEntry?String(hourlyTypicalMl(allEntries,_nowMin)||suggestedMl||lastBottleMl||""):""));const[durH,setDurH]=useState(ed.durationMin?String(Math.floor(ed.durationMin/60)):"");const[durM,setDurM]=useState(ed.durationMin?String(ed.durationMin%60):"");
  const[diaperT,setDiaperT]=useState(ed.subtype||(type==="diaper"&&!editEntry?(likelyDiaperSubtype(allEntries,_nowMin)||"wet"):"wet"));const[medN,setMedN]=useState(ed.name||"");const[medD,setMedD]=useState(ed.dose||"");
  const[tempV,setTempV]=useState(ed.value?String(ed.value):"");const[side,setSide]=useState(ed.side||"left");const[nurseM,setNurseM]=useState(ed.durationMin&&type==="nursing"?String(ed.durationMin):"");
  const[tumM,setTumM]=useState(ed.durationMin&&type==="tummytime"?String(Math.floor(ed.durationMin)):"");
  const[tumS,setTumS]=useState(ed.durationMin&&type==="tummytime"?String(Math.round((ed.durationMin-Math.floor(ed.durationMin))*60)):"");
  const[weightKg,setWeightKg]=useState(ed.weightKg?String(ed.weightKg):"");const[lengthCm,setLengthCm]=useState(ed.lengthCm?String(ed.lengthCm):"");
  const[headCm,setHeadCm]=useState(ed.headCm?String(ed.headCm):"");const[notes,setNotes]=useState(ed.notes||"");const[showML,setShowML]=useState(false);
  const[endTime,setEndTime]=useState("");const[durMode,setDurMode]=useState("dur");
  const[nMN,setNMN]=useState("");const[nMD,setNMD]=useState("");const mRef=useRef(null);
  const isEdit=!!editEntry;
  // v11.8.0: medicine multi-select + drops picker. Em edit mode mantem single-select
  // (edita s\u00f3 uma entry por vez). No add mode, usu\u00e1rio pode marcar varios meds de
  // uma vez (combo manh\u00e3: Floripa+VitD+C\u00f3licaliv). Meds sem dose abrem drops picker 1-6.
  const[selectedMeds,setSelectedMeds]=useState(()=>{
    if(type==="medicine"&&editEntry&&editEntry.name)return new Set([editEntry.name]);
    return new Set();
  });
  // v11.8.1: drops picker vira Modal popup (antes era stage inline).
  const[dropsOpen,setDropsOpen]=useState(false);
  const pendingMedsRef=useRef({fixedMeds:[],dropMeds:[],doses:{}});
  const[currentDropIdx,setCurrentDropIdx]=useState(0);
  // v11.9.22: long-press num chip de med abre form pre-populado pra edit/delete.
  const[editingMedName,setEditingMedName]=useState(null);
  // v11.9.35: confirm 2-step pra delete de med (em vez de confirm() nativo)
  const[confirmDelMed,setConfirmDelMed]=useState(false);
  const medPressRef=useRef({timer:null,fired:false});
  const toggleMed=(name)=>{
    if(medPressRef.current.fired){medPressRef.current.fired=false;return}
    setSelectedMeds(s=>{const n=new Set(s);if(n.has(name))n.delete(name);else n.add(name);return n});
  };
  const onMedLongPress=(med)=>{
    setEditingMedName(med.name);
    setMedN(med.name);
    setMedD(med.dose||"");
    setShowML(true);
    Haptic.medium();
  };
  const startMedPress=(med)=>{
    if(medPressRef.current.timer)clearTimeout(medPressRef.current.timer);
    medPressRef.current.fired=false;
    medPressRef.current.timer=setTimeout(()=>{
      medPressRef.current.fired=true;
      onMedLongPress(med);
    },550);
  };
  const endMedPress=()=>{
    if(medPressRef.current.timer){clearTimeout(medPressRef.current.timer);medPressRef.current.timer=null}
  };
  useEffect(()=>{if(type==="bottle"&&mRef.current)mRef.current.focus()},[type]);
  // v11.7.3: double-submit guard + validation feedback. Antes: clique em Save enquanto a
  // Firestore write ainda resolvia criava entry duplicada; valida\u00e7\u00e3o vazia retornava
  // silenciosamente (bot\u00e3o parecia morto). Agora: guard + shake + haptic.warning se inv\u00e1lido.
  const[saving,setSaving]=useState(false);
  const savingRef=useRef(false);
  const[shakeFlash,setShakeFlash]=useState(0);
  // v11.9.107: aviso suave (anti-dose-dupla / outlier). guardMsg!=null → o botão pede um
  // 2º toque pra confirmar; muda de valor → re-arma (limpa o aviso).
  const[guardMsg,setGuardMsg]=useState(null);
  useEffect(()=>{setGuardMsg(null)},[ml,tempV,weightKg,lengthCm,headCm,durH,durM,endTime,tumM,tumS,medN,selectedMeds,diaperT,nurseM,side,time,date]);
  const invalid=(msg)=>{Haptic.warning();setShakeFlash(n=>n+1)};
  const doSave=async()=>{
    if(savingRef.current||saving)return;
    const b={type,date,time,notes:notes.trim()||undefined,id:isEdit?ed.id:uid()};
    let payload=null;
    if(type==="bottle"){if(!ml){invalid();return}payload={...b,ml:parseInt(ml)}}
    else if(type==="nursing")payload={...b,side,durationMin:nurseM?parseInt(nurseM):undefined};
    else if(type==="sleep"||type==="nap"){
      let t2;
      if(durMode==="end"&&endTime){
        const[sh,sm]=time.split(":").map(Number);const[eh,em]=endTime.split(":").map(Number);
        let diff=(eh*60+em)-(sh*60+sm);if(diff<=0)diff+=1440;t2=diff;
      }else{t2=(parseInt(durH)||0)*60+(parseInt(durM)||0)}
      if(!t2){invalid();return}payload={...b,durationMin:t2}}
    else if(type==="wakeup"||type==="nightwaking"||type==="bath")payload=b;
    else if(type==="tummytime"){const m=parseInt(tumM)||0;const s=parseInt(tumS)||0;const total=m+s/60;if(total<=0){invalid();return}payload={...b,durationMin:total}}
    else if(type==="diaper")payload={...b,subtype:diaperT};
    else if(type==="medicine"){
      // Edit mode: comportamento single-med (mant\u00e9m compat com entries existentes).
      if(isEdit){if(!medN.trim()){invalid();return}payload={...b,name:medN.trim(),dose:medD.trim()||undefined}}
      else{
        // v11.8.0: multi-select + drops picker.
        const names=Array.from(selectedMeds);
        if(names.length===0){invalid();return}
        const picked=names.map(n=>savedMeds.find(m=>m.name===n)).filter(Boolean);
        if(!guardMsg){const w=picked.map(m=>entryWarn("medicine",{type:"medicine",name:m.name,date,time,id:""},allEntries)).find(Boolean);if(w){setGuardMsg(_lang==="en"?w.en:w.pt);Haptic.warning();return}}
        const fixedMeds=picked.filter(m=>m.dose&&m.dose.trim());
        const dropMeds=picked.filter(m=>!m.dose||!m.dose.trim());
        if(dropMeds.length>0){
          // v11.8.1: abre Modal popup (n\u00e3o troca stage).
          pendingMedsRef.current={fixedMeds,dropMeds,doses:{}};
          setCurrentDropIdx(0);
          setDropsOpen(true);
          return;
        }
        // Todos fixos — batch save e fecha.
        const entries=fixedMeds.map(m=>({type:"medicine",date,time,name:m.name,dose:m.dose,id:uid()}));
        savingRef.current=true;setSaving(true);
        try{await onSaveBatch(entries)}catch(e){}
        return;
      }
    }
    // v11.9.92/12.0.0: vírgula decimal — os inputs são type="text" inputMode="decimal"
    // (type="number" DESCARTAVA a vírgula antes do onChange). pF troca vírgula→ponto e
    // blinda contra NaN (retorna undefined), pra nunca gravar lixo no Firestore.
    else if(type==="temperature"){const tv=parseFloat(String(tempV).replace(",","."));if(!Number.isFinite(tv)){invalid();return}payload={...b,value:tv}}
    else if(type==="growth"){const pF=v=>{const n=parseFloat(String(v).replace(",","."));return Number.isFinite(n)?n:undefined};payload={...b,weightKg:pF(weightKg),lengthCm:pF(lengthCm),headCm:pF(headCm)}}
    if(!payload)return;
    if(!guardMsg){const w=entryWarn(type,payload,allEntries);if(w){setGuardMsg(_lang==="en"?w.en:w.pt);Haptic.warning();return}}
    savingRef.current=true;setSaving(true);
    try{await onSave(payload)}catch(e){}
    // N\u00e3o reseta saving: parent desmonta o form via setFormType(null) quando termina.
  };
  const inp=INP_BASE;
  const isToday=date===todayStr();
  // v11.9.15: usa fmtRelDate ("Ontem", "Anteontem", weekday, ou data curta) em vez de só short date.
  const dateLbl=isToday?L("today"):fmtRelDate(date);
  // v11.9.101: tipos-timer ganham "Iniciar timer" no topo do form (era so tummytime).
  // Cor clara por tipo, fiel ao vocabulario do timer ativo (roxo/azul/ambar).
  const isTimerType=type==="sleep"||type==="nap"||type==="nursing"||type==="tummytime"||type==="bath";
  const tLight=type==="tummytime"?"#fde68a":(type==="nursing"||type==="bath")?"#7dd3fc":"#c4b5fd";
  return(<div style={{paddingBottom:20}}>
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"0 20px 16px"}}>
      <div style={{width:32,height:32,borderRadius:10,background:cfg.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={cfg.icon} size={18} color={cfg.color}/></div>
      <span style={{fontSize:T.fXL,fontWeight:700}}>{cfg.label[_lang]||cfg.label.en}</span>
    </div>
    <div style={{padding:"0 20px"}}>
      {isTimerType&&!isEdit&&onStartTimer&&<>
        <button onClick={()=>onStartTimer(type)} style={{width:"100%",padding:16,borderRadius:16,background:`linear-gradient(180deg,${cfg.color}28,${cfg.color}10)`,color:tLight,fontSize:T.fLG,fontWeight:700,letterSpacing:-0.2,border:`1px solid ${cfg.color}55`,boxShadow:`0 1px 0 0 rgba(255,255,255,0.1) inset, 0 4px 12px -4px ${cfg.color}35`,marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:10,cursor:"pointer"}}><Icon name="play" size={14} color={tLight}/>{_lang==="en"?"Start timer now":"Iniciar timer agora"}</button>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}><span style={{flex:1,height:1,background:T.gB}}/><span style={{fontSize:T.fSM,color:T.dim,fontWeight:600}}>{_lang==="en"?"or log manually":"ou registrar manual"}</span><span style={{flex:1,height:1,background:T.gB}}/></div>
      </>}
      {/* Date + Time row */}
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:10,marginBottom:18}}>
        <Fld label={(_lang==="en"?"Day · ":"Dia · ")+dateLbl}><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{...inp,colorScheme:"dark"}}/></Fld>
        <Fld label={L("time")}><input type="time" value={time} onChange={e=>setTime(e.target.value)} style={{...inp,colorScheme:"dark"}}/></Fld>
      </div>
      {type==="bottle"&&<><Fld label={_lang==="en"?"Amount (ml)":"Quantidade (ml)"}><input ref={mRef} type="number" inputMode="numeric" placeholder="0" value={ml} onChange={e=>setMl(e.target.value)} style={{...inp,fontSize:36,fontWeight:800,textAlign:"center",padding:"16px"}}/></Fld>
        <div style={{display:"flex",gap:8,marginBottom:20}}>{(topMl&&topMl.length>0?[...new Set([...topMl,lastBottleMl].filter(Boolean))].slice(0,4):[60,90,120]).map((v,i)=><button key={v} onClick={()=>setMl(String(v))} style={{flex:1,padding:"10px 0",borderRadius:10,background:ml===String(v)?T.green:T.glass,color:ml===String(v)?T.bg1:T.text,border:`1px solid ${ml===String(v)?T.green:T.gB}`,textAlign:"center"}}><div style={{fontSize:T.fLG,fontWeight:800}}>{v}</div>{i===0&&topMl?.length>0&&<div style={{fontSize:T.fXS,color:ml===String(v)?T.bg1:T.dim,marginTop:1}}>{_lang==="en"?"top":"mais"}</div>}</button>)}</div></>}
      {type==="nursing"&&<><Fld label={L("side")}><Seg opts={[{v:"left",l:L("left")},{v:"right",l:L("right")},{v:"both",l:L("both")}]} val={side} set={setSide} color={cfg.color}/></Fld><Fld label={`${L("duration")} (min)`}><input type="number" inputMode="numeric" placeholder="15" value={nurseM} onChange={e=>setNurseM(e.target.value)} style={inp}/></Fld></>}
      {type==="tummytime"&&<Fld label={L("duration")}><div style={{display:"flex",gap:10,alignItems:"center"}}><input type="number" inputMode="numeric" placeholder="0" value={tumM} onChange={e=>setTumM(e.target.value)} style={{...inp,flex:1,textAlign:"center",fontSize:T.f3XL,fontWeight:800}}/><span style={{color:T.dim,fontWeight:700}}>min</span><input type="number" inputMode="numeric" placeholder="0" value={tumS} onChange={e=>setTumS(e.target.value)} style={{...inp,flex:1,textAlign:"center",fontSize:T.f3XL,fontWeight:800}}/><span style={{color:T.dim,fontWeight:700}}>s</span></div></Fld>}
      {(type==="sleep"||type==="nap")&&<>
        <div style={{display:"flex",gap:4,marginBottom:14,background:T.glass,borderRadius:10,padding:3,border:`1px solid ${T.gB}`}}>
          <button onClick={()=>setDurMode("dur")} style={{flex:1,padding:"8px 0",borderRadius:8,fontSize:T.fMD,fontWeight:700,background:durMode==="dur"?T.purple:"transparent",color:durMode==="dur"?"#fff":T.sub}}>{L("duration")}</button>
          <button onClick={()=>setDurMode("end")} style={{flex:1,padding:"8px 0",borderRadius:8,fontSize:T.fMD,fontWeight:700,background:durMode==="end"?T.purple:"transparent",color:durMode==="end"?"#fff":T.sub}}>{L("endTime")}</button>
        </div>
        {durMode==="dur"?<Fld label={L("duration")}><div style={{display:"flex",gap:10,alignItems:"center"}}><input type="number" inputMode="numeric" placeholder="0" value={durH} onChange={e=>setDurH(e.target.value)} style={{...inp,flex:1,textAlign:"center",fontSize:T.f3XL,fontWeight:800}}/><span style={{color:T.dim,fontWeight:700}}>h</span><input type="number" inputMode="numeric" placeholder="0" value={durM} onChange={e=>setDurM(e.target.value)} style={{...inp,flex:1,textAlign:"center",fontSize:T.f3XL,fontWeight:800}}/><span style={{color:T.dim,fontWeight:700}}>m</span></div></Fld>
        :<Fld label={L("wokeAt")}><input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} style={{...inp,colorScheme:"dark",fontSize:T.f3XL,fontWeight:800,textAlign:"center",padding:"14px 16px"}}/></Fld>}
        {durMode==="end"&&endTime&&time&&<div style={{fontSize:T.fSM,color:T.sub,marginBottom:12,textAlign:"center"}}>{(()=>{const[sh,sm]=time.split(":").map(Number);const[eh,em]=endTime.split(":").map(Number);let d=(eh*60+em)-(sh*60+sm);if(d<=0)d+=1440;const lbl=_lang==="en"?"Duration":"Duração";const nextDay=_lang==="en"?" (next day)":" (próximo dia)";return`${lbl}: ${fmtDur(d)}${d>720?nextDay:""}`})()}</div>}
      </>}
      {type==="diaper"&&<Fld label={_lang==="en"?"Type":"Tipo"}><Seg opts={[{v:"wet",l:L("wet")},{v:"dirty",l:L("dirty")},{v:"both",l:L("both")}]} val={diaperT} set={setDiaperT} color={cfg.color}/></Fld>}
      {type==="medicine"&&isEdit&&<>
        {/* Edit mode: mantem o layout antigo single-med (compat com entries existentes). */}
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:18}}>
          {savedMeds.map((m,i)=><button key={i} onClick={()=>{setMedN(m.name);setMedD(m.dose||"");setShowML(false)}} style={{flex:"1 1 calc(50% - 4px)",padding:"10px 14px",borderRadius:12,background:medN===m.name?`${T.amber}20`:T.glass,border:`1px solid ${medN===m.name?`${T.amber}55`:T.gB}`,textAlign:"left",boxShadow:medN===m.name?`0 0 12px ${T.amber}15`:"none"}}>
            <div style={{fontSize:T.fMD,fontWeight:700,color:medN===m.name?T.amber:T.text}}>{m.name}</div>
            {m.dose&&<div style={{fontSize:T.fSM,color:medN===m.name?T.amber:T.dim,opacity:0.7,marginTop:2}}>{m.dose}</div>}
          </button>)}
          <button onClick={()=>{setMedN("");setMedD("");setShowML(true)}} style={{flex:"1 1 calc(50% - 4px)",padding:"10px 14px",borderRadius:12,background:showML?`${T.amber}20`:"transparent",border:`1px dashed ${showML?`${T.amber}55`:T.gB}`,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <Icon name="plus" size={14} color={T.dim}/><span style={{fontSize:T.fMD,fontWeight:600,color:T.dim}}>{_lang==="en"?"Other":"Outro"}</span>
          </button>
        </div>
        {showML&&<><Fld label={L("name")}><input type="text" placeholder={L("name")} value={medN} onChange={e=>setMedN(e.target.value)} style={inp}/></Fld>
        <Fld label={L("dose")}><input type="text" placeholder={_lang==="en"?"e.g. 3 drops":"Ex: 3 gotas"} value={medD} onChange={e=>setMedD(e.target.value)} style={inp}/></Fld></>}
      </>}
      {type==="medicine"&&!isEdit&&<>
        {/* v11.8.0: multi-select chips. Meds sem dose mostram gota e abrem picker no save. */}
        <div style={{fontSize:T.fSM,fontWeight:700,color:T.dim,letterSpacing:0.4,margin:"0 0 8px 4px",textTransform:"uppercase"}}>{_lang==="en"?"Select (1 or more)":"Selecione (1 ou mais)"}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
          {savedMeds.map((m,i)=>{
            const asks=!m.dose||!m.dose.trim();
            const on=selectedMeds.has(m.name);
            return(<button key={i} onClick={()=>toggleMed(m.name)} onPointerDown={()=>startMedPress(m)} onPointerUp={endMedPress} onPointerCancel={endMedPress} onPointerMove={endMedPress} style={{flex:"1 1 calc(50% - 4px)",padding:"10px 30px 10px 14px",borderRadius:12,position:"relative",background:on?`${T.amber}24`:T.glass,border:`1px solid ${on?`${T.amber}88`:T.gB}`,textAlign:"left",boxShadow:on?`0 0 12px ${T.amber}15`:"none",transition:"all .2s"}}>
              <div style={{fontSize:T.fMD,fontWeight:700,color:on?T.amber:T.text,letterSpacing:-0.1}}>{m.name}</div>
              <div style={{fontSize:T.fSM,color:on?`${T.amber}cc`:T.dim,marginTop:2,opacity:asks?0.85:0.7,fontStyle:asks?"italic":"normal"}}>
                {asks?(_lang==="en"?"asks drops on save":"pergunta ao salvar"):m.dose}
              </div>
              {asks&&<span style={{position:"absolute",top:6,right:28,fontSize:T.fSM,opacity:on?0.95:0.5}}>{"\uD83D\uDCA7"}</span>}
              <span style={{position:"absolute",top:10,right:10,width:16,height:16,borderRadius:"50%",border:`1.5px solid ${on?T.amber:T.gB}`,background:on?T.amber:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:T.fSM,fontWeight:800,color:on?T.bg1:"transparent"}}>{on?"\u2713":""}</span>
            </button>);
          })}
          <button onClick={()=>{setMedN("");setMedD("");setEditingMedName(null);setShowML(v=>!v)}} style={{flex:"1 1 calc(50% - 4px)",padding:"10px 14px",borderRadius:12,background:showML&&!editingMedName?`${T.amber}14`:"transparent",border:`1px dashed ${showML&&!editingMedName?`${T.amber}55`:T.gB}`,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <Icon name="plus" size={14} color={T.dim}/><span style={{fontSize:T.fMD,fontWeight:600,color:T.dim}}>{_lang==="en"?"Other":"Outro"}</span>
          </button>
        </div>
        {showML&&<div style={{padding:12,borderRadius:12,background:"rgba(20,26,60,0.4)",border:`1px solid ${T.gBSoft}`,marginBottom:12}}>
          {editingMedName&&<div style={{fontSize:T.fSM,color:T.amber,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase",marginBottom:8,padding:"0 4px"}}>{_lang==="en"?`Editing "${editingMedName}"`:`Editando "${editingMedName}"`}</div>}
          <Fld label={L("name")}><input type="text" placeholder={_lang==="en"?"e.g. Novalgina":"Ex: Novalgina"} value={medN} onChange={e=>setMedN(e.target.value)} style={inp}/></Fld>
          <Fld label={`${L("dose")} \u00b7 ${_lang==="en"?"leave empty to ask drops":"deixe vazio pra pedir gotas"}`}><input type="text" placeholder={_lang==="en"?"e.g. 3 drops, 2.5ml":"Ex: 3 gotas, 2.5ml"} value={medD} onChange={e=>setMedD(e.target.value)} style={inp}/></Fld>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            {/* v11.9.35: confirm 2-step inline (em vez de confirm() nativo que sai do tema) */}
            {editingMedName&&<button onClick={async()=>{
              if(!confirmDelMed){
                setConfirmDelMed(true);
                Haptic.warning();
                setTimeout(()=>setConfirmDelMed(false),3000);
                return;
              }
              const newList=savedMeds.filter(x=>x.name.toLowerCase()!==editingMedName.toLowerCase());
              await onSaveMeds(newList);
              setSelectedMeds(s=>{const n=new Set(s);n.delete(editingMedName);return n});
              setShowML(false);setMedN("");setMedD("");setEditingMedName(null);setConfirmDelMed(false);Haptic.warning();
            }} style={{flex:"0 0 auto",padding:"12px 14px",borderRadius:10,background:confirmDelMed?"rgba(248,113,113,0.32)":"rgba(248,113,113,0.12)",border:`1px solid ${confirmDelMed?"rgba(248,113,113,0.7)":"rgba(248,113,113,0.32)"}`,color:confirmDelMed?"#fff":"#fca5a5",fontSize:T.fMD,fontWeight:700,transition:"all .2s"}}>{confirmDelMed?(_lang==="en"?"Confirm?":"Confirmar?"):(_lang==="en"?"Delete":"Excluir")}</button>}
            <button onClick={async()=>{
              const nm=medN.trim();if(!nm){invalid();return}
              // Remove old entry if name changed during edit
              const removeKey=(editingMedName||nm).toLowerCase();
              const newList=[...savedMeds.filter(x=>x.name.toLowerCase()!==removeKey&&x.name.toLowerCase()!==nm.toLowerCase()),{name:nm,dose:medD.trim()||""}];
              await onSaveMeds(newList);
              setSelectedMeds(s=>{const n=new Set(s);if(editingMedName&&editingMedName!==nm)n.delete(editingMedName);n.add(nm);return n});
              setShowML(false);setMedN("");setMedD("");setEditingMedName(null);Haptic.success();
            }} style={{flex:1,padding:12,borderRadius:10,background:T.amber,border:"none",color:T.bg1,fontSize:T.fMD,fontWeight:800}}>{editingMedName?(_lang==="en"?"Save":"Salvar"):(_lang==="en"?"Save & select":"Salvar e selecionar")}</button>
          </div>
          {editingMedName&&<div style={{fontSize:T.fSM,color:T.dim,marginTop:8,textAlign:"center",fontStyle:"italic"}}>{_lang==="en"?"Tip: long-press a med chip to edit":"Dica: pressione e segure um med pra editar"}</div>}
        </div>}
      </>}
      {/* v11.8.1: Drops picker agora \u00e9 Modal popup sobre o form. */}
      <Modal open={dropsOpen} onClose={()=>setDropsOpen(false)}>
        {(()=>{
          const pending=pendingMedsRef.current;
          const cur=pending.dropMeds[currentDropIdx];
          const totalDrops=pending.dropMeds.length;
          if(!cur)return null;
          const pickDrop=async(n)=>{
            pending.doses[cur.name]=n;
            const nextIdx=currentDropIdx+1;
            if(nextIdx<totalDrops){setCurrentDropIdx(nextIdx);Haptic.light();return}
            setDropsOpen(false);
            const fixedEntries=pending.fixedMeds.map(m=>({type:"medicine",date,time,name:m.name,dose:m.dose,id:uid()}));
            const dropEntries=pending.dropMeds.map(m=>{
              const d=pending.doses[m.name]||1;
              const doseStr=_lang==="en"?`${d} drop${d>1?"s":""}`:`${d} gota${d>1?"s":""}`;
              return{type:"medicine",date,time,name:m.name,dose:doseStr,id:uid()};
            });
            savingRef.current=true;setSaving(true);
            try{await onSaveBatch([...fixedEntries,...dropEntries])}catch(e){}
          };
          return(<div style={{padding:"8px 4px"}}>
            {totalDrops>1&&<div style={{display:"flex",gap:4,marginBottom:12}}>{pending.dropMeds.map((_,i)=><span key={i} style={{flex:1,height:3,borderRadius:2,background:i<currentDropIdx?T.green:i===currentDropIdx?T.amber:"rgba(139,124,246,0.18)"}}/>)}</div>}
            <div style={{textAlign:"center",padding:"8px 0 14px"}}>
              <div style={{width:56,height:56,borderRadius:18,background:`${T.amber}1a`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:T.f3XL}}>{"\uD83D\uDCA7"}</div>
              <div style={{fontSize:T.f2XL,fontWeight:800,letterSpacing:-0.4,marginBottom:4}}>{cur.name}</div>
              <div style={{fontSize:T.fMD,color:T.sub}}>{_lang==="en"?"How many drops?":"Quantas gotas?"}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[1,2,3,4,5,6].map(n=><button key={n} onClick={()=>pickDrop(n)} style={{padding:"18px 0",borderRadius:16,background:`linear-gradient(180deg,rgba(20,26,60,0.8),rgba(14,18,48,0.5))`,border:`1px solid ${T.gB}`,color:T.amber,fontSize:T.f3XL,fontWeight:800,letterSpacing:-0.5,boxShadow:"0 1px 0 0 rgba(255,255,255,0.05) inset",cursor:"pointer"}}>
                {n}<span style={{display:"block",fontSize:T.fXS,fontWeight:700,color:T.dim,letterSpacing:1.5,marginTop:3,opacity:0.8}}>{_lang==="en"?(n===1?"DROP":"DROPS"):(n===1?"GOTA":"GOTAS")}</span>
              </button>)}
            </div>
          </div>);
        })()}
      </Modal>
      {type==="temperature"&&<Fld label={`${_lang==="en"?"Temperature":"Temperatura"} (°C)`}><input type="text" inputMode="decimal" placeholder={_lang==="en"?"36.5":"36,5"} value={tempV} onChange={e=>setTempV(e.target.value.replace(/[^0-9.,]/g,""))} style={{...inp,fontSize:36,fontWeight:800,textAlign:"center"}}/></Fld>}
      {type==="growth"&&<><Fld label={`${L("weight")} (kg)`}><input type="text" inputMode="decimal" placeholder={_lang==="en"?"e.g. 4.5":"Ex: 4,5"} value={weightKg} onChange={e=>setWeightKg(e.target.value.replace(/[^0-9.,]/g,""))} style={{...inp,fontSize:T.f3XL,fontWeight:800,textAlign:"center"}}/></Fld><Fld label={`${_lang==="en"?"Length":"Comprimento"} (cm)`}><input type="text" inputMode="decimal" placeholder={_lang==="en"?"e.g. 55.0":"Ex: 55,0"} value={lengthCm} onChange={e=>setLengthCm(e.target.value.replace(/[^0-9.,]/g,""))} style={{...inp,fontSize:T.f3XL,fontWeight:800,textAlign:"center"}}/></Fld><Fld label={`${L("head")} (cm)`}><input type="text" inputMode="decimal" placeholder={_lang==="en"?"e.g. 37.0":"Ex: 37,0"} value={headCm} onChange={e=>setHeadCm(e.target.value.replace(/[^0-9.,]/g,""))} style={{...inp,fontSize:T.f3XL,fontWeight:800,textAlign:"center"}}/></Fld></>}
      {/* v11.8.0: notes removido de medicine. Tambem nao mostra em drops stage. */}
      {type!=="medicine"&&<Fld label={L("notes")}><textarea placeholder={_lang==="en"?"Note...":"Anotação..."} value={notes} onChange={e=>setNotes(e.target.value)} rows={2} style={{...inp,resize:"vertical"}}/></Fld>}
      {guardMsg&&<div className="guard-in" style={{display:"flex",gap:9,alignItems:"flex-start",padding:"11px 13px",borderRadius:12,background:`${T.amber}1a`,border:`1px solid ${T.amber}33`,marginBottom:10}}>
        <span style={{flexShrink:0,width:18,height:18,borderRadius:"50%",background:T.amber,color:T.bg1,fontSize:12,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>!</span>
        <span style={{fontSize:T.fSM,color:"#fcd9a0",lineHeight:1.4,fontWeight:600}}>{guardMsg}</span>
      </div>}
      <button onClick={doSave} disabled={saving} key={shakeFlash} style={{width:"100%",padding:18,borderRadius:18,background:guardMsg?`linear-gradient(180deg,${T.amber},${T.amber}dd)`:`linear-gradient(180deg,${cfg.color},${cfg.color}dd)`,color:T.bg1,fontSize:T.fXL,fontWeight:700,letterSpacing:-0.3,border:"none",boxShadow:`0 1px 0 0 rgba(255,255,255,0.25) inset, 0 0 0 1px rgba(255,255,255,0.06), 0 12px 32px -8px ${cfg.color}55, 0 4px 8px -4px ${cfg.color}33`,transition:"transform 0.2s cubic-bezier(0.22,1,0.36,1)",cursor:saving?"wait":"pointer",opacity:saving?0.75:1,animation:shakeFlash?"shakeX 0.35s ease":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>{saving&&<span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(7,11,30,0.25)",borderTopColor:T.bg1,animation:"spin 0.7s linear infinite"}}/>}{saving?(_lang==="en"?"Saving\u2026":"Salvando\u2026"):(guardMsg?(_lang==="en"?"Save anyway":"Salvar assim mesmo"):(isEdit?L("update"):(type==="medicine"&&!isEdit&&selectedMeds.size>0?`${L("save")} (${selectedMeds.size})`:L("save"))))}</button>
    </div>
  </div>);
}

