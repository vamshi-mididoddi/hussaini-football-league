/* ==========================================================================
   HFL Season 2 — single source of truth.
   Everything here is transcribed from the client's own artwork:
   the Season 2 team lineup poster, the tournament groups poster, the eight
   players-list posters, and Schedule HFL26.pdf.
   Change data here, run `node tools/build.js`, commit. Never edit the HTML.
   ========================================================================== */

const league = {
  name: 'Hussaini Football League',
  short: 'HFL',
  season: 'Season 2',
  hashtag: '#HFLS2',
  tagline: 'One Team. One Dream. One Champion.',
  strap: '8 Teams. 1 Trophy. Unlimited Glory.',
  // First kickoff — Day 1, Match 1. IST.
  kickoff: '2026-08-08T19:00:00+05:30',
  format: {
    half: '15 minutes',
    note: 'After every half the next team plays, so the schedule rolls continuously.',
  },
};

/* --- Teams ------------------------------------------------------------- */
const teams = [
  {
    slug: 'kothari-sparks', name: 'Kothari Sparks', short: 'Sparks', group: 'A',
    tagline: 'Sparking Glory Every Game', accent: '#F5A623',
  },
  {
    slug: 'globe-warriors', name: 'Globe Warriors', short: 'Warriors', group: 'A',
    tagline: 'Across the Globe, We Dominate', accent: '#F58220',
  },
  {
    slug: 'jindal-infernos', name: 'Jindal Infernos', short: 'Infernos', group: 'A',
    tagline: 'Fire on the Front Foot', accent: '#E53935',
  },
  {
    slug: 'nr-chargers', name: 'NR Chargers', short: 'Chargers', group: 'A',
    tagline: 'Charging Toward Glory', accent: '#FFC107',
  },
  {
    slug: 'imperial-knights', name: 'Imperial Knights', short: 'Knights', group: 'B',
    tagline: 'Rule the Game', accent: '#8B5CF6',
  },
  {
    slug: 'texal-rising-phoenix', name: 'Texal Rising Phoenix', short: 'Phoenix', group: 'B',
    tagline: 'Higher. Hotter. Harder to Beat.', accent: '#F97316',
  },
  {
    slug: 'paramount-predators', name: 'Paramount Predators', short: 'Predators', group: 'B',
    tagline: 'Born to Rule the Field', accent: '#3B82F6',
  },
  {
    slug: 'perfect-strikers', name: 'Perfect Strikers', short: 'Strikers', group: 'B',
    tagline: 'Every Strike, On Target', accent: '#EF4444',
  },
];

/* --- Squads ------------------------------------------------------------
   `amount` is the auction value in rupees, exactly as printed on each
   players-list poster.                                                     */
const squads = {
  'nr-chargers': [
    ['Hussain Pachmeriwala', 'Midfielder', 87000],
    ['Murtaza Kanchwala', 'Striker', 10000],
    ['Adnan Hararwala', 'Goalkeeper', 43000],
    ['Miqdaad Badri', 'Midfielder', 11000],
    ['Hatim Sidhpurwala', 'Midfielder', 39000],
    ['Burhanuddin Ali Asgar Lehri', 'Midfielder', 1000],
    ['Murtaza Kakosiwala', 'Defender', 8000],
    ['Murtaza Miyajiwala', 'Midfielder', 1000],
  ],
  'globe-warriors': [
    ['Moiz Unjhawala', 'Striker', 61000],
    ['Mufaddal Sabuwala', 'Goalkeeper', 1000],
    ['Taher Aliasgar Rajkotwala', 'Striker', 5000],
    ['Mufaddal Shakir', 'Striker', 15000],
    ['Shabbir Taranawala', 'Midfielder', 3000],
    ['Abbas Shajapur', 'Defender', 20000],
    ['Mustafa Arenpur', 'Defender', 13000],
    ['Mufaddal', 'Defender', 52000],
  ],
  'imperial-knights': [
    ['Hussain Sabuwala', 'Defender', 35000],
    ['Hussain Broach', 'Midfielder', 67000],
    ['Huzefa Kothari', 'Goalkeeper', 50000],
    ['Abbas Paliwala', 'Midfielder', 13000],
    ['Abbas Palanpurwala', 'Midfielder', 21000],
    ['Adnan Bharmal', 'Defender', 2000],
    ['Hussain', 'Defender', 4000],
    ['Abdul Q', 'Defender', 3000],
  ],
  'texal-rising-phoenix': [
    ['Abdullah Taranawala', 'Midfielder', 128000],
    ['Taher B', 'Midfielder', 34000],
    ['Taher Imani', 'Goalkeeper', 7000],
    ['Abdeali Vadnagarwala', 'Midfielder', 3000],
    ['Mufaddal Taizoon Vadnagarwala', 'Midfielder', 1000],
    ['Hussain Mandasorwala', 'Defender', 13000],
    ['Aliasgar Abuwala', 'Defender', 12000],
    ['Hasan Dhinojwala', 'Defender', 2000],
  ],
  'paramount-predators': [
    ['Abbas Rangoon', 'Striker', 50000],
    ['Idris Hajee', 'Goalkeeper', 39000],
    ['Juzer SC', 'Striker', 3000],
    ['Huzefa Rangwala', 'Midfielder', 22000],
    ['Mufaddal Shakir', 'Midfielder', 16000],
    ['Mustafa Abuwala', 'Defender', 8000],
    ['Zohair Murtuza Dhinojwala', 'Defender', 11000],
    ['Mustansir Ranujwala', 'Defender', 10000],
  ],
  'kothari-sparks': [
    ['Hatim Rangoon', 'Defender', 22000],
    ['Moiz Putli', 'Defender', 43000],
    ['Mustafa Rangwala', 'Goalkeeper', 38000],
    ['Hussain Kohoda', 'Striker', 20000],
    ['Mustafa Palanpurwala', 'Striker', 37000],
    ['Taher Arenpurwala', 'Striker', 35000],
    ['Murtaza Beawer', 'Defender', 2000],
    ['Hussain Fakkad', 'Defender', 3000],
  ],
  'jindal-infernos': [
    ['Burhanuddin Calcuttawala', 'Striker', 30000],
    ['Murtaza Calcuttawala', 'Defender', 33000],
    ['Hussain Fakkad', 'Goalkeeper', 30000],
    ['Huzefa Hussain', 'Striker', 45000],
    ['Alagmar Unjhawala', 'Midfielder', 3000],
    ['Murtaza Sabuawala', 'Midfielder', 26000],
    ['Azeez Lodhger', 'Midfielder', 31000],
    ['Ishaque Lokhandwala', 'Defender', 1000],
  ],
  'perfect-strikers': [
    ['Mustafa Najmi', 'Striker', 20000],
    ['Burhanuddin Baxa', 'Goalkeeper', 1000],
    ['Khuzema', 'Striker', 21000],
    ['Burhanuddin Bhusavalwala', 'Striker', 1000],
    ['Murtaza Vadnagarwala', 'Midfielder', 10000],
    ['Aliasgar Pachmeriwala', 'Midfielder', 12000],
    ['Tajkhoom Bhanpurwala', 'Defender', 17000],
    ['Mohammed Kanch', 'Defender', 12000],
  ],
};

/* --- Schedule ----------------------------------------------------------
   Group stage: Schedule HFL26.pdf pages 2-3 (Day 1) and 5-6 (Day 2).       */
const matchdays = [
  {
    day: 1, date: '2026-08-08', label: 'Saturday 8 August 2026', stage: 'Group Stage',
    matches: [
      [1, '19:00', 'kothari-sparks', 'imperial-knights'],
      [2, '19:15', 'globe-warriors', 'texal-rising-phoenix'],
      [3, '20:00', 'jindal-infernos', 'paramount-predators'],
      [4, '20:15', 'nr-chargers', 'perfect-strikers'],
      [5, '21:00', 'kothari-sparks', 'texal-rising-phoenix'],
      [6, '21:15', 'globe-warriors', 'imperial-knights'],
      [7, '22:00', 'jindal-infernos', 'perfect-strikers'],
      [8, '22:15', 'nr-chargers', 'paramount-predators'],
    ],
  },
  {
    day: 2, date: '2026-08-09', label: 'Sunday 9 August 2026', stage: 'Group Stage',
    matches: [
      [9, '19:00', 'kothari-sparks', 'paramount-predators'],
      [10, '19:15', 'globe-warriors', 'perfect-strikers'],
      [11, '20:00', 'jindal-infernos', 'imperial-knights'],
      [12, '20:15', 'nr-chargers', 'texal-rising-phoenix'],
      [13, '21:00', 'kothari-sparks', 'perfect-strikers'],
      [14, '21:15', 'globe-warriors', 'paramount-predators'],
      [15, '22:00', 'jindal-infernos', 'texal-rising-phoenix'],
      [16, '22:15', 'nr-chargers', 'imperial-knights'],
    ],
  },
];

/* Knockout stage — "HFL schedule .pdf" page 8 (revised format).
   Qualification comes off the combined group-stage table: the top two skip
   straight to the semi-finals, 3rd–6th contest the quarter-finals, and the
   bottom two are eliminated. The poster gives one start time (7:15 PM), not
   per-tie kickoffs. */
const knockout = {
  date: '2026-08-15', label: 'Saturday 15 August 2026', stage: 'Knockout Stage',
  start: '19:15',
  qualification: [
    ['1st – 2nd', 'Straight to the semi-finals'],
    ['3rd – 6th', 'Quarter-finals'],
    ['7th – 8th', 'Eliminated'],
  ],
  rounds: [
    {
      name: 'Quarter Finals',
      ties: [
        ['QF1', '3rd placed team', '5th placed team'],
        ['QF2', '4th placed team', '6th placed team'],
      ],
    },
    {
      name: 'Semi Finals',
      ties: [
        ['SF1', 'Winner of QF1', '1st placed team'],
        ['SF2', 'Winner of QF2', '2nd placed team'],
      ],
    },
    {
      name: 'Final',
      ties: [['Final', 'Winner of SF1', 'Winner of SF2']],
    },
  ],
};

/* --- Partners ----------------------------------------------------------
   Taken from the client's own Season 2 print banners
   (S2 Banners Final File Printing.pdf) — these are confirmed sponsors,
   not placeholders. Logos are cropped from that artwork.

   Every franchise is named after the business backing it, so each team
   sponsor carries a `team` slug. Kalangi is the main (title) sponsor.      */
const sponsors = [
  {
    slug: 'kalangi', name: 'Kalangi Estates & Projects', role: 'Title Sponsor',
    note: 'Building dreams, defining luxury — villas and estates.',
  },
  {
    slug: 'emerald', name: 'Emerald Enterprises', role: 'Co-Sponsor',
    note: 'Safety and protective equipment supplier.',
  },
  {
    slug: 'esa', name: 'Engineering Supply Agencies', role: 'Trophy Sponsor',
    note: 'Authorised dealer and channel partner for T.S. & A.P.',
  },
  {
    slug: 'kothari', name: 'Kothari Electrical & Hardware', role: 'Team Sponsor',
    team: 'kothari-sparks',
    note: 'Industry leader in industrial and electrical goods.',
  },
  {
    slug: 'globe-trading', name: 'Globe Trading Corporation', role: 'Team Sponsor',
    team: 'globe-warriors',
    note: 'Manufacturer and stockist of industrial brushes.',
  },
  {
    slug: 'jfe-steel', name: 'JFE Steel Corporation', role: 'Team Sponsor',
    team: 'jindal-infernos',
    note: 'Authorised dealers and bulk stockists in steel and pipes.',
  },
  {
    slug: 'nr-industrial', name: 'NR Industrial Enterprises', role: 'Team Sponsor',
    team: 'nr-chargers',
    note: 'House of industrial supplies — hoses, valves and fittings.',
  },
  {
    slug: 'imperial-eng', name: 'Imperial Engineering', role: 'Team Sponsor',
    team: 'imperial-knights',
    note: 'Fasteners for industry, from construction to railways.',
  },
  {
    slug: 'texal', name: 'Texal Engineering', role: 'Team Sponsor',
    team: 'texal-rising-phoenix',
    note: 'One-stop solution for the pharma and food industries.',
  },
  {
    slug: 'paramount-rubber', name: 'Paramount Rubber Enterprises', role: 'Team Sponsor',
    team: 'paramount-predators',
    note: 'Authorised stockist and distributor of Sunny Oil Seals.',
  },
  {
    slug: 'perfect-trading', name: 'Perfect Trading Centre', role: 'Team Sponsor',
    team: 'perfect-strikers',
    note: 'Power transmission and mechanical components.',
  },
];

/* Every sponsor's print banner doubles as a product catalogue board, rendered
   to assets/img/catalogues/. ESA's standee artwork spans two boards. */
sponsors.forEach((s) => {
  s.catalogue = s.slug === 'esa' ? ['esa-1.jpg', 'esa-2.jpg'] : [s.slug + '.jpg'];
});

module.exports = { league, teams, squads, matchdays, knockout, sponsors };
