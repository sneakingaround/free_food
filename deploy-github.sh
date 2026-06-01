#!/usr/bin/env bash
# Create repo (if needed), push main, deploy via GitHub Actions → Pages.
set -euo pipefail
cd "$(dirname "$0")"
REPO="sneakingaround/investment-theses"
REMOTE="git@github.com:${REPO}.git"
SITE="https://sneakingaround.github.io/investment-theses/"

# Optional PAT for repo creation (SSH alone cannot create repos).
if [[ -f "$HOME/.hermes/.env" ]]; then
  # shellcheck disable=SC1090
  set -a && source "$HOME/.hermes/.env" && set +a
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
  echo "Need GitHub API auth to create the repo (SSH push works only after it exists)."
  echo "  Option A: gh auth login -h github.com -p ssh -s repo,workflow,read:org"
  echo "  Option B: add GITHUB_TOKEN=ghp_... to ~/.hermes/.env (classic PAT, scope: repo)"
  return 1
}

if ! repo_exists; then
  create_repo || exit 1
else
  git push -u origin main
fi

echo "Pushed. Pages URL (after Actions finishes): ${SITE}"
echo "Actions: https://github.com/${REPO}/actions"
