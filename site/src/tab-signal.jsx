// 05 · The Signal

function TabSignal() {
  return (
    <div style={{ padding: '32px 56px 80px' }}>
      <Eyebrow id="05 · THE SIGNAL"
        title="What is actually being broadcast."
        right="Source · GDELT · Stanford · MIT" />

      {/* Three analysis dimension narratives */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 40, maxWidth: 860 }}>
        <div>
          <Tick color="var(--gold)">▌ INFORMATION CONTENT</Tick>
          <div className="serif" style={{
            fontSize: 15, color: 'var(--ink-dim)', lineHeight: 1.65, marginTop: 12, textWrap: 'pretty',
          }}>
            The M4 Information Quality Model measures the density of verifiable, locally-sourced
            factual claims per broadcast hour. Stations acquired in consolidation waves show a
            measurable decline in information density — not because they broadcast less, but because
            what they broadcast contains fewer original reporting acts. Wire copy, syndicated packages,
            and nationally-produced segments fill the same number of hours with systematically less
            local substance.
          </div>
        </div>

        <div>
          <Tick color="var(--gold)">▌ POLITICAL VALENCE</Tick>
          <div className="serif" style={{
            fontSize: 15, color: 'var(--ink-dim)', lineHeight: 1.65, marginTop: 12, textWrap: 'pretty',
          }}>
            Content analysis of broadcast transcripts reveals measurable shifts in political framing
            following ownership changes. This is not a claim about bias in the colloquial sense — it
            is a statistical observation that the distribution of issue framing, source selection, and
            story emphasis changes in consistent directions when station ownership changes hands.
            The signal is in the aggregate, not in any individual broadcast.
          </div>
        </div>

        <div>
          <Tick color="var(--gold)">▌ LOCAL SPECIFICITY</Tick>
          <div className="serif" style={{
            fontSize: 15, color: 'var(--ink-dim)', lineHeight: 1.65, marginTop: 12, textWrap: 'pretty',
          }}>
            The most robust finding across all models: consolidated stations produce less content
            that is specific to their market. Named local officials, local institutions, local
            geography, local events — the markers of journalism that could only come from a newsroom
            embedded in the community it serves. This metric declines predictably in the 18 months
            following acquisition.
          </div>
        </div>
      </div>

      {/* Vaccine Finding placeholder */}
      <div style={{ marginBottom: 32 }}>
        <Tick color="var(--gold)">▌ VACCINE INFORMATION QUALITY · COUNTY-LEVEL ANALYSIS</Tick>
        <div style={{
          border: '1px solid var(--line)', background: 'var(--bg-2)',
          height: 360, marginTop: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Tick>VISUALIZATION PENDING · AWAITING M4 PIPELINE OUTPUT</Tick>
        </div>
        <div style={{ marginTop: 10 }}>
          <Confidence level="candidate" />
        </div>
      </div>

      {/* Political Information Quality placeholder */}
      <div style={{ marginBottom: 32 }}>
        <Tick color="var(--gold)">▌ POLITICAL INFORMATION QUALITY · PRE/POST ACQUISITION</Tick>
        <div style={{
          border: '1px solid var(--line)', background: 'var(--bg-2)',
          height: 360, marginTop: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Tick>VISUALIZATION PENDING · AWAITING M4 PIPELINE OUTPUT</Tick>
        </div>
        <div style={{ marginTop: 10 }}>
          <Confidence level="candidate" />
        </div>
      </div>

      {/* Echo Chamber Geography placeholder */}
      <div style={{ marginBottom: 32 }}>
        <Tick color="var(--gold)">▌ ECHO CHAMBER GEOGRAPHY · SINGLE-OWNER MARKET CLUSTERS</Tick>
        <div style={{
          border: '1px solid var(--line)', background: 'var(--bg-2)',
          height: 360, marginTop: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Tick>VISUALIZATION PENDING · AWAITING M5 PIPELINE OUTPUT</Tick>
        </div>
        <div style={{ marginTop: 10 }}>
          <Confidence level="candidate" />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TabSignal });
