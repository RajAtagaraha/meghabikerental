/* ==========================================================================
   Megha Bike Rental — behaviour
   Renders the vehicle grid, handles filtering, and builds WhatsApp links.
   Depends on data.js being loaded first.
   ========================================================================== */

(function () {
  'use strict';

  /* --- WhatsApp link builder -------------------------------------------- */

  function waLink(message) {
    return 'https://wa.me/' + BUSINESS.whatsapp + '?text=' + encodeURIComponent(message);
  }

  function bikeEnquiry(bike) {
    return 'Hi ' + BUSINESS.name + ', I would like to check availability for the '
      + bike.name + ' (Rs ' + bike.price + '/day).\n\nPickup date: \nReturn date: \nName: ';
  }

  function photoRequest(bike) {
    return 'Hi ' + BUSINESS.name + ', could you send me photos of the '
      + bike.name + ' before I book?';
  }

  const GENERAL_ENQUIRY = 'Hi ' + BUSINESS.name
    + ', I would like to check bike availability.\n\nPickup date: \nReturn date: \nVehicle: ';

  /* Wire up every element that carries data-wa, so the number lives in one place. */
  function wireStaticLinks() {
    document.querySelectorAll('[data-wa]').forEach(function (el) {
      const custom = el.getAttribute('data-wa');
      el.href = waLink(custom && custom.length ? custom : GENERAL_ENQUIRY);
      el.rel = 'noopener';
      el.target = '_blank';
    });

    document.querySelectorAll('[data-phone]').forEach(function (el) {
      el.textContent = BUSINESS.phoneDisplay;
      if (el.tagName === 'A') el.href = 'tel:+' + BUSINESS.whatsapp;
    });

    document.querySelectorAll('[data-email]').forEach(function (el) {
      el.textContent = BUSINESS.email;
      if (el.tagName === 'A') el.href = 'mailto:' + BUSINESS.email;
    });

    document.querySelectorAll('[data-city]').forEach(function (el) {
      el.textContent = BUSINESS.city;
    });

    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* --- icons ------------------------------------------------------------- */

  const ICON_WA = '<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
    + '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg>';

  const ICON_CHECK = '<svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10.5l4 4 8-9"/></svg>';


  /* Inline placeholder art for vehicles without a verified photo.
     Inline (not <img>) so it picks up the active palette via currentColor. */

  var ART_BIKE = '<svg viewBox="0 0 400 300" fill="currentColor" aria-hidden="true">'
    + '<path d="M100 186c-25 0-45 20-45 45s20 45 45 45 45-20 45-45-20-45-45-45zm0 22c13 0 23 10 23 23s-10 23-23 23-23-10-23-23 10-23 23-23z"/>'
    + '<path d="M304 186c-25 0-45 20-45 45s20 45 45 45 45-20 45-45-20-45-45-45zm0 22c13 0 23 10 23 23s-10 23-23 23-23-10-23-23 10-23 23-23z"/>'
    + '<path d="M266 132c-6 0-10 4-11 9l-3 16h-58c-8 0-15 4-19 11l-19 34-46 18c-6 2-9 9-6 15 2 6 9 8 15 6l52-20c3-2 6-4 7-7l19-33h49l-9 44-34 22c-5 3-7 10-4 15 3 6 10 7 15 4l39-25c3-2 5-5 6-9l17-84h13c6 0 11-5 11-11s-5-11-11-11h-23z"/>'
    + '<path d="M148 168h64c6 0 11 5 11 11s-5 11-11 11h-64c-6 0-11-5-11-11s5-11 11-11z"/>'
    + '</svg>';

  var ART_SCOOTER = '<svg viewBox="0 0 400 300" fill="currentColor" aria-hidden="true">'
    + '<path d="M104 196c-19 0-34 15-34 34s15 34 34 34 34-15 34-34-15-34-34-34zm0 20c8 0 14 6 14 14s-6 14-14 14-14-6-14-14 6-14 14-14z"/>'
    + '<path d="M300 196c-19 0-34 15-34 34s15 34 34 34 34-15 34-34-15-34-34-34zm0 20c8 0 14 6 14 14s-6 14-14 14-14-6-14-14 6-14 14-14z"/>'
    + '<path d="M262 128h-46c-9 0-16 6-18 15l-14 62h-40c-6 0-11 5-11 11s5 11 11 11h56c6 0 10-4 11-9l14-63h30l24 66c2 5 6 8 11 8h14c6 0 11-5 11-11s-5-11-11-11h-6l-24-67c-2-7-8-12-12-12z"/>'
    + '<path d="M196 118h56c6 0 11 5 11 11s-5 11-11 11h-56c-6 0-11-5-11-11s5-11 11-11z"/>'
    + '</svg>';

  /* --- card rendering ---------------------------------------------------- */

  function specChips(specs) {
    return Object.keys(specs).map(function (k) {
      return '<li>' + escapeHtml(specs[k]) + '</li>';
    }).join('');
  }

  function cardHtml(bike) {
    const out = !bike.available;
    const catLabel = (CATEGORIES.find(function (c) { return c.id === bike.category; }) || {}).label || bike.category;

    return ''
      + '<article class="card' + (out ? ' card--out' : '') + '" data-category="' + escapeHtml(bike.category) + '">'
      +   '<div class="card__media">'
      +     (bike.photo
            ? '<img src="assets/images/bikes/' + escapeHtml(bike.image) + '"'
              + ' alt="' + escapeHtml(bike.name) + ' available for rent in '
              + escapeHtml(BUSINESS.city) + '"'
              + ' width="400" height="300" loading="lazy" decoding="async">'
            : '<div class="card__illus" role="img" aria-label="' + escapeHtml(bike.name)
              + ' \u2014 illustration; ask us for photographs">'
              + (bike.category === 'scooter' ? ART_SCOOTER : ART_BIKE)
              + '</div>')
      +     '<span class="card__tag' + (out ? ' card__tag--out' : '') + '">'
      +       (out ? 'On rent' : escapeHtml(catLabel.replace(/s$/, '')))
      +     '</span>'
      +     (bike.photo ? ''
            : '<a class="card__note" href="' + waLink(photoRequest(bike)) + '"'
              + ' target="_blank" rel="noopener"'
              + ' title="Ask us for photographs of this bike">Photo on request &rarr;</a>')
      +   '</div>'
      +   '<div class="card__body">'
      +     '<h3>' + escapeHtml(bike.name) + '</h3>'
      +     '<p class="card__blurb">' + escapeHtml(bike.blurb) + '</p>'
      +     '<ul class="specs">' + specChips(bike.specs) + '</ul>'
      +     '<p class="price">'
      +       '<span class="price__amt">₹' + bike.price.toLocaleString('en-IN') + '</span>'
      +       '<span class="price__unit">per day</span>'
      +     '</p>'
      +     (out
            ? '<span class="btn btn--ghost btn--block" aria-disabled="true">Currently on rent</span>'
            : '<a class="btn btn--wa btn--block" href="' + waLink(bikeEnquiry(bike)) + '"'
              + ' target="_blank" rel="noopener">' + ICON_WA + 'Check availability</a>')

      +   '</div>'
      + '</article>';
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* --- filtering --------------------------------------------------------- */

  function renderFilters(container, onPick) {
    container.innerHTML = CATEGORIES.map(function (c, i) {
      return '<button type="button" class="filter" data-filter="' + c.id + '"'
        + ' aria-pressed="' + (i === 0 ? 'true' : 'false') + '">'
        + escapeHtml(c.label) + '</button>';
    }).join('');

    container.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter');
      if (!btn) return;
      container.querySelectorAll('.filter').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      onPick(btn.dataset.filter);
    });
  }

  function applyFilter(grid, category) {
    let shown = 0;
    grid.querySelectorAll('.card').forEach(function (card) {
      const match = category === 'all' || card.dataset.category === category;
      card.hidden = !match;
      if (match) shown++;
    });
    const status = document.getElementById('fleet-status');
    if (status) {
      status.textContent = shown + (shown === 1 ? ' vehicle' : ' vehicles') + ' shown';
    }
  }

  /* --- trust list icons -------------------------------------------------- */

  function decorateTrust() {
    document.querySelectorAll('.trust li, .panel li').forEach(function (li) {
      if (!li.querySelector('svg')) li.insertAdjacentHTML('afterbegin', ICON_CHECK);
    });
    document.querySelectorAll('.btn--wa, .fab').forEach(function (el) {
      if (!el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', ICON_WA);
    });
  }

  /* --- destinations ------------------------------------------------------ */

  function placeHtml(place) {
    return ''
      + '<li class="place">'
      +   '<img src="assets/images/places/' + escapeHtml(place.image) + '"'
      +     ' alt="' + escapeHtml(place.name) + ', Meghalaya"'
      +     ' width="900" height="600" loading="lazy" decoding="async">'
      +   '<div class="place__body">'
      +     '<span class="place__dist">' + escapeHtml(place.distance) + '</span>'
      +     '<h3>' + escapeHtml(place.name) + '</h3>'
      +     '<p>' + escapeHtml(place.blurb) + '</p>'
      +   '</div>'
      + '</li>';
  }

  /* --- boot -------------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('fleet-grid');

    if (grid) {
      grid.innerHTML = BIKES.map(cardHtml).join('');
      const filterBar = document.getElementById('fleet-filters');
      if (filterBar) {
        renderFilters(filterBar, function (cat) { applyFilter(grid, cat); });
      }
      applyFilter(grid, 'all');
    }

    const places = document.getElementById('places-grid');
    if (places && typeof PLACES !== 'undefined') {
      places.innerHTML = PLACES.map(placeHtml).join('');
    }

    wireStaticLinks();
    decorateTrust();

    /* Loud console warning if the placeholder number was never replaced. */
    if (BUSINESS.whatsapp.indexOf('X') !== -1) {
      console.warn(
        '[Megha Bike Rental] WhatsApp number is still the placeholder. '
        + 'Edit BUSINESS.whatsapp in assets/js/data.js before going live.'
      );
    }
  });
})();
