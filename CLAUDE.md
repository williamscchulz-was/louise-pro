# Louise Pro — Baby Tracker

## Como usar este arquivo

Este `CLAUDE.md` é lido automaticamente pelo Claude Code no início de toda sessão dentro deste repositório. Ele descreve o projeto, a stack, os princípios não-negociáveis e o workflow de entrega. Você (Claude Code) deve tratar este documento como contexto permanente — não precisa que o William cole ou relembre nada daqui.

**Regra dura (v10.4.7):** *toda* alteração feita neste repo precisa ser refletida aqui. Versão atual, decisões arquitetônicas, bugs latentes descobertos, padrões novos — tudo. O objetivo é que uma nova sessão comece sem contexto nenhum e ainda assim saiba o que o William sabe. Ao commitar uma mudança funcional, atualizar este arquivo faz parte do mesmo commit (não um commit separado depois).

-----

## Projeto

- **App**: Baby tracker pessoal para a Louise (nascida 08/03/2026), usado por mim (William) e minha esposa
- **Localização**: Blumenau, SC, Brasil (BRT, UTC-3)
- **Repositório**: https://github.com/williamscchulz-was/louise-pro
- **Live**: https://williamscchulz-was.github.io/louise-pro/
- **Versão atual**: v11.2.0 (app) / routine-engine v2.2.1
- **Bilíngue**: Português e Inglês (toda a interface, insights, curiosidades e changelog)

## Stack

- **HTML + React CDN** (ainda sem bundler, sem TypeScript, sem npm em produção)
- **React 18** via CDN (unpkg)
- **JSX pré-compilado em build-time** via `@babel/core` + `@babel/preset-react` — o navegador NÃO carrega mais `@babel/standalone`. Esse é o único passo de build.
- **Firebase 10.x compat** via CDN — Firestore para persistência
- **PWA** com manifest.json, ícones e splash screen
- **GitHub Pages + Actions** para deploy (a partir de v10.0.0)

### Regra de stack (atualizada em v10.0.0)

O princípio "sem build" foi relaxado *com justificativa de performance*: a transpilação JSX saiu do runtime do navegador pro build step, porque Babel Standalone travava o cold start em iPhone PWA. Isso **não** abre precedente pra adicionar bundler (Vite/webpack), TypeScript, ou npm em produção. O build tem 1 função só: JSX → JS. Se a próxima proposta for "adicionar X ao build", questionar se o ganho justifica — a simplicidade é o ponto.

## Arquivos do repositório

```
louise-pro/
├── index.html               ← SOURCE (com <script type="text/babel">). NUNCA servido diretamente em prod.
├── manifest.json            ← config PWA (fica no root por convencao)
├── sw.js                    ← service worker do PWA (DEVE ficar no root — scope)
├── firebase-messaging-sw.js ← service worker do FCM (DEVE ficar no root — Firebase espera path fixo)
├── README.md
├── CLAUDE.md
├── .gitignore
├── js/                      ← libs auxiliares (plano JS, não passam pelo build)
│   ├── curiosities.js       ← curiosidades bilíngues (dia 1 → mês 12)
│   ├── routine-engine.js    ← engine de análise de padrões (sleep + feed)
│   ├── who-growth.js        ← tabelas LMS OMS + funções de percentil
│   ├── splash-icon.js       ← base64 do ícone da splash screen
│   ├── wake-lock.js         ← helper de Wake Lock API
│   └── device-features.js   ← helpers de device (haptics etc.)
├── assets/
│   └── icons/
│       ├── icon-192.png / icon-512.png / apple-touch-icon.png
├── build/                   ← tooling de build (só em dev/CI, não em prod)
│   ├── build.mjs            ← ~70 linhas: JSX → JS, remove tag do Babel Standalone
│   ├── package.json         ← deps: @babel/core + @babel/preset-react
│   └── .gitignore           ← ignora node_modules e package-lock
├── .github/workflows/
│   └── deploy.yml           ← GitHub Action: build + deploy para Pages em todo push na main
└── dist/                    ← (gitignored) output do build, gerado pelo CI em cada deploy
```

**Regra:** NÃO mover `sw.js`, `firebase-messaging-sw.js`, ou `manifest.json` pra subpastas. Service workers têm scope baseado no path do arquivo; moveu, quebrou notificações. Firebase Messaging procura por `firebase-messaging-sw.js` no root do scope do app.

**Build step (resumo):**
- Edita: `index.html` na raiz (source, com `<script type="text/babel">`)
- Build: `cd build && npm install && cd .. && node build/build.mjs` — gera `dist/`
- Deploy: push na `main` → GitHub Action roda o build e publica `dist/` via `actions/deploy-pages`
- Pre-requisito **uma vez só no repo**: Settings → Pages → Source = "GitHub Actions"

## Ambiente local (Windows)

- **Máquina**: Windows 11, shell bash (Git Bash / MSYS) — use sintaxe Unix (`/dev/null`, forward slashes)
- **Raiz do repo**: `C:\Users\willi\Documents\projects\louise-pro`
- **Worktrees**: `C:\Users\willi\Documents\projects\louise-pro\.claude\worktrees\<nome>` (quando aplicável)
- Claude Code tem acesso direto ao filesystem e ao git — edita os arquivos no lugar, sem etapa de upload manual.

## Firebase

- **Projeto**: louise-pro
- **apiKey**: AIzaSyBPiWTlC0ZKLEX5Z8PqKM2c3zaXN8p7DH8
- **appId**: 1:670065554630:web:e8bdf489a3db28b8fe53c7
- **Sem login** — dados compartilhados entre os 2 dispositivos via Firestore

### Firestore Collections

- `entries/` — todos os eventos registrados (mamadas, sono, fraldas, banho, medicina, temperatura, crescimento)
- `config/profile` — perfil da Louise (nome, foto, data nascimento, meta ml, idioma, lastSeenVersion, keepScreenOn)
- `config/meds` — medicamentos salvos pra quick-select
- `config/active` — timer ativo (sync em tempo real entre dispositivos)
- `config/inbox` — estado da caixa de notificações
- `config/reminders/items/{id}` — lembretes. `tipo:"feedingInterval"` (default 120min desde v10.4.1) ou `tipo:"scheduled"` (medicamento com horários)

-----

## Arquitetura visual — portals, z-index, stacking

Descoberta dolorosa na v10.4.4 que vale tatuar:

- `<body>` tem dois filhos diretos: `#root` (app) e `#nav-host` (portal onde vivem `TimerBar` e a `nav` flutuante).
- Desde v10.4.4: `#nav-host` é `position:fixed inset:0 pointer-events:none z-index:300`. **Precisa ser maior que qualquer overlay** pra nav não ficar atrás.
- Mapa de z-index de overlays no app:
  - `Modal` / `UpdateToast`: 150
  - `ProfilePage` / `Sheet`: 200
  - `InboxPanel`: 210
  - `#nav-host` (nav+timer portal): **300**
  - `#load-debug`: 9998
- `#nav-host` tem `pointer-events:none` pro conteúdo atrás receber clique. Filhos que precisam clicar (a `nav`, o `TimerBar`) restauram com `pointer-events:auto` no próprio estilo.
- Position:fixed DENTRO de ancestor com `overflow:auto` vira efetivamente absolute em iOS PWA standalone (bug conhecido do WebKit). Por isso nav + TimerBar ficam fora do App root via `ReactDOM.createPortal`.
- TimerBar tem prop `hidden` que desmonta o bar quando qualquer overlay inferior abre (Sheet/Modal/ProfilePage/InboxPanel/etc) — evita cobrir botões Save e evita `backdrop-filter` pegar cor errada. Não tenta fade (o tick de 1s resetava a transition).

-----

## Linguagem visual — minimalista (atual, v10.7.0)

- Cards do Home: tint sutil com `${color}06` (3% alpha) + borda `${color}0a`. Starfield atrás. MINIMAL.
- Círculos do popup + : dark radial gradient + borda colorida sutil + soft glow externo.
- Ring: SVG puro com arcs, sem disco central, sem background. Text center flutua sobre starfield.
- Regra geral: quando em dúvida, menos > mais. O cosmos atrás é a identidade.

### Helper `edgeGlow()` — dormindo

O helper `edgeGlow(hex, scale, intensity)` + constantes `EDGE_GLOW_BG`/`EDGE_GLOW_BG_SOFT` continuam em index.html (logo após TYPES). Foram usados na v10.6.x (Beautiful Shadow style — 4 inner shadows em camadas) e REVERTIDOS na v10.7.0 por sobrecarregar visualmente. Deixados como ferramenta caso queira aplicar em algo isolado no futuro (app icon, conquista, etc). Não usar em vários elementos simultâneos.
- As 4 inner shadows embutidas simulam as da referência Figma (Y:-80 Blur:60 primary glow + Y:-40 halo + Y:-20 white kiss + Y:6 top hint). GPU-cheap em iOS — diferente do backdrop-filter blur, este efeito é barato em listas longas.
- NÃO aplicado no app icon (launcher) por pedido do William.
- Se criar novo componente com glow: use sempre o helper, não copie as shadows inline. Consistência.

-----

## Performance iPhone PWA — regras aprendidas

Bugs de perf descobertos e corrigidos durante as auditorias. Valem tatuar:

- **App-level tick interval**: durante timer ativo, 5s (não 1s). O arco do Ring é imperceptível se mover a cada 5s (<2° por passo em nap de 20min). Usar 1s faz o App inteiro re-renderizar 9x3600 vezes numa noite de bedtime — bateria derrete. Exceção: o próprio TimerBar tem tick interno de 1s pra display "17:03", fine.
- **CSS animations/transitions: SEMPRE via classe CSS, NUNCA inline.** Componentes com re-render frequente (qualquer coisa que recebe `tick` como prop) vão resetar a animação se ela estiver no inline `style.animation`. Primeiro caso: TimerBar v10.3.2 (fade). Segundo caso: Ring disc breathe v10.6.2. Regra: toggle a classe via `className={cond?'foo':''}` e defina `@keyframes` + `.foo{animation:...}` no CSS estático lá em cima. Inline style reset a cada re-render, classes não.
- **React.memo em componentes pesados**: Ring, SleepBlock, EntryRow têm memo desde v10.5.1. Sem memo, qualquer re-render do App (mudança de qualquer state) força redraw mesmo quando props são idênticos. Regra: componente visualmente pesado + props estáveis → embrulhar em React.memo.
- **backdrop-filter é QUADRÁTICO no raio**: blur(26px) não custa 2x blur(13px), custa ~4x. Em elementos sempre visíveis (nav pill), usar no máximo blur(18-20px) com saturate(180%). Evitar empilhar mais de 2 blurs visíveis ao mesmo tempo.
- **body.app-hidden pausa animações**: `body.app-hidden *{animation-play-state:paused !important}` implementado no CSS. PWA em background não gasta CPU com mercury ring spinning, twinkle, pulse. NÃO remover.
- **Firestore offline persistence ON desde v10.5.2**: `db.enablePersistence({synchronizeTabs: true})` chamado logo após `firebase.firestore()`. O SDK cacheia tudo no IndexedDB — cold start PWA é instantâneo (serve cache + sync em background). App também funciona offline. NÃO remover esse call. `synchronizeTabs: true` é essencial pra não dar lock conflict quando Safari + PWA standalone abertos simultaneamente.
- **Firestore subEntries carrega TUDO**: sem date-window, depois de 1 ano de uso entries passa de 1000 rows. Próxima otimização planejada: adicionar `where('date', '>=', today-90d)` em subEntries e carregar history sob demanda. Não feito ainda (v10.5.2) — offline persistence mitiga o problema a curto prazo.

-----

## State per-device vs shared — regra (v11.1)

O app é usado pelo William + esposa em 2 iPhones simultâneos, com Firestore compartilhado. Regra de divisão do state:

- **Compartilhado (Firestore)**: dados do bebê (entries, profile básico, timer ativo, config de reminders), notificações GERADAS pela engine (inbox.items).
- **Per-device (localStorage)**: "eu já vi essa versão" (`lp_last_seen_version`), "eu marquei essa notificação como lida" (`lp_inbox_read` — Set de keys). A engine continua gerando a mesma notificação pros 2 devices, mas cada um rastreia sozinho quais marcou como vistas.

Regra prática: se o state é "eu, neste device, já percebi X", vai pra localStorage. Se é dado da Louise ou config compartilhada, Firestore.

- Legacy `inbox.items[].read === true` do Firestore AINDA é respeitado como fallback (OR com localReadKeys) pra não quebrar dados pré-v11.1.
- `profile.lastSeenVersion` do Firestore é usado APENAS como fallback na primeira abertura pós-v11.1 (se localStorage vazio MAS Firestore tem valor, herda pra não spammar toast).

-----

## Integridade de dados — NUNCA QUEBRAR

Perda de dados aconteceu na v10.4.7 (foto + nome da Louise sumiram). Fix em v10.5.0. Regras absolutas daqui pra frente:

- **Todo `.set()` no Firestore precisa de `{merge:true}`** salvo quando explicitamente fizer sentido substituir o doc inteiro (ex: `saveTimer` ou entries novos). Atualmente com merge: `saveProfile`, `saveInbox`. Sem merge: `saveTimer` (state completo do timer), `addEntry` (entry novo), `saveMeds` (sempre full list), `savePushToken` (doc dedicado por token), `addReminder` (reminder individual).
- **Side-paths NUNCA mandam spread de estado em memória**. Se o objetivo é marcar um campo, manda só `{campo: valor}`. Exemplos:
  - `markChangelogSeen` → `FB.saveProfile({lastSeenVersion:APP_VERSION})`, não `{...profile,lastSeenVersion}`.
  - `persistToggle` no Profile → manda só o override, não o patch completo.
- **Causa do bug original**: race condition (onSnapshot ainda não tinha disparado) + multi-aba + `.set()` replace + spread de `profile` default em memória. Qualquer combinação dos 3 fatores e os dados sumiam.
- Se precisar deletar um campo explicitamente, usar `firebase.firestore.FieldValue.delete()` (merge ignora `undefined`).

-----

## Lista do Hoje (Home) — regras de filtro

Filtro complexo que já gerou vários bugs. Estado atual (v10.4.6+):

- `todayE = entries.filter(e => e.date === today)`.
- Um evento é **escondido** da lista apenas se:
  1. `e.nightWake && liveBedtime` e o tempo cai dentro do liveBedtime (evento será mostrado dentro do SleepBlock live), OU
  2. `findContainingBedtime(e)` retorna um bedtime que **vai realmente ser renderizado** como SleepBlock (live OU `cb.date===today && cb.wakings.length>0`). Caso contrário, mostra como EntryRow normal (evita evento órfão).
- `findContainingBedtime` usa **bordas estritas**: `evMs > startMs && evMs < endMs`. Evento exatamente na hora de início/fim conta como fora — caso típico: primeira mamada da manhã logada na mesma hora que o bedtime terminou. Mesma estritude aplicada em `retroactiveEvents` do SleepBlock e `linkedEvents` das wakings.
- Spacer do bottom do scroll do Home: `calc(80px + safe-area)` sem timer ativo, `calc(160px + safe-area)` com timer (nav pill em z:300 tapa os últimos pixels se o spacer for menor).

-----

## Princípios e práticas (NÃO NEGOCIÁVEIS)

### Workflow obrigatório

1. **Mockup HTML primeiro** sempre que houver mudança visual ou de UI — William revisa e aprova antes de implementar. Salvar em `.claude/mockups/<nome>.html` e abrir via preview server.
2. **Commits incrementais e focados** — evitar bundling de mudanças não relacionadas
3. **Bump de versão + changelog** acompanha toda mudança funcional (no formato bilíngue novo)
4. **Atualizar CLAUDE.md** no mesmo commit sempre que a mudança tiver implicação arquitetônica, descoberta de bug latente, ou alteração de invariante. A versão atual aqui em cima sempre tem que bater com `APP_VERSION` do index.html.
5. **Validação antes de entregar**: `node build/build.mjs` roda o babel transform — se der erro de sintaxe, aparece aqui. Sempre rodar antes de commitar uma mudança no index.html.

### Padrões Babel-safe (evitar travas no Babel Standalone)

- Arrow functions e template literals (não usar `function()` declarations dentro de JSX nem string concatenation)
- Sem IIFEs como argumentos de função
- Sem emoji dentro de tags `<script>`
- Verificar braces/parens/brackets balanceados antes de qualquer entrega

### Timezone (BRT, UTC-3)

- **Sempre** usar métodos locais: `getFullYear()`, `getMonth()`, `getDate()`
- **NUNCA** usar `toISOString().slice(0,10)` pra exibir datas — causa rollover às ~21h BRT
- Funções afetadas históricas: `todayStr()`, `dateOffset()`, qualquer comparação de data

### Disciplina de escopo

- Variáveis usadas dentro de callbacks devem estar definidas no escopo correto
- Verificar shadowing entre helpers globais e variáveis locais (já aconteceu com `realSleepMin`)
- Usar `e.stopPropagation()` em botões dentro de elementos clickable pra evitar bubbling

### Comunicação

- Voice-to-text — interpretar contextualmente, não literalmente
- Feedback via opção (ex: "Opção B", "alternativa enxuta") — implementar exatamente o que foi selecionado
- Idioma de trabalho: português (interno) com app bilíngue (PT/EN)

-----

## Workflow de entrega

```
Pedido → Mockup HTML → Aprovação do William → Implementação no filesystem
       → Bump versão + entrada bilíngue no CHANGELOG + atualiza CLAUDE.md se houver mudança arquitetônica
       → Validação local (node build/build.mjs)
       → git add / commit com mensagem descritiva (CLAUDE.md no MESMO commit)
       → git push → GitHub Action roda build + deploy via Pages
```

Regras de git:
- Commit apenas quando o William pedir explicitamente (ou quando o escopo da tarefa incluir "commita e pusha")
- **Sempre pra `main`**. Mesmo trabalhando numa worktree `claude/<nome>`, o push é `git push origin HEAD:main` — nada de PR intermediário, nada de deixar mudança parada numa branch. A main é a fonte da verdade e é o que a GitHub Action publica.
- Depois de pushar pro remote/main a partir de uma worktree: o working tree da main local (`C:\Users\willi\Documents\projects\louise-pro`) fica desatualizado. Pra uma nova sessão lá começar com o CLAUDE.md atual, rodar `git pull` na main local (ou abrir a sessão no worktree ativo).
- Nunca force-push em `main`; nunca `--no-verify` sem pedido explícito
- Mensagem de commit curta e focada no porquê; uma mudança funcional = um commit

### Padrão do CHANGELOG bilíngue

Cada entrada é `{v, date, pt:{title, bullets}, en:{title, bullets}}`. Bullets suportam:
- `★ ` no início → highlight verde
- `**texto**` → destaque lavanda

O header do `index.html` mantém a lista curta das últimas versões; o histórico completo vive no modal "Ler novidades" dentro do app.

## Ambiente de validação (local)

- Pasta sugerida: `C:\Users\willi\Documents\projects\louise-pro\.validate\` (ou `~/validate`) com `@babel/core`, `@babel/preset-env` e `@babel/preset-react` instalados via `npm install` local (fora do repo — `.validate/` fica no `.gitignore`)
- Validação padrão:
  1. Contagem de braces/parens/brackets via script Python curto
  2. `babel.transformSync()` via Node, simulando a ordem em que os scripts são carregados no `index.html`
- Mock mínimo antes de carregar os módulos extraídos: `global.window = {}; global.navigator = {};`
- Se o ambiente de validação não existir ainda, dizer isso explicitamente em vez de pular a etapa silenciosamente.

-----

## Próximos passos possíveis (ideias arquivadas)

- **Modo noturno do Ring** (ideia tipo Napper: zerar ring quando entra no Bedtime, mostrar meia-lua noturna com eventos da madrugada) — **arquivado por decisão do William**
- Importar dados do Napper se um dia exportarem
- Análise comparativa pai vs mãe (quem registrou o quê)
- Integração com Apple Health
- Backup automático em outro destino além do Firestore

## Coisas que NÃO devem acontecer

- Mexer no `routine-engine.js` sem motivo forte (ele é estável e mudanças nele têm alto risco de regressão)
- Adicionar dependências npm ao runtime do app (browser). npm em `build/` é ok porque roda só em CI. Não adicionar TypeScript, bundler, ou preset-env ao build sem justificativa forte de performance.
- Mudar a estrutura de dados do Firestore sem migration plan
- Quebrar backward compatibility com sleeps antigos (sem `wakings[]`)
- Adicionar features que exigem login ou autenticação
- Force-push em `main`, commits sem pedido, ou `git add -A` cego (pode pegar arquivos sensíveis)
