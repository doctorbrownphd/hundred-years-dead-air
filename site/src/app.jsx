// App shell — tab navigation

const TABS = [
  { id: 'spectrum',    n: '01', label: 'The Spectrum' },
  { id: 'transfer',    n: '02', label: 'The Transfer' },
  { id: 'format',      n: '03', label: 'The Format' },
  { id: 'desert',      n: '04', label: 'The Desert' },
  { id: 'signal',      n: '05', label: 'The Signal' },
  { id: 'public',      n: '06', label: 'The Public Interest' },
  { id: 'counterfactual', n: '08', label: 'The Counterfactual' },
  { id: 'methodology', n: '09', label: 'The Methodology' },
];

function App() {
  const [phase, setPhase] = React.useState('splash');
  const [tab, setTab] = React.useState('spectrum');
  const [transitioning, setTransitioning] = React.useState(false);

  const enter = () => {
    sessionStorage.setItem('corpus_dead-air_seen', '1');
    setTransitioning(true);
    setTimeout(() => {
      setPhase('app');
      setTransitioning(false);
    }, 120);
  };

  // Skip splash if already seen this session
  React.useEffect(() => {
    if (sessionStorage.getItem('corpus_dead-air_seen')) {
      setPhase('app');
    }
  }, []);

  // Keyboard: Enter/Space to enter during splash, arrow keys to switch tabs
  React.useEffect(() => {
    const k = (e) => {
      if (phase === 'splash' && (e.key === 'Enter' || e.key === ' ')) {
        enter();
        return;
      }
      if (phase === 'app') {
        const idx = TABS.findIndex(t => t.id === tab);
        if (e.key === 'ArrowRight' && idx < TABS.length - 1) setTab(TABS[idx + 1].id);
        if (e.key === 'ArrowLeft' && idx > 0) setTab(TABS[idx - 1].id);
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [phase, tab]);

  if (phase === 'splash') {
    return (
      <div style={{ position: 'relative' }}>
        <Splash onEnter={enter} />
        {transitioning && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'var(--bg)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='2' height='2' fill='%23333' x='0' y='0'/%3E%3Crect width='2' height='2' fill='%23111' x='2' y='0'/%3E%3Crect width='2' height='2' fill='%23222' x='0' y='2'/%3E%3Crect width='2' height='2' fill='%23000' x='2' y='2'/%3E%3C/svg%3E")`,
            animation: 'fade 120ms ease both', zIndex: 1000, pointerEvents: 'none',
          }} />
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar tab={tab} setTab={setTab} />
      <div style={{ animation: 'fadeUp 600ms cubic-bezier(.2,.7,.2,1) both' }} key={tab}>
        {tab === 'spectrum' && <TabSpectrum />}
        {tab === 'transfer' && <TabTransfer />}
        {tab === 'format' && <TabFormat />}
        {tab === 'desert' && <TabDesert />}
        {tab === 'signal' && <TabSignal />}
        {tab === 'public' && <TabPublic />}
        {tab === 'counterfactual' && <CounterfactualTab />}
        {tab === 'methodology' && <TabMethodology />}
      </div>
      <Footer />
    </div>
  );
}

function TopBar({ tab, setTab }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--line)',
    }}>
      {/* Masthead */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: '28px 56px 22px',
      }}>
        {/* Left: ruler + title block */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <svg width="14" height="56" viewBox="0 0 18 72" style={{ flexShrink: 0 }}>
            <line x1="0" y1="0" x2="0" y2="72" stroke="#C9A84C" strokeWidth="1.5"/>
            <line x1="0" y1="0"  x2="12" y2="0"  stroke="#C9A84C" strokeWidth="1.5"/>
            <line x1="0" y1="8"  x2="7"  y2="8"  stroke="#C9A84C" strokeWidth="0.8"/>
            <line x1="0" y1="16" x2="7"  y2="16" stroke="#C9A84C" strokeWidth="0.8"/>
            <line x1="0" y1="24" x2="12" y2="24" stroke="#C9A84C" strokeWidth="1.5"/>
            <line x1="0" y1="32" x2="7"  y2="32" stroke="#C9A84C" strokeWidth="0.8"/>
            <line x1="0" y1="40" x2="7"  y2="40" stroke="#C9A84C" strokeWidth="0.8"/>
            <line x1="0" y1="48" x2="12" y2="48" stroke="#C9A84C" strokeWidth="1.5"/>
            <line x1="0" y1="56" x2="7"  y2="56" stroke="#C9A84C" strokeWidth="0.8"/>
            <line x1="0" y1="64" x2="7"  y2="64" stroke="#C9A84C" strokeWidth="0.8"/>
            <line x1="0" y1="72" x2="12" y2="72" stroke="#C9A84C" strokeWidth="1.5"/>
          </svg>
          <div>
            <div className="mono" style={{
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--ink-dimmer)', marginBottom: 6,
            }}>
              One Hundred Years of
            </div>
            <div className="garamond" style={{ fontSize: 52, lineHeight: 1.05, color: 'var(--ink)', fontWeight: 400, display: 'flex', alignItems: 'center', gap: 16 }}>
              Dead <em style={{ color: '#E8A838', fontStyle: 'italic' }}>Air</em>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25, flexShrink: 0 }}>
                <path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9"/><path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5"/><circle cx="12" cy="9" r="2"/><path d="M16.2 4.8c2 2 2.26 5.11.8 7.47"/><path d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1"/><path d="M9.5 18h5"/><path d="m8 22 4-11 4 11"/>
              </svg>
            </div>
            <div className="serif" style={{
              fontSize: 17, fontStyle: 'italic', color: 'var(--ink-dim)',
              marginTop: 6, maxWidth: 580,
            }}>
              The airwaves are public property. We gave them away. The FCC license database recorded every transaction.
            </div>
          </div>
        </div>
        {/* Right: metadata grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'auto auto',
          gap: '4px 14px', alignSelf: 'flex-start', marginTop: 4,
        }}>
          {[
            ['Issue', '10 / 12'],
            ['Window', '1934\u20132024'],
            ['Stations', '15,445'],
            ['Laws', '134'],
          ].map(([label, value]) => (
            <React.Fragment key={label}>
              <span className="mono" style={{
                fontSize: 10, letterSpacing: 0.12, textTransform: 'uppercase',
                color: 'var(--ink-dimmer)', textAlign: 'right',
              }}>{label}</span>
              <span className="mono" style={{
                fontSize: 10, fontWeight: 700, color: 'var(--ink)', textAlign: 'right',
              }}>{value}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Tab strip */}
      <div style={{ display: 'flex', padding: '0 56px', gap: 0, borderTop: '1px solid var(--line)' }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '16px 22px', position: 'relative',
              display: 'flex', alignItems: 'baseline', gap: 8,
              color: active ? 'var(--gold)' : 'var(--ink-dim)',
              transition: 'color 180ms',
            }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: 0.2, color: active ? 'var(--gold)' : 'var(--ink-dimmer)' }}>
                {t.n}
              </span>
              <span className="serif" style={{ fontSize: 15, letterSpacing: -0.1 }}>{t.label}</span>
              {active && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: 'var(--gold)' }} />}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button style={{
          background: 'transparent', border: '1px solid var(--line)', cursor: 'pointer',
          padding: '10px 18px', margin: '8px 0',
          color: 'var(--ink-dim)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon name="search" size={13} color="var(--ink-dim)" />
          <span className="mono" style={{ fontSize: 11, letterSpacing: 0.15, textTransform: 'uppercase' }}>Find a Market</span>
        </button>
      </div>
    </div>
  );
}

function LiveReadout({ label, value, color = 'var(--ink)', pulse }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="mono" style={{ color: 'var(--ink-dimmer)', fontSize: 9.5, letterSpacing: 0.2, textTransform: 'uppercase' }}>{label}</span>
      <span className="mono" style={{ color, fontSize: 12, fontWeight: 700, letterSpacing: 0.04 }}>{value}</span>
      {pulse && <span style={{ width: 6, height: 6, background: color, borderRadius: '50%', animation: 'pulse 1.6s ease-in-out infinite' }} />}
    </div>
  );
}

function Footer() {
  return (
    <div style={{ borderTop: '1px solid var(--line)', padding: '24px 56px 36px', marginTop: 40, background: 'rgba(10,10,10,0.6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'baseline' }}>
          <SeriesMark />
          <Tick>VOL. III · ISSUE 10 · DEAD AIR</Tick>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Tick><Icon name="arrow-left" size={10} style={{marginRight:6}} /> PREV · THE GROUND</Tick>
          <Tick color="var(--gold)">NEXT · THE FREQUENCY <Icon name="arrow-right" size={10} style={{marginLeft:6}} /></Tick>
        </div>
      </div>
      <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 14 }}>
        <Tick>SOURCE · FCC · BROADCAST LICENSE DATABASE · PUBLIC DOMAIN</Tick>
        <Tick>METHODOLOGY · § 09</Tick>
        <Tick>MIT LICENSE · OPEN DATA</Tick>
      </div>
    </div>
  );
}

// Render
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
