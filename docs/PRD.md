# Megha Bike Rental — Product Spec

Last updated 2026-08-24. Status: **MVP built, pre-launch.**

`TBD` below means a real gap. Agents: do not guess these. Ask the owner.

## Product

Static marketing website for a bike and scooter rental business in Shillong,
Meghalaya. Customers browse the fleet and enquire on WhatsApp. Deliberately **not**
an online booking system — no availability calendar, no payments, no accounts.

Domain: https://www.meghabikerental.com

## Users

- **Renter** — tourist or local wanting a two-wheeler for a day to a week. Mobile,
  often on patchy connectivity, frequently already in Shillong at a hotel.
- **Owner/operator** — receives enquiries on WhatsApp and manages everything else
  offline. No admin interface exists or is planned for MVP.

## MVP scope — built

- Homepage with hero, fleet grid, how-it-works, hotel pickup, enquiry form, FAQ
- Enquiry form that composes a WhatsApp message client-side (no backend)
- 8 vehicles as cards, filterable by category
- WhatsApp CTA on every card, pre-filled with the vehicle name and price
- Floating WhatsApp button, persistent
- Terms & Conditions page
- Privacy Policy page
- SEO: meta tags, Open Graph, canonical, LocalBusiness + FAQPage JSON-LD,
  sitemap.xml, robots.txt
- Mobile-first responsive layout, verified at 390px

## Out of scope for MVP

- Online booking, availability calendar, payments
- Customer accounts or login
- Admin/ops dashboard
- Multi-language
- Blog or destination guides (worth adding later purely for SEO)

## Fleet and pricing — confirmed by owner 2026-08-24

All rates per day (24 hours), INR.

| Vehicle | Category | Rate |
|---|---|---|
| Royal Enfield Classic 350 | cruiser | 1399 |
| Royal Enfield Meteor 350 | cruiser | 1399 |
| Royal Enfield Himalayan | adventure | 1599 |
| Yamaha FZ-S 155 | street | 1199 |
| Yamaha Ray ZR 125 | scooter | 899 |
| TVS NTorq 125 | scooter | 899 |
| Hero Xtreme 125R | street | 999 |
| Hero Xpulse 200 | adventure | 1299 |

Source of truth is `BIKES` in `assets/js/data.js`, not this table.

**Photography.** Only the Meteor 350 and Himalayan have photographs (both CC0).
The other six vehicles show illustrations with a "Photo on request" WhatsApp
badge. The site carries no photo attribution and no image requiring it may be
added. Owner photography is pending.

**Naming note.** The owner's original list read "Yamaha HSR 155", "TVS Ntorg 125",
"Hero Xtrene 125". These were read as FZ-S 155, NTorq 125 and Xtreme 125R.
The FZ-S 155 reading is **unconfirmed** — it may be an Aerox 155 or R15. Verify.

## Service model — confirmed

- Enquiry and booking happen over WhatsApp, not on the site.
- Hotel pickup and drop is offered, **with a charge that varies by distance**.
- **WhatsApp / phone: +91 88558 53857.** Confirmed by owner 2026-08-24.
- **Guest communications email: meghabikerental@gmail.com.** Given as
  `gail.com`, corrected to `gmail.com` on the owner's instruction 2026-08-24.
- **Helmets: two provided with every bike**, free of charge — one rider, one
  pillion. They remain the business's property and are chargeable if lost or
  damaged. Confirmed by owner 2026-08-24.
- **Fuel: the bike is handed over with ½–1 litre of petrol**, enough to reach a
  pump. All fuel used during the rental is at the rider's cost; unused fuel is not
  refunded. Confirmed by owner 2026-08-24.

## Domain facts still TBD — blocking a clean launch

- Hotel pickup/drop charge
- Security deposit amount, and refund timeline
- Minimum and maximum rental duration
- Late return charge and grace period
- Cancellation and no-show policy
- Whether the vehicle may leave Meghalaya
- Rider minimum age
- Damage liability tiers
- Payment method (advance, on pickup, cash, UPI)
- Business street address — omitted for now; adding it materially improves local
  search ranking, so get it if a physical shopfront exists
- Operating hours (currently assumed 08:00–20:00 daily in the JSON-LD)

Every one of these appears as a visible `TBD` on the site or in terms.html.

## Open questions

- Is there a physical shopfront customers can walk into, or is it delivery-only?
- Is Shillong the only service area, or also Guwahati / Cherrapunji?
- Should a Google Business Profile be created? It usually outperforms the website
  itself for "bike rental near me" searches.
