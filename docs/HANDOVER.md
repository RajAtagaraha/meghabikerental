# Handover & Launch Guide — Megha Bike Rental

Everything needed to take this site live and hand it to the owner.

---

## Part 1 — Before launch (blocking)

### 1. Contact details — set, but test them

Both are live in `assets/js/data.js`:

```js
whatsapp:     '918855853857',
phoneDisplay: '+91 88558 53857',
email:        'meghabikerental@gmail.com',
```

The WhatsApp number drives all 16 buttons on the homepage; the email appears in
the footer, terms.html, privacy.html and the structured data. Every one reads
these three values, so changing them here changes them everywhere.

**Before launch, actually test both:**

- Open the site on a phone and tap a "Check availability" button. WhatsApp should
  open a chat to +91 88558 53857 with the vehicle name and rate pre-filled. Send
  it and confirm it arrives.
- Send a test email to `meghabikerental@gmail.com` and confirm it arrives.
  (This was originally given as `gail.com`; it was corrected to `gmail.com` on
  the owner's instruction. If mail does not arrive, that is the first thing to
  re-check.)

### 2. Photograph your fleet (highest-impact remaining task)

Only two vehicles have photographs — **Royal Enfield Meteor 350** and
**Royal Enfield Himalayan**. Both are CC0, so no credit is needed.

The other six show a themed illustration with a **"Photo on request"** badge that
opens WhatsApp asking for photos of that bike:

Classic 350 · Yamaha FZ-S 155 · Yamaha Ray ZR 125 · TVS NTorq 125 ·
Hero Xtreme 125R · Hero Xpulse 200

Licensed photographs of the Classic 350, NTorq 125 and Xpulse 200 do exist, but
they require attribution, and photos of the FZ-S 155, Ray ZR 125 and
Xtreme 125R do not exist under any commercial-friendly licence at all. Rather
than carry a credits block, the decision was to show no photo.

**So: photograph your own bikes.** It is the single biggest visual improvement
left, and renters convert better on seeing the actual vehicle anyway.

- Landscape, 4:3, at least 1200x900
- Three-quarter angle, plain background, daylight
- Save as `.jpg`, compress below 200 KB (squoosh.app is free)
- Name it exactly as the `image` field in `data.js` (e.g. `tvs-ntorq-125.jpg`)
- Flip that vehicle's `photo: false` to `photo: true`

That is the whole process — the badge disappears and the photo appears.

**Never add an image that requires attribution.** Every image on the site is
currently CC0 or public domain and the site carries no credits. Do not use
Google Images results, manufacturer press kits, or anything licensed
`by`, `by-sa`, `by-nc` or `by-nd`.

### 2b. Pick a theme, then lock it in

The site ships with a **theme picker** — the "Theme" button below the header on
every page. Open it and try the six palettes and three finishes. Your choice is
saved in your own browser only; visitors always see the default.

**12 palettes** — Sand & Terracotta · Ivory & Ink · Glacier & Ice ·
Steel & Electric · Obsidian & Copper · Espresso & Cream ·
Midnight & Champagne · Burgundy & Brass · Carbon & Racing Red ·
Gunmetal & Chrome · Deep Water · Dusk & Coral.

**5 finishes** — Matte (solid surfaces) · Crystal (frosted glass, specular
sheen) · Water (fluid tint, light drifts across a card on hover) · Metal
(brushed panels, bevelled top edge) · Vapour (soft diffused glow, no borders).

That is 60 combinations. All 60 are verified to render.

The panel prints the exact combination at the bottom, e.g.
`data-palette="obsidian"  data-finish="crystal"`.

**Locking it in — three steps:**

1. In `assets/js/theme.js`, set `PICKER_DEFAULT` to your chosen combination.
   Test in a private window: with no saved choice, that is what loads.
2. Add the attributes to the `<html>` tag of `index.html`, `terms.html` and
   `privacy.html` so the theme is correct even before JavaScript runs:
   `<html lang="en-IN" data-palette="obsidian" data-finish="crystal">`
3. **Delete the picker before handover.** Remove `assets/js/theme.js`, its
   `<script>` tag and the no-flash inline snippet from all three pages, and
   delete section 4 ("Theme picker") from `assets/css/themes.css`. Keep
   `themes.css` itself — it holds the palette your site now uses.

Leaving the picker live means customers can recolour your website, so do not
skip step 3.

### 3. Fill in the TBD items

Search the project for `TBD`:

```
grep -rn "TBD" . --include=*.html --include=*.js --include=*.md
```

Visible to customers, so these must be resolved before launch:

- Hotel pickup and drop charge — `index.html`, hotel pickup panel + FAQ
- Security deposit amount — `index.html` panel, `terms.html` section 2
- Fuel policy — `index.html` FAQ, `terms.html` section 4
- Helmets included or not — `index.html` panel, `terms.html` section 6
- Riding outside Meghalaya — `index.html` FAQ, `terms.html` section 7
- Cancellation policy — `index.html` FAQ, `terms.html` section 10
- Minimum rider age, late return charge, damage liability — `terms.html`

Remove the amber "Draft" notice boxes from `terms.html` and `privacy.html` once
their contents are final.

### 4. Have the legal pages reviewed

`terms.html` and `privacy.html` are drafts written as a starting point, not legal
advice. Have a lawyer read them before relying on them — particularly the damage
liability, deposit and limitation of liability clauses.

---

## Part 2 — Deploying to Cloudflare Pages (free)

### Step 1 — Put the code on GitHub

```
git init
git add .
git commit -m "Megha Bike Rental website"
gh repo create meghabikerental --private --source=. --push
```

### Step 2 — Connect Cloudflare Pages

1. Sign up free at https://dash.cloudflare.com
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Authorise GitHub, pick the `meghabikerental` repo
4. Build settings — leave everything empty:
   - Framework preset: **None**
   - Build command: **(blank)**
   - Build output directory: **/**
5. **Save and Deploy**

You get a live `*.pages.dev` URL in under a minute.

### Step 3 — Point the domain

1. In Cloudflare, **Add a site** → `meghabikerental.com`, pick the **Free** plan
2. Cloudflare shows two nameservers. Set these at your domain registrar,
   replacing the existing ones. Propagation takes 1–24 hours.
3. Back in your Pages project → **Custom domains** → add `www.meghabikerental.com`
4. Add `meghabikerental.com` too, and set it to redirect to the `www` version so
   you do not split SEO ranking across two addresses.

SSL is issued automatically and free. Nothing to configure.

**After every content change:** `git add . && git commit -m "..." && git push`.
Cloudflare redeploys automatically in under a minute.

### Fallback — GitHub Pages

If Cloudflare is not an option: repo **Settings → Pages → Deploy from branch →
main / (root)**, then add a file named `CNAME` at the project root containing
`www.meghabikerental.com`, and point a CNAME DNS record at
`<username>.github.io`. Also free, also fine for commercial use, marginally slower
in India.

---

## Part 3 — After launch (SEO)

Do these in order. The first two matter more than everything else on this page.

1. **Create a Google Business Profile** at https://business.google.com.
   For "bike rental in Shillong" searches, the map listing outranks websites.
   This is the single highest-return action available. Add real photos, hours,
   the phone number, and the website link. Ask every happy customer for a review.

2. **Submit to Google Search Console** at https://search.google.com/search-console.
   Verify ownership via the DNS TXT record Cloudflare makes easy, then submit
   `https://www.meghabikerental.com/sitemap.xml`. Indexing takes days to weeks.

3. **Add a real business address** to `data.js` and to the JSON-LD in
   `index.html` if there is a physical shopfront. Local SEO leans heavily on it.

4. **Validate the structured data** at https://validator.schema.org — paste the
   live URL. It should report LocalBusiness and FAQPage with no errors.

5. **Check the page speed** at https://pagespeed.web.dev. A static site this size
   should score 95+ on mobile. If it drops, the cause is almost always a large
   unoptimised image.

6. **Write destination content later.** Pages like "Shillong to Dawki by bike" or
   "Best rides around Cherrapunji" are what actually pull in tourist search
   traffic. Each new page needs adding to `sitemap.xml`.

---

## Part 4 — Everyday edits for the owner

Everything routine lives in **one file**: `assets/js/data.js`.

**Change a price** — find the vehicle, edit `price: 1399`. Numbers only, no `₹`,
no commas.

**Mark a bike as rented out** — change `available: true` to `available: false`.
The card greys out and its button is disabled. Set it back when returned.

**Add a vehicle** — copy an existing block, change every field, add the image to
`assets/images/bikes/`. `category` must be one of `cruiser`, `adventure`,
`street`, `scooter`.

**Remove a vehicle** — delete its block, including the closing `},`.

**Change the phone number** — edit `whatsapp` and `phoneDisplay` at the top.

After any edit: `git add . && git commit -m "update prices" && git push`.
Live in about a minute.

> If the cheapest vehicle changes, the "from ₹899" line also appears in the hero
> text, the footer, and the meta description in `index.html`. Update those too.

### If something breaks

The most common cause is a missing comma or quote in `data.js`, which makes the
fleet grid render empty. Check the browser console (F12) for a red error naming
the line. `git revert` undoes the last change if needed.
