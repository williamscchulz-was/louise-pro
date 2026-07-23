function App(){
  const[entries,setEntries]=useState([]);const[savedMeds,setSavedMeds]=useState([]);
  const[profile,setProfile]=useState({name:"",birthDate:"2026-03-08",photo:"",mlGoal:0});
  const[activeTimer,setActiveTimer]=useState(null);const[loading,setLoading]=useState(true);
  // URL hash routing (v11.0): persiste a aba atual no hash pra (1) botão voltar do iPhone
  // funcionar entre Home/Stats/History, (2) deep links compartilháveis, (3) analytics terem
  // visibilidade. Só aplica pras 3 abas principais — Profile/Inbox/Modals continuam overlays.
  const _VALID_PAGES = ["home","stats","history","growth","behavior"];
  const _initialHash = (typeof window!=="undefined" && window.location.hash.slice(1))||"";
  const[page,setPage]=useState(_VALID_PAGES.includes(_initialHash)?_initialHash:"home");
  useEffect(()=>{
    if(typeof window==="undefined")return;
    if(_VALID_PAGES.includes(page)){
      const h = "#"+page;
      if(window.location.hash!==h){
        history.replaceState(null,"",h);
      }
    }
  },[page]);
  useEffect(()=>{
    if(typeof window==="undefined")return;
    const onHash=()=>{const h=window.location.hash.slice(1)||"home";if(_VALID_PAGES.includes(h))setPage(h)};
    window.addEventListener("hashchange",onHash);
    return()=>window.removeEventListener("hashchange",onHash);
  },[]);
  const[showAdd,setShowAdd]=useState(false);const[formType,setFormType]=useState(null);const[editEntry,setEditEntry]=useState(null);const[showOrbit,setShowOrbit]=useState(false);
  // `nowTick` removido na v10.5.4 — era redundante com o main tick (já fira cada 30s no idle).
  // A barra de next-feeding no card Bottle pega Date.now() em cada render do App, que acontece
  // automaticamente a cada 30s via o tick principal (linha ~5088).
  // SWIPE NAV (v9.9.2) — Step 1: only Home/Stats/History swipe. Profile stays overlay.
  const SWIPE_PAGES=["home","stats","history"];
  const swipeIdx=SWIPE_PAGES.indexOf(page);
  const isSwipePage=swipeIdx>=0;
  const swipeIdxRef=useRef(swipeIdx);
  useEffect(()=>{swipeIdxRef.current=swipeIdx},[swipeIdx]);
  const[dragPx,setDragPx]=useState(0);
  const[swipeDragging,setSwipeDragging]=useState(false);
  const swipeRef=useRef(null);
  const swipeGestureRef=useRef({startX:0,startY:0,lastX:0,lastT:0,velocity:0,active:false,locked:null,sw:0});
  const[showProfile,setShowProfile]=useState(false);const[showSleepInfo,setShowSleepInfo]=useState(false);
  // Profile contextual navbar state — when editing Profile fields, navbar swaps to Save/Cancel
  const[profileIsDirty,setProfileIsDirty]=useState(false);
  const[profileCancelSignal,setProfileCancelSignal]=useState(0);
  const[profileSaveSignal,setProfileSaveSignal]=useState(0);
  const profileSaveRef=useRef(null);
  const[inbox,setInbox]=useState({items:[],lastReset:""});const[showInbox,setShowInbox]=useState(false);
  // v11.9.9: Long-press no Ring abre painel com info detalhada.
  const[showRingDetail,setShowRingDetail]=useState(false);
  const ringPressRef=useRef({timer:null,startY:0,startX:0,fired:false});
  const onRingPointerDown=useCallback((e)=>{
    ringPressRef.current.fired=false;
    ringPressRef.current.startX=e.clientX||0;
    ringPressRef.current.startY=e.clientY||0;
    if(ringPressRef.current.timer)clearTimeout(ringPressRef.current.timer);
    ringPressRef.current.timer=setTimeout(()=>{
      ringPressRef.current.fired=true;
      Haptic.medium();
      setShowRingDetail(true);
    },550);
  },[]);
  const onRingPointerMove=useCallback((e)=>{
    const dx=Math.abs((e.clientX||0)-ringPressRef.current.startX);
    const dy=Math.abs((e.clientY||0)-ringPressRef.current.startY);
    if(dx>8||dy>8){if(ringPressRef.current.timer){clearTimeout(ringPressRef.current.timer);ringPressRef.current.timer=null}}
  },[]);
  const onRingPointerUp=useCallback(()=>{
    if(ringPressRef.current.timer){clearTimeout(ringPressRef.current.timer);ringPressRef.current.timer=null}
  },[]);
  // v11.9.53: daily summary removido (era um card "Resumo de hoje" 19h-23h59 com
  // totais de bottle/sono/sonecas/fraldas). Pedido do William. Removida toda state
  // associada — localStorage key `lp_daily_summary_seen` fica órfão mas não causa
  // problema (chave isolada por device, ~10 bytes).
  // v11.9.1: marcos da Louise (1 mes, 100 dias, 6 meses) — confetti 1x cada.
  const[confettiOn,setConfettiOn]=useState(false);
  useEffect(()=>{
    if(loading||!profile.birthDate)return;
    try{
      const seenRaw=localStorage.getItem("lp_milestones_seen")||"";
      const seen=new Set(seenRaw.split(",").filter(Boolean));
      const bd=new Date(profile.birthDate);
      if(isNaN(bd))return;
      const today=new Date();today.setHours(0,0,0,0);
      const days=Math.floor((today-bd)/86400000);
      // marcos: 1 mes (~30d), 100 dias, 6 meses (~180d), 1 ano (365)
      // v11.9.17: grace de 1 dia — se usuário não abriu no dia exato, dispara no dia+1.
      const ms=[{k:"30d",at:30},{k:"100d",at:100},{k:"180d",at:180},{k:"365d",at:365}];
      const hit=ms.find(m=>(days===m.at||days===m.at+1)&&!seen.has(m.k));
      if(hit){
        seen.add(hit.k);
        localStorage.setItem("lp_milestones_seen",[...seen].join(","));
        setConfettiOn(true);
        Haptic.success();
      }
    }catch(_){}
  },[loading,profile.birthDate]);
  // v11.9.1: indicador online/offline sutil. Reflete `navigator.onLine` + listeners.
  const[isOnline,setIsOnline]=useState(()=>typeof navigator!=="undefined"?navigator.onLine!==false:true);
  useEffect(()=>{
    const on=()=>setIsOnline(true);
    const off=()=>setIsOnline(false);
    window.addEventListener("online",on);
    window.addEventListener("offline",off);
    return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off)};
  },[]);
  const[reminders,setReminders]=useState([]);
  const[showChangelog,setShowChangelog]=useState(false);const[showUpdateToast,setShowUpdateToast]=useState(false);
  const[showEditStart,setShowEditStart]=useState(false);
  const[showNursingPicker,setShowNursingPicker]=useState(false);
  const lang=profile.lang||"en";_lang=lang;
  const[toast,setToast]=useState(null);const[tick,setTick]=useState(0);const undoRef=useRef(null);const repeatRef=useRef(null);
  // v11.9.133: o splash da família DESENHA em toda abertura (pedido do William: "tem que
  // desenhar e dar um tempo") — supera a regra v11.9.98 de full-1×/dia. Draw termina ~3.1s
  // e o quadro completo segura ~0.8s antes de entrar. Flag lp_splash_date aposentada.
  // EXCEÇÃO anti-pisca: se este boot veio do reload do overlay de atualização (sessionStorage
  // lp_upd_reload, setado no controllerchange do index.html), o overlay JÁ foi a transição —
  // pular o splash evita a cadeia "overlay → splash → app" piscando 3 telas.
  const[splash,setSplash]=useState(()=>{try{if(sessionStorage.getItem("lp_upd_reload")==="1"){sessionStorage.removeItem("lp_upd_reload");return false}}catch(e){}return true});
  useEffect(()=>{if(!splash)return;const t=setTimeout(()=>setSplash(false),3900);return()=>clearTimeout(t)},[]);

  // lastSeenVersion per-device via localStorage (v11.1). Firestore profile é compartilhado
  // entre os 2 dispositivos (William + esposa). Antes, marcar update como visto num device
  // fazia o outro nunca ver a notificação. Agora cada device rastreia sua própria última
  // versão vista localmente. Fallback: se localStorage vazio MAS profile.lastSeenVersion
  // existe, assume que esse device herda o estado remoto pra não mostrar toast na primeira
  // abertura pós-migração.
  const[localLastSeenVersion,setLocalLastSeenVersion]=useState(()=>{
    try{return localStorage.getItem("lp_last_seen_version")||""}catch(_){return""}
  });
  const hasUnreadChangelog=localLastSeenVersion!==APP_VERSION;
  const profileLoadedRef=useRef(false);
  useEffect(()=>{
    if(loading||profileLoadedRef.current)return;
    profileLoadedRef.current=true;
    const stored=localLastSeenVersion;
    if(stored){
      if(stored!==APP_VERSION)setShowUpdateToast(true);
    }else{
      // Primeiro uso neste device. Se Firestore já tem lastSeenVersion (outro device viu antes),
      // herda pra não spammar toast. Senão, install fresco — marca silenciosamente.
      const initial=profile.lastSeenVersion||APP_VERSION;
      setLocalLastSeenVersion(initial);
      try{localStorage.setItem("lp_last_seen_version",initial)}catch(_){}
      if(initial!==APP_VERSION)setShowUpdateToast(true);
    }
  },[loading,localLastSeenVersion,profile.lastSeenVersion]);
  const markChangelogSeen=()=>{
    if(localLastSeenVersion!==APP_VERSION){
      setLocalLastSeenVersion(APP_VERSION);
      try{localStorage.setItem("lp_last_seen_version",APP_VERSION)}catch(_){}
    }
  };
  const openChangelog=()=>{setShowChangelog(true);setShowUpdateToast(false);markChangelogSeen()};
  const dismissUpdateToast=()=>{setShowUpdateToast(false);markChangelogSeen()};
  const closeChangelog=()=>{setShowChangelog(false);markChangelogSeen()};

  // Auto-backup na primeira abertura do dia (v11.6). Antes era 24h rolling, agora usa
  // data do calend\u00e1rio local: se `lp_last_backup_date` n\u00e3o \u00e9 hoje, roda. Mental model do
  // usu\u00e1rio: "1 backup por dia, primeiro open da manh\u00e3". Mais previs\u00edvel.
  // Delay de 8s ap\u00f3s loading pra n\u00e3o brigar com first paint.
  const backupTriedRef=useRef(false);
  useEffect(()=>{
    if(loading||backupTriedRef.current)return;
    backupTriedRef.current=true;
    const today=todayStr();
    let lastDate="";
    try{lastDate=localStorage.getItem("lp_last_backup_date")||""}catch(_){}
    if(lastDate===today)return; // j\u00e1 tem backup de hoje
    const t=setTimeout(async()=>{
      try{
        const data=await FB.exportAll();
        await FB.saveBackup(data);
        const now=Date.now();
        try{
          localStorage.setItem("lp_last_backup_date",today);
          localStorage.setItem("lp_last_backup_at",String(now)); // timestamp p/ display
        }catch(_){}
        setToast(_lang==="en"?"\u2713 Auto-backup saved":"\u2713 Backup autom\u00e1tico salvo");
      }catch(e){
        // v11.9.124: falha de backup era SILENCIOSA (so console.warn) — se o saveBackup
        // passasse a falhar todo dia (teto de tamanho, rules, rede), ninguem saberia e o
        // snapshot iria envelhecendo. Agora avisa na tela; nao marca lp_last_backup_date,
        // entao tenta de novo na proxima abertura.
        console.warn("[LP] auto-backup failed:",e.message);
        setToast(_lang==="en"?"⚠️ Auto-backup failed — see Settings › Data":"⚠️ Backup automático falhou — ver Ajustes › Dados");
      }
    },8000);
    return()=>clearTimeout(t);
  },[loading]);

  // App-level tick: atualiza napSug, Ring arc, e cards dependentes de tempo.
  // Timer ativo: 5s (antes era 1s) — sweep do arco do Ring em 5s é imperceptível (<2deg
  // pra naps curtas), e elimina ~80% dos re-renders do App em bedtimes longos. O TimerBar
  // tem seu próprio tick interno de 1s pro display "17:03", não depende deste. v10.5.1.
  useEffect(()=>{const iv=activeTimer?5000:30000;const t=setInterval(()=>setTick(k=>k+1),iv);return()=>clearInterval(t)},[activeTimer]);
  // v11.9.48: bedtime ambient — toggle body.bedtime-active quando sleep timer ativo
  // pra trocar o background do app por uma versão mais escura/lavanda-tinted.
  useEffect(()=>{
    if(!document.body)return;
    const on=activeTimer?.type==="sleep";
    document.body.classList.toggle("bedtime-active",on);
    return()=>{document.body.classList.remove("bedtime-active")};
  },[activeTimer]);

  // Wake Lock: keep screen on during night wake, nursing, tummytime or bath
  const wakeLockEnabled=profile.keepScreenOn!==false;
  const shouldLock=wakeLockEnabled&&activeTimer&&(activeTimer.type==="nursing"||activeTimer.type==="tummytime"||activeTimer.type==="bath"||(activeTimer.type==="sleep"&&activeTimer.nightWake));
  useEffect(()=>{
    if(shouldLock){WakeLock.request()}else{WakeLock.release()}
    const onVis=()=>{if(document.visibilityState==="visible"&&shouldLock)WakeLock.request()};
    document.addEventListener("visibilitychange",onVis);
    return()=>{document.removeEventListener("visibilitychange",onVis)};
  },[shouldLock]);
  useEffect(()=>()=>{WakeLock.release()},[]);

  // Haptic feedback permanently disabled — iOS Safari doesn't implement
  // navigator.vibrate(). The existing Haptic.* calls throughout the app
  // become no-ops. Keeps code paths intact in case iOS support lands someday.
  useEffect(()=>{Haptic.setEnabled(false)},[]);

  // Push Notifications: register Service Worker on mount (if supported)
  // Does NOT request permission — that requires user gesture from Profile toggle
  useEffect(()=>{
    if(PushNotifs.isSupported()){
      PushNotifs.registerServiceWorker().catch(()=>{/* fail silent */});
    }
    // Configure VAPID key for FCM token retrieval (Firebase Cloud Messaging)
    PushNotifs.setVapidKey("BE7jb8k2HRvR-q-xUj_1boSI8vG8-ZwFwIyaDh4Pq7ClegyqG_JjuYJ3JHd2lGAzUXr3kZtz1DRIUVO215uoRhs");
    // Inject Firestore token saver so device-features.js stays decoupled
    PushNotifs.setTokenSaver(async(token)=>{
      try{await FB.savePushToken(token,profile.lang||"en")}catch(e){}
    });
  },[]);

  // Firebase real-time subscriptions
  useEffect(()=>{
    let ready={e:false,p:false,m:false,a:false};
    const check=()=>{if(Object.values(ready).every(Boolean))setLoading(false)};
    const u1=FB.subEntries(d=>{setEntries(dedupeLegacyWakings(d));ready.e=true;check();
      // v11.9.12: defere migration pra fora do callback. Garante que erros assincronos
      // nao bloqueiam render path. Idempotente, fast-no-op se ja rodou.
      try{setTimeout(()=>{try{migrateLegacyWakingsOnce(d)}catch(_){}}, 0);}catch(_){}
    });
    const u2=FB.subProfile(d=>{if(d)setProfile(d);ready.p=true;check()});
    const u3=FB.subMeds(d=>{
      // v11.8.1: auto-migrate meds variaveis. Simeticona/Paracetamol/Novalgina costumam
      // variar de dose ent\u00e3o ficam como "pede gotas" (dose="") pra abrir o picker.
      // Roda 1x por device (flag em localStorage) pra respeitar futuras edi\u00e7\u00f5es manuais.
      const ASK_DROPS=/simet|paracetam|novalgin/i;
      let list=d||[{name:"Myrafer",dose:""},{name:"Vit. D",dose:"2 gotas"},{name:"C\u00f3licaliv",dose:"5 gotas"},{name:"Simeticona",dose:""},{name:"Paracetamol",dose:""}];
      try{
        // v11.8.2: migra\u00e7\u00e3o v2 \u2014 limpa dose de meds de gotas variaveis + adiciona C\u00f3licaliv
        // se n\u00e3o existir. Roda 1x por device. Respeita edi\u00e7\u00f5es manuais futuras.
        if(!localStorage.getItem("lp_meds_drops_mig_v2")){
          let changed=false;
          list=list.map(m=>{
            if(m&&m.dose&&ASK_DROPS.test(m.name||"")){changed=true;return{...m,dose:""}}
            return m;
          });
          if(!list.some(m=>m&&/c[o\u00f3]licaliv/i.test(m.name||""))){
            list=[...list,{name:"C\u00f3licaliv",dose:"5 gotas"}];
            changed=true;
          }
          localStorage.setItem("lp_meds_drops_mig_v2","1");
          if(changed)FB.saveMeds(list);
        }
      }catch(_){}
      setSavedMeds(list);
      ready.m=true;check();
    });
    const u4=FB.subTimer(d=>{setActiveTimer(d?.cleared?null:d);ready.a=true;check()});
    const u5=FB.subInbox(d=>{if(d)setInbox({items:d.items||[],lastReset:d.lastReset||""})});
    const u6=FB.subReminders(d=>setReminders(d||[]));
    return()=>{u1();u2();u3();u4();u5();u6()};
  },[]);

  // v11.9.27: showToast aceita 3o arg `repeatFn` pra Quick re-log. Toast mostra
  // "Repetir" quando passado — clica e re-cria entry com horario=now.
  const showToast=(msg,fn,repeatFn)=>{undoRef.current=fn;repeatRef.current=repeatFn||null;setToast(msg)};
  const handleUndo=()=>{if(undoRef.current)undoRef.current();setToast(null)};
  const handleRepeat=()=>{if(repeatRef.current)repeatRef.current();setToast(null)};
  const addEntry=useCallback(async e=>{
    Haptic.medium();
    // v11.9.74: logar um MARCO de desenvolvimento dispara confetti (momento de conquista).
    // Equivalente VISÍVEL ao "haptic de achievement" — haptics são no-op no iOS Safari.
    if(e&&e.type==="milestone"&&!editEntry)setConfettiOn(true);
    // v11.7.3: FECHAMENTO OTIMISTA. Antes: a modal esperava a Firestore write completar
    // antes de fechar (300-1500ms), usu\u00e1rio clicava X achando que bugou ou double-tap
    // criava entry duplicada. Agora: fecha imediato + write roda em background. Firestore
    // offline persistence garante que o write commita no cache local instantaneamente,
    // e a listener real-time re-hidrata a UI quando o round-trip completar.
    const wasEdit=!!editEntry;
    setFormType(null);setShowAdd(false);setEditEntry(null);
    setShowOrbit(true);setTimeout(()=>setShowOrbit(false),1200);
    // Nightwake linking (precisa rodar antes da persist\u00eancia da entry).
    const NIGHT_WAKE_EXCLUDED=["sleep","nap","wakeup","nightwaking","growth"];
    let nwTimerUpdate=null;
    if(activeTimer&&activeTimer.type==="sleep"&&activeTimer.nightWake&&!NIGHT_WAKE_EXCLUDED.includes(e.type)){
      const bedStartMs=new Date(activeTimer.startTime).getTime();
      const evMs=(e.date&&e.time)?new Date(`${e.date}T${e.time}`).getTime():NaN;
      const nowMs=Date.now();
      const inRange=!isNaN(evMs)&&evMs>=bedStartMs&&evMs<=nowMs+60000;
      if(inRange){
        e.nightWake=activeTimer.startTime;
        const updatedNw={...activeTimer.nightWake,events:[...(activeTimer.nightWake.events||[]),e.id]};
        nwTimerUpdate={...activeTimer,nightWake:updatedNw};
      }
    }
    const parts=splitMidnight(e);
    let tmsg=`${TL(e.type)||e.type} ${wasEdit?flexed(e.type,"updated"):flexed(e.type,"registered")}`;
    if(!wasEdit){
      const td=todayStr();const ta=entries.filter(x=>x.date===td);
      if(e.type==="bottle"){const ml2=ta.filter(x=>x.type==="bottle").reduce((s,x)=>s+(x.ml||0),0)+(e.ml||0);tmsg=`${_lang==="en"?"Bottle logged!":"Mamadeira registrada!"} ${ml2}ml ${_lang==="en"?"today":"hoje"}`}
      if(e.type==="diaper"){const dc=ta.filter(x=>x.type==="diaper").length+1;tmsg=`${_lang==="en"?"Diaper logged!":"Fralda registrada!"} ${dc}x ${_lang==="en"?"today":"hoje"}`}
    }
    // v11.9.27: repeatFn pra Quick re-log. Disponivel pra tipos one-shot (sem timer).
    // Sleep/nap/nursing/tummytime sao via timer entao "repeat" nao faz sentido aqui.
    const REPEATABLE={bottle:1,diaper:1,medicine:1,temperature:1,bath:1,wakeup:1,nightwaking:1};
    let repeatFn=null;
    if(!wasEdit&&REPEATABLE[e.type]){
      repeatFn=()=>{
        const nowD=new Date();
        const newE={...e,id:uid(),date:`${nowD.getFullYear()}-${String(nowD.getMonth()+1).padStart(2,"0")}-${String(nowD.getDate()).padStart(2,"0")}`,time:`${String(nowD.getHours()).padStart(2,"0")}:${String(nowD.getMinutes()).padStart(2,"0")}`};
        delete newE.nightWake;
        delete newE._docId;
        addEntry(newE);
      };
    }
    showToast(tmsg,async()=>{await FB.deleteEntriesBatch(parts.map(p=>p.id))},repeatFn);
    // Fire-and-forget writes. Se falhar, log mas n\u00e3o bloqueia UI \u2014 offline persistence
    // re-tenta quando voltar a rede.
    // v11.9.125: batch atomico (parts + timer juntos) \u2014 mesma classe de fix do stopTimer
    // v11.9.122: sem janela de suspensao do iOS entre escritas sequenciais.
    (async()=>{
      try{
        await FB.saveEntriesBatch(parts,nwTimerUpdate||undefined);
      }catch(err){console.warn("[addEntry] write failed",err)}
    })();
  },[editEntry,entries,activeTimer]);

  // v11.8.0: batch save pro novo flow de medicine multi-select + drops picker.
  // Grava N entries com mesmo timestamp, fecha form, mostra toast consolidado.
  // Mantem fechamento otimista + fire-and-forget consistente com addEntry.
  const addMedicineBatch=useCallback(async entries=>{
    if(!entries||entries.length===0)return;
    Haptic.medium();
    setFormType(null);setShowAdd(false);setEditEntry(null);
    setShowOrbit(true);setTimeout(()=>setShowOrbit(false),1200);
    const n=entries.length;
    const tmsg=n===1
      ?(_lang==="en"?`${entries[0].name} registered`:`✓ ${entries[0].name}`)
      :`${n} ${_lang==="en"?"medicines logged":"medicamentos registrados"}`;
    showToast(tmsg,async()=>{await FB.deleteEntriesBatch(entries.map(e=>e.id))});
    (async()=>{
      try{await FB.saveEntriesBatch(entries)}
      catch(err){console.warn("[addMedicineBatch] write failed",err)}
    })();
  },[]);

  const startEdit=useCallback((entry)=>{
    setEditEntry(entry);
    setFormType(entry.type);
    setShowAdd(false);
  },[]);
  const deleteEntry=useCallback(async id=>{const entry=entries.find(e=>e.id===id);await FB.delEntry(id);showToast(`${TL(entry?.type)||""} ${flexed(entry?.type,"removed")}`,async()=>{if(entry)await FB.addEntry(entry)})},[entries]);
  // quickWakeup: creates a wakeup event. If a bedtime ended very recently (within last 30min),
  // computes the total night sleep across both halves (cross-midnight) and stores it on the wakeup
  // for display in the timeline.
  // Anti-duplicate: if a wakeup was created in the last 60 seconds (likely auto-generated by stopTimer),
  // skip — show a toast instead.
  const quickWakeup=useCallback(()=>{
    const now=Date.now();
    // Check for very recent wakeup (auto-created by stopTimer or manual within 60s)
    const recentWakeup=entries.find(e=>{
      if(e.type!=="wakeup") return false;
      const ms=new Date(`${e.date}T${e.time}`).getTime();
      return now-ms<60000&&now-ms>=-5000;
    });
    if(recentWakeup){
      showToast(_lang==="en"?"Already woke up just now":"Já acordou agora há pouco",null);
      return;
    }
    const wakeup={type:"wakeup",date:todayStr(),time:nowTime(),id:uid()};
    // Find the most recently ended sleep entries (could be 1 entry, or 2 if cross-midnight pair)
    const recentSleeps=entries
      .filter(e=>e.type==="sleep"&&e.durationMin)
      .map(e=>{
        const endMs=new Date(`${e.date}T${e.time}`).getTime()+e.durationMin*60000;
        return{e,endMs};
      })
      .filter(x=>now-x.endMs<30*60000&&now-x.endMs>=-60000) // ended within last 30min (or about to end)
      .sort((a,b)=>b.endMs-a.endMs);
    if(recentSleeps.length>0){
      // Find all entries that are part of the same logical night (same base id)
      const top=recentSleeps[0].e;
      const baseId=top.id.endsWith("_b")?top.id.slice(0,-2):top.id;
      const pair=entries.filter(e=>e.type==="sleep"&&(e.id===baseId||e.id===baseId+"_b"));
      if(pair.length>0){
        const totalDur=pair.reduce((s,e)=>s+(e.durationMin||0),0);
        const totalAwake=pair.reduce((s,e)=>s+awakeMinIn(e),0);
        const realSleep=Math.max(0,totalDur-totalAwake);
        wakeup.nightSleepMin=realSleep;
      }
    }
    addEntry(wakeup);
  },[addEntry,entries]);
  const duplicateLast=useCallback(()=>{if(!entries.length)return;const l=entries[0];addEntry({...l,id:uid(),date:todayStr(),time:nowTime(),_docId:undefined})},[entries,addEntry]);
  const startTimer=useCallback(async(type,side)=>{Haptic.heavy();const data={type,startTime:new Date().toISOString()};if(type==="nursing"){data.side=side||"left";data.leftMs=0;data.rightMs=0;data.sideStart=new Date().toISOString()}await FB.saveTimer(data);setShowAdd(false);setFormType(null)},[]);
  const switchSide=useCallback(async(newSide)=>{if(!activeTimer||activeTimer.type!=="nursing")return;const now=Date.now();const elapsed=activeTimer.paused?0:(now-new Date(activeTimer.sideStart).getTime());const updated={...activeTimer,side:newSide,sideStart:new Date().toISOString(),paused:false};if(activeTimer.side==="left")updated.leftMs=(activeTimer.leftMs||0)+elapsed;else updated.rightMs=(activeTimer.rightMs||0)+elapsed;await FB.saveTimer(updated)},[activeTimer]);
  const pauseNursing=useCallback(async()=>{if(!activeTimer||activeTimer.type!=="nursing")return;if(activeTimer.paused){await FB.saveTimer({...activeTimer,paused:false,sideStart:new Date().toISOString()})}else{const now=Date.now();const elapsed=now-new Date(activeTimer.sideStart).getTime();const updated={...activeTimer,paused:true};if(activeTimer.side==="left")updated.leftMs=(activeTimer.leftMs||0)+elapsed;else updated.rightMs=(activeTimer.rightMs||0)+elapsed;await FB.saveTimer(updated)}},[activeTimer]);
  const toggleNightWake=useCallback(async()=>{
    if(!activeTimer||activeTimer.type!=="sleep")return;
    if(activeTimer.nightWake){
      // Ending a night wake — close it, add to wakings array
      const nw=activeTimer.nightWake;
      const wakeStart=new Date(nw.startTime);
      const durMin=Math.max(1,Math.round((Date.now()-wakeStart.getTime())/60000));
      const wakings=[...(activeTimer.wakings||[]),{
        time:`${String(wakeStart.getHours()).padStart(2,"0")}:${String(wakeStart.getMinutes()).padStart(2,"0")}`,
        durationMin:durMin,
        events:nw.events||[]
      }];
      await FB.saveTimer({...activeTimer,nightWake:null,wakings});
      Haptic.light();
    }else{
      // Starting a night wake
      await FB.saveTimer({...activeTimer,nightWake:{startTime:new Date().toISOString(),events:[]}});
      Haptic.warning();
    }
  },[activeTimer]);
  const stopTimer=useCallback(async()=>{if(!activeTimer)return;Haptic.heavy();const s=new Date(activeTimer.startTime);
    // v11.9.96: timer CANCELÁVEL — sono/soneca com <3min é mis-tap, não registro: descarta
    // sem criar entry nem wakeup fantasma (que podia virar âncora do wakeDelta e deslocar
    // a rotina inteira em até ±2h). O botão do TimerBar fica cinza (✕) nesse estado.
    if((activeTimer.type==="sleep"||activeTimer.type==="nap")&&Date.now()-s.getTime()<180000){
      await FB.saveTimer(null);
      showToast(_lang==="en"?"Timer discarded":"Timer descartado",null);
      return;
    }
    // v11.9.96: snapshot do timer pro DESFAZER do stop (era a única escrita do app sem undo).
    // Desfazer = apaga as entries criadas + restaura o timer como estava.
    const prevTimer={...activeTimer};
    // v11.9.125: desfazer tambem e atomico — apagar entries + restaurar timer num commit so.
    const undoStop=ids=>async()=>{await FB.deleteEntriesBatch(ids,prevTimer)};
    if(activeTimer.type==="nursing"){const now=Date.now();const elapsed=activeTimer.paused?0:(now-new Date(activeTimer.sideStart).getTime());let lMs=(activeTimer.leftMs||0),rMs=(activeTimer.rightMs||0);if(!activeTimer.paused){if(activeTimer.side==="left")lMs+=elapsed;else rMs+=elapsed}const totalMin=Math.max(1,Math.round((lMs+rMs)/60000));const lMin=Math.round(lMs/60000),rMin=Math.round(rMs/60000);const side=lMs>0&&rMs>0?"both":(lMs>0?"left":"right");const entry={type:"nursing",date:`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}-${String(s.getDate()).padStart(2,"0")}`,time:`${String(s.getHours()).padStart(2,"0")}:${String(s.getMinutes()).padStart(2,"0")}`,durationMin:totalMin,side,leftMin:lMin,rightMin:rMin,id:uid()};await FB.stopTimerAndLog([entry]);showToast(_lang==="en"?`Nursing ${totalMin}min (L:${lMin} R:${rMin})`:`Amamentação ${totalMin}min (E:${lMin} D:${rMin})`,undoStop([entry.id]))}else{
    // Sleep/nap stop — if sleep has wakings, persist them on the entry
    let wakings=activeTimer.wakings||[];
    // If there's an unclosed nightWake, close it now
    if(activeTimer.type==="sleep"&&activeTimer.nightWake){
      const nw=activeTimer.nightWake;
      const wakeStart=new Date(nw.startTime);
      const durMin=Math.max(1,Math.round((Date.now()-wakeStart.getTime())/60000));
      wakings=[...wakings,{
        time:`${String(wakeStart.getHours()).padStart(2,"0")}:${String(wakeStart.getMinutes()).padStart(2,"0")}`,
        durationMin:durMin,
        events:nw.events||[]
      }];
    }
    const elapsedMs=Date.now()-s.getTime();
    const mins=activeTimer.type==="tummytime"?Math.max(1/60,elapsedMs/60000):Math.max(1,Math.round(elapsedMs/6e4));
    const entry={type:activeTimer.type,date:`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}-${String(s.getDate()).padStart(2,"0")}`,time:`${String(s.getHours()).padStart(2,"0")}:${String(s.getMinutes()).padStart(2,"0")}`,durationMin:activeTimer.type==="tummytime"?Math.round(mins*60)/60:mins,id:uid()};
    if(activeTimer.type==="sleep"&&wakings.length>0)entry.wakings=wakings;
    const parts=splitMidnight(entry);
    const createdIds=parts.map(p=>p.id);
    const toWrite=[...parts];
    // Auto-create wakeup event when bedtime ends (not for naps, not for tummytime).
    // v11.9.96: só pra noite DE VERDADE (>=30min) — sleep curto é mis-start e o wakeup
    // fantasma virava âncora do ajuste da rotina.
    if(activeTimer.type==="sleep"&&mins>=30){
      const totalAwake=wakings.reduce((s,w)=>s+(w.durationMin||0),0);
      const realSleep=Math.max(0,mins-totalAwake);
      const wakeup={type:"wakeup",date:todayStr(),time:nowTime(),id:uid(),nightSleepMin:realSleep,_autoFromBedtime:true};
      toWrite.push(wakeup);
      createdIds.push(wakeup.id);
    }
    // v11.9.122: batch atômico — parts + wakeup + limpar timer ativo em 1 commit só
    // (ver stopTimerAndLog no FB, index.html). Elimina a janela de "timer fantasma".
    await FB.stopTimerAndLog(toWrite);
    // Toast: tummytime uses mm:ss format, sleep/nap uses min — todos com Desfazer (v11.9.96)
    if(activeTimer.type==="tummytime"){
      const m=Math.floor(mins);const sec=Math.round((mins-m)*60);
      showToast(`Tummy time · ${m}min${sec>0?` ${sec}s`:""}`,undoStop(createdIds));
    }else if(activeTimer.type==="bath"){
      showToast(_lang==="en"?`Bath · ${mins}min`:`Banho · ${mins}min`,undoStop(createdIds));
    }else{
      const wakingNote=wakings.length>0?` (${wakings.length} ${_lang==="en"?"wake"+(wakings.length>1?"s":""):"despertar"+(wakings.length>1?"es":"")})`:"";
      showToast(`${mins}min ${_lang==="en"?"logged":"registrado"}${wakingNote}`,undoStop(createdIds))
    }
  }},[activeTimer]);

  const handleEditStart=useCallback(async(newStartISO)=>{
    if(!activeTimer)return;
    await FB.saveTimer({...activeTimer,startTime:newStartISO});
  },[activeTimer]);

  const today=todayStr();
  const cycleStart=useMemo(()=>{
    const sorted=[...entries].sort((a,b)=>`${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
    // First: find most recent wakeup
    const wk=sorted.find(e=>e.type==="wakeup");
    if(wk)return new Date(`${wk.date}T${wk.time}`);
    // Fallback: find end of a sleep/nap that ended 4-12am
    for(const e of sorted){
      if((e.type==="sleep"||e.type==="nap")&&e.durationMin>0){const end=new Date(new Date(`${e.date}T${e.time}`).getTime()+e.durationMin*60000);const h=end.getHours();if(h>=4&&h<=12)return end}
    }
    const todayEvs=entries.filter(e=>e.date===today);
    if(todayEvs.length>0){const first=[...todayEvs].sort((a,b)=>a.time.localeCompare(b.time))[0];return new Date(`${first.date}T${first.time}`)}
    return null;
  },[entries,today]);
  const cycleE=useMemo(()=>{if(!cycleStart)return entries.filter(e=>e.date===today);return entries.filter(e=>new Date(`${e.date}T${e.time}`)>=cycleStart)},[entries,cycleStart,today]);
  const todayE=useMemo(()=>entries.filter(e=>e.date===today),[entries,today]);
  const totalMl=todayE.filter(e=>e.type==="bottle").reduce((s,e)=>s+(e.ml||0),0);
  const lastBottleMl=useMemo(()=>{const b=entries.find(e=>e.type==="bottle"&&e.ml);return b?b.ml:0},[entries]);
  // v11.9.1: passa o entry inteiro pra AddForm sugerir time = last+interval
  const lastBottleEntry=useMemo(()=>entries.find(e=>e.type==="bottle"&&e.ml&&e.date&&e.time)||null,[entries]);
  // Next-feeding progress (for the Bottle quick-stat card on Home). Only computed if the
  // user has the feedingInterval reminder enabled — otherwise the card keeps its plain "ago" row.
  const feedReminder=useMemo(()=>(reminders||[]).find(r=>r.tipo==="feedingInterval"),[reminders]);
  const feedingActive=feedReminder?.ativo===true;
  // v11.7.7: barra usa `barIntervalMin` (client-only). Fallback `intervalMin` quando ausente
  // (comportamento pr\u00e9-v11.7.7). `intervalMin` continua sendo o prazo do push lido pelo backend.
  const feedingIntervalMin=feedReminder?.barIntervalMin||feedReminder?.intervalMin||120;
  const lastNursingSide=useMemo(()=>{const n=entries.find(e=>e.type==="nursing"&&e.side);return n?n.side:null},[entries]);
  const nextNursingSide=lastNursingSide==="left"||lastNursingSide==="both"?"right":"left";
  const topMl=useMemo(()=>{const counts={};entries.filter(e=>e.type==="bottle"&&e.ml).forEach(e=>{counts[e.ml]=(counts[e.ml]||0)+1});return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([v])=>Number(v))},[entries]);
  const totalNursingMin=todayE.filter(e=>e.type==="nursing"&&e.durationMin).reduce((s,e)=>s+e.durationMin,0);
  const totalNursing=todayE.filter(e=>e.type==="nursing").length;
  const totalSleep=sumRealSleep(todayE);
  const totalDiapers=todayE.filter(e=>e.type==="diaper").length;
  const totalBottles=todayE.filter(e=>e.type==="bottle").length;
  const totalNapMin=todayE.filter(e=>e.type==="nap"&&e.durationMin).reduce((s,e)=>s+e.durationMin,0);
  const totalNapCount=todayE.filter(e=>e.type==="nap"&&e.durationMin).length;
  // v11.8.3: simeticona count pro card no Home (substitui o card de nursing).
  const totalSimet=todayE.filter(e=>e.type==="medicine"&&e.name&&/simet/i.test(e.name)).length;
  // v11.9.88: Tylenol (paracetamol) ganhou card próprio na Home (antes só Simeticona).
  const totalTylenol=todayE.filter(e=>e.type==="medicine"&&e.name&&/tylenol|paraceta/i.test(e.name)).length;
  // Breakdown wet/dirty pro card Diaper no Home (v10.8.0). "both" conta em ambos.
  const todayDiapers=todayE.filter(e=>e.type==="diaper");
  const wetDiapers=todayDiapers.filter(e=>e.subtype==="wet"||e.subtype==="both").length;
  const dirtyDiapers=todayDiapers.filter(e=>e.subtype==="dirty"||e.subtype==="both").length;
  const napNums=useMemo(()=>{const naps=[...todayE].reverse().filter(e=>e.type==="nap");const m={};naps.forEach((n,i)=>{m[n.id]=i+1});return m},[todayE]);
  const age=calcAge(profile.birthDate);const babyName=profile.name||(_lang==="en"?"Baby":"Bebê");
  const sleepRec=useMemo(()=>getSleepRec(entries,age,profile.birthDate),[entries,age,profile.birthDate]);
  const sleepPattern=useMemo(()=>analyzeSleepPatterns(entries,7),[entries]);
  const daySchedule=useMemo(()=>{
    if(!sleepPattern)return[];
    let wm=6*60;const wk=todayE.find(e=>e.type==="wakeup");
    if(wk){wm=toMinutes(wk.time)}else{const ls=todayE.filter(e=>(e.type==="sleep"||e.type==="nap")&&e.durationMin>0).sort((a,b)=>b.time.localeCompare(a.time))[0];if(ls){const em=toMinutes(ls.time)+ls.durationMin;if(em>=300&&em<=720)wm=em}}
    return projectSchedule(wm,sleepPattern,todayE);
  },[sleepPattern,todayE]);
  const fullSchedule=useMemo(()=>{
    if(!sleepPattern||!sleepPattern.fullPattern)return[];
    let wm=6*60;const wk=todayE.find(e=>e.type==="wakeup");
    if(wk){wm=toMinutes(wk.time)}else{const ls=todayE.filter(e=>(e.type==="sleep"||e.type==="nap")&&e.durationMin>0).sort((a,b)=>b.time.localeCompare(a.time))[0];if(ls){const em=toMinutes(ls.time)+ls.durationMin;if(em>=300&&em<=720)wm=em}}
    return predictRoutine(todayE,sleepPattern.fullPattern,wm,age?age.totalWeeks:4);
  },[sleepPattern,todayE,age]);
  const dayInsights=useMemo(()=>{
    const hints=getDayInsights(todayE,sleepPattern,sleepRec?.g)||[];
    // v11.7.9: night-pattern hint s\u00f3 aparece com bedtime encerrado. Se o timer de sleep
    // ainda est\u00e1 ativo \u00e0s 10h (noite esticou), segura o hint pra n\u00e3o sair com dado parcial.
    if(activeTimer&&activeTimer.type==="sleep"){
      return hints.filter(h=>{
        const t=(h.title||"").toLowerCase();
        return !t.includes("night pattern")&&!t.includes("padrao das noites")&&!t.includes("padr\u00e3o das noites");
      });
    }
    return hints;
  },[todayE,sleepPattern,sleepRec,activeTimer]);
  const napSug=useMemo(()=>{
    if(activeTimer)return null;
    const sug=getNapSug(cycleE,sleepRec);
    if(!sug)return null;
    // v11.9.42: quando rotina fixa da pediatra ativa, neutraliza signals visíveis do engine.
    // Mantém `el` (tempo desde acordar) pro Ring mostrar "Acordada há Xh", mas zera:
    //   - state (esconde banners overdue/stretching/sweet/opening + neutraliza cor do Ring)
    //   - predictedTime + napPos (esconde "Nap 3 ~13:42" dentro do arco)
    if(profile?.routine?.enabled===true){
      return{...sug,state:null,predictedTime:null,napPos:null};
    }
    return sug;
  },[cycleE,sleepRec,activeTimer,tick,profile?.routine]);
  // v11.9.40: rotina do dia (pediatra) — matching slot ↔ entry com tolerância ±20-30min.
  // Dependências em `tick` pra status (next/late) atualizar conforme o tempo passa.
  // v11.9.71: rotina expansível (opt-in). Preferência por-device em localStorage.
  // Hook DEFINIDO AQUI (topo do App, antes do early-return de splash) — Rules of Hooks.
  const[routineExpanded,setRoutineExpanded]=useState(()=>{try{return localStorage.getItem("lp_routine_expanded")==="1"}catch(e){return false}});
  // v11.9.116 (auditoria de design): nudge de onboarding quando o perfil ainda não tem
  // nome — dispensável por-device (flag booleana, não por-dia — preencher o nome é ação
  // única). NUNCA controlado por timer, só por !profile.name — respeita a regra de Home
  // estável (nada que apareça/suma sozinho acima do Ring).
  const[onbDismissed,setOnbDismissed]=useState(()=>{try{return localStorage.getItem("lp_onboarding_dismissed")==="1"}catch(e){return false}});
  const dismissOnboarding=useCallback(()=>{setOnbDismissed(true);try{localStorage.setItem("lp_onboarding_dismissed","1")}catch(e){}},[]);
  const toggleRoutineExpanded=useCallback(()=>setRoutineExpanded(v=>{const nv=!v;try{localStorage.setItem("lp_routine_expanded",nv?"1":"0")}catch(e){}if(window.Haptic&&Haptic.light)Haptic.light();return nv}),[]);
  const routineState=useMemo(()=>{
    const r=profile?.routine;
    if(!r||r.enabled!==true)return null;
    const now=new Date();
    const nowMin=now.getHours()*60+now.getMinutes();
    const slots=[];
    // v11.9.83: a rotina segue o horário REAL de acordar. delta = acordou − alvo.
    // Sonecas e banho deslocam pelo delta; o bedtime fica ANCORADO em [bedtime, bedtime+30]
    // (ex: config 19:30 → janela 19:30-20:00). Trava em ±2h e ignora ruído <10min.
    const schedWakeMin=r.wakeTime?toMinutes(r.wakeTime):null;
    let wakeDelta=0;
    const wkEv=todayE.find(e=>e.type==="wakeup");
    if(wkEv&&wkEv.time&&schedWakeMin!=null){let d=toMinutes(wkEv.time)-schedWakeMin;if(Math.abs(d)<10)d=0;wakeDelta=Math.max(-120,Math.min(120,d))}
    const bedFloor=r.bedtime?toMinutes(r.bedtime):null;
    const adj=(tMin,kind)=>{if(wakeDelta===0)return tMin;if(kind==="bed"&&bedFloor!=null)return Math.max(bedFloor,Math.min(bedFloor+30,tMin+wakeDelta));return tMin+wakeDelta};
    // v11.9.46: timer ATIVO (nap/sleep em andamento) também conta como "done".
    // Cenário: você toca em "Iniciar soneca" às 13:25 — slot da 3ª (alvo 13:30) já fica ✓
    // verde sem precisar esperar terminar o timer pra criar a entry no Firestore.
    // v11.9.69: janela ASSIMÉTRICA. earlyTol = quanto ANTES do alvo ainda conta como
    // "feito"; lateTol = quanto DEPOIS. Se lateTol omitido, é simétrico (= earlyTol).
    // Princípio: se o evento ACONTECEU (mesmo fora do horário), conta e segue — a rotina
    // é guia, não cobrança. Acordar 6:30 quando o alvo era 7:00 tem que contar (não bugar).
    // v11.9.80: matching por SOBREPOSIÇÃO de intervalo (não só hora de início).
    // Cada evento é um intervalo [início, início+duração]. Conta como "feito" se esse
    // intervalo INTERSECTA a janela aceitável do slot [alvo-earlyTol, alvo+lateTol].
    // Resolve: soneca que começou bem ANTES do alvo mas seguiu DURANTE/ATÉ o horário
    // marcado (bebê dormindo na hora da soneca) -> conta. Eventos sem duração (acordar/
    // banho) viram intervalo de 1 ponto -> regra cai exatamente no "início na janela" de antes.
    const overlaps=(start,end,tMin,earlyTol,lateTol)=>start<=tMin+lateTol&&end>=tMin-earlyTol;
    const activeTimerMatch=(types,tMin,earlyTol,lateTol)=>{
      if(!activeTimer)return null;
      if(!types.includes(activeTimer.type))return null;
      const st=new Date(activeTimer.startTime);
      const tStart=st.getHours()*60+st.getMinutes();
      // timer em andamento: intervalo até agora = [tStart, nowMin].
      if(!overlaps(tStart,Math.max(tStart,nowMin),tMin,earlyTol,lateTol))return null;
      return{type:activeTimer.type,time:`${String(st.getHours()).padStart(2,"0")}:${String(st.getMinutes()).padStart(2,"0")}`,_active:true};
    };
    const findMatch=(types,tMin,earlyTol,lateTol)=>{
      if(lateTol==null)lateTol=earlyTol;
      const liveT=activeTimerMatch(types,tMin,earlyTol,lateTol);
      if(liveT)return liveT;
      return todayE.find(e=>{
        if(!types.includes(e.type))return false;
        const st=toMinutes(e.time);
        const en=st+(e.durationMin>0?e.durationMin:0);
        return overlaps(st,en,tMin,earlyTol,lateTol);
      });
    };
    // v11.9.45: tolerância generosa (40-50min late ainda conta como "feito").
    // v11.9.69: WAKE é assimétrico — acordou cedo SEMPRE conta (early 150min, late 90min).
    // Naps/banho/bed seguem simétricos ±60min (gaps de ~150min não deixam cruzar slots).
    if(r.wakeTime){const tMin=toMinutes(r.wakeTime);slots.push({key:"wake",type:"wake",icon:"sun",col:T.amber,target:r.wakeTime,targetMin:tMin,tolMin:90,match:findMatch(["wakeup"],tMin,150,90),lbl:_lang==="en"?"Wake up":"Acordar",chip:_lang==="en"?"Wake":"Wake"})}
    (r.naps||[]).forEach((nap,i)=>{
      if(!nap?.time)return;
      const tMin=adj(toMinutes(nap.time),"nap");
      slots.push({key:"nap"+i,type:"nap",icon:"cloud",col:T.accent,target:minToTime(tMin),targetMin:tMin,tolMin:60,num:i+1,match:null,lbl:`${i+1}${_lang==="en"?["st","nd","rd","th"][i]||"th":"ª"} ${_lang==="en"?"Nap":"Soneca"}`,chip:`${i+1}${_lang==="en"?"a":"ª"} S`})
    });
    if(r.bathTime){const tMin=adj(toMinutes(r.bathTime),"bath");slots.push({key:"bath",type:"bath",icon:"bath",col:T.cyan,target:minToTime(tMin),targetMin:tMin,tolMin:60,match:findMatch(["bath"],tMin,60),lbl:_lang==="en"?"Bath":"Banho",chip:_lang==="en"?"Bath":"Banho"})}
    // v11.9.88-91/104: estágios pós-banho — mamadeira pós-banho + Myrafer + vitamina D
    // (Floripa virou Myrafer na v11.9.104, mesmo mecanismo calculado: mamadeira + 5min).
    // v11.9.90: aparecem por DEFAULT (banho+15min) SEM precisar salvar Ajustes — o Salvar
    // nem liberava sem mudança, então os estágios nunca apareciam (bug da v11.9.88).
    // r.postBathBottleTime, se salvo, sobrescreve o default.
    // v11.9.91: FLORIPA *E* VIT. D são CALCULADOS (sem campo nos Ajustes): alvo = mamadeira
    // pós-banho + 5min — usa o horário REGISTRADO quando a mamadeira já aconteceu (mamou
    // 18:28 → 18:33), senão o alvo dela. r.floripaTime/r.vitdTime legados são IGNORADOS.
    // Remédios DIÁRIOS casam por NOME em qualquer hora do dia (deu hoje = feito; o horário
    // do slot só ordena o "próximo"). A mamadeira pós-banho casa por JANELA assimétrica
    // (45 antes / 90 depois) — mamadeira acontece ~7x/dia, não dá pra casar qualquer uma.
    const medToday=re=>todayE.find(e=>e.type==="medicine"&&e.name&&re.test(e.name));
    const pbTimeStr=r.postBathBottleTime||(r.bathTime?minToTime(toMinutes(r.bathTime)+15):null);
    let pbTMin=null,pbHit=null;
    if(pbTimeStr){pbTMin=adj(toMinutes(pbTimeStr),"pb");pbHit=findMatch(["bottle"],pbTMin,45,90);slots.push({key:"pbbottle",type:"pbbottle",icon:"bottle",col:T.green,target:minToTime(pbTMin),targetMin:pbTMin,tolMin:60,match:pbHit,lbl:_lang==="en"?"Post-bath bottle":"Mamad. pós-banho",chip:_lang==="en"?"Bottle":"Mamad."})}
    if(pbTMin!=null){
      const fMin=(pbHit&&pbHit.time?toMinutes(pbHit.time):pbTMin)+5;
      slots.push({key:"myrafer",type:"myrafer",icon:"pill",col:T.amber,target:minToTime(fMin),targetMin:fMin,tolMin:60,match:medToday(/myrafer/i),lbl:"Myrafer",chip:"Myrafer"});
      slots.push({key:"vitd",type:"vitd",icon:"droplet",col:T.amber,target:minToTime(fMin),targetMin:fMin,tolMin:60,match:medToday(/vit(amina)?\s*\.?\s*d/i),lbl:_lang==="en"?"Vitamin D":"Vitamina D",chip:"Vit D"});
    }
    if(r.bedtime){const tMin=adj(toMinutes(r.bedtime),"bed");slots.push({key:"bedtime",type:"bedtime",icon:"bed",col:T.purple,target:minToTime(tMin),targetMin:tMin,tolMin:60,match:findMatch(["sleep"],tMin,60),lbl:_lang==="en"?"Bedtime":"Bedtime",chip:_lang==="en"?"Bed":"Bed"})}
    slots.sort((a,b)=>a.targetMin-b.targetMin);
    // v11.9.87: matching de SONECA por CONSUMO — cada evento (ou o timer ativo) satisfaz no
    // MÁXIMO 1 slot. Bug: uma soneca longa (ou com alvos deslocados pelo acordar) intersectava
    // a janela de DOIS slots e o findMatch (stateless) marcava ambos como "done". Agora monta um
    // pool de candidatos "nap" (entries de hoje + o timer ativo como 1 token só) e cada slot de
    // soneca, em ordem cronológica, pega o candidato NÃO-consumido mais PRÓXIMO do seu alvo.
    const napPool=[];
    todayE.forEach((e,idx)=>{if(e.type==="nap"){const st=toMinutes(e.time);napPool.push({idx,start:st,end:st+(e.durationMin>0?e.durationMin:0),ev:e})}});
    if(activeTimer&&activeTimer.type==="nap"){const t=new Date(activeTimer.startTime);const ts=t.getHours()*60+t.getMinutes();napPool.push({idx:"__active__",start:ts,end:Math.max(ts,nowMin),_active:true,time:`${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}`})}
    const napConsumed=new Set();
    for(const s of slots){
      if(s.type!=="nap")continue;
      let best=null,bestDist=Infinity;
      for(const c of napPool){
        if(napConsumed.has(c.idx))continue;
        if(!overlaps(c.start,c.end,s.targetMin,60,60))continue;
        const d=Math.abs(c.start-s.targetMin);
        if(d<bestDist||(d===bestDist&&best&&c.start<best.start)){bestDist=d;best=c}
      }
      if(best){napConsumed.add(best.idx);s.match=best._active?{type:"nap",time:best.time,_active:true}:best.ev}
    }
    // Atribui status: done | late | next | pending
    let nextAssigned=false;
    for(const s of slots){
      if(s.match){s.status="done";continue}
      if(nowMin>s.targetMin){s.status="late"}
      else if(!nextAssigned){s.status="next";nextAssigned=true}
      else{s.status="pending"}
    }
    // v11.9.105: PULADO — uma etapa "late" cujo dia já SEGUIU (existe etapa de alvo MAIOR já
    // feita) foi pulada, não está mais sendo cobrada. Vira neutra e LIBERA a "rotina concluída
    // (parcial)". Ex: 3ª soneca não rolou mas o banho já aconteceu → a soneca foi pulada, não
    // está "atrasada". Uma "late" recente (nada depois feito ainda) continua cobrando (next-late).
    // v11.9.119: um timer ATIVO (soneca/banho/sono) que não bate com NENHUM slot oficial (ex:
    // soneca "extra", fora de qualquer janela configurada) também prova que o dia seguiu — sem
    // isso, uma etapa atrasada ficava presa em "atrasada" pra sempre mesmo com outra soneca
    // claramente rolando depois dela. Conta o INÍCIO do timer como candidato, igual um "done".
    const activeTimerStartMin=(activeTimer&&["nap","bath","sleep"].includes(activeTimer.type))?(()=>{const st=new Date(activeTimer.startTime);return st.getHours()*60+st.getMinutes()})():-1;
    const maxDoneTarget=Math.max(slots.reduce((m,s)=>(s.status==="done"&&s.targetMin>m?s.targetMin:m),-1),activeTimerStartMin);
    for(const s of slots){if(s.status==="late"&&s.targetMin<maxDoneTarget)s.status="skipped"}
    // A 1ª "late" RESTANTE (recente, ainda possível) vira "next-late" — prioridade no headline.
    const firstLate=slots.find(s=>s.status==="late");
    if(firstLate)firstLate.status="next-late";
    const headline=slots.find(s=>s.status==="next-late")||slots.find(s=>s.status==="next");
    const bottlesDone=todayE.filter(e=>e.type==="bottle"||e.type==="nursing").length;
    // v11.9.83: contagem ADAPTATIVA — mediana de mamadas/dia das últimas ~21 datas com dado
    // (exclui hoje, incompleto). Fallback pro configurado se < 5 dias de histórico.
    let bottlesTarget=r.bottlesPerDay||7;
    {
      const today=todayStr();const byDay={};
      (entries||[]).forEach(e=>{if((e.type==="bottle"||e.type==="nursing")&&e.date&&e.date!==today)byDay[e.date]=(byDay[e.date]||0)+1});
      const days=Object.keys(byDay).sort().slice(-21).map(d=>byDay[d]);
      if(days.length>=5){const s=days.slice().sort((a,b)=>a-b);const med=s.length%2?s[(s.length-1)/2]:Math.round((s[s.length/2-1]+s[s.length/2])/2);bottlesTarget=Math.max(1,Math.min(20,med))}
    }
    // v11.9.83: ml DINÂMICO — próxima ≈ (meta − já tomado hoje) ÷ (mamadeiras que faltam).
    const consumedMl=todayE.filter(e=>e.type==="bottle").reduce((s,e)=>s+(e.ml||0),0);
    const mlGoal=profile?.mlGoal||0;
    let nextBottleMl=null;
    if(mlGoal>0){const remain=Math.max(1,bottlesTarget-bottlesDone);nextBottleMl=Math.max(0,Math.round((mlGoal-consumedMl)/remain/5)*5)}
    // v11.9.105: rotina "parcialmente feita" — concluída quando NADA está pendente (tudo done
    // OU pulado) e ao menos 1 etapa aconteceu. skippedCount alimenta o "concluída · N pulado".
    const skippedCount=slots.filter(s=>s.status==="skipped").length;
    const allDone=slots.some(s=>s.status==="done")&&slots.every(s=>s.status==="done"||s.status==="skipped");
    return{slots,headline,bottlesDone,bottlesTarget,allDone,skippedCount,hasRoutine:true,wakeDelta,nextBottleMl,mlGoal,consumedMl};
  },[profile?.routine,profile?.mlGoal,entries,todayE,tick,activeTimer]);
  // v11.9.127: chuva de meteoros quando a rotina FECHA (mais-vida ideia E). Dispara só na
  // TRANSIÇÃO false→true observada em sessão (prev seedado com null: abrir o app com a
  // rotina já completa não conta) + trava de 1x/dia em localStorage. Overlay efêmero de
  // 4.5s, pointer-events none — não mexe no layout da Home (invariante de estabilidade).
  const[meteors,setMeteors]=useState(false);
  const prevAllDone=useRef(null);
  useEffect(()=>{
    const ad=routineState?.allDone===true;
    const was=prevAllDone.current;
    prevAllDone.current=ad;
    if(was===false&&ad){
      const today=todayStr();let done="";
      try{done=localStorage.getItem("lp_meteors_date")||""}catch(_){}
      if(done!==today){
        setMeteors(true);
        try{localStorage.setItem("lp_meteors_date",today)}catch(_){}
        const t=setTimeout(()=>setMeteors(false),4500);
        return()=>clearTimeout(t);
      }
    }
  },[routineState?.allDone]);
  // v11.9.83: 3 quick buttons adaptativos (ver suggestQuickActions no topo). nowMin é lido
  // no render — refresca ao abrir o app, registrar algo ou navegar (sem tick novo/bateria).
  const quickSuggestions=useMemo(()=>{const d=new Date();return suggestQuickActions(entries,todayE,d.getHours()*60+d.getMinutes(),profile?.routine)},[entries,todayE,tick,profile?.routine]);
  // v11.9.128: memória do dia (mais-vida ideia A). Em dia de aniversário redondo de uma
  // "primeira vez", uma estrela cadente cruza o Ring + faísca tocável revela a memória.
  // 1x/dia por device (lp_memory_seen). Hooks ACIMA do early-return de splash.
  const memory=useMemo(()=>dailyMemory(entries,profile?.birthDate,today),[entries,profile?.birthDate,today]);
  const[memorySeenDate,setMemorySeenDate]=useState(()=>{try{return localStorage.getItem("lp_memory_seen")||""}catch(e){return""}});
  const[showMemory,setShowMemory]=useState(false);
  const openMemory=useCallback(()=>{setShowMemory(true);const d=todayStr();setMemorySeenDate(d);try{localStorage.setItem("lp_memory_seen",d)}catch(e){}},[]);
  const memoryActive=!!memory&&memorySeenDate!==today;
  // Live bedtime virtual entry: built when an active sleep timer is running.
  // Used by Home (shows in-progress block at top of today's list) and HistoryPage
  // (which intentionally HIDES it — bedtimes only appear in history once finalized).
  // Recomputes on every tick so the totalMin and active waking advance live.
  const liveBedtime=useMemo(()=>{
    if(!activeTimer||activeTimer.type!=="sleep")return null;
    const startMs=new Date(activeTimer.startTime).getTime();
    const startD=new Date(startMs);
    const startDate=`${startD.getFullYear()}-${String(startD.getMonth()+1).padStart(2,"0")}-${String(startD.getDate()).padStart(2,"0")}`;
    const startTime=`${String(startD.getHours()).padStart(2,"0")}:${String(startD.getMinutes()).padStart(2,"0")}`;
    const totalMin=Math.max(1,Math.floor((Date.now()-startMs)/60000));
    const wakings=[...(activeTimer.wakings||[])];
    if(activeTimer.nightWake){
      const nwStart=new Date(activeTimer.nightWake.startTime);
      const nwDur=Math.max(1,Math.floor((Date.now()-nwStart.getTime())/60000));
      wakings.push({
        time:`${String(nwStart.getHours()).padStart(2,"0")}:${String(nwStart.getMinutes()).padStart(2,"0")}`,
        durationMin:nwDur,
        events:activeTimer.nightWake.events||[],
        isActive:true
      });
    }
    return{id:"__live__",type:"sleep",date:startDate,time:startTime,durationMin:totalMin,wakings};
  },[activeTimer,tick]);
  const daysLeft=sleepRec?.phase===1?sleepRec.dl:null;

  // ── INBOX CAPTURE: sync dayInsights into persistent inbox ──
  // Dedup via stable hintKey (slug of title + today's date).
  // Updates existing items (sub + timestamp) while preserving read state.
  // Guards against render loop via lastHashRef.
  const lastHashRef=useRef("");
  useEffect(()=>{
    if(!dayInsights||!Array.isArray(dayInsights))return;
    const slugify=s=>(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    const td=todayStr();
    // Build fresh hint list from engine output
    const fresh=dayInsights.map(h=>({
      key:`${slugify(h.title)}-${td}`,
      title:h.title||"",
      sub:h.sub||"",
      type:h.type||"info",
    }));
    // Hash to detect actual changes (title+sub only — ignores order)
    const hash=fresh.map(h=>`${h.key}|${h.sub}`).sort().join("~");
    if(hash===lastHashRef.current)return;
    lastHashRef.current=hash;
    if(fresh.length===0)return;
    // Merge with existing inbox: update existing, insert new, preserve read state
    const existing=(inbox.items||[]).filter(it=>it.date===td);
    const existingKeys=new Set(existing.map(it=>it.key));
    const now=Date.now();
    const merged=[...existing];
    let changed=false;
    fresh.forEach(h=>{
      const idx=merged.findIndex(it=>it.key===h.key);
      if(idx>=0){
        // Update if sub changed
        if(merged[idx].sub!==h.sub||merged[idx].title!==h.title){
          merged[idx]={...merged[idx],title:h.title,sub:h.sub,type:h.type,timestamp:now};
          changed=true;
        }
      }else{
        // New hint
        merged.push({key:h.key,title:h.title,sub:h.sub,type:h.type,timestamp:now,read:false,date:td});
        changed=true;
      }
    });
    if(!changed)return;
    // Sort by timestamp desc and persist
    merged.sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
    // v11.9.34: trim a 30 items. Reset diario ja zera, mas se app fica fechado por dias
    // os items acumulam. 30 e mais que suficiente pra qualquer dia normal.
    const trimmed=merged.slice(0,30);
    FB.saveInbox({items:trimmed,lastReset:inbox.lastReset||td});
  },[dayInsights,inbox.items,inbox.lastReset]);

  // ── INBOX MIDNIGHT RESET ──
  // Strict reset at midnight: clears items and updates lastReset.
  // Runs on mount and on every tick (30s interval, or 1s when timer active).
  useEffect(()=>{
    const td=todayStr();
    if(inbox.lastReset&&inbox.lastReset!==td){
      // New day detected — clear inbox
      FB.saveInbox({items:[],lastReset:td});
      lastHashRef.current=""; // allow recapture today's hints fresh
    }else if(!inbox.lastReset){
      // First-ever load: just set lastReset without clearing
      FB.saveInbox({items:inbox.items||[],lastReset:td});
    }
  },[tick,inbox.lastReset]);

  // ── INBOX CURIOSITY CAPTURE ──
  // Inject today's curiosity into the inbox once per day, so the user can read it
  // anytime until midnight (not only when it auto-shows on Home).
  // Key is stable (curiosity-YYYY-MM-DD) so it's dedup'd correctly and persists
  // the read state across re-renders.
  useEffect(()=>{
    if(!age)return;
    const td=todayStr();
    // Skip if inbox not yet initialized (midnight reset effect handles first load)
    if(!inbox.lastReset||inbox.lastReset!==td)return;
    const curi=getTodayCuriosity(age,_lang);
    if(!curi)return;
    const key=`curiosity-${td}`;
    const exists=(inbox.items||[]).some(it=>it.key===key);
    if(exists)return;
    // Insert curiosity as a new item with type "curiosity" (distinct visual)
    const newItem={
      key,
      title:`${curi.tagLabel} · ${curi.title}`,
      sub:curi.body,
      type:"curiosity",
      timestamp:Date.now(),
      read:false,
      date:td
    };
    const merged=[newItem,...(inbox.items||[])].sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
    FB.saveInbox({items:merged,lastReset:td});
  },[age,inbox.items,inbox.lastReset]);

  // ── INBOX HANDLERS (v11.1 — per-device read state via localStorage) ──
  // Antes: `read: true` ia pro Firestore `inbox.items[].read` compartilhado. Problema 1:
  // race condition com subInbox onSnapshot que podia sobrescrever o mark-read antes de
  // persistir. Problema 2: se William marca como lida, esposa não vê como não-lida no
  // próprio device. Solução: Set de keys lidas em localStorage, per-device. O CONTEÚDO
  // das notifs continua no Firestore (gerado pela engine, shared), só o state "lida por
  // este device" fica local. Legacy `item.read === true` do Firestore ainda é respeitado
  // pra não quebrar dados antigos.
  const[localReadKeys,setLocalReadKeys]=useState(()=>{
    try{return new Set(JSON.parse(localStorage.getItem("lp_inbox_read")||"[]"))}catch(_){return new Set()}
  });
  const persistLocalReadKeys=useCallback(newSet=>{
    try{
      // Cap em 500 keys pra localStorage não virar um database infinito.
      // Keys têm date suffix (ex: night-pattern-2026-04-19), então as mais antigas saem naturalmente.
      const arr=[...newSet];
      const capped=arr.length>500?arr.slice(-500):arr;
      localStorage.setItem("lp_inbox_read",JSON.stringify(capped));
    }catch(_){}
  },[]);
  const markInboxRead=useCallback(key=>{
    setLocalReadKeys(prev=>{
      if(prev.has(key))return prev;
      const next=new Set(prev);next.add(key);
      persistLocalReadKeys(next);
      return next;
    });
  },[persistLocalReadKeys]);
  const markAllInboxRead=useCallback(()=>{
    const allKeys=(inbox.items||[]).map(it=>it.key);
    setLocalReadKeys(prev=>{
      const next=new Set(prev);allKeys.forEach(k=>next.add(k));
      persistLocalReadKeys(next);
      return next;
    });
  },[inbox.items,persistLocalReadKeys]);
  // Unread = NÃO está em localReadKeys E não tem flag legacy `read: true` do Firestore.
  const isRead=useCallback(it=>it.read===true||localReadKeys.has(it.key),[localReadKeys]);
  const inboxUnreadCount=(inbox.items||[]).filter(it=>!isRead(it)).length;

  // Vibrate when sleep window warning triggers
  const prevWind=useRef(false);const prevOver=useRef(false);
  useEffect(()=>{
    if(napSug?.wind&&!prevWind.current&&navigator.vibrate)navigator.vibrate([200,100,200]);
    if(napSug?.over&&!prevOver.current&&navigator.vibrate)navigator.vibrate([300,150,300,150,300]);
    prevWind.current=!!napSug?.wind;prevOver.current=!!napSug?.over;
  },[napSug?.wind,napSug?.over]);

  // Starfield foi extraído pra módulo-level (ver `<Starfield/>` logo antes do App). v10.5.3.

  // v11.9.68 HOTFIX: goGrowth (useCallback) DEVE ficar ANTES deste early-return de
  // splash/loading. Senão o hook é pulado no render de splash e roda no render normal
  // -> contagem de hooks muda -> React #310 (crash). Hooks sempre antes de qualquer return.
  // v11.9.99: o Crescimento lembra DE ONDE foi aberto (Stats ou Ajustes) — o voltar
  // restaura a origem em vez de despejar sempre no Stats.
  const growthFromRef=useRef({page:"stats"});
  const goGrowth=useCallback(()=>{growthFromRef.current={page:"stats"};setPage("growth");setShowAdd(false);setFormType(null)},[]);
  // v11.9.110: Comportamento (curva semanal) — mesmo padrão do Crescimento. useCallback ANTES do early-return.
  const behaviorFromRef=useRef({page:"stats"});
  const goBehavior=useCallback(()=>{behaviorFromRef.current={page:"stats"};setPage("behavior");setShowAdd(false);setFormType(null)},[]);
  if(splash||loading)return(
    <div style={{background:"linear-gradient(180deg,#0e0825,#070b1e 70%,#070b1e)",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",overflow:"hidden",opacity:splash?1:0,transition:"opacity .4s",position:"relative"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"50%",background:"radial-gradient(ellipse at 50% 30%,rgba(50,25,100,0.15),transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,pointerEvents:"none"}}>{Array.from({length:25}).map((_,i)=><div key={i} style={{position:"absolute",width:Math.random()*2+0.5,height:Math.random()*2+0.5,background:`rgba(160,170,255,${Math.random()*0.25+0.05})`,borderRadius:"50%",top:Math.random()*100+"%",left:Math.random()*100+"%"}}/>)}</div>
      <div style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",zIndex:1}}>
        <div style={{position:"relative",marginBottom:24,width:200,height:279}}>
          {/* Halo roxo respirando atras da logo */}
          <div style={{position:"absolute",top:"50%",left:"50%",width:290,height:290,borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,0.32),rgba(139,124,246,0.10) 40%,transparent 70%)",filter:"blur(12px)",pointerEvents:"none",animation:"splashHaloBreathe 2.8s ease-in-out 0.6s infinite",transform:"translate(-50%,-50%) scale(0.85)",opacity:0}}/>
          {/* v11.9.132: splash "a família" (arte escolhida pelo William, vetorizada) — mãe+Louise
              se desenham primeiro, o pai é o ÚLTIMO a se traçar, chegando pro abraço.
              v11.9.133: ~25% maior (feedback: "ficou pequeno"). */}
          <svg width="196" height="279" viewBox="340 245 372 530" style={{position:"relative",display:"block",margin:"0 auto"}}>
            <defs>
              <linearGradient id="splDrawG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e7deff"/><stop offset="0.55" stopColor="#b9a6f7"/><stop offset="1" stopColor="#8b7cf6"/></linearGradient>
              <linearGradient id="splFillG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#e3dcff"/></linearGradient>
            </defs>
            <path d={LOUISE_FAM_MOM} fillRule="evenodd" fill="url(#splFillG)" className="spl2-mom-fill"/>
            <path d={LOUISE_FAM_DAD} fillRule="evenodd" fill="url(#splFillG)" className="spl2-dad-fill"/>
            <path d={LOUISE_FAM_MOM} pathLength="1" fill="none" stroke="url(#splDrawG)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="spl2-mom-draw"/>
            <path d={LOUISE_FAM_DAD} pathLength="1" fill="none" stroke="url(#splDrawG)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="spl2-dad-draw"/>
          </svg>
        </div>
        <div style={{animation:"splashText 1.2s ease both",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{display:"flex",gap:4,alignItems:"baseline"}}><span style={{fontSize:T.f3XL,fontWeight:200,letterSpacing:5,textTransform:"uppercase",color:"rgba(228,230,245,0.8)"}}>LOUISE</span><span style={{fontSize:T.f3XL,fontWeight:800,letterSpacing:5,textTransform:"uppercase",background:"linear-gradient(135deg,#a78bfa,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PRO</span></div>
          <div style={{fontSize:T.fSM,color:"#555a80",letterSpacing:4,textTransform:"uppercase",marginTop:8}}>Baby Tracker</div>
          <div style={{width:40,height:1,background:"linear-gradient(90deg,transparent,rgba(139,124,246,0.3),transparent)",marginTop:24}}/>
        </div>
      </div>
      <div style={{position:"absolute",bottom:30,fontSize:T.fXS,color:"rgba(139,124,246,0.3)",letterSpacing:2}}>v{APP_VERSION}</div>
    </div>
  );
  const goTo=p=>{setPage(p);setShowAdd(false);setFormType(null)};

  // SWIPE handlers (v9.9.2) — touch events, velocity tracking, low-threshold flick
  const onSwipeStart=e=>{
    if(e.target.closest("button,input,textarea,select,a,[data-no-swipe]"))return;
    const t=e.touches[0];
    const sw=swipeRef.current?swipeRef.current.offsetWidth:window.innerWidth;
    swipeGestureRef.current={startX:t.clientX,startY:t.clientY,lastX:t.clientX,lastT:performance.now(),velocity:0,active:true,locked:null,sw};
  };
  const onSwipeMove=e=>{
    const st=swipeGestureRef.current;
    if(!st.active)return;
    const t=e.touches[0];
    const dx=t.clientX-st.startX;
    const dy=t.clientY-st.startY;
    if(st.locked===null){
      const ax=Math.abs(dx),ay=Math.abs(dy);
      if(ax<6&&ay<6)return;
      if(ay>ax*1.1){st.locked="v";st.active=false;return}
      st.locked="h";
      setSwipeDragging(true);
    }
    if(st.locked==="h"){
      const now=performance.now();
      const dt=now-st.lastT;
      if(dt>0)st.velocity=(t.clientX-st.lastX)/dt;
      st.lastX=t.clientX;st.lastT=now;
      let offset=dx;
      const cur=swipeIdxRef.current;
      if(cur===0&&offset>0)offset=offset*0.3;
      else if(cur===SWIPE_PAGES.length-1&&offset<0)offset=offset*0.3;
      setDragPx(offset);
      if(e.cancelable)e.preventDefault();
    }
  };
  const onSwipeEnd=()=>{
    const st=swipeGestureRef.current;
    if(st.locked!=="h"){st.active=false;st.locked=null;return}
    const dx=st.lastX-st.startX;
    const v=st.velocity;
    const cur=swipeIdxRef.current;
    const distThresh=st.sw*0.15;
    let target=cur;
    if((dx<-distThresh||(dx<-40&&v<-0.4))&&cur<SWIPE_PAGES.length-1)target=cur+1;
    else if((dx>distThresh||(dx>40&&v>0.4))&&cur>0)target=cur-1;
    if(target!==cur){setPage(SWIPE_PAGES[target]);setShowAdd(false)}
    setDragPx(0);
    setSwipeDragging(false);
    st.active=false;st.locked=null;
  };

  return(<div style={{background:"transparent",height:"var(--phys-h, 100dvh)",overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch",overscrollBehavior:"none",color:T.text,maxWidth:480,margin:"0 auto",position:"relative"}}>
    {/* Starfield: componente memoizado, renderiza 1x por sessão (v10.5.3). */}
    <Starfield/>
    {/* v11.9.127: chuva de meteoros 1x quando a rotina do dia fecha — atrás dos cards
        (zIndex 0, mesmo plano do Starfield), some sozinha em 4.5s. */}
    {meteors&&<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {[{t:"12%",d:0},{t:"26%",d:0.9},{t:"44%",d:0.4},{t:"60%",d:1.6},{t:"76%",d:1.1}].map((m,i)=>
        <div key={"mt"+i} className="meteor" style={{top:m.t,right:-70,animationDelay:m.d+"s"}}/>)}
    </div>}
    {toast&&<Toast message={toast} lift={!!activeTimer} onUndo={undoRef.current?handleUndo:null} onRepeat={repeatRef.current?handleRepeat:null} onClose={()=>setToast(null)}/>}
    <Confetti trigger={confettiOn} onDone={()=>setConfettiOn(false)}/>
    {/* v11.9.9: Ring long-press detail modal. v11.9.13: IIFE só executa quando modal aberto
        (antes evaluava em todo render do App, podia crashar com edge-case data). */}
    <Modal open={showRingDetail} onClose={()=>setShowRingDetail(false)}>
      {showRingDetail&&(()=>{try{
        const ydtt=dateOffset(todayStr(),-1);
        const yE=entries.filter(e=>e.date===ydtt);
        const ySleepEntries=yE.filter(e=>e.type==="sleep"&&e.durationMin);
        const ySleep=sumRealSleep(ySleepEntries);
        const yWakings=ySleepEntries.reduce((s,e)=>s+((e.wakings&&e.wakings.length)||0),0);
        const last7=Array.from({length:7},(_,i)=>dateOffset(todayStr(),-i-1));
        const sl7=last7.map(d=>sumRealSleep(entries.filter(e=>e.date===d&&e.type==="sleep"&&e.durationMin)));
        const valid7=sl7.filter(v=>v>0);
        const avg7=valid7.length?Math.round(valid7.reduce((s,v)=>s+v,0)/valid7.length):0;
        const napsToday=todayE.filter(e=>e.type==="nap"&&e.durationMin);
        const napTotalToday=napsToday.reduce((s,e)=>s+e.durationMin,0);
        const napCountToday=napsToday.length;
        const lastSleepEnd=(()=>{
          const sleeps=entries.filter(e=>e.type==="sleep"&&e.durationMin&&!(e.id||"").endsWith("_b")).sort((a,b)=>`${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
          if(!sleeps.length)return null;
          const s=sleeps[0];
          const startMs=new Date(`${s.date}T${s.time}`).getTime();
          if(isNaN(startMs))return null;
          return new Date(startMs+s.durationMin*60000);
        })();
        const Item=({ic,col,k,v})=>(<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderTop:`1px solid ${T.gBSoft}`}}>
          <div style={{width:30,height:30,borderRadius:9,background:`${col}1a`,border:`1px solid ${col}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={ic} size={14} color={col}/></div>
          <span style={{flex:1,fontSize:T.fMD,color:T.sub,fontWeight:600}}>{k}</span>
          <span style={{fontSize:T.fLG,fontWeight:800,color:T.text,fontVariantNumeric:"tabular-nums",letterSpacing:-0.2}}>{v||"—"}</span>
        </div>);
        return(<div style={{padding:"6px 4px 8px"}}>
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:T.fSM,color:T.label,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>{_lang==="en"?"Quick stats":"Visão rápida"}</div>
            <h3 style={{fontSize:T.fXL,fontWeight:800,letterSpacing:-0.3,margin:"4px 0 0"}}>{_lang==="en"?"Louise · today + context":"Louise · hoje + contexto"}</h3>
          </div>
          <Item ic="bed" col={T.purple} k={_lang==="en"?"Yesterday's sleep":"Sono ontem"} v={ySleep>0?fmtDur(ySleep)+(yWakings>0?` · ${yWakings}x`:""):"—"}/>
          <Item ic="bed" col={T.purple} k={_lang==="en"?"7d avg":"Média 7d"} v={avg7>0?fmtDur(avg7):"—"}/>
          <Item ic="cloud" col={T.accent} k={_lang==="en"?"Naps today":"Sonecas hoje"} v={napCountToday>0?`${napCountToday} · ${fmtDur(napTotalToday)}`:"—"}/>
          <Item ic="bottle" col={T.green} k={_lang==="en"?"Bottles today":"Mamadeiras hoje"} v={totalMl>0?(totalMl>=1000?fmtMl(totalMl):`${totalMl}ml`)+` · ${totalBottles}x`:"—"}/>
          <Item ic="diaper" col={T.pink} k={_lang==="en"?"Diapers today":"Fraldas hoje"} v={totalDiapers>0?`${totalDiapers}`:"—"}/>
          <Item ic="clock" col={T.blue} k={_lang==="en"?"Last sleep ended":"Último sono terminou"} v={lastSleepEnd?lastSleepEnd.toLocaleTimeString(_lang==="pt"?"pt-BR":"en-US",{hour:"2-digit",minute:"2-digit"}):"—"}/>
          <button onClick={()=>setShowRingDetail(false)} style={{width:"100%",padding:"12px 0",borderRadius:12,background:"rgba(22,28,60,0.5)",border:`1px solid ${T.gBSoft}`,color:T.sub,fontSize:T.fMD,fontWeight:700,marginTop:14}}>{_lang==="en"?"Close":"Fechar"}</button>
        </div>);
      }catch(e){console.warn("[RingDetail] render error",e);return null}})()}
    </Modal>
    <div style={{position:"relative",zIndex:1}}>
      {/* SWIPE CONTAINER (v9.9.2) — Home/Stats/History pre-mounted side-by-side */}
      {isSwipePage?<div style={{overflow:"hidden",width:"100%",touchAction:"pan-y"}}>
        <div
          ref={swipeRef}
          onTouchStart={onSwipeStart}
          onTouchMove={onSwipeMove}
          onTouchEnd={onSwipeEnd}
          onTouchCancel={onSwipeEnd}
          style={{display:"flex",width:"300%",transform:`translate3d(calc(${-swipeIdx*(100/3)}% + ${dragPx}px), 0, 0)`,transition:swipeDragging?"none":"transform .28s cubic-bezier(0.2,0.9,0.3,1)",willChange:"transform"}}>
          <div style={{width:`${100/3}%`,flexShrink:0,minWidth:0,contentVisibility:"auto",containIntrinsicSize:"auto 100vh"}}>
            <div>
        <div style={{padding:"calc(12px + env(safe-area-inset-top)) 20px 0",display:"flex",alignItems:"center",gap:12}}>
          <div style={{position:"relative"}}><button onClick={()=>setShowProfile(true)} style={{width:52,height:52,borderRadius:16,overflow:"hidden",border:`1.5px solid ${T.accent}20`,background:T.glass,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.3)"}}>{profile.photo?<img src={profile.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Icon name="sun" size={22} color={T.sub}/>}</button>{daysLeft!==null&&daysLeft>0&&<button onClick={()=>setShowSleepInfo(true)} style={{position:"absolute",top:-5,right:-8,minWidth:24,height:24,borderRadius:12,background:`linear-gradient(135deg,${T.accent},#a78bfa)`,color:"#fff",fontSize:T.fSM,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px",boxShadow:`0 2px 8px ${T.accent}55`,border:`2px solid ${T.bg1}`}}>{daysLeft}</button>}{sleepRec?.phase===2&&<button onClick={()=>setShowSleepInfo(true)} style={{position:"absolute",top:-2,right:-6,width:20,height:20,borderRadius:10,background:T.green,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${T.bg1}`}}><Icon name="check" size={10} color={T.bg1}/></button>}</div>
          {/* v11.9.24: name com micro-gradient texto + meta letter-spacing refinado */}
          <div style={{flex:1,minWidth:0}}><h1 style={{fontSize:T.fXL,fontWeight:800,margin:0,letterSpacing:-0.45,lineHeight:1.1,background:"linear-gradient(180deg,#ffffff,#c4b5fd)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent",color:"transparent"}}>{babyName}</h1><div style={{display:"flex",alignItems:"center",gap:5,marginTop:5,fontVariantNumeric:"tabular-nums"}}><span style={{fontSize:T.fSM,color:T.accent,fontWeight:600,letterSpacing:0.1}}>{age&&<>{age.totalDays} {_lang==="en"?"days":"dias"}</>}</span><span style={{width:2.5,height:2.5,borderRadius:"50%",background:"rgba(139,124,246,0.4)"}}/><span style={{fontSize:T.fSM,color:T.dim,letterSpacing:0.1}}>{new Date().toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"short"})}</span></div></div>
          {!isOnline&&<div title={_lang==="en"?"Offline — changes sync when reconnected":"Offline — mudanças sincronizam ao reconectar"} style={{display:"inline-flex",alignItems:"center",gap:4,marginRight:6,padding:"4px 8px",borderRadius:10,background:"rgba(251,146,60,0.1)",border:"1px solid rgba(251,146,60,0.28)",fontSize:T.fXS,color:"#fbbf24",fontWeight:700,letterSpacing:0.3,textTransform:"uppercase",flexShrink:0}}><span style={{width:6,height:6,borderRadius:"50%",background:"#fbbf24",boxShadow:"0 0 6px rgba(251,191,36,0.6)"}}/>off</div>}
          {/* v11.9.57: botão ★ Marcos no header — entry point sempre visível */}
          {/* v11.9.95: ★ perde o tint âmbar permanente — destaque constante vira ruído. */}
          <button aria-label={L("milestonesTitle")} onClick={()=>goTo("milestones")} style={{position:"relative",width:44,height:44,borderRadius:13,background:"rgba(22,28,60,0.6)",border:"1px solid rgba(139,124,246,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginRight:6}}>
            <Icon name="star" size={17} color="#facc15"/>
          </button>
          <button aria-label={inboxUnreadCount>0?(_lang==="en"?`${inboxUnreadCount} new notifications`:`${inboxUnreadCount} notificações novas`):(_lang==="en"?"Notifications":"Notificações")} onClick={()=>setShowInbox(true)} style={{position:"relative",width:44,height:44,borderRadius:13,background:inboxUnreadCount>0?"rgba(139,124,246,0.12)":"rgba(22,28,60,0.6)",border:`1px solid ${inboxUnreadCount>0?"rgba(139,124,246,0.3)":"rgba(139,124,246,0.08)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{/* v11.9.97: o sino balançava PRA SEMPRE com não-lidas — vira ruído em 1 dia. Agora
              balança 2x quando a CONTAGEM muda (key remonta o div → anim roda 1 vez) e para. */}
            <div key={"bw"+inboxUnreadCount} className={inboxUnreadCount>0?"bell-once":""} style={{transformOrigin:"top center",display:"flex"}}><Icon name="bell" size={17} color={inboxUnreadCount>0?T.accent:T.dim}/></div>{inboxUnreadCount>0&&<div style={{position:"absolute",top:-5,right:-5,minWidth:18,height:18,borderRadius:9,background:"linear-gradient(135deg,#f87171,#dc2626)",color:"#fff",fontSize:T.fSM,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 5px",border:`2px solid ${T.bg1}`,boxShadow:"0 0 10px rgba(239,68,68,0.6)"}}>{inboxUnreadCount}</div>}</button>
        </div>
        {/* v11.9.24: hairline divider sutil sob o header (separa seção sem caixa) */}
        <div style={{height:1,margin:"0 22px 14px",background:"linear-gradient(90deg,transparent,rgba(139,124,246,0.12),transparent)"}}/>
        {/* v11.9.95: CuriosityCard saiu daqui (acima do Ring) pra baixo do grid 2×2 —
            montava/desmontava sozinho e empurrava o Ring ~120px no pico de registro. */}
        {/* v11.9.8: Daily summary card (20h-23h, 1x/dia) */}
        {/* v11.9.53: resumo do dia removido — pedido do William. */}
        {/* v11.9.36: "•••" sutil no canto do Ring sinaliza long-press. Opacity baixa,
            position absolute, sem alterar layout. Fade in/out elegante. */}
        <div role="region" aria-label={_lang==="en"?"Ring with current state. Long-press for details":"Anel com estado atual. Pressione e segure para detalhes"} style={{padding:"4px 0 0",position:"relative"}} onPointerDown={onRingPointerDown} onPointerMove={onRingPointerMove} onPointerUp={onRingPointerUp} onPointerCancel={onRingPointerUp}>
          <Ring activeTimer={activeTimer} napSug={napSug} tick={tick} recentEvents={cycleE} lang={lang} showOrbit={showOrbit} screenLockActive={shouldLock}/>
          {/* v11.9.128: estrela cadente + faísca da memória do dia — overlay absoluto,
              zero impacto no layout (invariante de Home estável). stopPropagation pra
              não disparar o long-press do Ring. */}
          {memoryActive&&<>
            <div className="mem-star" style={{position:"absolute",top:34,right:-10,width:90,height:2,borderRadius:2,background:"linear-gradient(90deg,transparent,#e9e2ff 70%,#fff)",boxShadow:"0 0 8px rgba(196,181,253,0.8)",pointerEvents:"none",zIndex:6}}/>
            <button className="mem-spark hit44" aria-label={_lang==="en"?"A memory from today":"Uma memória de hoje"} onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();openMemory()}} style={{position:"absolute",top:40,right:30,zIndex:7,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,filter:"drop-shadow(0 0 8px rgba(251,191,36,0.7))"}}>✨</button>
          </>}
          <div style={{position:"absolute",top:14,right:18,display:"flex",gap:2.5,opacity:0.32,pointerEvents:"none"}}>
            <span style={{width:3,height:3,borderRadius:"50%",background:T.sub}}/>
            <span style={{width:3,height:3,borderRadius:"50%",background:T.sub}}/>
            <span style={{width:3,height:3,borderRadius:"50%",background:T.sub}}/>
          </div>
        </div>
        {/* v11.9.23: predição de wake-up baseada na média 7d. Aparece dentro do bedtime ativo.
            v11.9.51: estimativa de wake removida — não bate com rotina da pediatra. */}
        {/* v11.9.54: Night Wake pill — tamanho pequeno (revert v11.9.52), cor amber em ambos
            estados (intuitivo: amarelo = atenção/wake), labels "Wake"/"Sleep" action-oriented,
            icon muda sun→moon conforme estado da ação. */}
        {activeTimer&&activeTimer.type==="sleep"&&<div style={{display:"flex",justifyContent:"center",marginBottom:10,padding:"0 20px"}}>
          <button onClick={toggleNightWake} className={"hit44"+(activeTimer.nightWake?"":" nw-pill-pulse")} style={{padding:"7px 14px",borderRadius:20,background:activeTimer.nightWake?"linear-gradient(135deg,rgba(251,146,60,0.22),rgba(251,191,36,0.10))":"linear-gradient(135deg,rgba(251,191,36,0.18),rgba(251,191,36,0.06))",border:`1px solid ${activeTimer.nightWake?"rgba(251,146,60,0.60)":"rgba(251,191,36,0.50)"}`,display:"flex",alignItems:"center",gap:7,fontSize:T.fSM,fontWeight:700,color:activeTimer.nightWake?"#fb923c":"#fbbf24",letterSpacing:0.5,textTransform:"uppercase",cursor:"pointer",transition:"background .25s ease, border-color .25s ease, color .25s ease"}}>
            <Icon name={activeTimer.nightWake?"moon":"sun"} size={13} color={activeTimer.nightWake?"#fb923c":"#fbbf24"}/>
            {activeTimer.nightWake?`${_lang==="en"?"Sleep":"Dormir"} · ${fmtDur(Math.max(1,Math.floor((Date.now()-new Date(activeTimer.nightWake.startTime).getTime())/60000)))}`:(_lang==="en"?"Wake":"Acordar")}
          </button>
        </div>}
        {/* v11.9.83: quick buttons ADAPTATIVOS — as 3 ações com mais tendência agora
            (hora do dia + o-que-segue-o-último + rotina − cooldown, ver quickSuggestions).
            O "+" (FAB) continua dando acesso a todas as 10 ações. */}
        {!activeTimer&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:8,padding:"0 20px",marginBottom:12}}>
          {quickSuggestions.map(tp=>{
            const cfg=TYPES[tp]||{};
            const col=(tp==="nap"?T.accent:cfg.color)||T.accent;
            const ic=cfg.icon||"plus";
            const SHORT={wakeup:_lang==="en"?"Woke up":"Acordou",bottle:_lang==="en"?"Bottle":"Mamadeira",nursing:_lang==="en"?"Nurse":"Amamentar",diaper:_lang==="en"?"Diaper":"Fralda",sleep:_lang==="en"?"Sleep":"Sono",nap:_lang==="en"?"Nap":"Soneca",bath:_lang==="en"?"Bath":"Banho",medicine:_lang==="en"?"Medicine":"Remédio"};
            const lbl=SHORT[tp]||(cfg.label?cfg.label[_lang]:tp);
            // v11.9.93: "wakeup" registra em 1 toque via quickWakeup (anti-duplicata de 60s
            // + nightSleepMin já embutidos) — era a função morta desde a v11.9.x.
            const act=tp==="wakeup"?quickWakeup:tp==="nursing"?(()=>setShowNursingPicker(true)):(tp==="sleep"||tp==="nap"||tp==="tummytime"||tp==="bath")?(()=>startTimer(tp)):(()=>{setFormType(tp);setShowAdd(false)});
            return<button key={tp} aria-label={(_lang==="en"?"Add ":"Adicionar ")+lbl} onClick={act} className="qbtn-appear" style={{padding:"12px 0 10px",minHeight:64,borderRadius:14,background:`${col}08`,border:`1px solid ${col}18`,display:"flex",flexDirection:"column",alignItems:"center",gap:5,boxShadow:`0 1px 0 0 rgba(255,255,255,0.04) inset`}}><Icon name={ic} size={20} color={col}/><span style={{fontSize:T.fSM,fontWeight:700,color:col,letterSpacing:-0.1}}>{lbl}</span></button>;
          })}
        </div>}
        {/* v11.9.93: quick row de 2 botões — antes só no despertar noturno; agora também com
            timer de SONECA ou AMAMENTAÇÃO rodando (estados mais frequentes — trocar fralda no
            meio é comum e custava 3 toques com uma mão ocupada). */}
        {activeTimer&&((activeTimer.type==="sleep"&&activeTimer.nightWake)||activeTimer.type==="nap"||activeTimer.type==="nursing")&&<div style={{display:"flex",gap:6,padding:"0 20px",marginBottom:12}}><button onClick={()=>{setFormType("bottle");setShowAdd(false)}} style={{flex:1,padding:"12px 0 8px",borderRadius:14,background:`${T.green}16`,border:`1px solid ${T.green}40`,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><Icon name="bottle" size={18} color={T.green}/><span style={{fontSize:T.fXS,fontWeight:700,color:T.green}}>{_lang==="en"?"Bottle":"Mamad."}</span></button><button onClick={()=>{setFormType("diaper");setShowAdd(false)}} style={{flex:1,padding:"12px 0 8px",borderRadius:14,background:`${T.pink}16`,border:`1px solid ${T.pink}40`,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}><Icon name="diaper" size={18} color={T.pink}/><span style={{fontSize:T.fXS,fontWeight:700,color:T.pink}}>{_lang==="en"?"Diaper":"Fralda"}</span></button></div>}
        {/* v11.9.95: hierarquia estável — a ROTINA (ação) subiu pra cima dos efêmeros
            (napSug/insights), que desceram pra depois dela. Nada empurra o que importa. */}
        {/* v11.9.116: nudge de onboarding — perfil sem nome ainda (1ª abertura real,
            ex: cônjuge configurando o 2º device). Dispensável, sem timer. */}
        {!profile.name&&!onbDismissed&&<div className="home-rise-in" style={{margin:"0 20px 14px",padding:"13px 15px",borderRadius:T.rLG,background:"linear-gradient(180deg,rgba(139,124,246,0.10),rgba(139,124,246,0.03))",border:`1px solid ${T.accent}28`,display:"flex",gap:11,alignItems:"center"}}>
          <div style={{flexShrink:0,width:34,height:34,borderRadius:T.rSM,display:"flex",alignItems:"center",justifyContent:"center",...T.iconTile(T.accent)}}><Icon name="star" size={16} color={T.accent}/></div>
          <div style={{flex:1,minWidth:0,fontSize:T.fSM,color:T.sub,lineHeight:1.4}}>{_lang==="en"?"Add her name and photo to make this feel like hers":"Adicione o nome e a foto dela pra isso ficar com a cara dela"}</div>
          <button onClick={()=>setShowProfile(true)} className="hit44" style={{flexShrink:0,fontSize:T.fSM,fontWeight:700,color:T.accent,background:"none",border:"none",padding:"6px 4px"}}>{_lang==="en"?"Add":"Add."}</button>
          <button onClick={dismissOnboarding} aria-label={_lang==="en"?"Dismiss":"Dispensar"} className="hit44" style={{flexShrink:0,width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",color:T.dim}}><Icon name="x" size={13} color={T.dim}/></button>
        </div>}
        {/* v11.9.40: Card de rotina diária — só renderiza se profile.routine.enabled === true */}
        {routineState&&<div style={{margin:"0 20px 14px"}}>
          {routineState.allDone?<div style={{padding:"6px 4px",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <span style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${T.green}50,transparent)`}}/>
            <div style={{width:18,height:18,borderRadius:"50%",background:T.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="check" size={11} color="#04061a"/></div>
            <span style={{fontSize:T.fSM,color:T.green,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase"}}>{L("routineDone")}{routineState.skippedCount>0&&<span style={{color:T.label,fontWeight:600}}> · {routineState.skippedCount} {_lang==="en"?"skipped":(routineState.skippedCount>1?"puladas":"pulada")}</span>}</span>
            <span style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${T.green}50,transparent)`}}/>
          </div>:routineState.headline?(()=>{
            const h=routineState.headline;
            const isLate=h.status==="next-late";
            const lateMin=isLate?(()=>{const now=new Date();return now.getHours()*60+now.getMinutes()-h.targetMin})():0;
            const earlyMin=!isLate?(()=>{const now=new Date();return h.targetMin-(now.getHours()*60+now.getMinutes())})():0;
            const accentCol=isLate?"#fb923c":T.accent;
            const accentBg=isLate?"rgba(251,146,60,0.10)":`${T.accent}10`;
            const accentBd=isLate?"rgba(251,146,60,0.32)":`${T.accent}28`;
            // v11.9.70: card minimalista — uma linha de info + barra de progresso fina
            // segmentada. Detalhes (chips, labels) saíram; a página/rotina é o lugar deles.
            return<div style={{padding:"11px 14px 12px",borderRadius:13,background:`${accentCol}0d`,border:`1px solid ${accentCol}26`}}>
              <div onClick={toggleRoutineExpanded} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
                <Icon name={h.icon} size={16} color={h.col}/>
                <div style={{flex:1,minWidth:0,display:"flex",alignItems:"baseline",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:T.fXS,fontWeight:800,color:accentCol,textTransform:"uppercase",letterSpacing:1}}>{L("nextEvent")}</span>
                  <span style={{fontSize:T.fMD,fontWeight:700,color:T.heading,letterSpacing:-0.1}}>{h.lbl}</span>
                  <span style={{fontSize:T.fSM,color:accentCol,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{h.target}</span>
                  {isLate?<span style={{fontSize:T.fXS,color:accentCol,fontWeight:600}}>· +{fmtDur(lateMin)}</span>:(earlyMin>0&&earlyMin<=180?<span style={{fontSize:T.fXS,color:T.dim,fontWeight:600}}>· {L("earlyMin")} {fmtDur(earlyMin)}</span>:null)}
                </div>
                <span style={{fontSize:T.fSM,color:T.green,fontWeight:800,fontVariantNumeric:"tabular-nums",display:"inline-flex",alignItems:"center",gap:3,flexShrink:0}}><Icon name="bottle" size={12} color={T.green}/>{routineState.bottlesDone}<span style={{color:T.dim,fontWeight:600,fontSize:T.fXS}}>/{routineState.bottlesTarget}</span></span>
                <span aria-hidden="true" style={{width:7,height:7,borderRight:`2px solid ${T.dim}`,borderBottom:`2px solid ${T.dim}`,transform:routineExpanded?"rotate(-135deg)":"rotate(45deg)",transition:"transform .25s ease",display:"inline-block",flexShrink:0,marginLeft:2,marginBottom:routineExpanded?-2:2}}/>
              </div>
              <div style={{display:"flex",gap:5,marginTop:11}}>
                {routineState.slots.map(s=>{
                  const isDone=s.status==="done";
                  const isSkip=s.status==="skipped";
                  const isLateSeg=s.status==="late"||s.status==="next-late";
                  const isNextSeg=s.status==="next";
                  const segBg=isDone?T.green:isSkip?`${T.dim}55`:isLateSeg?"#fb923c":isNextSeg?T.accent:`${T.accent}22`;
                  return<div key={s.key} title={s.lbl} className={isNextSeg?"rt-seg-next":""} style={{flex:1,height:5,borderRadius:3,background:segBg,transition:"background .4s ease"}}/>
                })}
              </div>
              {routineExpanded&&<div className="rt-expand" style={{marginTop:11,paddingTop:11,borderTop:`1px solid ${accentCol}1f`,display:"flex",flexDirection:"column",gap:8}}>
                {routineState.wakeDelta!==0&&<div style={{display:"flex",alignItems:"center",gap:7,padding:"6px 9px",borderRadius:9,background:"rgba(251,191,36,0.10)",border:"1px solid rgba(251,191,36,0.24)"}}><Icon name="clock" size={12} color={T.amber}/><span style={{fontSize:T.fXS,color:T.amber,fontWeight:600,lineHeight:1.3}}>{_lang==="en"?`Woke ${fmtDur(Math.abs(routineState.wakeDelta))} ${routineState.wakeDelta<0?"earlier":"later"} — times shifted`:`Acordou ${fmtDur(Math.abs(routineState.wakeDelta))} ${routineState.wakeDelta<0?"mais cedo":"mais tarde"} — horários ajustados`}</span></div>}
                {routineState.slots.map(s=>{
                  const sd=s.status==="done",sk=s.status==="skipped",sl=s.status==="late"||s.status==="next-late",sn=s.status==="next";
                  const sc=sd?T.green:sk?T.dim:sl?"#fb923c":sn?T.accent:T.dim;
                  return<div key={s.key} style={{display:"flex",alignItems:"center",gap:9,opacity:sk?0.6:1}}>
                    <div style={{width:16,height:16,borderRadius:"50%",border:`1.5px solid ${sc}`,background:sd?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sd?<Icon name="check" size={9} color="#04061a"/>:sk?<span style={{color:sc,fontSize:11,fontWeight:800,lineHeight:1}}>–</span>:sl?<span style={{color:sc,fontSize:9,fontWeight:800}}>!</span>:null}</div>
                    <Icon name={s.icon} size={13} color={sk?T.dim:s.col}/>
                    <span style={{flex:1,minWidth:0,fontSize:T.fSM,color:sd||sk?T.sub:T.text,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textDecoration:sk?"line-through":"none"}}>{s.lbl}</span>
                    <span style={{fontSize:T.fSM,color:sc,fontWeight:700,fontVariantNumeric:"tabular-nums",flexShrink:0}}>{sk?(_lang==="en"?"skipped":"pulado"):(s.match&&s.match.time?s.match.time:s.target)}</span>
                  </div>
                })}
                <div style={{display:"flex",alignItems:"center",gap:9,marginTop:1}}>
                  <div style={{width:16,display:"flex",justifyContent:"center",flexShrink:0}}><Icon name="bottle" size={13} color={T.green}/></div>
                  <span style={{flex:1,fontSize:T.fSM,color:T.sub,fontWeight:600}}>{_lang==="en"?"Bottles":"Mamadas"}{routineState.nextBottleMl>0&&<span style={{color:T.green,fontWeight:700}}> · {_lang==="en"?"next":"próx."} ~{routineState.nextBottleMl}ml</span>}</span>
                  <div style={{display:"flex",gap:3,flexShrink:0}}>{Array.from({length:routineState.bottlesTarget}).map((_,i)=><div key={i} style={{width:7,height:7,borderRadius:2,background:i<routineState.bottlesDone?T.green:`${T.green}1f`,border:`1px solid ${i<routineState.bottlesDone?T.green:T.green+"32"}`}}/>)}</div>
                </div>
              </div>}
            </div>
          })():null}
        </div>}
        {/* efêmeros (banners de soneca + insight) — DEPOIS da rotina desde a v11.9.95 */}
        {napSug&&napSug.state==="opening"&&<div className="pulse-soft" style={{margin:"0 20px 12px",padding:"10px 14px",borderRadius:12,background:T.amberS,border:`1px solid ${T.amber}22`,display:"flex",alignItems:"center",gap:10}}><Icon name="bell" size={18} color={T.amber}/><div><div style={{fontSize:T.fMD,fontWeight:700,color:T.amber}}>{_lang==="en"?"Sleep window opening":"Janela abrindo"}</div><div style={{fontSize:T.fSM,color:T.sub}}>{_lang==="en"?"Watch for sleepy cues":"Observe sinais de sono"}{napSug.predictedTime?` · ~${napSug.predictedTime}`:""}</div></div></div>}
        {napSug&&napSug.state==="sweet"&&<div className="pulse-fast" style={{margin:"0 20px 12px",padding:"10px 14px",borderRadius:12,background:T.greenS,border:`1px solid ${T.green}22`,display:"flex",alignItems:"center",gap:10,boxShadow:`0 0 12px ${T.green}15`}}><Icon name="check" size={18} color={T.green}/><div><div style={{fontSize:T.fMD,fontWeight:700,color:T.green}}>{_lang==="en"?"Ideal time":"Hora ideal"}</div><div style={{fontSize:T.fSM,color:T.sub}}>{_lang==="en"?"Best moment for nap":"Melhor momento pra soneca"}{napSug.dataPoints>=3?(_lang==="en"?` · ${napSug.dataPoints} days`:` · ${napSug.dataPoints} dias`):""}</div></div></div>}
        {napSug&&(napSug.state==="stretching"||napSug.state==="overdue")&&<div className="pulse-fast" style={{margin:"0 20px 12px",padding:"10px 14px",borderRadius:12,background:T.orangeS,border:`1px solid ${T.orange}22`,display:"flex",alignItems:"center",gap:10}}><Icon name="zap" size={18} color={napSug.state==="overdue"?"#f87171":T.orange}/><div><div style={{fontSize:T.fMD,fontWeight:700,color:napSug.state==="overdue"?"#f87171":T.orange}}>{napSug.state==="overdue"?(_lang==="en"?"Past max window":"Passou do máximo"):(_lang==="en"?"Stretching":"Esticando")}</div><div style={{fontSize:T.fSM,color:T.sub}}>{napSug.state==="overdue"?(_lang==="en"?`${fmtDur(napSug.el)} awake — risk of overtired`:`${fmtDur(napSug.el)} acordada — risco de ficar cansada demais`):(_lang==="en"?"Past average, still within range":"Passou da média, ainda dentro da faixa")}</div></div></div>}
        {/* v11.9.41: predição "Próx. soneca ~XX:XX" só aparece se a rotina (pediatra) NÃO estiver ativa. Com rotina on, o card "Próximo na rotina" assume — engine-prediction vira redundante. */}
        {!routineState&&!activeTimer&&sleepRec?.phase===2&&daySchedule.length>0&&daySchedule.filter(s=>s.status==="next").map((s,i)=><div key={"ns"+i} style={{margin:"0 20px 12px",padding:"10px 14px",borderRadius:12,background:`${T.accent}10`,border:`1px solid ${T.accent}18`,display:"flex",alignItems:"center",gap:10}}><Icon name="star" size={18} color={T.accent} fill={T.accent}/><div><div style={{fontSize:T.fMD,fontWeight:700,color:T.accent}}>{s.bed?(_lang==="en"?"Bedtime ~":"Sono ~"):(_lang==="en"?"Next nap ~":"Prox. soneca ~")}{minToTime(s.startMin)}</div><div style={{fontSize:T.fSM,color:T.sub}}>{s.bed?"":`${s.pos}${_lang==="en"?["","st","nd","rd"][s.pos]||"th":"a"} · `}WW {fmtDur(s.ww)}{s.durRange?" · "+s.durRange:""}</div></div></div>)}
        <InsightCards insights={dayInsights} phase={sleepRec?.phase} lang={lang}/>
        <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:8,padding:"0 20px",marginBottom:14}}>{[{i:"bottle",v:`${totalMl}`,u:"ml",c:T.green,t:["bottle"],tap:"bottle",l:_lang==="en"?"Bottle":"Mamad.",num:totalMl},{i:"pill",c:T.amber,dual:[{l:"Simeticona",c:T.amber,n:totalSimet,f:e=>e.type==="medicine"&&e.name&&/simet/i.test(e.name)},{l:"Tylenol",c:T.red,n:totalTylenol,f:e=>e.type==="medicine"&&e.name&&/tylenol|paraceta/i.test(e.name)}]},{i:"moon",v:fmtDur(totalSleep),c:T.purple,t:["sleep","nap"],tap:"nap",l:_lang==="en"?"Sleep":"Sono"},{i:"diaper",v:`${totalDiapers}`,c:T.pink,t:["diaper"],tap:"diaper",l:_lang==="en"?"Diaper":"Fralda",num:totalDiapers}].map((p,idx)=>{
        // v11.9.89: card DUPLO de remédios — Simeticona | Tylenol dividem o MESMO card
        // (metade/metade com divisória), e o grid de resumo volta ao 2×2.
        if(p.dual){return<div key={idx} className="home-card home-fade-in" style={{animationDelay:`${idx*55}ms`,padding:"11px 12px",borderRadius:14,background:`${p.c}07`,border:`1px solid ${p.c}14`,textAlign:"left",cursor:"default",position:"relative",overflow:"hidden",boxShadow:"0 1px 0 0 rgba(255,255,255,0.04) inset"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${p.c}66,transparent)`,opacity:0.3,pointerEvents:"none"}}/>
          <div style={{display:"flex",alignItems:"stretch"}}>
            {p.dual.map((h,hi)=>{const hl=entries.find(h.f);const hago=hl?timeSince(hl.date,hl.time):null;return<div key={hi} style={{flex:1,minWidth:0,paddingLeft:hi>0?9:0,marginLeft:hi>0?9:0,borderLeft:hi>0?`1px solid ${p.c}1a`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><Icon name="pill" size={11} color={h.c}/><span style={{fontSize:T.fXS,color:T.label,fontWeight:600,letterSpacing:0.5,textTransform:"uppercase",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.l}</span></div>
              <div style={{fontSize:T.fLG,fontWeight:800,color:h.c,lineHeight:1,letterSpacing:-0.2,fontVariantNumeric:"tabular-nums"}}><CountUp end={h.n}/><span style={{fontSize:T.fSM,opacity:0.5,fontWeight:700,marginLeft:1}}>x</span></div>
              {hago&&<div style={{fontSize:T.fSM,color:`${h.c}88`,fontWeight:600,marginTop:1,fontVariantNumeric:"tabular-nums"}}>{hago}</div>}
            </div>})}
          </div>
        </div>}
        const last=entries.find(e=>p.filter?p.filter(e):p.t.includes(e.type));let ago=null;if(last){if(p.t.includes("sleep")&&last.durationMin){const endMs=new Date(`${last.date}T${last.time}`).getTime()+last.durationMin*60000;const endD=new Date(endMs);const ed=`${endD.getFullYear()}-${String(endD.getMonth()+1).padStart(2,"0")}-${String(endD.getDate()).padStart(2,"0")}`;const et=`${String(endD.getHours()).padStart(2,"0")}:${String(endD.getMinutes()).padStart(2,"0")}`;ago=timeSince(ed,et)}else{ago=timeSince(last.date,last.time)}}
        // Bottle-only: compute progress toward the next feeding when the feedingInterval reminder is enabled.
        let feedProg=null;
        if(p.tap==="bottle"&&feedingActive&&last&&last.date&&last.time){
          const lastMs=new Date(`${last.date}T${last.time}`).getTime();
          const intervalMs=feedingIntervalMin*60000;
          const elapsedMs=Date.now()-lastMs;
          const prog=Math.max(0,Math.min(1.15,elapsedMs/intervalMs));
          const nextD=new Date(lastMs+intervalMs);
          const nextStr=`${String(nextD.getHours()).padStart(2,"0")}:${String(nextD.getMinutes()).padStart(2,"0")}`;
          const lateMin=prog>=1?Math.max(1,Math.round((elapsedMs-intervalMs)/60000)):0;
          const barColor=prog>=1?"#f87171":prog>=0.8?"#fbbf24":p.c;
          feedProg={prog,nextStr,lateMin,barColor};
        }
        // Diaper breakdown wet/dirty (v10.8.0). Opção C do mockup — ícones coloridos.
        const diaperBreakdown=p.tap==="diaper"&&(wetDiapers>0||dirtyDiapers>0)?(<div style={{display:"flex",gap:8,marginTop:3,fontSize:T.fSM,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{wetDiapers>0&&<span style={{display:"inline-flex",alignItems:"center",gap:3,color:"#93c5fd"}}><Icon name="droplet" size={11} color="#93c5fd"/>{wetDiapers}</span>}{dirtyDiapers>0&&<span style={{display:"inline-flex",alignItems:"center",gap:3,color:"#a16b4a"}}><Icon name="poop" size={11} color="#a16b4a"/>{dirtyDiapers}</span>}</div>):null;
        return<div key={idx} className="home-card home-fade-in" style={{animationDelay:`${idx*55}ms`,padding:"11px 12px",borderRadius:14,background:`${p.c}07`,border:`1px solid ${p.c}14`,textAlign:"left",cursor:"default",position:"relative",overflow:"hidden",boxShadow:"0 1px 0 0 rgba(255,255,255,0.04) inset"}}><div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${p.c}66,transparent)`,opacity:0.3,pointerEvents:"none"}}/><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><Icon name={p.i} size={11} color={p.c}/><span style={{fontSize:T.fXS,color:T.dim,fontWeight:600,letterSpacing:0.3,textTransform:"uppercase"}}>{p.l}</span></div><div style={{fontSize:T.fLG,fontWeight:800,color:p.c,lineHeight:1,letterSpacing:-0.2,fontVariantNumeric:"tabular-nums"}}>{p.num!=null?<CountUp end={p.num}/>:<span key={p.v} className="val-pulse">{p.v}</span>}{p.u?<span style={{fontSize:T.fSM,opacity:0.5,fontWeight:700,marginLeft:1}}>{p.u}</span>:null}{p.tap==="bottle"&&profile.mlGoal>0&&totalMl>0?<span style={{fontSize:T.fXS,opacity:0.55,fontWeight:700,marginLeft:5}}>· {Math.round((totalMl/profile.mlGoal)*100)}%</span>:null}</div>{diaperBreakdown}{feedProg?<><div style={{height:3,borderRadius:2,background:`${p.c}1a`,marginTop:6,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,feedProg.prog*100)}%`,background:feedProg.prog>=0.8?feedProg.barColor:`linear-gradient(90deg,${p.c},${p.c}cc)`,borderRadius:2,transition:"width .4s ease, background .3s ease"}}/></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:3,fontSize:T.fXS,fontWeight:600,fontVariantNumeric:"tabular-nums"}}><span style={{color:`${p.c}88`}}>{ago}</span><span style={{color:feedProg.barColor,fontWeight:700}}>{feedProg.prog>=1?`+${feedProg.lateMin}m late`:`→ ${feedProg.nextStr}`}</span></div></>:(ago&&<div style={{fontSize:T.fSM,color:`${p.c}88`,fontWeight:600,marginTop:1,fontVariantNumeric:"tabular-nums"}}>{ago}</div>)}</div>})}</div>
        {/* v11.9.95: Curiosidade desceu pra cá (era acima do Ring) — fica até o ✕. */}
        <CuriosityCard age={age} lang={lang} tick={tick}/>
        {/* v11.9.62: "Próximo marco" — linha minimalista única (antes era card com 3 itens).
            v11.9.95: só aparece quando a próxima consulta está a ≤14 dias (era permanente). */}
        {(()=>{
          const all=window.DEV_MILESTONES||[];
          if(all.length===0)return null;
          const age=calcAge(profile.birthDate);
          const ageMonths=age?.months||0;
          const checkups=[0,2,4,6,9,12,15,18,24];
          const currentCheckup=checkups.filter(c=>c<=ageMonths+1).slice(-1)[0]||2;
          const nextCheckup=checkups.find(c=>c>ageMonths);
          const daysToCheckup=nextCheckup!=null?Math.max(0,Math.round((nextCheckup-ageMonths)*30-(age?.days||0))):null;
          if(daysToCheckup==null||daysToCheckup>14)return null;
          const doneKeys=new Set(entries.filter(e=>e.type==="milestone").map(e=>e.key));
          const upcoming=all.filter(m=>m.checkupAge>=Math.max(2,currentCheckup-1)&&m.checkupAge<=(nextCheckup||currentCheckup+2)&&!doneKeys.has(m.key));
          if(upcoming.length===0)return null;
          const next=upcoming[0];
          return<button onClick={()=>goTo("milestones")} style={{display:"flex",alignItems:"center",gap:8,width:"calc(100% - 40px)",margin:"0 20px 14px",padding:"7px 12px",borderRadius:11,background:"rgba(250,204,21,0.035)",border:"1px solid rgba(250,204,21,0.12)",textAlign:"left",cursor:"pointer"}}>
            <Icon name="star" size={12} color="#fcd34d"/>
            <span style={{fontSize:T.fXS,fontWeight:800,color:"#fcd34d",textTransform:"uppercase",letterSpacing:1,flexShrink:0}}>{L("nextMilestone")}</span>
            <span style={{flex:1,minWidth:0,fontSize:T.fSM,fontWeight:600,color:T.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{next.label[_lang]||next.label.en}</span>
            <span style={{fontSize:T.fSM,color:T.dim,fontWeight:600,flexShrink:0}}>→</span>
          </button>
        })()}
        <div style={{padding:"0 20px"}}><div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:10,padding:"0 4px"}}><span style={{fontSize:T.fSM,fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:1}}>{L("today")}</span><span style={{fontSize:T.fSM,color:T.dim,fontWeight:500,letterSpacing:0.4,textTransform:"uppercase",fontVariantNumeric:"tabular-nums"}}>{new Date().toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{weekday:"short",day:"numeric"}).replace(".","").toUpperCase()}</span></div>{todayE.length===0&&!liveBedtime&&<div style={{textAlign:"center",padding:"32px 20px",color:T.dim}}><Icon name="star" size={32} color={T.dim} fill={T.dim}/><div style={{fontSize:T.fMD,marginTop:8}}>{(()=>{const h=new Date().getHours();if(_lang==="en"){if(h<7)return"Quiet morning — first feed soon?";if(h<11)return"Good morning! Log the first bottle";if(h<14)return"Tap + to add";if(h<19)return"Afternoon — track naps and feeds";if(h<22)return"Evening — wind-down soon";return"Night — bedtime starting?"}if(h<7)return"Manhã tranquila — primeira mamada?";if(h<11)return"Bom dia! Registre a primeira mamada";if(h<14)return"Toque + para registrar";if(h<19)return"Tarde — acompanhe sonecas e mamadas";if(h<22)return"Noite chegando — hora de desacelerar";return"Noite — hora de dormir?"})()}</div></div>}{liveBedtime&&<SleepBlock entry={liveBedtime} lang={lang} entries={entries} isLive={true} activeTimer={activeTimer} onSaveTimer={FB.saveTimer} onSaveEntry={FB.addEntry} onDelete={deleteEntry} onEdit={startEdit}/>}{todayE.filter(e=>{
          // Only hide events linked to the live bedtime if their time actually falls within it.
          // Protects against legacy data where retroactive events got wrongly linked (pre v9.8.1).
          if(e.nightWake&&liveBedtime){
            const evMs=(e.date&&e.time)?new Date(`${e.date}T${e.time}`).getTime():NaN;
            const bStart=new Date(`${liveBedtime.date}T${liveBedtime.time}`).getTime();
            const bEnd=bStart+(liveBedtime.durationMin||0)*60000;
            if(!isNaN(evMs)&&evMs>=bStart&&evMs<=bEnd)return false;
            // Event has nightWake link but time is outside — orphan, show in today list
          }
          // Only hide events contained in a bedtime if that bedtime is actually being rendered
          // (as SleepBlock). Otherwise the event would become an invisible orphan. v10.4.5.
          const cb=findContainingBedtime(e,entries);
          if(cb){
            const isLive=liveBedtime&&liveBedtime.id===cb.id;
            const willRenderAsBlock=cb.date===today&&cb.wakings&&cb.wakings.length>0;
            if(isLive||willRenderAsBlock)return false;
          }
          return true;
        }).map((e,i,arr)=>{const prev=arr[i-1];let gap=null;if(prev){const t1=new Date(`${e.date}T${e.time}`).getTime();let t2=new Date(`${prev.date}T${prev.time}`).getTime();if(prev.durationMin)t2+=prev.durationMin*60000;const diffMin=Math.abs(Math.round((t1-t2)/60000));if(diffMin>=30){const isSleep=(e.type==="nap"||e.type==="sleep")&&e.durationMin;gap=<div style={{display:"flex",alignItems:"center",gap:10,padding:"4px 16px",margin:"2px 0"}}><div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${isSleep?T.accent:T.accent}0a,transparent)`}}/><span style={{fontSize:T.fXS,color:isSleep?T.accent:T.dim,letterSpacing:0.5}}>{isSleep?"WW ":""}{fmtDur(diffMin)}</span><div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${isSleep?T.accent:T.accent}0a,transparent)`}}/></div>}}const useBlock=e.type==="sleep"&&e.wakings&&e.wakings.length>0;return<div key={e.id} className="home-rise-in" style={{animationDelay:`${Math.min(i,10)*45}ms`}}>{gap}{useBlock?<SleepBlock entry={e} lang={lang} onDelete={deleteEntry} onEdit={startEdit} entries={entries} activeTimer={activeTimer} onSaveTimer={FB.saveTimer} onSaveEntry={FB.addEntry}/>:<EntryRow entry={e} lang={lang} onDelete={deleteEntry} onEdit={startEdit} napNum={napNums[e.id]||null}/>}</div>})}</div>
      </div>
          </div>
          <div style={{width:`${100/3}%`,flexShrink:0,minWidth:0,contentVisibility:"auto",containIntrinsicSize:"auto 100vh"}}>
            <StatsPage entries={entries} onGrowth={goGrowth} onBehavior={goBehavior} lang={lang}/>
          </div>
          <div style={{width:`${100/3}%`,flexShrink:0,minWidth:0,contentVisibility:"auto",containIntrinsicSize:"auto 100vh"}}>
            <HistoryPage entries={entries} onDelete={deleteEntry} onEdit={startEdit} activeTimer={activeTimer} lang={lang}/>
          </div>
        </div>
      </div>:null}
      {page==="growth"&&<GrowthPage entries={entries} birthDate={profile.birthDate} profile={profile} onBack={()=>{const f=growthFromRef.current||{page:"stats"};goTo(f.page||"stats");if(f.profile)setShowProfile(true)}} onAddEntry={addEntry} onDeleteEntry={deleteEntry}/>}
      {page==="behavior"&&<BehaviorPage entries={entries} birthDate={profile.birthDate} onBack={()=>{const f=behaviorFromRef.current||{page:"stats"};goTo(f.page||"stats")}} lang={lang}/>}
      {page==="milestones"&&<MilestonesPage entries={entries} birthDate={profile.birthDate} profile={profile} onBack={()=>goTo("home")} onAddEntry={addEntry} onDeleteEntry={deleteEntry} lang={lang}/>}
      {/* Bottom spacer so content clears nav bar + timer (dynamic w/ safe-area) */}
      {/* Sem bottom spacer (v10.2.9) — queremos conteúdo passando ATRÁS da nav
          pill translúcida (Instagram-style: você rola até o fim, o último card
          vai por baixo do pill, visível borrado pelo backdrop-filter). Só mantemos
          ~4px pra o último card não ser cortado no visual-viewport-bottom. Com
          timer ativo dobramos (TimerBar precisa de espaço pra render acima da nav). */}
      <div style={{height:activeTimer?"calc(160px + env(safe-area-inset-bottom))":"calc(80px + env(safe-area-inset-bottom))"}}/>
    </div>

    {/* Fade gradient above nav */}
    <div style={{position:"fixed",bottom:0,left:0,right:0,maxWidth:480,margin:"0 auto",height:120,background:`linear-gradient(to bottom, transparent 0%, ${T.bg1}cc 60%, ${T.bg1} 100%)`,pointerEvents:"none",zIndex:39}}/>

    <Modal open={showSleepInfo} onClose={()=>setShowSleepInfo(false)}>
      {sleepRec?.phase===1&&<><div style={{textAlign:"center",marginBottom:16}}><Icon name="star" size={40} color={T.accent} fill={T.accent}/></div><div style={{textAlign:"center",fontSize:T.f2XL,fontWeight:800,marginBottom:6}}>{sleepRec.dl} {_lang==="en"?"days":"dias"}</div><div style={{textAlign:"center",fontSize:T.fMD,color:T.sub,marginBottom:16}}>{_lang==="en"?`until ${babyName}'s sleep plan`:`para o plano de sono de ${babyName}`}</div><div style={{height:4,borderRadius:2,background:T.bg1,marginBottom:16,overflow:"hidden",filter:`drop-shadow(0 0 5px ${T.accent}44)`}}><div style={{height:"100%",width:`${Math.max(0,Math.min(100,((60-sleepRec.dl)/60)*100))}%`,background:T.accent,borderRadius:2}}/></div><div style={{fontSize:T.fMD,color:T.sub,lineHeight:1.6}}>{_lang==="en"?"At 2 months the circadian rhythm matures. Keep tracking.":"Aos 2 meses o ritmo circadiano amadurece. Continue registrando."}</div><div style={{marginTop:14,padding:"10px 12px",borderRadius:10,background:"rgba(14,18,48,0.6)",fontSize:T.fSM,color:T.dim}}>{_lang==="en"?"Window":"Janela"}: {sleepRec.g.min}–{sleepRec.g.max} min · {sleepRec.g.naps} {_lang==="en"?"naps/day":"sonecas/dia"}</div>
        {age&&age.totalDays>=1&&age.totalDays<=30&&CURIOSITIES[age.totalDays-1]&&<><div style={{height:1,background:`${T.accent}18`,margin:"16px 0"}}/><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><Icon name="sun" size={16} color={T.amber}/><span style={{fontSize:T.fXS,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:T.amber}}>{_lang==="en"?`Day ${age.totalDays}`:`Dia ${age.totalDays}`}</span></div><div style={{fontSize:T.fMD,fontWeight:700,marginBottom:4}}>{(_lang==="en"?CURIOSITIES[age.totalDays-1].en:CURIOSITIES[age.totalDays-1].pt).t}</div><div style={{fontSize:T.fSM,color:T.sub,lineHeight:1.5}}>{(_lang==="en"?CURIOSITIES[age.totalDays-1].en:CURIOSITIES[age.totalDays-1].pt).b}</div></>}
      </>}
      {sleepRec?.phase===2&&<><div style={{textAlign:"center",marginBottom:12}}><Icon name="check" size={36} color={T.green}/></div><div style={{textAlign:"center",fontSize:T.fLG,fontWeight:700,marginBottom:14}}>{_lang==="en"?"Sleep plan active":"Plano de sono ativo"}</div>{sleepRec.a?<><div style={{padding:10,borderRadius:10,background:T.greenS,textAlign:"center",marginBottom:14}}><div style={{fontSize:T.fXS,color:T.sub,textTransform:"uppercase",marginBottom:4}}>{_lang==="en"?"Recommended WW":"Janela recomendada"}</div><div style={{fontSize:T.fXL,fontWeight:800,color:T.green}}>{fmtDur(sleepRec.a.rec)}</div></div><div style={{fontSize:T.fSM,color:T.dim,marginBottom:14}}>{_lang==="en"?`Based on ${sleepRec.a.pts} observations`:`Baseado em ${sleepRec.a.pts} observações`}</div></>:<div style={{fontSize:T.fMD,color:T.sub,marginBottom:14}}>{_lang==="en"?"Track more data to personalize.":"Registre mais dados para personalizar."}</div>}
        {sleepPattern&&sleepRec?.phase===2&&(fullSchedule.length>0||daySchedule.length>0)&&<>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><Icon name="clock" size={16} color={T.accent}/><span style={{fontSize:T.fMD,fontWeight:700,color:T.accent}}>{_lang==="en"?"Today's routine":"Rotina do dia"}</span><span style={{fontSize:T.fXS,color:T.dim,marginLeft:"auto"}}>{_lang==="en"?`${sleepPattern.days} days`:`${sleepPattern.days} dias`}</span></div>
          {(fullSchedule.length>0?fullSchedule:daySchedule.map(s=>({...s,type:s.bed?"sleep":"nap",timeMin:s.startMin}))).map((s,i)=>{
            const isNap=s.type==="nap";const isBed=s.type==="sleep"||s.bed;const isFeed=s.type==="feed";const isBath=s.type==="bath";
            const icon=isFeed?"bottle":isBath?"bath":isBed?"moon":"cloud";
            const color=isFeed?T.blue:isBath?"#38bdf8":T.accent;
            const label=isBed?(_lang==="en"?"Bedtime":"Sono"):isFeed?(_lang==="en"?"Feed":"Mamada"):isBath?(_lang==="en"?"Bath":"Banho"):(_lang==="en"?`${["","1st","2nd","3rd","4th","5th","6th"][s.pos]||s.pos+"th"} nap`:`${s.pos}a soneca`);
            const timeStr=s.timeMin?minToTime(s.timeMin):(s.startMin?minToTime(s.startMin):"--:--");
            const statusColor=s.status==="done"?T.green:s.status==="next"?T.accent:T.dim;
            return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderTop:i>0?`1px solid ${T.gB}`:"none",opacity:s.status==="later"?0.45:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,minWidth:52}}>
                <Icon name={icon} size={12} color={s.status==="done"?T.dim:color}/>
                <span style={{fontSize:T.fLG,fontWeight:800,color:s.status==="done"?T.text:s.status==="next"?color:T.dim}}>{s.status!=="done"?"~":""}{timeStr}</span>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:T.fSM,fontWeight:600,color:s.status==="done"?T.text:s.status==="next"?T.text:T.dim}}>{label}</div>
                {isNap&&!isBed&&<div style={{fontSize:T.fXS,color:T.dim}}>WW {fmtDur(s.ww)}{s.durRange?" · "+s.durRange:s.duration>0?" · "+fmtDur(s.duration||s.durMin):""}</div>}
              </div>
              <span style={{fontSize:T.fXS,fontWeight:600,padding:"2px 7px",borderRadius:5,background:s.status==="done"?T.greenS:s.status==="next"?`${color}20`:`${T.dim}12`,color:statusColor}}>{s.status==="done"?(_lang==="en"?"Done":"Feito"):s.status==="next"?(_lang==="en"?"Next":"Prox."):(_lang==="en"?"Later":"Depois")}</span>
            </div>
          })}
        </>}
      </>}
    </Modal>

    {/* AddPicker (v10.5.5): seletor de tipo é um Modal central (scale+fade 250ms), não mais Sheet
        que deslizava de baixo cobrindo 78% da tela. O slide-up causava jank/bug percebido no iPhone.
        O AddForm em si (Bottle/Amount/Save) continua Sheet porque tem inputs e scroll. */}
    <Modal open={showAdd&&!formType} onClose={()=>setShowAdd(false)}>
      <div style={{fontSize:T.fSM,fontWeight:700,color:T.label,letterSpacing:0.5,textTransform:"uppercase",marginBottom:16,textAlign:"center"}}>{_lang==="en"?"Add event":"Adicionar evento"}</div>
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)",gap:"10px 0"}}>{["wakeup","bottle","nursing","sleep","nap","diaper","bath","medicine","temperature","tummytime"].map((type,i)=>{const cfg=TYPES[type];const last=entries.find(e=>e.type===type);const agoRaw=last?timeSince(last.date,last.time):null;const ago=agoRaw==="now"?"Just now":agoRaw;return(<button key={type} onClick={()=>setFormType(type)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"8px 4px 4px",animation:`slideUp .3s cubic-bezier(0.22,1,0.36,1) ${i*0.025}s both`}}>
        <div style={{width:58,height:58,borderRadius:"50%",background:`radial-gradient(circle at 35% 30%, rgba(50,60,120,0.95), rgba(18,22,55,0.98))`,border:`1.5px solid ${cfg.color}25`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 16px rgba(0,0,0,0.35), 0 0 20px ${cfg.color}18, inset 0 1px 0 rgba(200,210,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.2)`,position:"relative",overflow:"hidden",filter:`drop-shadow(0 0 4px ${cfg.color}44)`}}>
          <div style={{position:"absolute",top:"15%",left:"25%",width:"40%",height:"30%",background:`radial-gradient(ellipse,${cfg.color}12,transparent)`,borderRadius:"50%",filter:"blur(5px)"}}/>
          <Icon name={cfg.icon} size={22} color={cfg.color}/>
        </div>
        <div style={{textAlign:"center",minWidth:0,maxWidth:"100%"}}><div style={{fontSize:T.fSM,fontWeight:600,color:T.text,lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cfg.label[_lang]||cfg.label.en}</div>{ago&&<div style={{fontSize:T.fSM,color:T.sub,fontWeight:500,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ago}</div>}</div>
      </button>)})}</div>
    </Modal>

    {/* AddForm agora \u00e9 Modal central (v10.7.2) em vez de Sheet slide-up. Unifica com o +
        popup e resolve o jank de anim\u00e7\u00e3o no iPhone. prop `wide` deixa um pouco mais largo
        pros campos de data/hora caberem confort\u00e1veis. */}
    <Modal open={!!formType} onClose={()=>{setFormType(null);setEditEntry(null)}} wide>
      {formType&&<AddForm type={formType} onSave={addEntry} onSaveBatch={addMedicineBatch} savedMeds={savedMeds} onSaveMeds={async m=>await FB.saveMeds(m)} editEntry={editEntry} lastBottleMl={lastBottleMl} lastBottleEntry={lastBottleEntry} feedingIntervalMin={feedingIntervalMin} topMl={topMl} suggestedMl={routineState?.nextBottleMl} allEntries={entries} onStartTimer={type=>{setFormType(null);setShowAdd(false);if(type==="nursing")setShowNursingPicker(true);else startTimer(type)}}/>}
    </Modal>

    {showProfile&&<ProfilePage profile={profile} entries={entries} onSave={async p=>await FB.saveProfile(p)} onBack={()=>{setShowProfile(false);setProfileIsDirty(false)}} onGrowth={()=>{growthFromRef.current={page,profile:true};setShowProfile(false);setProfileIsDirty(false);goTo("growth")}} onShowChangelog={()=>setShowChangelog(true)} hasUnreadChangelog={hasUnreadChangelog} reminders={reminders} onAddReminder={async r=>await FB.addReminder(r)} onDelReminder={async id=>await FB.delReminder(id)} onDirtyChange={setProfileIsDirty} cancelSignal={profileCancelSignal} saveSignal={profileSaveSignal}/>}
    {showInbox&&<InboxPanel inbox={inbox} onClose={()=>setShowInbox(false)} onMarkRead={markInboxRead} onMarkAllRead={markAllInboxRead} lang={lang} isRead={isRead}/>}
    {showChangelog&&<ChangelogModal onClose={closeChangelog} lang={lang}/>}
    {showUpdateToast&&!showChangelog&&<UpdateToast fromVersion={profile.lastSeenVersion} toVersion={APP_VERSION} onView={openChangelog} onDismiss={dismissUpdateToast} lang={lang}/>}
    <EditStartModal open={showEditStart} onClose={()=>setShowEditStart(false)} activeTimer={activeTimer} onSave={handleEditStart}/>
    {/* v11.9.128: revelação da memória do dia — toque em qualquer lugar fecha. */}
    {showMemory&&memory&&<div onClick={()=>setShowMemory(false)} style={{position:"fixed",inset:0,zIndex:150,background:"rgba(4,6,18,0.72)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"fadeIn .25s ease"}}>
      <div style={{maxWidth:340,width:"100%",borderRadius:T.rXL,background:"linear-gradient(180deg,rgba(28,24,64,0.97),rgba(16,20,50,0.97))",border:"1px solid rgba(251,191,36,0.35)",padding:"26px 22px",textAlign:"center",boxShadow:"0 24px 60px -12px rgba(0,0,0,0.8), 0 0 40px rgba(251,191,36,0.12)",animation:"slideUp .3s cubic-bezier(0.22,1,0.36,1)"}}>
        <div style={{fontSize:26,marginBottom:10}}>✨</div>
        <div style={{fontSize:T.fXS,fontWeight:800,letterSpacing:1.4,textTransform:"uppercase",color:"#fcd34d",marginBottom:8}}>{_lang==="en"?memory.en.head:memory.pt.head}</div>
        <div style={{fontSize:T.fXL,fontWeight:800,letterSpacing:-0.3,lineHeight:1.35,color:T.heading,marginBottom:10}}>{_lang==="en"?memory.en.text:memory.pt.text}</div>
        <div style={{fontSize:T.fSM,color:T.sub}}>{_lang==="en"?memory.en.sub:memory.pt.sub}</div>
      </div>
    </div>}
    {/* Nursing picker agora \u00e9 Modal central (v11.7), consistente com popup do bot\u00e3o +. */}
    <Modal open={showNursingPicker} onClose={()=>setShowNursingPicker(false)}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
        <div style={{width:44,height:44,borderRadius:13,background:`linear-gradient(135deg,${T.blue}5c,${T.blue}14)`,border:`1px solid ${T.blue}70`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 1px 0 0 rgba(255,255,255,0.12) inset, 0 4px 12px -4px ${T.blue}60`}}>
          <Icon name="breast" size={22} color="#7dd3fc"/>
        </div>
      </div>
      <div style={{fontSize:T.fSM,fontWeight:700,color:T.label,letterSpacing:0.5,textTransform:"uppercase",textAlign:"center",marginBottom:14}}>{_lang==="en"?"Which side?":"Qual lado?"}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[{k:"left",L:"L",pt:"Esquerdo",en:"Left"},{k:"right",L:"R",pt:"Direito",en:"Right"}].map(s=>(
          <button key={s.k} onClick={()=>{Haptic.medium();startTimer("nursing",s.k);setShowNursingPicker(false)}} style={{padding:"22px 0",borderRadius:14,background:`linear-gradient(180deg,${T.blue}26,${T.blue}0a)`,border:`1px solid ${T.blue}52`,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",boxShadow:`0 1px 0 0 rgba(255,255,255,0.08) inset`}}>
            <div style={{fontSize:34,fontWeight:800,letterSpacing:-2,lineHeight:0.95,background:"linear-gradient(135deg,#ffffff,#7dd3fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{s.L}</div>
            <div style={{fontSize:T.fXS,color:"#7dd3fc",opacity:0.7,marginTop:3}}>{_lang==="en"?s.en:s.pt}</div>
          </button>
        ))}
      </div>
    </Modal>

    {/* TimerBar + Nav via React Portal — vivem fora do scroll container (App root com overflow:auto)
        e fora do #root (com overflow:hidden) para que position:fixed funcione corretamente
        em iOS Safari PWA standalone. Veja #nav-host no <body>. */}
    {ReactDOM.createPortal(<><TimerBar activeTimer={activeTimer} lang={lang} onStop={stopTimer} onSwitch={switchSide} onPause={pauseNursing} onEditStart={()=>setShowEditStart(true)} hidden={showAdd||!!formType||showProfile||showInbox||showChangelog||showEditStart||showNursingPicker||showSleepInfo}/>
    {/* Profile: bottom nav agora \u00e9 s\u00f3 o Home circle (v11.7). Cancelar/Salvar migraram pro
        header top do ProfilePage pra n\u00e3o ficar atr\u00e1s do teclado. */}
    {showProfile?<nav style={{position:"fixed",bottom:"calc(8px + env(safe-area-inset-bottom))",left:"50%",transform:"translateX(-50%)",width:"auto",maxWidth:"none",opacity:1,display:"flex",alignItems:"center",gap:8,padding:"0",pointerEvents:"auto",background:"transparent",border:"none",boxShadow:"none",zIndex:250}}>
      <div style={{position:"relative",width:60,height:60,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"conic-gradient(from 0deg, #8b7cf6 0%, #e0d4ff 15%, #ffffff 22%, #c4b5fd 35%, #8b7cf6 50%, #5b4aaf 65%, #ffffff 78%, #a78bfa 92%, #8b7cf6 100%)",animation:"mercurySpin 3s linear infinite",willChange:"transform",transformOrigin:"center center"}}/>
        <div style={{position:"absolute",inset:-4,borderRadius:"50%",boxShadow:`0 0 20px ${T.accent}8c`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:2.5,borderRadius:"50%",background:"linear-gradient(180deg,rgba(14,18,48,0.98),rgba(8,10,28,0.99))"}}/>
        <button aria-label={L("home")} onClick={()=>{setShowProfile(false);setProfileIsDirty(false)}} style={{position:"relative",zIndex:2,width:55,height:55,borderRadius:"50%",background:"transparent",color:T.lilac,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
          <Icon name="home" size={20} color="#c4b5fd"/>
        </button>
      </div>
    </nav>:<nav style={{position:"absolute",bottom:"calc(8px + env(safe-area-inset-bottom))",left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:360,pointerEvents:"auto",display:"flex",alignItems:"center",justifyContent:"space-around",gap:2,padding:"4px 10px",background:"linear-gradient(180deg,rgba(38,44,90,0.38),rgba(14,18,48,0.62))",backdropFilter:"blur(18px) saturate(180%)",WebkitBackdropFilter:"blur(18px) saturate(180%)",borderRadius:24,border:"1px solid rgba(255,255,255,0.12)",boxShadow:"0 1px 0 0 rgba(255,255,255,0.2) inset, 0 -1px 2px 0 rgba(0,0,0,0.18) inset, 0 8px 24px -8px rgba(0,0,0,0.55)"}}>
      {[{icon:"home",label:L("home"),active:page==="home"&&!showAdd,action:()=>goTo("home")},{icon:"clock",label:L("history"),active:page==="history",action:()=>goTo("history")}].map(n=><button key={n.icon} aria-label={n.label} className="navbtn" onClick={()=>{if(window.Haptic&&Haptic.light)Haptic.light();n.action()}} style={{display:"flex",alignItems:"center",justifyContent:"center",width:46,height:44,borderRadius:18,background:n.active?"rgba(139,124,246,0.22)":"transparent",border:"none",padding:0}}><Icon name={n.icon} size={n.active?18:17} color={n.active?"#ffffff":T.dim}/></button>)}
      <button aria-label={showAdd?L("close"):L("addEvent")} className="navfab" onClick={()=>{if(window.Haptic&&Haptic.light)Haptic.light();setShowAdd(!showAdd);setFormType(null);setPage("home")}} style={{width:44,height:44,borderRadius:18,background:`linear-gradient(180deg,#9b8df8,#7c3aed)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 1px 0 0 rgba(255,255,255,0.22) inset, 0 4px 12px -2px ${T.accent}70`,transform:showAdd?"rotate(45deg)":"rotate(0deg)",margin:"-2px 2px",border:"none",padding:0}}><Icon name="plus" size={18} color="#fff"/></button>
      {[{icon:"chart",label:L("stats"),active:page==="stats"||page==="growth"||page==="behavior",action:()=>goTo("stats")},{icon:"gear",label:L("settings"),active:false,action:()=>setShowProfile(true)}].map(n=><button key={n.icon} aria-label={n.label} className="navbtn" onClick={()=>{if(window.Haptic&&Haptic.light)Haptic.light();n.action()}} style={{display:"flex",alignItems:"center",justifyContent:"center",width:46,height:44,borderRadius:18,background:n.active?"rgba(139,124,246,0.22)":"transparent",border:"none",padding:0}}><Icon name={n.icon} size={n.active?18:17} color={n.active?"#ffffff":T.dim}/></button>)}
    </nav>}
    </>, document.getElementById("nav-host"))}
  </div>);
}

// Remove loading screen
var _ld=document.getElementById('load-debug');if(_ld)_ld.remove();
ReactDOM.createRoot(document.getElementById('root')).render(<ErrorBoundary><App/></ErrorBoundary>);
