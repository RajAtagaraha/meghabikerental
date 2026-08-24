import { chromium, firefox, webkit, devices } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:8000';
const PAGES = ['index.html','terms.html','privacy.html'];

// real device descriptors ship with Playwright (correct UA, DPR, viewport, touch)
const PROFILES = [
  ['iPhone SE',        devices['iPhone SE']],
  ['iPhone 14 Pro',    devices['iPhone 14 Pro']],
  ['iPad (gen 7)',     devices['iPad (gen 7)']],
  ['iPad Pro 11 land', devices['iPad Pro 11 landscape']],
  ['Pixel 7',          devices['Pixel 7']],
  ['Galaxy S9+',       devices['Galaxy S9+']],
  ['Desktop 1440',     { viewport: {width:1440, height:900} }],
  ['Desktop 1920',     { viewport: {width:1920, height:1080} }],
];

const PROBE = `(() => {
  const de = document.documentElement;
  const r = {
    hScroll: de.scrollWidth > de.clientWidth + 1,
    scrollW: de.scrollWidth, vw: de.clientWidth,
    supportsColorMix: CSS.supports('color', 'color-mix(in srgb, red 50%, blue)'),
    supportsBackdrop: CSS.supports('backdrop-filter','blur(2px)') || CSS.supports('-webkit-backdrop-filter','blur(2px)'),
    overflow: [], transparentBg: [], jsErr: window.__err || null
  };
  document.querySelectorAll('body *').forEach(el => {
    if (el.closest('.tp')) return;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.display === 'none' || cs.visibility === 'hidden') return;
    const b = el.getBoundingClientRect();
    if (b.width === 0 && b.height === 0) return;
    if (b.left < -2) return;
    if (b.right > de.clientWidth + 2) r.overflow.push(el.tagName+'.'+(typeof el.className==='string'?el.className.split(' ')[0]:''));
  });
  // any card/panel that lost its background entirely (a color-mix fallback failure)
  document.querySelectorAll('.card, .panel, .steps li, .filter').forEach(el => {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') r.transparentBg.push(el.className.split(' ')[0]);
  });
  r.overflow = [...new Set(r.overflow)].slice(0,5);
  r.transparentBg = [...new Set(r.transparentBg)].slice(0,5);
  r.cards = document.querySelectorAll('#fleet-grid .card').length;
  r.places = document.querySelectorAll('#places-grid .place').length;
  r.waLinks = document.querySelectorAll('a[href^="https://wa.me/"]').length;
  const eb = document.querySelector('.hero .eyebrow');
  r.eyebrowColor = eb ? getComputedStyle(eb).color : 'n/a';
  return JSON.stringify(r);
})()`;

const engines = [['chromium',chromium],['webkit',webkit],['firefox',firefox]];
let fails = 0;

for (const [ename, engine] of engines) {
  const browser = await engine.launch();
  console.log('\n████ ' + ename.toUpperCase() + ' ████');
  for (const [pname, prof] of PROFILES) {
    // firefox has no touch/mobile emulation support
    const opts = ename === 'firefox'
      ? { viewport: prof.viewport || {width:390,height:844} }
      : { ...prof };
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type()==='error') errs.push(m.text()); });

    let line = [];
    for (const f of PAGES) {
      await page.goto(`${BASE}/${f}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      const o = JSON.parse(await page.evaluate(PROBE));
      const issues = [];
      if (o.hScroll) issues.push(`H-SCROLL ${o.scrollW}>${o.vw}`);
      if (o.overflow.length) issues.push('overflow:'+o.overflow.join(','));
      if (o.transparentBg.length) issues.push('lost-bg:'+o.transparentBg.join(','));
      if (f==='index.html' && o.cards !== 8) issues.push('cards='+o.cards);
      if (f==='index.html' && o.places !== 4) issues.push('places='+o.places);
      if (errs.length) issues.push('JS-ERR:'+errs[0].slice(0,50));
      if (issues.length) { fails++; line.push(f+' ✗ '+issues.join(' | ')); }
      if (f==='index.html') {
        line.push(`cm=${o.supportsColorMix?'y':'N'} bd=${o.supportsBackdrop?'y':'N'} eyebrow=${o.eyebrowColor} wa=${o.waLinks}`);
      }
    }
    console.log(`  ${pname.padEnd(17)} ${line.join('  ')}`);
    await ctx.close();
  }
  await browser.close();
}
console.log(`\n${engines.length} engines x ${PROFILES.length} profiles x ${PAGES.length} pages = ${engines.length*PROFILES.length*PAGES.length} runs`);
console.log(`failures: ${fails}`);
