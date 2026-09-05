function Icon({name,size=20,color="currentColor",fill="none"}){
  const id="ig"+(++_ic);
  const s=size,v="0 0 24 24",sw=1.5,lc="round",lj="round";
  const gFill=`url(#${id})`;
  const grad=<defs><linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={color} stopOpacity="0.4"/><stop offset="100%" stopColor={color} stopOpacity="0.12"/></linearGradient></defs>;
  const p={width:s,height:s,viewBox:v,fill:"none",stroke:color,strokeWidth:sw,strokeLinecap:lc,strokeLinejoin:lj};
  const pu={width:s,height:s,viewBox:v,fill:"none",stroke:color,strokeWidth:2,strokeLinecap:lc,strokeLinejoin:lj};
  const icons={
    bottle:<svg {...p}>{grad}<path d="M20 11c1.1-1.4 1.3-3.3.7-4.9l.8-.8a1.5 1.5 0 0 0-2.8-2.8l-.8.8A5.33 5.33 0 0 0 13 4"/><path d="M11.3 3.7a1 1 0 0 1 1.4 0l7.6 7.6a1 1 0 0 1 0 1.4l-1.6 1.6a1 1 0 0 1-1.4 0L9.7 6.7a1 1 0 0 1 0-1.4Z" fill={gFill}/><path d="m10 7l-7.3 7.3c-.9.9-.9 2.5 0 3.4l3.6 3.6c.9.9 2.5.9 3.4 0L17 14M4 13l2 2m1-5l2 2" strokeWidth="2"/></svg>,
    spoon:<svg {...p}>{grad}<path d="M8.8 13.2 3 19a1.4 1.4 0 0 0 2 2l5.8-5.8"/><ellipse cx="15" cy="9" rx="4.5" ry="6" transform="rotate(45 15 9)" fill={gFill}/><ellipse cx="15" cy="9" rx="2.4" ry="3.6" transform="rotate(45 15 9)" opacity="0.45"/></svg>,
    breast:<svg {...p}>{grad}<path d="M5 6Q5 2 10 2Q15 2 16 6Q17 10 16 13Q15 16 12 17Q9 16 7 13Q5 10 5 6z" fill={gFill}/><circle cx="16" cy="10" r="1.2" fill={gFill}/><path d="M16 13l1 2.5a1.5 1.5 0 01-3 0L16 13z" fill={gFill}/></svg>,
    moon:<svg {...p}>{grad}<path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" fill={gFill}/></svg>,
    bed:<svg {...pu}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
    sun:<svg {...p}>{grad}<circle cx="12" cy="12" r="5" fill={gFill}/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    cloud:<svg {...p}>{grad}<path d="M18 10h1a4 4 0 010 8H7a5 5 0 01-.5-9.96A7 7 0 0118 10z" fill={gFill}/></svg>,
    zap:<svg {...p}>{grad}<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={gFill}/></svg>,
    droplet:<svg {...p}>{grad}<path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" fill={gFill}/></svg>,
    diaper:<svg {...p}>{grad}<path d="M6 6h12c1 0 1.5.5 1.5 1.5v3c0 4-3 8-7.5 9.5-4.5-1.5-7.5-5.5-7.5-9.5v-3C4.5 6.5 5 6 6 6z" fill={gFill}/><path d="M4.5 8.5L3 7.5M19.5 8.5L21 7.5" strokeWidth="1.8"/><circle cx="12" cy="11" r="1.5" fill={gFill} stroke={color} strokeWidth="0.8" opacity="0.6"/></svg>,
    bath:<svg {...p}>{grad}<path d="M10 4L8 6m9 13v2M2 12h20M7 19v2M9 5L7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" strokeWidth="2"/></svg>,
    pill:<svg {...p}>{grad}<rect x="3" y="7" width="18" height="10" rx="5" fill={gFill}/><line x1="12" y1="7" x2="12" y2="17" stroke={color} strokeWidth="0.8" opacity="0.4"/></svg>,
    thermo:<svg {...p}>{grad}<path d="M14 14.76V3.5a2 2 0 10-4 0v11.26a4 4 0 104 0z" fill={gFill}/><circle cx="12" cy="17" r="1.5" fill={color} opacity="0.5"/></svg>,
    home:<svg {...pu}><path d="M3 12l9-8 9 8"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>,
    clock:<svg {...pu}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>,
    chart:<svg {...pu}><line x1="4" y1="20" x2="4" y2="14"/><line x1="10" y1="20" x2="10" y2="8"/><line x1="16" y1="20" x2="16" y2="4"/></svg>,
    gear:<svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-2.82 1.18V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 003.33-.33V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00.33 3.33H21a2 2 0 010 4h-.09"/></svg>,
    plus:<svg width={s} height={s} viewBox={v} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap={lc}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    back:<svg width={s} height={s} viewBox={v} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap={lc} strokeLinejoin={lj}><polyline points="15 18 9 12 15 6"/></svg>,
    forward:<svg width={s} height={s} viewBox={v} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap={lc} strokeLinejoin={lj}><polyline points="9 18 15 12 9 6"/></svg>,
    check:<svg width={s} height={s} viewBox={v} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap={lc} strokeLinejoin={lj}><polyline points="20 6 9 17 4 12"/></svg>,
    x:<svg width={s} height={s} viewBox={v} fill="none" stroke={color} strokeWidth={2} strokeLinecap={lc}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    list:<svg {...pu}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>,
    star:<svg width={s} height={s} viewBox={v} fill={fill} stroke={color} strokeWidth={1.8} strokeLinejoin={lj}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    bell:<svg {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    play:<svg width={s} height={s} viewBox={v}><polygon points="5 3 19 12 5 21 5 3" fill={color} stroke="none"/></svg>,
    stop:<svg width={s} height={s} viewBox={v}><rect x="5" y="5" width="14" height="14" fill={color} stroke="none" rx="2"/></svg>,
    copy:<svg {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
    download:<svg {...pu}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    target:<svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    arrowUp:<svg {...pu}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    arrowDown:<svg {...pu}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    ruler:<svg {...p}>{grad}<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" fill={gFill}/><path d="M14.5 12.5l2 -2m-5 -1l2 -2m-5 -1l2 -2m7 11l2 -2" strokeWidth="2"/></svg>,
    gift:<svg {...p}>{grad}<path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" fill={gFill}/><rect x="2" y="7" width="20" height="5" rx="2" fill={gFill}/><line x1="12" y1="7" x2="12" y2="22"/><path d="M12 7c-1.5-2-4-2.5-4-1s2 3.5 4 3.5c2 0 4-2 4-3.5s-2.5-1-4 1z" fill={gFill}/></svg>,
    trash:<svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
    poop:<svg {...p}>{grad}<ellipse cx="12" cy="19" rx="8" ry="3" fill={gFill}/><ellipse cx="11" cy="14" rx="6" ry="2.5" fill={gFill}/><ellipse cx="12" cy="10" rx="4.5" ry="2.2" fill={gFill}/><ellipse cx="11" cy="6" rx="2.8" ry="1.8" fill={gFill}/></svg>,
    baby:<svg {...p}>{grad}<path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6a9 9 0 0 1-17.6 0a2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1m-3 5h.01" fill={gFill}/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5m1-4h.01" strokeWidth="2"/></svg>,
    pencil:<svg {...pu}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    search:<svg {...pu}><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16" y2="16"/></svg>,
    share:<svg {...pu}><path d="M12 4v12"/><polyline points="7 9 12 4 17 9"/><path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/></svg>,
  };
  return icons[name]||<svg {...p}><circle cx="12" cy="12" r="8"/></svg>;
}


// ── THEME ──
// v11.9.39: escala tipográfica (7 níveis) — auditoria UX item #5. Consolidou ~390 valores
// magic-number inline pros constantes. Mapping aplicado:
//   T.fXS=9   (eyebrow, caption, hour marks)    — absorveu 8, 8.5, 9, 9.5
//   T.fSM=11  (labels, body sm, badges)          — absorveu 10, 10.5, 11, 11.5
//   T.fMD=13  (body, primary detail)             — absorveu 12, 12.5, 13
//   T.fLG=15  (sub-heading)                       — absorveu 14, 14.5, 15, 16
//   T.fXL=17  (heading, modal title)              — absorveu 17, 18, 19
//   T.f2XL=22 (display sm)                        — absorveu 20, 22
//   T.f3XL=28 (display)                           — absorveu 26, 28
// Sobram inline apenas hero displays raros (34, 36, 52) — 5 ocorrências total.
const T={bg1:"#070b1e",bg2:"#0d1133",bg3:"#141a42",glass:"rgba(22,28,60,0.6)",gB:"rgba(90,100,180,0.12)",gBSoft:"rgba(255,255,255,0.06)",insetTop:"0 1px 0 0 rgba(255,255,255,0.04) inset",insetTopStrong:"0 1px 0 0 rgba(255,255,255,0.08) inset",text:"#e4e6f5",sub:"#a3aac8",dim:"#555a80",accent:"#8b7cf6",green:"#34d399",greenS:"rgba(52,211,153,0.1)",purple:"#a78bfa",purpleS:"rgba(167,139,250,0.1)",pink:"#f472b6",pinkS:"rgba(244,114,182,0.1)",amber:"#fbbf24",amberS:"rgba(251,191,36,0.1)",orange:"#fb923c",orangeS:"rgba(251,146,60,0.1)",blue:"#38bdf8",blueS:"rgba(56,189,248,0.12)",red:"#f87171",redS:"rgba(248,113,113,0.1)",cyan:"#22d3ee",cyanS:"rgba(34,211,238,0.1)",heading:"#f0f2ff",label:"#7a80a8",lilac:"#c4b5fd",fXS:9,fSM:11,fMD:13,fLG:15,fXL:17,f2XL:22,f3XL:28,
  // v11.9.116 (auditoria de design): escala fechada de borderRadius — 20 valores soltos
  // no codebase faziam o papel de 5. Mesma filosofia da escala T.f* (7 níveis, "não cresce").
  rXS:8,rSM:9,rMD:12,rLG:18,rXL:22,
  // Elevação real (sombra externa sutil) pros cards de conteúdo — T.insetTop sozinho é só
  // um brilho de 1px na borda, não separa o card do fundo estrelado. box-shadow puro
  // (sem backdrop-filter) = custo zero adicional em iPhone.
  cardShadow:"0 1px 0 0 rgba(255,255,255,0.05) inset, 0 6px 20px -12px rgba(0,0,0,0.45)",
  cardShadowRaised:"0 1px 0 0 rgba(255,255,255,0.06) inset, 0 10px 28px -14px rgba(0,0,0,0.55)",
  // Fundo compartilhado das 4 páginas full-screen (Growth/Behavior/Profile/Milestones) —
  // era string idêntica duplicada 4x.
  pageBg:"radial-gradient(ellipse 140% 55% at 50% 100%, #1a1f52 0%, transparent 70%), radial-gradient(ellipse at 50% 0%, #10153d 0%, #070b1e 65%), #070b1e",
  // Balão de tooltip dos gráficos (Growth/Behavior/Stats dayPill) — 3ª duplicata do mesmo par bg+shadow.
  tooltipBg:"linear-gradient(180deg,rgba(32,38,76,0.98),rgba(20,26,58,0.97))",
  tooltipShadow:"0 6px 18px -6px rgba(0,0,0,0.6), 0 1px 0 0 rgba(255,255,255,0.06) inset",
};
// v11.9.116: tile de ícone (avatar circular/quadrado atrás de um Icon) — a mesma fórmula
// "linear-gradient(135deg, cor 2 stops)" se repetia ~15x com drift de alpha (copy-paste).
// 3º stop quebra o "flat 2-stop genérico"; boxShadow ganha sombra externa sutil além do
// inset (dava só brilho de borda, sem separar do card atrás).
function iconTile(col){
  return{background:`linear-gradient(150deg, ${col}42 0%, ${col}18 55%, ${col}08 100%)`,border:`1px solid ${col}50`,boxShadow:`0 1px 0 0 rgba(255,255,255,0.08) inset, 0 2px 6px -3px ${col}40`};
}
T.iconTile=iconTile;
// v11.9.67: estilo base de input hoisted (era duplicado 3x em Sheet/Profile/Growth).
// Spread + override pros casos especiais: {...INP_BASE, textAlign:"center"} etc.
const INP_BASE={width:"100%",maxWidth:"100%",boxSizing:"border-box",WebkitAppearance:"none",appearance:"none",padding:"17px 18px",background:"rgba(20,26,60,0.55)",border:`1px solid ${T.gBSoft}`,borderRadius:16,color:T.text,fontSize:T.fXL,fontWeight:600,letterSpacing:-0.2,outline:"none",boxShadow:T.insetTop};
const TYPES={bottle:{label:{pt:"Mamadeira",en:"Bottle"},icon:"bottle",color:T.green,bg:T.greenS},nursing:{label:{pt:"Amamentação",en:"Nursing"},icon:"breast",color:T.blue,bg:T.blueS},food:{label:{pt:"Comida",en:"Food"},icon:"spoon",color:T.amber,bg:T.amberS},sleep:{label:{pt:"Sono",en:"Bedtime"},icon:"bed",color:T.purple,bg:T.purpleS},wakeup:{label:{pt:"Acordou",en:"Woke up"},icon:"sun",color:T.amber,bg:T.amberS},nap:{label:{pt:"Soneca",en:"Nap"},icon:"cloud",color:T.purple,bg:T.purpleS},nightwaking:{label:{pt:"Acordou à noite",en:"Night waking"},icon:"zap",color:T.orange,bg:T.orangeS},diaper:{label:{pt:"Fralda",en:"Diaper"},icon:"diaper",color:T.pink,bg:T.pinkS},medicine:{label:{pt:"Medicamento",en:"Medicine"},icon:"pill",color:T.amber,bg:T.amberS},temperature:{label:{pt:"Temperatura",en:"Temperature"},icon:"thermo",color:T.red,bg:T.redS},bath:{label:{pt:"Banho",en:"Bath"},icon:"bath",color:T.cyan,bg:T.cyanS},tummytime:{label:{pt:"Tummy time",en:"Tummy time"},icon:"baby",color:T.amber,bg:T.amberS},growth:{label:{pt:"Crescimento",en:"Growth"},icon:"ruler",color:"#a3e635",bg:"rgba(163,230,53,0.1)"},milestone:{label:{pt:"Marco",en:"Milestone"},icon:"star",color:"#facc15",bg:"rgba(250,204,21,0.10)"},dayevent:{label:{pt:"Evento do dia",en:"Day event"},icon:"zap",color:"#fb923c",bg:"rgba(251,146,60,0.10)"}};

// ── i18n ──
const I={
  today:{pt:"Hoje",en:"Today"},
  days:{pt:"dias",en:"days"},
  dailyGoal:{pt:"Meta diária",en:"Daily goal"},
  lastNight:{pt:"Noite passada",en:"Last night"},
  sleep:{pt:"sono",en:"sleep"},
  wokeUp:{pt:"acordou",en:"woke up"},
  milk:{pt:"leite",en:"milk"},
  milkVsWeek:{pt:"leite vs sem. passada",en:"milk vs last week"},
  sleepLabel:{pt:"sono",en:"sleep"},
  repeatLast:{pt:"Repetir último",en:"Repeat last"},
  history:{pt:"Histórico",en:"History"},
  summary:{pt:"Resumo",en:"Summary"},
  growth:{pt:"Crescimento",en:"Growth"},
  profile:{pt:"Perfil",en:"Profile"},
  home:{pt:"Início",en:"Home"},
  save:{pt:"Salvar",en:"Save"},
  update:{pt:"Atualizar",en:"Update"},
  cancel:{pt:"Cancelar",en:"Cancel"},
  // v11.0 a11y keys — usados em aria-labels pra botões ícone-only.
  close:{pt:"Fechar",en:"Close"},
  addEvent:{pt:"Adicionar evento",en:"Add event"},
  stats:{pt:"Estatísticas",en:"Statistics"},
  settings:{pt:"Configurações",en:"Settings"},
  notifications:{pt:"Notificações",en:"Notifications"},
  // v11.2 backup keys
  backup:{pt:"Backup",en:"Backup"},
  exportData:{pt:"Exportar dados",en:"Export data"},
  importData:{pt:"Importar backup",en:"Import backup"},
  lastBackup:{pt:"Último backup",en:"Last backup"},
  never:{pt:"nunca",en:"never"},
  backupDesc:{pt:"Baixa todos os registros, perfil e lembretes como JSON. Backup automático a cada 24h fica salvo no device.",en:"Downloads all entries, profile and reminders as JSON. Auto backup every 24h saved on device."},
  importConfirm:{pt:"Importar vai SUBSTITUIR todos os dados atuais pelos do arquivo. Essa ação não pode ser desfeita. Continuar?",en:"Importing will REPLACE all current data with the file's data. This cannot be undone. Continue?"},
  exportedJust:{pt:"Backup exportado agora",en:"Backup just exported"},
  importedOk:{pt:"Backup restaurado",en:"Backup restored"},
  importErr:{pt:"Arquivo inválido",en:"Invalid file"},
  delete:{pt:"Apagar",en:"Delete"},
  undo:{pt:"Desfazer",en:"Undo"},
  registered:{pt:"registrado",en:"registered"},
  removed:{pt:"removido",en:"removed"},
  updated:{pt:"atualizado",en:"updated"},
  day:{pt:"Dia",en:"Day"},
  time:{pt:"Horário",en:"Time"},
  duration:{pt:"Duração",en:"Duration"},
  endTime:{pt:"Horário fim",en:"End time"},
  wokeAt:{pt:"Acordou às",en:"Woke at"},
  amount:{pt:"Quantidade (ml)",en:"Amount (ml)"},
  notes:{pt:"Observações",en:"Notes"},
  side:{pt:"Lado",en:"Side"},
  left:{pt:"Esquerdo",en:"Left"},right:{pt:"Direito",en:"Right"},both:{pt:"Ambos",en:"Both"},
  type:{pt:"Tipo",en:"Type"},
  wet:{pt:"Xixi",en:"Wet"},dirty:{pt:"Cocô",en:"Dirty"},
  all:{pt:"Tudo",en:"All"},
  noEntries:{pt:"Nenhum registro",en:"No entries"},
  tapToAdd:{pt:"Toque + para registrar",en:"Tap + to add"},
  language:{pt:"Idioma",en:"Language"},
  birthData:{pt:"Dados de nascimento",en:"Birth data"},
  weight:{pt:"Peso",en:"Weight"},length:{pt:"Comprimento",en:"Length"},head:{pt:"Cabeça",en:"Head"},
  viewGrowth:{pt:"Ver crescimento e percentis",en:"View growth & percentiles"},
  name:{pt:"Nome",en:"Name"},birthDate:{pt:"Data de nascimento",en:"Date of birth"},
  dailyMilkGoal:{pt:"Meta diária de leite (ml)",en:"Daily milk goal (ml)"},
  measurement:{pt:"Medição",en:"Measurement"},
  savedMeds:{pt:"Medicamentos salvos",en:"Saved medicines"},
  dose:{pt:"Dose",en:"Dose"},
  reg:{pt:"reg.",en:"entries"},
  // v11.9.40: rotina diária
  routineSection:{pt:"Rotina diária",en:"Daily routine"},
  routineHelp:{pt:"Horários alvo recomendados pela pediatra. O app marca ✓ quando o evento acontece perto do horário — e a rotina inteira se ajusta ao horário real de acordar.",en:"Target times recommended by the pediatrician. The app marks ✓ when the event happens near its time — and the whole routine adjusts to the real wake-up time."},
  routineEnable:{pt:"Ativar rotina",en:"Enable routine"},
  bath:{pt:"Banho",en:"Bath"},
  bedtime:{pt:"Bedtime",en:"Bedtime"},
  wakeLabel:{pt:"Acordar",en:"Wake up"},
  bottlesDay:{pt:"Mamadas/dia",en:"Bottles/day"},
  napsDay:{pt:"Sonecas · 4 por dia",en:"Naps · 4 per day"},
  napNth:{pt:["1ª soneca","2ª soneca","3ª soneca","4ª soneca"],en:["1st nap","2nd nap","3rd nap","4th nap"]},
  // v11.9.61: conquistas (badges)
  achievementsTitle:{pt:"Conquistas",en:"Achievements"},
  earnedCount:{pt:"conquistadas",en:"earned"},
  // v11.9.56: marcos de crescimento (milestones)
  milestonesTitle:{pt:"Marcos",en:"Milestones"},
  milestonesDone:{pt:"feitos",en:"done"},
  upcomingMilestones:{pt:"Próximos marcos",en:"Upcoming milestones"},
  nextMilestone:{pt:"Próximo marco",en:"Next milestone"},
  expectedAround:{pt:"esperado em torno de",en:"expected around"},
  expectedNow:{pt:"esperado agora",en:"expected now"},
  noMilestonesYet:{pt:"Nenhum marco registrado ainda. Toque + pra adicionar o primeiro.",en:"No milestones logged yet. Tap + to add the first one."},
  pickMilestone:{pt:"Escolher marco",en:"Pick milestone"},
  addNote:{pt:"Nota (opcional)",en:"Note (optional)"},
  catMotorGross:{pt:"Motor grosso",en:"Gross motor"},
  catMotorFine:{pt:"Motor fino",en:"Fine motor"},
  catLanguage:{pt:"Linguagem",en:"Language"},
  catSocial:{pt:"Social",en:"Social"},
  catCognitive:{pt:"Cognitivo",en:"Cognitive"},
  concerningSigns:{pt:"Sinais pra conversar com a pediatra",en:"Signs to discuss with pediatrician"},
  concerningSignsHelp:{pt:"Não é alarme — apenas pontos de atenção pra trazer no próximo retorno.",en:"Not an alarm — just attention points to bring up at the next visit."},
  seeAll:{pt:"ver tudo",en:"see all"},
  source:{pt:"Fonte",en:"Source"},
  weeksOld:{pt:"sem",en:"wks"},
  monthsOld:{pt:"meses",en:"months"},
  // v11.9.40: card do Home
  nextEvent:{pt:"Próximo na rotina",en:"Next in routine"},
  onSchedule:{pt:"no horário",en:"on schedule"},
  routineDone:{pt:"Rotina completa hoje",en:"Routine done today"},
  routineDoneSub:{pt:"Todos os horários alvo cumpridos. Boa noite.",en:"All target times met. Goodnight."},
  earlyMin:{pt:"em",en:"in"},
  lateMin:{pt:"atrasado",en:"late"},
  scheduledFor:{pt:"alvo",en:"target"},
};
function typeLabel(type,lang){const t=TYPES[type];return t?.label?.[lang]||t?.label?.en||type}
// Global lang for components without prop
let _lang="en";
function L(key){return I[key]?.[_lang]||I[key]?.en||key}
function TL(type){return typeLabel(type,_lang)}
// v11.9.94: flexão de gênero PT pros toasts — "Mamadeira atualizadA", "Sono atualizadO".
// FEM_TYPES = tipos com label feminino; flexed troca o "-o" final por "-a" quando preciso.
const FEM_TYPES=["bottle","nursing","food","diaper","nap","temperature"];
function flexed(type,key){const w=I[key]?.[_lang]||I[key]?.en||key;if(_lang!=="pt")return w;return FEM_TYPES.includes(type)?w.replace(/o$/,"a"):w}

// ── UI COMPONENTS ──
// Ring é memoizado (v10.5.1) — props são estáveis na maior parte do tempo, só `tick` e `activeTimer` mudam.
// Com memo, qualquer re-render do App por outras razões (entries, profile, etc) não força redraw do SVG pesado do Ring.
