const HistoryPage = React.memo(function HistoryPage({entries,onDelete,onEdit,activeTimer,lang}){
  const[dateIdx,setDateIdx]=useState(0);
  const[filter,setFilter]=useState("all");
  // v11.9.19: search no historico. searchOpen toggla a barra; query string filtra entries.
  const[searchOpen,setSearchOpen]=useState(false);
  const[searchQuery,setSearchQuery]=useState("");
  const searchActive=searchOpen&&searchQuery.trim().length>=1;
  const viewDate=dateOffset(todayStr(),-dateIdx);
  const dayE=entries.filter(e=>e.date===viewDate);
  const filtered=filter==="all"?dayE:dayE.filter(e=>{
    if(filter==="feed")return e.type==="bottle"||e.type==="nursing";
    if(filter==="sleep")return e.type==="sleep"||e.type==="nap"||e.type==="wakeup"||e.type==="nightwaking";
    return e.type===filter;
  });
  const dMl=dayE.filter(e=>e.type==="bottle").reduce((s,e)=>s+(e.ml||0),0);
  const dSl=sumRealSleep(dayE);
  // Diaper breakdown: both counts in BOTH wet and dirty (useful "how many had pee / how many had poop")
  const dDiapers=dayE.filter(e=>e.type==="diaper");
  const dWet=dDiapers.filter(e=>e.subtype==="wet"||e.subtype==="both").length;
  const dDirty=dDiapers.filter(e=>e.subtype==="dirty"||e.subtype==="both").length;
  // v11.9.15: header da data em History combina relativo + completo. Ex: "Ontem · 26 abril"
  const dLong=new Date(viewDate+"T12:00").toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"long"});
  const dRel=fmtRelDate(viewDate);
  const dLbl=dRel===dLong?dLong:`${dRel} · ${dLong}`;
  const isToday=dateIdx===0;
  // Note: live in-progress bedtime is NOT shown here. It only appears in Home.
  // History is reserved for finalized entries.
  const filters=[{v:"all",l:L("all"),c:T.accent},{v:"feed",l:L("milk"),c:T.green},{v:"sleep",l:L("sleepLabel"),c:T.purple},{v:"diaper",l:typeLabel("diaper",_lang),c:T.pink},{v:"medicine",l:_lang==="en"?"Meds":"Med.",c:T.amber}];
  // Specific type filters (feed/diaper/medicine) → flat chronological list, include
  // events inside bedtimes and tag them with a subtle "night" badge.
  // All/sleep → keep the bedtime grouping via SleepBlock (summary view).
  const isSpecificFilter=filter==="feed"||filter==="diaper"||filter==="medicine";
  const listItems=isSpecificFilter
    ?filtered.map(e=>{
      const bedtime=findContainingBedtime(e,entries);
      return<EntryRow key={e.id} entry={e} lang={lang} onDelete={onDelete} onEdit={onEdit} nightBadge={!!bedtime}/>;
    })
    :filtered.filter(e=>{
      if(e.nightWake)return false;
      // Only hide events contained in a bedtime if that bedtime is actually being rendered
      // on the current viewed day (as SleepBlock). Otherwise the event becomes an invisible
      // orphan — e.g. a night bottle during a bedtime that started the previous day. v10.4.5.
      const cb=findContainingBedtime(e,entries);
      if(cb){
        const renderedHere=cb.date===viewDate&&cb.wakings&&cb.wakings.length>0;
        if(renderedHere)return false;
      }
      return true;
    }).map(e=>(e.type==="sleep"&&e.wakings&&e.wakings.length>0)?<SleepBlock key={e.id} entry={e} lang={lang} onDelete={onDelete} onEdit={onEdit} entries={entries} activeTimer={activeTimer} onSaveTimer={FB.saveTimer} onSaveEntry={FB.addEntry}/>:<EntryRow key={e.id} entry={e} lang={lang} onDelete={onDelete} onEdit={onEdit}/>);
  // v11.9.19: search results agregados por dia, ordenados desc.
  const searchResults=searchActive?(()=>{
    const q=searchQuery.trim().toLowerCase();
    const matches=entries.filter(e=>{
      if(!e)return false;
      const t=(e.type||"").toLowerCase();
      const n=(e.name||"").toLowerCase();
      const d=(e.dose||"").toLowerCase();
      const sub=(e.subtype||"").toLowerCase();
      const notes=(e.notes||"").toLowerCase();
      const ml=e.ml?String(e.ml):"";
      const tLabel=(typeLabel(e.type,_lang)||"").toLowerCase();
      return t.includes(q)||n.includes(q)||d.includes(q)||sub.includes(q)||notes.includes(q)||ml.includes(q)||tLabel.includes(q);
    });
    // Group by date
    const byDate={};
    for(const e of matches){if(!byDate[e.date])byDate[e.date]=[];byDate[e.date].push(e)}
    return Object.keys(byDate).sort((a,b)=>b.localeCompare(a)).map(d=>({date:d,items:byDate[d].sort((a,b)=>(b.time||"").localeCompare(a.time||""))}));
  })():null;
  return(<div style={{padding:"calc(16px + env(safe-area-inset-top)) 20px 0"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <h2 style={{fontSize:T.fXL,fontWeight:700,margin:0}}>{L("history")}</h2>
      <button aria-label={searchOpen?(_lang==="en"?"Close search":"Fechar busca"):(_lang==="en"?"Search":"Buscar")} onClick={()=>{const v=!searchOpen;setSearchOpen(v);if(!v)setSearchQuery("")}} style={{width:34,height:34,borderRadius:11,background:searchOpen?"rgba(139,124,246,0.15)":"rgba(22,28,60,0.6)",border:`1px solid ${searchOpen?"rgba(139,124,246,0.32)":T.gBSoft}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Icon name={searchOpen?"x":"search"} size={15} color={searchOpen?T.accent:T.sub}/>
      </button>
    </div>
    {searchOpen&&<div style={{marginBottom:14}}>
      <div style={{position:"relative"}}>
        <input type="search" autoFocus inputMode="search" placeholder={_lang==="en"?"Search by name, type, ml, dose…":"Buscar por nome, tipo, ml, dose…"} value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{width:"100%",padding:"14px 40px 14px 16px",borderRadius:14,background:"rgba(20,26,60,0.55)",border:`1px solid ${searchActive?"rgba(139,124,246,0.4)":T.gBSoft}`,color:T.text,fontSize:T.fLG,fontWeight:500,outline:"none",WebkitAppearance:"none",appearance:"none",boxShadow:T.insetTop}}/>
        {searchQuery&&<button aria-label={_lang==="en"?"Clear":"Limpar"} onClick={()=>setSearchQuery("")} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:28,height:28,borderRadius:8,background:"rgba(14,18,48,0.6)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",color:T.dim}}><Icon name="x" size={12} color={T.dim}/></button>}
      </div>
      {searchActive&&<div style={{fontSize:T.fSM,color:T.dim,marginTop:8,padding:"0 4px",fontWeight:600,letterSpacing:0.2}}>{searchResults.reduce((s,g)=>s+g.items.length,0)} {_lang==="en"?"results across":"resultados em"} {searchResults.length} {_lang==="en"?"days":"dias"}</div>}
    </div>}
    {searchActive?(<div>
      {searchResults.length===0?<div style={{textAlign:"center",padding:"50px 20px",color:T.dim}}>
        <Icon name="search" size={28} color={T.dim}/>
        <div style={{fontSize:T.fMD,marginTop:10,fontWeight:600}}>{_lang==="en"?"No matches":"Nenhum resultado"}</div>
        <div style={{fontSize:T.fSM,color:T.dim,marginTop:4}}>{_lang==="en"?"Try a different term":"Tente um termo diferente"}</div>
      </div>:searchResults.map(g=>(<div key={g.date} style={{marginBottom:18}}>
        <div style={{fontSize:T.fSM,fontWeight:700,color:T.dim,letterSpacing:0.6,textTransform:"uppercase",marginBottom:8,padding:"0 4px"}}>{fmtRelDate(g.date)} <span style={{color:T.sub,fontWeight:500,letterSpacing:0,textTransform:"none",marginLeft:4}}>· {g.items.length} {_lang==="en"?(g.items.length===1?"item":"items"):(g.items.length===1?"item":"itens")}</span></div>
        {g.items.map(e=>(e.type==="sleep"&&e.wakings&&e.wakings.length>0)?<SleepBlock key={e.id} entry={e} lang={lang} onDelete={onDelete} onEdit={onEdit} entries={entries} activeTimer={activeTimer} onSaveTimer={FB.saveTimer} onSaveEntry={FB.addEntry}/>:<EntryRow key={e.id} entry={e} lang={lang} onDelete={onDelete} onEdit={onEdit}/>)}
      </div>))}
    </div>):(<>
    {/* Date navigator card */}
    <div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.4))",borderRadius:20,border:`1px solid ${T.gBSoft}`,padding:"18px 18px 16px",marginBottom:14,boxShadow:T.insetTop}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setDateIdx(dateIdx+1)} style={{width:38,height:38,borderRadius:12,background:"rgba(22,28,60,0.6)",border:`1px solid ${T.gBSoft}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:T.insetTop}}><Icon name="back" size={14} color={T.sub}/></button>
        <div style={{flex:1,textAlign:"center",position:"relative"}}>
          {/* v11.9.18: tap no header da data abre picker pra jump rápido */}
          <input type="date" value={viewDate} max={todayStr()} onChange={e=>{
            const v=e.target.value;if(!v)return;
            const a=new Date(todayStr()+"T12:00");const b=new Date(v+"T12:00");
            if(isNaN(b))return;
            const diff=Math.max(0,Math.round((a-b)/86400000));
            setDateIdx(diff);
          }} aria-label={_lang==="en"?"Jump to date":"Pular para data"} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",WebkitAppearance:"none",appearance:"none",border:"none",background:"transparent"}}/>
          {/* v11.9.36: chevron sutil revela que o header é tappable (date picker) */}
          <div style={{fontSize:T.fXL,fontWeight:800,color:isToday?T.accent:T.text,letterSpacing:-0.3,pointerEvents:"none",display:"inline-flex",alignItems:"center",gap:5}}>
            <span>{isToday?L("today"):dLbl}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{opacity:0.45}}><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:10,fontSize:T.fSM,color:T.sub,marginTop:7,flexWrap:"wrap",alignItems:"center"}}>
            {dMl>0&&<span style={{display:"inline-flex",alignItems:"center",gap:4,fontWeight:600,fontVariantNumeric:"tabular-nums"}}><Icon name="bottle" size={11} color={T.green}/>{dMl}ml</span>}
            {dSl>0&&<><span style={{width:3,height:3,borderRadius:"50%",background:T.dim}}/><span style={{display:"inline-flex",alignItems:"center",gap:4,fontWeight:600,fontVariantNumeric:"tabular-nums"}}><Icon name="bed" size={11} color={T.purple}/>{fmtDur(dSl)}</span></>}
            {(dWet>0||dDirty>0)&&<><span style={{width:3,height:3,borderRadius:"50%",background:T.dim}}/><span style={{display:"inline-flex",alignItems:"center",gap:4,color:"#93c5fd",fontWeight:600,fontVariantNumeric:"tabular-nums"}}><Icon name="droplet" size={11} color="#93c5fd"/>{dWet}</span><span style={{display:"inline-flex",alignItems:"center",gap:4,color:"#a16b4a",fontWeight:600,fontVariantNumeric:"tabular-nums"}}><Icon name="poop" size={11} color="#a16b4a"/>{dDirty}</span></>}
            <span style={{width:3,height:3,borderRadius:"50%",background:T.dim}}/>
            <span style={{fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{dayE.length} {L("reg")}</span>
          </div>
        </div>
        <button onClick={()=>setDateIdx(Math.max(0,dateIdx-1))} disabled={isToday} style={{width:38,height:38,borderRadius:12,background:"rgba(22,28,60,0.6)",border:`1px solid ${T.gBSoft}`,display:"flex",alignItems:"center",justifyContent:"center",opacity:isToday?0.3:1,boxShadow:T.insetTop}}><Icon name="forward" size={14} color={T.sub}/></button>
      </div>
    </div>
    {/* Type filters */}
    <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
      {filters.map(f=>{const isActive=filter===f.v;return<button key={f.v} onClick={()=>setFilter(f.v)} style={{padding:"9px 16px",borderRadius:12,fontSize:T.fMD,fontWeight:600,whiteSpace:"nowrap",letterSpacing:-0.1,background:isActive?`linear-gradient(180deg,${f.c}38,${f.c}12)`:"rgba(22,28,60,0.5)",color:isActive?f.c:T.sub,border:`1px solid ${isActive?f.c+"55":T.gBSoft}`,boxShadow:isActive?`0 1px 0 0 rgba(255,255,255,0.1) inset, 0 0 0 1px ${f.c}25, 0 6px 16px -8px ${f.c}50`:T.insetTop}}>{f.l}</button>})}
    </div>
    {filtered.length===0?(<div style={{padding:"48px 24px 20px",textAlign:"center"}}>
      <div style={{width:58,height:58,borderRadius:18,background:"rgba(139,124,246,0.08)",border:"1px solid rgba(139,124,246,0.15)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16,color:"rgba(196,181,253,0.5)"}}><Icon name="clock" size={26} color="rgba(196,181,253,0.5)"/></div>
      <div style={{fontSize:T.fLG,fontWeight:700,color:T.heading,letterSpacing:-0.2,marginBottom:6}}>{_lang==="en"?"No events this day":"Nenhum evento neste dia"}</div>
      <div style={{fontSize:T.fMD,color:T.sub,lineHeight:1.55,maxWidth:240,margin:"0 auto"}}>{filter!=="all"?(_lang==="en"?"Try changing the filter or switching to another day.":"Tente mudar o filtro ou ir para outro dia."):(_lang==="en"?"Tap + below to register the first.":"Toque + abaixo para registrar o primeiro.")}</div>
    </div>):listItems}
    </>)}
  </div>);
});

// ── GROWTH PAGE with WHO percentiles ──
// Helper: parse decimal string accepting both comma and dot (pt-BR friendly)
const parseGrowthDecimal=(s)=>{
  if(s===undefined||s===null)return undefined;
  const str=String(s).trim();
  if(!str)return undefined;
  const n=parseFloat(str.replace(",","."));
  return isNaN(n)?undefined:n;
};
// Helper: format number back to display with comma in pt
const formatGrowthVal=(v)=>{
  if(v===undefined||v===null||v==="")return "";
  const s=String(v);
  return _lang==="pt"?s.replace(".",","):s;
};

