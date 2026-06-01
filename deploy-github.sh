#!/usr/bin/env bash
# Deploy investment-theses to GitHub Pages (canonical repo or whisper fallback).
set -euo pipefail
cd "$(dirname "$0")"
REPO="sneakingaround/free_food"
REMOTE="git@github.com:${REPO}.git"
SITE="https://sneakingaround.github.io/free_food/"

# Hermes / OpenClaw auth discovery (see scripts/github-auth-discover.sh).
if [[ -f "$HOME/.hermes/.env" ]]; then
  # shellcheck disable=SC1090
  set -a && source "$HOME/.hermes/.env" && set +a
fi
if [[ -z "${GITHUB_TOKEN:-}" && -z "${GH_TOKEN:-}" ]]; then
  if [[ -f "$HOME/.git-credentials" ]] && grep -q github.com "$HOME/.git-credentials" 2>/dev/null; then
    GITHUB_TOKEN=$(grep github.com "$HOME/.git-credentials" | head -1 | sed 's|https://[^:]*:\([^@]*\)@.*|\1|')
  fi
fi
GITHUB_TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"
if [[ -z "${GITHUB_TOKEN:-}" && -n "${GH_CONFIG_DIR:-}" && -f "${GH_CONFIG_DIR}/hosts.yml" ]]; then
  export GH_CONFIG_DIR
fi

python3 fetch-market.py

repo_exists() {
  git ls-remote "$REMOTE" &>/dev/null
}

create_repo() {
  echo "Creating github.com/${REPO} ..."
  if gh auth status &>/dev/null 2>&1; then
    gh repo create "$REPO" --public \
      --description "Investment thesis cards (IBM, NOW, NOK, INTC)" \
      --source=. --remote=origin --push
    return 0
  fi
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    curl -fsS -X POST \
      -H "Authorization: Bearer ${GITHUB_TOKEN}" \
      -H "Accept: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      https://api.github.com/user/repos \
      -d "{\"name\":\"investment-theses\",\"description\":\"Investment thesis cards (IBM, NOW, NOK, INTC)\",\"private\":false}" \
      >/dev/null
    git push -u origin main
    return 0
  fi
  echo "No GitHub API token on this host (OpenClaw used SSH git push, not stored gh auth)."
  echo "  Quick publish (SSH only): ./scripts/publish-via-whisper.sh"
  echo "  Or create empty repo at https://github.com/new?name=free_food then re-run."
  echo "  Or: gh auth login -h github.com -p ssh -s repo,workflow,read:org"
  echo "  Or: GITHUB_TOKEN=ghp_... in ~/.hermes/.env"
  return 1
}

if ! repo_exists; then
  create_repo || exit 1
else
  git push -u origin main
fi

echo "Pushed. Pages URL (after Actions finishes): ${SITE}"
echo "Actions: https://github.com/${REPO}/actions"
