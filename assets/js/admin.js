/* HFL admin console.
   Publishes scores by PUTting data to the league's JSON store; the public
   pages read the same store. Gated by a shared league password (checked as a
   SHA-256 hash) — a courtesy lock so only the organisers wander in, not
   cryptographic protection: match scores are public data the moment they're
   published. No accounts, no tokens, no server of our own. */
(function () {
  'use strict';

  var D = window.HFL_DATA;
  var STORE = localStorage.getItem('hfl_store') || D.store;
  var GATE_KEY = 'hfl_gate_ok';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var names = {};
  D.teams.forEach(function (t) { names[t.slug] = t.name; });

  var state = { results: {}, knockout: {}, champion: '', season: 2 };
  var dirty = false;

  /* ---------- helpers ---------- */
  function sha256hex(str) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    });
  }

  function msg(text, kind) {
    var el = $('[data-msg]');
    el.hidden = false;
    el.textContent = text;
    el.className = 'admin-status' + (kind ? ' admin-status--' + kind : '');
  }

  function markDirty() {
    dirty = true;
    $('[data-bar]').hidden = false;
    $('[data-hint]').textContent = 'Unpublished changes';
  }

  /* ---------- build the form ---------- */
  function statusSelect(value) {
    var s = document.createElement('select');
    s.className = 'admin-input admin-input--status';
    [['', 'Upcoming'], ['live', 'LIVE'], ['ht', 'Half time'], ['ft', 'Full time']]
      .forEach(function (o) {
        var opt = document.createElement('option');
        opt.value = o[0];
        opt.textContent = o[1];
        s.appendChild(opt);
      });
    s.value = value || '';
    return s;
  }

  function scoreInput(value) {
    var i = document.createElement('input');
    i.className = 'admin-input admin-input--score';
    i.type = 'number';
    i.min = '0';
    i.max = '99';
    i.inputMode = 'numeric';
    i.placeholder = '–';
    if (value != null) i.value = value;
    return i;
  }

  function teamSelect(value, placeholder) {
    var s = document.createElement('select');
    s.className = 'admin-input';
    var first = document.createElement('option');
    first.value = '';
    first.textContent = '— ' + placeholder + ' —';
    s.appendChild(first);
    D.teams.forEach(function (t) {
      var o = document.createElement('option');
      o.value = t.slug;
      o.textContent = t.name;
      s.appendChild(o);
    });
    s.value = value || '';
    return s;
  }

  function buildDays() {
    var wrap = $('[data-days]');
    wrap.textContent = '';
    var byDay = {};
    D.fixtures.forEach(function (f) {
      (byDay[f.day] = byDay[f.day] || []).push(f);
    });
    Object.keys(byDay).sort().forEach(function (day) {
      var sec = document.createElement('section');
      sec.className = 'admin-day';
      sec.innerHTML = '<div class="section-head"><div class="section-head__text">'
        + '<p class="label label--gold">Group stage</p>'
        + '<h2 style="font-size:var(--fs-h3)">Day ' + day + '</h2></div></div>';
      byDay[day].forEach(function (f) {
        var r = state.results[f.no] || {};
        var row = document.createElement('div');
        row.className = 'admin-row admin-row--match';

        var label = document.createElement('div');
        label.className = 'admin-row__tie';
        label.innerHTML = '<span class="label">M' + f.no + '</span>'
          + '<b>' + names[f.home] + '</b><span class="faint"> v </span><b>' + names[f.away] + '</b>';

        var hs = scoreInput(r.h);
        var as_ = scoreInput(r.a);
        var st = statusSelect(r.s);

        var save = function () {
          var h = hs.value === '' ? null : Number(hs.value);
          var a = as_.value === '' ? null : Number(as_.value);
          if (h == null && a == null && !st.value) delete state.results[f.no];
          else state.results[f.no] = { h: h, a: a, s: st.value };
          markDirty();
        };
        [hs, as_, st].forEach(function (el) { el.addEventListener('input', save); });

        var scores = document.createElement('div');
        scores.className = 'admin-row__scores tnum';
        scores.appendChild(hs);
        var sep = document.createElement('span');
        sep.textContent = '–';
        sep.className = 'faint';
        scores.appendChild(sep);
        scores.appendChild(as_);

        row.appendChild(label);
        row.appendChild(scores);
        row.appendChild(st);
        sec.appendChild(row);
      });
      wrap.appendChild(sec);
    });
  }

  function buildTies() {
    var wrap = $('[data-ties]');
    wrap.textContent = '';
    D.ties.forEach(function (tie) {
      var t = state.knockout[tie.id] || {};
      var row = document.createElement('div');
      row.className = 'admin-row admin-row--tie';

      var head = document.createElement('div');
      head.className = 'admin-row__tie';
      head.innerHTML = '<span class="label label--gold">' + tie.id + '</span>'
        + '<span class="faint">' + tie.a + ' v ' + tie.b + '</span>';

      var selA = teamSelect(t.a, tie.a);
      var selB = teamSelect(t.b, tie.b);
      var ha = scoreInput(t.ha);
      var hb = scoreInput(t.hb);
      var st = statusSelect(t.s);
      var win = teamSelect(t.w, 'winner if penalties');

      var save = function () {
        var cur = {
          a: selA.value, b: selB.value,
          ha: ha.value === '' ? null : Number(ha.value),
          hb: hb.value === '' ? null : Number(hb.value),
          s: st.value, w: win.value,
        };
        if (!cur.a && !cur.b && cur.ha == null && cur.hb == null && !cur.s && !cur.w) {
          delete state.knockout[tie.id];
        } else {
          state.knockout[tie.id] = cur;
        }
        markDirty();
      };
      [selA, selB, ha, hb, st, win].forEach(function (el) { el.addEventListener('input', save); });

      var teamsRow = document.createElement('div');
      teamsRow.className = 'admin-row__teams';
      teamsRow.appendChild(selA);
      teamsRow.appendChild(selB);

      var scores = document.createElement('div');
      scores.className = 'admin-row__scores tnum';
      scores.appendChild(ha);
      var sep = document.createElement('span');
      sep.textContent = '–';
      sep.className = 'faint';
      scores.appendChild(sep);
      scores.appendChild(hb);

      row.appendChild(head);
      row.appendChild(teamsRow);
      row.appendChild(scores);
      row.appendChild(st);
      row.appendChild(win);
      wrap.appendChild(row);
    });
  }

  function buildForm() {
    buildDays();
    buildTies();
    var champ = $('[data-champion-input]');
    champ.value = state.champion || '';
    champ.addEventListener('input', function () {
      state.champion = champ.value;
      markDirty();
    });
  }

  /* ---------- load & publish ---------- */
  function adopt(parsed) {
    state.results = parsed.results || {};
    state.knockout = parsed.knockout || {};
    state.champion = parsed.champion || '';
  }

  function loadState() {
    return fetch(STORE + '?v=' + Math.floor(Date.now() / 1000), { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('store ' + r.status);
        return r.text();
      })
      .then(function (text) {
        if (!text || !text.trim()) throw new Error('empty');
        adopt(JSON.parse(text));
      })
      .catch(function () {
        // Store empty or unreachable — fall back to the mirrored copy, so
        // the console always opens pre-filled with the latest known scores.
        return fetch('../data/live.json', { cache: 'no-store' })
          .then(function (r) { return r.ok ? r.json() : {}; })
          .then(adopt);
      });
  }

  function publish() {
    var body = JSON.stringify({
      season: 2,
      results: state.results,
      knockout: state.knockout,
      champion: state.champion,
    });

    $('[data-publish]').disabled = true;
    $('[data-hint]').textContent = 'Publishing…';

    // The store wants the key in the query string and the value as a form
    // field, and reports success as {"status":1} — an HTTP 200 alone can
    // still be a rejection, so both are checked.
    return fetch(D.storeWrite + '?key=' + encodeURIComponent(D.storeKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'value=' + encodeURIComponent(body),
    }).then(function (r) {
      if (!r.ok) throw new Error('store ' + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || j.status !== 1) throw new Error('store rejected the update');
      dirty = false;
      $('[data-bar]').hidden = true;
      msg('Published ✓ — scores are live on the site within a minute.', 'ok');
    }).catch(function (e) {
      msg('Could not publish (' + e.message + '). Check the connection and try again.', 'err');
      $('[data-bar]').hidden = false;
    }).finally(function () {
      $('[data-publish]').disabled = false;
    });
  }

  /* ---------- gate ---------- */
  function showGate() {
    $('[data-gate]').hidden = false;
    $('[data-console]').hidden = true;
    $('[data-change-token]').hidden = true;
  }

  function showConsole() {
    $('[data-gate]').hidden = true;
    $('[data-console]').hidden = false;
    $('[data-change-token]').hidden = false;
    msg('Loading current scores…');
    loadState().then(function () {
      buildForm();
      msg('Ready. Enter scores below, then hit Publish.', 'ok');
    });
  }

  $('[data-save-token]').addEventListener('click', function () {
    var v = $('#token').value.trim().toLowerCase();
    if (!v) { return; }
    sha256hex(v).then(function (hex) {
      if (hex === D.gate) {
        localStorage.setItem(GATE_KEY, '1');
        $('#token').value = '';
        showConsole();
      } else {
        var gateMsg = $('[data-gate] .muted');
        gateMsg.textContent = 'That password is not right — check it with the organiser.';
      }
    });
  });

  $('#token').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') $('[data-save-token]').click();
  });

  $('[data-change-token]').addEventListener('click', function () {
    localStorage.removeItem(GATE_KEY);
    showGate();
  });

  $('[data-publish]').addEventListener('click', publish);

  window.addEventListener('beforeunload', function (e) {
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
  });

  if (localStorage.getItem(GATE_KEY) === '1') showConsole();
  else showGate();
})();
