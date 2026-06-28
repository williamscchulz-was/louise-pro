// v11.9.110: Curva de comportamento — mesma linguagem visual do GrowthPage (overlay +
// Starfield + eyebrow cards + tap-to-inspect), mas pra SONO/LEITE/DESPERTARES por semana.
// O sono ganha uma banda suave "típico p/ idade" (NSF/AAP) — referência, não diagnóstico.
function BehaviorPage({entries,birthDate,onBack}){
  const weekly=behaviorWeekly(entries,birthDate,10);
  const[selPt,setSelPt]=useState(null);
  const dLbl=ds=>ds?new Date(ds+"T12:00").toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"short"}).replace(".",""):"";

  function BehaviorChart({label,emoji,unit,field,color,fmtVal,band}){
    const pts=weekly.filter(p=>p[field]!=null&&!(field!=="wakings"&&p[field]<=0));
    if(pts.length<2)return null;
    const W=320,H=140;
    const n=pts.length;
    const bandPts=band?pts.map(p=>typicalSleepMin(p.ageM)):null;
    const vals=[...pts.map(p=>p[field])];
    if(bandPts){bandPts.forEach(b=>{vals.push(b.lo,b.hi)})}
    const lo=Math.min(...vals),hi=Math.max(...vals);
    const span=Math.max(hi-lo,1);
    let minV=lo-span*0.15-(field==="wakings"?0.3:1),maxV=hi+span*0.15+1;
    if(field==="wakings"&&minV<0)minV=0;
    if(minV<0)minV=0;
    const x=i=>10+(n===1?0.5:i/(n-1))*(W-20);
    const y=v=>H-10-((v-minV)/(maxV-minV))*(H-20);
    const linePath=pts.map((p,i)=>`${i===0?"M":"L"}${x(i).toFixed(1)},${y(p[field]).toFixed(1)}`).join(" ");
    const areaPath=linePath+` L${x(n-1).toFixed(1)},${(H-10).toFixed(1)} L${x(0).toFixed(1)},${(H-10).toFixed(1)} Z`;
    // banda típica (sono): lo→ ... →hi reverse
    const bandPath=bandPts?(bandPts.map((b,i)=>`${i===0?"M":"L"}${x(i).toFixed(1)},${y(b.lo).toFixed(1)}`).join(" ")+" "+[...bandPts].map((b,i)=>({b,i})).reverse().map(({b,i})=>`L${x(i).toFixed(1)},${y(b.hi).toFixed(1)}`).join(" ")+" Z"):null;
    const midPath=bandPts?bandPts.map((b,i)=>`${i===0?"M":"L"}${x(i).toFixed(1)},${y((b.lo+b.hi)/2).toFixed(1)}`).join(" "):null;
    // eixo X — ~4 labels
    const tickIdx=[];const step=Math.max(1,Math.round((n-1)/3));for(let i=0;i<n;i+=step)tickIdx.push(i);if(tickIdx[tickIdx.length-1]!==n-1)tickIdx.push(n-1);
    const selIdx=selPt&&selPt.field===field?selPt.i:null;
    const sel=selIdx!=null&&pts[selIdx]?pts[selIdx]:null;
    const selLeft=sel?Math.max(16,Math.min(84,(x(selIdx)/W)*100)):0;
    const selTop=sel?(y(sel[field])/H)*100:0;
    const selBelow=sel?selTop<32:false;
    return(<div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))",border:`1px solid ${T.gBSoft}`,borderRadius:18,padding:"15px 16px",marginBottom:13,boxShadow:T.insetTop}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:11}}>
        <div style={{width:20,height:20,borderRadius:7,background:`${color}1f`,border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:10,lineHeight:1}}>{emoji}</span></div>
        <span style={{fontSize:T.fXS,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color}}>{label}</span>
        <span style={{marginLeft:"auto",fontSize:T.fXS,color:T.dim,fontWeight:700,letterSpacing:0.5}}>{unit}</span>
      </div>
      <div style={{position:"relative"}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block",background:"rgba(10,14,38,0.45)",borderRadius:12,border:`1px solid ${T.gBSoft}`}}>
          {bandPath&&<path d={bandPath} fill={`${color}0d`} stroke="none"/>}
          {midPath&&<path d={midPath} fill="none" stroke={`${color}3a`} strokeWidth="1" strokeDasharray="4,3"/>}
          <path d={areaPath} fill={`${color}12`} stroke="none"/>
          <path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
          {pts.map((p,i)=><circle key={i} cx={x(i)} cy={y(p[field])} r={selIdx===i?5.5:3.5} fill={color} stroke={T.bg1} strokeWidth={2}/>)}
          {band&&<text x={W-4} y={y((typicalSleepMin(pts[n-1].ageM).lo+typicalSleepMin(pts[n-1].ageM).hi)/2)-4} textAnchor="end" fill={`${color}66`} fontSize="7">{_lang==="en"?"typical":"típico"}</text>}
          {pts.map((p,i)=><circle key={`hit${i}`} cx={x(i)} cy={y(p[field])} r={14} fill="transparent" style={{cursor:"pointer"}} onClick={()=>setSelPt(s=>s&&s.field===field&&s.i===i?null:{field,i})}/>)}
        </svg>
        {sel&&<div style={{position:"absolute",left:`${selLeft}%`,top:`${selTop}%`,transform:selBelow?"translate(-50%,12px)":"translate(-50%,calc(-100% - 12px))",zIndex:6,whiteSpace:"nowrap",background:"linear-gradient(180deg,rgba(32,38,76,0.98),rgba(20,26,58,0.97))",border:`1px solid ${color}66`,borderRadius:9,padding:"4px 9px",boxShadow:"0 6px 18px -6px rgba(0,0,0,0.6)",pointerEvents:"none",textAlign:"center"}}>
          <div style={{fontSize:T.fXS,color:T.lilac,fontWeight:700,letterSpacing:0.2}}>{_lang==="en"?"wk of":"sem."} {dLbl(sel.endDate)}</div>
          <div style={{fontSize:T.fSM,color:"#fff",fontWeight:800,fontVariantNumeric:"tabular-nums",marginTop:1}}>{fmtVal(sel[field])}</div>
        </div>}
      </div>
      <div style={{position:"relative",height:13,marginTop:4}}>
        {tickIdx.map(i=><span key={i} style={{position:"absolute",left:`${(x(i)/W)*100}%`,transform:"translateX(-50%)",fontSize:T.fXS,color:T.dim,fontWeight:600,letterSpacing:0.3}}>{dLbl(pts[i].endDate)}</span>)}
      </div>
    </div>);
  }

  return(<div className="page-switch" style={{position:"fixed",inset:0,zIndex:200,maxWidth:480,margin:"0 auto",background:"radial-gradient(ellipse 140% 55% at 50% 100%, #1a1f52 0%, transparent 70%), radial-gradient(ellipse at 50% 0%, #10153d 0%, #070b1e 65%), #070b1e",overflowY:"auto",overflowX:"hidden",overscrollBehavior:"contain",WebkitOverflowScrolling:"touch",paddingTop:"env(safe-area-inset-top)",paddingBottom:"calc(100px + env(safe-area-inset-bottom))"}}>
    <Starfield/>
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 14px 14px 20px"}}>
      <button aria-label={_lang==="en"?"Back":"Voltar"} onClick={onBack} style={{width:40,height:40,borderRadius:13,background:T.glass,border:`1px solid ${T.gB}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="back" size={18} color={T.sub}/></button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:T.fXL,fontWeight:800,letterSpacing:-0.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",background:"linear-gradient(180deg,#ffffff,#c4b5fd)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent",color:"transparent"}}>{_lang==="en"?"Behavior":"Comportamento"}</div>
        <div style={{fontSize:T.fSM,color:T.sub,marginTop:1,fontVariantNumeric:"tabular-nums"}}>{weekly.length} {_lang==="en"?(weekly.length===1?"week":"weeks"):(weekly.length===1?"semana":"semanas")}</div>
      </div>
    </div>
    <div style={{padding:"0 20px"}}>
    {weekly.length<2?(
      <div style={{padding:"60px 24px 20px",textAlign:"center"}}>
        <div style={{width:58,height:58,borderRadius:18,background:"rgba(139,124,246,0.08)",border:"1px solid rgba(139,124,246,0.15)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16,color:"rgba(196,181,253,0.5)"}}><Icon name="chart" size={26} color="rgba(196,181,253,0.5)"/></div>
        <div style={{fontSize:T.fLG,fontWeight:700,color:T.heading,letterSpacing:-0.2,marginBottom:6}}>{_lang==="en"?"Not enough weeks yet":"Poucas semanas ainda"}</div>
        <div style={{fontSize:T.fMD,color:T.sub,lineHeight:1.55,maxWidth:270,margin:"0 auto"}}>{_lang==="en"?"Keep logging for a couple of weeks and the behavior curves will appear here.":"Continue registrando por algumas semanas e as curvas de comportamento aparecem aqui."}</div>
      </div>
    ):(<>
      <div style={{fontSize:T.fSM,fontWeight:800,color:T.accent,textTransform:"uppercase",letterSpacing:1,margin:"4px 0 12px"}}>{_lang==="en"?"Weekly curves":"Curvas semanais"}</div>
      <BehaviorChart label={_lang==="en"?"Total sleep/day":"Sono total/dia"} emoji={"\u{1F319}"} unit={_lang==="en"?"per day":"por dia"} field="totalSleep" color={T.lilac} band={true} fmtVal={v=>fmtDur(Math.round(v))}/>
      <BehaviorChart label={_lang==="en"?"Milk/day":"Leite/dia"} emoji={"\u{1F37C}"} unit="ml" field="mlDay" color={T.green} fmtVal={v=>`${Math.round(v)} ml`}/>
      <BehaviorChart label={_lang==="en"?"Wake-ups/night":"Despertares/noite"} emoji={"✨"} unit={_lang==="en"?"per night":"por noite"} field="wakings" color={T.amber} fmtVal={v=>v.toFixed(1).replace(".",_lang==="en"?".":",")}/>
      <div style={{padding:"6px 0 20px",fontSize:T.fXS,color:T.dim,textAlign:"center",lineHeight:1.6}}>
        {_lang==="en"?"Each point = a week's daily average. The soft band on sleep is the typical range for age (NSF/AAP) — depends on how much you log.":"Cada ponto = média diária de uma semana. A faixa suave no sono é o intervalo típico p/ idade (NSF/AAP) — depende de quanto você registra."}
      </div>
    </>)}
    </div>
  </div>);
}
