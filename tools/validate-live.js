/* Validate and normalise a fetched live-scores JSON before it is mirrored
   into the repo. Anything outside the known schema is dropped, so a corrupt
   or tampered store can never poison the fallback copy.

   Usage: node tools/validate-live.js <input.json> <output.json> */

const fs = require('fs');
const { teams, matchdays, knockout } = require('./data');

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('usage: node tools/validate-live.js <input.json> <output.json>');
  process.exit(2);
}

const slugs = new Set(teams.map((t) => t.slug));
const matchNos = new Set(matchdays.flatMap((d) => d.matches.map((m) => String(m[0]))));
const tieIds = new Set(knockout.rounds.flatMap((r) => r.ties.map((t) => t[0])));
const STATUSES = new Set(['', 'live', 'ht', 'ft']);

function goal(v) {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 && n <= 99 ? n : null;
}

function slug(v) {
  return slugs.has(v) ? v : '';
}

// strip a UTF-8 BOM if one sneaks in — PowerShell and some proxies add it
const raw = JSON.parse(fs.readFileSync(input, 'utf8').replace(/^﻿/, ''));

const clean = { season: 2, results: {}, knockout: {}, champion: slug(raw.champion) };

for (const [no, r] of Object.entries(raw.results || {})) {
  if (!matchNos.has(no) || !r || typeof r !== 'object') continue;
  const entry = { h: goal(r.h), a: goal(r.a), s: STATUSES.has(r.s) ? r.s : '' };
  if (entry.h == null && entry.a == null && !entry.s) continue;
  clean.results[no] = entry;
}

for (const [id, t] of Object.entries(raw.knockout || {})) {
  if (!tieIds.has(id) || !t || typeof t !== 'object') continue;
  const entry = {
    a: slug(t.a), b: slug(t.b),
    ha: goal(t.ha), hb: goal(t.hb),
    s: STATUSES.has(t.s) ? t.s : '', w: slug(t.w),
  };
  if (!entry.a && !entry.b && entry.ha == null && entry.hb == null && !entry.s && !entry.w) continue;
  clean.knockout[id] = entry;
}

fs.writeFileSync(output, JSON.stringify(clean, null, 2) + '\n', 'utf8');
console.log(`validated: ${Object.keys(clean.results).length} results, `
  + `${Object.keys(clean.knockout).length} ties, champion=${clean.champion || 'none'}`);
