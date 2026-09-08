#!/bin/bash
# Deploys IrrigationLineShockSOP.html to Cloudflare Pages (nlt-irrigation-sop.pages.dev).
# Run this in a normal Terminal window on your Mac, from inside this folder.
#
# One-time setup (pick ONE):
#   A) npx wrangler login
#      -> opens your browser, click Allow. Stores login locally, nothing to repeat.
#   B) export CLOUDFLARE_API_TOKEN=paste_your_token_here
#      -> only lasts for that terminal session/window.
# Then, also one-time:
#   npx wrangler pages project create nlt-irrigation-sop --production-branch=main
#
# After that, every time this HTML file is updated, just run:
#   ./deploy-cloudflare.sh

set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMPDIR=$(mktemp -d)
cp "$DIR/IrrigationLineShockSOP.html" "$TMPDIR/index.html"
npx wrangler pages deploy "$TMPDIR" --project-name=nlt-irrigation-sop
rm -rf "$TMPDIR"
echo "Deployed. Live at: https://nlt-irrigation-sop.pages.dev"
