const CDP = 'http://localhost:9222';

const DEVICES = [
  // name, w, h, dpr, mobile
  ['Galaxy Fold (folded)',   280,  653, 3,   true],
  ['iPhone SE (1st gen)',    320,  568, 2,   true],
  ['Android small / A-ser',  360,  640, 3,   true],
  ['iPhone SE 2/3',          375,  667, 2,   true],
  ['iPhone 12/13 mini',      375,  812, 3,   true],
  ['iPhone 14/15',           390,  844, 3,   true],
  ['Pixel 8',                393,  873, 2.6, true],
  ['Galaxy S23/A54',         412,  915, 3,   true],
  ['iPhone 11/XR',           414,  896, 2,   true],
  ['iPhone 15 Pro Max',      430,  932, 3,   true],
  ['Phone landscape',        844,  390, 3,   true],
  ['iPad mini portrait',     768, 1024, 2,   true],
  ['iPad Air portrait',      820, 1180, 2,   true],
  ['iPad landscape',        1024,  768, 2,   true],
  ['Laptop 1280',           1280,  800, 1,   false],
  ['Laptop 1440',           1440,  900, 2,   false],
  ['Desktop 1920',          1920, 1080, 1,   false],
  ['Desktop 2560',          2560, 1440, 2,   false],
];

const PAGES = ['index.html','terms.html','privacy.html','credits.html'];

async function rpc(ws, method, params={}, id={n:0}) {
  const msgId = ++id.n + Math.floor(Math.random()*1e6);
  return new Promise((res, rej) => {
    const onMsg = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === msgId) { ws.removeEventListener('message', onMsg); d.error ? rej(new Error(d.error.message)) : res(d.result); }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({id: msgId, method, params}));
  });
}

const CHECK = `(() => {
  const vw = document.documentElement.clientWidth;
  const out = { vw, scrollW: document.documentElement.scrollWidth, overflow: [], tiny: [], fail: [], advisory: [], img: [] };

  // elements crossing the right edge (ignore deliberately off-screen ones)
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed') return;
    if (el.closest('.tp')) return;
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if (r.left < -2) return;                       // .skip lives at -9999
    if (r.right > vw + 2) {
      out.overflow.push(el.tagName.toLowerCase() + '.' + (typeof el.className==='string'?el.className.split(' ')[0]:'') + ' right=' + Math.round(r.right));
    }
  });

  // tap targets: interactive things smaller than 44x44 (Apple HIG / Android 48dp)
  document.querySelectorAll('a, button, summary, input, [role=button]').forEach(el => {
    if (el.closest('.tp')) return;
    if (el.classList.contains('skip')) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (cs.display === 'inline' && el.closest('p, li, .credits, .hero__credit')) return; // inline text links
    const nm = (el.className||el.tagName).toString().split(' ')[0] + ' ' + Math.round(r.width) + 'x' + Math.round(r.height);
    if (r.height < 24 || r.width < 24) out.fail.push(nm);        // WCAG 2.5.8 AA breach
    else if (r.height < 44) out.advisory.push(nm);               // under Apple HIG 44pt
  });

  // body copy smaller than 12px is unreadable on a phone
  document.querySelectorAll('p, li, span, div, td, summary').forEach(el => {
    if (el.closest('.tp')) return;
    if (!el.textContent.trim()) return;
    if (el.children.length) return;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12) out.tiny.push(Math.round(fs*10)/10 + 'px ' + (el.className||el.tagName).toString().split(' ')[0]);
  });

  // images wider than their container
  document.querySelectorAll('img').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 2) out.img.push((el.getAttribute('src')||'').split('/').pop());
  });

  out.overflow = [...new Set(out.overflow)].slice(0,6);
  out.fail     = [...new Set(out.fail)].slice(0,6);
  out.advisory = [...new Set(out.advisory)].slice(0,6);
  out.tiny     = [...new Set(out.tiny)].slice(0,6);
  out.img      = [...new Set(out.img)].slice(0,4);
  return JSON.stringify(out);
})()`;

const targets = await (await fetch(CDP + '/json/list')).json();
let page = targets.find(t => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
await rpc(ws, 'Page.enable');
await rpc(ws, 'Runtime.enable');
await rpc(ws, 'Network.enable');
await rpc(ws, 'Network.setCacheDisabled', {cacheDisabled: true});

let problems = 0, rows = [];
for (const file of PAGES) {
  for (const [name, w, h, dpr, mobile] of DEVICES) {
    await rpc(ws, 'Emulation.setDeviceMetricsOverride', {width: w, height: h, deviceScaleFactor: dpr, mobile});
    await rpc(ws, 'Page.navigate', {url: `http://localhost:8000/${file}?cb=${Date.now()}${w}`});
    await new Promise(r => setTimeout(r, 850));
    const res = await rpc(ws, 'Runtime.evaluate', {expression: CHECK, returnByValue: true, awaitPromise: false});
    const o = JSON.parse(res.result.value);
    const hScroll = o.scrollW > o.vw + 1;
    const bad = hScroll || o.overflow.length || o.fail.length || o.tiny.length || o.img.length;
    if (bad) problems++;
    rows.push({file, name, w, h, hScroll, o});
  }
}
ws.close();

// report
const byPage = {};
rows.forEach(r => (byPage[r.file] = byPage[r.file] || []).push(r));
for (const [file, rs] of Object.entries(byPage)) {
  console.log('\n══ ' + file + ' ══');
  for (const r of rs) {
    const issues = [];
    if (r.hScroll) issues.push(`H-SCROLL (${r.o.scrollW}>${r.o.vw})`);
    if (r.o.overflow.length) issues.push('overflow: ' + r.o.overflow.join('; '));
    if (r.o.img.length) issues.push('img past edge: ' + r.o.img.join(','));
    if (r.o.fail.length) issues.push('WCAG tap FAIL: ' + r.o.fail.join('; '));
    if (r.o.tiny.length) issues.push('tiny text: ' + r.o.tiny.join('; '));
    const adv = r.o.advisory.length ? '  (advisory <44pt: ' + r.o.advisory.length + ')' : '';
    console.log(`  ${(r.name + ' ' + r.w + 'x' + r.h).padEnd(32)} ${issues.length ? '✗ ' + issues.join(' | ') : '✓ clean'}${adv}`);
  }
}
const advTotal = rows.reduce((a,r)=>a+r.o.advisory.length,0);
console.log(`\n${rows.length} viewport/page combinations tested`);
console.log(`  hard failures (h-scroll, overflow, WCAG 2.5.8 tap, <12px text): ${problems}`);
console.log(`  advisory notes (tap target between 24 and 44pt): ${advTotal}`);
