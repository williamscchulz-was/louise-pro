#!/usr/bin/env bash
# AUTO-PUSH (Stop): empurra commits ja feitos pra origin/main. Nunca forca. Versionado.
set -uo pipefail
DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
cd "$DIR" 2>/dev/null || exit 0
[ -z "$(git status --porcelain 2>/dev/null)" ] || exit 0
AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)
[ "$AHEAD" -gt 0 ] || exit 0
if git push origin HEAD:main --quiet 2>/dev/null; then
  printf '{"systemMessage":"Auto-push: %s commit(s) enviados pra origin/main."}\n' "$AHEAD"
else
  printf '{"systemMessage":"Auto-push falhou (divergencia). Rode: git pull --rebase origin main && git push origin HEAD:main"}\n'
fi
