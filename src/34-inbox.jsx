function InboxPanel({inbox,onClose,onMarkRead,onMarkAllRead,lang,isRead}){
  // isRead agora é prop — leva em conta o state local (localStorage) + legacy `item.read` do Firestore.
  // v11.1.
  const readFn=isRead||(it=>it.read===true);
  const items=(inbox.items||[]).slice().sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
  const unreadCount=items.filter(it=>!readFn(it)).length;
  const todayLabel=new Date().toLocaleDateString(lang==="pt"?"pt-BR":"en-US",{weekday:"short",day:"numeric",month:"short"}).toUpperCase().replace(".","");
  const iconByType={good:"check",warn:"zap",info:"star",curiosity:"sun"};
  const colorByType={good:T.green,warn:T.orange,info:T.blue,curiosity:T.purple};
  const bgByType={good:T.greenS,warn:T.orangeS,info:`${T.blue}1a`,curiosity:`${T.purple}1a`};
  const fmtAgo=ts=>{
    if(!ts)return"";
    const diff=Math.floor((Date.now()-ts)/60000);
    if(diff<1)return lang==="en"?"now":"agora";
    if(diff<60)return `${diff}min`;
    const h=Math.floor(diff/60),m=diff%60;
    return m>0?`${h}h${m}m`:`${h}h`;
  };
  return(<div style={{position:"fixed",inset:0,zIndex:210,maxWidth:480,margin:"0 auto",background:"linear-gradient(180deg,rgba(7,11,30,0.99),rgba(5,8,24,0.98))",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",display:"flex",flexDirection:"column",paddingTop:"env(safe-area-inset-top)",paddingBottom:"env(safe-area-inset-bottom)",animation:"fadeIn .25s ease"}}>
    {/* Header */}
    <div style={{display:"flex",alignItems:"center",gap:14,padding:"22px 22px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{width:42,height:42,borderRadius:13,background:"linear-gradient(135deg,rgba(139,124,246,0.25),rgba(139,124,246,0.08))",border:"1px solid rgba(139,124,246,0.35)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 0 0 rgba(255,255,255,0.08) inset"}}>
        <Icon name="bell" size={20} color="#c4b5fd"/>
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:T.fXL,fontWeight:800,letterSpacing:-0.4,color:T.heading}}>{lang==="en"?"Notifications":"Notificações"}</div>
        <div style={{fontSize:T.fSM,color:T.label,marginTop:3,fontWeight:600}}>{lang==="en"?"Today · ":"Hoje · "}{todayLabel}</div>
      </div>
      <button onClick={onClose} style={{width:38,height:38,borderRadius:12,background:"rgba(22,28,60,0.65)",border:`1px solid ${T.gBSoft}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:T.insetTop}}>
        <Icon name="x" size={16} color={T.sub}/>
      </button>
    </div>

    {/* Toolbar */}
    {items.length>0&&<div style={{padding:"14px 22px 12px",display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:T.fSM,color:unreadCount>0?"#c4b5fd":T.dim,padding:"5px 12px",borderRadius:11,background:unreadCount>0?"linear-gradient(180deg,rgba(139,124,246,0.18),rgba(139,124,246,0.08))":"rgba(85,90,128,0.08)",fontWeight:700,letterSpacing:-0.05,border:`1px solid ${unreadCount>0?"rgba(139,124,246,0.32)":"rgba(85,90,128,0.15)"}`,boxShadow:unreadCount>0?T.insetTop:"none"}}>
        {unreadCount>0?`${unreadCount} ${lang==="en"?"new":"novas"}`:(lang==="en"?"All read":"Todas lidas")}
      </span>
      {unreadCount>0&&<button onClick={onMarkAllRead} style={{marginLeft:"auto",fontSize:T.fSM,color:T.sub,padding:"7px 14px",borderRadius:11,background:"rgba(22,28,60,0.6)",border:`1px solid ${T.gBSoft}`,fontWeight:600,letterSpacing:-0.05,boxShadow:T.insetTop}}>{lang==="en"?"Mark all read":"Marcar todas"}</button>}
    </div>}

    {/* List or empty state */}
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      {items.length===0?(
        <div style={{textAlign:"center",padding:"80px 24px 40px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:72,height:72,margin:"0 auto 18px",borderRadius:22,background:"rgba(139,124,246,0.06)",border:"1px solid rgba(139,124,246,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="bell" size={32} color={T.dim}/>
          </div>
          <div style={{fontSize:T.fLG,fontWeight:800,marginBottom:6,color:T.text}}>{lang==="en"?"All caught up":"Tudo em dia"}</div>
          <div style={{fontSize:T.fSM,color:T.sub,lineHeight:1.6,maxWidth:260}}>{lang==="en"?"New hints from the routine engine will appear here during the day.":"Novas dicas do engine aparecerão aqui durante o dia."}</div>
          <div style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:14,padding:"5px 10px",borderRadius:8,background:"rgba(139,124,246,0.06)",fontSize:T.fXS,color:T.accent,fontWeight:700,letterSpacing:0.5}}>
            <Icon name="clock" size={10} color={T.accent}/>
            {lang==="en"?"RESETS AT MIDNIGHT":"RESET À MEIA-NOITE"}
          </div>
        </div>
      ):items.map(it=>{
        const col=colorByType[it.type]||T.blue;
        const ic=iconByType[it.type]||"star";
        const unread=!readFn(it);
        const isCuriosity=it.type==="curiosity";
        const colLight=it.type==="good"?"#6ee7b7":it.type==="warn"?"#fdba74":it.type==="curiosity"?"#c4b5fd":"#7dd3fc";
        return(<button key={it.key} onClick={()=>unread&&onMarkRead(it.key)} style={{position:"relative",display:"flex",alignItems:"flex-start",gap:13,padding:"16px 22px 16px 26px",margin:"0 18px 8px",borderRadius:18,background:unread?`linear-gradient(180deg,${col}1a,${col}05)`:"rgba(22,28,60,0.35)",border:`1px solid ${unread?col+"38":T.gBSoft}`,boxShadow:unread?`0 1px 0 0 rgba(255,255,255,0.06) inset, 0 6px 16px -8px ${col}25`:T.insetTop,overflow:"hidden",width:"calc(100% - 36px)",textAlign:"left",cursor:unread?"pointer":"default"}}>
          <div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:`linear-gradient(180deg,${col},${col}40)`,borderRadius:"0 2px 2px 0",pointerEvents:"none",opacity:unread?1:0.4}}/>
          <div style={{width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${col}40,${col}10)`,border:`1px solid ${col}50`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:unread?1:0.5,boxShadow:"0 1px 0 0 rgba(255,255,255,0.08) inset"}}>
            <Icon name={ic} size={17} color={colLight}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            {isCuriosity&&<div style={{fontSize:T.fXS,fontWeight:800,letterSpacing:0.8,textTransform:"uppercase",color:colLight,marginBottom:4,opacity:unread?1:0.5}}>{lang==="en"?"Daily curiosity":"Curiosidade do dia"}</div>}
            <div style={{fontSize:T.fLG,fontWeight:700,marginBottom:4,color:unread?colLight:T.sub,lineHeight:1.3,letterSpacing:-0.2}}>{it.title}</div>
            <div style={{fontSize:T.fMD,color:unread?"#9099c3":T.dim,lineHeight:1.55}}>{it.sub}</div>
            <div style={{fontSize:T.fSM,color:T.dim,marginTop:6,fontWeight:600,letterSpacing:0.3}}>{fmtAgo(it.timestamp)}</div>
          </div>
        </button>);
      })}
    </div>
  </div>);
}

