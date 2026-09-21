/* Charing Cross Library — site behaviour
   Progressive enhancement: every section works without JS. */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- header */
  var head = document.querySelector('.head');
  var hero = document.querySelector('.hero');          // dark full-bleed hero only
  var banner = document.querySelector('.hero, .phero');

  function onScrollHead() {
    if (!head) return;
    if (!hero) {                       // inner pages open on paper: ink header from the start
      head.classList.add('is-solid');
      return;
    }
    head.classList.toggle('is-solid', window.scrollY > banner.offsetHeight - 80);
  }
  onScrollHead();

  /* ------------------------------------------------------------ mobile nav */
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('is-locked', open);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open', 'is-locked');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open', 'is-locked');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --------------------------------------------------------------- reveal */
  var revealables = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ----------------------------------------------------- ruled-line motif */
  function buildRules(el) {
    var n = parseInt(el.dataset.rules || '9', 10);
    var seed = parseInt(el.dataset.seed || '3', 10);
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var W = 1000, step = 12;
    var out = '';
    for (var i = 0; i < n; i++) {
      var t = n > 1 ? i / (n - 1) : 0;
      var len = W * (0.24 + 0.68 * t + (rnd() - 0.5) * 0.14);
      var x = W * (0.02 + rnd() * 0.08);
      var thick = i === 0 ? 1.9 : (i === n - 1 ? 3.6 : 0.8);
      var y = i * step + 2;
      out += '<line x1="' + x.toFixed(1) + '" y1="' + y + '" x2="' + (x + len).toFixed(1) +
        '" y2="' + y + '" stroke-width="' + thick + '" style="--len:' + len.toFixed(0) + '"/>';
    }
    var h = (n - 1) * step + 8;
    el.innerHTML = '<svg class="rules" viewBox="0 0 ' + W + ' ' + h + '" preserveAspectRatio="none" ' +
      'aria-hidden="true" style="height:' + el.dataset.height + 'px"><g transform="rotate(-1.4 ' + (W / 2) + ' ' + (h / 2) + ')">' + out + '</g></svg>';
  }

  document.querySelectorAll('.js-rules').forEach(function (el) {
    if (!el.dataset.height) {
      el.dataset.height = String(Math.round(el.getBoundingClientRect().width * 0.13) || 120);
    }
    buildRules(el);
  });

  if ('IntersectionObserver' in window) {
    var ruleObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var svg = en.target.querySelector('.rules');
        if (svg && en.isIntersecting) { svg.classList.add('is-in'); ruleObserver.unobserve(en.target); }
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('.js-rules').forEach(function (el) { ruleObserver.observe(el); });
  } else {
    document.querySelectorAll('.rules').forEach(function (s) { s.classList.add('is-in'); });
  }

  /* --------------------------------------------------------- words stage  */
  var STAGGER = 0.055;
  var ticking = false;

  function initStage(stage) {
    var words = Array.prototype.slice.call(stage.querySelectorAll('.stage__word'));
    if (!words.length) return;
    if (window.matchMedia('(max-width: 899px)').matches) return;

    var row = document.createElement('div');
    row.setAttribute('aria-hidden', 'true');
    row.style.cssText = 'position:absolute;left:0;top:44%;display:flex;gap:.44em;white-space:nowrap;visibility:hidden;pointer-events:none;';
    var cells = words.map(function (w) {
      var s = document.createElement('span');
      s.textContent = w.dataset.word || '';
      row.appendChild(s);
      return s;
    });
    stage.appendChild(row);

    var offsets = [];
    var hair = stage.querySelector('.stage__hair');

    function syncFonts() {
      words.forEach(function (w, i) { cells[i].style.font = getComputedStyle(w).font; });
    }

    function measure() {
      stage.style.setProperty('--p', '0');
      words.forEach(function (w) { w.style.setProperty('--pi', '0'); });
      stage.style.removeProperty('--fit');
      syncFonts();
      var sr = stage.getBoundingClientRect();
      var rr = row.getBoundingClientRect();
      if (rr.width > sr.width) {
        stage.style.setProperty('--fit', (sr.width / rr.width).toFixed(4));
        syncFonts();
        rr = row.getBoundingClientRect();
      }
      if (hair) hair.style.top = Math.round(rr.bottom - sr.top) + 'px';
      offsets = words.map(function (w, i) {
        var cell = cells[i].getBoundingClientRect();
        var wr = w.getBoundingClientRect();
        return {
          tx: (cell.left - sr.left) - (wr.left - sr.left),
          ty: (rr.top - sr.top) - (wr.top - sr.top)
        };
      });
    }

    function paint() {
      var n = words.length;
      var vh = window.innerHeight;
      var p = reduce ? 1 : (vh * 0.82 - stage.getBoundingClientRect().top) / (vh * 0.42);
      p = Math.max(0, Math.min(1, p));
      var span = 1 - STAGGER * (n - 1);
      words.forEach(function (w, i) {
        var pi = Math.max(0, Math.min(1, (p - STAGGER * i) / span));
        w.style.setProperty('--pi', pi.toFixed(3));
      });
      stage.style.setProperty('--p', p.toFixed(3));
    }

    function layout() {
      measure();
      words.forEach(function (w, i) {
        w.style.setProperty('--tx', offsets[i].tx.toFixed(1) + 'px');
        w.style.setProperty('--ty', offsets[i].ty.toFixed(1) + 'px');
      });
      paint();
    }

    layout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    window.addEventListener('resize', debounce(layout, 160));
    stage._paint = paint;
  }

  document.querySelectorAll('.stage').forEach(initStage);

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      document.querySelectorAll('.stage').forEach(function (s) { if (s._paint) s._paint(); });
      ticking = false;
    });
  }, { passive: true });

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  /* -------------------------------------------------------- opening hours */
  var HOURS = [
    { d: 'Sunday', o: 11 * 60, c: 17 * 60 },
    { d: 'Monday', o: 9 * 60 + 30, c: 20 * 60 },
    { d: 'Tuesday', o: 9 * 60 + 30, c: 19 * 60 },
    { d: 'Wednesday', o: 10 * 60, c: 19 * 60 },
    { d: 'Thursday', o: 9 * 60 + 30, c: 19 * 60 },
    { d: 'Friday', o: 9 * 60 + 30, c: 19 * 60 },
    { d: 'Saturday', o: 10 * 60 + 30, c: 14 * 60 }
  ];

  function fmt(m) {
    var h = Math.floor(m / 60), mm = m % 60;
    return (h > 12 ? h - 12 : h) + (mm ? '.' + (mm < 10 ? '0' + mm : mm) : '') + (h >= 12 ? 'pm' : 'am');
  }

  function initHours() {
    var now = new Date();
    var today = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var t = HOURS[today];
    var open = mins >= t.o && mins < t.c;

    document.querySelectorAll('.hours tr[data-day]').forEach(function (tr) {
      tr.dataset.today = (tr.dataset.day === t.d) ? 'true' : 'false';
    });

    document.querySelectorAll('[data-open-status]').forEach(function (el) {
      var next = HOURS[(today + 1) % 7];
      if (open) {
        el.dataset.state = 'open';
        el.innerHTML = '<span class="status__dot"></span>Open now · until ' + fmt(t.c);
      } else if (mins < t.o) {
        el.dataset.state = 'closed';
        el.innerHTML = '<span class="status__dot"></span>Closed · opens ' + fmt(t.o) + ' today';
      } else {
        el.dataset.state = 'closed';
        el.innerHTML = '<span class="status__dot"></span>Closed · opens ' + next.d.slice(0, 3) + ' ' + fmt(next.o);
      }
    });

    document.querySelectorAll('[data-hours-today]').forEach(function (el) {
      el.textContent = fmt(t.o) + ' – ' + fmt(t.c);
    });
  }
  initHours();

  /* ------------------------------------------------------------- filters  */
  var filterBar = document.querySelector('.filters');
  if (filterBar) {
    filterBar.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        filterBar.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        var f = chip.dataset.filter;
        document.querySelectorAll('.event[data-cat]').forEach(function (ev) {
          ev.classList.toggle('is-hidden', f !== 'all' && ev.dataset.cat.indexOf(f) === -1);
        });
      });
    });
  }

  /* ------------------------------------------------------------ signup    */
  document.querySelectorAll('form[data-signup]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.parentElement.querySelector('.signup__msg');
      var input = form.querySelector('input');
      if (msg) msg.textContent = 'Thank you — we will write to ' + (input.value || 'you') + ' about the next season of events.';
      form.reset();
    });
  });

  /* -------------------------------------------------------------- footer  */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  window.addEventListener('scroll', onScrollHead, { passive: true });
})();
