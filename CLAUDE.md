# Louise Pro — Baby Tracker

## Como usar este arquivo

Este `CLAUDE.md` é lido automaticamente pelo Claude Code no início de toda sessão dentro deste repositório. Ele descreve o projeto, a stack, os princípios não-negociáveis e o workflow de entrega. Você (Claude Code) deve tratar este documento como contexto permanente — não precisa que o William cole ou relembre nada daqui.

Mantenha o arquivo atualizado: se algo mudar de forma estrutural (stack, workflow, princípios, versão atual), proponha uma edição aqui junto com a mudança.

-----

## Projeto

- **App**: Baby tracker pessoal para a Louise (nascida 08/03/2026), usado por mim (William) e minha esposa
- **Localização**: Blumenau, SC, Brasil (BRT, UTC-3)
- **Repositório**: https://github.com/williamscchulz-was/louise-pro
- **Live**: https://williamscchulz-was.github.io/louise-pro/
- **Versão atual**: v9.9.2
- **Bilíngue**: Português e Inglês (toda a interface, insights, curiosidades e changelog)

## Stack

- **HTML puro** (sem npm, sem build, sem bundler — princípio inegociável)
- **React 18** via CDN
- **Babel Standalone** pra JSX (transpila no browser)
- **Firebase 10.x compat** via CDN — Firestore para persistência
- **PWA** com manifest.json, ícones e splash screen
- **GitHub Pages** para deploy

## Arquivos do repositório

```
louise-pro/
├── index.html               ← app completo (~450 KB)
├── manifest.json            ← config PWA (fica no root por convencao)
├── sw.js                    ← service worker do PWA (DEVE ficar no root — scope)
├── firebase-messaging-sw.js ← service worker do FCM (DEVE ficar no root — Firebase espera path fixo)
├── README.md
├── CLAUDE.md
├── .gitignore
├── js/                      ← libs/modulos auxiliares carregados via <script src>
│   ├── curiosities.js       ← curiosidades bilíngues (dia 1 → mês 12)
│   ├── routine-engine.js    ← engine de análise de padrões (sleep + feed)
│   ├── who-growth.js        ← tabelas LMS OMS + funções de percentil
│   ├── splash-icon.js       ← base64 do ícone da splash screen
│   ├── wake-lock.js         ← helper de Wake Lock API
│   └── device-features.js   ← helpers de device (haptics etc.)
└── assets/
    └── icons/
        ├── icon-192.png
        ├── icon-512.png
        └── apple-touch-icon.png
```

**Regra:** NAO mover `sw.js`, `firebase-messaging-sw.js`, ou `manifest.json` pra subpastas. Service workers tem scope baseado no path do arquivo; moveu, quebrou notificações. Firebase Messaging procura por `firebase-messaging-sw.js` no root do scope do app.

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

-----

## Princípios e práticas (NÃO NEGOCIÁVEIS)

### Workflow obrigatório

1. **Mockup HTML primeiro** sempre que houver mudança visual ou de UI — William revisa e aprova antes de implementar
2. **Commits incrementais e focados** — evitar bundling de mudanças não relacionadas
3. **Bump de versão + changelog** acompanha toda mudança funcional (no formato bilíngue novo)
4. **Validação antes de entregar**: brace balance via Python + babel `transformSync` via Node

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
       → Bump versão (com entrada bilíngue no CHANGELOG)
       → Validação local (brace + babel transformSync)
       → git add / commit com mensagem descritiva
       → git push → GitHub Pages publica automaticamente
```

Regras de git:
- Commit apenas quando o William pedir explicitamente (ou quando o escopo da tarefa incluir "commita e pusha")
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
- Adicionar dependências npm ou ferramentas de build ao app em si (npm no `.validate/` é ok, pois fica fora do deploy)
- Mudar a estrutura de dados do Firestore sem migration plan
- Quebrar backward compatibility com sleeps antigos (sem `wakings[]`)
- Adicionar features que exigem login ou autenticação
- Force-push em `main`, commits sem pedido, ou `git add -A` cego (pode pegar arquivos sensíveis)
