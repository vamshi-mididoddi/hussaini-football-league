/* HFL — interaction layer. No dependencies. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Header: transparent over the hero, solid once scrolled ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Mobile menu ----------------------------------------------------- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');

  if (burger && menu) {
    var links = menu.querySelectorAll('.menu__link');

    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('is-locked', open);
      // Stagger the links in; clear the delay on close so it snaps shut.
      links.forEach(function (l, i) {
        l.style.transitionDelay = open && !reduce ? i * 55 + 60 + 'ms' : '0ms';
      });
      if (open) {
        var first = links[0];
        if (first) first.focus({ preventScroll: true });
      }
    };

    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        burger.focus();
      }
    });

    // A resize past the desktop breakpoint must not leave the body locked.
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* --- Scroll reveal ---------------------------------------------------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          // Stagger siblings that share a reveal group.
          var group = el.parentElement ? el.parentElement.querySelectorAll(':scope > [data-reveal]') : [el];
          var idx = Array.prototype.indexOf.call(group, el);
          el.style.setProperty('--reveal-delay', Math.min(idx, 8) * 70 + 'ms');
          el.classList.add('is-in');
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* --- Countdown to first kickoff -------------------------------------- */
  var clock = document.querySelector('[data-countdown]');
  if (clock) {
    var target = new Date(clock.getAttribute('data-countdown')).getTime();
    var cells = {
      d: clock.querySelector('[data-unit="d"]'),
      h: clock.querySelector('[data-unit="h"]'),
      m: clock.querySelector('[data-unit="m"]'),
      s: clock.querySelector('[data-unit="s"]'),
    };
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };

    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) {
        clock.setAttribute('data-live', 'true');
        var label = clock.querySelector('.label');
        if (label) label.textContent = 'Season 2 is under way — scores update live below';
        var row = clock.querySelector('.countdown__row');
        if (row) row.hidden = true;
        return;
      }
      var s = Math.floor(diff / 1000);
      if (cells.d) cells.d.textContent = pad(Math.floor(s / 86400));
      if (cells.h) cells.h.textContent = pad(Math.floor(s / 3600) % 24);
      if (cells.m) cells.m.textContent = pad(Math.floor(s / 60) % 60);
      if (cells.s) cells.s.textContent = pad(s % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* --- Footer year ------------------------------------------------------ */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
