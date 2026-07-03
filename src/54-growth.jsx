function GrowthPage({entries,birthDate,profile,onBack,onAddEntry,onDeleteEntry}){
  const growthEntries=entries.filter(e=>e.type==="growth").sort((a,b)=>`${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const age=calcAge(birthDate);
  const ageMonths=age?(age.months+(age.days/30)):0;
  const[showForm,setShowForm]=useState(false);
  const[editingId,setEditingId]=useState(null);
  const[fDate,setFDate]=useState(todayStr());
  const[wK,setWK]=useState("");const[lC,setLC]=useState("");const[hC,setHC]=useState("");
  // v11.9.99: tap-to-inspect nos pontos do gráfico (mesmo padrão do dayPill do Stats).
  // selPt = {field, i} do ponto tocado; tocar de novo fecha, tocar outro move.
  const[selPt,setSelPt]=useState(null);

  // Find existing growth entry on a date (excluding current edit target)
  const findByDate=(date,excludeId)=>growthEntries.find(e=>e.date===date&&e.id!==excludeId);
  const mergeTarget=!editingId?findByDate(fDate,null):null;
  const isEdit=!!editingId;

  // Build all data points: birth + entries
  const allPoints=[];
  if(profile.birthWeight||profile.birthLength||profile.birthHead){
    allPoints.push({ageM:0,date:birthDate,weightKg:profile.birthWeight,lengthCm:profile.birthLength,headCm:profile.birthHead,label:_lang==="en"?"Birth":"Nasc.",isBirth:true});
  }
  growthEntries.forEach(e=>{
    const eAge=calcAge(birthDate);
    if(!eAge)return;
    const d1=new Date(birthDate),d2=new Date(e.date);
    const mths=(d2.getFullYear()-d1.getFullYear())*12+d2.getMonth()-d1.getMonth()+(d2.getDate()-d1.getDate())/30;
    allPoints.push({ageM:Math.max(0,mths),date:e.date,weightKg:e.weightKg,lengthCm:e.lengthCm,headCm:e.headCm,label:new Date(e.date+"T12:00").toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"short"}),entryId:e.id});
  });
  const latest=allPoints[allPoints.length-1];

  const resetForm=()=>{
    setShowForm(false);setEditingId(null);
    setFDate(todayStr());
    setWK("");setLC("");setHC("");
  };

  const openNew=()=>{
    setEditingId(null);
    setFDate(todayStr());
    setWK("");setLC("");setHC("");
    setShowForm(true);
  };

  const openEdit=(entryId)=>{
    const e=growthEntries.find(g=>g.id===entryId);
    if(!e)return;
    setEditingId(entryId);
    setFDate(e.date);
    setWK(e.weightKg!==undefined?formatGrowthVal(e.weightKg):"");
    setLC(e.lengthCm!==undefined?formatGrowthVal(e.lengthCm):"");
    setHC(e.headCm!==undefined?formatGrowthVal(e.headCm):"");
    setShowForm(true);
  };

  // In edit mode, also consider existing values so empty fields don't fail validation
  const hasAnyValue=()=>{
    const w=parseGrowthDecimal(wK),l=parseGrowthDecimal(lC),h=parseGrowthDecimal(hC);
    if(w!==undefined||l!==undefined||h!==undefined)return true;
    if(isEdit){
      const orig=growthEntries.find(g=>g.id===editingId);
      if(orig&&(orig.weightKg!==undefined||orig.lengthCm!==undefined||orig.headCm!==undefined))return true;
    }
    return false;
  };

  const doSave=()=>{
    const w=parseGrowthDecimal(wK),l=parseGrowthDecimal(lC),h=parseGrowthDecimal(hC);
    if(!hasAnyValue())return;
    let targetEntry;
    if(isEdit){
      const orig=growthEntries.find(g=>g.id===editingId);
      if(!orig)return;
      targetEntry={...orig,date:fDate};
    }else if(mergeTarget){
      targetEntry={...mergeTarget,date:fDate};
    }else{
      targetEntry={type:"growth",date:fDate,time:nowTime(),id:uid()};
    }
    // Apply provided fields (empty fields preserve existing values in merge/edit)
    if(w!==undefined)targetEntry.weightKg=w;
    if(l!==undefined)targetEntry.lengthCm=l;
    if(h!==undefined)targetEntry.headCm=h;
    onAddEntry(targetEntry);
    resetForm();
  };

  const doDelete=()=>{
    if(!editingId)return;
    const msg=_lang==="en"?"Delete this measurement?":"Excluir esta medição?";
    if(!confirm(msg))return;
    if(onDeleteEntry)onDeleteEntry(editingId);
    resetForm();
  };

  // Mini chart for a metric — v11.9.99: re-housed num eyebrow card (padrão Profile),
  // + labels de mês no eixo X + tap-to-inspect (pill estilo Stats dayPill).
  function GrowthChart({label,emoji,unit,field,table,color}){
    const pts=allPoints.filter(p=>p[field]);
    if(pts.length<1)return null;
    // WHO P3, P50, P97 curves
    const maxAge=Math.max(ageMonths+1,3);
    const whoSteps=[];for(let m=0;m<=maxAge;m+=maxAge/20){
      const lms=interpolateLMS(table,m);
      const z3=lms.M*Math.pow(1+lms.L*lms.S*(-1.88),1/lms.L);
      const z97=lms.M*Math.pow(1+lms.L*lms.S*1.88,1/lms.L);
      whoSteps.push({m,p3:Math.abs(lms.L)>0.001?z3:lms.M*Math.exp(-1.88*lms.S),p50:lms.M,p97:Math.abs(lms.L)>0.001?z97:lms.M*Math.exp(1.88*lms.S)});
    }
    const allVals=[...whoSteps.map(w=>w.p97),...whoSteps.map(w=>w.p3),...pts.map(p=>p[field])];
    const minV=Math.min(...allVals)*0.9,maxV=Math.max(...allVals)*1.05;
    const W=320,H=140;
    const x=m=>10+(m/maxAge)*(W-20);
    const y=v=>H-10-((v-minV)/(maxV-minV))*(H-20);
    const pathStr=(arr,key)=>arr.map((p,i)=>`${i===0?"M":"L"}${x(p.m).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
    // Month labels do eixo X — meses-calendário desde o nascimento (mar/abr/mai...),
    // posicionados em HTML (fora do viewBox) pra fonte ficar em px reais (T.fXS).
    const monthTicks=[];
    const bd=birthDate?new Date(birthDate+"T12:00"):null;
    if(bd&&!isNaN(bd.getTime())){
      const step=maxAge<=8?1:Math.ceil(maxAge/8);
      for(let m=0;m<=maxAge;m+=step){
        const d=new Date(bd.getFullYear(),bd.getMonth()+m,bd.getDate(),12);
        monthTicks.push({m,label:d.toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{month:"short"}).replace(".","")});
      }
    }
    // Ponto selecionado (tap-to-inspect)
    const selIdx=selPt&&selPt.field===field?selPt.i:null;
    const sel=selIdx!=null&&pts[selIdx]?pts[selIdx]:null;
    const selRes=sel?getPercentile(sel[field],table,sel.ageM):null;
    const selLeft=sel?Math.max(16,Math.min(84,(x(sel.ageM)/W)*100)):0;
    const selTop=sel?(y(sel[field])/H)*100:0;
    const selBelow=sel?selTop<32:false;
    return(<div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))",border:`1px solid ${T.gBSoft}`,borderRadius:18,padding:"15px 16px",marginBottom:13,boxShadow:T.insetTop}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:11}}>
        <div style={{width:20,height:20,borderRadius:7,background:`${color}1f`,border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:10,lineHeight:1}}>{emoji}</span></div>
        <span style={{fontSize:T.fXS,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color}}>{label}</span>
        <span style={{marginLeft:"auto",fontSize:T.fXS,color:T.label,fontWeight:700,letterSpacing:0.5}}>{unit}</span>
      </div>
      <div style={{position:"relative"}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block",background:"rgba(10,14,38,0.45)",borderRadius:12,border:`1px solid ${T.gBSoft}`}}>
          <path d={pathStr(whoSteps,"p3")+" L"+x(maxAge)+","+y(whoSteps[whoSteps.length-1].p97)+" "+pathStr([...whoSteps].reverse(),"p97")} fill={`${color}08`} stroke="none"/>
          <path d={pathStr(whoSteps,"p50")} fill="none" stroke={`${color}44`} strokeWidth="1" strokeDasharray="4,3"/>
          <path d={pathStr(whoSteps,"p3")} fill="none" stroke={`${color}22`} strokeWidth="0.5"/>
          <path d={pathStr(whoSteps,"p97")} fill="none" stroke={`${color}22`} strokeWidth="0.5"/>
          {pts.map((p,i)=><circle key={i} className="chart-dot" cx={x(p.ageM)} cy={y(p[field])} r={selIdx===i?5.5:4} fill={color} stroke={T.bg1} strokeWidth={2}/>)}
          {pts.length>1&&<path d={pts.map((p,i)=>`${i===0?"M":"L"}${x(p.ageM).toFixed(1)},${y(p[field]).toFixed(1)}`).join(" ")} fill="none" stroke={color} strokeWidth="2"/>}
          <text x={W-4} y={y(whoSteps[whoSteps.length-1].p50)+4} textAnchor="end" fill={`${color}66`} fontSize="8">P50</text>
          <text x={W-4} y={y(whoSteps[whoSteps.length-1].p97)+4} textAnchor="end" fill={`${color}44`} fontSize="7">P97</text>
          <text x={W-4} y={y(whoSteps[whoSteps.length-1].p3)+4} textAnchor="end" fill={`${color}44`} fontSize="7">P3</text>
          {/* Hit areas (r=13, transparentes) por cima de tudo — alvo de toque decente no iPhone */}
          {pts.map((p,i)=><circle key={`hit${i}`} cx={x(p.ageM)} cy={y(p[field])} r={13} fill="transparent" style={{cursor:"pointer"}} onClick={()=>setSelPt(s=>s&&s.field===field&&s.i===i?null:{field,i})}/>)}
        </svg>
        {sel&&<div key={selIdx} className="chart-tip" style={{position:"absolute",left:`${selLeft}%`,top:`${selTop}%`,transform:selBelow?"translate(-50%,12px)":"translate(-50%,calc(-100% - 12px))",zIndex:6,whiteSpace:"nowrap",background:T.tooltipBg,border:`1px solid ${color}66`,borderRadius:9,padding:"4px 9px",boxShadow:T.tooltipShadow,pointerEvents:"none",textAlign:"center"}}>
          <div style={{fontSize:T.fXS,color:T.lilac,fontWeight:700,letterSpacing:0.2}}>{sel.label}</div>
          <div style={{fontSize:T.fSM,color:"#fff",fontWeight:800,fontVariantNumeric:"tabular-nums",marginTop:1}}>{formatGrowthVal(sel[field])} {unit}{selRes&&selRes.percentile!=null?` · P${selRes.percentile}`:""}</div>
        </div>}
      </div>
      {monthTicks.length>0&&<div style={{position:"relative",height:13,marginTop:4}}>
        {monthTicks.map(t=><span key={t.m} style={{position:"absolute",left:`${(x(t.m)/W)*100}%`,transform:"translateX(-50%)",fontSize:T.fXS,color:T.label,fontWeight:600,letterSpacing:0.3}}>{t.label}</span>)}
      </div>}
    </div>);
  }

  // PercentileCard: read-only display now (no quick-add — use the unified form instead)
  function PercentileCard({label,value,unit,table,icon}){
    if(!value)return(<div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))",borderRadius:14,padding:14,marginBottom:8,border:`1px solid ${T.gBSoft}`,boxShadow:T.insetTop,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><Icon name={icon} size={14} color={T.dim}/><span style={{fontSize:T.fMD,fontWeight:600,color:T.dim}}>{label}</span></div>
      <span style={{fontSize:T.fSM,color:T.dim,fontStyle:"italic"}}>{_lang==="en"?"no data yet":"sem dados ainda"}</span>
    </div>);
    const result=getPercentile(value,table,ageMonths);
    const p=result?.percentile;
    const pColor=!p?T.dim:p<3||p>97?T.red:p<15||p>85?T.orange:T.green;
    return(<div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))",borderRadius:14,padding:14,marginBottom:8,border:`1px solid ${T.gBSoft}`,boxShadow:T.insetTop}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><Icon name={icon} size={14} color={pColor}/><span style={{fontSize:T.fMD,fontWeight:700,color:T.heading}}>{label}</span></div>
        <span style={{fontSize:T.fXL,fontWeight:800,color:T.heading,fontVariantNumeric:"tabular-nums"}}>{formatGrowthVal(value)} {unit}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{flex:1,height:6,borderRadius:3,background:T.bg3,overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",left:"3%",width:1,height:"100%",background:T.dim,opacity:0.3}}/>
          <div style={{position:"absolute",left:"50%",width:1,height:"100%",background:T.dim,opacity:0.5}}/>
          <div style={{position:"absolute",left:"97%",width:1,height:"100%",background:T.dim,opacity:0.3}}/>
          <div style={{position:"absolute",left:`${Math.max(1,Math.min(99,p))}%`,transform:"translateX(-50%)",width:8,height:8,borderRadius:"50%",background:pColor,top:-1,boxShadow:`0 0 6px ${pColor}88`}}/>
        </div>
        <span style={{fontSize:T.fLG,fontWeight:800,color:pColor,minWidth:35,textAlign:"right"}}>P{p}</span>
      </div>
      <div style={{fontSize:T.fSM,color:T.sub,marginTop:4}}>{_lang==="en"?"WHO Median":"Mediana OMS"}: {result.median.toFixed(1)} {unit}</div>
    </div>);
  }

  const inp={...INP_BASE,padding:"15px 12px",borderRadius:14,textAlign:"center"};
  const dateInp={...inp,fontSize:T.fLG,padding:"13px 12px"};

  // Format merge target date for notice (e.g. "13/04")
  const mergeTargetLabel=mergeTarget?new Date(mergeTarget.date+"T12:00").toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"short"}):"";
  const editTargetLabel=isEdit?(()=>{
    const e=growthEntries.find(g=>g.id===editingId);
    return e?new Date(e.date+"T12:00").toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"long"}):"";
  })():"";

  // v11.9.99: página virou overlay (padrão MilestonesPage/ProfilePage) — fixed, Starfield,
  // header com título gradiente + back 40pt, conteúdo em eyebrow cards (padrão Profile).
  return(<div className="page-switch" style={{position:"fixed",inset:0,zIndex:200,maxWidth:480,margin:"0 auto",background:T.pageBg,overflowY:"auto",overflowX:"hidden",overscrollBehavior:"contain",WebkitOverflowScrolling:"touch",paddingTop:"env(safe-area-inset-top)",paddingBottom:"calc(100px + env(safe-area-inset-bottom))"}}>
    <Starfield/>
    {/* Header */}
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 14px 14px 20px"}}>
      <button aria-label={_lang==="en"?"Back":"Voltar"} onClick={onBack} style={{width:40,height:40,borderRadius:13,background:T.glass,border:`1px solid ${T.gB}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="back" size={18} color={T.sub}/></button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:T.fXL,fontWeight:800,letterSpacing:-0.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",background:"linear-gradient(180deg,#ffffff,#c4b5fd)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent",color:"transparent"}}>{L("growth")}</div>
        <div style={{fontSize:T.fSM,color:T.sub,marginTop:1,fontVariantNumeric:"tabular-nums"}}>{growthEntries.length} {_lang==="en"?(growthEntries.length===1?"measurement":"measurements"):(growthEntries.length===1?"medição":"medições")} · {ageMonths.toFixed(1)}m</div>
      </div>
      <button onClick={()=>showForm?resetForm():openNew()} aria-label={showForm?L("cancel"):(_lang==="en"?"Add measurement":"Adicionar medição")} style={{width:40,height:40,borderRadius:12,background:showForm?T.glass:"linear-gradient(135deg,#a3e635,#65a30d)",border:showForm?`1px solid ${T.gBSoft}`:"none",display:"flex",alignItems:"center",justifyContent:"center",color:showForm?T.sub:"#101604",fontSize:24,fontWeight:800,boxShadow:showForm?"none":"0 4px 14px -4px rgba(163,230,53,0.5)",cursor:"pointer",flexShrink:0}}>{showForm?"×":"+"}</button>
    </div>
    <div style={{padding:"0 20px"}}>

    {showForm&&<div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))",border:`1px solid ${T.gBSoft}`,borderRadius:18,padding:"15px 16px",marginBottom:13,boxShadow:T.cardShadowRaised}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
        <div style={{width:20,height:20,borderRadius:7,background:"rgba(163,230,53,0.12)",border:"1px solid rgba(163,230,53,0.25)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="ruler" size={11} color="#a3e635"/></div>
        <span style={{fontSize:T.fXS,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"#a3e635"}}>{isEdit?(_lang==="en"?"Edit measurement":"Editar medição"):(_lang==="en"?"New measurement":"Nova medição")}</span>
      </div>

      {isEdit&&<div style={{padding:"10px 12px",background:"rgba(139,124,246,0.1)",border:"1px solid rgba(139,124,246,0.25)",borderRadius:10,display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
        <Icon name="pencil" size={14} color="#c4b5fd"/>
        <div style={{fontSize:T.fSM,color:T.lilac,lineHeight:1.4,flex:1,fontWeight:600}}>{_lang==="en"?"Editing measurement from":"Editando medição de"} <b>{editTargetLabel}</b></div>
      </div>}

      <Fld label={_lang==="en"?"Date":"Data"}><input type="date" value={fDate} onChange={e=>setFDate(e.target.value)} style={dateInp}/></Fld>

      {mergeTarget&&!isEdit&&<div style={{padding:"10px 12px",background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:10,display:"flex",gap:8,alignItems:"center",margin:"12px 0"}}>
        <Icon name="zap" size={14} color="#fbbf24"/>
        <div style={{fontSize:T.fSM,color:"#fbbf24",lineHeight:1.4,flex:1}}>{_lang==="en"?<>Measurement already exists on <b>{mergeTargetLabel}</b> — filled fields will <b>update</b> that entry.</>:<>Já existe medição em <b>{mergeTargetLabel}</b> — campos preenchidos irão <b>atualizar</b> essa entrada.</>}</div>
      </div>}

      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)",gap:8,marginTop:12,marginBottom:8}}>
        <Fld label={`${L("weight")} (kg)`}><input type="text" inputMode="decimal" placeholder={_lang==="pt"?"4,5":"4.5"} value={wK} onChange={e=>setWK(e.target.value)} style={inp}/></Fld>
        <Fld label={`${_lang==="en"?"Length":"Comp."} (cm)`}><input type="text" inputMode="decimal" placeholder="55" value={lC} onChange={e=>setLC(e.target.value)} style={inp}/></Fld>
        <Fld label={`${L("head")} (cm)`}><input type="text" inputMode="decimal" placeholder="37" value={hC} onChange={e=>setHC(e.target.value)} style={inp}/></Fld>
      </div>

      <div style={{fontSize:T.fSM,color:T.dim,margin:"6px 0 12px",textAlign:"center",lineHeight:1.5}}>
        {_lang==="en"?"Leave blank what wasn't measured · comma or dot":"Deixe em branco os que não foram medidos · vírgula ou ponto"}
      </div>

      <button onClick={doSave} disabled={!hasAnyValue()} style={{width:"100%",padding:13,borderRadius:12,background:hasAnyValue()?"linear-gradient(135deg,#a3e635,#65a30d)":"rgba(139,124,246,0.1)",color:hasAnyValue()?"#101604":T.dim,fontSize:T.fLG,fontWeight:800,letterSpacing:0.2,boxShadow:hasAnyValue()?"0 4px 14px -4px rgba(163,230,53,0.4)":"none",opacity:hasAnyValue()?1:0.6}}>{isEdit?(_lang==="en"?"Update measurement":"Atualizar medição"):(mergeTarget?(_lang==="en"?"Update measurement":"Atualizar medição"):(_lang==="en"?"Save measurement":"Salvar medição"))}</button>

      {isEdit&&<button onClick={doDelete} style={{background:"transparent",border:"none",color:T.red,fontSize:T.fMD,fontWeight:600,padding:10,marginTop:8,width:"100%"}}>{_lang==="en"?"Delete this measurement":"Excluir esta medição"}</button>}
    </div>}

    {/* v11.9.116: empty state dedicado — só GrowthPage não tinha (cenário mais provável
        no 1º uso real: perfil sem dados de nascimento e zero medições). */}
    {allPoints.length===0?<div style={{padding:"48px 24px 20px",textAlign:"center"}}>
      <div style={{width:58,height:58,borderRadius:18,background:"rgba(163,230,53,0.1)",border:"1px solid rgba(163,230,53,0.22)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><Icon name="ruler" size={26} color="#a3e635"/></div>
      <div style={{fontSize:T.fLG,fontWeight:700,color:T.heading,letterSpacing:-0.2,marginBottom:6}}>{_lang==="en"?"No measurements yet":"Sem medições ainda"}</div>
      <div style={{fontSize:T.fMD,color:T.sub,lineHeight:1.55,maxWidth:250,margin:"0 auto 18px"}}>{_lang==="en"?"Add the first measurement to see percentiles and growth curves.":"Adicione a primeira medição pra ver percentis e curvas de crescimento."}</div>
      <button onClick={openNew} style={{padding:"12px 22px",borderRadius:12,background:"linear-gradient(135deg,#a3e635,#65a30d)",color:"#101604",fontSize:T.fMD,fontWeight:800,boxShadow:"0 4px 14px -4px rgba(163,230,53,0.4)"}}>{_lang==="en"?"Add first measurement":"Adicionar 1ª medição"}</button>
    </div>:<>
    {/* Percentile cards */}
    <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:10}}>
      <span style={{fontSize:T.fSM,fontWeight:800,color:T.accent,textTransform:"uppercase",letterSpacing:1}}>{_lang==="en"?"Current percentiles":"Percentis atuais"}</span>
      {latest&&<span style={{fontSize:T.fXS,color:T.label,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>
        {latest.isBirth?(_lang==="en"?"Birth data":L("birthData")):`${_lang==="en"?"Last":"Últ."}: ${latest.label}`} · {ageMonths.toFixed(1)} {_lang==="en"?"mo":"meses"}
      </span>}
    </div>
    <PercentileCard label={L("weight")} value={latest?.weightKg} unit="kg" table={WHO_GIRLS.weight} icon="target"/>
    <PercentileCard label={L("length")} value={latest?.lengthCm} unit="cm" table={WHO_GIRLS.length} icon="ruler"/>
    <PercentileCard label={L("head")} value={latest?.headCm} unit="cm" table={WHO_GIRLS.head} icon="target"/>

    {/* Growth charts */}
    {allPoints.length>0&&<>
      <div style={{fontSize:T.fSM,fontWeight:800,color:T.accent,textTransform:"uppercase",letterSpacing:1,margin:"18px 0 10px"}}>{_lang==="en"?"Growth curves":"Curvas de crescimento"}</div>
      <GrowthChart label={L("weight")} emoji={"⚖️"} unit="kg" field="weightKg" table={WHO_GIRLS.weight} color="#a3e635"/>
      <GrowthChart label={L("length")} emoji={"\u{1F4CF}"} unit="cm" field="lengthCm" table={WHO_GIRLS.length} color={T.cyan}/>
      <GrowthChart label={L("head")} emoji={"\u{1F476}"} unit="cm" field="headCm" table={WHO_GIRLS.head} color={T.purple}/>
    </>}

    {/* History table (clickable rows, except Birth) */}
    {allPoints.length>0&&<><div style={{fontSize:T.fSM,fontWeight:800,color:T.accent,textTransform:"uppercase",letterSpacing:1,margin:"18px 0 10px"}}>{_lang==="en"?"History":"Histórico"}</div>
      {[...allPoints].reverse().map((p,i)=>{
        const clickable=!p.isBirth&&p.entryId;
        const rowStyle={display:"flex",alignItems:"center",gap:12,padding:"11px 12px",marginBottom:6,background:"rgba(20,26,60,0.42)",borderRadius:12,border:`1px solid ${T.gBSoft}`,boxShadow:T.cardShadow,width:"100%",textAlign:"left",cursor:clickable?"pointer":"default",opacity:p.isBirth?0.75:1};
        const content=<>
          <span style={{fontSize:T.fSM,color:T.sub,minWidth:50,fontWeight:600}}>{p.label}</span>
          <div style={{flex:1,display:"flex",gap:10,fontSize:T.fMD,flexWrap:"wrap"}}>
            {p.weightKg!==undefined&&<span style={{color:"#a3e635",fontWeight:600}}>{formatGrowthVal(p.weightKg)}kg</span>}
            {p.lengthCm!==undefined&&<span style={{color:T.cyan,fontWeight:600}}>{formatGrowthVal(p.lengthCm)}cm</span>}
            {p.headCm!==undefined&&<span style={{color:T.purple,fontWeight:600}}>{_lang==="en"?"Head":"Cab."} {formatGrowthVal(p.headCm)}</span>}
          </div>
          {p.isBirth?<span style={{fontSize:T.fXS,color:T.purple,background:"rgba(139,124,246,0.15)",padding:"2px 6px",borderRadius:4,fontWeight:700,letterSpacing:0.5}}>{_lang==="en"?"BIRTH":"NASC."}</span>:<div style={{width:26,height:26,borderRadius:7,background:"rgba(139,124,246,0.1)",border:"1px solid rgba(139,124,246,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="pencil" size={11} color="#a78bfa"/></div>}
        </>;
        return clickable?<button key={i} onClick={()=>openEdit(p.entryId)} style={rowStyle}>{content}</button>:<div key={i} style={rowStyle}>{content}</div>;
      })}
    </>}
    {/* Source footer */}
    <div style={{padding:"14px 0 20px",fontSize:T.fXS,color:T.label,textAlign:"center",lineHeight:1.6}}>
      {_lang==="en"?"WHO curves for girls 0-24mo. Dashed line = P50 (median). Band = P3-P97.":"Curvas OMS para meninas 0-24m. Linha tracejada = P50 (mediana). Faixa = P3-P97."}
    </div>
    </>}
    </div>
  </div>);
}

// v11.9.61: 12 badges/conquistas pra dar vibe colecionável.
// Cada badge tem check(stats) e progress(stats) — stats agregadas dos entries.
