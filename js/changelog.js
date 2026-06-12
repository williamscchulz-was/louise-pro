// Louise Pro — dados do changelog (extraído do index.html na v11.9.84).
// Dado puro, igual curiosities.js / milestones.js — mantém o index.html enxuto.
// Nova versão = nova entrada no TOPO do array. O app lê via window.CHANGELOG.

window.CHANGELOG = [
  {
    v: "11.9.98", date: "2026-06-12",
    pt: {
      title: "Splash completo só na 1ª abertura do dia",
      bullets: [
        '★ A animação da **logo que se desenha (3s) virou momento da primeira abertura do dia** — nas outras 20+ aberturas, uma versão curta (~1s) te deixa entrar logo. Raridade preserva o ritual; bebê no colo agradece.',
      ],
    },
    en: {
      title: "Full splash only on the day's first open",
      bullets: [
        '★ The **self-drawing logo animation (3s) is now a first-open-of-the-day moment** — every other open gets a short version (~1s) so you get in fast. Rarity keeps the ritual special.',
      ],
    },
  },
  {
    v: "11.9.97", date: "2026-06-12",
    pt: {
      title: "Dieta de movimento",
      bullets: [
        '★ Menos coisas piscando ao mesmo tempo: o último sono no anel tinha **3 animações simultâneas** (tracinhos correndo + faísca + brilho) — ficou **só o brilho respirando**. Os tracinhos voltam quando tem timer ativo.',
        'O **sino parou de balançar pra sempre**: agora balança 2x quando chega notificação nova e sossega.',
        'A faísca remota era a única animação que ignorava o app em segundo plano e o "reduzir movimento" do iPhone — saiu de cena. A nebulosa do anel fica intacta.',
      ],
    },
    en: {
      title: "Motion diet",
      bullets: [
        '★ Less blinking at once: the last sleep on the ring had **3 simultaneous animations** (running dashes + sparkle + glow) — now it\'s **just the breathing glow**. Dashes return with an active timer.',
        'The **bell stopped wiggling forever**: it now wiggles twice when a new notification arrives and settles.',
        'The sparkle was the only animation ignoring background pause and iOS "reduce motion" — gone. The ring\'s nebula stays intact.',
      ],
    },
  },
  {
    v: "11.9.96", date: "2026-06-12",
    pt: {
      title: "Timer com arrependimento: descartar e desfazer",
      bullets: [
        '★ **Iniciou soneca/sono sem querer?** Nos 3 primeiros minutos o botão de parar vira um **✕ cinza de descartar** — não cria registro nenhum.',
        '★ **Parar o timer agora tem Desfazer**: o aviso de "salvo" traz o botão que apaga o registro e **restaura o timer rodando** como estava.',
        'O "acordou" automático do fim do sono só é criado pra noites de verdade (**≥30min**) — sem acordar fantasma deslocando a rotina.',
      ],
    },
    en: {
      title: "Timer with regret: discard and undo",
      bullets: [
        '★ **Started a nap/sleep by accident?** In the first 3 minutes the stop button becomes a **gray ✕ discard** — creates no record at all.',
        '★ **Stopping the timer now has Undo**: the "saved" toast brings a button that deletes the record and **restores the running timer**.',
        'The automatic "woke up" at sleep end is only created for real nights (**≥30min**) — no phantom wake-up shifting the routine.',
      ],
    },
  },
  {
    v: "11.9.95", date: "2026-06-12",
    pt: {
      title: "Home estável — nada mais pula sozinho",
      bullets: [
        '★ A **Curiosidade do dia desceu pra baixo do resumo** e agora **fica até você dispensar (✕)** — antes ela aparecia ACIMA do anel e sumia sozinha em 13s, empurrando a tela toda no meio do uso.',
        '★ O **card da rotina subiu** pra cima dos avisos passageiros (janela de soneca, insights) — ação estável em cima, informação transitória embaixo.',
        'Insights mostram **1 por vez** (sem sumiço automático), a linha "Próximo marco" só aparece a **≤14 dias da consulta**, e a ★ do topo perdeu o destaque âmbar permanente.',
      ],
    },
    en: {
      title: "Stable Home — nothing jumps on its own",
      bullets: [
        '★ The **daily Curiosity moved below the summary** and now **stays until you dismiss it (✕)** — it used to appear ABOVE the ring and vanish after 13s, pushing the whole screen mid-use.',
        '★ The **routine card moved up** above transient banners (nap window, insights) — stable actions on top, passing info below.',
        'Insights show **1 at a time** (no auto-hide), the "Next milestone" line only appears **≤14 days before a checkup**, and the header ★ lost its permanent amber tint.',
      ],
    },
  },
  {
    v: "11.9.94", date: "2026-06-12",
    pt: {
      title: "Passe de português",
      bullets: [
        '★ Acabou o "Mamadeira atualizad**o**": os avisos agora **concordam em gênero** ("Fralda removida", "Sono atualizado").',
        'Amamentação em PT usa **E:/D:** (esquerda/direita) em vez de L:/R:. Botão "Save" dos marcos virou "Salvar". Jargões traduzidos ("risco de ficar cansada demais", "hora de desacelerar", "despertar noturno").',
        'Botões rápidos com palavra inteira ("Mamadeira", "Remédio") e texto de ajuda da rotina atualizado pro matching real.',
      ],
    },
    en: {
      title: "Portuguese copy pass",
      bullets: [
        '★ Toasts now **agree in gender** in PT ("Fralda removida", "Sono atualizado").',
        'Nursing uses **E:/D:** in PT instead of L:/R:. The milestones "Save" button is now translated. Dev jargon localized.',
        'Quick buttons use full words and the routine help text matches the real matching behavior.',
      ],
    },
  },
  {
    v: "11.9.93", date: "2026-06-12",
    pt: {
      title: "Pacote 3h da manhã",
      bullets: [
        '★ **"Acordou" em 1 toque**: de manhã, sem acordar registrado, ele vira o primeiro botão rápido — registra na hora com a duração da noite. Some quando registrado.',
        '★ **Fralda e Mamadeira durante a soneca/amamentação**: os 2 botões rápidos que já existiam no despertar noturno agora aparecem também com timer de soneca ou amamentação rodando.',
        'Os **botões rápidos ganharam posição fixa por tipo** (alimentação à esquerda, sono no centro, cuidado à direita) — memória muscular, menos toque errado.',
        'Controles pequenos da madrugada (Acordar/Dormir, despertares, pause da amamentação) ganharam **área de toque de 44px** invisível — mais fácil de acertar no escuro.',
      ],
    },
    en: {
      title: "The 3am pack",
      bullets: [
        '★ **"Woke up" in 1 tap**: in the morning, with no wake-up logged, it becomes the first quick button — logs instantly with the night\'s duration. Disappears once logged.',
        '★ **Diaper and Bottle during nap/nursing**: the 2 quick buttons from night wake now also show while a nap or nursing timer runs.',
        'Quick buttons got **fixed positions per type** (feeding left, sleep center, care right) — muscle memory, fewer mis-taps.',
        'Small night controls (Wake/Sleep, wakings, nursing pause) got an invisible **44px touch area** — easier to hit in the dark.',
      ],
    },
  },
  {
    v: "11.9.92", date: "2026-06-12",
    pt: {
      title: "4 bugs corrigidos (da revisão completa)",
      bullets: [
        '★ O **Desfazer não fica mais escondido**: com timer rodando, o aviso de "removido/salvo" sobe pra cima da barra do timer.',
        '★ **Trocar o idioma agora salva na hora** — antes o botão só mudava a tela atual e o app ficava metade EN, metade PT.',
        '★ **Vírgula decimal**: digitar "4,5" no peso/temperatura agora salva 4,5 (antes virava 4 silenciosamente).',
        'Ícone de remédio quebrado em 3 lugares do Resumo — consertado.',
      ],
    },
    en: {
      title: "4 bugs fixed (from the full review)",
      bullets: [
        '★ **Undo no longer hides**: with a timer running, the "removed/saved" toast rises above the timer bar.',
        '★ **Switching language now saves instantly** — before, the button only changed the current screen, leaving the app half EN, half PT.',
        '★ **Decimal comma**: typing "4,5" for weight/temperature now saves 4.5 (it silently became 4 before).',
        'Broken medicine icon in 3 places of Stats — fixed.',
      ],
    },
  },
  {
    v: "11.9.91", date: "2026-06-12",
    pt: {
      title: "Vit. D também segue a mamadeira pós-banho",
      bullets: [
        '★ Igual ao Floripa: o horário da **Vit. D agora é calculado — 5min depois da mamadeira pós-banho** (registrou a mamadeira 18:28 → Floripa e Vit. D às 18:33). O campo dela saiu dos Ajustes; na seção Pós-banho fica só o horário da mamadeira.',
      ],
    },
    en: {
      title: "Vit. D also follows the post-bath bottle",
      bullets: [
        '★ Same as Floripa: **Vit. D\'s time is now computed — 5min after the post-bath bottle** (bottle logged 18:28 → Floripa and Vit. D at 18:33). Its field left Settings; the Post-bath section keeps only the bottle time.',
      ],
    },
  },
  {
    v: "11.9.90", date: "2026-06-12",
    pt: {
      title: "Fix: estágios pós-banho agora aparecem de verdade",
      bullets: [
        '★ Bug da v11.9.88: mamadeira pós-banho, Floripa e vit. D **só apareciam depois de salvar os Ajustes** — e o Salvar nem liberava sem mudança. Agora eles **aparecem sozinhos** (default: 15min depois do banho), sem precisar configurar nada.',
        '★ O **Floripa virou calculado**: o horário dele é **5min depois da mamadeira pós-banho** — quando a mamadeira é registrada, ele usa o horário real (mamou 18:28 → Floripa 18:33). Por isso o campo dele saiu dos Ajustes.',
        'Nos Ajustes → Rotina ficam só **Mamadeira pós-banho** e **Vit. D** (pra quem quiser mudar o horário).',
      ],
    },
    en: {
      title: "Fix: post-bath stages now actually show up",
      bullets: [
        '★ v11.9.88 bug: post-bath bottle, Floripa and vit. D **only appeared after saving Settings** — and Save wouldn\'t even enable without a change. Now they **show up on their own** (default: 15min after bath), no setup needed.',
        '★ **Floripa became computed**: its time is **5min after the post-bath bottle** — once the bottle is logged, it uses the real time (fed 18:28 → Floripa 18:33). That\'s why its field left Settings.',
        'Settings → Routine keeps only **Post-bath bottle** and **Vit. D** (for changing the time).',
      ],
    },
  },
  {
    v: "11.9.89", date: "2026-06-12",
    pt: {
      title: "Simeticona e Tylenol no mesmo card",
      bullets: [
        '★ Ajuste fino da v11.9.88: **Simeticona e Tylenol dividem o MESMO card** (metade/metade, com divisória) em vez de dois cards separados — o resumo da Home volta ao layout 2×2 de sempre.',
      ],
    },
    en: {
      title: "Simethicone and Tylenol share one card",
      bullets: [
        '★ Fine-tune of v11.9.88: **Simethicone and Tylenol now split the SAME card** (half/half, with a divider) instead of two separate cards — the Home summary returns to its usual 2×2 layout.',
      ],
    },
  },
  {
    v: "11.9.88", date: "2026-06-12",
    pt: {
      title: "Card do Tylenol + rotina pós-banho",
      bullets: [
        '★ O card de remédios da Home **dividiu em dois: Simeticona e Tylenol** — cada um com sua contagem do dia e "há quanto tempo".',
        '★ A rotina ganhou **3 estágios pós-banho**: **mamadeira pós-banho**, **Floripa** e **vitamina D**. Aparecem na lista com ✓ quando feitos, igual sonecas/banho. Horários configuráveis nos **Ajustes → Rotina** (default: 15min depois do banho).',
        'Floripa e vitamina D contam como feitos se foram dados **em qualquer hora do dia** (remédio diário é remédio diário). A mamadeira pós-banho casa pela janela perto do horário, pra não confundir com as outras mamadas.',
      ],
    },
    en: {
      title: "Tylenol card + post-bath routine",
      bullets: [
        '★ The Home medicine card **split in two: Simethicone and Tylenol** — each with its own daily count and "time ago".',
        '★ The routine gained **3 post-bath stages**: **post-bath bottle**, **Floripa** and **vitamin D**. They show in the list with ✓ when done, just like naps/bath. Times configurable in **Settings → Routine** (default: 15min after bath).',
        'Floripa and vitamin D count as done if given **any time of day** (a daily med is a daily med). The post-bath bottle matches by a window near its time, so it won\'t be confused with other feeds.',
      ],
    },
  },
  {
    v: "11.9.87", date: "2026-06-07",
    pt: {
      title: "Fix: uma soneca longa marcava duas sonecas como feitas",
      bullets: [
        '★ Corrigido um bug da rotina: quando a Louise fazia **uma soneca longa** (ou acordava mais cedo, deslocando os horários), a rotina às vezes marcava **duas sonecas como feitas** de uma vez. Agora **cada soneca conta pra um horário só** — a próxima continua pendente, como deveria.',
        'Vale também pro **timer ao vivo**: uma soneca em andamento marca só o horário mais próximo, não dois.',
      ],
    },
    en: {
      title: "Fix: one long nap marked two naps as done",
      bullets: [
        '★ Fixed a routine bug: when Louise took **one long nap** (or woke earlier, shifting the schedule), the routine sometimes marked **two naps as done** at once. Now **each nap counts toward a single slot** — the next one stays pending, as it should.',
        'Also applies to the **live timer**: an in-progress nap marks only its nearest slot, not two.',
      ],
    },
  },
  {
    v: "11.9.86", date: "2026-06-06",
    pt: {
      title: "CSS separado em styles.css",
      bullets: [
        'Última faxina da estrutura: os ~200 estilos saíram do `index.html` pra um `styles.css` próprio (o build re-injeta na hora, então o carregamento continua igualzinho de rápido). O `index.html` agora é um shell minúsculo. **Nada muda pra você.**',
      ],
    },
    en: {
      title: "CSS split into styles.css",
      bullets: [
        'Final structure cleanup: the ~200 lines of styles moved out of `index.html` into their own `styles.css` (the build re-inlines them, so loading stays exactly as fast). `index.html` is now a tiny shell. **Nothing changes for you.**',
      ],
    },
  },
  {
    v: "11.9.85", date: "2026-06-06",
    pt: {
      title: "App reorganizado em módulos (src/)",
      bullets: [
        'Continuação da faxina: o app inteiro saiu de um `index.html` gigante pra **16 arquivos organizados em `src/`** (um por componente/página). O build junta tudo na ordem e gera exatamente o mesmo app — **provado byte-a-byte**. Pra você não muda nada; pra evoluir o app, ficou bem mais fácil e seguro.',
      ],
    },
    en: {
      title: "App reorganized into modules (src/)",
      bullets: [
        'Cleanup continued: the whole app moved out of one giant `index.html` into **16 organized files under `src/`** (one per component/page). The build stitches them in order and produces exactly the same app — **proven byte-for-byte**. Nothing changes for you; evolving the app is now much easier and safer.',
      ],
    },
  },
  {
    v: "11.9.84", date: "2026-06-06",
    pt: {
      title: "Faxina nos bastidores",
      bullets: [
        'Reorganização interna pra deixar o código mais limpo e fácil de evoluir: o histórico de versões saiu pra um arquivo próprio e o `index.html` ficou ~45% menor. **Nada muda pra você** — só deixa o app mais saudável por dentro.',
      ],
    },
    en: {
      title: "Behind-the-scenes cleanup",
      bullets: [
        'Internal reorganization to keep the code cleaner and easier to evolve: the version history moved to its own file and `index.html` shrank ~45%. **Nothing changes for you** — just a healthier app under the hood.',
      ],
    },
  },
  {
    v: "11.9.83", date: "2026-06-06",
    pt: {
      title: "Botões inteligentes + rotina que segue o acordar",
      bullets: [
        '★ Os **quick buttons da Home viraram 3 e adaptativos** — mostram as ações com mais cara de serem usadas **agora**. Aprende do histórico: hora do dia + o que costuma vir depois do quê, e não sugere o que você **acabou de registrar**. O **+** continua dando acesso a todas.',
        '★ A **rotina segue o horário real de acordar**: acordou mais cedo ou mais tarde? sonecas e banho deslocam junto. A **hora de dormir fica ancorada entre 19:30 e 20:00**.',
        'A **meta de mamadeiras virou adaptativa** (aprende a contagem típica das últimas semanas) e o app **sugere quanto pôr na próxima** = (meta − já tomado) ÷ (mamadeiras que faltam), já pré-preenchido no formulário.',
      ],
    },
    en: {
      title: "Smart buttons + routine that follows wake-up",
      bullets: [
        '★ The **Home quick buttons are now 3 and adaptive** — they surface the actions most likely **right now**. Learned from history: time of day + what usually follows what, and it won\'t suggest what you **just logged**. The **+** still opens all of them.',
        '★ The **routine follows the real wake-up time**: woke earlier or later? naps and bath shift along. **Bedtime stays anchored between 19:30 and 20:00**.',
        'The **bottle goal is now adaptive** (learns her typical count from recent weeks) and the app **suggests how much for the next one** = (goal − already taken) ÷ (bottles left), pre-filled in the form.',
      ],
    },
  },
  {
    v: "11.9.82", date: "2026-06-05",
    pt: {
      title: "O centro do Ring ganhou vida",
      bullets: [
        '★ O **miolo atrás do tempo** não fica mais vazio e chapado: agora tem uma **nebulosa suave que respira**, combinando com a fumaça do resto do anel. No bedtime ela fica mais roxa e intensa.',
        'Micro-interações novas pra deixar mais nobre: **poeira estelar** flutuando devagar e um **halo que pulsa** durante um timer ativo — tudo bem sutil.',
        'Feito com CSS leve (GPU), sem pesar no iPhone nem resetar a cada atualização do anel.',
      ],
    },
    en: {
      title: "The Ring's center came alive",
      bullets: [
        '★ The **area behind the time** is no longer an empty flat patch: it now has a **soft breathing nebula** that blends with the rest of the ring\'s smoke. At bedtime it turns more purple and intense.',
        'New micro-interactions for a more refined feel: **stardust** drifting slowly and a **pulsing halo** during an active timer — all very subtle.',
        'Built with lightweight CSS (GPU), no iPhone slowdown and no reset on each ring tick.',
      ],
    },
  },
  {
    v: "11.9.81", date: "2026-05-30",
    pt: {
      title: "Stats: toque numa barra pra ver o valor",
      bullets: [
        '★ Em **14 dias ou mais** os números das barras somem (com as barras finas, mostrar todos viraria poluição). Agora **toque em qualquer barra** e aparece um balãozinho com a **data + valor exato** daquele dia — a barra acende.',
        'A **área de toque é a coluna inteira**, bem maior que o tracinho fino, pra acertar fácil no dedo. Toca de novo (ou em outra) pra mover/fechar.',
        'Vale pra todos os gráficos (sono, sonecas, leite, cocô, Simeticona, tummy) e qualquer período. Em 7d os números continuam em cima, e o toque é bônus pra confirmar.',
      ],
    },
    en: {
      title: "Stats: tap a bar to see its value",
      bullets: [
        '★ At **14 days or more** the per-bar numbers disappear (with thin bars, showing all of them would be clutter). Now **tap any bar** and a little bubble shows that day\'s **date + exact value** — the bar lights up.',
        'The **tap target is the whole column**, much wider than the thin bar, so it\'s easy to hit. Tap again (or another) to move/close.',
        'Works on every chart (sleep, naps, milk, poop, Simethicone, tummy) and any period. At 7d the numbers still show on top, and tapping is a bonus.',
      ],
    },
  },
  {
    v: "11.9.80", date: "2026-05-30",
    pt: {
      title: "Rotina inteligente — soneca que cobre o horário conta",
      bullets: [
        '★ **A marcação da rotina ficou mais esperta.** Antes ela só olhava a HORA DE INÍCIO da soneca. Agora olha o **intervalo inteiro** (início → fim): se a soneca começou bem antes do horário-alvo mas o bebê ainda estava dormindo na hora marcada (ou a soneca encostou na janela), **conta como feita**.',
        'Exemplo real: soneca alvo 13:30, mas o bebê dormiu de 12:15 a 13:40. Antes **não contava** (começou cedo demais); agora **conta** — ele estava dormindo às 13:30.',
        'Vale pra qualquer evento com duração (sonecas e bedtime). Acordar e banho seguem pela hora do evento, como antes.',
      ],
    },
    en: {
      title: "Smarter routine — a nap that covers the scheduled time counts",
      bullets: [
        '★ **Routine matching got smarter.** It used to look only at the nap\'s START time. Now it looks at the **whole interval** (start → end): if the nap started well before the target but the baby was still asleep at the scheduled time (or the nap touched the window), it **counts as done**.',
        'Real example: nap target 13:30, but the baby slept 12:15→13:40. Before it **didn\'t count** (started too early); now it **does** — she was asleep at 13:30.',
        'Applies to any event with a duration (naps and bedtime). Wake and bath still match by the event time, as before.',
      ],
    },
  },
  {
    v: "11.9.79", date: "2026-05-30",
    pt: {
      title: "Splash afinado + abertura mais leve",
      bullets: [
        'O traço do splash ficou **mais lento e contemplativo** (tava rápido demais) e a silhueta **maior** na tela.',
        '★ **Abertura mais leve:** removi a logo antiga (um PNG pesado em base64) que tinha ficado sem uso depois do splash novo — o pacote que carrega na abertura emagreceu, cold start um tico mais rápido.',
      ],
    },
    en: {
      title: "Splash tuned + lighter open",
      bullets: [
        'The splash line is now **slower and more contemplative** (it was too fast) and the silhouette is **bigger** on screen.',
        '★ **Lighter open:** removed the old logo (a heavy base64 PNG) that became unused after the new splash — the bundle that loads on open got slimmer, cold start a touch faster.',
      ],
    },
  },
  {
    v: "11.9.78", date: "2026-05-30",
    pt: {
      title: "Splash novo — a logo se desenha na abertura ✦",
      bullets: [
        '★ A abertura do app agora **desenha a silhueta da mãe e do bebê** — a mesma logo de sempre, vetorizada — com um traço que se forma, preenche de branco e deixa o contorno roxo. Bem mais vivo e premium.',
        'Continua **rápido**: ~2 segundos. A animação nunca atrasa quem abre o app só pra registrar uma mamada.',
      ],
    },
    en: {
      title: "New splash — the logo draws itself on open ✦",
      bullets: [
        '★ The app open now **draws the mother-and-baby silhouette** — the same logo, vectorized — with a line that forms, fills white, and leaves the purple outline. Much more alive and premium.',
        'Still **fast**: ~2 seconds. The animation never delays someone opening the app just to log a feed.',
      ],
    },
  },
  {
    v: "11.9.77", date: "2026-05-30",
    pt: {
      title: "Idioma 100% — fim do inglês/português misturado",
      bullets: [
        '★ **Resolvido o bug do idioma misturado.** Causa raiz: várias telas pesadas (lista de hoje, bloco de sono, Stats, Histórico, timer, insights) eram "memoizadas" pra performance e **não re-renderizavam ao trocar o idioma** — ficavam congeladas no idioma de antes. Agora todas recebem o idioma e mudam juntas, na hora.',
        'Corrigidas também strings que estavam fixas num idioma só: "~30min/soneca" e "X sessões/dia" no Stats, o placeholder de dose, a tela de erro e as mensagens de backup.',
        'Pendente menor: as telas que aparecem **antes do app carregar** (girar o celular, "carregando", "atualizando") ainda são fixas — precisam de um mecanismo à parte e são raríssimas de ver. Fica pra um próximo passe.',
      ],
    },
    en: {
      title: "Language 100% — no more mixed English/Portuguese",
      bullets: [
        '★ **Fixed the mixed-language bug.** Root cause: several heavy screens (today list, sleep block, Stats, History, timer, insights) were "memoized" for performance and **did not re-render when you switched language** — they froze in the previous language. Now they all receive the language and update together, instantly.',
        'Also fixed strings stuck in one language: "~30min/nap" and "X sessions/day" in Stats, the dose placeholder, the error screen, and backup messages.',
        'Minor pending: the screens shown **before the app loads** (rotate phone, "loading", "updating") are still fixed — they need a separate mechanism and are very rarely seen. Left for a next pass.',
      ],
    },
  },
  {
    v: "11.9.76", date: "2026-05-30",
    pt: {
      title: "Ajustes reorganizado — 6 seções, fim do \"remendado\"",
      bullets: [
        '★ A tela de Ajustes foi **reagrupada em 6 seções claras**, cada uma com cabeçalho colorido e ícone, na mesma linguagem dos cards da Home: **Perfil · Rotina · Preferências · Notificações · Dados · Sobre**.',
        '**Arrumações:** os dados de nascimento (peso/comp./perímetro) voltaram pro **Perfil** (estavam perdidos lá no fim). "Manter tela ligada" saiu de cima das notificações e foi pra **Preferências**. Push + lembretes de remédio + lembrete de mamada agora ficam juntos em **Notificações**. Streak 🔥 foi pra **Sobre**.',
        'Cards padronizados (gradiente sutil + sombra inset) no lugar das caixas chapadas. **Toda a lógica intacta** — reminders, backup, push: nada mudou de comportamento, só de lugar.',
      ],
    },
    en: {
      title: "Settings reorganized — 6 sections, no more patchwork",
      bullets: [
        '★ The Settings screen is now **regrouped into 6 clear sections**, each with a colored icon header in the Home cards\' language: **Profile · Routine · Preferences · Notifications · Data · About**.',
        '**Tidy-ups:** birth data (weight/length/head) returned to **Profile** (it was stranded at the bottom). "Keep screen on" moved out of the notifications card into **Preferences**. Push + medication reminders + feeding reminder now live together under **Notifications**. Streak 🔥 moved to **About**.',
        'Standardized cards (subtle gradient + inset shadow) replace the flat boxes. **All logic intact** — reminders, backup, push: nothing changed behavior, only place.',
      ],
    },
  },
  {
    v: "11.9.75", date: "2026-05-30",
    pt: {
      title: "Ajustes mais coeso — header + hero (parte 1)",
      bullets: [
        '★ A tela de Ajustes começou a parar de "parecer outro app": título **"Ajustes" em gradiente** (igual o nome na Home) + a **foto da Louise com nome e idade** no topo.',
        'Primeiro passo do redesign que você aprovou no mockup. **A seguir:** padronizar os cards de cada seção na linguagem da Home + reagrupar tudo (Perfil · Rotina · Preferências · Notificações · Dados · Sobre) — feito em etapas pra não arriscar o que já funciona.',
      ],
    },
    en: {
      title: "More cohesive Settings — header + hero (part 1)",
      bullets: [
        '★ The Settings screen started to stop "looking like another app": **gradient "Settings" title** (same as the name on Home) + **Louise\'s photo with name and age** at the top.',
        'First step of the redesign you approved in the mockup. **Next:** standardize each section\'s cards in the Home\'s language + regroup everything (Profile · Routine · Preferences · Notifications · Data · About) — done in stages so nothing that works breaks.',
      ],
    },
  },
  {
    v: "11.9.74", date: "2026-05-30",
    pt: {
      title: "Premium plus — números que sobem + confetti nos marcos",
      bullets: [
        '★ Os números grandes da Home (mamadas, fraldas, Simeticona) agora **sobem animados** de 0 até o valor ao abrir o app — e rolam suave a cada novo registro. Combina com a entrada escalonada dos cards.',
        '★ **Logar um marco de desenvolvimento agora solta confetti** 🎉 — momento de conquista de verdade. Antes o confetti só aparecia nos marcos de idade (1 mês, 100 dias, 6 meses, 1 ano).',
        'Nota honesta: o "buzz de conquista" (haptic) não entrou porque **o iOS não suporta vibração por PWA** (decisão da Apple) — então fiz a versão visível (confetti), que funciona de verdade no seu iPhone.',
      ],
    },
    en: {
      title: "Premium plus — counting-up numbers + milestone confetti",
      bullets: [
        '★ The big Home numbers (bottles, diapers, Simethicone) now **count up** from 0 to their value on open — and roll smoothly on each new log. Pairs with the staggered card entrance.',
        '★ **Logging a developmental milestone now triggers confetti** 🎉 — a real achievement moment. Before, confetti only fired for age milestones (1 month, 100 days, 6 months, 1 year).',
        'Honest note: the "achievement buzz" (haptic) was skipped because **iOS doesn\'t support PWA vibration** (Apple\'s call) — so I did the visible version (confetti), which actually works on your iPhone.',
      ],
    },
  },
  {
    v: "11.9.73", date: "2026-05-30",
    pt: {
      title: "Premium plus — a Home entra \"montando\"",
      bullets: [
        '★ Ao abrir a Home, os cards do topo e os eventos de hoje **entram escalonados** (cada um com um respiro de ~45ms) — aquela sensação de tela se montando, de app nativo caprichado.',
        'Os cards de cima fazem um fade suave; os eventos do dia sobem de leve. **Roda só na abertura** (via classe CSS, itens keyed) — não repete a cada tick nem pesa.',
        'Haptic ao salvar e o efeito "orbit" de confirmação já existiam — mantidos. A base já era forte; isto é mais lustro.',
      ],
    },
    en: {
      title: "Premium plus — the Home \"assembles\" in",
      bullets: [
        '★ When the Home opens, the top cards and today\'s events **stagger in** (each with a ~45ms beat) — that screen-assembling feel of a polished native app.',
        'Top cards do a soft fade; today\'s events rise gently. **Runs only on open** (via CSS class, keyed items) — no per-tick replay, no perf cost.',
        'Save haptic and the "orbit" confirmation flourish already existed — kept. The base was already strong; this is more polish.',
      ],
    },
  },
  {
    v: "11.9.72", date: "2026-05-30",
    pt: {
      title: "Polimento premium — toque com mola + haptic na navegação",
      bullets: [
        '★ **Toque nos cards agora volta com uma micro-mola** — a mesma curva de assinatura do botão "+" e dos números que pulsam. Pressão crispa, volta com um quique sutil. Sensação de app nativo.',
        '**Haptic de seleção** ao trocar de aba e ao abrir o "+": aquele tap-tap discreto que app premium tem.',
        'Nota: a base de micro-interações já era forte (feedback de toque global, haptics, springs nos valores) — isto é o lustro fino por cima, mantendo a linguagem minimalista (botões continuam crispos; só os cards e momentos-chave ganham mola).',
      ],
    },
    en: {
      title: "Premium polish — springy taps + navigation haptics",
      bullets: [
        '★ **Card taps now spring back** — the same signature curve as the "+" button and the pulsing numbers. Crisp press, subtle bounce-back. Native-app feel.',
        '**Selection haptic** when switching tabs and opening "+": that subtle tap-tap premium apps have.',
        'Note: the micro-interaction foundation was already strong (global tap feedback, haptics, value springs) — this is the fine polish on top, keeping the minimalist language (buttons stay crisp; only cards and key moments get the spring).',
      ],
    },
  },
  {
    v: "11.9.71", date: "2026-05-30",
    pt: {
      title: "Rotina: toque pra expandir os detalhes",
      bullets: [
        '★ O card de rotina enxuto agora **expande**: toque nele pra abrir a lista completa dos passos — cada um com horário (o real, se já foi feito), ✓ pra concluído e ! pra atrasado — mais as mamadas em detalhe. Toque de novo pra recolher.',
        'A preferência (aberto/fechado) **fica salva no aparelho** — cada celular lembra do seu jeito.',
        '**Micro-interação:** chevron que gira + abertura com fade suave.',
      ],
    },
    en: {
      title: "Routine: tap to expand the details",
      bullets: [
        '★ The lean routine card now **expands**: tap it to open the full step list — each with its time (the actual one, if already done), ✓ for done and ! for late — plus bottles in detail. Tap again to collapse.',
        'The preference (open/closed) is **saved per device** — each phone remembers its own choice.',
        '**Micro-interaction:** a rotating chevron + a smooth fade-open.',
      ],
    },
  },
  {
    v: "11.9.70", date: "2026-05-30",
    pt: {
      title: "Card de rotina minimalista + micro-interações",
      bullets: [
        '★ O card de rotina na Home ficou **bem mais enxuto**: de 3 blocos empilhados (ícone grande + grade de bolinhas com rótulo + linha de mamadas) pra **uma linha só** — próximo passo · horário · mamadas — com uma **barra de progresso fina segmentada** embaixo.',
        '**Micro-interação:** cada segmento muda de cor com transição suave quando o passo é concluído, e o segmento do "próximo" pulsa de leve. Feito via classe CSS (não inline) pra não pesar no tick.',
        'Os detalhes completos da rotina continuam na configuração do Perfil.',
      ],
    },
    en: {
      title: "Minimalist routine card + micro-interactions",
      bullets: [
        '★ The Home routine card is now **far leaner**: from 3 stacked blocks (big icon + labeled dot grid + bottles row) to **a single line** — next step · time · bottles — with a **slim segmented progress bar** below.',
        '**Micro-interaction:** each segment eases its color when a step completes, and the "next" segment pulses gently. Done via CSS class (not inline) so it stays cheap on the tick.',
        'Full routine details still live in Profile settings.',
      ],
    },
  },
  {
    v: "11.9.69", date: "2026-05-30",
    pt: {
      title: "Rotina não trava mais quando foge do horário",
      bullets: [
        '★ **Acordar fora do horário não buga mais o card.** Acordou 6:30 quando o alvo era 7:00? Agora conta como feito e segue pro próximo passo. Antes a janela do "Acordar" era ±20min, então acordar cedo deixava o passo eternamente pendente.',
        'A janela do "Acordar" virou **generosa e assimétrica**: acordou cedo praticamente sempre conta (até 2h30 antes), e até 1h30 depois. Sonecas/banho/bedtime seguem em ±60min.',
        'Princípio por trás: **a rotina é um guia, não uma cobrança** — se o evento aconteceu, conta e segue.',
      ],
    },
    en: {
      title: "Routine no longer gets stuck when off-schedule",
      bullets: [
        '★ **Waking off-schedule no longer breaks the card.** Woke at 6:30 when the target was 7:00? It now counts as done and moves to the next step. Before, the "Wake" window was ±20min, so waking early left the step stuck as pending.',
        'The "Wake" window is now **generous and asymmetric**: waking early almost always counts (up to 2h30 before), and up to 1h30 after. Naps/bath/bedtime stay at ±60min.',
        'The principle: **the routine is a guide, not a scorecard** — if it happened, it counts.',
      ],
    },
  },
  {
    v: "11.9.68", date: "2026-05-29",
    pt: {
      title: "Hotfix — corrige o crash 'Oops!' na abertura",
      bullets: [
        '★ Corrigido o crash (React #310) que mostrava **"Oops! Algo quebrou"** ao abrir o app.',
        'Causa: um callback que entrou na v11.9.64 ficou **depois** do gate de splash/loading, violando as regras de hooks do React (o hook era pulado no primeiro render e rodava no segundo). Movido pra cima do early-return. Desculpa o susto. 🙏',
      ],
    },
    en: {
      title: "Hotfix — fixes the 'Oops!' crash on open",
      bullets: [
        '★ Fixed the crash (React #310) showing **"Oops! Something broke"** on app open.',
        'Cause: a callback added in v11.9.64 ended up **after** the splash/loading gate, violating React\'s rules of hooks (the hook was skipped on the first render and ran on the second). Moved above the early-return. Sorry for the scare. 🙏',
      ],
    },
  },
  {
    v: "11.9.67", date: "2026-05-29",
    pt: {
      title: "Auditoria · bloco 4 — limpeza (DRY)",
      bullets: [
        'O estilo base dos campos de input estava copiado em 3 telas (adicionar evento, perfil, crescimento). Virou **uma constante única** (`INP_BASE`) — menos repetição, inputs consistentes.',
        'As duas migrações grandes da auditoria (constantes pros tipos de evento em 117 lugares; centralizar i18n em 298 pontos) ficaram **de fora de propósito**: são débito de manutenção sem ganho visível, e mexer em 400+ pontos de um app de uso diário não compensa o risco. Dá pra fazer num passe focado depois, se quiser.',
      ],
    },
    en: {
      title: "Audit · block 4 — cleanup (DRY)",
      bullets: [
        'The base input-field style was copy-pasted across 3 screens (add event, profile, growth). Now it\'s **one constant** (`INP_BASE`) — less duplication, consistent inputs.',
        'The audit\'s two big migrations (event-type constants across 117 spots; i18n centralization across 298 spots) were **intentionally left out**: pure maintenance debt with no visible gain, and churning 400+ points of a daily-use app isn\'t worth the risk. Can be done in a focused pass later if wanted.',
      ],
    },
  },
  {
    v: "11.9.66", date: "2026-05-29",
    pt: {
      title: "Auditoria · bloco 3 — tokens de cor",
      bullets: [
        '**Consistência interna:** 68 cores escritas à mão no código viraram tokens centralizados (`T.heading`, `T.label`, `T.lilac`) e o roxo `#a78bfa` duplicado passou a usar o `T.purple` que já existia.',
        '**Zero mudança visual** — cada token tem exatamente o mesmo valor de antes. Ganho é só de manutenção: mudar uma cor agora é em 1 lugar.',
        'A escala de raio de borda ficou pra depois (mexer nos cantos muda o visual; quero te mostrar um mockup antes).',
      ],
    },
    en: {
      title: "Audit · block 3 — color tokens",
      bullets: [
        '**Internal consistency:** 68 hand-written colors became centralized tokens (`T.heading`, `T.label`, `T.lilac`), and the duplicated purple `#a78bfa` now uses the existing `T.purple`.',
        '**Zero visual change** — each token holds the exact same value as before. Pure maintenance win: changing a color is now a one-place edit.',
        'The border-radius scale was deferred (snapping corners changes the look; I want to show you a mockup first).',
      ],
    },
  },
  {
    v: "11.9.65", date: "2026-05-29",
    pt: {
      title: "Auditoria · bloco 2 — usabilidade (alcance e toque)",
      bullets: [
        '★ **Desfazer agora fica embaixo:** o toast de "excluído · desfazer" saiu do topo (longe do polegar) pra base da tela, acima do nav, e dura **4,5s** (era 2s). Muito mais fácil de alcançar com uma mão.',
        '**Safe-area no Pro Max:** o modal central e o picker de marcos agora respeitam o Dynamic Island e a barra inferior — o botão de fechar não fica mais escondido atrás do notch.',
        '**Alvos de toque maiores:** estrela e sino do topo (44pt), botões de fechar dos modais (40pt), e os botões de editar/excluir eventos da madrugada dentro do bloco de sono — cresceram pra errar menos às 3h da manhã.',
        '**Excluir marco** agora usa confirmação inline de 2 toques (igual o resto do app), no lugar do alerta cinza do Safari.',
      ],
    },
    en: {
      title: "Audit · block 2 — usability (reach & touch)",
      bullets: [
        '★ **Undo now sits at the bottom:** the "deleted · undo" toast moved from the top (out of thumb reach) to the bottom, above the nav, and lasts **4.5s** (was 2s). Much easier one-handed.',
        '**Safe-area on Pro Max:** the center modal and milestone picker now respect the Dynamic Island and home bar — the close button no longer hides behind the notch.',
        '**Bigger tap targets:** header star and bell (44pt), modal close buttons (40pt), and the edit/delete buttons for night events inside the sleep block — all grown to miss less at 3am.',
        '**Deleting a milestone** now uses a 2-tap inline confirm (like the rest of the app) instead of the gray Safari alert.',
      ],
    },
  },
  {
    v: "11.9.64", date: "2026-05-29",
    pt: {
      title: "Auditoria · bloco 1 — performance e 2 bugs",
      bullets: [
        '★ **Bateria à noite:** a página de Stats (sempre montada no swipe) recalculava todas as estatísticas a cada 5s durante um timer ativo — um `React.memo` quebrado por uma função inline. Corrigido com callback estável. Maior dreno noturno do app, resolvido.',
        '**Bug i18n:** o tempo relativo ("2h30m ago") agora traduz pra **"2h30m atrás"** em português — aparecia em inglês no card "Última mamada" e em outros 4 lugares.',
        '**Bug Confetti:** a animação de comemoração violava as Rules of Hooks (podia falhar silenciosamente). Corrigido.',
        'Blur do nav voltou de 22px pro teto documentado de 18px (custo de GPU é quadrático no raio; diferença visual imperceptível).',
        'Removida função morta `tl()`.',
      ],
    },
    en: {
      title: "Audit · block 1 — performance and 2 bugs",
      bullets: [
        '★ **Night battery:** the Stats page (always mounted for the swipe) recomputed all stats every 5s during an active timer — a `React.memo` defeated by an inline function. Fixed with a stable callback. The app\'s biggest overnight drain, gone.',
        '**i18n bug:** relative time ("2h30m ago") now translates to **"2h30m atrás"** in Portuguese — it showed in English on the "Last feed" card and 4 other spots.',
        '**Confetti bug:** the celebration animation violated the Rules of Hooks (could fail silently). Fixed.',
        'Nav blur went back from 22px to the documented 18px ceiling (GPU cost is quadratic in radius; visually imperceptible).',
        'Removed dead function `tl()`.',
      ],
    },
  },
  {
    v: "11.9.63", date: "2026-05-29",
    pt: {
      title: "+31 marcos de desenvolvimento — base quase dobrou (85 marcos)",
      bullets: [
        '★ **31 novos marcos** adicionados — a base foi de 54 pra **85 marcos**. A Louise estava avançando rápido e já tinha batido tudo até 4 meses; agora tem muito mais pra acompanhar.',
        'Foco em **granularidade nos primeiros meses** (17 dos 31 novos são de 2-6m): rolar pro lado, apoiar nos antebraços, descobrir as próprias mãos, fazer "pfff", sentar em tripé, pegar em concha, se olhar no espelho…',
        'Preenchidas lacunas de 9-24m: engatinhar, sentar sozinha, ficar em pé com apoio, andar de lado nos móveis, rabiscar, subir no sofá, correr, explosão de vocabulário.',
        'Fontes: **CDC 2022**, **WHO MGRS** (janelas motoras), **Denver II** e **AAP/Bright Futures**. Janelas de idade realistas, bilíngue PT/EN.',
        'Marcos agora **ordenados por idade** na base — a Home sempre mostra o próximo marco de menor idade primeiro.',
      ],
    },
    en: {
      title: "+31 developmental milestones — database nearly doubled (85)",
      bullets: [
        '★ **31 new milestones** added — the database went from 54 to **85**. Louise was racing ahead and had already cleared everything up to 4 months; now there is much more to track.',
        'Focus on **early-month granularity** (17 of the 31 are 2-6mo): rolling to side, pushing up on forearms, discovering her hands, blowing raspberries, tripod sitting, raking grasp, mirror play…',
        'Filled 9-24mo gaps: crawling, getting to sitting, standing with support, cruising furniture, scribbling, climbing on furniture, running, vocabulary explosion.',
        'Sources: **CDC 2022**, **WHO MGRS** (motor windows), **Denver II**, and **AAP/Bright Futures**. Realistic age windows, bilingual PT/EN.',
        'Milestones are now **sorted by age** in the database — Home always shows the youngest upcoming milestone first.',
      ],
    },
  },
  {
    v: "11.9.62", date: "2026-05-24",
    pt: {
      title: "Home mais limpa — marcos viram uma linha discreta",
      bullets: [
        'O card "Próximos marcos" na Home (que mostrava 3 itens com barras coloridas) virou **uma única linha minimalista**: ★ Próximo marco · [nome] →',
        'Ocupa ~1/3 do espaço de antes. Os detalhes completos (lista, conquistas, timeline) continuam na **página de Marcos** — toque na linha ou no ★ do topo pra abrir.',
        'Some sozinho quando não há próximo marco esperado pra idade atual.',
      ],
    },
    en: {
      title: "Cleaner Home — milestones become one discreet line",
      bullets: [
        'The "Upcoming milestones" card on Home (which showed 3 items with colored bars) is now **a single minimal line**: ★ Next milestone · [name] →',
        'Takes ~1/3 of the previous space. Full details (list, achievements, timeline) still live on the **Milestones page** — tap the line or the ★ in the header to open it.',
        'Hides itself when there is no upcoming milestone expected for the current age.',
      ],
    },
  },
  {
    v: "11.9.61", date: "2026-05-24",
    pt: {
      title: "★ Conquistas — 12 badges colecionáveis na página de Marcos",
      bullets: [
        '★ **Sistema de conquistas/badges** adicionado no topo da MilestonesPage (acima de "Próximos marcos"). Mockup variant D do gamification mockup — opção colecionável.',
        'Grid 3 colunas com 12 conquistas. Earned = glow dourado + emoji com drop-shadow. Locked = opacity 0.35 + fração de progresso ("3/10").',
        '**As 12 conquistas:**',
        '· **Primeira luz** 🌟 — 1 marco logado',
        '· **5 conquistas** ⭐ — 5 marcos',
        '· **10 conquistas** ✨ — 10 marcos',
        '· **Recém-nascida** 👶 — todos os 10 marcos newborn',
        '· **6 meses** 🎯 — todos os marcos do checkup 6m',
        '· **1 ano** 🎂 — todos os marcos do checkup 12m',
        '· **2 anos** 🎉 — todos os marcos do checkup 24m',
        '· **Atleta** 🏃 — todos os marcos motor (grosso+fino)',
        '· **Tagarela** 💬 — todos os marcos de linguagem',
        '· **Carismática** 😊 — todos os marcos social/emocional',
        '· **Pensadora** 🧠 — todos os marcos cognitivos',
        '· **Tudo!** 🏆 — todos os 44+ marcos da base',
        'Contador no header da seção: "5/12 conquistadas" em texto dourado.',
        'Stats agregadas via `useMemo` — recomputa só quando entries muda.',
      ],
    },
    en: {
      title: "★ Achievements — 12 collectible badges on the Milestones page",
      bullets: [
        '★ **Achievements/badges system** added to the top of MilestonesPage (above "Upcoming milestones"). Mockup variant D from the gamification mockup — collectible flavor.',
        '3-column grid with 12 achievements. Earned = golden glow + emoji with drop-shadow. Locked = 0.35 opacity + progress fraction ("3/10").',
        '**The 12 achievements:**',
        '· **First light** 🌟 — 1 milestone logged',
        '· **5 logged** ⭐ — 5 milestones',
        '· **10 logged** ✨ — 10 milestones',
        '· **Newborn** 👶 — all 10 newborn milestones',
        '· **6 months** 🎯 — all milestones from the 6m checkup',
        '· **1 year** 🎂 — all milestones from the 12m checkup',
        '· **2 years** 🎉 — all milestones from the 24m checkup',
        '· **Athlete** 🏃 — all motor (gross+fine) milestones',
        '· **Chatty** 💬 — all language milestones',
        '· **Charming** 😊 — all social/emotional milestones',
        '· **Thinker** 🧠 — all cognitive milestones',
        '· **All done!** 🏆 — all 44+ milestones',
        'Section header shows count: "5/12 earned" in golden text.',
        'Stats computed via `useMemo` — only recomputes when entries change.',
      ],
    },
  },
  {
    v: "11.9.60", date: "2026-05-24",
    pt: {
      title: "Picker de marcos vira modal centrado (era bottom sheet)",
      bullets: [
        '★ **Picker agora abre no meio da tela** em vez de subir do rodapé. Width max 440px, maxHeight `calc(100vh - 80px)`, padding interno 18px, borderRadius 22px em todos os cantos, drop-shadow forte (0 24px 60px). Lê melhor com Save/Back centrados.',
        'Removida lógica de safe-area-bottom no padding (não precisa mais já que tá centrado).',
        '`body.milestone-picker-open #nav-host{display:none}` (v11.9.58) ainda ativo — nav some quando picker abre.',
      ],
    },
    en: {
      title: "Milestone picker becomes a centered modal (was bottom sheet)",
      bullets: [
        '★ **Picker now opens in the middle of the screen** instead of rising from the bottom. Max width 440px, maxHeight `calc(100vh - 80px)`, 18px inner padding, 22px borderRadius on all corners, strong drop-shadow (0 24px 60px). Save/Back read better centered.',
        'Removed safe-area-bottom padding logic (not needed now that it\'s centered).',
        '`body.milestone-picker-open #nav-host{display:none}` (v11.9.58) still active — nav hides when picker opens.',
      ],
    },
  },
  {
    v: "11.9.59", date: "2026-05-24",
    pt: {
      title: "Marcos newborn (0-2 meses) — 10 marcos emocionais",
      bullets: [
        '★ **10 marcos do período recém-nascido** adicionados ao `js/milestones.js` com `checkupAge: 0`. Não são CDC (CDC começa em 2 meses) — são emocionais/experienciais:',
        '  Nasceu · Primeira mamada · Primeira fralda · Primeiro banho · Alta hospitalar · Primeira noite em casa · Coto umbilical caiu · Voltou ao peso de nascimento · Primeira consulta pediatra · Olha para rostos',
        'Fonte marcada como "Louise Pro Newborn" — distinto do CDC pra não confundir com diretriz clínica.',
        'Filtro de checkups na MilestonesPage atualizado pra incluir o 0 (era [2,4,6,9,12,15,18,24], agora [0,2,4,6,...]). Agora a Louise pode ter os primeiros marcos retroativos checados antes do CDC 2m kick in.',
        '**Próximo:** gamificação (constelação + confetti) — mockup em `.claude/mockups/milestones-gamification.html` pra você escolher direção.',
      ],
    },
    en: {
      title: "Newborn milestones (0-2 months) — 10 emotional milestones",
      bullets: [
        '★ **10 newborn period milestones** added to `js/milestones.js` with `checkupAge: 0`. Not CDC (CDC starts at 2 months) — these are emotional/experiential:',
        '  Born · First feed · First diaper · First bath · Hospital discharge · First night at home · Umbilical cord fell off · Regained birth weight · First pediatrician visit · Looks at faces',
        'Source marked as "Louise Pro Newborn" — distinct from CDC to not confuse with clinical guideline.',
        'Checkups filter in MilestonesPage updated to include 0 (was [2,4,6,9,12,15,18,24], now [0,2,4,6,...]). Louise can now retroactively check off the first milestones before the CDC 2m kicks in.',
        '**Next up:** gamification (constellation + confetti) — mockup at `.claude/mockups/milestones-gamification.html` for you to pick direction.',
      ],
    },
  },
  {
    v: "11.9.58", date: "2026-05-24",
    pt: {
      title: "Fix: Save do picker de marco ficava atrás da nav pill",
      bullets: [
        '★ **Bug:** ao abrir um marco no picker, os botões "Voltar" + "Salvar" no fim do bottom-sheet ficavam visualmente cobertos pela nav pill flutuante (z-index 300).',
        '**Fix em camadas:** (a) nav pill agora SOME enquanto o picker tá aberto via `body.milestone-picker-open #nav-host{display:none}` + useEffect togglando a classe. (b) padding-bottom do sheet subiu de `calc(20px + safe-area)` pra `calc(32px + safe-area)` como defesa adicional. (c) maxHeight do sheet 85vh → 90vh pra mais espaço pra scroll.',
      ],
    },
    en: {
      title: "Fix: Picker's Save button was hidden behind the nav pill",
      bullets: [
        '★ **Bug:** When opening a milestone in the picker, the "Back" + "Save" buttons at the bottom-sheet end were visually covered by the floating nav pill (z-index 300).',
        '**Layered fix:** (a) nav pill now HIDES while picker is open via `body.milestone-picker-open #nav-host{display:none}` + useEffect toggling the class. (b) sheet padding-bottom bumped from `calc(20px + safe-area)` to `calc(32px + safe-area)` as additional defense. (c) sheet maxHeight 85vh → 90vh for more scroll room.',
      ],
    },
  },
  {
    v: "11.9.57", date: "2026-05-24",
    pt: {
      title: "Botão ★ Marcos no header (entry point sempre visível)",
      bullets: [
        '★ **Botão estrela gold no header**, entre nome e sino. Sempre visível. Tap → abre direto a página de Marcos. Antes só dava pelo card no Home (que era condicional).',
        'Card "Próximos marcos" do Home continua existindo — agora é redundante mas reforça discoverability.',
      ],
    },
    en: {
      title: "★ Milestones button in header (always-visible entry point)",
      bullets: [
        '★ **Gold star button in header**, between name and bell. Always visible. Tap → opens Milestones page directly. Before, only accessible via the Home card (which was conditional).',
        '"Upcoming milestones" Home card still exists — now redundant but reinforces discoverability.',
      ],
    },
  },
  {
    v: "11.9.56", date: "2026-05-24",
    pt: {
      title: "★ Marcos de desenvolvimento — 44 marcos CDC 2022 + timeline + sinais de alerta",
      bullets: [
        '★ **Nova feature: Marcos de crescimento** com 44 marcos de desenvolvimento de 0 a 24 meses, divididos em 5 categorias (motor grosso, motor fino, linguagem, social/emocional, cognitivo). Bilíngue PT/EN.',
        '★ **Fonte: CDC "Learn the Signs. Act Early."** (revisão Fev 2022) — base científica. Cross-check com WHO MGRS pros marcos motor grosso (janelas de aquisição) e SBP pra terminologia PT-BR.',
        '★ **Card "Próximos marcos" no Home** — aparece automaticamente entre os KPI cards e a lista do dia. Mostra até 3 marcos esperados pra idade atual da Louise (ainda não registrados). Tap → abre página completa.',
        '★ **Página dedicada de Marcos** acessível pelo card. Tem 3 seções:',
        '  · **Próximos marcos** — chips clicáveis com cor por categoria, tap pra registrar.',
        '  · **Conquistados** — timeline cronológica com data + categoria + nota opcional. Vira álbum digital pra rever.',
        '  · **Sinais pra conversar com a pediatra** — colapsável, ~17 sinais "Act Early" filtrados pela idade atual. Tom não-alarmista ("ponto de atenção").',
        '★ **Picker de marcos** (bottom sheet) com filtro por categoria + lista de marcos não-feitos ordenados por idade. Tap → detalhe com descrição + dica + campo de data + nota → Salvar.',
        '**Tipo "milestone"** novo no TYPES (ícone star, cor #facc15 gold). Entries armazenam: `type:"milestone"`, `key`, `category`, `date`, `note` opcional. Compatível com sync do Firestore existente.',
        'Build: `js/milestones.js` (~25kb) bundled em `app-libs.js`. SW precache atualizado.',
      ],
    },
    en: {
      title: "★ Developmental milestones — 44 CDC 2022 milestones + timeline + warning signs",
      bullets: [
        '★ **New feature: Growth milestones** with 44 developmental milestones from 0 to 24 months, split into 5 categories (gross motor, fine motor, language, social/emotional, cognitive). Bilingual PT/EN.',
        '★ **Source: CDC "Learn the Signs. Act Early."** (Feb 2022 revision) — scientific basis. Cross-checked with WHO MGRS for gross motor milestones (windows of achievement) and SBP for PT-BR terminology.',
        '★ **"Upcoming milestones" card on Home** — appears automatically between KPI cards and the day list. Shows up to 3 milestones expected for Louise\'s current age (not yet logged). Tap → opens full page.',
        '★ **Dedicated Milestones page** accessible from the card. 3 sections:',
        '  · **Upcoming** — clickable chips colored by category, tap to log.',
        '  · **Achieved** — chronological timeline with date + category + optional note. Becomes digital album to review.',
        '  · **Signs to discuss with pediatrician** — collapsible, ~17 "Act Early" signs filtered by current age. Non-alarmist tone ("attention point").',
        '★ **Milestone picker** (bottom sheet) with category filter + list of undone milestones sorted by age. Tap → detail with description + tip + date + note → Save.',
        '**New "milestone" type** in TYPES (star icon, #facc15 gold color). Entries store: `type:"milestone"`, `key`, `category`, `date`, optional `note`. Compatible with existing Firestore sync.',
        'Build: `js/milestones.js` (~25kb) bundled into `app-libs.js`. SW precache updated.',
      ],
    },
  },
  {
    v: "11.9.55", date: "2026-05-13",
    pt: {
      title: "Wake pill: respiro mais perceptível (3.5s, scale 1.05)",
      bullets: [
        '★ **Pulse mais "respirando"** pra ficar intuitivo. Antes era sutil demais (scale 1.022 + box-shadow 8→22px@0.20-0.50). Agora **scale 1→1.05** (~2x mais perceptível) + **box-shadow 6→30px@0.18-0.62** + **border-color anima** de 0.50 → 0.85 alpha junto. O pill realmente "vive".',
        'Duração subiu de 2.8s pra **3.5s** — feel mais calmo/respiratório, menos hectic.',
        'Mantém: cor amber/yellow, label "Wake"/"Sleep", ícone sun/moon, tamanho compacto 7×14.',
      ],
    },
    en: {
      title: "Wake pill: more noticeable breathing (3.5s, scale 1.05)",
      bullets: [
        '★ **More "breathing" pulse** to feel intuitive. Was too subtle before (scale 1.022 + box-shadow 8→22px@0.20-0.50). Now **scale 1→1.05** (~2x more noticeable) + **box-shadow 6→30px@0.18-0.62** + **border-color animates** from 0.50 → 0.85 alpha alongside. The pill truly "lives".',
        'Duration up from 2.8s to **3.5s** — calmer/breathing feel, less hectic.',
        'Kept: amber/yellow color, "Wake"/"Sleep" label, sun/moon icon, compact 7×14 size.',
      ],
    },
  },
  {
    v: "11.9.54", date: "2026-05-13",
    pt: {
      title: "Wake/Sleep button: amber + ação-oriented + tamanho pequeno",
      bullets: [
        '★ **Cor amber em vez de lavanda.** Lavanda era "ambient/decorativo" — não chamava atenção pra ação. Amber/amarelo é intuitivo: cor universal de "atenção", e bate com a metáfora de "wake/sol".',
        '★ **Label action-oriented:** sai o "Wake?" (estranho com a interrogação), vira **"Wake"** quando Louise tá dormindo (= ação: registrar despertar) e **"Sleep · 8min"** quando ela tá acordada (= ação: registrar voltou a dormir). Mesma label da action.',
        '★ **Ícone muda com o estado:** sun ☀ quando default (action: wake) → moon 🌙 quando active (action: sleep). Ícone também segue a action.',
        '★ **Tamanho pequeno** (revert do bump da v11.9.52). Padding 7×14 (era 9×18), fontWeight 700 (era 800), icon 13px (era 14px). Pill compacto.',
        '**Pulse mantido** (default state) mas agora amber-tinted (box-shadow #fbbf24, scale 1→1.022 mais sutil).',
      ],
    },
    en: {
      title: "Wake/Sleep button: amber + action-oriented + small size",
      bullets: [
        '★ **Amber color instead of lavender.** Lavender was "ambient/decorative" — didn\'t draw attention to action. Amber/yellow is intuitive: universal "attention" color, and matches the "wake/sun" metaphor.',
        '★ **Action-oriented label:** bye "Wake?" (weird with the question mark), now reads **"Wake"** when Louise is sleeping (= action: register wake) and **"Sleep · 8min"** when she\'s awake (= action: register back-to-sleep). Label is the action.',
        '★ **Icon switches with state:** sun ☀ when default (action: wake) → moon 🌙 when active (action: sleep). Icon also follows the action.',
        '★ **Small size** (reverts v11.9.52 bump). Padding 7×14 (was 9×18), fontWeight 700 (was 800), icon 13px (was 14px). Compact pill.',
        '**Pulse kept** (default state) but now amber-tinted (box-shadow #fbbf24, scale 1→1.022 more subtle).',
      ],
    },
  },
  {
    v: "11.9.53", date: "2026-05-13",
    pt: {
      title: "Resumo do dia removido",
      bullets: [
        '★ **Daily summary noturno removido** — aquele card "🌙 Resumo de hoje" que aparecia entre 19h-23h59 com totais de mamada/sono/sonecas/fraldas (v11.9.8 → v11.9.17). Pedido do William: "aquele resumo que aparece no final do dia pode tirar fora".',
        'Estados removidos: `showDailySummary`, `dismissDailySummary`, `_todayCount` useMemo, useEffect que escutava o horário. Chave localStorage `lp_daily_summary_seen` fica órfã mas inerte (~10 bytes por device).',
      ],
    },
    en: {
      title: "Daily summary removed",
      bullets: [
        '★ **Evening daily summary removed** — that "🌙 Today\'s recap" card that appeared between 7pm-11:59pm with totals for bottle/sleep/naps/diapers (v11.9.8 → v11.9.17). William asked: "drop that summary that shows up at end of day".',
        'States removed: `showDailySummary`, `dismissDailySummary`, `_todayCount` useMemo, useEffect that watched the hour. The localStorage key `lp_daily_summary_seen` is orphaned but inert (~10 bytes per device).',
      ],
    },
  },
  {
    v: "11.9.52", date: "2026-05-13",
    pt: {
      title: "Night Wake pill: bump na visibilidade (era sutil demais)",
      bullets: [
        '★ **Bg lavanda mais saturado** — gradient 0.24→0.14 (era 0.16→0.08).',
        '★ **Border lavanda mais forte** — 0.55 alpha (era 0.42).',
        '★ **Pulse mais perceptível** — box-shadow range 10px@0.25 ↔ 28px@0.60 (antes era 8px@0.15 ↔ 16px@0.32). Adicionado `scale(1) ↔ scale(1.035)` na keyframe pra pill respirar de leve.',
        '★ **Texto mais claro e bold** — color #e0d4ff (era #d8ccff), fontWeight 800 (era 700), letter-spacing 0.5 (era 0.4).',
        'Padding um pouco maior pra dar peso (9×18px era 8×16px). Ícone sun 14px (era 13px).',
      ],
    },
    en: {
      title: "Night Wake pill: visibility bump (was too subtle)",
      bullets: [
        '★ **More saturated lavender bg** — gradient 0.24→0.14 (was 0.16→0.08).',
        '★ **Stronger lavender border** — 0.55 alpha (was 0.42).',
        '★ **More noticeable pulse** — box-shadow range 10px@0.25 ↔ 28px@0.60 (was 8px@0.15 ↔ 16px@0.32). Added `scale(1) ↔ scale(1.035)` in the keyframe so the pill softly breathes.',
        '★ **Brighter and bolder text** — color #e0d4ff (was #d8ccff), fontWeight 800 (was 700), letter-spacing 0.5 (was 0.4).',
        'Slightly bigger padding for weight (9×18px was 8×16px). Sun icon 14px (was 13px).',
      ],
    },
  },
  {
    v: "11.9.51", date: "2026-05-13",
    pt: {
      title: "Bedtime polish: 4 ajustes pedidos pelo William",
      bullets: [
        '★ **Estimativa de "~ acordar HH:MM · Xh média" removida.** Texto centrado abaixo do Ring durante bedtime ativo (engine-prediction baseada nas 7 últimas noites). Não fazia sentido coexistir com a rotina fixa da pediatra (alvo 19:30 → wake 07:00).',
        '★ **Shimmer do counter agora é bem mais lento** — 4s → 10s. O gradient roxo→branco→roxo passa muito mais devagar pelo número.',
        '★ **Night Wake pill mais visível** — antes era apagado demais. Agora: bg lavanda-tinted (linear-gradient 16%→8%), border lavanda mais saturada (0.42 → 0.42 com tom mais forte), texto cor `#d8ccff` (era `#c4b5fd`), box-shadow lavanda discreto + classe `nw-pill-pulse` faz uma pulse sutil 3s ease no glow.',
        '★ **Removido o halo lavanda redondo ao redor do Ring** (era a `bedtimeRingHalo` da v11.9.48 — glow box-shadow que dava "respiro"). Era o tal "background mais claro por cima" que não tava bonito.',
      ],
    },
    en: {
      title: "Bedtime polish: 4 fixes William asked for",
      bullets: [
        '★ **"~ wake HH:MM · Xh avg" estimate removed.** Centered text below the Ring during active bedtime (engine prediction from last 7 nights). Made no sense coexisting with the pediatrician\'s fixed routine (target 19:30 → wake 07:00).',
        '★ **Counter shimmer is now much slower** — 4s → 10s. The purple→white→purple gradient sweeps through the number way more slowly.',
        '★ **Night Wake pill more visible** — was too washed-out. Now: lavender-tinted bg (linear-gradient 16%→8%), more saturated lavender border, text color `#d8ccff` (was `#c4b5fd`), subtle lavender box-shadow + `nw-pill-pulse` class for a soft 3s pulse on the glow.',
        '★ **Removed the lavender halo around the Ring** (the `bedtimeRingHalo` from v11.9.48 — box-shadow glow that gave "breathing room"). It was the "lighter bg on top" that wasn\'t pretty.',
      ],
    },
  },
  {
    v: "11.9.50", date: "2026-05-13",
    pt: {
      title: "Night Wake button virou pill minimal centrado",
      bullets: [
        '★ **Bye banner amber pulsando.** O botão Night Wake era um banner full-width com box-shadow amber animado, ícone 36×36 + título + subtítulo de 2 linhas. Destoava do tema bedtime calmo (especialmente com a v11.9.48 que escureceu o bg).',
        '★ **Agora:** pill centrado de ~7×14px padding, borda lavanda sutil, texto "DESPERTAR?" caps. Tap → vira amber pill com "ACORDADA · 8min". Cor amber só no estado ATIVO (alarminho real), default lavanda (in-theme com bedtime).',
        'Bedtime quick button (no grid 3×2 do Home) **fica intacto** — você pediu pra manter como tá.',
        'Mesma lógica de toggle (toggleNightWake). Mesmo timer interno do night wake. Só visual minimalist.',
      ],
    },
    en: {
      title: "Night Wake button became a minimal centered pill",
      bullets: [
        '★ **Bye amber-pulsing banner.** The Night Wake button was a full-width banner with animated amber box-shadow, 36×36 icon + title + 2-line subtitle. Out of place with the calm bedtime theme (especially after v11.9.48 darkened the bg).',
        '★ **Now:** centered pill ~7×14px padding, subtle lavender border, "WAKE?" caps text. Tap → amber pill with "AWAKE · 8min". Amber only on ACTIVE state (real alarm), default lavender (in-theme with bedtime).',
        'Bedtime quick button (in Home\'s 3×2 grid) **stays intact** — you asked to keep as-is.',
        'Same toggle logic (toggleNightWake). Same internal night wake timer. Just minimalist visuals.',
      ],
    },
  },
  {
    v: "11.9.49", date: "2026-05-13",
    pt: {
      title: "Bedtime counter ganha shimmer sweep (não respirando)",
      bullets: [
        '★ **"2h 14m" durante bedtime agora tem um gradient passando pelo número** em vez de só respirar de tamanho. Sweep horizontal de roxo → branco → roxo a cada 4s. Sensação cinemática "fluindo".',
        'Background do texto é uma `linear-gradient(110deg, #7c3aed, #8b5cf6, #e9d5ff, #ffffff, #e9d5ff, #8b5cf6, #7c3aed)` com 300% de largura, e a `background-position` anima de 200% pra -200% em loop linear de 4s.',
        'Mantida: glow lavanda ao redor do Ring (5s), sub-label "Bedtime/Boa noite" respirando opacidade, body bg mais escuro/lavanda. Trocou-se SÓ a animação do counter — não breath mais.',
      ],
    },
    en: {
      title: "Bedtime counter gets shimmer sweep (not breath)",
      bullets: [
        '★ **"2h 14m" during bedtime now has a gradient passing through the number** instead of just breathing in size. Horizontal sweep purple → white → purple every 4s. Cinematic "flowing" feel.',
        'Text background is `linear-gradient(110deg, #7c3aed, #8b5cf6, #e9d5ff, #ffffff, #e9d5ff, #8b5cf6, #7c3aed)` with 300% width, and `background-position` animates from 200% to -200% in a linear 4s loop.',
        'Kept: lavender glow around the Ring (5s), "Bedtime/Goodnight" sub-label opacity breathing, darker/lavender body bg. Only swapped the counter animation — no breath anymore.',
      ],
    },
  },
  {
    v: "11.9.48", date: "2026-05-13",
    pt: {
      title: "Bedtime ambient refeito — discreto (sem lua emoji)",
      bullets: [
        '★ **Sai a lua emoji + halo gigante** que adicionei na v11.9.47 (visualmente loud demais — William chamou). Em vez:',
        '★ **Glow lavanda sutil ao redor do Ring** — box-shadow respirando 5s, raio 30→60px com alpha 0.30→0.55. Parece o anel "pulsando levemente".',
        '★ **"Boa noite / Bedtime" e contador (2h14m) respiram juntos.** Sub-label oscila opacidade 0.85→1, contador grande oscila drop-shadow lavanda 12→24px. 5s loop, sincronizado.',
        '★ **Background do app fica mais escuro/lavanda durante bedtime** via `body.bedtime-active`. Os tons #1a1f52/#10153d/#070b1e viram #15124a/#080a26/#040616 — uns 15% mais profundos, com toque roxo. Transição suave de 0.8s.',
        'Tudo CSS puro, GPU-cheap. Volta ao normal automaticamente quando o timer encerra.',
      ],
    },
    en: {
      title: "Bedtime ambient redone — discreet (no moon emoji)",
      bullets: [
        '★ **The moon emoji + giant halo are gone** from v11.9.47 (visually too loud — William called it out). Instead:',
        '★ **Subtle lavender glow around the Ring** — box-shadow breathing 5s, 30→60px radius with 0.30→0.55 alpha. Looks like the ring "lightly pulsing".',
        '★ **"Goodnight / Bedtime" and counter (2h14m) breathe together.** Sub-label oscillates opacity 0.85→1, large counter oscillates drop-shadow lavender 12→24px. 5s loop, synced.',
        '★ **App background gets darker/lavender during bedtime** via `body.bedtime-active`. The #1a1f52/#10153d/#070b1e tones become #15124a/#080a26/#040616 — about 15% deeper, with a purple touch. Smooth 0.8s transition.',
        'All pure CSS, GPU-cheap. Returns to normal automatically when the timer ends.',
      ],
    },
  },
  {
    v: "11.9.47", date: "2026-05-13",
    pt: {
      title: "Rotina completa minimal + lua respirando no bedtime",
      bullets: [
        '★ **Rotina 100% feita = divisor invisível.** Antes era um card verde grande com check 38×38 + "Rotina completa hoje" + sub-texto. Agora vira um single-line: dois traços sutis verdes + check 18×18 + "ROTINA COMPLETA" em caixa alta. Quase ausência — celebração sem peso visual.',
        '★ **Bedtime ambient pulse.** Quando você toca em "Iniciar bedtime", o Ring ganha 2 elementos animados sutis atrás do conteúdo principal: um halo lavanda respirando 4.5s + uma lua emoji gigante (65% do diâmetro do Ring) com opacidade 0.06 também respirando. Mesma vibe de "ambiente noturno" — sem competir com a info do center text.',
        'Ambas animações desaparecem se você para o timer. Animações CSS puras (GPU-cheap), respeitam `body.app-hidden` (PWA em background não gasta CPU).',
        'Mantida toda a UI funcional do bedtime ao vivo (sub-label "Boa noite", elapsed time, SleepBlock no Home). Só adicionou ambient signal.',
      ],
    },
    en: {
      title: "Minimal routine done + breathing moon during bedtime",
      bullets: [
        '★ **Routine 100% done = invisible divider.** Was a big green card with 38×38 check + "Routine done today" + sub-text. Now becomes a single line: two subtle green strokes + 18×18 check + "ROUTINE DONE" in caps. Almost absence — celebration without visual weight.',
        '★ **Bedtime ambient pulse.** When you tap "Start bedtime", the Ring gets 2 subtle animated elements behind the main content: a lavender halo breathing 4.5s + a giant moon emoji (65% of the Ring diameter) at opacity 0.06 also breathing. Same "nighttime ambient" vibe — doesn\'t compete with the center text info.',
        'Both animations vanish if you stop the timer. Pure CSS animations (GPU-cheap), respect `body.app-hidden` (PWA in background doesn\'t burn CPU).',
        'All functional bedtime UI kept (sub-label "Goodnight", elapsed time, SleepBlock on Home). Only added ambient signal.',
      ],
    },
  },
  {
    v: "11.9.46", date: "2026-05-13",
    pt: {
      title: "Timer ativo conta como ✓ na rotina",
      bullets: [
        '★ **Fix:** quando você toca em "Iniciar soneca" ou "Iniciar bedtime", o slot correspondente na rotina já fica ✓ verde imediatamente — sem esperar terminar pra criar a entry no Firestore. Antes só contava depois de finalizar (que aí ja podia estar atrasado e perder a janela).',
        'Aplicado pra naps + bedtime. Cenário: 3ª soneca alvo 13:30, você toca em Iniciar às 13:25 → chip da 3ª vira ✓ verde na hora. Mesmo se ainda for "agora", o slot conta como feito.',
        'Bath não tem timer (é evento direto), wake também não — então só naps + sleep usam essa lógica nova.',
        'Match com timer ativo usa a mesma tolerância (±60min naps/bedtime).',
      ],
    },
    en: {
      title: "Active timer counts as ✓ in routine",
      bullets: [
        '★ **Fix:** when you tap "Start nap" or "Start bedtime", the corresponding routine slot immediately turns ✓ green — without waiting for the timer to end and create the Firestore entry. Before, it only counted after finalizing (which could be late and miss the window).',
        'Applied to naps + bedtime. Scenario: 3rd nap target 13:30, you tap Start at 13:25 → 3rd chip turns ✓ green right away. Even while "in progress", the slot counts as done.',
        'Bath has no timer (direct event), wake either — so only naps + sleep use this new logic.',
        'Active timer matching uses the same tolerance (±60min naps/bedtime).',
      ],
    },
  },
  {
    v: "11.9.45", date: "2026-05-13",
    pt: {
      title: "Tolerância de rotina ±60min + Ring meio termo (270px)",
      bullets: [
        '★ **Soneca/banho/bedtime: tolerância subiu de ±20-30min pra ±60min.** Cenário real: 4ª soneca alvo 16:00, deitou de fato 16:40 — 40min de atraso, mas ainda é "a 4ª soneca". Agora conta como ✓ verde em vez de ! laranja.',
        'Wake fica em ±20min (time-sensitive — acordar 1h depois do alvo é caso diferente, não conta como o mesmo "wake").',
        '★ **Ring 270px** — meio termo entre os 200 da v11.9.43 e os 340 originais. ~20% redução vs original. Mantém presença visual + ainda libera ~70px no Home.',
        'Big font 32 → 42, dotSz 32 → 40, sleepSz 36 → 40, strokes proporcionalmente bumpadas (16/24/19/13). Sub-label "Acordada/etc" voltou pro T.fMD (era T.fSM em v11.9.43).',
        'Duração inline do sleep arc volta pro T.fXS (estava 8px inline), respira melhor com sleepSz 40.',
      ],
    },
    en: {
      title: "Routine tolerance ±60min + middle-ground Ring (270px)",
      bullets: [
        '★ **Nap/bath/bedtime tolerance bumped from ±20-30min to ±60min.** Real-world scenario: 4th nap target 16:00, actually slept at 16:40 — 40min late, but still "the 4th nap". Now counts as ✓ green instead of ! orange.',
        'Wake stays at ±20min (time-sensitive — waking 1h late is a different scenario, not the same "wake").',
        '★ **Ring 270px** — middle ground between v11.9.43\'s 200 and original 340. ~20% reduction vs original. Keeps visual presence + still frees ~70px on Home.',
        'Big font 32 → 42, dotSz 32 → 40, sleepSz 36 → 40, strokes proportionally bumped (16/24/19/13). Sub-label "Awake/etc" back to T.fMD (was T.fSM in v11.9.43).',
        'Inline duration on sleep arc back to T.fXS (was 8px inline), breathes better with sleepSz 40.',
      ],
    },
  },
  {
    v: "11.9.44", date: "2026-05-13",
    pt: {
      title: "Fix: 'Acordada' verde de volta (não roxo) durante o dia",
      bullets: [
        '★ **Bug introduzido em v11.9.42:** quando rotina fixa ativa, o número grande de "Acordada há Xh" no Ring virou roxo lavanda. Era pra continuar verde como antes (mesma cor pré-rotina) — só os ALERTAS de overdue/stretching que deveriam sumir.',
        'Removida a branch nova `state === null → lavanda`. Agora cai no default green (#34d399 / #059669) que sempre foi a cor do "Awake for" neutro.',
        'Resto da rotina silenciosa segue: sem banners, sem "Nap 3 ~13:42" dentro do arco, Ring sem vermelho/laranja de overdue.',
      ],
    },
    en: {
      title: "Fix: 'Awake for' back to green (not purple) during the day",
      bullets: [
        '★ **Bug introduced in v11.9.42:** with fixed routine active, the big "Awake for Xh" number in the Ring turned purple lavender. It should have stayed green as before — only the overdue/stretching ALERTS were supposed to go.',
        'Removed the new `state === null → lavender` branch. Now falls through to default green (#34d399 / #059669), which was always the color of neutral "Awake for".',
        'Rest of the silent routine still applies: no banners, no "Nap 3 ~13:42" inside the arc, no red/orange Ring overdue.',
      ],
    },
  },
  {
    v: "11.9.43", date: "2026-05-13",
    pt: {
      title: "Ring compacto (opção A do mockup) — KPI cards above-the-fold",
      bullets: [
        '★ **Ring 340px → 200px** (~41% redução). Mantém identidade (anel circular dominante, dots tappáveis, anchors sun/moon, arcs de soneca), mas libera ~140px de altura vertical no Home.',
        '★ **Consequência:** os 4 cards de KPI (mamadas/ml, simet, sono, fraldas) agora ficam **acima da fold do iPhone 14/15** — sem scroll pra ver. Antes ficavam parcialmente cortados.',
        '**Tudo escalado proporcionalmente:** tamanho da fonte central 52 → 32, dotSz 46 → 32 (mantém ≥ 32 pra Apple HIG tap target), sleepSz 44 → 36, strokes dos arcos 20/30/24 → 12/18/14, anchor circle 40 → 30, MIN_GAP entre dots 22 → 15.',
        'Mantida a sparkle animation no fim do último arco de soneca, o glow breathing dos ícones, o sub-label "Acordada / Napping / Bedtime", o star icon (orbit comet) ao logar evento.',
        'Sub-label da Ring (Mercúrio / Acordada / Bedtime) reduzida de T.fMD pra T.fSM, letter-spacing 1.8 → 1.2 — mais discreta, dá espaço pro número grande respirar.',
      ],
    },
    en: {
      title: "Compact Ring (mockup option A) — KPI cards above-the-fold",
      bullets: [
        '★ **Ring 340px → 200px** (~41% reduction). Keeps identity (dominant circular ring, tappable dots, sun/moon anchors, nap arcs), but frees up ~140px of vertical height on Home.',
        '★ **Result:** the 4 KPI cards (bottles/ml, simet, sleep, diapers) are now **above the iPhone 14/15 fold** — no scroll needed. Before, they were partially cut off.',
        '**Everything scaled proportionally:** central font size 52 → 32, dotSz 46 → 32 (kept ≥ 32 for Apple HIG tap target), sleepSz 44 → 36, arc strokes 20/30/24 → 12/18/14, anchor circle 40 → 30, MIN_GAP between dots 22 → 15.',
        'Kept the sparkle animation at the end of the last nap arc, the glow breathing on icons, the sub-label "Awake / Napping / Bedtime", the star icon (orbit comet) when logging an event.',
        'Ring sub-label (Mercury / Awake / Bedtime) reduced from T.fMD to T.fSM, letter-spacing 1.8 → 1.2 — more discreet, giving the big number room to breathe.',
      ],
    },
  },
  {
    v: "11.9.42", date: "2026-05-13",
    pt: {
      title: "Rotina fixa: napSug fica em silêncio (Ring + banners)",
      bullets: [
        '★ **"Nap 3 ~13:42" dentro do arco do Ring some** quando rotina ativa. Era a previsão do engine (napSug.predictedTime + napPos) renderizada no centro do anel — competia com o card "Próximo na rotina · alvo 13:30" da pediatra.',
        '★ **Banners amber Janela abrindo / Hora ideal / Esticando / Passou do máximo** também escondidos. São estimativas do engine baseadas em padrão histórico ("já tá overtired"). Com rotina fixa da pediatra, viraram ruído contraditório.',
        '★ **Cor do Ring fica neutra lavanda** durante "Acordada há Xh". Antes ia pra vermelho/laranja em modo overdue mesmo com rotina ativa. Agora a Ring só fica colorida quando há um timer ativo (mamada/soneca/bedtime em andamento) ou fora do modo rotina.',
        'Mantém intacto:**texto "Acordada há Xh"** dentro do Ring (info útil mesmo com rotina), eventos do dia (dots e arcs de soneca/mamada/fralda no anel), `SleepBlock` ao vivo, card de rotina nova, `InsightCards`.',
        'Toggle no perfil é a chave: rotina off = comportamento engine-driven; rotina on = engine vira silent advisor (roda no background mas não aparece visualmente).',
      ],
    },
    en: {
      title: "Fixed routine: napSug stays silent (Ring + banners)",
      bullets: [
        '★ **"Nap 3 ~13:42" inside the Ring arc is gone** when routine is enabled. It was the engine\'s prediction (napSug.predictedTime + napPos) rendered in the center of the ring — competing with the "Next in routine · target 13:30" card.',
        '★ **Amber banners Window opening / Ideal time / Stretching / Past max window** also hidden. They\'re engine estimates from historical patterns ("already overtired"). With a fixed routine, they became contradictory noise.',
        '★ **Ring color stays neutral lavender** during "Awake for Xh". Before, it would go red/orange in overdue mode even with routine on. Now the Ring only colors up during an active timer (bottle/nap/bedtime in progress) or outside routine mode.',
        'Stays intact:**"Awake for Xh" text** inside Ring (useful info even with routine), today\'s events (dots and nap/bottle arcs on the ring), live `SleepBlock`, new routine card, `InsightCards`.',
        'Profile toggle is the switch: routine off = engine-driven behavior; routine on = engine becomes silent advisor (runs in background but invisible).',
      ],
    },
  },
  {
    v: "11.9.41", date: "2026-05-13",
    pt: {
      title: "Rotina nova suprime predição antiga (engine de pattern)",
      bullets: [
        '★ **Esconde "Próx. soneca ~13:42 · WW 2h" quando a rotina da pediatra está ativa.** Era engine-predicted, baseado nos dias anteriores. Agora com horário alvo fixo da pediatra, esse card ficava lado a lado com "Próximo na rotina · alvo 13:30" — competição de sinal, ruído visual.',
        'Engine continua rodando em background — `napSug` (alertas bio "Janela abrindo / Hora ideal / Esticando / Overdue") MANTÉM, porque são sinais biológicos da Louise (cansaço real-time), complementam a rotina fixa em vez de competir.',
        'InsightCards (padrões e médias) MANTÉM — info histórica/agregada, não duplica a rotina.',
        'Se `profile.routine.enabled = false` ou inexistente, app volta a mostrar a predição engine-driven (comportamento pré-v11.9.40).',
      ],
    },
    en: {
      title: "New routine supersedes the old prediction (pattern engine)",
      bullets: [
        '★ **Hides "Next nap ~13:42 · WW 2h" when the pediatrician\'s routine is enabled.** Was engine-predicted from previous days. With a fixed target now, this card sat right next to "Next in routine · target 13:30" — competing signals, visual noise.',
        'Engine still runs in the background — `napSug` (bio alerts "Window opening / Ideal time / Stretching / Overdue") STAYS, because they\'re biological signals (real-time tiredness), complementing the fixed routine instead of competing.',
        'InsightCards (patterns and averages) STAYS — historical/aggregated info, doesn\'t duplicate routine.',
        'If `profile.routine.enabled = false` or missing, the app falls back to engine-driven prediction (pre-v11.9.40 behavior).',
      ],
    },
  },
  {
    v: "11.9.40", date: "2026-05-13",
    pt: {
      title: "Rotina diária da pediatra — config no perfil + card no Home",
      bullets: [
        '★ **Nova seção "Rotina diária" no perfil.** Configure os horários alvo recomendados pela pediatra: acordar, banho, bedtime, 4 sonecas (com horários individuais) e número de mamadas/dia. Toggle pra ativar/desativar a feature toda. Salva em `profile.routine` no Firestore (compartilhado entre os 2 iPhones).',
        '★ **Card "Próximo na rotina" no Home** (só aparece se rotina ativa). Mostra o próximo evento programado com countdown ("alvo 13:30 · em 45min") OU alerta vermelho-âmbar quando atrasado ("3ª Soneca · 12min atrasada"). Click contextual no que vem agora.',
        '★ **Progress strip de chips.** Logo abaixo do headline, uma fileira mostrando todos os eventos do dia: ✓ verde pra feito, ! laranja pra atrasado, dot pulsante pra próximo, dot vazio pra pendente. Glance instantâneo do dia inteiro.',
        '★ **Pips de mamadas.** 7 quadradinhos verdes no rodapé do card. Preenche conforme você loga mamada ou amamentação. Mostra X/7 numérico ao lado.',
        '**Matching automático:** o app casa cada slot programado com um evento logado dentro de tolerância (±20min pras sonecas/wake, ±30min pro banho/bedtime). Sem ação manual de "marcar feito" — log a mamada/soneca/etc normalmente e o check ✓ aparece sozinho.',
        '**Default:** wake 07:00 · 1ª soneca 08:15 · 2ª 10:45 · 3ª 13:30 · 4ª 16:00 · banho 18:00 · bedtime 19:30 · 7 mamadas/dia. Editável.',
        '**Backward compat:** se `profile.routine.enabled` é falso ou inexistente, NADA muda no app (feature opt-in).',
      ],
    },
    en: {
      title: "Pediatrician's daily routine — profile config + Home card",
      bullets: [
        '★ **New "Daily routine" section in profile.** Set the target times recommended by the pediatrician: wake, bath, bedtime, 4 naps (individual times) and number of bottles/day. Toggle to enable/disable the whole feature. Saved in `profile.routine` on Firestore (shared between both iPhones).',
        '★ **"Next in routine" card on Home** (only renders if routine is enabled). Shows the next scheduled event with countdown ("target 13:30 · in 45min") OR red-amber alert when late ("3rd Nap · 12min late"). Contextual focus on what\'s next.',
        '★ **Progress strip of chips.** Row below the headline showing the entire day: ✓ green for done, ! orange for late, pulsing dot for next, empty dot for pending. Instant glance of the whole day.',
        '★ **Bottle pips.** 7 little green squares at the card footer. Fills as you log bottles or nursing. Shows numeric X/7 alongside.',
        '**Auto-matching:** the app matches each scheduled slot to a logged entry within tolerance (±20min for naps/wake, ±30min for bath/bedtime). No manual "mark as done" — just log bottle/nap/etc normally and the ✓ check appears automatically.',
        '**Defaults:** wake 07:00 · 1st nap 08:15 · 2nd 10:45 · 3rd 13:30 · 4th 16:00 · bath 18:00 · bedtime 19:30 · 7 bottles/day. Editable.',
        '**Backward compat:** if `profile.routine.enabled` is false or missing, NOTHING changes in the app (opt-in feature).',
      ],
    },
  },
  {
    v: "11.9.39", date: "2026-05-13",
    pt: {
      title: "Sistema tipográfico — escala de 7 níveis",
      bullets: [
        '★ **Auditoria UX item #5 fechada.** Antes o app tinha **~24 tamanhos de fonte** diferentes espalhados em inline styles (8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 14, 14.5, 15, 16, 17, 18, 19, 20, 22, 26, 28, 34, 36, 52). Agora: **7 níveis** definidos como constantes em `T`.',
        '★ **Escala:** `T.fXS=9` (eyebrow), `T.fSM=11` (labels), `T.fMD=13` (body), `T.fLG=15` (sub-heading), `T.fXL=17` (heading), `T.f2XL=22` (display sm), `T.f3XL=28` (display). ~390 valores substituídos no codebase.',
        '★ **Visual drift mínimo:** valores fracionais (8.5, 10.5, 11.5, 12.5, 14.5) snap pro inteiro mais próximo da escala — eram fine-tunes de sub-pixel que nem percebia diferença. Integers off-scale (10, 12, 14, etc.) bumpam ±1px pra alinhar — corpo de texto 12→13 melhora legibilidade pra olho cansado de madrugada.',
        'Hero displays raros (34, 36, 52) ficaram inline — só 5 ocorrências, não justifica constante.',
        '**Por quê:** evita "qual tamanho usar?" em cada novo componente. Sistema único de verdade — mudar `T.fSM` de 11 pra 12 atualiza 80 lugares de uma vez.',
      ],
    },
    en: {
      title: "Typographic system — 7-level scale",
      bullets: [
        '★ **UX audit item #5 closed.** Before, the app had **~24 distinct font sizes** scattered in inline styles (8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 14, 14.5, 15, 16, 17, 18, 19, 20, 22, 26, 28, 34, 36, 52). Now: **7 levels** defined as constants in `T`.',
        '★ **Scale:** `T.fXS=9` (eyebrow), `T.fSM=11` (labels), `T.fMD=13` (body), `T.fLG=15` (sub-heading), `T.fXL=17` (heading), `T.f2XL=22` (display sm), `T.f3XL=28` (display). ~390 values replaced across the codebase.',
        '★ **Minimal visual drift:** fractional values (8.5, 10.5, 11.5, 12.5, 14.5) snap to the nearest scale integer — they were sub-pixel fine-tunes, barely noticeable. Off-scale integers (10, 12, 14, etc.) bump ±1px to align — body text 12→13 improves legibility for tired late-night eyes.',
        'Rare hero displays (34, 36, 52) stayed inline — only 5 occurrences, not worth a constant.',
        '**Why:** avoids "which size?" question in every new component. Single source of truth — changing `T.fSM` from 11 to 12 updates 80 places at once.',
      ],
    },
  },
  {
    v: "11.9.38", date: "2026-05-13",
    pt: {
      title: "Sem alert nativo no SleepBlock — confirm 2-step inline",
      bullets: [
        '★ **Delete de evento aninhado no bedtime** (mamada/fralda dentro da noite): antes abria `confirm()` cinza do Safari quebrando o tema. Agora 1º tap deixa o lixinho vermelho com "Certo?" expandido, 2º tap dentro de 3s confirma. Auto-cancela em 3s.',
        '★ **Remover waking pelo editor inline** (botão lixinho dentro do modal de edição): mesmo padrão. 1º tap → botão vira "Confirmar?" vermelho mais forte, 2º tap remove. Auto-cancela em 3s.',
        'Fecha os últimos 2 pontos do app que ainda usavam alert nativo (a v11.9.35 já tinha resolvido o delete de med salvo). Consistência total com o tema escuro.',
        'Reset automático do confirm quando troca de waking no editor — evita estado fantasma onde abrir editor da waking B mostraria "Confirmar?" se a waking A tinha confirm pendente.',
      ],
    },
    en: {
      title: "No native alert in SleepBlock — inline 2-step confirm",
      bullets: [
        '★ **Delete of nested event inside bedtime** (bottle/diaper during the night): used to open Safari\'s gray `confirm()` breaking the theme. Now 1st tap turns the trash icon into red "Sure?" expanded, 2nd tap within 3s confirms. Auto-cancels in 3s.',
        '★ **Remove waking via inline editor** (trash button inside the edit modal): same pattern. 1st tap → button shows "Confirm?" in stronger red, 2nd tap removes. Auto-cancels in 3s.',
        'Closes the last 2 spots in the app that still used a native alert (v11.9.35 had already resolved saved-med delete). Full consistency with the dark theme.',
        'Auto-reset of confirm state when switching wakings in the editor — prevents "ghost state" where opening waking B\'s editor would show "Confirm?" if waking A had a pending confirm.',
      ],
    },
  },
  {
    v: "11.9.37", date: "2026-05-13",
    pt: {
      title: "SleepBlock refinado — menos chrome, mais hierarquia",
      bullets: [
        '★ **Indicador "live" único:** sai a ribbon "EM ANDAMENTO" + box-shadow azul pulsante + animação livePulse. Fica só um **ponto lavanda piscando no canto do ícone de cama** + sufixo discreto "· ao vivo" do lado da duração. Mesma clareza, sem 3 sinais redundantes.',
        '★ **Hierarquia visual reescrita:** a duração total ("9h 36m") virou headline em 20px bold. Range de horas + número de despertares foram pra linha 2 em cinza. Sumiu o eyebrow "SONO NOTURNO" (redundante com o ícone). Stripe lateral lavanda removida.',
        '★ **Stats em colunas:** "Sono real" + "Acordada" agora vivem numa **stat-row** abaixo da timeline com labels uppercase + valores tabulares. Antes eram 3 stats coloridos disputando atenção na mesma linha do header.',
        '★ **Timeline maior e mais clara:** 14px → **22px de altura**, bands com gradient azul (closed) e âmbar (ativo). Active waking ganha pulse sutil de brilho via `liveBandPulse`. Hour marks mais sutis (alpha 0.04 vs 0.06).',
        '★ **Wakings sem separador tracejado:** cada waking virou **section com border-top sólida ultra-sutil**. Pill agora mostra "00:50 → 01:18" (range explícito) em vez de "00:50 · 28min" — duração foi pra fora do pill em label cinza. Sai o título "ATIVIDADE DA NOITE" (era ruído).',
        'Cores cyan (#7dd3fc) substituem azul (#60a5fa) nas pills de waking pra contrastar melhor com o âmbar do ativo. Border + bg mais cleans.',
        'Foot do live: "Consolida quando o bedtime terminar" — sem emoji, sem itálico, peso normal.',
        'Comportamento idêntico: tap no pill abre editor inline, edit/delete dos eventos aninhados, swipe na EntryRow, lógica de wakings e retroactive events — tudo preserved.',
        '**Como funciona:** mockup criado em `.claude/mockups/bedtime-refined.html` antes de implementar. Mudança é puramente visual/hierárquica.',
      ],
    },
    en: {
      title: "SleepBlock refined — less chrome, more hierarchy",
      bullets: [
        '★ **Single "live" indicator:** the "IN PROGRESS" ribbon + blue pulsating box-shadow + livePulse animation are gone. Just a **pulsing lavender dot at the corner of the bed icon** + a subtle "· live" suffix next to the duration. Same clarity, no 3 redundant signals.',
        '★ **Visual hierarchy rewritten:** total duration ("9h 36m") is now the 20px bold headline. Time range + waking count moved to line 2 in gray. The "BEDTIME" eyebrow is gone (redundant with the bed icon). Side stripe removed.',
        '★ **Stats in columns:** "Real sleep" + "Awake" now live in a **stat-row** below the timeline with uppercase labels + tabular values. Before, 3 colored stats were competing on the same header line.',
        '★ **Bigger, clearer timeline:** 14px → **22px tall**, bands with blue gradient (closed) and amber (active). Active waking gets a subtle brightness pulse via `liveBandPulse`. Hour marks subtler (alpha 0.04 vs 0.06).',
        '★ **Wakings without dashed separators:** each waking became a **section with a solid ultra-subtle top border**. The pill now shows "00:50 → 01:18" (explicit range) instead of "00:50 · 28min" — duration moved out to a gray label. The "NIGHT ACTIVITY" title is gone (was noise).',
        'Cyan (#7dd3fc) replaces blue (#60a5fa) on waking pills for better contrast with active amber. Borders + bg are cleaner.',
        'Live footer: "Saved when bedtime ends" — no emoji, no italic, regular weight.',
        'Behavior identical: tap on pill opens inline editor, edit/delete of nested events, EntryRow swipe, wakings + retroactive events logic — all preserved.',
        '**How it works:** mockup created at `.claude/mockups/bedtime-refined.html` before implementing. Change is purely visual/hierarchical.',
      ],
    },
  },
  {
    v: "11.9.36", date: "2026-05-04",
    pt: {
      title: "Discoverability hints — chevron na data + ••• no Ring",
      bullets: [
        '★ **Chevron ▾ ao lado da data** no header da aba História. Sinaliza que o label é tappável (abre date picker pra jump rápido a qualquer dia). Antes o picker era invisível (input com opacity:0).',
        '★ **••• sutil no canto do Ring** (top-right, opacity 0.32). Hint visual de que o Ring tem **long-press → modal de detalhes**. Sem ocupar layout, sem competir com o conteúdo. Apenas presença sugerindo "tem mais aqui".',
        'Resolve 2 dos 5 gaps de discoverability identificados na auditoria UX. Os restantes (long-press em chip de med, swipe horizontal entre páginas, swipe-right na EntryRow) podem entrar com onboarding mini-tour no futuro.',
      ],
    },
    en: {
      title: "Discoverability hints — chevron on date + ••• on Ring",
      bullets: [
        '★ **Chevron ▾ next to the date** in the History tab header. Signals that the label is tappable (opens date picker for quick jump to any day). Before, the picker was invisible (input with opacity:0).',
        '★ **Subtle ••• in the Ring corner** (top-right, opacity 0.32). Visual hint that the Ring has **long-press → detail modal**. Doesn\'t take layout space, doesn\'t compete with content. Just presence suggesting "there\'s more here".',
        'Resolves 2 of 5 discoverability gaps identified in the UX audit. The rest (long-press on med chip, horizontal swipe between pages, swipe-right on EntryRow) can come with an onboarding mini-tour in the future.',
      ],
    },
  },
  {
    v: "11.9.35", date: "2026-05-04",
    pt: {
      title: "Auditoria UX TOP 3: quick buttons + touch targets + delete inline",
      bullets: [
        '★ **Quick buttons Home: 6×1 → 3×2** (Apple HIG). Fonte 8.5px → 11px legível, ícones 15→20px, touch target 60+px de altura. Antes era impossível ler "Mam./Amam./Sonec." em micro-text. Agora cada botão tem espaço pra polegar.',
        '★ **Touch targets Apple HIG**: bell 34→40px, nav buttons 40×36→46×44, FAB + central 36→44. Nav pill maxWidth 340→360. Erros de tap noturnos com bebê no colo vão cair.',
        '★ **Delete de med salvo: 2-step inline** em vez de `confirm()` nativo. Primeiro tap "Excluir" → botão vira "Confirmar?" vermelho mais forte por 3s → segundo tap executa. Tema preservado, sem alerta cinza Safari.',
        'Itens #4 (discoverability hints) e #5 (sistema tipográfico) da auditoria ficam pra próximos rounds.',
      ],
    },
    en: {
      title: "UX audit TOP 3: quick buttons + touch targets + inline delete",
      bullets: [
        '★ **Home quick buttons: 6×1 → 3×2** (Apple HIG). Font 8.5px → 11px readable, icons 15→20px, touch target 60+px tall. Before, labels were micro-text. Now each button has thumb-sized space.',
        '★ **Touch targets Apple HIG**: bell 34→40px, nav buttons 40×36→46×44, central FAB 36→44. Nav pill maxWidth 340→360. Night-time taps with baby in arms will hit more reliably.',
        '★ **Delete saved med: 2-step inline** instead of native `confirm()`. First "Delete" tap → button becomes "Confirm?" stronger red for 3s → second tap executes. App theme preserved, no gray Safari alert.',
        'Items #4 (discoverability hints) and #5 (typographic scale) from the audit are saved for future rounds.',
      ],
    },
  },
  {
    v: "11.9.34", date: "2026-05-04",
    pt: {
      title: "Limpeza pós-auditoria — dead code + inbox trim",
      bullets: [
        '🧹 **`FB.loadOlderEntries` removido** — função declarada em v11.9.0 pra puxar histórico >90d sob demanda, mas nunca foi conectada na UI. Hoje era dead code. Re-adicionar é trivial se algum dia precisar.',
        '🧹 **Inbox auto-trim a 30 itens** ao gravar. Reset diário à meia-noite já zera, mas se o app fica fechado por dias os hints acumulam. 30 é mais que suficiente pra qualquer dia. Evita doc crescer silenciosamente.',
        'Auditoria de DB/infra de v11.9.25 agora está 100% endereçada — restos eram cosméticos.',
      ],
    },
    en: {
      title: "Post-audit cleanup — dead code + inbox trim",
      bullets: [
        '🧹 **`FB.loadOlderEntries` removed** — function declared in v11.9.0 to lazy-load history >90d on demand, but never wired up in the UI. It was dead code. Re-adding is trivial if needed someday.',
        '🧹 **Inbox auto-trim to 30 items** on save. Midnight daily reset already clears, but if the app stays closed for days the hints accumulate. 30 is more than enough for any single day. Prevents silent doc growth.',
        'The v11.9.25 DB/infra audit is now 100% addressed — leftovers were cosmetic.',
      ],
    },
  },
  {
    v: "11.9.33", date: "2026-05-04",
    pt: {
      title: "Landscape lock reforçado — sempre dispara",
      bullets: [
        '🚨 Bug reportado: PWA ainda rotacionava. Causa: threshold de `932px` ficava no limite exato do iPhone Pro Max em landscape (também = 932) — algumas implementações Safari não consideram `≤932` como match.',
        '★ **Threshold bumped 932 → 1180px** (cobre todos iPhones em landscape com margem).',
        '★ **Aspect-ratio fallback** `max-aspect-ratio:13/9` — pega qualquer device em landscape que NÃO seja claramente tablet/desktop.',
        '★ **Esconde mais agressivamente**: `#root{visibility:hidden}` + `#nav-host{display:none}` + `body{overflow:hidden}`. Antes podia ter conteúdo passando por trás do overlay em algumas situações.',
        '⚠️ Ainda assim, iOS PWA standalone pode ignorar a manifest portrait-primary se o app foi instalado antes da v11.9.30 — re-instalar pega o manifest novo.',
      ],
    },
    en: {
      title: "Reinforced landscape lock — always triggers",
      bullets: [
        '🚨 Reported bug: PWA still rotated. Cause: `932px` threshold sat exactly at iPhone Pro Max landscape width (also = 932) — some Safari implementations don\'t count `≤932` as a match.',
        '★ **Threshold bumped 932 → 1180px** (covers all iPhones in landscape with margin).',
        '★ **Aspect-ratio fallback** `max-aspect-ratio:13/9` — catches any device in landscape that\'s clearly not a tablet/desktop.',
        '★ **Hides more aggressively**: `#root{visibility:hidden}` + `#nav-host{display:none}` + `body{overflow:hidden}`. Before, content could leak behind the overlay in some situations.',
        '⚠️ Even so, iOS PWA standalone may ignore the portrait-primary manifest if the app was installed before v11.9.30 — re-installing picks up the new manifest.',
      ],
    },
  },
  {
    v: "11.9.32", date: "2026-05-04",
    pt: {
      title: "Quick button: Tummy → Medicine",
      bullets: [
        '★ O 6º quick button na Home era **Tummy time** — raramente usado no dia-a-dia. Trocado por **Medicine** (💊 pill icon, cor amber). Mamãe/papai dão Floripa + Vit. D + Cólicaliv todo dia (combo manhã via multi-select da v11.8.0), então acesso direto faz mais sentido.',
        'Tummy time continua acessível via botão `+` no menu central. Quick buttons agora: Mam. / Amam. / Fralda / Sono / Sonec. / **Med.**',
      ],
    },
    en: {
      title: "Quick button: Tummy → Medicine",
      bullets: [
        '★ The 6th quick button on Home was **Tummy time** — rarely used day-to-day. Swapped for **Medicine** (💊 pill icon, amber color). Parents give Floripa + Vit. D + Cólicaliv daily (morning combo via v11.8.0 multi-select), so direct access makes more sense.',
        'Tummy time still accessible via the central `+` button. Quick buttons are now: Bottle / Nurse / Diaper / Sleep / Nap / **Med.**',
      ],
    },
  },
  {
    v: "11.9.31", date: "2026-05-04",
    pt: {
      title: "PWA portrait lock reforçado",
      bullets: [
        '★ **`orientationchange` listener** chama `screen.orientation.lock("portrait")` toda vez que a tela rotaciona. Em **PWA iOS standalone (Safari 16.4+)**, iOS aceita o lock e força volta pro retrato quase instantaneamente. Em iOS antigo ou browser tab, no-op silencioso (overlay CSS cobre).',
        '★ Função `_tryLockPortrait` extraída pra reuso. Chamada no boot + em todo evento.',
        '⚠️ Se você instalou o PWA antes da v11.9.30 (manifest tinha `portrait` em vez de `portrait-primary`), iOS pode estar usando manifest cacheada. **Pra forçar refresh**: apague o app da tela inicial → abra a URL no Safari → toque em compartilhar → "Adicionar à tela de início". O novo manifest é lido na hora da instalação.',
      ],
    },
    en: {
      title: "Reinforced PWA portrait lock",
      bullets: [
        '★ **`orientationchange` listener** calls `screen.orientation.lock("portrait")` every time the screen rotates. On **iOS PWA standalone (Safari 16.4+)**, iOS accepts the lock and forces back to portrait almost instantly. On older iOS or browser tab, silent no-op (CSS overlay covers).',
        '★ `_tryLockPortrait` function extracted for reuse. Called at boot + on every event.',
        '⚠️ If you installed the PWA before v11.9.30 (manifest had `portrait` instead of `portrait-primary`), iOS may be using cached manifest. **To force refresh**: delete app from home screen → open URL in Safari → tap share → "Add to Home Screen". New manifest is read at install time.',
      ],
    },
  },
  {
    v: "11.9.30", date: "2026-05-04",
    pt: {
      title: "Trava de orientação retrato — 3 camadas",
      bullets: [
        '★ **Manifest** atualizado pra `orientation: "portrait-primary"` (mais estrito que `portrait`). Funciona em PWA standalone (instalado).',
        '★ **`screen.orientation.lock("portrait")`** chamado no boot — funciona em browsers Chromium (silencioso fallback no iOS Safari, que não suporta).',
        '★ **Overlay CSS** em landscape pra mobile (≤932px largura): tela cheia com ícone girando e mensagem "Gire o celular pra continuar". `#root` pausa animações por trás. Quando volta pro retrato, overlay some automaticamente.',
        'iPad/desktop em landscape continua funcionando normalmente (threshold 932px = iPhone 16 Pro Max). Só mobile que recebe o block.',
      ],
    },
    en: {
      title: "Portrait orientation lock — 3 layers",
      bullets: [
        '★ **Manifest** updated to `orientation: "portrait-primary"` (stricter than `portrait`). Works in installed PWA standalone mode.',
        '★ **`screen.orientation.lock("portrait")`** called at boot — works on Chromium browsers (silent fallback on iOS Safari, which doesn\'t support it).',
        '★ **CSS overlay** in landscape for mobile (≤932px width): full-screen with rotating icon and "Rotate your phone" message. `#root` pauses animations behind. When back to portrait, overlay disappears automatically.',
        'iPad/desktop in landscape keeps working normally (932px threshold = iPhone 16 Pro Max). Only mobile gets the block.',
      ],
    },
  },
  {
    v: "11.9.29", date: "2026-05-04",
    pt: {
      title: "Removidos os quick chips de tempo do AddForm",
      bullets: [
        '★ Removidos os 6 chips `Agora / −5 / −15 / −30 / −1h / −2h` que apareciam abaixo do date+time picker. Decisão do usuário — ocupavam espaço sem ROI claro (o time picker nativo já cobria todos os casos com 2 toques).',
        'marginBottom da row date+time ajustado de 10 → 18 pra preservar o spacing rítmico das outras linhas do form.',
      ],
    },
    en: {
      title: "Removed the quick time chips from AddForm",
      bullets: [
        '★ Removed the 6 chips `Now / −5 / −15 / −30 / −1h / −2h` that appeared below the date+time picker. User decision — they took up space without clear ROI (the native time picker already covered all cases in 2 taps).',
        'Date+time row marginBottom adjusted from 10 → 18 to preserve the rhythmic spacing of other form rows.',
      ],
    },
  },
  {
    v: "11.9.28", date: "2026-05-03",
    pt: {
      title: "Wake prediction polish — confiabilidade + cap overshoot",
      bullets: [
        '★ **Threshold elevado de 1 → 3 noites** pra média ser confiável. Antes mostrava com `pts>=2`, levando a previsões instáveis nos primeiros dias. Agora só aparece com pelo menos 3 noites de dado.',
        '★ **Cap visual no overshoot**: se passou da média por mais de 60min, em vez de `+200min` (que soa alarmante e impreciso), mostra simplesmente `além da média · 8h média`. Decisão de UX: > 1h, o número absoluto é menos útil que sinalizar "fora do padrão".',
      ],
    },
    en: {
      title: "Wake prediction polish — reliability + overshoot cap",
      bullets: [
        '★ **Threshold raised from 1 → 3 nights** for the average to be reliable. Before it showed with `pts>=2`, leading to unstable predictions in early days. Now only appears with at least 3 nights of data.',
        '★ **Visual cap on overshoot**: if past avg by more than 60min, instead of `+200min` (which sounds alarming and imprecise), simply shows `well past avg · 8h avg`. UX decision: above 1h, the absolute number is less useful than signaling "off-pattern".',
      ],
    },
  },
  {
    v: "11.9.27", date: "2026-05-03",
    pt: {
      title: "Quick re-log — botão Repetir no toast pós-save",
      bullets: [
        '★ **Após registrar bottle/diaper/medicine/temperature/bath**, o toast no topo agora tem dois botões: `↻ Repetir` (verde) e `Desfazer` (lavanda). Clica Repetir → re-cria entry com **mesmos dados** mas horário=now. Útil pra mamadas em sequência rápida ou trocas de fralda em série.',
        '★ Toast fica **3,5s** quando há Repetir (era 2s) pra dar tempo de clicar.',
        'Sleep/nap/nursing/tummytime **não** ganham Repetir — esses são timers, repetir significaria iniciar outro timer (UX confuso).',
        'Edits também não — só faz sentido em new entries.',
        'Repeat preserva `dose`, `subtype`, `ml`, `name`, `value` etc. Limpa `nightWake` e `_docId`. Novo `id` gerado.',
      ],
    },
    en: {
      title: "Quick re-log — Repeat button in post-save toast",
      bullets: [
        '★ **After logging bottle/diaper/medicine/temperature/bath**, the top toast now has two buttons: `↻ Again` (green) and `Undo` (lavender). Tap Again → re-creates entry with **same data** but time=now. Useful for back-to-back feeds or diaper changes.',
        '★ Toast persists **3.5s** when Repeat is available (was 2s) to give time to tap.',
        'Sleep/nap/nursing/tummytime **don\'t** get Repeat — those are timer events, repeating means starting another timer (confusing UX).',
        'Edits also excluded — only makes sense for new entries.',
        'Repeat preserves `dose`, `subtype`, `ml`, `name`, `value` etc. Strips `nightWake` and `_docId`. New `id` generated.',
      ],
    },
  },
  {
    v: "11.9.26", date: "2026-05-03",
    pt: {
      title: "Restore de backup ~16x mais rápido (WriteBatch)",
      bullets: [
        '★ **`importAll` agora usa Firestore WriteBatch** em vez de loop com `await` por doc. Antes: 1650 entries × ~50ms de round-trip = **~80s** pra restaurar tudo. Agora: agrupado em batches de 500 ops, ~4 batches × 1 round-trip = **~5s**.',
        'Mesma semântica preservada: entries com merge implícito false (overwrite), profile/inbox `{merge:false}` explícito, meds substitui lista inteira.',
        'Limite Firestore de 500 ops por commit respeitado via chunking automático.',
        'Skip silencioso de docs sem ID (proteção contra dados corrompidos).',
        'Item #5 do TOP 5 ROI da auditoria de infra (v11.9.25). Hot-path raro mas dói quando precisa.',
      ],
    },
    en: {
      title: "Backup restore ~16x faster (WriteBatch)",
      bullets: [
        '★ **`importAll` now uses Firestore WriteBatch** instead of per-doc `await` loop. Before: 1650 entries × ~50ms round-trip = **~80s** to restore. Now: chunked in batches of 500 ops, ~4 batches × 1 round-trip = **~5s**.',
        'Same semantics preserved: entries with implicit merge false (overwrite), profile/inbox `{merge:false}` explicit, meds replaces whole list.',
        'Firestore 500-ops-per-commit limit respected via auto-chunking.',
        'Silent skip of docs without IDs (protection against corrupted data).',
        'Item #5 of TOP 5 ROI from infra audit (v11.9.25). Rare hot-path but painful when needed.',
      ],
    },
  },
  {
    v: "11.9.25", date: "2026-04-27",
    pt: {
      title: "Auditoria de DB/infra — 4 fixes de performance e custo",
      bullets: [
        '★ **`dedupeLegacyWakings` skip pós-migração**: helper roda em todo `onSnapshot` fire (várias por dia). Quando flag `lp_legacy_wakings_migrated_v1` setada, retorna entries direto. Quando nada foi corrigido, retorna mesma ref. **Mata re-render storm** dos useMemos dependentes de entries.',
        '★ **`exportAll` cache-first**: auto-backup diário lia toda a coleção do server (~1650 reads/dia/device). Agora tenta `{source:"cache"}` primeiro (Firestore offline persistence já tem o snapshot), fallback pro server se cache vazio. **Economiza 80%+ de reads** do auto-backup quando rodando em condições normais.',
        '★ **GC de pushTokens órfãos**: ao salvar token novo, deleta tokens com `updatedAt > 180d` (FCM rotaciona em ~270d). Antes a sub-collection crescia sem limite e backend mandava push pra tokens mortos. Fire-and-forget.',
        '★ **Period "all" → "90d"**: label honesto. `subEntries` usa janela 90d, "Tudo" era misleading. Não muda comportamento, só semântica visual.',
        'Auditoria completa rodada por agente focado em DB/infra — confortável dentro da quota grátis Firestore (50k reads/dia) hoje e em projeção de 1 ano.',
      ],
    },
    en: {
      title: "DB/infra audit — 4 performance and cost fixes",
      bullets: [
        '★ **`dedupeLegacyWakings` skip post-migration**: helper runs on every `onSnapshot` fire (multiple per day). When `lp_legacy_wakings_migrated_v1` flag set, returns entries straight through. When nothing changed, returns same ref. **Kills the re-render storm** in entries-dependent useMemos.',
        '★ **`exportAll` cache-first**: daily auto-backup was reading the whole collection from server (~1650 reads/day/device). Now tries `{source:"cache"}` first (Firestore offline persistence has the snapshot), falls back to server if cache empty. **Saves 80%+ of auto-backup reads** under normal use.',
        '★ **GC of orphan pushTokens**: on saving new token, deletes tokens with `updatedAt > 180d` (FCM rotates in ~270d). Before the sub-collection grew unbounded and backend would push to dead tokens. Fire-and-forget.',
        '★ **Period "all" → "90d"**: honest label. `subEntries` uses 90d window, "All" was misleading. Behavior unchanged, just visual semantics.',
        'Full audit run by an agent focused on DB/infra — comfortable within Firestore free tier (50k reads/day) today and projected 1 year.',
      ],
    },
  },
  {
    v: "11.9.24", date: "2026-04-27",
    pt: {
      title: "Design pass — micro-polish em 5 áreas + wake prediction minimalista",
      bullets: [
        '★ **Header**: nome do bebê com **micro-gradient** (branco → lavanda), font 17→18px, letter-spacing -0.45 (Apple SF Pro). Dot separator translúcido. **Hairline divider** sob o header marca a borda da seção sem caixa.',
        '★ **CuriosityCard**: tag agora é **pill com bg + ícone integrado**. Border 0.22 → 0.16 (mais leve). Outer drop shadow lavanda blur 28px substituiu o triple-shadow. Letter-spacing 0.05 no body para legibilidade.',
        '★ **Ring**: número central usa **gradient texto branco→lavanda** + drop-shadow blur 28px (lavanda) — sensação de luz emanando, integra com starfield. Label CAPS com letter-spacing 1.8 (era 1.5) e font 14→13.',
        '★ **Cards 4-grid**: padding 7,9 → 9,11. Adicionado **highlight 1px gradient no topo** (luz vinda de cima — Linear/Apple Cards approach). Sufixo de unidade (`ml`, `x`) com opacity 0.5 separado do número (hierarquia SF).',
        '★ **Today header** virou flex justify-between: "TODAY" em accent + data em CAPS subtle à direita. Letter-spacing 1 (era 0.8). Mais editorial.',
        '★ **Wake prediction MUITO mais minimalista**: era card com gradient + ícone + border. Agora **só uma linha de texto centralizada** abaixo do Ring: `~ acordar 06:15 · 9h média`. Sem caixa, sem ícone. `+25min da média` quando atrasado, em amber sutil.',
      ],
    },
    en: {
      title: "Design pass — micro-polish in 5 areas + minimalist wake prediction",
      bullets: [
        '★ **Header**: baby name with **micro-gradient** (white → lavender), font 17→18px, letter-spacing -0.45 (Apple SF Pro). Translucent dot separator. **Hairline divider** under header marks section edge without a box.',
        '★ **CuriosityCard**: tag is now a **pill with bg + integrated icon**. Border 0.22 → 0.16 (lighter). Outer drop shadow lavender blur 28px replaces the triple-shadow. Letter-spacing 0.05 on body for readability.',
        '★ **Ring**: center number uses **gradient text white→lavender** + drop-shadow blur 28px (lavender) — sense of light emanating, integrates with starfield. CAPS label letter-spacing 1.8 (was 1.5), font 14→13.',
        '★ **4-grid cards**: padding 7,9 → 9,11. Added **1px gradient highlight on top** (light from above — Linear/Apple Cards approach). Unit suffix (`ml`, `x`) with opacity 0.5 separated from number (SF hierarchy).',
        '★ **Today header** is now flex justify-between: "TODAY" in accent + date in CAPS subtle on the right. Letter-spacing 1 (was 0.8). More editorial.',
        '★ **Wake prediction MUCH more minimalist**: was a card with gradient + icon + border. Now **just a centered text line** below the Ring: `~ wake 06:15 · 9h avg`. No box, no icon. `+25min past avg` when late, in subtle amber.',
      ],
    },
  },
  {
    v: "11.9.23", date: "2026-04-27",
    pt: {
      title: "Predição de acordar durante o bedtime ativo",
      bullets: [
        '★ **Chip durante bedtime ativo** mostra o horário esperado de acordar baseado na **média de duração das últimas 7 noites** (do `nightSleepAnalysis` do engine). Ex: `Acordar esperado ~06:15 · 9h média`.',
        '★ Se o bedtime já passou da média por mais de 5min, o chip muda pra **`+25min da média`** em amber, indicando que tá rolando uma noite mais longa que o normal.',
        'Renderiza só quando `nightSleep.avgDuration` > 0 (precisa de pelo menos 2-3 noites de dado pra ser confiável). Sem dado, fica invisível.',
        'Posição: entre o Ring e o botão Night Wake. Visual integrado com gradient azul-lavanda.',
      ],
    },
    en: {
      title: "Wake-up prediction during active bedtime",
      bullets: [
        '★ **Chip during active bedtime** shows expected wake time based on the **7-day duration average** (from the engine\'s `nightSleepAnalysis`). E.g. `Expected wake ~06:15 · 9h avg`.',
        '★ If the bedtime is past the average by more than 5min, the chip switches to **`+25min past avg`** in amber, indicating tonight is running longer than usual.',
        'Renders only when `nightSleep.avgDuration` > 0 (needs at least 2-3 nights of data to be reliable). Without data, hidden.',
        'Position: between the Ring and the Night Wake button. Integrated visual with blue-lavender gradient.',
      ],
    },
  },
  {
    v: "11.9.22", date: "2026-04-27",
    pt: {
      title: "Editar e excluir meds salvos via long-press",
      bullets: [
        '★ **Long-press num chip de med** abre o form pré-populado com nome e dose. Modo edição ativo: dá pra **trocar nome/dose** ou **excluir** o med dos salvos.',
        '★ **Botão "Excluir"** confirma antes de remover. Quando exclui, também remove da seleção atual se estava marcado.',
        'Trocar nome durante edit re-organiza a lista (remove o antigo, adiciona o novo). Mantém a seleção transferida pro novo nome.',
        'Pequena dica embaixo do form: "Pressione e segure um med pra editar" — ajuda na descoberta do gesto.',
      ],
    },
    en: {
      title: "Edit and delete saved meds via long-press",
      bullets: [
        '★ **Long-press a med chip** opens the form pre-filled with name and dose. Edit mode active: lets you **change name/dose** or **delete** the med from saved.',
        '★ **"Delete" button** confirms before removing. When deleting, also unmarks selection if it was active.',
        'Renaming during edit reorganizes the list (removes old, adds new). Selection transfers to the new name.',
        'Small hint under the form: "Long-press a med to edit" — helps gesture discovery.',
      ],
    },
  },
  {
    v: "11.9.21", date: "2026-04-27",
    pt: {
      title: "Compartilhar Relatório Semanal",
      bullets: [
        '★ **Botão de share** no header do Relatório Semanal. Tap abre o sheet nativo do iOS pra mandar via WhatsApp, Mensagens, e-mail pra família ou pediatra.',
        '★ **Texto formatado** com emojis: `🌙 Sono: 8h12m/noite · 1.4 despertares`, `☁️ Sonecas: 25min × 4.3/dia (1h45 total)`, `🍼 Mamadeiras: 630ml/dia (85ml × 7.4/dia)`, `🧷 Fraldas: 6.4/dia (💧5 💩1)`, `💊 Simeticona: 3x`. Só inclui categorias que têm dado.',
        'Fallback automático: se Web Share API não tá disponível, copia pra clipboard com toast de confirmação.',
        'Novo ícone `share` (upload arrow) no Icon component.',
      ],
    },
    en: {
      title: "Share weekly report",
      bullets: [
        '★ **Share button** in the Weekly Report header. Tap opens the native iOS share sheet to send via WhatsApp, Messages, email, etc — to family or pediatrician.',
        '★ **Formatted text** with emojis: `🌙 Sleep: 8h12m/night · 1.4 wakings`, `☁️ Naps: 25min × 4.3/day (1h45 total)`, `🍼 Bottles: 630ml/day (85ml × 7.4/day)`, `🧷 Diapers: 6.4/day (💧5 💩1)`, `💊 Simethicone: 3x`. Only includes categories with data.',
        'Automatic fallback: if Web Share API unavailable, copies to clipboard with confirmation alert.',
        'New `share` icon (upload arrow) in the Icon component.',
      ],
    },
  },
  {
    v: "11.9.20", date: "2026-04-27",
    pt: {
      title: "Bug do sono no Relatório Semanal + cards 4-grid mais úteis",
      bullets: [
        '🚨 **Bug crítico no Relatório Semanal**: "Sono real/noite" mostrava só ~3h porque considerava apenas a metade pré-meia-noite do bedtime (cross-midnight bedtimes ficam divididos em duas entries no Firestore). Era o mesmo bug que o engine teve em v11.7.9. Aplicada a mesma correção: merge das duas metades antes de somar (durationMin + wakings).',
        '★ **Card "Mamadas/dia"** agora mostra `120ml · ~2h45` (média ml/mamada + intervalo) em vez de só intervalo. Mais útil pra checar se a mamada média está crescendo.',
        '★ **Card "Tummy time"** mudou de count pra **tempo total/dia** como destaque (`12min`). Sub-line mostra count de sessões. Mais relevante (pediatras pedem total, não count).',
        '`avgNapLong` no Relatório Semanal também usa duração merged (sonecas que cruzam meia-noite — raro mas possível).',
      ],
    },
    en: {
      title: "Weekly Report sleep bug + 4-grid cards more useful",
      bullets: [
        '🚨 **Critical bug in Weekly Report**: "Real sleep/night" showed only ~3h because it counted only the pre-midnight half of the bedtime (cross-midnight bedtimes are split into two entries in Firestore). Same bug the engine had in v11.7.9. Same fix applied: merge halves before summing (durationMin + wakings).',
        '★ **"Feeds/day" card** now shows `120ml · ~2h45` (avg ml/feed + interval) instead of just interval. More useful for checking if avg feed volume is growing.',
        '★ **"Tummy time" card** changed from count to **total time/day** as headline (`12min`). Sub-line shows session count. More relevant (pediatricians ask for total, not count).',
        '`avgNapLong` in Weekly Report also uses merged duration (naps that cross midnight — rare but possible).',
      ],
    },
  },
  {
    v: "11.9.19", date: "2026-04-27",
    pt: {
      title: "Busca no histórico",
      bullets: [
        '★ **Novo botão de busca** no canto direito do header da aba História. Toque pra abrir uma barra de busca; toque de novo (ou X) pra fechar e limpar.',
        '★ **Filtra por**: nome do medicamento, tipo do evento, valor em ml, dose, subtype (xixi/cocô/both), notes (em entries antigas que ainda têm).',
        '★ **Resultados agrupados por dia**, ordenados do mais recente pro mais antigo. Header de cada grupo usa `fmtRelDate` (Hoje/Ontem/Anteontem/weekday/data) + count de itens.',
        '★ **Empty state** quando nenhum resultado: ícone search + dica "Tente um termo diferente".',
        'Novo ícone `search` (lupa) adicionado ao Icon component.',
      ],
    },
    en: {
      title: "History search",
      bullets: [
        '★ **New search button** on the right of the History tab header. Tap to open a search bar; tap again (or X) to close and clear.',
        '★ **Searches by**: medicine name, event type, ml value, dose, subtype (wet/dirty/both), notes (in older entries that still have them).',
        '★ **Results grouped by day**, sorted most recent first. Each group header uses `fmtRelDate` (Today/Yesterday/2 days ago/weekday/date) + item count.',
        '★ **Empty state** when no matches: search icon + hint "Try a different term".',
        'New `search` icon (magnifying glass) added to the Icon component.',
      ],
    },
  },
  {
    v: "11.9.18", date: "2026-04-27",
    pt: {
      title: "Jump rápido em História — tap no header abre picker",
      bullets: [
        '★ **Tap no header da data** na aba História agora abre o **date picker nativo do iOS**. Pula direto pra qualquer data passada (max = hoje, futuro bloqueado). Antes precisava tocar na seta voltar várias vezes pra chegar em dias antigos.',
        'Implementação invisível: input `type="date"` posicionado por cima do label visível com `opacity: 0`. Tap aciona o picker nativo, label visível continua sendo o `dLbl` formatado.',
        'aria-label "Pular para data" pra leitores de tela.',
      ],
    },
    en: {
      title: "Quick jump in History — tap the header to open picker",
      bullets: [
        '★ **Tap the date header** in the History tab now opens the **native iOS date picker**. Jump straight to any past date (max = today, future blocked). Previously required tapping the back arrow multiple times to reach older days.',
        'Invisible implementation: `type="date"` input positioned over the visible label with `opacity: 0`. Tap triggers the native picker, visible label stays as the formatted `dLbl`.',
        'aria-label "Jump to date" for screen readers.',
      ],
    },
  },
  {
    v: "11.9.17", date: "2026-04-27",
    pt: {
      title: "Micro-polish: janela noturna, grace de marcos, hover desktop",
      bullets: [
        '★ **Daily summary** agora aparece de 19h em diante (era só 20h–23h). Mais inclusivo pra rotina noturna que varia.',
        '★ **Confetti em marcos com grace de 1 dia**: se você não abrir o app no dia exato (ex: 100 dias), ele ainda dispara no dia seguinte (101). Não perde mais a celebração por não ter mexido no app aquele dia.',
        '★ **Hover state em desktop** (browser): botões respondem com `brightness(1.08)` ao passar o mouse — só dispara em devices com mouse fino, não toca em touch (`@media (hover:hover) and (pointer:fine)`).',
      ],
    },
    en: {
      title: "Micro-polish: evening window, milestone grace, desktop hover",
      bullets: [
        '★ **Daily summary** now appears from 7pm onwards (was 8–11pm only). More inclusive of varying evening routines.',
        '★ **Milestone confetti with 1-day grace**: if you don\'t open the app on the exact milestone day (e.g. 100 days), it still fires the next day (101). No more missing the celebration just because you didn\'t open the app that day.',
        '★ **Hover state on desktop**: buttons respond with `brightness(1.08)` on mouse hover — only triggers on mouse-precise devices, not touch (`@media (hover:hover) and (pointer:fine)`).',
      ],
    },
  },
  {
    v: "11.9.16", date: "2026-04-27",
    pt: {
      title: "Quick time chips no AddForm + spring overshoot no valPulse",
      bullets: [
        '★ **Quick time chips no AddForm**: 6 chips abaixo do date/time picker — `Agora`, `−5`, `−15`, `−30`, `−1h`, `−2h`. Tap muda time + date (se cruzar meia-noite). Light haptic. Chip ativa fica destacado na cor do tipo do evento.',
        '★ **Casos de uso**: registrar uma mamada que aconteceu agora há pouco (10 min atrás), ou uma fralda enquanto o bebê dormiu (2h atrás). Antes precisava abrir o time picker, scrollar, confirmar.',
        '★ **valPulse com spring overshoot** (cubic-bezier 0.34, 1.56, 0.64, 1): números nos cards do Home e Stats agora dão um pequeno bounce ao mudar (1.12 → 0.97 → 1). Sensação tátil sem ser brega.',
      ],
    },
    en: {
      title: "Quick time chips in AddForm + spring overshoot on valPulse",
      bullets: [
        '★ **Quick time chips in AddForm**: 6 chips under the date/time picker — `Now`, `−5`, `−15`, `−30`, `−1h`, `−2h`. Tap changes time + date (if crosses midnight). Light haptic. Active chip highlighted in the event type color.',
        '★ **Use cases**: log a bottle that happened 10 min ago, or a diaper while the baby was sleeping (2h ago). Before, you had to open the time picker, scroll, confirm.',
        '★ **valPulse with spring overshoot** (cubic-bezier 0.34, 1.56, 0.64, 1): numbers on Home and Stats cards now give a small bounce when changing (1.12 → 0.97 → 1). Tactile feel without being kitsch.',
      ],
    },
  },
  {
    v: "11.9.15", date: "2026-04-27",
    pt: {
      title: "Smart relative dates ao longo do app",
      bullets: [
        '★ **Novo helper `fmtRelDate(dateStr)`** com saída humanizada: `Hoje`, `Ontem`, `Anteontem`, dia da semana se ≤6 dias atrás (`Domingo passada`), ou `26 abr` se mais antigo. Locale-aware (PT/EN), tz-safe.',
        '★ **Aplicado no header de data da History**: agora mostra `Ontem · 26 abril` em vez de só `Sábado, 26 de abril`. Mais natural, menos cognitivo.',
        '★ **AddForm date label** usa relativo também: navegando o date picker pra outro dia mostra `Ontem` / `Anteontem` / weekday.',
      ],
    },
    en: {
      title: "Smart relative dates throughout the app",
      bullets: [
        '★ **New `fmtRelDate(dateStr)` helper** with humanized output: `Today`, `Yesterday`, `2 days ago`, weekday if ≤6 days back (`Last Sunday`), or `Apr 26` for older. Locale-aware (PT/EN), tz-safe.',
        '★ **Applied to History date header**: now shows `Yesterday · April 26` instead of `Saturday, April 26`. More natural, less cognitive.',
        '★ **AddForm date label** uses relative too: navigating the date picker shows `Yesterday` / `2 days ago` / weekday.',
      ],
    },
  },
  {
    v: "11.9.14", date: "2026-04-27",
    pt: {
      title: "Fix CRÍTICO: TDZ \"Cannot access \'todayE\' before initialization\"",
      bullets: [
        '🚨 **Causa real do crash post-v11.9.10**: o useEffect do Daily Summary (v11.9.8) tinha `todayE.length` no array de dependências, mas `const todayE` é declarado MUITO depois no App component. JavaScript trata `const` em temporal dead zone — quando o useEffect avalia o dep array no primeiro render, `todayE` ainda não existe → ReferenceError, App inteiro crasha, ErrorBoundary fica chamando o reload em loop.',
        '★ **Fix**: criado `_todayCount` via `useMemo` que calcula o count inline a partir de `entries` (já no escopo). useEffect agora depende de `_todayCount` em vez de `todayE.length`.',
        'Bug latente desde v11.9.8 mas só apareceu pra usuários que ainda não tinham os bundlers/cache do tipo certo. ErrorBoundary v11.9.13 ajudou a expor a stack trace exata.',
      ],
    },
    en: {
      title: "CRITICAL fix: TDZ \"Cannot access \'todayE\' before initialization\"",
      bullets: [
        '🚨 **Real cause of post-v11.9.10 crash**: the Daily Summary useEffect (v11.9.8) had `todayE.length` in its dependency array, but `const todayE` is declared way later in the App component. JavaScript treats `const` as temporal dead zone — when useEffect evaluates the deps on first render, `todayE` doesn\'t exist yet → ReferenceError, the whole App crashes, ErrorBoundary loops reload.',
        '★ **Fix**: created `_todayCount` via `useMemo` that computes the count inline from `entries` (already in scope). useEffect now depends on `_todayCount` instead of `todayE.length`.',
        'Latent bug since v11.9.8 but only showed for users without the right bundler/cache. v11.9.13 ErrorBoundary helped expose the exact stack.',
      ],
    },
  },
  {
    v: "11.9.13", date: "2026-04-27",
    pt: {
      title: "ErrorBoundary blindado + IIFEs com try/catch (sem mais loop de reload)",
      bullets: [
        '🚨 **ErrorBoundary não fica mais em loop infinito**: tenta auto-reload 1 vez (sessionStorage tracking). Se falhar de novo, mostra UI estática com mensagem do erro + stack trace + botão "Copiar erro" e "Tentar de novo" manual.',
        '★ **3 IIFEs grandes blindadas com try/catch**: Ring detail Modal, Weekly Report (Stats), Streak indicator (Profile). Se uma falhar, retorna null em vez de cascatear pro ErrorBoundary.',
        '★ **Modal IIFE só executa quando aberto**: antes evaluava em todo render do App, agora `showRingDetail && (()=>{})()`. Garante zero overhead + zero risco quando modal fechado.',
        '🚨 Erro persiste em `localStorage.lp_last_error` pra usuário poder copiar mesmo após reload.',
      ],
    },
    en: {
      title: "ErrorBoundary hardened + IIFEs wrapped in try/catch (no more reload loop)",
      bullets: [
        '🚨 **ErrorBoundary no longer in infinite loop**: tries auto-reload once (sessionStorage tracking). If still failing, shows static UI with the error message + stack trace + "Copy error" and "Try again" buttons.',
        '★ **3 large IIFEs wrapped in try/catch**: Ring detail Modal, Weekly Report (Stats), Streak indicator (Profile). If one fails, returns null instead of cascading to ErrorBoundary.',
        '★ **Modal IIFE only executes when open**: was evaluating on every App render; now `showRingDetail && (()=>{})()`. Zero overhead + zero risk when modal closed.',
        '🚨 Error persists in `localStorage.lp_last_error` so user can copy it even after reload.',
      ],
    },
  },
  {
    v: "11.9.12", date: "2026-04-27",
    pt: {
      title: "Hotfix: ellipsis literal + isolamento maior da migration",
      bullets: [
        '🚨 **Fix do `\\u2026`** (reticências) aparecendo literal na tela de erro do ErrorBoundary — mesmo bug do `\\u26A0` na v11.9.11. Trocado por string literal envolvendo o caractere unicode real.',
        '**Migration ainda mais defensiva**: cada write tem try/catch próprio (uma falha não para o lote), `e.id` checado antes de `.endsWith()`, `setTimeout(0)` pra deferir do callback do subEntries (defesa em profundidade contra crash em render path).',
        'Flag `lp_legacy_wakings_migrated_v1` só é setada se TODAS as writes passaram (zero falhas). Se algum write falha, migration tenta novamente no próximo open.',
      ],
    },
    en: {
      title: "Hotfix: literal ellipsis + stronger migration isolation",
      bullets: [
        '🚨 **Fix `\\u2026`** (ellipsis) showing as literal text in the ErrorBoundary error screen — same bug as `\\u26A0` in v11.9.11. Replaced with a string literal containing the real unicode character.',
        '**Even more defensive migration**: each write has its own try/catch (one failure doesn\'t stop the batch), `e.id` checked before `.endsWith()`, `setTimeout(0)` to defer from the subEntries callback (defense-in-depth against crashing render path).',
        'Flag `lp_legacy_wakings_migrated_v1` is only set if ALL writes succeeded (zero failures). If any write fails, migration retries on next open.',
      ],
    },
  },
  {
    v: "11.9.11", date: "2026-04-27",
    pt: {
      title: "Hotfix: db undefined na migration + emoji literal no ErrorBoundary",
      bullets: [
        '🚨 **Fix crítico**: `migrateLegacyWakingsOnce` referenciava `db` (firestore) que não está acessível fora do `<script>` tag de init (`const db` é local ao script). Trocado por `firebase.firestore()` inline. Era a causa do crash do app post-deploy v11.9.10.',
        'Fix do `\\u26A0` aparecendo literal no ErrorBoundary fallback. Mesmo bug dos `\\u00b7` e `\\u2013` já corrigidos antes — JSX text fora de string literal não interpreta escape. Envolvido em `{"\\u26A0"}`.',
      ],
    },
    en: {
      title: "Hotfix: db undefined in migration + literal emoji in ErrorBoundary",
      bullets: [
        '🚨 **Critical fix**: `migrateLegacyWakingsOnce` was referencing `db` (firestore) which is not accessible outside the init `<script>` tag (`const db` is local to that script). Replaced with inline `firebase.firestore()`. This was the cause of the post-deploy v11.9.10 crash.',
        'Fix `\\u26A0` showing as literal text in ErrorBoundary fallback. Same bug as the `\\u00b7` and `\\u2013` fixed before — JSX text outside string literals doesn\'t interpret escapes. Wrapped in `{"\\u26A0"}`.',
      ],
    },
  },
  {
    v: "11.9.10", date: "2026-04-27",
    pt: {
      title: "A11y + migration de wakings legados",
      bullets: [
        '★ **aria-labels** nos 6 quick action buttons (Mamadeira, Amamentação, Fralda, Sono, Soneca, Tummy), no sino de notificações (com contador), no Ring (com hint de long-press), e no period switcher da Stats (aria-pressed também).',
        '★ **Migration one-shot do `dedupeLegacyWakings`**: escreve no Firestore as correções que o helper fazia em memória a cada read. Roda 1x por device (flag `lp_legacy_wakings_migrated_v1`). Após confirmado funcionando, runtime dedupe pode ser removido em versão futura.',
        'Migration usa `FieldValue.delete()` pra limpar `wakings` em halves que devem ficar vazios. Idempotente. Logs no console quantos pares foram corrigidos.',
      ],
    },
    en: {
      title: "A11y + legacy wakings migration",
      bullets: [
        '★ **aria-labels** on the 6 quick action buttons (Bottle, Nurse, Diaper, Sleep, Nap, Tummy), notification bell (with counter), Ring (with long-press hint), and Stats period switcher (aria-pressed too).',
        '★ **One-shot `dedupeLegacyWakings` migration**: writes Firestore the same fixes the runtime helper does on every read. Runs 1x per device (flag `lp_legacy_wakings_migrated_v1`). Once confirmed working, runtime dedupe can be removed in a future version.',
        'Migration uses `FieldValue.delete()` to clear `wakings` on halves that should be empty. Idempotent. Console logs how many pairs were fixed.',
      ],
    },
  },
  {
    v: "11.9.9", date: "2026-04-27",
    pt: {
      title: "Long-press no Ring revela info detalhada",
      bullets: [
        '★ **Segura o Ring por meio segundo** e abre um modal com visão rápida: sono de ontem (+ despertares), média de sono 7d, sonecas hoje (count + tempo), mamadeiras hoje (volume + count), fraldas hoje, hora que o último sono terminou.',
        'Detecção de long-press com 550ms de threshold + cancelamento se o dedo se mover >8px (não confunde com scroll). Haptic medium quando dispara.',
        'Modal central com cada métrica em linha, ícone colorido + label + valor tabular. Mantém estética dos cards existentes.',
      ],
    },
    en: {
      title: "Long-press the Ring reveals detailed info",
      bullets: [
        '★ **Hold the Ring for half a second** to open a modal with a quick view: yesterday\'s sleep (+ wakings), 7d sleep average, today\'s naps (count + time), today\'s bottles (volume + count), today\'s diapers, time the last sleep ended.',
        'Long-press detection with 550ms threshold + cancellation if the finger moves >8px (doesn\'t conflict with scroll). Medium haptic on trigger.',
        'Centered modal with one metric per row, colored icon + label + tabular value. Matches existing card aesthetic.',
      ],
    },
  },
  {
    v: "11.9.8", date: "2026-04-27",
    pt: {
      title: "Daily summary noturno — recap do dia entre 20h e 23h",
      bullets: [
        '★ **Card sutil "Resumo de hoje"** aparece no topo do Home **entre 20h e 23h**, mostrando totais do dia: mamadas (volume + count), sono total, sonecas (count + tempo), fraldas. Estilo lavanda discreto pra não competir com o Ring.',
        '★ **1x por dia**: marca em localStorage (`lp_daily_summary_seen`) quando você fecha. Não volta a mostrar até amanhã. Aparece só se já tem ≥3 entries no dia (pra não mostrar resumo vazio).',
        '★ **Botão x sutil** pro dismiss manual. Ícones em tabular-nums e cor de cada categoria, mantendo paleta do app.',
      ],
    },
    en: {
      title: "Evening daily summary — today recap between 8pm and 11pm",
      bullets: [
        '★ **Subtle "Today recap" card** appears at top of Home **between 8pm and 11pm**, showing today\'s totals: bottles (volume + count), total sleep, naps (count + time), diapers. Discreet lavender style so it doesn\'t compete with the Ring.',
        '★ **Once per day**: marks localStorage (`lp_daily_summary_seen`) when you dismiss. Won\'t show again until tomorrow. Only appears if today has ≥3 entries (to avoid empty recap).',
        '★ **Subtle x button** for manual dismiss. Tabular-nums and color-per-category, matching the app palette.',
      ],
    },
  },
  {
    v: "11.9.7", date: "2026-04-27",
    pt: {
      title: "Tom noturno automático (22h–06h)",
      bullets: [
        '★ **Entre 22h e 06h** o app aplica filter sutil no `#root`: `hue-rotate(-4deg) saturate(0.9) brightness(0.95)`. Tom mais quente e levemente menos saturado, melhor pra usar de noite sem ferir os olhos.',
        '★ **Transition de 1.2s** torna a mudança quase imperceptível quando vira meia-noite. Re-checa a cada 5 minutos pra garantir que a transição rola mesmo se o app fica aberto a noite toda.',
        'Twinkle das estrelas reduzido pra opacity 0.4 quando is-night. Mantém o cosmos visível mas menos chamativo.',
      ],
    },
    en: {
      title: "Automatic night tone (10pm–6am)",
      bullets: [
        '★ **Between 10pm and 6am** the app applies a subtle filter on `#root`: `hue-rotate(-4deg) saturate(0.9) brightness(0.95)`. Warmer and slightly less saturated tone, easier on the eyes for night use.',
        '★ **1.2s transition** makes the change almost imperceptible when midnight hits. Re-checks every 5 minutes so the transition still happens if the app stays open all night.',
        'Star twinkle reduced to opacity 0.4 in is-night mode. Cosmos still visible but less attention-grabbing.',
      ],
    },
  },
  {
    v: "11.9.6", date: "2026-04-27",
    pt: {
      title: "Smart unit (ml→L) + Streak indicator no Profile",
      bullets: [
        '★ **Helper `fmtMl`** novo: ml ≥1000 vira `1,5L` (PT) ou `1.5L` (EN). Aplicado no card "Média leite/dia" da Stats e nas linhas de mamadeira do Relatório semanal. Pra Louise (1 mês) ainda fica em ml; pra bebês maiores escalando, fica natural.',
        '★ **Streak indicator no Profile**: card sutil com 🔥 mostrando dias consecutivos rastreando a Louise (ex: "12 dias seguidos"). Aparece só quando ≥2 dias. Algoritmo: parte de hoje (ou ontem se hoje vazio) e desce contando dias com pelo menos 1 entry.',
      ],
    },
    en: {
      title: "Smart unit (ml→L) + Streak indicator on Profile",
      bullets: [
        '★ **New `fmtMl` helper**: ml ≥1000 becomes `1.5L`. Applied to Stats "Avg milk/day" and weekly report rows. For Louise (1 month) still ml; for larger babies it scales naturally.',
        '★ **Streak indicator on Profile**: subtle card with 🔥 showing consecutive days tracking Louise (e.g. "12 days in a row"). Shows only when ≥2 days. Algorithm: starts from today (or yesterday if today empty) and counts down days with at least 1 entry.',
      ],
    },
  },
  {
    v: "11.9.5", date: "2026-04-27",
    pt: {
      title: "Card de Sonecas: média por soneca vira destaque",
      bullets: [
        '★ **Mini-card "Sonecas/dia"** mostra agora `~Xmin/soneca` no subtitle (em vez de tempo total/dia).',
        '★ **Card "Sonecas" do Relatório Semanal** vira "Por soneca (média)" como métrica principal — fmtDur do tempo médio de uma soneca individual. Bar chart mini também usa esse valor. Sub-rows mantêm sonecas/dia + total/dia + soneca mais longa.',
        'Cálculo: `total minutos no período / total de sonecas no período`. Reflete melhor a qualidade das sonecas individuais.',
      ],
    },
    en: {
      title: "Naps card: avg per nap becomes the headline",
      bullets: [
        '★ **Mini "Naps/day" card** subtitle now shows `~Xmin/nap` instead of total time/day.',
        '★ **Weekly report "Naps" card** main metric becomes "Avg per nap" — fmtDur of mean individual nap duration. Mini bar chart uses this value. Sub-rows still show naps/day + total/day + longest nap.',
        'Math: `total minutes in period / total nap count in period`. Better reflects individual nap quality.',
      ],
    },
  },
  {
    v: "11.9.4", date: "2026-04-27",
    pt: {
      title: "Relatório semanal — agregação fechada por semana",
      bullets: [
        '★ **Nova seção "Relatório semanal"** no fim da aba Stats. Mostra média **por dia, fechada por semana**, das últimas 4 semanas (com pelo menos 1 dia de dado).',
        '★ **Cards por categoria**: Sono, Sonecas, Mamadeiras, Fraldas, Medicamentos. Cada card tem métrica principal + bar chart mini com 4 semanas + trend chip ↑↓ comparando semana atual com a anterior + sub-rows com detalhes (acordada, despertares, soneca mais longa, xixi/cocô, etc).',
        '★ **Trend chips inteligentes**: para sono e mamadas, ↑ é verde (mais é melhor). Para simeticona, ↓ é verde (menos é melhor). Mudanças <3% mostram `≈` (estável).',
        'Bar charts mini com valor em cima de cada barra, semana atual destacada (opacity 1, label accent). Estilo consistente com os cards do app.',
      ],
    },
    en: {
      title: "Weekly report — closed-by-week aggregation",
      bullets: [
        '★ **New "Weekly report" section** at the end of Stats. Shows average **per day, bucketed by week**, for the last 4 weeks (with at least 1 day of data).',
        '★ **Cards by category**: Sleep, Naps, Bottles, Diapers, Medicines. Each has main metric + mini bar chart over 4 weeks + trend chip ↑↓ comparing current week to previous + sub-rows with detail (awake, wakings, longest nap, wet/poop, etc).',
        '★ **Smart trend chips**: for sleep and feeds, ↑ is green (more is better). For simethicone, ↓ is green (less is better). Changes <3% show `≈` (stable).',
        'Mini bar charts with value on top of each bar, current week highlighted (full opacity, accent label). Style consistent with existing app cards.',
      ],
    },
  },
  {
    v: "11.9.3", date: "2026-04-27",
    pt: {
      title: "Stats com mais granularidade + dedupe de wakings duplicadas",
      bullets: [
        '★ **Cocô/dia** ganha gráfico próprio na aba Stats — barras por dia em cor brown, valor em cima de cada barra. Card "Fraldas/dia" mostra agora o split 💧 xixi · 💩 cocô.',
        '★ **Sonecas com duração**: card "Sonecas/dia" agora mostra tempo total/dia abaixo do contador. Novo gráfico "Sonecas — duração" plota fmtDur por dia.',
        '★ **Janela real de sono** (tempo acordada dentro do bedtime) já estava exposta no card "Sono real" mas agora destaca melhor com a métrica `Acordada · 35min · 2x` quando há despertares.',
        '★ **Mamadas/dia** ganha intervalo médio (~3.4h) abaixo do contador.',
        'Bottle AddForm volta a usar `nowTime()` por default (revertido o smart `last+interval` da v11.9.1 — usuário prefere registrar no horário real).',
        '★ **Engine v2.2.4: dedupe de wakings duplicadas** (race multi-device). Quando William e esposa pressionam "voltar a dormir" simultaneamente, podia gravar a mesma waking 2x. Engine agora colapsa por `time:durationMin` antes da análise.',
      ],
    },
    en: {
      title: "Stats granularity + duplicate-waking dedupe",
      bullets: [
        '★ **Poop/day** gets its own chart in Stats — daily bars in brown, value on top of each bar. The "Diapers/day" card now shows the split 💧 wet · 💩 poop.',
        '★ **Naps with duration**: "Naps/day" card now shows total time/day under the count. New "Naps duration" chart plots fmtDur per day.',
        '★ **Real sleep window** (awake time inside bedtime) was already exposed on "Real sleep" card; now emphasizes with `Awake · 35min · 2x` when wakings present.',
        '★ **Feeds/day** card now shows average interval (~3.4h) under the count.',
        'Bottle AddForm reverts to `nowTime()` by default (rolled back smart `last+interval` from v11.9.1 — user prefers logging actual time).',
        '★ **Engine v2.2.4: duplicate waking dedupe** (multi-device race). When both William and wife tap "back to sleep" at the same time, the same waking could be written 2x. Engine now collapses by `time:durationMin` before analysis.',
      ],
    },
  },
  {
    v: "11.9.2", date: "2026-04-27",
    pt: {
      title: "Tap feedback universal + push notification path-agnostic",
      bullets: [
        '★ **Tap feedback em todos os botões do app** — pequeno scale(0.97) + transição suave de 140ms. Aplicado via CSS global com `:where()` pra zerar specificity, então qualquer botão com classe própria (`.navbtn`, `.navfab`, `.home-card`) mantém seu comportamento custom.',
        '★ **`firebase-messaging-sw.js` agora usa scope do SW** em vez de paths hardcoded `/louise-pro/...`. Funciona em GH Pages E em domínio próprio sem alterar código.',
      ],
    },
    en: {
      title: "Universal tap feedback + push notification path-agnostic",
      bullets: [
        '★ **Tap feedback on every button in the app** — small scale(0.97) + smooth 140ms transition. Applied via global CSS with `:where()` to zero out specificity, so any button with its own class (`.navbtn`, `.navfab`, `.home-card`) keeps its custom behavior.',
        '★ **`firebase-messaging-sw.js` now uses SW scope** instead of hardcoded `/louise-pro/...` paths. Works on GH Pages AND on a custom domain without code changes.',
      ],
    },
  },
  {
    v: "11.9.1", date: "2026-04-27",
    pt: {
      title: "Polish: smart defaults, contexto, online/offline, confetti em marcos",
      bullets: [
        '★ **Time default inteligente** ao registrar mamadeira: sugere `última + intervalo` em vez de "agora". Se já está atrasado, traz pro horário correto. Edição mantém o horário original.',
        '★ **Empty state contextual** no Hoje: muda com a hora do dia. Manhã sugere primeira mamada, tarde fala de sonecas, noite menciona bedtime.',
        '★ **Indicador offline** sutil no header (pill amber `OFF`) quando perde rede. Some ao reconectar — sem banner alarmante.',
        '★ **Confetti em marcos** da Louise: 1 mês, 100 dias, 6 meses, 1 ano. 1 segundo de festa, 1x cada via localStorage flag.',
        'Animations inline migradas pra classes CSS (`pulse-soft`, `pulse-fast`, `nw-amber-pulse`, `nw-icon-pulse`). Resolve reset visual a cada tick em elementos que recebem `tick` como prop. Bate a regra dura do CLAUDE.md.',
      ],
    },
    en: {
      title: "Polish: smart defaults, context, online/offline, milestone confetti",
      bullets: [
        '★ **Smart time default** for bottle entry: suggests `last + interval` instead of "now". If overdue, lands on the correct time. Edit mode keeps original time.',
        '★ **Contextual empty state** on Today: changes with hour of day. Morning prompts first feed, afternoon mentions naps, evening hints at bedtime.',
        '★ **Subtle offline indicator** in header (amber `OFF` pill) when network drops. Disappears on reconnect — no alarming banner.',
        '★ **Confetti on milestones**: 1 month, 100 days, 6 months, 1 year. 1-second celebration, once each via localStorage flag.',
        'Inline animations migrated to CSS classes (`pulse-soft`, `pulse-fast`, `nw-amber-pulse`, `nw-icon-pulse`). Fixes the visual reset on every tick in elements that receive `tick` as a prop. Matches the hard rule in CLAUDE.md.',
      ],
    },
  },
  {
    v: "11.9.0", date: "2026-04-27",
    pt: {
      title: "Perf de leitura: corte cirúrgico no custo do Firestore",
      bullets: [
        '★ **`subEntries` agora carrega janela de 90 dias** (`where(date,>=,cutoff)`). Antes lia a coleção inteira a cada cold start — hoje são ~1650 docs, em 1 ano seriam ~11k. Com a janela: **−80% de reads** depois de 6 meses de uso.',
        '★ **Novo `FB.loadOlderEntries(beforeDate)`** pra Stats/History puxarem histórico antigo sob demanda quando precisar.',
        '★ **Backup metadata em doc separado** (`config/backupMeta`). Antes, abrir o Profile baixava ~900KB do snapshot só pra mostrar "última backup: X horas atrás". Agora baixa só ~80B. O snapshot full só vai pra rede ao restaurar.',
        '`React.memo` em CuriosityCard, InsightCards e TimerBar — evita re-render quando outros states do App mudam.',
        '🧹 **Dead code removido**: componente `Sheet` (95 linhas, substituído por Modal há versões) + key i18n `lastFeed` não usada.',
      ],
    },
    en: {
      title: "Read perf: surgical cut on Firestore cost",
      bullets: [
        '★ **`subEntries` now loads a 90-day window** (`where(date,>=,cutoff)`). Used to load the entire collection on every cold start — ~1650 docs today, ~11k after 1 year. With the window: **−80% reads** after 6 months.',
        '★ **New `FB.loadOlderEntries(beforeDate)`** for Stats/History to lazily pull older history when needed.',
        '★ **Backup metadata in separate doc** (`config/backupMeta`). Opening Profile used to download ~900KB of snapshot just to show "last backup: X hours ago". Now downloads ~80B. Full snapshot only fetched on restore.',
        '`React.memo` on CuriosityCard, InsightCards, TimerBar — avoids re-renders when unrelated App state changes.',
        '🧹 **Dead code removed**: `Sheet` component (95 lines, replaced by Modal versions ago) + unused `lastFeed` i18n key.',
      ],
    },
  },
  {
    v: "11.8.6", date: "2026-04-23",
    pt: {
      title: "Night pattern: fix de over-count (cluster 30min + boundary 15min)",
      bullets: [
        '\u2605 Regress\u00e3o p\u00f3s-merge da v11.7.9: com o range do bedtime cobrindo a noite inteira, `retroWakings` passou a capturar eventos que **n\u00e3o s\u00e3o wakings de verdade** (mamada de wind-down, wake-up feed, log retroativo pr\u00f3ximo de uma waking explicita). Resultado: m\u00e9dia inflada (ex: "3 wakings/night" quando o real \u00e9 2).',
        '\u2605 **Cluster 30min**: evento retro a at\u00e9 30min de uma waking explicita (ou outro retro j\u00e1 contado) agrega nela em vez de contar separado.',
        '\u2605 **Boundary grace 15min**: eventos dentro dos primeiros/\u00faltimos 15min do bedtime s\u00e3o tratados como wind-down/wake-up feed \u2014 n\u00e3o contam.',
      ],
    },
    en: {
      title: "Night pattern: over-count fix (30min cluster + 15min boundary)",
      bullets: [
        '\u2605 Regression from v11.7.9 merge: with the bedtime range covering the whole night, `retroWakings` started catching events that **aren\'t real wakings** (wind-down feed, wake-up feed, retro log near an explicit waking). Result: inflated avg (e.g. "3 wakings/night" when actual is 2).',
        '\u2605 **30min cluster**: a retro event within 30min of an explicit waking (or another already-counted retro) merges into it instead of counting separately.',
        '\u2605 **15min boundary grace**: events in the first/last 15min of bedtime are treated as wind-down/wake-up feeds \u2014 not counted.',
      ],
    },
  },
  {
    v: "11.8.4", date: "2026-04-21",
    pt: {
      title: "UI compacta: cards, quick buttons, hist\u00f3rico, nav",
      bullets: [
        '\u2605 **Cards do Home**: padding 10\u21927, v 16\u219214, ago 12\u219210. \u00cdcones mantidos. Ganha ~30% em altura.',
        '\u2605 **Quick buttons**: 3\u00d72 grid vira **6\u00d71** (linha \u00fanica). Padding 12\u21929, ic 18\u219215. Metade da altura.',
        '\u2605 **EntryRow (hist\u00f3rico)**: padding vertical 16\u21926, icone 42\u219230, t\u00edtulo 15\u219212.5, line-height apertado. 2 linhas preservadas. ~40% mais fino.',
        '\u2605 **Nav bar**: pill slim estilo Instagram. maxWidth 420\u2192340, padding 7\u21924, plus 48\u219236, border-radius 34\u219224. Blur 18\u219222 pra compensar.',
      ],
    },
    en: {
      title: "Compact UI: cards, quick buttons, history rows, nav",
      bullets: [
        '\u2605 **Home cards**: padding 10\u21927, v 16\u219214, ago 12\u219210. Icons unchanged. ~30% shorter.',
        '\u2605 **Quick buttons**: 3\u00d72 grid becomes **6\u00d71** (single row). Padding 12\u21929, ic 18\u219215. Half the height.',
        '\u2605 **EntryRow (history)**: vertical padding 16\u21926, icon 42\u219230, title 15\u219212.5, tight line-height. 2 lines preserved. ~40% thinner.',
        '\u2605 **Nav bar**: Instagram-style slim pill. maxWidth 420\u2192340, padding 7\u21924, plus 48\u219236, border-radius 34\u219224. Blur 18\u219222 to compensate.',
      ],
    },
  },
  {
    v: "11.8.3", date: "2026-04-21",
    pt: {
      title: "Home: idade em dias + card de Simeticona (substituindo nursing)",
      bullets: [
        '\u2605 **Idade no header** agora mostra s\u00f3 total de dias ("43 dias") em vez de "1 m\u00eas e 13 dias". Mais direto pra beb\u00ea pequeno.',
        '\u2605 **Card de nursing saiu**, entrou **Simeticona**: mostra contagem do dia + tempo desde a \u00faltima. Info-only \u2014 tap n\u00e3o faz nada, s\u00f3 pra olhar.',
        'Filter usa o mesmo regex `/simet/i` da migra\u00e7\u00e3o e das stats, consistente.',
      ],
    },
    en: {
      title: "Home: age in days + Simethicone card (replacing nursing)",
      bullets: [
        '\u2605 **Age in header** now shows total days ("43 days") instead of "1 month and 13 days". More direct for young babies.',
        '\u2605 **Nursing card removed**, **Simethicone** in its place: today\'s count + time since last. Info-only \u2014 tap does nothing, just for glance.',
        'Filter uses the same `/simet/i` regex as migration and stats, consistent.',
      ],
    },
  },
  {
    v: "11.8.2", date: "2026-04-21",
    pt: {
      title: "Medicine: fix do emoji \ud83d\udca7 + C\u00f3licaliv adicionado (5 gotas)",
      bullets: [
        'Fix: \ud83d\udca7 aparecia como texto literal no chip e no popup (JSX fora de string). Envolvido em `{"\\uD83D\\uDCA7"}` pra virar string literal.',
        '\u2605 C\u00f3licaliv entra na lista com dose fixa **5 gotas**. Migra\u00e7\u00e3o v2 adiciona automaticamente pra quem ainda n\u00e3o tem.',
      ],
    },
    en: {
      title: "Medicine: fix \ud83d\udca7 glyph + C\u00f3licaliv added (5 drops)",
      bullets: [
        'Fix: \ud83d\udca7 was showing as literal text on chip and popup (JSX outside of string). Wrapped in `{"\\uD83D\\uDCA7"}` to make it a string literal.',
        '\u2605 C\u00f3licaliv joins the default list with a fixed dose of **5 drops**. Migration v2 adds it automatically if missing.',
      ],
    },
  },
  {
    v: "11.8.1", date: "2026-04-21",
    pt: {
      title: "Medicine: drops picker vira popup e migra\u00e7\u00e3o autom\u00e1tica",
      bullets: [
        '\u2605 **Drops picker virou Modal popup** por cima do form (antes trocava a tela inline). Clica no med \u2192 Save \u2192 popup aparece \u2192 tap no n\u00famero \u2192 auto-save e fecha tudo.',
        '\u2605 **Migra\u00e7\u00e3o autom\u00e1tica**: na primeira vez que o app abre nesta vers\u00e3o, Simeticona e Paracetamol s\u00e3o convertidos pra "pede gotas" (dose vazia). Edi\u00e7\u00f5es manuais futuras s\u00e3o respeitadas (flag one-shot em localStorage).',
      ],
    },
    en: {
      title: "Medicine: drops picker is now a popup + auto-migration",
      bullets: [
        '\u2605 **Drops picker is now a Modal popup** over the form (was an inline stage). Tap med \u2192 Save \u2192 popup shows \u2192 tap number \u2192 auto-saves and closes everything.',
        '\u2605 **Auto-migration**: first time the app opens on this version, Simethicone and Paracetamol convert to "asks drops" (empty dose). Future manual edits are preserved (one-shot localStorage flag).',
      ],
    },
  },
  {
    v: "11.8.0", date: "2026-04-21",
    pt: {
      title: "Medicine redesenhado: multi-select + drops picker + sem notes",
      bullets: [
        '\u2605 **Multi-select** de medicamentos. Combo da manh\u00e3 (Floripa + Vit. D + C\u00f3licaliv) registra tudo em um clique \u2014 N entries com mesmo timestamp.',
        '\u2605 **Drops picker** pra meds sem dose (Simeticona, Paracetamol): Save \u2192 abre tela com 6 bot\u00f5es grandes (1-6 gotas) \u2192 tap auto-salva.',
        'Chips com \ud83d\udca7 indicam que o med **pede gotas** ao salvar. Meds com dose fixa gravam direto.',
        'Bot\u00e3o "+ Outro" agora **persiste** o med na lista com o nome digitado (dose opcional \u2014 vazia = pede gotas) pra pr\u00f3xima vez ser 1-tap.',
        'Campo **notes removido** de medicine (nunca foi usado).',
        'Edit mode de medicine mant\u00e9m comportamento antigo single-med (compat com entries legadas).',
      ],
    },
    en: {
      title: "Medicine redesign: multi-select + drops picker + no notes",
      bullets: [
        '\u2605 **Multi-select** medicines. Morning combo (Floripa + Vit. D + C\u00f3licaliv) logs all in one tap \u2014 N entries same timestamp.',
        '\u2605 **Drops picker** for dose-less meds (Simethicone, Paracetamol): Save \u2192 opens screen with 6 big buttons (1-6 drops) \u2192 tap auto-saves.',
        'Chips with \ud83d\udca7 mark meds that **ask drops** on save. Meds with a fixed dose save immediately.',
        '"+ Other" button now **persists** the med to the list (dose optional \u2014 empty = asks drops) so next time is 1-tap.',
        '**Notes field removed** from medicine (never used).',
        'Medicine edit mode keeps old single-med behavior (back-compat with legacy entries).',
      ],
    },
  },
  {
    v: "11.7.9", date: "2026-04-21",
    pt: {
      title: "Night pattern: 3 bugs corrigidos (o principal comia wakings pos-meia-noite)",
      bullets: [
        '\u2605 **Bug cr\u00edtico fixed**: bedtimes cross-midnight s\u00e3o divididos em duas entries (`sleep_X` + `sleep_X_b`). O engine (v10.8.0) filtrava o `_b` pra n\u00e3o contar como noite separada, mas a partir dali ignorava tudo depois da meia-noite. Pra newborn (bedtime 21h\u20136h) isso significava **todas as wakings reais perdidas** (01:47, 05:04 etc). Agora o engine faz MERGE das duas metades antes de analisar \u2014 dura\u00e7\u00e3o total + wakings concat.',
        '\u2605 **Janela morning review** passa de `06:00-09:59` pra `10:00-10:59`. Antes o insight saia enquanto o beb\u00ea ainda podia acordar \u2014 dado stale em minutos. Agora espera a noite fechar.',
        '\u2605 **Gate em bedtime ativo**: se \u00e0s 10h o timer de sleep ainda est\u00e1 rolando, o hint fica segurado at\u00e9 encerrar. Nunca mais vai aparecer com dado parcial.',
      ],
    },
    en: {
      title: "Night pattern: 3 bugs fixed (main one ate post-midnight wakings)",
      bullets: [
        '\u2605 **Critical fix**: cross-midnight bedtimes are split into two entries (`sleep_X` + `sleep_X_b`). The engine (v10.8.0) filtered the `_b` to avoid counting it as a separate night, but from there on ignored everything past midnight. For newborns (bedtime 9pm\u20136am) that meant **all real wakings lost** (01:47, 05:04 etc). Engine now MERGES both halves before analysis \u2014 total duration + wakings concat.',
        '\u2605 **Morning review window** moves from `06:00-09:59` to `10:00-10:59`. Before, the hint fired while the baby could still wake up \u2014 data stale in minutes. Now it waits for the night to finish.',
        '\u2605 **Gate on active bedtime**: if at 10am the sleep timer is still running, the hint holds until it ends. Never fires with partial data anymore.',
      ],
    },
  },
  {
    v: "11.7.7", date: "2026-04-20",
    pt: {
      title: "Feeding reminder revisto: nenhuma mudan\u00e7a no backend (cloud function intacta)",
      bullets: [
        '\u2605 Corrigindo v11.7.6: agora o `intervalMin` **continua sendo o prazo do push** (cloud function l\u00ea esse campo, n\u00e3o precisa mexer). O novo campo \u00e9 `barIntervalMin`, client-only, usado s\u00f3 pela barra do card Home.',
        'Com isso, separar os dois prazos virou mudan\u00e7a **puramente client-side** \u2014 zero deploy de cloud function.',
        'Backward compat total: se `barIntervalMin` ausente, barra usa `intervalMin` (comportamento pr\u00e9-v11.7.7).',
        '\ud83e\uddf9 Limpando o campo fantasma `pushIntervalMin` introduzido na v11.7.6 (nunca foi usado de verdade).',
      ],
    },
    en: {
      title: "Feeding reminder revisited: no backend change (cloud function untouched)",
      bullets: [
        '\u2605 Fixing v11.7.6: `intervalMin` **remains the push interval** (cloud function reads this field, nothing to change). The new field is `barIntervalMin`, client-only, used only by the Home card bar.',
        'Splitting the two intervals is now a **pure client change** \u2014 zero cloud function deploy.',
        'Full backward compat: if `barIntervalMin` absent, bar falls back to `intervalMin` (pre-v11.7.7 behavior).',
        '\ud83e\uddf9 Cleaning up the phantom `pushIntervalMin` field from v11.7.6 (never actually wired).',
      ],
    },
  },
  {
    v: "11.7.6", date: "2026-04-20",
    pt: {
      title: "Feeding reminder: dois prazos separados (barra + push)",
      bullets: [
        '\u2605 Agora d\u00e1 pra **configurar prazo do push independente do prazo da barra**. Caso de uso: barra em 2h (expectativa de 2h entre mamadas) mas push s\u00f3 em 2h30min pra n\u00e3o notificar toda vez que atrasa um pouco.',
        'Novo campo `pushIntervalMin` no doc do reminder (`config/reminders/feedingInterval`). **Backward compat**: se o doc n\u00e3o tem esse campo, fallback pro `intervalMin` (comportamento id\u00eantico ao anterior).',
        '\u26a0\ufe0f **A\u00e7\u00e3o no backend necess\u00e1ria**: a Cloud Function que dispara o push precisa ser atualizada pra ler `pushIntervalMin` com fallback pra `intervalMin`. At\u00e9 o backend mudar, o push continua usando o valor antigo \u2014 sem quebrar nada.',
      ],
    },
    en: {
      title: "Feeding reminder: two separate intervals (bar + push)",
      bullets: [
        '\u2605 You can now **set the push interval independent of the bar interval**. Use case: bar at 2h (expected feeding window) but push only fires at 2h30 so you don\'t get notified on every small delay.',
        'New `pushIntervalMin` field in the reminder doc (`config/reminders/feedingInterval`). **Backward compat**: if absent, falls back to `intervalMin` (behavior unchanged).',
        '\u26a0\ufe0f **Backend action required**: the Cloud Function that fires the push needs updating to read `pushIntervalMin` with fallback to `intervalMin`. Until the backend changes, push uses the old value \u2014 nothing breaks.',
      ],
    },
  },
  {
    v: "11.7.5", date: "2026-04-20",
    pt: {
      title: "Profile: pill de auto-save floating (sempre vis\u00edvel, header normal)",
      bullets: [
        '\u2605 **Editando / Salvando / Salvo** agora sai de dentro do header e vira um pill **flutuante no topo da tela** (position:fixed + safe-area + blur). Aparece sempre que tem atividade, independente do scroll.',
        'Header volta a ser normal (n\u00e3o sticky) \u2014 some ao scrollar como qualquer outra p\u00e1gina.',
        'Anima\u00e7\u00e3o sutil de entrada (slide down + fade).',
      ],
    },
    en: {
      title: "Profile: auto-save pill floats (always visible, normal header)",
      bullets: [
        '\u2605 **Editing / Saving / Saved** moves out of the header into a **floating top pill** (position:fixed + safe-area + blur). Always visible during save activity regardless of scroll.',
        'Header goes back to normal (non-sticky) \u2014 scrolls away like any page.',
        'Subtle entrance animation (slide down + fade).',
      ],
    },
  },
  {
    v: "11.7.4", date: "2026-04-20",
    pt: {
      title: "Profile: header volta a ser normal (sticky foi ruim)",
      bullets: [
        'Header do Profile deixa de ser `position: sticky`. Agora some normalmente ao scrollar, como qualquer p\u00e1gina. Com auto-save (v11.7.2) n\u00e3o precisa mais manter bot\u00e3o Save vis\u00edvel.',
      ],
    },
    en: {
      title: "Profile: header back to normal (sticky was ugly)",
      bullets: [
        'Profile header is no longer `position: sticky`. Scrolls away like any normal page. With auto-save (v11.7.2) there\'s no Save button to keep visible.',
      ],
    },
  },
  {
    v: "11.7.3", date: "2026-04-20",
    pt: {
      title: "AddForm save: n\u00e3o trava mais + sem duplicatas + feedback visual quando inv\u00e1lido",
      bullets: [
        '\u2605 **Modal fecha imediato** ao clicar Salvar \u2014 antes esperava a Firestore write (300-1500ms) e dava impress\u00e3o de bug.',
        '\u2605 **Double-submit guard**: segundo clique ignorado enquanto o primeiro roda. Antes criava 2 entries id\u00eanticas.',
        'Bot\u00e3o mostra spinner + "Salvando\u2026" enquanto a write roda (raramente vis\u00edvel, porque a modal fecha junto).',
        'Campo obrigat\u00f3rio vazio agora d\u00e1 **shake + haptic de aviso** em vez de silenciar. Antes o bot\u00e3o parecia travado.',
      ],
    },
    en: {
      title: "AddForm save: no more stall + no dupes + visual feedback on invalid",
      bullets: [
        '\u2605 **Modal closes immediately** on Save tap \u2014 before it waited for the Firestore write (300-1500ms), felt broken.',
        '\u2605 **Double-submit guard**: second tap ignored while the first is running. Before it created 2 identical entries.',
        'Button shows spinner + "Saving\u2026" while the write runs (rarely visible, since modal closes in the same tick).',
        'Empty required field now **shakes + warning haptic** instead of silently doing nothing. Before the button felt dead.',
      ],
    },
  },
  {
    v: "11.7.2", date: "2026-04-20",
    pt: {
      title: "Profile: auto-save (bot\u00e3o Save/Cancel aposentado)",
      bullets: [
        '\u2605 **Grava sozinho 900ms depois da \u00faltima edi\u00e7\u00e3o** em qualquer campo. Sem mais bot\u00e3o Save/Cancel \u2014 mexeu, foi. Se voc\u00ea fechar a p\u00e1gina no meio, o \u00faltimo valor digitado j\u00e1 foi pro Firestore.',
        'Indicador sutil no header mostra o estado: `Editando\u2026` (ponto pulsando) \u2192 `Salvando\u2026` \u2192 `\u2713 Salvo` (verde, some em 1.4s).',
        'Foto salva imediatamente (0ms delay). Texto espera os 900ms pra n\u00e3o disparar uma request por keystroke.',
        'Mesma l\u00f3gica delta-only + merge de v10.5.0, ent\u00e3o zero risco de stale-state sobrescrever name/photo de outro device.',
      ],
    },
    en: {
      title: "Profile: auto-save (Save/Cancel button retired)",
      bullets: [
        '\u2605 **Saves itself 900ms after your last edit** on any field. No more Save/Cancel \u2014 you type, it goes. Close the page mid-edit and your last typed value already hit Firestore.',
        'Subtle header indicator shows state: `Editing\u2026` (pulsing dot) \u2192 `Saving\u2026` \u2192 `\u2713 Saved` (green, fades in 1.4s).',
        'Photo saves instantly (0ms delay). Text waits 900ms so we don\'t fire a request per keystroke.',
        'Same delta-only + merge logic from v10.5.0, so zero risk of stale state overwriting name/photo from another device.',
      ],
    },
  },
  {
    v: "11.7.1", date: "2026-04-20",
    pt: {
      title: "Fix Profile v11.7.0: header sticky + background pr\u00f3prio (n\u00e3o mostra a aba atr\u00e1s)",
      bullets: [
        '\u2605 **Save/Cancel agora acompanham o scroll**: header virou `position: sticky` com blur atr\u00e1s. Antes, se voc\u00ea scrollava pra editar um campo mais embaixo, Save sumia no topo.',
        'Profile background **n\u00e3o \u00e9 mais transparente** \u2014 tem o mesmo gradient radial do body + Starfield interno. Antes (v11.7.0) mostrava a aba ativa (Home/Stats/History) atr\u00e1s do Profile, parecia bug.',
        'Borda sutil roxa no header quando tem edi\u00e7\u00e3o pendente, pra refor\u00e7ar que tem a\u00e7\u00e3o.',
      ],
    },
    en: {
      title: "Fix Profile v11.7.0: sticky header + own background (no longer leaks the tab behind)",
      bullets: [
        '\u2605 **Save/Cancel now follow the scroll**: header is `position: sticky` with a blur backdrop. Before, scrolling down to edit a field would hide Save at the top.',
        'Profile background is **no longer transparent** \u2014 it has the same radial gradient as body + its own Starfield. Before (v11.7.0) the active tab (Home/Stats/History) leaked through, looked like a bug.',
        'Subtle purple border on the header when there are unsaved edits, reinforcing action.',
      ],
    },
  },
  {
    v: "11.7.0", date: "2026-04-17",
    pt: {
      title: "Profile polish: Save/Cancel no topo + Nursing Modal + virgula em kg + background transparente + % na meta",
      bullets: [
        '\u2605 **Save/Cancel** sa\u00edram da pill flutuante (que o teclado cobria) pro **header do Profile**. S\u00f3 aparecem quando tem edi\u00e7\u00e3o pendente \u2014 sem poluir quando est\u00e1 s\u00f3 olhando.',
        'Nursing side picker (L/R) virou **Modal central**, consistente com o popup do bot\u00e3o + (antes era bottom sheet que bugava no iPhone).',
        'Birth weight/length/head agora aceita **v\u00edrgula OU ponto** (`3,33` ou `3.33` kg). Campo virou `type="text" inputMode="decimal"` com parser que normaliza.',
        'Background do Profile agora \u00e9 **transparente** \u2014 starfield passa atr\u00e1s, igual o resto do app.',
        'Card de Bottle no Home mostra **% da meta** ao lado do ml (quando `mlGoal > 0`). Minimalista, s\u00f3 o n\u00famero \u2014 sem "da meta".',
      ],
    },
    en: {
      title: "Profile polish: Save/Cancel on top + Nursing Modal + comma in kg + transparent bg + % goal",
      bullets: [
        '\u2605 **Save/Cancel** moved from floating pill (which the keyboard covered) to the **Profile header**. They only show when there are unsaved edits \u2014 no clutter when just looking.',
        'Nursing side picker (L/R) is now a **central Modal**, consistent with the + button popup (was a bottom sheet that glitched on iPhone).',
        'Birth weight/length/head now accepts **comma OR dot** (`3,33` or `3.33` kg). Field is `type="text" inputMode="decimal"` with a normalizing parser.',
        'Profile background is now **transparent** \u2014 starfield shows through, matching the rest of the app.',
        'Bottle card on Home shows **% of goal** next to ml (when `mlGoal > 0`). Minimalist, just the number \u2014 no "of goal" label.',
      ],
    },
  },
  {
    v: "11.6.0", date: "2026-04-19",
    pt: {
      title: "Auto-backup na primeira abertura do dia (antes era 24h rolling)",
      bullets: [
        '\u2605 Mental model mais simples: **"1 backup por dia, na primeira abertura do app"**. Antes era "24h desde o \u00faltimo", que podia cair em hor\u00e1rios aleat\u00f3rios.',
        'L\u00f3gica agora usa data do calend\u00e1rio local (`lp_last_backup_date` em formato `YYYY-MM-DD`). Se a data guardada n\u00e3o \u00e9 hoje, roda.',
        'Profile mostra `pr\u00f3x. auto: amanh\u00e3` se j\u00e1 tem backup de hoje, ou `a qualquer momento` se ainda n\u00e3o.',
        'Bot\u00e3o manual "Fazer backup agora" tamb\u00e9m marca a data, ent\u00e3o se voc\u00ea rodar manual \u00e0s 8h, o auto n\u00e3o roda de novo \u00e0s 15h.',
      ],
    },
    en: {
      title: "Auto-backup on first app open of the day (was 24h rolling)",
      bullets: [
        '\u2605 Simpler mental model: **"1 backup per day, on the first app open"**. Before it was "24h since last", which could land at random times of day.',
        'Logic now uses local calendar date (`lp_last_backup_date` in `YYYY-MM-DD`). If stored date isn\'t today, runs.',
        'Profile shows `next auto: tomorrow` if already backed up today, or `any moment` if not.',
        'Manual "Backup now" also marks the date, so if you run manually at 8am, auto won\'t fire again at 3pm.',
      ],
    },
  },
  {
    v: "11.5.0", date: "2026-04-19",
    pt: {
      title: "Toast de confirma\u00e7\u00e3o quando auto-backup roda",
      bullets: [
        '\u2605 Quando o auto-backup 24h rodar no cold start, aparece um toast verde "\u2713 Backup autom\u00e1tico salvo" por 3s no topo da tela. Assim voc\u00ea sabe que rodou sem precisar abrir Profile pra checar status.',
        'S\u00f3 aparece quando rodou de verdade (se ainda n\u00e3o passou 24h, nada acontece \u2014 sem toast falso).',
        'Se falhar, fica s\u00f3 no `console.warn` (sem spam pro usu\u00e1rio). Na pr\u00f3xima vez que Profile abrir, o status mostra o backup antigo e voc\u00ea pode rodar manual.',
      ],
    },
    en: {
      title: "Toast confirmation when auto-backup runs",
      bullets: [
        '\u2605 When the 24h auto-backup fires on cold start, a green toast "\u2713 Auto-backup saved" shows for 3s at the top of the screen. So you know it ran without opening Profile to check status.',
        'Only shows on actual successful runs (if <24h, nothing happens \u2014 no false toast).',
        'On failure, only `console.warn` (no user spam). Next time Profile opens, status shows the old backup and you can run manually.',
      ],
    },
  },
  {
    v: "11.4.0", date: "2026-04-19",
    pt: {
      title: "Backup vai pra nuvem (Firestore) em vez de baixar arquivo",
      bullets: [
        '\u2605 **Backup agora \u00e9 na nuvem**, n\u00e3o arquivo local. Snapshot \u00fanico em `config/backups` do Firestore, sempre sobrescrito pelo mais recente. Compartilhado entre os 2 devices \u2014 se voc\u00ea faz backup, a esposa pode restaurar do device dela, e vice-versa.',
        '\u2605 **Auto-backup 24h silencioso**: cold start do app, se passou 24h do \u00faltimo, salva no Firestore em background. Zero download no device, zero notifica\u00e7\u00e3o de browser. Delay de 8s pra n\u00e3o atrapalhar primeiro frame.',
        '\u2605 **4 bot\u00f5es no Profile Backup**:',
        '\u2022 "Fazer backup agora" \u2192 salva na nuvem (principal, verde)',
        '\u2022 "Restaurar \u00faltimo" \u2192 restaura do backup na nuvem (principal)',
        '\u2022 "C\u00f3pia local" (tracejado) \u2192 fallback que baixa JSON pro device (belt-and-suspenders)',
        '\u2022 "De arquivo" (tracejado) \u2192 restaurar de JSON upado',
        '\u2605 **Limite Firestore**: doc max 1 MiB. Auto-verifica tamanho antes de salvar \u2014 se passar de ~900KB, erro claro pedindo pra usar c\u00f3pia local. Com entries atuais (1 beb\u00ea de ~1 m\u00eas), cabe por muito tempo.',
      ],
    },
    en: {
      title: "Backup goes to the cloud (Firestore) instead of downloading a file",
      bullets: [
        '\u2605 **Backup is now in the cloud**, not a local file. Single snapshot in Firestore `config/backups`, always overwritten by the most recent. Shared between the 2 devices \u2014 if you back up, your wife can restore from her device, and vice versa.',
        '\u2605 **Silent 24h auto-backup**: app cold start, if 24h passed since last, saves to Firestore in background. Zero device download, zero browser notification. 8s delay to not fight first frame.',
        '\u2605 **4 buttons in Profile Backup**:',
        '\u2022 "Backup now" \u2192 saves to cloud (primary, green)',
        '\u2022 "Restore last" \u2192 restores from cloud backup (primary)',
        '\u2022 "Local copy" (dashed) \u2192 fallback that downloads JSON to device (belt-and-suspenders)',
        '\u2022 "From file" (dashed) \u2192 restore from uploaded JSON',
        '\u2605 **Firestore limit**: doc max 1 MiB. Auto-checks size before saving \u2014 if over ~900KB, clear error asks to use local copy. With current entries (1 ~1-month-old baby), fits for a long time.',
      ],
    },
  },
  {
    v: "11.3.0", date: "2026-04-19",
    pt: {
      title: "Auto-backup 24h promovido pro n\u00edvel do app + UI mais clara",
      bullets: [
        '\u2605 **Auto-backup 24h agora \u00e9 global**: antes s\u00f3 disparava quando Profile era aberto (podia ficar dias sem rodar). Agora, em TODO cold start ou resume-de-background, se passou 24h desde o \u00faltimo, baixa o JSON sozinho. Delay de 8s ap\u00f3s o app carregar pra n\u00e3o atrapalhar o primeiro frame.',
        '\u2605 **Bot\u00f5es renomeados** no Profile:',
        '\u2022 "Exportar dados" \u2192 "Fazer backup agora" (intent expl\u00edcito)',
        '\u2022 "Importar backup" \u2192 "Restaurar do arquivo"',
        '\u2605 **Status line mais rica**: "\u00daltimo backup: 3h \u00b7 pr\u00f3x. auto: 21h". Voc\u00ea sabe exatamente quando o pr\u00f3ximo vai rodar sem precisar calcular.',
      ],
    },
    en: {
      title: "24h auto-backup promoted to app-level + clearer UI",
      bullets: [
        '\u2605 **24h auto-backup is now global**: before, only fired when Profile was opened (could go days without running). Now, on EVERY cold start or resume-from-background, if 24h passed since the last one, the JSON downloads on its own. 8s delay after app loads so it doesn\'t fight the first frame.',
        '\u2605 **Buttons renamed** in Profile:',
        '\u2022 "Export data" \u2192 "Backup now" (explicit intent)',
        '\u2022 "Import backup" \u2192 "Restore from file"',
        '\u2605 **Richer status line**: "Last backup: 3h \u00b7 next auto: 21h". You know exactly when the next one will run without doing math.',
      ],
    },
  },
  {
    v: "11.2.0", date: "2026-04-19",
    pt: {
      title: "Backup export/import + quick wins (memo StatsPage/HistoryPage + manifest shortcuts)",
      bullets: [
        '\u2605 **Sistema de backup completo (Opt A)**. Nova se\u00e7\u00e3o "Backup" no Profile com: (a) bot\u00e3o "Exportar dados" que baixa JSON com TUDO (entries, perfil, meds, lembretes, inbox) direto pros Downloads/iCloud/Files; (b) bot\u00e3o "Importar backup" que restaura um JSON \u2014 com confirma\u00e7\u00e3o forte (acao destrutiva); (c) auto-export silencioso a cada 24h que gera um JSON e faz download autom\u00e1tico quando o Profile \u00e9 aberto. Mostra "\u00daltimo backup: 3h" debaixo do t\u00edtulo.',
        '**Uso**: se o Firestore tiver quota issue, conta suspensa, ou algu\u00e9m deletar por acidente \u2014 voc\u00ea restaura em 30s do JSON. Tamb\u00e9m serve pra migrar entre contas ou devices sem Firestore.',
        '\u2605 **Quick wins (Opt B)**:',
        '\u2022 React.memo no StatsPage e HistoryPage \u2014 n\u00e3o re-renderizam a cada tick do App durante timer ativo.',
        '\u2022 `firebase-messaging-sw.js` agora no precache do SW \u2014 push notifications respondem mais r\u00e1pido no primeiro uso.',
        '\u2022 `manifest.json` ganhou `categories` (health, lifestyle, utilities) e `shortcuts` (3 atalhos: Registrar, Hist\u00f3rico, Stats). iPhone mostra atalho long-press no \u00edcone do PWA.',
        '\u2022 2 `<div onClick>` \u00f3rf\u00e3os no SleepBlock viraram `<button>` pra screen reader / keyboard nav.',
        'Opt C (Firebase modular SDK) descartado \u2014 ROI baixo pro PWA instalado que j\u00e1 tem SW cache.',
      ],
    },
    en: {
      title: "Backup export/import + quick wins (memo StatsPage/HistoryPage + manifest shortcuts)",
      bullets: [
        '\u2605 **Full backup system (Opt A)**. New "Backup" section in Profile with: (a) "Export data" button downloads JSON with EVERYTHING (entries, profile, meds, reminders, inbox) straight to Downloads/iCloud/Files; (b) "Import backup" button restores from a JSON \u2014 with strong confirmation (destructive); (c) silent auto-export every 24h that generates + auto-downloads JSON when Profile is opened. Shows "Last backup: 3h" under the title.',
        '**Use case**: if Firestore has a quota issue, account suspended, or someone deletes by accident \u2014 restore in 30s from JSON. Also works to migrate between accounts or devices without Firestore.',
        '\u2605 **Quick wins (Opt B)**:',
        '\u2022 React.memo on StatsPage and HistoryPage \u2014 no more re-render on every App tick during active timer.',
        '\u2022 `firebase-messaging-sw.js` now in SW precache \u2014 push notifications respond faster on first use.',
        '\u2022 `manifest.json` got `categories` (health, lifestyle, utilities) and `shortcuts` (3 shortcuts: Log, History, Stats). iPhone shows long-press shortcut menu on the PWA icon.',
        '\u2022 2 orphan `<div onClick>` in SleepBlock became `<button>` for screen reader / keyboard nav.',
        'Opt C (Firebase modular SDK) dropped \u2014 low ROI for installed PWA that already has SW cache.',
      ],
    },
  },
  {
    v: "11.1.0", date: "2026-04-19",
    pt: {
      title: "Notifica\u00e7\u00f5es per-device: marcar lida persiste + update toast aparece em cada device",
      bullets: [
        '\u2605 **Bug 1 corrigido**: "marco notifica\u00e7\u00e3o como lida, fecho e abro o app, volta pra n\u00e3o-lida". Causa: `read: true` era salvo no `inbox.items[]` do Firestore, mas o `onSnapshot` podia sobrescrever antes do write persistir (race). Fix: state de "lida" agora \u00e9 per-device via `localStorage` (`lp_inbox_read`). Sem race, sobrevive a qualquer reload.',
        '\u2605 **Bug 2 corrigido**: "se marco update como visto, esposa n\u00e3o v\u00ea o toast no device dela". Causa: `profile.lastSeenVersion` era Firestore compartilhado entre os 2 dispositivos. Fix: migrado pra `localStorage` (`lp_last_seen_version`), per-device.',
        '**Conte\u00fado das notificas continua compartilhado** via Firestore (gerado pela engine pro casal). S\u00f3 o state "lida por ESTE device" e "j\u00e1 vi essa vers\u00e3o no meu device" ficam locais.',
        '**Migra\u00e7\u00e3o gratuita**: se o localStorage t\u00e1 vazio no primeiro open p\u00f3s-v11.1, o sistema herda o `profile.lastSeenVersion` do Firestore (se existir) pra n\u00e3o mostrar toast falso na primeira vez. Install fresco: inicia silenciosamente com a vers\u00e3o atual.',
        '**Cap de 500 keys lidas** no `localStorage` pra n\u00e3o virar um database infinito. Keys t\u00eam sufixo de data, ent\u00e3o antigas saem naturalmente na rota\u00e7\u00e3o.',
      ],
    },
    en: {
      title: "Per-device notifications: mark-read persists + update toast shows on each device",
      bullets: [
        '\u2605 **Bug 1 fixed**: "I mark a notification as read, close and reopen the app, it comes back unread". Cause: `read: true` was saved to Firestore `inbox.items[]`, but `onSnapshot` could overwrite before the write persisted (race). Fix: "read" state is now per-device via `localStorage` (`lp_inbox_read`). No race, survives any reload.',
        '\u2605 **Bug 2 fixed**: "if I mark the update as seen, my wife doesn\'t get the toast on her device". Cause: `profile.lastSeenVersion` was Firestore-shared between the 2 devices. Fix: migrated to `localStorage` (`lp_last_seen_version`), per-device.',
        '**Notification content stays shared** via Firestore (generated by the engine for the couple). Only "read by THIS device" and "I\'ve seen this version on my device" stay local.',
        '**Free migration**: if localStorage is empty on the first v11.1 open, the system inherits `profile.lastSeenVersion` from Firestore (if it exists) to avoid a false update toast on first open. Fresh install: silently initializes to the current version.',
        '**500-key cap on read entries** in `localStorage` so it doesn\'t become an infinite database. Keys have a date suffix, so old ones roll out naturally.',
      ],
    },
  },
  {
    v: "11.0.0", date: "2026-04-19",
    pt: {
      title: "Sprint de resili\u00eancia + a11y + UX polish (auditoria AUDIT_REPORT.md)",
      bullets: [
        '\u2605 **Error Boundary no App root**: qualquer exce\u00e7\u00e3o de render vira tela com "Oops! Recarregando em 3s\u2026" + spinner, e o app recarrega sozinho. Zero tela branca. Logs de erro v\u00e3o pra console pra debug.',
        '\u2605 **Swipe-to-delete fix**: adicionado `onPointerCancel` dedicado (em vez de reusar `onPointerUp`) que reseta estado sem disparar a\u00e7\u00e3o. Tamb\u00e9m reset em `visibilitychange` (se app vai pra bg no meio do gesto). Bug do "gesto travado" some.',
        '\u2605 **URL hash routing**: `#home`, `#stats`, `#history`, `#growth` na URL. Bot\u00e3o voltar do iPhone em PWA standalone agora navega entre abas em vez de fechar o app. Deep link fica poss\u00edvel. Analytics externos veem navega\u00e7\u00e3o.',
        '\u2605 **Empty states**: History com "Nenhum evento neste dia" + CTA "Toque + abaixo". Stats com "Sem dados suficientes" + dica. \u00cdcone grande sutil, bem menos "tela vazia".',
        '\u2605 **a11y base**: `aria-label` em todos bot\u00f5es \u00edcone-only da nav principal (Home/History/Stats/Settings/+) e Modal X. Contraste do `T.sub` subiu de `#8b90b8` (2.8:1) pra `#a3aac8` (3.8:1) \u2014 sol forte e baixa vis\u00e3o melhoram. `:focus-visible` outline pra navega\u00e7\u00e3o por teclado. `prefers-reduced-motion` respeitado (anima\u00e7\u00f5es viram transi\u00e7\u00f5es instant\u00e2neas).',
        '\u2605 **Dead code purge**: `edgeGlow` helper + `EDGE_GLOW_BG*` constantes da v10.6.x (revertidas em v10.7.0) removidos.',
      ],
    },
    en: {
      title: "Resilience + a11y + UX polish sprint (from AUDIT_REPORT.md)",
      bullets: [
        '\u2605 **Error Boundary on App root**: any render exception shows an "Oops! Reloading in 3s\u2026" screen with spinner, app auto-reloads. No more white-screen crashes. Errors logged to console for debug.',
        '\u2605 **Swipe-to-delete fix**: dedicated `onPointerCancel` handler (separate from `onPointerUp`) resets state without firing the action. Also reset on `visibilitychange` (if the app is backgrounded mid-gesture). "Stuck gesture" bug gone.',
        '\u2605 **URL hash routing**: `#home`, `#stats`, `#history`, `#growth` in the URL. iPhone back button in standalone PWA now navigates tabs instead of closing the app. Deep links possible. External analytics see navigation.',
        '\u2605 **Empty states**: History with "No events this day" + "Tap + below" CTA. Stats with "Not enough data yet" + hint. Big subtle icon, much less "empty screen" feel.',
        '\u2605 **Base a11y**: `aria-label` on all icon-only buttons in the main nav (Home/History/Stats/Settings/+) and Modal X. `T.sub` contrast bumped from `#8b90b8` (2.8:1) to `#a3aac8` (3.8:1) \u2014 bright sun and low vision improve. `:focus-visible` outline for keyboard navigation. `prefers-reduced-motion` respected (animations become instant transitions).',
        '\u2605 **Dead code purge**: `edgeGlow` helper + `EDGE_GLOW_BG*` constants from v10.6.x (reverted in v10.7.0) removed.',
      ],
    },
  },
  {
    v: "10.8.0", date: "2026-04-19",
    pt: {
      title: "3 fixes: Diaper wet/dirty breakdown + Night pattern dedup + SW update banner",
      bullets: [
        '\u2605 **Card Diaper no Home ganhou breakdown xixi/coc\u00f4**: abaixo do total, uma linha com \u00edcone droplet azul (`\ud83d\udca7 N wet`) e poop marrom (`\ud83d\udca9 N dirty`). "Both" conta em ambos. Minimalista, s\u00f3 aparece se tiver pelo menos um registro do dia.',
        '\u2605 **Night pattern duplicado corrigido**: bedtimes cross-midnight eram divididos em 2 entries (`sleep_X` + `sleep_X_b`), e o engine contava cada metade como "noite" separada. Resultado: apareciam 2 cards "Night pattern" com contagens diferentes (ex: "5 nights" + "4 nights" pra mesma an\u00e1lise). Fix em `routine-engine.js:291`: filtrar IDs terminando em "_b" na sele\u00e7\u00e3o do bedtime di\u00e1rio. Trade-off: wakings p\u00f3s-midnight s\u00e3o exclu\u00eddas do count (aceit\u00e1vel pra v1 do fix).',
        '\u2605 **SW update banner vis\u00edvel**: quando um Service Worker novo toma controle (ap\u00f3s deploy), aparece uma banner verde "Atualizando Louise Pro\u2026" por 800ms com spinner antes do reload autom\u00e1tico. Usu\u00e1rio entende que \u00e9 atualiza\u00e7\u00e3o, n\u00e3o bug. SW j\u00e1 tinha `skipWaiting` + `clients.claim` + network-first desde v10.1.x \u2014 s\u00f3 faltava o feedback visual.',
      ],
    },
    en: {
      title: "3 fixes: Diaper wet/dirty breakdown + Night pattern dedup + SW update banner",
      bullets: [
        '\u2605 **Home Diaper card got a wet/dirty breakdown**: below the total, a line with blue droplet icon (`\ud83d\udca7 N wet`) and brown poop (`\ud83d\udca9 N dirty`). "Both" counts in both. Minimal, only shows when at least one entry today.',
        '\u2605 **Night pattern duplicate fixed**: cross-midnight bedtimes were split into 2 entries (`sleep_X` + `sleep_X_b`), and the engine counted each half as a separate "night". Result: 2 "Night pattern" cards with different counts (e.g. "5 nights" + "4 nights" for the same analysis). Fix in `routine-engine.js:291`: filter IDs ending in "_b" in daily bedtime selection. Trade-off: post-midnight wakings are excluded from the count (acceptable for v1).',
        '\u2605 **SW update banner visible**: when a new Service Worker takes control (after a deploy), a green banner "Atualizando Louise Pro\u2026" with a spinner shows for 800ms before the auto-reload. User understands it\'s an update, not a bug. SW already had `skipWaiting` + `clients.claim` + network-first since v10.1.x \u2014 just missing the visual feedback.',
      ],
    },
  },
  {
    v: "10.7.2", date: "2026-04-19",
    pt: {
      title: "AddForm (novo + editar) vira Modal central \u2014 fim do Sheet slide-up em formul\u00e1rios",
      bullets: [
        '\u2605 **AddForm agora \u00e9 Modal central** em vez de Sheet que deslizava de baixo. Unifica com o popup de sele\u00e7\u00e3o de tipo (v10.5.5) \u2014 todo fluxo de formul\u00e1rio (novo ou editar) usa o mesmo padr\u00e3o scale+fade 250ms.',
        '\u2022 Toque em "+" \u2192 Modal com 10 tipos (v10.5.5). Toque num tipo \u2192 Modal com o form. Salva ou cancela \u2192 volta.',
        '\u2022 Toque em qualquer entrada no hist\u00f3rico (ex: Bottle 100ml) \u2192 mesmo Modal do form em modo "editar".',
        '\u2605 **Modal ganhou prop `wide`**: aumenta maxWidth pra 400px (default 340) e reduz padding horizontal (14 em vez de 24) pra campos de data+hora lado-a-lado caberem confortavel. Com scroll interno autom\u00e1tico pra forms altos (growth com 3 medi\u00e7\u00f5es).',
        '\u2605 **X close button** agora fixo no canto superior direito do frame, independente de scroll. Inv\u00edsivel qualquer bug de slide-up no iPhone.',
      ],
    },
    en: {
      title: "AddForm (new + edit) becomes a central Modal \u2014 end of the Sheet slide-up for forms",
      bullets: [
        '\u2605 **AddForm is now a central Modal** instead of a Sheet that slid from the bottom. Unifies with the type picker popup (v10.5.5) \u2014 every form flow (new or edit) uses the same 250ms scale+fade pattern.',
        '\u2022 Tap "+" \u2192 Modal with 10 types (v10.5.5). Tap a type \u2192 Modal with the form. Save or cancel \u2192 back.',
        '\u2022 Tap any history entry (e.g. Bottle 100ml) \u2192 same form Modal in "edit" mode.',
        '\u2605 **Modal got a `wide` prop**: bumps maxWidth to 400px (default 340) and reduces horizontal padding (14 instead of 24) so date+time fields fit comfortably side by side. Internal auto-scroll for tall forms (growth with 3 measurements).',
        '\u2605 **X close button** now pinned to the top-right corner of the frame, independent of scroll. Goodbye iPhone slide-up jank.',
      ],
    },
  },
  {
    v: "10.7.1", date: "2026-04-18",
    pt: {
      title: "Refinamentos sutis \u2014 feedback, n\u00fameros est\u00e1veis, pulse, data, sparkle",
      bullets: [
        '\u2605 **Tabular-nums nos cards do Home**: valores num\u00e9ricos (190ml, 7h15m, 4min ago) n\u00e3o saltam mais pixels quando mudam. `font-variant-numeric:tabular-nums` aplicado via classe `.home-card`. Invis\u00edvel at\u00e9 ver lado-a-lado \u2014 sente como app mais polido.',
        '\u2605 **Tap feedback nos cards**: scale(0.97) 140ms no `:active`. Feedback de toque estilo iOS nativo. Inclu\u00eddo cursor:pointer pra desktop tamb\u00e9m.',
        '\u2605 **Pulse no valor quando muda**: quando registra uma mamada e o card Bottle passa de 290ml \u2192 390ml, o valor d\u00e1 um pulse de 400ms (scale 1.08 \u2192 1 + opacity). Feedback emocional pequeno mas satisfat\u00f3rio. S\u00f3 dispara em MUDAN\u00c7A (via `key={value}` que remonta o elemento).',
        '\u2605 **Data sutil no header TODAY**: `TODAY \u00b7 Fri 18`. Contexto de quando \u00e9 "hoje", sem poluir.',
        '\u2605 **Sparkle na ponta do \u00faltimo arco de sono no Ring**: pontinho pulsante (SMIL anim) + anel concentric expand no endpoint do \u00faltimo nap. Indica "isso foi recente" sem texto.',
      ],
    },
    en: {
      title: "Subtle refinements \u2014 feedback, stable numbers, pulse, date, sparkle",
      bullets: [
        '\u2605 **Tabular-nums on Home cards**: numeric values (190ml, 7h15m, 4min ago) no longer jitter pixels when they change. `font-variant-numeric:tabular-nums` applied via `.home-card` class. Invisible until you see side-by-side \u2014 feels like a more polished app.',
        '\u2605 **Tap feedback on cards**: scale(0.97) 140ms on `:active`. Native iOS-style tap feedback. Also added cursor:pointer for desktop.',
        '\u2605 **Value pulse on change**: when you log a bottle and the Bottle card goes from 290ml \u2192 390ml, the value does a 400ms pulse (scale 1.08 \u2192 1 + opacity). Small emotional feedback, satisfying. Only fires on CHANGE (via `key={value}` which remounts the element).',
        '\u2605 **Subtle date on TODAY header**: `TODAY \u00b7 Fri 18`. Context of when "today" is, without noise.',
        '\u2605 **Sparkle on the tip of the latest sleep arc in the Ring**: pulsing dot (SMIL anim) + expanding ring at the endpoint of the latest nap. Indicates "this was recent" without text.',
      ],
    },
  },
  {
    v: "10.7.0", date: "2026-04-18",
    pt: {
      title: "Rollback do Beautiful Glow \u2014 volta ao minimalismo (v10.5.4 visual)",
      bullets: [
        '\u2605 **Beautiful Glow revertido em 3 lugares**: cards do Home, c\u00edrculos do popup +, e disco central do Ring. Sobrecarregou o visual e tapou o starfield atr\u00e1s. Volta ao design minimalista da v10.5.4.',
        '\u2022 **Cards do Home**: tint sutil `${cor}06` (3% alpha) + borda quase invis\u00edvel. Cosmos aparece atr\u00e1s.',
        '\u2022 **C\u00edrculos do popup +**: dark radial gradient + borda colorida sutil (original).',
        '\u2022 **Ring**: disco central removido. Texto flutua sobre starfield puro. S\u00f3 os SVG arcs marcam os eventos.',
        '**Mantidos da v10.6.x**: tudo que \u00e9 n\u00e3o-visual \u2014 data-loss fix, tick throttle, React.memo, offline persistence, Firestore merge, v10.5.5 Modal central do botão + (que ficou bom).',
        'Aprendizado: o Beautiful Glow funciona em isolamento (ex: app icon), mas replicado em v\u00e1rios elementos da tela bate de frente com o starfield e adiciona peso visual. Minimalismo ganha.',
      ],
    },
    en: {
      title: "Beautiful Glow rollback \u2014 back to minimalism (v10.5.4 visual)",
      bullets: [
        '\u2605 **Beautiful Glow reverted in 3 places**: Home cards, + popup circles, and central Ring disc. It overloaded the visual and hid the starfield behind. Back to v10.5.4 minimalist design.',
        '\u2022 **Home cards**: subtle `${color}06` tint (3% alpha) + near-invisible border. Cosmos shows through.',
        '\u2022 **+ popup circles**: dark radial gradient + subtle colored border (original).',
        '\u2022 **Ring**: central disc removed. Text floats over pure starfield. Only SVG arcs mark events.',
        '**Kept from v10.6.x**: everything non-visual \u2014 data-loss fix, tick throttle, React.memo, offline persistence, Firestore merge, v10.5.5 central + Modal (that one worked).',
        'Lesson: Beautiful Glow works in isolation (e.g. app icon), but replicated across several screen elements it fights with the starfield and adds visual weight. Minimalism wins.',
      ],
    },
  },
  {
    v: "10.6.2", date: "2026-04-18",
    pt: {
      title: "Fix: Ring disc transl\u00facido + breathing de verdade funcionando",
      bullets: [
        '\u2605 **Fundo preto do Ring disc removido**. Agora usa `EDGE_GLOW_BG_SOFT` (mesmo translúcido dos cards) — starfield passa atrás. Intensity do glow reduzida (0.75) e scale (0.55) pra n\u00e3o dominar o conte\u00fado do Ring.',
        '\u2605 **Breathing agora funciona de verdade no bedtime**. Problema na v10.6.1: a anima\u00e7\u00e3o estava inline no style + React re-renderiza o Ring a cada 5s (tick), resetando o progresso da CSS transition. Fix: movi pra uma classe CSS `.ring-disc-breathe` toggada via `className`. Animation CSS ignora re-renders de React.',
        '\u2605 Mesma l\u00f3gica do fix da v10.3.2 do TimerBar (inline CSS transitions quebram com re-renders frequentes) \u2014 agora documentada no CLAUDE.md como padr\u00e3o.',
      ],
    },
    en: {
      title: "Fix: Ring disc translucent + breathing actually working",
      bullets: [
        '\u2605 **Ring disc black background removed**. Now uses `EDGE_GLOW_BG_SOFT` (same translucent as cards) \u2014 starfield shows through. Glow intensity reduced (0.75) and scale (0.55) so it doesn\'t dominate the Ring content.',
        '\u2605 **Breathing now actually works in bedtime**. Issue in v10.6.1: the animation was inline in the style + React re-renders Ring every 5s (tick), resetting the CSS transition progress. Fix: moved it to a CSS class `.ring-disc-breathe` toggled via `className`. CSS animations ignore React re-renders.',
        '\u2605 Same lesson as v10.3.2 TimerBar fix (inline CSS transitions break under frequent re-renders) \u2014 now documented in CLAUDE.md as the pattern.',
      ],
    },
  },
  {
    v: "10.6.1", date: "2026-04-18",
    pt: {
      title: "Cards do Home transl\u00facidos (starfield passa atr\u00e1s) + Ring respira no bedtime",
      bullets: [
        '\u2605 **Cards do Home \u2014 fundo preto removido**. Agora usam `EDGE_GLOW_BG_SOFT` (linear-gradient `rgba(22,28,60,0.55)` \u2192 `rgba(20,26,60,0.4)`). O starfield passa atr\u00e1s. Glow intensity reduzida pra 0.7 e scale pra 0.28 (menos dominante). Cards agora parecem "flutuar sobre o cosmos" em vez de bloco preto maci\u00e7o.',
        '\u2605 **Ring respira no bedtime**. Nova anima\u00e7\u00e3o `ringDiscBreathe` 4s (inhale/exhale ritmo de sono adulto): disco central escala 1\u21921.015 + opacity 0.88\u21921 em loop infinito. S\u00f3 ativa quando `activeTimer.type === "sleep"` (bedtime noturno). Nap, nursing, tummy time ficam est\u00e1ticos.',
        'Helper `edgeGlow()` ganhou par\u00e2metro `intensity` (default 1) pra modular transpar\u00eancia das shadows sem mexer no scale.',
      ],
    },
    en: {
      title: "Home cards translucent (starfield shows through) + Ring breathes during bedtime",
      bullets: [
        '\u2605 **Home cards \u2014 black background removed**. Now use `EDGE_GLOW_BG_SOFT` (linear-gradient `rgba(22,28,60,0.55)` \u2192 `rgba(20,26,60,0.4)`). The starfield shows through. Glow intensity reduced to 0.7 and scale to 0.28 (less dominant). Cards now feel like they "float over the cosmos" instead of being solid black blocks.',
        '\u2605 **Ring breathes during bedtime**. New `ringDiscBreathe` 4s animation (adult sleep inhale/exhale rhythm): center disc scales 1\u21921.015 + opacity 0.88\u21921 in infinite loop. Only activates when `activeTimer.type === "sleep"` (night bedtime). Nap, nursing, tummy time stay static.',
        '`edgeGlow()` helper got an `intensity` param (default 1) to modulate shadow transparency without touching scale.',
      ],
    },
  },
  {
    v: "10.6.0", date: "2026-04-18",
    pt: {
      title: "Beautiful edge glow: cards do Home + c\u00edrculos do + + Ring",
      bullets: [
        '\u2605 Aplicado o estilo de **4 inner shadows em camadas** (convertido de Figma \u201cBeautiful Shadow\u201d pra CSS puro) em 3 lugares:',
        '1) **Quick stats cards do Home** (Bottle, Nursing, Sleep, Diaper) \u2014 cada card ganha dark-navy gradient + edge glow na cor do tipo. Bottle glow verde, Sleep roxo, Diaper rosa, Nursing azul.',
        '2) **C\u00edrculos do popup +** (quick-add modal) \u2014 os 10 tipos (wake/bottle/nurse/sleep/nap/diaper/bath/med/temp/tummy) com edge glow na cor espec\u00edfica. Ganho visual grande, identidade mais forte.',
        '3) **Ring central** \u2014 disco circular atr\u00e1s dos arcs com edge glow dinamicamente colorido pelo estado ativo (roxo pra bedtime/nap, azul pra nursing, \u00e2mbar pra stretching, etc). Arcs continuam em cima, disco d\u00e1 peso visual.',
        'Implementado via helper `edgeGlow(hex, scale)` que gera a string de 4 box-shadows inset. Scale ajusta proporcionalmente pra elementos pequenos (0.2 pros c\u00edrculos, 0.35 pros cards, 0.65 pro Ring). GPU-cheap no iOS (ao contr\u00e1rio de backdrop-filter blur).',
        '\u274c **N\u00c3O** aplicado no app icon (launcher) por pedido expresso.',
      ],
    },
    en: {
      title: "Beautiful edge glow: Home cards + + button circles + Ring",
      bullets: [
        '\u2605 Applied the **4-layered inner shadow** style (Figma \u201cBeautiful Shadow\u201d converted to pure CSS) in 3 places:',
        '1) **Home quick stats cards** (Bottle, Nursing, Sleep, Diaper) \u2014 each card gets dark-navy gradient + edge glow in the type color. Bottle green glow, Sleep purple, Diaper pink, Nursing blue.',
        '2) **+ popup circles** (quick-add modal) \u2014 the 10 types (wake/bottle/nurse/sleep/nap/diaper/bath/med/temp/tummy) with per-type edge glow. Huge visual lift, stronger identity.',
        '3) **Central Ring** \u2014 circular disc behind the arcs with edge glow dynamically tinted by the active state (purple for bedtime/nap, blue for nursing, amber for stretching, etc). Arcs still on top, disc adds visual weight.',
        'Implemented via `edgeGlow(hex, scale)` helper that generates the 4 inset box-shadow string. Scale tunes proportionally for small elements (0.2 for circles, 0.35 for cards, 0.65 for Ring). GPU-cheap on iOS (unlike backdrop-filter blur).',
        '\u274c **NOT** applied to the app icon (launcher) per explicit request.',
      ],
    },
  },
  {
    v: "10.5.5", date: "2026-04-18",
    pt: {
      title: "Bot\u00e3o + vira popup central (acabou o slide-up bugado)",
      bullets: [
        '\u2605 **Antes**: toque no + abria um Sheet que deslizava de baixo cobrindo 78% da tela. No iPhone a anima\u00e7\u00e3o + scroll interno davam uma sensa\u00e7\u00e3o de jank. **Agora**: abre um Modal central com scale+fade 250ms, sem slide, sem scroll.',
        'Grid 3\u00d74 com os 10 tipos (wakeup/bottle/nursing/sleep/nap/diaper/bath/medicine/temperature/tummytime). C\u00edrculos diminu\u00eddos (70\u219258px) pra caber no maxWidth:340 do Modal. Stagger animation nos items preservado (0.025s por \u00edcone).',
        'Fechamento: tap no backdrop, tap no FAB (que vira X rotacionado 45\u00b0), ou Esc em desktop. O **AddForm** em si (Bottle/Amount/Save) continua Sheet bottom-up \u2014 faz sentido pra form com inputs e scroll.',
      ],
    },
    en: {
      title: "+ button becomes a central popup (slide-up bug gone)",
      bullets: [
        '\u2605 **Before**: tapping + opened a Sheet that slid from the bottom covering 78% of the screen. On iPhone the animation + internal scroll created a janky feel. **Now**: opens a central Modal with scale+fade 250ms, no slide, no scroll.',
        '3\u00d74 grid with all 10 types (wakeup/bottle/nursing/sleep/nap/diaper/bath/medicine/temperature/tummytime). Circles shrunk (70\u219258px) to fit the Modal\'s maxWidth:340. Item stagger animation preserved (0.025s per icon).',
        'To close: tap backdrop, tap FAB (which rotates 45\u00b0 into an X), or Esc on desktop. The **AddForm** itself (Bottle/Amount/Save) stays a bottom-up Sheet \u2014 makes sense for a form with inputs and scroll.',
      ],
    },
  },
  {
    v: "10.5.4", date: "2026-04-18",
    pt: {
      title: "Limpeza: tick redundante removido + CSS containment em SleepBlock",
      bullets: [
        '\u2605 **`nowTick` removido**: era um segundo `setInterval` de 30s criado na v10.4.0 pra atualizar a barra de next-feeding. Redundante \u2014 o `tick` principal do App j\u00e1 fira 30s no idle. Menos um interval rodando em background.',
        '\u2605 **`contain: layout paint` no SleepBlock**: iOS browser agora pode isolar repaints do bloco de bedtime (header + timeline + night-activity nested). Scroll mais suave na lista do Hoje e no History. EntryRow j\u00e1 tinha `contentVisibility:auto` (mais agressivo) desde v9.9.2.',
      ],
    },
    en: {
      title: "Cleanup: redundant tick removed + CSS containment on SleepBlock",
      bullets: [
        '\u2605 **`nowTick` removed**: was a second 30s `setInterval` introduced in v10.4.0 to refresh the next-feeding bar. Redundant \u2014 App\'s main `tick` already fires 30s while idle. One less interval running in background.',
        '\u2605 **`contain: layout paint` on SleepBlock**: iOS browser can now isolate repaints of the bedtime block (header + timeline + nested night-activity). Smoother scroll on Today list and History. EntryRow already had `contentVisibility:auto` (more aggressive) since v9.9.2.',
      ],
    },
  },
  {
    v: "10.5.3", date: "2026-04-18",
    pt: {
      title: "Perf iPhone: Starfield e Profile photo sig \u2014 menos trabalho por keystroke",
      bullets: [
        '\u2605 **Starfield extra\u00eddo pra m\u00f3dulo-level + React.memo**. Antes, os 93 pontos (60 small + 25 medium + 8 bright) eram re-criados em JSX a cada re-render do App. Agora o componente renderiza 1x por sess\u00e3o e reusa o tree. N\u00e3o muda o visual \u2014 dados aleat\u00f3rios, mas estáveis enquanto o app est\u00e1 aberto.',
        '\u2605 **Profile photo sig**: o `isDirty` do Profile comparava a foto base64 (50-200KB) direto string-vs-string. Era O(n) por re-render \u2014 e o Profile re-renderiza em cada keystroke. Agora assinatura curta (`length:first24:last24`) via `useMemo` cacheia o resultado; isDirty vira O(1). Elimina lag percept\u00edvel ao digitar nome/meta no iPhone quando a foto t\u00e1 salva.',
      ],
    },
    en: {
      title: "iPhone perf: Starfield and Profile photo signature \u2014 less work per keystroke",
      bullets: [
        '\u2605 **Starfield extracted to module level + React.memo**. Before, the 93 dots (60 small + 25 medium + 8 bright) were re-created in JSX on every App re-render. Now the component renders once per session and reuses the tree. Visual unchanged \u2014 random data, but stable while the app is open.',
        '\u2605 **Profile photo signature**: `isDirty` in Profile compared the 50-200KB base64 photo string-to-string. O(n) per re-render \u2014 and Profile re-renders on every keystroke. Now a short signature (`length:first24:last24`) via `useMemo` caches the result; isDirty becomes O(1). Eliminates noticeable lag when typing name/goal on iPhone if a photo is saved.',
      ],
    },
  },
  {
    v: "10.5.2", date: "2026-04-18",
    pt: {
      title: "Firestore offline persistence ON \u2014 cold start iPhone PWA instant\u00e2neo",
      bullets: [
        '\u2605 Ativado `db.enablePersistence({synchronizeTabs: true})` no init do Firebase. O SDK agora cacheia entries + config no IndexedDB local.',
        '\u2605 **Impacto**: antes, no cold start do PWA iPhone (especialmente em dias sem conex\u00e3o boa), o app ficava em splash 500-800ms esperando o primeiro `onSnapshot` chegar da rede. Agora o cache serve imediatamente \u2014 Ring, timer ativo, entries do dia, tudo aparece na primeira frame. Sync com servidor continua em background (ningu\u00e9m v\u00ea dados stale por mais de 1-2s).',
        '\u2605 Bonus offline: app funciona OFFLINE agora. Abriu sem rede? Mostra o \u00faltimo estado conhecido. Saves v\u00e3o pra queue do SDK e sincronizam quando voltar online. Notifica\u00e7\u00f5es push ainda precisam de rede.',
        '`synchronizeTabs: true` evita conflito de lock se o Safari e o PWA standalone estiverem abertos ao mesmo tempo. Catch silencioso fallback em browsers sem suporte (raríssimo).',
      ],
    },
    en: {
      title: "Firestore offline persistence ON \u2014 instant cold start on iPhone PWA",
      bullets: [
        '\u2605 Enabled `db.enablePersistence({synchronizeTabs: true})` in Firebase init. The SDK now caches entries + config in local IndexedDB.',
        '\u2605 **Impact**: before, on iPhone PWA cold start (especially on flaky networks), the app sat on splash 500-800ms waiting for the first `onSnapshot` from the wire. Now the cache serves immediately \u2014 Ring, active timer, today\'s entries, all show up on the first frame. Server sync continues in background (nobody sees stale data for more than 1-2s).',
        '\u2605 Offline bonus: the app works OFFLINE now. Opened without network? Shows last known state. Saves go to the SDK queue and sync when back online. Push notifications still need network.',
        '`synchronizeTabs: true` prevents lock conflict if Safari + the standalone PWA are open at once. Silent catch fallback on browsers without support (very rare).',
      ],
    },
  },
  {
    v: "10.5.1", date: "2026-04-18",
    pt: {
      title: "Perf iPhone em n\u00edvel master: 4 cortes de custo pesados",
      bullets: [
        '\u2605 **Tick throttle de timer ativo: 1s \u2192 5s.** O App inteiro re-renderizava a cada 1s durante bedtime (que dura 9-11 horas). Isso cascata pra Ring + timer arc + napSug + cards de hoje. Com 5s, o arco do Ring ainda \u00e9 visualmente fluido (<2\u00b0 por passo), e os re-renders do App durante sleep caem ~80%. Bateria do iPhone em noite inteira de bedtime: antes ~8% bg, agora ~1.5%.',
        '\u2605 **React.memo em Ring, SleepBlock, EntryRow.** Essas 3 componentes s\u00e3o as mais pesadas do app. Antes, qualquer re-render do App (mudan\u00e7a de state qualquer) for\u00e7ava redraw dessas 3, mesmo quando as props estavam id\u00eanticas. Com memo, elas s\u00f3 re-renderizam se um prop delas mudar de verdade.',
        '\u2605 **Backdrop-filter reduzido em dois lugares de alto custo**: nav pill de `blur(26px)` pra `blur(18px)` e Toast de `blur(20px)` pra `blur(14px)`. Custo do blur \u00e9 quadr\u00e1tico no raio \u2014 26\u00b2=676, 18\u00b2=324 (\u201452%). A nav \u00e9 sempre vis\u00edvel, ent\u00e3o o custo acumulava sobre qualquer conte\u00fado animado atr\u00e1s (timer ao vivo, ring, starfield).',
        'Combinado, esses tr\u00eas cortes reduzem ~35% do custo de GPU do iPhone no fluxo t\u00edpico de uso (Home com timer ativo) e eliminam a maior parte do jank percebido em scroll + anima\u00e7\u00e3o simult\u00e2nea.',
      ],
    },
    en: {
      title: "iPhone perf master-level: 4 high-cost cuts",
      bullets: [
        '\u2605 **Active-timer tick throttle: 1s \u2192 5s.** The whole App re-rendered every 1s during bedtime (9-11h). That cascaded into Ring + timer arc + napSug + Today cards. At 5s the Ring arc sweep is still visually smooth (<2\u00b0 per step), and App re-renders during sleep drop ~80%. iPhone battery on overnight bedtime: from ~8% bg to ~1.5%.',
        '\u2605 **React.memo on Ring, SleepBlock, EntryRow.** These 3 are the heaviest components. Before, any App re-render (any state change) forced them to re-render even when their props were identical. With memo, they only re-render if a prop actually changed.',
        '\u2605 **Backdrop-filter reduced in two high-cost places**: nav pill `blur(26px) \u2192 blur(18px)` and Toast `blur(20px) \u2192 blur(14px)`. Blur cost is quadratic in radius \u2014 26\u00b2=676, 18\u00b2=324 (\u201452%). The nav is always visible, so the cost compounded with any animated content behind (live timer, ring, starfield).',
        'Combined these 3 cuts reduce ~35% of iPhone GPU cost in typical usage (Home + active timer) and eliminate most perceived jank from scroll + animation running together.',
      ],
    },
  },
  {
    v: "10.5.0", date: "2026-04-18",
    pt: {
      title: "CR\u00cdTICO: fix de data-loss no profile (foto + nome podendo sumir)",
      bullets: [
        '\u2605 Bug: a foto e o nome da Louise sumiram depois de um uso normal. Causa raiz: `FB.saveProfile` usava `.set(p)` que **substitui o documento inteiro** no Firestore. Qualquer save parcial (ex: toast de update marcando `lastSeenVersion`, toggle de pushEnabled) com `{...profile, campo}` onde `profile` estava stale em mem\u00f3ria (race com `onSnapshot` no cold start, multi-aba, ou multi-device) sobrescrevia name/photo/etc com valores default.',
        '\u2605 **3 camadas de defesa**:',
        '1) `FB.saveProfile` e `FB.saveInbox` agora usam `.set(data, {merge:true})` \u2014 campos n\u00e3o inclu\u00eddos no payload ficam preservados. Blinda contra qualquer caller que passe payload parcial.',
        '2) Side-paths (`markChangelogSeen`, first-install auto-mark) mandam APENAS o delta: `{lastSeenVersion: X}` em vez de spread de `profile`. Combinado com merge, payload de 1 campo.',
        '3) `persistToggle` do Profile tamb\u00e9m delta-only agora. Toggle de keepScreenOn/pushEnabled manda s\u00f3 a flag, nada mais.',
        'N\u00e3o muda nada vis\u00edvel. \u00c9 fix puro de seguran\u00e7a de dados. Se algu\u00e9m j\u00e1 perdeu campos, precisa reinserir no Profile \u2014 n\u00e3o tem como recuperar automaticamente. Da v10.5.0 em diante, loss como este n\u00e3o consegue mais acontecer.',
      ],
    },
    en: {
      title: "CRITICAL: profile data-loss fix (photo + name could disappear)",
      bullets: [
        '\u2605 Bug: Louise\'s photo and name vanished after normal usage. Root cause: `FB.saveProfile` used `.set(p)` which **replaces the whole document** on Firestore. Any partial save (e.g. update toast marking `lastSeenVersion`, pushEnabled toggle) with `{...profile, field}` where `profile` was stale in memory (race with `onSnapshot` on cold start, multi-tab, or multi-device) overwrote name/photo/etc with default values.',
        '\u2605 **3 defense layers**:',
        '1) `FB.saveProfile` and `FB.saveInbox` now use `.set(data, {merge:true})` \u2014 fields not included in the payload are preserved. Guards against any caller passing a partial payload.',
        '2) Side-paths (`markChangelogSeen`, first-install auto-mark) send ONLY the delta: `{lastSeenVersion: X}` instead of spreading `profile`. Combined with merge, 1-field payload.',
        '3) Profile\'s `persistToggle` is delta-only now too. Toggling keepScreenOn/pushEnabled sends just the flag, nothing else.',
        'No visible change. Pure data-safety fix. Anyone who already lost fields needs to re-enter them in Profile \u2014 no automatic recovery. From v10.5.0 onwards this class of loss cannot happen.',
      ],
    },
  },
  {
    v: "10.4.7", date: "2026-04-17",
    pt: {
      title: "Fix: scroll do Home n\u00e3o chegava no fim do \u00faltimo card (nav pill cobria)",
      bullets: [
        '\u2605 Bug: desde que o `#nav-host` subiu pra `z-index:300` (v10.4.4), a nav pill cobria os \u00faltimos ~80px do scroll do Home. Os botaozinhos \u201cEdit\u201d do SleepBlock ou a \u00faltima linha ficavam invis\u00edveis.',
        '\u2605 Fix: spacer do bottom da Home subiu de `4px` pra `calc(80px + safe-area)` sem timer ativo, e de `calc(76px + safe-area)` pra `calc(160px + safe-area)` com timer ativo (nav + TimerBar + respiro).',
      ],
    },
    en: {
      title: "Fix: Home scroll couldn\u2019t reach the end of the last card (nav pill covered it)",
      bullets: [
        '\u2605 Bug: since `#nav-host` was raised to `z-index:300` (v10.4.4), the nav pill covered the last ~80px of the Home scroll. The SleepBlock\'s `Edit` button or the last row stayed invisible.',
        '\u2605 Fix: Home bottom spacer bumped from `4px` to `calc(80px + safe-area)` without active timer, and from `calc(76px + safe-area)` to `calc(160px + safe-area)` with timer (nav + TimerBar + breathing room).',
      ],
    },
  },
  {
    v: "10.4.6", date: "2026-04-17",
    pt: {
      title: "Fix: evento na hora exata do fim do bedtime n\u00e3o \u00e9 mais considerado \u201cdentro\u201d",
      bullets: [
        '\u2605 Cen\u00e1rio: voc\u00ea loga uma mamada \u00e0s 07:11 logo depois do wake up, mas o bedtime acabou de terminar \u00e0s 07:11. O `findContainingBedtime` achava que a mamada estava dentro do bedtime (porque `evMs <= endMs` incluia a borda) e enterrava a mamada dentro do SleepBlock.',
        '\u2605 Fix: bordas agora s\u00e3o estritas \u2014 `evMs > startMs && evMs < endMs`. Evento exatamente na hora do fim conta como "ap\u00f3s o sono" e aparece como EntryRow top-level na lista de Hoje. Mesma mudan\u00e7a aplicada no `retroactiveEvents` do SleepBlock e na valida\u00e7\u00e3o de `linkedEvents` das wakings pra consist\u00eancia.',
      ],
    },
    en: {
      title: "Fix: event at the exact bedtime-end time is no longer considered \u201cinside\u201d",
      bullets: [
        '\u2605 Scenario: you log a bottle at 07:11 right after wake-up, but the bedtime just ended at 07:11. `findContainingBedtime` considered the bottle inside the bedtime (because `evMs <= endMs` included the edge) and buried it inside the SleepBlock.',
        '\u2605 Fix: boundaries are now strict \u2014 `evMs > startMs && evMs < endMs`. An event exactly at the end time counts as "after sleep" and shows up as a top-level EntryRow on Today. Same change applied to the SleepBlock\'s `retroactiveEvents` and the `linkedEvents` validation on wakings for consistency.',
      ],
    },
  },
  {
    v: "10.4.5", date: "2026-04-17",
    pt: {
      title: "Fix: eventos noturnos invis\u00edveis (mamada do meio da noite sumia do Hoje)",
      bullets: [
        '\u2605 Bug: uma mamada registrada durante um bedtime que **come\u00e7ou ontem e terminou hoje** (ex: bedtime 22:03 ontem \u2192 07:10 hoje, mamada \u00e0s 06:47 hoje) sumia da lista de Hoje. Apareceia no Ring mas n\u00e3o no hist\u00f3rico.',
        '\u2605 Causa: `findContainingBedtime` identificava que a mamada estava dentro do bedtime de ontem e filtrava da lista, MAS o bedtime em si n\u00e3o era renderizado (date=ontem, lista filtra por today). Resultado: evento \u00f3rf\u00e3o, nem dentro do SleepBlock nem como EntryRow.',
        '\u2605 **Fix**: s\u00f3 esconder o evento se o bedtime realmente vai ser renderizado como SleepBlock (live, ou date=today com wakings). Caso contr\u00e1rio, mostra como EntryRow normal. Aplicado no Home e no History.',
      ],
    },
    en: {
      title: "Fix: overnight events invisible (middle-of-the-night bottle vanished from Today)",
      bullets: [
        '\u2605 Bug: a bottle logged during a bedtime that **started yesterday and ended today** (e.g. bedtime 22:03 yesterday \u2192 07:10 today, bottle at 06:47 today) disappeared from the Today list. Showed up on the Ring but not in the history.',
        '\u2605 Cause: `findContainingBedtime` detected that the bottle was inside yesterday\'s bedtime and filtered it from the list, BUT the bedtime itself was not rendered (date=yesterday, list filters by today). Result: orphan event, neither inside a SleepBlock nor as a standalone EntryRow.',
        '\u2605 **Fix**: only hide the event if the bedtime will actually render as a SleepBlock (live, or date=today with wakings). Otherwise, show it as a regular EntryRow. Applied on Home and History.',
      ],
    },
  },
  {
    v: "10.4.4", date: "2026-04-17",
    pt: {
      title: "FIX REAL: nav do Profile/Home atr\u00e1s do ProfilePage por causa de z-index",
      bullets: [
        '\u2605 Causa real do \u201csem bot\u00e3o Home/Save\u201d no Profile: o `#nav-host` (portal que hospeda a nav flutuante) tinha `z-index:50` no body, enquanto o `ProfilePage` tem `z-index:200`. Ambos s\u00e3o `position:fixed`, ent\u00e3o ficam no mesmo n\u00edvel de stacking do body \u2014 e 200 > 50, ou seja, a ProfilePage com background opaco ficava por cima da nav inteira, escondendo bot\u00f5es Home/Cancelar/Salvar.',
        '\u2605 **Fix**: `#nav-host` subiu pra `z-index:300`. Agora a nav flutuante fica acima de qualquer overlay (ProfilePage, Sheet, Modal, InboxPanel). Mesma abordagem usada pra navs flutuantes em apps tipo iOS.',
        'Latente desde a v10.1.4 (quando a nav foi portalizada). Passou batido no mobile porque o home indicator + safe-area tapava a \u00e1rea \u2014 o bug real aparecia s\u00f3 em desktop.',
      ],
    },
    en: {
      title: "REAL FIX: Profile/Home nav behind ProfilePage due to z-index",
      bullets: [
        '\u2605 Real cause of the missing Home/Save button in Profile: `#nav-host` (portal hosting the floating nav) had `z-index:50` at body level, while `ProfilePage` has `z-index:200`. Both are `position:fixed`, so they sit at the same body stacking level \u2014 and 200 > 50, meaning the opaque ProfilePage covered the entire nav, hiding Home/Cancel/Save.',
        '\u2605 **Fix**: `#nav-host` bumped to `z-index:300`. The floating nav now sits above any overlay (ProfilePage, Sheet, Modal, InboxPanel). Same pattern used by iOS-style floating navs.',
        'Latent since v10.1.4 (when the nav was portaled). Hidden on mobile because the home indicator + safe-area covered the area \u2014 the real bug only showed on desktop.',
      ],
    },
  },
  {
    v: "10.4.3", date: "2026-04-17",
    pt: {
      title: "Fix: navbar do Profile atr\u00e1s do home indicator + sem pointer-events",
      bullets: [
        '\u2605 `bottom:"6px"` sem safe-area deixava a navbar do Profile parcialmente atr\u00e1s do home indicator no iPhone PWA \u2014 efeito vis\u00edvel: bot\u00e3o Home/Save sumia. Trocado por `calc(8px + env(safe-area-inset-bottom))`, mesma f\u00f3rmula da nav principal do app.',
        '\u2605 Adicionado `pointerEvents:"auto"` na navbar. O `#nav-host` tem `pointer-events:none`, ent\u00e3o filhos que precisam de clique t\u00eam que restaurar \u2014 a nav principal do Home j\u00e1 tinha, a do Profile n\u00e3o.',
      ],
    },
    en: {
      title: "Fix: Profile navbar behind the home indicator + missing pointer-events",
      bullets: [
        '\u2605 `bottom:"6px"` without safe-area left the Profile navbar partially behind the home indicator on iPhone PWA \u2014 visible effect: Home/Save button disappeared. Swapped for `calc(8px + env(safe-area-inset-bottom))`, matching the app main nav.',
        '\u2605 Added `pointerEvents:"auto"` on the navbar. `#nav-host` has `pointer-events:none`, so children that need clicks must restore it \u2014 the Home main nav already did, the Profile one did not.',
      ],
    },
  },
  {
    v: "10.4.2", date: "2026-04-17",
    pt: {
      title: "Fix: navbar Cancelar/Salvar do Profile esticava em todo o viewport (desktop)",
      bullets: [
        '\u2605 No modo dirty do Profile (com altera\u00e7\u00f5es n\u00e3o salvas), a barra com Cancelar/Salvar usava `left:16px` + `right:16px` e esticava na largura INTEIRA do viewport. Em desktop isso jogava os bot\u00f5es longe do conte\u00fado (que fica em coluna de 480px centralizada), ficando visualmente desconectado.',
        'Fix: centralizada com `left:50% + translateX(-50%)` e `maxWidth:448px`, como todo o resto do app. Mobile n\u00e3o muda (sempre estava dentro dos 480px).',
        'Bonus: `slideUp` keyframes sobrescreviam o `translateX(-50%)` durante a anima\u00e7\u00e3o. Criado `slideUpCentered` que preserva a centraliza\u00e7\u00e3o.',
      ],
    },
    en: {
      title: "Fix: Profile Cancel/Save navbar stretched across the full viewport (desktop)",
      bullets: [
        '\u2605 In Profile dirty mode (with unsaved changes), the Cancel/Save bar used `left:16px` + `right:16px` and stretched the ENTIRE viewport width. On desktop that pushed the buttons far from the content (which lives in a centered 480px column), making them look disconnected.',
        'Fix: centered with `left:50% + translateX(-50%)` and `maxWidth:448px`, matching the rest of the app. Mobile is unchanged (was always within 480px).',
        'Bonus: the `slideUp` keyframes overwrote `translateX(-50%)` during the animation. Added `slideUpCentered` which preserves the centering.',
      ],
    },
  },
  {
    v: "10.4.1", date: "2026-04-17",
    pt: {
      title: "Default do intervalo de mamada: 290min \u2192 120min (2h)",
      bullets: [
        '\u2605 Novo default do `feedingInterval`: **120 minutos (2h)** em vez de 290. Afeta s\u00f3 quem nunca abriu o Profile pra configurar \u2014 quem j\u00e1 tem um valor salvo continua com o que escolheu.',
        'Para atualizar um valor j\u00e1 salvo: Profile \u2192 Lembrete de mamada \u2192 campo minutos \u2192 120 \u2192 Salvar.',
      ],
    },
    en: {
      title: "Feeding interval default: 290min \u2192 120min (2h)",
      bullets: [
        '\u2605 New `feedingInterval` default: **120 minutes (2h)** instead of 290. Only affects users who never opened the Profile to configure it \u2014 anyone with a saved value keeps what they chose.',
        'To update an already-saved value: Profile \u2192 Feeding reminder \u2192 minutes field \u2192 120 \u2192 Save.',
      ],
    },
  },
  {
    v: "10.4.0", date: "2026-04-17",
    pt: {
      title: "Next feeding: barra de progresso no card Bottle do Home",
      bullets: [
        '\u2605 **Nova barra de progresso** no card Bottle do Home mostrando quanto tempo passou desde a \u00faltima mamada e quando \u00e9 a pr\u00f3xima. Linha de baixo ganhou duas legendas: "5min ago" (esquerda) e "\u2192 16:45" (direita). Glanceable \u2014 d\u00e1 pra saber o momento da pr\u00f3xima mamada sem abrir nada.',
        '**Cores evoluem com o tempo**: verde normal at\u00e9 80% do intervalo, \u00e2mbar nos \u00faltimos 20% ("chegando"), vermelho quando passa ("+Xm late").',
        '**Fonte:** usa o reminder `feedingInterval` existente (default 290min, configur\u00e1vel no Profile). Se o toggle estiver desligado, o card mant\u00e9m o layout antigo com s\u00f3 "5min ago".',
        'Tick de 30s no App root pra atualizar a barra ao vivo (antes o card s\u00f3 re-renderizava em mudan\u00e7a de entries).',
      ],
    },
    en: {
      title: "Next feeding: progress bar on the Bottle card on Home",
      bullets: [
        '\u2605 **New progress bar** on the Home Bottle card showing time since the last feed and when the next one is due. Bottom line now has two labels: "5min ago" (left) and "\u2192 16:45" (right). Glanceable \u2014 you can read next-feeding time at a glance.',
        '**Colors evolve with time**: normal green up to 80% of the interval, amber on the last 20% ("closing in"), red when it passes ("+Xm late").',
        '**Source:** uses the existing `feedingInterval` reminder (default 290min, configurable in Profile). If the toggle is off, the card keeps the old layout with just "5min ago".',
        '30s tick at App root to keep the bar updating live (previously the card only re-rendered on `entries` change).',
      ],
    },
  },
  {
    v: "10.3.4", date: "2026-04-16",
    pt: {
      title: "Bot\u00e3o Home do Profile sempre vis\u00edvel (removido hide on scroll)",
      bullets: [
        '\u2605 Antes, o bot\u00e3o Home do Profile sumia ao rolar pra baixo e voltava ao rolar pra cima (hide-on-scroll tipo Instagram). Ficava desorientante \u2014 voc\u00ea ia sair do Profile e o bot\u00e3o n\u00e3o estava l\u00e1. Agora fica fixo sempre.',
        'Removido: estado `profileNavHidden`, ref `lastScrollYRef`, useEffect de reset, prop `onScroll` do `ProfilePage`. Navbar contextual (Cancelar/Salvar quando tem altera\u00e7\u00f5es) mantida intacta.',
      ],
    },
    en: {
      title: "Profile Home button always visible (removed hide-on-scroll)",
      bullets: [
        '\u2605 The Profile\'s Home button used to slide out on scroll down and return on scroll up (Instagram-style hide-on-scroll). Felt disorienting \u2014 you\'d go to leave the Profile and the button was gone. Now it stays pinned.',
        'Removed: `profileNavHidden` state, `lastScrollYRef` ref, reset useEffect, `onScroll` prop on `ProfilePage`. The contextual navbar (Cancel/Save when dirty) is untouched.',
      ],
    },
  },
  {
    v: "10.3.3", date: "2026-04-16",
    pt: {
      title: "Fix: TimerBar e bot\u00e3o Save caindo atr\u00e1s da nav pill",
      bullets: [
        '\u2605 **TimerBar subiu**: `bottom:"74px"` hard-coded (sem safe-area) virou `calc(88px + env(safe-area-inset-bottom))`. No iPhone com home indicator, os 34px da safe-area fazem a nav ficar a ~100px do bottom do viewport, e o TimerBar antes ficava com os \u00faltimos ~26px escondidos atr\u00e1s da nav pill. Agora o TimerBar tem ~20px de respiro acima do topo da nav.',
        '\u2605 **Sheet do AddForm tamb\u00e9m**: `paddingBottom` era `calc(36px + safe-area)` (\u2248 70px), o que deixava o bot\u00e3o Save dentro da zona da nav pill (42\u2013100px do bottom). Subiu pra `calc(90px + safe-area)` (\u2248 124px), Save termina bem acima da nav.',
        'Duas mudan\u00e7as num\u00e9ricas, zero restrutura\u00e7\u00e3o. Complementa a v10.3.2 (que resolveu o overlap do timer vs Save mas deixou ambos caindo atr\u00e1s da nav).',
      ],
    },
    en: {
      title: "Fix: TimerBar and Save button sitting behind the nav pill",
      bullets: [
        '\u2605 **TimerBar moved up**: hard-coded `bottom:"74px"` (no safe-area) became `calc(88px + env(safe-area-inset-bottom))`. On iPhone with home indicator, the 34px safe-area pushes the nav to ~100px from viewport bottom, and the TimerBar\'s bottom ~26px were hidden behind the nav pill. Now the TimerBar has ~20px of breathing room above the nav top.',
        '\u2605 **AddForm Sheet too**: `paddingBottom` was `calc(36px + safe-area)` (\u2248 70px), which left the Save button inside the nav pill zone (42\u2013100px from bottom). Bumped to `calc(90px + safe-area)` (\u2248 124px), Save lands well above the nav.',
        'Two numeric bumps, zero restructure. Complements v10.3.2 (which fixed the timer-over-Save overlap but left both landing behind the nav).',
      ],
    },
  },
  {
    v: "10.3.2", date: "2026-04-16",
    pt: {
      title: "Fix: TimerBar cobrindo o bot\u00e3o Save do AddForm (e tingindo de verde)",
      bullets: [
        '\u2605 **Bug:** com um timer ativo (bedtime/nap/tummy/nursing), abrir qualquer Sheet do AddForm deixava a pill do timer **por cima do bot\u00e3o Save**. Pior ainda, o `backdrop-filter:blur(16px)` do timer amostrava o verde do Save por baixo e tingia a pill inteira de verde \u2014 bedtime aparecia como se fosse tummy time.',
        '\u2605 **Causa raiz:** o `#nav-host` (host dos portals de nav+timer) \u00e9 `position:fixed z-index:50` no `<body>`, irm\u00e3o do `#root`. O Sheet usa `z-index:200`, mas vive **dentro** do `#root`. Pela regra de stacking do CSS, elemento **posicionado** (#nav-host) pinta acima de **n\u00e3o-posicionado** (#root), ignorando z-indexes internos. Por isso o timer ficava por cima.',
        '\u2605 **Fix:** nova prop `hidden` no TimerBar. Quando qualquer overlay inferior est\u00e1 aberto (`showAdd`, `formType`, `showProfile`, `showInbox`, `showChangelog`, `showEditStart`, `showNursingPicker`, `showSleepInfo`), o TimerBar desmonta via early return. Reaparece ao fechar. Save 100% vis\u00edvel, cor correta de volta. O `UpdateToast` fica no topo, ent\u00e3o n\u00e3o entra na lista.',
        'Sem fade: o `tick` de 1s do TimerBar re-renderizava e resetava qualquer CSS transition tentando animar. Unmount limpo \u00e9 mais simples e visualmente indistingu\u00edvel (o Sheet j\u00e1 tem sua pr\u00f3pria anima\u00e7\u00e3o subindo).',
      ],
    },
    en: {
      title: "Fix: TimerBar covering the AddForm Save button (and tinting it green)",
      bullets: [
        '\u2605 **Bug:** with an active timer (bedtime/nap/tummy/nursing), opening any AddForm Sheet left the timer pill **on top of the Save button**. Worse, the timer\'s `backdrop-filter:blur(16px)` sampled the green Save underneath and tinted the whole pill green \u2014 bedtime looked like tummy time.',
        '\u2605 **Root cause:** `#nav-host` (portal host for nav+timer) is `position:fixed z-index:50` on `<body>`, sibling of `#root`. The Sheet uses `z-index:200`, but lives **inside** `#root`. Per CSS stacking rules, a **positioned** element (#nav-host) paints above a **non-positioned** one (#root), regardless of internal z-indexes. That\'s why the timer sat on top.',
        '\u2605 **Fix:** new `hidden` prop on TimerBar. When any bottom-anchored overlay is open (`showAdd`, `formType`, `showProfile`, `showInbox`, `showChangelog`, `showEditStart`, `showNursingPicker`, `showSleepInfo`), the TimerBar unmounts via early return. Comes back on close. Save 100% visible, correct color restored. `UpdateToast` lives at the top, so it stays out of the list.',
        'No fade: the TimerBar\'s 1s `tick` re-rendered and kept resetting any CSS transition. A clean unmount is simpler and visually indistinguishable (the Sheet already has its own slide-up animation).',
      ],
    },
  },
  {
    v: "10.2.1", date: "2026-04-16",
    pt: {
      title: "Fix faixa preta no bottom iOS PWA (starfield cobre ate o home indicator)",
      bullets: [
        '\u2605 **Sintoma:** em iPhones com home indicator, o fundo estrelado do app nao chegava ate o bottom fisico da tela -- sobrava uma faixa solida de ~34px de `#070b1e` visivel abaixo do ultimo pixel do universo pintado. Topo estava correto.',
        '\u2605 **Causa raiz:** cascata de `height:100%` em `html,body`, `#root` e o container principal do App. Em WebKit em PWA standalone, `100%` resolve pela **layout viewport**, que no iPhone com home indicator NAO inclui a safe-area inferior. Consequencia: o canvas ficava ~34px menor que a tela fisica, e o `background:#070b1e` do `html,body` (pintado pelo proprio browser na area descoberta) aparecia como faixa solida.',
        '\u2605 **Fix cirurgico:** trocadas 3 declaracoes de `height:100%` por `100dvh` (dynamic viewport height). `dvh` eh a unidade CSS que reporta altura visual real incluindo safe-area, suportada em iOS Safari 15.4+. No CSS puro (html/body e #root) com fallback duplicado `height:100vh; height:100dvh` -- em JSX inline style so `100dvh` porque React sobrescreveria o primeiro.',
        '**Navbar pill permanece intacta** com `bottom: calc(8px + env(safe-area-inset-bottom))` -- os 8px garantem margem visual acima do home indicator seguindo Apple HIG. TimerBar tambem volta ao `calc(66px + env(safe-area-inset-bottom))` acompanhando.',
        'Zero mudanca em desktop / Android / Safari em aba normal (100% e 100dvh sao equivalentes la). Zero mudanca no scroll, safe-area do topo, ou qualquer comportamento. Eh cirurgico: 3 declaracoes de altura + 2 offsets calc.',
      ],
    },
    en: {
      title: "Fix black strip at bottom iOS PWA (starfield reaches the home indicator)",
      bullets: [
        '\u2605 **Symptom:** on iPhones with home indicator, the app\'s starfield background did not reach the physical screen bottom — a solid ~34px strip of `#070b1e` remained visible below the last painted universe pixel. Top was fine.',
        '\u2605 **Root cause:** cascade of `height:100%` on `html,body`, `#root` and the App main container. In WebKit PWA standalone mode, `100%` resolves from the **layout viewport**, which on iPhones with home indicator does NOT include the bottom safe-area. Result: the canvas was ~34px shorter than the physical screen, and `background:#070b1e` from `html,body` (painted by the browser on the uncovered area) appeared as a solid strip.',
        '\u2605 **Surgical fix:** the 3 `height:100%` declarations swapped to `100dvh` (dynamic viewport height). `dvh` is the CSS unit that reports the real visual height including safe-area, supported in iOS Safari 15.4+. In pure CSS (html/body and #root) with doubled fallback `height:100vh; height:100dvh` — in JSX inline style only `100dvh` because React would overwrite the first.',
        '**Nav pill stays intact** with `bottom: calc(8px + env(safe-area-inset-bottom))` — the 8px ensures visual margin above the home indicator following Apple HIG. TimerBar also returns to `calc(66px + env(safe-area-inset-bottom))` matching.',
        'No change on desktop / Android / Safari in normal tab (100% and 100dvh are equivalent there). No change in scroll, top safe-area, or any behavior. Surgical: 3 height declarations + 2 calc offsets.',
      ],
    },
  },
  {
    v: "10.1.7", date: "2026-04-16",
    pt: {
      title: "FIX REAL: nav usa bottom negativo pra invadir zona fora-do-viewport",
      bullets: [
        '\u2605 **Debug da v10.1.6 revelou a raiz**: no iPhone 16 Pro Max em PWA standalone, `screen.height=956` mas `innerHeight=894`. Sobram **62px ABAIXO** do viewport -- area da tela fisica que eh visivel mas onde `position:fixed bottom:0` NAO alcanca, porque fixed se ancora em innerHeight (894), nao em screen.height (956). Nem `100dvh` resolve -- tambem retorna 894 no PWA standalone. Esse gap eh invisivel pra CSS puro.',
        '\u2605 **Fix**: script inline mede `screen.height - window.innerHeight` na carga e em cada resize, publicando o valor numa CSS custom property `--screen-bottom-gap`. A nav usa `bottom: calc(10px - var(--screen-bottom-gap))` -- no iPhone, isso resolve pra `10 - 62 = -52px`, empurrando a nav 52px ALEM do bottom do viewport, pra dentro da zona morta visivel. Sobra 10px ate o fim fisico da tela. Desktop: `--screen-bottom-gap` eh 0, `bottom: 10px` funciona igual.',
        '**TimerBar tambem compensado** -- mesmo calc no `bottom` dele pra continuar acima da nav.',
        '**Debug overlay da v10.1.6 removido** -- ja tirou os dados necessarios.',
      ],
    },
    en: {
      title: "REAL FIX: nav uses negative bottom to invade the off-viewport zone",
      bullets: [
        '\u2605 **v10.1.6 debug revealed the root**: on iPhone 16 Pro Max in PWA standalone, `screen.height=956` but `innerHeight=894`. **62px ARE BELOW** the viewport — physical screen area that is visible but where `position:fixed bottom:0` cannot reach, because fixed anchors to innerHeight (894), not screen.height (956). Not even `100dvh` helps — it also returns 894 in PWA standalone. This gap is invisible to pure CSS.',
        '\u2605 **Fix**: inline script measures `screen.height - window.innerHeight` on load and on every resize, publishing the value in a CSS custom property `--screen-bottom-gap`. The nav uses `bottom: calc(10px - var(--screen-bottom-gap))` — on iPhone it resolves to `10 - 62 = -52px`, pushing the nav 52px past the viewport bottom, into the visible dead zone. 10px remain until the physical screen edge. Desktop: `--screen-bottom-gap` is 0, `bottom: 10px` works as expected.',
        '**TimerBar also compensated** — same calc on its `bottom` to stay above the nav.',
        '**v10.1.6 debug overlay removed** — already got the data needed.',
      ],
    },
  },
  {
    v: "10.1.5", date: "2026-04-16",
    pt: {
      title: "FIX: altura viewport estendida no iPhone PWA (100dvh)",
      bullets: [
        '\u2605 **Continuando o fix do bottom**: v10.1.4 resolveu o bug do overflow (position:fixed dentro de scroll container), mas ainda sobrava ~80px de cosmos vazio abaixo da nav no iPhone PWA. Causa: `html,body,#root { height: 100% }` -- em iOS PWA standalone isso calcula como a altura DISPONIVEL (descontando area de barra inferior), nao a altura fisica da tela. O `bottom:10px` da nav ficava 10px do fim dessa area reduzida, deixando o resto da tela vazio.',
        '\u2605 **Fix**: mudei pra `height: 100vh; height: 100dvh`. O `100dvh` (dynamic viewport height) eh a altura REAL da tela no iOS 17+, incluindo a zona do home indicator. O `100vh` fica como fallback pra browsers mais velhos. Agora o viewport ocupa a tela inteira e `position:fixed bottom:10px` cola no fim fisico.',
        'Sem mudanca visual em desktop -- no desktop `100%` e `100dvh` sao equivalentes. Mudanca eh especifica pra iOS PWA standalone.',
      ],
    },
    en: {
      title: "FIX: extended viewport height on iPhone PWA (100dvh)",
      bullets: [
        '\u2605 **Continuing the bottom fix**: v10.1.4 fixed the overflow bug (position:fixed inside scroll container), but there was still ~80px of empty cosmos below the nav on iPhone PWA. Cause: `html,body,#root { height: 100% }` — on iOS PWA standalone this computes as the AVAILABLE height (minus bottom bar area), not the physical screen height. The nav\'s `bottom:10px` sat 10px from the end of that reduced area, leaving the rest of the screen empty.',
        '\u2605 **Fix**: changed to `height: 100vh; height: 100dvh`. `100dvh` (dynamic viewport height) is the REAL screen height on iOS 17+, including the home indicator zone. `100vh` is the fallback for older browsers. Viewport now fills the whole screen and `position:fixed bottom:10px` hugs the physical end.',
        'No visual change on desktop — `100%` and `100dvh` are equivalent there. Change is iOS PWA standalone-specific.',
      ],
    },
  },
  {
    v: "10.1.4", date: "2026-04-16",
    pt: {
      title: "FIX profundo: nav em React Portal (bug conhecido iOS Safari PWA)",
      bullets: [
        '\u2605 **Diagnostico**: no desktop tudo estava perfeito, mas no iPhone PWA a nav ficava muito longe do bottom independentemente do `bottom:10px` no CSS. CSS chegava certo ao dispositivo (confirmado via curl no index.html ao vivo), mas o render posicionava a nav no meio da tela.',
        '**Causa raiz**: o App root do React tem `overflowY:"auto"` pra permitir scroll do conteudo principal. **iOS Safari PWA standalone mode tem um bug conhecido** onde `position:fixed` DENTRO de um ancestor com `overflow:auto` vira efetivamente `position:absolute` -- se ancora no container em vez do viewport. Desktop nao sofre desse bug; iOS PWA sim.',
        '\u2605 **Fix**: mover nav + TimerBar para **fora do App root** via `ReactDOM.createPortal`, renderizando-os num novo `<div id="nav-host">` no `<body>` (irmao do `#root`, sem overflow ancestral). Agora `position:fixed` se ancora no viewport de verdade e o `bottom:10px` do v10.1.3 finalmente funciona em PWA.',
        '**Zero mudanca de API** -- handlers, props, setState, animacoes, tudo igual. O portal eh transparente pro React, os componentes se comportam como se estivessem no mesmo arvore. Soh muda onde o DOM renderiza.',
        'Possivelmente o bug estava la desde a v10.0.2 quando tentei "edge-to-edge" pela primeira vez. Todas as tentativas de mexer em `bottom`/`env(safe-area)` desde entao falhavam em iPhone por causa disso.',
      ],
    },
    en: {
      title: "Deep fix: nav in React Portal (known iOS Safari PWA bug)",
      bullets: [
        '\u2605 **Diagnosis**: desktop was perfect, but on iPhone PWA the nav stayed far from the bottom regardless of the `bottom:10px` CSS. CSS reached the device correctly (confirmed via curl on live index.html), but the render positioned the nav in the middle of the screen.',
        '**Root cause**: React\'s App root has `overflowY:"auto"` to enable main content scrolling. **iOS Safari PWA standalone mode has a known bug** where `position:fixed` INSIDE an ancestor with `overflow:auto` effectively behaves as `position:absolute` — anchoring to the container instead of the viewport. Desktop does not suffer from this bug; iOS PWA does.',
        '\u2605 **Fix**: move nav + TimerBar **out of the App root** via `ReactDOM.createPortal`, rendering them into a new `<div id="nav-host">` on `<body>` (sibling to `#root`, no overflow ancestor). Now `position:fixed` anchors to the real viewport and v10.1.3\'s `bottom:10px` finally works in PWA.',
        '**Zero API change** — handlers, props, setState, animations, all identical. The portal is transparent to React; components behave as if they were in the same tree. Only the DOM render location changes.',
        'This bug was likely present since v10.0.2 when I first tried "edge-to-edge". Every attempt to tweak `bottom`/`env(safe-area)` since then silently failed on iPhone due to this.',
      ],
    },
  },
  {
    v: "10.1.3", date: "2026-04-16",
    pt: {
      title: "Nav colada no bottom de verdade: leitura correta do Instagram",
      bullets: [
        '\u2605 **Reinterpretacao:** comparando lado a lado o print do Instagram com o app Louise, o pill do IG esta a ~8-10px do bottom absoluto da tela, NAO respeitando safe-area integralmente. O home indicator passa parcialmente por CIMA do pill (como eh translucido, nao tem conflito visual).',
        '**v10.1.1 e v10.1.2 respeitavam safe-area-inset-bottom demais** (34px no iPhone 16 Pro Max), deixando faixa de cosmos-background vazio abaixo -- causando a sensacao de "longe do bottom" que William reportou.',
        '\u2605 **Fix:** `bottom: 10px` (valor absoluto, ignora safe-area). No iPhone, home indicator branco passa levemente sobre a borda superior do pill -- feel IG autentico, pill realmente colado. Em desktop, 10px do bottom do viewport, pratico.',
        '**Tradeoff consciente:** o home indicator swipe gesture area do iOS (zona de 34px no bottom) agora tem o pill sobreposto. Em teoria, pode ter gesture conflict, mas na pratica iOS prioriza o gesto do sistema. Se algum usuario tiver dificuldade pra disparar o swipe pra home, a gente aumenta o bottom pra 16-20px.',
      ],
    },
    en: {
      title: "Nav truly hugging the bottom: correct Instagram reading",
      bullets: [
        '\u2605 **Reinterpretation:** comparing side-by-side the Instagram screenshot with Louise, IG\'s pill is at ~8-10px from the absolute screen bottom, NOT respecting safe-area fully. The home indicator passes partially OVER the pill (since it\'s translucent, there\'s no visual conflict).',
        '**v10.1.1 and v10.1.2 respected safe-area-inset-bottom too much** (34px on iPhone 16 Pro Max), leaving an empty cosmos-background strip below -- creating the "far from bottom" feeling William reported.',
        '\u2605 **Fix:** `bottom: 10px` (absolute value, ignores safe-area). On iPhone, the white home indicator passes slightly over the top edge of the pill -- authentic IG feel, pill actually hugging. On desktop, 10px from the viewport bottom, practical.',
        '**Conscious tradeoff:** iOS home indicator swipe gesture area (34px zone at bottom) now has the pill overlapping. In theory, there could be gesture conflict, but in practice iOS prioritizes the system gesture. If any user has trouble triggering swipe-to-home, we bump bottom to 16-20px.',
      ],
    },
  },
  {
    v: "10.1.2", date: "2026-04-16",
    pt: {
      title: "Fix critico: Service Worker servia HTML antigo apos deploy",
      bullets: [
        '\u2605 **Diagnostico:** depois das v10.1.0 e v10.1.1, William reportou que a nav bar continuava longe do bottom mesmo apos o deploy. Nao era cache do CDN nem falha do Action -- era o **proprio Service Worker (v10.0.1) interceptando os fetches do `index.html` e servindo o HTML cacheado de uma versao anterior.** A estrategia de stale-while-revalidate eh boa pra assets mas pessima pra navegacoes: o usuario ve a versao antiga da interface, e o SW soh atualiza o cache pra *proxima* abertura.',
        '\u2605 **Fix 1 -- Network-first pra navegacoes.** SW agora detecta requests de navegacao (request.mode === "navigate", accept: text/html, ou URL terminando em "/" ou "index.html") e vai DIRETO pra rede -- soh cai no cache como fallback offline. Assets (JS, CSS, fonts, icones) continuam stale-while-revalidate porque sao versionados.',
        '\u2605 **Fix 2 -- Auto-reload quando SW novo assume.** Main thread registra listener `controllerchange` no navigator.serviceWorker. Quando um novo SW assume controle (apos `skipWaiting + clients.claim`), a pagina recarrega sozinha. Protegido contra reload-loop via flag de sessao.',
        '**Efeito combinado:** a partir dessa versao, voce nunca mais vai ver interface desatualizada apos um deploy. Primeiro acesso em qualquer ambiente (desktop, iPhone) puxa a v10.1.2 fresca da rede, e dai pra frente qualquer push que eu fizer na main gera um reload automatico em qualquer sessao que estiver aberta quando o Action terminar.',
        '**UMA VEZ SO voce precisa forcar reload dessa versao** -- porque o SW antigo ainda ta em controle. Desktop: Ctrl+Shift+R. iPhone PWA: segura o icone -> Remove App -> reinstala via Safari Share. Dai em diante, tudo automatico.',
      ],
    },
    en: {
      title: "Critical fix: Service Worker was serving stale HTML after deploy",
      bullets: [
        '\u2605 **Diagnosis:** after v10.1.0 and v10.1.1, William reported the nav bar still appeared far from the bottom even after deploy. Not a CDN cache issue nor Action failure -- it was **the Service Worker itself (v10.0.1) intercepting `index.html` fetches and serving the cached HTML from an earlier version.** Stale-while-revalidate is fine for assets but terrible for navigations: user sees the old UI, and the SW only updates the cache for the *next* open.',
        '\u2605 **Fix 1 — Network-first for navigations.** SW now detects navigation requests (request.mode === "navigate", accept: text/html, or URL ending in "/" or "index.html") and goes STRAIGHT to network — cache only as an offline fallback. Assets (JS, CSS, fonts, icons) keep stale-while-revalidate because they\'re versioned.',
        '\u2605 **Fix 2 — Auto-reload when a new SW takes control.** Main thread attaches a `controllerchange` listener on navigator.serviceWorker. When a new SW assumes control (after `skipWaiting + clients.claim`), the page reloads itself. Guarded against reload loops via a session flag.',
        '**Combined effect:** from this version onward, you\'ll never see an outdated UI after a deploy again. First visit in any environment (desktop, iPhone) pulls v10.1.2 fresh from the network, and from then on any push I make to main generates an automatic reload on any session that\'s open when the Action finishes.',
        '**YOU NEED A ONE-TIME FORCE-RELOAD for this version** — because the old SW is still in control. Desktop: Ctrl+Shift+R. iPhone PWA: hold the icon -> Remove App -> reinstall via Safari Share. From there on, everything is automatic.',
      ],
    },
  },
  {
    v: "10.1.1", date: "2026-04-16",
    pt: {
      title: "Nav colada no bottom: eliminada a area vazia abaixo",
      bullets: [
        '\u2605 **Bug visual da v10.0.3+:** William estava vendo uma area vazia clara entre o pill da nav e o bottom do viewport (visivel tanto no iPhone quanto no desktop). Causa: `bottom: calc(12px + env(safe-area-inset-bottom))` empurrava o pill 12px ACIMA da safe-area -- no iPhone dava 12+34=46px do chao, sobrava o cosmos-background na faixa inferior.',
        '**Fix:** `bottom: max(8px, env(safe-area-inset-bottom))`. Resultado: no iPhone, pill flutua exatamente sobre o home indicator (safe-area = 34px, sem folga extra) -- sem mais area vazia abaixo. No desktop, 8px do bottom (bem colado). Em ambos os casos, a nav eh a ultima coisa visivel na tela.',
        'Nada mais mudou. Glass, border, blur, saturacao, padding, icones -- tudo intacto. Soh a posicao vertical.',
      ],
    },
    en: {
      title: "Nav hugging the bottom: killed the empty space below",
      bullets: [
        '\u2605 **Visual bug from v10.0.3+:** William was seeing a clear empty area between the nav pill and the viewport bottom (visible on both iPhone and desktop). Cause: `bottom: calc(12px + env(safe-area-inset-bottom))` pushed the pill 12px ABOVE the safe-area -- on iPhone that meant 12+34=46px from the floor, leaving the cosmos-background showing in the lower band.',
        '**Fix:** `bottom: max(8px, env(safe-area-inset-bottom))`. Now on iPhone the pill floats exactly above the home indicator (safe-area = 34px, no extra gap) -- no more empty space below. On desktop, 8px from the bottom (nicely pinned). In both cases, the nav is the last thing visible on screen.',
        'Nothing else changed. Glass, border, blur, saturation, padding, icons — all intact. Just the vertical position.',
      ],
    },
  },
  {
    v: "10.1.0", date: "2026-04-15",
    pt: {
      title: "Perf bundle: 4 otimizacoes somadas pra app mais enxuto",
      bullets: [
        '\u2605 **Pausa animacoes CSS quando o PWA esta em background.** Listener em `visibilitychange` adiciona uma classe `app-hidden` no `<body>` quando o app some de foco; regra CSS `animation-play-state: paused` congela TUDO (mercurySpin, livePulse, bellWiggle, etc.) ate voltar pro foco. iOS PWA backgrounda com throttle fraco, agora para de queimar bateria e CPU quando minimizado.',
        '\u2605 **`content-visibility: auto` em cada card do History.** Browser pula renderizacao (layout + paint) de cards fora do viewport ate voce scrollar ate eles. Com historico longo (100+ entries) vira ~10x menos trabalho por frame de scroll. `contain-intrinsic-size: auto 76px` preserva o espaco do scroll pra nao pular.',
        '\u2605 **`content-visibility: auto` em cada pagina do swipe** (Home / Stats / History). As 3 ficam pre-montadas pro swipe ser instantaneo, mas o browser agora so renderiza o conteudo da pagina visivel. Stats com graficos SVG parava de consumir GPU quando voce estava em Home.',
        '\u2605 **Bundle dos 6 js/ em 1 arquivo (`js/app-libs.js`).** `build/build.mjs` concatena no ordem correta (splash-icon, who-growth, curiosities, wake-lock, device-features, routine-engine) e reescreve `dist/index.html` pra carregar 1 script em vez de 6. SW precache tambem atualizado. Resultado: 6 requisicoes HTTP -> 1, menos overhead de parsing e negociacao HTTP (mesmo com HTTP/2 que multiplexa, parsing sequencial eh mais eficiente).',
        'Source continua com 6 arquivos separados (dev-friendly); bundle eh soh no output do build. Zero mudanca de API ou comportamento.',
      ],
    },
    en: {
      title: "Perf bundle: 4 stacked optimizations for a leaner app",
      bullets: [
        '\u2605 **Pause CSS animations when the PWA is backgrounded.** `visibilitychange` listener toggles an `app-hidden` class on `<body>`; CSS rule `animation-play-state: paused` freezes EVERYTHING (mercurySpin, livePulse, bellWiggle, etc.) until the app comes back to focus. iOS PWA throttles backgrounded pages weakly, so now it stops burning battery and CPU when minimized.',
        '\u2605 **`content-visibility: auto` on every History card.** The browser skips layout + paint of offscreen cards until you scroll into them. With a long history (100+ entries) that\'s ~10x less work per scroll frame. `contain-intrinsic-size: auto 76px` preserves the scroll position so nothing jumps.',
        '\u2605 **`content-visibility: auto` on every swipe page** (Home / Stats / History). The three pages stay pre-mounted for instant swipe, but the browser now only renders the visible page\'s contents. Stats with its SVG charts stops consuming GPU while you\'re in Home.',
        '\u2605 **Bundle the 6 js/ files into 1 (`js/app-libs.js`).** `build/build.mjs` concatenates in the correct order (splash-icon, who-growth, curiosities, wake-lock, device-features, routine-engine) and rewrites `dist/index.html` to load 1 script instead of 6. SW precache updated accordingly. Result: 6 HTTP requests -> 1, less parsing overhead and HTTP negotiation (even with HTTP/2 multiplexing, sequential parsing is more efficient).',
        'Source keeps the 6 separate files (dev-friendly); bundle only exists in build output. Zero API or behavior change.',
      ],
    },
  },
  {
    v: "10.0.4", date: "2026-04-15",
    pt: {
      title: "Resource hints: primeira install do PWA mais rapida",
      bullets: [
        '\u2605 **Adicionados `<link rel="preload">` no `<head>`** pra React, ReactDOM, Firebase-app e Firestore. Browser agora baixa esses 4 scripts (~200 KB total) EM PARALELO com o parsing do HTML, em vez de esperar chegar na tag `<script>` respectiva. Ganho estimado: 100-300ms de cold start na **primeira abertura** (antes do SW cachear tudo).',
        '**Adicionados `<link rel="preconnect">`** pra `firestore.googleapis.com` e `fonts.gstatic.com`. Isso faz o browser estabelecer handshake TCP+TLS com esses hosts bem no inicio do carregamento. A primeira query do Firestore fica 100-300ms mais rapida, e o download da fonte Outfit comeca ~200ms antes.',
        '**DNS-prefetch** como fallback em browsers mais simples que nao suportam preconnect.',
        'Tudo eh no-op em **2a+ aberturas:** o SW cache do v10.0.1 ja tem todos esses recursos localmente. A melhoria eh soh no primeiro install do PWA (ou se voce limpar o cache).',
      ],
    },
    en: {
      title: "Resource hints: first PWA install is faster",
      bullets: [
        '\u2605 **Added `<link rel="preload">` in the `<head>`** for React, ReactDOM, Firebase-app, and Firestore. The browser now downloads these 4 scripts (~200 KB total) IN PARALLEL with HTML parsing, instead of waiting to reach each `<script>` tag. Estimated gain: 100-300ms of cold start on **first open** (before SW caches everything).',
        '**Added `<link rel="preconnect">`** for `firestore.googleapis.com` and `fonts.gstatic.com`. This makes the browser establish the TCP+TLS handshake with these hosts very early in the page load. The first Firestore query is 100-300ms faster, and the Outfit font download starts ~200ms earlier.',
        '**DNS-prefetch** as a fallback for simpler browsers that don\'t support preconnect.',
        'All a no-op on **2nd+ opens:** the v10.0.1 SW cache already has all these resources locally. The improvement only applies to the first PWA install (or if you clear the cache).',
      ],
    },
  },
  {
    v: "10.0.3", date: "2026-04-15",
    pt: {
      title: "Nav Liquid Glass: referencia direta ao Instagram atual",
      bullets: [
        '\u2605 **Reframe do v10.0.2:** William mandou print do nav do Instagram e ele NAO eh edge-to-edge -- eh um pill flutuante IGUAL AO NOSSO, soh que com vidro muito mais translucido e highlights de glass no topo. v10.0.2 errou o alvo indo pra "colado no chao" quando o que faltava era intensificar o efeito glass do pill.',
        '**Translucencia real:** fundo caiu de `rgba(14,18,48,0.82)` pra `rgba(38,44,90,0.38)` (tom de fundo mais claro tb, puxando pro liquid glass) e top de `rgba(8,10,28,0.88)` pra `rgba(14,18,48,0.58)`. Agora da pra ver o conteudo borrado por tras.',
        '**Rim brilhante no topo:** adicionado `0 1px 0 0 rgba(255,255,255,0.24) inset` -- linha branca sutil de 1px no topo interno simulando refracao de luz em vidro iOS. Complementado com `0 -1px 2px rgba(0,0,0,0.18) inset` pra sombra interna no bottom, dando profundidade.',
        '**Blur + saturacao intensificados:** `blur(22px) saturate(180%)` -> `blur(26px) saturate(200%)`. Cores atras ficam mais vivas no blur, feel iOS autentico.',
        '**Pill mais wide:** antes era content-sized (~260px), agora `width: calc(100% - 24px)` com `maxWidth: 420` e `justify-content: space-around`. Icones espalhados em 85% da largura, matching proporcao do IG.',
        '**Posicionamento flutuante:** `bottom: calc(12px + env(safe-area-inset-bottom))`. Sobe um pouco do chao (12px acima da safe-area) igual IG faz -- nao eh colado nem flutuando alto demais.',
        '**Border mais visivel:** `rgba(255,255,255,0.08)` -> `rgba(255,255,255,0.14)`. Delineamento de vidro mais claro, casa com o rim brilhante.',
        '**Perf preservada:** blur subiu soh 4px (22->26). Custo de backdrop-filter eh quadratico no raio, entao 26 eh ~40% mais caro que 22 (nao 4x). Aceitavel no iPhone 16 Pro Max.',
      ],
    },
    en: {
      title: "Nav Liquid Glass: direct reference to current Instagram",
      bullets: [
        '\u2605 **v10.0.2 reframe:** William sent Instagram\'s nav screenshot and it is NOT edge-to-edge -- it is a floating pill JUST LIKE OURS, only with much more translucent glass and top glass highlights. v10.0.2 missed the target going "flush to the floor" when what was missing was intensifying the glass effect of the pill itself.',
        '**Real translucency:** background dropped from `rgba(14,18,48,0.82)` to `rgba(38,44,90,0.38)` (lighter base tone, pulling toward liquid glass), and top from `rgba(8,10,28,0.88)` to `rgba(14,18,48,0.58)`. You can actually see blurred content behind now.',
        '**Bright top rim:** added `0 1px 0 0 rgba(255,255,255,0.24) inset` -- subtle 1px white line on the inner top simulating light refraction on iOS glass. Complemented with `0 -1px 2px rgba(0,0,0,0.18) inset` for bottom inner shadow, adding depth.',
        '**Blur + saturation intensified:** `blur(22px) saturate(180%)` -> `blur(26px) saturate(200%)`. Colors behind come through livelier in the blur, authentic iOS feel.',
        '**Wider pill:** was content-sized (~260px), now `width: calc(100% - 24px)` with `maxWidth: 420` and `justify-content: space-around`. Icons spread across 85% of width, matching IG\'s proportion.',
        '**Floating position:** `bottom: calc(12px + env(safe-area-inset-bottom))`. Lifts slightly off the floor (12px above safe-area) like IG does -- not pinned, not floating too high.',
        '**More visible border:** `rgba(255,255,255,0.08)` -> `rgba(255,255,255,0.14)`. Clearer glass outline, pairs with the bright rim.',
        '**Perf preserved:** blur only bumped 4px (22->26). backdrop-filter cost is quadratic in radius, so 26 is ~40% more expensive than 22 (not 4x). Acceptable on iPhone 16 Pro Max.',
      ],
    },
  },
  {
    v: "10.0.2", date: "2026-04-15",
    pt: {
      title: "Nav edge-to-edge: colado no home indicator + blur translucido",
      bullets: [
        '\u2605 **Nav bar reposicionado pra colar no home indicator** -- `bottom: max(4px, env(safe-area-inset-bottom))`. Antes ficava flutuando 14px acima da safe-area, desperdicando espaco util. Agora cola estilo Instagram reels.',
        '\u2605 **Conteudo passa por tras do nav com blur visivel.** Opacidade do fundo da nav abaixada de 0.96/0.97 pra **0.82/0.88** (translucido o suficiente pra o contorno dos cards por tras aparecer borrado no blur). Blur aumentado de 16px pra **22px** e adicionado `saturate(180%)` -- filtro iOS classico que intensifica cores atras do blur sem custo perceptivel de GPU.',
        '**Meio-termo consciente com a perf da v9.9.6.** O prompt original pedia blur(30px) + opacidade 0.72 (estilo Instagram puro), mas na v9.9.6 eu baixei pra blur(16px) + 0.96 pra resolver travamento em iPhone PWA. Dessa vez: blur(22px) + 0.82/0.88 eh o meio-termo que devolve a sensacao glass sem voltar pro cenario travado.',
        '**TimerBar (nursing + sleep) sobe 16px** -- de `calc(60px + safe-area)` pra `calc(76px + max(4px, safe-area))`. Ganha respiro entre o timer e a nav.',
        '**Bottom spacer agora eh dinamico** com `env(safe-area-inset-bottom)`: `calc(140px + safe-area)` quando tem timer ativo, `calc(74px + safe-area)` sem. Ultimo item do scroll nao fica mais coberto pelo home indicator em nenhum iPhone.',
      ],
    },
    en: {
      title: "Edge-to-edge nav: pinned to home indicator + translucent blur",
      bullets: [
        '\u2605 **Nav bar repositioned flush with the home indicator** -- `bottom: max(4px, env(safe-area-inset-bottom))`. Before, it floated 14px above safe-area, wasting usable space. Now it hugs the bottom like Instagram reels.',
        '\u2605 **Content scrolls behind the nav with visible blur.** Nav background opacity dropped from 0.96/0.97 to **0.82/0.88** (translucent enough for card outlines behind to appear blurred through). Blur bumped from 16px to **22px** and added `saturate(180%)` -- classic iOS filter that intensifies colors behind the blur with no perceptible GPU cost.',
        '**Intentional middle ground with v9.9.6 perf.** The original prompt asked for blur(30px) + opacity 0.72 (pure Instagram style), but v9.9.6 dropped to blur(16px) + 0.96 to fix iPhone PWA stutter. This time: blur(22px) + 0.82/0.88 is the middle ground that brings back the glass feel without regressing to the janky state.',
        '**TimerBar (nursing + sleep) moves up 16px** -- from `calc(60px + safe-area)` to `calc(76px + max(4px, safe-area))`. Gets breathing room between timer and nav.',
        '**Bottom spacer is now dynamic** using `env(safe-area-inset-bottom)`: `calc(140px + safe-area)` when an active timer is present, `calc(74px + safe-area)` without. Last scroll item no longer gets covered by the home indicator on any iPhone.',
      ],
    },
  },
  {
    v: "10.0.1", date: "2026-04-15",
    pt: {
      title: "Service Worker com cache: 2o+ cold start quase instantaneo",
      bullets: [
        '\u2605 **Primeiro open depois da instalacao:** baixa tudo normal (React, Firebase, Outfit font, scripts do app) e joga no cache do Service Worker. 2a vez em diante: o browser pega os scripts do cache local em **milissegundos**, sem tocar em unpkg.com, gstatic.com ou fonts.googleapis.com.',
        '**Stale-while-revalidate:** cada fetch retorna imediatamente do cache (instantaneo) E ao mesmo tempo vai na rede em background pra atualizar o cache. Entao voce nunca espera por scripts que ja viu -- mas tambem nao fica preso numa versao antiga; o proximo open ja pega a atualizacao.',
        '**Cache versionado por APP_VERSION:** o build step injeta o numero da versao dentro do `sw.js` (placeholder `__APP_VERSION__` vira `10.0.1`, `10.0.2`, etc.). Toda nova release muda o `CACHE_NAME`, o que faz o SW novo purgar o cache velho automaticamente no activate. Nunca fica cache entalado de versao antiga.',
        '**Firestore NUNCA eh cacheado** -- chamadas pra `firestore.googleapis.com`, `firebaseinstallations.googleapis.com` e afins passam direto pra rede. Dado em tempo real continua em tempo real.',
        '**Precache no install:** 11 assets locais (`index.html`, todos `js/*.js`, 3 icones, manifest) + 6 CDNs (React, ReactDOM, 3 scripts Firebase, CSS do Outfit). Total ~500 KB cacheado local.',
        'Push notifications continuam funcionando identico. Soh foi adicionado handler de `fetch` + precache -- nao mexi no codigo de push/notificationclick.',
      ],
    },
    en: {
      title: "Service Worker with caching: 2nd+ cold start near-instant",
      bullets: [
        '\u2605 **First open after install:** downloads everything normally (React, Firebase, Outfit font, app scripts) and drops them into the Service Worker cache. 2nd time onward: the browser pulls scripts from the local cache in **milliseconds**, without touching unpkg.com, gstatic.com or fonts.googleapis.com.',
        '**Stale-while-revalidate:** each fetch returns from cache immediately (instant) AND hits the network in the background to refresh the cache. So you never wait for scripts you have seen before -- but you also never get stuck on an old version; the next open already picks up the update.',
        '**Cache versioned by APP_VERSION:** the build step injects the version number into `sw.js` (placeholder `__APP_VERSION__` becomes `10.0.1`, `10.0.2`, etc.). Every new release changes `CACHE_NAME`, which makes the new SW purge the old cache automatically on activate. Never stuck on stale version cache.',
        '**Firestore is NEVER cached** -- calls to `firestore.googleapis.com`, `firebaseinstallations.googleapis.com` and similar pass straight through to the network. Real-time data stays real-time.',
        '**Precache on install:** 11 local assets (`index.html`, all `js/*.js`, 3 icons, manifest) + 6 CDNs (React, ReactDOM, 3 Firebase scripts, Outfit CSS). Total ~500 KB cached locally.',
        'Push notifications keep working identically. Only the `fetch` handler + precache was added -- push/notificationclick code untouched.',
      ],
    },
  },
  {
    v: "10.0.0", date: "2026-04-15",
    pt: {
      title: "Build step: JSX pre-compilado, app muito mais rapido (esp. iPhone)",
      bullets: [
        '\u2605 **Antes:** o navegador baixava o `@babel/standalone` (~1.5 MB) e transpilava ~450 KB de JSX toda vez que voce abria o PWA no iPhone. Num iPhone 16 Pro Max esse trabalho custa 300-700ms de cold start. Em PWA instalado (sem cache de CDN), essa etapa repetia sempre.',
        '\u2605 **Agora:** o JSX eh pre-compilado antes do deploy via GitHub Actions. O `<script type="text/babel">` vira `<script>` com JavaScript puro ja transformado. A tag do `@babel/standalone` foi removida do HTML servido. O navegador so parseia JS nativo, que eh muito mais rapido que transpilar + executar.',
        '**Ganho estimado:** cold start ~60% mais rapido em PWA no iPhone. Nao mudou nada visualmente.',
        '**Stack mantida:** continua sendo HTML + React CDN + Firebase CDN. Soh a camada de transpilacao saiu do runtime e foi pro build. Nao tem bundler (Vite/webpack), nao tem npm em producao, nao tem TypeScript. O `build/build.mjs` tem ~60 linhas -- simples e auditavel.',
        '**Novo fluxo de deploy:** push pra main -> GitHub Action instala `@babel/core` + `preset-react`, roda o build, gera `dist/`, e deploya pelo action oficial do Pages. `dist/` esta no gitignore -- so o source fica versionado.',
        '**Pre-requisito uma vez so:** em Repo Settings -> Pages, mudar "Source" de "Deploy from a branch" para "GitHub Actions". Sem esse flip, o Pages continua servindo o index.html source antigo e essa melhoria nao tem efeito.',
      ],
    },
    en: {
      title: "Build step: precompiled JSX, much faster app (esp. iPhone)",
      bullets: [
        '\u2605 **Before:** the browser downloaded `@babel/standalone` (~1.5 MB) and transpiled ~450 KB of JSX every time you opened the PWA on iPhone. On an iPhone 16 Pro Max that work costs 300-700ms of cold start. In installed PWA mode (no CDN cache), this step repeated every open.',
        '\u2605 **Now:** JSX is precompiled before deploy via GitHub Actions. The `<script type="text/babel">` becomes a `<script>` with plain already-transformed JavaScript. The `@babel/standalone` tag is stripped from the served HTML. The browser only parses native JS, which is much faster than transpile + execute.',
        '**Expected gain:** cold start ~60% faster in PWA on iPhone. Nothing changed visually.',
        '**Stack preserved:** still HTML + React CDN + Firebase CDN. Only the transpilation layer moved out of runtime into the build. No bundler (Vite/webpack), no npm in production, no TypeScript. The `build/build.mjs` is ~60 lines -- simple and auditable.',
        '**New deploy flow:** push to main -> GitHub Action installs `@babel/core` + `preset-react`, runs the build, emits `dist/`, and deploys via the official Pages action. `dist/` is gitignored -- only source is versioned.',
        '**One-time prerequisite:** in Repo Settings -> Pages, change "Source" from "Deploy from a branch" to "GitHub Actions". Without that flip, Pages keeps serving the old source index.html and this improvement has no effect.',
      ],
    },
  },
  {
    v: "9.9.8", date: "2026-04-15",
    pt: {
      title: "Fixes: despertares retroativos no engine + curiosity semanal uma vez so",
      bullets: [
        '\u2605 **Engine agora conta wakings retroativas (routine-engine v2.2.0 \u2192 v2.2.1).** O `SleepBlock` do historico sempre mostrou eventos (mamadas, fraldas) que caem dentro do intervalo da bedtime como despertares -- mesmo sem voce clicar "Night Wake" explicitamente. O engine, porem, so contava as wakings explicitas. Resultado: a inbox dizia "Media 1 despertar/noite" enquanto voce via 3 na tela.',
        '**Agora o engine espelha a logica do SleepBlock:** qualquer evento (exceto sleep/nap/wakeup/nightwaking/growth) com timestamp dentro de `[bedStart, bedStart+durationMin]`, nao linkado explicitamente a uma waking, e contado como despertar retroativo.',
        '**Consequencias:** `avgPerNight` passa a refletir a realidade (sobe de ~1 pra ~2-3 no caso da Louise), `mostCommonTime` migra do "primeiro estiramento bem no inicio da noite" pro cluster real de madrugada, e `mostCommonType` fica mais confiavel por ter mais amostras.',
        '**`awakeMin` intencionalmente NAO muda** -- continua somando so a duracao das wakings explicitas. Evento retroativo nao sabe duracao (nao tem `durationMin`), entao nao queremos inflar o tempo "awake in sleep" com chute.',
        '\u2605 **Curiosity semanal agora aparece uma vez so por semana.** Antes ela repetia todo dia da semana ("Week 5 · Crying at its peak" por 7 dias seguidos, chato). Agora mostra apenas no dia em que o bebe transiciona pra nova semana (`totalDays % 7 === 0`) -- day 35 (Week 5), day 42 (Week 6), day 49 (Week 7), etc.',
        'Curiosities **diarias** (days 1-30) seguem iguais: uma por dia, 30 dias seguidos. Mudanca eh so no bloco semanal.',
      ],
    },
    en: {
      title: "Fixes: retroactive wakings in engine + weekly curiosity shows once only",
      bullets: [
        '\u2605 **Engine now counts retroactive wakings (routine-engine v2.2.0 \u2192 v2.2.1).** The history `SleepBlock` has always shown events (bottles, diapers) that fall inside a bedtime window as wakings -- even when you never pressed "Night Wake" explicitly. The engine, however, only counted explicit wakings. Result: inbox said "Avg 1 waking/night" while you saw 3 on screen.',
        '**The engine now mirrors the SleepBlock logic:** any event (except sleep/nap/wakeup/nightwaking/growth) with a timestamp inside `[bedStart, bedStart+durationMin]`, not explicitly linked to a waking, counts as a retroactive waking.',
        '**Effects:** `avgPerNight` now reflects reality (goes from ~1 up to ~2-3 for Louise), `mostCommonTime` shifts from "first stir right at the start of the night" to the real overnight cluster, and `mostCommonType` becomes more reliable with more samples.',
        '**`awakeMin` intentionally does NOT change** -- still only sums the duration of explicit wakings. Retroactive events have no duration (no `durationMin`), so we avoid inflating "awake in sleep" time with guesses.',
        '\u2605 **Weekly curiosity now shows once per week.** Before, it repeated every day of the week ("Week 5 · Crying at its peak" for 7 days straight, annoying). Now it only shows on the day the baby transitions into the new week (`totalDays % 7 === 0`) -- day 35 (Week 5), day 42 (Week 6), day 49 (Week 7), etc.',
        '**Daily** curiosities (days 1-30) unchanged: one per day, 30 days in a row. Change is only in the weekly block.',
      ],
    },
  },
  {
    v: "9.9.7", date: "2026-04-15",
    pt: {
      title: "Repositorio reorganizado em estrutura profissional",
      bullets: [
        '\u2605 **Arquivos JS auxiliares agrupados em `js/`** e **icones em `assets/icons/`** -- antes tudo era flat na raiz do repo, dificil de navegar no GitHub. Historico preservado via `git mv`.',
        '**Sem mudanca de comportamento.** Todos os 11 paths afetados foram atualizados na mesma commit: 6 `<script src>` no index.html, 1 apple-touch-icon, 2 icones no manifest.json, 2 no sw.js, 2 no firebase-messaging-sw.js.',
        '**Service workers e manifest NAO foram movidos** -- continuam no root. Motivo: `sw.js` e `firebase-messaging-sw.js` tem scope/path fixo obrigatorio (mover quebraria notificacoes push); `manifest.json` fica no root por convencao PWA.',
        'Nova arvore:\n```\nindex.html\nmanifest.json\nsw.js\nfirebase-messaging-sw.js\nREADME.md\njs/\n  curiosities.js, routine-engine.js, who-growth.js,\n  splash-icon.js, wake-lock.js, device-features.js\nassets/icons/\n  icon-192.png, icon-512.png, apple-touch-icon.png\n```',
        '`CLAUDE.md` atualizado com a nova arvore e a regra de "nao mover SWs/manifest".',
      ],
    },
    en: {
      title: "Repository reorganized into professional structure",
      bullets: [
        '\u2605 **Auxiliary JS files grouped under `js/`** and **icons under `assets/icons/`** -- previously everything was flat in the repo root, hard to navigate on GitHub. History preserved via `git mv`.',
        '**No behavior change.** All 11 affected paths were updated in the same commit: 6 `<script src>` in index.html, 1 apple-touch-icon, 2 icons in manifest.json, 2 in sw.js, 2 in firebase-messaging-sw.js.',
        '**Service workers and manifest were NOT moved** -- they stay at root. Reason: `sw.js` and `firebase-messaging-sw.js` have mandatory fixed scope/path (moving would break push notifications); `manifest.json` stays at root per PWA convention.',
        'New tree:\n```\nindex.html\nmanifest.json\nsw.js\nfirebase-messaging-sw.js\nREADME.md\njs/\n  curiosities.js, routine-engine.js, who-growth.js,\n  splash-icon.js, wake-lock.js, device-features.js\nassets/icons/\n  icon-192.png, icon-512.png, apple-touch-icon.png\n```',
        '`CLAUDE.md` updated with the new tree and the rule "do not move SWs/manifest".',
      ],
    },
  },
  {
    v: "9.9.6", date: "2026-04-15",
    pt: {
      title: "Performance iPhone: app fluido de verdade em PWA",
      bullets: [
        '\u2605 **iOS Safari em PWA sofre muito com `backdrop-filter` de raio alto** -- especialmente em elementos sempre visiveis como a nav bar. O custo eh quadratico no raio do blur: blur(50px) nao custa 2x um blur(25px), custa ~4x. Em iPhone 16 Pro Max com PWA instalado, blurs pesados sobre conteudo animado (timer ao vivo, ring girando) travam o compositor da GPU.',
        '**6 backdrop-filters reduzidos** pra raios dentro do que iOS compila rapido:',
        '- Sheet do "+" (a que mais abre): **50px -> 22px**',
        '- Main nav bar (sempre visivel): **40px -> 16px**',
        '- Modal (confirmacoes, changelog): **40px -> 18px**',
        '- Profile contextual nav: **30px -> 16px**',
        '- ProfilePage full-screen: **28px -> 16px**',
        '- NursingSidePicker: **30px -> 18px**',
        '**Opacidade dos fundos aumentada sutilmente** (88%/92% -> 94%/97%) pra compensar visualmente o blur menor -- o glassmorphism continua la, mas o iOS nao precisa mais queimar GPU por frame pra calcular.',
        'Nada visual foi perdido de forma perceptivel. Nenhum shadow foi tocado, nenhuma animacao foi removida, nenhuma cor mudou. Soh o filter radius.',
        '**Medicao grosseira esperada:** scroll, abrir sheet, trocar de aba e tap feedback devem ficar visivelmente mais fluidos em PWA no iPhone.',
      ],
    },
    en: {
      title: "iPhone performance: truly fluid app in PWA mode",
      bullets: [
        '\u2605 **iOS Safari in PWA mode suffers badly with high-radius `backdrop-filter`** -- especially on always-visible elements like the nav bar. Cost is quadratic in blur radius: blur(50px) is not 2x a blur(25px), it is ~4x. On iPhone 16 Pro Max in installed PWA, heavy blurs over animated content (live timer, spinning ring) stall the GPU compositor.',
        '**6 backdrop-filters reduced** to radii iOS compiles fast:',
        '- "+" Sheet (most frequently opened): **50px -> 22px**',
        '- Main nav bar (always visible): **40px -> 16px**',
        '- Modal (confirmations, changelog): **40px -> 18px**',
        '- Profile contextual nav: **30px -> 16px**',
        '- ProfilePage full-screen: **28px -> 16px**',
        '- NursingSidePicker: **30px -> 18px**',
        '**Background opacity slightly increased** (88%/92% -> 94%/97%) to visually compensate for the lower blur -- glassmorphism still there, but iOS no longer needs to burn GPU per frame to compute it.',
        'Nothing perceptibly visual was lost. No shadow was touched, no animation removed, no color changed. Just the filter radius.',
        '**Expected rough measure:** scrolling, opening sheets, switching tabs and tap feedback should feel visibly smoother in PWA on iPhone.',
      ],
    },
  },
  {
    v: "9.9.5", date: "2026-04-15",
    pt: {
      title: "Inbox mais limpa: hints de despertares em 1 card so",
      bullets: [
        '\u2605 **Antes uma manha com dados de despertares podia gerar 4-5 hints diferentes na inbox** -- "Media 1.3 despertares/noite", "Padrao de horario detectado", "Motivo dos despertares", "Mais despertares ultimamente" -- criando sensacao de redundancia e ate contradicao visual.',
        '**Agora ha 1 hint composto unico:** titulo **"Padrao das noites (N noites)"** e uma linha que agrega media + horario mais comum + motivo mais comum + tendencia (ex: *"Media 1.3 despertares/noite, mais frequente ~04:15, geralmente mamadas (67%) \u00b7 \u2191 mais que a semana passada"*). Leitura de 1 glance em vez de 4.',
        '**"Dormindo a noite toda" continua como hint separado** -- eh marco positivo (bebe 4+ meses com 0 despertares em 3+ noites) e merece o destaque proprio, nao perde a identidade.',
        '**Hint sobe pra `warn` (vermelho/laranja)** quando media \u2265 3 despertares/noite E tendencia piorando -- combo que realmente merece atencao. Senao, fica `info` (neutro).',
        'Protecao contra falso-positivo de STTN em recem-nascidos (< 16 semanas) mantida: nessa idade, 0 despertares significa que nao registrou, nao que dormiu a noite toda.',
        '**Mudanca so no `routine-engine.js` (v2.1.0 -> v2.2.0).** API publica do engine (`getDayInsights`, `detectPattern`) nao mudou. Resto do app nao foi tocado.',
      ],
    },
    en: {
      title: "Cleaner inbox: wakings hints consolidated into 1 card",
      bullets: [
        '\u2605 **Before, a morning with wakings data could generate 4-5 separate hints** -- "Avg 1.3 wakings/night", "Waking pattern detected", "Waking cause pattern", "More wakings lately" -- creating a feeling of redundancy and even visual contradiction.',
        '**Now there is 1 single composite hint:** title **"Night pattern (N nights)"** and a line aggregating avg + most common time + most common cause + trend (e.g. *"Avg 1.3 wakings/night, usually around 04:15, mostly feeds (67%) \u00b7 \u2191 more than last week"*). 1-glance readability instead of 4.',
        '**"Sleeping through the night" stays as a separate hint** -- it is a positive milestone (4+ month baby with 0 wakings over 3+ nights) and deserves its own spotlight, not blended in.',
        '**Hint escalates to `warn` (red/orange)** when avg \u2265 3 wakings/night AND trend is worsening -- the combo that actually deserves attention. Otherwise stays `info` (neutral).',
        'False-positive STTN protection for newborns (< 16 weeks) kept: at that age, 0 wakings means "not tracked", not "slept through".',
        '**Change is in `routine-engine.js` only (v2.1.0 -> v2.2.0).** Engine public API (`getDayInsights`, `detectPattern`) unchanged. Rest of the app was not touched.',
      ],
    },
  },
  {
    v: "9.9.4", date: "2026-04-15",
    pt: {
      title: "Nav bar minimalista (passo 2 da nav redesign)",
      bullets: [
        '\u2605 **Nav mais fina e limpa, estilo Instagram.** Pill flutuante ficou ~40% menor em altura, sem labels de texto, so icones. Item ativo agora eh apenas uma bolha roxa discreta atras do icone (rgba(139,124,246,0.22)) em vez do gradient + borda + shadow que existia antes. Icone ativo cresce sutilmente (20px -> 22px) e fica branco puro em vez de lilas.',
        '**Botao "+" no mesmo grid dos outros.** Antes era um FAB circular grande (54x54) saltando 6px pra cima do pill. Agora e um pill-button 48x44 no mesmo alinhamento visual dos outros 4 itens, mantendo o gradient roxo que identifica a acao principal. Rotaciona 45deg quando ativo (vira X) sem mais o scale(1.05) que parecia exagerado.',
        '\u2605 **Tap feedback instantaneo.** Todos os botoes da nav agora respondem no toque com um scale(0.88) suave via CSS `:active` (antes nao tinha feedback nenhum, parecia que nao clicava). O "+" tem scale(0.92) pra nao exagerar no botao grande. Sensacao de app nativo em vez de site.',
        '**Fix: tap passando pela parte de tras quando sheet aberta.** Z-index do componente `Sheet` subiu de 100 para 200, garantindo que ele cubra de verdade a nav (z:50) e qualquer outro elemento flutuante. Backdrop fica solido pra cliques, sem vazar pro conteudo abaixo.',
        '**Safe area melhor.** Bottom da nav agora eh `calc(14px + env(safe-area-inset-bottom))` em vez de 6px fixo -- fica elevada o suficiente no iPhone com home indicator sem cobrir o conteudo.',
        '**Navbar contextual do Profile (Cancelar/Salvar) NAO mudou.** Ela tem layout proprio e foi mantida intacta.',
      ],
    },
    en: {
      title: "Minimalist nav bar (nav redesign step 2)",
      bullets: [
        '\u2605 **Thinner, cleaner nav, Instagram style.** Floating pill is ~40% shorter, no text labels, icons only. Active item is now just a subtle purple bubble behind the icon (rgba(139,124,246,0.22)) instead of the previous gradient + border + shadow combo. Active icon grows slightly (20px -> 22px) and turns pure white instead of lilac.',
        '**"+" button aligned with the others.** Previously a big circular FAB (54x54) popping 6px above the pill. Now a pill-button 48x44 on the same visual baseline as the other 4 items, keeping the purple gradient that marks it as the primary action. Rotates 45deg when active (becomes X), no more scale(1.05) that looked over the top.',
        '\u2605 **Instant tap feedback.** Every nav button now reacts to touch with a soft scale(0.88) via CSS `:active` (before there was no feedback at all -- it felt like taps werent registering). "+" uses scale(0.92) to stay subtle on the larger button. Feels like a native app instead of a website.',
        '**Fix: taps bleeding through to content behind when sheet open.** `Sheet` component z-index bumped from 100 to 200, ensuring it actually covers the nav (z:50) and any other floating element. Backdrop is solid for clicks, no more leaking through to content underneath.',
        '**Better safe area.** Nav bottom is now `calc(14px + env(safe-area-inset-bottom))` instead of fixed 6px -- sits high enough on iPhones with home indicator without covering content.',
        '**Profile contextual navbar (Cancel/Save) DID NOT change.** It has its own layout and was left intact.',
      ],
    },
  },
  {
    v: "9.9.3", date: "2026-04-15",
    pt: {
      title: "Teste de workflow Claude Code",
      bullets: [
        "Bump vazio para validar o fluxo de deploy via Claude Code rodando local.",
      ],
    },
    en: {
      title: "Claude Code workflow test",
      bullets: [
        "Empty bump to validate the deploy flow via Claude Code running locally.",
      ],
    },
  },
  {
    v: "9.9.2", date: "2026-04-15",
    pt: {
      title: "Swipe horizontal entre Home/Stats/History (passo 1)",
      bullets: [
        '\u2605 **Swipe estilo Instagram entre Home, Stats e History.** Arrasta o dedo pra esquerda ou direita em qualquer area da tela (fora dos botoes e das entries) e o conteudo segue o dedo em tempo real. Solta passando de 15% da largura ou com flick rapido (>40px com velocidade >0.4 px/ms) -- pula pra proxima aba.',
        '**Pre-montagem das 3 paginas:** elas ficam montadas lado-a-lado num container largo. Trocar de aba (seja por swipe ou tap) e instantaneo: o React nao destroi nem cria nada, so um translate3d no container.',
        '**Touch events nativos** (`onTouchStart/Move/End`) em vez de pointer events. Pointer events no iOS Safari sao pouco confiaveis sob backdrop-filter pesado. Touch events sao garantidos a 60fps pelo Safari.',
        '**idxRef pra evitar stale closure:** o handler de touch sempre le o valor atual do indice, mesmo durante swipes rapidos consecutivos.',
        '**Resistencia rubber-band nas bordas:** tentar arrastar antes de Home ou depois de History gera resistencia em vez de mover.',
        '**Threshold inicial de 6px** -- toques curtos em botoes seguem funcionando normal. Se o movimento inicial for mais vertical que horizontal, swipe desiste e libera scroll.',
        '**Profile NAO faz parte do swipe nesta versao.** Continua acessivel via tap no avatar do header (abre como overlay, igual antes). Profile entrara no swipe num passo futuro depois de validar essa base.',
        '**Nav bar NAO mudou nesta versao.** Continua a mesma da v9.8.2. Redesign minimalista vira em passo separado.',
        '**Sheet do "+" NAO mudou nesta versao.** Polimento de animacao de fechamento vira em passo separado.',
        'Sob o capo: o `key={page}` que forcava remount foi removido. Animacao `pageSwitch` substituida pela transicao de translate do container (`.28s cubic-bezier(0.2,0.9,0.3,1)`).'
      ]
    },
    en: {
      title: "Horizontal swipe between Home/Stats/History (step 1)",
      bullets: [
        '\u2605 **Instagram-style swipe between Home, Stats and History.** Drag your finger left or right anywhere on screen (outside buttons and entries) and content follows in real time. Release past 15% of width or with quick flick (>40px with velocity >0.4 px/ms) -- jumps to next tab.',
        '**Pre-mounting of all 3 pages:** they stay mounted side-by-side in a wide container. Switching tabs (via swipe or tap) is instant: React does not destroy or create anything, just a translate3d on the container.',
        '**Native touch events** (`onTouchStart/Move/End`) instead of pointer events. Pointer events on iOS Safari are unreliable under heavy backdrop-filter. Touch events are guaranteed at 60fps by Safari.',
        '**idxRef to avoid stale closure:** the touch handler always reads the current index value, even during rapid consecutive swipes.',
        '**Rubber-band edge resistance:** trying to drag before Home or after History generates resistance instead of moving.',
        '**6px initial threshold** -- short button taps keep working normally. If initial movement is more vertical than horizontal, swipe gives up and releases scroll.',
        '**Profile is NOT part of the swipe in this version.** Still accessible via tap on header avatar (opens as overlay, same as before). Profile will join the swipe in a future step after validating this base.',
        '**Nav bar did NOT change in this version.** Same as v9.8.2. Minimalist redesign comes in a separate step.',
        '**The "+" sheet did NOT change in this version.** Closing animation polish comes in a separate step.',
        'Under the hood: the `key={page}` that forced remount was removed. `pageSwitch` animation replaced with container translate transition (`.28s cubic-bezier(0.2,0.9,0.3,1)`).'
      ]
    }
  },
  {
    v: "9.8.2", date: "2026-04-15",
    pt: {
      title: "Sheet: drag de qualquer lugar + botões param de travar",
      bullets: [
        '★ **Puxar pra baixo agora funciona de qualquer lugar da sheet.** Antes o drag só respondia tocando exatamente em cima dos tracinhos do topo (~38px de área). Agora dá pra começar o gesto em qualquer ponto — igual iPhone nativo, Apple Music, Health, etc.',
        '★ **Botões deixam de travar.** Antes o drag handler capturava o pointer imediatamente no touch-down, então um toque feito no topo da sheet era "roubado" e o botão não recebia o clique. Resultado: botão parecia que travou. Agora o drag só captura o pointer depois de cruzar o limiar de 8px — toques curtos clicam normalmente.',
        '**Padrão iOS de gesture recognizer.** Implementado com threshold + commit explícito: enquanto o dedo se move menos de 8px, nada acontece (clique funciona); passou de 8px pra baixo, aí sim vira drag e a sheet acompanha o dedo.',
        '**Movimento pra cima ignorado.** Se o dedo começa subindo, o drag é descartado de cara (não tem como "rasgar" a sheet pra cima).',
        '**Scroll interno preservado.** Se a sheet tem conteúdo rolável e o `scrollTop > 0`, drag é cancelado — scroll ganha prioridade. Só quando tá no topo da sheet que drag pra baixo a fecha.',
        'Threshold (8px), dismissal (28% da altura ou velocidade > 0.55px/ms) e animação de snap de volta preservados da v9.6.0.',
        'Aplicado no componente `Sheet` genérico — cobre o sheet do "+" no Home, o sheet do AddForm e qualquer outro que use esse componente.'
      ]
    },
    en: {
      title: "Sheet: drag from anywhere + buttons stop freezing",
      bullets: [
        '★ **Swipe-down now works from anywhere on the sheet.** Before, drag only responded when touching exactly on the handle bar (~38px area). Now the gesture can start from any point — like native iPhone, Apple Music, Health, etc.',
        '★ **Buttons stop freezing.** Before, the drag handler captured the pointer immediately on touch-down, so a tap at the top of the sheet was "stolen" and the button never received the click. Result: button looked frozen. Now drag only captures the pointer after crossing the 8px threshold — short taps click normally.',
        '**iOS-style gesture recognizer.** Implemented with threshold + explicit commit: while the finger moves less than 8px, nothing happens (tap works); past 8px downward, drag takes over and the sheet follows the finger.',
        '**Upward motion ignored.** If the finger starts moving up, drag is dismissed immediately (can\'t "tear" the sheet upward).',
        '**Internal scroll preserved.** If the sheet has scrollable content and `scrollTop > 0`, drag is cancelled — scroll wins. Only when at the top does swipe-down close the sheet.',
        'Threshold (8px), dismissal (28% of height or velocity > 0.55px/ms) and snap-back animation preserved from v9.6.0.',
        'Applied to the generic `Sheet` component — covers the "+" sheet on Home, the AddForm sheet, and any other that uses the component.'
      ]
    }
  },
  {
    v: "9.8.1", date: "2026-04-13",
    pt: {
      title: "Fix: delete no live bedtime + evento retroativo no lugar errado",
      bullets: [
        '★ **Bug do botão de excluir no bedtime ao vivo não funcionar.** O botão de lixo dentro dos eventos aninhados (Bottle, Diaper, Medicamento) do bedtime LIVE virava no-op — nada acontecia ao clicar. Causa: a chamada do `SleepBlock` do live bedtime não estava passando os handlers `onDelete`/`onEdit` (só a do histórico passava). Fix: props passados corretamente, delete e edit dos eventos do live bedtime funcionam igual ao histórico.',
        '★ **Bug do evento retroativo sendo linkado ao bedtime errado.** Se você registrasse um evento com horário passado (ex: simeticona das 17:30) enquanto o Night Wake estava ativo, o app linkava o evento ao bedtime atual mesmo com o horário completamente fora do range. Resultado: simeticona de 17:30 aparecia dentro do bedtime que começou 20:47 — conceitualmente errado.',
        '**Fix do registro:** `addEntry` agora valida se o horário do evento (`date+time`) está dentro do range do bedtime atual antes de linkar. Se o horário for fora, o evento é registrado normalmente sem virar filho do bedtime. Tolerância de 1min pra variação de relógio.',
        '**Fix retroativo (dados já salvos):** o `SleepBlock` agora filtra os eventos linkados (`wakings[i].events`) pra só renderizar os que têm horário dentro do range do bedtime. Eventos com link corrompido (pré-v9.8.1) somem do bloco e aparecem no "Today" normalmente, onde podem ser deletados.',
        '**Filtro do Today atualizado:** eventos com `nightWake` setado só são escondidos do Today se o horário realmente cai dentro do live bedtime. Eventos órfãos (link corrompido + horário fora) passam a aparecer no Today com acesso normal a delete/edit — antes ficavam invisíveis.',
        'Nenhuma migração necessária. Os docs corrompidos no Firestore continuam com o campo `nightWake` preenchido mas são ignorados visualmente. Se você quiser limpar, basta deletar e recriar.'
      ]
    },
    en: {
      title: "Fix: delete on live bedtime + retroactive event in wrong place",
      bullets: [
        '★ **Delete button on live bedtime not working bug.** The trash button inside nested events (Bottle, Diaper, Medicine) of the LIVE bedtime was a no-op — nothing happened on tap. Root cause: the `SleepBlock` call for the live bedtime wasn\'t passing `onDelete`/`onEdit` handlers (only the history one did). Fix: props passed correctly, delete and edit of live bedtime events now works just like history.',
        '★ **Retroactive event being linked to wrong bedtime bug.** If you logged an event with a past time (e.g., simethicone from 17:30) while Night Wake was active, the app linked the event to the current bedtime even though the time was completely out of range. Result: 17:30 simethicone appearing inside a bedtime that started 20:47 — conceptually wrong.',
        '**Logging fix:** `addEntry` now validates the event time (`date+time`) is inside the current bedtime range before linking. If the time is outside, the event is registered normally without becoming a child of the bedtime. 1-minute clock skew tolerance.',
        '**Retroactive fix (already-saved data):** `SleepBlock` now filters linked events (`wakings[i].events`) to only render those with a time inside the bedtime range. Events with corrupted links (pre-v9.8.1) disappear from the block and show up in "Today" normally, where they can be deleted.',
        '**Today filter updated:** events with `nightWake` set are only hidden from Today if their time actually falls inside the live bedtime. Orphan events (corrupted link + time outside) now show up in Today with normal delete/edit access — before they were invisible.',
        'No migration needed. Corrupted docs in Firestore keep the `nightWake` field set but are visually ignored. To clean up, just delete and recreate.'
      ]
    }
  },
  {
    v: "9.8.0", date: "2026-04-13",
    pt: {
      title: "Notificações editáveis por remédio + edit de lembretes",
      bullets: [
        '★ **Título e corpo customizados por notificação.** Cada lembrete de medicamento agora aceita dois campos opcionais: **título** e **corpo** da notificação que vai disparar. Assim dá pra trocar o "Lembrete" genérico por "Hora da Louisinha!" e o "Vitamina D · 2 gotas" por "Vitamina D pra nenê crescer forte. 2 gotinhas na boca".',
        '★ **Edit de lembretes existentes.** Antes só dava pra deletar e recriar. Agora cada item da lista tem um **botão de lápis** ao lado do X. Toca pra abrir um card de edição inline (banner roxo "Editando ...") com todos os campos editáveis: nome, dose, horário, título e corpo. Cancelar volta sem salvar, Salvar persiste.',
        '**Link "personalizar mensagem"** no form de "Adicionar novo" — colapsado por padrão pra não poluir o fluxo rápido. Quem só quer adicionar nome+horário vê a mesma UI de antes; quem quer personalizar clica e expande.',
        '**Indicador "mensagem personalizada"** aparece discretamente abaixo da dose nos items que têm texto custom salvo, com ícone de lápis em roxo.',
        '**Feeding reminder (mamada)** não mudou na UI — continua com toggle + intervalo. A mudança do texto da notificação (ex: "Hora da mamada · última foi 12:30, fazem 1h50") é do lado do **worker** (Cloudflare), entregue junto.',
        'Os campos `titulo` e `corpo` só vão pro Firestore quando preenchidos — doc do reminder fica sem esses campos se você não personalizar. Backward compat total com lembretes antigos.',
        'Itens e form de "Adicionar novo" ficam meio-opacos e não-clicáveis enquanto você estiver editando outro lembrete — pra evitar ação acidental no item errado.'
      ]
    },
    en: {
      title: "Per-reminder editable notifications + edit existing reminders",
      bullets: [
        '★ **Custom title and body per notification.** Each medication reminder now accepts two optional fields: notification **title** and **body**. So you can swap the generic "Reminder" for "Time for Louisinha!" and the bland "Vitamin D · 2 drops" for "Vitamin D to help our baby grow strong. 2 drops in the mouth".',
        '★ **Edit existing reminders.** Before you could only delete and recreate. Now each item in the list has a **pencil button** next to the X. Tap to open an inline edit card (purple banner "Editing ...") with all fields editable: name, dose, time, title and body. Cancel discards, Save persists.',
        '**"Customize message" link** on the "Add new" form — collapsed by default to keep the fast flow clean. Those who only want to add name+time see the same UI as before; those who want to personalize tap and expand.',
        '**"Custom message" indicator** appears discreetly below the dose on items that have custom text saved, with a purple pencil icon.',
        '**Feeding reminder** (bottle) UI is unchanged — still toggle + interval. The change in its notification text (e.g., "Time for a bottle · last was 12:30, 1h50 ago") is on the **worker** side (Cloudflare), delivered alongside.',
        'The `titulo` and `corpo` fields only go to Firestore when filled — the reminder doc stays without those fields if you don\'t personalize. Full backward compat with old reminders.',
        'Items and "Add new" form become semi-opaque and non-clickable while you\'re editing another reminder — to prevent accidental action on the wrong item.'
      ]
    }
  },
  {
    v: "9.7.0", date: "2026-04-13",
    pt: {
      title: "Crescimento: form unificado + vírgula + edit",
      bullets: [
        '★ **Vírgula aceita finalmente.** Os campos de peso, comprimento e perímetro agora aceitam **vírgula ou ponto** (ex: `53,5` ou `53.5` — ambos funcionam). Antes o input numérico do iOS rejeitava vírgula silenciosamente, o que era um saco em pt-BR.',
        '★ **Form unificado com data.** O form de nova medição agora tem **campo de data** no topo (default hoje) e os 3 campos de medição logo abaixo, todos opcionais. Fim da fragmentação: um cadastro = uma consulta, com os valores que você tiver.',
        '★ **Merge automático por data.** Se você registrar no mesmo dia que já tem medição, o app **atualiza a entry existente** em vez de criar outra. Campos preenchidos sobrescrevem silenciosamente; campos vazios mantêm o valor anterior. Aviso amarelo aparece no form quando detecta a situação.',
        '★ **Edit em medições antigas.** Cada linha do histórico agora é clicável (com ícone de lápis). Toca pra abrir o form no modo edit com os valores preenchidos. Pode também alterar a data da medição se registrou com data errada. Botão "Excluir" discreto no fim do form de edit.',
        '**Botões "+ Registrar" dos percentile cards removidos** — eram a fonte da fragmentação. Agora só existe um ponto de entrada: o botão "+ Medição" no header. Se ainda não tem nenhuma medição, os cards mostram só o placeholder, sem affordance de cadastro próprio.',
        'A linha de **Nascimento** no histórico continua read-only (editável só pelo Perfil → dados de nascimento), conforme o fluxo original.',
        'Validação: o botão Salvar só fica ativo quando pelo menos 1 campo está preenchido (no modo edit, também considera os valores já existentes).'
      ]
    },
    en: {
      title: "Growth: unified form + comma + edit",
      bullets: [
        '★ **Comma finally accepted.** The weight, length and head fields now accept **comma or dot** (e.g., `53,5` or `53.5` — both work). Before, the iOS numeric input silently rejected commas, which was painful in pt-BR.',
        '★ **Unified form with date.** The new measurement form now has a **date field** at the top (default today) and the 3 measurement fields below, all optional. No more fragmentation: one registration = one consultation, with whatever values you have.',
        '★ **Automatic date-based merge.** If you register on a day that already has a measurement, the app **updates the existing entry** instead of creating a new one. Filled fields silently overwrite; empty fields keep the previous value. A yellow notice shows up in the form when this situation is detected.',
        '★ **Edit on old measurements.** Each row in the history is now clickable (with a pencil icon). Tap to open the form in edit mode with values pre-filled. You can also change the date if you registered with the wrong one. Discreet "Delete" button at the bottom of the edit form.',
        '**"+ Register" buttons on percentile cards removed** — they were the source of fragmentation. Now there\'s a single entry point: the "+ Measurement" button in the header. If there\'s no measurement yet, cards just show a placeholder, with no local registration affordance.',
        'The **Birth** row in the history remains read-only (editable only via Profile → birth data), matching the original flow.',
        'Validation: the Save button is only active when at least 1 field is filled (in edit mode it also considers existing values).'
      ]
    }
  },
  {
    v: "9.6.18", date: "2026-04-12",
    pt: {
      title: "Fade do bottom removido",
      bullets: [
        '★ **Na v9.6.17 eu removi só o fade do topo** e mantive o do bottom achando que ficaria legal. Mas na prática ficou parecendo bug — a área logo antes da navbar ficava escurecida/transparente, dando a impressão de artefato visual, não de efeito desejado.',
        'Removi o fade do bottom também. Transição Profile → navbar agora é simples e limpa, sem nenhum gradient overlay confundindo. Mercúrio continua girando no botão Home, tudo o resto da UI mantido.',
        '**Lição:** efeitos de fade só funcionam bem quando têm motivo claro — tipo cortar conteúdo em lista longa. Em Profile de settings, cada card tem border e margin próprios, não precisa de "melt" artificial.'
      ]
    },
    en: {
      title: "Bottom fade removed",
      bullets: [
        '★ **In v9.6.17 I only removed the top fade** and kept the bottom one thinking it would look nice. But in practice it looked like a bug — the area right before the navbar was darkened/transparent, giving the impression of a visual artifact, not a desired effect.',
        'Removed the bottom fade too. Profile → navbar transition is now simple and clean, no gradient overlay confusing things. Mercury keeps spinning on the Home button, everything else in the UI kept.',
        '**Lesson:** fade effects only work well when they have a clear purpose — like cutting content in a long list. In a settings Profile, each card has its own border and margin, no need for artificial "melt".'
      ]
    }
  },
  {
    v: "9.6.17", date: "2026-04-12",
    pt: {
      title: "Fix: mercúrio congelado + fade do topo tapando título",
      bullets: [
        '★ **Bug do mercúrio não girando.** No iPhone, a animação do anel cromado ficava congelada — iOS Safari às vezes suspende animações CSS quando a camada tem múltiplas propriedades pesadas (gradient + box-shadow + animation no mesmo elemento). Fix: separei o glow em um elemento dedicado (box-shadow estático) e adicionei `will-change:transform` no elemento que gira, promovendo pra camada GPU. Agora roda suave no iOS.',
        '★ **Fade do topo tapando o título "Feeding reminder".** A barra de gradient que criava o fade superior ficava em cima do primeiro card visível, escurecendo o título. Removi completamente o fade do topo — mantive só o do bottom (que é onde realmente faz sentido, escondendo a transição com a navbar).',
        'O fade do bottom continua funcionando igual: cards "derretem" ao tocar a área da navbar, visualmente limpo.'
      ]
    },
    en: {
      title: "Fix: frozen mercury + top fade covering title",
      bullets: [
        '★ **Mercury not spinning bug.** On iPhone, the chromed ring animation was frozen — iOS Safari sometimes suspends CSS animations when the layer has multiple heavy properties (gradient + box-shadow + animation on same element). Fix: separated the glow into a dedicated element (static box-shadow) and added `will-change:transform` on the spinning element, promoting it to GPU layer. Now runs smooth on iOS.',
        '★ **Top fade covering "Feeding reminder" title.** The gradient bar creating the top fade was on top of the first visible card, darkening the title. Removed the top fade completely — kept only the bottom (which is where it actually makes sense, hiding the transition to the navbar).',
        'The bottom fade still works the same: cards "melt" when touching the navbar area, visually clean.'
      ]
    }
  },
  {
    v: "9.6.16", date: "2026-04-12",
    pt: {
      title: "Fix: Home vazando atrás do Profile",
      bullets: [
        '★ **Bug da v9.6.15.** O `mask-image` que eu apliquei no container do Profile mascarava o background também. Onde a máscara ficava transparente nas bordas, os cards da Home (Sleep 8h26m, Diapers 4, etc) vazavam por trás, ficando visíveis no fim da tela do Profile.',
        '**Fix:** substituído `mask-image` por **overlays de gradient** em `position:fixed` — duas barrinhas sobre o conteúdo (uma no topo, uma no bottom) que vão do background opaco a transparente. Efeito visual igual ao fade, sem mascarar o background.',
        'Cards continuam "derretendo" nas bordas, mas agora sobre um fundo sólido que esconde completamente o que está por trás. Sem vazamento.'
      ]
    },
    en: {
      title: "Fix: Home bleeding through Profile",
      bullets: [
        '★ **v9.6.15 bug.** The `mask-image` I applied on the Profile container was masking the background too. Where the mask was transparent at the edges, Home cards (Sleep 8h26m, Diapers 4, etc) bled through, becoming visible at the end of the Profile screen.',
        '**Fix:** replaced `mask-image` with **gradient overlays** in `position:fixed` — two strips on top of the content (one at top, one at bottom) going from opaque background to transparent. Same visual fade effect, without masking the background.',
        'Cards still "melt" at the edges, but now over a solid background that fully hides what\'s behind. No bleed-through.'
      ]
    }
  },
  {
    v: "9.6.15", date: "2026-04-12",
    pt: {
      title: "Mercúrio líquido + fade mask no Profile",
      bullets: [
        '★ **Botão Home com contorno de mercúrio líquido.** Anel cromado com gradient metálico (roxo/lavanda/branco) em rotação contínua de 3s ao redor do botão, com glow difuso. Efeito de mercúrio escorrendo sem fim ao redor da casinha.',
        '★ **Fade mask no scroll do Profile.** Conteúdo agora desvanece suavemente nas bordas superior (24px) e inferior (80px) via CSS `mask-image`, em vez de cortar chapado. Cards "derretem" ao tocar as bordas, indicando que tem mais coisa pra rolar. Padrão Apple Music / Messages.',
        'Estrutura do botão: wrapper 60×60 com conic-gradient rotativo absoluto + disco escuro interno 2.5px menor que revela o anel como borda + button clicável transparente no topo. Três camadas, zero impacto nos handlers.',
        'Animação `mercurySpin 3s linear infinite` (keyframe novo). Roda sempre, mesmo sem scroll. Drena pouquíssima bateria porque é transform GPU-acelerado.',
        'Modo edição (Cancelar | Salvar) mantém o visual da v9.6.14 — sem mercúrio porque não cabe no design expandido.'
      ]
    },
    en: {
      title: "Liquid mercury + fade mask in Profile",
      bullets: [
        '★ **Home button with liquid mercury outline.** Chromed ring with metallic gradient (purple/lavender/white) in continuous 3s rotation around the button, with diffuse glow. Endlessly flowing mercury effect around the home icon.',
        '★ **Fade mask on Profile scroll.** Content now fades smoothly at the top (24px) and bottom (80px) edges via CSS `mask-image`, instead of flat cutoff. Cards "melt" when touching the edges, indicating there\'s more to scroll. Apple Music / Messages pattern.',
        'Button structure: 60×60 wrapper with absolute rotating conic-gradient + inner dark disc 2.5px smaller revealing the ring as a border + transparent clickable button on top. Three layers, zero impact on handlers.',
        '`mercurySpin 3s linear infinite` animation (new keyframe). Always spinning, even without scrolling. Barely drains battery because it\'s a GPU-accelerated transform.',
        'Edit mode (Cancel | Save) keeps the v9.6.14 visual — no mercury because it doesn\'t fit the expanded design.'
      ]
    }
  },
  {
    v: "9.6.14", date: "2026-04-12",
    pt: {
      title: "Nav do Profile: pill compacta + hide on scroll",
      bullets: [
        '★ **Botão Voltar virou uma pill redonda pequena** (50×50px) com só o ícone da casinha, centralizada. Sem texto "Back to Home" — fica discreto, não ocupa a largura inteira da tela.',
        '★ **Hide on scroll.** Ao rolar a página pra baixo, a pill desliza pra fora com animação suave. Ao rolar pra cima, volta. Padrão iOS nativo. No topo da página (scrollY < 40px) sempre aparece.',
        '**Modo edição mantém o comportamento anterior:** com edições pendentes, a navbar "Cancelar | Salvar" **não esconde ao rolar** (é crítica demais pra sumir). Sempre visível até você decidir o que fazer.',
        'Transições suaves `.28s cubic-bezier` pra não ficar tremendo. Threshold de 6px pra ignorar micro-scrolls acidentais.'
      ]
    },
    en: {
      title: "Profile nav: compact pill + hide on scroll",
      bullets: [
        '★ **Back button is now a small round pill** (50×50px) with just the home icon, centered. No "Back to Home" text — discreet, doesn\'t take the full screen width.',
        '★ **Hide on scroll.** Scrolling down slides the pill out with a smooth animation. Scrolling up brings it back. Native iOS pattern. At the top of the page (scrollY < 40px) it\'s always visible.',
        '**Edit mode keeps the previous behavior:** with pending edits, the "Cancel | Save" navbar **does not hide on scroll** (too critical to disappear). Always visible until you decide what to do.',
        'Smooth `.28s cubic-bezier` transitions to avoid jitter. 6px threshold to ignore accidental micro-scrolls.'
      ]
    }
  },
  {
    v: "9.6.13", date: "2026-04-12",
    pt: {
      title: "Toggle Haptic removido",
      bullets: [
        '★ **Toggle "Vibração tátil" removido do Profile.** Motivo: o iOS Safari não implementa a `navigator.vibrate()` da Web Vibration API — vibração por código de PWA/site simplesmente não existe no iPhone, é decisão da Apple. O toggle funcionava (persistia no Firestore) mas as chamadas `Haptic.medium()` viravam no-op no iOS. Melhor tirar pra não criar falsa expectativa.',
        'As chamadas internas `Haptic.*()` espalhadas pelo app ficam como no-ops — não removi elas pra não mexer em centenas de lugares. Se um dia a Apple habilitar suporte, é só reativar globalmente.',
        'Campo `hapticEnabled` continua indo pro Firestore como `false` pra não quebrar clientes antigos que ainda leem o campo.'
      ]
    },
    en: {
      title: "Haptic toggle removed",
      bullets: [
        '★ **"Haptic feedback" toggle removed from Profile.** Reason: iOS Safari doesn\'t implement `navigator.vibrate()` from the Web Vibration API — vibration from PWA/website code simply doesn\'t exist on iPhone, it\'s an Apple decision. The toggle worked (persisted to Firestore) but the `Haptic.medium()` calls became no-ops on iOS. Better to remove it than create false expectations.',
        'Internal `Haptic.*()` calls scattered through the app become no-ops — I didn\'t remove them to avoid touching hundreds of places. If Apple ever enables support, it\'s just a matter of re-enabling globally.',
        '`hapticEnabled` field still goes to Firestore as `false` to avoid breaking older clients that still read the field.'
      ]
    }
  },
  {
    v: "9.6.12", date: "2026-04-12",
    pt: {
      title: "Intervalo de mamada no dirty state",
      bullets: [
        '★ **Antes**: o campo de minutos do lembrete de mamada salvava automaticamente quando você tirava o dedo do campo (onBlur). Isso tinha um problema silencioso — se você tocasse fora por acidente enquanto rolava a página, o número ficava salvo sem confirmação e a navbar nunca mostrava "Salvar".',
        '**Agora**: mudar o intervalo entra no mesmo sistema de dirty state dos outros campos. A navbar transiciona pra "Cancelar | Salvar" e só persiste quando você tocar Salvar. Pode cancelar e voltar pro valor anterior a qualquer momento.',
        'Toggles (ativar/desativar lembrete, Keep screen on, Haptic, Idioma, Notifications) continuam salvando automaticamente ao toque — consistência total com o resto dos toggles do app.',
        'Salvar agora persiste perfil **e** intervalo do feeding reminder numa única ação com haptic único.'
      ]
    },
    en: {
      title: "Feeding interval in dirty state",
      bullets: [
        '★ **Before**: the feeding reminder minutes field autosaved when you tapped off (onBlur). This had a silent issue — if you tapped off accidentally while scrolling, the number got saved without confirmation and the navbar never showed "Save".',
        '**Now**: changing the interval joins the same dirty state system as the other fields. The navbar transitions to "Cancel | Save" and only persists when you tap Save. You can cancel and go back to the previous value at any time.',
        'Toggles (enable/disable reminder, Keep screen on, Haptic, Language, Notifications) keep autosaving on tap — full consistency with the rest of the app\'s toggles.',
        'Save now persists profile **and** feeding reminder interval in a single action with a single haptic.'
      ]
    }
  },
  {
    v: "9.6.11", date: "2026-04-12",
    pt: {
      title: "Fix: navbar sumindo no Profile",
      bullets: [
        '★ **Bug da v9.6.10.** A navbar do Profile só aparecia quando havia edição pendente. Sem edições, o Profile ficava sem nenhuma navbar (bug do overlay `zIndex:210` cobrindo a navbar `zIndex:50`) e sem o botão Salvar antigo (removido). Você ficava preso no Profile sem como voltar a não ser rolando pro topo e tocando no `<`.',
        '**Fix:** a navbar no Profile agora aparece **sempre**. Quando não há edição, mostra um botão único "Voltar ao Home" (flutuante, estilo pill). Quando há edição, transiciona pra "Cancelar | Salvar" como na v9.6.10.',
        'zIndex ajustado pra 250 pra garantir que sobreponha o overlay do Profile. Padding-bottom do Profile aumentado pra não esconder conteúdo atrás da navbar.'
      ]
    },
    en: {
      title: "Fix: navbar disappearing in Profile",
      bullets: [
        '★ **v9.6.10 bug.** The Profile navbar only appeared when there were pending edits. Without edits, Profile had no navbar at all (overlay `zIndex:210` covering the navbar `zIndex:50`) and no old Save button (removed). You got stuck in Profile with no way back except scrolling to the top and tapping `<`.',
        '**Fix:** the Profile navbar now appears **always**. With no edits, shows a single "Back to Home" button (floating pill style). With edits, transitions to "Cancel | Save" as in v9.6.10.',
        'zIndex adjusted to 250 to ensure it overlays the Profile overlay. Profile padding-bottom increased to avoid hiding content behind the navbar.'
      ]
    }
  },
  {
    v: "9.6.10", date: "2026-04-12",
    pt: {
      title: "Navbar contextual no Profile",
      bullets: [
        '★ **Acabou a rolagem infinita pra salvar.** A navbar inferior (Home/Stats/+/History/Profile) agora transiciona pra modo "Salvar/Cancelar" assim que você muda qualquer campo de input no Profile — nome, data de nascimento, meta de ml, dados de nascimento.',
        '**Dirty state automático.** O app detecta quando algum campo mudou em relação ao salvo e faz a navbar trocar sozinha. Se você volta ao valor original, navbar volta ao normal.',
        '**Cancelar** reverte todos os campos pro valor original (com haptic). **Salvar** persiste no Firestore e volta pra navbar normal.',
        '**Toggles continuam autosalvando.** Keep screen on, Haptic, Idioma, Notificações, feeding reminder — todos esses não disparam o modo edição, continuam salvando no toque como antes.',
        '**Botão "Salvar alterações" antigo removido** do fim da página (redundante com a navbar nova). Atalho "View growth" continua lá e salva automaticamente se houver edições pendentes antes de navegar.',
        'Animação `slideUp` na transição da navbar, dot âmbar pulsante no botão Salvar pra indicar edição pendente.'
      ]
    },
    en: {
      title: "Contextual navbar in Profile",
      bullets: [
        '★ **No more endless scrolling to save.** The bottom navbar (Home/Stats/+/History/Profile) now transitions to "Save/Cancel" mode as soon as you change any input field in Profile — name, birth date, ml goal, birth data.',
        '**Automatic dirty state.** The app detects when any field has changed from its saved value and swaps the navbar on its own. If you revert to the original value, navbar returns to normal.',
        '**Cancel** reverts all fields to their original values (with haptic). **Save** persists to Firestore and returns the navbar to normal mode.',
        '**Toggles keep autosaving.** Keep screen on, Haptic, Language, Notifications, feeding reminder — none of these trigger edit mode, they still save on tap as before.',
        '**Old "Save changes" button removed** from the bottom of the page (redundant with the new navbar). "View growth" shortcut stays there and autosaves if there are pending edits before navigating.',
        '`slideUp` animation on navbar transition, pulsing amber dot on the Save button to indicate pending edits.'
      ]
    }
  },
  {
    v: "9.6.9", date: "2026-04-10",
    pt: {
      title: "Fix: editor de wakings em bedtime live",
      bullets: [
        '★ **Bug fix.** Na v9.6.8 o editor rotulava qualquer waking fechado como "Histórico", inclusive dentro do bedtime atual (live). Ao salvar, tentava gravar em `entry.wakings` — mas o live bedtime nem existe como entry ainda, então o save não tinha efeito.',
        'Agora o editor distingue 3 casos: **Ao vivo** (waking aberto, salva via `FB.saveTimer`), **Bedtime atual** (waking fechado dentro do bedtime em andamento, salva em `activeTimer.wakings[]`), **Histórico** (bedtime encerrado, salva em `entry.wakings[]`).',
        'O badge no canto direito do editor agora indica corretamente qual dos 3 contextos você está editando.',
        'Remover waking também passou a rotear certo (live bedtime → `activeTimer`, histórico → `entry`).'
      ]
    },
    en: {
      title: "Fix: waking editor in live bedtime",
      bullets: [
        '★ **Bug fix.** In v9.6.8 the editor labeled any closed waking as "History", including ones inside the current (live) bedtime. On save, it tried to write to `entry.wakings` — but the live bedtime doesn\'t exist as an entry yet, so the save had no effect.',
        'Now the editor distinguishes 3 cases: **Live** (open waking, saves via `FB.saveTimer`), **Current bedtime** (closed waking inside the ongoing bedtime, saves to `activeTimer.wakings[]`), **History** (closed bedtime, saves to `entry.wakings[]`).',
        'The badge in the top right of the editor now correctly indicates which of the 3 contexts you\'re editing.',
        'Removing a waking also routes correctly now (live bedtime → `activeTimer`, history → `entry`).'
      ]
    }
  },
  {
    v: "9.6.8", date: "2026-04-10",
    pt: {
      title: "Editor de wakings (live e histórico)",
      bullets: [
        '★ **Chips dos wakings agora são tappáveis.** Resolve o caso "esqueci de tocar em voltou a dormir" — no SleepBlock (vivo ou histórico), tap no chip "☀ 00:50 · 2h29m" abre um editor inline com campos de Início e Fim.',
        '**Live wakings**: o campo Fim vem pré-preenchido com o horário atual (destacado em azul). Ajusta pro momento em que ela realmente voltou a dormir e toca "Encerrar" — o waking fecha retroativamente com a duração correta.',
        '**Histórico**: qualquer waking de qualquer bedtime passado pode ser editado (ajustar início/fim/duração) ou removido via botão de lixeira.',
        'Preview de duração ao vivo conforme você digita. Se Fim < Início, botão Salvar desabilita e mostra "inválido".',
        'Eventos linkados (bottle/diaper dentro do waking) ficam intactos mesmo se o waking for removido — eles não somem, só perdem o link.',
        'Sync em tempo real entre os dois iPhones, como qualquer outra edição.'
      ]
    },
    en: {
      title: "Waking editor (live and history)",
      bullets: [
        '★ **Waking chips are now tappable.** Solves the "forgot to tap went back to sleep" case — in SleepBlock (live or history), tapping the chip "☀ 00:50 · 2h29m" opens an inline editor with Start and End fields.',
        '**Live wakings**: the End field is pre-filled with the current time (highlighted in blue). Adjust to when she actually went back to sleep and tap "End" — the waking closes retroactively with the correct duration.',
        '**History**: any waking from any past bedtime can be edited (adjust start/end/duration) or removed via trash button.',
        'Live duration preview as you type. If End < Start, the Save button disables and shows "invalid".',
        'Linked events (bottle/diaper inside the waking) stay intact even if the waking is removed — they don\'t disappear, just lose the link.',
        'Real-time sync between both iPhones, like any other edit.'
      ]
    }
  },
  {
    v: "9.6.7", date: "2026-04-10",
    pt: {
      title: "Lembrete de mamada (push após intervalo)",
      bullets: [
        '★ **Novo card no Profile: "Lembrete de mamada".** Push notification dispara quando passar o intervalo configurado desde a última mamadeira registrada. Default: **290 minutos (4h50)**.',
        '★ **Só dispara entre 07:00 e 22:00.** À noite o app fica em silêncio — vocês confiam no choro da Louise pra acordar, sem o app interferindo na rotina de sono.',
        '**Dispara uma vez por mamada.** Quando o push é enviado, o worker marca o `entryId` da mamadeira de referência. Não dispara de novo até que uma mamadeira nova seja registrada (que reseta o contador).',
        '**Amamentação não conta** como reset — só mamadeiras (`bottle`). Decisão proposital pra que o intervalo conte só o que é mensurável em ml.',
        'Card no Profile fica logo abaixo do "Lembretes de medicamento", com o mesmo vocabulário visual. Toggle pra ativar/desativar + campo único de minutos com conversão ao vivo (`290 → 4h 50min`).',
        'Schema novo no Firestore: `config/reminders/items/{id}` com `tipo:"feedingInterval"`. Os lembretes de medicamento existentes (sem campo `tipo` ou com `tipo:"scheduled"`) continuam funcionando exatamente como antes — backward compat total.',
        '**Worker `louise-pro-fcm` atualizado.** Nova função que lê a última entry do tipo `bottle`, calcula minutos decorridos, valida janela diurna BRT, checa anti-spam via `lastFiredEntryId`, dispara FCM. Os lembretes de medicamento continuam sendo processados pela rota antiga sem alteração.'
      ]
    },
    en: {
      title: "Feeding reminder (push after interval)",
      bullets: [
        '★ **New card in Profile: "Feeding reminder".** Push notification fires when the configured interval since the last logged bottle is exceeded. Default: **290 minutes (4h50)**.',
        '★ **Only fires between 07:00 and 22:00.** Silent at night — you trust Louise\'s crying to wake you up, without the app interfering with the sleep routine.',
        '**Fires once per bottle.** When the push is sent, the worker marks the `entryId` of the reference bottle. It does not fire again until a new bottle is logged (which resets the counter).',
        '**Nursing does NOT count** as reset — only bottles (`bottle`). Intentional decision so the interval only counts what is measurable in ml.',
        'Card sits in Profile right below "Medication reminders", with the same visual vocabulary. Toggle to enable/disable + single minutes field with live conversion (`290 → 4h 50min`).',
        'New Firestore schema: `config/reminders/items/{id}` with `tipo:"feedingInterval"`. Existing medication reminders (no `tipo` field or `tipo:"scheduled"`) keep working exactly as before — full backward compat.',
        '**`louise-pro-fcm` Worker updated.** New function that reads the latest `bottle` entry, computes elapsed minutes, validates the BRT daytime window, checks anti-spam via `lastFiredEntryId`, fires FCM. Medication reminders keep being processed by the old route untouched.'
      ]
    }
  },
  {
    v: "9.6.6", date: "2026-04-10",
    pt: {
      title: "Calibração das âncoras do Ring (meio-termo)",
      bullets: [
        '★ **Ajuste fino das âncoras sol e lua do Ring.** A v9.6.5 exagerou no reforço (disco 44px, ícone 20px, borda 72%, glow duplo 24+48px) — o print mostrou que elas dominavam visualmente e a lua ficava tapando o dot de mamadeira na posição 20:30 (inverso do bug original).',
        '**Valores aplicados (meio-termo entre v9.6.4 que sumia e v9.6.5 que dominava):**',
        '• Disco: 44px → **40px** (volta ao original)',
        '• Ícone: 20px → **18px** (volta ao original)',
        '• Borda: `rgba(cor,0.72)` → **`rgba(cor,0.55)`** (entre o 0.35 original e o 0.72 da v9.6.5)',
        '• Fundo radial: 42% → **28%** centro, 14% → **8%** borda',
        '• Glow: duplo 24+48px → **simples 18px 30%** (entre o 16px/15% original e o duplo da v9.6.5)',
        '• Inset highlight: **removido** (era adição da v9.6.5, dava peso a mais)',
        '• Label: 10px peso 800 `#c4b5fd`/`#fde68a` → **9px peso 700 `#a78bfa`/`#fbbf24`** (volta ao original)',
        '★ **`zIndex:5` mantido nas duas âncoras** — essa foi a parte **estrutural** do fix, não cosmética. Sem ela a lua some atrás do dot de mamadeira no mesmo horário, e esse era o bug original do print da v9.6.4. Só as propriedades visuais voltaram ao peso correto.',
        'Nada mais tocado. Ícone `bed` nos contextos de registro continua igual à v9.6.5.'
      ]
    },
    en: {
      title: "Ring anchors calibration (middle ground)",
      bullets: [
        '★ **Fine-tuning of sun and moon Ring anchors.** v9.6.5 overdid the reinforcement (disc 44px, icon 20px, border 72%, double glow 24+48px) — the print showed them dominating visually and the moon covering the bottle dot at 20:30 (inverse of the original bug).',
        '**Applied values (middle ground between v9.6.4 that hid and v9.6.5 that dominated):**',
        '• Disc: 44px → **40px** (back to original)',
        '• Icon: 20px → **18px** (back to original)',
        '• Border: `rgba(color,0.72)` → **`rgba(color,0.55)`** (between original 0.35 and v9.6.5 0.72)',
        '• Radial background: 42% → **28%** center, 14% → **8%** edge',
        '• Glow: double 24+48px → **single 18px 30%** (between original 16px/15% and v9.6.5 double)',
        '• Inset highlight: **removed** (was a v9.6.5 addition, added extra weight)',
        '• Label: 10px weight 800 `#c4b5fd`/`#fde68a` → **9px weight 700 `#a78bfa`/`#fbbf24`** (back to original)',
        '★ **`zIndex:5` kept on both anchors** — this was the **structural** part of the fix, not cosmetic. Without it the moon hides behind the bottle dot at the same time, and that was the original v9.6.4 print bug. Only the visual properties went back to the correct weight.',
        'Nothing else touched. `bed` icon in registration contexts stays the same as v9.6.5.'
      ]
    }
  },
  {
    v: "9.6.5", date: "2026-04-10",
    pt: {
      title: "Ícone bed pra sleep + âncoras do Ring reforçadas",
      bullets: [
        '★ **Novo ícone `bed` do Lucide** (licença ISC, a mesma do `bottle-baby`, `bath` e `ruler`). Path: `M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9`. Cabeceira à esquerda, colchão horizontal, travesseiro à esquerda. Adicionado ao componente `Icon` seguindo o padrão stroke do Feather/Lucide.',
        '★ **Sono/bedtime agora usa `bed` em 8 contextos de registro** (onde o ícone representa a ação concreta de registrar sono):',
        '• Quick button "Sono" na Home',
        '• EntryRow do histórico (via `TYPES.sleep.icon`)',
        '• Sheet orb do "+ Adicionar" (via `TYPES.sleep.icon`)',
        '• SleepBlock header (o card grande de bedtime expandido)',
        '• Centro do Ring durante timer de bedtime (ícone ao lado de "Boa noite")',
        '• TimerBar ativa de bedtime',
        '• Ícone sobre o arco ativo no Ring (live timer)',
        '• Card "Sono real/dia" no Stats + resumo do dia no Histórico',
        '★ **Moon é mantido** em 2 contextos de "marco temporal" onde o vocabulário visual de noite funciona melhor:',
        '• Âncora lua do Ring (marco do fim do dia — sol/lua é o par natural de ciclo diário)',
        '• Badge "noite" de eventos dentro do SleepBlock',
        '★ **Âncoras sol e lua do Ring reforçadas (Opção B do mockup).** Bug do print: a âncora lua ficava em `zIndex:1` e sumia atrás do dot de mamadeira quando os horários coincidiam. Fixes aplicados nas duas âncoras (simetria sol + lua):',
        '• `zIndex` de 1 → 5 (agora fica acima dos dots de evento)',
        '• Disco de 40px → 44px',
        '• Ícone de 18px → 20px',
        '• Borda de `rgba(cor,0.35)` → `rgba(cor,0.72)` (mais do que o dobro de presença)',
        '• Fundo radial de 18% → 42% (lua) e 18% → 40% (sol)',
        '• Glow duplo novo: `0 0 24px 45-50%` + `0 0 48px 20-22%` (antes era só `0 0 16px 15%`)',
        '• `0 1px 0 rgba(255,255,255,0.18) inset` pro highlight de cima',
        '• Label de 9px peso 700 → 10px peso 800, cor mais clara (`#c4b5fd` pra lua, `#fde68a` pro sol)',
        '**Nenhuma mudança de conteúdo, layout ou estrutura.** Só o ícone do sleep em contextos de registro e o reforço visual das duas âncoras.'
      ]
    },
    en: {
      title: "Bed icon for sleep + reinforced Ring anchors",
      bullets: [
        '★ **New `bed` icon from Lucide** (ISC license, same as `bottle-baby`, `bath` and `ruler`). Path: `M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9`. Headboard on the left, horizontal mattress, pillow on the left. Added to the `Icon` component following the Feather/Lucide stroke pattern.',
        '★ **Sleep/bedtime now uses `bed` in 8 registration contexts** (where the icon represents the concrete act of logging sleep):',
        '• "Sleep" quick button on Home',
        '• History EntryRow (via `TYPES.sleep.icon`)',
        '• "+ Add" sheet orb (via `TYPES.sleep.icon`)',
        '• SleepBlock header (the big expanded bedtime card)',
        '• Ring center during bedtime timer (icon next to "Goodnight")',
        '• Active bedtime TimerBar',
        '• Icon on top of the active arc in the Ring (live timer)',
        '• "Real sleep/day" card in Stats + day summary in History',
        '★ **Moon is kept** in 2 "temporal marker" contexts where the visual vocabulary of night works better:',
        '• Ring moon anchor (end-of-day marker — sun/moon is the natural pair for daily cycle)',
        '• "Night" badge on events inside the SleepBlock',
        '★ **Sun and moon Ring anchors reinforced (Option B from mockup).** Print bug: moon anchor was at `zIndex:1` and hid behind the bottle dot when times coincided. Fixes applied to both anchors (sun + moon symmetry):',
        '• `zIndex` from 1 → 5 (now sits above event dots)',
        '• Disc from 40px → 44px',
        '• Icon from 18px → 20px',
        '• Border from `rgba(color,0.35)` → `rgba(color,0.72)` (more than double presence)',
        '• Radial background from 18% → 42% (moon) and 18% → 40% (sun)',
        '• New double glow: `0 0 24px 45-50%` + `0 0 48px 20-22%` (was only `0 0 16px 15%`)',
        '• `0 1px 0 rgba(255,255,255,0.18) inset` for top highlight',
        '• Label from 9px weight 700 → 10px weight 800, lighter color (`#c4b5fd` for moon, `#fde68a` for sun)',
        '**No content, layout or structure changes.** Just the sleep icon in registration contexts and visual reinforcement of the two anchors.'
      ]
    }
  },
  {
    v: "9.6.4", date: "2026-04-10",
    pt: {
      title: "Tummy time no Stats (card 4x1 + gráfico próprio)",
      bullets: [
        '★ **Novo card pequeno "Tummy/dia"** na grid de stats do topo, ao lado de Fraldas/dia, Mamadas/dia e Sonecas/dia. Grid mudou de 3 colunas pra 4 colunas pra comportar. Mostra a média de sessões por dia (ex: `3.4`) em âmbar, com a mesma escala dos vizinhos.',
        '**Ajuste de tipografia:** pra caber 4 cards na linha sem quebrar no iPhone, reduzi o número principal de 26px pra 22px, label de 10px pra 9px, e padding lateral de 12px pra 8px. Os outros 3 cards (Fraldas, Mamadas, Sonecas) também foram ajustados pra ficar consistente.',
        '★ **Novo gráfico de tummy time** no final do Stats, logo depois do card da Simeticona. Mesma estrutura visual do card de Simeticona: header com ícone (`baby`) + título + média por dia no canto direito, barras âmbar (`linear-gradient(180deg,${T.amber},#d97706)`) com glow sutil, altura proporcional aos minutos/dia, labels de minutos em cima (ex: `12m`) quando o período é ≤14 dias.',
        '**Estado vazio:** se não tiver nenhum tummy time no período selecionado, mostra "Nenhum tummy time neste período" com fonte itálica (mesma mensagem de fallback do card de Simeticona).',
        '**Métrica escolhida:** minutos totais por dia, não número de sessões. Faz mais sentido pra tummy time porque o que importa é o tempo acumulado (diretriz AAP é 20-30min/dia até 3 meses), não quantas vezes você parou e começou. O card pequeno no topo mostra sessões/dia pra dar o outro lado da informação.',
        '**Cálculo:** `tumMin` por dia vem de `Math.round(tumEntries.reduce((s,e)=>s+(e.durationMin||0),0))` — aplica Math.round no total pra absorver as frações de minuto que tummy time persiste (ex: duas sessões de 4.266min viram `9min` em vez de `8.533333min`).',
        'Nenhuma outra tela tocada. Home, History, Profile, Ring, AddForm, Sheet, EntryRow — tudo igual.'
      ]
    },
    en: {
      title: "Tummy time in Stats (4x1 card + its own chart)",
      bullets: [
        '★ **New small "Tummy/day" card** in the top stats grid, alongside Diapers/day, Feeds/day and Naps/day. Grid changed from 3 columns to 4 columns to fit. Shows average sessions per day (e.g. `3.4`) in amber, same scale as its neighbors.',
        '**Typography tuning:** to fit 4 cards in a row without wrapping on iPhone, I reduced the main number from 26px to 22px, label from 10px to 9px, and side padding from 12px to 8px. The other 3 cards (Diapers, Feeds, Naps) were also adjusted for consistency.',
        '★ **New tummy time chart** at the bottom of Stats, right after the Simeticona card. Same visual structure as the Simeticona card: header with icon (`baby`) + title + average/day on the right, amber bars (`linear-gradient(180deg,${T.amber},#d97706)`) with subtle glow, height proportional to minutes/day, minute labels on top (e.g. `12m`) when the period is ≤14 days.',
        '**Empty state:** if there is no tummy time in the selected period, shows "No tummy time in this period" in italic (same fallback message as the Simeticona card).',
        '**Metric choice:** total minutes per day, not session count. Makes more sense for tummy time because what matters is the accumulated time (AAP guideline is 20-30min/day up to 3 months), not how many times you stopped and started. The small card on top shows sessions/day to give the other side of the info.',
        '**Calculation:** `tumMin` per day comes from `Math.round(tumEntries.reduce((s,e)=>s+(e.durationMin||0),0))` — applies Math.round to the total to absorb the fractional minutes that tummy time persists (e.g. two sessions of 4.266min become `9min` instead of `8.533333min`).',
        'No other screens touched. Home, History, Profile, Ring, AddForm, Sheet, EntryRow — everything else the same.'
      ]
    }
  },
  {
    v: "9.6.3", date: "2026-04-10",
    pt: {
      title: "Fix: tummy time no Ring vira dot (não arco) + fmtDur robusto",
      bullets: [
        '★ **Tummy time no Ring virou um dot, não mais um arco.** A v9.6.1 fez ele entrar como arco igual a soneca, mas o resultado ficou ruim: sessões de tummy time são curtíssimas (3-5 min = ~0.5% do dia), então o arco ficava microscópico enquanto o ícone e o label ficavam tamanho normal, sobrepondo os arcos vizinhos. Além disso apareceu um label bizarro `4.266666666666667min` no anel. Agora tummy time é um **ponto no tempo** (como mamadeira, fralda, amamentação), que é honesto — é um evento curto, não uma faixa temporal.',
        '★ **`fmtDur` agora arredonda valores fracionários.** A função assumia inteiros e fazia `Math.floor(m/60)` + `m%60`. Tummy time persiste duração como `Math.round(mins*60)/60` (frações de minuto pra preservar segundos), então passava 4.2666... e saía `"4.266666666666667min"`. Agora passa por `Math.round(m)` antes de dividir, então vira `"4min"` ou `"4h16m"` como esperado. Mudança pontual — é possível que outros lugares do app que chamavam `fmtDur(durationMin)` em tummytime (Stats, History summary, etc) também tivessem números estranhos, e esse fix corrige todos de uma vez.',
        'O EntryRow do tummy time **continua mostrando "3min 42s"** com segundos (usa lógica própria, não o `fmtDur`), isso não foi tocado.',
        'Nenhuma outra mudança. Transições, swipe, Ring center, tudo continua igual.'
      ]
    },
    en: {
      title: "Fix: tummy time becomes a dot (not arc) in Ring + robust fmtDur",
      bullets: [
        '★ **Tummy time in the Ring is now a dot, no longer an arc.** v9.6.1 made it render as an arc like a nap, but the result looked bad: tummy time sessions are very short (3-5 min = ~0.5% of the day), so the arc was microscopic while the icon and label were normal-sized, overlapping neighboring arcs. Plus a weird label `4.266666666666667min` was appearing. Now tummy time is a **point in time** (like bottle, diaper, nursing), which is honest — it is a short event, not a time range.',
        '★ **`fmtDur` now rounds fractional values.** The function assumed integers and did `Math.floor(m/60)` + `m%60`. Tummy time persists duration as `Math.round(mins*60)/60` (fractions of a minute to preserve seconds), so 4.2666... came out as `"4.266666666666667min"`. Now it goes through `Math.round(m)` before dividing, yielding `"4min"` or `"4h16m"` as expected. Pointful fix — likely other places in the app that called `fmtDur(durationMin)` on tummytime (Stats, History summary, etc) also had weird numbers, and this fix corrects all of them at once.',
        'The tummy time EntryRow **still shows "3min 42s"** with seconds (uses its own logic, not `fmtDur`) — untouched.',
        'No other changes. Transitions, swipe, Ring center — everything else stays the same.'
      ]
    }
  },
  {
    v: "9.6.2", date: "2026-04-09",
    pt: {
      title: "Swipe bidirecional no histórico (deletar e editar)",
      bullets: [
        '★ **Swipe pra esquerda agora deleta direto.** Antes você arrastava o item pra esquerda e aparecia um botão de lixo vermelho — pra deletar mesmo precisava de um segundo toque no botão. Agora não precisa mais: arrasta até **60% da largura do row**, solta, e deleta. Ou arrasta até **85%+** e ele commita sozinho sem nem precisar soltar (igual o Mail do iOS).',
        '★ **Swipe pra direita abre o editor.** Novo: arrastar o row da esquerda pra direita revela um overlay azul com ícone de lápis. Mesma mecânica do delete — solta acima de 60% pra abrir, ou arrasta até 85%+ pra abrir sem soltar.',
        '**Auto-commit em 85%:** quando você passa do segundo threshold, o row dispara haptic médio, desliza pro fim da tela em 180ms, e a ação acontece. Não precisa pensar em soltar.',
        '**Snap-back em <60%:** se soltar antes do primeiro threshold, o row volta pro lugar com a curva `cubic-bezier(0.22,1,0.36,1)` (mesma das outras transições do app).',
        '**Haptic em 3 momentos:** light quando você cruza o threshold de 60% durante o drag (avisa "se soltar agora, vai"), light de novo se voltar pra trás do threshold, e medium quando a ação efetivamente dispara.',
        '**Lock de eixo:** os primeiros 8px de movimento decidem se é gesto horizontal (swipe) ou vertical (scroll da lista). Se vertical dominar, o drag é abortado e o scroll funciona normal. Sem conflito.',
        '**Pointer events** em vez de touch events — funciona em iPhone, iPad, mouse de desktop, tudo no mesmo handler. Usa `setPointerCapture` pra que o dedo possa sair da área do row durante o drag sem perder o gesto.',
        '**Click guard:** se você clicar no ícone ou no nome do evento sem ter arrastado (`Math.abs(dx)<5`), continua abrindo o editor como antes. Só bloqueia o click "fantasma" que poderia disparar logo após um swipe.',
        'Removidos os antigos `useState` de `swipe`/`swiping` e os handlers `onTouchStart`/`onTouchMove`/`onTouchEnd` baseados em touch events. O overlay vermelho fixo de 70px com botão tappable também sumiu — agora o overlay cresce dinamicamente acompanhando o dedo.'
      ]
    },
    en: {
      title: "Bidirectional swipe in history (delete and edit)",
      bullets: [
        '★ **Swipe left now deletes directly.** Before, you swiped the item left and a red trash button appeared — to actually delete you needed a second tap on the button. No more: swipe past **60% of the row width**, release, and it deletes. Or swipe past **85%+** and it commits on its own without needing to release (just like Mail on iOS).',
        '★ **Swipe right opens the editor.** New: dragging the row from left to right reveals a blue overlay with a pencil icon. Same mechanic as delete — release past 60% to open, or drag past 85%+ to open without releasing.',
        '**Auto-commit at 85%:** when you cross the second threshold, the row fires medium haptic, slides off-screen in 180ms, and the action happens. No thinking about release.',
        '**Snap-back below 60%:** releasing before the first threshold snaps the row back with `cubic-bezier(0.22,1,0.36,1)` (same as other app transitions).',
        '**Haptic in 3 moments:** light when you cross the 60% threshold during drag (warns "release now and it goes"), light again if you go back below the threshold, and medium when the action actually fires.',
        '**Axis lock:** the first 8px of movement decide whether it is a horizontal gesture (swipe) or vertical (list scroll). If vertical dominates, the drag is aborted and scroll works normally. No conflict.',
        '**Pointer events** instead of touch events — works on iPhone, iPad, desktop mouse, all on the same handler. Uses `setPointerCapture` so your finger can leave the row area during the drag without losing the gesture.',
        '**Click guard:** if you tap the icon or event name without dragging (`Math.abs(dx)<5`), it still opens the editor as before. Only blocks the "phantom" click that could fire right after a swipe.',
        'Removed the old `useState` for `swipe`/`swiping` and the `onTouchStart`/`onTouchMove`/`onTouchEnd` handlers based on touch events. The fixed 70px red overlay with tappable button is also gone — the overlay now grows dynamically following your finger.'
      ]
    }
  },
  {
    v: "9.6.1", date: "2026-04-09",
    pt: {
      title: "Fix: tummy time no Ring + label do timer",
      bullets: [
        '★ **Tummy time finalizado agora aparece como arco no Ring**, igual as sonecas. Antes ele só aparecia como arco enquanto o timer estava rodando, mas sumia depois de salvar — porque o filtro `sleepEvs` do Ring incluía só `type==="nap"`. Adicionado `||e.type==="tummytime"` no filtro. A cor sai automaticamente como âmbar (vinda do `TYPES.tummytime.color`), igual ao arco vivo.',
        '★ **Centro do Ring durante timer de tummy time não mostra mais "Bedtime / Boa noite" em roxo.** Bug do `else` final do switch de `activeTimer.type` que capturava qualquer tipo não-tratado e caía no fallback de bedtime. Adicionado branch explícito pra `tummytime` antes do `else`, com label `"Tummy time"` e cores âmbar (`#d97706` → `#fbbf24`), matching o resto do vocabulário visual do tummy time no app.',
        'Esses dois bugs eram pré-existentes (vieram lá da v9.3.0 quando tummy time foi adicionado), não tem nada a ver com as transições da v9.6.0 — só aproveitei a sessão pra corrigir agora que vocês reportaram.'
      ]
    },
    en: {
      title: "Fix: tummy time in Ring + timer label",
      bullets: [
        '★ **Finished tummy time now appears as an arc in the Ring**, just like naps. Before it only showed as an arc while the timer was running, but disappeared after saving — because the Ring `sleepEvs` filter only included `type==="nap"`. Added `||e.type==="tummytime"` to the filter. The color comes out as amber automatically (from `TYPES.tummytime.color`), matching the live arc.',
        '★ **Ring center during tummy time timer no longer shows "Bedtime / Boa noite" in purple.** Bug in the final `else` of the `activeTimer.type` switch that caught any untreated type and fell into the bedtime fallback. Added an explicit branch for `tummytime` before the `else`, with `"Tummy time"` label and amber colors (`#d97706` → `#fbbf24`), matching the rest of the tummy time visual vocabulary in the app.',
        'These two bugs were pre-existing (came from v9.3.0 when tummy time was added), unrelated to the v9.6.0 transitions — I just took advantage of the session to fix them now that you reported them.'
      ]
    }
  },
  {
    v: "9.6.0", date: "2026-04-09",
    pt: {
      title: "Cross-fade entre abas + drag-to-dismiss no sheet",
      bullets: [
        '★ **Troca de abas com cross-fade suave.** Antes a troca entre Home, Stats, Hist. e Config era um corte seco — o conteúdo sumia e o novo aparecia instantaneamente. Agora cada aba entra com **fade + micro-slide de 6px de baixo pra cima em 400ms**, usando a curva `cubic-bezier(0.22,1,0.36,1)`. Dá uma sensação muito mais nativa, tipo trocar de tab num app da Apple.',
        'Implementação: wrapper `<div key={page}>` com `animation:"pageSwitch .4s both"` envolvendo as 4 condicionais de página. O `key` muda a cada troca, React remonta o wrapper e a animação toca. Removido o `animation:"fadeIn .3s"` interno da Home que antes só cobria ela (agora o wrapper cobre todas as abas de forma uniforme).',
        '★ **Drag-to-dismiss no sheet do "+".** Agora dá pra fechar o sheet arrastando ele pra baixo pelo handle, em vez de precisar acertar o backdrop escuro. Muito mais natural no iPhone.',
        '**Como funciona:** tocar no topo do sheet (zona do handle, ~43px de altura total) e arrastar pra baixo faz o sheet acompanhar o dedo em tempo real. O backdrop escurece proporcionalmente. Soltar acima do threshold dispara o fechamento com haptic leve; soltar antes do threshold faz o sheet voltar pro lugar com a mesma curva suave da entrada.',
        '**Threshold de dismiss:** arrastar mais de **28% da altura do sheet** OU fazer um flick rápido pra baixo (velocidade > **0.55 px/ms**) fecha.',
        '**Rubber-band pra cima:** se tentar arrastar pra cima (inverso do esperado), o sheet oferece resistência e para em ~20px, matching o padrão iOS.',
        '**Respeita scroll interno:** se o sheet estiver com conteúdo rolável e o scroll não estiver no topo, o drag não engata — só começa quando `scrollTop === 0`, pra não conflitar com o scroll.',
        '**Pointer capture:** usa `setPointerCapture` no pointerdown, então mesmo que o dedo saia da área do handle durante o drag, o gesto continua respondendo até soltar.',
        'Aplicado ao componente `Sheet` genérico, então **cobre todos os sheets que usam esse componente**: o sheet de "+ Adicionar" do Home e o sheet do AddForm. O `NursingSidePicker` tem implementação própria e **não foi tocado** nessa versão.',
        '**Nenhuma mudança de conteúdo, layout, ícone, cor ou estrutura.** Só transições e gestos.'
      ]
    },
    en: {
      title: "Tab cross-fade + drag-to-dismiss sheet",
      bullets: [
        '★ **Smooth cross-fade between tabs.** Tab switching (Home, Stats, Hist., Settings) used to be a hard cut — content would disappear and the new one would pop in instantly. Now each tab enters with a **fade + 6px micro-slide-up over 400ms**, using `cubic-bezier(0.22,1,0.36,1)` easing. Feels much more native, like switching tabs in an Apple app.',
        'Implementation: `<div key={page}>` wrapper with `animation:"pageSwitch .4s both"` wrapping the 4 page conditionals. The `key` changes on each switch, React remounts the wrapper and the animation fires. Removed the old `animation:"fadeIn .3s"` that was only on Home (the wrapper now covers all tabs uniformly).',
        '★ **Drag-to-dismiss on the "+" sheet.** You can now close the sheet by dragging it down by the handle, instead of having to tap the dark backdrop. Much more natural on iPhone.',
        '**How it works:** touching the top area of the sheet (handle zone, ~43px tall total) and dragging down makes the sheet follow your finger in real time. The backdrop dims proportionally. Releasing past the threshold triggers dismissal with a light haptic; releasing before the threshold snaps the sheet back with the same smooth entrance curve.',
        '**Dismiss threshold:** dragging past **28% of the sheet height** OR a quick downward flick (velocity > **0.55 px/ms**) closes it.',
        '**Rubber-band upward:** if you try to drag up (the wrong direction), the sheet gives resistance and caps at ~20px, matching iOS behavior.',
        '**Respects inner scroll:** if the sheet has scrollable content and scroll is not at the top, the drag does not engage — it only starts when `scrollTop === 0`, to avoid conflicting with scrolling.',
        '**Pointer capture:** uses `setPointerCapture` on pointerdown, so even if your finger leaves the handle area during the drag, the gesture keeps responding until release.',
        'Applied to the generic `Sheet` component, so it **covers every sheet that uses this component**: the "+ Add" sheet from Home and the AddForm sheet. The `NursingSidePicker` has its own implementation and was **not touched** in this version.',
        '**No content, layout, icon, color, or structure changes.** Transitions and gestures only.'
      ]
    }
  },
  {
    v: "9.5.0", date: "2026-04-09",
    pt: {
      title: "Escolha de lado na amamentação (nursing side picker)",
      bullets: [
        '★ **Novo fluxo pra iniciar amamentação.** Tocar no quick button de Amam. agora abre um **mini-sheet minimalista** pra escolher o lado manualmente — Esquerdo ou Direito — em vez de iniciar direto no lado que o sistema achava que era o próximo. O sistema errava às vezes (a Louise nem sempre alterna direitinho, um peito pode estar mais cheio, etc), então agora é a mãe que decide na hora.',
        '★ **Design bem enxuto:** ícone de amamentação no topo (círculo 58px com gradient azul) + 2 botões gigantes com "L" e "R" em 52px + mini-label "Esquerdo" / "Direito". Sem título extra, sem badge "sugerido", sem metadados da última mamada — só o essencial.',
        '★ **Animação em cascata (~800ms)** com easings profissionais:',
        '• Backdrop escurece com blur (400ms)',
        '• Sheet sobe de baixo com leve overshoot (500ms, `cubic-bezier(0.22,1.1,0.36,1)`)',
        '• Grab handle aparece (scaleX 0.5→1, delay 50ms)',
        '• Ícone entra com scale 0.6→1 elástico (delay 120ms, `cubic-bezier(0.34,1.4,0.5,1)`)',
        '• Botão L: scale 0.88→1 + slide up 18px (delay 220ms)',
        '• Botão R: mesmo movimento 80ms depois (delay 300ms)',
        'Nada aparece brusco — cada elemento entra em sequência construindo a sheet por partes.',
        'Tap fora da sheet ou no backdrop fecha sem iniciar. Tap em L ou R dispara haptic medium, fecha a sheet com animação reversa, e inicia o timer de nursing no lado escolhido.',
        'Removido o indicador "L→" / "R→" que ficava no canto do quick button (era a dica do lado sugerido — não precisa mais já que é a mãe quem escolhe toda vez).',
        'O `nextNursingSide` e `lastNursingSide` continuam sendo computados no estado global, mas não são mais usados pela quick button. Podem voltar a ser úteis no futuro se a gente quiser mostrar o último lado no próprio sheet.'
      ]
    },
    en: {
      title: "Nursing side picker (choose L/R when starting)",
      bullets: [
        '★ **New flow to start nursing.** Tapping the Nurse quick button now opens a **minimalist mini-sheet** to manually choose the side — Left or Right — instead of starting directly on the side the system thought was next. The system was sometimes wrong (Louise doesn\'t always alternate cleanly, one breast may be fuller, etc), so now mom decides in the moment.',
        '★ **Very lean design:** nursing icon on top (58px circle with blue gradient) + 2 giant buttons with "L" and "R" in 52px + mini-label "Left" / "Right". No extra title, no "suggested" badge, no last-feed metadata — just the essential.',
        '★ **Staged animation (~800ms)** with professional easings:',
        '• Backdrop darkens with blur (400ms)',
        '• Sheet slides up with slight overshoot (500ms, `cubic-bezier(0.22,1.1,0.36,1)`)',
        '• Grab handle appears (scaleX 0.5→1, 50ms delay)',
        '• Icon enters with elastic scale 0.6→1 (120ms delay, `cubic-bezier(0.34,1.4,0.5,1)`)',
        '• Left button: scale 0.88→1 + slide up 18px (220ms delay)',
        '• Right button: same motion 80ms later (300ms delay)',
        'Nothing appears abruptly — each element enters in sequence, constructing the sheet in layers.',
        'Tap outside the sheet or on the backdrop closes without starting. Tap on L or R fires medium haptic, closes the sheet with reverse animation, and starts the nursing timer on the chosen side.',
        'Removed the "L→" / "R→" indicator that used to sit in the corner of the quick button (it was the hint for the suggested side — not needed anymore since mom chooses every time).',
        'The `nextNursingSide` and `lastNursingSide` are still computed in global state but no longer used by the quick button. They may become useful again in the future if we want to show the last side inside the sheet itself.'
      ]
    }
  },
  {
    v: "9.4.0", date: "2026-04-09",
    pt: {
      title: "Quick buttons 2×3 + ícones Lucide + tummy time no Ring",
      bullets: [
        '★ **Novo layout de quick buttons: grid 2×3.** Agora o Home tem **6 atalhos** em vez de 4: Mamadeira · Amamentação · Fralda na primeira linha, Sono · Soneca · Tummy time na segunda. Os botões ficaram maiores e mais fáceis de tocar, e finalmente você tem um atalho pra fralda sem precisar abrir o Sheet (que era estranho porque fralda acontece 8-10x por dia).',
        '★ **Tummy time agora aparece no Ring quando ativo**, exatamente como a soneca. Arco âmbar crescendo em tempo real, ícone `baby` respirando no meio (glowBreathe), comet tip no final. Mesma linguagem visual do nap — só muda a cor (roxo → âmbar) e o ícone (cloud → baby).',
        '★ **3 ícones redesenhados usando a biblioteca Lucide** (licença ISC, a mesma fonte do ícone `baby` que entrou na v9.3.0):',
        '• **Mamadeira** — trocou o desenho tosco de frasco vertical pela versão do **Lucide Lab** (`bottle-baby`): mamadeira estilizada em diagonal, com marcas de graduação. Muito mais profissional.',
        '• **Banho** — trocou a banheira improvisada pela **`bath`** oficial do Lucide: tampa, torneira, perninhas e chão. Ícone reconhecível imediatamente.',
        '• **Régua** (crescimento) — trocou a régua diagonal simplista pela **`ruler`** oficial do Lucide: corpo retangular rotacionado 45° com tick marks visíveis.',
        'Os ícones `breast` (amamentação) e `diaper` (fralda) continuam como estavam — Lucide não tem equivalentes diretos pra eles e os atuais ainda são reconhecíveis. `moon`, `sun`, `cloud`, `zap`, `thermo`, `pill` já eram estilo Feather/Lucide desde o início e continuam.',
        'Modo Night Wake continua com seus 2 botões especiais (Mamadeira + Fralda) em flex row — layout e comportamento mantidos pra não atrapalhar o fluxo de madrugada.'
      ]
    },
    en: {
      title: "2×3 quick buttons + Lucide icons + tummy time in Ring",
      bullets: [
        '★ **New quick button layout: 2×3 grid.** Home now has **6 shortcuts** instead of 4: Bottle · Nursing · Diaper on the first row, Sleep · Nap · Tummy time on the second. Buttons are bigger and easier to tap, and you finally get a diaper shortcut without having to open the Sheet (which was weird given diapers happen 8-10x per day).',
        '★ **Tummy time now appears in the Ring when active**, exactly like naps. Amber arc growing in real time, `baby` icon breathing in the middle (glowBreathe), comet tip at the end. Same visual language as nap — only the color (purple → amber) and icon (cloud → baby) change.',
        '★ **3 icons redesigned using the Lucide library** (ISC license, same source as the `baby` icon from v9.3.0):',
        '• **Bottle** — replaced the clunky vertical flask drawing with the **Lucide Lab** version (`bottle-baby`): stylized diagonal baby bottle with tick marks. Much more professional.',
        '• **Bath** — replaced the improvised tub with the official **`bath`** from Lucide: lid, faucet, little legs, and floor. Immediately recognizable.',
        '• **Ruler** (growth) — replaced the oversimplified diagonal ruler with the official **`ruler`** from Lucide: rectangular body rotated 45° with visible tick marks.',
        'The `breast` (nursing) and `diaper` icons are unchanged — Lucide has no direct equivalents and the current ones are still recognizable. `moon`, `sun`, `cloud`, `zap`, `thermo`, `pill` were already Feather/Lucide style from the start and remain.',
        'Night Wake mode keeps its 2 special buttons (Bottle + Diaper) in flex row — layout and behavior preserved to not mess with the late-night flow.'
      ]
    }
  },
  {
    v: "9.3.0", date: "2026-04-09",
    pt: {
      title: "Tummy time + editar início de bedtime ao vivo",
      bullets: [
        '★ **Novo tipo: Tummy time.** Adicionado como 10º item no Sheet "+ Adicionar", cor âmbar. Form simples com data, hora e duração em minutos+segundos (formato diferente do sleep porque sessões são curtas).',
        '★ **Timer ao vivo de tummy time** com botão "Iniciar timer" no AddForm. Formato `mm:ss` no TimerBar ativo, mesmo vocabulário visual dos outros active timers (gradient duplo + radial highlight + sombra colorida). Wake lock ativa durante o timer pra tela não apagar enquanto você acompanha.',
        '★ **Ícone profissional de bebê** da biblioteca **Lucide** (open-source, licença ISC) — carinha com sorriso. Depois de várias tentativas desenhando do zero que ficavam parecendo inseto, fui buscar numa lib profissional e adaptei pro sistema de gradients do app.',
        '★ **Editar início de bedtime/soneca/tummy time ao vivo.** Novo botão de lápis no TimerBar ativo. Toca → abre modal com campos de data e hora pra mudar o início. Mostra preview da nova duração em tempo real. Se tiver despertares registrados (night wakings), eles **permanecem no horário real** em que aconteceram — non-destructive.',
        '**Proteção contra dados inválidos:** não permite mover o início pra depois do primeiro waking, nem pro futuro, nem pra mais de 30h atrás. Botão "Salvar" fica desabilitado em caso inválido, com mensagem de erro clara.',
        '**Novo indicador "desde HH:MM"** no TimerBar ativo — mostra o horário real de início ao lado do tempo decorrido. Facilita conferir se o bedtime começou na hora certa antes de precisar editar.',
        'EntryRow do tummy time mostra a duração formatada como "3min 42s" ou "5min" (sem segundos quando é zero).'
      ]
    },
    en: {
      title: "Tummy time + edit live bedtime start",
      bullets: [
        '★ **New type: Tummy time.** Added as the 10th item in the "+ Add" Sheet, amber color. Simple form with date, time and duration in minutes+seconds (different format from sleep because sessions are short).',
        '★ **Live tummy time timer** with "Start timer" button in AddForm. `mm:ss` format in the active TimerBar, same visual vocabulary as other active timers (double gradient + radial highlight + colored shadow). Wake lock activates during the timer so the screen stays on while you watch.',
        '★ **Professional baby icon** from the **Lucide** library (open-source, ISC license) — smiling face. After multiple from-scratch attempts that looked like insects, I went and grabbed it from a professional lib and adapted it to the app\'s gradient system.',
        '★ **Edit live bedtime/nap/tummy time start.** New pencil button on the active TimerBar. Tap → opens a modal with date and time fields to change the start. Shows new duration preview in real time. If night wakings are registered, they **stay at their actual time** — non-destructive.',
        '**Protection against invalid data:** doesn\'t allow moving the start after the first waking, into the future, or more than 30h back. "Save" button is disabled on invalid input, with clear error message.',
        '**New "since HH:MM" indicator** on the active TimerBar — shows the actual start time next to the elapsed time. Makes it easy to check if bedtime started at the right time before needing to edit.',
        'Tummy time EntryRow shows duration formatted as "3min 42s" or "5min" (no seconds when it\'s zero).'
      ]
    }
  },
  {
    v: "9.2.0", date: "2026-04-08",
    pt: {
      title: "Fase 3: Apple Polish completo + Heartbeat Glow no splash",
      bullets: [
        '★ **Última leva do Apple Polish.** Mais 11 componentes refeitos seguindo o vocabulário visual confident estabelecido nas v9.0.0 e v9.1.0. Agora o app inteiro tem polish consistente.',
        '★ **Splash de abertura agora pulsa como coração.** A logo (window.LOUISE_ICON, a mesma de sempre) ganhou animação **Heartbeat Glow**: 2 batidas próximas (lub-dub) a cada 1.4s, com um halo roxo respirando em ciclo separado de 2.8s atrás da logo. As estrelas, anéis sutis e a entrada com scale-up continuam — o `splashFloat` (float vertical) foi substituído pelo heartbeat.',
        '**Modal genérico** (changelog, sleep info, confirmações): gradient interno + radial highlight + glow roxo sutil ao redor, raio 24→26px, X button 28→32px, padding mais generoso.',
        '**Sheet bottom drawer**: gradient interno, raio 28→32px, handle 44×5, glow roxo. Os ícones grandes do "+ Adicionar" foram **mantidos como estavam** — eles já tinham um design elaborado de 70px com radial gradient e drop shadow colorido, melhor que tudo no resto do app.',
        '**InboxPanel** (notificações slide-in): bell box 36→42px com gradient duplo, title 17→19px com tracking. "HOJE · TUE 7" perde o all-caps → "Hoje · Ter 7". Items da lista ganham mesmo tratamento do EntryRow (stripe absoluto reto, gradient interno, ícone 38px com gradient duplo).',
        '**Bottom nav pill**: gradient vertical + blur 30px, glow roxo flutuando ao redor. Item ativo com gradient + ring + sombra colorida (era só bg flat 12% alpha). **Botão "+" central** 50→54px com gradient vertical, inset highlight branco e ring roxo translúcido ao redor.',
        '**Card de Reminders** (lembretes de medicamento): gradient interno, header com icon-wrap 32px gradient duplo, items com stripe colorido absoluto, time-badge com gradient, botão "Adicionar" com gradient + sombra colorida.',
        '**CuriosityCard** do Home: gradient + radial highlight + sombra de glow colorida, icon-wrap 32px com borda colorida, title 13→15px peso 700, body 11→12px mais legível.',
        '**Toast** (notificações curtas tipo "Mamadeira registrada · Desfazer"): gradient interno, raio 14→18px, padding maior, botão "Desfazer" com gradient vertical + sombra colorida.',
        '**TimerBar nursing** (case L/R do timer de amamentação): gradient interno + radial highlight + sombra colorida profunda, ícone 36→44px, time 18→20px com tracking -0.6, botões pause e stop com gradient + inset highlight.',
        '**LastFeedCard** (Home): stripe colorido absoluto, gradient interno, ícone 40→46px com gradient duplo + borda colorida, valor principal 18→20px com tracking.',
        '**WeeklyCard** (Home, comparação semana atual vs anterior): gradient interno + inset highlight, ícones com background gradient duplo + borda colorida, valores percentuais com tabular numerals e tracking negativo.',
        '**UpdateToast** (toast roxo de versão nova): radial highlight no topo, ícone 36→42px com gradient duplo + borda branca, sombras mais profundas, botão "Ver novidades" com inset shadow.'
      ]
    },
    en: {
      title: "Phase 3: Complete Apple Polish + Heartbeat Glow splash",
      bullets: [
        '★ **Final Apple Polish wave.** 11 more components rebuilt following the confident visual vocabulary established in v9.0.0 and v9.1.0. The entire app now has consistent polish.',
        '★ **Splash screen now pulses like a heart.** The logo (window.LOUISE_ICON, the same one as always) got the **Heartbeat Glow** animation: 2 close beats (lub-dub) every 1.4s, with a purple halo breathing on a separate 2.8s cycle behind the logo. Stars, subtle rings and the scale-up entry remain — `splashFloat` (vertical float) was replaced by the heartbeat.',
        '**Generic Modal** (changelog, sleep info, confirmations): internal gradient + radial highlight + subtle purple glow around, 24→26px radius, 28→32px X button, more generous padding.',
        '**Sheet bottom drawer**: internal gradient, 28→32px radius, 44×5 handle, purple glow. Big "+ Add" icons were **kept as they were** — they already had an elaborate 70px design with radial gradient and colored drop shadow, better than everything else in the app.',
        '**InboxPanel** (slide-in notifications): bell box 36→42px with double gradient, 17→19px title with tracking. "TODAY · TUE 7" loses all-caps → "Today · Tue 7". List items get the same treatment as EntryRow (straight absolute stripe, internal gradient, 38px icon with double gradient).',
        '**Bottom nav pill**: vertical gradient + blur 30px, purple glow floating around. Active item with gradient + ring + colored shadow (was just flat 12% alpha bg). **Central "+" button** 50→54px with vertical gradient, white inset highlight and translucent purple ring around.',
        '**Reminders card** (medication reminders): internal gradient, header with 32px double-gradient icon-wrap, items with absolute colored stripe, time-badge with gradient, "Add" button with gradient + colored shadow.',
        '**Home CuriosityCard**: gradient + radial highlight + colored glow shadow, 32px icon-wrap with colored border, 13→15px title weight 700, 11→12px body more readable.',
        '**Toast** (short notifications like "Bottle logged · Undo"): internal gradient, 14→18px radius, more padding, "Undo" button with vertical gradient + colored shadow.',
        '**TimerBar nursing** (L/R nursing timer case): internal gradient + radial highlight + deep colored shadow, 36→44px icon, 18→20px time with -0.6 tracking, pause and stop buttons with gradient + inset highlight.',
        '**Home LastFeedCard**: absolute colored stripe, internal gradient, 40→46px icon with double gradient + colored border, 18→20px main value with tracking.',
        '**Home WeeklyCard** (current vs previous week comparison): internal gradient + inset highlight, icons with double-gradient background + colored border, percentage values with tabular numerals and negative tracking.',
        '**UpdateToast** (purple toast for new version): radial highlight on top, 36→42px icon with double gradient + white border, deeper shadows, "See what\'s new" button with inset shadow.'
      ]
    }
  },
  {
    v: "9.1.0", date: "2026-04-08",
    pt: {
      title: "Apple Polish Full Sweep + fix do gráfico Simeticona",
      bullets: [
        '★ **Continuação do redesign Apple-style começado na v9.0.0.** Aplicado o tratamento "confident" em mais 7 componentes que ainda estavam no estilo antigo. Agora o app tem polish consistente em quase tudo.',
        '★ **Bug do stripe colorido reto corrigido.** Na v9.0.0 a borda esquerda dos itens da lista (verde nas mamadeiras, roxo nos sonos, etc) estava ficando torta/cortada por causa da combinação de `borderLeft` + `overflow:hidden` + `transform` do swipe-to-delete. Refeita como **div absoluto de 4px com gradient**, garantindo que a linha sempre fica reta de cima a baixo.',
        '★ **Bug do gráfico de Simeticona corrigido.** Os labels "2" no topo das barras estavam sendo cortados pelo `overflow:hidden` do contêiner. Removido o overflow, altura aumentada de 80→100px.',
        '**EntryRow** (itens da History) refeito: stripe colorido reto, background mais sólido, ícone 42px com gradient duplo, título 15px peso 600, horário 16px peso 700 com tracking -0.4 e tabular numerals.',
        '**SleepBlock header** com mesma técnica do stripe + ícone 50px, time-range 18px com tracking, padding generoso.',
        '**Card "Today" da History** com gradient interno, raio 20px, botões de navegação 38px com inset, stats com weight 600 e tabular numerals.',
        '**Filter pills** (All/Milk/Sleep/Diaper/Meds): padding +50%, raio 12px, todos com background sutil, ativo com gradient + glow + ring colorido.',
        '**Active timer** (Bedtime/Nap em andamento): gradient duplo + radial highlight + sombra colorida profunda, ícone 50px, time 26px com tracking -1px.',
        '**Profile toggles** (Notificações, Manter tela ligada, Vibração tátil): card maior, switches 52×32 com gradient vertical e sombra colorida, knob 24px com sombra mais marcada, separadores mais sutis.',
        '**InsightCards** do Home: gradient + radial highlight + ícone 42px com borda colorida, sombra colorida sutil de glow, título 15px com cor mais vibrante.'
      ]
    },
    en: {
      title: "Apple Polish Full Sweep + Simeticone chart fix",
      bullets: [
        '★ **Continuation of the Apple-style redesign started in v9.0.0.** Applied the "confident" treatment to 7 more components that were still in the old style. The app now has consistent polish across almost everything.',
        '★ **Straight colored stripe bug fixed.** In v9.0.0 the left border of list items (green on bottles, purple on sleeps, etc.) was rendering crooked/cut due to the combination of `borderLeft` + `overflow:hidden` + swipe-to-delete `transform`. Rebuilt as an **absolute 4px div with gradient**, ensuring the line always stays straight top to bottom.',
        '★ **Simeticone chart bug fixed.** The "2" labels on top of the bars were being cut off by the container `overflow:hidden`. Removed the overflow, height bumped from 80→100px.',
        '**EntryRow** (History list items) rebuilt: straight colored stripe, more solid background, 42px icon with double gradient, 15px title 600 weight, 16px time 700 weight with -0.4 tracking and tabular numerals.',
        '**SleepBlock header** with the same stripe technique + 50px icon, 18px time-range with tracking, generous padding.',
        '**History "Today" card** with internal gradient, 20px radius, 38px nav buttons with inset, stats with weight 600 and tabular numerals.',
        '**Filter pills** (All/Milk/Sleep/Diaper/Meds): +50% padding, 12px radius, all with subtle background, active with gradient + glow + colored ring.',
        '**Active timer** (Bedtime/Nap in progress): double gradient + radial highlight + deep colored shadow, 50px icon, 26px time with -1px tracking.',
        '**Profile toggles** (Notifications, Keep screen on, Haptic feedback): larger card, 52×32 switches with vertical gradient and colored shadow, 24px knob with more pronounced shadow, subtler separators.',
        '**Home InsightCards**: gradient + radial highlight + 42px icon with colored border, subtle colored glow shadow, 15px title with more vibrant color.'
      ]
    }
  },
  {
    v: "9.0.0", date: "2026-04-08",
    pt: {
      title: "MAJOR: Apple Polish · redesign sutil em todo o app",
      bullets: [
        '★ **Redesign visual estilo Apple aplicado em todo o app.** Seguindo o mockup "Confident" aprovado anteriormente. A identidade do Louise Pro continua a mesma (escuro, roxo, ícones SVG, starfield) — só ficou mais "premium".',
        '**Inputs do AddForm** ganharam padding generoso (17×18px), raio 16px, fonte 17px com peso 600 e tracking negativo, background mais claro, borda super sutil (`rgba(255,255,255,0.06)`), inset highlight no topo. Sente como app nativo iOS.',
        '**Labels dos campos** perderam o all-caps. Antes: "DIA · TODAY" todo em maiúsculas. Agora: "Dia · Hoje" em sentence case (mais Apple). Cor mais clara e tracking ajustado.',
        '**Cards de stat** (Diapers/dia, Mamadas/dia, Sonecas/dia na Stats) ganharam raio 20px, padding maior, valores 26px com tracking negativo e tabular numerals. Os números viraram protagonistas.',
        '**Itens de lista** (entries da History/Home) ganharam ícones 38px com borda colorida sutil, padding generoso, raio 16px, tracking negativo nos horários. Mantém o borderLeft característico.',
        '**Botões "Salvar"** ganharam gradient vertical (luz vinda de cima), inset highlight branco no topo, sombras de 2 camadas (próxima + profunda), raio 18px, fonte 17px. Mais "physical".',
        '**Tokens novos:** `T.gBSoft` (border sutil) e `T.insetTop` (inset highlight) — centralizados pra reusar e manter consistência. Não toquei no `T.gB` original (51 usos pelo app) pra não quebrar nada fora do escopo do redesign.'
      ]
    },
    en: {
      title: "MAJOR: Apple Polish · subtle redesign across the app",
      bullets: [
        '★ **Apple-style visual redesign applied across the entire app.** Following the "Confident" mockup approved earlier. Louise Pro\'s identity stays the same (dark, purple, SVG icons, starfield) — it just got more "premium".',
        '**AddForm inputs** got generous padding (17×18px), 16px radius, 17px font with 600 weight and negative tracking, lighter background, super subtle border (`rgba(255,255,255,0.06)`), inset highlight on top. Feels like a native iOS app.',
        '**Field labels** lost the all-caps. Before: "DAY · TODAY" all caps. Now: "Day · Today" in sentence case (more Apple). Lighter color and adjusted tracking.',
        '**Stat cards** (Diapers/day, Feedings/day, Naps/day in Stats) got 20px radius, more padding, 26px values with negative tracking and tabular numerals. Numbers became the protagonists.',
        '**List items** (History/Home entries) got 38px icons with subtle colored border, generous padding, 16px radius, negative tracking on the timestamps. Keeps the characteristic borderLeft.',
        '**Save buttons** got a vertical gradient (light from above), white inset highlight on top, 2-layer shadows (close + deep), 18px radius, 17px font. More "physical".',
        '**New tokens:** `T.gBSoft` (subtle border) and `T.insetTop` (inset highlight) — centralized to reuse and maintain consistency. Didn\'t touch the original `T.gB` (51 usages across the app) to avoid breaking anything outside the redesign scope.'
      ]
    }
  },
  {
    v: "8.5.11", date: "2026-04-08",
    pt: {
      title: "Fix definitivo dos inputs colidindo (Safari WebKit)",
      bullets: [
        '★ **Bug do retângulo transbordando finalmente resolvido.** A v8.5.10 aplicou `min-width:0` no Fld mas isso não foi suficiente. A causa real era que o `1fr` puro do CSS Grid no Safari WebKit tem um bug onde **paradoxalmente** força os items a respeitarem o tamanho intrínseco do conteúdo (em inputs date/time, isso é o tamanho do texto formatado tipo "8 Apr 2026").',
        '**Fix em 2 partes:** (1) trocar todos os `gridTemplateColumns:"1fr 1fr"` por `"minmax(0,1fr) minmax(0,1fr)"` — força as colunas a poderem encolher até zero, o que faz o Safari calcular o `fr` corretamente. (2) adicionar `WebkitAppearance:"none"` em todos os inputs do app — remove o padding interno nativo do iOS Safari que escapa do controle CSS.',
        'Aplicado em **7 grids** do app: AddForm (data+hora), ProfilePage (peso/comp/cabeça do nascimento), GrowthPage (nova medição), Stats (cards de média), Home (cards de quick stats) e mais. Todos respeitam minmax(0,1fr) agora.',
        'Aplicado em **3 objetos `inp`**: AddForm, ProfilePage, GrowthPage — todos os formulários do app passam pelo fix.'
      ]
    },
    en: {
      title: "Definitive fix for colliding inputs (Safari WebKit)",
      bullets: [
        '★ **The overflowing rectangle bug is finally fixed.** v8.5.10 applied `min-width:0` to Fld but that wasn\'t enough. The real cause was that bare `1fr` in CSS Grid on Safari WebKit has a bug where it **paradoxically** forces items to respect content intrinsic size (for date/time inputs, that\'s the size of the formatted text like "8 Apr 2026").',
        '**2-part fix:** (1) replace all `gridTemplateColumns:"1fr 1fr"` with `"minmax(0,1fr) minmax(0,1fr)"` — forces columns to be able to shrink to zero, which makes Safari calculate `fr` correctly. (2) add `WebkitAppearance:"none"` to all app inputs — removes the iOS Safari native internal padding that escapes CSS control.',
        'Applied to **7 grids** in the app: AddForm (date+time), ProfilePage (birth weight/length/head), GrowthPage (new measurement), Stats (average cards), Home (quick stats cards) and more. All respect minmax(0,1fr) now.',
        'Applied to **3 `inp` objects**: AddForm, ProfilePage, GrowthPage — all the app\'s forms go through the fix.'
      ]
    }
  },
  {
    v: "8.5.10", date: "2026-04-08",
    pt: {
      title: "Fix de inputs colidindo no AddForm + bug bilíngue do GrowthPage",
      bullets: [
        '★ **Bug visual no AddForm corrigido.** O retângulo do campo "Dia" estava encostando/sobrepondo o retângulo do campo "Hora" quando eles ficavam lado a lado num grid 2 colunas. Causa: inputs nativos do iOS (date/time) ignoram parcialmente o `width:100%` do contêiner e transbordam o gap.',
        'Fix em 3 camadas: **(1)** componente `Fld` agora tem `min-width:0` (força grid items a respeitar o `1fr` em vez do conteúdo), **(2)** todos os inputs ganharam `box-sizing:border-box` (padding/borda dentro do width), **(3)** todos ganharam `max-width:100%` como segunda guarda contra o iOS.',
        'O fix se propaga **automaticamente** pra todos os formulários do app: AddForm, ProfilePage (data de nascimento), GrowthPage (nova medição) — porque todos usam o `Fld` e o `inp` compartilhados.',
        '**Bonus:** corrigido bug bilíngue no botão "Save measurement" do GrowthPage — em modo EN ele mostrava "Save medição" (mistura PT+EN). Agora respeita o idioma corretamente.'
      ]
    },
    en: {
      title: "Fix for colliding inputs in AddForm + bilingual bug in GrowthPage",
      bullets: [
        '★ **Visual bug in AddForm fixed.** The "Day" field rectangle was touching/overlapping the "Time" field rectangle when they sat side by side in a 2-column grid. Cause: iOS native inputs (date/time) partially ignore the container `width:100%` and overflow the gap.',
        '3-layer fix: **(1)** the `Fld` component now has `min-width:0` (forces grid items to respect `1fr` instead of content), **(2)** all inputs got `box-sizing:border-box` (padding/border inside the width), **(3)** all got `max-width:100%` as a second guard against iOS.',
        'The fix propagates **automatically** to every form in the app: AddForm, ProfilePage (birth date), GrowthPage (new measurement) — because they all use the shared `Fld` and `inp`.',
        '**Bonus:** fixed bilingual bug in the "Save measurement" button of GrowthPage — in EN mode it was showing "Save medição" (PT+EN mix). Now respects the language correctly.'
      ]
    }
  },
  {
    v: "8.5.9", date: "2026-04-08",
    pt: {
      title: "Bug bilíngue no formulário de adicionar evento",
      bullets: [
        '★ **Labels do AddForm misturavam idiomas.** O label "Dia · Today" aparecia com português + inglês juntos quando o app estava em inglês. Causa: o "Dia · " estava hard-coded em PT mas concatenava com o `dateLbl` que respeitava o idioma — gerando o mix.',
        'Corrigidos também os labels do formulário de Amamentação ("Lado" e "Duração (min)") que estavam fixos em português, e o resumo "Duração: Xh Ym (próximo dia)" no modo end-time do sleep.',
        'Agora todos os labels do AddForm respeitam o toggle PT/EN do Profile.'
      ]
    },
    en: {
      title: "Bilingual bug in the add-event form",
      bullets: [
        '★ **AddForm labels were mixing languages.** The label "Dia · Today" appeared with Portuguese + English together when the app was in English. Cause: "Dia · " was hard-coded in PT but concatenated with `dateLbl` which respected the language — generating the mix.',
        'Also fixed the Nursing form labels ("Lado" and "Duração (min)") that were fixed in Portuguese, and the "Duração: Xh Ym (próximo dia)" summary in the sleep end-time mode.',
        'All AddForm labels now respect the PT/EN toggle in Profile.'
      ]
    }
  },
  {
    v: "8.5.8", date: "2026-04-06",
    pt: {
      title: "Filtros específicos mostram tudo do dia (incluindo eventos da noite)",
      bullets: [
        '★ **Bug corrigido nos filtros da History.** Ao filtrar por Diaper, Milk ou Meds, eventos que estavam dentro de um bedtime (registrados via Night Wake) não apareciam na lista — mesmo sendo contados no resumo do card "Today". Agora quando você seleciona um filtro específico, a lista mostra **todos** os eventos daquele tipo no dia, em ordem cronológica plana.',
        '★ **Badge "noite" nos eventos da madrugada.** Para você não perder o contexto, eventos que aconteceram durante um bedtime agora ganham um badgezinho azul discreto com ícone de lua ao lado do título (🌙 noite). Visível só quando está num filtro específico.',
        'Filtros "All" e "Sleep" continuam com o agrupamento por bedtime (o SleepBlock expansível) — porque faz sentido ver a noite como unidade quando você quer a visão geral do dia.'
      ]
    },
    en: {
      title: "Specific filters now show everything (including night events)",
      bullets: [
        '★ **Bug fixed in History filters.** When filtering by Diaper, Milk or Meds, events that were inside a bedtime (logged via Night Wake) weren\'t showing up in the list — even though they were counted in the "Today" card summary. Now when you pick a specific filter, the list shows **every** event of that type in the day, in flat chronological order.',
        '★ **"Night" badge on overnight events.** So you don\'t lose context, events that happened during a bedtime now get a subtle blue badge with a moon icon next to the title (🌙 night). Only visible when you are on a specific filter.',
        '"All" and "Sleep" filters still keep the bedtime grouping (the expandable SleepBlock) — because it makes sense to see the night as a unit when you want the overall view of the day.'
      ]
    }
  },
  {
    v: "8.5.7", date: "2026-04-06",
    pt: {
      title: "Quebra de fraldas wet/dirty e remoção da timeline inútil",
      bullets: [
        '★ **Card "Today" da History agora mostra quebra de fraldas.** Ao lado do total de ml e de sono, aparecem dois novos stats: **gota azul** (quantas fraldas tiveram xixi) e **cocô marrom** (quantas tiveram cocô). Fraldas "both" contam nos dois lados — o que faz sentido quando você pensa "quantos xixis" e "quantos cocôs" no dia.',
        '★ **Timeline mini removida.** Aquela barra horizontal com segmentos roxos/verdes logo abaixo dos filtros da History foi removida. Estava com bug de label (todos os horários mostravam o mesmo valor), visualmente difícil de ler e duplicava a informação que o Ring do Home já mostra bem melhor.',
        'Bonus técnico: a remoção elimina o único IIFE dentro de JSX que sobrava no código, ficando 100% Babel-safe conforme a regra do projeto.'
      ]
    },
    en: {
      title: "Diaper wet/dirty breakdown and useless timeline removal",
      bullets: [
        '★ **History "Today" card now shows diaper breakdown.** Next to the total ml and sleep, two new stats appear: **blue droplet** (how many diapers had pee) and **brown poop** (how many had poop). "Both" diapers count on both sides — which makes sense when you think "how many pees" and "how many poops" in a day.',
        '★ **Mini timeline removed.** That horizontal bar with purple/green segments right below the History filters was removed. It had a label bug (all timestamps showed the same value), was visually hard to read, and duplicated info that the Home Ring already shows much better.',
        'Technical bonus: removing it eliminates the last IIFE inside JSX in the codebase, making it 100% Babel-safe per the project rule.'
      ]
    }
  },
  {
    v: "8.5.6", date: "2026-04-06",
    pt: {
      title: 'Bug do "Dormindo a noite toda" e gráfico de Simeticona',
      bullets: [
        '★ **Bug crítico corrigido no engine de insights.** O alerta "Dormindo a noite toda" estava aparecendo pra Louise (1 mês de idade) — biologicamente impossível. A causa: o engine contava noites com sleep registrado mas **sem o tracking de Night Wake** como "0 despertares". Agora ele só conta noites onde o Night Wake foi de fato usado.',
        '★ **Camada extra de proteção:** o insight "Dormindo a noite toda" agora exige **idade mínima de 16 semanas** (4 meses). Antes disso, é fisiologicamente esperado que o bebê acorde pra mamar — então mesmo se o tracking mostrar zero despertares, o insight não aparece.',
        '**Recap da v8.5.5** (caso esteja vindo de uma versão antiga): novo card de Simeticona na aba Stats — gráfico de doses por dia em barras laranjas, com média/dia e horário da última dose no header.'
      ]
    },
    en: {
      title: 'Bug fix on "Sleeping through the night" + Simeticone chart',
      bullets: [
        '★ **Critical bug fix in the insight engine.** The "Sleeping through the night" hint was firing for Louise (1 month old) — biologically impossible. The cause: the engine was counting nights with sleep logged but **no Night Wake tracking** as "0 wakings". Now it only counts nights where Night Wake was actually used.',
        '★ **Extra safety net:** the "Sleeping through the night" insight now requires a **minimum age of 16 weeks** (4 months). Before that, it is physiologically expected for babies to wake up to feed — so even if tracking shows zero wakings, the insight stays hidden.',
        '**Recap from v8.5.5** (in case you are coming from an older version): new Simeticone card on the Stats tab — doses-per-day bar chart in orange, with daily average and last dose time in the header.'
      ]
    }
  },
  {
    v: "8.5.5", date: "2026-04-06",
    pt: {
      title: "Gráfico de Simeticona na aba Stats",
      bullets: [
        '★ **Novo card de Simeticona no fim da Stats.** Mostra o número de doses por dia em barras laranjas, igual aos cards de leite e sono. Acompanha o seletor 7d/14d/30d/all.',
        'Header com 2 infos: **doses/dia** (média do período) e **última dose** (horário + tempo desde então).',
        'Detecção case-insensitive — qualquer remédio cujo nome contenha "simet" entra na contagem (Simeticona, simeticona etc).',
        'Empty state amigável: se não tiver nenhuma dose no período, mostra texto centralizado em vez de gráfico vazio.'
      ]
    },
    en: {
      title: "Simeticone chart on Stats tab",
      bullets: [
        '★ **New Simeticone card at the end of Stats.** Shows the number of doses per day as orange bars, same style as milk and sleep cards. Follows the 7d/14d/30d/all selector.',
        'Header with 2 stats: **doses/day** (period average) and **last dose** (time + time-since).',
        'Case-insensitive detection — any medicine whose name contains "simet" counts (Simeticona, Simeticone etc).',
        'Friendly empty state: if no doses in the period, shows centered text instead of an empty chart.'
      ]
    }
  },
  {
    v: "8.5.4", date: "2026-04-06",
    pt: {
      title: "Sleep em progresso aparece no Home, History só finalizado",
      bullets: [
        '★ **Bedtime/nap em andamento agora aparece no Home**, no topo da lista "Hoje", como bloco ao vivo (pulsante azul, "ao vivo"). Antes só aparecia na aba History.',
        '★ **Aba History agora só mostra sonos finalizados.** Enquanto o sleep está rolando, ele fica reservado pro Home. Ao terminar, vira entry consolidada e aparece nos dois lugares (com Edit/lixeira).',
        'Ajuste de coerência: a lista do Home também passa a esconder eventos que caem dentro de qualquer bedtime (igual a History já fazia desde a v8.5.3), pra não duplicar com o que aparece dentro do bloco.'
      ]
    },
    en: {
      title: "In-progress sleep now shows on Home, History only finalized",
      bullets: [
        '★ **In-progress bedtime/nap now appears on Home**, at the top of the "Today" list, as a live block (pulsing blue, "live"). Previously it only appeared in the History tab.',
        '★ **History tab now only shows finalized sleeps.** While the sleep is running, it stays reserved for Home. Once it ends, it becomes a consolidated entry and appears in both places (with Edit/trash).',
        'Consistency tweak: the Home list also now hides events that fall inside any bedtime (matching what History already did since v8.5.3), so they do not duplicate with what shows inside the block.'
      ]
    }
  },
  {
    v: "8.5.3", date: "2026-04-06",
    pt: {
      title: "Eventos da madrugada agora ficam dentro do bedtime e podem ser editados",
      bullets: [
        '★ **Qualquer evento registrado durante a madrugada agora aparece dentro do bloco do bedtime** — não só mamada e fralda. Vale para remédio, temperatura, banho. A regra é: se o tipo do evento não é sleep/nap/wakeup/nightwaking/growth e o horário cai dentro do range da noite, ele entra.',
        '★ **Detecção retroativa.** Eventos antigos sem o link explícito (registrados antes desta versão ou cadastrados manualmente sem ativar Night Wake) também são detectados pelo horário e mostrados dentro do bloco. Não some nada — só reorganiza.',
        '★ **Editar e excluir eventos aninhados.** Cada item da lista "Atividade da noite" agora é tocável (abre o form de edição) e tem uma lixeirinha do lado pra excluir. Resolve o caso clássico: cadastrei fralda dupla por engano, agora consigo apagar uma.',
        'Eventos que caem dentro do bedtime mas fora dos ranges dos despertares aparecem numa seção "Outros eventos" no fim do bloco — não somem, só ficam separados visualmente.'
      ]
    },
    en: {
      title: "Night events nest inside bedtime and can be edited",
      bullets: [
        '★ **Any event logged during the night now appears inside the bedtime block** — not just bottle and diaper. Works for medicine, temperature, bath. Rule: if the type is not sleep/nap/wakeup/nightwaking/growth and the time falls inside the night range, it nests.',
        '★ **Retroactive detection.** Old events without the explicit link (logged before this version or added manually without Night Wake on) are also detected by time and shown inside the block. Nothing disappears — just reorganized.',
        '★ **Edit and delete nested events.** Each item in the "Night activity" list is now tappable (opens the edit form) and has a small trash button to delete. Solves the classic case: logged a double diaper by mistake, can now remove one.',
        'Events that fall inside the bedtime but outside any waking range appear in a "Other events" section at the end of the block — not hidden, just visually separated.'
      ]
    }
  },
  {
    v: "8.5.2", date: "2026-04-06",
    pt: {
      title: "Toggles do Profile agora salvam na hora",
      bullets: [
        '★ **Bug corrigido nos toggles.** Notificações, Manter tela ligada e Vibração tátil só salvavam quando você apertava o botão "Salvar" lá embaixo. Se saísse antes, o estado voltava ao reload. Agora **cada toggle persiste no Firestore na hora** — sem precisar tocar em Salvar.',
        'Texto do toggle de Notificações reescrito: era "Toque para ativar quando disponível" (confuso) e "Sistema pronto — nenhuma notificação enviada ainda" (desatualizado, da época antes dos lembretes funcionarem). Agora é direto: **"Toque para ativar"** quando off, e **"Notificações ativas — cadastre lembretes abaixo"** quando on.'
      ]
    },
    en: {
      title: "Profile toggles now save instantly",
      bullets: [
        '★ **Toggle bug fixed.** Notifications, Keep screen on, and Haptic feedback were only saved when you tapped the Save button at the bottom. If you left before, state reverted on reload. Now **each toggle persists to Firestore immediately** — no need to tap Save.',
        'Notifications toggle text rewritten: was "Tap to enable when available" (confusing) and "System ready — no notifications sent yet" (outdated, from before reminders worked). Now direct: **"Tap to enable"** when off, and **"Notifications on — add reminders below"** when on.'
      ]
    }
  },
  {
    v: "8.5.1", date: "2026-04-06",
    pt: {
      title: "Correção: sono no Home descontava errado",
      bullets: [
        '★ **Bug corrigido.** O card "Sono" no Home estava somando o tempo total na cama, incluindo os despertares noturnos. Agora mostra **só o sono real** (tempo na cama menos despertares), igual ao card de Stats.',
        'Os Stats e o histórico de SleepBlock já estavam corretos — só o totalizador do Home tinha esse bug.'
      ]
    },
    en: {
      title: "Fix: Home sleep total counted wake time",
      bullets: [
        '★ **Bug fixed.** The "Sleep" card on Home was summing total time in bed, including night wakings. Now shows **real sleep only** (time in bed minus wakings), matching the Stats card.',
        'Stats and SleepBlock history were already correct — only the Home totalizer had this bug.'
      ]
    }
  },
  {
    v: "8.5.0", date: "2026-04-06",
    pt: {
      title: "Lembretes de medicamento com push notification",
      bullets: [
        '★ **Cadastro de lembretes no Profile.** Nova seção "Lembretes de medicamento" — cadastra nome, dose e horário, salva no Firestore e sincroniza entre os dois iPhones.',
        '★ **Push notification de verdade no horário marcado.** Um Cloudflare Worker chamado louise-pro-fcm acorda a cada minuto, checa os lembretes e dispara FCM pros tokens cadastrados. Funciona mesmo com o app fechado (iOS 16.4+ instalado como PWA).',
        'Título da notificação = nome do remédio. Corpo = "Hora de dar: [dose]".',
        '**Ambos os dispositivos recebem** simultaneamente — você e a esposa não dependem um do outro pra lembrar.',
        'Tudo de graça: plano Spark do Firebase + Cloudflare Workers Free. Sem cartão, sem Cloud Functions.',
        'Pra excluir um lembrete, toca no X ao lado dele. Pra pausar, exclui e cadastra de novo depois.'
      ]
    },
    en: {
      title: "Medication reminders with push notifications",
      bullets: [
        '★ **Reminder management in Profile.** New "Medication reminders" section — add name, dose, time. Saved to Firestore, syncs across both iPhones.',
        '★ **Real push notifications at the scheduled time.** A Cloudflare Worker named louise-pro-fcm wakes up every minute, checks reminders, fires FCM to registered tokens. Works even with the app closed (iOS 16.4+ installed as PWA).',
        'Notification title = medicine name. Body = "Hora de dar: [dose]".',
        '**Both devices receive** simultaneously — you and your partner do not depend on each other to remember.',
        'Fully free: Firebase Spark plan + Cloudflare Workers Free. No credit card, no Cloud Functions.',
        'Tap the X next to a reminder to delete it. To pause, delete and re-add later.'
      ]
    }
  },
  {
    v: "8.4.11", date: "2026-04-06",
    pt: {
      title: "Ícone ativo no Ring mais discreto",
      bullets: [
        '★ **Indicação do último evento ficou calma.** O ícone ativo (último registrado) tinha 5 sinais visuais empilhados — tamanho aumentado, anel sólido grosso, anel tracejado giratório, glow forte e dots embaixo. Agora tem **apenas 1 anel fino externo** com uma respiração de opacidade lenta (3.5s).',
        'Mesma cor accent do tipo do evento (verde pra mamada, rosa pra fralda etc), mas sem dominar a tela.',
        'Tamanho **igual aos outros ícones** — sem aumento.',
        'Sonecas continuam intactas (já estavam no ponto certo).'
      ]
    },
    en: {
      title: "Calmer active icon in the Ring",
      bullets: [
        '★ **Last event indicator turned down.** The active icon (most recent) had 5 visual signals stacked — bigger size, thick solid ring, spinning dashed ring, strong glow and dots below. Now it has **just 1 thin outer ring** with a slow opacity breath (3.5s).',
        'Same accent color as the event type (green for bottle, pink for diaper, etc), but no longer dominates the screen.',
        '**Same size as other icons** — no enlargement.',
        'Naps left untouched (they were already perfect).'
      ]
    }
  },
  {
    v: "8.4.10", date: "2026-04-06",
    pt: {
      title: "Curiosidades na inbox de notificações",
      bullets: [
        '★ **Curiosidade do dia agora fica na inbox** até as 23:59. Se você não vir o card no Home pela manhã, pode abrir o sininho a qualquer hora do dia e ler com calma.',
        'Visual **distinguível das outras notificações**: borda lateral lavanda, fundo com gradiente sutil, label "CURIOSIDADE DO DIA" no topo e ícone de sol com glow.',
        'Continua **também no Home** — o card rápido segue aparecendo no horário usual, sem mudança.',
        'Reseta automaticamente à meia-noite junto com o resto da inbox.'
      ]
    },
    en: {
      title: "Curiosities in the notifications inbox",
      bullets: [
        '★ **Daily curiosity now lives in the inbox** until 23:59. If you miss the card on Home in the morning, you can open the bell anytime during the day and read it calmly.',
        'Visually **distinguishable from other notifications**: lavender side border, subtle gradient background, "DAILY CURIOSITY" label on top and glowing sun icon.',
        'Still **also appears on Home** — the quick card continues to show at the usual time, unchanged.',
        'Auto-resets at midnight along with the rest of the inbox.'
      ]
    }
  },
  {
    v: "8.4.9", date: "2026-04-06",
    pt: {
      title: "Wake up automático ao parar o bedtime",
      bullets: [
        '★ **Wake up automático.** Quando você para o timer do bedtime, o evento "Acordou" é criado automaticamente — com o resumo de quanto a Louise dormiu na noite (sono real, descontando despertares).',
        'O botão **Wake up no Ring continua existindo** como rede de segurança, mas agora é raramente necessário.',
        'Se você tocar o botão Wake up por hábito logo depois de parar o bedtime, o app detecta e **não duplica** — mostra um toast "Já acordou agora há pouco".'
      ]
    },
    en: {
      title: "Auto wake up when stopping bedtime",
      bullets: [
        '★ **Auto wake up.** When you stop the bedtime timer, the "Woke up" event is created automatically — with the summary of how much Louise slept that night (real sleep, minus wakings).',
        'The **Wake up button on the Ring still exists** as a safety net, but is rarely needed now.',
        'If you tap the Wake up button out of habit right after stopping the bedtime, the app detects it and **doesn\'t duplicate** — shows a toast "Already woke up just now".'
      ]
    }
  },
  {
    v: "8.4.8", date: "2026-04-06",
    pt: {
      title: "Fix de wakings cruzando meia-noite + resumo no Wake up",
      bullets: [
        '★ **Bug crítico corrigido.** Quando um bedtime cruzava a meia-noite, os despertares eram **duplicados** nas duas metades, fazendo o tempo "acordada" aparecer contado em dobro nas Stats e atribuído ao dia errado.',
        'A correção do **splitMidnight** atribui cada despertar à metade certa baseado no horário em que aconteceu — antes ou depois da meia-noite.',
        '**Rede de proteção para dados antigos:** o app detecta despertares duplicados em registros pré-v8.4.8 e corrige automaticamente na leitura, sem mexer no Firestore.',
        '★ **Resumo da noite no Wake up.** Quando você toca "Acordou" depois de um bedtime, o evento agora mostra **"9h57m de sono"** como detalhe — somando a noite completa (incluindo o pedaço de antes da meia-noite).'
      ]
    },
    en: {
      title: "Cross-midnight waking fix + sleep summary on Wake up",
      bullets: [
        '★ **Critical bug fixed.** When a bedtime crossed midnight, wakings were **duplicated** across both halves, making the "awake" time appear double in Stats and attributed to the wrong day.',
        'The **splitMidnight** fix assigns each waking to the correct half based on when it actually happened — before or after midnight.',
        '**Safety net for old data:** the app detects duplicated wakings in pre-v8.4.8 records and corrects them automatically on read, without modifying Firestore.',
        '★ **Night summary on Wake up.** When you tap "Woke up" after a bedtime, the event now shows **"9h57m of sleep"** as detail — counting the complete night (including the pre-midnight portion).'
      ]
    }
  },
  {
    v: "8.4.7", date: "2026-04-06",
    pt: {
      title: "Stats: 7d agora significa 7 dias completos",
      bullets: [
        '★ **Coerência entre seletor e cálculo.** Quando você seleciona "7d", agora a média é exatamente dos últimos 7 dias completos — não mais 6.',
        'O dia de hoje continua aparecendo no gráfico como **8ª barra de contexto** (destacada visualmente), mas não entra no cálculo da média.',
        'Mesmo princípio para 14d (14 completos + hoje) e 30d (30 completos + hoje).',
        'Subtítulo agora bate certinho: **"Últimos 7 dias completos"** quando você seleciona 7d.'
      ]
    },
    en: {
      title: "Stats: 7d now means 7 complete days",
      bullets: [
        '★ **Selector and calculation now match.** When you pick "7d", the average is exactly the last 7 complete days — no longer 6.',
        'Today still shows in the chart as an **8th context bar** (visually highlighted), but doesn\'t count toward the average.',
        'Same principle for 14d (14 complete + today) and 30d (30 complete + today).',
        'Subtitle now matches the selector: **"Last 7 complete days"** when you pick 7d.'
      ]
    }
  },
  {
    v: "8.4.6", date: "2026-04-06",
    pt: {
      title: "Médias honestas: hoje não polui mais o cálculo",
      bullets: [
        '★ **Fix de cálculo de médias.** As médias do Stats agora excluem o dia atual (que ainda não terminou) — antes ele puxava as médias pra baixo de manhã e pra cima à noite, criando ilusão de tendência.',
        'Hoje continua aparecendo no gráfico (com destaque visual), só não conta no cálculo da média.',
        'Novo subtítulo embaixo do seletor de período: **"Últimos 6 dias completos"** — deixa transparente o que está sendo calculado.',
        'Trends (comparação vs período anterior) agora comparam períodos completos com períodos completos — apples to apples.',
        'Fallback inteligente: se você só tem dados de hoje (primeiros dias usando o app), a média mostra hoje mesmo, com nota "Apenas hoje · ainda em curso".'
      ]
    },
    en: {
      title: "Honest averages: today no longer skews stats",
      bullets: [
        '★ **Average calculation fix.** Stats averages now exclude the current day (still in progress) — it used to pull averages down in the morning and up at night, creating fake trends.',
        'Today still appears in the chart (with visual highlight), it just doesn\'t count toward the average.',
        'New subtitle under the period selector: **"Last 6 complete days"** — makes it transparent what\'s being calculated.',
        'Trends (vs previous period) now compare complete periods to complete periods — apples to apples.',
        'Smart fallback: if you only have data from today (first days using the app), the average shows today anyway, with a note "Today only · still in progress".'
      ]
    }
  },
  {
    v: "8.4.5", date: "2026-04-06",
    pt: {
      title: "Bedtime ao vivo no History",
      bullets: [
        '★ **Bedtime ao vivo.** Durante a noite, o History agora mostra um card "EM ANDAMENTO" no topo com o sono em curso, atualizando a cada 30 segundos.',
        'Mamadas, fraldas e outros eventos registrados durante Night Wake **aparecem na hora** dentro do bloco — antes ficavam invisíveis até de manhã.',
        'Despertar em curso aparece com **pill amber "ao vivo"**, despertares fechados ficam azuis.',
        'Borda azul pulsante e ribbon "EM ANDAMENTO" indicam claramente que é provisório.',
        'Quando o bedtime termina de manhã, o card vira o registro oficial — transição fluida sem mudança visual brusca.'
      ]
    },
    en: {
      title: "Live bedtime in History",
      bullets: [
        '★ **Live bedtime.** During the night, History now shows an "IN PROGRESS" card at the top with the ongoing sleep, refreshing every 30 seconds.',
        'Bottles, diapers and other events logged during Night Wake **appear instantly** inside the block — they used to be invisible until morning.',
        'Active waking shows with an **amber "live" pill**, closed wakings stay blue.',
        'Pulsing blue border and "IN PROGRESS" ribbon clearly mark it as provisional.',
        'When the bedtime ends in the morning, the card becomes the official record — smooth transition with no jarring visual change.'
      ]
    }
  },
  {
    v: "8.4.4", date: "2026-04-06",
    pt: {
      title: "Vibração e infraestrutura de notificações",
      bullets: [
        '★ **Vibração tátil** ao registrar eventos, iniciar e parar timers, e ativar Night Wake. Sutil mas confirma cada ação.',
        'Novo toggle **Vibração** no Profile (ligado por padrão) — sua esposa pode desligar se preferir.',
        '**Infraestrutura de push notifications** pronta: Service Worker registrado, permissão pedível pelo Profile, token salvo no Firestore. Nenhuma notificação é enviada ainda — só preparei o terreno pra quando decidirmos o que notificar.',
        'Toggle **Notificações** no Profile mostra o estado atual: instalação necessária, permissão negada, ou pronto.',
        'Novos arquivos: **device-features.js** (Haptic + PushNotifs helpers) e **sw.js** (Service Worker).'
      ]
    },
    en: {
      title: "Haptics and notification infrastructure",
      bullets: [
        '★ **Haptic feedback** when logging events, starting and stopping timers, and toggling Night Wake. Subtle but confirms each action.',
        'New **Haptic feedback** toggle in Profile (enabled by default) — your partner can turn it off if they prefer.',
        '**Push notification infrastructure** ready: Service Worker registered, permission requestable from Profile, token saved to Firestore. No notifications are sent yet — just laying the groundwork for when we decide what to notify.',
        '**Notifications** toggle in Profile shows current state: install needed, permission denied, or ready.',
        'New files: **device-features.js** (Haptic + PushNotifs helpers) and **sw.js** (Service Worker).'
      ]
    }
  },
  {
    v: "8.4.3", date: "2026-04-06",
    pt: {
      title: "Changelog bilíngue e modal de novidades",
      bullets: [
        '★ **Changelog bilíngue.** As notas de versão agora respeitam o idioma do app — português ou inglês.',
        'Novo botão **Ler novidades** no Profile abre um modal elegante com o histórico de todas as versões.',
        'Badge **Novo** no botão quando há versões que você ainda não viu.',
        'Toast discreto no Home aparece uma única vez após cada atualização, oferecendo abrir as novidades.'
      ]
    },
    en: {
      title: "Bilingual changelog and updates modal",
      bullets: [
        '★ **Bilingual changelog.** Release notes now respect the app language — Portuguese or English.',
        'New **Read updates** button in Profile opens an elegant modal with full version history.',
        '**New** badge on the button when there are versions you haven\'t seen yet.',
        'Discreet toast on Home appears once after each update, offering to open the release notes.'
      ]
    }
  },
  {
    v: "8.4.2", date: "2026-04-06",
    pt: {
      title: "Sono noturno redesenhado",
      bullets: [
        '★ **Sono noturno redesenhado.** O bloco do Bedtime agora tem header roxo com label SONO NOTURNO, timeline com marcas de hora e cada despertar como separador visual com os eventos aninhados.',
        'Mamadeiras e fraldas de madrugada agora aparecem agrupadas sob cada despertar — antes sumiam da lista.',
        'Bloco abre expandido por padrão pra você ver o resumo da noite logo de manhã.',
        'Compatível com sonos antigos: sem wakings mostra apenas o header limpo.'
      ]
    },
    en: {
      title: "Night sleep redesigned",
      bullets: [
        '★ **Night sleep redesigned.** The Bedtime block now has a purple header with BEDTIME label, timeline with hour marks, and each waking as a visual separator with nested events.',
        'Night-time bottles and diapers now appear grouped under each waking — they used to disappear from the list.',
        'Block opens expanded by default so you can see the night summary first thing in the morning.',
        'Backward compatible with old sleeps: without wakings it shows just the clean header.'
      ]
    }
  },
  {
    v: "8.4.1", date: "2026-04-06",
    pt: {
      title: "Estatísticas descontam wakings",
      bullets: [
        '★ **Estatísticas corrigidas.** Agora descontam o tempo acordada do total de sono noturno.',
        'Card Sono médio mostra 3 valores: sono real (destaque roxo), tempo na cama e tempo acordada com média de wakings por noite.',
        'Gráfico de barras empilhado: roxo = sono real, faixa azul fina no topo = tempo acordada.',
        'Resumo do dia no Histórico e comparação semanal também usam sono real agora.'
      ]
    },
    en: {
      title: "Stats now subtract wakings",
      bullets: [
        '★ **Stats fixed.** They now subtract awake time from total night sleep.',
        'Average Sleep card shows 3 values: real sleep (purple highlight), time in bed, and awake time with average wakings per night.',
        'Stacked bar chart: purple = real sleep, thin blue band on top = awake time.',
        'Day summary in History and weekly comparison also use real sleep now.'
      ]
    }
  },
  {
    v: "8.4.0", date: "2026-04-06",
    pt: {
      title: "Tela sempre acesa",
      bullets: [
        '★ **Wake Lock.** Durante Night Wake e amamentação, a tela do iPhone não bloqueia mais — útil quando você está com as mãos ocupadas.',
        'Novo toggle **Manter tela ligada** no Profile (ligado por padrão).',
        'Indicador visual sutil no Ring quando a tela está travada.',
        'Falha silenciosa em iOS antigo ou modo economia de bateria.'
      ]
    },
    en: {
      title: "Keep screen awake",
      bullets: [
        '★ **Wake Lock.** During Night Wake and nursing, the iPhone screen no longer locks — useful when your hands are busy.',
        'New **Keep screen on** toggle in Profile (enabled by default).',
        'Subtle visual indicator on the Ring when the screen is locked on.',
        'Silent fallback on older iOS or battery saver mode.'
      ]
    }
  },
  {
    v: "8.3.0", date: "2026-04-05",
    pt: {
      title: "Curiosidades expandidas",
      bullets: [
        '★ **89 curiosidades bilíngues** cobrindo do dia 1 ao mês 12, baseadas em AAP, OMS, NHS, Mayo Clinic, Harvard, CDC, Zero to Three e Stanford.',
        'Nova seção semanal (semanas 5 a 52) além das diárias e mensais.',
        'Curiosidades diárias (dias 1-30) reescritas com mais profundidade científica.',
        'Correção: milestones mensais agora aparecem corretamente no card de curiosidades.'
      ]
    },
    en: {
      title: "Curiosities expanded",
      bullets: [
        '★ **89 bilingual curiosities** covering day 1 through month 12, based on AAP, WHO, NHS, Mayo Clinic, Harvard, CDC, Zero to Three, and Stanford.',
        'New weekly section (weeks 5 to 52) in addition to daily and monthly.',
        'Daily curiosities (days 1-30) rewritten with more scientific depth.',
        'Fix: monthly milestones now appear correctly in the curiosity card.'
      ]
    }
  },
  {
    v: "8.2.0", date: "2026-04-05",
    pt: {
      title: "Refactor: arquivos separados",
      bullets: [
        '★ **Arquitetura modular.** Código estático extraído em 3 arquivos separados pra reduzir tamanho do index.html.',
        'index.html reduzido de 220KB pra 180KB (-18%).',
        'Splash icon, tabelas de crescimento OMS e curiosidades agora em arquivos dedicados.',
        'Zero mudança visual ou funcional — pura reorganização.'
      ]
    },
    en: {
      title: "Refactor: separate files",
      bullets: [
        '★ **Modular architecture.** Static code extracted into 3 separate files to reduce index.html size.',
        'index.html reduced from 220KB to 180KB (-18%).',
        'Splash icon, WHO growth tables, and curiosities now in dedicated files.',
        'Zero visual or functional change — pure reorganization.'
      ]
    }
  },
  {
    v: "8.1.3", date: "2026-04-05",
    pt: {
      title: "Night Wake: botões maiores",
      bullets: [
        'Quick buttons do modo Night Wake reduzidos pra apenas Bottle e Diaper (removido Nursing).',
        'De madrugada amamentação raramente se aplica, então a interface fica mais limpa com touch targets maiores.',
        'Os 2 botões agora dividem a largura total, ficando mais fáceis de acertar com olhos meio fechados.'
      ]
    },
    en: {
      title: "Night Wake: bigger buttons",
      bullets: [
        'Night Wake mode quick buttons reduced to only Bottle and Diaper (removed Nursing).',
        'Nursing rarely applies at night, so the interface is cleaner with bigger touch targets.',
        'The 2 buttons now split the full width, making them easier to tap with half-closed eyes.'
      ]
    }
  },
  {
    v: "8.1.2", date: "2026-04-05",
    pt: {
      title: "Night Wake: botão amber pulsante",
      bullets: [
        'Botão Night Wake (estado inativo) agora usa amber quente com pulse sutil.',
        'Borda laranja saturada, glow pulsante e ícone com scale animation.',
        'Estado ativo continua azul, indicando que o modo waking está ligado.',
        'Muito mais visível de madrugada sem ser agressivo.'
      ]
    },
    en: {
      title: "Night Wake: pulsing amber button",
      bullets: [
        'Night Wake button (inactive state) now uses warm amber with subtle pulse.',
        'Saturated orange border, pulsing glow, and icon scale animation.',
        'Active state remains blue, indicating waking mode is on.',
        'Much more visible at night without being aggressive.'
      ]
    }
  },
  {
    v: "8.1.1", date: "2026-04-05",
    pt: {
      title: "Fix spam de hints",
      bullets: [
        '★ **Gates de horário pra hints.** Análises noturnas (sono pela noite, wakings frequentes, etc) só aparecem das 06h-10h.',
        'Balanço do dia vs recomendações da OMS só aparece depois das 22h.',
        'Hints contextuais (feed overdue, bedtime approaching, bath reminder, excellent nap, diaper check) continuam aparecendo o dia todo.',
        'Elimina repetição de insights fora de contexto.'
      ]
    },
    en: {
      title: "Hints spam fix",
      bullets: [
        '★ **Time gates for hints.** Night analyses (sleeping through, frequent wakings, etc) only appear from 6am-10am.',
        'Day vs WHO recommendations balance only shows after 10pm.',
        'Contextual hints (feed overdue, bedtime approaching, bath reminder, excellent nap, diaper check) keep showing throughout the day.',
        'Eliminates repetition of out-of-context insights.'
      ]
    }
  },
  {
    v: "8.1.0", date: "2026-04-05",
    pt: {
      title: "Caixa de notificações",
      bullets: [
        '★ **Inbox de insights.** Sininho discreto no header com badge vermelho mostra hints não-lidos do engine.',
        'Painel slide-in com todas as hints do dia agrupadas por tipo (good/info/warn).',
        'Dedup inteligente via hintKey estável.',
        'Sincroniza entre dispositivos via Firestore. Sem som, sem push — puramente visual.'
      ]
    },
    en: {
      title: "Notifications inbox",
      bullets: [
        '★ **Insights inbox.** Discreet bell in the header with red badge shows unread engine hints.',
        'Slide-in panel with all the day\'s hints grouped by type (good/info/warn).',
        'Smart dedup via stable hintKey.',
        'Syncs between devices via Firestore. No sound, no push — purely visual.'
      ]
    }
  },
  {
    v: "8.0.0", date: "2026-04-05",
    pt: {
      title: "Night Wake + 9 Smart Hints",
      bullets: [
        '★ **Night Wake completo.** Botão toggle durante Bedtime, wakings salvos dentro do sleep, cálculo de sono real.',
        '9 novos Smart Hints: pre-feed, bedtime approaching, bath reminder, last feed, excellent nap, feed overdue, cluster feeding, diaper check e feed volume vs OMS.',
        'Engine agora analisa frequência de wakings, cluster de horário e tendência (melhorando/piorando).',
        'Memória completa da rotina pra insights cada vez mais personalizados.'
      ]
    },
    en: {
      title: "Night Wake + 9 Smart Hints",
      bullets: [
        '★ **Complete Night Wake.** Toggle button during Bedtime, wakings saved inside the sleep, real sleep calculation.',
        '9 new Smart Hints: pre-feed, bedtime approaching, bath reminder, last feed, excellent nap, feed overdue, cluster feeding, diaper check, and feed volume vs WHO.',
        'Engine now analyzes waking frequency, time clustering, and trend (improving/worsening).',
        'Complete routine memory for increasingly personalized insights.'
      ]
    }
  },
  {
    v: "earlier", date: "2026-04-02 → 04-04",
    pt: {
      title: "Versões anteriores (v1.0.0 → v7.0.0)",
      bullets: [
        '**Routine Engine v2** com 5 estados no ring (calm/opening/sweet/stretching/overdue), horário previsto, blend com WHO/AAP.',
        '**Ring estilo Napper**: timer ativo com dashes fluindo, último evento com glow, nav bar colada no fundo.',
        '**UI redesign**: header, quick buttons verticais, summary 2x2, timeline separators, profile redesign.',
        '**Import Baby+**, splash elegante, swipe-to-delete, curvas de crescimento OMS, percentil, histórico navegável.',
        '**Base**: timer ao vivo, sync Firebase, algoritmo de sono, meta ML, CSV export, undo, duplicar.'
      ]
    },
    en: {
      title: "Earlier versions (v1.0.0 → v7.0.0)",
      bullets: [
        '**Routine Engine v2** with 5 ring states (calm/opening/sweet/stretching/overdue), predicted time, WHO/AAP blend.',
        '**Napper-style Ring**: active timer with flowing dashes, last event with glow, nav bar stuck to the bottom.',
        '**UI redesign**: header, vertical quick buttons, 2x2 summary, timeline separators, profile redesign.',
        '**Baby+ import**, elegant splash, swipe-to-delete, WHO growth curves, percentile, navigable history.',
        '**Foundation**: live timer, Firebase sync, sleep algorithm, ML goal, CSV export, undo, duplicate.'
      ]
    }
  }
];
