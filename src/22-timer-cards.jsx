function LastFeedCard({entries}){
  const feed=entries.filter(e=>e.type==="bottle"||e.type==="nursing").sort((a,b)=>`${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`))[0];
  if(!feed)return null;
  const ago=timeSince(feed.date,feed.time);
  const isBottle=feed.type==="bottle";
  const detail=isBottle&&feed.ml?`${feed.ml}ml`:(feed.durationMin?fmtDur(feed.durationMin):TL(feed.type));
  const col=isBottle?T.green:T.blue;
  const colLight=isBottle?"#6ee7b7":"#7dd3fc";
  return(<div style={{padding:"0 20px",marginBottom:14}}>
    <div style={{position:"relative",padding:"16px 18px 16px 22px",borderRadius:18,background:`linear-gradient(180deg,${col}12,${col}04)`,border:`1px solid ${col}32`,display:"flex",alignItems:"center",gap:14,overflow:"hidden",boxShadow:`0 1px 0 0 rgba(255,255,255,0.06) inset, 0 6px 16px -8px ${col}25`}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:`linear-gradient(180deg,${col},${col}40)`,borderRadius:"0 2px 2px 0",pointerEvents:"none"}}/>
      <div style={{width:46,height:46,borderRadius:14,background:`linear-gradient(135deg,${col}38,${col}10)`,border:`1px solid ${col}50`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 1px 0 0 rgba(255,255,255,0.08) inset"}}>
        <Icon name={isBottle?"bottle":"breast"} size={20} color={colLight}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:T.fSM,color:T.label,fontWeight:600,letterSpacing:-0.05}}>{_lang==="en"?"Last feed":"Última mamada"}</div>
        <div style={{fontSize:T.f2XL,fontWeight:800,color:colLight,letterSpacing:-0.5,fontVariantNumeric:"tabular-nums",marginTop:2}}>{detail}</div>
      </div>
      <div style={{textAlign:"right"}}>
        <div style={{fontSize:T.fLG,fontWeight:700,color:T.heading,fontVariantNumeric:"tabular-nums",letterSpacing:-0.3}}>{feed.time}</div>
        <div style={{fontSize:T.fSM,color:T.sub,marginTop:3,fontWeight:500}}>{ago}</div>
      </div>
    </div>
  </div>);
}

function WeeklyCard({entries}){const tw=[],lw=[];for(let i=0;i<7;i++){const d1=dateOffset(todayStr(),-i),d2=dateOffset(todayStr(),-7-i);tw.push(...entries.filter(e=>e.date===d1));lw.push(...entries.filter(e=>e.date===d2))}const tMl=tw.filter(e=>e.type==="bottle").reduce((s,e)=>s+(e.ml||0),0);const lMl=lw.filter(e=>e.type==="bottle").reduce((s,e)=>s+(e.ml||0),0);const tSl=sumRealSleep(tw);const lSl=sumRealSleep(lw);if(!lMl&&!lSl)return null;const md=lMl>0?Math.round(((tMl-lMl)/lMl)*100):0;const sd=lSl>0?Math.round(((tSl-lSl)/lSl)*100):0;if(!md&&!sd)return null;return(<div style={{padding:"0 20px",marginBottom:16}}><div style={{padding:"16px 18px",borderRadius:18,background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.4))",border:`1px solid ${T.gBSoft}`,display:"flex",gap:18,boxShadow:T.insetTop}}>{md!==0&&<div style={{display:"flex",alignItems:"center",gap:8,flex:1}}><div style={{width:30,height:30,borderRadius:10,background:`linear-gradient(135deg,${md>0?T.green:T.orange}30,${md>0?T.green:T.orange}10)`,border:`1px solid ${md>0?T.green:T.orange}45`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 1px 0 0 rgba(255,255,255,0.08) inset"}}><Icon name={md>0?"arrowUp":"arrowDown"} size={14} color={md>0?"#6ee7b7":"#fdba74"}/></div><span style={{fontSize:T.fMD,color:"#9099c3",lineHeight:1.4}}><span style={{fontWeight:800,color:md>0?"#6ee7b7":"#fdba74",fontVariantNumeric:"tabular-nums",letterSpacing:-0.2}}>{Math.abs(md)}%</span> {L("milkVsWeek")}</span></div>}{sd!==0&&<div style={{display:"flex",alignItems:"center",gap:8,flex:1}}><div style={{width:30,height:30,borderRadius:10,background:`linear-gradient(135deg,${sd>0?T.green:T.orange}30,${sd>0?T.green:T.orange}10)`,border:`1px solid ${sd>0?T.green:T.orange}45`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 1px 0 0 rgba(255,255,255,0.08) inset"}}><Icon name={sd>0?"arrowUp":"arrowDown"} size={14} color={sd>0?"#6ee7b7":"#fdba74"}/></div><span style={{fontSize:T.fMD,color:"#9099c3",lineHeight:1.4}}><span style={{fontWeight:800,color:sd>0?"#6ee7b7":"#fdba74",fontVariantNumeric:"tabular-nums",letterSpacing:-0.2}}>{Math.abs(sd)}%</span> {_lang==="en"?"sleep":"sono"}</span></div>}</div></div>)}

function EditStartModal({open,onClose,activeTimer,onSave}){
  const [dateStr,setDateStr]=useState("");
  const [timeStr,setTimeStr]=useState("");
  const [tick,setTick]=useState(0);
  // Init fields when opening
  useEffect(()=>{
    if(!open||!activeTimer)return;
    const st=new Date(activeTimer.startTime);
    setDateStr(`${st.getFullYear()}-${String(st.getMonth()+1).padStart(2,"0")}-${String(st.getDate()).padStart(2,"0")}`);
    setTimeStr(`${String(st.getHours()).padStart(2,"0")}:${String(st.getMinutes()).padStart(2,"0")}`);
  },[open,activeTimer]);
  // Live tick to keep "new duration" fresh
  useEffect(()=>{
    if(!open)return;
    const iv=setInterval(()=>setTick(k=>k+1),1000);
    return()=>clearInterval(iv);
  },[open]);
  if(!activeTimer)return null;
  const typeLabel=activeTimer.type==="sleep"?(_lang==="en"?"Bedtime":"Bedtime"):activeTimer.type==="nap"?(_lang==="en"?"Nap":"Soneca"):(_lang==="en"?"Tummy time":"Tummy time");
  const typeColor=activeTimer.type==="tummytime"?T.amber:T.purple;
  const typeColorLight=activeTimer.type==="tummytime"?"#fde68a":"#c4b5fd";
  const typeIcon=activeTimer.type==="sleep"?"moon":activeTimer.type==="nap"?"cloud":"baby";
  // Parse proposed new start
  let newStartMs=null,valid=false,errMsg="";
  try{
    if(dateStr&&timeStr){
      const d=new Date(`${dateStr}T${timeStr}`);
      if(!isNaN(d.getTime())){
        newStartMs=d.getTime();
        const nowMs=Date.now();
        if(newStartMs>nowMs){
          errMsg=_lang==="en"?"Start cannot be in the future":"Início não pode ser no futuro";
        }else if(nowMs-newStartMs>30*60*60*1000){
          errMsg=_lang==="en"?"Too far in the past (max 30h)":"Muito longe no passado (máx 30h)";
        }else{
          // If wakings exist, new start can't be after the first waking
          const wakings=activeTimer.wakings||[];
          if(wakings.length>0){
            const origStart=new Date(activeTimer.startTime);
            // Compute first waking absolute timestamp
            const fw=wakings[0];
            const[fwh,fwm]=(fw.time||"00:00").split(":").map(Number);
            const startMinOfDay=origStart.getHours()*60+origStart.getMinutes();
            const wakeMinOfDay=fwh*60+fwm;
            let dayOffset=0;
            if(wakeMinOfDay<startMinOfDay)dayOffset=1;
            const fwMs=new Date(origStart.getFullYear(),origStart.getMonth(),origStart.getDate()+dayOffset,fwh,fwm).getTime();
            if(newStartMs>=fwMs){
              errMsg=_lang==="en"?"First waking is before this time":"Primeiro despertar é antes desse horário";
            }else{valid=true}
          }else{valid=true}
        }
      }
    }
  }catch(e){errMsg=_lang==="en"?"Invalid date/time":"Data/hora inválidos"}
  // Current duration and new duration
  const newMins=newStartMs?Math.max(0,Math.floor((Date.now()-newStartMs)/60000)):0;
  const oldMins=Math.max(0,Math.floor((Date.now()-new Date(activeTimer.startTime).getTime())/60000));
  const fmtM=m=>{const h=Math.floor(m/60),r=m%60;return h>0?`${h}h ${r}min`:`${r}min`};
  const doSave=async()=>{
    if(!valid||!newStartMs)return;
    Haptic.medium();
    await onSave(new Date(newStartMs).toISOString());
    onClose();
  };
  const wakingsCount=(activeTimer.wakings||[]).length;
  return(<Modal open={open} onClose={onClose}>
    <div style={{width:64,height:64,margin:"0 auto 16px",borderRadius:20,background:`linear-gradient(135deg,${typeColor}38,${typeColor}10)`,border:`1px solid ${typeColor}50`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 0 0 rgba(255,255,255,0.08) inset",position:"relative"}}><Icon name={typeIcon} size={28} color={typeColorLight}/></div>
    <div style={{textAlign:"center",fontSize:T.f2XL,fontWeight:800,letterSpacing:-0.5,color:T.heading,marginBottom:6}}>{_lang==="en"?"Edit start":"Editar início"}</div>
    <div style={{textAlign:"center",fontSize:T.fMD,color:"#9099c3",lineHeight:1.55,marginBottom:20}}>{_lang==="en"?`Change the start time of this ${typeLabel.toLowerCase()}. Wakings stay at their actual time.`:`Mude o horário de início deste ${typeLabel.toLowerCase()}. Despertares permanecem no horário real.`}</div>
    <div style={{fontSize:T.fSM,color:T.label,fontWeight:600,marginBottom:10,letterSpacing:-0.05}}>{_lang==="en"?"Day":"Data"}</div>
    <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:10,marginBottom:16}}>
      <input type="date" value={dateStr} onChange={e=>setDateStr(e.target.value)} style={{width:"100%",maxWidth:"100%",boxSizing:"border-box",WebkitAppearance:"none",appearance:"none",padding:"14px 14px",background:"rgba(20,26,60,0.55)",border:`1px solid ${T.gBSoft}`,borderRadius:14,color:T.text,fontSize:T.fLG,fontWeight:600,letterSpacing:-0.2,outline:"none",colorScheme:"dark",textAlign:"center",boxShadow:T.insetTop}}/>
      <input type="time" value={timeStr} onChange={e=>setTimeStr(e.target.value)} style={{width:"100%",maxWidth:"100%",boxSizing:"border-box",WebkitAppearance:"none",appearance:"none",padding:"14px 14px",background:"rgba(20,26,60,0.55)",border:`1px solid ${T.gBSoft}`,borderRadius:14,color:T.text,fontSize:T.fLG,fontWeight:600,letterSpacing:-0.2,outline:"none",colorScheme:"dark",textAlign:"center",fontVariantNumeric:"tabular-nums",boxShadow:T.insetTop}}/>
    </div>
    {errMsg?(
      <div style={{padding:"12px 14px",borderRadius:12,background:"rgba(248,113,113,0.10)",border:"1px solid rgba(248,113,113,0.28)",marginBottom:16,fontSize:T.fMD,color:"#fca5a5",textAlign:"center",lineHeight:1.5}}>{errMsg}</div>
    ):valid&&(
      <div style={{padding:"12px 14px",borderRadius:12,background:`${typeColor}10`,border:`1px solid ${typeColor}28`,marginBottom:16,fontSize:T.fMD,color:typeColorLight,textAlign:"center",lineHeight:1.6}}>
        {_lang==="en"?"New duration: ":"Nova duração: "}<strong style={{color:T.heading,fontWeight:800}}>{fmtM(newMins)}</strong>
        <span style={{color:T.label,fontWeight:500}}> ({_lang==="en"?"was ":"era "}{fmtM(oldMins)})</span>
        {wakingsCount>0&&<div style={{fontSize:T.fSM,color:"#9099c3",marginTop:4}}>{wakingsCount} {_lang==="en"?`waking${wakingsCount>1?"s":""} preserved`:`despertar${wakingsCount>1?"es":""} preservado${wakingsCount>1?"s":""}`}</div>}
      </div>
    )}
    <button onClick={doSave} disabled={!valid} style={{width:"100%",padding:16,borderRadius:16,background:valid?`linear-gradient(180deg,${typeColor},${typeColor}cc)`:"rgba(14,18,48,0.6)",color:valid?"#1a0f00":T.dim,fontSize:T.fLG,fontWeight:800,letterSpacing:-0.2,border:`1px solid ${valid?`${typeColor}70`:T.gBSoft}`,boxShadow:valid?`0 1px 0 0 rgba(255,255,255,0.25) inset, 0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px -8px ${typeColor}55`:"none",cursor:valid?"pointer":"not-allowed",opacity:valid?1:0.5}}>{_lang==="en"?"Save changes":"Salvar alterações"}</button>
  </Modal>);
}

function NursingSidePicker({open,onClose,onSelect}){
  const[vis,setVis]=useState(false),[show,setShow]=useState(false);
  useEffect(()=>{
    if(open){setVis(true);requestAnimationFrame(()=>requestAnimationFrame(()=>setShow(true)))}
    else{setShow(false);const t=setTimeout(()=>setVis(false),500);return()=>clearTimeout(t)}
  },[open]);
  if(!vis)return null;
  const handleSelect=(side)=>{Haptic.medium();onSelect(side);onClose()};
  return(<div style={{position:"fixed",inset:0,zIndex:90}} onClick={onClose}>
    <div style={{position:"absolute",inset:0,background:"rgba(3,6,20,0.6)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",opacity:show?1:0,transition:"opacity .4s cubic-bezier(0.22,1,0.36,1)"}}/>
    <div onClick={e=>e.stopPropagation()} style={{position:"absolute",left:"50%",bottom:0,transform:show?"translate(-50%,0)":"translate(-50%,100%)",width:"calc(100% - 24px)",maxWidth:440,padding:"24px 22px calc(28px + env(safe-area-inset-bottom))",borderRadius:"28px 28px 0 0",background:"linear-gradient(180deg,rgba(22,28,60,0.97),rgba(14,18,48,0.99))",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",border:`1px solid ${T.blue}33`,borderBottom:"none",boxShadow:`0 1px 0 0 rgba(255,255,255,0.08) inset, 0 -24px 70px -12px ${T.blue}40, 0 -8px 30px -8px rgba(0,0,0,0.6)`,transition:"transform .5s cubic-bezier(0.22,1.1,0.36,1)",willChange:"transform"}}>
      <div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.18)",margin:"-10px auto 20px",opacity:show?1:0,transform:show?"scaleX(1)":"scaleX(0.5)",transition:"opacity .3s ease .05s, transform .4s cubic-bezier(0.22,1,0.36,1) .05s"}}/>
      <div style={{display:"flex",justifyContent:"center",marginBottom:22}}>
        <div style={{width:58,height:58,borderRadius:18,background:`linear-gradient(135deg,${T.blue}5c,${T.blue}14)`,border:`1px solid ${T.blue}70`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 1px 0 0 rgba(255,255,255,0.12) inset, 0 8px 24px -8px ${T.blue}80`,opacity:show?1:0,transform:show?"scale(1) translateY(0)":"scale(0.6) translateY(14px)",transition:"opacity .5s cubic-bezier(0.22,1,0.36,1) .12s, transform .55s cubic-bezier(0.34,1.4,0.5,1) .12s"}}>
          <Icon name="breast" size={28} color="#7dd3fc"/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[{k:"left",L:"L",pt:"Esquerdo",en:"Left"},{k:"right",L:"R",pt:"Direito",en:"Right"}].map((s,i)=><button key={s.k} onClick={()=>handleSelect(s.k)} style={{padding:"32px 0 26px",borderRadius:22,background:`linear-gradient(180deg,${T.blue}26,${T.blue}0a)`,border:`1px solid ${T.blue}52`,display:"flex",flexDirection:"column",alignItems:"center",gap:6,boxShadow:`0 1px 0 0 rgba(255,255,255,0.08) inset, 0 0 0 1px ${T.blue}10, 0 10px 26px -12px ${T.blue}66`,opacity:show?1:0,transform:show?"scale(1) translateY(0)":"scale(0.88) translateY(18px)",transition:`opacity .45s cubic-bezier(0.22,1,0.36,1) ${0.22+i*0.08}s, transform .55s cubic-bezier(0.34,1.35,0.5,1) ${0.22+i*0.08}s`,cursor:"pointer"}}>
          <div style={{fontSize:52,fontWeight:800,letterSpacing:-3,lineHeight:0.95,background:"linear-gradient(135deg,#ffffff,#7dd3fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{s.L}</div>
          <div style={{fontSize:T.fSM,fontWeight:600,color:"#7dd3fc",letterSpacing:-0.1,marginTop:4,opacity:0.75}}>{_lang==="en"?s.en:s.pt}</div>
        </button>)}
      </div>
    </div>
  </div>);
}

// v11.9.0: TimerBar memoizado. Tem tick interno (state local), props mudam raramente
// (activeTimer doc, handlers). Pula re-render quando o App re-renderiza por outras razoes.
const TimerBar = React.memo(function TimerBar({activeTimer,onStop,onSwitch,onPause,onEditStart,hidden}){const[tick,setTick]=useState(0);useEffect(()=>{if(!activeTimer)return;const iv=setInterval(()=>setTick(k=>k+1),1000);return()=>clearInterval(iv)},[activeTimer]);if(!activeTimer)return null;
  // hidden=true: unmount the bar when an overlay (Sheet/Modal/etc) is open, so it stops covering
  // form save buttons and stops tinting via backdrop-filter. Fix for v10.3.2. No fade because the
  // tick interval (1s) kept restarting any CSS transition — unmounting is cleaner anyway.
  if(hidden)return null;
  if(activeTimer.type==="nursing"){
    const now=Date.now();const paused=!!activeTimer.paused;
    const elapsed=paused?0:(now-new Date(activeTimer.sideStart||activeTimer.startTime).getTime());
    let lMs=(activeTimer.leftMs||0),rMs=(activeTimer.rightMs||0);
    if(!paused){if(activeTimer.side==="left")lMs+=elapsed;else rMs+=elapsed}
    const lSecs=Math.floor(lMs/1000),rSecs=Math.floor(rMs/1000);
    const isL=activeTimer.side==="left";
    const bc=T.blue;
    return(<div style={{position:"absolute",bottom:"calc(88px + env(safe-area-inset-bottom))",left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:448,padding:"14px 14px",borderRadius:20,background:`linear-gradient(180deg,${bc}1a,${bc}06)`,border:`1px solid ${bc}50`,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",display:"flex",alignItems:"center",gap:10,pointerEvents:"auto",boxShadow:`0 1px 0 0 rgba(255,255,255,0.08) inset, 0 0 0 1px ${bc}15, 0 12px 30px -10px ${bc}40`,overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.05),transparent 60%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",width:44,height:44,borderRadius:13,background:`linear-gradient(135deg,${bc}38,${bc}10)`,border:`1px solid ${bc}55`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 1px 0 0 rgba(255,255,255,0.1) inset"}}><Icon name="breast" size={20} color="#7dd3fc"/></div>
      <button onClick={()=>onSwitch("left")} style={{position:"relative",flex:1,padding:"8px 4px",borderRadius:14,background:isL?`linear-gradient(180deg,${bc}30,${bc}10)`:"transparent",border:isL?`1px solid ${bc}55`:"1px solid transparent",boxShadow:isL?"0 1px 0 0 rgba(255,255,255,0.1) inset":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <span style={{fontSize:T.fSM,fontWeight:700,color:isL?"#7dd3fc":T.dim,letterSpacing:0.3}}>L</span>
          <span style={{fontSize:T.f2XL,fontWeight:800,fontVariantNumeric:"tabular-nums",letterSpacing:-0.6,color:isL?"#f0f2ff":T.dim}}>{fmtTimer(lSecs)}</span>
        </div>
        {isL&&<button onClick={e=>{e.stopPropagation();onPause()}} style={{width:30,height:30,borderRadius:9,background:`linear-gradient(180deg,${bc}40,${bc}20)`,border:`1px solid ${bc}55`,display:"flex",alignItems:"center",justifyContent:"center",marginLeft:4,boxShadow:"0 1px 0 0 rgba(255,255,255,0.1) inset"}}>{paused?<svg width="11" height="11" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21" fill="#fff"/></svg>:<svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><rect x="5" y="3" width="5" height="18" rx="1"/><rect x="14" y="3" width="5" height="18" rx="1"/></svg>}</button>}
      </button>
      <button onClick={()=>onSwitch("right")} style={{position:"relative",flex:1,padding:"8px 4px",borderRadius:14,background:!isL?`linear-gradient(180deg,${bc}30,${bc}10)`:"transparent",border:!isL?`1px solid ${bc}55`:"1px solid transparent",boxShadow:!isL?"0 1px 0 0 rgba(255,255,255,0.1) inset":"none",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <span style={{fontSize:T.fSM,fontWeight:700,color:!isL?"#7dd3fc":T.dim,letterSpacing:0.3}}>R</span>
          <span style={{fontSize:T.f2XL,fontWeight:800,fontVariantNumeric:"tabular-nums",letterSpacing:-0.6,color:!isL?"#f0f2ff":T.dim}}>{fmtTimer(rSecs)}</span>
        </div>
        {!isL&&<button onClick={e=>{e.stopPropagation();onPause()}} style={{width:30,height:30,borderRadius:9,background:`linear-gradient(180deg,${bc}40,${bc}20)`,border:`1px solid ${bc}55`,display:"flex",alignItems:"center",justifyContent:"center",marginLeft:4,boxShadow:"0 1px 0 0 rgba(255,255,255,0.1) inset"}}>{paused?<svg width="11" height="11" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21" fill="#fff"/></svg>:<svg width="11" height="11" viewBox="0 0 24 24" fill="#fff"><rect x="5" y="3" width="5" height="18" rx="1"/><rect x="14" y="3" width="5" height="18" rx="1"/></svg>}</button>}
      </button>
      <button onClick={onStop} style={{position:"relative",width:44,height:44,borderRadius:13,background:`linear-gradient(180deg,${bc}50,${bc}28)`,border:`1px solid ${bc}65`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 1px 0 0 rgba(255,255,255,0.15) inset, 0 4px 12px -4px ${bc}55`,flexShrink:0}}><Icon name="stop" size={15} color="#fff"/></button>
    </div>)
  }
  const secs=Math.max(0,Math.floor((Date.now()-new Date(activeTimer.startTime).getTime())/1000));
  const isTum=activeTimer.type==="tummytime";
  const tCol=isTum?T.amber:T.purple;
  const tColLight=isTum?"#fde68a":"#c4b5fd";
  const tColLightRgba=isTum?"rgba(253,230,138,0.9)":"rgba(196,181,253,0.85)";
  const tLabel=isTum?(_lang==="en"?"Tummy time":"Tummy time"):(activeTimer.type==="nap"?TL("nap"):TL("sleep"));
  const tIconName=isTum?"baby":(activeTimer.type==="nap"?"cloud":"bed");
  // Format time: tummytime uses mm:ss, sleep/nap uses h:mm:ss via fmtTimer
  const timeDisplay=isTum?`${String(Math.floor(secs/60)).padStart(2,"0")}:${String(secs%60).padStart(2,"0")}`:fmtTimer(secs);
  // Since label: "desde HH:MM" showing the start time
  const stDate=new Date(activeTimer.startTime);
  const stTimeStr=`${String(stDate.getHours()).padStart(2,"0")}:${String(stDate.getMinutes()).padStart(2,"0")}`;
  return(<div style={{position:"absolute",bottom:"calc(88px + env(safe-area-inset-bottom))",left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:448,padding:"16px 14px 16px 18px",borderRadius:20,background:`linear-gradient(180deg,${tCol}2e,${tCol}0f)`,border:`1px solid ${tCol}55`,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",display:"flex",alignItems:"center",gap:12,pointerEvents:"auto",boxShadow:`0 1px 0 0 rgba(255,255,255,0.08) inset, 0 0 0 1px ${tCol}15, 0 12px 30px -10px ${tCol}40`,overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.06),transparent 60%)",pointerEvents:"none"}}/>
    <div style={{width:50,height:50,borderRadius:15,background:`linear-gradient(135deg,${tCol}45,${tCol}15)`,border:`1px solid ${tCol}55`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 1px 0 0 rgba(255,255,255,0.1) inset",position:"relative"}}><Icon name={tIconName} size={22} color={tColLight}/></div>
    <div style={{flex:1,position:"relative",minWidth:0}}>
      <div style={{fontSize:T.fSM,fontWeight:600,color:tColLightRgba,letterSpacing:-0.05,marginBottom:3,textTransform:"uppercase"}}>{tLabel}</div>
      <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
        <div style={{fontSize:T.f3XL,fontWeight:800,fontVariantNumeric:"tabular-nums",color:T.heading,letterSpacing:-1}}>{timeDisplay}</div>
        <div style={{fontSize:T.fSM,color:"#9099c3",fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{_lang==="en"?"since ":"desde "}{stTimeStr}</div>
      </div>
    </div>
    <button onClick={()=>onEditStart&&onEditStart()} style={{width:40,height:40,borderRadius:12,background:`${tCol}20`,border:`1px solid ${tCol}40`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 0 0 rgba(255,255,255,0.08) inset",flexShrink:0}}><Icon name="pencil" size={15} color={tColLight}/></button>
    <button onClick={onStop} style={{width:50,height:50,borderRadius:15,background:`linear-gradient(180deg,${tCol}60,${tCol}35)`,border:`1px solid ${tCol}70`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 1px 0 0 rgba(255,255,255,0.15) inset, 0 6px 16px -6px ${tCol}55`,position:"relative",flexShrink:0}}><Icon name="stop" size={16} color="#fff"/></button>
  </div>)})

// v11.9.0: memoizado pra não re-renderizar quando outros states do App mudam
// (formType abre/fecha, diaper toggle, etc). Re-renderiza só quando age/lang/tick mudam.
