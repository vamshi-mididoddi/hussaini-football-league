# Hussaini Football League — Season 2 (Client Preview)

Static preview site for the HFL Season 2 digital experience, built from the Stitch
design export. Deployed on GitHub Pages for client review.

## Pages

| URL | Page |
| --- | --- |
| `/` | Home — hero, upcoming fixtures, league standings |
| `/fixtures.html` | Match Center — fixtures, formation, match stats |
| `/teams.html` | League Franchises |
| `/squad.html` | Squad Profile — Athletico Gold |
| `/gallery.html` | Media Gallery |
| `/sponsors.html` | Elite Partner Network |

Each page has a desktop layout at the root and a matching mobile layout under `/m/`.
A small script in the `<head>` sends visitors to whichever layout fits their viewport
(the breakpoint is 768px). Append `?full` to any URL to stay on the layout you asked
for — useful for checking the mobile design on a laptop:

    /m/index.html?full

## Repo layout

    index.html, fixtures.html, ...          desktop pages (edit these)
    m/index.html, m/fixtures.html, ...      mobile pages (edit these)
    stitch_hussaini_football_league_digital_experience/
                                            original Stitch export + reference
                                            screenshots + DESIGN.md (do not edit)

The root and `m/` files are the live site and the source of truth for changes. The
`stitch_...` folder is kept untouched as the original design reference.

## Known gaps

- Footer and utility links (`About`, `Privacy`, `Terms`, `Contact`, `League Rules`,
  `Fan Zone`, `More`, `Analytics`, `Resources`) have no pages behind them yet and are
  intentionally inert.
- `Statistics` and `Tactical View` on the Match Center are in-page tabs in the design,
  not separate pages, and are not wired up.
- All imagery is served from the Stitch CDN (`lh3.googleusercontent.com`). Those URLs
  are outside our control and should be replaced with real HFL assets before launch.
- Tailwind runs from the Play CDN, which is fine for a preview but should be compiled
  for production.
- All content — fixtures, standings, player names, sponsors — is placeholder design
  copy, not real league data.
