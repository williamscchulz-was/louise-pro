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
- **Versão atual**: v11.9.111 (app) / routine-engine v2.2.4
- **⚠️ LANDMINE de build — `$&`/`$1` no código-fonte (v11.9.111):** o `build/build.mjs` injeta o app no shell via `html.replace(BABEL_SCRIPT_RE, ...)`. Se a substituição for uma STRING, qualquer `$&`/`$1`/`` $` ``/`$'`/`$$` no código-fonte é interpretado como padrão especial de replacement e **corrompe o JS** (o app morre na abertura, e `node build/build.mjs` NÃO acusa — Babel transpila OK, a corrupção é no `.replace`). Foi exatamente o bug v11.9.107→110: um `"\\$&"` (idiom de escape de regex em `entryWarn`) virou a tag `<script>` casada → app offline por 4 versões, porque os deploy-checks só conferiam a string `APP_VERSION`, não que o app BOOTAVA. **Blindagem aplicada:** o `.replace` da linha 76 agora usa REPLACER-FUNÇÃO (`() => "<script>..."`), imune a `$` no fonte. **Regras novas: (1) NUNCA usar `$&`/`$1`/`` $` ``/`$'` em string literal no `src/` — usar replacer-função (`c=>"\\"+c`); (2) validação de verdade = `node --check` no bloco transpilado do `dist/index.html` (não só `node build/build.mjs`); (3) o deploy-poll tem que confirmar que o app PARSEIA, não só a versão.**
- **Curva de comportamento (v11.9.110):** página nova `BehaviorPage` (`src/55-behavior.jsx`) — clone visual do GrowthPage (overlay+Starfield+eyebrow cards+tap-to-inspect). 3 gráficos semanais (sono total/dia, leite/dia, despertares/noite) sobre `behaviorWeekly(entries,birthDate,10)` (00-core, PURA: janelas de 7 dias terminando ontem, ≥2 dias rastreados/semana, devolve `{totalSleep,nightSleep,mlDay,wakings,ageM,endDate}`). O sono tem banda suave `typicalSleepMin(ageM)` (NSF/AAP, referência não-diagnóstica + nota de "depende de quanto registra"). Rotada como o Crescimento: `goBehavior` (useCallback ACIMA do early-return), `behaviorFromRef`, `page==="behavior"`, botão ícone-gráfico no header do StatsPage (`onBehavior`). 12 asserts de harness.
- **Recordes de sono (v11.9.109):** `sleepRecords(entries)` (00-core, PURA) → `{longestSleep,longestNap,bestNight,badges}`. Recorde de sono usa REAL (durationMin − soma das `wakings[].durationMin`, pra não inflar com noites de muitos despertares); bestNight = menos despertares entre noites com ≥4h reais; 4 badges destravam UMA vez (`h4`≥240, `h6`≥360, `w1`≥300 & ≤1 desp., `through`≥360 & 0 desp.). Card "Recordes de sono" no FIM do StatsPage (3 tiles + chips de badge acesos/apagados); recorde ≤1.5 dias ganha selo "NOVO". 10 asserts de harness.
- **Boletim da semana (v11.9.108):** `weeklyHeadline(entries,lang)` (00-core, PURA) → 1 frase no TOPO do StatsPage com a MAIOR mudança significativa (por `rel`) dos últimos 7 dias completos vs os 7 anteriores. Métricas: sono/dia, ml/dia, despertares/noite (limiares min abs/rel: 25min/0.10, 40ml/0.10, 0.6/0.15; exige ≥3 dias rastreados por semana). Render SEM useMemo (StatsPage é `React.memo` e lê `_lang` global — useMemo[entries] congelaria o idioma). Card lilás com Icon + eyebrow "Esta semana". 9 asserts de harness.
- **Aviso suave no Salvar (v11.9.107):** `entryWarn(type,payload,allEntries)` (00-core, PURA, retorna `{pt,en}` ou null) pega (1) **dose dupla** — mesmo remédio por nome ≤4h, ou mamada/amamentação ≤30min (cenário 2-devices: o outro iPhone já registrou) — e (2) **outlier/dedo-gordo** (ml fora de mediana·[0.45,2.2] com ≥5 amostras; temp <34/>41,5; sono/soneca >16h; peso/comp/cabeça fora de faixa de bebê). NÃO bloqueia: AddForm mostra banner amber + o botão vira "Salvar assim mesmo"; `guardMsg` exige 2º toque e o `useEffect` re-arma (limpa) quando qualquer valor muda. 25 asserts de harness.
- **Defaults inteligentes por horário (v11.9.106):** `hourlyTypicalMl`/`likelyDiaperSubtype` (00-core, recency-weighted ±90min sobre `entries`) pré-preenchem o ml da mamadeira e o subtype da fralda pelo PADRÃO DAQUELA HORA — AddForm recebe `allEntries={entries}`; fallback antigo (suggestedMl/lastBottleMl, "wet") com pouco dado (<3 mamadas / <4 fraldas na janela). Atalho de **banho inicia o timer direto** (1 toque, igual sono/soneca — `startTimer("bath")` no quick button).
- **Rotina parcial (v11.9.105):** status novo **`skipped`** — slot `late` cujo `targetMin < maxDoneTarget` (existe etapa de alvo MAIOR já feita) = pulado (o dia seguiu); render neutro (riscado/cinza, "pulado", sem cobrança "!"). `allDone` virou "tudo `done` OU `skipped` + ≥1 `done`" → a rotina FECHA o dia mesmo com etapas puladas, mostrando "Rotina concluída · N pulada" (`routineState.skippedCount`). Uma `late` recente (nada de alvo maior feito ainda) continua `next-late` (cobra). Tudo no `routineState` (90-app), 18 asserts de harness.
- **⚠️ Revisão completa v11.9.92-99 (invariantes novos):** (1) **Home ESTÁVEL** — CuriosityCard (abaixo do grid 2×2, dispensa diária `lp_curiosity_dismissed` em localStorage) e InsightCards (`slice(0,1)`) NÃO têm mais auto-hide; NUNCA reintroduzir cards que montam/desmontam por timer acima do Ring. Rotina renderiza ACIMA dos efêmeros (napSug/insights). (2) **stopTimer**: sleep/nap <3min = DESCARTA (sem entry/wakeup; TimerBar mostra ✕ cinza via `secs<180`); todo stop tem UNDO (`undoStop(ids)` apaga entries + restaura snapshot do timer); wakeup automático só com `mins>=30`. (3) **`.hit44`** (styles.css) = hit-area 44px invisível; usar em qualquer controle <40px. (4) **quickSuggestions**: `wakeup` entra garantido 05-11h sem registro do dia (chama `quickWakeup`) e `SLOT_ORDER` canônico fixa a POSIÇÃO por tipo — o score só escolhe QUAIS. (5) **`flexed(type,key)`** (10-ui-base) flexiona gênero PT nos toasts (`FEM_TYPES`) — usar pra registrado/atualizado/removido. (6) **Dieta de movimento**: SEM dash/sparkle no Ring idle (dash só com timer ativo), sino usa `.bell-once` (2x na mudança de contagem, key remonta) — não reintroduzir loops infinitos redundantes nem SMIL `<animate>` (ignora `body.app-hidden`). (7) **GrowthPage** está na geração visual atual (overlay+Starfield+eyebrow cards, eixo de meses, tap-to-inspect `selPt`) e o voltar respeita a origem (`growthFromRef` — Stats ou Ajustes). (8) Idioma persiste na hora via `persistToggle({lang})`; vírgula decimal aceita em peso/temp; Toast tem prop `lift` (sobe acima do TimerBar com timer ativo).
- **Splash (v11.9.78):** a logo de abertura virou a silhueta mãe+bebê **vetorizada** que se desenha (efeito traço→preenche). O path está em `const LOUISE_SIL` (topo de `src/00-core.jsx`; usado no splash em `src/90-app.jsx`) (traçado via potrace de `assets/icons/icon-512.png` — fiel à logo original). Anima por classes CSS `.spl-draw` (stroke-dashoffset) + `.spl-fill` (em `styles.css`). **Splash 1×/dia (v11.9.98):** o splash COMPLETO (traço que se desenha, timer 3000ms — tinha driftado de 2200 sem doc) roda só na 1ª abertura do dia; as demais ganham versão curta ~900ms (`.spl-fill-quick`, logo preenchida + fade, sem o path de stroke). Flag per-device `lp_splash_date` em localStorage, comparada com `todayStr()` num useState initializer (acima do early-return — Rules of Hooks). **`window.LOUISE_ICON`** (base64 PNG em `js/splash-icon.js`) ficou sem uso e foi **removido do bundle na v11.9.79** (tirado de `build.mjs` JS_BUNDLE_FILES + `<script>` tag do index.html + `sw.js` precache → app-libs.js ~12KB menor, cold start mais leve). O arquivo `js/splash-icon.js` foi **deletado de vez na v11.9.84** (estava morto desde a v11.9.79). Ferramenta de vetorização fica em `.claude/vectorize/` (gitignored: potrace+resvg).
- **⚠️ INVARIANTE i18n + React.memo (v11.9.77):** `_lang` é um global de módulo (`let _lang`), NÃO state do React — App o sincroniza com `profile.lang` no render (em `src/90-app.jsx`: `_lang=lang`). Consequência: componentes `React.memo` que renderizam texto **NÃO re-renderizam ao trocar o idioma** (props não mudam) e congelam no idioma anterior → bug "metade EN, metade PT". **Regra: todo `React.memo` que mostra texto DEVE receber `lang={lang}` em TODOS os call sites** (mesmo que internamente leia `_lang`) — o prop muda no switch e força o re-render. Já cobertos: Ring, CuriosityCard, TimerBar, InsightCards, SleepBlock, EntryRow, StatsPage, HistoryPage. Ao criar novo componente memoizado com texto, passar `lang`. (Pendente: overlays pré-React — girar/carregando/atualizando — são fixos pois rodam antes de `_lang` existir; exigem ler localStorage/navigator.language.)
- **ProfilePage / Ajustes (v11.9.75-76):** redesenhada pra ser coesa com o cosmos. Header com título gradiente + hero (avatar/nome/idade). Render organizado em **6 grupos** com card consistente (`linear-gradient(180deg,rgba(22,28,60,0.55),rgba(20,26,60,0.32))` + `T.gBSoft` + radius 18 + `T.insetTop`) e eyebrow colorido com ícone: **Perfil** (purple/star: nome/nascimento/meta + dados de nascimento + ver-crescimento), **Rotina** (accent/clock), **Preferências** (cyan/gear: idioma + manter-tela-ligada), **Notificações** (amber/bell: push + lembretes remédio + lembrete mamada como sub-cards com divider), **Dados** (green/cloud: eyebrow + `<BackupSection/>`), **Sobre** (pink/star: versão/changelog + streak). Toda a lógica/handlers/state ficam ACIMA do `return` e não foram tocados na reorg.
- **⚠️ Haptics são NO-OP no iOS:** `Haptic.*` (light/medium/heavy/success/warning em `js/device-features.js`) usa `navigator.vibrate()`, que o **iOS Safari/PWA NÃO implementa** (decisão da Apple). As chamadas ficam no código (funcionam no Android) mas **não fazem nada no iPhone** — o device alvo do William. Logo: NUNCA propor "feedback tátil/haptic" como recurso premium pra ele. Pra "feedback de ação/conquista", usar equivalente VISUAL (confetti, count-up, spring, flash). O toggle de vibração foi removido na v11.x exatamente por isso.
- **Bilíngue**: Português e Inglês (toda a interface, insights, curiosidades e changelog)

## Stack

- **HTML + React CDN** (ainda sem bundler, sem TypeScript, sem npm em produção)
- **React 18** via CDN (unpkg)
- **JSX pré-compilado em build-time** via `@babel/core` + `@babel/preset-react` — o navegador NÃO carrega mais `@babel/standalone`. Esse é o único passo de build. **O código do app vive em `src/*.jsx` (v11.9.85)** — o build concatena os arquivos na ordem do nome (prefixo `NN-`) e transpila como UM bloco só (escopo único compartilhado, SEM bundler/módulos/imports). O `index.html` virou só um shell com `<script type="text/babel"></script>` vazio que o build preenche. Como é concat→transpile, o compilado é idêntico ao do antigo arquivo único (provado por diff na migração).
- **Firebase 10.x compat** via CDN — Firestore para persistência
- **PWA** com manifest.json, ícones e splash screen
- **GitHub Pages + Actions** para deploy (a partir de v10.0.0)

### Regra de stack (atualizada em v10.0.0)

O princípio "sem build" foi relaxado *com justificativa de performance*: a transpilação JSX saiu do runtime do navegador pro build step, porque Babel Standalone travava o cold start em iPhone PWA. Isso **não** abre precedente pra adicionar bundler (Vite/webpack), TypeScript, ou npm em produção. O build tem 1 função só: JSX → JS. Se a próxima proposta for "adicionar X ao build", questionar se o ganho justifica — a simplicidade é o ponto.

## Arquivos do repositório

```
louise-pro/
├── index.html               ← SHELL: <head>, boot script, <style></style> e <script type="text/babel"></script> VAZIOS que o build preenche, + <script src> das libs. NUNCA servido direto. (v11.9.85 app→src/; v11.9.86 CSS→styles.css.)
├── styles.css               ← CSS do app + TODAS as @keyframes/animações (v11.9.86). O build re-inlina no <style> vazio do index.html (cold start sem request extra). EDITE O CSS AQUI. "keyframes no topo" em notas antigas = topo deste arquivo.
├── src/                     ← CÓDIGO DO APP (JSX). Build concatena na ordem do nome (NN-) + transpila como 1 bloco. EDITE AQUI, não no index.html.
│   ├── 00-core.jsx          ← APP_VERSION, CHANGELOG ref, constantes/dados, helpers (todayStr, suggestQuickActions…)
│   ├── 10-ui-base.jsx       ← Icon, T (tokens), INP_BASE, TYPES, I (i18n), L/TL
│   ├── 20-ring.jsx          ← Ring
│   ├── 22-timer-cards.jsx   ← LastFeedCard, EditStartModal, NursingSidePicker, TimerBar
│   ├── 24-widgets.jsx       ← CuriosityCard, CountUp, Confetti, InsightCards, Toast, Modal, Fld, Seg
│   ├── 30-sleepblock.jsx    ← SleepBlock
│   ├── 32-addform.jsx       ← AddForm
│   ├── 34-inbox.jsx         ← InboxPanel
│   ├── 40-profile.jsx       ← ProfilePage
│   ├── 42-changelog-update.jsx ← ChangelogModal, UpdateToast
│   ├── 50-stats.jsx         ← StatsPage
│   ├── 52-history.jsx       ← HistoryPage
│   ├── 54-growth.jsx        ← GrowthPage
│   ├── 55-behavior.jsx      ← BehaviorPage (curva de comportamento, v11.9.110)
│   ├── 56-milestones.jsx    ← MILESTONE_BADGES, MilestonesPage
│   ├── 60-starfield-backup.jsx ← STARFIELD_DATA, Starfield, BACKUP_KEY, BackupSection
│   └── 90-app.jsx           ← App (componente raiz, ~1.260 linhas) + ReactDOM mount
├── manifest.json            ← config PWA (fica no root por convencao)
├── sw.js                    ← service worker do PWA (DEVE ficar no root — scope)
├── firebase-messaging-sw.js ← service worker do FCM (DEVE ficar no root — Firebase espera path fixo)
├── README.md
├── CLAUDE.md
├── .gitignore
├── js/                      ← libs auxiliares (plano JS, não passam pelo build)
│   ├── changelog.js         ← histórico de versões bilíngue (window.CHANGELOG) — v11.9.84
│   ├── curiosities.js       ← curiosidades bilíngues (dia 1 → mês 12)
│   ├── milestones.js        ← marcos do desenvolvimento (CDC 2022 + WHO MGRS + SBP, 0-24m)
│   ├── routine-engine.js    ← engine de análise de padrões (sleep + feed)
│   ├── who-growth.js        ← tabelas LMS OMS + funções de percentil
│   ├── wake-lock.js         ← helper de Wake Lock API
│   └── device-features.js   ← helpers de device (haptics etc.)
├── assets/
│   └── icons/
│       ├── icon-192.png / icon-512.png / apple-touch-icon.png
├── build/                   ← tooling de build (só em dev/CI, não em prod)
│   ├── build.mjs            ← inlina styles.css + concatena src/*.jsx (JSX→JS) + bundla js/ + injeta versão no sw.js
│   ├── package.json         ← deps: @babel/core + @babel/preset-react
│   └── .gitignore           ← ignora node_modules e package-lock
├── .github/workflows/
│   └── deploy.yml           ← GitHub Action: build + deploy para Pages em todo push na main
└── dist/                    ← (gitignored) output do build, gerado pelo CI em cada deploy
```

**Regra:** NÃO mover `sw.js`, `firebase-messaging-sw.js`, ou `manifest.json` pra subpastas. Service workers têm scope baseado no path do arquivo; moveu, quebrou notificações. Firebase Messaging procura por `firebase-messaging-sw.js` no root do scope do app.

**Build step (resumo):**
- Edita: **`src/*.jsx`** (o código do app, split por componente/página) — NÃO o `index.html` (shell). **CSS/animações em `styles.css`** (re-inlined pelo build). Dados/changelog/curiosidades/marcos em `js/`. (Refs de "linha ~N" espalhadas neste doc são do monolito pré-v11.9.85; agora ache o componente pelo nome no `src/` correspondente.)
- Build: `cd build && npm install && cd .. && node build/build.mjs` — gera `dist/`
- Deploy: push na `main` → GitHub Action roda o build e publica `dist/` via `actions/deploy-pages`
- Pre-requisito **uma vez só no repo**: Settings → Pages → Source = "GitHub Actions"

## Ambiente local (multi-máquina)

O William trabalha neste repo a partir de **várias máquinas** via Claude Code (PC de casa, PC do trabalho, MacBook). Todas compartilham o mesmo remote (`origin/main`) como fonte da verdade.

- **Windows** (casa/trabalho): Windows 11, shell bash (Git Bash / MSYS) — sintaxe Unix (`/dev/null`, forward slashes). Raiz: `C:\Users\willi\Documents\projects\louise-pro`. Worktrees em `...\.claude\worktrees\<nome>`.
- **MacBook**: raiz `/Users/williamschulz/louise-pro`. `node`+`npm` e `gh` (autenticado) instalados em `/usr/local/bin`.
- Claude Code tem acesso direto ao filesystem e ao git em qualquer uma — edita no lugar, sem upload manual.

## Workflow multi-máquina — sync automático (NÃO QUEBRAR)

**Problema que isso resolve:** como o William alterna entre máquinas, um clone pode ficar muito atrás do remote. Já aconteceu de uma sessão refazer do zero uma tarefa que já estava feita e deployada (clone preso 55 commits atrás). A regra abaixo torna isso impossível de repetir.

**A fonte da verdade compartilhada é o REPO (este CLAUDE.md + código versionado), nunca a memória local do Claude Code.** A memória `~/.claude/.../memory/` é por-máquina e NÃO sincroniza entre os PCs. Logo: **todo conhecimento novo do projeto (decisão arquitetural, bug latente, invariante) vai pra ESTE arquivo e é commitado** — assim viaja pra todas as máquinas. A memória local só guarda ponteiro ("ler o CLAUDE.md do repo").

**Hooks de sync automático** (em `.claude/hooks/`, versionados, ativos em todas as máquinas):
- `sync-pull.sh` (SessionStart): no início de toda sessão, `git fetch` + `git pull --ff-only` se o clone estiver atrás e limpo. Se estiver atrás **e** sujo, avisa pra resolver antes de trabalhar. **Consequência prática: toda sessão começa atualizada.** Mesmo assim, antes de assumir que uma tarefa "não foi feita", checar `git log --oneline -20` — pode ter vindo de outra máquina.
- `sync-push.sh` (Stop): ao fim de cada turno, se houver commit local à frente de `origin/main` e a working tree estiver limpa, faz `git push origin HEAD:main`. **Não commita nada** (só empurra o que o Claude já decidiu commitar) e **nunca força** — push divergente falha limpo e avisa.

**Disciplina que o Claude deve manter** (os hooks são a rede de segurança, não substituem isto):
1. Começar lendo o estado: o auto-pull já rodou, mas confirmar com `git log` se a tarefa pedida não foi resolvida em outra máquina.
2. Toda entrega funcional = commit focado (com bump de versão + changelog + este CLAUDE.md no mesmo commit, quando aplicável). O auto-push leva pro remote ao fim do turno.
3. Nunca deixar trabalho só local "pra depois" — se está pronto, commita (o push é automático).

**Setup dos hooks numa máquina nova:** eles vêm versionados, então um `git clone`/`git pull` já os traz. O Claude Code os ativa a partir da sessão seguinte (precisa que `.claude/settings.json` os referencie — também versionado). Em máquina realmente nova, abrir `/hooks` uma vez (ou reabrir o Claude Code) garante que o watcher carregue.

## Firebase

- **Projeto**: louise-pro
- **apiKey**: AIzaSyBPiWTlC0ZKLEX5Z8PqKM2c3zaXN8p7DH8
- **appId**: 1:670065554630:web:e8bdf489a3db28b8fe53c7
- **Sem login** — dados compartilhados entre os 2 dispositivos via Firestore

### Firestore Collections

- `entries/` — todos os eventos registrados (mamadas, sono, fraldas, banho, medicina, temperatura, crescimento, **`milestone`** v11.9.56)
  - `milestone` entries têm: `type:"milestone"`, `key` (chave de `window.DEV_MILESTONES`), `category` (motor_gross/motor_fine/language/social_emotional/cognitive), `date`, `note` opcional. Lista pre-definida em `js/milestones.js` (85 marcos 0-24m, CDC 2022 + WHO MGRS + Denver II + AAP, ordenados por `checkupAge`) + `window.CONCERNING_SIGNS` (17 sinais "Act Early"). A engine ordena `window.DEV_MILESTONES` por `checkupAge` ao carregar — a Home usa `upcoming[0]` (ordem do array), então a ordenação importa.
  - **Namespace note:** `window.DEV_MILESTONES` é diferente de `window.MILESTONES` (`curiosities.js` — curiosidades mensais 2-12m, schema `{m,pt,en}`). Os 2 coexistem sem colidir, mas atenção pra não confundir.
- `config/profile` — perfil da Louise (nome, foto, data nascimento, meta ml, idioma, lastSeenVersion, keepScreenOn, **`routine`** v11.9.40)
  - `routine.enabled` (bool) · `routine.wakeTime` · `routine.bathTime` · `routine.bedtime` · `routine.bottlesPerDay` (int) · `routine.naps` (array de `{time}`). Opt-in: feature inativa se `routine.enabled !== true`. Default no Profile UI: wake 07:00, banho 18:00, bedtime 19:30, 4 sonecas 08:15/10:45/13:30/16:00, 7 mamadas/dia. **v11.9.88-91:** rotina ganhou 3 estágios pós-banho. **v11.9.90 (fix importante):** o default é aplicado em **RUNTIME** no `routineState` (`pbTimeStr = r.postBathBottleTime || banho+15`) — a v11.9.88 exigia salvar os Ajustes, mas o Salvar nem liberava sem mudança (dirty-check), então os estágios nunca apareciam. O único campo em Firestore é `routine.postBathBottleTime` (string "HH:MM"), que SOBRESCREVE o default. **Myrafer (era Floripa até v11.9.104) E Vit. D NÃO têm campo/config: são CALCULADOS (v11.9.91)** = mamadeira pós-banho + 5min (horário REGISTRADO da mamadeira quando ela já aconteceu — mamou 18:28 → ambos 18:33 —, senão o alvo dela; `routine.floripaTime`/`routine.vitdTime` legados são ignorados). Matching: **Myrafer/vit. D casam por NOME em qualquer hora do dia** (`medToday(re)` — remédio diário dado hoje = feito; o horário do slot só ordena o "próximo"); regexes `/myrafer/i` e `/vit(amina)?\s*\.?\s*d/i`. **Mamadeira pós-banho** casa por janela ASSIMÉTRICA `findMatch(["bottle"],tMin,45,90)` — janela curta pra trás pra não pegar a mamada pré-banho. Slots deslocam com o acordar via `adj(tMin,"pb")` (Myrafer ancorado em registro real não desloca de novo). Tipos novos (`pbbottle`/`myrafer`/`vitd`) NÃO entram no pool de consumo de soneca. Na Home, o card de remédios é **UM card dividido ao meio: Simeticona | Tylenol** (v11.9.89; entry `dual:[{l,c,n,f}...]` no array do grid de resumo, metades com divisória vertical, cores amber/red, regex `/tylenol|paraceta/i` via `totalTylenol`) — o grid de resumo segue **2×2** (Mamad. | Remédios / Sono | Fralda). **v11.9.83:** `bottlesPerDay` virou só FALLBACK — `routineState.bottlesTarget` é ADAPTATIVO (mediana de mamadas/dia das últimas ~21 datas com dado, exclui hoje; usa o config se <5 dias de histórico). E `routineState.nextBottleMl` sugere a próxima mamadeira = `(profile.mlGoal − tomado hoje) ÷ (target − feitas hoje)` arredondado a 5ml (só se `mlGoal>0`) — pré-preenche o AddForm via prop `suggestedMl` e aparece no card expandido. **v11.9.104:** `bath` virou TIPO-TIMER (start/stop → entry com `durationMin`, igual tummy/nap). TimerBar, centro do Ring e AddForm (`isTimerType`) tratam `bath` em cyan; banho NÃO dispara `bedtime-active` (só `type==="sleep"`); o discard <3min do TimerBar é só sono/soneca (banho curto é válido). `startTimer`/`stopTimer` são genéricos — bath cai no else do stop (entry `bath` + `durationMin`, sem wakeup). Live bath timer marca o estágio de banho da rotina (activeTimerMatch).
  - **Matching de slot (v11.9.80):** `findMatch` em `routineState` (App) marca um slot como "feito" por **sobreposição de intervalo**, não só hora de início. Cada evento vira `[início, início+durationMin]` e conta se intersecta a janela `[alvo-earlyTol, alvo+lateTol]` (helper `overlaps()`). Resolve soneca que começa cedo mas cobre o horário-alvo. Eventos sem duração (wake/bath) viram ponto → cai no "início na janela". Tolerâncias: wake assimétrico early 150/late 90; naps/banho/bed ±60. Timer ativo usa a mesma regra (intervalo `[início, agora]`). **Consumo de soneca (v11.9.87):** o matching de SONECA é por CONSUMO — 1 evento (ou o timer ativo, que entra como 1 token só) satisfaz no MÁXIMO 1 slot. Bug original: soneca longa (ou alvos deslocados pelo acordar) intersectava 2 janelas e o `findMatch` stateless marcava as duas como done. O pass roda DEPOIS do `slots.sort` (slots em ordem cronológica), e cada slot de soneca pega o candidato não-consumido mais PRÓXIMO do alvo (`|início−alvo|`, tie-break: início menor). Só sonecas — wake/bath/bed/pós-banho usam tipos disjuntos e ficam no `findMatch` normal. **Ajuste por acordar (v11.9.83):** `routineState` calcula `wakeDelta = acordou − alvo` (do evento `wakeup` de hoje; trava em ±120min, ignora <10min) e desloca os `targetMin` de sonecas/banho por esse delta (helper `adj()`); o **bedtime fica ANCORADO em `[bedtime, bedtime+30]`** (config 19:30 → janela 19:30-20:00). O `target` exibido vira o horário JÁ ajustado (`minToTime(tMin)`); badge "horários ajustados" aparece no card expandido quando `wakeDelta!==0`. `wake` em si não desloca (mostra o horário real via `match`).
  - **Quick buttons adaptativos (v11.9.83):** os 3 botões da Home (grid `repeat(3,1fr)`, só com `!activeTimer`) saem de `quickSuggestions` (useMemo, acima do gate de splash) → `suggestQuickActions(entries,todayE,nowMin,routine)`, função PURA top-level logo após `nowTime()`. Nota por candidato = frequência naquela hora (±90min, recency-weighted meia-vida ~14d, exclui hoje) + transição "o-que-segue-o-último-evento-de-hoje" (≤90min) + proximidade da rotina − cooldown (penaliza o que acabou de fazer). Priors por faixa de horário cobrem cold-start. Candidatos: bottle/nursing/diaper/nap/sleep/bath/medicine. O "+" (FAB) mantém acesso às 10 ações. `nowMin` é lido no render (SEM tick novo — refresca ao abrir/registrar/navegar; staleness só se ficar parado >30min, aceitável). Botões recém-surgidos animam via `.qbtn-appear` (só no mount, porque `key={tipo}` → tipo estável não remonta).
- `config/meds` — medicamentos salvos pra quick-select
- `config/active` — timer ativo (sync em tempo real entre dispositivos)
- `config/inbox` — estado da caixa de notificações
- `config/reminders/items/{id}` — lembretes. `tipo:"feedingInterval"` (default 120min desde v10.4.1) ou `tipo:"scheduled"` (medicamento com horários)
- `config/backups` — snapshot único de backup (v11.4). Fields: `snapshot`, `updatedAt`, `size`. Sempre sobrescrito pelo mais recente. Compartilhado entre os 2 devices do casal. Auto-save a cada 24h via App root. Limite 1 MiB (Firestore hard limit) — `FB.saveBackup` falha com erro claro se passar disso.

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
- Ring: SVG puro com arcs, sem disco central. **Miolo atrás do tempo (v11.9.82):** ganhou uma nebulosa suave que respira (`.ring-neb` + `.ring-neb2`, bedtime mais roxo/intenso) + poeira estelar (`.ring-dust-a/b/c`) + halo pulsando (`.ring-pulse`, só com `activeTimer`) — preenche o vazio chapado que ficava feio atrás do número. **Regra:** essas animações são por CLASSE CSS (keyframes `ringNebBreathe`/`ringNeb2Breathe`/`ringPulseHalo`/`ringDustA/B/C` definidos no topo, logo após `body.bedtime-active`), NUNCA inline — o Ring re-renderiza no tick de 5s e o inline resetaria a anim. Tamanhos são `sz*fator` (sz = lado do ring); posições da poeira são FIXAS/determinísticas (nada de `Math.random` no render, senão pula a cada tick). Os elementos entram ANTES do div de texto central (DOM order = texto por cima) e os ícones em órbita têm `zIndex>=2` (ficam acima da nebulosa, que é `zIndex:auto`). Text center flutua sobre tudo.
- Regra geral: quando em dúvida, menos > mais. O cosmos atrás é a identidade.

### Sistema tipográfico (v11.9.39)

Escala fixa de 7 níveis em `T`. **Toda nova label/texto inline deve usar uma dessas constantes.** Magic-numbers tipo `fontSize:14` viram débito técnico — corrigir on-the-fly se topar com um:

| Constante | Valor | Uso típico |
|-----------|-------|------------|
| `T.fXS`   | 9     | Eyebrow, caption, hour marks, micro labels |
| `T.fSM`   | 11    | Labels, body small, badges, chip text |
| `T.fMD`   | 13    | Body, list primary, detail |
| `T.fLG`   | 15    | Sub-heading, card title |
| `T.fXL`   | 17    | Heading, modal title |
| `T.f2XL`  | 22    | Display small (Ring center, duration headlines) |
| `T.f3XL`  | 28    | Display (big numbers no Home/Stats) |

Hero displays raros (34, 36, 52) ficam inline — usar só pra splash, conquista, momento especial. Não criar constante pra menos de 5 usos.

Mudar a escala = mudar valor da constante em 1 lugar — reflete em todos os ~390 usos automaticamente. Por isso a escala não cresce: 7 níveis é o limite. Se quiser um valor "no meio" (ex: 14), pensar duas vezes — provavelmente um dos níveis já serve.

### Tokens de cor (v11.9.66)

Além de `accent/text/sub/dim/purple/green/...`, o `T` ganhou 3 tokens que antes eram hex soltos espalhados (~68 ocorrências consolidadas): `T.heading` (`#f0f2ff`, branco de título sobre card), `T.label` (`#7a80a8`, label de campo), `T.lilac` (`#c4b5fd`, lavanda de destaque/ativo). **Toda nova cor de texto deve usar um token** — não reintroduzir hex literal em `color:"#..."`. Hex literal AINDA é ok dentro de gradientes/box-shadow (strings planas onde não dá pra interpolar variável). Pendente (adiado pra mockup): escala de raio de borda — hoje há ~20 valores de `borderRadius` (9/10/11/12/13/14 fazem o mesmo papel); snap muda o visual, então precisa de revisão antes.

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
- **Firestore subEntries com janela de 90d desde v11.9.0**: `FB.subEntries(cb, daysBack=90)` aplica `where('date','>=',cutoff)` automaticamente. Cutoff é calculado no setup (estático até o app reabrir; entries de hoje continuam aparecendo pq today >= cutoff). Reduziu reads em ~80% pra usuários com >6 meses de uso. **NÃO existe "load older"** — `loadOlderEntries` foi removido na v11.9.34 como dead code (nunca foi conectado na UI). Se um dia precisar ver >90d no History, re-adicionar é trivial: nova função `loadOlderEntries(beforeDate)` + state slice separada + botão "Carregar mais" no fim do scroll do History.

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

1. **Preview-before-apply é OPT-IN (v11.9.3):** Claude Code segue direto com mudanças solicitadas pelo William. **Só pede autorização** quando: (a) mudança envolve risco real de data-loss/regressão; (b) escopo do pedido é ambíguo e tem 2+ caminhos divergentes; (c) o user explicitamente pede mockup primeiro (ou regra do item 2 dispara). Mockup HTML continua obrigatório pra mudanças visuais novas (item 2). Default é "manda ver".
2. **Mockup HTML primeiro** sempre que houver mudança visual ou de UI — William revisa e aprova antes de implementar. Salvar em `.claude/mockups/<nome>.html` e abrir via preview server.
   - **⚠️ Realidade de delivery (v11.9.67):** o William NÃO consegue ver mockup por URL no iPhone de forma confiável — localhost nunca funciona, e `/preview/<nome>.html` (apesar de tecnicamente live, HTTP 200) não chega até ele na prática (provável atrito de PWA/SW standalone + URL longa pra digitar). **A superfície de revisão confiável dele é o APP LIVE deployado** — ele consegue ver versões publicadas normalmente. Então, pra mudança visual: ou (a) descrever em texto + mandar direto pro app live (reversível em 1 commit) e ele fala "mantém/reverte", ou (b) só mockar se ele pedir explicitamente. Não assumir que ele viu um mockup só porque o link existe.
3. **Commits incrementais e focados** — evitar bundling de mudanças não relacionadas
4. **Bump de versão + changelog** acompanha toda mudança funcional (no formato bilíngue novo)
5. **Atualizar CLAUDE.md** no mesmo commit sempre que a mudança tiver implicação arquitetônica, descoberta de bug latente, ou alteração de invariante. A versão atual aqui em cima sempre tem que bater com `APP_VERSION` do index.html.
6. **Validação antes de entregar**: `node build/build.mjs` roda o babel transform — se der erro de sintaxe, aparece aqui. Sempre rodar antes de commitar uma mudança no index.html.

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
- **⚠️ LANDMINE de Rules of Hooks (v11.9.68):** o componente `App` (em **`src/90-app.jsx`**) tem um early-return de splash/loading (`if(splash||loading)return(...)`). **TODO hook (`useState/useEffect/useMemo/useCallback/useRef`) tem que ficar ACIMA desse return.** Adicionar um hook depois dele = o hook é pulado no render de splash e roda no render normal → contagem de hooks muda → **React #310 (crash "Oops! Algo quebrou")**. Foi exatamente isso que a v11.9.64 quebrou (um `useCallback` colocado logo antes do `goTo`, que vive *depois* do gate). `goTo`/`goGrowth` e afins: a função pode ficar onde quiser, mas se for `useCallback`, sobe pra cima do early-return. Mesma regra vale pra `Confetti` e qualquer componente com `return null` condicional: hook antes do return, sempre. **Validação:** `node build/build.mjs` NÃO pega isso (é erro de runtime, não de sintaxe) — só um smoke test no app pega. Cuidado redobrado ao mexer em hooks.

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

**v11.9.84:** o array `CHANGELOG` (211+ entradas, ~4.600 linhas de dado puro) saiu do `index.html` pra **`js/changelog.js`** (`window.CHANGELOG`, bundlado em `app-libs.js` igual curiosities/milestones). Isso derrubou o `index.html` de ~10.5k → ~5.9k linhas. **Regra nova: nova versão = adicionar a entrada no TOPO do array em `js/changelog.js`** (não mais no index.html). O `index.html` só faz `const CHANGELOG = window.CHANGELOG || [];`. O histórico completo aparece no modal "Ler novidades".

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
