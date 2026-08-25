#!/bin/sh
# Assemble the public site into dist/.
#
# Everything NOT listed here stays private: docs/, CLAUDE.md, build tooling.
# Those files are part of the handover, but they are internal notes and must
# never be served on the public domain.

set -e
rm -rf dist
mkdir -p dist

# pages
cp index.html terms.html privacy.html dist/

# crawler files
cp robots.txt sitemap.xml dist/

# Cloudflare Pages config
cp _headers _redirects dist/

# static assets
mkdir -p dist/assets
cp -R assets/css assets/js assets/images dist/assets/

# strip anything that should never ship
find dist -name '.DS_Store' -delete

echo "dist/ built:"
find dist -type f | sort | sed 's|^dist/|  |'
echo
echo "total: $(du -sh dist | cut -f1)"
