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

import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import babel from "@babel/core";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const DIST = join(ROOT, "dist");

// Fresh dist each build.
if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const SRC = join(ROOT, "index.html");
let html = readFileSync(SRC, "utf8");

// Extract the JSX script block. There's exactly one in Louise Pro's index.html.
const BABEL_SCRIPT_RE = /<script type="text\/babel">([\s\S]*?)<\/script>/;
const match = html.match(BABEL_SCRIPT_RE);
if (!match) {
  console.error("[build] ERROR: could not find <script type=\"text/babel\"> in index.html");
  process.exit(1);
}

console.log("[build] JSX source: " + match[1].length + " chars");

const result = babel.transformSync(match[1], {
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
html = html.replace(BABEL_SCRIPT_RE, "<script>\n" + result.code + "\n</script>");

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

writeFileSync(join(DIST, "index.html"), html);
console.log("[build] wrote dist/index.html (" + html.length + " chars)");

// Copy static files as-is. Service workers and manifest MUST be at root.
const copies = [
  "manifest.json",
  "sw.js",
  "firebase-messaging-sw.js",
  "js",
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

console.log("[build] done.");
