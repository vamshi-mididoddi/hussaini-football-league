/* HFL live layer — pulls data/live.json and paints scores, the computed
   standings and the knockout bracket onto the static pages.
   Depends on hfl-data.js (window.HFL_DATA). No other dependencies. */
(function () {
  'use strict';

  var D = window.HFL_DATA;
  if (!D) return;

  var names = {};
  D.teams.forEach(function (t) { names[t.slug] = t.name; });

  var STATUS_LABEL = { live: 'LIVE', ht: 'HT', ft: 'FT' };

  function dash(a, b) { return a + ' – ' + b; }

  function setStatus(el, s) {
    if (!el) return;
    if (!s || !STATUS_LABEL[s]) {
      if (el.hasAttribute('data-keep')) return;
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.textContent = STATUS_LABEL[s];
    el.classList.toggle('badge--live', s === 'live' || s === 'ht');
    el.classList.toggle('badge--gold', s === 'ft');
    if (s === 'live') {
      if (!el.querySelector('.pulse')) {
        var dot = document.createElement('i');
        dot.className = 'pulse';
        el.insertBefore(dot, el.firstChild);
      }
    } else {
      var old = el.querySelector('.pulse');
      if (old) old.remove();
    }
  }

  function paintMatches(results) {
    Object.keys(results).forEach(function (no) {
      var r = results[no];
      if (r == null || r.h == null || r.a == null) return;
      document.querySelectorAll('[data-match="' + no + '"]').forEach(function (card) {
        var score = card.querySelector('[data-score]');
        if (score) {
          score.textContent = dash(r.h, r.a);
          score.classList.add('has-score');
        }
        var badge = card.querySelector('[data-status]');
        if (badge && badge.hasAttribute('hidden')) setStatus(badge, r.s);
        else if (badge) { // home rail badge shows "Day N" by default — swap to status
          if (r.s) { badge.textContent = ''; setStatus(badge, r.s); }
        }
      });
    });
  }

  /* Standings: 3 for a win, 1 for a draw. Ties break on points, goal
     difference, goals for, then name. Only finished matches count. */
  function computeTable(results) {
    var stats = {};
    D.teams.forEach(function (t) {
      stats[t.slug] = { slug: t.slug, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
    });
    D.fixtures.forEach(function (f) {
      var r = results[f.no];
      if (!r || r.s !== 'ft' || r.h == null || r.a == null) return;
      var h = stats[f.home];
      var a = stats[f.away];
      if (!h || !a) return;
      h.p++; a.p++;
      h.gf += r.h; h.ga += r.a;
      a.gf += r.a; a.ga += r.h;
      if (r.h > r.a) { h.w++; a.l++; h.pts += 3; }
      else if (r.h < r.a) { a.w++; h.l++; a.pts += 3; }
      else { h.d++; a.d++; h.pts++; a.pts++; }
    });
    return Object.values(stats).sort(function (x, y) {
      return (y.pts - x.pts)
        || ((y.gf - y.ga) - (x.gf - x.ga))
        || (y.gf - x.gf)
        || names[x.slug].localeCompare(names[y.slug]);
    });
  }

  function paintTable(results) {
    var tbody = document.querySelector('.table--group tbody');
    if (!tbody) return;
    var order = computeTable(results);
    var played = order.some(function (s) { return s.p > 0; });
    order.forEach(function (s, i) {
      var row = tbody.querySelector('[data-team="' + s.slug + '"]');
      if (!row) return;
      tbody.appendChild(row);
      var put = function (col, v) {
        var cell = row.querySelector('[data-col="' + col + '"]');
        if (cell) cell.textContent = v;
      };
      put('pos', played ? String(i + 1) : '—');
      put('p', s.p); put('w', s.w); put('d', s.d); put('l', s.l); put('pts', s.pts);
      if (played && i === 0) row.setAttribute('data-leader', '');
      else row.removeAttribute('data-leader');
    });
  }

  function paintKnockout(ko) {
    Object.keys(ko || {}).forEach(function (id) {
      var t = ko[id];
      var el = document.querySelector('[data-tie="' + id + '"]');
      if (!el || !t) return;
      var sideA = el.querySelector('[data-side="a"]');
      var sideB = el.querySelector('[data-side="b"]');
      if (t.a && sideA) sideA.querySelector('[data-name]').textContent = names[t.a] || t.a;
      if (t.b && sideB) sideB.querySelector('[data-name]').textContent = names[t.b] || t.b;
      if (t.ha != null && t.hb != null) {
        sideA.querySelector('[data-goals]').textContent = t.ha;
        sideB.querySelector('[data-goals]').textContent = t.hb;
      }
      setStatus(el.querySelector('[data-status]'), t.s);
      // Winner: explicit (penalties) or by score at FT
      var winner = t.w || (t.s === 'ft' && t.ha != null && t.hb !== t.ha
        ? (t.ha > t.hb ? t.a : t.b) : '');
      sideA.classList.toggle('is-winner', !!winner && winner === t.a);
      sideB.classList.toggle('is-winner', !!winner && winner === t.b);
    });
  }

  function paintChampion(data) {
    var el = document.querySelector('[data-champion]');
    if (!el) return;
    var champ = data.champion;
    if (!champ && data.knockout && data.knockout.Final) {
      var f = data.knockout.Final;
      champ = f.w || (f.s === 'ft' && f.ha != null && f.ha !== f.hb
        ? (f.ha > f.hb ? f.a : f.b) : '');
    }
    if (champ) {
      el.hidden = false;
      el.textContent = '🏆 Champions · ' + (names[champ] || champ);
    }
  }

  function render(data) {
    if (!data) return;
    paintMatches(data.results || {});
    paintTable(data.results || {});
    paintKnockout(data.knockout || {});
    paintChampion(data);
  }

  function refresh() {
    // The store is the live source (instant updates); the repo file is a
    // mirrored fallback for when the store is unreachable.
    var bust = Math.floor(Date.now() / 30000);
    var base = location.pathname.indexOf('/admin/') > -1 ? '../' : '';
    fetch(D.store + '?v=' + bust, { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (text) {
        if (!text || !text.trim()) throw new Error('empty');
        return JSON.parse(text);
      })
      .catch(function () {
        return fetch(base + 'data/live.json?v=' + bust, { cache: 'no-store' })
          .then(function (r) { return r.ok ? r.json() : null; });
      })
      .then(render)
      .catch(function () { /* offline — leave the static page as-is */ });
  }

  refresh();
  setInterval(refresh, 60000);
})();
