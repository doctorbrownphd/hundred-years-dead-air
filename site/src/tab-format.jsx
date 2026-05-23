// 03 · The Format

function TabFormat() {
  return (
    <div style={{ padding: '32px 56px 80px' }}>
      <Eyebrow id="03 · THE FORMAT"
        title="What filled the airwaves when local content left."
        right="Source · Stanford Local News Lab" />

      {/* Lede */}
      <div className="garamond" style={{
        fontSize: 20, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.55,
        maxWidth: 820, marginBottom: 36, textWrap: 'pretty', fontWeight: 400,
      }}>
        Stanford's Local News Lab has tracked the systematic replacement of locally-produced journalism
        with nationally-syndicated content across hundreds of stations. The pattern is consistent:
        when ownership consolidates, local news budgets are the first casualty.
      </div>

      {/* Content Localness Chart placeholder */}
      <div style={{ marginBottom: 32 }}>
        <Tick color="var(--gold)">▌ CONTENT LOCALNESS INDEX — POST-ACQUISITION DECLINE</Tick>
        <div style={{
          border: '1px solid var(--line)', background: 'var(--bg-2)',
          height: 360, marginTop: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Tick>VISUALIZATION PENDING · AWAITING M2 PIPELINE OUTPUT</Tick>
        </div>
        <div style={{ marginTop: 10 }}>
          <Confidence level="high" />
        </div>
      </div>

      {/* Must-Run Map placeholder */}
      <div style={{ marginBottom: 40 }}>
        <Tick color="var(--gold)">▌ SINCLAIR MUST-RUN GEOGRAPHIC REACH</Tick>
        <div style={{
          border: '1px solid var(--line)', background: 'var(--bg-2)',
          height: 360, marginTop: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Tick>VISUALIZATION PENDING · AWAITING M5 PIPELINE OUTPUT</Tick>
        </div>
      </div>

      <HRule>THE DEADSPIN MOMENT</HRule>

      {/* Gold-bordered quote block */}
      <div style={{
        border: '1px solid var(--gold)', borderLeft: '3px solid var(--gold)',
        background: 'rgba(201,168,76,0.04)', padding: '28px 32px', marginTop: 24, marginBottom: 40,
      }}>
        <div className="garamond" style={{
          fontSize: 22, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.55,
          textWrap: 'pretty', fontWeight: 400,
        }}>
          "This is extremely dangerous to our democracy."
        </div>
        <div className="serif" style={{
          fontSize: 14, color: 'var(--ink-dim)', lineHeight: 1.65, marginTop: 16,
          textWrap: 'pretty',
        }}>
          In March 2018, Deadspin compiled a supercut that went viral: dozens of local anchors at
          Sinclair Broadcast Group stations reading the same script, word for word, in what was
          presented as local editorial commentary. The anchors warned viewers about "the troubling
          trend of irresponsible, one-sided news stories plaguing our country" — dozens of local
          anchors reading the same words simultaneously across markets that have no idea they are
          receiving the same content. The video revealed the mechanism plainly: a centralized
          corporate owner using local trust to deliver national messaging, station by station,
          anchor by anchor, in living rooms across America.
        </div>
        <div style={{ marginTop: 14 }}>
          <Tick>MARCH 2018 · SINCLAIR BROADCAST GROUP · 193 STATIONS</Tick>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TabFormat });
