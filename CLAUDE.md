# CLAUDE.md — Megha Bike Rental

Instructions for AI agents working in this repo. Keep this file short and factual.
If something here goes out of date, fix it in the same change that made it so.

## What this is

A static, customer-facing website for **Megha Bike Rental**, a bike and scooter
rental business in Shillong, Meghalaya. Customers browse the fleet and enquire via
WhatsApp. There is no online booking, no payments, no backend, no database.

Live domain: **https://www.meghabikerental.com**

- Product spec and open questions: [docs/PRD.md](docs/PRD.md)
- Why things are the way they are: [docs/DECISIONS.md](docs/DECISIONS.md)
- Launch and owner handover steps: [docs/HANDOVER.md](docs/HANDOVER.md)

## Stack

Plain **HTML + CSS + vanilla JavaScript**. No framework, no bundler, no npm, no
build step. This is deliberate — the site is handed to a non-technical owner who
must be able to change a price by editing one file. See DECISIONS.md.

**Do not introduce React, a build tool, TypeScript, npm dependencies, or a CSS
framework.** If a task seems to need one, say so and stop; do not add it.

## Commands

There is no build. To preview locally:

```
python3 -m http.server 8000     # then open http://localhost:8000
```

To deploy: push to the connected repo. Cloudflare Pages publishes the root
directory as-is. No build command, no output directory.

## Layout

```
index.html              Homepage — hero, fleet, how it works, pickup, FAQ
terms.html              Terms & Conditions
privacy.html            Privacy Policy
robots.txt              Crawler rules
sitemap.xml             Three URLs; update lastmod when pages change
assets/css/styles.css   Layout and components. Semantic tokens in :root.
assets/css/themes.css   12 palettes + 5 finishes, plus the picker's own styles.
assets/js/theme.js      Theme picker. PREVIEW TOOL — delete before handover.
assets/js/data.js       Business details + fleet + prices. THE file owners edit.
assets/js/main.js       Renders cards, filtering, WhatsApp link building.
assets/images/bikes/    Photos only for vehicles with photo:true (currently 2).
                        The other six render inline SVG art from main.js.
assets/images/places/   Destination + hero photography, all CC-licensed
```

## Ground rules

These exist to stop confident wrong answers. They matter more than style.

1. **Verify before you assert.** Never describe a file, value, or behaviour from
   memory. Read it. Reference code as `assets/js/data.js:42` so it is checkable.
2. **Business facts are not guessable.** Prices, deposit, fuel policy, helmet
   inclusion, pickup charges, cancellation terms and the WhatsApp number come from
   the owner. Never invent a number a customer could act on. Leave the literal
   token `TBD` and flag it.
3. **Undecided is undecided.** `TBD` anywhere in this repo means no decision has
   been made. Ask; do not substitute a plausible default and build on it.
4. **Prices live in one place.** `BIKES` in `assets/js/data.js`. Never hardcode a
   rate into HTML. The one exception is the "from ₹899" marketing line in the hero,
   footer and meta description — if the cheapest vehicle changes, update those too.
5. **The WhatsApp number lives in one place.** `BUSINESS.whatsapp` in data.js.
   Links are built at runtime from `data-wa` attributes. Never write a `wa.me` URL
   directly into HTML.
6. **Images must carry a licence you can name.** Photos currently in use come
   from Wikimedia Commons under CC0 / CC BY / CC BY-SA. Never add an image found
   through a general image search or a manufacturer press kit.
   **Every image on this site is CC0 or public domain, and there is deliberately
   no attribution anywhere.** Do not add an image that requires credit — if a
   photo would need an attribution line, it does not go on this site. The owner
   removed the credits block for this reason.
7. **Never show a bike we do not rent.** A card's photo must be the actual model.
   Only the Meteor 350 and Himalayan have CC0 photographs; the other six use
   `photo: false`, which renders the inline illustration plus a "Photo on request"
   badge linking to WhatsApp. Do not substitute a lookalike to make the grid
   uniform, and do not use a NonCommercial or attribution-required image.
8. **Report honestly.** If something is untested, say so. Do not claim the site
   works unless you actually rendered it.
9. **Stay in scope.** No refactors, dependencies, or restructuring as a side
   effect of an unrelated task. Propose instead.

## Conventions

- 2-space indent, UTF-8, LF, newline at EOF.
- Vanilla JS in an IIFE with `'use strict'`. No globals beyond `BUSINESS`,
  `BIKES`, `CATEGORIES`.
- Any user-facing string built into HTML goes through `escapeHtml()`.
- Currency INR, displayed with `₹` and `toLocaleString('en-IN')`.
- **Never hardcode a colour in styles.css.** Every colour must be a semantic
  token (`--bg`, `--surface`, `--ink`, `--accent`, `--line`, `--deep`, …) so all
  six palettes keep working. A raw hex in a component rule is a bug: it will look
  correct in one palette and broken in the other five. The only exceptions are
  `#fff` on top of the fixed dark photo scrims (hero, destination cards, band).
- **There is deliberately no green in this design**, including on the WhatsApp
  buttons — the owner asked for it removed.
- Placeholder vehicle art is inlined as SVG by `main.js`, not loaded as a file,
  so it inherits `--accent`. Do not turn it back into an `<img>`.
- Palettes and finishes are chosen via `data-palette` / `data-finish` on `<html>`.
  Theme precedence is: saved localStorage choice > attribute in the HTML >
  `PICKER_DEFAULT` in theme.js.
- A new palette must be added in three places or it will half-work: the token
  block in themes.css, the `PALETTES` array in theme.js, and — if it is dark —
  every selector list in themes.css section 3.
- Card layout: `.price` carries `margin-top: auto` so buttons align across a grid
  row regardless of blurb length. Do not put `flex: 1` back on `.card__blurb`.
- English (en-IN) spelling: "licence" the noun, "tyre", "kerb".
- Every `<img>` needs a real `alt`, explicit `width`/`height`, and `loading="lazy"`
  below the fold — this protects the Core Web Vitals that SEO depends on.
- **Responsive floor is 280px** (Galaxy Fold folded). Any new grid must use
  `minmax(min(Npx, 100%), 1fr)`, never a bare `minmax(Npx, 1fr)`, or it will
  overflow there.
- **Tap targets: 44px minimum height** on anything clickable. Body and label text
  never below 12px. Re-run `scratchpad/resp.mjs` after layout changes — it drives
  real device emulation over CDP and must report 0 hard failures.

## SEO — do not regress these

- One `<h1>` per page. Heading order never skips a level.
- Every page keeps its `<title>`, meta description and `rel=canonical`.
- The JSON-LD block in index.html must stay valid JSON and must stay consistent
  with the visible page. If you change the FAQ text, change the FAQPage schema to
  match — mismatched schema is a manual-action risk, not just a lost snippet.
- Keep the page fast: no added fonts, no third-party scripts, no large images.
- If you add a page, add it to `sitemap.xml`.

## Working agreement

- Small, reviewable changes over rewrites.
- Ask when two readings of a request lead to materially different work.
- When you learn something the hard way, add one line here. This file grows by
  correction, not by up-front speculation.
