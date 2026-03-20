import { useStore } from './store/useStore'
import Navbar from './components/layout/Navbar'
import TickerBar from './components/layout/TickerBar'
import Hero from './components/layout/Hero'
import ToastContainer from './components/shared/Toast'
import RadarPage from './pages/RadarPage'
import ChartPage from './pages/ChartPage'
import ChatPage from './pages/ChatPage'
import VideoPage from './pages/VideoPage'
import ScreenerPage from './pages/ScreenerPage'
import AboutPage from './pages/AboutPage'

const PAGES: Record<string, JSX.Element> = {
  radar:    <RadarPage />,
  chart:    <ChartPage />,
  chat:     <ChatPage />,
  video:    <VideoPage />,
  screener: <ScreenerPage />,
  about:    <AboutPage />,
}

export default function App() {
  const { activeTab } = useStore()
  const showHero = activeTab !== 'about'

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      {/* Banner */}
      <div className="text-center font-mono text-[11px] py-1.5 tracking-wide text-white/80"
           style={{ background: 'linear-gradient(90deg, #0f2044, #2756a8, #0f2044)', backgroundSize: '200%' }}>
        🇮🇳 &nbsp; AI Intelligence for India's 14 Crore+ Retail Investors &nbsp;·&nbsp; NSE + BSE + MF &nbsp;·&nbsp; Real-time Signals &amp; Analysis
      </div>

      <Navbar />
      <TickerBar />
      {showHero && <Hero />}

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6">
        <div key={activeTab} className="page-enter">
          {PAGES[activeTab]}
        </div>
      </main>

      <footer style={{ background: '#0f2044' }} className="text-center py-4 text-xs text-white/40 mt-8">
        © 2026{' '}
        <span className="text-white/75 font-semibold">MarketMind AI</span> by{' '}
        <span className="text-white/75 font-semibold">Sanjay Yadav</span>
        &nbsp;·&nbsp; ET Markets Hackathon 2026 &nbsp;·&nbsp; Not SEBI-registered financial advice
      </footer>
    </div>
  )
}
