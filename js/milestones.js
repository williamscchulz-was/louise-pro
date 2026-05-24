// ╔══════════════════════════════════════════════════════╗
// ║  LOUISE PRO · DEVELOPMENTAL MILESTONES               ║
// ║  ~41 milestones bilingual PT/EN covering 0-24 months ║
// ║                                                      ║
// ║  Primary source:                                     ║
// ║    CDC "Learn the Signs. Act Early." (Feb 2022)      ║
// ║    https://www.cdc.gov/act-early/milestones/         ║
// ║                                                      ║
// ║  Cross-references:                                   ║
// ║    WHO MGRS (motor grosso, windows of achievement)   ║
// ║    SBP Cartilha 2-meses-a-5-anos (PT-BR terms)       ║
// ║                                                      ║
// ║  Methodology note:                                   ║
// ║    CDC 2022 atribui marcos ao 75th percentile        ║
// ║    (i.e. ~75% das criancas atingem ate aquela idade).║
// ║    Se nao atingiu = sinal pra conversar com pediatra.║
// ║                                                      ║
// ║  Exposes:                                            ║
// ║    window.DEV_MILESTONES (41 items, by checkupAge)       ║
// ║    window.CONCERNING_SIGNS (15 items)                ║
// ║                                                      ║
// ║  Ultima verificacao: 2026-05-24                      ║
// ╚══════════════════════════════════════════════════════╝

// ──────────────────────────────────────────────────────
//   MILESTONES (CDC 2022 + WHO MGRS + SBP terminology)
//   Categories:
//     motor_gross | motor_fine | language
//     social_emotional | cognitive
// ──────────────────────────────────────────────────────

window.DEV_MILESTONES = [

  // ════════════════════════════════════════════════════
  //   0 MONTHS — Newborn (10 marcos emocionais)
  //   Não-CDC, "Louise Pro Newborn Pack" — primeiros
  //   momentos / experiências que pais querem celebrar.
  // ════════════════════════════════════════════════════

  {
    key: "born",
    category: "social_emotional",
    checkupAge: 0,
    ageRange: { minWeeks: 0, maxWeeks: 1, typicalWeeks: 0 },
    label: {
      pt: "Nasceu!",
      en: "Born!"
    },
    description: {
      pt: "O dia em que tudo começou.",
      en: "The day it all began."
    },
    source: "Louise Pro Newborn"
  },
  {
    key: "first_feed",
    category: "social_emotional",
    checkupAge: 0,
    ageRange: { minWeeks: 0, maxWeeks: 1, typicalWeeks: 0 },
    label: {
      pt: "Primeira mamada",
      en: "First feed"
    },
    description: {
      pt: "A primeira vez que mamou.",
      en: "The first time she fed."
    },
    source: "Louise Pro Newborn"
  },
  {
    key: "first_diaper",
    category: "social_emotional",
    checkupAge: 0,
    ageRange: { minWeeks: 0, maxWeeks: 1, typicalWeeks: 0 },
    label: {
      pt: "Primeira fralda",
      en: "First diaper"
    },
    description: {
      pt: "A primeira fralda — geralmente mecônio nas primeiras 24h.",
      en: "First diaper — usually meconium in the first 24h."
    },
    source: "Louise Pro Newborn"
  },
  {
    key: "first_bath",
    category: "social_emotional",
    checkupAge: 0,
    ageRange: { minWeeks: 0, maxWeeks: 4, typicalWeeks: 1 },
    label: {
      pt: "Primeiro banho",
      en: "First bath"
    },
    description: {
      pt: "O primeiro banho — geralmente depois do coto cair.",
      en: "First bath — usually after the umbilical stump falls off."
    },
    source: "Louise Pro Newborn"
  },
  {
    key: "discharge",
    category: "social_emotional",
    checkupAge: 0,
    ageRange: { minWeeks: 0, maxWeeks: 2, typicalWeeks: 0 },
    label: {
      pt: "Alta hospitalar",
      en: "Hospital discharge"
    },
    description: {
      pt: "Saída do hospital — primeira viagem pra casa.",
      en: "Leaving the hospital — first trip home."
    },
    source: "Louise Pro Newborn"
  },
  {
    key: "first_night_home",
    category: "social_emotional",
    checkupAge: 0,
    ageRange: { minWeeks: 0, maxWeeks: 2, typicalWeeks: 0 },
    label: {
      pt: "Primeira noite em casa",
      en: "First night at home"
    },
    description: {
      pt: "A primeira noite fora do hospital.",
      en: "First night outside the hospital."
    },
    source: "Louise Pro Newborn"
  },
  {
    key: "umbilical_cord_fell",
    category: "social_emotional",
    checkupAge: 0,
    ageRange: { minWeeks: 1, maxWeeks: 3, typicalWeeks: 2 },
    label: {
      pt: "Coto umbilical caiu",
      en: "Umbilical cord fell off"
    },
    description: {
      pt: "Geralmente entre 1 e 3 semanas após o nascimento.",
      en: "Usually between 1 and 3 weeks after birth."
    },
    source: "Louise Pro Newborn"
  },
  {
    key: "regained_birth_weight",
    category: "social_emotional",
    checkupAge: 0,
    ageRange: { minWeeks: 1, maxWeeks: 3, typicalWeeks: 2 },
    label: {
      pt: "Voltou ao peso de nascimento",
      en: "Regained birth weight"
    },
    description: {
      pt: "Após perder 5-10% inicial, retoma o peso de quando nasceu.",
      en: "After losing the initial 5-10%, regains birth weight."
    },
    source: "Louise Pro Newborn"
  },
  {
    key: "first_pediatrician_visit",
    category: "social_emotional",
    checkupAge: 0,
    ageRange: { minWeeks: 0, maxWeeks: 4, typicalWeeks: 1 },
    label: {
      pt: "Primeira consulta com pediatra",
      en: "First pediatrician visit"
    },
    description: {
      pt: "Primeira ida ao consultório do pediatra (não o do hospital).",
      en: "First visit to the pediatrician's office (not at the hospital)."
    },
    source: "Louise Pro Newborn"
  },
  {
    key: "looks_at_faces_early",
    category: "social_emotional",
    checkupAge: 0,
    ageRange: { minWeeks: 0, maxWeeks: 6, typicalWeeks: 3 },
    label: {
      pt: "Olha para rostos",
      en: "Looks at faces"
    },
    description: {
      pt: "Foca no seu rosto especialmente — preferência por padrões humanos.",
      en: "Focuses on your face — preference for human patterns."
    },
    tip: {
      pt: "Foque a 20-30cm dela. Olha contato direto. Ela vai responder.",
      en: "Stay 20-30cm from her face. Make direct eye contact. She'll respond."
    },
    source: "Louise Pro Newborn"
  },

  // ════════════════════════════════════════════════════
  //   2 MONTHS (5 marcos)
  // ════════════════════════════════════════════════════

  {
    key: "social_smile",
    category: "social_emotional",
    checkupAge: 2,
    ageRange: { minWeeks: 6, maxWeeks: 12, typicalWeeks: 8 },
    label: {
      pt: "Sorriso social",
      en: "Social smile"
    },
    description: {
      pt: "Sorri quando voce sorri ou fala com ela.",
      en: "Smiles when you talk to or smile at her."
    },
    tip: {
      pt: "Fique cara-a-cara a uns 30cm, faca contato visual e sorria primeiro — ela responde.",
      en: "Get face-to-face about 30cm away, make eye contact and smile first — she'll respond."
    },
    source: "CDC 2022"
  },
  {
    key: "calms_when_held",
    category: "social_emotional",
    checkupAge: 2,
    ageRange: { minWeeks: 4, maxWeeks: 12, typicalWeeks: 8 },
    label: {
      pt: "Se acalma no colo",
      en: "Calms when held"
    },
    description: {
      pt: "Se acalma quando voce fala com ela ou pega no colo.",
      en: "Calms down when spoken to or picked up."
    },
    source: "CDC 2022"
  },
  {
    key: "sounds_other_than_crying",
    category: "language",
    checkupAge: 2,
    ageRange: { minWeeks: 4, maxWeeks: 12, typicalWeeks: 8 },
    label: {
      pt: "Faz sons alem do choro",
      en: "Makes sounds other than crying"
    },
    description: {
      pt: "Emite pequenos sons (arrulhos, gemidos) que nao sao choro.",
      en: "Makes small cooing sounds that are not crying."
    },
    tip: {
      pt: "Imite os sons dela de volta — comeca aqui a conversa de turnos.",
      en: "Mirror her sounds back — this is where turn-taking begins."
    },
    source: "CDC 2022"
  },
  {
    key: "watches_you_move",
    category: "cognitive",
    checkupAge: 2,
    ageRange: { minWeeks: 6, maxWeeks: 12, typicalWeeks: 8 },
    label: {
      pt: "Acompanha voce com o olhar",
      en: "Watches you as you move"
    },
    description: {
      pt: "Segue voce com os olhos enquanto voce anda pelo quarto.",
      en: "Follows you with her eyes as you move."
    },
    source: "CDC 2022"
  },
  {
    key: "holds_head_tummy",
    category: "motor_gross",
    checkupAge: 2,
    ageRange: { minWeeks: 4, maxWeeks: 12, typicalWeeks: 8 },
    label: {
      pt: "Levanta a cabeca de bruco",
      en: "Holds head up on tummy"
    },
    description: {
      pt: "Em tummy time, levanta a cabeca por alguns segundos.",
      en: "Holds head up briefly during tummy time."
    },
    tip: {
      pt: "Tummy time supervisionado, varias vezes ao dia em sessoes curtas (alguns minutos).",
      en: "Short, supervised tummy time sessions several times a day."
    },
    source: "CDC 2022"
  },

  // ════════════════════════════════════════════════════
  //   4 MONTHS (5 marcos)
  // ════════════════════════════════════════════════════

  {
    key: "laughs",
    category: "social_emotional",
    checkupAge: 4,
    ageRange: { minWeeks: 12, maxWeeks: 20, typicalWeeks: 16 },
    label: {
      pt: "Gargalha",
      en: "Chuckles / laughs"
    },
    description: {
      pt: "Da risadinhas (ainda nao gargalha alto) quando voce brinca com ela.",
      en: "Chuckles (not yet a full laugh) when you play with her."
    },
    source: "CDC 2022"
  },
  {
    key: "coos_aah_ooh",
    category: "language",
    checkupAge: 4,
    ageRange: { minWeeks: 12, maxWeeks: 20, typicalWeeks: 16 },
    label: {
      pt: "Faz 'aah' e 'ooo'",
      en: "Coos with 'aah' and 'ooo'"
    },
    description: {
      pt: "Emite sons como 'aah' e 'ooo' (arrulhos).",
      en: "Makes cooing sounds like 'aah' and 'ooo'."
    },
    tip: {
      pt: "Responda os arrulhos como se fosse conversa — pausa, fala, pausa.",
      en: "Coo back as if having a conversation — pause, talk, pause."
    },
    source: "CDC 2022"
  },
  {
    key: "turns_to_voice",
    category: "language",
    checkupAge: 4,
    ageRange: { minWeeks: 12, maxWeeks: 20, typicalWeeks: 16 },
    label: {
      pt: "Vira pro som da voz",
      en: "Turns head toward voice"
    },
    description: {
      pt: "Vira a cabeca em direcao a voz de alguem falando.",
      en: "Turns head toward the sound of your voice."
    },
    source: "CDC 2022"
  },
  {
    key: "holds_head_steady",
    category: "motor_gross",
    checkupAge: 4,
    ageRange: { minWeeks: 12, maxWeeks: 20, typicalWeeks: 16 },
    label: {
      pt: "Sustenta a cabeca firme",
      en: "Holds head steady"
    },
    description: {
      pt: "Mantem a cabeca firme sem precisar de apoio quando esta no colo.",
      en: "Holds head steady without support when held."
    },
    source: "CDC 2022"
  },
  {
    key: "brings_hands_to_mouth",
    category: "motor_fine",
    checkupAge: 4,
    ageRange: { minWeeks: 10, maxWeeks: 20, typicalWeeks: 16 },
    label: {
      pt: "Leva as maos a boca",
      en: "Brings hands to mouth"
    },
    description: {
      pt: "Junta as maos no meio do corpo e leva a boca.",
      en: "Brings hands to mouth at midline."
    },
    source: "CDC 2022"
  },

  // ════════════════════════════════════════════════════
  //   6 MONTHS (5 marcos)
  // ════════════════════════════════════════════════════

  {
    key: "knows_familiar_people",
    category: "social_emotional",
    checkupAge: 6,
    ageRange: { minWeeks: 20, maxWeeks: 30, typicalWeeks: 26 },
    label: {
      pt: "Reconhece pessoas conhecidas",
      en: "Knows familiar people"
    },
    description: {
      pt: "Mostra que reconhece pais, irmaos e cuidadores proximos.",
      en: "Recognizes parents, siblings, and familiar caregivers."
    },
    source: "CDC 2022"
  },
  {
    key: "takes_turns_sounds",
    category: "language",
    checkupAge: 6,
    ageRange: { minWeeks: 20, maxWeeks: 30, typicalWeeks: 26 },
    label: {
      pt: "Faz sons em revezamento",
      en: "Takes turns making sounds"
    },
    description: {
      pt: "Faz sons de volta quando voce faz som pra ela (revezamento).",
      en: "Makes sounds back when you make sounds (back-and-forth)."
    },
    tip: {
      pt: "Quando ela balbuciar, espere, responda imitando, e espere de novo.",
      en: "When she babbles, wait, copy back, then wait again."
    },
    source: "CDC 2022"
  },
  {
    key: "puts_things_in_mouth",
    category: "cognitive",
    checkupAge: 6,
    ageRange: { minWeeks: 18, maxWeeks: 30, typicalWeeks: 26 },
    label: {
      pt: "Leva coisas a boca pra explorar",
      en: "Puts things in mouth to explore"
    },
    description: {
      pt: "Leva objetos a boca pra explorar texturas e formas.",
      en: "Puts objects in mouth to explore texture and shape."
    },
    source: "CDC 2022"
  },
  {
    key: "rolls_tummy_to_back",
    category: "motor_gross",
    checkupAge: 6,
    ageRange: { minWeeks: 16, maxWeeks: 30, typicalWeeks: 24 },
    label: {
      pt: "Rola de bruco pras costas",
      en: "Rolls from tummy to back"
    },
    description: {
      pt: "Consegue rolar de barriga pra baixo pra barriga pra cima.",
      en: "Rolls from tummy onto back."
    },
    source: "CDC 2022"
  },
  {
    key: "reaches_for_toy",
    category: "motor_fine",
    checkupAge: 6,
    ageRange: { minWeeks: 18, maxWeeks: 30, typicalWeeks: 26 },
    label: {
      pt: "Pega o brinquedo que quer",
      en: "Reaches to grab a toy"
    },
    description: {
      pt: "Estica o braco e pega um brinquedo que quer.",
      en: "Reaches out and grabs a toy she wants."
    },
    source: "CDC 2022"
  },

  // ════════════════════════════════════════════════════
  //   9 MONTHS (5 marcos)
  // ════════════════════════════════════════════════════

  {
    key: "stranger_anxiety",
    category: "social_emotional",
    checkupAge: 9,
    ageRange: { minWeeks: 30, maxWeeks: 45, typicalWeeks: 39 },
    label: {
      pt: "Estranha pessoas novas",
      en: "Shy with strangers"
    },
    description: {
      pt: "Fica timida ou chorosa com pessoas desconhecidas.",
      en: "Acts shy, clingy, or fearful around strangers."
    },
    source: "CDC 2022"
  },
  {
    key: "responds_to_name",
    category: "social_emotional",
    checkupAge: 9,
    ageRange: { minWeeks: 26, maxWeeks: 45, typicalWeeks: 36 },
    label: {
      pt: "Olha quando voce chama",
      en: "Looks when you call her name"
    },
    description: {
      pt: "Olha pra voce quando voce chama o nome dela.",
      en: "Looks at you when you call her name."
    },
    source: "CDC 2022"
  },
  {
    key: "babbles_consonants",
    category: "language",
    checkupAge: 9,
    ageRange: { minWeeks: 28, maxWeeks: 45, typicalWeeks: 39 },
    label: {
      pt: "Balbucia 'mamama', 'bababa'",
      en: "Babbles 'mamama', 'bababa'"
    },
    description: {
      pt: "Junta varias silabas repetidas como 'mamama' ou 'bababa'.",
      en: "Strings syllables like 'mamama' or 'bababa'."
    },
    tip: {
      pt: "Repita os balbucios dela e adicione palavras reais ao redor.",
      en: "Echo her babbles back and add real words around them."
    },
    source: "CDC 2022"
  },
  {
    key: "sits_without_support",
    category: "motor_gross",
    checkupAge: 9,
    ageRange: { minWeeks: 16, maxWeeks: 40, typicalWeeks: 26 },
    label: {
      pt: "Senta sem apoio",
      en: "Sits without support"
    },
    description: {
      pt: "Senta sozinha sem precisar das maos pra apoiar.",
      en: "Sits on her own without using hands for support."
    },
    source: "CDC+WHO"
  },
  {
    key: "transfers_objects",
    category: "motor_fine",
    checkupAge: 9,
    ageRange: { minWeeks: 24, maxWeeks: 40, typicalWeeks: 32 },
    label: {
      pt: "Passa objeto de uma mao a outra",
      en: "Transfers object hand to hand"
    },
    description: {
      pt: "Passa um brinquedo de uma mao pra outra.",
      en: "Moves things from one hand to the other."
    },
    source: "CDC 2022"
  },
  {
    key: "looks_for_dropped_object",
    category: "cognitive",
    checkupAge: 9,
    ageRange: { minWeeks: 28, maxWeeks: 45, typicalWeeks: 39 },
    label: {
      pt: "Procura objeto que caiu",
      en: "Looks for dropped objects"
    },
    description: {
      pt: "Procura com o olhar quando um objeto sai da vista (ex: a chupeta caiu).",
      en: "Looks for objects when dropped out of sight."
    },
    source: "CDC 2022"
  },

  // ════════════════════════════════════════════════════
  //   12 MONTHS (6 marcos)
  // ════════════════════════════════════════════════════

  {
    key: "plays_pat_a_cake",
    category: "social_emotional",
    checkupAge: 12,
    ageRange: { minWeeks: 40, maxWeeks: 56, typicalWeeks: 52 },
    label: {
      pt: "Brinca de bate-bate-palminhas",
      en: "Plays pat-a-cake"
    },
    description: {
      pt: "Brinca de jogos com voce como bate-palmas ou cade-achou.",
      en: "Plays games with you like pat-a-cake or peek-a-boo."
    },
    source: "CDC 2022"
  },
  {
    key: "waves_bye_bye",
    category: "language",
    checkupAge: 12,
    ageRange: { minWeeks: 36, maxWeeks: 56, typicalWeeks: 48 },
    label: {
      pt: "Da tchau",
      en: "Waves bye-bye"
    },
    description: {
      pt: "Acena com a mao pra dar tchau.",
      en: "Waves bye-bye."
    },
    source: "CDC 2022"
  },
  {
    key: "calls_mama_dada",
    category: "language",
    checkupAge: 12,
    ageRange: { minWeeks: 36, maxWeeks: 56, typicalWeeks: 52 },
    label: {
      pt: "Chama 'mama' ou 'papa'",
      en: "Calls 'mama' or 'dada'"
    },
    description: {
      pt: "Usa 'mama', 'papa' ou outro nome especifico pra chamar voce.",
      en: "Calls a parent 'mama', 'dada', or another special name."
    },
    source: "CDC 2022"
  },
  {
    key: "understands_no",
    category: "language",
    checkupAge: 12,
    ageRange: { minWeeks: 40, maxWeeks: 56, typicalWeeks: 52 },
    label: {
      pt: "Entende 'nao'",
      en: "Understands 'no'"
    },
    description: {
      pt: "Para ou hesita quando voce diz 'nao'.",
      en: "Pauses briefly or stops when you say 'no'."
    },
    source: "CDC 2022"
  },
  {
    key: "pulls_to_stand",
    category: "motor_gross",
    checkupAge: 12,
    ageRange: { minWeeks: 28, maxWeeks: 56, typicalWeeks: 40 },
    label: {
      pt: "Fica em pe com apoio",
      en: "Pulls to stand"
    },
    description: {
      pt: "Se puxa em moveis pra ficar em pe.",
      en: "Pulls up on furniture to stand."
    },
    source: "CDC+WHO"
  },
  {
    key: "pincer_grasp",
    category: "motor_fine",
    checkupAge: 12,
    ageRange: { minWeeks: 36, maxWeeks: 56, typicalWeeks: 48 },
    label: {
      pt: "Pega em pinca",
      en: "Pincer grasp"
    },
    description: {
      pt: "Pega objetos pequenos entre o polegar e o indicador.",
      en: "Picks up small things between thumb and pointer finger."
    },
    tip: {
      pt: "Ofereca pedacinhos pequenos e seguros (banana amassada, biscoito) pra ela treinar.",
      en: "Offer small safe pieces (mashed banana, soft cracker) for practice."
    },
    source: "CDC 2022"
  },
  {
    key: "puts_things_in_container",
    category: "cognitive",
    checkupAge: 12,
    ageRange: { minWeeks: 40, maxWeeks: 56, typicalWeeks: 52 },
    label: {
      pt: "Coloca objetos em recipiente",
      en: "Puts things in a container"
    },
    description: {
      pt: "Coloca coisas dentro de um pote ou caixa (ex: bloco no copo).",
      en: "Puts something in a container, like a block in a cup."
    },
    source: "CDC 2022"
  },

  // ════════════════════════════════════════════════════
  //   15 MONTHS (5 marcos)
  // ════════════════════════════════════════════════════

  {
    key: "copies_other_children",
    category: "social_emotional",
    checkupAge: 15,
    ageRange: { minWeeks: 52, maxWeeks: 72, typicalWeeks: 65 },
    label: {
      pt: "Imita outras criancas",
      en: "Copies other children"
    },
    description: {
      pt: "Imita o que outras criancas fazem (tirar brinquedos da caixa, etc).",
      en: "Copies what other children do while playing."
    },
    source: "CDC 2022"
  },
  {
    key: "claps_when_excited",
    category: "social_emotional",
    checkupAge: 15,
    ageRange: { minWeeks: 52, maxWeeks: 72, typicalWeeks: 60 },
    label: {
      pt: "Bate palmas quando esta animada",
      en: "Claps when excited"
    },
    description: {
      pt: "Bate palmas espontaneamente pra mostrar empolgacao.",
      en: "Claps hands when excited."
    },
    source: "CDC 2022"
  },
  {
    key: "first_words",
    category: "language",
    checkupAge: 15,
    ageRange: { minWeeks: 48, maxWeeks: 72, typicalWeeks: 60 },
    label: {
      pt: "Tenta dizer 1 ou 2 palavras",
      en: "Tries to say 1 or 2 words"
    },
    description: {
      pt: "Diz 1 ou 2 palavras alem de 'mama' e 'papa' (ex: 'a' pra agua, 'bo' pra bola).",
      en: "Says 1 or 2 words besides 'mama' and 'dada' (e.g., 'ba' for ball)."
    },
    source: "CDC 2022"
  },
  {
    key: "walks_alone",
    category: "motor_gross",
    checkupAge: 15,
    ageRange: { minWeeks: 32, maxWeeks: 72, typicalWeeks: 56 },
    label: {
      pt: "Da alguns passos sozinha",
      en: "Takes a few steps alone"
    },
    description: {
      pt: "Anda alguns passos sem se segurar em nada.",
      en: "Takes a few steps on her own."
    },
    source: "CDC+WHO"
  },
  {
    key: "stacks_objects",
    category: "cognitive",
    checkupAge: 15,
    ageRange: { minWeeks: 52, maxWeeks: 72, typicalWeeks: 65 },
    label: {
      pt: "Empilha 2 objetos",
      en: "Stacks 2 small objects"
    },
    description: {
      pt: "Coloca pelo menos 2 blocos ou objetos pequenos em pe, um sobre o outro.",
      en: "Stacks at least two small objects."
    },
    source: "CDC 2022"
  },

  // ════════════════════════════════════════════════════
  //   18 MONTHS (5 marcos)
  // ════════════════════════════════════════════════════

  {
    key: "points_to_show_interest",
    category: "social_emotional",
    checkupAge: 18,
    ageRange: { minWeeks: 60, maxWeeks: 85, typicalWeeks: 78 },
    label: {
      pt: "Aponta pra mostrar interesse",
      en: "Points to show interest"
    },
    description: {
      pt: "Aponta com o dedo pra mostrar algo que achou interessante.",
      en: "Points to show you something interesting."
    },
    source: "CDC 2022"
  },
  {
    key: "moves_away_checks_back",
    category: "social_emotional",
    checkupAge: 18,
    ageRange: { minWeeks: 60, maxWeeks: 85, typicalWeeks: 78 },
    label: {
      pt: "Se afasta mas confere se voce esta perto",
      en: "Moves away but checks back"
    },
    description: {
      pt: "Se afasta de voce, mas olha pra tras pra ter certeza que voce esta por perto.",
      en: "Moves away from you, but looks to make sure you're close."
    },
    source: "CDC 2022"
  },
  {
    key: "three_words_beyond",
    category: "language",
    checkupAge: 18,
    ageRange: { minWeeks: 60, maxWeeks: 85, typicalWeeks: 78 },
    label: {
      pt: "Diz 3 ou mais palavras",
      en: "Says 3 or more words"
    },
    description: {
      pt: "Tenta dizer 3 ou mais palavras alem de 'mama' e 'papa'.",
      en: "Tries to say 3 or more words besides 'mama' and 'dada'."
    },
    source: "CDC 2022"
  },
  {
    key: "follows_one_step",
    category: "language",
    checkupAge: 18,
    ageRange: { minWeeks: 60, maxWeeks: 85, typicalWeeks: 78 },
    label: {
      pt: "Segue comando simples",
      en: "Follows 1-step direction"
    },
    description: {
      pt: "Obedece comandos simples sem precisar de gestos (ex: 'me da').",
      en: "Follows 1-step directions without gestures, like 'give it to me'."
    },
    source: "CDC 2022"
  },
  {
    key: "walks_independently",
    category: "motor_gross",
    checkupAge: 18,
    ageRange: { minWeeks: 48, maxWeeks: 85, typicalWeeks: 65 },
    label: {
      pt: "Anda sem se apoiar",
      en: "Walks without holding on"
    },
    description: {
      pt: "Anda sozinha sem se segurar em ninguem ou nada.",
      en: "Walks without holding on to anyone or anything."
    },
    source: "CDC+WHO"
  },
  {
    key: "pretends_doing_chores",
    category: "cognitive",
    checkupAge: 18,
    ageRange: { minWeeks: 60, maxWeeks: 85, typicalWeeks: 78 },
    label: {
      pt: "Imita voce fazendo tarefas",
      en: "Copies you doing chores"
    },
    description: {
      pt: "Imita o que voce faz em casa (varrer com a vassoura, falar no telefone).",
      en: "Copies you doing chores, like sweeping with a broom."
    },
    source: "CDC 2022"
  },

  // ════════════════════════════════════════════════════
  //   24 MONTHS / 2 YEARS (5 marcos)
  // ════════════════════════════════════════════════════

  {
    key: "notices_others_feelings",
    category: "social_emotional",
    checkupAge: 24,
    ageRange: { minWeeks: 85, maxWeeks: 110, typicalWeeks: 104 },
    label: {
      pt: "Percebe sentimentos dos outros",
      en: "Notices others' feelings"
    },
    description: {
      pt: "Para ou fica triste quando ve alguem chorando ou machucado.",
      en: "Pauses or looks sad when someone is crying or hurt."
    },
    source: "CDC 2022"
  },
  {
    key: "two_word_phrases",
    category: "language",
    checkupAge: 24,
    ageRange: { minWeeks: 78, maxWeeks: 110, typicalWeeks: 104 },
    label: {
      pt: "Junta 2 palavras",
      en: "Says 2 words together"
    },
    description: {
      pt: "Forma frases curtas de 2 palavras (ex: 'mais leite', 'quer agua').",
      en: "Puts 2 words together, like 'more milk' or 'want water'."
    },
    tip: {
      pt: "Quando ela disser uma palavra, repita expandindo: 'Leite. Quer mais leite?'",
      en: "When she says one word, echo and expand: 'Milk. Want more milk?'"
    },
    source: "CDC 2022"
  },
  {
    key: "points_body_parts",
    category: "language",
    checkupAge: 24,
    ageRange: { minWeeks: 85, maxWeeks: 110, typicalWeeks: 104 },
    label: {
      pt: "Aponta 2 partes do corpo",
      en: "Points to 2 body parts"
    },
    description: {
      pt: "Aponta pelo menos 2 partes do corpo quando voce pergunta (ex: cade o nariz?).",
      en: "Points to at least 2 body parts when asked (e.g., 'where's your nose?')."
    },
    source: "CDC 2022"
  },
  {
    key: "kicks_ball",
    category: "motor_gross",
    checkupAge: 24,
    ageRange: { minWeeks: 78, maxWeeks: 110, typicalWeeks: 96 },
    label: {
      pt: "Chuta uma bola",
      en: "Kicks a ball"
    },
    description: {
      pt: "Chuta uma bola sem desequilibrar.",
      en: "Kicks a ball without losing balance."
    },
    source: "CDC 2022"
  },
  {
    key: "eats_with_spoon",
    category: "motor_fine",
    checkupAge: 24,
    ageRange: { minWeeks: 78, maxWeeks: 110, typicalWeeks: 96 },
    label: {
      pt: "Come com colher",
      en: "Eats with a spoon"
    },
    description: {
      pt: "Usa colher pra comer (com algum derramamento, ok).",
      en: "Eats with a spoon (some spills are okay)."
    },
    source: "CDC 2022"
  }
];

// ──────────────────────────────────────────────────────
//   CONCERNING SIGNS (CDC "Act Early" 75th percentile)
//   Sinais pra conversar com o pediatra — nao alarmismo,
//   so um convite pra avaliacao precoce se ate aquela
//   idade o marco esperado nao apareceu.
// ──────────────────────────────────────────────────────

window.CONCERNING_SIGNS = [

  // 2 meses
  {
    key: "no_response_loud_sounds_2m",
    checkupAge: 2,
    label: {
      pt: "Nao reage a sons altos aos 2 meses",
      en: "Doesn't react to loud sounds by 2 months"
    },
    severity: "talk_to_doctor"
  },
  {
    key: "no_watch_movement_2m",
    checkupAge: 2,
    label: {
      pt: "Nao acompanha objetos ou pessoas com os olhos aos 2 meses",
      en: "Doesn't watch things or people move with eyes by 2 months"
    },
    severity: "talk_to_doctor"
  },
  {
    key: "no_smile_3m",
    checkupAge: 4,
    label: {
      pt: "Nao sorri pra pessoas ate os 3 meses",
      en: "Doesn't smile at people by 3 months"
    },
    severity: "talk_to_doctor"
  },

  // 4 meses
  {
    key: "no_head_steady_4m",
    checkupAge: 4,
    label: {
      pt: "Nao sustenta a cabeca firme aos 4 meses",
      en: "Doesn't hold head steady by 4 months"
    },
    severity: "talk_to_doctor"
  },
  {
    key: "no_coo_babble_4m",
    checkupAge: 4,
    label: {
      pt: "Nao faz arrulhos nem sons de balbucio aos 4 meses",
      en: "Doesn't coo or make sounds by 4 months"
    },
    severity: "talk_to_doctor"
  },

  // 6 meses
  {
    key: "no_affection_caregivers_6m",
    checkupAge: 6,
    label: {
      pt: "Nao mostra afeto pelos cuidadores aos 6 meses",
      en: "Doesn't show affection for caregivers by 6 months"
    },
    severity: "talk_to_doctor"
  },
  {
    key: "no_reach_for_things_6m",
    checkupAge: 6,
    label: {
      pt: "Nao tenta alcancar coisas que estao perto aos 6 meses",
      en: "Doesn't reach for things by 6 months"
    },
    severity: "talk_to_doctor"
  },
  {
    key: "no_laugh_6m",
    checkupAge: 6,
    label: {
      pt: "Nao da risadas ou sons agudos aos 6 meses",
      en: "Doesn't laugh or make squealing sounds by 6 months"
    },
    severity: "talk_to_doctor"
  },

  // 9 meses
  {
    key: "no_sit_with_help_9m",
    checkupAge: 9,
    label: {
      pt: "Nao senta com ajuda aos 9 meses",
      en: "Doesn't sit with help by 9 months"
    },
    severity: "talk_to_doctor"
  },
  {
    key: "no_respond_to_name_9m",
    checkupAge: 9,
    label: {
      pt: "Nao responde ao proprio nome aos 9 meses",
      en: "Doesn't respond to own name by 9 months"
    },
    severity: "talk_to_doctor"
  },
  {
    key: "no_babble_9m",
    checkupAge: 9,
    label: {
      pt: "Nao balbucia ('mama', 'baba') aos 9 meses",
      en: "Doesn't babble ('mama', 'baba') by 9 months"
    },
    severity: "talk_to_doctor"
  },

  // 12 meses
  {
    key: "no_gestures_12m",
    checkupAge: 12,
    label: {
      pt: "Nao usa gestos (tchau, apontar) aos 12 meses",
      en: "Doesn't use gestures (waving, pointing) by 12 months"
    },
    severity: "talk_to_doctor"
  },
  {
    key: "no_words_12m",
    checkupAge: 12,
    label: {
      pt: "Nao diz nenhuma palavra simples aos 12 meses",
      en: "Doesn't say any single words by 12 months"
    },
    severity: "talk_to_doctor"
  },

  // 18 meses
  {
    key: "no_walk_18m",
    checkupAge: 18,
    label: {
      pt: "Nao anda sozinha aos 18 meses",
      en: "Doesn't walk alone by 18 months"
    },
    severity: "talk_to_doctor"
  },
  {
    key: "few_words_18m",
    checkupAge: 18,
    label: {
      pt: "Sabe menos de 6 palavras aos 18 meses",
      en: "Knows fewer than 6 words by 18 months"
    },
    severity: "talk_to_doctor"
  },

  // 24 meses
  {
    key: "no_two_word_phrases_24m",
    checkupAge: 24,
    label: {
      pt: "Nao junta 2 palavras em frase aos 24 meses",
      en: "Doesn't use 2-word phrases by 24 months"
    },
    severity: "talk_to_doctor"
  },

  // Em qualquer idade (regressao)
  {
    key: "loses_skills_any_age",
    checkupAge: 24,
    label: {
      pt: "Perde habilidades que ja tinha (em qualquer idade)",
      en: "Loses skills she once had (at any age)"
    },
    severity: "talk_to_doctor"
  }
];
