function ProfilePage({profile,entries,onSave,onBack,onGrowth,onShowChangelog,hasUnreadChangelog,reminders,onAddReminder,onDelReminder,onDirtyChange,cancelSignal,saveSignal}){
  const[name,setName]=useState(profile.name||"");
  const[birth,setBirth]=useState(profile.birthDate||"");
  const[photo,setPhoto]=useState(profile.photo||"");
  const[mlGoal,setMlGoal]=useState(String(profile.mlGoal||""));
  // v11.9.40: rotina diária (pediatra)
  const _r0=profile.routine||{};
  const _naps0=Array.isArray(_r0.naps)?_r0.naps:[];
  const[routineEnabled,setRoutineEnabled]=useState(profile.routine?.enabled===true);
  const[wakeTime,setWakeTime]=useState(_r0.wakeTime||"07:00");
  const[bathTime,setBathTime]=useState(_r0.bathTime||"18:00");
  const[bedtime,setBedtime]=useState(_r0.bedtime||"19:30");
  const[bottlesPerDay,setBottlesPerDay]=useState(String(_r0.bottlesPerDay||7));
  const[nap1,setNap1]=useState(_naps0[0]?.time||"08:15");
  const[nap2,setNap2]=useState(_naps0[1]?.time||"10:45");
  const[nap3,setNap3]=useState(_naps0[2]?.time||"13:30");
  const[nap4,setNap4]=useState(_naps0[3]?.time||"16:00");
  // v11.9.88-91: estágio pós-banho na rotina. Default = banho+15min (aplicado em RUNTIME
  // no routineState — este campo só sobrescreve). Floripa e Vit. D NÃO têm campo: são
  // calculados (mamadeira pós-banho + 5min, ver routineState no 90-app).
  const _addMin=(t,m)=>{const p=String(t||"18:00").split(":");const v=(((+p[0]||0)*60+(+p[1]||0))+m)%1440;return `${String(Math.floor(v/60)).padStart(2,"0")}:${String(v%60).padStart(2,"0")}`};
  const _pbDef=_addMin(_r0.bathTime||"18:00",15);
  const[postBathBottleTime,setPostBathBottleTime]=useState(_r0.postBathBottleTime||_pbDef);
  const[birthWeight,setBirthWeight]=useState(String(profile.birthWeight||""));
  const[birthLength,setBirthLength]=useState(String(profile.birthLength||""));
  const[birthHead,setBirthHead]=useState(String(profile.birthHead||""));
  const[langSel,setLangSel]=useState(profile.lang||"en");
  const[keepScreenOn,setKeepScreenOn]=useState(profile.keepScreenOn!==false);
  // hapticEnabled removed — iOS Safari doesn't support navigator.vibrate.
  // Still sent to Firestore as `false` for schema compat with any older clients.
  const hapticEnabled=false;
  const[pushEnabled,setPushEnabled]=useState(profile.pushEnabled===true);
  const[pushPermission,setPushPermission]=useState(()=>typeof Notification!=="undefined"?Notification.permission:"unsupported");
  const[pushBusy,setPushBusy]=useState(false);
  // Dirty tracking — only INPUT fields (not toggles, which autosave)
  // Revert-all handler, triggered by the Cancel button in the contextual navbar.
  // Defined early so effects below can reference it, but revertAll body is set after feeding states exist.
  const revertAllRef=useRef(null);
  // Watch cancelSignal — increments every time parent triggers cancel
  useEffect(()=>{if(cancelSignal&&revertAllRef.current)revertAllRef.current()},[cancelSignal]);
  // Watch saveSignal — increments every time parent triggers save via navbar.
  const saveRef=useRef(null);
  useEffect(()=>{if(saveSignal&&saveRef.current)saveRef.current()},[saveSignal]);
  // Local state for the new-reminder form
  const[remNome,setRemNome]=useState("");
  const[remDose,setRemDose]=useState("");
  const[remHorario,setRemHorario]=useState("09:00");
  const[remTitulo,setRemTitulo]=useState("");
  const[remCorpo,setRemCorpo]=useState("");
  const[remShowCustom,setRemShowCustom]=useState(false);
  const[remBusy,setRemBusy]=useState(false);
  // Edit-mode state for existing reminders
  const[editingRemId,setEditingRemId]=useState(null);
  const[editNome,setEditNome]=useState("");
  const[editDose,setEditDose]=useState("");
  const[editHorario,setEditHorario]=useState("");
  const[editTitulo,setEditTitulo]=useState("");
  const[editCorpo,setEditCorpo]=useState("");
  const[editBusy,setEditBusy]=useState(false);
  const startRemEdit=(r)=>{
    setEditingRemId(r._id);
    setEditNome(r.nome||"");
    setEditDose(r.dose||"");
    setEditHorario((r.horarios&&r.horarios[0])||"09:00");
    setEditTitulo(r.titulo||"");
    setEditCorpo(r.corpo||"");
  };
  const cancelRemEdit=()=>{
    setEditingRemId(null);setEditNome("");setEditDose("");setEditHorario("");setEditTitulo("");setEditCorpo("");
  };
  const saveRemEdit=async(orig)=>{
    if(!editNome.trim()||!editHorario)return;
    setEditBusy(true);Haptic.medium();
    try{
      const payload={_id:orig._id,nome:editNome.trim(),dose:editDose.trim(),horarios:[editHorario],ativo:orig.ativo!==false,createdAt:orig.createdAt||new Date().toISOString()};
      if(editTitulo.trim())payload.titulo=editTitulo.trim();
      if(editCorpo.trim())payload.corpo=editCorpo.trim();
      await onAddReminder(payload);
      cancelRemEdit();
      Haptic.success();
    }catch(e){Haptic.warning()}
    setEditBusy(false);
  };
  // Feeding interval reminder state — single global reminder, not a list
  // Lookup the existing one from props.reminders (if any)
  const feedReminder=(reminders||[]).find(r=>r.tipo==="feedingInterval");
  // Medication reminders list (everything except the feeding interval one)
  const medList=(reminders||[]).filter(r=>r.tipo!=="feedingInterval");
  const[fdEnabled,setFdEnabled]=useState(feedReminder?.ativo===true);
  // v11.7.7: SEM\u00c2NTICA INVERTIDA \u2014 `intervalMin` continua sendo o prazo do push
  // (cloud function \u00e9 a fonte da verdade e n\u00e3o precisa mudar). Novo campo
  // `barIntervalMin` \u00e9 client-only, controla s\u00f3 a barra do card Home. Fallback:
  // se `barIntervalMin` ausente, usa `intervalMin` (comportamento pr\u00e9-v11.7.7).
  const[fdPushMinutes,setFdPushMinutes]=useState(feedReminder?.intervalMin||120);
  const[fdMinutes,setFdMinutes]=useState(feedReminder?.barIntervalMin||feedReminder?.intervalMin||120);
  const[fdBusy,setFdBusy]=useState(false);
  const fmtMin=(v)=>{const h=Math.floor(v/60);const m=v%60;if(h===0)return`${m}min`;if(m===0)return`${h}h`;return`${h}h ${m}min`};
  const fdConverted=fmtMin(fdMinutes||0);
  const fdPushConverted=fmtMin(fdPushMinutes||0);
  // Sync local state when the prop changes (Firestore push from another device)
  useEffect(()=>{
    const r=(reminders||[]).find(x=>x.tipo==="feedingInterval");
    if(r){setFdEnabled(r.ativo===true);setFdPushMinutes(r.intervalMin||120);setFdMinutes(r.barIntervalMin||r.intervalMin||120)}
  },[reminders]);
  // Save handler — upserts the single feedingInterval reminder.
  // v11.7.7: `intervalMin` = prazo do push (lido pelo cloud function).
  //          `barIntervalMin` = prazo da barra (client-only).
  const saveFeedReminder=async(overrides={})=>{
    const enabled=overrides.ativo!==undefined?overrides.ativo:fdEnabled;
    const barMinutes=overrides.barIntervalMin!==undefined?overrides.barIntervalMin:fdMinutes;
    const pushMinutes=overrides.intervalMin!==undefined?overrides.intervalMin:fdPushMinutes;
    const existing=(reminders||[]).find(r=>r.tipo==="feedingInterval");
    setFdBusy(true);
    Haptic.medium();
    try{
      await onAddReminder({
        _id:existing?._id||"feedingInterval",
        tipo:"feedingInterval",
        ativo:enabled,
        intervalMin:pushMinutes,
        barIntervalMin:barMinutes,
        createdAt:existing?.createdAt||new Date().toISOString()
      });
      Haptic.success();
    }catch(e){Haptic.warning()}
    setFdBusy(false);
  };
  const pushSupported=PushNotifs.isSupported();

  // ═══ UNIFIED DIRTY STATE ═══
  // Tracks all input fields (including feeding reminder) but NOT the toggles (keepScreenOn/haptic/push/lang/feedingEnabled which autosave)
  // Photo sig (v10.5.3): foto é base64 de 50-200KB. Compare direto string-vs-string é O(n)
  // e roda a cada re-render da ProfilePage (re-renders acontecem em cada keystroke nos inputs).
  // Assinatura curta = length + primeiros 24 + últimos 24 chars. useMemo garante que o
  // hash só recalcula quando a string muda de referência. O isDirty vira O(1) por render.
  const photoSig = useMemo(()=>photo?`${photo.length}:${photo.slice(0,24)}:${photo.slice(-24)}`:"",[photo]);
  const remotePhotoSig = useMemo(()=>{const p=profile.photo||"";return p?`${p.length}:${p.slice(0,24)}:${p.slice(-24)}`:""},[profile.photo]);
  const isDirty=(
    name!==(profile.name||"")||
    birth!==(profile.birthDate||"")||
    photoSig!==remotePhotoSig||
    mlGoal!==String(profile.mlGoal||"")||
    birthWeight!==String(profile.birthWeight||"")||
    birthLength!==String(profile.birthLength||"")||
    birthHead!==String(profile.birthHead||"")||
    fdPushMinutes!==(feedReminder?.intervalMin||120)||
    fdMinutes!==(feedReminder?.barIntervalMin||feedReminder?.intervalMin||120)||
    // v11.9.40: rotina
    routineEnabled!==(profile.routine?.enabled===true)||
    wakeTime!==(_r0.wakeTime||"07:00")||
    bathTime!==(_r0.bathTime||"18:00")||
    bedtime!==(_r0.bedtime||"19:30")||
    bottlesPerDay!==String(_r0.bottlesPerDay||7)||
    nap1!==(_naps0[0]?.time||"08:15")||
    nap2!==(_naps0[1]?.time||"10:45")||
    nap3!==(_naps0[2]?.time||"13:30")||
    nap4!==(_naps0[3]?.time||"16:00")||
    postBathBottleTime!==(_r0.postBathBottleTime||_pbDef)
  );
  useEffect(()=>{if(onDirtyChange)onDirtyChange(isDirty)},[isDirty]);
  // Populate revertAllRef with function that resets all tracked fields
  revertAllRef.current=()=>{
    setName(profile.name||"");
    setBirth(profile.birthDate||"");
    setPhoto(profile.photo||"");
    setMlGoal(String(profile.mlGoal||""));
    setBirthWeight(String(profile.birthWeight||""));
    setBirthLength(String(profile.birthLength||""));
    setBirthHead(String(profile.birthHead||""));
    setFdPushMinutes(feedReminder?.intervalMin||120);
    setFdMinutes(feedReminder?.barIntervalMin||feedReminder?.intervalMin||120);
    // v11.9.40: revert rotina
    setRoutineEnabled(profile.routine?.enabled===true);
    setWakeTime(_r0.wakeTime||"07:00");
    setBathTime(_r0.bathTime||"18:00");
    setBedtime(_r0.bedtime||"19:30");
    setBottlesPerDay(String(_r0.bottlesPerDay||7));
    setNap1(_naps0[0]?.time||"08:15");
    setNap2(_naps0[1]?.time||"10:45");
    setNap3(_naps0[2]?.time||"13:30");
    setNap4(_naps0[3]?.time||"16:00");
    setPostBathBottleTime(_r0.postBathBottleTime||_pbDef);
    Haptic.medium();
  };
  // Persists a single toggle change immediately to Firestore (no need to tap Save).
  // DELTA-ONLY (v10.5.0): só manda os campos que de fato mudaram. Combinado com saveProfile
  // usando merge, zero risco de sobrescrever name/photo com state stale desta aba.
  const persistToggle=async(overrides)=>{
    try{await onSave(overrides)}catch(e){/* fail silent */}
  };
  const handlePushToggle=async()=>{
    if(pushBusy)return;
    if(!pushSupported)return;
    if(pushEnabled){
      // Disable: flip the flag and persist immediately
      setPushEnabled(false);
      Haptic.light();
      await persistToggle({pushEnabled:false});
      return;
    }
    // Enable: must request permission via user gesture
    setPushBusy(true);
    Haptic.medium();
    try{
      const granted=await PushNotifs.requestPermission();
      setPushPermission(typeof Notification!=="undefined"?Notification.permission:"unsupported");
      if(granted){
        setPushEnabled(true);
        await persistToggle({pushEnabled:true});
        // Try to fetch token (may return null if FCM SDK not loaded — that's OK)
        const token=await PushNotifs.getToken();
        if(token)await PushNotifs.saveToken(token);
        Haptic.success();
      }else{
        Haptic.warning();
      }
    }catch(e){/* fail silent */}
    setPushBusy(false);
  };
  const fr=useRef(null);
  const handlePhoto=e=>{const f=e.target.files?.[0];if(!f)return;const rd=new FileReader();rd.onload=ev=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas"),mx=200;let w=img.width,h=img.height;if(w>h){h=(h/w)*mx;w=mx}else{w=(w/h)*mx;h=mx}c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);setPhoto(c.toDataURL("image/jpeg",0.8))};img.src=ev.target.result};rd.readAsDataURL(f)};
  const doSave=async()=>{
    // Save profile fields
    // v11.7: parse com comma OR ponto (BRT keyboard usa v\u00edrgula por default).
    const pFloat=v=>parseFloat(String(v||"").replace(",","."))||0;
    // v11.9.40: rotina diária — salva como sub-objeto routine
    const routine={
      enabled:routineEnabled,
      wakeTime,
      bathTime,
      bedtime,
      bottlesPerDay:Math.max(1,Math.min(20,parseInt(bottlesPerDay)||7)),
      naps:[{time:nap1},{time:nap2},{time:nap3},{time:nap4}],
      postBathBottleTime,
    };
    await onSave({name:name.trim(),birthDate:birth,photo,mlGoal:parseInt(mlGoal)||0,birthWeight:pFloat(birthWeight),birthLength:pFloat(birthLength),birthHead:pFloat(birthHead),lang:langSel,keepScreenOn,hapticEnabled,pushEnabled,routine});
    // Also persist feeding reminder intervals if they changed (barra OR push).
    // v11.7.7: intervalMin = push; barIntervalMin = barra.
    const barraChanged=fdMinutes!==(feedReminder?.barIntervalMin||feedReminder?.intervalMin||120);
    const pushChanged=fdPushMinutes!==(feedReminder?.intervalMin||120);
    if(barraChanged||pushChanged){
      const clampedBarra=Math.max(30,Math.min(720,fdMinutes||120));
      const clampedPush=Math.max(30,Math.min(720,fdPushMinutes||120));
      await saveFeedReminder({barIntervalMin:clampedBarra,intervalMin:clampedPush});
      if(clampedBarra!==fdMinutes)setFdMinutes(clampedBarra);
      if(clampedPush!==fdPushMinutes)setFdPushMinutes(clampedPush);
    }
  };
  saveRef.current=doSave;
  // v11.7.2: AUTO-SAVE. Em vez de bot\u00e3o Save/Cancel, grava sozinho 900ms depois da \u00faltima
  // edi\u00e7\u00e3o em qualquer campo. Mostra "Salvando..." -> "\u2713 Salvo" no header durante a janela.
  // Sem debounce curto demais (n\u00e3o gasta requests por keystroke) nem longo demais (usu\u00e1ria
  // pode sair da p\u00e1gina antes). Photo salva imediatamente (0ms) porque n\u00e3o d\u00e1 pra editar.
  const[autoState,setAutoState]=useState("idle"); // idle | pending | saving | saved
  const saveTimerRef=useRef(null);
  const savedFlashRef=useRef(null);
  useEffect(()=>{
    if(!isDirty){return}
    setAutoState("pending");
    if(saveTimerRef.current)clearTimeout(saveTimerRef.current);
    // Photo change = save imediato. Campos de texto = 900ms debounce.
    const delay=photo!==(profile.photo||"")?0:900;
    saveTimerRef.current=setTimeout(async()=>{
      setAutoState("saving");
      try{
        await doSave();
        setAutoState("saved");
        if(savedFlashRef.current)clearTimeout(savedFlashRef.current);
        savedFlashRef.current=setTimeout(()=>setAutoState("idle"),1400);
      }catch(e){setAutoState("idle")}
    },delay);
    return()=>{if(saveTimerRef.current)clearTimeout(saveTimerRef.current)};
  },[isDirty,name,birth,photo,mlGoal,birthWeight,birthLength,birthHead,fdMinutes,fdPushMinutes,routineEnabled,wakeTime,bathTime,bedtime,bottlesPerDay,nap1,nap2,nap3,nap4,postBathBottleTime]);
  useEffect(()=>()=>{if(saveTimerRef.current)clearTimeout(saveTimerRef.current);if(savedFlashRef.current)clearTimeout(savedFlashRef.current)},[]);
  const inp=INP_BASE;
  // v11.7.1: Profile usa o MESMO gradient do body + Starfield interno pra compartilhar
  // a identidade visual do app — antes (v11.7) era transparent e mostrava a aba atr\u00e1s.
  return(<div className="page-switch" style={{position:"fixed",inset:0,zIndex:200,maxWidth:480,margin:"0 auto",background:T.pageBg,overflowY:"auto",overflowX:"hidden",overscrollBehavior:"contain",WebkitOverflowScrolling:"touch",paddingTop:"env(safe-area-inset-top)",paddingBottom:"calc(100px + env(safe-area-inset-bottom))"}}>
    <Starfield/>
    {/* Fade overlays removed — both top and bottom gradient strips were visually distracting,
        making content look dimmed/buggy rather than giving a clean melt effect. Simple solid scroll. */}
    {/* Header (v11.7.2): back + title + indicador sutil de auto-save.
        Sem bot\u00f5es Save/Cancel \u2014 grava sozinho 900ms depois da \u00faltima edi\u00e7\u00e3o. */}
    {/* v11.9.75: header com identidade — título em gradiente (igual o nome na Home),
        back de 44pt. Parte do redesign "Ajustes deixa de parecer outro app". */}
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 14px 8px 20px"}}>
      <button aria-label={_lang==="en"?"Back":"Voltar"} onClick={onBack} style={{width:40,height:40,borderRadius:13,background:T.glass,border:`1px solid ${T.gB}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="back" size={18} color={T.sub}/></button>
      <span style={{flex:1,fontSize:T.fXL,fontWeight:800,letterSpacing:-0.3,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",background:"linear-gradient(180deg,#ffffff,#c4b5fd)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent",color:"transparent"}}>{_lang==="en"?"Settings":"Ajustes"}</span>
    </div>
    {/* v11.7.5: pill flutuante do auto-save. Fica em position:fixed centered-top,
        acompanha o scroll sozinho sem precisar da header ser sticky (que ficava feio). */}
    {autoState!=="idle"&&<div style={{position:"fixed",top:"calc(env(safe-area-inset-top) + 12px)",left:"50%",transform:"translateX(-50%)",zIndex:300,pointerEvents:"none",animation:"pillIn 0.25s ease"}}>
      <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:22,fontSize:T.fMD,fontWeight:700,letterSpacing:-0.1,background:autoState==="saved"?"rgba(16,30,24,0.92)":"rgba(18,20,48,0.92)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",border:`1px solid ${autoState==="saved"?"rgba(52,211,153,0.35)":"rgba(139,124,246,0.28)"}`,color:autoState==="saved"?"#6ee7b7":"#c4b5fd",boxShadow:"0 8px 24px -8px rgba(0,0,0,0.5)"}}>
        {autoState==="saved"?<><Icon name="check" size={12} color="#6ee7b7"/>{_lang==="en"?"Saved":"Salvo"}</>:<><span style={{width:6,height:6,borderRadius:"50%",background:"#c4b5fd",animation:"pulse 1.2s ease-in-out infinite"}}/>{autoState==="saving"?(_lang==="en"?"Saving\u2026":"Salvando\u2026"):(_lang==="en"?"Editing\u2026":"Editando\u2026")}</>}
      </span>
    </div>}
    <div style={{padding:"0 20px"}}>
      {/* v11.9.75: hero — avatar + nome (gradiente) + idade. Ancora a identidade da Louise. */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:22}}><button onClick={()=>fr.current?.click()} style={{width:88,height:88,borderRadius:"50%",overflow:"hidden",background:T.glass,border:`2px solid ${T.accent}33`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>{photo?<img src={photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Icon name="sun" size={32} color={T.sub}/>}</button><input ref={fr} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>{name&&<div style={{fontSize:T.f2XL,fontWeight:800,letterSpacing:-0.4,marginTop:11,background:"linear-gradient(180deg,#ffffff,#c4b5fd)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent",color:"transparent"}}>{name}</div>}{(()=>{const a=calcAge(birth);return a?<div style={{fontSize:T.fSM,color:T.accent,fontWeight:600,marginTop:3,fontVariantNumeric:"tabular-nums"}}>{a.totalDays} {_lang==="en"?"days":"dias"}{a.months>0?` · ${a.months} ${_lang==="en"?"mo":"m"}`:""}</div>:null})()}<span style={{fontSize:T.fXS,color:T.dim,marginTop:6}}>{_lang==="en"?"Tap photo to change":"Toque na foto para trocar"}</span></div>
      {/* ── GROUP: PERFIL ── name/birth/mlGoal + birth data + view growth */}
      <div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))",border:`1px solid ${T.gBSoft}`,borderRadius:18,padding:"15px 16px",marginBottom:13,boxShadow:T.cardShadow}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
          <div style={{width:20,height:20,borderRadius:T.rSM,background:`${T.purple}1f`,border:`1px solid ${T.purple}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="star" size={11} color={T.purple}/></div>
          <span style={{fontSize:T.fXS,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:T.purple}}>{_lang==="en"?"Profile":"Perfil"}</span>
        </div>
        <Fld label={L("name")}><input type="text" placeholder={_lang==="en"?"e.g. Louise":"Ex: Louise"} value={name} onChange={e=>setName(e.target.value)} style={inp}/></Fld>
        <Fld label={L("birthDate")}><input type="date" value={birth} onChange={e=>setBirth(e.target.value)} style={{...inp,colorScheme:"dark",maxWidth:"100%",WebkitAppearance:"none",textAlign:"center"}}/></Fld>
        <Fld label={L("dailyMilkGoal")}><input type="number" inputMode="numeric" placeholder={_lang==="en"?"e.g. 600":"Ex: 600"} value={mlGoal} onChange={e=>setMlGoal(e.target.value)} style={inp}/></Fld>
        <div style={{fontSize:T.fXS,fontWeight:800,color:T.label,margin:"4px 0 10px",textTransform:"uppercase",letterSpacing:1}}>{L("birthData")}</div>
        <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)",gap:8}}>
          <Fld label={`${L("weight")} (kg)`}><input type="text" inputMode="decimal" placeholder={_lang==="pt"?"3,2":"3.2"} value={birthWeight} onChange={e=>setBirthWeight(e.target.value)} style={{...inp,textAlign:"center",padding:"12px 8px"}}/></Fld>
          <Fld label={`${_lang==="en"?"Length":"Comp."} (cm)`}><input type="text" inputMode="decimal" placeholder="49" value={birthLength} onChange={e=>setBirthLength(e.target.value)} style={{...inp,textAlign:"center",padding:"12px 8px"}}/></Fld>
          <Fld label={`${L("head")} (cm)`}><input type="text" inputMode="decimal" placeholder="34" value={birthHead} onChange={e=>setBirthHead(e.target.value)} style={{...inp,textAlign:"center",padding:"12px 8px"}}/></Fld>
        </div>
        <button onClick={()=>{if(isDirty)doSave();onGrowth()}} style={{width:"100%",padding:14,borderRadius:12,marginTop:12,background:"rgba(163,230,53,0.08)",border:"1px solid rgba(163,230,53,0.15)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icon name="ruler" size={16} color="#a3e635"/><span style={{fontSize:T.fLG,fontWeight:700,color:"#a3e635"}}>{L("viewGrowth")}</span>
        </button>
      </div>
      {/* ── GROUP: ROTINA ── toggle + hora alvo de cada evento + count de mamadas */}
      <div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))",border:`1px solid ${T.gBSoft}`,borderRadius:18,padding:"15px 16px",marginBottom:13,boxShadow:T.cardShadow}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
          <div style={{width:20,height:20,borderRadius:T.rSM,background:`${T.accent}1f`,border:`1px solid ${T.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="clock" size={11} color={T.accent}/></div>
          <span style={{fontSize:T.fXS,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:T.accent}}>{_lang==="en"?"Routine":"Rotina"}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:routineEnabled?14:0}}>
          <div style={{flex:1}}>
            <div style={{fontSize:T.fLG,fontWeight:700,color:T.heading,letterSpacing:-0.2}}>{L("routineSection")}</div>
            <div style={{fontSize:T.fSM,color:T.sub,lineHeight:1.45,marginTop:3}}>{L("routineHelp")}</div>
          </div>
          <button aria-label={L("routineEnable")} onClick={()=>setRoutineEnabled(!routineEnabled)} className="toggle-track" style={{width:52,height:30,borderRadius:15,background:routineEnabled?T.accent:"rgba(20,26,60,0.6)",border:`1px solid ${routineEnabled?T.accent:T.gB}`,position:"relative",flexShrink:0,cursor:"pointer"}}>
            <span className="toggle-thumb" style={{position:"absolute",top:2,left:routineEnabled?24:2,width:24,height:24,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,0.3)"}}/>
          </button>
        </div>
        {routineEnabled&&<>
          <div style={{borderTop:`1px solid ${T.gB}`,paddingTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <Fld label={L("wakeLabel")}><input type="time" value={wakeTime} onChange={e=>setWakeTime(e.target.value)} style={{...inp,padding:"14px 12px",fontSize:T.fLG,textAlign:"center",colorScheme:"dark",fontVariantNumeric:"tabular-nums"}}/></Fld>
            <Fld label={L("bath")}><input type="time" value={bathTime} onChange={e=>setBathTime(e.target.value)} style={{...inp,padding:"14px 12px",fontSize:T.fLG,textAlign:"center",colorScheme:"dark",fontVariantNumeric:"tabular-nums"}}/></Fld>
            <Fld label={L("bedtime")}><input type="time" value={bedtime} onChange={e=>setBedtime(e.target.value)} style={{...inp,padding:"14px 12px",fontSize:T.fLG,textAlign:"center",colorScheme:"dark",fontVariantNumeric:"tabular-nums"}}/></Fld>
            <Fld label={L("bottlesDay")}><input type="number" inputMode="numeric" min="1" max="20" value={bottlesPerDay} onChange={e=>setBottlesPerDay(e.target.value)} style={{...inp,padding:"14px 12px",fontSize:T.fLG,textAlign:"center",fontVariantNumeric:"tabular-nums"}}/></Fld>
          </div>
          <div style={{borderTop:`1px solid ${T.gB}`,paddingTop:14}}>
            <div style={{fontSize:T.fSM,fontWeight:700,color:T.sub,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>{L("napsDay")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[{v:nap1,s:setNap1,i:0},{v:nap2,s:setNap2,i:1},{v:nap3,s:setNap3,i:2},{v:nap4,s:setNap4,i:3}].map(n=>
                <Fld key={n.i} label={I.napNth[_lang][n.i]||`Soneca ${n.i+1}`}><input type="time" value={n.v} onChange={e=>n.s(e.target.value)} style={{...inp,padding:"14px 12px",fontSize:T.fLG,textAlign:"center",colorScheme:"dark",fontVariantNumeric:"tabular-nums"}}/></Fld>
              )}
            </div>
          </div>
          {/* v11.9.88-91: estágio pós-banho (default banho+15min, aplicado sozinho em runtime).
              Myrafer e Vit. D não têm campo — são calculados: mamadeira pós-banho + 5min. */}
          <div style={{borderTop:`1px solid ${T.gB}`,paddingTop:14}}>
            <div style={{fontSize:T.fSM,fontWeight:700,color:T.sub,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>{_lang==="en"?"Post-bath":"Pós-banho"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Fld label={_lang==="en"?"Bottle":"Mamadeira"}><input type="time" value={postBathBottleTime} onChange={e=>setPostBathBottleTime(e.target.value)} style={{...inp,padding:"14px 12px",fontSize:T.fLG,textAlign:"center",colorScheme:"dark",fontVariantNumeric:"tabular-nums"}}/></Fld>
            </div>
            <div style={{fontSize:T.fXS,color:T.dim,marginTop:2}}>{_lang==="en"?"Myrafer and Vit. D are automatic: 5min after the post-bath bottle.":"Myrafer e Vit. D entram sozinhos: 5min depois da mamadeira pós-banho."}</div>
          </div>
        </>}
      </div>
      {/* ── GROUP: PREFERÊNCIAS ── language + keep screen on */}
      <div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))",border:`1px solid ${T.gBSoft}`,borderRadius:18,padding:"15px 16px",marginBottom:13,boxShadow:T.cardShadow}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
          <div style={{width:20,height:20,borderRadius:T.rSM,background:`${T.cyan}1f`,border:`1px solid ${T.cyan}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="gear" size={11} color={T.cyan}/></div>
          <span style={{fontSize:T.fXS,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:T.cyan}}>{_lang==="en"?"Preferences":"Preferências"}</span>
        </div>
        <Fld label={langSel==="en"?"Language":"Idioma"}>
          <div style={{display:"flex",gap:4,background:"rgba(14,18,48,0.6)",borderRadius:10,padding:3,border:`1px solid ${T.gB}`}}>
            {/* v11.9.92: persistToggle delta-only — o toggle sozinho NUNCA gravava no Firestore
                (langSel é state local), deixando o app meio EN, meio PT até salvar o form. */}
            <button onClick={()=>{setLangSel("en");persistToggle({lang:"en"})}} style={{flex:1,padding:"10px 0",borderRadius:8,fontSize:T.fMD,fontWeight:700,background:langSel==="en"?T.accent:"transparent",color:langSel==="en"?"#fff":T.sub}}>English</button>
            <button onClick={()=>{setLangSel("pt");persistToggle({lang:"pt"})}} style={{flex:1,padding:"10px 0",borderRadius:8,fontSize:T.fMD,fontWeight:700,background:langSel==="pt"?T.accent:"transparent",color:langSel==="pt"?"#fff":T.sub}}>Português</button>
          </div>
        </Fld>
        {/* Wake Lock toggle */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:14}}>
          <div style={{flex:1}}>
            <div style={{fontSize:T.fLG,fontWeight:700,marginBottom:4,color:T.heading,letterSpacing:-0.2}}>{langSel==="en"?"Keep screen on":"Manter tela ligada"}</div>
            <div style={{fontSize:T.fMD,color:T.label,lineHeight:1.5}}>{langSel==="en"?"During night wake & nursing timers":"Durante despertar noturno e amamentação"}</div>
          </div>
          <button onClick={()=>{const v=!keepScreenOn;setKeepScreenOn(v);persistToggle({keepScreenOn:v})}} className="toggle-track" style={{position:"relative",width:52,height:32,borderRadius:16,background:keepScreenOn?`linear-gradient(180deg,${T.accent},#6d5cd4)`:"rgba(14,18,48,0.8)",border:`1px solid ${keepScreenOn?"rgba(139,124,246,0.5)":T.gBSoft}`,flexShrink:0,cursor:"pointer",padding:0,boxShadow:keepScreenOn?"0 1px 0 0 rgba(255,255,255,0.18) inset, 0 4px 12px -4px rgba(139,124,246,0.4)":T.insetTop}}>
            <div className="toggle-thumb" style={{position:"absolute",top:3,left:keepScreenOn?25:3,width:24,height:24,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,0.4)"}}/>
          </button>
        </div>
      </div>
      {/* ── GROUP: NOTIFICAÇÕES ── push toggle + medication reminders + feeding reminder */}
      <div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))",border:`1px solid ${T.gBSoft}`,borderRadius:18,padding:"15px 16px",marginBottom:13,boxShadow:T.cardShadow}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
          <div style={{width:20,height:20,borderRadius:T.rSM,background:`${T.amber}1f`,border:`1px solid ${T.amber}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="bell" size={11} color={T.amber}/></div>
          <span style={{fontSize:T.fXS,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:T.amber}}>{_lang==="en"?"Notifications":"Notificações"}</span>
        </div>
        {/* Push notifications toggle */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:14}}>
          <div style={{flex:1}}>
            <div style={{fontSize:T.fLG,fontWeight:700,marginBottom:4,color:pushSupported?"#f0f2ff":T.dim,letterSpacing:-0.2}}>{langSel==="en"?"Notifications":"Notificações"}</div>
            <div style={{fontSize:T.fMD,color:T.label,lineHeight:1.5}}>
              {!pushSupported?(langSel==="en"?"Install to home screen first (iOS 16.4+)":"Instale na tela inicial primeiro (iOS 16.4+)"):
               pushPermission==="denied"?(langSel==="en"?"Permission denied — enable in iOS Settings":"Permissão negada — ative nos Ajustes do iOS"):
               pushEnabled?(langSel==="en"?"Notifications on — add reminders below":"Notificações ativas — cadastre lembretes abaixo"):
               (langSel==="en"?"Tap to enable":"Toque para ativar")}
            </div>
          </div>
          <button onClick={handlePushToggle} disabled={!pushSupported||pushBusy||pushPermission==="denied"} className="toggle-track" style={{position:"relative",width:52,height:32,borderRadius:16,background:pushEnabled&&pushSupported?`linear-gradient(180deg,${T.accent},#6d5cd4)`:"rgba(14,18,48,0.8)",border:`1px solid ${pushEnabled&&pushSupported?"rgba(139,124,246,0.5)":T.gBSoft}`,flexShrink:0,cursor:pushSupported&&!pushBusy&&pushPermission!=="denied"?"pointer":"not-allowed",padding:0,opacity:!pushSupported||pushPermission==="denied"?0.4:1,boxShadow:pushEnabled&&pushSupported?"0 1px 0 0 rgba(255,255,255,0.18) inset, 0 4px 12px -4px rgba(139,124,246,0.4)":T.insetTop}}>
            <div className="toggle-thumb" style={{position:"absolute",top:3,left:pushEnabled&&pushSupported?25:3,width:24,height:24,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,0.4)"}}/>
          </button>
        </div>

        {/* Separator */}
        <div style={{height:1,background:T.gBSoft,margin:"16px 0"}}/>

        {/* ── REMINDERS sub-card ── medication push reminders */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <div style={{width:32,height:32,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",...T.iconTile(T.accent)}}>
            <Icon name="bell" size={15} color="#c4b5fd"/>
          </div>
          <div style={{fontSize:T.fLG,fontWeight:700,color:T.heading,letterSpacing:-0.2}}>{langSel==="en"?"Medication reminders":"Lembretes de medicamento"}</div>
        </div>
        <div style={{fontSize:T.fMD,color:T.label,lineHeight:1.55,marginBottom:16}}>
          {langSel==="en"?"Push notification at the scheduled time. Both devices receive.":"Notificação push no horário marcado. Ambos os dispositivos recebem."}
        </div>

        {/* Existing reminders list — exclude feeding interval (handled by its own card below) */}
        {medList.length>0&&<div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {medList.slice().sort((a,b)=>(a.horarios?.[0]||"").localeCompare(b.horarios?.[0]||"")).map(r=>{
            const isEditingThis=editingRemId===r._id;
            const hasCustom=!!(r.titulo||r.corpo);
            if(isEditingThis){
              return(<div key={r._id} style={{padding:14,borderRadius:14,background:"rgba(139,124,246,0.07)",border:`1px solid rgba(139,124,246,0.28)`,boxShadow:T.insetTop}}>
                <div style={{padding:"9px 11px",background:"rgba(139,124,246,0.12)",border:"1px solid rgba(139,124,246,0.28)",borderRadius:10,display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
                  <Icon name="pencil" size={13} color="#c4b5fd"/>
                  <div style={{fontSize:T.fSM,color:T.lilac,fontWeight:600,flex:1,lineHeight:1.4}}>{langSel==="en"?<>Editing <b>{r.nome||"—"}</b></>:<>Editando <b>{r.nome||"—"}</b></>}</div>
                </div>
                <div style={{fontSize:T.fSM,fontWeight:700,color:T.label,margin:"0 0 4px",letterSpacing:0.5,textTransform:"uppercase"}}>{langSel==="en"?"Name":"Nome"}</div>
                <input type="text" value={editNome} onChange={e=>setEditNome(e.target.value)} placeholder={langSel==="en"?"Name":"Nome"} style={{...inp,padding:"14px 16px",fontSize:T.fLG,marginBottom:8}}/>
                <div style={{fontSize:T.fSM,fontWeight:700,color:T.label,margin:"0 0 4px",letterSpacing:0.5,textTransform:"uppercase"}}>{langSel==="en"?"Dose":"Dose"}</div>
                <input type="text" value={editDose} onChange={e=>setEditDose(e.target.value)} placeholder={langSel==="en"?"Dose":"Dose"} style={{...inp,padding:"14px 16px",fontSize:T.fLG,marginBottom:8}}/>
                <div style={{fontSize:T.fSM,fontWeight:700,color:T.label,margin:"0 0 4px",letterSpacing:0.5,textTransform:"uppercase"}}>{langSel==="en"?"Time":"Horário"}</div>
                <input type="time" value={editHorario} onChange={e=>setEditHorario(e.target.value)} style={{...inp,padding:"14px 16px",fontSize:T.fLG,fontWeight:700,colorScheme:"dark",textAlign:"center",marginBottom:8}}/>
                <div style={{fontSize:T.fSM,fontWeight:700,color:T.label,margin:"6px 0 4px",letterSpacing:0.5,textTransform:"uppercase",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>{langSel==="en"?"Notification title":"Título da notificação"}</span>
                  <span style={{fontSize:T.fXS,color:"#555580",fontWeight:500,letterSpacing:0,textTransform:"none"}}>{langSel==="en"?"optional":"opcional"}</span>
                </div>
                <input type="text" value={editTitulo} onChange={e=>setEditTitulo(e.target.value)} placeholder={langSel==="en"?"Default: Reminder":"Padrão: Lembrete"} style={{...inp,padding:"14px 16px",fontSize:T.fLG,marginBottom:8}}/>
                <div style={{fontSize:T.fSM,fontWeight:700,color:T.label,margin:"0 0 4px",letterSpacing:0.5,textTransform:"uppercase",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>{langSel==="en"?"Notification body":"Corpo da notificação"}</span>
                  <span style={{fontSize:T.fXS,color:"#555580",fontWeight:500,letterSpacing:0,textTransform:"none"}}>{langSel==="en"?"optional":"opcional"}</span>
                </div>
                <textarea value={editCorpo} onChange={e=>setEditCorpo(e.target.value)} placeholder={langSel==="en"?"Default: name + dose":"Padrão: nome + dose"} style={{...inp,padding:"14px 16px",fontSize:T.fLG,minHeight:62,resize:"vertical",fontFamily:"inherit",lineHeight:1.45,marginBottom:12}}/>
                <div style={{display:"flex",gap:8,marginTop:4}}>
                  <button onClick={cancelRemEdit} disabled={editBusy} style={{flex:1,padding:12,borderRadius:12,background:"rgba(139,124,246,0.05)",border:"1px solid rgba(139,124,246,0.15)",color:T.sub,fontSize:T.fMD,fontWeight:700,opacity:editBusy?0.5:1}}>{langSel==="en"?"Cancel":"Cancelar"}</button>
                  <button onClick={()=>saveRemEdit(r)} disabled={editBusy||!editNome.trim()||!editHorario} style={{flex:2,padding:12,borderRadius:12,background:editNome.trim()&&editHorario?`linear-gradient(180deg,#9b8df8,#7c3aed)`:"rgba(14,18,48,0.8)",color:editNome.trim()&&editHorario?"#fff":T.dim,fontSize:T.fMD,fontWeight:800,letterSpacing:-0.2,border:`1px solid ${editNome.trim()&&editHorario?"rgba(139,124,246,0.5)":T.gBSoft}`,opacity:editBusy?0.6:1}}>{langSel==="en"?"Save changes":"Salvar alterações"}</button>
                </div>
              </div>);
            }
            return(<div key={r._id} style={{position:"relative",display:"flex",alignItems:"center",gap:10,padding:"14px 10px 14px 18px",borderRadius:14,background:"rgba(14,18,48,0.6)",border:`1px solid ${T.gBSoft}`,boxShadow:T.insetTop,overflow:"hidden",opacity:editingRemId?0.55:1,transition:"opacity .2s"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:`linear-gradient(180deg,${T.accent},${T.accent}40)`,borderRadius:"0 2px 2px 0",pointerEvents:"none"}}/>
              <div style={{minWidth:56,padding:"7px 10px",borderRadius:11,background:`linear-gradient(180deg,${T.accent}28,${T.accent}10)`,border:`1px solid ${T.accent}45`,textAlign:"center",boxShadow:"0 1px 0 0 rgba(255,255,255,0.08) inset"}}>
                <div style={{fontSize:T.fLG,fontWeight:800,color:T.lilac,fontVariantNumeric:"tabular-nums",letterSpacing:-0.3}}>{r.horarios?.[0]||"--:--"}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:T.fLG,fontWeight:700,color:T.heading,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",letterSpacing:-0.2}}>{r.nome||"—"}</div>
                {r.dose&&<div style={{fontSize:T.fMD,color:"#9099c3",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.dose}</div>}
                {hasCustom&&<div style={{fontSize:T.fSM,color:T.purple,marginTop:3,display:"flex",alignItems:"center",gap:4,fontWeight:600}}><Icon name="pencil" size={9} color="#a78bfa"/>{langSel==="en"?"custom message":"mensagem personalizada"}</div>}
              </div>
              <button disabled={!!editingRemId} onClick={()=>{Haptic.medium();startRemEdit(r)}} style={{width:32,height:32,borderRadius:10,background:"rgba(139,124,246,0.1)",border:"1px solid rgba(139,124,246,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:editingRemId?0.3:1}}>
                <Icon name="pencil" size={13} color="#a78bfa"/>
              </button>
              <button disabled={!!editingRemId} onClick={async()=>{if(!confirm(langSel==="en"?`Delete reminder "${r.nome}"?`:`Excluir lembrete "${r.nome}"?`))return;Haptic.medium();try{await onDelReminder(r._id)}catch(e){}}} style={{width:32,height:32,borderRadius:10,background:"rgba(22,28,60,0.6)",border:`1px solid ${T.gBSoft}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:T.insetTop,opacity:editingRemId?0.3:1}}>
                <Icon name="x" size={13} color={T.dim}/>
              </button>
            </div>);
          })}
        </div>}

        {/* New reminder form */}
        <div style={{padding:14,borderRadius:14,background:"rgba(14,18,48,0.5)",border:`1px dashed ${T.gBSoft}`,opacity:editingRemId?0.4:1,pointerEvents:editingRemId?"none":"auto",transition:"opacity .2s"}}>
          <div style={{fontSize:T.fSM,fontWeight:600,color:T.label,marginBottom:10,letterSpacing:-0.05,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>{langSel==="en"?"Add new":"Adicionar novo"}</span>
            <button onClick={()=>setRemShowCustom(!remShowCustom)} style={{background:"transparent",border:"none",fontSize:T.fSM,color:T.purple,fontWeight:700,letterSpacing:0.3,padding:0,cursor:"pointer"}}>{remShowCustom?(langSel==="en"?"hide message ▲":"ocultar mensagem ▲"):(langSel==="en"?"customize message ▼":"personalizar mensagem ▼")}</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <input type="text" placeholder={langSel==="en"?"Name (e.g. Vitamin D)":"Nome (ex: Vitamina D)"} value={remNome} onChange={e=>setRemNome(e.target.value)} style={{...inp,padding:"14px 16px",fontSize:T.fLG}}/>
            <input type="text" placeholder={langSel==="en"?"Dose (e.g. 2 drops)":"Dose (ex: 2 gotas)"} value={remDose} onChange={e=>setRemDose(e.target.value)} style={{...inp,padding:"14px 16px",fontSize:T.fLG}}/>
            {remShowCustom&&<>
              <div style={{fontSize:T.fSM,fontWeight:700,color:T.label,margin:"4px 0 -2px",letterSpacing:0.5,textTransform:"uppercase",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>{langSel==="en"?"Notification title":"Título da notificação"}</span>
                <span style={{fontSize:T.fXS,color:"#555580",fontWeight:500,letterSpacing:0,textTransform:"none"}}>{langSel==="en"?"optional":"opcional"}</span>
              </div>
              <input type="text" placeholder={langSel==="en"?"Default: Reminder":"Padrão: Lembrete"} value={remTitulo} onChange={e=>setRemTitulo(e.target.value)} style={{...inp,padding:"14px 16px",fontSize:T.fLG}}/>
              <div style={{fontSize:T.fSM,fontWeight:700,color:T.label,margin:"4px 0 -2px",letterSpacing:0.5,textTransform:"uppercase",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>{langSel==="en"?"Notification body":"Corpo da notificação"}</span>
                <span style={{fontSize:T.fXS,color:"#555580",fontWeight:500,letterSpacing:0,textTransform:"none"}}>{langSel==="en"?"optional":"opcional"}</span>
              </div>
              <textarea placeholder={langSel==="en"?"Default: name + dose":"Padrão: nome + dose"} value={remCorpo} onChange={e=>setRemCorpo(e.target.value)} style={{...inp,padding:"14px 16px",fontSize:T.fLG,minHeight:62,resize:"vertical",fontFamily:"inherit",lineHeight:1.45}}/>
            </>}
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input type="time" value={remHorario} onChange={e=>setRemHorario(e.target.value)} style={{...inp,padding:"14px 16px",fontSize:T.fLG,fontWeight:700,colorScheme:"dark",textAlign:"center",flex:1}}/>
              <button disabled={remBusy||!remNome.trim()||!remHorario} onClick={async()=>{
                if(!remNome.trim()||!remHorario)return;
                setRemBusy(true);
                Haptic.medium();
                try{
                  const payload={nome:remNome.trim(),dose:remDose.trim(),horarios:[remHorario],ativo:true,createdAt:new Date().toISOString()};
                  if(remTitulo.trim())payload.titulo=remTitulo.trim();
                  if(remCorpo.trim())payload.corpo=remCorpo.trim();
                  await onAddReminder(payload);
                  setRemNome("");setRemDose("");setRemHorario("09:00");setRemTitulo("");setRemCorpo("");setRemShowCustom(false);
                  Haptic.success();
                }catch(e){Haptic.warning()}
                setRemBusy(false);
              }} style={{padding:"14px 20px",borderRadius:14,background:remNome.trim()&&remHorario?`linear-gradient(180deg,#9b8df8,#7c3aed)`:"rgba(14,18,48,0.8)",color:remNome.trim()&&remHorario?"#fff":T.dim,fontSize:T.fLG,fontWeight:800,letterSpacing:-0.2,border:`1px solid ${remNome.trim()&&remHorario?"rgba(139,124,246,0.5)":T.gBSoft}`,boxShadow:remNome.trim()&&remHorario?`0 1px 0 0 rgba(255,255,255,0.18) inset, 0 4px 12px -4px ${T.accent}55`:T.insetTop,cursor:remNome.trim()&&remHorario&&!remBusy?"pointer":"not-allowed",opacity:remBusy?0.6:1,whiteSpace:"nowrap"}}>
                {langSel==="en"?"Add":"Adicionar"}
              </button>
            </div>
          </div>
        </div>

        {(!pushEnabled||!pushSupported||pushPermission==="denied")&&<div style={{marginTop:12,padding:"8px 12px",borderRadius:9,background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",fontSize:T.fSM,color:"#fbbf24",lineHeight:1.45}}>
          {langSel==="en"?"Enable Notifications above to receive reminders.":"Ative Notificações acima para receber os lembretes."}
        </div>}

        {/* Separator */}
        <div style={{height:1,background:T.gBSoft,margin:"16px 0"}}/>

        {/* ── FEEDING REMINDER sub-card ── single global push reminder based on interval since last bottle */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <div style={{width:32,height:32,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",...T.iconTile(T.accent)}}>
            <Icon name="bottle" size={15} color="#c4b5fd"/>
          </div>
          <div style={{fontSize:T.fLG,fontWeight:700,color:T.heading,letterSpacing:-0.2}}>{langSel==="en"?"Feeding reminder":"Lembrete de mamada"}</div>
        </div>
        <div style={{fontSize:T.fMD,color:T.label,lineHeight:1.55,marginBottom:16}}>
          {langSel==="en"?"Push notification when the interval since the last bottle is exceeded. Both devices receive.":"Notificação push quando passar do intervalo desde a última mamadeira. Ambos os dispositivos recebem."}
        </div>

        {/* Toggle row */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,padding:14,borderRadius:14,background:"rgba(14,18,48,0.5)",border:`1px solid ${T.gBSoft}`,marginBottom:14}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:T.fLG,fontWeight:700,color:T.heading,letterSpacing:-0.2,marginBottom:3}}>{langSel==="en"?"Enable reminder":"Ativar lembrete"}</div>
            <div style={{fontSize:T.fSM,color:T.label,lineHeight:1.45}}>{langSel==="en"?"Notify when it's feeding time":"Notificar quando estiver na hora"}</div>
          </div>
          <button onClick={()=>{const v=!fdEnabled;setFdEnabled(v);saveFeedReminder({ativo:v})}} disabled={fdBusy} className="toggle-track" style={{position:"relative",width:52,height:32,borderRadius:16,background:fdEnabled?`linear-gradient(180deg,${T.accent},#6d5cd4)`:"rgba(14,18,48,0.8)",border:`1px solid ${fdEnabled?"rgba(139,124,246,0.5)":T.gBSoft}`,flexShrink:0,cursor:fdBusy?"not-allowed":"pointer",padding:0,opacity:fdBusy?0.6:1,boxShadow:fdEnabled?"0 1px 0 0 rgba(255,255,255,0.18) inset, 0 4px 12px -4px rgba(139,124,246,0.4)":T.insetTop}}>
            <div className="toggle-thumb" style={{position:"absolute",top:3,left:fdEnabled?25:3,width:24,height:24,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,0.4)"}}/>
          </button>
        </div>

        {/* v11.7.6: dois prazos separados \u2014 barra do card e push noti. */}
        <div style={{display:"flex",flexDirection:"column",gap:10,opacity:fdEnabled?1:0.5,transition:"opacity .25s",pointerEvents:fdEnabled?"auto":"none"}}>
          {/* Intervalo da barra */}
          <div style={{padding:14,borderRadius:14,background:"rgba(14,18,48,0.5)",border:`1px dashed ${T.gBSoft}`}}>
            <div style={{fontSize:T.fSM,fontWeight:600,color:T.label,marginBottom:10,letterSpacing:-0.05,display:"flex",alignItems:"center",gap:6}}>
              <Icon name="clock" size={11} color="#7a80a8"/>{langSel==="en"?"Card progress interval":"Intervalo da barra"}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"stretch"}}>
              <input type="number" inputMode="numeric" min="30" max="720" value={fdMinutes} onChange={e=>{const n=parseInt(e.target.value)||0;setFdMinutes(n)}} onBlur={()=>{const clamped=Math.max(30,Math.min(720,fdMinutes||120));if(clamped!==fdMinutes)setFdMinutes(clamped)}} style={{flex:1,minWidth:0,padding:"14px 16px",background:"rgba(20,26,60,0.55)",border:`1px solid ${T.gBSoft}`,borderRadius:14,color:T.text,fontSize:T.fXL,fontWeight:700,textAlign:"center",fontVariantNumeric:"tabular-nums",letterSpacing:-0.2,outline:"none",boxShadow:T.insetTop,WebkitAppearance:"none",appearance:"none"}}/>
              <div style={{display:"flex",alignItems:"center",padding:"0 16px",background:"rgba(20,26,60,0.55)",border:`1px solid ${T.gBSoft}`,borderRadius:14,fontSize:T.fMD,color:"#8b90b8",fontWeight:600,boxShadow:T.insetTop,whiteSpace:"nowrap"}}>{langSel==="en"?"minutes":"minutos"}</div>
            </div>
            <div style={{marginTop:8,textAlign:"center",fontSize:T.fSM,color:T.lilac,fontWeight:600,letterSpacing:-0.1}}>
              <strong style={{fontVariantNumeric:"tabular-nums",color:"#e0d4ff"}}>{fdConverted}</strong> {"\u00b7"} {langSel==="en"?"bar on Home card":"barra do card Home"}
            </div>
          </div>
          {/* Intervalo do push */}
          <div style={{padding:14,borderRadius:14,background:"rgba(14,18,48,0.5)",border:`1px dashed ${T.gBSoft}`}}>
            <div style={{fontSize:T.fSM,fontWeight:600,color:T.label,marginBottom:10,letterSpacing:-0.05,display:"flex",alignItems:"center",gap:6}}>
              <Icon name="bell" size={11} color="#7a80a8"/>{langSel==="en"?"Push notification interval":"Intervalo do push"}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"stretch"}}>
              <input type="number" inputMode="numeric" min="30" max="720" value={fdPushMinutes} onChange={e=>{const n=parseInt(e.target.value)||0;setFdPushMinutes(n)}} onBlur={()=>{const clamped=Math.max(30,Math.min(720,fdPushMinutes||120));if(clamped!==fdPushMinutes)setFdPushMinutes(clamped)}} style={{flex:1,minWidth:0,padding:"14px 16px",background:"rgba(20,26,60,0.55)",border:`1px solid ${T.gBSoft}`,borderRadius:14,color:T.text,fontSize:T.fXL,fontWeight:700,textAlign:"center",fontVariantNumeric:"tabular-nums",letterSpacing:-0.2,outline:"none",boxShadow:T.insetTop,WebkitAppearance:"none",appearance:"none"}}/>
              <div style={{display:"flex",alignItems:"center",padding:"0 16px",background:"rgba(20,26,60,0.55)",border:`1px solid ${T.gBSoft}`,borderRadius:14,fontSize:T.fMD,color:"#8b90b8",fontWeight:600,boxShadow:T.insetTop,whiteSpace:"nowrap"}}>{langSel==="en"?"minutes":"minutos"}</div>
            </div>
            <div style={{marginTop:8,textAlign:"center",fontSize:T.fSM,color:T.lilac,fontWeight:600,letterSpacing:-0.1}}>
              <strong style={{fontVariantNumeric:"tabular-nums",color:"#e0d4ff"}}>{fdPushConverted}</strong> {"\u00b7"} {langSel==="en"?"push fires after this":"push dispara depois disso"}
            </div>
          </div>
        </div>

        {/* Rule explanation */}
        <div style={{marginTop:14,padding:"12px 14px",borderRadius:12,background:`linear-gradient(180deg,${T.accent}1a,${T.accent}08)`,border:`1px solid ${T.accent}33`}}>
          <div style={{fontSize:T.fSM,fontWeight:700,color:T.lilac,textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
            <Icon name="clock" size={11} color="#c4b5fd"/>
            {langSel==="en"?"How it works":"Como funciona"}
          </div>
          <div style={{fontSize:T.fSM,color:"#a0a6cf",lineHeight:1.55}}>
            {langSel==="en"?<span>Two independent intervals: the <strong style={{color:"#d4ccff",fontWeight:700}}>card bar</strong> tracks visual progress on Home, the <strong style={{color:"#d4ccff",fontWeight:700}}>push</strong> fires once when its own interval is exceeded. Push only between <strong style={{color:"#d4ccff",fontWeight:700}}>07:00 and 22:00</strong> \u2014 silent at night. Each new bottle resets both counters. Nursing does not count.</span>:<span>Dois prazos independentes: a <strong style={{color:"#d4ccff",fontWeight:700}}>barra do card</strong> mostra o progresso visual na Home, o <strong style={{color:"#d4ccff",fontWeight:700}}>push</strong> \u00e9 enviado uma vez quando passa do pr\u00f3prio intervalo. Push s\u00f3 entre <strong style={{color:"#d4ccff",fontWeight:700}}>07:00 e 22:00</strong> \u2014 \u00e0 noite silencia. Cada nova mamadeira reseta os dois contadores. Amamenta\u00e7\u00e3o n\u00e3o conta.</span>}
          </div>
        </div>

        {(!pushEnabled||!pushSupported||pushPermission==="denied")&&<div style={{marginTop:12,padding:"8px 12px",borderRadius:9,background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",fontSize:T.fSM,color:"#fbbf24",lineHeight:1.45}}>
          {langSel==="en"?"Enable Notifications above to receive reminders.":"Ative Notificações acima para receber os lembretes."}
        </div>}
      </div>
      {/* ── GROUP: DADOS ── backup (eyebrow sibling above BackupSection, which brings its own card) */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13,marginTop:2}}>
        <div style={{width:20,height:20,borderRadius:T.rSM,background:`${T.green}1f`,border:`1px solid ${T.green}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="cloud" size={11} color={T.green}/></div>
        <span style={{fontSize:T.fXS,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:T.green}}>{_lang==="en"?"Data":"Dados"}</span>
      </div>
      <BackupSection/>
      {/* ── GROUP: SOBRE ── version/changelog + streak */}
      <div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))",border:`1px solid ${T.gBSoft}`,borderRadius:18,padding:"15px 16px",marginBottom:13,marginTop:14,boxShadow:T.cardShadow}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
          <div style={{width:20,height:20,borderRadius:T.rSM,background:`${T.pink}1f`,border:`1px solid ${T.pink}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="star" size={11} color={T.pink}/></div>
          <span style={{fontSize:T.fXS,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:T.pink}}>{_lang==="en"?"About":"Sobre"}</span>
        </div>
        <button onClick={onShowChangelog} style={{width:"100%",padding:"14px 16px",borderRadius:14,background:"rgba(22,28,60,0.4)",border:`1px solid ${T.gB}`,display:"flex",alignItems:"center",gap:12,textAlign:"left",cursor:"pointer"}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,rgba(139,124,246,0.18),rgba(124,58,237,0.10))",border:"1px solid rgba(139,124,246,0.22)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:T.fMD,fontWeight:700,color:T.text,display:"flex",alignItems:"center",flexWrap:"wrap",gap:6}}>
              <span>Louise Pro <span style={{color:T.accent,fontWeight:800}}>v{APP_VERSION}</span></span>
              {hasUnreadChangelog&&<span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 7px",borderRadius:8,background:`linear-gradient(135deg,${T.accent},#7c3aed)`,color:"#fff",fontSize:T.fXS,fontWeight:800,textTransform:"uppercase",letterSpacing:0.5,boxShadow:`0 2px 8px ${T.accent}66`}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:"#fff",animation:"pulse 1.5s infinite"}}/>
                {langSel==="en"?"New":"Novo"}
              </span>}
            </div>
            <div style={{fontSize:T.fSM,color:T.sub,marginTop:2}}>{langSel==="en"?"Tap to see what's new":"Toque para ver as novidades"}</div>
          </div>
          <div style={{color:T.dim,flexShrink:0}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </button>
        {/* v11.9.6: streak indicator — dias consecutivos terminando em hoje (ou ontem se hoje
            ainda nao tem entry). Conta dias com pelo menos 1 entry. Cap visual em 99 pra UX. */}
        {(()=>{try{
          if(!entries||entries.length===0)return null;
          const datesWithData=new Set(entries.map(e=>e.date));
          const today=todayStr();
          let streak=0;
          let cursor=today;
          // Se hoje nao tem entry mas ontem tem, comeca do ontem
          if(!datesWithData.has(today))cursor=dateOffset(today,-1);
          while(datesWithData.has(cursor)&&streak<999){
            streak++;
            cursor=dateOffset(cursor,-1);
          }
          if(streak<2)return null;
          return(<div style={{marginTop:12,padding:"12px 14px",borderRadius:14,background:"linear-gradient(180deg,rgba(251,146,60,0.10),rgba(251,191,36,0.04))",border:"1px solid rgba(251,146,60,0.25)",display:"flex",alignItems:"center",gap:12,boxShadow:T.insetTop}}>
            <div style={{width:36,height:36,borderRadius:11,background:"rgba(251,146,60,0.18)",border:"1px solid rgba(251,146,60,0.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:T.fXL,flexShrink:0}}>{"🔥"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:T.fLG,fontWeight:800,color:"#fdba74",letterSpacing:-0.2,fontVariantNumeric:"tabular-nums"}}>{streak} {_lang==="en"?(streak===1?"day":"days"):"dias"} {_lang==="en"?"in a row":"seguidos"}</div>
              <div style={{fontSize:T.fSM,color:T.sub,marginTop:1}}>{_lang==="en"?"tracking Louise consistently":"acompanhando a Louise sem pular dia"}</div>
            </div>
          </div>);
        }catch(e){console.warn("[Streak] render error",e);return null}})()}
      </div>
    </div>
  </div>);
}

