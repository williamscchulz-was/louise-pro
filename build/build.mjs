// Louise Pro build: precompile inline JSX so the deployed app doesn't load
// @babel/standalone (~1.5 MB CDN fetch + runtime transpile on every cold start).
//
// Input:  the source index.html at repo root (what the dev edits).
// Output: dist/index.html with the inline JSX already compiled to plain JS,
//         plus all other static files copied as-is.
//
// No source-map, no minifier, no preset-env. Modern Safari (iPhone 15+)
// and Chromium target directly. Only @babel/preset-react is needed to
// transform JSX into React.createElement calls.

import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import babel from "@babel/core";
import vm from "node:vm";

// v11.9.112: syntax-guard. Compila (NÃO executa) o código com vm.Script — joga
// SyntaxError se o JS for inválido. Usado pra blindar o deploy: um bundle quebrado
// JAMAIS pode ir pro ar (Babel transpilar OK não garante que a injeção no HTML ficou
// válida — vide o bug do $& v11.9.107). Falha = process.exit(1) → o CI aborta.
function assertValidJS(label, code) {
  try {
    new vm.Script(code, { filename: label });
  } catch (e) {
    console.error("\n[build] ❌ FATAL: " + label + " não é JavaScript válido — deploy abortado.");
    console.error("[build]   " + (e && e.message));
    process.exit(1);
  }
}

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const DIST = join(ROOT, "dist");

// Fresh dist each build.
if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const SRC = join(ROOT, "index.html");
let html = readFileSync(SRC, "utf8");

// v11.9.86: CSS lives in styles.css — inline it into the empty <style> at build time
// (keeps cold start fast: no extra render-blocking request; byte-identical to inline).
// Anchored on the indented tag so the "<style>" inside the boot-script comment isn't matched.
const cssSource = readFileSync(join(ROOT, "styles.css"), "utf8");
html = html.replace(/(\n[ \t]*<style>)[\s\S]*?(<\/style>)/, (mm, p1, p2) => p1 + cssSource + p2);
console.log("[build] inlined styles.css (" + cssSource.length + " chars)");

// v11.9.85: the app source lives in src/*.jsx (split out of the old inline block).
// Concatenate them in filename order (NN- prefixes) and transpile as ONE unit, so the
// compiled output is byte-identical to the pre-split single-file build. index.html keeps
// an empty <script type="text/babel"></script> placeholder that we fill below.
const BABEL_SCRIPT_RE = /<script type="text\/babel">[\s\S]*?<\/script>/;
if (!BABEL_SCRIPT_RE.test(html)) {
  console.error("[build] ERROR: could not find <script type=\"text/babel\"> placeholder in index.html");
  process.exit(1);
}
const SRC_DIR = join(ROOT, "src");
const srcFiles = readdirSync(SRC_DIR).filter(f => f.endsWith(".jsx")).sort();
if (srcFiles.length === 0) {
  console.error("[build] ERROR: no .jsx files found in src/");
  process.exit(1);
}
let appSource = "";
for (const f of srcFiles) appSource += readFileSync(join(SRC_DIR, f), "utf8");
console.log("[build] JSX source: " + appSource.length + " chars from " + srcFiles.length + " src/ files");

const result = babel.transformSync(appSource, {
  presets: [["@babel/preset-react", { runtime: "classic" }]],
  // No preset-env on purpose: Safari 17+ / Chrome 120+ handle all our syntax natively.
  // Keeping native syntax means smaller output and faster parse.
  compact: false,
  comments: false,
  sourceType: "script",
  babelrc: false,
  configFile: false,
  // Resolve presets relative to build/ where node_modules lives, even if the
  // script is invoked from a different cwd (e.g. repo root in CI).
  cwd: HERE,
});

if (!result || !result.code) {
  console.error("[build] ERROR: babel.transformSync returned no code");
  process.exit(1);
}

console.log("[build] compiled output: " + result.code.length + " chars");

// Replace the babel block with plain <script> containing compiled code.
// IMPORTANT: use a FUNCTION replacer — a string replacement would interpret $&, $1, $`,
// $', $$ in result.code as special patterns (bug v11.9.107→110: a "\\$&" regex-escape in
// the source got mangled into the matched <script> tag, corrupting the JS → app dead on
// boot). Function replacers receive the code verbatim, immune to any $ in app source.
html = html.replace(BABEL_SCRIPT_RE, () => "<script>\n" + result.code + "\n</script>");

// Remove the @babel/standalone CDN script tag — it's no longer needed at runtime.
// The tag looks like:
//   <script src="https://unpkg.com/@babel/standalone@7.24.0/babel.min.js" ...></script>
const BABEL_CDN_RE = /\n?\s*<script[^>]*src="https:\/\/unpkg\.com\/@babel\/standalone[^"]*"[^>]*><\/script>/;
if (!BABEL_CDN_RE.test(html)) {
  console.warn("[build] WARN: @babel/standalone CDN script tag not found — leaving HTML as-is.");
} else {
  html = html.replace(BABEL_CDN_RE, "");
  console.log("[build] removed @babel/standalone CDN tag");
}

// ─── JS BUNDLE (v10.1.0) ─────────────────────────────────────────
// Concatenate the 7 libs in js/ into a single app-libs.js so the browser
// makes 1 HTTP request instead of 7 on cold load. Order matters — match
// the load order from the source index.html's <script src="js/..."> tags.
const JS_BUNDLE_FILES = [
  "who-growth.js",
  "changelog.js",
  "curiosities.js",
  "milestones.js",
  "wake-lock.js",
  "device-features.js",
  "routine-engine.js",
];
let bundle = "";
for (const f of JS_BUNDLE_FILES) {
  const src = readFileSync(join(ROOT, "js", f), "utf8");
  bundle += "\n/* ========== " + f + " ========== */\n" + src + "\n;\n";
}
mkdirSync(join(DIST, "js"), { recursive: true });
writeFileSync(join(DIST, "js", "app-libs.js"), bundle);
console.log("[build] bundled js/ into app-libs.js (" + bundle.length + " chars)");

// Collapse the 7 <script src="js/X.js"> tags into 1 reference to the bundle.
// Regex matches the first tag through the last, including blank lines between.
// (v11.9.56: era 6, agora 7 com milestones.js)
const BUNDLE_SCRIPT_RE = /<script src="js\/who-growth\.js"><\/script>[\s\S]*?<script src="js\/routine-engine\.js"><\/script>/;
if (BUNDLE_SCRIPT_RE.test(html)) {
  html = html.replace(BUNDLE_SCRIPT_RE, '<script src="js/app-libs.js"></script>');
  console.log("[build] collapsed 7 <script> tags into 1 bundle reference");
} else {
  console.warn("[build] WARN: could not find 7-script block to bundle, HTML unchanged");
}

writeFileSync(join(DIST, "index.html"), html);
console.log("[build] wrote dist/index.html (" + html.length + " chars)");

// ─── SYNTAX GUARD (v11.9.112) ────────────────────────────────────
// Valida o JS REALMENTE gerado (inline do index + bundle). Se qualquer um não
// parsear, aborta o build → o GitHub Action falha → NADA quebrado é publicado.
{
  const inlineBlocks = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const appInline = inlineBlocks.filter(b => b.includes("APP_VERSION")).sort((a, b) => b.length - a.length)[0] || "";
  if (!appInline) {
    console.error("[build] ❌ FATAL: não achei o script inline do app no output.");
    process.exit(1);
  }
  assertValidJS("dist/index.html (app inline)", appInline);
  assertValidJS("dist/js/app-libs.js", bundle);
  console.log("[build] ✓ syntax guard OK — app inline + app-libs.js parseiam limpos");
}

// Extract APP_VERSION from the compiled HTML for service worker cache-busting.
// sw.js uses __APP_VERSION__ as a placeholder that we replace here, so every
// new release lands with a different CACHE_NAME and the browser purges old
// caches on activate.
const APP_VERSION_MATCH = html.match(/const\s+APP_VERSION\s*=\s*"([^"]+)"/);
const appVersion = APP_VERSION_MATCH ? APP_VERSION_MATCH[1] : "unknown";
console.log("[build] detected APP_VERSION = " + appVersion);

// Handle sw.js specially: inject APP_VERSION into the __APP_VERSION__ placeholder,
// and collapse the 6 individual js/ precache URLs into the bundle URL.
let swOut = readFileSync(join(ROOT, "sw.js"), "utf8");
swOut = swOut.replace(/__APP_VERSION__/g, appVersion);
const SW_PRECACHE_RE = /"\.\/js\/who-growth\.js",[\s\S]*?"\.\/js\/routine-engine\.js",/;
if (SW_PRECACHE_RE.test(swOut)) {
  swOut = swOut.replace(SW_PRECACHE_RE, '"./js/app-libs.js",');
  console.log("[build] collapsed 7 SW precache URLs into 1 bundle URL");
}
writeFileSync(join(DIST, "sw.js"), swOut);
console.log("[build] wrote dist/sw.js with version " + appVersion);

// Copy the other static files as-is. Service workers and manifest MUST be
// at root so their scope/registration works correctly. js/ is NOT copied —
// the bundle above replaces it in the deployed output.
const copies = [
  "manifest.json",
  "firebase-messaging-sw.js",
  "assets",
];
for (const rel of copies) {
  const src = join(ROOT, rel);
  if (!existsSync(src)) {
    console.warn("[build] WARN: missing expected path " + rel + " (skipped)");
    continue;
  }
  cpSync(src, join(DIST, rel), { recursive: true });
  console.log("[build] copied " + rel);
}

// ⚠️ v11.9.143 — REMOVIDO: a cópia `.claude/mockups/` → `dist/preview/` (existia desde a
// v11.9.61). Motivo duplo, um de privacidade e um de utilidade:
//
// 1. VAZAMENTO REAL (achado da auditoria de 17/ago/2026): a cópia era do diretório INTEIRO,
//    sem filtro. `relatorio-30d.html` — que o próprio CLAUDE.md registra como "gerado com os
//    DADOS REAIS via Firestore REST, não exemplo" — ficou servido publicamente em
//    https://.../preview/relatorio-30d.html com HTTP 200: nome completo da Louise, data de
//    nascimento exata e 30 dias de rotina de sono/alimentação, indexável por buscador.
// 2. A FEATURE NÃO ERA USADA: a v11.9.61 criou isso pro William revisar mockup no iPhone,
//    mas a v11.9.67 (posterior) documentou que /preview/ "apesar de tecnicamente live, HTTP
//    200, não chega até ele na prática" — a superfície de revisão real dele é o app live
//    deployado ou um Artifact (link HTTPS que abre no iPhone). Ou seja: risco permanente
//    de privacidade em troca de zero utilidade.
//
// REGRA NOVA: mockup NUNCA vai pro domínio público. Pra revisão, publicar como Artifact
// (privado por padrão). E mockup nunca deve conter dado de produção — quando precisar
// parecer real, usar dado sintético ou datas relativas (D-1, D-2), sem nome e sem nascimento.
// Cria .nojekyll vazio no root pra forçar Pages a servir tudo sem Jekyll
writeFileSync(join(DIST, ".nojekyll"), "");
console.log("[build] wrote .nojekyll");

console.log("[build] done.");
