
const {useState, useEffect, useCallback, useRef, useMemo} = React;

// ╔═══════════════════════════════════════════════╗
// ║  LOUISE PRO — Baby Tracker                    ║
// ║  v2.0.0                                       ║
// ╚═══════════════════════════════════════════════╝
const APP_VERSION = "11.9.92";
// v11.9.78: silhueta mãe+bebê vetorizada (potrace do assets/icons/icon-512.png) pro splash
// que se desenha (efeito traço -> preenche). Mesma logo de sempre, agora em vetor.
const LOUISE_SIL="M 251.500 82.468 C 235.776 85.897, 226.386 91.743, 207.976 109.561 C 200.537 116.760, 190.187 125.805, 184.976 129.660 C 169.740 140.932, 164.231 148.366, 163.271 158.950 C 161.899 174.074, 171.303 192.232, 185.602 202.070 L 189.899 205.027 187.773 200.263 C 185.328 194.785, 184.013 179.587, 185.827 177.773 C 186.607 176.993, 188.695 178.348, 193.255 182.594 C 208.520 196.807, 229.709 203.970, 261 205.494 C 290.767 206.944, 296.365 210.624, 297.195 229.285 C 298.209 252.073, 310.558 265.347, 336.430 271.461 C 358.051 276.569, 369.241 287.034, 377.365 309.739 C 381.748 321.989, 381.971 348.244, 377.807 361.829 L 375.255 370.157 379.086 366.416 C 381.193 364.359, 382.746 362.399, 382.538 362.061 C 382.329 361.724, 384.200 359.209, 386.695 356.474 C 389.191 353.738, 390.842 352.196, 390.366 353.047 C 389.888 353.902, 390.281 353.743, 391.245 352.693 C 392.204 351.647, 392.733 350.377, 392.420 349.871 C 392.107 349.365, 392.447 349.074, 393.176 349.225 C 393.927 349.381, 394.435 348.714, 394.350 347.683 C 394.267 346.684, 394.452 346.119, 394.760 346.427 C 395.697 347.364, 398.167 343.080, 397.403 341.844 C 396.972 341.146, 397.130 340.962, 397.802 341.377 C 399.397 342.363, 406.479 327.011, 409.604 315.794 C 413.319 302.459, 414.088 277.794, 411.217 264 C 407.403 245.665, 400.295 231.180, 386.379 213.379 C 371.896 194.852, 368.533 187.974, 364.475 168.581 C 361.439 154.074, 359.684 148.435, 355.737 140.500 C 345.047 119.010, 322.901 97.177, 302.330 87.850 C 288.140 81.416, 266.720 79.148, 251.500 82.468 M 188.202 189.559 C 188.850 198.574, 192.162 205.524, 200.034 214.382 C 208.861 224.316, 209.320 226.328, 206.395 242.268 C 204.366 253.320, 204.694 253.814, 214.300 254.208 L 221.424 254.500 222.096 257.801 C 222.920 261.849, 223.298 262.250, 226.286 262.250 C 227.963 262.250, 228.965 263.068, 229.712 265.047 C 230.473 267.064, 231.567 267.936, 233.634 268.172 C 235.891 268.430, 237.052 269.524, 239.101 273.323 C 245.949 286.021, 252.592 285.757, 268.500 272.155 C 279.704 262.575, 282.113 261.604, 282.533 266.500 C 282.580 267.050, 283.702 269.750, 285.025 272.500 C 293.960 291.063, 278.597 315.916, 244.309 338.370 C 238.704 342.041, 232.456 346.946, 230.424 349.272 C 227.295 352.852, 226.826 353.117, 227.361 351 C 227.709 349.625, 228.272 346.025, 228.611 343 C 228.961 339.888, 230.214 335.981, 231.499 334 C 237.406 324.895, 234.368 318.061, 223.060 315.016 C 218.319 313.739, 215 315.451, 215 319.174 C 215 320.643, 214.491 320.910, 212.597 320.435 C 208.215 319.335, 207.550 323.926, 210.879 332.306 C 212.129 335.453, 210.993 338.338, 206.571 343.250 C 203.412 346.760, 204.120 347.014, 196.799 339.750 C 193.335 336.313, 188.813 332.243, 186.750 330.707 C 182.602 327.618, 181.983 326, 184.951 326 C 194.327 326, 202 321.386, 202 315.748 C 202 313.906, 202.486 311.914, 203.079 311.321 C 204.912 309.488, 206.145 302.140, 204.984 299.969 C 204.203 298.510, 204.352 297.219, 205.578 294.850 L 207.216 291.681 203.468 288.534 L 199.720 285.387 199.908 276.859 C 200.236 261.955, 194.622 251.892, 182.708 246.029 C 164.536 237.087, 139.947 240.523, 126.344 253.905 C 115.658 264.417, 111.100 284.730, 116.517 297.696 C 117.758 300.665, 117.651 301.669, 115.392 308.239 C 111.455 319.689, 108.813 331.926, 108.752 338.996 C 108.696 345.434, 114.348 370.142, 116.026 370.798 C 116.445 370.962, 116.540 372.045, 116.236 373.204 C 115.827 374.768, 116.024 375.103, 116.997 374.502 C 117.888 373.951, 118.069 374.080, 117.560 374.902 C 116.501 376.616, 117.820 381.229, 119.136 380.416 C 119.856 379.971, 119.977 380.498, 119.500 382 C 119.052 383.413, 119.159 384.020, 119.788 383.631 C 121.013 382.874, 122.262 385.767, 121.349 387.245 C 120.987 387.830, 121.144 388.029, 121.699 387.686 C 122.663 387.090, 128.639 394.422, 128.883 396.500 C 128.947 397.050, 129.338 397.510, 129.750 397.521 C 130.614 397.546, 161.021 428, 160.181 428 C 159.876 428, 160.904 429.334, 162.466 430.964 C 164.028 432.595, 165.660 433.710, 166.093 433.443 C 166.526 433.175, 168.144 434.541, 169.690 436.478 L 172.500 440 230.089 440 L 287.678 440 296.158 431.750 C 300.822 427.212, 310.947 416.300, 318.659 407.500 C 326.370 398.700, 333.520 390.825, 334.547 390 C 337.953 387.266, 318.346 412.279, 306.576 425.683 C 300.209 432.934, 295 439.092, 295 439.368 C 295 440.112, 343.405 440.165, 345.336 439.424 C 346.245 439.076, 346.740 438.388, 346.435 437.895 C 346.131 437.403, 346.331 437, 346.879 437 C 347.427 437, 347.820 436.212, 347.751 435.250 C 347.554 432.483, 351.152 423.976, 352.235 424.645 C 352.837 425.017, 352.939 424.382, 352.500 423 C 352.017 421.479, 352.141 420.969, 352.881 421.427 C 353.568 421.851, 353.755 421.525, 353.382 420.552 C 353.054 419.698, 353.270 419, 353.862 419 C 354.454 419, 354.650 418.252, 354.299 417.336 C 353.901 416.299, 354.058 415.918, 354.717 416.325 C 355.299 416.684, 355.754 416.421, 355.730 415.739 C 355.614 412.530, 356.087 410.936, 356.989 411.493 C 357.555 411.843, 357.723 411.442, 357.382 410.552 C 357.054 409.698, 357.270 409, 357.862 409 C 358.454 409, 358.650 408.252, 358.299 407.336 C 357.895 406.283, 358.056 405.916, 358.737 406.337 C 359.434 406.768, 359.614 406.241, 359.249 404.845 C 358.893 403.485, 359.071 402.926, 359.730 403.333 C 360.304 403.688, 360.754 403.421, 360.730 402.739 C 360.614 399.530, 361.087 397.936, 361.989 398.493 C 362.555 398.843, 362.723 398.442, 362.382 397.552 C 362.054 396.698, 362.270 396, 362.862 396 C 363.453 396, 363.678 395.325, 363.362 394.500 C 363.045 393.675, 363.270 393, 363.862 393 C 364.454 393, 364.650 392.252, 364.299 391.336 C 363.872 390.225, 364.045 389.910, 364.819 390.388 C 365.575 390.856, 365.771 390.566, 365.382 389.552 C 365.054 388.698, 365.270 388, 365.862 388 C 366.453 388, 366.678 387.325, 366.362 386.500 C 366.045 385.675, 366.311 385, 366.952 385 C 367.593 385, 367.874 384.606, 367.576 384.124 C 367.022 383.227, 370.905 370.896, 373.441 365.500 C 375.677 360.741, 377.993 345.339, 377.997 335.208 C 378.003 316.444, 372.105 299.628, 361.499 288.172 C 354.722 280.852, 347.202 276.842, 335.114 274.100 C 307.682 267.880, 294.032 251.793, 294.006 225.654 C 293.993 212.789, 287.851 209.911, 256.500 208.075 C 227.061 206.352, 211.547 200.881, 190.602 184.837 L 187.704 182.617 188.202 189.559 M 122.849 317.595 C 122.670 327.002, 122.806 330.027, 123.680 336 C 124.315 340.338, 124.364 340.392, 125.051 337.500 C 125.443 335.850, 125.817 332.163, 125.882 329.307 C 125.976 325.153, 126.445 323.802, 128.223 322.557 C 134.037 318.484, 138.540 323.367, 139.441 334.722 C 139.781 339, 141.264 346.294, 142.737 350.932 C 144.946 357.884, 145.389 361.039, 145.263 368.913 L 145.110 378.463 149.454 382.508 C 158.932 391.334, 221.097 422.651, 227.472 421.811 C 229.249 421.577, 233.705 416.197, 245.537 400 C 261.952 377.530, 278.600 353.322, 275.797 356 C 273.883 357.829, 259.515 376.316, 248.207 391.500 C 240.834 401.400, 234.624 409.685, 234.407 409.911 C 233.509 410.845, 229.598 406.138, 227.003 401 C 222.687 392.456, 221 385.481, 221 376.184 L 221 367.730 218.920 370.375 C 217.776 371.829, 216.356 372.720, 215.765 372.355 C 215.170 371.987, 214.978 372.155, 215.334 372.732 C 215.688 373.305, 215.357 374.289, 214.598 374.919 C 213.455 375.867, 213.684 376.531, 215.932 378.782 C 217.836 380.689, 219.012 383.364, 219.873 387.747 C 221.373 395.389, 223.166 399.793, 227.597 406.718 C 235.085 418.425, 231.328 420.973, 216.237 414.425 C 189.780 402.946, 157.176 385.769, 151.138 380.129 C 148.264 377.444, 148.165 377.051, 148.191 368.425 C 148.213 361.370, 147.644 357.719, 145.473 351 C 143.820 345.880, 142.473 338.968, 142.087 333.618 C 141.468 325.022, 141.335 324.643, 137.973 321.837 C 136.063 320.242, 134.500 318.542, 134.500 318.059 C 134.500 316.858, 129.482 313, 127.921 313 C 127.226 313, 125.835 312.255, 124.829 311.345 C 123.073 309.756, 122.994 310.004, 122.849 317.595";
const CHANGELOG = window.CHANGELOG || [];

// ── WHO Growth Standards (loaded from who-growth.js) ──
const {WHO_GIRLS, interpolateLMS, calcZScore, zToPercentile, getPercentile} = window;

// ── HELPERS ──
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const todayStr=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
function nowTime(){const d=new Date();return`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`}
// v11.9.83: sugere as 3 ações com mais TENDÊNCIA agora. Puro (só lê histórico) — "aprende"
// conforme as entries acumulam. Nota = frequência naquela hora (recency-weighted) +
// o-que-costuma-seguir-o-último-evento + proximidade da rotina − cooldown (acabou de fazer).
// Sem dados? Os priors por faixa de horário dão um fallback de bom senso.
function suggestQuickActions(allEntries,todayList,nowMin,routine){
  const CANDS=["bottle","nursing","diaper","nap","sleep","bath","medicine"];
  const pm=t=>{const p=String(t||"").split(":");return (+p[0]||0)*60+(+p[1]||0)};
  const cdist=(a,b)=>{const d=Math.abs(a-b);return Math.min(d,1440-d)};
  const score={};CANDS.forEach(t=>score[t]=0);
  // prior por faixa de horário (cold start + leve viés)
  const h=Math.floor(nowMin/60);
  const PRIOR=h<5?["bottle","diaper","sleep"]:h<9?["bottle","diaper","nap"]:h<11?["nap","bottle","diaper"]:h<15?["bottle","nap","diaper"]:h<17?["nap","bottle","diaper"]:h<19?["bath","diaper","bottle"]:h<21?["sleep","bottle","diaper"]:["bottle","diaper","sleep"];
  PRIOR.forEach((t,i)=>{if(score[t]!=null)score[t]+=0.45-i*0.12});
  const today=todayStr();
  // 1) frequência naquela hora (±90min), peso por recência (meia-vida ~14d). Exclui hoje.
  const tod={};CANDS.forEach(t=>tod[t]=0);let todMax=0;
  (allEntries||[]).forEach(e=>{
    if(!CANDS.includes(e.type)||!e.time||e.date===today)return;
    const dist=cdist(pm(e.time),nowMin);if(dist>90)return;
    const da=Math.max(0,Math.round((Date.parse(today)-Date.parse(e.date))/86400000));
    tod[e.type]+=Math.exp(-da/14)*(1-dist/90);
  });
  CANDS.forEach(t=>{if(tod[t]>todMax)todMax=tod[t]});
  if(todMax>0)CANDS.forEach(t=>score[t]+=1.0*(tod[t]/todMax));
  // 2) sequência: o que costuma SEGUIR o último evento de hoje (dentro de 90min)
  const past=(todayList||[]).filter(e=>e.time&&pm(e.time)<=nowMin).sort((a,b)=>pm(b.time)-pm(a.time));
  const lastType=past.length?past[0].type:null;
  if(lastType){
    const byDay={};(allEntries||[]).forEach(e=>{(byDay[e.date]=byDay[e.date]||[]).push(e)});
    let lCount=0;const follow={};CANDS.forEach(t=>follow[t]=0);
    Object.keys(byDay).forEach(d=>{
      const evs=byDay[d].filter(e=>e.time).sort((a,b)=>pm(a.time)-pm(b.time));
      for(let i=0;i<evs.length;i++){
        if(evs[i].type!==lastType)continue;lCount++;const t0=pm(evs[i].time);
        for(let j=i+1;j<evs.length;j++){const dt=pm(evs[j].time)-t0;if(dt<=0)continue;if(dt>90)break;if(follow[evs[j].type]!=null)follow[evs[j].type]++}
      }
    });
    if(lCount>=2)CANDS.forEach(t=>{const p=follow[t]/lCount;if(p>0)score[t]+=0.9*Math.min(1,p)});
  }
  // 3) proximidade da rotina (se ativa)
  if(routine&&routine.enabled===true){
    const near=(tMin,tol)=>{const d=cdist(tMin,nowMin);return d<=tol?1-d/tol:0};
    (routine.naps||[]).forEach(n=>{if(n&&n.time){const b=near(pm(n.time),75);if(b>0)score.nap+=0.8*b}});
    if(routine.bathTime){const b=near(pm(routine.bathTime),75);if(b>0)score.bath+=0.8*b}
    if(routine.bedtime){const b=near(pm(routine.bedtime),75);if(b>0)score.sleep+=0.8*b}
  }
  // 4) cooldown: penaliza o que ACABOU de acontecer hoje
  const COOL={bottle:90,nursing:90,diaper:45,bath:300,medicine:360,nap:60,sleep:120};
  CANDS.forEach(t=>{
    const recents=(todayList||[]).filter(e=>e.type===t&&e.time&&pm(e.time)<=nowMin).map(e=>nowMin-pm(e.time));
    if(!recents.length)return;const r=Math.min.apply(null,recents),c=COOL[t]||90;
    if(r<c)score[t]-=1.3*(1-r/c);
  });
  return CANDS.slice().sort((a,b)=>score[b]-score[a]).slice(0,3);
}
function calcAge(b){if(!b)return null;const p=b.split("-");const bi=new Date(+p[0],+p[1]-1,+p[2]);const n=new Date();const n0=new Date(n.getFullYear(),n.getMonth(),n.getDate());let m=(n0.getFullYear()-bi.getFullYear())*12+n0.getMonth()-bi.getMonth(),d=n0.getDate()-bi.getDate();if(d<0){m--;d+=new Date(n0.getFullYear(),n0.getMonth(),0).getDate()}const totalDays=Math.floor((n0-bi)/864e5);return{months:Math.max(0,m),days:Math.max(0,d),totalDays,totalWeeks:Math.floor(totalDays/7)}}
function fmtDur(m){if(!m)return"0min";const mi=Math.round(m);const h=Math.floor(mi/60),r=mi%60;return h>0?(r>0?`${h}h${r}m`:`${h}h`):`${r}min`}
// v11.9.6: smart unit formatting. Volume em ml > 1000 vira L (1,5L em PT, 1.5L em EN).
function fmtMl(ml){if(!ml||ml<=0)return"0ml";if(ml<1000)return`${ml}ml`;const l=ml/1000;const dec=l<10?1:0;const str=l.toFixed(dec);return _lang==="pt"?`${str.replace(".",",")}L`:`${str}L`}
// v11.9.15: smart relative date. "Hoje", "Ontem", "Anteontem", weekday se dentro de 7d,
// "26/4" se mais antigo. Aceita YYYY-MM-DD. Locale-aware.
function fmtRelDate(dateStr){
  if(!dateStr)return"";
  const today=todayStr();
  if(dateStr===today)return _lang==="en"?"Today":"Hoje";
  // Calc diff em dias usando local time (tz-safe).
  const a=new Date(today+"T12:00");
  const b=new Date(dateStr+"T12:00");
  if(isNaN(b))return dateStr;
  const diff=Math.round((a-b)/86400000);
  if(diff===1)return _lang==="en"?"Yesterday":"Ontem";
  if(diff===2)return _lang==="en"?"2 days ago":"Anteontem";
  if(diff>=3&&diff<=6){
    const wd=b.toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{weekday:"long"}).replace(".","");
    return _lang==="en"?`Last ${wd}`:wd.charAt(0).toUpperCase()+wd.slice(1)+" passada";
  }
  return b.toLocaleDateString(_lang==="pt"?"pt-BR":"en-US",{day:"numeric",month:"short"}).replace(".","");
}
function fmtTimer(s){return`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`}
function timeSince(d,t){if(!d||!t)return"";const diff=Math.floor((new Date()-new Date(`${d}T${t}`))/6e4);const ago=_lang==="en"?"ago":"atrás";if(diff<1)return _lang==="en"?"now":"agora";if(diff<60)return`${diff}min ${ago}`;const h=Math.floor(diff/60),m=diff%60;if(h<24)return m>0?`${h}h${m}m ${ago}`:`${h}h ${ago}`;return`${Math.floor(h/24)}d ${ago}`}
function minSince(d,t){if(!d||!t)return null;return Math.max(0,Math.floor((new Date()-new Date(`${d}T${t}`))/6e4))}
// Real sleep helpers: subtract waking time from sleep entries with wakings
// realSleepMin(entry) returns durationMin minus awake time inside (for sleep entries with wakings)
function realSleepMin(e){if(!e||!e.durationMin)return 0;const wakings=e.wakings||[];if(wakings.length===0)return e.durationMin;const awake=wakings.reduce((s,w)=>s+(w.durationMin||0),0);return Math.max(0,e.durationMin-awake)}
// awakeMinIn(entry) returns total awake time inside a sleep entry's wakings (0 for naps or sleeps without wakings)
function awakeMinIn(e){if(!e||!e.wakings)return 0;return e.wakings.reduce((s,w)=>s+(w.durationMin||0),0)}
// Sum real sleep across an array of entries (handles both naps and sleep with wakings)
function sumRealSleep(arr){return arr.filter(e=>(e.type==="sleep"||e.type==="nap")&&e.durationMin).reduce((s,e)=>s+realSleepMin(e),0)}
// Sum awake time across sleep entries (only the night-wake portion inside bedtimes)
function sumAwakeInSleep(arr){return arr.filter(e=>e.type==="sleep").reduce((s,e)=>s+awakeMinIn(e),0)}
// Count total wakings across an array of sleep entries
function countWakings(arr){return arr.filter(e=>e.type==="sleep"&&e.wakings).reduce((s,e)=>s+e.wakings.length,0)}
// findContainingBedtime: given an entry and the full entries list, returns the
// bedtime entry (type "sleep" with wakings) whose time range contains this entry,
// or null. Used to retroactively show events inside the SleepBlock even when they
// were registered without an explicit nightWake link (e.g. medicine added later
// or events from before v8.5.x linking).
// Excludes the types that delimit/fragment the night themselves.
const NIGHT_NESTED_EXCLUDED=["sleep","nap","wakeup","nightwaking","growth"];
function findContainingBedtime(ev,allEntries){
  if(!ev||!ev.date||!ev.time)return null;
  if(NIGHT_NESTED_EXCLUDED.includes(ev.type))return null;
  const evMs=new Date(`${ev.date}T${ev.time}`).getTime();
  if(isNaN(evMs))return null;
  // Look at all bedtime entries (type sleep with wakings or with reasonable duration)
  // We accept any sleep entry that has durationMin (regardless of wakings) as a candidate,
  // because the "container" concept doesn't strictly require having wakings.
  // But we only render SleepBlock when wakings.length>0, so practically this is the same.
  for(const s of allEntries){
    if(s.type!=="sleep"||!s.durationMin)continue;
    const startMs=new Date(`${s.date}T${s.time}`).getTime();
    if(isNaN(startMs))continue;
    const endMs=startMs+s.durationMin*60000;
    // Strict boundaries: events exactly at bedtime start or end are NOT inside. v10.4.6.
    // Common case: first morning feeding logged at the same minute the bedtime ended —
    // should appear as a top-level entry in Today, not buried inside the SleepBlock.
    if(evMs>startMs&&evMs<endMs)return s;
  }
  return null;
}
// dedupeLegacyWakings: safety net for old data created before splitMidnight was fixed (pre-v8.4.8).
// Old data has wakings duplicated in BOTH halves of cross-midnight sleeps (id + id_b).
// Returns a NEW entries array with each waking attributed to the correct half only.
// Does NOT mutate Firestore — runs on every read, idempotent.
// v11.9.25: skip se migration ja rodou (firestore corrigido). Re-render storm
// no Home era causado por nova ref retornada toda vez. Agora retorna mesma ref
// quando nada muda (ou skip total se flag setada).
function dedupeLegacyWakings(entries){
  if(!entries||!entries.length) return entries;
  // Fast-path: migration ja persistiu correcoes no Firestore — runtime helper desnecessario.
  try{if(localStorage.getItem("lp_legacy_wakings_migrated_v1"))return entries}catch(_){}
  const baseGroups={};
  for(const e of entries){
    if(e.type!=="sleep"||!e.wakings||!e.wakings.length) continue;
    const baseId=e.id.endsWith("_b")?e.id.slice(0,-2):e.id;
    if(!baseGroups[baseId])baseGroups[baseId]=[];
    baseGroups[baseId].push(e);
  }
  const fixedById={};
  for(const baseId in baseGroups){
    const pair=baseGroups[baseId];
    if(pair.length!==2) continue;
    const p1=pair.find(e=>!e.id.endsWith("_b"));
    const p2=pair.find(e=>e.id.endsWith("_b"));
    if(!p1||!p2) continue;
    // Detect legacy bug: both halves have IDENTICAL wakings array
    const sameWakings=p1.wakings.length===p2.wakings.length
      &&p1.wakings.every((w,i)=>w.time===p2.wakings[i].time&&w.durationMin===p2.wakings[i].durationMin);
    if(!sameWakings) continue;
    // Re-split: wakings >= start time stay on p1, others move to p2
    const [h,m]=(p1.time||"00:00").split(":").map(Number);
    const startMin=h*60+m;
    const wBefore=[],wAfter=[];
    for(const w of p1.wakings){
      const [wh,wm]=(w.time||"00:00").split(":").map(Number);
      if(wh*60+wm>=startMin) wBefore.push(w);
      else wAfter.push(w);
    }
    fixedById[p1.id]={...p1};
    fixedById[p2.id]={...p2};
    if(wBefore.length>0) fixedById[p1.id].wakings=wBefore; else delete fixedById[p1.id].wakings;
    if(wAfter.length>0) fixedById[p2.id].wakings=wAfter; else delete fixedById[p2.id].wakings;
  }
  // v11.9.25: se nada foi corrigido, retorna mesma ref pra evitar re-render dos useMemos
  // dependentes de entries (cada onSnapshot fire criava nova array antes).
  if(Object.keys(fixedById).length===0)return entries;
  return entries.map(e=>fixedById[e.id]||e);
}
// v11.9.10: migration one-shot — escreve no Firestore as correções que dedupeLegacyWakings
// faria em memória. Roda 1x por device (flag em localStorage). Após confirmar funcionando,
// dedupeLegacyWakings em runtime pode ser removido em uma versão futura.
async function migrateLegacyWakingsOnce(entries){
  if(!entries||!entries.length)return;
  try{
    if(localStorage.getItem("lp_legacy_wakings_migrated_v1"))return;
  }catch(_){return}
  const baseGroups={};
  for(const e of entries){
    if(!e||!e.id||e.type!=="sleep"||!e.wakings||!e.wakings.length) continue;
    const eid=String(e.id);
    const baseId=eid.endsWith("_b")?eid.slice(0,-2):eid;
    if(!baseGroups[baseId])baseGroups[baseId]=[];
    baseGroups[baseId].push(e);
  }
  const writes=[];
  for(const baseId in baseGroups){
    const pair=baseGroups[baseId];
    if(pair.length!==2) continue;
    const p1=pair.find(e=>e&&e.id&&!String(e.id).endsWith("_b"));
    const p2=pair.find(e=>e&&e.id&&String(e.id).endsWith("_b"));
    if(!p1||!p2) continue;
    const sameWakings=p1.wakings.length===p2.wakings.length
      &&p1.wakings.every((w,i)=>w.time===p2.wakings[i].time&&w.durationMin===p2.wakings[i].durationMin);
    if(!sameWakings) continue;
    const [h,m]=(p1.time||"00:00").split(":").map(Number);
    const startMin=h*60+m;
    const wBefore=[],wAfter=[];
    for(const w of p1.wakings){
      const [wh,wm]=(w.time||"00:00").split(":").map(Number);
      if(wh*60+wm>=startMin) wBefore.push(w);
      else wAfter.push(w);
    }
    const f1={...p1};const f2={...p2};
    if(wBefore.length>0) f1.wakings=wBefore; else delete f1.wakings;
    if(wAfter.length>0) f2.wakings=wAfter; else delete f2.wakings;
    writes.push(f1);writes.push(f2);
  }
  if(writes.length===0){
    try{localStorage.setItem("lp_legacy_wakings_migrated_v1","1")}catch(_){}
    return;
  }
  // v11.9.12: per-entry try/catch. Uma falha individual nao para o resto.
  // firebase.firestore() em vez de `db` (que e local ao script tag de init).
  let okCount=0,failCount=0;
  let fdb;
  try{fdb=firebase.firestore()}catch(e){console.warn("[migration] firestore unavailable",e);return}
  for(const w of writes){
    try{
      const clean=Object.fromEntries(Object.entries(w).filter(([_,v])=>v!==undefined));
      delete clean._docId;
      if(!w.wakings){
        try{clean.wakings=firebase.firestore.FieldValue.delete()}catch(_){delete clean.wakings}
      }
      await fdb.collection('entries').doc(w.id).set(clean,{merge:true});
      okCount++;
    }catch(e){failCount++;console.warn("[migration] write failed for",w&&w.id,e)}
  }
  if(failCount===0){
    try{localStorage.setItem("lp_legacy_wakings_migrated_v1","1")}catch(_){}
  }
  console.log("[migration] dedupeLegacyWakings: ok="+okCount+" fail="+failCount);
}
function dateOffset(b,o){const d=new Date(b+"T12:00:00");d.setDate(d.getDate()+o);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}

// ── CURIOSITIES + MILESTONES (loaded from curiosities.js) ──
const {CURIOSITIES, WEEKLY_CURIOSITIES, MILESTONES} = window;
// Helper: pick today's curiosity based on age (same cascade used by CuriosityCard).
// Returns {title, body, tagLabel} in requested lang, or null if no curiosity fits today.
function getTodayCuriosity(age,lang){
  if(!age) return null;
  const dayNum=age.totalDays;
  const monthNum=age.months;
  const weekNum=age.totalWeeks;
  let txt=null,tagLabel="";
  // Priority 1: daily curiosities (days 1-30)
  if(dayNum>=1&&dayNum<=30){
    const c=CURIOSITIES&&CURIOSITIES[dayNum-1];
    if(c){
      txt=lang==="en"?c.en:c.pt;
      tagLabel=lang==="en"?`Day ${dayNum}`:`Dia ${dayNum}`;
    }
  }
  // Priority 2: monthly milestones (only on the exact day of the month anniversary)
  else if(monthNum>=2&&monthNum<=12&&age.days===0){
    const ms=MILESTONES&&MILESTONES.find(m=>m.m===monthNum);
    if(ms){
      txt=lang==="en"?ms.en:ms.pt;
      tagLabel=lang==="en"?`${monthNum} months`:`${monthNum} meses`;
    }
  }
  // Priority 3: weekly curiosities (weeks 5-52) — only on the first day of each new week
  // (dayNum%7===0 ⇔ day baby transitions into weekNum). Avoids repeating the same
  // weekly fact 7 days in a row.
  if(!txt&&weekNum>=5&&weekNum<=52&&dayNum%7===0){
    const idx=weekNum-5;
    const wc=WEEKLY_CURIOSITIES&&WEEKLY_CURIOSITIES[idx];
    if(wc){
      txt=lang==="en"?wc.en:wc.pt;
      tagLabel=lang==="en"?`Week ${weekNum}`:`Semana ${weekNum}`;
    }
  }
  if(!txt) return null;
  return{title:txt.t,body:txt.b,tagLabel};
}

// ── WAKE LOCK (loaded from wake-lock.js) ──
// Keeps screen on during night wake / nursing timers.
const {WakeLock} = window;

// ── DEVICE FEATURES (loaded from device-features.js) ──
// Haptic feedback (vibration) + push notification setup.
const {Haptic, PushNotifs} = window;

// Split sleep entry that crosses midnight into two entries
function splitMidnight(entry){
  if(!entry.durationMin || (entry.type!=="sleep"&&entry.type!=="nap")) return [entry];
  const [h,m]=(entry.time||"00:00").split(":").map(Number);
  const startMin=h*60+m;
  const endMin=startMin+entry.durationMin;
  if(endMin<=1440) return [entry]; // doesn't cross midnight
  const beforeMidnight=1440-startMin;
  const afterMidnight=entry.durationMin-beforeMidnight;
  const nextDay=dateOffset(entry.date,1);
  // Split wakings: each waking belongs to ONE half based on its actual time.
  // A waking is "before midnight" if its time-of-day is >= startMin (still on the start day).
  // A waking is "after midnight" if its time-of-day is < startMin (rolled over to next day).
  const wakings=entry.wakings||[];
  const wakingsBefore=[];
  const wakingsAfter=[];
  for(const w of wakings){
    const [wh,wm]=(w.time||"00:00").split(":").map(Number);
    const wMin=wh*60+wm;
    // If the waking time is greater or equal to start time, it's still on the start day
    // (e.g., bedtime 20:42, waking 23:30 → before midnight)
    // Otherwise it rolled over (e.g., bedtime 20:42, waking 04:28 → after midnight)
    if(wMin>=startMin) wakingsBefore.push(w);
    else wakingsAfter.push(w);
  }
  const part1={...entry, durationMin:beforeMidnight, id:entry.id};
  const part2={...entry, date:nextDay, time:"00:00", durationMin:afterMidnight, id:entry.id+"_b"};
  // Only attach wakings array if non-empty (keeps entries clean for old code paths)
  if(wakingsBefore.length>0) part1.wakings=wakingsBefore; else delete part1.wakings;
  if(wakingsAfter.length>0) part2.wakings=wakingsAfter; else delete part2.wakings;
  return [part1, part2];
}

// ── ROUTINE ENGINE v2 (loaded from routine-engine.js) ──
const {getSleepRec, getNapSug, analyzeSleepPatterns, projectSchedule, getDayInsights: _getDayInsights, getGuideline, toMinutes, minToTime, WW, predict: predictRoutine, getInsights: getRoutineInsights, analyze: analyzeRoutine, getStatus: getRoutineStatus, GUIDELINES} = RoutineEngine;
// Wrap getDayInsights to auto-inject current language
function getDayInsights(todayE, pattern, guideline) { return _getDayInsights(todayE, pattern, guideline, _lang); }

// ── ICON (filled + gradient for baby icons, stroke for UI) ──
let _ic=0;
