function GrowthPage({entries,birthDate,profile,onBack,onAddEntry,onDeleteEntry}){
  const growthEntries=entries.filter(e=>e.type==="growth").sort((a,b)=>`${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const age=calcAge(birthDate);
  const ageMonths=age?(age.months+(age.days/30)):0;
  const[showForm,setShowForm]=useState(false);
  const[editingId,setEditingId]=useState(null);
  const[fDate,setFDate]=useState(todayStr());
  const[wK,setWK]=useState("");const[lC,setLC]=useState("");const[hC,setHC]=useState("");

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

  // Mini chart for a metric
  function GrowthChart({label,field,table,color}){
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
    return(<div style={{marginBottom:16}}>
      <div style={{fontSize:T.fMD,fontWeight:700,color,marginBottom:6}}>{label}</div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",background:T.glass,borderRadius:12,border:`1px solid ${T.gB}`}}>
        <path d={pathStr(whoSteps,"p3")+" L"+x(maxAge)+","+y(whoSteps[whoSteps.length-1].p97)+" "+pathStr([...whoSteps].reverse(),"p97")} fill={`${color}08`} stroke="none"/>
        <path d={pathStr(whoSteps,"p50")} fill="none" stroke={`${color}44`} strokeWidth="1" strokeDasharray="4,3"/>
        <path d={pathStr(whoSteps,"p3")} fill="none" stroke={`${color}22`} strokeWidth="0.5"/>
        <path d={pathStr(whoSteps,"p97")} fill="none" stroke={`${color}22`} strokeWidth="0.5"/>
        {pts.map((p,i)=><circle key={i} cx={x(p.ageM)} cy={y(p[field])} r={4} fill={color} stroke={T.bg1} strokeWidth={2}/>)}
        {pts.length>1&&<path d={pts.map((p,i)=>`${i===0?"M":"L"}${x(p.ageM).toFixed(1)},${y(p[field]).toFixed(1)}`).join(" ")} fill="none" stroke={color} strokeWidth="2"/>}
        <text x={W-4} y={y(whoSteps[whoSteps.length-1].p50)+4} textAnchor="end" fill={`${color}66`} fontSize="8">P50</text>
        <text x={W-4} y={y(whoSteps[whoSteps.length-1].p97)+4} textAnchor="end" fill={`${color}44`} fontSize="7">P97</text>
        <text x={W-4} y={y(whoSteps[whoSteps.length-1].p3)+4} textAnchor="end" fill={`${color}44`} fontSize="7">P3</text>
      </svg>
    </div>);
  }

  // PercentileCard: read-only display now (no quick-add — use the unified form instead)
  function PercentileCard({label,value,unit,table,icon}){
    if(!value)return(<div style={{background:T.glass,borderRadius:14,padding:14,marginBottom:8,border:`1px solid ${T.gB}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><Icon name={icon} size={14} color={T.dim}/><span style={{fontSize:T.fMD,fontWeight:600,color:T.dim}}>{label}</span></div>
      <span style={{fontSize:T.fSM,color:T.dim,fontStyle:"italic"}}>{_lang==="en"?"no data yet":"sem dados ainda"}</span>
    </div>);
    const result=getPercentile(value,table,ageMonths);
    const p=result?.percentile;
    const pColor=!p?T.dim:p<3||p>97?T.red:p<15||p>85?T.orange:T.green;
    return(<div style={{background:T.glass,borderRadius:14,padding:14,marginBottom:8,border:`1px solid ${T.gB}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><Icon name={icon} size={14} color={pColor}/><span style={{fontSize:T.fMD,fontWeight:700}}>{label}</span></div>
        <span style={{fontSize:T.fXL,fontWeight:800}}>{formatGrowthVal(value)} {unit}</span>
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

  return(<div style={{padding:"calc(16px + env(safe-area-inset-top)) 20px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={onBack} style={{width:32,height:32,borderRadius:10,background:T.glass,border:`1px solid ${T.gB}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="back" size={16} color={T.sub}/></button><h2 style={{fontSize:T.fXL,fontWeight:700,margin:0}}>{L("growth")}</h2></div>
      <button onClick={()=>showForm?resetForm():openNew()} style={{padding:"6px 12px",borderRadius:10,background:"rgba(163,230,53,0.1)",border:"1px solid rgba(163,230,53,0.2)",fontSize:T.fMD,fontWeight:700,color:"#a3e635"}}>{showForm?L("cancel"):(_lang==="en"?"+ Measure":"+ Medição")}</button>
    </div>

    {showForm&&<div style={{background:T.glass,borderRadius:14,padding:16,marginBottom:16,border:`1px solid ${T.gB}`}}>
      <div style={{fontSize:T.fMD,fontWeight:700,color:T.sub,marginBottom:12}}>{isEdit?(_lang==="en"?"Edit measurement":"Editar medição"):(_lang==="en"?"New measurement":"Nova medição")}</div>

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

      <button onClick={doSave} disabled={!hasAnyValue()} style={{width:"100%",padding:12,borderRadius:10,background:hasAnyValue()?"#a3e635":"rgba(139,124,246,0.1)",color:hasAnyValue()?T.bg1:T.dim,fontSize:T.fLG,fontWeight:700,opacity:hasAnyValue()?1:0.6}}>{isEdit?(_lang==="en"?"Update measurement":"Atualizar medição"):(mergeTarget?(_lang==="en"?"Update measurement":"Atualizar medição"):(_lang==="en"?"Save measurement":"Salvar medição"))}</button>

      {isEdit&&<button onClick={doDelete} style={{background:"transparent",border:"none",color:T.red,fontSize:T.fMD,fontWeight:600,padding:10,marginTop:8,width:"100%"}}>{_lang==="en"?"Delete this measurement":"Excluir esta medição"}</button>}
    </div>}

    {/* Percentile cards */}
    {latest&&<div style={{fontSize:T.fSM,color:T.sub,marginBottom:10}}>
      {latest.isBirth?(_lang==="en"?"Birth data":L("birthData")):`${_lang==="en"?"Last":"Últ."}: ${latest.label}`} · {ageMonths.toFixed(1)} {_lang==="en"?"mo":"meses"}
    </div>}
    <PercentileCard label={L("weight")} value={latest?.weightKg} unit="kg" table={WHO_GIRLS.weight} icon="target"/>
    <PercentileCard label={L("length")} value={latest?.lengthCm} unit="cm" table={WHO_GIRLS.length} icon="ruler"/>
    <PercentileCard label={L("head")} value={latest?.headCm} unit="cm" table={WHO_GIRLS.head} icon="target"/>

    {/* Growth charts */}
    {allPoints.length>0&&<>
      <div style={{fontSize:T.fMD,fontWeight:600,color:T.dim,marginTop:16,marginBottom:10,textTransform:"uppercase",letterSpacing:0.8}}>{_lang==="en"?"Growth curves":"Curvas de crescimento"}</div>
      <GrowthChart label={`${L("weight")} (kg)`} field="weightKg" table={WHO_GIRLS.weight} color={T.green}/>
      <GrowthChart label={`${L("length")} (cm)`} field="lengthCm" table={WHO_GIRLS.length} color={T.blue}/>
      <GrowthChart label={`${L("head")} (cm)`} field="headCm" table={WHO_GIRLS.head} color={T.amber}/>
    </>}

    {/* History table (clickable rows, except Birth) */}
    {allPoints.length>0&&<><div style={{fontSize:T.fMD,fontWeight:600,color:T.dim,marginTop:8,marginBottom:10,textTransform:"uppercase",letterSpacing:0.8}}>{_lang==="en"?"History":"Histórico"}</div>
      {[...allPoints].reverse().map((p,i)=>{
        const clickable=!p.isBirth&&p.entryId;
        const rowStyle={display:"flex",alignItems:"center",gap:12,padding:"10px 12px",marginBottom:4,background:T.glass,borderRadius:10,border:`1px solid ${T.gB}`,width:"100%",textAlign:"left",cursor:clickable?"pointer":"default",opacity:p.isBirth?0.75:1};
        const content=<>
          <span style={{fontSize:T.fSM,color:T.sub,minWidth:50,fontWeight:600}}>{p.label}</span>
          <div style={{flex:1,display:"flex",gap:10,fontSize:T.fMD,flexWrap:"wrap"}}>
            {p.weightKg!==undefined&&<span style={{color:T.green,fontWeight:600}}>{formatGrowthVal(p.weightKg)}kg</span>}
            {p.lengthCm!==undefined&&<span style={{color:T.blue,fontWeight:600}}>{formatGrowthVal(p.lengthCm)}cm</span>}
            {p.headCm!==undefined&&<span style={{color:T.amber,fontWeight:600}}>{_lang==="en"?"Head":"Cab."} {formatGrowthVal(p.headCm)}</span>}
          </div>
          {p.isBirth?<span style={{fontSize:T.fXS,color:T.purple,background:"rgba(139,124,246,0.15)",padding:"2px 6px",borderRadius:4,fontWeight:700,letterSpacing:0.5}}>{_lang==="en"?"BIRTH":"NASC."}</span>:<div style={{width:26,height:26,borderRadius:7,background:"rgba(139,124,246,0.1)",border:"1px solid rgba(139,124,246,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="pencil" size={11} color="#a78bfa"/></div>}
        </>;
        return clickable?<button key={i} onClick={()=>openEdit(p.entryId)} style={rowStyle}>{content}</button>:<div key={i} style={rowStyle}>{content}</div>;
      })}
    </>}
    <div style={{marginTop:16,padding:12,background:T.glass,borderRadius:12,border:`1px solid ${T.gB}`,fontSize:T.fSM,color:T.dim,lineHeight:1.6}}>
      {_lang==="en"?"WHO curves for girls 0-24mo. Dashed line = P50 (median). Band = P3-P97.":"Curvas OMS para meninas 0-24m. Linha tracejada = P50 (mediana). Faixa = P3-P97."}
    </div>
  </div>);
}

// v11.9.61: 12 badges/conquistas pra dar vibe colecionável.
// Cada badge tem check(stats) e progress(stats) — stats agregadas dos entries.
