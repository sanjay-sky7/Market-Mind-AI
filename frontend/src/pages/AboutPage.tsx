const FEATURES = [
  { icon: '📡', title: 'Opportunity Radar',         color: '#00a85a', desc: 'AI monitors corporate filings, bulk deals, insider trades, earnings surprises and regulatory changes — surfacing missed opportunities as prioritised daily alerts. A signal-finder, not a summariser.' },
  { icon: '📊', title: 'Chart Pattern Intelligence', color: '#2756a8', desc: 'Real-time pattern detection (breakouts, reversals, support/resistance, divergences) across the full NSE universe with plain-English AI explanations and historical back-tested success rates per stock.' },
  { icon: '🤖', title: 'Market ChatGPT — Next Gen',  color: '#f5a623', desc: 'Claude-powered market analyst with deeper data integration, multi-step reasoning, portfolio-aware answers and source-cited responses. Far beyond generic Q&A — true investment intelligence.' },
  { icon: '🎬', title: 'AI Market Video Engine',     color: '#e03152', desc: 'Auto-generates short market update videos (30–90s) from real-time data. Race-chart simulators, daily wraps, sector rotations, FII/DII flows, IPO trackers — zero human editing required.' },
  { icon: '🔍', title: 'Smart AI Screener',          color: '#7c3aed', desc: 'Filter 5,000+ NSE stocks by 20+ parameters — PE, ROE, RSI, volume ratio, pattern, signal and sector — simultaneously with one-click AI strategy presets. Unique feature in the market.' },
]

const STACK = [
  { layer: 'Frontend',  icon: '⚛️', items: ['React 18 + TypeScript', 'Tailwind CSS', 'Vite', 'TanStack Query', 'Zustand', 'Lightweight Charts'] },
  { layer: 'Backend',   icon: '🐍', items: ['FastAPI (Python)', 'SQLAlchemy', 'PostgreSQL', 'Redis Cache', 'Asyncpg', 'Uvicorn'] },
  { layer: 'AI / ML',   icon: '🤖', items: ['Anthropic Claude', 'pandas-ta (patterns)', 'yfinance (live NSE)', 'numpy / pandas'] },
  { layer: 'Video',     icon: '🎬', items: ['matplotlib', 'ffmpeg', 'asyncio jobs', 'MP4 output'] },
]

export default function AboutPage() {
  return (
    <div className="space-y-8 page-enter">

      {/* Features */}
      <div>
        <h2 className="section-title mb-1">About MarketMind AI</h2>
        <p className="text-muted text-sm mb-5">ET Markets Hackathon 2026 — Problem Statement #6: AI for the Indian Investor</p>
        <div className="grid grid-cols-2 gap-4 stagger">
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ borderTop: `3px solid ${f.color}` }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-display font-bold text-base mb-2" style={{ color: '#0f2044' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#334e72' }}>{f.desc}</p>
            </div>
          ))}
          {/* 5th card spans 2 cols */}
        </div>
      </div>

      {/* Tech stack */}
      <div className="card">
        <h3 className="section-title mb-4">Tech Stack</h3>
        <div className="grid grid-cols-4 gap-5">
          {STACK.map(t => (
            <div key={t.layer}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{t.icon}</span>
                <span className="mono-label">{t.layer}</span>
              </div>
              <div className="space-y-1.5">
                {t.items.map(item => (
                  <div key={item} className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-navy-2">{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer section */}
      <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2044 0%, #1a3c6e 40%, #2756a8 100%)' }}>
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* Glow circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(0,200,117,0.12), transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(59,125,216,0.15), transparent)' }} />

        <div className="relative z-10 text-center py-16 px-10">
          <div className="inline-block bg-white/12 border border-white/22 text-white/80 font-mono text-[11px] px-5 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            👨‍💻 Built By
          </div>

          <div className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center text-5xl"
               style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            👨‍💻
          </div>

          <h2 className="font-display font-extrabold text-white mb-2" style={{ fontSize: '2.5rem', letterSpacing: '-0.5px' }}>
            Sanjay Yadav
          </h2>
          <p className="text-white/65 text-lg mb-1">Full-Stack Developer &amp; AI/ML Engineer</p>
          <p className="text-white/40 font-mono text-xs mb-7">Kanpur, Uttar Pradesh, India</p>

          <p className="text-white/60 text-sm leading-loose max-w-xl mx-auto mb-8">
            Passionate about building intelligent financial tools for India's growing retail investor community.
            Focused on turning complex NSE/BSE data streams into AI-powered investment intelligence that
            empowers every retail investor — from beginner to professional.
          </p>

          <div className="flex flex-wrap gap-2.5 justify-center mb-8">
            {['⚛️ React', '🐍 Python', '🤖 AI/ML', '📊 FinTech', '🏗️ FastAPI', '📈 NSE/BSE', '🗄️ PostgreSQL', '☁️ Cloud'].map(c => (
              <span key={c} className="px-4 py-1.5 rounded-full text-sm font-medium text-white/85"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>
                {c}
              </span>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            {[
              { href: 'https://github.com/sanjay-sky7/Market-Mind-AI', label: '⭐ MarketMind AI' },
              { href: 'https://github.com/sanjay-sky7', label: '🐙 GitHub Profile' },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                 className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5 no-underline"
                 style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)' }}>
                {l.label}
              </a>
            ))}
          </div>

          <div className="mt-10 pt-6 text-white/35 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            Built with ❤️ for the <span className="text-white/65 font-semibold">ET Markets AI Hackathon 2026</span>
            &nbsp;·&nbsp; Problem Statement #6 — AI for the Indian Investor
          </div>
        </div>
      </div>
    </div>
  )
}
