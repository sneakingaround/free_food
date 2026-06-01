#!/usr/bin/env bash
# Discover GitHub auth the same way OpenClaw/Hermes document (SSH vs gh vs PAT).
set -euo pipefail

echo "=== SSH (git@github.com) ==="
ssh -T git@github.com 2>&1 | head -1 || true
ssh -i "${HOME}/.ssh/openclaw_deploy" -o IdentitiesOnly=yes -T git@github.com 2>&1 | head -1 || true

echo ""
echo "=== gh CLI ==="
if command -v gh >/dev/null; then
  gh auth status 2>&1 || true
  for d in "${GH_CONFIG_DIR:-}" "${HOME}/.config/gh" /root/.config/gh; do
    [[ -n "$d" && -f "$d/hosts.yml" ]] && echo "hosts.yml: $d/hosts.yml"
  done
else
  echo "gh not installed"
fi

echo ""
echo "=== env / hermes ==="
source /home/gn/.hermes/skills/github/github-auth/scripts/gh-env.sh 2>/dev/null || true
echo "GH_AUTH_METHOD=${GH_AUTH_METHOD:-unknown}"
[[ -n "${GITHUB_TOKEN:-}" ]] && echo "GITHUB_TOKEN=set" || echo "GITHUB_TOKEN=unset"

echo ""
echo "=== git remotes (sneakingaround) ==="
for r in /home/gn/investment-theses /home/gn/.openclaw/workspace /home/gn/photonics_audio; do
  [[ -d "$r/.git" ]] && echo -n "$r: " && git -C "$r" remote get-url origin 2>/dev/null || true
done
