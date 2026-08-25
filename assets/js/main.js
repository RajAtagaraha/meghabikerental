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
            : '<a class="btn btn--wa btn--block" href="#book"'
              + ' data-book="' + escapeHtml(bike.id) + '">' + ICON_WA + 'Check availability</a>')

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


  /* --- enquiry form ------------------------------------------------------- */
  /*
     Static by design: nothing is transmitted from this page. The form composes
     a wa.me link and hands it to WhatsApp, where the visitor presses send.
  */

  function iso(d) {
    var m = String(d.getMonth() + 1);
    var day = String(d.getDate());
    return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m)
                           + '-' + (day.length < 2 ? '0' + day : day);
  }

  function prettyDate(value) {
    if (!value) return '';
    var parts = value.split('-');
    if (parts.length !== 3) return value;
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(d.getTime())) return value;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function nights(a, b) {
    var d1 = new Date(a), d2 = new Date(b);
    if (isNaN(d1) || isNaN(d2)) return 0;
    return Math.round((d2 - d1) / 86400000);
  }

  function setError(id, msg) {
    var el = document.querySelector('[data-err-for="' + id + '"]');
    var input = document.getElementById(id);
    if (el) el.textContent = msg || '';
    if (input) {
      if (msg) { input.setAttribute('aria-invalid', 'true'); input.classList.add('is-invalid'); }
      else { input.removeAttribute('aria-invalid'); input.classList.remove('is-invalid'); }
    }
  }

  function initForm() {
    var form = document.getElementById('enquiry-form');
    if (!form) return;

    var vehicle = document.getElementById('f-vehicle');
    var pickup  = document.getElementById('f-pickup');
    var ret     = document.getElementById('f-return');
    var summary = document.getElementById('form-summary');

    /* vehicle list comes from data.js so it can never drift from the fleet */
    var opts = ['<option value="">Not sure yet — recommend one</option>'];
    BIKES.forEach(function (b) {
      opts.push('<option value="' + escapeHtml(b.id) + '"' + (b.available ? '' : ' disabled')
        + '>' + escapeHtml(b.name) + ' — \u20B9' + b.price.toLocaleString('en-IN') + '/day'
        + (b.available ? '' : ' (on rent)') + '</option>');
    });
    vehicle.innerHTML = opts.join('');

    /* no past dates */
    var today = iso(new Date());
    pickup.min = today;
    ret.min = today;

    pickup.addEventListener('change', function () {
      if (pickup.value) {
        ret.min = pickup.value;
        if (ret.value && ret.value < pickup.value) ret.value = '';
      }
      updateSummary();
    });
    ret.addEventListener('change', updateSummary);
    vehicle.addEventListener('change', updateSummary);

    function updateSummary() {
      if (!pickup.value || !ret.value) { summary.textContent = ''; return; }
      var n = nights(pickup.value, ret.value);
      if (n <= 0) { summary.textContent = ''; return; }
      var bike = BIKES.filter(function (b) { return b.id === vehicle.value; })[0];
      var days = n + (n === 1 ? ' day' : ' days');
      summary.textContent = bike
        ? days + ' \u00D7 \u20B9' + bike.price.toLocaleString('en-IN')
          + ' = \u20B9' + (bike.price * n).toLocaleString('en-IN') + ' estimated'
        : days + ' \u2014 pick a vehicle to see an estimate';
    }

    function validate() {
      var ok = true;
      ['f-name','f-pickup','f-return'].forEach(function (id) { setError(id, ''); });

      var name = document.getElementById('f-name');
      if (!name.value.trim()) { setError('f-name', 'Please tell us your name.'); ok = false; }

      if (!pickup.value) { setError('f-pickup', 'Choose a pickup date.'); ok = false; }
      else if (pickup.value < today) { setError('f-pickup', 'Pickup cannot be in the past.'); ok = false; }

      if (!ret.value) { setError('f-return', 'Choose a return date.'); ok = false; }
      else if (pickup.value && nights(pickup.value, ret.value) <= 0) {
        setError('f-return', 'Return must be after pickup.'); ok = false;
      }
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        var bad = form.querySelector('.is-invalid');
        if (bad) bad.focus();
        return;
      }

      var bike = BIKES.filter(function (b) { return b.id === vehicle.value; })[0];
      var n = nights(pickup.value, ret.value);
      var hotel = document.getElementById('f-hotel').value.trim();
      var notes = document.getElementById('f-notes').value.trim();

      var lines = [];
      lines.push('Hi ' + BUSINESS.name + ', I would like to check availability.');
      lines.push('');
      lines.push('Name: ' + document.getElementById('f-name').value.trim());
      lines.push('Vehicle: ' + (bike ? bike.name + ' (\u20B9' + bike.price + '/day)' : 'Not decided — please suggest'));
      lines.push('Pickup: ' + prettyDate(pickup.value) + ' at ' + (document.getElementById('f-time').value || '09:00'));
      lines.push('Return: ' + prettyDate(ret.value));
      lines.push('Duration: ' + n + (n === 1 ? ' day' : ' days'));
      lines.push('Riders: ' + document.getElementById('f-riders').value);
      if (bike) lines.push('Estimated total: \u20B9' + (bike.price * n).toLocaleString('en-IN'));
      lines.push('Hotel pickup: ' + (hotel ? hotel : 'Not needed'));
      if (notes) lines.push('Notes: ' + notes);

      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    });

    /* a card's "Check availability" preselects that vehicle and jumps here */
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-book]');
      if (!trigger) return;
      e.preventDefault();
      vehicle.value = trigger.getAttribute('data-book');
      updateSummary();
      document.getElementById('book').scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(function () { document.getElementById('f-name').focus(); }, 420);
    });
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
    initForm();
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
