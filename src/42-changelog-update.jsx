function ChangelogModal({onClose,lang}){
  // Render a bullet: detect highlight prefix "★ " and bold markers **text**
  const renderBullet=(text,idx)=>{
    const highlighted=text.startsWith("\u2605 ");
    const clean=highlighted?text.slice(2):text;
    // Parse **bold** segments
    const parts=[];
    let remaining=clean;
    let key=0;
    while(remaining.length>0){
      const boldStart=remaining.indexOf("**");
      if(boldStart===-1){parts.push(<span key={key++}>{remaining}</span>);break}
      if(boldStart>0)parts.push(<span key={key++}>{remaining.slice(0,boldStart)}</span>);
      const boldEnd=remaining.indexOf("**",boldStart+2);
      if(boldEnd===-1){parts.push(<span key={key++}>{remaining.slice(boldStart)}</span>);break}
      parts.push(<strong key={key++} style={{color:T.lilac,fontWeight:700}}>{remaining.slice(boldStart+2,boldEnd)}</strong>);
      remaining=remaining.slice(boldEnd+2);
    }
    return(<li key={idx} style={{fontSize:T.fMD,color:T.text,lineHeight:1.55,padding:"5px 0 5px 18px",position:"relative",listStyle:"none"}}>
      <span style={{position:"absolute",left:3,top:12,width:6,height:6,borderRadius:"50%",background:highlighted?T.green:T.purple,boxShadow:highlighted?`0 0 8px ${T.green}`:"none"}}/>
      {parts}
    </li>);
  };
  // Format date by language
  const fmtDate=(dateStr)=>{
    if(dateStr.includes("→"))return dateStr;
    const d=new Date(dateStr+"T12:00");
    if(lang==="en")return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
    return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"}).replace(".","");
  };
  return(<OverlayPortal><div role="dialog" aria-modal="true" style={{position:"fixed",inset:0,zIndex:300,pointerEvents:"auto",background:"rgba(7,11,30,0.75)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",display:"flex",alignItems:"stretch",justifyContent:"center",padding:"calc(14px + env(safe-area-inset-top)) 14px calc(14px + env(safe-area-inset-bottom))"}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:T.bg1,borderRadius:20,border:"1px solid rgba(139,124,246,0.25)",boxShadow:"0 20px 60px rgba(0,0,0,0.6)",display:"flex",flexDirection:"column",width:"100%",maxWidth:460,maxHeight:"100%",overflow:"hidden"}}>
      {/* Header */}
      <div style={{padding:"16px 18px",borderBottom:"1px solid rgba(139,124,246,0.12)",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(180deg,rgba(139,124,246,0.08),transparent)",flexShrink:0}}>
        <div style={{width:38,height:38,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,...T.iconTile(T.accent)}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:T.fXS,fontWeight:800,color:"rgba(139,124,246,0.7)",textTransform:"uppercase",letterSpacing:1}}>{lang==="en"?"What's new · Louise Pro":"Novidades · Louise Pro"}</div>
          <div style={{fontSize:T.fLG,fontWeight:800,marginTop:2,color:T.text}}>{lang==="en"?"Version history":"Histórico de versões"}</div>
        </div>
        <button onClick={onClose} style={{width:32,height:32,borderRadius:10,background:"rgba(90,100,180,0.1)",border:`1px solid ${T.gB}`,display:"flex",alignItems:"center",justifyContent:"center",color:T.sub,cursor:"pointer",fontSize:T.fLG,flexShrink:0}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      {/* Scroll */}
      <div style={{flex:1,overflowY:"auto",overscrollBehaviorY:"contain",WebkitOverflowScrolling:"touch",padding:"16px 18px 20px"}}>
        {CHANGELOG.map((entry,i)=>{
          const data=entry[lang]||entry.pt;
          const isCurrent=entry.v===APP_VERSION;
          return(<div key={entry.v} style={{paddingBottom:18,paddingTop:i>0?18:0,borderTop:i>0?"1px solid rgba(139,124,246,0.08)":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
              <span style={{fontSize:T.fLG,fontWeight:800,color:T.text,fontVariantNumeric:"tabular-nums"}}>{entry.v==="earlier"?(lang==="en"?"Earlier":"Anteriores"):`v${entry.v}`}</span>
              <span style={{fontSize:T.fSM,color:T.sub,fontWeight:500}}>{fmtDate(entry.date)}</span>
              {isCurrent&&<span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:8,background:"rgba(52,211,153,0.12)",color:T.green,fontSize:T.fXS,fontWeight:800,textTransform:"uppercase",letterSpacing:0.5,border:"1px solid rgba(52,211,153,0.25)"}}>{lang==="en"?"Current":"Atual"}</span>}
            </div>
            <ul style={{margin:0,padding:0}}>{data.bullets.map((b,j)=>renderBullet(b,j))}</ul>
          </div>);
        })}
      </div>
    </div>
  </div></OverlayPortal>);
}

function UpdateToast({fromVersion,toVersion,onView,onDismiss,lang}){
  return(<div style={{position:"fixed",top:"calc(14px + env(safe-area-inset-top))",left:14,right:14,maxWidth:460,margin:"0 auto",padding:"18px 20px",borderRadius:20,background:"linear-gradient(180deg,rgba(155,141,248,0.96),rgba(124,58,237,0.94))",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,0.18)",boxShadow:"0 1px 0 0 rgba(255,255,255,0.25) inset, 0 0 0 1px rgba(255,255,255,0.06), 0 16px 48px -8px rgba(139,124,246,0.5)",display:"flex",alignItems:"flex-start",gap:14,color:"#fff",zIndex:150,animation:"toastSlideDown .35s cubic-bezier(0.22,1,0.36,1)",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.12),transparent 60%)",pointerEvents:"none"}}/>
    <div style={{position:"relative",width:42,height:42,borderRadius:13,background:"linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0.12))",border:"1px solid rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 1px 0 0 rgba(255,255,255,0.3) inset"}}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <div style={{flex:1,minWidth:0,position:"relative"}}>
      <div style={{fontSize:T.fLG,fontWeight:800,marginBottom:3,letterSpacing:-0.3}}>{lang==="en"?"Louise Pro updated":"Louise Pro atualizada"}</div>
      <div style={{fontSize:T.fMD,opacity:0.92,lineHeight:1.55}}>{lang==="en"?`You're on v${toVersion}. Tap to see what's new.`:`Você está na v${toVersion}. Toque para ver as novidades.`}</div>
      <div style={{display:"flex",gap:10,marginTop:12}}>
        <button onClick={onView} style={{padding:"9px 16px",borderRadius:11,fontSize:T.fMD,fontWeight:800,background:"#fff",color:"#7c3aed",border:"none",cursor:"pointer",letterSpacing:-0.1,boxShadow:"0 1px 0 0 rgba(0,0,0,0.05) inset, 0 4px 12px -4px rgba(0,0,0,0.2)"}}>{lang==="en"?"See what's new":"Ver novidades"}</button>
        <button onClick={onDismiss} style={{padding:"9px 14px",borderRadius:11,fontSize:T.fMD,fontWeight:700,background:"rgba(255,255,255,0.2)",color:"#fff",border:"1px solid rgba(255,255,255,0.18)",cursor:"pointer",letterSpacing:-0.1,boxShadow:"0 1px 0 0 rgba(255,255,255,0.15) inset"}}>{lang==="en"?"Later":"Depois"}</button>
      </div>
    </div>
    <button onClick={onDismiss} style={{position:"relative",width:28,height:28,borderRadius:9,background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#fff",cursor:"pointer",boxShadow:"0 1px 0 0 rgba(255,255,255,0.15) inset"}}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>);
}

// StatsPage memoizado (v11.2) — re-render só quando entries/onGrowth mudarem,
// não a cada tick de 5s do App durante timer ativo.
