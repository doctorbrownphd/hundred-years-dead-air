// Shared visual atoms for Dead Air

const SeriesMark = () => (
  <a href="https://onehundredyears.report" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', border: 'none' }}>
    <svg width="14" height="56" viewBox="0 0 18 72">
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
    <div style={{ lineHeight: 1.1 }}>
      <div className="mono" style={{ color: '#C9A84C', fontSize: 11, letterSpacing: 0.25, textTransform: 'uppercase', fontWeight: 700 }}>
        One Hundred Years
      </div>
      <div className="mono" style={{ color: '#3A3A3A', fontSize: 9, letterSpacing: 0.25, textTransform: 'uppercase' }}>
        A reporting series
      </div>
    </div>
  </a>
);

const Tick = ({ children, color = 'var(--ink-dimmer)' }) => (
  <span className="mono" style={{ color, fontSize: 10, letterSpacing: 0.08, textTransform: 'uppercase' }}>
    {children}
  </span>
);

const Eyebrow = ({ id, title, right }) => (
  <div style={{
    display: 'flex', alignItems: 'baseline', gap: 12,
    padding: '0 0 14px', borderBottom: '1px solid var(--line)', marginBottom: 24,
  }}>
    <span className="mono" style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: 0.2, textTransform: 'uppercase' }}>
      {id}
    </span>
    <span style={{ flex: 1 }}>
      <span className="garamond" style={{ color: 'var(--ink)', fontSize: 22, fontWeight: 400 }}>{title}</span>
    </span>
    {right && <span className="mono" style={{ color: 'var(--ink-dimmer)', fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase' }}>{right}</span>}
  </div>
);

const Readout = ({ label, value, sub, accent = 'var(--ink)', size = 32 }) => (
  <div style={{
    border: '1px solid var(--line)', background: 'rgba(20,20,20,0.5)',
    padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 110,
  }}>
    <div className="mono" style={{ color: 'var(--ink-dimmer)', fontSize: 10, letterSpacing: 0.18, textTransform: 'uppercase' }}>
      {label}
    </div>
    <div className="mono" style={{ color: accent, fontSize: size, fontWeight: 700, lineHeight: 1.05, letterSpacing: -0.5 }}>
      {value}
    </div>
    {sub && (
      <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 10.5, letterSpacing: 0.06, opacity: 0.85 }}>
        {sub}
      </div>
    )}
  </div>
);

const Confidence = ({ level = 'high' }) => {
  const map = {
    high: { label: 'HIGH CONFIDENCE', color: 'var(--blue)' },
    candidate: { label: 'CANDIDATE FINDING', color: 'var(--amber)' },
    speculative: { label: 'SPECULATIVE', color: 'var(--red)' },
  };
  const c = map[level];
  return (
    <span className="mono" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      border: `1px solid color-mix(in srgb, ${c.color} 40%, transparent)`, color: c.color, padding: '3px 7px',
      fontSize: 9, letterSpacing: 0.18, textTransform: 'uppercase',
    }}>
      <span style={{ width: 6, height: 6, background: c.color, borderRadius: '50%' }} />
      {c.label}
    </span>
  );
};

const HRule = ({ children, color = 'var(--line)' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-dimmer)' }}>
    <span style={{ flex: 1, height: 1, background: color }} />
    {children && <span className="mono" style={{ fontSize: 10, letterSpacing: 0.18, textTransform: 'uppercase' }}>{children}</span>}
    <span style={{ flex: 1, height: 1, background: color }} />
  </div>
);

const CallSign = ({ sign, market }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 10,
    borderLeft: '3px solid var(--amber)', paddingLeft: 8,
  }}>
    <span className="mono" style={{
      color: 'var(--ink)', fontSize: 13, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
    }}>
      {sign}
    </span>
    {market && (
      <span className="mono" style={{ color: 'var(--ink-dim)', fontSize: 10, letterSpacing: 0.1 }}>
        {market}
      </span>
    )}
  </div>
);

const ConcentrationLegend = ({ width = 280, height = 8, ticks = ['0%', '25%', '50%', '75%', '100%'] }) => {
  const stops = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    stops.push(`${window.consolidationColor(t)} ${(t * 100).toFixed(1)}%`);
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ width, height, background: `linear-gradient(to right, ${stops.join(',')})`, borderRadius: 1 }} />
      <div style={{ width, display: 'flex', justifyContent: 'space-between' }}>
        {ticks.map(t => (
          <span key={t} className="mono" style={{ color: 'var(--ink-dimmer)', fontSize: 9.5 }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

const TransferRecord = ({ date, callSign, market, fromOwner, toOwner, price }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '90px 80px 130px 1fr 1fr 100px',
    gap: 12, alignItems: 'center', padding: '8px 0',
    borderBottom: '1px solid var(--line)',
    fontSize: 11,
  }}>
    <span className="mono" style={{ color: 'var(--ink-dim)', fontSize: 10 }}>{date}</span>
    <span className="mono" style={{ color: 'var(--ink)', fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', fontSize: 10 }}>{callSign}</span>
    <span className="mono" style={{ color: 'var(--ink-dim)', fontSize: 10 }}>{market}</span>
    <span className="mono" style={{ color: 'var(--blue)', fontSize: 10 }}>{fromOwner}</span>
    <span className="mono" style={{ color: 'var(--red)', fontSize: 10 }}>{toOwner}</span>
    <span className="mono" style={{ color: 'var(--amber)', fontSize: 10, textAlign: 'right' }}>{window.formatPrice(price)}</span>
  </div>
);

// Lucide icon wrapper — renders an SVG icon from the lucide global
function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.5, style = {} }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      const iconData = window.lucide.icons[name];
      if (iconData) {
        const [, attrs, children] = iconData;
        ref.current.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        Object.entries({ ...attrs, width: size, height: size, stroke: color, 'stroke-width': strokeWidth, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }).forEach(([k, v]) => svg.setAttribute(k, String(v)));
        children.forEach(([tag, childAttrs]) => {
          const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
          Object.entries(childAttrs || {}).forEach(([k, v]) => el.setAttribute(k, String(v)));
          svg.appendChild(el);
        });
        ref.current.appendChild(svg);
      }
    }
  }, [name, size, color, strokeWidth]);
  return <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center', ...style }} />;
}

Object.assign(window, { SeriesMark, Tick, Eyebrow, Readout, Confidence, HRule, CallSign, ConcentrationLegend, TransferRecord, Icon });
