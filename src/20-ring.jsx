const Ring = React.memo(function Ring({activeTimer,napSug,tick,recentEvents,lang,showOrbit,screenLockActive}){
  const[tip,setTip]=useState(null);
  useEffect(()=>{if(tip!==null){const t=setTimeout(()=>setTip(null),3000);return()=>clearTimeout(t)}},[tip]);
  // v11.9.45: Ring meio termo — 340 → 270 (~20% redução, era 200 em v11.9.43).
  // Equilíbrio entre dominância visual do anel e KPI cards above-the-fold.
  const sz=270,cx=sz/2,cy=sz/2,R=113;
  const gapDeg=55,startAng=90+gapDeg/2,totalArc=360-gapDeg;
  const dotSz=40,sleepSz=40;
  const bigFont=42;
  const arcStrokeBg=16,arcStrokeFill=24,arcStrokeInset=19,arcStrokeDashed=13,arcStrokeIconBlur=29;
  const anchorSz=36,anchorIconSz=16,dotIconSz=18,sleepIconSz=16;
  const MIN_GAP=18;
  let lbl="",sub="",col1=T.dim,col2=T.dim,isBedtime=false;
  if(activeTimer){
    const el=Math.max(0,Math.floor((Date.now()-new Date(activeTimer.startTime).getTime())/1000));const mins=Math.floor(el/60);
    lbl=mins<60?`${mins} min`:`${Math.floor(mins/60)}h ${String(mins%60).padStart(2,"0")}m`;
    if(activeTimer.type==="nursing"){sub=lang==="en"?"Nursing":"Amamentando";col1="#2563eb";col2="#60a5fa"}
    else if(activeTimer.type==="nap"){sub=lang==="en"?"Napping":"Soneca";col1="#7c3aed";col2="#c084fc"}
    else if(activeTimer.type==="tummytime"){sub=lang==="en"?"Tummy time":"Tummy time";col1="#d97706";col2="#fbbf24"}
    else if(activeTimer.type==="bath"){sub=lang==="en"?"Bath":"Banho";col1="#0e7490";col2="#22d3ee"}
    else{sub=lang==="en"?"Bedtime":"Boa noite";col1="#7c3aed";col2="#c084fc";isBedtime=true}
  } else if(napSug){
    lbl=fmtDur(napSug.el);sub=lang==="en"?"Awake for":"Acordado(a)";
    if(napSug.state==="overdue"){col1="#dc2626";col2="#f87171"}
    else if(napSug.state==="stretching"){col1="#ea580c";col2="#fb923c"}
    else if(napSug.state==="sweet"){col1="#059669";col2="#34d399"}
    else if(napSug.state==="opening"){col1="#d97706";col2="#fbbf24"}
    // v11.9.44: state === null (rotina fixa) cai no default green \u2014 mesma cor do "awake for"
    // pr\u00e9-rotina (n\u00e3o usa lavanda da rotina pra n\u00e3o conflitar com purple/bedtime).
    else{col1="#059669";col2="#34d399"}
  } else{sub="";lbl="\u2014"}
  const hasProgress=col1!==T.dim;
  const isBath=!!activeTimer&&activeTimer.type==="bath";
  const toMin=t=>{const[h,m]=(t||"12:00").split(":").map(Number);return h*60+m};
  const evs=(recentEvents||[]);
  // Day window: from wake-up to midnight
  let wakeMin=6*60;let hasWakeup=false;
  const wakeEv=evs.find(e=>e.type==="wakeup");
  if(wakeEv){wakeMin=toMin(wakeEv.time);hasWakeup=true}
  else{const ls=evs.filter(e=>(e.type==="sleep"||e.type==="nap")&&e.durationMin>0).sort((a,b)=>(b.date+"T"+b.time).localeCompare(a.date+"T"+a.time))[0];if(ls){const em=toMin(ls.time)+ls.durationMin;if(em>=5*60&&em<=12*60){wakeMin=em;hasWakeup=true}}
  else{const firstEv=[...evs].sort((a,b)=>a.time.localeCompare(b.time))[0];if(firstEv)wakeMin=Math.max(0,toMin(firstEv.time)-15)}}
  const dayStart=wakeMin;
  let dayEnd=24*60;
  let bedMin=null;
  const bedEv=[...evs].filter(e=>e.type==="sleep").sort((a,b)=>`${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
  if(bedEv){let bm=toMin(bedEv.time);if(bm<dayStart)bm+=1440;bedMin=bm;if(bm>dayStart)dayEnd=bm}
  if(!bedMin&&activeTimer&&activeTimer.type==="sleep"){const st=new Date(activeTimer.startTime);const bm=st.getHours()*60+st.getMinutes();const adjBm=bm<dayStart?bm+1440:bm;bedMin=adjBm;if(adjBm>dayStart)dayEnd=adjBm}
  const daySpan=Math.max(1,dayEnd-dayStart);
  const toAng=mins=>{const t=Math.max(0,Math.min(1,(mins-dayStart)/daySpan));return startAng+t*totalArc};
  const descArc=(sA,eA)=>{const s=sA*Math.PI/180,e=eA*Math.PI/180;return`M ${cx+R*Math.cos(s)} ${cy+R*Math.sin(s)} A ${R} ${R} 0 ${eA-sA>180?1:0} 1 ${cx+R*Math.cos(e)} ${cy+R*Math.sin(e)}`};
  const sleepEvs=evs.filter(e=>e.type==="nap"&&e.durationMin>0);
  // v11.9.103: TODOS os eventos de horário aparecem no arco (mantendo o agrupamento por
  // proximidade). Faltavam banho e temperatura. Sono/soneca viram arcos; acordar = sol;
  // crescimento/marco ficam de fora (são registros, não eventos do ritmo do dia).
  const dotEvs=evs.filter(e=>e.type==="bottle"||e.type==="nursing"||e.type==="diaper"||e.type==="medicine"||e.type==="tummytime"||e.type==="bath"||e.type==="temperature");
  const sleepArcs=sleepEvs.map(ev=>{
    const mins=toMin(ev.time),dur=ev.durationMin;
    if(mins+dur<dayStart||mins>dayStart+daySpan)return null;
    const a1=toAng(Math.max(mins,dayStart)),a2=toAng(Math.min(mins+dur,dayStart+daySpan));
    const midAng=(a1+a2)/2;const midRad=midAng*Math.PI/180;
    return{ev,path:descArc(a1,a2),mx:cx+R*Math.cos(midRad),my:cy+R*Math.sin(midRad),col:TYPES[ev.type]?.color||T.purple};
  }).filter(Boolean);
  // MIN_GAP definido lá em cima junto com sz (v11.9.43)
  const rawDots=dotEvs.map(ev=>{
    const cfg=TYPES[ev.type];if(!cfg)return null;
    const mins=toMin(ev.time);
    if(mins<dayStart||mins>dayStart+daySpan)return null;
    const angDeg=toAng(mins);const angRad=angDeg*Math.PI/180;
    return{ev,cfg,angDeg,x:cx+R*Math.cos(angRad),y:cy+R*Math.sin(angRad)};
  }).filter(Boolean);
  const groups=[];
  rawDots.forEach(d=>{const g=groups.find(gr=>Math.abs(gr[0].angDeg-d.angDeg)<MIN_GAP);if(g)g.push(d);else groups.push([d])});
  const dots=groups.map(gr=>({primary:gr[0],items:gr}));
  // v11.9.115: constelação — fios pontilhados ligando eventos PRÓXIMOS no tempo (<=75° no
  // anel). De propósito só cordas curtas (perto da borda) — nunca cruzam o número do centro.
  const constSegs=(()=>{const sd=[...dots].sort((a,b)=>a.primary.angDeg-b.primary.angDeg);const segs=[];for(let i=1;i<sd.length;i++){if(sd[i].primary.angDeg-sd[i-1].primary.angDeg<=58)segs.push([sd[i-1].primary,sd[i].primary])}return segs})();
  // Determine last event globally: dot vs sleep arc (compare end times)
  const _lastEv=(()=>{let maxT="",type="none",dIdx=-1,sIdx=-1;dots.forEach((gr,idx)=>{gr.items.forEach(it=>{const t=`${it.ev.date}T${it.ev.time}`;if(t>maxT){maxT=t;type="dot";dIdx=idx}})});sleepArcs.forEach((sa,idx)=>{const endMs=new Date(`${sa.ev.date}T${sa.ev.time}`).getTime()+sa.ev.durationMin*60000;const d=new Date(endMs);const t=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+"T"+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");if(t>maxT){maxT=t;type="sleep";sIdx=idx}});return{type,dIdx,sIdx}})();
  const lastDotIdx=_lastEv.type==="dot"?_lastEv.dIdx:-1;
  const lastSleepArcIdx=_lastEv.type==="sleep"?_lastEv.sIdx:-1;
  const totalSleepMin=evs.filter(e=>(e.type==="sleep"||e.type==="nap")&&e.durationMin).reduce((s,e)=>s+e.durationMin,0);

  // Anchor: sun at wake-up (ring start), moon at bedtime (ring end)
  const wakeTimeStr=`${String(Math.floor(wakeMin/60)).padStart(2,"0")}:${String(wakeMin%60).padStart(2,"0")}`;
  const sunAng=toAng(wakeMin);const sunRad=sunAng*Math.PI/180;
  const anchorSun=hasWakeup?{x:cx+R*Math.cos(sunRad),y:cy+R*Math.sin(sunRad),time:wakeTimeStr}:null;
  let anchorMoon=null;
  if(bedMin){const dispMin=bedMin%1440;const bedTimeStr=`${String(Math.floor(dispMin/60)).padStart(2,"0")}:${String(dispMin%60).padStart(2,"0")}`;const moonAng=toAng(bedMin);const moonRad=moonAng*Math.PI/180;anchorMoon={x:cx+R*Math.cos(moonRad),y:cy+R*Math.sin(moonRad),time:bedTimeStr}}

  // Live timer arc (nap + tummytime, during daytime)
  let timerArc=null;
  if(activeTimer&&(activeTimer.type==="nap"||activeTimer.type==="tummytime"||activeTimer.type==="bath")){
    const st=new Date(activeTimer.startTime);
    const startMins=st.getHours()*60+st.getMinutes();
    const now=new Date();
    const nowMins=now.getHours()*60+now.getMinutes();
    if(startMins>=dayStart){
      const a1=toAng(startMins),a2=toAng(Math.min(nowMins,dayStart+daySpan-1));
      if(a2>a1){const midAng=(a1+a2)/2;const midRad=midAng*Math.PI/180;const tipRad=a2*Math.PI/180;timerArc={path:descArc(a1,a2),col:activeTimer.type==="bath"?T.cyan:activeTimer.type==="tummytime"?T.amber:T.purple,mx:cx+R*Math.cos(midRad),my:cy+R*Math.sin(midRad),tipX:cx+R*Math.cos(tipRad),tipY:cy+R*Math.sin(tipRad)}}
    }
  }

  // Ring original: SVG puro com arcs, sem disco central (Beautiful Glow revertido em v10.7.0
  // — minimalismo vence, starfield aparece atrás do center text).
  return(<div style={{position:"relative",width:sz,margin:"0 auto"}}>
    <div style={{position:"relative",width:sz,height:sz}}>
      <svg width={sz} height={sz} style={{overflow:"visible"}}>
        <defs><filter id="slpG"><feGaussianBlur stdDeviation="5" result="b"/><feFlood floodColor={T.purple} floodOpacity="0.35" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <path d={descArc(startAng,startAng+totalArc)} fill="none" stroke="rgba(40,55,120,0.18)" strokeWidth={arcStrokeBg} strokeLinecap="round"/>
        {constSegs.map((s,i)=><line key={"cn"+i} x1={s[0].x} y1={s[0].y} x2={s[1].x} y2={s[1].y} stroke="rgba(196,181,253,0.22)" strokeWidth="1.5" strokeDasharray="0.5 5" strokeLinecap="round"/>)}
        {/* Sleep pills */}
        {sleepArcs.map((sa,i)=><path key={"sg"+i} d={sa.path} fill="none" stroke={sa.col} strokeWidth={arcStrokeIconBlur} strokeLinecap="round" opacity={0.08} filter="url(#slpG)"/>)}
        {sleepArcs.map((sa,i)=><path key={"sb"+i} d={sa.path} fill="none" stroke={sa.col} strokeWidth={arcStrokeFill} strokeLinecap="round" opacity={0.4}/>)}
        {sleepArcs.map((sa,i)=><path key={"sf"+i} d={sa.path} fill="none" stroke="rgba(16,12,40,0.85)" strokeWidth={arcStrokeInset} strokeLinecap="round"/>)}
        {/* v11.9.97 (dieta de movimento): o dash idle + sparkle SMIL do último arco SAÍRAM —
            eram 3 animações marcando o MESMO evento (junto do glowBreathe do ícone, que fica).
            O sparkle era SMIL <animate>, o único loop que ignorava body.app-hidden e o
            "reduzir movimento" do iOS. Dash agora só existe no arco do timer ATIVO (abaixo). */}
        {/* Live timer arc (growing) */}
        {timerArc&&<g><path d={timerArc.path} fill="none" stroke={timerArc.col} strokeWidth={arcStrokeIconBlur} strokeLinecap="round" opacity={0.08} filter="url(#slpG)"/><path d={timerArc.path} fill="none" stroke={timerArc.col} strokeWidth={arcStrokeFill} strokeLinecap="round" opacity={0.5}/><path d={timerArc.path} fill="none" stroke="rgba(16,12,40,0.85)" strokeWidth={arcStrokeInset} strokeLinecap="round"/>{/* Dashed flow on active timer arc */}<path d={timerArc.path} fill="none" stroke={timerArc.col} strokeWidth={arcStrokeDashed} strokeLinecap="round" strokeDasharray="6 9" opacity={0.35} style={{animation:"dashFlow 2s linear infinite"}}/></g>}
      </svg>
      {/* Sleep icons centered on pills */}
      {sleepArcs.map((sa,i)=>{const isLastSleep=i===lastSleepArcIdx&&!activeTimer;return<div key={"si"+i} style={{position:"absolute",left:sa.mx-sleepSz/2,top:sa.my-sleepSz/2,width:sleepSz,height:sleepSz,borderRadius:"50%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:3,filter:`drop-shadow(0 0 ${isLastSleep?12:5}px ${sa.col}${isLastSleep?"aa":"55"})`,animation:isLastSleep?"glowBreathe 2s ease-in-out infinite":"none"}}><Icon name={sa.ev.type==="nap"?"cloud":"moon"} size={isLastSleep?sleepIconSz+2:sleepIconSz} color={sa.col}/><span style={{fontSize:T.fXS,fontWeight:700,color:`${sa.col}88`,marginTop:1,lineHeight:1}}>{fmtDur(sa.ev.durationMin)}</span></div>})}
      {/* Live timer icon — strong glow breathing */}
      {timerArc&&<>
        {activeTimer.type==="bath"
          ? <div className="duck-bob" style={{position:"absolute",left:timerArc.mx-17,top:timerArc.my-14,zIndex:4,filter:"drop-shadow(0 2px 5px rgba(0,0,0,0.45))"}}><svg viewBox="0 0 36 30" width="34" height="28"><ellipse cx="19" cy="20" rx="13" ry="8.5" fill="#fcd34d"/><path d="M8 18 Q1 15 4.5 22 Q8 26 15 23Z" fill="#fbbf24"/><circle cx="25" cy="10.5" r="7" fill="#fde68a"/><path d="M31 9.5 l7 .3 l-2.5 4.2 z" fill="#fb923c"/><circle cx="26.5" cy="9" r="1.3" fill="#0b1020"/></svg></div>
          : <div style={{position:"absolute",left:timerArc.mx-sleepSz/2,top:timerArc.my-sleepSz/2,width:sleepSz,height:sleepSz,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",zIndex:4,filter:`drop-shadow(0 0 10px ${timerArc.col}aa)`,animation:"glowBreathe 2s ease-in-out infinite"}}><Icon name={activeTimer.type==="nap"?"cloud":activeTimer.type==="tummytime"?"baby":"bed"} size={sleepIconSz+2} color={timerArc.col}/></div>}
        {!isBath&&<div style={{position:"absolute",left:timerArc.tipX-5,top:timerArc.tipY-5,width:10,height:10,borderRadius:"50%",background:timerArc.col,boxShadow:`0 0 7px ${timerArc.col}aa, 0 0 16px ${timerArc.col}55`,animation:"cometTip 1.5s ease-in-out infinite",zIndex:5}}/>}
      </>}
      {dots.map((gr,i)=>{const d=gr.primary,c=d.cfg.color,isGrp=gr.items.length>1,active=tip===i;const isLast=i===lastDotIdx&&!activeTimer;const lines=gr.items.map(it=>{let l=TL(it.ev.type);if(it.ev.ml)l+=` \u00b7 ${it.ev.ml}ml`;else if(it.ev.subtype)l+=` \u00b7 ${({wet:L("wet"),dirty:L("dirty"),both:L("both")})[it.ev.subtype]||""}`;return`${l} \u00b7 ${it.ev.time}`});return(<div key={d.ev.id||i} style={{position:"absolute",left:d.x-dotSz/2,top:d.y-dotSz/2}}>
        {isLast&&<div style={{position:"absolute",left:"50%",top:"50%",width:dotSz+10,height:dotSz+10,borderRadius:"50%",border:`1.5px solid ${c}88`,transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:0,animation:"softPulse 3.5s ease-in-out infinite"}}/>}
        {isGrp&&gr.items.slice(1,3).map((sd,si)=><div key={"st"+si} style={{position:"absolute",left:4*(si+1),top:4*(si+1),width:dotSz,height:dotSz,borderRadius:"50%",background:"radial-gradient(circle at 35% 30%,rgba(24,30,65,0.9),rgba(8,12,35,0.95))",border:`2px solid ${sd.cfg.color}44`,zIndex:0,boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}/>)}
        <div onClick={e=>{e.stopPropagation();setTip(active?null:i)}} style={{position:"relative",width:dotSz,height:dotSz,borderRadius:"50%",background:"radial-gradient(circle at 35% 30%,rgba(30,38,80,0.95),rgba(12,16,42,0.98))",border:`2.5px solid ${active||isLast?c:c+"77"}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 10px rgba(0,0,0,0.45), 0 0 ${active?22:16}px ${c}${active?"55":"30"}, inset 0 1px 0 rgba(200,220,255,0.06), inset 0 -1px 3px rgba(0,0,0,0.15)`,zIndex:active?10:isLast?5:2,transform:active?"scale(1.15)":"scale(1)",transition:"all .2s cubic-bezier(0.34,1.56,0.64,1)",overflow:"hidden",filter:`drop-shadow(0 0 5px ${c}44)`}}>
          <div style={{position:"absolute",top:"10%",left:"18%",width:"50%",height:"28%",background:`radial-gradient(ellipse,${c}22,transparent)`,borderRadius:"50%",filter:"blur(3px)"}}/>
          <Icon name={d.cfg.icon} size={dotIconSz} color={c}/>
          {isGrp&&<div style={{position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",display:"flex",gap:2}}><div style={{width:3,height:3,borderRadius:"50%",background:"rgba(255,255,255,0.7)"}}/><div style={{width:3,height:3,borderRadius:"50%",background:"rgba(255,255,255,0.7)"}}/><div style={{width:3,height:3,borderRadius:"50%",background:"rgba(255,255,255,0.7)"}}/></div>}
        </div>
        {active&&<div style={{position:"absolute",bottom:dotSz+6,left:"50%",transform:"translateX(-50%)",whiteSpace:"nowrap",padding:"6px 12px",borderRadius:9,background:"rgba(8,12,35,0.96)",border:`1px solid ${c}25`,boxShadow:"0 4px 16px rgba(0,0,0,0.5)",zIndex:20,animation:"fadeIn .15s ease"}}>
          {lines.map((ln,li)=><div key={li} style={{fontSize:T.fSM,fontWeight:600,color:c,marginBottom:li<lines.length-1?3:0}}>{ln}</div>)}
          <div style={{position:"absolute",bottom:-4,left:"50%",transform:"translateX(-50%) rotate(45deg)",width:7,height:7,background:"rgba(8,12,35,0.96)",borderRight:`1px solid ${c}25`,borderBottom:`1px solid ${c}25`}}/>
        </div>}
      </div>)})}
      {anchorSun&&<div style={{position:"absolute",left:anchorSun.x-anchorSz/2,top:anchorSun.y-anchorSz/2,display:"flex",flexDirection:"column",alignItems:"center",zIndex:5,pointerEvents:"none"}}><div style={{width:anchorSz,height:anchorSz,borderRadius:"50%",background:"radial-gradient(circle at 40% 30%,rgba(251,191,36,0.28),rgba(251,146,60,0.08))",border:"2px solid rgba(251,191,36,0.55)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 14px rgba(251,191,36,0.3)"}}><Icon name="sun" size={anchorIconSz} color="#fbbf24"/></div><span style={{fontSize:T.fXS,fontWeight:700,color:"#fbbf24",marginTop:2,textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>{anchorSun.time}</span></div>}
      {anchorMoon&&<div style={{position:"absolute",left:anchorMoon.x-anchorSz/2,top:anchorMoon.y-anchorSz/2,display:"flex",flexDirection:"column",alignItems:"center",zIndex:5,pointerEvents:"none"}}><div style={{width:anchorSz,height:anchorSz,borderRadius:"50%",background:"radial-gradient(circle at 40% 30%,rgba(167,139,250,0.28),rgba(139,124,246,0.08))",border:"2px solid rgba(167,139,250,0.55)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 14px rgba(167,139,250,0.3)"}}><Icon name="moon" size={anchorIconSz} color="#a78bfa"/></div><span style={{fontSize:T.fXS,fontWeight:700,color:T.purple,marginTop:2,textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>{anchorMoon.time}</span></div>}
      {/* v11.9.82: nebulosa + micro-interações no miolo — preenche o vazio atrás do tempo.
          Anima por classe CSS (não reseta no tick). Bedtime = roxo mais forte; halo pulsa só com timer ativo. */}
      <div className="ring-neb" style={{position:"absolute",top:"50%",left:"50%",width:sz*0.62,height:sz*0.4,borderRadius:"50%",background:isBath?"radial-gradient(ellipse at 50% 50%,rgba(34,211,238,0.22),rgba(14,116,144,0.08) 46%,transparent 73%)":isBedtime?"radial-gradient(ellipse at 50% 50%,rgba(139,124,246,0.30),rgba(124,58,237,0.13) 45%,transparent 72%)":"radial-gradient(ellipse at 50% 50%,rgba(139,124,246,0.15),rgba(124,58,237,0.05) 48%,transparent 73%)",filter:"blur(16px)",pointerEvents:"none"}}/>
      <div className="ring-neb2" style={{position:"absolute",top:"50%",left:"50%",width:sz*0.46,height:sz*0.3,borderRadius:"50%",background:isBath?"radial-gradient(ellipse at 50% 50%,rgba(103,232,249,0.14),transparent 70%)":`radial-gradient(ellipse at 50% 50%,rgba(196,181,253,${isBedtime?0.18:0.09}),transparent 70%)`,filter:"blur(11px)",pointerEvents:"none"}}/>
      {activeTimer&&<div className="ring-pulse" style={{position:"absolute",top:"50%",left:"50%",width:sz*0.34,height:sz*0.34,borderRadius:"50%",border:`1px solid rgba(167,139,250,${isBedtime?0.4:0.22})`,pointerEvents:"none"}}/>}
      {/* v11.9.115: miolo enchendo de água durante o banho — atrás do número (sem zIndex,
          DOM antes do texto → texto por cima; dots têm z>=2 → ficam acima). */}
      {isBath&&<div style={{position:"absolute",top:"50%",left:"50%",width:sz*0.54,height:sz*0.54,transform:"translate(-50%,-50%)",borderRadius:"50%",overflow:"hidden",pointerEvents:"none"}}>
        <div className="rw-tide" style={{position:"absolute",left:"-25%",bottom:0,width:"150%",height:"26%",background:"linear-gradient(180deg,rgba(34,211,238,0.16),rgba(14,116,144,0.30))"}}>
          <svg className="rw-wave" viewBox="0 0 240 20" preserveAspectRatio="none" style={{position:"absolute",top:-6,left:0,width:"200%",height:11}}><path d="M0 11 Q15 3 30 11 T60 11 T90 11 T120 11 T150 11 T180 11 T210 11 T240 11 V20 H0Z" fill="rgba(34,211,238,0.20)"/></svg>
        </div>
        {[{l:36,s:5,d:0,u:3.4},{l:54,s:4,d:1.3,u:3.0},{l:64,s:6,d:2.2,u:3.7}].map((b,i)=><div key={"rwb"+i} className="rw-bub" style={{position:"absolute",left:b.l+"%",bottom:6,width:b.s,height:b.s,borderRadius:"50%",background:"rgba(207,250,254,0.5)",animationDelay:b.d+"s",animationDuration:b.u+"s"}}/>)}
      </div>}
      {[{l:46,t:42,c:"a"},{l:55,t:46,c:"b"},{l:49,t:54,c:"c"},{l:43,t:49,c:"b"},{l:57,t:51,c:"a"},{l:51,t:39,c:"c"}].map((p,i)=><div key={"rdust"+i} className={"ring-dust-"+p.c} style={{position:"absolute",left:p.l+"%",top:p.t+"%",width:2,height:2,borderRadius:"50%",background:"rgba(196,181,253,0.7)",opacity:0.25+((i%3)*0.15),pointerEvents:"none"}}/>)}
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><span style={{fontSize:T.fMD,color:isBedtime?"#c084fc":T.sub,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",display:"flex",alignItems:"center",gap:5,animation:isBedtime?"bedtimeSubBreath 5s ease-in-out infinite":"none"}}>{isBedtime&&<Icon name="bed" size={13} color="#c084fc"/>}{sub}{screenLockActive&&<span title={lang==="en"?"Screen on":"Tela ligada"} style={{display:"inline-flex",alignItems:"center",gap:3,marginLeft:4,padding:"2px 6px",borderRadius:8,background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.3)"}}><span style={{width:5,height:5,borderRadius:"50%",background:"#fbbf24",boxShadow:"0 0 6px #fbbf24",animation:"pulse 1.5s ease-in-out infinite"}}/><span style={{fontSize:T.fXS,fontWeight:700,color:"#fbbf24",letterSpacing:0.5,textTransform:"uppercase"}}>{lang==="en"?"On":"On"}</span></span>}</span><span style={{fontSize:bigFont,fontWeight:800,letterSpacing:-1.8,marginTop:4,background:isBedtime?"linear-gradient(110deg, #7c3aed 0%, #8b5cf6 25%, #e9d5ff 48%, #ffffff 50%, #e9d5ff 52%, #8b5cf6 75%, #7c3aed 100%)":(hasProgress?`linear-gradient(135deg,${col2},${col1})`:`linear-gradient(180deg,#ffffff 0%,#a78bfa 95%)`),backgroundSize:isBedtime?"300% 100%":"100% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:isBedtime?"drop-shadow(0 0 18px rgba(167,139,250,0.55))":(hasProgress?`drop-shadow(0 0 20px ${col1}55)`:"drop-shadow(0 0 24px rgba(167,139,250,0.32))"),animation:isBedtime?"bedtimeShimmer 10s linear infinite":"none",fontVariantNumeric:"tabular-nums"}}>{lbl}</span>{napSug&&napSug.predictedTime&&!activeTimer&&<span style={{fontSize:T.fSM,fontWeight:600,color:col1,opacity:0.7,marginTop:2}}>{lang==="en"?"Nap":"Nap"} {napSug.napPos||""} ~{napSug.predictedTime}</span>}</div>
      {tip!==null&&<div onClick={()=>setTip(null)} style={{position:"absolute",inset:0,zIndex:1}}/>}
      {showOrbit&&<div key={Date.now()} style={{position:"absolute",left:cx-3,top:cy-3,width:6,height:6,zIndex:10,pointerEvents:"none",animation:"orbitComet 1.2s cubic-bezier(0.25,0.1,0.25,1) forwards"}}><div style={{width:6,height:6,borderRadius:"50%",background:"#fff",boxShadow:"0 0 8px #fff, 0 0 20px rgba(139,124,246,0.6), -8px 0 12px rgba(139,124,246,0.3), -16px 0 8px rgba(139,124,246,0.15)",transform:`translateY(${-R}px)`}}/></div>}
    </div>
  </div>);
});


function MlGoalBar({current,goal}){if(!goal||goal<=0)return null;const pct=Math.min(100,(current/goal)*100);const reached=current>=goal;return(<div style={{padding:"0 20px",marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{display:"flex",alignItems:"center",gap:6}}><Icon name="target" size={14} color={reached?T.green:T.sub}/><span style={{fontSize:T.fSM,fontWeight:600,color:T.sub}}>{L("dailyGoal")}</span></div><span style={{fontSize:T.fMD,fontWeight:700,color:reached?T.green:T.text}}>{current} / {goal} ml</span></div><div style={{height:6,borderRadius:3,background:T.bg3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,width:`${pct}%`,background:reached?T.green:`linear-gradient(90deg,${T.accent},${T.purple})`,transition:"width .5s"}}/></div></div>)}

// ── LAST FEED ──
