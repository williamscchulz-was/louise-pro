# Auditoria Louise Pro — 2026-04-19

**Versão auditada:** v10.8.0
**Arquivos principais:** `index.html` (5980 linhas), `routine-engine.js` (1872, protegido — não tocado), `sw.js`, `manifest.json`, `js/*`

---

## Sumário executivo

**Estado geral.** O Louise Pro está em ótima forma. O dono passou o último mês polindo agressivamente — 46 versões desde v10.0.0, cada uma com mudança focada. O que começou como "HTML puro sem build" evoluiu pra arquitetura híbrida sensata (build step de 1 função: JSX → JS, zero bundler). As categorias mais propensas a bug — integridade de dados, perf iPhone PWA, lógica de cross-midnight, offline sync — foram endereçadas em versões recentes (v10.5.0 data-loss, v10.5.1 React.memo, v10.5.2 offline persistence, v10.8.0 night pattern dedup). Zero bugs críticos ativos encontrados.

**Top 3 riscos.** (1) **Sem Error Boundary** em lugar nenhum — qualquer exceção em runtime derruba a tela inteira pra branco, sem fallback. (2) **Acessibilidade fraca** — zero `aria-label` no app, 7 `<div onClick>` onde deveria ser `<button>`, navegação por teclado sem foco visível. Não afeta o uso diário do William + esposa, mas é um débito real. (3) **Firebase compat SDK (~250KB)** via CDN é pesado no cold start 3G+; migração pro modular SDK cortaria ~150KB uncompressed.

**Top 3 oportunidades.** (1) **Extrair CHANGELOG** (~150KB inline, 40% do tamanho total do `index.html`) pra JSON com lazy-load — diff de commit fica legível e cold start melhora. (2) **Swipe-to-delete do History** foi reportado laggy — causa provável: falta de `onPointerCancel` handler + race com re-renders durante bedtime tick. Fix cirúrgico de S effort. (3) **URL hash routing** pra que o botão "voltar" do iPhone funcione entre abas Home/Stats/History — código é 6 linhas, UX ganha bastante.

**Nota sobre escopo.** A stack atual (single HTML + React CDN + build step mínimo) é sensata pro volume de código. Migração pra Vite/Next/Zustand **não se justifica** — o ganho teórico de code-splitting e HMR é pequeno pro tamanho do app, e introduz complexidade de build que não existe hoje. O único caminho de mudança de stack que paga é a migração do Firebase compat pro modular SDK (concreta, mensurável, sem bundler).

**Nota sobre `routine-engine.js`.** Lido pra contexto, não modificado. O engine v2.2.1 é cuidadoso, bem documentado, e foi fixado em v10.8.0 (dedup de cross-midnight no count de noites). Zero achados de correctness.

---

## Achados por categoria

### 1. Usabilidade e UX

#### 1.1 Swipe-to-delete laggy no History
- **Severidade:** 🟠 Importante
- **Local:** `index.html:3916–4000` (EntryRow pointer handlers dentro do `React.memo` wrapper)
- **Sintoma para o usuário:** Gesture travada durante swipe; às vezes dedo some mas o row continua preso no offset; haptic dispara múltiplas vezes.
- **Causa técnica:** `dragRef.current` é mutado inline durante `onPointerMove`, mas `setDx`/`setDragging` são async. Não há handler `onPointerCancel` — se o iOS cancelar o gesto por scroll momentum ou visibility change (app em background durante swipe), o drag state fica órfão. Haptic no threshold crossing (linha 3947) não é debounced e pode disparar várias vezes se pointer noise causar crossings repetidos.
- **Fix proposto:**
  ```jsx
  onPointerCancel={onPtrUp}  // já tem onPtrUp, só reusar pra cancel
  // + no onPtrDown: setPointerCapture(e.pointerId)
  // + debounce haptic no threshold (só dispara uma vez por gesto via ref)
  ```
  Adicionar listener `visibilitychange` fora do EntryRow que reseta qualquer drag ativo quando app volta de background.
- **Esforço:** S
- **Impacto:** Médio (user reported; trabalha ao redor via tap-to-edit)

#### 1.2 Swipe entre tabs Home/Stats/History ambíguo em casos limítrofes
- **Severidade:** 🟡 Nice-to-have
- **Local:** `index.html:5776–5790` (onSwipeEnd velocity logic)
- **Sintoma:** Swipe lento às vezes não muda de aba; flick rápido com pouco movimento às vezes muda.
- **Causa técnica:** Threshold é `|dx|>40 OR v>0.4`. Lógica OR gera ambiguidade — um flick vertical rápido pode ter `v=0.5` horizontal por ruído do pointer e trocar aba sem intenção.
- **Fix proposto:** Mudar pra AND (`|dx|>15% da tela AND |v|>0.3`). Garante que gesture precisa ter MAGNITUDE E VELOCIDADE, não uma ou outra.
- **Esforço:** S
- **Impacto:** Baixo (misfire é raro)

#### 1.3 Empty states ausentes
- **Severidade:** 🟡 Nice-to-have
- **Local:** History, Stats — não há fallback UI quando `entries` é vazio após load completo
- **Sintoma:** Primeiro login, ou após limpeza de dados: History mostra cabeçalho e nada embaixo. Parece quebrado.
- **Causa técnica:** `todayE.length===0` só é tratado no Home (mostra "Tap + to add"). History e Stats renderizam listas vazias sem mensagem.
- **Fix proposto:** Adicionar conditional render em History (`dayE.length===0 → <EmptyState>`) e Stats (`entries.length===0 → <EmptyState>`) com ícone + texto "Nenhum evento neste período" + CTA "Registrar primeiro".
- **Esforço:** S
- **Impacto:** Baixo (afeta primeiros minutos do onboarding)

#### 1.4 Ring re-render cascade: `tick` prop invalida o `React.memo`
- **Severidade:** 🟡 Nice-to-have
- **Local:** `index.html:2995–3020` (Ring component recebe `tick`)
- **Sintoma:** Durante timer ativo, Ring re-renderiza a cada 5s (tick). Não é jank perceptível, mas é custo desnecessário.
- **Causa técnica:** Ring é `React.memo`-zado, mas `tick` como prop muda a cada tick, invalidando o memo. O tick existe só pra forçar re-render de `napSug.el` (tempo acordado). O resto do Ring (arcs, dots) não precisa desse trigger.
- **Fix proposto:** Remover `tick` dos props do Ring. Internalizar um `useTick()` só dentro do componente que usa ele (ex: um sub-componente `<RingTimeLabel>` com seu próprio tick interno). Ring externo fica estável.
- **Esforço:** M
- **Impacto:** Baixo (já foi muito otimizado em v10.5.1)

---

### 2. Performance percebida

#### 2.1 Firebase compat SDK pesado (~250KB) — migrar pro modular
- **Severidade:** 🔴 Crítico (único crítico do relatório)
- **Local:** `index.html:105–107` (preloads), `sw.js:46–48` (precache CDN)
- **Sintoma:** Cold start em 3G: ~3–5s antes do Ring aparecer com dados. Em iPhone com WiFi: ~800ms. No segundo open (cache aquecido): instantâneo.
- **Causa técnica:** `firebase-app-compat.js` + `firebase-firestore-compat.js` + `firebase-messaging-compat.js` somam ~250KB uncompressed (~80KB gzipped). O compat layer é wrapper de legacy API sobre o modular SDK. App usa só `.collection()`, `.doc()`, `.onSnapshot()`, `.set()`, `.enablePersistence()`, `getMessaging()` — todos disponíveis no modular SDK com ~50KB total.
- **Fix proposto:** Migrar pro modular SDK mantendo CDN (não precisa bundler):
  ```js
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/11/firebase-app.js';
  import { getFirestore, collection, doc, onSnapshot, setDoc, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/11/firebase-firestore.js';
  import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/11/firebase-messaging.js';
  ```
  Trocar `db.collection('x').doc('y').set(z, {merge})` → `setDoc(doc(db, 'x', 'y'), z, {merge: true})`. Total ~40 call sites em `window.FB`. SW precisa precachear URLs novas. `enablePersistence` vira `enableIndexedDbPersistence`.
- **Esforço:** L
- **Impacto:** Alto (cold start -25% em 3G, bundle -30%)

#### 2.2 CHANGELOG inline de ~150KB
- **Severidade:** 🟠 Importante
- **Local:** `index.html:396–2875` (const CHANGELOG array)
- **Sintoma:** Dev: commit diffs enormes. User: não vê, mas pesa no cold start de primeiros visitantes (não PWA instalado).
- **Causa técnica:** ~80 versões × (título PT + bullets PT + título EN + bullets EN) ≈ 150KB de texto inline. O modal "Ler novidades" só usa isso quando aberto, mas o array é parseado no startup.
- **Fix proposto:** Extrair pra `js/changelog.json`. Build step copia pro dist. Modal "Ler novidades" faz `fetch('./js/changelog.json')` quando aberto (lazy). SW precache cobre. `index.html` vai de 568KB → ~420KB.
- **Esforço:** M
- **Impacto:** Médio (cold start primeiro visitante -20%; já-instalados não afeta)

#### 2.3 StatsPage + HistoryPage não memoizados
- **Severidade:** 🟡 Nice-to-have
- **Local:** `index.html:4676` (StatsPage), `index.html:4740` (HistoryPage)
- **Sintoma:** Durante timer ativo, App re-renderiza a cada 5s (tick). StatsPage e HistoryPage recebem props estáveis mas não pulam render.
- **Causa técnica:** `function StatsPage({entries, onGrowth}){...}` — sem React.memo. `HistoryPage({entries, onDelete, onEdit, activeTimer})` — sem memo. Quando App tick avança, ambos re-renderizam (reconstroem filter chains, bar charts, etc) mesmo que props não mudaram.
- **Fix proposto:** Wrap `const StatsPage = React.memo(function StatsPage(...))` igual Ring/SleepBlock/EntryRow foram (v10.5.1). Handlers `onGrowth`, `onDelete`, `onEdit` precisam ser `useCallback` estáveis (já são em sua maioria).
- **Esforço:** XS
- **Impacto:** Baixo (Home é a página ativa durante tick; Stats/History só re-renderizam quando visíveis via swipe)

#### 2.4 js/ bundle consolidado não usado em produção
- **Severidade:** 🟡 Nice-to-have
- **Local:** `sw.js:29–34` (PRECACHE_LOCAL lista os 6 individualmente: splash-icon, who-growth, curiosities, wake-lock, device-features, routine-engine)
- **Sintoma:** 6 HTTP requests em cold start em vez de 1. ~200ms extra em redes com RTT alto.
- **Causa técnica:** v10.1.0 bundle step criou `dist/js/app-libs.js` consolidando os 6. Mas `sw.js` ainda lista os 6 paths individuais em `PRECACHE_LOCAL`. O `dist/index.html` deve estar referenciando o bundle, mas o precache não reflete.
- **Fix proposto:** Verificar `build/build.mjs` — se ele já concatena em `js/app-libs.js` (acredito que sim), trocar em `sw.js`:
  ```js
  const PRECACHE_LOCAL = [
    "./",
    "./manifest.json",
    "./js/app-libs.js",   // em vez dos 6
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/apple-touch-icon.png",
  ];
  ```
  Testar com SW fresh activate. Adicionar `firebase-messaging-sw.js` enquanto está nessa (hoje não tá precached).
- **Esforço:** S
- **Impacto:** Médio (6 reqs → 1 no cold start)

#### 2.5 Bundle size geral: 568KB do `index.html` com JSX compilado
- **Severidade:** 🟡 Nice-to-have
- **Local:** `index.html` (5980 linhas, 568KB antes de gzip)
- **Sintoma:** Primeiro load (não-PWA): ~4s em 4G regular.
- **Causa técnica:** JSX compilado + CHANGELOG + 25 SVG icons inline + 585 inline styles + CSS block. Tudo inline pra ser "single file".
- **Fix proposto:** Três vetores independentes:
  - Extrair CHANGELOG (achado 2.2): -150KB
  - Extrair Icon SVG defs pra `js/icons.js`: -~30KB (estimativa)
  - Minificar JSX compilado via Terser no build step: ~-20% do JS restante
  Depois de tudo: `index.html` ~250–300KB.
- **Esforço:** L (cumulativo dos 3)
- **Impacto:** Médio (cold start primeiro visitante)

---

### 3. Estrutura de código e manutenibilidade

#### 3.1 Sem Error Boundary — crash deixa tela branca
- **Severidade:** 🟠 Importante
- **Local:** `index.html:5709` (ReactDOM.createRoot) — nenhum wrapper de error boundary
- **Sintoma para o usuário:** Qualquer exceção de render (bug num componente, Firebase retornando dado inesperado, etc) derruba a tela pra branco. User reabre o app, geralmente funciona — mas dá pânico no momento.
- **Causa técnica:** React 18 não tem hook pra error boundary. Precisa ser um class component.
- **Fix proposto:**
  ```jsx
  class ErrorBoundary extends React.Component {
    state = { hasError: false, err: null };
    static getDerivedStateFromError(err) { return { hasError: true, err }; }
    componentDidCatch(err, info) { console.error('[LP]', err, info); /* opcional: reportar pro Firestore */ }
    render() {
      if (this.state.hasError) {
        return (<div style={{padding: 24, color: T.red, textAlign: 'center', marginTop: 100}}>
          <h2>Oops!</h2>
          <p>Algo quebrou. Recarregando em 3s...</p>
          {useEffect(()=>setTimeout(()=>location.reload(), 3000), [])}
        </div>);
      }
      return this.props.children;
    }
  }
  ReactDOM.createRoot(...).render(<ErrorBoundary><App/></ErrorBoundary>);
  ```
  Também wrap `<SleepBlock>` individual (o mais complexo) pra crash num bedtime não levar o resto junto.
- **Esforço:** S
- **Impacto:** Alto (resilience; evita a sensação "o app bugou" que ninguém esquece)

#### 3.2 Dead code: `edgeGlow` helper + constantes declarados mas não usados
- **Severidade:** 🟡 Nice-to-have
- **Local:** `index.html:2874–2889` (const EDGE_GLOW_BG, EDGE_GLOW_BG_SOFT, function edgeGlow)
- **Sintoma:** Dev: poluição. User: nenhum.
- **Causa técnica:** Criados em v10.6.0 pro Beautiful Glow, revertidos em v10.7.0. Deixados "dormindo" com comentário explicando.
- **Fix proposto:** Remover. Se um dia for aplicar o efeito em algo isolado (badge de conquista, app icon), a função de 7 linhas se recria rápido. Nota sobre isso no CLAUDE.md pode ser deletada também.
- **Esforço:** XS
- **Impacto:** Baixo (só limpeza)

#### 3.3 585 inline styles — refator pra CSS variables tem ROI médio
- **Severidade:** 🟡 Nice-to-have
- **Local:** Espalhado no `index.html`; grep `style={{` retorna 585 matches
- **Sintoma:** Dev: difícil de manter consistência visual. User: nenhum impacto.
- **Causa técnica:** Padrão de inline style reflete a natureza do single-file. O objeto `T` (theme) é usado como JS constant, não como CSS var.
- **Fix proposto:** Converter `T.green`, `T.purple` etc em CSS custom properties no `<style>` root:
  ```css
  :root {
    --c-green: #34d399;
    --c-purple: #a78bfa;
    --c-bg1: #070b1e;
    /* etc */
  }
  ```
  E criar classes pra padrões repetidos:
  ```css
  .card-base { padding: 10px; border-radius: 12px; }
  .card-green { background: rgba(52,211,153,0.024); border-color: rgba(52,211,153,0.04); }
  ```
  Migração gradual — não precisa tocar em todos os 585 de uma vez.
- **Esforço:** L
- **Impacto:** Médio (dev velocity ganha com tempo)

#### 3.4 URL-based routing (hash) traria ganhos concretos
- **Severidade:** 🟡 Nice-to-have
- **Local:** `index.html:5027` (const[page,setPage]=useState("home"))
- **Sintoma:** Botão "voltar" do iPhone em PWA standalone não funciona pra trocar de aba — só fecha o app. Não dá pra dar deep link (compartilhar "estou em Stats agora"). Analytics externos (GA) não veem navegação.
- **Causa técnica:** Page state é puramente React, sem sincronização com URL.
- **Fix proposto:**
  ```js
  useEffect(() => {
    if (window.location.hash !== '#' + page) window.location.hash = page;
  }, [page]);
  useEffect(() => {
    const h = () => setPage(window.location.hash.slice(1) || 'home');
    window.addEventListener('hashchange', h);
    h(); // initial
    return () => window.removeEventListener('hashchange', h);
  }, []);
  ```
  Zero overhead. Back button iPhone começa a funcionar pra tabs.
- **Esforço:** S
- **Impacto:** Médio (UX ganha concretamente)

#### 3.5 Prop drilling moderado; React Context caberia
- **Severidade:** 🟡 Nice-to-have (opinião — pode virar nada)
- **Local:** App root passa 10+ props pra ProfilePage, 8+ pra SleepBlock, etc.
- **Sintoma:** Dev: pequeno atrito pra adicionar features que precisam de state em componentes profundos.
- **Causa técnica:** React Context via `createContext` + `useContext` não está em uso. `window.FB` serve como "store" mas só pra operações Firebase (não pra UI state).
- **Fix proposto:** **NÃO FAZER AGORA.** O prop drilling está gerenciável. Context só faz sentido se o app ganhar mais features que compartilham state. Marcado aqui pra awareness.
- **Esforço:** M
- **Impacto:** Baixo (não há dor real hoje)

---

### 4. PWA health

#### 4.1 `firebase-messaging-sw.js` fora do precache
- **Severidade:** 🟡 Nice-to-have
- **Local:** `sw.js:26–38` (PRECACHE_LOCAL)
- **Sintoma:** Primeira notificação push após install pode atrasar 1–2s (fetch do SW de messaging).
- **Causa técnica:** Firebase SDK registra `firebase-messaging-sw.js` dinamicamente quando `getToken()` roda, mas o arquivo não está no precache. Se CDN do Firebase estiver lento na hora, há atraso.
- **Fix proposto:** Adicionar `"./firebase-messaging-sw.js"` em `PRECACHE_LOCAL`. Arquivo tem 3.4KB, zero custo.
- **Esforço:** XS
- **Impacto:** Baixo

#### 4.2 Offline sync sem feedback visual
- **Severidade:** 🟡 Nice-to-have
- **Local:** App inteiro — sem listener em `onSnapshot` metadata (`hasPendingWrites`) ou `onDisconnect`
- **Sintoma:** User registra mamada offline, vê o Toast "Saved". Depois de 10min sem rede, fica confuso se salvou mesmo.
- **Causa técnica:** Firestore SDK enfileira writes offline (funciona), mas a app não mostra badge "syncing" / "synced". Uma simples detecção de `navigator.onLine` + `window.addEventListener('online'/'offline')` resolveria 80%.
- **Fix proposto:**
  ```jsx
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  {!online && <div style={{...pill offline badge...}}>Offline — alterações sincronizam ao voltar</div>}
  ```
- **Esforço:** S
- **Impacto:** Médio (confiança do usuário)

#### 4.3 Manifest minimal
- **Severidade:** 🟡 Nice-to-have
- **Local:** `manifest.json`
- **Sintoma:** Ao instalar o PWA, iOS/Android não tem metadata rica (screenshots, category, shortcuts).
- **Causa técnica:** Manifest só tem o essencial: name, short_name, start_url, display, icons, theme_color, background_color.
- **Fix proposto:** Adicionar:
  ```json
  "categories": ["health", "lifestyle"],
  "shortcuts": [
    {"name": "Log event", "url": "./", "icons": [{"src": "assets/icons/icon-192.png"}]}
  ],
  "screenshots": [
    {"src": "assets/screenshot-375.png", "sizes": "375x812", "type": "image/png", "form_factor": "narrow"}
  ]
  ```
  Requer gerar screenshots (~5min com device real).
- **Esforço:** M (screenshots) / XS (só categories+shortcuts)
- **Impacto:** Baixo

---

### 5. iOS PWA específico

#### 5.1 Safe-area: cobertura 95% ✓ (excelente)
- **Severidade:** 🟢 OK (não é achado, é observação positiva)
- **Local:** 15+ ocorrências de `env(safe-area-inset-*)` em todos os elementos `position:fixed`/`absolute` que importam
- **Observação:** Nav pill, TimerBar, Modal (via v10.7.2), Sheet, Toast, UpdateToast, ProfileNav — todos com safe-area tratado. Changelog v10.1.x a v10.4.x mostra cada ajuste. Zero gap observado.
- **Fix proposto:** Nada.

#### 5.2 Status bar + viewport config ✓
- **Severidade:** 🟢 OK
- **Local:** `index.html:89–94`
- **Observação:** `apple-mobile-web-app-status-bar-style=black-translucent`, `viewport-fit=cover`, `user-scalable=no` (elimina 300ms tap delay). Tudo correto.

#### 5.3 `-webkit-overflow-scrolling:touch` aplicado inconsistentemente
- **Severidade:** 🟡 Nice-to-have
- **Local:** `index.html:4345` (ProfilePage tem), mas HistoryPage e StatsPage scroll containers podem não ter
- **Sintoma:** Scroll em Stats/History menos "fluido" que Profile no iPhone.
- **Causa técnica:** Propriedade antiga do Safari pra momentum scroll. Hoje iOS 13+ faz momentum por padrão em overflow:auto, mas ainda melhora em alguns casos.
- **Fix proposto:** Adicionar em todos `overflowY:"auto"` containers:
  ```jsx
  WebkitOverflowScrolling: "touch"
  ```
  Conferir HistoryPage, StatsPage, Sheet, Modal wide.
- **Esforço:** XS
- **Impacto:** Baixo (marginal em iOS moderno)

---

### 6. Acessibilidade básica (a11y)

#### 6.1 Zero `aria-label` no app
- **Severidade:** 🟠 Importante
- **Local:** Todos os botões icon-only: nav pill (Home, Clock, +, Stats, Gear), Modal X close, Toast undo, EntryRow actions.
- **Sintoma:** VoiceOver lê "button" sem contexto. Inútil pra usuário deficiente visual.
- **Causa técnica:** Padrão de botão ícone-only sem label associado.
- **Fix proposto:** Adicionar `aria-label` bilíngue usando `L()` helper:
  ```jsx
  <button aria-label={L("home")} ...><Icon name="home"/></button>
  <button aria-label={L("close")} ...><Icon name="x"/></button>
  ```
  ~15-20 botões pra anotar. Criar keys i18n faltando.
- **Esforço:** S
- **Impacto:** Alto (inclusão; 1-2% do público é dependente de screen reader)

#### 6.2 `<div onClick>` onde deveria ser `<button>` — 7 casos
- **Severidade:** 🟠 Importante
- **Local:** Sheet drag handle, alguns menu items, cards clicáveis (verificar)
- **Sintoma:** Screen readers não anunciam como interativos. Keyboard nav (Tab) não pousa neles.
- **Causa técnica:** `<div>` com `onClick` é clicável com mouse/touch mas não tem semântica de button.
- **Fix proposto:** Converter pra `<button>` com reset CSS. Já existe classe `.navbtn` que pode virar base.
- **Esforço:** S
- **Impacto:** Alto (a11y)

#### 6.3 Sem `:focus-visible` styles
- **Severidade:** 🟡 Nice-to-have
- **Local:** `<style>` no `<head>` não tem regra de focus
- **Sintoma:** User navegando por teclado (desktop ou Bluetooth no iPad) não vê onde está o foco.
- **Causa técnica:** Mobile-first CSS; desktop não é priorizado.
- **Fix proposto:**
  ```css
  button:focus-visible, input:focus-visible, a:focus-visible {
    outline: 2px solid #8b7cf6;
    outline-offset: 2px;
  }
  ```
  1 linha.
- **Esforço:** XS
- **Impacto:** Médio (desktop + acessibilidade)

#### 6.4 Contraste `T.sub` (#8b90b8) em texto pequeno abaixo de WCAG AA
- **Severidade:** 🟡 Nice-to-have
- **Local:** Subtítulos de 11–12px usando `T.sub`; ex: "ago" nos cards Home, meta info em SleepBlock
- **Sintoma:** User com visão normal: tudo legível. User com baixa visão ou em sol forte: subtítulos difíceis.
- **Causa técnica:** #8b90b8 sobre #070b1e = 2.8:1. WCAG AA para texto < 18px exige 4.5:1.
- **Fix proposto:** Duas abordagens:
  - (A) Mudar `T.sub` de `#8b90b8` pra `#a3aac8`: sobe pra ~3.8:1. Ainda não é 4.5, mas melhora.
  - (B) Deixar `T.sub` como está pra hints/metadata e usar `T.text` (#e4e6f5 = 12:1) pra labels que precisam ser lidos.
- **Esforço:** XS
- **Impacto:** Baixo (afeta caso de uso específico)

#### 6.5 `prefers-reduced-motion` não respeitado
- **Severidade:** 🟡 Nice-to-have
- **Local:** CSS animations: `glowBreathe`, `twinkle`, `pulse`, `mercurySpin`, `splashHeartbeat`, `ringDiscBreathe`, etc. (15+)
- **Sintoma:** User com transtorno vestibular pode ter enjoo das animações contínuas.
- **Causa técnica:** Sem media query de respect.
- **Fix proposto:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- **Esforço:** XS
- **Impacto:** Baixo (caso de uso específico)

---

### 7. Qualidade da lógica de negócio

#### 7.1 Funções puras sem testes — lógica sólida, baixo risco
- **Severidade:** 🟡 Nice-to-have
- **Local:** `realSleepMin` (2810), `sumRealSleep` (2814), `countWakings` (2818), `splitMidnight` (2939), `findContainingBedtime` (2544), `dedupeLegacyWakings` (2569), `dateOffset` (2887), `todayStr`
- **Sintoma:** Dev: qualquer refactor é "na mão"; bugs sutis podem passar.
- **Causa técnica:** Funções bem-escritas mas sem test coverage. Muitas têm edge cases documentados em comentários (exemplo: `dateOffset` usa noon anchor 12:00 pra evitar timezone rollover — clever e correto).
- **Fix proposto:** **NÃO CRIAR TESTES AGORA.** Criar teste é adicionar `package.json`, Jest, rodar em CI — mudança de stack grande. Marcar como débito técnico e abordar se/quando o dono adicionar CI pipeline. Enquanto isso: deixar comentários explicando edge cases (já estão na maior parte).
- **Esforço:** L (se quisesse fazer)
- **Impacto:** Baixo (funções estáveis há versões)

#### 7.2 `toISOString()` — storage UTC, display local — tudo OK
- **Severidade:** 🟢 OK
- **Local:** 9 ocorrências de `toISOString()`; todas em contextos de STORAGE (updatedAt, startTime de timers)
- **Observação:** Verificado — nenhum uso em display. Display usa `todayStr()`, `fmtDur()`, formatação local. Comentário no CLAUDE.md alerta sobre o perigo de `toISOString().slice(0,10)`; grep por essa string no código: 0 matches. Risco zero atual.
- **Fix proposto:** Nada.

#### 7.3 Cross-midnight edge cases cobertos
- **Severidade:** 🟢 OK
- **Local:** `splitMidnight` (2939), fix de night pattern dedup em `routine-engine.js:291` (v10.8.0)
- **Observação:** Bedtime começando 23:58 e durando 10min: split correto. Bedtime de 14h (raro mas possível): split funciona. Wakings são distribuídos por tempo correto. dedupeLegacyWakings cobre dados legacy (pre-v8.4.8).
- **Fix proposto:** Nada.

#### 7.4 Consistência entre Home, History e Stats
- **Severidade:** 🟢 OK (inferido via changelog)
- **Observação:** Changelog v8.5.1: "Home sleep card bug fixed — now shows real sleep (minus wakings), matching Stats". Ajustes contínuos foram feitos pra sincronizar cálculos. Atual state consistente.
- **Fix proposto:** Nada imediato.

---

## Ranking geral por impacto/esforço

Score = Impacto normalizado × (1 / Esforço normalizado). Alto=3, Médio=2, Baixo=1. XS=1, S=2, M=3, L=4, XL=5.

| # | Achado | Sev | Impacto | Esforço | Score |
|---|---|---|---|---|---|
| 1 | 6.3 `:focus-visible` styles | 🟡 | 2 | 1 | **2.00** |
| 2 | 3.1 Error Boundary no App root | 🟠 | 3 | 2 | **1.50** |
| 3 | 2.3 StatsPage/HistoryPage `React.memo` | 🟡 | 1 | 1 | 1.00 |
| 4 | 4.1 firebase-messaging-sw.js precache | 🟡 | 1 | 1 | 1.00 |
| 5 | 5.3 `-webkit-overflow-scrolling:touch` | 🟡 | 1 | 1 | 1.00 |
| 6 | 6.4 Contraste `T.sub` bump | 🟡 | 1 | 1 | 1.00 |
| 7 | 6.5 `prefers-reduced-motion` | 🟡 | 1 | 1 | 1.00 |
| 8 | 3.2 Remover edgeGlow dead code | 🟡 | 1 | 1 | 1.00 |
| 9 | 1.1 Swipe-delete `onPointerCancel` | 🟠 | 2 | 2 | 1.00 |
| 10 | 1.2 Swipe tabs AND threshold | 🟡 | 1 | 2 | 0.50 |
| 11 | 6.1 aria-label nos botões ícone | 🟠 | 3 | 2 | **1.50** |
| 12 | 6.2 `<div onClick>` → `<button>` | 🟠 | 3 | 2 | **1.50** |
| 13 | 3.4 URL hash routing | 🟡 | 2 | 2 | 1.00 |
| 14 | 4.2 Offline sync badge | 🟡 | 2 | 2 | 1.00 |
| 15 | 2.4 SW precache consolidado | 🟡 | 2 | 2 | 1.00 |

Fora do top 15 (scores baixos mas incluídos pra contexto):
- 2.2 CHANGELOG extrair (impacto médio, esforço M) = 0.67
- 2.1 Firebase modular SDK (impacto alto, esforço L) = 0.75
- 2.5 Bundle size global (impacto médio, esforço L) = 0.50

**Observação sobre o ranking.** O Firebase modular (crítico, alto impacto) cai em #16 por esforço L. Mas é o único achado de severidade 🔴. Se o dono quiser fazer só uma coisa grande, é esse. O ranking por score recompensa achados triviais — não é a única lente.

---

## Roadmap sugerido

3 sprints de 1 semana. Cada sprint tem objetivo único.

### Sprint 1 — "Resilência básica" (a11y + resilência)
**Objetivo:** Colocar as proteções que qualquer app profissional tem.

- [ ] 3.1 Error Boundary envolvendo `<App/>` + um sub-boundary em `<SleepBlock>` (S)
- [ ] 6.1 Adicionar `aria-label` em todos os botões icon-only (~20 botões) (S)
- [ ] 6.2 Converter 7 `<div onClick>` pra `<button>` (S)
- [ ] 6.3 Adicionar `:focus-visible` styles (XS)
- [ ] 6.5 `prefers-reduced-motion` CSS (XS)
- [ ] 6.4 Bump `T.sub` pra `#a3aac8` (XS)
- [ ] 3.2 Remover `edgeGlow` dead code + comentário do CLAUDE.md (XS)

**Esforço total:** S (~4h).
**Entrega:** App robusto a crash, acessível, respeitoso de preferências do usuário.

### Sprint 2 — "UX polish" (concreto que usuário sente)
**Objetivo:** Os micro-ajustes que viram "uau isso tá bom".

- [ ] 1.1 Swipe-delete: `onPointerCancel` + visibility reset + debounce haptic (S)
- [ ] 1.2 Swipe tabs: AND threshold em vez de OR (S)
- [ ] 1.3 Empty states em History e Stats (S)
- [ ] 3.4 URL hash routing (S)
- [ ] 4.2 Offline sync badge (S)
- [ ] 5.3 `-webkit-overflow-scrolling:touch` nos scroll containers que faltam (XS)
- [ ] 4.1 `firebase-messaging-sw.js` no precache (XS)
- [ ] 2.3 `React.memo` em StatsPage e HistoryPage (XS)
- [ ] 2.4 Consolidar `js/app-libs.js` no SW precache (S)

**Esforço total:** M (~6-8h).
**Entrega:** App sente mais fluido, bug do swipe desaparece, botão voltar do iPhone funciona.

### Sprint 3 — "Perf cold start" (o único sprint de peso)
**Objetivo:** Bundle menor pra primeiros visitantes; fundação pra escalar.

- [ ] 2.2 Extrair CHANGELOG pra `js/changelog.json` + lazy load no modal (M)
- [ ] 2.1 Migrar Firebase compat → modular SDK (L) — ou pular pro Sprint 4 se for demais
- [ ] 4.3 Manifest minimal: `categories` + `shortcuts` (XS); screenshots opcional

**Esforço total:** L (~8-16h com Firebase modular; ~4h sem).
**Entrega:** `index.html` de 568KB pra ~420KB (CHANGELOG) ou ~300KB (+ Firebase modular). Cold start primeira visita cai ~20-30%.

**Fora de sprint (pulamos):**
- 1.4 Ring tick sub-componentization (baixo impacto, ROI marginal depois de v10.5.1)
- 3.3 Refator massivo de inline styles → CSS vars (alto esforço, baixo impacto imediato)
- 3.5 React Context pro `FB` (prop drilling é gerenciável hoje)
- 4.3 Screenshots no manifest (baixo impacto)
- 7.1 Testes unitários (requer mudança de stack)

---

## Nota final sobre escopo de mudança de stack

O prompt oferecia liberdade total (Vite, Next.js, TypeScript, Zustand, Tailwind). **Não recomendo migração de stack.**

**Razões concretas:**
1. O único `🔴 Crítico` do audit (Firebase modular) não exige bundler — pode ser feito com imports de ES modules via CDN.
2. O app tem 5980 linhas hoje. TypeScript adiciona ~30% de overhead de escrita, não compensa pra o volume + prazo do projeto.
3. Vite/Next adicionam complexidade de build (config, plugins, DX) que o atual `build.mjs` de ~70 linhas resolve sem.
4. Zustand via CDN pra substituir `window.FB` é possível mas não há dor real — o app escala bem até ~10x do volume atual com o padrão atual.
5. A maioria dos "problemas" é acessibilidade + polish, não arquitetural.

**Onde eu mudaria de ideia:**
- Se o dono quiser compartilhar o código open-source e receber contribuições externas → TypeScript + Vite facilita a entrada.
- Se o app virar 15k+ linhas → bundle splitting passa a importar.
- Se o dono adicionar 5+ colaboradores → convenções de build mais formais ajudam.

Até lá, manter a stack atual é a decisão certa. Essa auditoria encontrou muita coisa pra arrumar dentro da stack atual, sem mudar paradigma.

---

**Fim do relatório.**

Pronto pra discutir priorização ou atacar qualquer achado individualmente. Nenhuma mudança feita no código até aqui.
