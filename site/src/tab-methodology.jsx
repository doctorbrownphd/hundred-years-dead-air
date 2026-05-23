// 07 · The Methodology

function TabMethodology() {
  const models = [
    {
      n: 'M1',
      title: 'Ownership Consolidation',
      conf: 'high',
      lede: 'Track every FCC license transfer. Map the network of who owns what, when they acquired it, and how the graph consolidates over time.',
      body: [
        'For every broadcast license in the FCC database (1934–present), we reconstruct the chain of ownership by parsing transfer applications, call sign changes, and facility modifications. Entity resolution links variant corporate names to canonical parent companies using SEC filings and FCC ownership reports.',
        'The output is a time-varying bipartite graph: owners on one side, stations on the other. Consolidation is measured as the Herfindahl–Hirschman Index (HHI) of the market-level ownership distribution at each year. The 1996 inflection is unambiguous in every market tier.',
      ],
      params: [
        ['Records', '~2.4M transfers'],
        ['Entity resolution', 'Fuzzy match + SEC'],
        ['Market def.', 'Nielsen DMA'],
        ['Concentration', 'HHI per DMA-year'],
      ],
    },
    {
      n: 'M2',
      title: 'Content Localness Index',
      conf: 'high',
      lede: 'Measure how much of what a station broadcasts is actually about the community it is licensed to serve.',
      body: [
        'Using closed-caption transcripts and program metadata from GDELT and the Internet Archive TV News Archive, we classify each broadcast segment by local specificity: named local entities (people, institutions, geography), locally-sourced reporting acts, and story origin (local desk vs. syndicated feed).',
        'The Localness Index is the share of broadcast hours containing at least one locally-specific reporting act. Stations are compared to their own pre-acquisition baseline where available. The 18-month post-acquisition decline window is consistent across ownership groups.',
      ],
      params: [
        ['Source', 'GDELT TV, IA TV News'],
        ['NER model', 'spaCy + custom geo'],
        ['Window', '18mo pre/post acq.'],
        ['Baseline', 'Station self-ref'],
      ],
    },
    {
      n: 'M3',
      title: 'News Desert Predictor',
      conf: 'candidate',
      lede: 'Given a county\'s ownership trajectory and market characteristics, predict the probability of losing all local news coverage within five years.',
      body: [
        'A gradient-boosted classifier trained on the UNC Hussman news desert census, with features drawn from FCC license data (ownership changes, format switches, power reductions), Census demographics, and BLS employment data for NAICS 5151 (radio/TV broadcasting).',
        'The model identifies at-risk counties before they become full deserts. Validation against held-out 2020–2024 desert declarations yields AUC 0.81. Feature importance is dominated by ownership change frequency and market revenue rank.',
      ],
      params: [
        ['Algorithm', 'XGBoost'],
        ['Features', '34 (FCC + Census + BLS)'],
        ['Target', 'Desert status ±5yr'],
        ['Validation AUC', '0.81'],
      ],
    },
    {
      n: 'M4',
      title: 'Information Quality Model',
      conf: 'candidate',
      lede: 'Quantify the density of verifiable factual claims per broadcast hour and track how it changes with ownership.',
      body: [
        'Transcript-level NLP pipeline that identifies verifiable claims (statements that can be checked against public records), source attribution (named vs. unnamed), and topic classification. Information density is the count of unique verifiable claims per broadcast hour, normalized by market size.',
        'This is a candidate model — the claim extraction pipeline has known limitations with broadcast speech disfluency and crosstalk. Results are directionally consistent but confidence intervals are wide for individual stations.',
      ],
      params: [
        ['Claim extraction', 'Custom NER + rules'],
        ['Source attr.', 'Dependency parse'],
        ['Normalization', 'Per-market, per-hour'],
        ['Known limitation', 'Speech disfluency'],
      ],
    },
    {
      n: 'M5',
      title: 'Must-Run Footprint',
      conf: 'candidate',
      lede: 'Map the geographic reach of centrally-produced segments that air as if they were local content.',
      body: [
        'Must-run segments are centrally-produced packages that affiliate stations are contractually required to air, typically without identifying them as non-local content. We identify these by detecting near-duplicate transcript segments across multiple stations owned by the same parent company airing within the same broadcast window.',
        'The Deadspin moment in 2018 was the most visible example, but the practice is routine. The model maps which markets receive which must-run content and estimates the share of nominally-local airtime occupied by centrally-produced material.',
      ],
      params: [
        ['Detection', 'SimHash transcript match'],
        ['Threshold', '≥ 85% similarity'],
        ['Min stations', '≥ 3 same-owner'],
        ['Window', '±24hr broadcast'],
      ],
    },
  ];

  const confidenceLevels = [
    { level: 'HIGH CONFIDENCE', color: '#74ADD1', meaning: 'Directly observed in public data. Methodology is standard. Results are reproducible.' },
    { level: 'CANDIDATE FINDING', color: '#FDAE61', meaning: 'Directionally supported by data. Methodology involves modeling assumptions. Results should be interpreted with stated caveats.' },
    { level: 'SPECULATIVE', color: '#D73027', meaning: 'Suggested by patterns in the data. Not yet validated. Included for transparency, not as a claim.' },
    { level: 'CORRELATION', color: 'var(--ink-dim)', meaning: 'A measured statistical association. No causal claim is made or implied.' },
    { level: 'NOT ASSESSED', color: 'var(--ink-dimmer)', meaning: 'Data exists but has not been processed through any model in this analysis.' },
  ];

  const dataSources = [
    { source: 'FCC Broadcast License Database', coverage: '1934–present', type: 'Public record', use: 'M1, M5' },
    { source: 'FCC Ownership Reports (Form 323)', coverage: '2004–present', type: 'Public record', use: 'M1' },
    { source: 'Bureau of Labor Statistics (NAICS 5151)', coverage: '2004–2024', type: 'Public data', use: 'M3' },
    { source: 'UNC Hussman News Desert Census', coverage: '2016–2024', type: 'Academic', use: 'M3' },
    { source: 'Stanford Cable TV News Analyzer', coverage: '2012–present', type: 'Academic', use: 'M2, M4' },
    { source: 'Sinclair Broadcast Group SEC Filings', coverage: '1996–present', type: 'Public record', use: 'M1, M5' },
    { source: 'CDC WONDER (County Health)', coverage: '2010–2023', type: 'Public data', use: 'M4' },
    { source: 'MIT Election Data + Science Lab', coverage: '2000–2024', type: 'Academic', use: 'M3, M4' },
    { source: 'DOJ Antitrust Division (Merger Records)', coverage: '1996–present', type: 'Public record', use: 'M1' },
    { source: 'GDELT Television Explorer', coverage: '2009–present', type: 'Public data', use: 'M2, M4, M5' },
    { source: 'Internet Archive TV News Archive', coverage: '2009–present', type: 'Public archive', use: 'M2, M5' },
  ];

  return (
    <div style={{ padding: '32px 56px 80px' }}>
      <Eyebrow id="07 · METHODOLOGY"
        title="Five models. The dataset. The known unknowns."
        right="Source · FCC · Public Domain" />

      {/* Dataset card */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 40 }}>
        <div style={{ border: '1px solid var(--line)', background: 'var(--bg-2)', padding: 28 }}>
          <Tick color="var(--gold)">▌ THE DATASET</Tick>
          <div className="serif" style={{ fontSize: 24, color: 'var(--ink)', marginTop: 12, letterSpacing: -0.2, fontWeight: 300 }}>
            FCC Broadcast License Database
          </div>
          <div className="serif" style={{ fontSize: 14, color: 'var(--ink-dim)', marginTop: 14, lineHeight: 1.6, textWrap: 'pretty' }}>
            The FCC maintains a public record of every broadcast license issued, transferred, modified,
            or revoked in the United States since the Radio Act of 1927. The database includes call signs,
            facility specifications, ownership entities, transfer applications, and renewal records.
            Coverage is 1934 to present under the current regulatory framework. Public record —
            no access restrictions.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--line)', border: '1px solid var(--line)' }}>
          {[
            { l: 'TOTAL LICENSES', v: '15,445' },
            { l: 'YEARS COVERED', v: '90' },
            { l: 'MARKETS (DMA)', v: '210' },
            { l: 'TRANSFERS TRACKED', v: '2.4M' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-2)', padding: '14px 14px' }}>
              <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 9, letterSpacing: 0.15, textTransform: 'uppercase' }}>{s.l}</div>
              <div className="mono" style={{ color: 'var(--ink)', fontSize: 18, fontWeight: 700, marginTop: 4 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Five models */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {models.map(s => (
          <div key={s.n} style={{ border: '1px solid var(--line)', background: 'var(--bg-2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 300px', gap: 0 }}>
              {/* Left column — model id */}
              <div style={{ padding: '28px 24px', borderRight: '1px solid var(--line)', background: 'rgba(201,168,76,0.02)' }}>
                <div className="mono" style={{ color: 'var(--gold)', fontSize: 36, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}>{s.n}</div>
                <div className="serif" style={{ color: 'var(--ink)', fontSize: 17, marginTop: 12, letterSpacing: -0.1, lineHeight: 1.3 }}>{s.title}</div>
                <div style={{ marginTop: 14 }}><Confidence level={s.conf} /></div>
              </div>

              {/* Middle — narrative */}
              <div style={{ padding: '28px 30px' }}>
                <div className="serif" style={{ fontSize: 18, color: 'var(--ink)', fontStyle: 'italic', lineHeight: 1.35, marginBottom: 14, textWrap: 'pretty', fontWeight: 300 }}>
                  {s.lede}
                </div>
                {s.body.map((p, i) => (
                  <div key={i} className="serif" style={{ fontSize: 13.5, color: 'var(--ink-dim)', lineHeight: 1.65, marginTop: i ? 10 : 0, textWrap: 'pretty' }}>
                    {p}
                  </div>
                ))}
              </div>

              {/* Right — parameters table */}
              <div style={{ borderLeft: '1px solid var(--line)', padding: '28px 24px', background: 'rgba(10,10,10,0.4)' }}>
                <Tick>▌ PARAMETERS</Tick>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {s.params.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line)', paddingBottom: 8 }}>
                      <span className="mono" style={{ color: 'var(--ink-dim)', fontSize: 10, letterSpacing: 0.1, textTransform: 'uppercase' }}>{p[0]}</span>
                      <span className="mono" style={{ color: 'var(--ink)', fontSize: 11 }}>{p[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confidence Labeling */}
      <div style={{ marginTop: 40 }}>
        <Tick color="var(--gold)">▌ CONFIDENCE LABELING</Tick>
        <div style={{ marginTop: 14, border: '1px solid var(--line)', overflow: 'hidden' }}>
          {confidenceLevels.map((c, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '200px 1fr', gap: 0,
              borderBottom: i < confidenceLevels.length - 1 ? '1px solid var(--line)' : 'none',
            }}>
              <div style={{ padding: '12px 16px', background: 'var(--bg-2)', borderRight: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
                <span className="mono" style={{ color: c.color, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase' }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, background: c.color, borderRadius: '50%', marginRight: 8 }} />
                  {c.level}
                </span>
              </div>
              <div style={{ padding: '12px 16px' }}>
                <span className="serif" style={{ color: 'var(--ink-dim)', fontSize: 13, lineHeight: 1.5 }}>{c.meaning}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Known Unknowns */}
      <div style={{ marginTop: 40, padding: '24px 28px', border: '1px dashed var(--line-2)', background: 'rgba(10,10,10,0.4)' }}>
        <Tick color="var(--amber)">▌ KNOWN UNKNOWNS</Tick>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 }}>
          <div className="serif" style={{ fontSize: 14.5, color: 'var(--ink-dim)', lineHeight: 1.65, textWrap: 'pretty' }}>
            <strong style={{ color: 'var(--ink)' }}>Correlation vs. causation.</strong> This analysis documents statistical associations between
            ownership consolidation and content changes. We do not claim — and the data does not establish — that
            consolidation <em>causes</em> content degradation in every case. Market economics, audience fragmentation,
            and digital disruption are confounding variables that cannot be fully controlled for with observational data.
          </div>
          <div className="serif" style={{ fontSize: 14.5, color: 'var(--ink-dim)', lineHeight: 1.65, textWrap: 'pretty' }}>
            <strong style={{ color: 'var(--ink)' }}>Stanford sample limitations.</strong> The Stanford Cable TV News Analyzer covers a large
            but non-exhaustive sample of broadcast content. Coverage is stronger for cable news and major-market affiliates
            than for small-market independent stations — precisely the stations most affected by consolidation.
            Selection bias is acknowledged.
          </div>
          <div className="serif" style={{ fontSize: 14.5, color: 'var(--ink-dim)', lineHeight: 1.65, textWrap: 'pretty' }}>
            <strong style={{ color: 'var(--ink)' }}>Survivorship bias.</strong> We can only analyze stations that still exist in the FCC database.
            Stations that went dark, surrendered their license, or were never digitized leave no transcript record.
            The analysis necessarily over-represents survivors, which may be systematically different from stations
            that disappeared entirely.
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div style={{ marginTop: 40 }}>
        <Tick color="var(--gold)">▌ DATA SOURCES</Tick>
        <div style={{ marginTop: 14, border: '1px solid var(--line)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 160px 140px 100px',
            background: 'var(--bg-2)', borderBottom: '1px solid var(--line)',
          }}>
            {['SOURCE', 'COVERAGE', 'TYPE', 'MODELS'].map(h => (
              <div key={h} style={{ padding: '10px 14px' }}>
                <span className="mono" style={{ color: 'var(--ink-dim)', fontSize: 9, letterSpacing: 0.15, textTransform: 'uppercase' }}>{h}</span>
              </div>
            ))}
          </div>
          {/* Rows */}
          {dataSources.map((d, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 160px 140px 100px',
              borderBottom: i < dataSources.length - 1 ? '1px solid var(--line)' : 'none',
            }}>
              <div style={{ padding: '10px 14px' }}>
                <span className="serif" style={{ color: 'var(--ink)', fontSize: 13 }}>{d.source}</span>
              </div>
              <div style={{ padding: '10px 14px' }}>
                <span className="mono" style={{ color: 'var(--ink-dim)', fontSize: 11 }}>{d.coverage}</span>
              </div>
              <div style={{ padding: '10px 14px' }}>
                <span className="mono" style={{ color: 'var(--ink-dim)', fontSize: 10, textTransform: 'uppercase' }}>{d.type}</span>
              </div>
              <div style={{ padding: '10px 14px' }}>
                <span className="mono" style={{ color: 'var(--gold)', fontSize: 11 }}>{d.use}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citations / footer */}
      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 18 }}>
        <Tick>FCC · BROADCAST LICENSE DATABASE · PUBLIC DOMAIN · ACCESSED 2026-05</Tick>
        <Tick color="var(--gold)">ONE HUNDRED YEARS — VOL. III, ISSUE 10 — FAIR USE</Tick>
      </div>
    </div>
  );
}

Object.assign(window, { TabMethodology });
