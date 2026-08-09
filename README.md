# Hussaini Football League — Season 2

Client preview site for HFL Season 2, deployed on GitHub Pages.

**Live:** https://vamshi-mididoddi.github.io/hussaini-football-league/

## How to change something

Everything on the site is generated from one data file. Edit the data, run the
build, commit — never hand-edit the HTML, it gets overwritten.

```bash
node tools/build.js
```

- `tools/data.js` — teams, squads, fixtures, knockout ties, partners. **This is the
  only file with content in it.**
- `tools/build.js` — page templates plus the header, nav and footer, defined once
  so they cannot drift apart between pages.
- `assets/css/hfl.css` — design tokens (`:root`) and every component.
- `assets/js/hfl.js` — sticky header, mobile menu, scroll reveal, countdown.

Pages are written to the repo root: `index`, `fixtures`, `teams`, `squads`,
`gallery`, `sponsors`. There is no `/m/` mobile variant — the pages are
responsive from 375 px up.

## Live scores and the admin console

Scores don't go through the build. `/admin/` is a phone-first score console:
it commits `data/live.json` to this repo via the GitHub Contents API using a
fine-grained personal access token (repo-scoped, Contents read & write) that
the admin pastes once per device. The public home and fixtures pages fetch
that file every 60 s and paint:

- scores and LIVE / HT / FT chips on match cards and fixture rows,
- the league table, computed from full-time results (win 3, draw 1;
  tie-breaks: points → goal difference → goals for → name) with rows
  re-ordered live,
- knockout teams, scores, penalty winners, and a champions badge once the
  final is decided (or via the explicit champion field).

GitHub Pages redeploys on each publish, so an update is visible in about a
minute. The token holder effectively has write access to the site — treat the
token like a password and set it to expire after the season.

## Where the content came from

All of it is transcribed from the client's own artwork, not invented:

| Content | Source |
| --- | --- |
| 8 teams, crests, taglines, groups | Season 2 lineup + tournament groups posters |
| 64 players, positions, auction values | The eight players-list posters |
| 16 group fixtures, kickoff times | `HFL schedule .pdf` (revised) pages 2–3 and 5–6 |
| Knockout format | `HFL schedule .pdf` (revised) page 8 |
| 11 partners and their tiers | `S2 Banners Final File Printing.pdf` |

Every franchise is named after the business backing it (Kothari Electrical →
Kothari Sparks, Texal Engineering → Texal Rising Phoenix, and so on), so the
partners page groups the roster as Title (Kalangi) → Co/Trophy → eight team
sponsors. The Jindal Infernos crest comes from its 6×6 flex board (banners
PDF page 17).

The revised schedule swapped Day 1's matches 1 and 3 (Sparks v Knights now opens the
season) and reworked the knockout: the top two in the combined table go straight to
the semi-finals, 3rd–6th play the quarter-finals, and the bottom two are eliminated.
The standings table on the site is a single all-eight table for the same reason —
qualification runs off overall rank, with each row keeping its group letter.

Team crests were lifted off their JPEG backdrops into transparent PNGs; sponsor
logos were cropped from the print banners and sit on light tiles because they are
dark ink on white.

The source PDFs and WhatsApp images are gitignored — they total ~112 MB and every
usable pixel is already in `assets/img/`. Keep local copies.

## Design

Broadcast-grade, nocturnal, precise — built against UEFA/FIFA-style sports
editorial rather than a template.

- **Type:** Archivo (variable, expanded) for display, Inter for text.
- **Colour:** near-black `#07090C`, broadcast-white `#F2F5F9` body, cool-grey
  secondary, and gold `#F5B83D` held under 10% of surface area.
- **Hero:** the ground is drawn in CSS/SVG — a turf plane laid back in 3D with
  real pitch markings and floodlight pools. No photograph exists in the supplied
  artwork, and vector means it stays sharp at any width for no download cost.

## Known gaps

- The knockout poster gives one start time (7:15 PM) but no per-tie kickoffs, so
  the site shows the structure without individual tie times.
- `Jindal Infernos` is spelled `Infernose` on the lineup poster and `Infernos` on
  the groups poster; the site uses `Infernos`. The NR Chargers crest also reads
  `RR Chargers` on the groups poster.
- Two players appear in two squads — `Mufaddal Shakir` (Globe Warriors and
  Paramount Predators) and `Hussain Fakkad` (Kothari Sparks and Jindal Infernos).
  These may be different people who share a name, or a transcription error on the
  posters.
- `Emerald Cheetahs` artwork was supplied but the team is not in the Season 2
  lineup, so it is not used.
- Standings sit at zero until the first match; there is no results entry yet.
