// 04 · The Desert

function TabDesert() {
  return (
    <div style={{ padding: '32px 56px 80px' }}>
      <Eyebrow id="04 · THE DESERT"
        title="Where local journalism went to die."
        right="Source · UNC Hussman School" />

      {/* News Desert Map placeholder */}
      <div style={{ marginBottom: 40 }}>
        <Tick color="var(--gold)">▌ COUNTY-LEVEL LOCAL NEWS COVERAGE STATUS</Tick>
        <div style={{
          border: '1px solid var(--line)', background: 'var(--bg-2)',
          height: 500, marginTop: 12,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
        }}>
          <Tick>VISUALIZATION PENDING · AWAITING M3 PIPELINE OUTPUT</Tick>
          {/* Static 4-color legend bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {[
              { color: '#1B4F72', label: 'Full Coverage' },
              { color: 'var(--blue)', label: 'Partial Coverage' },
              { color: 'var(--amber)', label: 'At Risk' },
              { color: 'var(--red)', label: 'News Desert' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20 }}>
                <div style={{ width: 28, height: 10, background: s.color }} />
                <span className="mono" style={{ color: 'var(--ink-dim)', fontSize: 9, letterSpacing: 0.15, textTransform: 'uppercase' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsroom Employment Collapse placeholder */}
      <div style={{ marginBottom: 40 }}>
        <Tick color="var(--gold)">▌ NEWSROOM EMPLOYMENT COLLAPSE · BLS DATA 2004–2024</Tick>
        <div style={{
          border: '1px solid var(--line)', background: 'var(--bg-2)',
          height: 360, marginTop: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Tick>VISUALIZATION PENDING · AWAITING BLS PIPELINE OUTPUT</Tick>
        </div>
      </div>

      <HRule>THE 200 COUNTIES</HRule>

      {/* Stat callout */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 32, marginTop: 24, marginBottom: 40,
        border: '1px solid var(--line)', background: 'var(--bg-2)', padding: '32px 36px',
      }}>
        <div style={{ flexShrink: 0 }}>
          <div className="mono" style={{ color: 'var(--red)', fontSize: 72, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>
            200+
          </div>
        </div>
        <div style={{ paddingTop: 6 }}>
          <div className="mono" style={{ color: 'var(--ink)', fontSize: 13, letterSpacing: 0.1, textTransform: 'uppercase', fontWeight: 700 }}>
            Counties with active FCC licenses and no local journalism
          </div>
          <div className="serif" style={{ color: 'var(--ink-dim)', fontSize: 14, lineHeight: 1.65, marginTop: 12, textWrap: 'pretty' }}>
            These counties still have broadcast towers. Signals still reach homes. But the stations
            are automated relays — no newsroom, no reporters, no local coverage. The FCC license is
            active. The public interest obligation is technically in force. The airwaves are occupied
            but the local content is gone.
          </div>
          <div style={{ marginTop: 14 }}>
            <Confidence level="high" />
          </div>
        </div>
      </div>

      {/* Voter Information Gap */}
      <div style={{ marginBottom: 40 }}>
        <Tick color="var(--gold)">▌ THE VOTER INFORMATION GAP</Tick>
        <div className="serif" style={{
          fontSize: 15, color: 'var(--ink-dim)', lineHeight: 1.65, marginTop: 14,
          maxWidth: 860, textWrap: 'pretty',
        }}>
          Research from the MIT Election Data Lab and Duke's DeWitt Wallace Center has established
          a measurable relationship between local news deserts and civic participation. Counties that
          lost their last local news outlet saw statistically significant drops in voter turnout for
          local elections, reduced candidate competition for municipal offices, and lower levels of
          public knowledge about local government decisions. The information gap is not theoretical —
          it is observable in election data, survey responses, and public meeting attendance records
          across hundreds of affected counties.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TabDesert });
