// Splash screen — three beats.

function Splash({ onEnter }) {
  const SESSION_KEY = 'corpus_dead-air_seen';
  const [beat, setBeat] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const [showNoise, setShowNoise] = React.useState(false);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const ts = [
      setTimeout(() => setBeat(1), 2000),
      setTimeout(() => setBeat(2), 4000),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  // Keyboard listener
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' && beat >= 2) handleEnter();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [beat]);

  // Generate TV static noise on canvas
  React.useEffect(() => {
    if (!showNoise || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 320;
    canvas.height = 180;
    const imageData = ctx.createImageData(320, 180);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }, [showNoise]);

  function handleEnter() {
    if (exiting) return;
    setExiting(true);
    setShowNoise(true);
    // Flash noise for 120ms then fade
    setTimeout(() => {
      setShowNoise(false);
      setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, '1');
        onEnter();
      }, 500);
    }, 120);
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', position: 'relative',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '60px 80px', overflow: 'hidden',
    }}>
      {/* TV static noise overlay */}
      {showNoise && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#000',
        }}>
          <canvas ref={canvasRef} style={{
            width: '100%', height: '100%',
            imageRendering: 'pixelated',
            opacity: 0.7,
          }} />
        </div>
      )}

      {/* Fade-out overlay */}
      {exiting && !showNoise && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'var(--bg)',
          animation: 'fade 500ms ease both',
        }} />
      )}

      {/* Background: concentric signal rings */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 1 }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={i}
            cx="50%" cy="50%"
            r={60 + i * 65}
            fill="none" stroke="#E8A838" strokeWidth="0.6"
            opacity="0.04"
          />
        ))}
      </svg>

      {/* Top-left brand bar */}
      <div style={{
        position: 'absolute', top: 28, left: 36, display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <SeriesMark />
        <Tick>Vol. III — Issue 10 / Dead Air</Tick>
      </div>
      <div style={{ position: 'absolute', top: 28, right: 36, display: 'flex', gap: 24 }}>
        <Tick>FCC · Broadcast License Database · 1934–2024</Tick>
      </div>

      {/* Stage */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>

        {/* Beat 1: Two numbers side by side */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 80 }}>
          <div className="mono" style={{
            fontSize: 180, lineHeight: 0.9, fontWeight: 700, letterSpacing: -4,
            color: '#2E86AB',
            textShadow: '0 0 60px rgba(46,134,171,0.20)',
            animation: 'fadeUp 1.4s cubic-bezier(.2,.7,.2,1) both',
          }}>
            5,100
          </div>
          <div className="mono" style={{
            fontSize: 180, lineHeight: 0.9, fontWeight: 700, letterSpacing: -4,
            color: '#C0392B',
            textShadow: '0 0 60px rgba(192,57,43,0.20)',
            animation: 'fadeUp 1.4s cubic-bezier(.2,.7,.2,1) 200ms both',
          }}>
            3,800
          </div>
        </div>

        {/* Beat 2: Labels + "Five years. One law." */}
        <div style={{
          marginTop: 20,
          opacity: beat >= 1 ? 1 : 0, transition: 'opacity 800ms ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 80 }}>
            <span className="mono" style={{ color: 'var(--ink-dim)', fontSize: 13, letterSpacing: 0.15 }}>
              radio station owners · 1996
            </span>
            <span className="mono" style={{ color: 'var(--ink-dim)', fontSize: 13, letterSpacing: 0.15 }}>
              · 2001
            </span>
          </div>
          <div className="serif" style={{
            color: 'var(--ink-dim)', fontSize: 20, marginTop: 24, fontStyle: 'italic',
          }}>
            Five years. One law.
          </div>
        </div>

        {/* Beat 3: Title + thesis + enter button */}
        <div style={{
          marginTop: 64,
          opacity: beat >= 2 ? 1 : 0, transform: beat >= 2 ? 'none' : 'translateY(10px)',
          transition: 'all 900ms cubic-bezier(.2,.7,.2,1)',
        }}>
          <div className="garamond" style={{
            fontSize: 84, lineHeight: 0.95, letterSpacing: -2.5, color: 'var(--ink)', fontWeight: 400,
          }}>
            Dead Air
          </div>
          <div className="serif" style={{
            color: 'var(--ink-dim)', fontSize: 18, marginTop: 20, fontStyle: 'italic',
            maxWidth: 720, margin: '20px auto 0', textWrap: 'balance',
          }}>
            The Telecommunications Act of 1996 removed the cap on how many radio stations one company could own. Within five years, half of all independent owners were gone. This is the record.
          </div>

          <div style={{
            marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          }}>
            <button onClick={handleEnter} className="mono" style={{
              background: 'transparent', color: 'var(--gold)',
              border: '1px solid var(--gold)', padding: '14px 28px',
              fontSize: 12, letterSpacing: 0.3, textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: "'Space Mono', monospace",
              transition: 'all 200ms', display: 'inline-flex', alignItems: 'center', gap: 14,
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = 'var(--bg)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gold)'; }}>
              Enter the record
              <Icon name="arrow-right" size={14} />
            </button>
            <div className="mono" style={{ color: 'var(--ink-dimmer)', fontSize: 10, letterSpacing: 0.3, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="corner-down-left" size={11} color="var(--ink-dimmer)" /> Press return · or click to continue
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{
        position: 'absolute', left: 36, right: 36, bottom: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid var(--line)', paddingTop: 12,
      }}>
        <Tick>Source · FCC · Public Domain</Tick>
        <Tick color="var(--ink-dim)">One Hundred Years — A reporting series</Tick>
        <Tick>Methodology § 07</Tick>
      </div>
    </div>
  );
}

Object.assign(window, { Splash });
