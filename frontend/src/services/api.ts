import axios from 'axios'

const api = axios.create({ baseURL: '/api', timeout: 20000 })

export const fetchIndices    = () => api.get('/market/indices').then(r => r.data)
export const fetchTickers    = (symbols?: string) => api.get('/market/tickers', { params: { symbols } }).then(r => r.data)
export const fetchOHLCV      = (symbol: string, timeframe = '1D') => api.get(`/market/ohlcv/${symbol}`, { params: { timeframe } }).then(r => r.data)

export const fetchSignals    = (params?: any) => api.get('/radar/signals', { params }).then(r => r.data)
export const fetchRadarStats = () => api.get('/radar/stats').then(r => r.data)

export const fetchPatterns         = (symbols?: string) => api.get('/chart/patterns', { params: { symbols } }).then(r => r.data)
export const fetchPatternForSymbol = (symbol: string)   => api.get(`/chart/patterns/${symbol}`).then(r => r.data)
export const fetchAIAnalysis       = (symbol: string)   => api.post(`/chart/patterns/${symbol}/ai-analysis`).then(r => r.data)

export const sendChatMessage = (payload: { message: string; history: any[]; portfolio_context?: any[] }) =>
  api.post('/chat/message', payload).then(r => r.data)

export const startVideoJob     = (video_type: string, params = {}) => api.post('/video/generate', { video_type, params }).then(r => r.data)
export const pollVideoJob      = (job_id: string) => api.get(`/video/status/${job_id}`).then(r => r.data)
export const fetchRecentVideos = () => api.get('/video/recent').then(r => r.data)

export const screenStocks = (params?: {
  sector?: string; signal?: string; pe_max?: number; roe_min?: number;
  rsi_min?: number; volume_min?: number; de_max?: number; div_min?: number;
  sort_by?: string; sort_dir?: string; limit?: number;
}) => api.get('/screener/screen', { params }).then(r => r.data)
export const fetchSectors = () => api.get('/screener/sectors').then(r => r.data)

export default api
