<div align="center">

# 👶 Louise Pro

**A personal, real-time, bilingual baby-tracker PWA — built for my daughter Louise.**

[![Live](https://img.shields.io/badge/live-app-22d3ee?style=flat-square)](https://williamscchulz-was.github.io/louise-pro/)
[![PWA](https://img.shields.io/badge/PWA-iOS%20first-8b7cf6?style=flat-square)](https://williamscchulz-was.github.io/louise-pro/)
[![License: MIT](https://img.shields.io/badge/license-MIT-a3e635?style=flat-square)](LICENSE)

[**Open the app →**](https://williamscchulz-was.github.io/louise-pro/)

</div>

---

## Why this exists

When Louise was born in March 2026, my wife and I started with a popular baby-tracking app. It was fine — but I kept wishing it did things differently: a cleaner interface, smarter insights, better sleep analysis, and full Portuguese support (we speak Portuguese at home). So I built our own.

Louise Pro isn't a product. It's a personal tool for my family, developed across hundreds of iterations with Claude as pair-programmer. It's public because the code might help other parents who want to build something similar — and because I have nothing to hide.

If you're a new parent who codes: fork it, rename it after your own baby, swap the Firebase credentials, and make it yours.

---

## What it does

**Tracking** — bottles (ml) and nursing (L/R side + pause), sleep (naps & bedtime with a live cross-device timer and night-waking breakdown), diapers, medicine (saved quick-select), bath (live timer), temperature, and growth.

**Smart insights** — a custom routine engine reads the last several days and produces age-aware wake-window guidance, a projected daily schedule ("next nap ~14:30"), contextual hints (pre-feed, bedtime approaching, feed overdue, cluster-feeding, volume vs. WHO), and night-waking trends — blended with WHO/AAP guidelines. Plus gentle safety nets: an **anti-double-dose** warning (the two phones sync, so it catches a med already given) and an **odd-value** check that flags likely typos before saving.

**Visual cosmos** — a Napper-inspired ring at the center of the home screen, with each event placed around the day's arc; weekly **behavior curves** (sleep / milk / wake-ups vs. the typical range for age); **sleep records & badges**; WHO **growth** percentiles with interactive curves; **developmental milestones** (CDC 2022 + WHO + AAP) with achievement badges; and daily bilingual **curiosities**.

**Night mode** — Wake Lock keeps the screen on during nursing and night wakes; warmer, larger, amber-pulsing buttons for 3am taps.

**Bilingual & iOS-first** — full Portuguese/English (UI, insights, curiosities, changelog), PWA with splash screen, offline-capable shell, safe-area handling, and real-time multi-device sync via Firestore.

---

## Tech stack

Deliberately minimal — **one build step, no bundler, no TypeScript, no npm in production.**

- **HTML + React 18** loaded from a CDN.
- **JSX is pre-compiled at build time** with `@babel/core` + `@babel/preset-react`. The browser loads plain JS, never a transpiler — a deliberate performance decision (in-browser Babel froze cold start on iPhone PWA).
- App code lives in **`src/*.jsx`**, split by component/page. The build concatenates the files in filename order and transpiles them as a **single shared scope** — no module system, no imports.
- All CSS and `@keyframes` live in **`styles.css`**, re-inlined into the shell at build time (one less request on cold start).
- Large static data (changelog, curiosities, milestones, WHO tables) lives in **`js/*.js`** and is bundled into a single `app-libs.js`.
- **Firebase 10.x compat** (Cloud Firestore) via CDN for persistence and live sync.
- **PWA**: `manifest.json`, service worker, and app icons.
- **Deploy**: push to `main` → a GitHub Action runs the build and publishes `dist/` to GitHub Pages.

### Project structure

```
louise-pro/
├── index.html              ← thin shell; the build injects compiled JS + inlined CSS
├── styles.css              ← all CSS + @keyframes (re-inlined at build)
├── src/                    ← app code (JSX), one file per component/page
│   ├── 00-core.jsx         ← version, constants, pure helpers (insights, warnings…)
│   ├── 10-ui-base.jsx      ← icons, design tokens, i18n
│   ├── 20-ring.jsx         ← the central ring
│   ├── 22…34               ← timer cards, widgets, sleep block, add-form, inbox
│   ├── 40-profile.jsx      ← settings / profile
│   ├── 50-stats.jsx        ← summary, weekly report, sleep records
│   ├── 54-growth.jsx       ← WHO growth curves
│   ├── 55-behavior.jsx     ← weekly behavior curves
│   ├── 56-milestones.jsx   ← developmental milestones + badges
│   ├── 60-starfield-backup.jsx
│   └── 90-app.jsx          ← root component + mount
├── js/                     ← static data + device helpers
│   ├── changelog.js · curiosities.js · milestones.js
│   ├── routine-engine.js · who-growth.js
│   └── wake-lock.js · device-features.js
├── build/build.mjs         ← the single build step (JSX→JS, inline CSS, bundle js/)
├── assets/icons/           ← PWA icons
├── manifest.json · sw.js · firebase-messaging-sw.js
└── .github/workflows/      ← build + deploy to Pages on every push to main
```

---

## Run it for your own baby

1. **Fork** this repo and rename it.
2. Create a **Firebase** project and enable Cloud Firestore.
3. Replace the **`firebaseConfig`** in `index.html`.
4. **⚠️ Lock down your Firestore rules** (see the warning below).
5. In **Settings → Pages**, set **Source = "GitHub Actions"** — the included workflow builds and deploys on every push to `main`.
6. Open the live URL on your iPhone → **Add to Home Screen**.

### Build locally (optional)

```bash
cd build && npm install && cd ..
node build/build.mjs        # outputs dist/
```

The build also runs a syntax guard on its own output and **aborts the deploy** if the generated JS doesn't parse — so a broken build can never ship.

### ⚠️ A word on Firestore security

Firebase's default rules are wide open (`allow read, write: if true;`). If you fork this and leave them that way, **anyone who finds your project ID can read and write your baby's data.** Before deploying, restrict writes (authenticated users, your own domain, and/or Firebase App Check). For personal family use, even simple restrictions keep scrapers out — but don't skip this step.

---

## Versioning

Semver, loosely. The **full bilingual changelog lives inside the app** — tap the version number on the Profile page to see what changed in each release. (Intentionally not pinned here, so it never goes stale.)

---

## License

[MIT](LICENSE) — provided as-is, for educational and personal use. WHO growth data © World Health Organization. Curiosities and milestones were researched from public-health sources (AAP, WHO, NHS, Mayo Clinic, Harvard, CDC, Zero to Three, Stanford).

Fork it, customize it, share it — no attribution required. If you end up using it, a ⭐ would make my day.

---

<div align="center">

Built with 💜 for Louise — in Blumenau, Brazil, with Claude as pair-programmer.

*A personal tool that happens to be public. Not accepting pull requests, but feel free to open an issue for bugs, or fork it freely for your own family.*

</div>
