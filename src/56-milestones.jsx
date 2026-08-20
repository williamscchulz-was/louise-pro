const MILESTONE_BADGES = [
  {key:"first_light",emoji:"\u{1F31F}",label:{pt:"Primeira luz",en:"First light"},check:s=>s.total>=1,progress:s=>({c:Math.min(s.total,1),t:1})},
  {key:"five_lights",emoji:"⭐",label:{pt:"5 conquistas",en:"5 logged"},check:s=>s.total>=5,progress:s=>({c:Math.min(s.total,5),t:5})},
  {key:"ten_lights",emoji:"✨",label:{pt:"10 conquistas",en:"10 logged"},check:s=>s.total>=10,progress:s=>({c:Math.min(s.total,10),t:10})},
  {key:"newborn_pro",emoji:"\u{1F476}",label:{pt:"Recém-nascida",en:"Newborn"},check:s=>s.totalsByCheckup[0]>0&&s.byCheckup[0]>=s.totalsByCheckup[0],progress:s=>({c:s.byCheckup[0]||0,t:s.totalsByCheckup[0]||10})},
  {key:"checkup_6m",emoji:"\u{1F3AF}",label:{pt:"6 meses",en:"6 months"},check:s=>s.totalsByCheckup[6]>0&&s.byCheckup[6]>=s.totalsByCheckup[6],progress:s=>({c:s.byCheckup[6]||0,t:s.totalsByCheckup[6]||5})},
  {key:"checkup_12m",emoji:"\u{1F382}",label:{pt:"1 ano",en:"1 year"},check:s=>s.totalsByCheckup[12]>0&&s.byCheckup[12]>=s.totalsByCheckup[12],progress:s=>({c:s.byCheckup[12]||0,t:s.totalsByCheckup[12]||6})},
  {key:"checkup_24m",emoji:"\u{1F389}",label:{pt:"2 anos",en:"2 years"},check:s=>s.totalsByCheckup[24]>0&&s.byCheckup[24]>=s.totalsByCheckup[24],progress:s=>({c:s.byCheckup[24]||0,t:s.totalsByCheckup[24]||5})},
  {key:"motor_pro",emoji:"\u{1F3C3}",label:{pt:"Atleta",en:"Athlete"},check:s=>{const t=s.totalsByCat.motor_gross+s.totalsByCat.motor_fine;const c=s.byCat.motor_gross+s.byCat.motor_fine;return t>0&&c>=t},progress:s=>({c:s.byCat.motor_gross+s.byCat.motor_fine,t:s.totalsByCat.motor_gross+s.totalsByCat.motor_fine})},
  {key:"chatty",emoji:"\u{1F4AC}",label:{pt:"Tagarela",en:"Chatty"},check:s=>s.totalsByCat.language>0&&s.byCat.language>=s.totalsByCat.language,progress:s=>({c:s.byCat.language||0,t:s.totalsByCat.language||13})},
  {key:"charming",emoji:"\u{1F60A}",label:{pt:"Carismática",en:"Charming"},check:s=>s.totalsByCat.social_emotional>0&&s.byCat.social_emotional>=s.totalsByCat.social_emotional,progress:s=>({c:s.byCat.social_emotional||0,t:s.totalsByCat.social_emotional||22})},
  {key:"thinker",emoji:"\u{1F9E0}",label:{pt:"Pensadora",en:"Thinker"},check:s=>s.totalsByCat.cognitive>0&&s.byCat.cognitive>=s.totalsByCat.cognitive,progress:s=>({c:s.byCat.cognitive||0,t:s.totalsByCat.cognitive||6})},
  {key:"all_done",emoji:"\u{1F3C6}",label:{pt:"Tudo!",en:"All done!"},check:s=>s.allTotal>0&&s.total>=s.allTotal,progress:s=>({c:s.total,t:s.allTotal||54})},
];

// v11.9.56: Marcos de desenvolvimento (Timeline + picker). Dados em window.DEV_MILESTONES
// (~44 itens 0-24m, CDC 2022 + WHO MGRS + SBP) e window.CONCERNING_SIGNS (~17 itens).
// Note: window.MILESTONES (sem DEV_) ja existe em curiosities.js — sao curiosidades
// mensais (2-12m). Namespaces separados pra evitar collision.
// Entries com type:"milestone" guardam: key (chave do DEV_MILESTONES), category, date, note.
const MilestonesPage = React.memo(function MilestonesPage({milestones,birthDate,profile,onBack,onAddEntry,onDeleteEntry,lang}){
  const[confirmDelKey,setConfirmDelKey]=useState(null); // v11.9.65: 2-step inline delete (substitui confirm() nativo)
  const[selStar,setSelStar]=useState(null); // v11.9.129: estrela selecionada no céu (tap-to-inspect, padrão dos gráficos)
  const all=window.DEV_MILESTONES||[];
  const allSigns=window.CONCERNING_SIGNS||[];
  // v11.9.145: recebe a lista completa de marcos (sem a janela de 90d) do App. Antes filtrava
  // `entries`, que é cortado em 90 dias — e isso escondia metade da vida da Louise. Ver a nota
  // longa em FB.subMilestones (index.html) pra cadeia completa do bug.
  const milestoneEntries=(milestones||[]).slice()
    .sort((a,b)=>`${b.date}T${b.time||"00:00"}`.localeCompare(`${a.date}T${a.time||"00:00"}`));
  const age=calcAge(birthDate);
  const ageMonths=age?.months||0;
  const checkups=[0,2,4,6,9,12,15,18,24];
  const currentCheckup=checkups.filter(c=>c<=ageMonths+1).slice(-1)[0]||2;
  const nextCheckup=checkups.find(c=>c>ageMonths);
  const doneKeys=new Set(milestoneEntries.map(e=>e.key));
  const upcoming=all.filter(m=>
    m.checkupAge>=Math.max(2,currentCheckup-2)&&
    m.checkupAge<=(nextCheckup||currentCheckup+3)&&
    !doneKeys.has(m.key)
  );
  const signs=allSigns.filter(s=>s.checkupAge<=ageMonths+2);
  // v11.9.129: O céu da Louise (mais-vida ideia C, integrada NA seção de conquistas que já
  // existe — pedido do William). Cada marco registrado vira estrela acesa; os próximos, uma
  // estrela apagada. Posições DETERMINÍSTICAS (hash da key, nada de Math.random no render)
  // com anti-colisão por nudge; marcos próximos no tempo (≤14d) se ligam em constelação.
  // ⚠️ v11.9.145 REESCRITO. A versão anterior posicionava por `hash(key)` (aleatório no
  // espaço) mas ligava vizinhos no TEMPO — as linhas conectavam pontos sem nenhuma relação
  // espacial, e o resultado era rabisco: 20 linhas com 36 cruzamentos no caso real. Pior,
  // piorava com o uso (registrar vários marcos numa sentada gera o máximo de linhas), e a
  // anti-colisão gulosa desistia em 6 de 26 estrelas, sobrepondo pares a 10,7px.
  // AGORA: a POSIÇÃO carrega o tempo. X = ordem cronológica (nasceu à esquerda, hoje à
  // direita), Y = onda suave determinística. Assim vizinho no tempo É vizinho no espaço, a
  // linha vira uma trilha contínua que nunca se cruza, e não há colisão por construção.
  // A cor passa a carregar a categoria — informação que a tela já tinha e desperdiçava.
  const skyData=useMemo(()=>{
    const seenK=new Set();
    const uniq=milestoneEntries.slice().reverse()
      .map(e=>{const m=all.find(x=>x.key===e.key);return m?{key:e.key,date:e.date,label:m.label,category:m.category}:null})
      .filter(s=>s&&!seenK.has(s.key)&&seenK.add(s.key));
    const n=uniq.length;
    // SERPENTINA: uma faixa só não escala — com 38 marcos as estrelas ficariam a 2,3 unidades
    // uma da outra e se encostariam (e o catálogo tem 85). Então a trilha desce de faixa e
    // volta, tipo boustrofédon: a leitura cronológica continua contínua, mas usa a altura.
    const PER=13;                                   // estrelas por faixa (folga confortável)
    const bands=Math.max(1,Math.min(4,Math.ceil(n/PER)));
    const perBand=Math.ceil(n/bands);
    const bandY=b=>bands===1?50:18+b*(64/(bands-1));  // faixas distribuídas na altura
    const pos=i=>{
      const b=Math.floor(i/perBand),k=i%perBand;
      const cnt=Math.min(perBand,n-b*perBand);
      const t=cnt<=1?0.5:k/(cnt-1);
      const fwd=b%2===0;                            // faixa ímpar volta pra esquerda
      return{x:8+(fwd?t:1-t)*80,y:bandY(b)+Math.sin(i*1.1)*(bands>1?5:16)};
    };
    const lit=uniq.map((s,i)=>({...s,...pos(i)}));
    // as próximas ficam depois da última acesa, seguindo a mesma trilha
    const dim=upcoming.slice(0,4).map((m,i)=>({key:m.key,label:m.label,...pos(n+i)}));
    // liga cada estrela à seguinte. Dentro da faixa o x é monotônico (nunca cruza); a
    // virada de faixa acontece na borda, onde a curva é visualmente clara.
    const lines=[];
    for(let i=1;i<lit.length;i++)lines.push({x1:lit[i-1].x,y1:lit[i-1].y,x2:lit[i].x,y2:lit[i].y});
    return{lit,dim,lines,bands};
  },[milestoneEntries,upcoming,all]);
  // v11.9.145: a altura acompanha o nº de FAIXAS da serpentina, não a contagem crua de
  // estrelas (que saturava o teto de 300px já aos 18 marcos e depois só apertava tudo).
  const skyH=skyData.bands<=1?200:Math.min(330,150+skyData.bands*52);
  const fmtStarDate=d=>new Date(d+"T12:00:00").toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"short"});
  // v11.9.61: stats agregadas pros badges (count por categoria + checkupAge)
  const badgeStats=useMemo(()=>{
    const byCat={motor_gross:0,motor_fine:0,language:0,social_emotional:0,cognitive:0};
    const byCheckup={0:0,2:0,4:0,6:0,9:0,12:0,15:0,18:0,24:0};
    const totalsByCat={motor_gross:0,motor_fine:0,language:0,social_emotional:0,cognitive:0};
    const totalsByCheckup={0:0,2:0,4:0,6:0,9:0,12:0,15:0,18:0,24:0};
    all.forEach(m=>{
      if(totalsByCat[m.category]!==undefined)totalsByCat[m.category]++;
      if(totalsByCheckup[m.checkupAge]!==undefined)totalsByCheckup[m.checkupAge]++;
    });
    milestoneEntries.forEach(e=>{
      const m=all.find(x=>x.key===e.key);
      if(!m)return;
      if(byCat[m.category]!==undefined)byCat[m.category]++;
      if(byCheckup[m.checkupAge]!==undefined)byCheckup[m.checkupAge]++;
    });
    return{total:milestoneEntries.length,byCat,byCheckup,totalsByCat,totalsByCheckup,allTotal:all.length};
  },[milestoneEntries,all]);
  const badges=MILESTONE_BADGES.map(b=>({...b,earned:b.check(badgeStats),progress:b.progress?b.progress(badgeStats):null}));
  const earnedBadges=badges.filter(b=>b.earned).length;
  const[showAdd,setShowAdd]=useState(false);
  const[showSigns,setShowSigns]=useState(false);
  const[pickedKey,setPickedKey]=useState(null);
  const[pickedDate,setPickedDate]=useState(todayStr());
  const[pickedNote,setPickedNote]=useState("");
  const[pickedCategory,setPickedCategory]=useState("all");
  const[busy,setBusy]=useState(false);
  const picked=pickedKey?all.find(m=>m.key===pickedKey):null;
  const catColors={motor_gross:T.cyan,motor_fine:T.cyan,language:T.amber,social_emotional:T.pink,cognitive:T.accent};
  const catLabels={motor_gross:L("catMotorGross"),motor_fine:L("catMotorFine"),language:L("catLanguage"),social_emotional:L("catSocial"),cognitive:L("catCognitive")};
  // v11.9.58: esconde nav pill enquanto picker aberto (senao Save fica atras)
  useEffect(()=>{
    if(!document.body)return;
    document.body.classList.toggle("milestone-picker-open",showAdd);
    return()=>{document.body.classList.remove("milestone-picker-open")};
  },[showAdd]);
  const saveMilestone=async()=>{
    if(!picked||busy)return;
    setBusy(true);
    Haptic.medium();
    const entry={
      id:`ms-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      type:"milestone",
      key:picked.key,
      category:picked.category,
      date:pickedDate,
      time:"12:00",
    };
    if(pickedNote.trim())entry.note=pickedNote.trim();
    try{
      await onAddEntry(entry);
      Haptic.success();
      setShowAdd(false);
      setPickedKey(null);
      setPickedDate(todayStr());
      setPickedNote("");
    }catch(e){Haptic.warning()}
    setBusy(false);
  };
  return(<div className="page-switch" style={{position:"fixed",inset:0,zIndex:200,maxWidth:480,margin:"0 auto",background:T.pageBg,overflowY:"auto",overflowX:"hidden",overscrollBehavior:"none",WebkitOverflowScrolling:"touch",paddingTop:"env(safe-area-inset-top)",paddingBottom:"calc(100px + env(safe-area-inset-bottom))"}}>
    {/* Header */}
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"16px 14px 14px 20px"}}>
      <button className="hit44" aria-label={_lang==="en"?"Back":"Voltar"} onClick={onBack} style={{width:36,height:36,borderRadius:10,background:T.glass,border:`1px solid ${T.gB}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="back" size={18} color={T.sub}/></button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:T.fXL,fontWeight:800,letterSpacing:-0.2}}>{L("milestonesTitle")}</div>
        {/* v11.9.145: "5m" era ambíguo num app onde todo "m" é minuto (o timer usa m o tempo
            todo). Escrito por extenso. E a contagem passa a ser de marcos ÚNICOS — com as
            duplicatas do dado real, o número cru contava a mesma conquista 2x. */}
        <div style={{fontSize:T.fSM,color:T.sub,marginTop:1,fontVariantNumeric:"tabular-nums"}}>{new Set(milestoneEntries.map(e=>e.key)).size} {L("milestonesDone")} · {ageMonths} {_lang==="en"?(ageMonths===1?"month":"months"):(ageMonths===1?"mês":"meses")}</div>
      </div>
      <button onClick={()=>{setPickedKey(null);setShowAdd(true)}} aria-label={_lang==="en"?"Add milestone":"Adicionar marco"} style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#facc15,#f59e0b)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",color:"#1a1f2e",fontSize:24,fontWeight:800,boxShadow:"0 4px 14px -4px rgba(250,204,21,0.5)",cursor:"pointer"}}>+</button>
    </div>
    {/* v11.9.145: contexto ANTES do decorativo. A tela já calculava `nextCheckup` e nunca
        contava — a consulta de 6 meses está a ~3 semanas e o pai não sabia. Tudo aqui é
        contagem do que foi REGISTRADO, nunca avaliação da bebê. */}
    {nextCheckup!=null&&(()=>{
      const feitos=badgeStats.byCheckup[nextCheckup]||0,totalC=badgeStats.totalsByCheckup[nextCheckup]||0;
      if(!totalC)return null;
      const pct=Math.round(feitos/totalC*100);
      // semanas até a bebê completar a idade da próxima consulta
      let semanas=null;
      if(birthDate){const alvo=new Date(birthDate+"T12:00");alvo.setMonth(alvo.getMonth()+nextCheckup);
        semanas=Math.max(0,Math.round((alvo-new Date())/6048e5))}
      return(<div style={{padding:"0 20px 12px"}}>
        <div style={{background:"linear-gradient(180deg,rgba(22,28,60,0.6),rgba(20,26,60,0.35))",border:"1px solid rgba(167,139,250,0.34)",borderRadius:16,padding:"13px 15px",boxShadow:T.cardShadow}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <div style={{width:34,height:34,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,...T.iconTile(T.purple)}}><Icon name="star" size={16} color={T.lilac}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:T.fMD,fontWeight:700,color:T.heading,letterSpacing:-0.1}}>{_lang==="en"?`${nextCheckup}-month checkup`:`Consulta de ${nextCheckup} meses`}</div>
              <div style={{fontSize:T.fSM,color:T.label,marginTop:1,fontVariantNumeric:"tabular-nums"}}>
                {semanas!=null&&semanas>0?(_lang==="en"?`in ~${semanas} week${semanas>1?"s":""} · `:`em ~${semanas} semana${semanas>1?"s":""} · `):""}
                {_lang==="en"?`${feitos} of ${totalC} milestones logged`:`${feitos} de ${totalC} marcos registrados`}
              </div>
            </div>
          </div>
          <div style={{height:5,borderRadius:3,background:"rgba(139,124,246,0.15)",marginTop:11,overflow:"hidden"}}>
            <div style={{width:pct+"%",height:"100%",background:"linear-gradient(90deg,#9b8df8,#c4b5fd)",borderRadius:3}}/>
          </div>
        </div>
      </div>);
    })()}
    {/* v11.9.145: os 10 marcos de recém-nascida ficavam invisíveis em TODA idade (o
        `Math.max(2,...)` do filtro de upcoming os excluía pra sempre), e o badge cobrava
        "0/10" sem oferecer nenhum caminho. Vira convite, não pendência. */}
    {(badgeStats.byCheckup[0]||0)<(badgeStats.totalsByCheckup[0]||0)&&<div style={{padding:"0 20px 12px"}}>
      <button onClick={()=>{setPickedKey(null);setPickedCategory("all");setShowAdd(true)}} style={{width:"100%",padding:"12px 14px",borderRadius:14,background:"linear-gradient(135deg,rgba(251,191,36,0.10),rgba(251,191,36,0.03))",border:"1px solid rgba(251,191,36,0.30)",display:"flex",alignItems:"center",gap:11,textAlign:"left",cursor:"pointer"}}>
        <div style={{width:32,height:32,borderRadius:10,background:"rgba(251,191,36,0.14)",border:"1px solid rgba(251,191,36,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:15}}>✨</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:T.fMD,fontWeight:700,color:T.heading}}>{_lang==="en"?"First moments":"Primeiros momentos"}</div>
          <div style={{fontSize:T.fXS,color:T.label,marginTop:1}}>{(badgeStats.totalsByCheckup[0]||0)-(badgeStats.byCheckup[0]||0)} {_lang==="en"?"memories to log":"memórias pra registrar"}</div>
        </div>
        <span style={{color:"#fbbf24",fontSize:T.fLG,flexShrink:0}}>›</span>
      </button>
    </div>}
    {/* v11.9.129: O céu da Louise — cada marco é uma estrela acesa no dia em que aconteceu. */}
    <div style={{padding:"0 20px 16px"}}>
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:10}}>
        <span style={{fontSize:T.fSM,fontWeight:800,color:T.lilac,textTransform:"uppercase",letterSpacing:1,display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:T.fMD}}>✨</span>{_lang==="en"?"Louise's sky":"O céu da Louise"}</span>
        <span style={{fontSize:T.fXS,color:T.lilac,fontWeight:800,fontVariantNumeric:"tabular-nums",letterSpacing:0.3,textTransform:"uppercase"}}>{skyData.lit.length} {_lang==="en"?(skyData.lit.length===1?"star lit":"stars lit"):(skyData.lit.length===1?"estrela acesa":"estrelas acesas")}</span>
      </div>
      <div onClick={()=>setSelStar(null)} style={{position:"relative",height:skyH,borderRadius:18,overflow:"hidden",background:"radial-gradient(ellipse 130% 70% at 50% 0%,rgba(26,31,82,0.55) 0%,transparent 65%),linear-gradient(180deg,rgba(14,18,44,0.9),rgba(10,14,38,0.95))",border:"1px solid rgba(196,181,253,0.16)",boxShadow:T.insetTop}}>
        {[[8,22],[24,80],[41,12],[58,88],[72,30],[88,70],[15,55],[93,18],[50,50],[80,92],[33,38],[66,64]].map((p,i)=><span key={"du"+i} style={{position:"absolute",left:p[0]+"%",top:p[1]+"%",width:1.5,height:1.5,borderRadius:"50%",background:"rgba(180,190,255,0.35)"}}/>)}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
          {skyData.lines.map((l,i)=><line key={"cl"+i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(196,181,253,0.28)" strokeWidth="1" strokeDasharray="2 3" vectorEffect="non-scaling-stroke"/>)}
        </svg>
        {/* v11.9.145: as próximas ficam tocáveis e rotuladas — antes eram inertes
            (pointerEvents:none), então o usuário via algo apagado sem como descobrir o quê. */}
        {skyData.dim.map(s=><button key={"d"+s.key} className="hit44" aria-label={s.label[_lang]||s.label.en} onClick={e=>{e.stopPropagation();setSelStar(selStar===("dim:"+s.key)?null:"dim:"+s.key)}} style={{position:"absolute",left:s.x+"%",top:s.y+"%",transform:"translate(-50%,-50%)",fontSize:12,opacity:0.4,background:"none",border:"none",padding:4,color:"#c4b5fd",zIndex:2}}>☆</button>)}
        {/* v11.9.145: cor da estrela = categoria do marco (a mesma paleta que o resto da tela
            já usa). Antes eram 21 estrelas douradas idênticas, jogando fora essa informação. */}
        {skyData.lit.map((s,i)=>{const col=catColors[s.category]||"#fbbf24";return<button key={s.key} className="sky-star hit44" aria-label={s.label[_lang]||s.label.en} onClick={e=>{e.stopPropagation();setSelStar(selStar===s.key?null:s.key)}} style={{position:"absolute",left:s.x+"%",top:s.y+"%",transform:"translate(-50%,-50%)",fontSize:13,filter:`drop-shadow(0 0 5px ${col})`,animationDelay:(i%5)*0.7+"s",padding:4,zIndex:2,background:"none",border:"none",lineHeight:1}}>⭐</button>})}
        {/* âncoras temporais: sem elas o eixo não se explica sozinho */}
        {/* v11.9.145: âncoras ancoradas nas posições REAIS da 1ª e da última estrela — com a
            serpentina, "hoje" pode terminar na esquerda ou na direita conforme a paridade da
            faixa, então posição fixa mentiria. */}
        {skyData.lit.length>1&&(()=>{const a=skyData.lit[0],z=skyData.lit[skyData.lit.length-1];
          const tag=(s,txt)=>(<span style={{position:"absolute",left:Math.min(Math.max(s.x,10),90)+"%",top:`calc(${s.y}% + 13px)`,transform:"translateX(-50%)",fontSize:8,color:"#6b7099",pointerEvents:"none",whiteSpace:"nowrap",letterSpacing:0.3}}>{txt}</span>);
          return(<>{tag(a,_lang==="en"?"born":"nasceu")}{tag(z,_lang==="en"?"now":"hoje")}</>)})()}
        {selStar&&(()=>{
          const isDim=selStar.indexOf("dim:")===0;
          const s=isDim?skyData.dim.find(x=>("dim:"+x.key)===selStar):skyData.lit.find(x=>x.key===selStar);
          if(!s)return null;const below=s.y<55;
          return(<div className="chart-tip" style={{position:"absolute",left:Math.min(Math.max(s.x,24),76)+"%",top:(s.y+(below?8:-8))+"%",transform:below?"translate(-50%,0)":"translate(-50%,-100%)",background:T.tooltipBg,border:`1px solid ${isDim?"rgba(196,181,253,0.35)":"rgba(251,191,36,0.35)"}`,borderRadius:10,padding:"7px 11px",whiteSpace:"nowrap",boxShadow:T.tooltipShadow,pointerEvents:"none",zIndex:5}}>
          <div style={{fontSize:T.fSM,fontWeight:800,color:T.heading}}>{s.label[_lang]||s.label.en}</div>
          <div style={{fontSize:T.fXS,color:isDim?T.lilac:"#fcd34d",fontWeight:700,marginTop:2,fontVariantNumeric:"tabular-nums"}}>{isDim?(_lang==="en"?"still to come":"ainda por vir"):fmtStarDate(s.date)}</div>
        </div>)})()}
        {skyData.lit.length===0&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,padding:20,textAlign:"center"}}>
          <div style={{fontSize:20}}>✨</div>
          <div style={{fontSize:T.fSM,color:T.sub,lineHeight:1.5,maxWidth:230}}>{_lang==="en"?"Her first stars will light up here — log her first milestone.":"As primeiras estrelas dela vão acender aqui — registra o primeiro marco."}</div>
        </div>}
      </div>
    </div>
    {/* v11.9.61: Conquistas (badges grid) — earned gold glow, locked dim + progress */}
    <div style={{padding:"0 20px 14px"}}>
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:10}}>
        <span style={{fontSize:T.fSM,fontWeight:800,color:T.accent,textTransform:"uppercase",letterSpacing:1,display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:T.fMD}}>{"\u{1F3C6}"}</span>
          {L("achievementsTitle")}
        </span>
        <span style={{fontSize:T.fXS,color:"#fcd34d",fontWeight:800,fontVariantNumeric:"tabular-nums",letterSpacing:0.3,textTransform:"uppercase"}}>{earnedBadges}/{badges.length} {L("earnedCount")}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {badges.map(b=>{
          const isEarned=b.earned;
          return<div key={b.key} style={{aspectRatio:"1",borderRadius:14,background:isEarned?"radial-gradient(circle at 50% 30%,rgba(250,204,21,0.22),rgba(245,158,11,0.04))":"rgba(20,26,60,0.42)",border:`1px solid ${isEarned?"rgba(250,204,21,0.45)":"rgba(139,124,246,0.12)"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px 4px",position:"relative",opacity:isEarned?1:0.35,boxShadow:isEarned?"0 0 14px -2px rgba(250,204,21,0.30)":"none",transition:"opacity .3s ease, box-shadow .3s ease"}}>
            <div style={{fontSize:26,marginBottom:5,filter:isEarned?"drop-shadow(0 0 6px rgba(250,204,21,0.5))":"none",lineHeight:1}}>{b.emoji}</div>
            <div style={{fontSize:T.fXS,fontWeight:800,color:isEarned?"#fcd34d":T.text,textTransform:"uppercase",letterSpacing:0.4,textAlign:"center",lineHeight:1.2,padding:"0 2px"}}>{b.label[_lang]||b.label.en}</div>
            {!isEarned&&b.progress&&<div style={{fontSize:9,color:"rgba(252,211,77,0.65)",marginTop:3,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{b.progress.c}/{b.progress.t}</div>}
          </div>
        })}
      </div>
    </div>
    {/* Upcoming */}
    {upcoming.length>0&&<div style={{padding:"0 20px 14px"}}>
      <div style={{fontSize:T.fSM,fontWeight:800,color:T.accent,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{L("upcomingMilestones")}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {upcoming.slice(0,4).map(m=>{
          // ⚠️ v11.9.145: era `m.checkupAge<=ageMonths+1`, que com o filtro de `upcoming`
          // (que já corta em nextCheckup) dava SEMPRE true — 100% dos cards diziam "esperado
          // agora", inclusive marcos que o CDC posiciona um mês à frente. Efeito real: o pai
          // lê "esperado agora" pra algo que a Louise não faz e conclui que ela está atrasada,
          // quando falta um mês inteiro. Agora "agora" só quando a idade de referência já
          // chegou; o resto diz explicitamente em qual consulta é esperado.
          const isExpected=m.checkupAge<=ageMonths;
          const col=catColors[m.category]||T.accent;
          return<button key={m.key} onClick={()=>{setPickedKey(m.key);setShowAdd(true)}} style={{padding:"10px 12px",borderRadius:12,background:`linear-gradient(135deg,${col}14,${col}06)`,border:`1px solid ${col}28`,display:"flex",alignItems:"center",gap:11,textAlign:"left",cursor:"pointer"}}>
            <div style={{width:32,height:32,borderRadius:9,background:`${col}1a`,border:`1px solid ${col}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name="star" size={15} color={col}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:T.fMD,fontWeight:700,color:T.text,letterSpacing:-0.1}}>{m.label[_lang]||m.label.en}</div>
              {/* v11.9.145: T.dim -> T.label (T.dim mede ~2.9:1, abaixo do minimo legivel) */}
              <div style={{fontSize:T.fXS,color:T.label,marginTop:2}}>{isExpected?L("expectedNow"):(_lang==="en"?`at the ${m.checkupAge}-month checkup`:`na consulta de ${m.checkupAge}m`)}</div>
            </div>
            <div style={{fontSize:T.fXL,color:col,fontWeight:700,opacity:0.6}}>+</div>
          </button>
        })}
      </div>
    </div>}
    {/* Done timeline */}
    <div style={{padding:"0 20px 14px"}}>
      <div style={{fontSize:T.fSM,fontWeight:800,color:T.accent,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>{_lang==="en"?"Achieved":"Conquistados"}</div>
      {milestoneEntries.length===0?<div style={{padding:"30px 20px",textAlign:"center",color:T.dim,fontSize:T.fMD,lineHeight:1.5}}>{L("noMilestonesYet")}</div>:
        <div style={{position:"relative",paddingLeft:24}}>
          <div style={{position:"absolute",left:9,top:0,bottom:0,width:1,background:`linear-gradient(180deg,${T.accent}88,${T.accent}11)`}}/>
          {milestoneEntries.map(e=>{
            const m=all.find(x=>x.key===e.key);
            const cat=e.category||m?.category||"social_emotional";
            const col=catColors[cat]||T.accent;
            return<div key={e.id} style={{position:"relative",paddingBottom:16}}>
              <div style={{position:"absolute",left:-19,top:4,width:11,height:11,borderRadius:"50%",background:col,border:"2px solid #070b1e",boxShadow:`0 0 0 1px ${col}88`}}/>
              <div style={{fontSize:T.fXS,fontWeight:800,color:T.accent,textTransform:"uppercase",letterSpacing:0.8,marginBottom:3,fontVariantNumeric:"tabular-nums"}}>{new Date(e.date+"T12:00").toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"short",year:"numeric"})}</div>
              <div style={{fontSize:T.fMD,fontWeight:700,color:T.text,letterSpacing:-0.1,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                <span>{m?(m.label[_lang]||m.label.en):e.key}</span>
                <span style={{fontSize:T.fXS,fontWeight:700,color:col,padding:"1px 6px",borderRadius:5,background:`${col}1a`,letterSpacing:0.3,textTransform:"uppercase"}}>{catLabels[cat]||""}</span>
              </div>
              {e.note&&<div style={{fontSize:T.fSM,color:T.sub,lineHeight:1.45,marginTop:3}}>{e.note}</div>}
              <button className="hit44" aria-label={confirmDelKey===e.id?(_lang==="en"?"Confirm delete":"Confirmar exclusão"):(_lang==="en"?"Delete":"Excluir")} onClick={()=>{if(confirmDelKey!==e.id){setConfirmDelKey(e.id);if(window.Haptic&&Haptic.warning)Haptic.warning();setTimeout(()=>setConfirmDelKey(prev=>prev===e.id?null:prev),3000);return}setConfirmDelKey(null);onDeleteEntry(e.id)}} style={{fontSize:T.fXS,color:confirmDelKey===e.id?"#fca5a5":T.dim,marginTop:6,padding:"7px 12px",minHeight:36,background:confirmDelKey===e.id?"rgba(248,113,113,0.16)":"transparent",border:confirmDelKey===e.id?"1px solid rgba(248,113,113,0.5)":"1px solid transparent",borderRadius:9,cursor:"pointer",opacity:confirmDelKey===e.id?1:0.6,letterSpacing:0.2,fontWeight:confirmDelKey===e.id?700:500}}>{confirmDelKey===e.id?(_lang==="en"?"Tap to confirm":"Tocar p/ confirmar"):(_lang==="en"?"delete":"excluir")}</button>
            </div>
          })}
        </div>
      }
    </div>
    {/* Concerning signs collapsible */}
    {signs.length>0&&<div style={{padding:"0 20px 14px"}}>
      <button onClick={()=>setShowSigns(!showSigns)} style={{width:"100%",padding:"12px 14px",borderRadius:12,background:"rgba(20,26,60,0.32)",border:`1px solid ${T.gBSoft}`,display:"flex",alignItems:"center",gap:10,textAlign:"left",cursor:"pointer"}}>
        <Icon name="zap" size={16} color="#fb923c"/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:T.fSM,fontWeight:700,color:T.text}}>{L("concerningSigns")}</div>
          <div style={{fontSize:T.fXS,color:T.dim,marginTop:1}}>{signs.length} {_lang==="en"?"items":"itens"}</div>
        </div>
        <div style={{transform:showSigns?"rotate(180deg)":"rotate(0)",transition:"transform .2s",color:T.dim,flexShrink:0}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </button>
      {showSigns&&<div style={{marginTop:8,padding:"12px 14px",borderRadius:12,background:"rgba(251,146,60,0.06)",border:"1px solid rgba(251,146,60,0.18)"}}>
        <div style={{fontSize:T.fXS,color:T.dim,lineHeight:1.5,marginBottom:10,fontStyle:"italic"}}>{L("concerningSignsHelp")}</div>
        {signs.map(s=><div key={s.key} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"6px 0",borderTop:"1px solid rgba(251,146,60,0.10)"}}>
          <span style={{color:"#fb923c",fontSize:T.fSM,fontWeight:800,marginTop:0}}>•</span>
          <span style={{fontSize:T.fSM,color:T.text,lineHeight:1.45,flex:1}}>{s.label[_lang]||s.label.en}</span>
        </div>)}
      </div>}
    </div>}
    {/* Source footer */}
    <div style={{padding:"10px 20px 20px",fontSize:T.fXS,color:T.dim,textAlign:"center",lineHeight:1.5}}>
      {L("source")}: CDC "Learn the Signs. Act Early." (Fev 2022) · WHO MGRS · SBP
    </div>
    {/* v11.9.60: Add picker — centrado vertical (era bottom sheet em v11.9.56) */}
    {showAdd&&<div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,6,22,0.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"calc(20px + env(safe-area-inset-top)) 20px calc(20px + env(safe-area-inset-bottom))"}} onClick={()=>{setShowAdd(false);setPickedKey(null)}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:440,maxHeight:"calc(100vh - 40px - env(safe-area-inset-top) - env(safe-area-inset-bottom))",background:"radial-gradient(ellipse at 50% 0%, #15124a 0%, #080a26 65%), #040616",borderRadius:22,border:`1px solid ${T.gBSoft}`,boxShadow:"0 24px 60px -16px rgba(0,0,0,0.7), 0 0 0 1px rgba(167,139,250,0.08)",padding:"18px 18px 22px",overflowY:"auto",animation:"slideUp .3s cubic-bezier(0.22,1,0.36,1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{flex:1,fontSize:T.fLG,fontWeight:800,letterSpacing:-0.2,minWidth:0}}>{picked?(picked.label[_lang]||picked.label.en):L("pickMilestone")}</div>
          <button onClick={()=>{setShowAdd(false);setPickedKey(null)}} style={{width:40,height:40,borderRadius:12,background:T.glass,border:`1px solid ${T.gBSoft}`,color:T.sub,fontSize:T.fXL,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
        </div>
        {!picked?<>
          <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
            {[{k:"all",l:_lang==="en"?"All":"Todos"},{k:"social_emotional",l:L("catSocial")},{k:"language",l:L("catLanguage")},{k:"motor_gross",l:L("catMotorGross")},{k:"motor_fine",l:L("catMotorFine")},{k:"cognitive",l:L("catCognitive")}].map(c=>
              <button key={c.k} onClick={()=>setPickedCategory(c.k)} style={{padding:"5px 11px",borderRadius:8,background:pickedCategory===c.k?`${T.accent}28`:T.glass,border:`1px solid ${pickedCategory===c.k?T.accent+"55":T.gBSoft}`,fontSize:T.fXS,fontWeight:700,color:pickedCategory===c.k?"#c4b5fd":T.sub,letterSpacing:0.3,textTransform:"uppercase",whiteSpace:"nowrap",flexShrink:0}}>{c.l}</button>
            )}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {all.filter(m=>!doneKeys.has(m.key)&&(pickedCategory==="all"||m.category===pickedCategory))
              .sort((a,b)=>a.checkupAge-b.checkupAge)
              .slice(0,40)
              .map(m=>{
                const col=catColors[m.category]||T.accent;
                return<button key={m.key} onClick={()=>setPickedKey(m.key)} style={{padding:"10px 12px",borderRadius:11,background:"rgba(20,26,60,0.32)",border:`1px solid ${T.gBSoft}`,display:"flex",alignItems:"center",gap:10,textAlign:"left",cursor:"pointer"}}>
                  <div style={{width:6,height:32,borderRadius:3,background:col,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:T.fMD,fontWeight:700,color:T.text,letterSpacing:-0.1}}>{m.label[_lang]||m.label.en}</div>
                    <div style={{fontSize:T.fXS,color:T.dim,marginTop:1}}>{m.checkupAge}m · {catLabels[m.category]}</div>
                  </div>
                </button>
              })
            }
          </div>
        </>:<>
          <div style={{fontSize:T.fSM,color:T.sub,lineHeight:1.5,marginBottom:14}}>{picked.description[_lang]||picked.description.en}</div>
          {picked.tip&&<div style={{padding:"10px 12px",borderRadius:10,background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.16)",fontSize:T.fSM,color:T.sub,lineHeight:1.5,marginBottom:14}}>{picked.tip[_lang]||picked.tip.en}</div>}
          <Fld label={_lang==="en"?"Date":"Data"}>
            <input type="date" value={pickedDate} onChange={e=>setPickedDate(e.target.value)} max={todayStr()} style={{width:"100%",padding:"14px 12px",background:"rgba(14,18,48,0.7)",border:`1px solid ${T.gBSoft}`,borderRadius:12,color:T.text,fontSize:T.fLG,fontWeight:700,textAlign:"center",fontVariantNumeric:"tabular-nums",outline:"none",colorScheme:"dark",boxSizing:"border-box"}}/>
          </Fld>
          <Fld label={L("addNote")}>
            <textarea value={pickedNote} onChange={e=>setPickedNote(e.target.value)} rows={3} placeholder={_lang==="en"?"e.g. smiled when I came in the room":"Ex: sorriu quando entrei no quarto"} style={{width:"100%",padding:"12px 14px",background:"rgba(14,18,48,0.7)",border:`1px solid ${T.gBSoft}`,borderRadius:12,color:T.text,fontSize:T.fMD,outline:"none",resize:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </Fld>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setPickedKey(null)} style={{flex:1,padding:"12px 0",borderRadius:11,background:T.glass,border:`1px solid ${T.gBSoft}`,color:T.sub,fontSize:T.fMD,fontWeight:700,cursor:"pointer"}}>{_lang==="en"?"Back":"Voltar"}</button>
            <button disabled={busy} onClick={saveMilestone} style={{flex:2,padding:"12px 0",borderRadius:11,background:"linear-gradient(135deg,#facc15,#f59e0b)",border:"none",color:"#1a1f2e",fontSize:T.fMD,fontWeight:800,letterSpacing:0.3,boxShadow:"0 4px 14px -4px rgba(250,204,21,0.5)",opacity:busy?0.6:1,cursor:busy?"not-allowed":"pointer"}}>{_lang==="en"?"Save":"Salvar"}</button>
          </div>
        </>}
      </div>
    </div>}
  </div>);
});

// Starfield gerado 1x por sessão (dados aleatórios mas estáveis enquanto o app tá aberto).
// Extraído pra cá + React.memo pra nunca re-renderizar junto com o App. v10.5.3.
const _STARFIELD_COLORS = ["rgba(251,191,36,0.6)","rgba(167,139,250,0.5)","rgba(52,211,153,0.45)","rgba(96,165,250,0.5)","rgba(244,114,182,0.4)","rgba(251,191,36,0.5)","rgba(200,210,255,0.6)","rgba(167,139,250,0.45)"];
