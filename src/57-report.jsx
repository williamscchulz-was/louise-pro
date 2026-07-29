// ── RELATÓRIO DE 30 DIAS · página-documento (v11.9.136) ──
// Aprovado do mockup `.claude/mockups/relatorio-30d.html`. Três blocos: médias, MAPA dos 30
// dias (actograma — cada linha é um dia das 00h às 24h) e tabela dia a dia.
// ⚠️ Paleta CLARA de propósito: isto é um DOCUMENTO pra imprimir/enviar à pediatra, não uma
// tela do app — por isso não usa os tokens escuros do `T` nem a escala tipográfica da UI
// (usa a escala do documento). É a única tela do app assim, e é intencional.
const ReportPage = React.memo(function ReportPage({entries,birthDate,babyName,onBack,lang}){
  const en=lang==="en";
  const rep=useMemo(()=>sleepReport(entries,30),[entries]);
  const rows=rep.rows.slice().reverse();
  const withN=rep.rows.filter(r=>r.night),withNap=rep.rows.filter(r=>r.napCount>0),
        withF=rep.rows.filter(r=>r.feedCount>0),withW=rep.rows.filter(r=>r.maxWindowMin>0);
  const avg=(a,f)=>a.length?Math.round(a.reduce((s,x)=>s+f(x),0)/a.length):0;
  const avg1=(a,f)=>a.length?(a.reduce((s,x)=>s+f(x),0)/a.length).toFixed(1).replace(".",en?".":","):"0";
  const loc=en?"en-US":"pt-BR";
  const dShort=d=>new Date(d+"T12:00:00").toLocaleDateString(loc,{day:"2-digit",month:"2-digit"});
  const dLong=d=>new Date(d+"T12:00:00").toLocaleDateString(loc,{day:"numeric",month:"long"});
  const pc=m=>(m/1440*100).toFixed(2)+"%";
  let ageStr="";
  if(birthDate){const dd=Math.round((new Date(rep.to+"T12:00:00")-new Date(birthDate+"T12:00:00"))/864e5);
    const m=Math.floor(dd/30.4375),r=Math.round(dd-m*30.4375);
    ageStr=en?`${m} months and ${r} days`:`${m} meses e ${r} dias`}
  const onPrint=()=>{
    try{
      document.body.classList.add("print-report");
      const done=()=>{document.body.classList.remove("print-report");window.removeEventListener("afterprint",done)};
      window.addEventListener("afterprint",done);
      setTimeout(()=>{window.print();setTimeout(done,2000)},80);
    }catch(e){}
  };
  const onShare=async()=>{
    try{
      const txt=sleepReportText(rep,lang,babyName);
      if(navigator.share)await navigator.share({title:en?"Sleep & routine report":"Relatório de sono e rotina",text:txt});
      else await navigator.clipboard.writeText(txt);
      Haptic.success();
    }catch(e){}
  };
  const K=({k,v,s})=><div style={{border:"1px solid #e2e3ef",borderRadius:8,padding:"10px 11px",background:"#fafaff"}}>
    <div style={{fontSize:9,fontWeight:700,letterSpacing:.6,textTransform:"uppercase",color:"#7b80a0"}}>{k}</div>
    <div style={{fontSize:18,fontWeight:700,letterSpacing:-.5,marginTop:3,color:"#2d2f57"}}>{v}</div>
    <div style={{fontSize:10,color:"#7b80a0",marginTop:1}}>{s}</div>
  </div>;
  const th={textAlign:"right",fontSize:8,textTransform:"uppercase",letterSpacing:.4,color:"#7b80a0",borderBottom:"1.5px solid #d8dae8",padding:"5px 4px",fontWeight:700,whiteSpace:"nowrap"};
  const td={padding:"4px",borderBottom:"1px solid #eff0f6",color:"#3a3d60",textAlign:"right",whiteSpace:"nowrap"};
  return(<div id="lp-report" className="page-switch" style={{position:"fixed",inset:0,zIndex:250,background:"#eceef5",overflowY:"auto",overflowX:"hidden",overscrollBehavior:"none",WebkitOverflowScrolling:"touch",paddingTop:"env(safe-area-inset-top)",paddingBottom:"calc(40px + env(safe-area-inset-bottom))"}}>
    {/* barra de ações — some na impressão */}
    <div className="no-print" style={{position:"sticky",top:0,zIndex:2,display:"flex",alignItems:"center",gap:8,padding:"12px 14px",background:"rgba(236,238,245,0.94)",backdropFilter:"blur(10px)",borderBottom:"1px solid #dcdee9"}}>
      <button className="hit44" onClick={onBack} aria-label={en?"Back":"Voltar"} style={{width:34,height:34,borderRadius:10,background:"#fff",border:"1px solid #d8dae8",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#4a4f70"}}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
      </button>
      <div style={{flex:1,minWidth:0,fontSize:13,fontWeight:700,color:"#23263f",letterSpacing:-.2}}>{en?"30-day report":"Relatório de 30 dias"}</div>
      <button onClick={onShare} style={{padding:"8px 12px",borderRadius:9,background:"#fff",border:"1px solid #d8dae8",fontSize:12,fontWeight:700,color:"#4a4f70",display:"flex",alignItems:"center",gap:5}}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        {en?"Send":"Enviar"}
      </button>
      <button onClick={onPrint} style={{padding:"8px 12px",borderRadius:9,background:"#5b4fc4",border:"none",fontSize:12,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",gap:5}}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        PDF
      </button>
    </div>

    <div className="rep-paper" style={{background:"#fff",margin:"12px 10px 24px",borderRadius:8,padding:"22px 18px 24px",boxShadow:"0 6px 22px -10px rgba(20,22,50,.25)",fontFamily:"-apple-system,'Segoe UI',system-ui,sans-serif",color:"#23263f"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:10,borderBottom:"2px solid #5b4fc4",paddingBottom:11}}>
        <div style={{minWidth:0}}>
          <div style={{fontSize:19,fontWeight:700,letterSpacing:-.4}}>{(babyName||"Louise")+(en?" · Sleep & routine":" · Sono e rotina")}</div>
          <div style={{fontSize:11.5,color:"#6b7090",marginTop:3}}>{dLong(rep.from)} {en?"to":"a"} {dLong(rep.to)} · 30 {en?"days":"dias"}</div>
        </div>
        <div style={{fontSize:10,color:"#8b90ad",textAlign:"right",lineHeight:1.5,flexShrink:0}}>
          {ageStr&&<>{en?"Age":"Idade"}: {ageStr}<br/></>}
          {en?"Generated by Louise Pro":"Gerado pelo Louise Pro"}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:9,margin:"16px 0 6px"}}>
        <K k={en?"Night sleep":"Sono noturno"} v={fmtDur(avg(withN,r=>r.night.durationMin))} s={(en?"real ":"real ")+fmtDur(avg(withN,r=>r.night.realMin))+" · "+avg1(withN,r=>r.night.wakings)+(en?" wakings":" despertares")}/>
        <K k={en?"Naps":"Sonecas"} v={avg1(withNap,r=>r.napCount)+(en?"/day":"/dia")} s={fmtDur(avg(withNap,r=>r.napTotalMin))+(en?" total":" no total")}/>
        <K k={en?"Awake window":"Janela acordada"} v={fmtDur(avg(withW,r=>r.maxWindowMin))} s={en?"longest of the day (avg)":"maior do dia (média)"}/>
        <K k={en?"Feeds":"Mamadas"} v={avg1(withF,r=>r.feedCount)+(en?"/day":"/dia")} s={avg(withF,r=>r.mlTotal)+(en?"ml per day":"ml por dia")}/>
      </div>

      <div style={{fontSize:12.5,fontWeight:700,margin:"20px 0 5px",letterSpacing:-.2}}>{en?"30-day map":"Mapa dos 30 dias"}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:11,fontSize:10,color:"#5a5f80",marginBottom:8,alignItems:"center"}}>
        {[[en?"Night sleep":"Sono noturno","#4c4f8f",15],[en?"Nap":"Soneca","#9b8df8",15],[en?"Awake":"Acordada","#f4f5fa",15],[en?"Feed":"Mamada","#e08a1e",2.5]].map((l,i)=>
          <span key={i} style={{display:"inline-flex",alignItems:"center",gap:5}}><i style={{display:"inline-block",width:l[2],height:9,borderRadius:2,background:l[1],border:l[1]==="#f4f5fa"?"1px solid #e2e3ef":"none"}}/>{l[0]}</span>)}
      </div>
      <div style={{position:"relative",height:12,marginLeft:56}}>
        {[0,6,12,18,24].map(h=><span key={h} style={{position:"absolute",left:pc(h*60),transform:h===0?"none":h===24?"translateX(-100%)":"translateX(-50%)",fontSize:8.5,color:"#9a9fbb"}}>{String(h).padStart(2,"0")}h</span>)}
      </div>
      {rows.map(r=><div key={r.date} style={{display:"flex",alignItems:"center",height:13}}>
        <span style={{width:56,fontSize:8.5,color:"#7b80a0",fontVariantNumeric:"tabular-nums",flexShrink:0}}>{_rpWd(r.date,en)} {dShort(r.date)}</span>
        <div style={{position:"relative",flex:1,height:10,background:"#f4f5fa",borderRadius:2,backgroundImage:"repeating-linear-gradient(to right,#e6e7f1 0 1px,transparent 1px 12.5%)"}}>
          {r.sleepSegs.map((s,i)=><i key={"s"+i} style={{position:"absolute",top:0,height:10,borderRadius:2,background:"#4c4f8f",left:pc(s.from),width:pc(s.to-s.from)}}/>)}
          {r.napSegs.map((s,i)=><i key={"n"+i} style={{position:"absolute",top:0,height:10,borderRadius:2,background:"#9b8df8",left:pc(s.from),width:pc(s.to-s.from)}}/>)}
          {r.feedMins.map((m,i)=><i key={"f"+i} style={{position:"absolute",top:-3,width:1.5,height:4,background:"#e08a1e",borderRadius:1,left:pc(m)}}/>)}
        </div>
      </div>)}

      <div style={{fontSize:12.5,fontWeight:700,margin:"20px 0 4px",letterSpacing:-.2}}>{en?"Day by day":"Dia a dia"}</div>
      <div style={{fontSize:10,color:"#7b80a0",marginBottom:8,lineHeight:1.5}}>{en?"Real sleep = night duration minus time awake during wakings. Window = longest awake stretch between naps.":"Sono real = duração da noite menos o tempo acordada nos despertares. Janela = maior período acordada entre uma soneca e outra."}</div>
      <div className="rep-scroll" style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        <table style={{width:"100%",minWidth:600,borderCollapse:"collapse",fontSize:9.5,fontVariantNumeric:"tabular-nums"}}>
          <thead><tr>
            <th style={{...th,textAlign:"left"}}>{en?"Day":"Dia"}</th>
            <th style={{...th,textAlign:"left"}}>{en?"Woke":"Acordou"}</th>
            <th style={{...th,textAlign:"left"}}>{en?"Night":"Noite"}</th>
            <th style={th}>{en?"Duration":"Duração"}</th>
            <th style={th}>{en?"Wak.":"Desp."}</th>
            <th style={th}>{en?"Real":"Sono real"}</th>
            <th style={th}>{en?"Naps":"Sonecas"}</th>
            <th style={th}>{en?"Total":"Total"}</th>
            <th style={th}>{en?"Window":"Maior janela"}</th>
            <th style={th}>{en?"Feeds":"Mamadas"}</th>
            <th style={th}>{en?"Milk":"Leite"}</th>
          </tr></thead>
          <tbody>{rows.map((r,i)=><tr key={r.date} style={i%2?{background:"#fafaff"}:null}>
            <td style={{...td,textAlign:"left",fontWeight:600,color:"#23263f"}}>{_rpWd(r.date,en)} {dShort(r.date)}</td>
            <td style={{...td,textAlign:"left"}}>{r.wake||"—"}</td>
            <td style={{...td,textAlign:"left"}}>{r.night?r.night.start+"→"+r.night.end:"—"}</td>
            <td style={td}>{r.night?fmtDur(r.night.durationMin):"—"}</td>
            <td style={td}>{r.night?r.night.wakings:"—"}</td>
            <td style={td}>{r.night?fmtDur(r.night.realMin):"—"}</td>
            <td style={td}>{r.napCount||"—"}</td>
            <td style={td}>{r.napTotalMin?fmtDur(r.napTotalMin):"—"}</td>
            <td style={td}>{r.maxWindowMin?fmtDur(r.maxWindowMin):"—"}</td>
            <td style={td}>{r.feedCount||"—"}</td>
            <td style={td}>{r.mlTotal?r.mlTotal+"ml":"—"}</td>
          </tr>)}</tbody>
        </table>
      </div>

      <div style={{marginTop:14,paddingTop:9,borderTop:"1px solid #e8e9f2",fontSize:9.5,color:"#8b90ad",lineHeight:1.5}}>
        {en?"Entries logged manually by the parents in the Louise Pro app — unlogged periods show as awake on the map. Tracking document; does not replace professional evaluation.":"Registros feitos manualmente pelos pais no app Louise Pro — períodos não registrados aparecem como acordada no mapa. Documento de acompanhamento, não substitui avaliação profissional."}
      </div>
    </div>
  </div>);
});
