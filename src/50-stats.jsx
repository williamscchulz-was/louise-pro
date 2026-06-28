const StatsPage = React.memo(function StatsPage({entries,onGrowth,onBehavior}){
  const[period,setPeriod]=useState(7);
  // v11.9.81: tocar numa barra mostra o valor+data (essencial em 14d+, onde os números
  // somem). selBar = chave da barra tocada ("campo:data"). A COLUNA inteira é o alvo de
  // toque (bem maior que o tracinho fino), e o pill flutua acima da barra selecionada.
  const[selBar,setSelBar]=useState(null);
  const tapBar=k=>setSelBar(p=>p===k?null:k);
  const dayPill=(d,val)=>(<div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",marginBottom:6,zIndex:6,whiteSpace:"nowrap",background:"linear-gradient(180deg,rgba(32,38,76,0.98),rgba(20,26,58,0.97))",border:`1px solid ${T.accent}66`,borderRadius:9,padding:"4px 9px",boxShadow:"0 6px 18px -6px rgba(0,0,0,0.6)",pointerEvents:"none",textAlign:"center"}}><div style={{fontSize:T.fXS,color:T.lilac,fontWeight:700,letterSpacing:0.2}}>{new Date(d.date+"T12:00").toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{weekday:"short",day:"numeric",month:"numeric"}).replace(/\./g,"")}</div><div style={{fontSize:T.fSM,color:"#fff",fontWeight:800,fontVariantNumeric:"tabular-nums",marginTop:1}}>{val}</div></div>);
  const today=todayStr();
  // Build the day window:
  // - For numeric periods (7/14/30): N complete past days (yesterday → N days ago) + today as bonus
  //   This way "7d" means "average of last 7 complete days, with today shown as context"
  // - For "all": every date that has entries (including today)
  const days=period==="all"
    ?[...new Set(entries.map(e=>e.date))].sort()
    :(()=>{
      const arr=[];
      // Past complete days: from N days ago up to yesterday (inclusive)
      for(let i=period;i>=1;i--){
        const d=new Date();d.setDate(d.getDate()-i);
        arr.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`);
      }
      // Today as bonus visual (still in progress, not part of the average)
      arr.push(today);
      return arr;
    })();
  const numDays=days.length||1;
  const data=days.map(dt=>{
    const de=entries.filter(e=>e.date===dt);
    const sleeps=de.filter(e=>(e.type==="sleep"||e.type==="nap")&&e.durationMin);
    const slReal=sumRealSleep(sleeps);
    const slAwake=sumAwakeInSleep(sleeps);
    const simetCount=de.filter(e=>e.type==="medicine"&&e.name&&/simet/i.test(e.name)).length;
    // v11.9.3: granularidade extra — naps duration, poop/wet split, ww (wake window).
    const napsOnly=de.filter(e=>e.type==="nap"&&e.durationMin);
    const napTotalMin=Math.round(napsOnly.reduce((s,e)=>s+e.durationMin,0));
    const napMaxMin=napsOnly.length?Math.round(Math.max(...napsOnly.map(e=>e.durationMin))):0;
    const diapers=de.filter(e=>e.type==="diaper");
    const poopCount=diapers.filter(e=>e.subtype==="dirty"||e.subtype==="both").length;
    const wetCount=diapers.filter(e=>e.subtype==="wet"||e.subtype==="both").length;
    return{
      date:dt,isToday:dt===today,
      label:numDays<=14?new Date(dt+"T12:00").toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{weekday:"short"}).replace(".",""):new Date(dt+"T12:00").toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"numeric"}).replace(/\/\d{4}/,""),
      ml:de.filter(e=>e.type==="bottle").reduce((s,e)=>s+(e.ml||0),0),
      sl:slReal,
      slAwake:slAwake,
      slBed:slReal+slAwake,
      simet:simetCount,
      napTotalMin,napMaxMin,poopCount,wetCount
    }
  });
  // ─────────────────────────────────────────────────
  // AVERAGES: exclude today (still in progress) so the math is honest.
  // Today still appears in the chart, but doesn't pull the average down/up.
  // If today is the only day with data, we fall back to including it
  // (otherwise users would see nothing on first launch).
  // ─────────────────────────────────────────────────
  const completeData=data.filter(d=>!d.isToday);
  const usingFallback=completeData.length===0;
  const avgData=usingFallback?data:completeData;
  const numComplete=avgData.length||1;
  const mxMl=Math.max(...data.map(d=>d.ml),1);
  const mxSl=Math.max(...data.map(d=>d.sl+d.slAwake),1); // stack height = real + awake
  const avgMl=Math.round(avgData.reduce((s,d)=>s+d.ml,0)/numComplete);
  const avgSl=Math.round(avgData.reduce((s,d)=>s+d.sl,0)/numComplete);
  const avgAwake=Math.round(avgData.reduce((s,d)=>s+d.slAwake,0)/numComplete);
  const avgBed=avgSl+avgAwake;
  // Wakings count per night (only nights with bedtime data, excluding today)
  const avgDays=avgData.map(d=>d.date);
  const totalWakings=avgDays.reduce((s,dt)=>s+countWakings(entries.filter(e=>e.date===dt)),0);
  const nightsWithSleep=avgDays.filter(dt=>entries.some(e=>e.date===dt&&e.type==="sleep"&&e.durationMin)).length;
  const avgWakings=nightsWithSleep>0?Math.round((totalWakings/nightsWithSleep)*10)/10:0;
  // Trend: compare COMPLETE current period to COMPLETE previous period (apples to apples)
  // Previous period = the N days before the current period started
  const prevDays=period!=="all"?Array.from({length:numComplete},(_,i)=>{const d=new Date();d.setDate(d.getDate()-numComplete-1-((numComplete-1)-i));return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}):[];
  const prevMl=prevDays.length?Math.round(prevDays.reduce((s,dt)=>s+entries.filter(e=>e.date===dt&&e.type==="bottle").reduce((ss,e)=>ss+(e.ml||0),0),0)/prevDays.length):0;
  const prevSl=prevDays.length?Math.round(prevDays.reduce((s,dt)=>s+sumRealSleep(entries.filter(e=>e.date===dt)),0)/prevDays.length):0;
  const trendMl=prevMl>0?Math.round(((avgMl-prevMl)/prevMl)*100):0;
  const trendSl=prevSl>0?Math.round(((avgSl-prevSl)/prevSl)*100):0;
  // Extra daily avgs (also exclude today)
  const avgDiapers=Math.round(avgDays.reduce((s,dt)=>s+entries.filter(e=>e.date===dt&&e.type==="diaper").length,0)/numComplete*10)/10;
  const avgFeedings=Math.round(avgDays.reduce((s,dt)=>s+entries.filter(e=>e.date===dt&&(e.type==="bottle"||e.type==="nursing")).length,0)/numComplete*10)/10;
  const avgNaps=Math.round(avgDays.reduce((s,dt)=>s+entries.filter(e=>e.date===dt&&e.type==="nap").length,0)/numComplete*10)/10;
  // v11.9.3: averages adicionais
  const avgNapMin=Math.round(avgData.reduce((s,d)=>s+d.napTotalMin,0)/numComplete);
  // v11.9.5: media de tempo POR SONECA (total min / total naps), nao por dia.
  const totalNapMinPeriod=avgData.reduce((s,d)=>s+d.napTotalMin,0);
  const totalNapCountPeriod=avgData.reduce((s,d)=>s+(entries.filter(e=>e.date===d.date&&e.type==="nap"&&e.durationMin).length),0);
  const avgNapDur=totalNapCountPeriod>0?Math.round(totalNapMinPeriod/totalNapCountPeriod):0;
  const avgNapMaxMin=Math.round(avgData.reduce((s,d)=>s+d.napMaxMin,0)/numComplete);
  const avgPoop=Math.round((avgData.reduce((s,d)=>s+d.poopCount,0)/numComplete)*10)/10;
  const avgWet=Math.round((avgData.reduce((s,d)=>s+d.wetCount,0)/numComplete)*10)/10;
  const mxPoop=Math.max(...data.map(d=>d.poopCount),1);
  // Simeticona stats: doses per day chart + last dose info
  const mxSimet=Math.max(...data.map(d=>d.simet),1);
  const avgSimet=Math.round((avgData.reduce((s,d)=>s+d.simet,0)/numComplete)*10)/10;
  const totalSimetInPeriod=data.reduce((s,d)=>s+d.simet,0);
  // Last dose: search ALL entries (not just the period) for the most recent simeticona
  const lastSimetEntry=entries.filter(e=>e.type==="medicine"&&e.name&&/simet/i.test(e.name)).sort((a,b)=>`${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`))[0];
  const lastSimetAgo=lastSimetEntry?timeSince(lastSimetEntry.date,lastSimetEntry.time):null;
  // Subtitle for averages: tells user what's actually being averaged
  const avgSubtitle=usingFallback
    ?(_lang==="en"?"Today only · still in progress":"Apenas hoje · ainda em curso")
    :(_lang==="en"?`Last ${numComplete} complete day${numComplete>1?"s":""}`:`Últimos ${numComplete} ${numComplete>1?"dias completos":"dia completo"}`);
  const exportCSV=()=>{const h="Data,Hora,Tipo,Detalhe,Notas\n";const rows=entries.map(e=>{let d="";if(e.ml)d=`${e.ml}ml`;else if(e.durationMin)d=fmtDur(e.durationMin);else if(e.name)d=e.name;else if(e.value)d=`${e.value}°C`;else if(e.subtype)d=e.subtype;return`${e.date},${e.time},${TL(e.type)||e.type},${d},${e.notes||""}`}).join("\n");const blob=new Blob([h+rows],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`louise-pro-${todayStr()}.csv`;a.click();URL.revokeObjectURL(url)};
  const TrendBadge=({val})=>val===0?null:<div style={{display:"flex",alignItems:"center",gap:3,marginTop:4}}><Icon name={val>0?"arrowUp":"arrowDown"} size={10} color={val>0?T.green:T.orange}/><span style={{fontSize:T.fXS,fontWeight:600,color:val>0?T.green:T.orange}}>{val>0?"+":""}{val}%</span><span style={{fontSize:T.fXS,color:T.dim}}>vs {_lang==="en"?"prev":"ant"}</span></div>;
  // v11.9.108: boletim da semana (1 frase). Sem useMemo de propósito — StatsPage é memo e
  // lê _lang (global), então useMemo[entries] congelaria o idioma; recalcular é barato.
  const headline=weeklyHeadline(entries,_lang);
  // Empty state: no entries recorded yet (first install, nothing logged). v11.0.
  if(entries.length===0){
    return(<div style={{padding:"calc(16px + env(safe-area-inset-top)) 20px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h2 style={{fontSize:T.fXL,fontWeight:700,margin:0}}>{L("summary")}</h2>
      </div>
      <div style={{padding:"60px 24px 20px",textAlign:"center"}}>
        <div style={{width:58,height:58,borderRadius:18,background:"rgba(139,124,246,0.08)",border:"1px solid rgba(139,124,246,0.15)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16,color:"rgba(196,181,253,0.5)"}}><Icon name="chart" size={26} color="rgba(196,181,253,0.5)"/></div>
        <div style={{fontSize:T.fLG,fontWeight:700,color:T.heading,letterSpacing:-0.2,marginBottom:6}}>{_lang==="en"?"Not enough data yet":"Sem dados suficientes"}</div>
        <div style={{fontSize:T.fMD,color:T.sub,lineHeight:1.55,maxWidth:260,margin:"0 auto"}}>{_lang==="en"?"Log some events over a few days and patterns will appear here — averages, trends, growth curves.":"Registre alguns eventos nos próximos dias e os padrões aparecem aqui — médias, tendências, curvas de crescimento."}</div>
      </div>
    </div>);
  }
  return(<div style={{padding:"calc(16px + env(safe-area-inset-top)) 20px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <h2 style={{fontSize:T.fXL,fontWeight:700,margin:0}}>{L("summary")}</h2>
      <div style={{display:"flex",gap:6}}>
        {onBehavior&&<button onClick={onBehavior} aria-label={_lang==="en"?"Behavior trends":"Comportamento"} style={{display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:8,background:"rgba(139,124,246,0.1)",border:"1px solid rgba(139,124,246,0.22)"}}><Icon name="chart" size={14} color={T.lilac}/></button>}
        <button onClick={onGrowth} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",borderRadius:8,background:"rgba(163,230,53,0.08)",border:"1px solid rgba(163,230,53,0.12)",fontSize:T.fSM,fontWeight:600,color:"#a3e635"}}><Icon name="ruler" size={12} color="#a3e635"/>{L("growth")}</button>
        <button onClick={exportCSV} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",borderRadius:8,background:"rgba(22,28,60,0.6)",border:`1px solid ${T.gB}`,fontSize:T.fSM,fontWeight:600,color:T.sub}}>CSV</button>
      </div>
    </div>
    {headline&&<div style={{display:"flex",gap:11,alignItems:"center",padding:"13px 15px",borderRadius:16,marginBottom:10,background:"linear-gradient(180deg,rgba(139,124,246,0.12),rgba(139,124,246,0.045))",border:`1px solid ${T.accent}28`}}>
      <div style={{flexShrink:0,width:34,height:34,borderRadius:11,background:headline.tone==="up"?"rgba(163,230,53,0.14)":headline.tone==="down"?"rgba(251,146,60,0.14)":"rgba(139,124,246,0.14)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Icon name={headline.icon} size={17} color={headline.tone==="up"?T.green:headline.tone==="down"?T.orange:T.lilac}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:T.fXS,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:T.lilac,marginBottom:2}}>{_lang==="en"?"This week":"Esta semana"}</div>
        <div style={{fontSize:T.fMD,fontWeight:600,color:T.heading,lineHeight:1.4}}>{headline.text}</div>
      </div>
    </div>}
    <div style={{background:"rgba(22,28,60,0.4)",borderRadius:14,border:`1px solid ${T.gB}`,padding:4,marginBottom:6}}>
      {/* v11.9.25: "all" virou "90d" — label honesto. subEntries usa janela de 90d, "Tudo"
          era misleading. Pra histórico mais antigo (futuro), re-adicionar lazy load. */}
      {[{v:7,l:"7d"},{v:14,l:"14d"},{v:30,l:"30d"},{v:"all",l:"90d"}].map(p=>
        <button key={p.v} aria-label={`${_lang==="en"?"Show period":"Mostrar período"} ${p.l}`} aria-pressed={period===p.v} onClick={()=>setPeriod(p.v)} style={{width:"25%",padding:"8px 0",borderRadius:10,fontSize:T.fMD,fontWeight:700,background:period===p.v?T.accent:"transparent",color:period===p.v?"#fff":T.sub}}>{p.l}</button>
      )}
    </div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:14,fontSize:T.fXS,color:T.dim,fontWeight:500}}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <span>{avgSubtitle}</span>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:10,marginBottom:12}}>
      <div style={{background:`${T.green}08`,borderRadius:14,border:`1px solid ${T.green}0a`,padding:12}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><Icon name="bottle" size={14} color={T.green}/><span style={{fontSize:T.fXS,color:T.sub}}>{_lang==="en"?"Avg milk/day":"Média leite/dia"}</span></div><div style={{fontSize:T.f2XL,fontWeight:800,color:T.green}}>{avgMl>=1000?fmtMl(avgMl):<>{avgMl} <span style={{fontSize:T.fMD,opacity:0.6}}>ml</span></>}</div><TrendBadge val={trendMl}/></div>
      <div style={{background:`${T.purple}08`,borderRadius:14,border:`1px solid ${T.purple}0a`,padding:12}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><Icon name="bed" size={14} color={T.purple}/><span style={{fontSize:T.fXS,color:T.sub}}>{_lang==="en"?"Real sleep/day":"Sono real/dia"}</span></div>
        <div style={{fontSize:T.f2XL,fontWeight:800,color:T.purple}}>{fmtDur(avgSl)}</div>
        <TrendBadge val={trendSl}/>
        {avgAwake>0&&<div style={{marginTop:8,paddingTop:6,borderTop:`1px solid ${T.purple}15`,display:"flex",flexDirection:"column",gap:3}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><span style={{fontSize:T.fXS,color:T.dim}}>{_lang==="en"?"In bed":"Na cama"}</span><span style={{fontSize:T.fSM,fontWeight:600,color:T.sub,fontVariantNumeric:"tabular-nums"}}>{fmtDur(avgBed)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><span style={{fontSize:T.fXS,color:T.dim}}>{_lang==="en"?"Awake":"Acordada"}</span><span style={{fontSize:T.fSM,fontWeight:600,color:"#60a5fa",fontVariantNumeric:"tabular-nums"}}>{fmtDur(avgAwake)}{avgWakings>0?` · ${avgWakings}x`:""}</span></div>
        </div>}
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)",gap:8,marginBottom:16}}>
      <div style={{background:"rgba(20,26,60,0.5)",borderRadius:20,border:`1px solid ${T.gBSoft}`,padding:"14px 8px 12px",textAlign:"center",boxShadow:T.insetTop}}>
        <div style={{fontSize:T.fXS,color:T.label,letterSpacing:-0.05,marginBottom:6,fontWeight:600}}>{_lang==="en"?"Diapers/day":"Fraldas/dia"}</div>
        <div style={{fontSize:T.f2XL,fontWeight:800,color:T.pink,letterSpacing:-0.8,fontVariantNumeric:"tabular-nums",lineHeight:1}}>{avgDiapers}</div>
        <div style={{fontSize:T.fXS,color:T.dim,marginTop:5,fontVariantNumeric:"tabular-nums",letterSpacing:0.2}}>💧 {avgWet} · 💩 {avgPoop}</div>
      </div>
      <div style={{background:"rgba(20,26,60,0.5)",borderRadius:20,border:`1px solid ${T.gBSoft}`,padding:"14px 8px 12px",textAlign:"center",boxShadow:T.insetTop}}>
        <div style={{fontSize:T.fXS,color:T.label,letterSpacing:-0.05,marginBottom:6,fontWeight:600}}>{_lang==="en"?"Feeds/day":"Mamadas/dia"}</div>
        <div style={{fontSize:T.f2XL,fontWeight:800,color:T.blue,letterSpacing:-0.8,fontVariantNumeric:"tabular-nums",lineHeight:1}}>{avgFeedings}</div>
        {/* v11.9.20: ml/feed médio + intervalo */}
        <div style={{fontSize:T.fXS,color:T.dim,marginTop:5,fontVariantNumeric:"tabular-nums",letterSpacing:0.2}}>{avgFeedings>0&&avgMl>0?`${Math.round(avgMl/avgFeedings)}ml · ~${Math.round(24/avgFeedings*10)/10}h`:(avgFeedings>0?`~${Math.round(24/avgFeedings*10)/10}h`:"")}</div>
      </div>
      <div style={{background:"rgba(20,26,60,0.5)",borderRadius:20,border:`1px solid ${T.gBSoft}`,padding:"14px 8px 12px",textAlign:"center",boxShadow:T.insetTop}}>
        <div style={{fontSize:T.fXS,color:T.label,letterSpacing:-0.05,marginBottom:6,fontWeight:600}}>{_lang==="en"?"Naps/day":"Sonecas/dia"}</div>
        <div style={{fontSize:T.f2XL,fontWeight:800,color:T.accent,letterSpacing:-0.8,fontVariantNumeric:"tabular-nums",lineHeight:1}}>{avgNaps}</div>
        <div style={{fontSize:T.fXS,color:T.dim,marginTop:5,fontVariantNumeric:"tabular-nums",letterSpacing:0.2}}>{avgNapDur>0?`~${fmtDur(avgNapDur)}${_lang==="en"?"/nap":"/soneca"}`:""}</div>
      </div>
    </div>
    {[{t:_lang==="en"?"Milk (ml)":"Leite (ml)",f:"ml",max:mxMl,c:T.green,stacked:false},{t:_lang==="en"?"Sleep · real + awake":"Sono · real + acordada",f:"sl",max:mxSl,c:T.purple,stacked:true},{t:_lang==="en"?"Naps duration":"Sonecas — duração",f:"napTotalMin",max:Math.max(...data.map(d=>d.napTotalMin),1),c:T.accent,stacked:false,fmt:"dur"},{t:_lang==="en"?"Poop/day":"Cocô/dia",f:"poopCount",max:mxPoop,c:"#a16b4a",stacked:false}].map(ch=>(
      <div key={ch.f} style={{marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontSize:T.fMD,fontWeight:600,color:T.sub}}>{ch.t}</span>
          {ch.stacked&&avgAwake>0&&<div style={{display:"flex",gap:10}}>
            <span style={{display:"flex",alignItems:"center",gap:4,fontSize:T.fXS,color:T.sub,fontWeight:600}}><span style={{width:8,height:8,borderRadius:2,background:`linear-gradient(180deg,${T.purple},#7c3aed)`}}/>{_lang==="en"?"Real":"Real"}</span>
            <span style={{display:"flex",alignItems:"center",gap:4,fontSize:T.fXS,color:T.sub,fontWeight:600}}><span style={{width:8,height:8,borderRadius:2,background:"rgba(96,165,250,0.6)",border:"1px solid #60a5fa"}}/>{_lang==="en"?"Awake":"Acordada"}</span>
          </div>}
        </div>
        <div style={{display:"flex",gap:numDays>20?1:numDays>14?2:5,alignItems:"flex-end",height:100,background:"rgba(22,28,60,0.4)",borderRadius:14,padding:"12px 4px 6px",border:`1px solid ${T.gB}`,overflow:"visible",position:"relative"}}>
          {data.map(d=>{
            if(ch.stacked){
              const v=d.sl;const aw=d.slAwake;const total=v+aw;
              const totalPct=Math.max((total/ch.max)*65,2);
              const realPct=total>0?(v/total)*totalPct:totalPct;
              const awakePct=total>0?(aw/total)*totalPct:0;
              const k=ch.f+":"+d.date;const sel=selBar===k;
              return<div key={d.date} onClick={()=>tapBar(k)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:0,position:"relative",cursor:"pointer"}}>
                {sel&&dayPill(d,v>0?fmtDur(v):"0m")}
                {numDays<=14&&<span style={{fontSize:T.fSM,color:T.sub,fontWeight:600}}>{v>0?fmtDur(v):""}</span>}
                <div style={{width:"85%",maxWidth:numDays>20?8:20,height:totalPct,borderRadius:numDays>20?2:5,overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",background:T.bg3,opacity:sel?1:(d.isToday?1:0.7),transition:"height .5s",boxShadow:sel?`0 0 9px ${T.purple}`:"none"}}>
                  {aw>0&&<div style={{height:awakePct,background:"rgba(96,165,250,0.55)",borderBottom:"1px solid #60a5fa"}}/>}
                  <div style={{height:realPct,background:v>0?`linear-gradient(180deg,${T.purple},#7c3aed)`:T.bg3,borderRadius:numDays>20?"2px 2px 0 0":"5px 5px 0 0"}}/>
                </div>
                {numDays<=14&&<span style={{fontSize:T.fXS,color:d.isToday?T.accent:T.dim,fontWeight:d.isToday?700:400}}>{d.isToday?(_lang==="en"?"Today":"Hoje"):d.label}</span>}
              </div>
            }else{
              const v=d[ch.f];const k=ch.f+":"+d.date;const sel=selBar===k;return<div key={d.date} onClick={()=>tapBar(k)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:0,position:"relative",cursor:"pointer"}}>
                {sel&&dayPill(d,ch.fmt==="dur"?(v>0?fmtDur(v):"0m"):String(v))}
                {numDays<=14&&<span style={{fontSize:T.fSM,color:T.sub,fontWeight:600}}>{v>0?(ch.fmt==="dur"?fmtDur(v):v):""}</span>}
                <div style={{width:"85%",maxWidth:numDays>20?8:20,height:Math.max((v/ch.max)*65,2),borderRadius:numDays>20?2:5,background:v>0?ch.c:T.bg3,transition:"height .5s",opacity:sel?1:(d.isToday?1:0.7),boxShadow:sel?`0 0 9px ${ch.c}`:"none"}}/>
                {numDays<=14&&<span style={{fontSize:T.fXS,color:d.isToday?T.accent:T.dim,fontWeight:d.isToday?700:400}}>{d.isToday?(_lang==="en"?"Today":"Hoje"):d.label}</span>}
              </div>
            }
          })}
        </div>
        {numDays>14&&<div style={{display:"flex",justifyContent:"space-between",padding:"4px 4px 0",fontSize:T.fXS,color:T.dim}}><span>{data[0]?.label}</span><span>{data[Math.floor(data.length/2)]?.label}</span><span>{data[data.length-1]?.label}</span></div>}
      </div>
    ))}

    {/* ── SIMETICONA CARD ── doses/day bar chart + header stats */}
    <div style={{marginBottom:22,padding:"14px 14px 12px",background:"rgba(22,28,60,0.4)",borderRadius:14,border:`1px solid ${T.gB}`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:9,background:`${T.amber}1a`,border:`1px solid ${T.amber}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="pill" size={14} color={T.amber}/>
          </div>
          <div>
            <div style={{fontSize:T.fMD,fontWeight:700,color:T.text}}>Simeticona</div>
            <div style={{fontSize:T.fXS,color:T.dim,marginTop:1}}>{_lang==="en"?"Doses per day":"Doses por dia"}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:T.fXS,color:T.dim,textTransform:"uppercase",letterSpacing:0.5}}>{_lang==="en"?"Avg/day":"Méd/dia"}</div>
            <div style={{fontSize:T.fXL,fontWeight:800,color:T.amber,fontVariantNumeric:"tabular-nums"}}>{avgSimet}</div>
          </div>
          {lastSimetEntry&&<div style={{textAlign:"right",borderLeft:`1px solid ${T.gB}`,paddingLeft:14}}>
            <div style={{fontSize:T.fXS,color:T.dim,textTransform:"uppercase",letterSpacing:0.5}}>{_lang==="en"?"Last dose":"Última"}</div>
            <div style={{fontSize:T.fMD,fontWeight:700,color:T.text,fontVariantNumeric:"tabular-nums"}}>{lastSimetEntry.time}</div>
            <div style={{fontSize:T.fXS,color:T.sub}}>{lastSimetAgo}</div>
          </div>}
        </div>
      </div>
      {totalSimetInPeriod===0?(
        <div style={{padding:"24px 12px",textAlign:"center",fontSize:T.fSM,color:T.dim,fontStyle:"italic"}}>
          {_lang==="en"?"No Simeticona doses in this period":"Nenhuma dose de Simeticona neste período"}
        </div>
      ):(
        <>
          <div style={{display:"flex",gap:numDays>20?1:numDays>14?2:5,alignItems:"flex-end",height:100,background:"rgba(14,18,48,0.5)",borderRadius:10,padding:"14px 4px 6px",border:`1px solid ${T.gB}`,position:"relative"}}>
            {data.map(d=>{
              const v=d.simet;const k="simet:"+d.date;const sel=selBar===k;
              return<div key={d.date} onClick={()=>tapBar(k)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:0,position:"relative",cursor:"pointer"}}>
                {sel&&dayPill(d,String(v))}
                {numDays<=14&&<span style={{fontSize:T.fXS,color:T.sub,fontWeight:600}}>{v>0?v:""}</span>}
                <div style={{width:"85%",maxWidth:numDays>20?8:18,height:Math.max((v/mxSimet)*50,2),borderRadius:numDays>20?2:5,background:v>0?`linear-gradient(180deg,${T.amber},#d97706)`:T.bg3,transition:"height .5s",opacity:sel?1:(d.isToday?1:0.75),boxShadow:v>0?`0 0 8px ${T.amber}33`:"none"}}/>
                {numDays<=14&&<span style={{fontSize:T.fXS,color:d.isToday?T.accent:T.dim,fontWeight:d.isToday?700:400}}>{d.isToday?(_lang==="en"?"Today":"Hoje"):d.label}</span>}
              </div>
            })}
          </div>
          {numDays>14&&<div style={{display:"flex",justifyContent:"space-between",padding:"4px 4px 0",fontSize:T.fXS,color:T.dim}}><span>{data[0]?.label}</span><span>{data[Math.floor(data.length/2)]?.label}</span><span>{data[data.length-1]?.label}</span></div>}
        </>
      )}
    </div>

    {/* ─────────────────────────────────────────────
        v11.9.4 RELATÓRIO SEMANAL (4 semanas)
        Agregação Mon-Sun de cada semana com tendências.
        ─────────────────────────────────────────────*/}
    {(()=>{try{
      const buckets=[];
      for(let w=3;w>=0;w--){
        const startD=new Date();startD.setDate(startD.getDate()-(w*7)-6);
        const endD=new Date();endD.setDate(endD.getDate()-(w*7));
        const wDates=[];
        for(let i=0;i<7;i++){const d=new Date(startD);d.setDate(d.getDate()+i);wDates.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`)}
        const wSet=new Set(wDates);
        const wEntries=entries.filter(e=>wSet.has(e.date));
        const sleepsMain=wEntries.filter(e=>e.type==="sleep"&&e.durationMin&&!(e.id||"").endsWith("_b"));
        const napsRawW=wEntries.filter(e=>e.type==="nap"&&e.durationMin&&!(e.id||"").endsWith("_b"));
        const bottlesW=wEntries.filter(e=>e.type==="bottle");
        const diapersW=wEntries.filter(e=>e.type==="diaper");
        const simetW=wEntries.filter(e=>e.type==="medicine"&&e.name&&/simet/i.test(e.name));
        const daysWithData=new Set(wEntries.map(e=>e.date)).size||1;
        const nightsCount=sleepsMain.length||1;
        // v11.9.20 fix: merge halves cross-midnight ANTES de somar.
        // Antes só contava pré-meia-noite (`_b` filtrado), perdendo o resto da noite.
        // Mesma lógica do engine v11.7.9. Sibling pode estar em entries fora do bucket
        // (next-day quando noite cruza fronteira de semana).
        const mergeSleep=(e)=>{
          const sibling=entries.find(x=>x&&x.id===e.id+"_b");
          if(!sibling)return{dur:e.durationMin||0,wakings:e.wakings||[]};
          return{
            dur:(e.durationMin||0)+(sibling.durationMin||0),
            wakings:(e.wakings||[]).concat(sibling.wakings||[])
          };
        };
        const mergedSleeps=sleepsMain.map(mergeSleep);
        const totalSleepMin=mergedSleeps.reduce((s,m)=>{
          const awake=m.wakings.reduce((a,w)=>a+(w.durationMin||0),0);
          return s+Math.max(0,m.dur-awake);
        },0);
        const totalAwakeMin=mergedSleeps.reduce((s,m)=>s+m.wakings.reduce((a,w)=>a+(w.durationMin||0),0),0);
        const totalWakings=mergedSleeps.reduce((s,m)=>s+m.wakings.length,0);
        // Naps: same merge mas raro cruzar meia-noite. napsW expandido pra incluir merged.
        const napsMerged=napsRawW.map(mergeSleep);
        const napsW=napsRawW; // mantido pra count
        const napTotalMin=napsMerged.reduce((s,m)=>s+m.dur,0);
        buckets.push({
          weekIdx:4-w,
          isCurrent:w===0,
          shortLabel:w===0?(_lang==="en"?"This":"Atual"):`S${4-w}`,
          range:`${startD.getDate()}/${startD.getMonth()+1}–${endD.getDate()}/${endD.getMonth()+1}`,
          daysWithData,
          avgSleep:Math.round(totalSleepMin/nightsCount),
          avgAwake:Math.round(totalAwakeMin/nightsCount),
          avgWakings:Math.round((totalWakings/nightsCount)*10)/10,
          avgNapMin:Math.round(napTotalMin/daysWithData),
          avgNapCount:Math.round((napsW.length/daysWithData)*10)/10,
          avgNapDur:napsW.length?Math.round(napTotalMin/napsW.length):0,
          avgNapLong:napsMerged.length?Math.round(Math.max(...napsMerged.map(m=>m.dur))):0,
          avgMl:Math.round(bottlesW.reduce((s,e)=>s+(e.ml||0),0)/daysWithData),
          avgFeeds:Math.round((bottlesW.length/daysWithData)*10)/10,
          avgDiapers:Math.round((diapersW.length/daysWithData)*10)/10,
          avgPoop:Math.round((diapersW.filter(e=>e.subtype==="dirty"||e.subtype==="both").length/daysWithData)*10)/10,
          avgWet:Math.round((diapersW.filter(e=>e.subtype==="wet"||e.subtype==="both").length/daysWithData)*10)/10,
          totalSimet:simetW.length,
        });
      }
      // Filtra semanas sem dado pra não poluir
      const validBuckets=buckets.filter(b=>b.daysWithData>=1);
      if(validBuckets.length<2)return null;
      const cur=validBuckets[validBuckets.length-1];
      const prev=validBuckets[validBuckets.length-2];
      const pctDiff=(curV,prevV)=>{if(!prevV)return 0;return Math.round(((curV-prevV)/prevV)*100)};
      const Trend=({val,inverse})=>{if(!val||Math.abs(val)<3)return<span style={{fontSize:T.fXS,color:T.dim,fontWeight:600,marginLeft:4}}>≈</span>;const good=inverse?val<0:val>0;return<span style={{display:"inline-flex",alignItems:"center",gap:2,fontSize:T.fXS,fontWeight:700,padding:"1px 5px",borderRadius:5,marginLeft:5,background:good?"rgba(74,222,128,0.1)":"rgba(248,113,113,0.1)",color:good?T.green:"#fca5a5",fontVariantNumeric:"tabular-nums"}}>{val>0?"↑":"↓"} {Math.abs(val)}%</span>};
      const sectionH=({icon,label,col})=><div style={{display:"flex",alignItems:"center",gap:7,margin:"14px 4px 8px",fontSize:T.fSM,color:T.dim,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}><Icon name={icon} size={12} color={col}/>{label}</div>;
      // Mini bar chart helper
      const miniBar=(values,col,fmt)=>{
        const mx=Math.max(...values,1);
        return(<><div style={{display:"flex",alignItems:"flex-end",gap:5,height:48,marginTop:8,padding:"0 2px",position:"relative"}}>
          {values.map((v,i)=><div key={i} style={{flex:1,position:"relative"}}>
            <span style={{position:"absolute",bottom:`calc(${Math.max((v/mx)*100,4)}% + 2px)`,left:"50%",transform:"translateX(-50%)",fontSize:T.fXS,fontWeight:700,color:T.sub,fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",opacity:0.85}}>{v>0?(fmt==="dur"?fmtDur(v).replace(" ",""):v):""}</span>
            <div style={{height:`${Math.max((v/mx)*100,4)}%`,background:`linear-gradient(180deg,${col},${col}30)`,borderRadius:"3px 3px 0 0",opacity:i===values.length-1?1:0.55}}/>
          </div>)}
        </div>
        <div style={{display:"flex",gap:5,marginTop:4,padding:"0 2px"}}>
          {validBuckets.map((b,i)=><span key={i} style={{flex:1,textAlign:"center",fontSize:T.fXS,color:i===validBuckets.length-1?T.accent:T.dim,fontWeight:700,letterSpacing:0.4}}>{b.shortLabel}</span>)}
        </div></>);
      };
      const cardStyle={background:"linear-gradient(180deg,rgba(22,28,60,0.6),rgba(20,26,60,0.45))",border:`1px solid ${T.gBSoft}`,borderRadius:14,padding:"12px 14px 12px",marginBottom:8,boxShadow:T.insetTop};
      const topRow=(ic,col,lab,val,trend)=><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <div style={{width:24,height:24,borderRadius:8,background:`${col}1a`,border:`1px solid ${col}33`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={ic} size={12} color={col}/></div>
        <span style={{fontSize:T.fSM,color:T.dim,textTransform:"uppercase",letterSpacing:0.4,fontWeight:700}}>{lab}</span>
        <span style={{marginLeft:"auto",fontSize:T.fLG,fontWeight:800,color:col,fontVariantNumeric:"tabular-nums",letterSpacing:-0.2}}>{val}{trend}</span>
      </div>;
      const subRow=(k,v)=><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",fontSize:T.fSM,color:T.sub,fontVariantNumeric:"tabular-nums",marginTop:3}}><span style={{fontWeight:600}}>{k}</span><span style={{fontWeight:700,color:T.text}}>{v}</span></div>;
      // v11.9.21: gera texto compartilhável da semana atual.
      const buildShareText=()=>{
        const lines=[];
        lines.push(_lang==="en"?`Louise · this week (${cur.range})`:`Louise · esta semana (${cur.range})`);
        lines.push("");
        if(cur.avgSleep>0)lines.push(`🌙 ${_lang==="en"?"Sleep":"Sono"}: ${fmtDur(cur.avgSleep)}/${_lang==="en"?"night":"noite"}${cur.avgWakings>0?` · ${cur.avgWakings} ${_lang==="en"?"wakings":"despertares"}`:""}`);
        if(cur.avgNapDur>0)lines.push(`☁️ ${_lang==="en"?"Naps":"Sonecas"}: ${fmtDur(cur.avgNapDur)} × ${cur.avgNapCount}/${_lang==="en"?"day":"dia"} (${fmtDur(cur.avgNapMin)} ${_lang==="en"?"total":"total"})`);
        if(cur.avgMl>0)lines.push(`🍼 ${_lang==="en"?"Bottles":"Mamadeiras"}: ${fmtMl(cur.avgMl)}/${_lang==="en"?"day":"dia"} (${fmtMl(Math.round(cur.avgMl/Math.max(1,cur.avgFeeds)))} × ${cur.avgFeeds}/${_lang==="en"?"day":"dia"})`);
        if(cur.avgDiapers>0)lines.push(`🧷 ${_lang==="en"?"Diapers":"Fraldas"}: ${cur.avgDiapers}/${_lang==="en"?"day":"dia"} (💧${cur.avgWet} 💩${cur.avgPoop})`);
        if(cur.totalSimet>0)lines.push(`💊 ${_lang==="en"?"Simethicone":"Simeticona"}: ${cur.totalSimet}x`);
        return lines.join("\n");
      };
      const onShare=async()=>{
        const text=buildShareText();
        const title=_lang==="en"?"Louise weekly":"Louise · semana";
        try{
          if(navigator.share){
            await navigator.share({title,text});
            Haptic.success();
            return;
          }
        }catch(_){/* user cancelled or unsupported */}
        try{
          await navigator.clipboard.writeText(text);
          alert(_lang==="en"?"Copied to clipboard":"Copiado pra área de transferência");
        }catch(_){alert(_lang==="en"?"Couldn't copy — please screenshot":"Não consegui copiar — tira print")}
      };
      return(<div style={{marginTop:24,marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 4px 4px",borderTop:`1px solid ${T.gBSoft}`,paddingTop:18}}>
          <h2 style={{fontSize:T.fLG,fontWeight:800,margin:0,letterSpacing:-0.3}}>{_lang==="en"?"Weekly report":"Relatório semanal"}</h2>
          <span style={{fontSize:T.fSM,color:T.dim,fontWeight:600,letterSpacing:0.3}}>{validBuckets.length} {_lang==="en"?"weeks":"semanas"}</span>
          <button aria-label={_lang==="en"?"Share this week":"Compartilhar semana"} onClick={onShare} style={{marginLeft:"auto",width:32,height:32,borderRadius:10,background:"rgba(139,124,246,0.12)",border:"1px solid rgba(139,124,246,0.28)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="share" size={14} color={T.accent}/>
          </button>
        </div>
        <div style={{fontSize:T.fSM,color:T.dim,padding:"0 4px 12px"}}>{_lang==="en"?"Average per day, weekly buckets":"Média por dia, fechado por semana"} · {cur.range}</div>

        {sectionH({icon:"bed",label:_lang==="en"?"Sleep":"Sono",col:T.purple})}
        <div style={cardStyle}>
          {topRow("bed",T.purple,_lang==="en"?"Real sleep/night":"Sono real/noite",fmtDur(cur.avgSleep),<Trend val={pctDiff(cur.avgSleep,prev.avgSleep)}/>)}
          {miniBar(validBuckets.map(b=>b.avgSleep),T.purple,"dur")}
          {cur.avgAwake>0&&subRow(_lang==="en"?"Awake (window)":"Acordada (janela)",fmtDur(cur.avgAwake))}
          {cur.avgWakings>0&&subRow(_lang==="en"?"Wakings/night":"Despertares/noite",`${cur.avgWakings}`)}
        </div>

        {sectionH({icon:"cloud",label:_lang==="en"?"Naps":"Sonecas",col:T.accent})}
        <div style={cardStyle}>
          {/* v11.9.5: metrica principal vira tempo medio POR SONECA (nao por dia). */}
          {topRow("cloud",T.accent,_lang==="en"?"Avg per nap":"Por soneca (média)",cur.avgNapDur>0?fmtDur(cur.avgNapDur):"—",<Trend val={pctDiff(cur.avgNapDur,prev.avgNapDur)}/>)}
          {miniBar(validBuckets.map(b=>b.avgNapDur),T.accent,"dur")}
          {cur.avgNapCount>0&&subRow(_lang==="en"?"Naps/day":"Sonecas/dia",cur.avgNapCount)}
          {cur.avgNapMin>0&&subRow(_lang==="en"?"Total time/day":"Tempo total/dia",fmtDur(cur.avgNapMin))}
          {cur.avgNapLong>0&&subRow(_lang==="en"?"Longest nap":"Soneca mais longa",fmtDur(cur.avgNapLong))}
        </div>

        {sectionH({icon:"bottle",label:_lang==="en"?"Bottles":"Mamadeiras",col:T.green})}
        <div style={cardStyle}>
          {topRow("bottle",T.green,_lang==="en"?"Volume/day":"Volume/dia",fmtMl(cur.avgMl),<Trend val={pctDiff(cur.avgMl,prev.avgMl)}/>)}
          {miniBar(validBuckets.map(b=>b.avgMl),T.green)}
          {cur.avgFeeds>0&&subRow(_lang==="en"?"Feeds/day":"Mamadas/dia",cur.avgFeeds)}
          {cur.avgFeeds>0&&cur.avgMl>0&&subRow(_lang==="en"?"Avg per feed":"Por mamada (média)",fmtMl(Math.round(cur.avgMl/cur.avgFeeds)))}
        </div>

        {sectionH({icon:"diaper",label:_lang==="en"?"Diapers":"Fraldas",col:T.pink})}
        <div style={cardStyle}>
          {topRow("diaper",T.pink,_lang==="en"?"Diapers/day":"Fraldas/dia",cur.avgDiapers,<Trend val={pctDiff(cur.avgDiapers,prev.avgDiapers)}/>)}
          {miniBar(validBuckets.map(b=>b.avgDiapers),T.pink)}
          {cur.avgWet>0&&subRow(_lang==="en"?"💧 Wet/day":"💧 Xixi/dia",cur.avgWet)}
          {cur.avgPoop>0&&subRow(_lang==="en"?"💩 Poop/day":"💩 Cocô/dia",cur.avgPoop)}
        </div>

        {cur.totalSimet>0&&<>
          {sectionH({icon:"pill",label:_lang==="en"?"Medicines":"Medicamentos",col:T.amber})}
          <div style={cardStyle}>
            {topRow("pill",T.amber,_lang==="en"?"Simethicone/week":"Simeticona/semana",cur.totalSimet+"x",<Trend val={pctDiff(cur.totalSimet,prev.totalSimet)} inverse={true}/>)}
            {miniBar(validBuckets.map(b=>b.totalSimet),T.amber)}
          </div>
        </>}
      </div>);
    }catch(e){console.warn("[WeeklyReport] render error",e);return null}})()}
    {(()=>{
      // v11.9.109: Recordes de sono — conquistas auto-detectadas (não precisam registro).
      const rec=sleepRecords(entries);if(!rec)return null;
      const today=todayStr();
      const dlabel=d=>d?new Date(d+"T12:00").toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"short"}).replace(".",""):"";
      const isHot=d=>{if(!d)return false;const diff=(Date.parse(today)-Date.parse(d))/86400000;return diff>=0&&diff<=1.5};
      const wkLbl=n=>n===0?(_lang==="en"?"0 wake-ups":"0 despertares"):`${n} ${_lang==="en"?(n===1?"wake-up":"wake-ups"):(n===1?"despertar":"despertares")}`;
      const tiles=[
        rec.longestSleep&&{ic:"moon",col:T.lilac,lbl:_lang==="en"?"Most in a night":"Mais numa noite",val:fmtDur(rec.longestSleep.min),sub:dlabel(rec.longestSleep.date),hot:isHot(rec.longestSleep.date)},
        rec.longestNap&&{ic:"cloud",col:T.accent,lbl:_lang==="en"?"Longest nap":"Maior soneca",val:fmtDur(rec.longestNap.min),sub:dlabel(rec.longestNap.date),hot:isHot(rec.longestNap.date)},
        rec.bestNight&&{ic:"star",col:T.green,lbl:_lang==="en"?"Best night":"Melhor noite",val:wkLbl(rec.bestNight.wakings),sub:dlabel(rec.bestNight.date),hot:isHot(rec.bestNight.date)},
      ].filter(Boolean);
      if(!tiles.length)return null;
      const badgeLbl={h4:_lang==="en"?"4h straight":"4h emendadas",h6:_lang==="en"?"6h straight":"6h emendadas",w1:_lang==="en"?"≤1 waking":"≤1 despertar",through:_lang==="en"?"Slept through":"Noite completa"};
      return(<div style={{marginTop:16}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:9,padding:"0 2px"}}>
          <Icon name="moon" size={14} color={T.lilac}/>
          <span style={{fontSize:T.fSM,fontWeight:800,color:T.heading,letterSpacing:0.2,textTransform:"uppercase"}}>{_lang==="en"?"Sleep records":"Recordes de sono"}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${tiles.length},1fr)`,gap:8,marginBottom:10}}>
          {tiles.map((t,i)=><div key={i} style={{position:"relative",padding:"13px 8px",borderRadius:14,background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))",border:`1px solid ${t.hot?t.col+"66":T.gB}`,textAlign:"center",overflow:"hidden"}}>
            {t.hot&&<div style={{position:"absolute",top:6,right:6,fontSize:8,fontWeight:900,letterSpacing:0.5,color:T.bg1,background:t.col,borderRadius:5,padding:"1px 4px"}}>{_lang==="en"?"NEW":"NOVO"}</div>}
            <Icon name={t.ic} size={15} color={t.col}/>
            <div style={{fontSize:T.fLG,fontWeight:800,color:T.heading,marginTop:5,letterSpacing:-0.3,fontVariantNumeric:"tabular-nums"}}>{t.val}</div>
            <div style={{fontSize:T.fXS,color:T.sub,fontWeight:600,marginTop:2}}>{t.lbl}</div>
            {t.sub&&<div style={{fontSize:T.fXS,color:T.dim,marginTop:1}}>{t.sub}</div>}
          </div>)}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {rec.badges.map(b=><div key={b.key} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:20,background:b.date?"rgba(163,230,53,0.10)":"rgba(22,28,60,0.5)",border:`1px solid ${b.date?"rgba(163,230,53,0.28)":T.gB}`,opacity:b.date?1:0.5}}>
            <Icon name={b.date?"check":"moon"} size={10} color={b.date?T.green:T.dim}/>
            <span style={{fontSize:T.fXS,fontWeight:700,color:b.date?"#bef264":T.dim}}>{badgeLbl[b.key]}</span>
          </div>)}
        </div>
      </div>);
    })()}
  </div>);
});

// HistoryPage memoizado (v11.2) — mesmo motivo do StatsPage.
