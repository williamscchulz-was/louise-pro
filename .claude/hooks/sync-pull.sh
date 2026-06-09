#!/usr/bin/env bash
# AUTO-PULL (SessionStart): toda sessao comeca atualizada. Versionado.
set -uo pipefail
DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
cd "$DIR" 2>/dev/null || exit 0
git fetch origin --quiet 2>/dev/null || exit 0
BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo 0)
DIRTY=$(git status --porcelain 2>/dev/null)
emit() { printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}\n' "$1"; }
[ "$BEHIND" -eq 0 ] && exit 0
if [ -z "$DIRTY" ]; then
  if git pull --ff-only origin main --quiet 2>/dev/null; then
    emit "Sync: clone estava ${BEHIND} commit(s) atras; puxei de origin/main. Atualizado. (Checar git log antes de assumir que tarefa nao foi feita.)"
  else
    emit "AVISO: ${BEHIND} atras mas pull --ff-only falhou (divergencia). Rodar git pull --rebase origin main."
  fi
else
  emit "ATENCAO: ${BEHIND} commit(s) atras E ha mudancas locais nao commitadas. Resolver antes (git stash + pull + stash pop)."
fi
