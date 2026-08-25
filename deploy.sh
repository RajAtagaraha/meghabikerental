#!/bin/sh
# Build and publish the site.
#
#   ./deploy.sh            build + publish to GitHub Pages (gh-pages branch)
#   ./deploy.sh cloudflare build + publish to Cloudflare Pages
#
# Only the contents of dist/ are ever published. docs/ and CLAUDE.md stay private.

set -e
./build.sh

if [ "$1" = "cloudflare" ]; then
  echo
  echo "Publishing to Cloudflare Pages..."
  npx wrangler pages deploy dist --project-name=meghabikerental --branch=main
  exit 0
fi

echo
echo "Publishing to GitHub Pages (gh-pages)..."
TMP=$(mktemp -d)
cp -R dist/. "$TMP"/
cp CNAME "$TMP"/CNAME          # GitHub reads the custom domain from the published branch
touch "$TMP"/.nojekyll
cd "$TMP"
git init -q
git checkout -q -b gh-pages
git add -A
git commit -q -m "Publish built site"
git remote add origin https://github.com/RajAtagaraha/meghabikerental.git
git push -qf origin gh-pages
cd - >/dev/null
rm -rf "$TMP"
echo "Pushed. GitHub rebuilds in about a minute."
