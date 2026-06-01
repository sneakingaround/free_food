#!/usr/bin/env bash
# Publish using account SSH (same as OpenClaw whisper pushes) — no gh API required.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
WHISPER="git@github.com:sneakingaround/whisper.git"
BRANCH="investment-theses-pages"

python3 fetch-market.py
git push "$WHISPER" main:"$BRANCH"

# Ensure Pages workflow exists on whisper main (one-time).
WF_LOCAL="$ROOT/.github/workflows/deploy-from-whisper.yml"
WF_DEST=".github/workflows/publish-investment-theses.yml"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
git clone --depth 1 "$WHISPER" "$TMP/whisper"
cd "$TMP/whisper"
git checkout main
mkdir -p .github/workflows
cp "$WF_LOCAL" "$WF_DEST"
git add "$WF_DEST"
if git diff --cached --quiet; then
  echo "Whisper already has Pages workflow on main."
else
  git commit -m "Add GitHub Pages workflow for investment-theses-pages branch"
  git push origin main
  echo "Pushed Pages workflow to whisper main."
fi

echo ""
echo "Site branch: $BRANCH on sneakingaround/whisper"
echo "After Actions runs: check https://github.com/sneakingaround/whisper/actions"
echo "Pages URL is typically: https://sneakingaround.github.io/whisper/"
echo ""
echo "For https://sneakingaround.github.io/investment-theses/ create repo investment-theses once, then:"
echo "  git push -u origin main"
