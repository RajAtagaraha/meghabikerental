/* ==========================================================================
   Megha Bike Rental — site data
   --------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT FOR DAY-TO-DAY CHANGES.
   Prices, phone number, and the vehicle list all live here.
   Edit, save, upload. No build step, no tools required.
   ========================================================================== */

/* --- 1. BUSINESS DETAILS ------------------------------------------------ */

const BUSINESS = {
  name: 'Megha Bike Rental',
  domain: 'https://www.meghabikerental.com',

  /* WhatsApp number in international format: country code + number,
     digits only, no +, no spaces, no dashes. */
  whatsapp: '918855853857',

  /* Shown to customers. Can include formatting. */
  phoneDisplay: '+91 88558 53857',

  /* Guest communications address. */
  email: 'meghabikerental@gmail.com',

  /* Service area. Change if you operate from a different town. */
  city: 'Shillong',
  state: 'Meghalaya',

  /* Full street address — leave as null to hide the address block entirely.
     Fill it in when confirmed; it improves local search ranking a lot. */
  address: null,

  /* Opening hours, shown on site and given to Google. 24h format. */
  hours: { open: '08:00', close: '20:00' },
};

/* --- 2. VEHICLE FLEET --------------------------------------------------- */
/*
   price       — rupees per day (24 hours)
   category    — 'cruiser' | 'adventure' | 'street' | 'scooter'
                 (drives the filter buttons; use only these four)
   image       — file inside assets/images/bikes/
   photo       — true if this is a real photograph of the model; false if it is
                 still a placeholder illustration awaiting your own photo
   available   — set to false to grey out a bike without deleting it
   specs       — short facts shown on the card. Keep to 3.
*/

const BIKES = [
  {
    id: 'royal-enfield-classic-350',
    name: 'Royal Enfield Classic 350',
    category: 'cruiser',
    price: 1399,
    image: 'royal-enfield-classic-350.jpg',
    photo: true,
    available: true,
    specs: { engine: '349 cc', mileage: '35 kmpl', gears: '5-speed' },
    blurb: 'The classic Meghalaya road-trip machine. Relaxed, torquey and built for long hill days.',
  },
  {
    id: 'royal-enfield-meteor-350',
    name: 'Royal Enfield Meteor 350',
    category: 'cruiser',
    price: 1399,
    image: 'royal-enfield-meteor-350.jpg',
    photo: true,
    available: true,
    specs: { engine: '349 cc', mileage: '35 kmpl', gears: '5-speed' },
    blurb: 'Easy cruiser with a low seat and smooth engine. The most comfortable pillion ride in the fleet.',
  },
  {
    id: 'royal-enfield-himalayan',
    name: 'Royal Enfield Himalayan',
    category: 'adventure',
    price: 1599,
    image: 'royal-enfield-himalayan.jpg',
    photo: true,
    available: true,
    specs: { engine: '411 cc', mileage: '30 kmpl', gears: '5-speed' },
    blurb: 'Long-travel suspension and real ground clearance. The one to take on broken roads to Dawki or Mawlynnong.',
  },
  {
    id: 'yamaha-fz-s-155',
    name: 'Yamaha FZ-S 155',
    category: 'street',
    price: 1199,
    image: 'yamaha-fz-s-155.svg',
    photo: false,
    available: true,
    specs: { engine: '155 cc', mileage: '45 kmpl', gears: '5-speed' },
    blurb: 'Light, quick and easy to flick through Shillong traffic. A good first big-bike choice.',
  },
  {
    id: 'yamaha-ray-zr-125',
    name: 'Yamaha Ray ZR 125',
    category: 'scooter',
    price: 899,
    image: 'yamaha-ray-zr-125.svg',
    photo: false,
    available: true,
    specs: { engine: '125 cc', mileage: '50 kmpl', gears: 'Automatic' },
    blurb: 'Automatic, feather-light and no gears to think about. Ideal for short city runs.',
  },
  {
    id: 'tvs-ntorq-125',
    name: 'TVS NTorq 125',
    category: 'scooter',
    price: 899,
    image: 'tvs-ntorq-125.jpg',
    photo: true,
    available: true,
    specs: { engine: '125 cc', mileage: '48 kmpl', gears: 'Automatic' },
    blurb: 'The sporty scooter. Peppy pull on Shillong inclines and a usefully big under-seat boot.',
  },
  {
    id: 'hero-xtreme-125r',
    name: 'Hero Xtreme 125R',
    category: 'street',
    price: 999,
    image: 'hero-xtreme-125r.svg',
    photo: false,
    available: true,
    specs: { engine: '125 cc', mileage: '55 kmpl', gears: '5-speed' },
    blurb: 'The most fuel-efficient geared bike we rent. Best value for a full day of sightseeing.',
  },
  {
    id: 'hero-xpulse-200',
    name: 'Hero Xpulse 200',
    category: 'adventure',
    price: 1299,
    image: 'hero-xpulse-200.jpg',
    photo: true,
    available: true,
    specs: { engine: '199 cc', mileage: '40 kmpl', gears: '5-speed' },
    blurb: 'Proper dual-sport with 21-inch front wheel. Handles trails and village roads other bikes cannot.',
  },
];

/* --- 3. FILTER LABELS --------------------------------------------------- */

const CATEGORIES = [
  { id: 'all',       label: 'All vehicles' },
  { id: 'cruiser',   label: 'Cruisers' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'street',    label: 'Street' },
  { id: 'scooter',   label: 'Scooters' },
];

/* --- 4. DESTINATIONS ----------------------------------------------------- */
/* Places customers ride to. Purely for the gallery section and for SEO —
   these are search terms tourists actually type. */

const PLACES = [
  {
    name: 'Dawki & the Umngot river',
    image: 'umngot-river-dawki.jpg',
    distance: '82 km from Shillong',
    blurb: 'Water so clear the boats look like they float on air. A long, rewarding day ride.',
  },
  {
    name: 'Nohkalikai Falls',
    image: 'nohkalikai-falls.jpg',
    distance: '54 km from Shillong',
    blurb: "India's tallest plunge waterfall, dropping into a green pool below Cherrapunji.",
  },
  {
    name: 'Living root bridges',
    image: 'living-root-bridge.jpg',
    distance: '60 km from Shillong',
    blurb: 'Bridges grown, not built, from the roots of rubber fig trees over Khasi hill streams.',
  },
  {
    name: 'Shillong & the Khasi hills',
    image: 'shillong-city.jpg',
    distance: 'Start here',
    blurb: 'Pine ridges, viewpoints and market lanes. The easiest first ride to get used to the bike.',
  },
];
