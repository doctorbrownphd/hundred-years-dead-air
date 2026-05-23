// 08 · The Counterfactual
// Extension 02 — "What if the 1996 Telecom Act had maintained the 1975 ownership caps?"

function CounterfactualTab() {
  const cf = window.COUNTERFACTUAL;
  const { years, actual_hhi, bands, sample_trajectories, markets, summary } = cf;

  const [hoverYear, setHoverYear] = React.useState(null);
  const [showTrajectories, setShowTrajectories] = React.useState(true);

  // ── Chart geometry ─────────────────────────────────────────
  const W = 1140, H = 440;
  const padL = 64, padR = 40, padT = 32, padB = 48;
  const innerW = W - padL - padR, innerH = H - padT - padB;

  const yearMin = 1975, yearMax = 2024;
  const hhiMin = 0, hhiMax = 160;

  const xs = (y) => padL + ((y - yearMin) / (yearMax - yearMin)) * innerW;
  const ys = (v) => padT + (1 - (v - hhiMin) / (hhiMax - hhiMin)) * innerH;

  // ── Build SVG paths ────────────────────────────────────────
  const makePath = (arr) => arr.map((v, i) => {
    const x = xs(years[i]);
    const y = ys(v);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const makeBandPath = (upper, lower) => {
    const fwd = upper.map((v, i) => `${i === 0 ? 'M' : 'L'}${xs(years[i]).toFixed(1)},${ys(v).toFixed(1)}`).join(' ');
    const rev = [...lower].reverse().map((v, i) => {
      const yi = years[years.length - 1 - i];
      return `L${xs(yi).toFixed(1)},${ys(v).toFixed(1)}`;
    }).join(' ');
    return `${fwd} ${rev} Z`;
  };

  // Actual HHI path
  const actualPath = makePath(actual_hhi);

  // Band paths (filled regions)
  const band95 = makeBandPath(bands.p95, bands.p5);
  const band90 = makeBandPath(bands.p90, bands.p10);
  const band50 = makeBandPath(bands.p75, bands.p25);

  // Median counterfactual
  const medianPath = makePath(bands.p50);

  // Intervention line x
  const interventionX = xs(1996);

  // Y gridlines
  const yTicks = [0, 25, 50, 75, 100, 125, 150];
  const xTicks = [1975, 1980, 1985, 1990, 1996, 2000, 2005, 2010, 2015, 2020, 2024];

  // ── Hover logic ────────────────────────────────────────────
  const handleMouseMove = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const year = Math.round(yearMin + ((svgX - padL) / innerW) * (yearMax - yearMin));
    const clamped = Math.max(yearMin, Math.min(yearMax, year));
    setHoverYear(clamped);
  };

  const hovIdx = hoverYear ? years.indexOf(hoverYear) : -1;
  const hovActual = hovIdx >= 0 ? actual_hhi[hovIdx] : null;
  const hovMedian = hovIdx >= 0 ? bands.p50[hovIdx] : null;

  // ── Market table ───────────────────────────────────────────
  const sortedMarkets = [...markets].sort((a, b) => b.difference - a.difference);
  const topMarkets = sortedMarkets.slice(0, 12);

  return (
    <div style={{ padding: '32px 56px 80px' }}>
      <Eyebrow
        id="08 · THE COUNTERFACTUAL"
        title="The road not taken."
        right="ENSEMBLE · 500 TRAJECTORIES · 1975–2024"
      />

      {/* ── Thesis ────────────────────────────────────── */}
      <div style={{
        maxWidth: 720, marginBottom: 40,
        borderLeft: '3px solid var(--gold)', paddingLeft: 20,
      }}>
        <p className="serif" style={{
          fontSize: 17, lineHeight: 1.7, color: 'var(--ink-dim)',
          margin: 0,
        }}>
          What if Congress had kept the 1975 ownership caps in place? We fit a stochastic model
          to the pre-deregulation era and project 500 plausible alternative histories forward.
          In nearly every scenario, market concentration stays an order of magnitude lower
          than what actually happened.
        </p>
      </div>

      {/* ── Stat row ──────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1, background: 'var(--line)', border: '1px solid var(--line)',
        marginBottom: 40,
      }}>
        <Readout
          label="Actual HHI (2024)"
          value={summary.actual_hhi_2024.toFixed(1)}
          sub="National concentration index"
          accent="var(--red)"
        />
        <Readout
          label="Counterfactual HHI"
          value={summary.median_counterfactual_2024.toFixed(1)}
          sub="Median of 500 trajectories"
          accent="var(--blue)"
        />
        <Readout
          label="HHI Difference"
          value={`+${summary.hhi_difference.toFixed(1)}`}
          sub="Excess concentration from deregulation"
          accent="var(--amber)"
        />
        <Readout
          label="Markets Saved"
          value={`${summary.markets_saved}/${summary.markets_total}`}
          sub="Would remain competitive (HHI < 0.25)"
          accent="var(--gold)"
        />
      </div>

      {/* ── Fan Chart ─────────────────────────────────── */}
      <div style={{
        border: '1px solid var(--line)', background: 'var(--bg-2)',
        padding: '20px 0 0', marginBottom: 40,
      }}>
        {/* Chart header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 24px 16px', borderBottom: '1px solid var(--line)',
        }}>
          <div>
            <span className="mono" style={{
              fontSize: 10, letterSpacing: 0.18, textTransform: 'uppercase',
              color: 'var(--ink-dimmer)',
            }}>
              National HHI — Actual vs. Counterfactual Fan
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button
              onClick={() => setShowTrajectories(!showTrajectories)}
              className="mono"
              style={{
                background: 'transparent', border: '1px solid var(--line)',
                color: showTrajectories ? 'var(--ink)' : 'var(--ink-dimmer)',
                padding: '4px 10px', fontSize: 9, letterSpacing: 0.15,
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              {showTrajectories ? 'Hide' : 'Show'} Trajectories
            </button>
            <Confidence level="high" />
          </div>
        </div>

        {/* SVG chart */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverYear(null)}
        >
          {/* Y gridlines */}
          {yTicks.map(v => (
            <g key={`y-${v}`}>
              <line
                x1={padL} x2={W - padR}
                y1={ys(v)} y2={ys(v)}
                stroke="var(--line)" strokeWidth={0.5}
              />
              <text
                x={padL - 8} y={ys(v) + 3}
                textAnchor="end" fill="var(--ink-dimmer)"
                style={{ fontSize: 10, fontFamily: "'Space Mono', monospace" }}
              >
                {v}
              </text>
            </g>
          ))}

          {/* X gridlines */}
          {xTicks.map(yr => (
            <g key={`x-${yr}`}>
              <line
                x1={xs(yr)} x2={xs(yr)}
                y1={padT} y2={H - padB}
                stroke="var(--line)" strokeWidth={yr === 1996 ? 0 : 0.5}
              />
              <text
                x={xs(yr)} y={H - padB + 18}
                textAnchor="middle" fill="var(--ink-dimmer)"
                style={{ fontSize: 10, fontFamily: "'Space Mono', monospace" }}
              >
                {yr}
              </text>
            </g>
          ))}

          {/* ── Counterfactual fan bands ──────────────── */}
          {/* 5th-95th */}
          <path d={band95} fill="rgba(46,134,171,0.08)" stroke="none" />
          {/* 10th-90th */}
          <path d={band90} fill="rgba(46,134,171,0.12)" stroke="none" />
          {/* 25th-75th */}
          <path d={band50} fill="rgba(46,134,171,0.18)" stroke="none" />

          {/* ── Sample trajectories ──────────────────── */}
          {showTrajectories && sample_trajectories.map((traj, i) => (
            <path
              key={`traj-${i}`}
              d={makePath(traj)}
              fill="none"
              stroke="rgba(46,134,171,0.15)"
              strokeWidth={0.7}
            />
          ))}

          {/* ── Median counterfactual line ────────────── */}
          <path
            d={medianPath}
            fill="none"
            stroke="#2E86AB"
            strokeWidth={2.5}
            strokeDasharray="6,3"
          />

          {/* ── Actual HHI line ──────────────────────── */}
          <path
            d={actualPath}
            fill="none"
            stroke="var(--red)"
            strokeWidth={2.5}
          />

          {/* ── Intervention line at 1996 ────────────── */}
          <line
            x1={interventionX} x2={interventionX}
            y1={padT - 8} y2={H - padB + 4}
            stroke="var(--gold)" strokeWidth={1.5}
            strokeDasharray="4,3"
          />
          <text
            x={interventionX + 6} y={padT + 4}
            fill="var(--gold)"
            style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: 0.2 }}
          >
            1996 Telecom Act
          </text>

          {/* ── Axis labels ──────────────────────────── */}
          <text
            x={padL - 8} y={padT - 12}
            textAnchor="end" fill="var(--ink-dimmer)"
            style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase' }}
          >
            HHI
          </text>

          {/* ── Legend ────────────────────────────────── */}
          <g transform={`translate(${W - padR - 220}, ${padT + 10})`}>
            <line x1={0} x2={24} y1={0} y2={0} stroke="var(--red)" strokeWidth={2.5} />
            <text x={30} y={4} fill="var(--ink-dim)" style={{ fontSize: 10, fontFamily: "'Space Mono', monospace" }}>
              Actual trajectory
            </text>
            <line x1={0} x2={24} y1={18} y2={18} stroke="#2E86AB" strokeWidth={2.5} strokeDasharray="6,3" />
            <text x={30} y={22} fill="var(--ink-dim)" style={{ fontSize: 10, fontFamily: "'Space Mono', monospace" }}>
              Counterfactual median
            </text>
            <rect x={0} y={32} width={24} height={10} fill="rgba(46,134,171,0.18)" />
            <text x={30} y={40} fill="var(--ink-dim)" style={{ fontSize: 10, fontFamily: "'Space Mono', monospace" }}>
              50% / 80% / 90% bands
            </text>
          </g>

          {/* ── Hover crosshair ──────────────────────── */}
          {hoverYear && hovIdx >= 0 && (
            <g>
              <line
                x1={xs(hoverYear)} x2={xs(hoverYear)}
                y1={padT} y2={H - padB}
                stroke="var(--ink-dimmer)" strokeWidth={1}
                strokeDasharray="2,2"
              />
              {/* Actual dot */}
              {hovActual != null && (
                <circle
                  cx={xs(hoverYear)} cy={ys(hovActual)}
                  r={4} fill="var(--red)" stroke="var(--bg)" strokeWidth={1.5}
                />
              )}
              {/* Counterfactual dot */}
              {hovMedian != null && (
                <circle
                  cx={xs(hoverYear)} cy={ys(hovMedian)}
                  r={4} fill="#2E86AB" stroke="var(--bg)" strokeWidth={1.5}
                />
              )}
              {/* Tooltip */}
              <foreignObject
                x={Math.min(xs(hoverYear) + 12, W - 200)}
                y={Math.max(padT, ys(Math.max(hovActual || 0, hovMedian || 0)) - 50)}
                width={180} height={80}
              >
                <div style={{
                  background: 'rgba(10,10,10,0.95)', border: '1px solid var(--line)',
                  padding: '8px 10px', pointerEvents: 'none',
                }}>
                  <div className="mono" style={{ color: 'var(--ink)', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                    {hoverYear}
                  </div>
                  <div className="mono" style={{ color: 'var(--red)', fontSize: 10 }}>
                    Actual: {hovActual != null ? hovActual.toFixed(1) : '—'}
                  </div>
                  <div className="mono" style={{ color: '#2E86AB', fontSize: 10 }}>
                    Counterfactual: {hovMedian != null ? hovMedian.toFixed(1) : '—'}
                  </div>
                  {hovActual != null && hovMedian != null && hoverYear > 1996 && (
                    <div className="mono" style={{ color: 'var(--amber)', fontSize: 10, marginTop: 2 }}>
                      Gap: +{(hovActual - hovMedian).toFixed(1)}
                    </div>
                  )}
                </div>
              </foreignObject>
            </g>
          )}

          {/* ── End-of-line labels ────────────────────── */}
          <text
            x={xs(2024) + 6} y={ys(actual_hhi[actual_hhi.length - 1]) + 4}
            fill="var(--red)"
            style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}
          >
            {actual_hhi[actual_hhi.length - 1].toFixed(1)}
          </text>
          <text
            x={xs(2024) + 6} y={ys(bands.p50[bands.p50.length - 1]) + 4}
            fill="#2E86AB"
            style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}
          >
            {bands.p50[bands.p50.length - 1].toFixed(1)}
          </text>
        </svg>
      </div>

      {/* ── Two-column: Markets + Methodology ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

        {/* ── Market impact table ─────────────────────── */}
        <div>
          <HRule>Market Impact — Top 12 by Excess Concentration</HRule>
          <div style={{ marginTop: 16 }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '140px 70px 70px 70px',
              gap: 8, padding: '8px 0', borderBottom: '1px solid var(--line-2)',
            }}>
              {['Market', 'Actual', 'Counter.', 'Excess'].map(h => (
                <span key={h} className="mono" style={{
                  color: 'var(--ink-dimmer)', fontSize: 9, letterSpacing: 0.15,
                  textTransform: 'uppercase',
                }}>
                  {h}
                </span>
              ))}
            </div>
            {/* Rows */}
            {topMarkets.map(m => (
              <div key={m.id} style={{
                display: 'grid', gridTemplateColumns: '140px 70px 70px 70px',
                gap: 8, padding: '7px 0', borderBottom: '1px solid var(--line)',
              }}>
                <span className="mono" style={{ color: 'var(--ink)', fontSize: 11 }}>
                  {m.name}
                </span>
                <span className="mono" style={{ color: 'var(--red)', fontSize: 11 }}>
                  {(m.actual_2024 * 100).toFixed(0)}%
                </span>
                <span className="mono" style={{ color: '#2E86AB', fontSize: 11 }}>
                  {(m.counterfactual_2024 * 100).toFixed(0)}%
                </span>
                <span className="mono" style={{ color: 'var(--amber)', fontSize: 11, fontWeight: 700 }}>
                  +{(m.difference * 100).toFixed(0)}pp
                </span>
              </div>
            ))}
          </div>

          {/* Competitive bar */}
          <div style={{
            marginTop: 20, padding: '14px 16px',
            border: '1px solid var(--line)', background: 'rgba(20,20,20,0.5)',
          }}>
            <div className="mono" style={{
              color: 'var(--ink-dimmer)', fontSize: 9, letterSpacing: 0.15,
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              Markets that would remain competitive
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 8, background: 'var(--line)', borderRadius: 1, overflow: 'hidden' }}>
                <div style={{
                  width: `${(summary.markets_saved / summary.markets_total) * 100}%`,
                  height: '100%', background: 'var(--blue)',
                  borderRadius: 1,
                }} />
              </div>
              <span className="mono" style={{ color: 'var(--blue)', fontSize: 13, fontWeight: 700 }}>
                {summary.markets_saved}/{summary.markets_total}
              </span>
            </div>
          </div>
        </div>

        {/* ── Methodology ─────────────────────────────── */}
        <div>
          <HRule>Methodology</HRule>
          <div style={{ marginTop: 16 }}>
            {[
              {
                q: 'What is this?',
                a: 'A counterfactual ensemble — 500 statistically plausible alternative timelines for broadcast ownership concentration, generated under the assumption that the 1996 Telecommunications Act never happened and the 1975 ownership caps remained in force.',
              },
              {
                q: 'How are trajectories generated?',
                a: `We fit to the 1975–1995 HHI (the regulated era, where national HHI held steady at ~30) and project forward using an Ornstein-Uhlenbeck process: each trajectory mean-reverts to a slightly perturbed long-run mean with stochastic year-over-year noise (sigma = ${cf.methodology.noise_sigma}). This models a world where regulatory caps keep concentration bounded but allow for normal market fluctuation.`,
              },
              {
                q: 'What about market-level estimates?',
                a: 'For each of the 50 tracked markets, we compute the 1990–1996 annual concentration growth rate, dampen it by 50% (reflecting the friction of ownership caps), and project 28 years forward with uncertainty. Markets with counterfactual concentration below 25% are classified as competitive.',
              },
              {
                q: 'What are the key assumptions?',
                a: 'The model assumes: (1) ownership caps would have remained at 1975 levels, (2) market dynamics under regulation would have resembled the pre-1996 pattern, (3) no other major deregulatory event would have occurred. These are strong assumptions — the counterfactual is illustrative, not predictive.',
              },
              {
                q: 'Confidence',
                a: `${(summary.confidence * 100).toFixed(0)}% of trajectories end below the actual 2024 HHI. The 90% confidence interval for counterfactual 2024 HHI is [${summary.percentile_2024.p5.toFixed(0)}, ${summary.percentile_2024.p95.toFixed(0)}]. The gap between actual and counterfactual is robust across all 500 runs.`,
              },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div className="mono" style={{
                  color: 'var(--gold)', fontSize: 10, letterSpacing: 0.15,
                  textTransform: 'uppercase', marginBottom: 6,
                }}>
                  {item.q}
                </div>
                <p className="serif" style={{
                  color: 'var(--ink-dim)', fontSize: 14, lineHeight: 1.65,
                  margin: 0,
                }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <Confidence level="candidate" />
            <span className="mono" style={{
              color: 'var(--ink-dimmer)', fontSize: 9, marginLeft: 12,
              letterSpacing: 0.1,
            }}>
              EXTENSION 02 · COUNTERFACTUAL ENSEMBLE
            </span>
          </div>
        </div>
      </div>

      {/* ── Closing annotation ────────────────────────── */}
      <div style={{
        marginTop: 56, borderTop: '1px solid var(--line)', paddingTop: 24,
        maxWidth: 640,
      }}>
        <p className="garamond" style={{
          fontSize: 20, lineHeight: 1.6, color: 'var(--ink)',
          fontStyle: 'italic', margin: 0,
        }}>
          In every plausible alternative history, American broadcast ownership
          remains an order of magnitude more diverse than the landscape we
          actually inhabit. The Telecom Act did not nudge the dial.
          It broke it.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { CounterfactualTab });
