// Data layer for Dead Air
// All synthetic datasets for media consolidation investigation.

// ------- Seeded PRNG ----------
function mulberry(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ------- Consolidation color scale (blue → amber → red) ----------
function consolidationColor(v) {
  const clamped = Math.max(0, Math.min(1, v));
  if (clamped < 0.5) {
    const t = clamped / 0.5;
    return lerpColor('#2E86AB', '#E8A838', t);
  }
  const t = (clamped - 0.5) / 0.5;
  return lerpColor('#E8A838', '#C0392B', t);
}

function lerpColor(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ar = (pa>>16)&255, ag = (pa>>8)&255, ab = pa&255;
  const br = (pb>>16)&255, bg = (pb>>8)&255, bb = pb&255;
  const r = Math.round(ar+(br-ar)*t), g = Math.round(ag+(bg-ag)*t), b2 = Math.round(ab+(bb-ab)*t);
  return `rgb(${r},${g},${b2})`;
}

// ------- Format helpers ----------
function formatPrice(n) {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
  return '$' + n;
}

function formatNumber(n) {
  return n.toLocaleString('en-US');
}

// ------- Ownership Timeline (1934–2024) ----------
const ownershipTimeline = (() => {
  const out = [];
  const rand = mulberry(42);
  for (let y = 1934; y <= 2024; y++) {
    let owners, hhi;
    if (y <= 1980) {
      // Slow growth era: ~600 to ~2400
      const t = (y - 1934) / (1980 - 1934);
      owners = Math.round(600 + t * 1800 + (rand() - 0.5) * 60);
      hhi = Math.round(180 + (rand() - 0.5) * 20);
    } else if (y <= 1996) {
      // Moderate growth: ~2400 to ~5100
      const t = (y - 1980) / (1996 - 1980);
      owners = Math.round(2400 + t * 2700 + (rand() - 0.5) * 80);
      hhi = Math.round(160 + t * 40 + (rand() - 0.5) * 15);
    } else if (y <= 2001) {
      // Telecom Act crash: 5100 → 3800
      const t = (y - 1996) / (2001 - 1996);
      owners = Math.round(5100 - t * 1300 + (rand() - 0.5) * 60);
      hhi = Math.round(200 + t * 800 + (rand() - 0.5) * 40);
    } else {
      // Continued consolidation: 3800 → 2800
      const t = (y - 2001) / (2024 - 2001);
      owners = Math.round(3800 - t * 1000 + (rand() - 0.5) * 50);
      hhi = Math.round(1000 + t * 600 + (rand() - 0.5) * 60);
    }
    out.push({ year: y, owners, hhi });
  }
  return out;
})();

// ------- Spectrum Stats ----------
const SPECTRUM_STATS = [
  { label: 'RADIO STATION OWNERS · 1996', value: '5,100', sub: 'Peak ownership diversity before Telecom Act' },
  { label: 'RADIO STATION OWNERS · 2024', value: '~2,800', sub: 'After three decades of consolidation' },
  { label: 'IHEARTMEDIA STATIONS', value: '860+', sub: 'Largest radio company in America' },
  { label: 'SINCLAIR TV REACH', value: '40%', sub: 'Percentage of US households reached' },
  { label: 'COUNTIES WITH NO LOCAL NEWS', value: '200+', sub: 'News deserts across the country' },
  { label: 'PUBLIC INTEREST OBLIGATION', value: 'Still required', sub: 'FCC mandate largely unenforced since 1987' },
];

// ------- Transfer Log (~200 synthetic FCC records) ----------
const transferLog = (() => {
  const rand = mulberry(1996);
  const eastMarkets = [
    'New York', 'Chicago', 'Philadelphia', 'Boston', 'Detroit', 'Atlanta',
    'Washington DC', 'Miami', 'Tampa', 'Cleveland', 'Pittsburgh', 'Charlotte',
    'Indianapolis', 'Nashville', 'Milwaukee', 'Jacksonville', 'Memphis',
    'Louisville', 'Richmond', 'Hartford', 'Orlando', 'Buffalo', 'Raleigh',
    'Birmingham', 'Columbus OH', 'Cincinnati', 'Norfolk', 'Greensboro',
    'Albany', 'Knoxville', 'New Orleans',
  ];
  const westMarkets = [
    'Los Angeles', 'Dallas', 'Houston', 'San Francisco', 'Phoenix', 'Seattle',
    'Minneapolis', 'Denver', 'San Diego', 'San Antonio', 'Portland',
    'Sacramento', 'Las Vegas', 'Kansas City', 'Salt Lake City', 'Tulsa',
    'Albuquerque', 'Tucson', 'Fresno', 'Omaha', 'Oklahoma City', 'Austin',
    'Boise', 'Spokane', 'Wichita', 'Colorado Springs', 'El Paso',
  ];
  const consolidators = [
    'Clear Channel Communications', 'Cumulus Media', 'Infinity Broadcasting',
    'Sinclair Broadcast Group', 'Tribune Media', 'Nexstar Media Group',
    'Entercom Communications', 'CBS Radio', 'Emmis Communications',
    'Citadel Broadcasting', 'Cox Media Group', 'Beasley Broadcast',
  ];
  const localOwners = [
    'Heritage Broadcasting', 'Family Stations Inc', 'Midwest Radio Group',
    'Pacific Coast Broadcasting', 'Southern Star Media', 'Great Plains Radio',
    'Liberty Communications', 'Patriot Broadcasting Co', 'Valley Media Corp',
    'Heartland Radio LLC', 'Pioneer Broadcasting', 'Coastal Media Partners',
    'Mountain West Radio', 'Prairie State Broadcasting', 'Capital City Media',
    'Sunbelt Communications', 'Northern Lights Radio', 'Gulf Coast Broadcasting',
    'Eastern Seaboard Media', 'Western Range Communications',
  ];

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const suffixes = ['', '-FM', '-AM', '-TV'];
  const out = [];

  for (let i = 0; i < 200; i++) {
    // Weight years heavily toward 1996-2002
    let year;
    const r = rand();
    if (r < 0.55) year = 1996 + Math.floor(rand() * 7); // 1996-2002
    else if (r < 0.75) year = 2003 + Math.floor(rand() * 7); // 2003-2009
    else if (r < 0.88) year = 2010 + Math.floor(rand() * 8); // 2010-2017
    else year = 2018 + Math.floor(rand() * 7); // 2018-2024

    const isWest = rand() > 0.5;
    const market = isWest
      ? westMarkets[Math.floor(rand() * westMarkets.length)]
      : eastMarkets[Math.floor(rand() * eastMarkets.length)];
    const prefix = isWest ? 'K' : 'W';
    const callSign = prefix
      + letters[Math.floor(rand() * 26)]
      + letters[Math.floor(rand() * 26)]
      + letters[Math.floor(rand() * 26)]
      + suffixes[Math.floor(rand() * suffixes.length)];

    const fromOwner = localOwners[Math.floor(rand() * localOwners.length)];
    const toOwner = consolidators[Math.floor(rand() * consolidators.length)];

    // Price scales with year and market size
    const basePrice = 2e6 + rand() * 50e6;
    const marketMult = market === 'New York' || market === 'Los Angeles' ? 8 :
                       market === 'Chicago' || market === 'Dallas' || market === 'San Francisco' ? 5 :
                       market === 'Houston' || market === 'Philadelphia' || market === 'Boston' ? 4 : 1 + rand() * 2;
    const price = Math.round(basePrice * marketMult / 1e5) * 1e5;

    const month = String(Math.floor(rand() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(rand() * 28) + 1).padStart(2, '0');

    out.push({
      date: `${year}-${month}-${day}`,
      callSign,
      market,
      fromOwner,
      toOwner,
      price,
      year,
    });
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
})();

// ------- Market Concentration (50 US markets) ----------
const marketConcentration = (() => {
  const rand = mulberry(2024);
  const markets = [
    { id: 1, name: 'New York', lat: 40.71, lon: -74.01 },
    { id: 2, name: 'Los Angeles', lat: 34.05, lon: -118.24 },
    { id: 3, name: 'Chicago', lat: 41.88, lon: -87.63 },
    { id: 4, name: 'Houston', lat: 29.76, lon: -95.37 },
    { id: 5, name: 'Dallas', lat: 32.78, lon: -96.80 },
    { id: 6, name: 'Philadelphia', lat: 39.95, lon: -75.17 },
    { id: 7, name: 'San Francisco', lat: 37.77, lon: -122.42 },
    { id: 8, name: 'Washington DC', lat: 38.91, lon: -77.04 },
    { id: 9, name: 'Boston', lat: 42.36, lon: -71.06 },
    { id: 10, name: 'Atlanta', lat: 33.75, lon: -84.39 },
    { id: 11, name: 'Miami', lat: 25.76, lon: -80.19 },
    { id: 12, name: 'Phoenix', lat: 33.45, lon: -112.07 },
    { id: 13, name: 'Seattle', lat: 47.61, lon: -122.33 },
    { id: 14, name: 'Minneapolis', lat: 44.98, lon: -93.27 },
    { id: 15, name: 'Denver', lat: 39.74, lon: -104.99 },
    { id: 16, name: 'Detroit', lat: 42.33, lon: -83.05 },
    { id: 17, name: 'Tampa', lat: 27.95, lon: -82.46 },
    { id: 18, name: 'San Diego', lat: 32.72, lon: -117.16 },
    { id: 19, name: 'Portland', lat: 45.52, lon: -122.68 },
    { id: 20, name: 'Charlotte', lat: 35.23, lon: -80.84 },
    { id: 21, name: 'Sacramento', lat: 38.58, lon: -121.49 },
    { id: 22, name: 'Pittsburgh', lat: 40.44, lon: -80.00 },
    { id: 23, name: 'Nashville', lat: 36.16, lon: -86.78 },
    { id: 24, name: 'Indianapolis', lat: 39.77, lon: -86.16 },
    { id: 25, name: 'Kansas City', lat: 39.10, lon: -94.58 },
    { id: 26, name: 'Las Vegas', lat: 36.17, lon: -115.14 },
    { id: 27, name: 'Cleveland', lat: 41.50, lon: -81.69 },
    { id: 28, name: 'Columbus', lat: 39.96, lon: -83.00 },
    { id: 29, name: 'San Antonio', lat: 29.42, lon: -98.49 },
    { id: 30, name: 'Orlando', lat: 28.54, lon: -81.38 },
    { id: 31, name: 'Milwaukee', lat: 43.04, lon: -87.91 },
    { id: 32, name: 'Cincinnati', lat: 39.10, lon: -84.51 },
    { id: 33, name: 'Salt Lake City', lat: 40.76, lon: -111.89 },
    { id: 34, name: 'Raleigh', lat: 35.78, lon: -78.64 },
    { id: 35, name: 'Memphis', lat: 35.15, lon: -90.05 },
    { id: 36, name: 'Richmond', lat: 37.54, lon: -77.44 },
    { id: 37, name: 'Louisville', lat: 38.25, lon: -85.76 },
    { id: 38, name: 'New Orleans', lat: 29.95, lon: -90.07 },
    { id: 39, name: 'Buffalo', lat: 42.89, lon: -78.88 },
    { id: 40, name: 'Oklahoma City', lat: 35.47, lon: -97.52 },
    { id: 41, name: 'Tucson', lat: 32.22, lon: -110.93 },
    { id: 42, name: 'Birmingham', lat: 33.52, lon: -86.80 },
    { id: 43, name: 'Albuquerque', lat: 35.08, lon: -106.65 },
    { id: 44, name: 'Tulsa', lat: 36.15, lon: -95.99 },
    { id: 45, name: 'Knoxville', lat: 35.96, lon: -83.92 },
    { id: 46, name: 'Omaha', lat: 41.26, lon: -95.94 },
    { id: 47, name: 'Boise', lat: 43.62, lon: -116.21 },
    { id: 48, name: 'Spokane', lat: 47.66, lon: -117.43 },
    { id: 49, name: 'Wichita', lat: 37.69, lon: -97.34 },
    { id: 50, name: 'El Paso', lat: 31.76, lon: -106.49 },
  ];

  return markets.map((m, i) => {
    // Large markets (lower id) consolidate faster
    const sizeFactor = 1 - (i / markets.length) * 0.5;
    const noise = () => (rand() - 0.5) * 0.06;
    const c1990 = +(0.08 + rand() * 0.10).toFixed(3);
    const c1996 = +(c1990 + 0.02 + rand() * 0.05).toFixed(3);
    const c2002 = +(c1996 + 0.20 * sizeFactor + rand() * 0.15 + noise()).toFixed(3);
    const c2010 = +(Math.min(0.95, c2002 + 0.08 * sizeFactor + rand() * 0.10 + noise())).toFixed(3);
    const c2024 = +(Math.min(0.97, c2010 + 0.05 * sizeFactor + rand() * 0.08 + noise())).toFixed(3);
    const stations = Math.round(15 + (50 - i) * 1.2 + rand() * 10);
    return { ...m, stations, c1990, c1996, c2002, c2010, c2024 };
  });
})();

// ------- Regulatory Timeline ----------
const regulatoryTimeline = [
  {
    year: 1934, label: 'Communications Act',
    desc: 'Created the FCC. Established that airwaves are a public resource, licensed in the "public interest, convenience, and necessity." Ownership caps: 7 AM, 7 FM, 7 TV stations per entity.',
    type: 'regulation',
  },
  {
    year: 1949, label: 'Fairness Doctrine',
    desc: 'Required broadcasters to present contrasting viewpoints on controversial issues. Codified the public trustee model of broadcasting.',
    type: 'regulation',
  },
  {
    year: 1960, label: 'Programming Guidelines',
    desc: 'FCC issued guidelines requiring stations to serve community needs through local programming, news, and public affairs content.',
    type: 'regulation',
  },
  {
    year: 1971, label: 'Ascertainment Requirements',
    desc: 'Stations required to survey community leaders and the public to identify local issues, then demonstrate how programming addressed them.',
    type: 'regulation',
  },
  {
    year: 1987, label: 'Fairness Doctrine Repealed',
    desc: 'FCC eliminated the Fairness Doctrine, arguing it chilled free speech. Removed the obligation to present balanced viewpoints. Beginning of deregulation wave.',
    type: 'deregulation',
  },
  {
    year: 1996, label: 'Telecommunications Act',
    desc: 'Eliminated national radio ownership caps entirely. Raised TV ownership to 35% national reach. Triggered the largest wave of media consolidation in American history. Within four years, Clear Channel grew from 40 stations to 1,200.',
    type: 'deregulation',
  },
  {
    year: 2003, label: 'FCC Loosens Cross-Ownership',
    desc: 'FCC voted to relax cross-ownership rules, allowing companies to own newspapers and broadcast stations in the same market. Courts later blocked the changes.',
    type: 'deregulation',
  },
  {
    year: 2017, label: 'Cross-Ownership Rules Repealed',
    desc: 'FCC under Ajit Pai eliminated the newspaper/broadcast cross-ownership ban and the radio/TV cross-ownership rule, both in place since the 1970s.',
    type: 'deregulation',
  },
  {
    year: 2017, label: 'Main Studio Rule Eliminated',
    desc: 'FCC eliminated the requirement that stations maintain a main studio in or near their community of license, enabling remote operation of local stations.',
    type: 'deregulation',
  },
  {
    year: 2024, label: 'Reform Efforts Blocked',
    desc: 'Congressional attempts to restore local ownership incentives and reinstate public interest obligations stalled in committee. Status quo consolidation continues.',
    type: 'stalled',
  },
];

// ------- Note for Year ----------
function noteForYear(year) {
  if (year === 1934) return 'The Communications Act creates the FCC. Airwaves declared a public resource.';
  if (year === 1949) return 'Fairness Doctrine adopted. Broadcasters must present contrasting viewpoints.';
  if (year === 1960) return 'FCC issues community programming guidelines for license renewal.';
  if (year === 1971) return 'Ascertainment requirements: stations must survey and serve local needs.';
  if (year === 1987) return 'Fairness Doctrine repealed. The deregulation era begins.';
  if (year === 1996) return 'Telecommunications Act signed. National radio ownership caps eliminated. The flood begins.';
  if (year === 1997) return 'Clear Channel acquires Jacor Communications. The buying spree accelerates.';
  if (year === 1998) return 'Capstar Broadcasting merges with Chancellor Media. 463 stations under one roof.';
  if (year === 1999) return 'Clear Channel merges with AMFM Inc. 830 stations. Largest radio company in history.';
  if (year === 2000) return 'Clear Channel peaks at 1,200 stations. Infinity Broadcasting controls most of top-10 markets.';
  if (year === 2001) return 'Dot-com bust. Ad revenue falls. Consolidation continues through distress sales.';
  if (year === 2003) return 'FCC votes to loosen cross-ownership. Three million public comments oppose it.';
  if (year === 2008) return 'Clear Channel taken private by Bain Capital. $19.4 billion in debt.';
  if (year === 2014) return 'iHeartMedia (formerly Clear Channel) reports $20B in long-term debt.';
  if (year === 2017) return 'FCC eliminates cross-ownership ban and main studio rule in the same year.';
  if (year === 2018) return 'iHeartMedia files for bankruptcy. Largest radio bankruptcy in history.';
  if (year === 2024) return 'Reform efforts stall. ~2,800 owners remain for 15,000+ stations.';
  if (year >= 1996 && year <= 2002) return 'Peak consolidation era. Thousands of stations change hands.';
  return null;
}

// ------- Expose to window ----------
Object.assign(window, {
  mulberry, consolidationColor, lerpColor,
  formatPrice, formatNumber,
  ownershipTimeline, SPECTRUM_STATS,
  transferLog, marketConcentration,
  regulatoryTimeline, noteForYear,
});
