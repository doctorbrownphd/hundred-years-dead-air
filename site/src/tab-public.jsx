// 06 · The Public Interest

function TabPublic() {
  const timeline = window.regulatoryTimeline || [];

  return (
    <div style={{ padding: '32px 56px 80px' }}>
      <Eyebrow id="06 · THE PUBLIC INTEREST"
        title="The legal history of what broadcasters owe the public."
        right="Source · FCC · Federal Register" />

      {/* Regulatory Timeline — fully rendered */}
      <div style={{ marginBottom: 48 }}>
        <Tick color="var(--gold)">▌ REGULATORY TIMELINE · 1927–2024</Tick>
        <div style={{ position: 'relative', marginTop: 24, paddingLeft: 60 }}>
          {/* Vertical connecting line */}
          <div style={{
            position: 'absolute', left: 28, top: 0, bottom: 0, width: 1,
            background: 'var(--line)',
          }} />

          {timeline.map((evt, i) => {
            const is1996 = evt.year === 1996;
            const accentColor = evt.year < 1987 ? 'var(--blue)' : 'var(--red)';

            return (
              <div key={i} style={{
                position: 'relative', marginBottom: i < timeline.length - 1 ? 36 : 0,
                paddingLeft: 40,
                borderLeft: is1996 ? '3px solid var(--amber)' : `2px solid ${accentColor}`,
                background: is1996 ? 'rgba(201,168,76,0.04)' : 'transparent',
                padding: is1996 ? '20px 24px 20px 40px' : '0 0 0 40px',
              }}>
                {/* Dot on the timeline */}
                <div style={{
                  position: 'absolute', left: -52, top: is1996 ? 24 : 4,
                  width: 10, height: 10, borderRadius: '50%',
                  background: is1996 ? 'var(--amber)' : accentColor,
                  border: '2px solid var(--bg)',
                }} />

                <div className="mono" style={{
                  color: 'var(--amber)', fontSize: is1996 ? 48 : 36,
                  fontWeight: 700, lineHeight: 1, letterSpacing: -1,
                }}>
                  {evt.year}
                </div>
                <div className="garamond" style={{
                  color: 'var(--ink)', fontSize: 20, marginTop: 8,
                  letterSpacing: -0.2, lineHeight: 1.3,
                }}>
                  {evt.title}
                </div>
                <div className="serif" style={{
                  color: 'var(--ink-dim)', fontSize: 14, lineHeight: 1.6,
                  marginTop: 8, maxWidth: 760, textWrap: 'pretty',
                }}>
                  {evt.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* License Renewal Record placeholder */}
      <div style={{ marginBottom: 40 }}>
        <Tick color="var(--gold)">▌ LICENSE RENEWAL RECORD · FCC DATABASE</Tick>
        <div style={{
          border: '1px solid var(--line)', background: 'var(--bg-2)',
          height: 360, marginTop: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Tick>VISUALIZATION PENDING · AWAITING FCC PIPELINE OUTPUT</Tick>
        </div>
      </div>

      <HRule>THE OBLIGATION</HRule>

      {/* The Obligation callout */}
      <div style={{
        marginTop: 24, padding: '28px 32px',
        border: '1px solid var(--line)', background: 'var(--bg-2)',
      }}>
        <div className="garamond" style={{
          fontSize: 22, fontStyle: 'italic', color: 'var(--ink)',
          lineHeight: 1.55, textWrap: 'pretty', fontWeight: 400,
        }}>
          The public interest obligation is still technically required.
          The compliance is theater.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TabPublic });
