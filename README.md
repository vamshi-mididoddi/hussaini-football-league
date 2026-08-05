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

## Where the content came from

All of it is transcribed from the client's own artwork, not invented:

| Content | Source |
| --- | --- |
| 8 teams, crests, taglines, groups | Season 2 lineup + tournament groups posters |
| 64 players, positions, auction values | The eight players-list posters |
| 16 group fixtures, kickoff times | `Schedule HFL26.pdf` pages 2–3 and 5–6 |
| Knockout bracket | `Schedule HFL26.pdf` page 8 |
| Partners and their tiers | `S2 Banners Final File Printing.pdf` |

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

- **The knockout times don't add up.** Page 8 of the schedule puts the
  quarter-finals at 7:15–9:30 PM but the semi-finals at 7:15 and 8:15 PM, which
  is before the quarters finish. Worth confirming with the organisers.
- `Jindal Infernos` is spelled `Infernose` on the lineup poster and `Infernos` on
  the groups poster; the site uses `Infernos`. The NR Chargers crest also reads
  `RR Chargers` on the groups poster.
- Two players appear in two squads — `Mufaddal Shakir` (Globe Warriors and
  Paramount Predators) and `Hussain Fakkad` (Kothari Sparks and Jindal Infernos).
  These may be different people who share a name, or a transcription error on the
  posters.
- No standalone Jindal Infernos crest was supplied; theirs is lifted from the
  corner of their players-list poster and is lower resolution than the rest.
- `Emerald Cheetahs` artwork was supplied but the team is not in the Season 2
  lineup, so it is not used.
- Standings sit at zero until the first match; there is no results entry yet.
