/* HFL admin console.
   Publishes score updates by committing data/live.json to the repo through
   the GitHub Contents API, authenticated with a fine-grained token the admin
   pastes once (kept in this browser's localStorage, never sent anywhere else).
   The public pages read that file — no server anywhere. */
(function () {
  'use strict';

  var D = window.HFL_DATA;
  var API = localStorage.getItem('hfl_api') || 'https://api.github.com';
  var TOKEN_KEY = 'hfl_token';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var names = {};
  D.teams.forEach(function (t) { names[t.slug] = t.name; });

  var state = { results: {}, knockout: {}, champion: '', season: 2 };
  var sha = null;
  var dirty = false;

  /* ---------- helpers ---------- */
  function token() { return localStorage.getItem(TOKEN_KEY) || ''; }

  function b64encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  function b64decode(str) {
    return decodeURIComponent(escape(atob(str.replace(/\n/g, ''))));
  }

  function api(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({
      Authorization: 'Bearer ' + token(),
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }, opts.headers || {});
    return fetch(API + path, opts);
  }

  function contentsPath() {
    return '/repos/' + D.repo + '/contents/' + D.path;
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
  function loadState() {
    return api(contentsPath() + '?ref=main').then(function (r) {
      if (r.status === 401 || r.status === 403) throw new Error('auth');
      if (r.status === 404) return null; // file not there yet — start fresh
      if (!r.ok) throw new Error('load failed (' + r.status + ')');
      return r.json();
    }).then(function (json) {
      if (json) {
        sha = json.sha;
        try {
          var parsed = JSON.parse(b64decode(json.content));
          state.results = parsed.results || {};
          state.knockout = parsed.knockout || {};
          state.champion = parsed.champion || '';
        } catch (e) { /* corrupt file — start fresh, publish overwrites */ }
      }
    });
  }

  function publish(retried) {
    var body = JSON.stringify({
      season: 2,
      results: state.results,
      knockout: state.knockout,
      champion: state.champion,
    }, null, 2) + '\n';

    $('[data-publish]').disabled = true;
    $('[data-hint]').textContent = 'Publishing…';

    return api(contentsPath(), {
      method: 'PUT',
      body: JSON.stringify({
        message: 'Update live scores',
        content: b64encode(body),
        branch: 'main',
        sha: sha || undefined,
      }),
    }).then(function (r) {
      if (r.status === 409 && !retried) {
        // Someone else published in between — take their sha and retry once.
        return api(contentsPath() + '?ref=main')
          .then(function (rr) { return rr.json(); })
          .then(function (j) { sha = j.sha; return publish(true); });
      }
      if (r.status === 401 || r.status === 403) throw new Error('auth');
      if (!r.ok) throw new Error('publish failed (' + r.status + ')');
      return r.json();
    }).then(function (j) {
      if (j && j.content) sha = j.content.sha;
      dirty = false;
      $('[data-bar]').hidden = true;
      msg('Published ✓ — the website updates within about a minute.', 'ok');
    }).catch(function (e) {
      if (e.message === 'auth') {
        msg('Token rejected. Check it has Contents read & write on the repo, then re-enter it.', 'err');
        showGate();
      } else {
        msg('Could not publish (' + e.message + '). Check the connection and try again.', 'err');
      }
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
      msg('Connected. Enter scores below, then hit Publish.', 'ok');
    }).catch(function (e) {
      if (e.message === 'auth') {
        msg('Token rejected — re-enter it.', 'err');
        showGate();
      } else {
        buildForm();
        msg('Could not load current scores (' + e.message + ') — publishing will overwrite.', 'err');
      }
    });
  }

  $('[data-save-token]').addEventListener('click', function () {
    var v = $('#token').value.trim();
    if (!v) { msg('Paste the token first.', 'err'); return; }
    localStorage.setItem(TOKEN_KEY, v);
    $('#token').value = '';
    showConsole();
  });

  $('[data-change-token]').addEventListener('click', function () {
    localStorage.removeItem(TOKEN_KEY);
    showGate();
  });

  $('[data-publish]').addEventListener('click', function () { publish(false); });

  window.addEventListener('beforeunload', function (e) {
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
  });

  if (token()) showConsole();
  else showGate();
})();
