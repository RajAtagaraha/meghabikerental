# Decisions

Append-only log. Newest at the bottom. One entry per decision, dated.
Format: `## YYYY-MM-DD — <decision>` then Context / Decision / Consequences.

Record a decision here the moment it is made, especially when it closes a TBD in
CLAUDE.md or docs/PRD.md. If a decision is later reversed, add a new entry that
supersedes the old one — do not edit history.

## 2026-08-24 — Repo initialised with instruction files before any code

**Context.** New project, empty repo. Agents working in an empty repo tend to
invent structure and domain facts.

**Decision.** Write CLAUDE.md, docs/PRD.md, and this log first. Mark every
undecided thing as an explicit TBD rather than choosing a plausible default.

**Consequences.** Agents must ask rather than assume on anything marked TBD.
The instruction file is expected to grow by correction over time.

## 2026-08-24 — Stack deliberately not chosen

**Context.** Asked at project start; owner has not decided.

**Decision.** No framework, language, or hosting choice is made. Agents must not
presume one.

**Consequences.** No code can be written until this is resolved. When it is,
supersede this entry and update the Stack and Commands sections of CLAUDE.md.

## 2026-08-24 — Stack chosen: static HTML + CSS + vanilla JS

**Supersedes** the 2026-08-24 entry "Stack deliberately not chosen".

**Context.** The site is a brochure with WhatsApp CTAs, and will be handed to a
non-technical owner to run permanently. Requirements were: free hosting forever,
strong SEO, and the owner able to change prices without help.

**Decision.** Plain HTML, CSS and vanilla JS. No framework, no build step, no npm.
All editable content isolated into `assets/js/data.js`.

**Consequences.** Owner edits one file to change a price or the phone number. No
dependency rot, no build that breaks in two years. Costs us component reuse — the
header markup is duplicated across three HTML files, so a nav change means editing
three files. Accepted; at three pages this is cheaper than a build step.

## 2026-08-24 — Hosting: Cloudflare Pages

**Context.** Needed free, permanent hosting for a commercial site with a custom
domain.

**Decision.** Cloudflare Pages. GitHub Pages is the fallback.

**Why not Vercel.** Vercel's free Hobby tier prohibits commercial use. This is a
revenue-generating business site, so the free tier does not apply to it. Cloudflare
Pages and GitHub Pages both permit commercial use on their free tiers.

**Consequences.** Free bandwidth, free SSL, CDN presence in India. Deploys on git
push with no build step.

## 2026-08-24 — Enquiry by WhatsApp, not online booking

**Context.** Availability is tracked in the owner's head, not a system.

**Decision.** No booking engine. Every CTA opens WhatsApp with a pre-filled
message naming the vehicle and rate.

**Consequences.** Zero backend, so hosting stays free and nothing can go stale or
break. Cost: no availability shown on site, and every enquiry needs a human reply.
Revisit only if enquiry volume becomes unmanageable.

## 2026-08-24 — Placeholder vehicle images, not web-sourced photos

**Context.** Real vehicle photos were requested, to be sourced from the web.

**Decision.** Shipped original SVG placeholder illustrations instead.

**Why.** Manufacturer press images and photos found via image search are
copyrighted. Using them on a commercial site risks a takedown or an infringement
claim, and the owner carries that risk after handover.

**Consequences.** Site looks complete and consistent now, but generic. Replacing
these with photographs of the actual fleet is the single highest-impact visual
change available, and own photos also convert better than stock. See HANDOVER.md.

## 2026-08-24 — Palette changed from green to warm sand + terracotta

**Supersedes** the original green scheme.

**Context.** Owner asked for the green theme to be dropped.

**Decision.** Warm sand background (`#fbf7f1`) with a terracotta accent
(`#b4502f`) and warm near-black text. All colour lives in `:root` tokens in
`assets/css/styles.css`.

**Consequences.** Green was removed everywhere, **including from the WhatsApp
buttons**, which are now terracotta. This trades away the instant recognisability
of WhatsApp's brand green for palette consistency. If enquiry volume disappoints,
reverting just the CTA to `#25d366` is a one-token change and worth testing.

## 2026-08-24 — Photos sourced from Wikimedia Commons, verified by eye

**Supersedes** the 2026-08-24 entry "Placeholder vehicle images, not web-sourced
photos" for the five vehicles that now have photographs.

**Context.** Owner asked for real bike photos plus Shillong/Meghalaya imagery.
Stock sites carry generic motorcycles; Commons carries model-named files with
machine-readable licence metadata, which is what makes verification possible.

**Decision.** Use Commons photos under CC0 / CC BY / CC BY-SA, attributed in the
footer. Every candidate was opened and looked at before being accepted — the first
Classic 350 result was a sidecar outfit in front of a Madrid tour bus, and the
first Xpulse was a cluttered motor-show stand. Both were rejected and replaced.

**Only five of eight models had a verifiable photo.** Yamaha FZ-S 155, Yamaha
Ray ZR 125 and Hero Xtreme 125R have none on Commons, so they keep illustrations
and carry a visible "Illustration" badge rather than borrowing a lookalike.

**Consequences.** The grid is not visually uniform until the owner supplies
photos of the real fleet. That is the correct trade: a rental card showing a bike
the customer will not receive is a complaint waiting to happen. Attribution in the
footer is a licence condition and must survive future edits.

## 2026-08-24 — Theme picker added as a temporary preview tool

**Context.** Owner wanted to see palette options in place rather than judge them
from swatches, and asked for crystal, water and premium automotive treatments.

**Decision.** Six palettes and three surface finishes, selectable from a picker
in the top right. All colour was moved out of component rules into semantic
tokens (`--bg`, `--surface`, `--ink`, `--accent`, `--deep`, …) so a palette is
just a token override.

**Consequences.** Restyling is now a token edit rather than a rewrite, and the
same mechanism supports a dark mode later. Cost: component CSS may no longer
contain raw hex values — one hardcoded colour breaks five of six palettes.

**The picker must be deleted before handover** or customers can recolour the
site. Steps are in HANDOVER.md ("Pick a theme, then lock it in").

## 2026-08-24 — Placeholder vehicle art inlined rather than loaded as SVG files

**Context.** The three illustration placeholders were `.svg` files with a baked-in
light background. On the dark palettes they rendered as bright rectangles.

**Decision.** `main.js` now inlines the silhouette as SVG using `currentColor`,
so it takes the active palette's accent. The three `.svg` files were deleted.

**Consequences.** Illustrations work in every palette. The `image` field is still
read for vehicles with `photo: true`, so adding a real photograph later is still
just dropping in a file and flipping the flag.

## 2026-08-24 — Fuel policy confirmed

**Decision.** Each vehicle is handed over with half a litre to one litre of
petrol — enough to reach the nearest pump. All fuel used during the rental is at
the rider's cost, and fuel left in the tank at return is not refunded.

**Consequences.** Closes the fuel TBD on the homepage FAQ, in the requirements
panel, and in terms.html §4. A matching FAQPage schema entry was added so the
structured data still mirrors the visible page.

**Still open:** whether there is any expected fuel level at return. The policy as
stated implies none, but it has not been confirmed.

## 2026-08-24 — Second photo search for the three unmatched models: still nothing

**Context.** Owner flagged the missing photos for Yamaha FZ-S 155, Yamaha
Ray ZR 125 and Hero Xtreme 125R.

**Decision.** Keep the illustrations. Openverse carries FZ-S photos but only
under NonCommercial licences, which a paid rental site cannot use. Commons has
neither the Ray ZR 125 nor the Xtreme 125R; its nearest hits are different
machines (2007 CBZ Xtreme, Hunk 160R, FZ16, Fascino).

**Consequences.** These three require owner photography. To stop the gap being
dead weight, the placeholder badge became a WhatsApp link — "Photo on request →"
— that asks for photos of that specific bike, turning a missing asset into an
enquiry.

## 2026-08-24 — Theme options expanded to 12 palettes x 5 finishes

**Decision.** Added six palettes (Ivory & Ink, Steel & Electric, Espresso &
Cream, Burgundy & Brass, Gunmetal & Chrome, Dusk & Coral) and two finishes
(Metal, Vapour). All 60 combinations verified to render.

**Consequences.** More to choose from, and the dark-palette correction blocks in
themes.css now list eight selectors each. **Adding a further dark palette means
adding it to those lists**, or its photo backgrounds and spec chips will stay
light.

## 2026-08-24 — Helmet policy confirmed: two per bike, free

**Decision.** Two helmets are supplied with every vehicle at no charge — one for
the rider, one for the pillion. They remain the business's property and are
chargeable if lost or damaged.

**Consequences.** Closes the helmet TBD in the FAQ, the requirements panel and
terms.html §6. Because it is a concrete, verifiable promise and helmets are
legally mandatory for both riders in Meghalaya, it was promoted to the hero trust
list — replacing "Instant WhatsApp booking", which duplicated the CTA sitting
directly above it — and added to the meta description. A matching FAQPage schema
entry keeps structured data mirroring the page.

**Note:** the chargeable-if-lost clause in terms.html §6 is a standard rental
term, not something the owner stated. Confirm or remove it.

## 2026-08-24 — Guest communications email added, domain unverified

**Decision.** `meghabikerental@gail.com` was given as the guest communications
address and is wired in as `BUSINESS.email` in data.js. It surfaces in the
footer, terms.html §14, privacy.html §11, a new privacy.html §2b covering email
correspondence, and the LocalBusiness structured data — all reading the one value.

**The domain was NOT corrected.** `gail.com` reads as a typo for `gmail.com`, but
silently rewriting a contact address is not a call to make on the owner's behalf:
if the guess is wrong, enquiries go to a stranger. The literal value was used, a
warning comment sits above it in data.js, `main.js` logs a console warning while
the domain matches `@gail.com`, and HANDOVER.md §1b asks for a test message.

**Consequences.** If the address is wrong, every non-WhatsApp enquiry is lost
silently — email bounces are not always visible to the sender. This must be
tested before launch, not assumed.

## 2026-08-24 — Contact details set: +91 88558 53857, meghabikerental@gmail.com

**Decision.** Real WhatsApp number wired in, and the email domain corrected from
`gail.com` to `gmail.com` on the owner's explicit instruction — superseding the
earlier decision to leave the literal value untouched.

**Consequences.** All 16 WhatsApp buttons on the homepage, plus the `tel:` and
`mailto:` links on all three pages, now resolve to real destinations. The
placeholder-detection console warnings are gone: the `@gail.com` check was
deleted as resolved, and the `919XXXXXXXXX` check no longer fires. `telephone`
was added to the LocalBusiness structured data now that the number is real.

**No placeholder contact values remain in any site file** — verified by grep for
`9XXXX`, `919XXXXXXXXX`, `gail.com`, `TBD@` and `email@example`.
