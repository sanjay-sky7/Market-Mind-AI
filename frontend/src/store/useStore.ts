import { create } from 'zustand'

export type Tab = 'radar' | 'chart' | 'chat' | 'video' | 'screener' | 'about'

export interface PortfolioItem { symbol: string; quantity: number; avg_price: number }
export interface ChatMsg { role: 'user' | 'assistant'; content: string }
export interface AlertRule { id: string; symbol: string; condition: 'above' | 'below'; price: number; active: boolean }

interface AppState {
  activeTab: Tab
  setTab: (t: Tab) => void

  portfolio: PortfolioItem[]
  setPortfolio: (p: PortfolioItem[]) => void

  chatHistory: ChatMsg[]
  addChatMsg: (m: ChatMsg) => void
  clearChat: () => void

  signalFilter: string
  setSignalFilter: (f: string) => void

  selectedSymbol: string
  setSelectedSymbol: (s: string) => void

  chartTimeframe: string
  setChartTimeframe: (tf: string) => void

  alertRules: AlertRule[]
  addAlert: (a: AlertRule) => void
  removeAlert: (id: string) => void

  sidebarOpen: boolean
  setSidebar: (v: boolean) => void
}

export const useStore = create<AppState>((set) => ({
  activeTab: 'radar',
  setTab: (t) => set({ activeTab: t }),

  portfolio: [
    { symbol: 'RELIANCE',  quantity: 10, avg_price: 2870 },
    { symbol: 'INFY',      quantity: 25, avg_price: 1680 },
    { symbol: 'HDFCBANK',  quantity: 15, avg_price: 1620 },
    { symbol: 'TCS',       quantity:  5, avg_price: 3800 },
  ],
  setPortfolio: (p) => set({ portfolio: p }),

  chatHistory: [],
  addChatMsg: (m) => set((s) => ({ chatHistory: [...s.chatHistory, m] })),
  clearChat: () => set({ chatHistory: [] }),

  signalFilter: 'all',
  setSignalFilter: (f) => set({ signalFilter: f }),

  selectedSymbol: 'RELIANCE',
  setSelectedSymbol: (s) => set({ selectedSymbol: s }),

  chartTimeframe: '1D',
  setChartTimeframe: (tf) => set({ chartTimeframe: tf }),

  alertRules: [],
  addAlert: (a) => set((s) => ({ alertRules: [...s.alertRules, a] })),
  removeAlert: (id) => set((s) => ({ alertRules: s.alertRules.filter(r => r.id !== id) })),

  sidebarOpen: false,
  setSidebar: (v) => set({ sidebarOpen: v }),
}))
