import { useStore, Tab } from '../../store/useStore'
import clsx from 'clsx'

const TABS: { id: Tab; icon: string; label: string; badge?: string }[] = [
  { id: 'radar',    icon: '📡', label: 'Opportunity Radar' },
  { id: 'chart',    icon: '📊', label: 'Chart Intelligence' },
  { id: 'chat',     icon: '🤖', label: 'Market ChatGPT' },
  { id: 'video',    icon: '🎬', label: 'Video Engine' },
  { id: 'screener', icon: '🔍', label: 'Smart Screener', badge: 'NEW' },
  { id: 'about',    icon: '👤', label: 'Developer' },
]

export default function Navbar() {
  const { activeTab, setTab } = useStore()
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-border"
         style={{ boxShadow: '0 1px 0 #e2e8f4, 0 4px 24px rgba(15,32,68,0.06)' }}>
      <div className="max-w-[1440px] mx-auto px-6 h-[62px] flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base font-sans"
               style={{ background: 'linear-gradient(135deg, #0f2044, #2756a8)', boxShadow: '0 4px 12px rgba(26,60,110,0.35)' }}>
            M
          </div>
          <div>
            <span className="font-display font-extrabold text-xl" style={{ color: '#0f2044', letterSpacing: '-0.5px' }}>
              Market<span style={{ color: '#00c875' }}>Mind</span> AI
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0.5 bg-surface rounded-xl border border-border p-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                'relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all duration-200 whitespace-nowrap',
                activeTab === t.id
                  ? 'text-white'
                  : 'text-muted hover:text-navy-2 hover:bg-white'
              )}
              style={activeTab === t.id ? {
                background: 'linear-gradient(135deg, #1a3c6e, #2756a8)',
                boxShadow: '0 2px 10px rgba(26,60,110,0.3)'
              } : {}}
            >
              <span className="text-sm">{t.icon}</span>
              <span>{t.label}</span>
              {t.badge && (
                <span className="badge badge-new ml-0.5 py-0 text-[10px]">{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent font-mono text-[11px] font-semibold px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-accent live-dot inline-block" />
            NSE LIVE
          </div>
          <div className="font-mono text-[11px] text-muted hidden md:block">
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>
    </nav>
  )
}
