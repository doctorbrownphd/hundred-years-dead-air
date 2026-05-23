// 02 · The Transfer

// Simplified US continental outline (approximate SVG path)
const US_OUTLINE = 'M 120,80 L 140,75 160,72 200,70 240,68 280,72 320,74 360,78 400,76 440,74 480,72 520,68 560,66 600,64 640,62 680,66 720,72 760,78 800,82 840,90 860,100 870,120 880,140 890,160 880,180 870,200 860,220 880,240 900,260 920,280 930,300 920,320 900,330 880,340 860,350 840,355 820,360 800,365 780,370 760,368 740,365 720,370 700,375 680,380 660,378 640,375 620,370 600,368 580,370 560,375 540,380 520,378 500,375 480,372 460,370 440,368 420,365 400,360 380,355 360,350 340,348 320,350 300,355 280,360 260,358 240,355 220,350 200,340 180,330 160,320 140,310 120,300 100,280 90,260 85,240 80,220 78,200 80,180 85,160 90,140 100,120 110,100 Z';

// Approximate market positions on the 1100x500 SVG map
const MARKET_POSITIONS = {
  'New York': [890, 130], 'Los Angeles': [130, 290], 'Chicago': [650, 150],
  'Houston': [520, 380], 'Dallas': [500, 340], 'Philadelphia': [860, 150],
  'Washington': [830, 180], 'San Francisco': [100, 210], 'Boston': [900, 110],
  'Atlanta': [730, 290], 'Seattle': [140, 90], 'Minneapolis': [550, 110],
  'Detroit': [710, 140], 'Phoenix': [230, 310], 'Denver': [340, 220],
  'St. Louis': [600, 230], 'Tampa': [760, 370], 'Portland': [130, 110],
  'Sacramento': [120, 220], 'Charlotte': [790, 250], 'San Antonio': [460, 380],
  'Pittsburgh': [770, 160], 'Cincinnati': [700, 200], 'Las Vegas': [200, 270],
  'Kansas City': [510, 230], 'Columbus': [720, 180], 'Austin': [470, 370],
  'Nashville': [670, 260], 'Milwaukee': [620, 130], 'Raleigh': [810, 240],
  'Cleveland': [730, 155], 'Indianapolis': [660, 200], 'San Diego': [160, 320],
  'Salt Lake City': [260, 200], 'Memphis': [610, 280], 'Louisville': [670, 220],
  'Richmond': [820, 210], 'New Orleans': [600, 370], 'Oklahoma City': [470, 280],
  'Hartford': [880, 120], 'Buffalo': [780, 120], 'Jacksonville': [780, 330],
  'Birmingham': [670, 300], 'Norfolk': [840, 220], 'Rochester': [790, 115],
  'Tucson': [240, 330], 'Tulsa': [490, 270], 'Albuquerque': [300, 300],
  'Fresno': [140, 260], 'Omaha': [480, 190], 'Knoxville': [720, 250],
};

function TabTransfer() {
  const [year, setYear] = React.useState(1996);
  const [selectedMarket, setSelectedMarket] = React.useState(null);
  const [hoveredMarket, setHoveredMarket] = React.useState(null);

  const markets = window.marketConcentration || [];
  const transfers = (window.transferLog || []).filter(t => t.year === year);

  return (
    <div style={{ padding: '32px 56px 80px' }}>
      <Eyebrow id="02 · THE TRANSFER" title="Every ownership change in American broadcasting." right="M1 · OWNERSHIP CONSOLIDATION" />

      {/* Year Slider + Map */}
      <div style={{ border: '1px solid var(--line)', background: 'rgba(20,20,20,0.6)', position: 'relative' }}>
        {/* Year display and slider */}
        <div style={{ padding: '24px 32px 16px', display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ textAlign: 'center', minWidth: 120 }}>
            <div className="mono" style={{ fontSize: 48, color: 'var(--amber)', fontWeight: 700, lineHeight: 1, letterSpacing: -1 }}>
              {year}
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-dim)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.15 }}>
              Selected Year
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center' }}>
              {/* Track background */}
              <div style={{
                position: 'absolute', left: 0, right: 0, height: 3, borderRadius: 1.5,
                background: `linear-gradient(to right, var(--blue) ${((1996 - 1990) / (2010 - 1990)) * 100}%, var(--red) ${((1996 - 1990) / (2010 - 1990)) * 100}%)`,
                opacity: 0.5,
              }} />
              {/* 1996 marker on track */}
              <div style={{
                position: 'absolute', left: `${((1996 - 1990) / (2010 - 1990)) * 100}%`,
                width: 1, height: 12, background: 'var(--amber)', transform: 'translateX(-0.5px)',
              }} />
              <input type="range" min={1990} max={2010} value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                style={{
                  width: '100%', position: 'relative', zIndex: 1,
                  WebkitAppearance: 'none', background: 'transparent', cursor: 'pointer', height: 24,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span className="mono" style={{ fontSize: 9, color: 'var(--ink-dimmer)' }}>1990</span>
              <span className="mono" style={{ fontSize: 9, color: 'var(--amber)', opacity: 0.7 }}>1996</span>
              <span className="mono" style={{ fontSize: 9, color: 'var(--ink-dimmer)' }}>2010</span>
            </div>
          </div>
        </div>

        {/* Map */}
        <div style={{ position: 'relative', padding: '0 24px' }}>
          <svg viewBox="0 0 1000 440" style={{ display: 'block', width: '100%', height: 'auto' }}>
            {/* US outline */}
            <path d={US_OUTLINE} fill="none" stroke="var(--line)" strokeWidth="1.2" opacity="0.5" />

            {/* Market dots */}
            {markets.map((market, i) => {
              const pos = MARKET_POSITIONS[market.name];
              if (!pos) return null;
              const concKey = 'c' + year;
              const conc = market[concKey] != null ? market[concKey] : 0;
              const color = window.consolidationColor(conc);
              const r = Math.max(4, Math.min(18, Math.sqrt(market.stations || 10) * 1.5));
              const isHovered = hoveredMarket === market.name;
              const isSelected = selectedMarket && selectedMarket.name === market.name;
              return (
                <g key={market.name}>
                  <circle
                    cx={pos[0]} cy={pos[1]} r={isHovered || isSelected ? r + 2 : r}
                    fill={color}
                    opacity={isHovered || isSelected ? 1 : 0.75}
                    stroke={isSelected ? 'var(--gold)' : isHovered ? 'var(--ink)' : 'none'}
                    strokeWidth={isSelected ? 2 : 1}
                    style={{ cursor: 'pointer', transition: 'fill 400ms ease, r 200ms ease' }}
                    onMouseEnter={() => setHoveredMarket(market.name)}
                    onMouseLeave={() => setHoveredMarket(null)}
                    onClick={() => setSelectedMarket(market)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredMarket && (() => {
            const market = markets.find(m => m.name === hoveredMarket);
            const pos = MARKET_POSITIONS[hoveredMarket];
            if (!market || !pos) return null;
            const concKey = 'c' + year;
            const conc = market[concKey] != null ? market[concKey] : 0;
            // Convert SVG coords to percentage for tooltip positioning
            const leftPct = (pos[0] / 1000) * 100;
            const topPct = (pos[1] / 440) * 100;
            return (
              <div style={{
                position: 'absolute', left: `${leftPct}%`, top: `${topPct}%`,
                transform: 'translate(-50%, -110%)',
                border: '1px solid var(--line)', background: 'rgba(10,10,10,0.95)',
                padding: '8px 12px', pointerEvents: 'none', zIndex: 10, minWidth: 140,
              }}>
                <div className="mono" style={{ color: 'var(--ink)', fontSize: 11, fontWeight: 700 }}>
                  {market.name}
                </div>
                <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 10, marginTop: 3 }}>
                  Stations: {market.stations || '—'}
                </div>
                <div className="mono" style={{ color: window.consolidationColor(conc), fontSize: 10, marginTop: 2 }}>
                  Concentration: {typeof conc === 'number' ? conc.toFixed(0) + '%' : '—'}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px 16px' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--blue)' }} />
              <span className="mono" style={{ fontSize: 9, color: 'var(--ink-dim)', textTransform: 'uppercase' }}>Independent</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)' }} />
              <span className="mono" style={{ fontSize: 9, color: 'var(--ink-dim)', textTransform: 'uppercase' }}>Transitioning</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--red)' }} />
              <span className="mono" style={{ fontSize: 9, color: 'var(--ink-dim)', textTransform: 'uppercase' }}>Consolidated</span>
            </span>
          </div>
          <Confidence level="high" />
        </div>
      </div>

      {/* Transaction Log */}
      <div style={{ marginTop: 40 }}>
        <div style={{ marginBottom: 12 }}>
          <Tick>SHOWING {transfers.length} TRANSFERS IN {year}</Tick>
        </div>

        <div style={{
          border: '1px solid var(--line)', background: 'rgba(20,20,20,0.4)',
          maxHeight: 400, overflowY: 'auto', padding: '4px 0',
        }}>
          {transfers.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <div className="mono" style={{ color: 'var(--ink-dimmer)', fontSize: 12 }}>
                No transfers recorded for {year}.
              </div>
            </div>
          ) : (
            transfers.slice(0, 50).map((t, i) => (
              <div key={i} style={{
                animation: i < 20 ? `fadeUp 0.4s ease ${i * 0.04}s both` : 'none',
              }}>
                <TransferRecord {...t} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Market Deep-Dive Panel */}
      {selectedMarket && (
        <MarketDeepDive market={selectedMarket} year={year} onClose={() => setSelectedMarket(null)} />
      )}
    </div>
  );
}

function MarketDeepDive({ market, year, onClose }) {
  const concKey = 'c' + year;
  const conc = market[concKey] != null ? market[concKey] : 0;

  // Generate synthetic station call signs and timeline for the market
  const stationCount = market.stations || 8;
  const callSigns = [];
  const prefixes = ['W', 'K'];
  const prefix = (MARKET_POSITIONS[market.name] || [500])[0] > 500 ? 'W' : 'K';
  const suffixes = 'ABCDEFGHIJKLMNOPQRSTUVXYZ';
  for (let i = 0; i < Math.min(stationCount, 16); i++) {
    const s1 = suffixes[i % 24];
    const s2 = suffixes[(i * 7 + 3) % 24];
    const s3 = suffixes[(i * 13 + 11) % 24];
    callSigns.push(prefix + s1 + s2 + s3);
  }

  // Timeline segments: show ownership periods
  const segments = [];
  const segYears = [];
  for (let y = 1990; y <= 2010; y++) segYears.push(y);
  const transitionYear = 1996 + Math.floor((market.name.charCodeAt(0) % 5));

  return (
    <div style={{
      marginTop: 32, border: '1px solid var(--gold)', background: 'rgba(20,20,20,0.95)',
      padding: '24px 28px', position: 'relative',
      animation: 'fadeUp 0.3s ease both',
    }}>
      {/* Close button */}
      <button onClick={onClose} style={{
        position: 'absolute', top: 16, right: 16, background: 'none', border: '1px solid var(--line)',
        color: 'var(--ink-dim)', width: 28, height: 28, cursor: 'pointer', fontSize: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono',
      }}>
        <Icon name="x" size={14} color="var(--ink-dim)" />
      </button>

      {/* Market name */}
      <div className="garamond" style={{ fontSize: 28, color: 'var(--ink)', letterSpacing: -0.3 }}>
        {market.name}
      </div>
      <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 10, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.15 }}>
        {market.stations || '—'} stations · {typeof conc === 'number' ? conc.toFixed(0) : '—'}% consolidated in {year}
      </div>

      {/* Call signs grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
        {callSigns.map((cs, i) => (
          <CallSign key={cs} sign={cs} />
        ))}
      </div>

      {/* Ownership timeline bar */}
      <div style={{ marginTop: 24 }}>
        <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.15, marginBottom: 8 }}>
          Ownership Timeline · 1990–2010
        </div>
        <div style={{ display: 'flex', height: 18, border: '1px solid var(--line)', overflow: 'hidden' }}>
          {segYears.map(y => {
            const isConglomerate = y >= transitionYear;
            const widthPct = 100 / segYears.length;
            return (
              <div key={y} style={{
                width: `${widthPct}%`, height: '100%',
                background: isConglomerate ? 'var(--red)' : 'var(--blue)',
                opacity: y === year ? 1 : 0.6,
                borderRight: '1px solid var(--bg)',
                transition: 'opacity 200ms ease',
              }} title={`${y}: ${isConglomerate ? 'Conglomerate' : 'Independent'}`} />
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--ink-dimmer)' }}>1990</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, background: 'var(--blue)' }} />
              <span className="mono" style={{ fontSize: 8, color: 'var(--ink-dim)' }}>Independent</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, background: 'var(--red)' }} />
              <span className="mono" style={{ fontSize: 8, color: 'var(--ink-dim)' }}>Conglomerate</span>
            </span>
          </div>
          <span className="mono" style={{ fontSize: 9, color: 'var(--ink-dimmer)' }}>2010</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TabTransfer });
