/* ==========================================================================
   Megha Bike Rental — theme picker  [PREVIEW TOOL]
   --------------------------------------------------------------------------
   Lets you try palettes and finishes on the live site and pick one.
   The choice is remembered in this browser only — visitors always see the
   default set in PICKER_DEFAULT below.

   >>> REMOVE THIS BEFORE HANDING THE SITE TO THE CUSTOMER. <<<
   Steps are in docs/HANDOVER.md ("Locking in a theme").
   ========================================================================== */

(function () {
  'use strict';

  var PICKER_DEFAULT = { palette: 'sand', finish: 'matte' };

  var PALETTES = [
    { id: 'sand',     name: 'Sand & Terracotta',    note: 'Warm, light, earthy',        swatch: ['#fbf7f1', '#b4502f', '#2b211c'] },
    { id: 'ivory',    name: 'Ivory & Ink',          note: 'Light monochrome, editorial', swatch: ['#fafafa', '#16181a', '#5d6266'] },
    { id: 'glacier',  name: 'Glacier & Ice',        note: 'Cool, bright, crystalline',   swatch: ['#f4f9fc', '#0f6fa8', '#111d28'] },
    { id: 'steel',    name: 'Steel & Electric',     note: 'Cool grey, vivid blue',       swatch: ['#f6f8fa', '#1f5fe0', '#141a21'] },
    { id: 'obsidian', name: 'Obsidian & Copper',    note: 'Dark showroom metal',         swatch: ['#100d0b', '#c87137', '#f4efe9'] },
    { id: 'espresso', name: 'Espresso & Cream',     note: 'Dark warm leather',           swatch: ['#161009', '#d9a066', '#f5ece1'] },
    { id: 'midnight', name: 'Midnight & Champagne', note: 'Black and gold, luxury',      swatch: ['#0c0c0e', '#c9a961', '#f6f2e9'] },
    { id: 'burgundy', name: 'Burgundy & Brass',     note: 'Deep wine, warm metal',       swatch: ['#150a0d', '#c9a227', '#f6ebe9'] },
    { id: 'carbon',   name: 'Carbon & Racing Red',  note: 'Automotive, high contrast',   swatch: ['#0d0f11', '#d81f2a', '#f2f3f5'] },
    { id: 'gunmetal', name: 'Gunmetal & Chrome',    note: 'Dark monochrome, industrial', swatch: ['#101418', '#8fa3b8', '#eef1f4'] },
    { id: 'abyss',    name: 'Deep Water',           note: 'Dark blue, oceanic',          swatch: ['#08151f', '#2ea3d6', '#eaf4fb'] },
    { id: 'dusk',     name: 'Dusk & Coral',         note: 'Indigo night, warm coral',    swatch: ['#0f0d1c', '#f2694f', '#f0eefb'] }
  ];

  var FINISHES = [
    { id: 'matte',   name: 'Matte',   note: 'Solid surfaces, crisp edges' },
    { id: 'crystal', name: 'Crystal', note: 'Frosted glass, specular sheen' },
    { id: 'water',   name: 'Water',   note: 'Fluid tint, light drifts on hover' },
    { id: 'metal',   name: 'Metal',   note: 'Brushed panels, bevelled edge' },
    { id: 'vapour',  name: 'Vapour',  note: 'Soft diffused glow, no borders' }
  ];

  var KEY = 'mbr-theme';

  /* Precedence: this browser's saved choice > an attribute already on <html>
     (that is how a theme gets "locked in" at handover) > PICKER_DEFAULT. */
  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && v.palette && v.finish) return v;
    } catch (e) { /* private mode, blocked storage — fall through */ }

    var r = document.documentElement;
    return {
      palette: r.getAttribute('data-palette') || PICKER_DEFAULT.palette,
      finish:  r.getAttribute('data-finish')  || PICKER_DEFAULT.finish
    };
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function apply(state) {
    var r = document.documentElement;
    r.setAttribute('data-palette', state.palette);
    r.setAttribute('data-finish', state.finish);
  }

  var state = load();
  apply(state);   // applied immediately, before paint, to avoid a flash

  function build() {
    var el = document.createElement('div');
    el.className = 'tp';
    el.innerHTML =
      '<button class="tp__toggle" type="button" aria-expanded="false"'
      + ' aria-controls="tp-panel" title="Try a different look">'
      +   '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
      +     ' stroke-width="2" stroke-linecap="round" aria-hidden="true">'
      +     '<circle cx="12" cy="12" r="3.2"/>'
      +     '<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>'
      +   '</svg>'
      +   '<span>Theme</span>'
      + '</button>'
      + '<div class="tp__panel" id="tp-panel" hidden>'
      +   '<div class="tp__head">'
      +     '<strong>Try a look</strong>'
      +     '<span>Preview only — visitors see the default</span>'
      +   '</div>'
      +   '<div class="tp__group"><h5>Palette</h5><div class="tp__opts" id="tp-pal"></div></div>'
      +   '<div class="tp__group"><h5>Finish</h5><div class="tp__opts" id="tp-fin"></div></div>'
      +   '<p class="tp__cur" id="tp-cur"></p>'
      + '</div>';
    document.body.appendChild(el);

    var pal = el.querySelector('#tp-pal');
    var fin = el.querySelector('#tp-fin');
    var cur = el.querySelector('#tp-cur');

    pal.innerHTML = PALETTES.map(function (p) {
      return '<button type="button" class="tp__opt" data-pal="' + p.id + '">'
        + '<span class="tp__sw">'
        +   p.swatch.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('')
        + '</span>'
        + '<span class="tp__txt"><b>' + p.name + '</b><em>' + p.note + '</em></span>'
        + '</button>';
    }).join('');

    fin.innerHTML = FINISHES.map(function (f) {
      return '<button type="button" class="tp__opt" data-fin="' + f.id + '">'
        + '<span class="tp__txt"><b>' + f.name + '</b><em>' + f.note + '</em></span>'
        + '</button>';
    }).join('');

    function sync() {
      el.querySelectorAll('[data-pal]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.pal === state.palette));
      });
      el.querySelectorAll('[data-fin]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.fin === state.finish));
      });
      cur.textContent = 'data-palette="' + state.palette + '"  data-finish="' + state.finish + '"';
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-pal],[data-fin],.tp__toggle');
      if (!t) return;

      if (t.classList.contains('tp__toggle')) {
        var panel = el.querySelector('.tp__panel');
        var open = panel.hidden;
        panel.hidden = !open;
        t.setAttribute('aria-expanded', String(open));
        return;
      }
      if (t.dataset.pal) state.palette = t.dataset.pal;
      if (t.dataset.fin) state.finish = t.dataset.fin;
      apply(state); save(state); sync();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        el.querySelector('.tp__panel').hidden = true;
        el.querySelector('.tp__toggle').setAttribute('aria-expanded', 'false');
      }
    });

    sync();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
