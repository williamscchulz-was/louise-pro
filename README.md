# 👶 Louise Pro

A personal baby tracker PWA I built for my daughter Louise. Single HTML file, React 18 + Firebase, deployed on GitHub Pages.

**Live app:** [williamscchulz-was.github.io/louise-pro](https://williamscchulz-was.github.io/louise-pro/)

---

## Why this exists

When Louise was born in March 2026, my wife and I started using a popular baby tracking app. It was fine, but I kept wishing it did things differently — cleaner interface, smarter insights, better sleep analysis, bilingual support (we speak Portuguese at home). So I built our own.

Louise Pro isn't a product. It's a personal tool for my family, developed across dozens of iterations with Claude as my pair-programmer. It's public because I think the code might be useful to other parents who want to build something similar, and because I have nothing to hide.

If you're a new parent who codes — feel free to fork this, rename it after your own baby, swap the Firebase credentials, and make it yours.

---

## What it does

### 📊 Core tracking
- **Feeds** — bottles (ml) and nursing (with L/R side tracking and pause)
- **Sleep** — naps and bedtime with a live timer, synced across devices in real time
- **Diapers** — wet, dirty, both
- **Medicine** — with a saved quick-select list
- **Bath, temperature, growth** — weight, length, head circumference

### 🧠 Smart insights
A custom routine engine analyzes 7 days of patterns to generate personalized insights:

- Wake-window recommendations adapted to baby's current age
- Daily schedule projection ("next nap expected around 14:30")
- Contextual hints: pre-feed, bedtime approaching, bath reminder, feed overdue, cluster feeding detection, feed volume vs WHO, and more
- Night-waking intelligence: frequency, time clustering, trend (improving/worsening)
- All insights blended with WHO/AAP guidelines

### 🌙 Night mode
- **Wake Lock** — screen stays on during nursing and night wakes, so your hands can stay free
- **Night Wake tracking** — log wakings inside a bedtime with bottles/diapers grouped under each one
- Larger, warmer, amber-pulsing buttons — easier to tap with half-closed eyes at 3am

### 🌱 Growth tracking
- WHO LMS tables with automatic percentile calculation and z-scores
- Interactive growth curves

### 📖 Daily curiosities
89 bilingual curiosities covering day 1 through month 12, based on sources from AAP, WHO, NHS, Mayo Clinic, Harvard, CDC, Zero to Three, and Stanford. Rotates through daily facts, weekly milestones, and monthly anniversaries.

### 🌍 Bilingual
Full Portuguese and English support — insights, curiosities, changelog, everything.

### 📱 iOS-first
PWA with splash screen, offline-capable shell, safe-area handling for iPhone 15+, Napper-inspired ring interface, and real-time multi-device sync via Firestore.

---

## Tech stack

Deliberately kept minimal:

- **HTML** — a single `index.html` file
- **React 18** — loaded via CDN
- **Babel Standalone** — JSX transpiled in the browser
- **Firebase 10.x compat** — Firestore for persistence, loaded via CDN
- **A few extracted modules** (`.js` files for large static data)
- **PWA** — `manifest.json` + app icons

No bundler, no package.json, no build step. You edit `index.html` and push. The whole thing fits in ~200KB.

### Files

```
louise-pro/
├── index.html          ← the entire app
├── curiosities.js      ← 89 bilingual baby curiosities
├── routine-engine.js   ← sleep/feed pattern analysis engine
├── who-growth.js       ← WHO LMS growth tables + percentile functions
├── changelog.js        ← bilingual version history (data)
├── wake-lock.js        ← screen wake lock helper
├── manifest.json       ← PWA manifest
└── icon-*.png          ← PWA icons
```

---

## Running it for your own baby

1. **Fork this repo** and rename it
2. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com) and enable Cloud Firestore
3. **Replace the Firebase config** in `index.html` (search for `firebaseConfig`)
4. **⚠️ Set Firestore security rules** — see warning below
5. **Enable GitHub Pages** in repo Settings → Pages → Branch: `main`
6. **Open the live URL** on your iPhone and add to Home Screen (Safari → Share → Add to Home Screen)

### ⚠️ A word on Firestore security

Firebase's default Firestore rules are wide open (`allow read, write: if true;`). If you fork this and leave them that way, **anyone who finds your project ID can read and write your baby's data**.

Before deploying, lock your rules down. A few options:
- Restrict writes to specific authenticated users
- Restrict access to requests from your own GitHub Pages domain
- Add Firebase App Check

For personal family use, even simple restrictions are enough to keep automated scrapers out. But don't skip this step.

---

## Versioning

Semver, loosely. The full changelog lives inside the app as a bilingual data structure — tap the version number in the Profile page to see what changed in each release.

Current version: **v8.4.3**

---

## License

MIT-ish — provided as-is, no warranty, for educational and personal use. The WHO growth data is from the World Health Organization. The curiosities were researched from public health authorities (AAP, WHO, NHS, Mayo Clinic, Harvard, CDC, Zero to Three, Stanford).

Fork it, customize it, share it. No attribution required. If you end up using it, a ⭐ would make my day.

---

## About this project

Built with love for Louise 💜
Developed in Blumenau, Brazil, with Claude as pair-programmer.

*This is a personal tool that happens to be public — I'm not accepting pull requests, but feel free to open an issue if you spot a bug, or fork it freely for your own family.*
