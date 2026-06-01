#!/usr/bin/env bash
# Create repo (if needed), push main, enable GitHub Pages via Actions workflow.
set -euo pipefail
cd "$(dirname "$0")"
REPO="sneakingaround/investment-theses"
REMOTE="git@github.com:${REPO}.git"

python3 fetch-market.py

if ! git ls-remote "$REMOTE" &>/dev/null; then
  echo "Remote repo not found — creating ${REPO} ..."
  if ! gh auth status &>/dev/null; then
    echo "Run: gh auth login -h github.com -p ssh -s repo,workflow,read:org"
    echo "Then re-run: $0"
    exit 1
  fi
  gh repo create "$REPO" --public --description "Investment thesis cards (IBM, NOW, NOK, INTC)" --source=. --remote=origin --push
  gh api "repos/${REPO}/pages" -X POST -f build_type=workflow -f source[branch]=main -f source[path]=/ 2>/dev/null \
    || echo "Pages will activate after the first workflow run on main."
  exit 0
fi

git push -u origin main
echo "Pushed. Site: https://sneakingaround.github.io/investment-theses/"
