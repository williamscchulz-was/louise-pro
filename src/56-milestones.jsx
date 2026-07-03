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
const MilestonesPage = React.memo(function MilestonesPage({entries,birthDate,profile,onBack,onAddEntry,onDeleteEntry,lang}){
  const[confirmDelKey,setConfirmDelKey]=useState(null); // v11.9.65: 2-step inline delete (substitui confirm() nativo)
  const all=window.DEV_MILESTONES||[];
  const allSigns=window.CONCERNING_SIGNS||[];
  const milestoneEntries=entries.filter(e=>e.type==="milestone")
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
        <div style={{fontSize:T.fSM,color:T.sub,marginTop:1,fontVariantNumeric:"tabular-nums"}}>{milestoneEntries.length} {L("milestonesDone")} · {ageMonths}m</div>
      </div>
      <button onClick={()=>{setPickedKey(null);setShowAdd(true)}} aria-label={_lang==="en"?"Add milestone":"Adicionar marco"} style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#facc15,#f59e0b)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",color:"#1a1f2e",fontSize:24,fontWeight:800,boxShadow:"0 4px 14px -4px rgba(250,204,21,0.5)",cursor:"pointer"}}>+</button>
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
          const isExpected=m.checkupAge<=ageMonths+1;
          const col=catColors[m.category]||T.accent;
          return<button key={m.key} onClick={()=>{setPickedKey(m.key);setShowAdd(true)}} style={{padding:"10px 12px",borderRadius:12,background:`linear-gradient(135deg,${col}14,${col}06)`,border:`1px solid ${col}28`,display:"flex",alignItems:"center",gap:11,textAlign:"left",cursor:"pointer"}}>
            <div style={{width:32,height:32,borderRadius:9,background:`${col}1a`,border:`1px solid ${col}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name="star" size={15} color={col}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:T.fMD,fontWeight:700,color:T.text,letterSpacing:-0.1}}>{m.label[_lang]||m.label.en}</div>
              <div style={{fontSize:T.fXS,color:T.dim,marginTop:1}}>{isExpected?L("expectedNow"):`${L("expectedAround")} ${m.checkupAge}m`}</div>
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
              <button aria-label={confirmDelKey===e.id?(_lang==="en"?"Confirm delete":"Confirmar exclusão"):(_lang==="en"?"Delete":"Excluir")} onClick={()=>{if(confirmDelKey!==e.id){setConfirmDelKey(e.id);if(window.Haptic&&Haptic.warning)Haptic.warning();setTimeout(()=>setConfirmDelKey(prev=>prev===e.id?null:prev),3000);return}setConfirmDelKey(null);onDeleteEntry(e.id)}} style={{fontSize:T.fXS,color:confirmDelKey===e.id?"#fca5a5":T.dim,marginTop:6,padding:"7px 12px",minHeight:36,background:confirmDelKey===e.id?"rgba(248,113,113,0.16)":"transparent",border:confirmDelKey===e.id?"1px solid rgba(248,113,113,0.5)":"1px solid transparent",borderRadius:9,cursor:"pointer",opacity:confirmDelKey===e.id?1:0.6,letterSpacing:0.2,fontWeight:confirmDelKey===e.id?700:500}}>{confirmDelKey===e.id?(_lang==="en"?"Tap to confirm":"Tocar p/ confirmar"):(_lang==="en"?"delete":"excluir")}</button>
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
