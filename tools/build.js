/* ==========================================================================
   HFL static build.
   `node tools/build.js` regenerates every page from tools/data.js.
   The header, footer and nav are defined ONCE here, so they cannot drift
   between pages — which is what went wrong in the first cut of this site.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { league, teams, squads, matchdays, knockout, sponsors } = require('./data');

const ROOT = path.join(__dirname, '..');
const bySlug = Object.fromEntries(teams.map((t) => [t.slug, t]));

/* --- helpers ----------------------------------------------------------- */
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const crest = (slug) => `assets/img/crests/${slug}.png`;

const time12 = (t) => {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

const money = (n) => '₹' + n.toLocaleString('en-IN');

const ARROW = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">'
  + '<path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" '
  + 'stroke-linecap="round" stroke-linejoin="round"/></svg>';

const TICK = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">'
  + '<path d="M2 7.5l3.5 3.5L12 4" stroke="currentColor" stroke-width="1.8" '
  + 'stroke-linecap="round" stroke-linejoin="round"/></svg>';

const NAV = [
  ['index.html', 'Home'],
  ['fixtures.html', 'Fixtures'],
  ['teams.html', 'Teams'],
  ['squads.html', 'Squads'],
  ['gallery.html', 'Gallery'],
  ['sponsors.html', 'Partners'],
];

/* --- shared chrome ----------------------------------------------------- */
function header(page) {
  const links = NAV.map(([href, label]) => {
    const cur = href === page ? ' aria-current="page"' : '';
    return `<a class="site-nav__link" href="${href}"${cur}>${label}</a>`;
  }).join('\n');

  const menuItems = NAV.map(([href, label], i) => {
    const cur = href === page ? ' aria-current="page"' : '';
    return `<li class="menu__item"><a class="menu__link" href="${href}"${cur}>`
      + `<span class="menu__num">0${i + 1}</span>${label}</a></li>`;
  }).join('\n');

  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="site-header__inner">
    <a class="wordmark" href="index.html" aria-label="${esc(league.name)} — home">
      <img class="wordmark__crest" src="${crest('hfl')}" alt="" width="30" height="34" />
      HFL<span>.</span>
    </a>
    <nav class="site-nav" aria-label="Primary">
${links}
    </nav>
    <div class="header-actions">
      <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu">
        <span class="burger__box"><i></i><i></i><i></i></span>
      </button>
    </div>
  </div>
</header>

<div class="menu" id="menu" aria-hidden="true">
  <nav aria-label="Mobile">
    <ul class="menu__list">
${menuItems}
    </ul>
  </nav>
  <div class="menu__foot">
    <p class="label label--gold">${esc(league.season)} · ${esc(league.hashtag)}</p>
    <p class="muted" style="font-size:var(--fs-sm)">${esc(league.tagline)}</p>
  </div>
</div>`;
}

function footer() {
  const cols = [
    ['League', [['fixtures.html', 'Fixtures'], ['teams.html', 'Teams'], ['squads.html', 'Squads']]],
    ['Media', [['gallery.html', 'Gallery'], ['sponsors.html', 'Partners']]],
  ].map(([title, items]) => `
      <div class="site-footer__col">
        <h4 class="label">${title}</h4>
        ${items.map(([h, l]) => `<a href="${h}">${l}</a>`).join('\n        ')}
      </div>`).join('');

  return `<footer class="site-footer">
  <div class="shell">
    <div class="site-footer__cta">
      <div>
        <p class="label label--gold">${esc(league.hashtag)}</p>
        <h2 style="margin-top:var(--sp-3)">${esc(league.tagline)}</h2>
      </div>
      <a class="btn btn--primary" href="fixtures.html">See the schedule ${ARROW}</a>
    </div>

    <div class="site-footer__grid">
      <div class="site-footer__col">
        <img src="${crest('hfl')}" alt="" width="56" height="64" style="height:56px;width:auto" />
        <p class="muted" style="font-size:var(--fs-sm);max-width:34ch">
          ${esc(league.name)} — ${esc(league.season)}. ${esc(league.strap)}
        </p>
      </div>
      ${cols}
    </div>

    <p class="site-footer__mark" aria-hidden="true">HFL</p>

    <div class="site-footer__base">
      <p>© <span data-year>2026</span> ${esc(league.name)}. All rights reserved.</p>
      <p>Fixtures, squads and partners are taken from the official Season 2 artwork.</p>
      <p class="dev-credit">Developed by <span>Vametrix</span></p>
    </div>
  </div>
</footer>`;
}

function layout({ title, description, page, hero = false, live = false, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="theme-color" content="#07090C" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:image" content="assets/img/gallery/season-2-team-lineup.jpg" />
<link rel="icon" href="${crest('hfl')}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Inter:wght@400;500;600;700&display=swap" />
<link rel="stylesheet" href="assets/css/hfl.css" />
<script>document.documentElement.classList.add('js');</script>
</head>
<body class="${hero ? 'has-hero' : ''}">
${header(page)}
<main id="main">
${body}
</main>
${footer()}
<script src="assets/js/hfl.js" defer></script>
${live ? '<script src="assets/js/hfl-data.js" defer></script>\n<script src="assets/js/live.js" defer></script>' : ''}
</body>
</html>`;
}

/* --- components -------------------------------------------------------- */
function matchCard(m, day) {
  const [no, t, homeSlug, awaySlug] = m;
  const home = bySlug[homeSlug];
  const away = bySlug[awaySlug];
  return `<article class="card match" data-match="${no}" data-reveal>
  <div class="match__top">
    <span class="label">Match ${no}</span>
    <span class="badge" data-status>Day ${day}</span>
  </div>
  <div class="match__teams">
    <div class="match__side">
      <img class="match__crest" src="${crest(home.slug)}" alt="${esc(home.name)} crest" loading="lazy" width="52" height="52" />
      <span class="match__name">${esc(home.name)}</span>
    </div>
    <span class="match__vs" data-score aria-hidden="true">V</span>
    <div class="match__side">
      <img class="match__crest" src="${crest(away.slug)}" alt="${esc(away.name)} crest" loading="lazy" width="52" height="52" />
      <span class="match__name">${esc(away.name)}</span>
    </div>
  </div>
  <div class="match__foot">
    <span class="tnum">${time12(t)}</span>
    <span class="faint">Group stage</span>
  </div>
</article>`;
}

function fixtureRow(m, day) {
  const [no, t, homeSlug, awaySlug] = m;
  const home = bySlug[homeSlug];
  const away = bySlug[awaySlug];
  return `<li class="fixture" data-match="${no}" data-reveal>
  <div class="fixture__meta">
    <span class="label">M${no}</span>
    <time class="fixture__time tnum" datetime="${day.date}T${t}">${time12(t)}</time>
    <span class="badge" data-status hidden></span>
  </div>
  <div class="fixture__tie">
    <div class="fixture__side fixture__side--home">
      <span class="fixture__name">${esc(home.name)}</span>
      <img src="${crest(home.slug)}" alt="" loading="lazy" width="40" height="40" />
    </div>
    <span class="fixture__vs" data-score aria-label="versus">V</span>
    <div class="fixture__side fixture__side--away">
      <img src="${crest(away.slug)}" alt="" loading="lazy" width="40" height="40" />
      <span class="fixture__name">${esc(away.name)}</span>
    </div>
  </div>
</li>`;
}

/* One combined table for all eight teams — qualification for the knockout
   stage runs off overall rank, not group position, so the table is league-wide
   while each row still carries its group letter. */
function leagueTable() {
  const rows = teams.map((t) => `
      <tr data-team="${t.slug}">
        <td class="table__pos" data-col="pos">—</td>
        <td><a class="table__team" href="squads.html#${t.slug}">
          <img src="${crest(t.slug)}" alt="" loading="lazy" width="26" height="26" />${esc(t.name)}
        </a></td>
        <td class="table__grp"><span class="badge">${t.group}</span></td>
        <td class="tnum" data-col="p">0</td><td class="tnum" data-col="w">0</td>
        <td class="tnum" data-col="d">0</td><td class="tnum" data-col="l">0</td>
        <td class="table__pts tnum" data-col="pts">0</td>
      </tr>`).join('');

  return `<div class="table-wrap" data-reveal>
    <table class="table table--group">
      <caption class="visually-hidden">Combined league standings, before the season starts</caption>
      <thead>
        <tr><th scope="col">#</th><th scope="col">Team</th><th scope="col" style="text-align:left">Grp</th>
        <th scope="col">P</th><th scope="col">W</th><th scope="col">D</th><th scope="col">L</th>
        <th scope="col">Pts</th></tr>
      </thead>
      <tbody>${rows}
      </tbody>
    </table>
  </div>`;
}

function teamCard(t) {
  const squad = squads[t.slug] || [];
  const value = squad.reduce((a, p) => a + p[2], 0);
  return `<a class="card team-card" href="squads.html#${t.slug}" data-reveal>
  <div class="team-card__media">
    <div class="team-card__crest-wrap"><img src="${crest(t.slug)}" alt="${esc(t.name)} crest" loading="lazy" /></div>
    <span class="team-card__accent" style="background:${t.accent}"></span>
  </div>
  <div class="team-card__body">
    <div>
      <p class="label label--gold">Group ${t.group}</p>
      <h3 style="margin-top:var(--sp-2)">${esc(t.name)}</h3>
      <p class="muted" style="font-size:var(--fs-sm);margin-top:var(--sp-2)">${esc(t.tagline)}</p>
    </div>
    <div class="team-card__stats">
      <span class="team-card__stat"><b class="tnum">${squad.length}</b><span class="label">Players</span></span>
      <span class="team-card__stat"><b class="tnum">${money(value)}</b><span class="label">Squad value</span></span>
    </div>
  </div>
</a>`;
}

function squadSection(t) {
  const squad = squads[t.slug] || [];
  const value = squad.reduce((a, p) => a + p[2], 0);
  const top = squad.reduce((a, p) => (p[2] > a[2] ? p : a), squad[0]);
  const backer = sponsors.find((s) => s.team === t.slug);
  const rows = squad.map(([name, pos, amt], i) => `
        <tr>
          <td class="table__pos tnum">${String(i + 1).padStart(2, '0')}</td>
          <td style="font-weight:600">${esc(name)}</td>
          <td style="text-align:left"><span class="badge badge--pos" data-pos="${pos}">${pos}</span></td>
          <td class="table__pts tnum">${money(amt)}</td>
        </tr>`).join('');

  return `<section class="squad" id="${t.slug}" data-reveal>
  <div class="squad__head" style="--team:${t.accent}">
    <img class="squad__crest" src="${crest(t.slug)}" alt="${esc(t.name)} crest" loading="lazy" />
    <div class="squad__id">
      <p class="label label--gold">Group ${t.group}</p>
      <h2>${esc(t.name)}</h2>
      <p class="muted">${esc(t.tagline)}</p>
    </div>
    <dl class="squad__facts">
      <div><dt class="label">Squad value</dt><dd class="tnum">${money(value)}</dd></div>
      <div><dt class="label">Marquee</dt><dd>${esc(top[0])}</dd></div>
      ${backer ? `<div><dt class="label">Backed by</dt><dd>${esc(backer.name)}</dd></div>` : ''}
    </dl>
  </div>
  <div class="table-wrap">
    <table class="table table--squad">
      <caption class="visually-hidden">${esc(t.name)} squad list</caption>
      <thead>
        <tr><th scope="col">#</th><th scope="col">Player</th>
        <th scope="col" style="text-align:left">Position</th><th scope="col">Value</th></tr>
      </thead>
      <tbody>${rows}
      </tbody>
    </table>
  </div>
</section>`;
}

/* --- pages ------------------------------------------------------------- */
function pageHome() {
  const day1 = matchdays[0];
  const totalMatches = matchdays.reduce((a, d) => a + d.matches.length, 0);

  const body = `<section class="hero">
  <div class="hero__ground" aria-hidden="true">
    <div class="hero__ground-plane">
      <svg class="hero__ground-marks" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <g fill="none" stroke="rgba(255,255,255,.30)" stroke-width="4">
          <rect x="40" y="24" width="1120" height="752" />
          <path d="M40 400h1120" />
          <circle cx="600" cy="400" r="96" />
          <rect x="372" y="24" width="456" height="150" />
          <rect x="372" y="626" width="456" height="150" />
          <rect x="486" y="24" width="228" height="62" />
          <rect x="486" y="714" width="228" height="62" />
        </g>
        <circle cx="600" cy="400" r="6" fill="rgba(255,255,255,.18)" />
      </svg>
    </div>
  </div>
  <div class="hero__lights" aria-hidden="true"></div>
  <div class="hero__scrim"></div>

  <div class="shell hero__inner">
    <div class="hero__eyebrow" data-reveal>
      <span class="badge badge--gold">${esc(league.season)}</span>
      <span class="label">${esc(league.name)}</span>
      <span class="badge badge--gold" data-champion hidden></span>
    </div>

    <h1 class="display hero__title" data-reveal>Season<br />Two</h1>

    <p class="lead" data-reveal>New season. New battles. One champion.
      Eight teams, sixteen group matches and a single trophy — decided across three nights in August.</p>

    <div class="countdown" data-countdown="${league.kickoff}" data-reveal>
      <p class="label">First kickoff — Sat 8 Aug, 7:00 PM</p>
      <div class="countdown__row">
        <div class="countdown__unit"><b class="tnum" data-unit="d">00</b><span class="label">Days</span></div>
        <div class="countdown__unit"><b class="tnum" data-unit="h">00</b><span class="label">Hrs</span></div>
        <div class="countdown__unit"><b class="tnum" data-unit="m">00</b><span class="label">Min</span></div>
        <div class="countdown__unit"><b class="tnum" data-unit="s">00</b><span class="label">Sec</span></div>
      </div>
    </div>

    <div class="hero__actions" data-reveal>
      <a class="btn btn--primary" href="fixtures.html">Full schedule ${ARROW}</a>
      <a class="btn btn--ghost" href="teams.html">Meet the teams</a>
    </div>

    <div class="hero__meta" data-reveal>
      <span class="hero__stat"><b class="tnum">8</b><span class="label">Teams</span></span>
      <span class="hero__stat"><b class="tnum">${totalMatches}</b><span class="label">Group matches</span></span>
      <span class="hero__stat"><b class="tnum">3</b><span class="label">Match nights</span></span>
      <span class="hero__stat"><b class="tnum">64</b><span class="label">Players</span></span>
    </div>
  </div>
</section>

<section class="section--tight section--raised">
  <div class="shell">
    <a class="billboard" href="sponsors.html" data-reveal>
      <span class="billboard__plate">
        <img src="assets/img/sponsors/kalangi.png" alt="Kalangi Estates &amp; Projects logo" loading="lazy" />
      </span>
      <span class="billboard__body">
        <span class="label label--gold">Title Sponsor</span>
        <span class="billboard__name">Kalangi Estates &amp; Projects</span>
        <span class="muted billboard__note">Building dreams, defining luxury — proud title sponsor of HFL Season 2.</span>
      </span>
      <span class="billboard__cue label">${esc(league.season)}</span>
    </a>

    <div class="section-head" style="margin-top:var(--sp-7)" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">Our sponsors</p>
        <h2>Backed by the best</h2>
      </div>
      <a class="link-more" href="sponsors.html">All partners ${ARROW}</a>
    </div>
    <div class="partner-strip partner-strip--many">
${sponsors.filter((s) => s.slug !== 'kalangi').map((s) => `      <div class="partner-strip__cell" title="${esc(s.name)} — ${esc(s.role)}" data-reveal>
        <img src="assets/img/sponsors/${s.slug}.png" alt="${esc(s.name)} — ${esc(s.role)}" loading="lazy" />
      </div>`).join('\n')}
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">Matchday one · ${esc(day1.label)}</p>
        <h2>Opening night</h2>
      </div>
      <a class="link-more" href="fixtures.html">All fixtures ${ARROW}</a>
    </div>
    <div class="rail">
${day1.matches.map((m) => matchCard(m, day1.day)).join('\n')}
    </div>
  </div>
</section>

<section class="section section--raised" id="standings">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">The table</p>
        <h2>League standings</h2>
      </div>
      <span class="badge">Groups A &amp; B combined</span>
    </div>
    ${leagueTable()}
    <p class="muted" style="margin-top:var(--sp-5);font-size:var(--fs-sm)" data-reveal>
      One table, all eight teams — each row keeps its group. It stays at zero until the first whistle
      on 8 August. The top two go straight to the semi-finals, 3rd to 6th meet in the quarter-finals,
      and the bottom two bow out.
    </p>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">How it works</p>
        <h2>Rolling format</h2>
      </div>
    </div>
    <div class="stat-row" data-reveal>
      <div class="stat"><b>15</b><span class="label">Minutes per half</span></div>
      <div class="stat"><b>4</b><span class="label">Matches per slot</span></div>
      <div class="stat"><b>16</b><span class="label">Group matches</span></div>
      <div class="stat"><b>5</b><span class="label">Knockout ties</span></div>
    </div>
    <p class="lead" style="margin-top:var(--sp-6)" data-reveal>${esc(league.format.note)}
      The top two in the combined table skip straight to the semi-finals, 3rd to 6th fight through the
      quarter-finals, and the winner of the final lifts the Season 2 trophy.</p>
  </div>
</section>

<section class="section section--raised">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">The eight</p>
        <h2>Franchises</h2>
      </div>
      <a class="link-more" href="teams.html">Team profiles ${ARROW}</a>
    </div>
    <div class="crest-strip">
${teams.map((t) => `      <a class="crest-chip" href="squads.html#${t.slug}" title="${esc(t.name)}" data-reveal>
        <img src="${crest(t.slug)}" alt="${esc(t.name)} crest" loading="lazy" />
        <span class="label">${esc(t.short)}</span>
      </a>`).join('\n')}
    </div>
  </div>
</section>`;

  return layout({
    title: 'Hussaini Football League — Season 2',
    description: 'Season 2 of the Hussaini Football League: 8 teams, 16 group matches and a knockout final across 8, 9 and 15 August 2026.',
    page: 'index.html', hero: true, live: true, body,
  });
}

function pageFixtures() {
  const days = matchdays.map((d) => `
<section class="section" data-reveal>
  <div class="shell">
    <div class="section-head">
      <div class="section-head__text">
        <p class="label label--gold">Day ${d.day} · ${esc(d.stage)}</p>
        <h2>${esc(d.label)}</h2>
      </div>
      <span class="badge">${d.matches.length} matches</span>
    </div>
    <ol class="fixture-list">
${d.matches.map((m) => fixtureRow(m, d)).join('\n')}
    </ol>
  </div>
</section>`).join('');

  const rounds = knockout.rounds.map((r) => `
    <div class="round" data-reveal>
      <h3 class="round__name">${esc(r.name)}</h3>
      <ul class="round__ties">
${r.ties.map(([id, a, b]) => `        <li class="tie" data-tie="${esc(id)}">
          <div class="tie__head"><span class="label label--gold">${esc(id)}</span><span class="badge" data-status hidden></span></div>
          <p class="tie__side" data-side="a"><span data-name>${esc(a)}</span><b class="tie__goals tnum" data-goals></b></p>
          <span class="tie__vs" aria-hidden="true">V</span>
          <p class="tie__side" data-side="b"><span data-name>${esc(b)}</span><b class="tie__goals tnum" data-goals></b></p>
        </li>`).join('\n')}
      </ul>
    </div>`).join('');

  const qualification = knockout.qualification.map(([pos, fate]) => `
      <div class="stat"><b>${esc(pos)}</b><span class="label">${esc(fate)}</span></div>`).join('');

  const body = `<section class="page-head">
  <div class="shell page-head__inner">
    <p class="label label--gold" data-reveal>Season 2 schedule</p>
    <h1 data-reveal>Fixtures</h1>
    <p class="lead" data-reveal>Sixteen group matches across two nights, then the knockout stage.
      Halves are ${esc(league.format.half)}; after every half the next team takes the pitch.</p>
  </div>
</section>

${days}

<section class="section section--raised">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">Day 3 · ${esc(knockout.stage)}</p>
        <h2>${esc(knockout.label)}</h2>
      </div>
      <span class="badge">Kicks off ${time12(knockout.start)}</span>
    </div>
    <div class="stat-row" style="margin-bottom:var(--sp-6)" data-reveal>${qualification}
    </div>
    <div class="bracket">${rounds}
    </div>
    <p class="muted" style="margin-top:var(--sp-6);font-size:var(--fs-sm)" data-reveal>
      Placings come from the combined league table, so every pairing stays open until the last
      group match on Day 2. The top two rest through the quarter-finals and enter at the semis.
    </p>
  </div>
</section>`;

  return layout({
    title: 'Fixtures — HFL Season 2',
    description: 'Every HFL Season 2 fixture: 16 group matches on 8 and 9 August 2026, and the knockout stage on 15 August.',
    page: 'fixtures.html', live: true, body,
  });
}

function pageTeams() {
  const body = `<section class="page-head">
  <div class="shell page-head__inner">
    <p class="label label--gold" data-reveal>${esc(league.strap)}</p>
    <h1 data-reveal>Teams</h1>
    <p class="lead" data-reveal>Eight franchises, split into two groups of four. Every squad was
      assembled at the Season 2 auction.</p>
  </div>
</section>

${['A', 'B'].map((g) => `<section class="section">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">Group ${g}</p>
        <h2>${g === 'A' ? 'First four' : 'Second four'}</h2>
      </div>
    </div>
    <div class="grid grid--4">
${teams.filter((t) => t.group === g).map(teamCard).join('\n')}
    </div>
  </div>
</section>`).join('\n')}`;

  return layout({
    title: 'Teams — HFL Season 2',
    description: 'The eight franchises of HFL Season 2, their crests, taglines and squad values.',
    page: 'teams.html', body,
  });
}

function pageSquads() {
  const all = Object.values(squads).flat();
  const totalValue = all.reduce((a, p) => a + p[2], 0);
  const marquee = all.reduce((a, p) => (p[2] > a[2] ? p : a), all[0]);

  const body = `<section class="page-head">
  <div class="shell page-head__inner">
    <p class="label label--gold" data-reveal>Auction results</p>
    <h1 data-reveal>Squads</h1>
    <p class="lead" data-reveal>All ${all.length} players across the eight Season 2 franchises,
      with the position and auction value recorded for each.</p>
    <div class="stat-row" style="margin-top:var(--sp-5)" data-reveal>
      <div class="stat"><b class="tnum">${all.length}</b><span class="label">Players</span></div>
      <div class="stat"><b class="tnum">${money(totalValue)}</b><span class="label">Total spend</span></div>
      <div class="stat"><b class="tnum">${money(marquee[2])}</b><span class="label">Top bid — ${esc(marquee[0])}</span></div>
    </div>
  </div>
</section>

<div class="section">
  <div class="shell squad-stack">
${teams.map(squadSection).join('\n')}
  </div>
</div>`;

  return layout({
    title: 'Squads — HFL Season 2',
    description: 'Every HFL Season 2 squad: 64 players with positions and auction values across eight franchises.',
    page: 'squads.html', body,
  });
}

function pageGallery() {
  const artwork = [
    ['season-2-team-lineup.jpg', 'Season 2 team lineup', 'tall'],
    ['tournament-groups.jpg', 'Tournament groups', 'wide'],
    ['day-1-cover.jpg', 'Day 1 — 8 August', ''],
    ['day-2-cover.jpg', 'Day 2 — 9 August', ''],
    ['day-3-cover.jpg', 'Day 3 — 15 August', ''],
    ['knockout-stage.jpg', 'Knockout stage', 'tall'],
    ['day-1-fixtures-1.jpg', 'Day 1 fixtures — matches 1–4', ''],
    ['day-1-fixtures-2.jpg', 'Day 1 fixtures — matches 5–8', ''],
    ['day-2-fixtures-1.jpg', 'Day 2 fixtures — matches 9–12', ''],
    ['day-2-fixtures-2.jpg', 'Day 2 fixtures — matches 13–16', ''],
  ];

  const shots = artwork.map(([file, cap, mod]) => `      <a class="shot ${mod ? 'shot--' + mod : ''}" href="assets/img/gallery/${file}" data-reveal>
        <img src="assets/img/gallery/${file}" alt="${esc(cap)}" loading="lazy" />
        <span class="shot__cap">${esc(cap)}</span>
      </a>`).join('\n');

  const squadShots = teams.map((t) => `      <a class="shot" href="assets/img/gallery/squad-${t.slug}.jpg" data-reveal>
        <img src="assets/img/gallery/squad-${t.slug}.jpg" alt="${esc(t.name)} players list" loading="lazy" />
        <span class="shot__cap">${esc(t.name)}</span>
      </a>`).join('\n');

  const body = `<section class="page-head">
  <div class="shell page-head__inner">
    <p class="label label--gold" data-reveal>${esc(league.hashtag)}</p>
    <h1 data-reveal>Gallery</h1>
    <p class="lead" data-reveal>Season 2 artwork — the lineup, the draw, and every matchday sheet.</p>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">Campaign</p>
        <h2>Season artwork</h2>
      </div>
    </div>
    <div class="gallery">
${shots}
    </div>
  </div>
</section>

<section class="section section--raised">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">The auction</p>
        <h2>Squad sheets</h2>
      </div>
      <a class="link-more" href="squads.html">Squad data ${ARROW}</a>
    </div>
    <div class="gallery">
${squadShots}
    </div>
  </div>
</section>`;

  return layout({
    title: 'Gallery — HFL Season 2',
    description: 'HFL Season 2 artwork: team lineup, tournament groups, matchday fixture sheets and squad lists.',
    page: 'gallery.html', body,
  });
}

function pageSponsors() {
  const kalangi = sponsors.find((s) => s.slug === 'kalangi');
  const league_ = sponsors.filter((s) => !s.team && s.slug !== 'kalangi');
  const teamSponsors = sponsors.filter((s) => s.team);

  const catLinks = (s) => (s.catalogue || []).map((f, i) => {
    const label = s.catalogue.length > 1 ? `Catalogue ${i + 1}` : 'View catalogue';
    return `<a class="link-more" href="assets/img/catalogues/${f}">${label} ${ARROW}</a>`;
  }).join('\n            ');

  const leagueCards = league_.map((s) => `      <article class="card sponsor" data-reveal>
        <div class="sponsor__plate">
          <img src="assets/img/sponsors/${s.slug}.png" alt="${esc(s.name)} logo" loading="lazy" />
        </div>
        <div class="sponsor__body">
          <p class="label label--gold">${esc(s.role)}</p>
          <h3>${esc(s.name)}</h3>
          <p class="muted" style="font-size:var(--fs-sm)">${esc(s.note)}</p>
          <div class="sponsor__cat">
            ${catLinks(s)}
          </div>
        </div>
      </article>`).join('\n');

  const teamCards = teamSponsors.map((s) => {
    const t = bySlug[s.team];
    return `      <article class="card sponsor" data-reveal>
        <div class="sponsor__plate">
          <img src="assets/img/sponsors/${s.slug}.png" alt="${esc(s.name)} logo" loading="lazy" />
        </div>
        <div class="sponsor__body">
          <p class="label label--gold">${esc(s.role)}</p>
          <h3>${esc(s.name)}</h3>
          <p class="muted" style="font-size:var(--fs-sm)">${esc(s.note)}</p>
          <div class="sponsor__cat">
            ${catLinks(s)}
          </div>
          <a class="sponsor__team" href="squads.html#${t.slug}">
            <img src="${crest(t.slug)}" alt="" loading="lazy" width="22" height="22" />
            <span>Backs ${esc(t.name)}</span>
          </a>
        </div>
      </article>`;
  }).join('\n');

  const catalogueWall = sponsors.flatMap((s) => (s.catalogue || []).map((f, i) => {
    const cap = s.catalogue.length > 1 ? `${s.name} — board ${i + 1}` : s.name;
    return `      <a class="shot shot--top" href="assets/img/catalogues/${f}" data-reveal>
        <img src="assets/img/catalogues/${f}" alt="${esc(cap)} product catalogue" loading="lazy" />
        <span class="shot__cap">${esc(cap)}</span>
      </a>`;
  })).join('\n');

  const body = `<section class="page-head">
  <div class="shell page-head__inner">
    <p class="label label--gold" data-reveal>Commercial</p>
    <h1 data-reveal>Partners</h1>
    <p class="lead" data-reveal>Season 2 reaches eight squads, 64 players and three nights of football,
      backed by ${sponsors.length} partners — every franchise carries the name of the business behind it.</p>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">Main sponsor</p>
        <h2>Title Sponsor</h2>
      </div>
    </div>
    <div class="billboard" data-reveal>
      <span class="billboard__plate">
        <img src="assets/img/sponsors/kalangi.png" alt="${esc(kalangi.name)} logo" loading="lazy" />
      </span>
      <span class="billboard__body">
        <span class="label label--gold">${esc(kalangi.role)}</span>
        <span class="billboard__name">${esc(kalangi.name)}</span>
        <span class="muted billboard__note">${esc(kalangi.note)}</span>
        <span class="sponsor__cat">${catLinks(kalangi)}</span>
      </span>
      <span class="billboard__cue label">${esc(league.season)}</span>
    </div>
  </div>
</section>

<section class="section section--raised">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">League partners</p>
        <h2>Co &amp; Trophy Sponsors</h2>
      </div>
    </div>
    <div class="sponsor-grid">
${leagueCards}
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">One per franchise</p>
        <h2>Team Sponsors</h2>
      </div>
      <span class="badge badge--gold">${teamSponsors.length} teams backed</span>
    </div>
    <div class="sponsor-grid">
${teamCards}
    </div>
  </div>
</section>

<section class="section section--raised">
  <div class="shell">
    <div class="section-head" data-reveal>
      <div class="section-head__text">
        <p class="label label--gold">Products</p>
        <h2>Sponsor catalogues</h2>
      </div>
      <span class="badge">${sponsors.reduce((a, s) => a + (s.catalogue || []).length, 0)} boards</span>
    </div>
    <div class="gallery">
${catalogueWall}
    </div>
    <p class="muted" style="margin-top:var(--sp-5);font-size:var(--fs-sm)" data-reveal>
      Every board is the sponsor's own Season 2 banner artwork — tap any tile to open the full catalogue.
    </p>
  </div>
</section>`;

  return layout({
    title: 'Partners — HFL Season 2',
    description: 'Partnership opportunities across HFL Season 2 — title, match and team packages.',
    page: 'sponsors.html', body,
  });
}

/* --- shared data for the live-score layer ------------------------------ */
function liveData() {
  const fixtures = matchdays.flatMap((d) => d.matches.map(([no, t, h, a]) => ({
    no, day: d.day, time: t, home: h, away: a,
  })));
  const ties = knockout.rounds.flatMap((r) => r.ties.map(([id, a, b]) => ({
    id, round: r.name, a, b,
  })));
  return {
    // Anonymous JSON store the admin console publishes to and the public
    // pages read from. data/live.json in the repo is a mirrored fallback,
    // kept fresh by .github/workflows/mirror-scores.yml.
    store: 'https://jsonblob.com/api/jsonBlob/019fe5c0-1e59-7d7a-ba5c-c6b88420c697',
    // SHA-256 of the league password. A courtesy lock for the console UI,
    // not cryptographic protection — the scores are public data anyway.
    gate: '6e0f4670b2268d1da40093fcbd314e98ac0bb1e25ae9465d90e5180d985bb0a8',
    teams: teams.map((t) => ({ slug: t.slug, name: t.name, short: t.short })),
    fixtures, ties,
  };
}

/* --- admin console ------------------------------------------------------ */
function pageAdmin() {
  const d = liveData();
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="robots" content="noindex, nofollow" />
<title>HFL Admin — Season 2</title>
<meta name="theme-color" content="#07090C" />
<link rel="icon" href="../assets/img/crests/hfl.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Inter:wght@400;500;600;700&display=swap" />
<link rel="stylesheet" href="../assets/css/hfl.css" />
<script>window.HFL_DATA = ${JSON.stringify(d)};</script>
</head>
<body class="admin-body">
<header class="admin-top">
  <a class="wordmark" href="../index.html">
    <img class="wordmark__crest" src="../assets/img/crests/hfl.png" alt="" width="30" height="34" />
    HFL<span>.</span>
  </a>
  <span class="label label--gold">Score console</span>
  <button class="btn btn--ghost admin-top__token" type="button" data-change-token hidden>Lock console</button>
</header>

<main class="shell admin-main">
  <!-- Password gate -->
  <section class="card admin-gate" data-gate>
    <h1 style="font-size:var(--fs-h2)">Score console</h1>
    <p class="muted">Enter the league password to open the console. You only do this once
      on each device.</p>
    <label class="label" for="token">League password</label>
    <input class="admin-input" id="token" type="password" autocomplete="off"
      placeholder="word-word-00" />
    <button class="btn btn--primary" type="button" data-save-token>Open console</button>
    <p class="muted" style="font-size:var(--fs-xs)">Don't have it? Ask the league organiser.</p>
  </section>

  <!-- Console -->
  <section data-console hidden>
    <div class="admin-status" data-msg hidden></div>
    <div data-days></div>

    <section class="admin-day">
      <div class="section-head">
        <div class="section-head__text">
          <p class="label label--gold">Day 3 · 15 August</p>
          <h2 style="font-size:var(--fs-h3)">Knockout</h2>
        </div>
      </div>
      <div data-ties></div>
    </section>

    <section class="admin-day">
      <div class="section-head">
        <div class="section-head__text">
          <p class="label label--gold">Season</p>
          <h2 style="font-size:var(--fs-h3)">Champion</h2>
        </div>
      </div>
      <div class="admin-row">
        <label class="label" for="champion" style="align-self:center">Champions of Season 2</label>
        <select class="admin-input" id="champion" data-champion-input>
          <option value="">— not decided yet —</option>
${d.teams.map((t) => `          <option value="${t.slug}">${esc(t.name)}</option>`).join('\n')}
        </select>
      </div>
    </section>
  </section>
</main>

<div class="admin-bar" data-bar hidden>
  <span class="admin-bar__hint" data-hint>Unpublished changes</span>
  <button class="btn btn--primary" type="button" data-publish>Publish to website</button>
</div>

<script src="../assets/js/admin.js" defer></script>
</body>
</html>`;
}

/* --- write ------------------------------------------------------------- */
const PAGES = {
  'index.html': pageHome,
  'fixtures.html': pageFixtures,
  'teams.html': pageTeams,
  'squads.html': pageSquads,
  'gallery.html': pageGallery,
  'sponsors.html': pageSponsors,
};

let n = 0;
for (const [file, fn] of Object.entries(PAGES)) {
  const html = fn();
  fs.writeFileSync(path.join(ROOT, file), html, 'utf8');
  console.log(`  ${file.padEnd(16)} ${String(Buffer.byteLength(html) / 1024).slice(0, 5)}KB`);
  n++;
}

fs.mkdirSync(path.join(ROOT, 'admin'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'admin', 'index.html'), pageAdmin(), 'utf8');
fs.writeFileSync(
  path.join(ROOT, 'assets', 'js', 'hfl-data.js'),
  `window.HFL_DATA = ${JSON.stringify(liveData())};\n`,
  'utf8'
);
console.log('  admin/index.html + assets/js/hfl-data.js');

console.log(`\n${n} pages built from ${teams.length} teams, `
  + `${matchdays.reduce((a, d) => a + d.matches.length, 0)} group matches, `
  + `${Object.values(squads).flat().length} players.`);
