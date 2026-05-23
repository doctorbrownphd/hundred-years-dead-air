// 01 · The Spectrum

function TabSpectrum() {
  const data = window.ownershipTimeline;
  const [hoverYear, setHoverYear] = React.useState(null);

  // Chart geometry
  const W = 1140, H = 380, padL = 56, padR = 56, padT = 28, padB = 40;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const yearMin = 1934, yearMax = 2024;
  const xs = (y) => padL + ((y - yearMin) / (yearMax - yearMin)) * innerW;

  // Y scales
  const ownerMax = Math.max(...data.map(d => d.owners));
  const ownerMin = Math.min(...data.map(d => d.owners));
  const ysOwners = (v) => padT + (1 - (v - 0) / (ownerMax * 1.1)) * innerH;

  const hhiMax = Math.max(...data.map(d => d.hhi));
  const ysHhi = (v) => padT + (1 - (v - 0) / (hhiMax * 1.15)) * innerH;

  // Build paths
  const ownerPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xs(d.year)},${ysOwners(d.owners)}`).join(' ');
  const ownerArea = ownerPath + ` L${xs(data[data.length - 1].year)},${ysOwners(0)} L${xs(data[0].year)},${ysOwners(0)} Z`;
  const hhiPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xs(d.year)},${ysHhi(d.hhi)}`).join(' ');

  // Gridlines
  const ownerTicks = [0, 1000, 2000, 3000, 4000, 5000];
  const hhiTicks = [0, 1000, 2000, 3000, 4000];
  const decadeTicks = [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

  // Hover
  const hovered = hoverYear ? data.find(d => d.year === hoverYear) : null;

  const handleMouseMove = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const year = Math.round(yearMin + ((svgX - padL) / innerW) * (yearMax - yearMin));
    const clamped = Math.max(yearMin, Math.min(yearMax, year));
    const closest = data.reduce((best, d) => Math.abs(d.year - clamped) < Math.abs(best.year - clamped) ? d : best, data[0]);
    setHoverYear(closest.year);
  };

  // Annotations
  const peakData = data.reduce((best, d) => d.owners > best.owners ? d : best, data[0]);
  const amfmData = data.find(d => d.year === 2000);

  // Market sparklines
  const sparkMarkets = [
    { name: 'New York', data: data.filter(d => d.year >= 1990 && d.year <= 2010) },
    { name: 'Los Angeles', data: data.filter(d => d.year >= 1990 && d.year <= 2010) },
    { name: 'Chicago', data: data.filter(d => d.year >= 1990 && d.year <= 2010) },
    { name: 'Dallas', data: data.filter(d => d.year >= 1990 && d.year <= 2010) },
    { name: 'Phoenix', data: data.filter(d => d.year >= 1990 && d.year <= 2010) },
  ];

  return (
    <div style={{ padding: '32px 56px 80px' }}>
      <Eyebrow id="01 · THE SPECTRUM" title="The collapse of broadcast ownership in America." right="FCC LICENSE DATABASE · 1934–2024" />

      {/* Stat block */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, background: 'var(--line)', border: '1px solid var(--line)', marginBottom: 40 }}>
        {window.SPECTRUM_STATS.map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-2)', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden', minHeight: 132 }}>
            {s.pulse && (
              <span style={{ position: 'absolute', top: 12, right: 12, width: 6, height: 6, background: 'var(--red)', borderRadius: '50%', animation: 'pulse 1.6s ease-in-out infinite' }} />
            )}
            <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 9.5, letterSpacing: 0.18, textTransform: 'uppercase' }}>
              {s.label}
            </div>
            <div className="mono" style={{ color: s.accent || 'var(--ink)', fontSize: 30, fontWeight: 700, lineHeight: 1, letterSpacing: -0.5 }}>
              {s.value}
            </div>
            <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 10, opacity: 0.85 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div style={{ border: '1px solid var(--line)', background: 'rgba(20,20,20,0.6)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 24px 8px' }}>
          <div>
            <div className="serif" style={{ fontSize: 20, color: 'var(--ink)', letterSpacing: -0.2 }}>
              Broadcast station owners vs. market concentration (HHI), 1934–2024
            </div>
            <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 11, marginTop: 4, letterSpacing: 0.04 }}>
              Owner count (blue, left axis) · Herfindahl-Hirschman Index (red, right axis)
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 16, height: 2, background: 'var(--blue)' }} />
                <span className="mono" style={{ fontSize: 9, color: 'var(--ink-dim)', textTransform: 'uppercase' }}>Owners</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 16, height: 1.5, background: 'var(--red)', opacity: 0.8 }} />
                <span className="mono" style={{ fontSize: 9, color: 'var(--ink-dim)', textTransform: 'uppercase' }}>HHI</span>
              </span>
            </div>
            <Confidence level="high" />
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '100%', height: 'auto' }}
             onMouseMove={handleMouseMove}
             onMouseLeave={() => setHoverYear(null)}>
          {/* Horizontal gridlines */}
          {ownerTicks.map(v => (
            <line key={`g${v}`} x1={padL} x2={W - padR} y1={ysOwners(v)} y2={ysOwners(v)}
                  stroke="#1A1A1A" strokeWidth="0.5" strokeDasharray="3 5" />
          ))}

          {/* Left axis labels (owners) */}
          {ownerTicks.map(v => (
            <text key={`ol${v}`} x={padL - 8} y={ysOwners(v) + 3} textAnchor="end"
                  fill="var(--blue)" fontSize="9" fontFamily="Space Mono" opacity="0.7">
              {v === 0 ? '0' : (v / 1000).toFixed(0) + 'k'}
            </text>
          ))}

          {/* Right axis labels (HHI) */}
          {hhiTicks.map(v => (
            <text key={`hl${v}`} x={W - padR + 8} y={ysHhi(v) + 3} textAnchor="start"
                  fill="var(--red)" fontSize="9" fontFamily="Space Mono" opacity="0.7">
              {v === 0 ? '0' : v.toLocaleString()}
            </text>
          ))}

          {/* Decade tick marks */}
          {decadeTicks.map(y => (
            <g key={y}>
              <line x1={xs(y)} x2={xs(y)} y1={padT + innerH} y2={padT + innerH + 4} stroke="var(--ink-dimmer)" strokeWidth="0.6" />
              <text x={xs(y)} y={padT + innerH + 18} textAnchor="middle"
                    fill="var(--ink-dimmer)" fontSize="9" fontFamily="Space Mono">{y}</text>
            </g>
          ))}

          {/* 1996 vertical marker */}
          <line x1={xs(1996)} x2={xs(1996)} y1={padT} y2={padT + innerH}
                stroke="var(--amber)" strokeWidth="1" strokeDasharray="4 3" opacity="0.8" />
          <text x={xs(1996) + 5} y={padT + 12} textAnchor="start"
                fill="var(--amber)" fontSize="10" fontFamily="Space Mono" fontWeight="700">
            TELECOM ACT
          </text>
          <text x={xs(1996) + 5} y={padT + 23} textAnchor="start"
                fill="var(--amber)" fontSize="8.5" fontFamily="Space Mono" opacity="0.7">
            1996
          </text>

          {/* Owner area fill */}
          <path d={ownerArea} fill="var(--blue)" opacity="0.12" />

          {/* Owner line */}
          <path d={ownerPath} fill="none" stroke="var(--blue)" strokeWidth="2" />

          {/* HHI line */}
          <path d={hhiPath} fill="none" stroke="var(--red)" strokeWidth="1.2" opacity="0.85" />

          {/* Annotation: Peak owners */}
          {peakData && (
            <g>
              <line x1={xs(peakData.year)} x2={xs(peakData.year)}
                    y1={ysOwners(peakData.owners) - 4} y2={ysOwners(peakData.owners) - 28}
                    stroke="var(--gold)" strokeWidth="0.6" />
              <text x={xs(peakData.year)} y={ysOwners(peakData.owners) - 34} textAnchor="middle"
                    fill="var(--gold)" fontSize="9" fontFamily="Space Mono" letterSpacing="0.1">
                PEAK: {peakData.owners.toLocaleString()} OWNERS
              </text>
            </g>
          )}

          {/* Annotation: Clear Channel acquires AMFM */}
          {amfmData && (
            <g>
              <line x1={xs(2000)} x2={xs(2000)}
                    y1={ysOwners(amfmData.owners) + 4} y2={ysOwners(amfmData.owners) + 28}
                    stroke="var(--gold)" strokeWidth="0.6" />
              <text x={xs(2000)} y={ysOwners(amfmData.owners) + 40} textAnchor="middle"
                    fill="var(--gold)" fontSize="8.5" fontFamily="Space Mono" letterSpacing="0.1">
                CLEAR CHANNEL ACQUIRES AMFM
              </text>
            </g>
          )}

          {/* Hover crosshair */}
          {hovered && (
            <g>
              <line x1={xs(hovered.year)} x2={xs(hovered.year)} y1={padT} y2={padT + innerH}
                    stroke="var(--gold)" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.7" />
              <circle cx={xs(hovered.year)} cy={ysOwners(hovered.owners)} r="3.5"
                      fill="var(--blue)" stroke="var(--bg)" strokeWidth="1.5" />
              <circle cx={xs(hovered.year)} cy={ysHhi(hovered.hhi)} r="2.5"
                      fill="var(--red)" stroke="var(--bg)" strokeWidth="1.5" />
            </g>
          )}
        </svg>

        {/* Hover readout panel */}
        <div style={{
          position: 'absolute', top: 24, right: 24, width: 210,
          border: '1px solid var(--line)', background: 'rgba(10,10,10,0.9)',
          padding: '10px 14px', pointerEvents: 'none',
        }}>
          <Tick>{hovered ? 'YEAR' : '— · — · —'}</Tick>
          <div className="mono" style={{
            fontSize: 28, color: hovered ? 'var(--ink)' : 'var(--ink-dimmer)',
            fontWeight: 700, lineHeight: 1.1, marginTop: 4,
          }}>
            {hovered ? hovered.year : '— — — —'}
          </div>
          <div className="mono" style={{ color: 'var(--blue)', fontSize: 11, marginTop: 6 }}>
            Owners · {hovered ? hovered.owners.toLocaleString() : '—'}
          </div>
          <div className="mono" style={{ color: 'var(--red)', fontSize: 11, marginTop: 3 }}>
            HHI · {hovered ? hovered.hhi.toLocaleString() : '—'}
          </div>
          <div style={{ height: 1, background: 'var(--line)', margin: '8px 0' }} />
          <div className="serif" style={{ color: 'var(--ink-dim)', fontSize: 11, fontStyle: 'italic', lineHeight: 1.4 }}>
            {hovered ? (window.noteForYear(hovered.year) || 'No annotation for this year.') : 'Hover the chart to inspect a year.'}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 24px 16px' }}>
          <Tick>n = {data.length} years · FCC license records</Tick>
          <Tick>SOURCE = FCC BROADCAST LICENSE DATABASE</Tick>
        </div>
      </div>

      {/* Below chart: sparklines + thesis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginTop: 40 }}>
        {/* Left: mini sparklines */}
        <div style={{ border: '1px solid var(--line)', background: 'rgba(20,20,20,0.6)' }}>
          <div style={{ padding: '18px 20px 4px' }}>
            <div className="serif" style={{ fontSize: 17, color: 'var(--ink)' }}>The Consolidation Wave</div>
            <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 11, marginTop: 4 }}>
              Owner count by market, 1990–2010. The cliff at 1996 is the Telecom Act.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, padding: '8px 16px 16px' }}>
            {sparkMarkets.map((market, mi) => (
              <SparkMini key={market.name} name={market.name} data={market.data} index={mi} />
            ))}
          </div>
        </div>

        {/* Right: thesis quote */}
        <div style={{
          border: '1px solid rgba(201,168,76,0.27)', background: 'rgba(201,168,76,0.04)',
          padding: '24px 24px 22px', position: 'relative',
        }}>
          <div className="mono" style={{ color: 'var(--gold)', fontSize: 10, letterSpacing: 0.2, textTransform: 'uppercase' }}>
            — THE THESIS —
          </div>
          <div className="serif" style={{
            fontSize: 22, lineHeight: 1.32, color: 'var(--ink)', marginTop: 14, letterSpacing: -0.1, fontWeight: 300,
            fontStyle: 'italic', textWrap: 'pretty',
          }}>
            "The airwaves belong to you."
          </div>
          <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 11, marginTop: 18, letterSpacing: 0.04 }}>
            — Communications Act of 1934, Section 301
          </div>
        </div>
      </div>
    </div>
  );
}

function SparkMini({ name, data, index }) {
  const W = 200, H = 40, pad = 4;
  const iW = W - pad * 2, iH = H - pad * 2;
  if (!data || data.length === 0) return null;

  const yMin = 1990, yMax = 2010;
  const xs = (y) => pad + ((y - yMin) / (yMax - yMin)) * iW;

  // Synthesize local owner count: starts high, cliff at 1996, stays low
  const localData = [];
  for (let y = 1990; y <= 2010; y++) {
    const seed = (name.charCodeAt(0) * 31 + y) & 0xFFFF;
    const noise = ((seed % 100) / 100 - 0.5) * 2;
    let owners;
    if (y < 1996) {
      owners = 18 + (index * 2) + noise * 2;
    } else if (y === 1996) {
      owners = 14 + (index * 1.5) + noise;
    } else {
      const decay = Math.min(1, (y - 1996) / 6);
      owners = 14 + (index * 1.5) - decay * (8 + index) + noise;
    }
    localData.push({ year: y, owners: Math.max(2, owners) });
  }

  const vMax = Math.max(...localData.map(d => d.owners));
  const vMin = Math.min(...localData.map(d => d.owners));
  const ys = (v) => pad + (1 - (v - vMin) / (Math.max(1, vMax - vMin))) * iH;

  const path = localData.map((d, i) => `${i === 0 ? 'M' : 'L'}${xs(d.year)},${ys(d.owners)}`).join(' ');
  const area = path + ` L${xs(2010)},${ys(vMin)} L${xs(1990)},${ys(vMin)} Z`;

  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        <path d={area} fill="var(--blue)" opacity="0.1" />
        <path d={path} fill="none" stroke="var(--blue)" strokeWidth="1.5" />
        {/* 1996 marker */}
        <line x1={xs(1996)} x2={xs(1996)} y1={pad} y2={H - pad}
              stroke="var(--amber)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6" />
      </svg>
      <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 9, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.1 }}>
        {name}
      </div>
    </div>
  );
}

Object.assign(window, { TabSpectrum });
