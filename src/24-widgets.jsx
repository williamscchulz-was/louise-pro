const CuriosityCard = React.memo(function CuriosityCard({age,lang,tick}){
  // v11.9.95: fim do auto-sumiço de 13,5s (montava/desmontava sozinho empurrando a Home).
  // Agora aparece a partir das 9h e FICA até o ✕ — dispensa é por dia (localStorage, per-device).
  const[vis,setVis]=useState(false);
  useEffect(()=>{
    if(!age){setVis(false);return}
    const h=new Date().getHours();
    let dis=null;try{dis=localStorage.getItem("lp_curiosity_dismissed")}catch(e){}
    setVis(h>=9&&dis!==todayStr());
  },[age,tick]);
  const dismiss=()=>{try{localStorage.setItem("lp_curiosity_dismissed",todayStr())}catch(e){}setVis(false)};
  if(!vis||!age)return null;
  const dayNum=age.totalDays;const monthNum=age.months;const weekNum=age.totalWeeks;
  const colors=["#fbbf24","#34d399","#38bdf8","#a78bfa","#f472b6","#fb923c"];
  let txt=null,col=colors[0],tagLabel="",daysLeft=null;
  // Priority 1: daily curiosities (days 1-30)
  if(dayNum>=1&&dayNum<=30){
    const c=CURIOSITIES[dayNum-1];if(!c)return null;
    txt=lang==="en"?c.en:c.pt;col=colors[(dayNum-1)%colors.length];
    tagLabel=lang==="en"?`Day ${dayNum}`:`Dia ${dayNum}`;daysLeft=30-dayNum;
  }
  // Priority 2: monthly milestones (on the exact day of the month anniversary)
  else if(monthNum>=2&&monthNum<=12&&age.days===0){
    const ms=MILESTONES.find(m=>m.m===monthNum);
    if(ms){
      txt=lang==="en"?ms.en:ms.pt;col=colors[(monthNum-1)%colors.length];
      tagLabel=lang==="en"?`${monthNum} months`:`${monthNum} meses`;
    }
  }
  // Priority 3: weekly curiosities (weeks 5-52, i.e. days 35-364) — only on the first
  // day of each new week (dayNum%7===0). Same fact shouldn't show 7 days in a row.
  if(!txt&&weekNum>=5&&weekNum<=52&&dayNum%7===0){
    const idx=weekNum-5;
    const wc=WEEKLY_CURIOSITIES&&WEEKLY_CURIOSITIES[idx];
    if(wc){
      txt=lang==="en"?wc.en:wc.pt;col=colors[(weekNum-1)%colors.length];
      tagLabel=lang==="en"?`Week ${weekNum}`:`Semana ${weekNum}`;
    }
  }
  if(!txt)return null;
  // v11.9.24: refinarias — gradient bg mais sutil, border mais leve, shadow lavanda outer.
  return(<div style={{position:"relative",margin:"0 20px 14px",padding:"16px 20px",borderRadius:20,background:`linear-gradient(180deg,${col}14,${col}03)`,border:`1px solid ${col}28`,overflow:"hidden",boxShadow:`0 1px 0 0 rgba(255,255,255,0.05) inset, 0 8px 28px -16px ${col}55`,animation:"curiosityIn .5s ease"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.05),transparent 60%)",pointerEvents:"none"}}/>
    <div style={{position:"relative",display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
      {/* v11.9.24: tag virou pill com bg sutil + ícone integrado */}
      <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:6,background:`${col}14`,border:`1px solid ${col}1f`,fontSize:T.fXS,fontWeight:700,letterSpacing:0.6,textTransform:"uppercase",color:col}}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill={`${col}50`} stroke={col} strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="2.5" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="21.5"/><line x1="4.5" y1="4.5" x2="5.7" y2="5.7"/><line x1="2.5" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="21.5" y2="12"/></svg>
        {tagLabel}
      </span>
      {daysLeft!==null&&<span style={{fontSize:T.fSM,color:T.dim,marginLeft:"auto",fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{lang==="en"?`${daysLeft} days left`:`${daysLeft} dias restantes`}</span>}
      <button aria-label={lang==="en"?"Dismiss":"Dispensar"} onClick={dismiss} className="hit44" style={{marginLeft:daysLeft!==null?6:"auto",width:24,height:24,borderRadius:8,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",color:T.dim,fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",lineHeight:1}}>✕</button>
    </div>
    <div style={{position:"relative",fontSize:T.fLG,fontWeight:700,marginBottom:5,lineHeight:1.35,color:T.heading,letterSpacing:-0.25}}>{txt.t}</div>
    <div style={{position:"relative",fontSize:T.fMD,color:"#9099c3",lineHeight:1.6,letterSpacing:0.05}}>{txt.b}</div>
  </div>);
});

// v11.9.1: confetti minimalista pra marcos (1 mes, 100 dias). Trigger 1x via localStorage.
// 28 particulas com cores variadas, drop 1.4s, fade out. Cleanup por timeout.
// v11.9.74: count-up premium. Anima de 0 (mount) ou do valor anterior até `end`,
// easeOutCubic via rAF. Re-anima só quando `end` muda (não no tick — end é estável).
// Hooks ANTES de qualquer return (Rules of Hooks). Retorna o número (node de texto).
function CountUp({end,dur=650}){
  const[v,setV]=useState(0);
  const ref=useRef(0);
  useEffect(()=>{
    const to=typeof end==="number"?end:0;
    const from=ref.current;
    ref.current=to;
    if(from===to){setV(to);return}
    let raf;const t0=performance.now();
    const step=now=>{
      const p=Math.min(1,(now-t0)/dur);
      const e=1-Math.pow(1-p,3);
      setV(Math.round(from+(to-from)*e));
      if(p<1){raf=requestAnimationFrame(step)}else{setV(to)}
    };
    raf=requestAnimationFrame(step);
    return()=>{if(raf)cancelAnimationFrame(raf)};
  },[end,dur]);
  return v;
}
function Confetti({trigger,onDone}){
  // v11.9.64: hook ANTES de qualquer return condicional (Rules of Hooks).
  // Antes o useEffect ficava após `if(!trigger)return null`, mudando a contagem
  // de hooks 0->1 quando o confetti disparava — React lançava erro.
  useEffect(()=>{
    if(!trigger)return;
    const t=setTimeout(()=>onDone&&onDone(),1700);
    return()=>clearTimeout(t);
  },[trigger]);
  if(!trigger)return null;
  const colors=["#a78bfa","#fbbf24","#f472b6","#6ee7b7","#7dd3fc","#fb923c"];
  const pieces=Array.from({length:28},(_,i)=>{
    const angle=(i/28)*Math.PI*2+Math.random()*0.4;
    const dist=120+Math.random()*80;
    const cx=Math.cos(angle)*dist;
    const cy=Math.sin(angle)*dist+60;
    const cr=(Math.random()*720-360);
    const delay=Math.random()*0.15;
    const c=colors[i%colors.length];
    return{key:i,style:{"--cx":`${cx}px`,"--cy":`${cy}px`,"--cr":`${cr}deg`,background:c,animationDelay:`${delay}s`}};
  });
  return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:400}}>
    {pieces.map(p=><span key={p.key} className="confetti-piece" style={p.style}/>)}
  </div>);
}

const InsightCards = React.memo(function InsightCards({insights,phase}){
  // v11.9.95: fim do auto-sumiço (13,5s) + capado em 1 — os 2 cards montando/desmontando
  // sozinhos empurravam a Home no pico de registro. O card fica; muda quando o dado muda.
  if(!insights||insights.length===0||phase!==2)return null;
  return(<>{insights.slice(0,1).map((h,i)=>{const col=h.type==="good"?T.green:h.type==="warn"?T.orange:T.blue;const colLight=h.type==="good"?"#6ee7b7":h.type==="warn"?"#fdba74":"#7dd3fc";return<div key={"hi"+i} style={{position:"relative",margin:"0 20px 12px",padding:"18px 20px",borderRadius:20,background:`linear-gradient(180deg,${col}1f,${col}08)`,border:`1px solid ${col}45`,display:"flex",alignItems:"flex-start",gap:14,boxShadow:`0 1px 0 0 rgba(255,255,255,0.08) inset, 0 0 0 1px ${col}10, 0 8px 24px -8px ${col}25`,overflow:"hidden",animation:"curiosityIn .5s ease"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.05),transparent 60%)",pointerEvents:"none"}}/>
    <div style={{width:42,height:42,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative",...T.iconTile(col)}}><Icon name={h.type==="good"?"check":h.type==="warn"?"zap":"star"} size={20} color={colLight}/></div>
    <div style={{flex:1,minWidth:0,position:"relative"}}>
      <div style={{fontSize:T.fLG,fontWeight:700,color:colLight,letterSpacing:-0.2}}>{h.title}</div>
      <div style={{fontSize:T.fMD,color:"#9099c3",marginTop:4,lineHeight:1.55}}>{h.sub}</div>
    </div>
  </div>})}</>);
});

function Toast({message,onUndo,onRepeat,onClose,lift}){const closeRef=useRef(onClose);closeRef.current=onClose;
  // v11.9.27: timeout maior (3s) quando ha onRepeat, pra dar tempo de clicar
  const ttl=onRepeat?5000:4500;
  useEffect(()=>{const t=setTimeout(()=>closeRef.current(),ttl);return()=>clearTimeout(t)},[]);
  // v11.9.92: lift=true quando há timer ativo — o TimerBar vive em bottom ~88px no portal
  // z:300 e COBRIA o toast (o Desfazer, única rede do swipe-delete, morria invisível à noite).
  return(<div style={{position:"fixed",bottom:lift?"calc(176px + env(safe-area-inset-bottom))":"calc(96px + env(safe-area-inset-bottom))",left:"50%",transform:"translateX(-50%)",zIndex:300,padding:"12px 14px",borderRadius:18,background:"linear-gradient(180deg,rgba(20,26,66,0.95),rgba(14,18,52,0.95))",border:`1px solid ${T.gBSoft}`,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",display:"flex",alignItems:"center",gap:8,boxShadow:"0 1px 0 0 rgba(255,255,255,0.08) inset, 0 12px 32px -8px rgba(0,0,0,0.6)",animation:"slideUpCentered .3s cubic-bezier(0.22,1,0.36,1)",maxWidth:"calc(100vw - 32px)"}}>
    <span style={{fontSize:T.fMD,color:T.heading,fontWeight:600,letterSpacing:-0.2,flex:"0 1 auto",minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{message}</span>
    {onRepeat&&<button onClick={onRepeat} aria-label={_lang==="en"?"Log another":"Logar outra"} style={{padding:"6px 11px",borderRadius:10,background:"rgba(74,222,128,0.14)",color:"#86efac",fontSize:T.fMD,fontWeight:700,letterSpacing:-0.1,border:"1px solid rgba(74,222,128,0.32)",display:"inline-flex",alignItems:"center",gap:4,flexShrink:0}}>↻ {_lang==="en"?"Again":"Repetir"}</button>}
    {onUndo&&<button onClick={onUndo} style={{padding:"6px 12px",borderRadius:10,background:`linear-gradient(180deg,#9b8df8,#7c3aed)`,color:"#fff",fontSize:T.fMD,fontWeight:700,letterSpacing:-0.1,border:"1px solid rgba(139,124,246,0.5)",boxShadow:`0 1px 0 0 rgba(255,255,255,0.18) inset, 0 4px 12px -4px ${T.accent}55`,flexShrink:0}}>{L("undo")}</button>}
  </div>)}


function Modal({open,onClose,children,wide}){const[vis,setVis]=useState(false),[show,setShow]=useState(false);useEffect(()=>{if(open){setVis(true);requestAnimationFrame(()=>requestAnimationFrame(()=>setShow(true)))}else{setShow(false);const t=setTimeout(()=>setVis(false),300);return()=>clearTimeout(t)}},[open]);if(!vis)return null;
  // v10.7.2: prop `wide` pra forms (AddForm edit/new). Aumenta maxWidth pra 400, mant\u00e9m scroll
  // interno pra forms altos (growth com 3 medi\u00e7\u00f5es etc). X button fixo no canto superior direito
  // do frame do modal; conte\u00fado com scroll abaixo dele.
  const mw=wide?400:340;
  return(<div style={{position:"fixed",inset:0,zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:"calc(16px + env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom))"}} onClick={onClose}>
    <div style={{position:"absolute",inset:0,background:"rgba(2,3,10,0.55)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",opacity:show?1:0,transition:"opacity .35s"}}/>
    <div onClick={e=>e.stopPropagation()} style={{position:"relative",width:"100%",maxWidth:mw,maxHeight:"88vh",background:"linear-gradient(180deg,rgba(20,26,60,0.94),rgba(14,18,52,0.93))",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",borderRadius:26,border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 1px 0 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.03), 0 24px 64px -12px rgba(0,0,0,0.65), 0 0 80px -20px rgba(139,124,246,0.18)",transform:show?"scale(1)":"scale(0.92)",opacity:show?1:0,transition:"all .35s cubic-bezier(0.22,1,0.36,1)",overflow:"hidden",display:"flex",flexDirection:"column"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.04),transparent 50%)",pointerEvents:"none",borderRadius:26}}/>
      <button aria-label={L("close")} onClick={onClose} style={{position:"absolute",top:12,right:12,width:40,height:40,borderRadius:12,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",color:T.dim,boxShadow:T.insetTop,zIndex:3}}><Icon name="x" size={14} color={T.dim}/></button>
      <div style={{position:"relative",overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch",padding:wide?"22px 14px 18px":"28px 24px 24px"}}>{children}</div>
    </div>
  </div>)}

function Fld({label,children}){return<div style={{marginBottom:18,minWidth:0}}><label style={{fontSize:T.fSM,color:T.label,fontWeight:600,marginBottom:10,display:"block",letterSpacing:-0.05}}>{label}</label>{children}</div>}
function Seg({opts,val,set,color}){return<div style={{display:"flex",gap:6}}>{opts.map(o=><button key={o.v} onClick={()=>set(o.v)} style={{flex:1,padding:"12px 4px",borderRadius:10,fontSize:T.fMD,fontWeight:600,background:val===o.v?color:T.glass,color:val===o.v?T.bg1:T.text,border:`1px solid ${val===o.v?color:T.gB}`}}>{o.l}</button>)}</div>}

// SleepBlock memoizado (v10.5.1) — entry + entries são estáveis, re-renderiza só quando muda de verdade.
