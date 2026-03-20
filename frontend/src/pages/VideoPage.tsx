import { useState, useEffect } from 'react'
import { startVideoJob, pollVideoJob, fetchRecentVideos } from '../services/api'
import { useQuery } from '@tanstack/react-query'
import MarketBreadth from '../components/shared/MarketBreadth'
import { toast } from '../components/shared/Toast'
import clsx from 'clsx'

const TYPES = [
  { id:'daily_wrap',      icon:'📺', title:'Daily Market Wrap',      desc:'NSE closing summary with sector heatmap',  color:'#00a85a', dur:'~60s' },
  { id:'sector_rotation', icon:'🔄', title:'Sector Rotation Alert',  desc:'FII/DII flow visualization by sector',     color:'#2756a8', dur:'~45s' },
  { id:'race_chart',      icon:'🏎️', title:'Race Chart — Gainers',   desc:'Animated Nifty 500 YTD performance',       color:'#f5a623', dur:'~38s' },
  { id:'ipo_tracker',     icon:'📈', title:'IPO Tracker Update',     desc:'Upcoming & recent IPO performance',        color:'#e03152', dur:'~55s' },
]

export default function VideoPage() {
  const [job, setJob] = useState<any>(null)
  const { data: recent = [], refetch } = useQuery({ queryKey: ['recent-videos'], queryFn: fetchRecentVideos })

  useEffect(() => {
    if (!job || job.status === 'done' || job.status === 'error') return
    const t = setInterval(async () => {
      const s = await pollVideoJob(job.job_id)
      setJob(s)
      if (s.status === 'done') {
        clearInterval(t)
        refetch()
        toast({ title: 'Video Ready!', message: `${s.title ?? 'Your video'} is ready to download.`, type: 'success' })
      }
      if (s.status === 'error') { clearInterval(t); toast({ title: 'Error', message: 'Video generation failed.', type: 'danger' }) }
    }, 1200)
    return () => clearInterval(t)
  }, [job])

  const generate = async (type: string, title: string) => {
    const res = await startVideoJob(type, {})
    setJob({ job_id: res.job_id, status:'queued', progress:0, step:'Queued…' })
    toast({ title: 'Job Started', message: `Generating: ${title}`, type: 'info' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">AI Market Video Engine</h2>
        <p className="text-muted text-xs mt-0.5">Auto-generated market videos · Race charts · Sector rotations · IPO trackers · Zero human editing</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Generator + progress */}
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {TYPES.map(v => (
              <button key={v.id} onClick={() => generate(v.id, v.title)}
                className="group flex items-center gap-4 bg-white border border-border rounded-2xl px-5 py-4 text-left shadow-card hover:shadow-md hover:-translate-y-0.5 hover:border-border2 transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-md transition-transform group-hover:scale-110"
                     style={{ background:`linear-gradient(135deg,${v.color}cc,${v.color})` }}>
                  {v.icon}
                </div>
                <div className="flex-1">
                  <div className="font-display font-bold text-sm text-navy-2 group-hover:text-blue transition-colors">{v.title}</div>
                  <div className="text-[11px] text-muted mt-0.5">{v.desc}</div>
                  <div className="font-mono text-[10px] mt-1" style={{ color: v.color }}>Duration: {v.dur}</div>
                </div>
                <div className="text-blue font-bold text-xl ml-auto opacity-40 group-hover:opacity-100 transition-opacity">→</div>
              </button>
            ))}
          </div>

          {/* Job progress */}
          {job && (
            <div className="card" style={{ background:'linear-gradient(135deg,#f8fafd,#f0f6ff)' }}>
              <div className="flex items-center gap-4 mb-4">
                {job.status === 'done' ? (
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-bold shrink-0">✓</div>
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                       style={{ background:'linear-gradient(135deg,#1a3c6e,#2756a8)' }}>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-semibold text-navy-2 text-sm">
                    {job.status==='done' ? '✅ Video generated successfully!' : 'Generating video…'}
                  </div>
                  <div className="text-muted text-[11px] mt-0.5 font-mono">{job.step}</div>
                </div>
                {job.status==='done' && job.file_url && (
                  <a href={job.file_url} className="btn-accent text-xs px-4 py-2 no-underline rounded-lg font-bold">⬇ Download MP4</a>
                )}
              </div>
              <div className="progress-bar" style={{ height:8 }}>
                <div className="progress-fill" style={{ width:`${job.progress}%` }} />
              </div>
              <div className="flex justify-between font-mono text-[11px] text-muted mt-1.5">
                <span>Progress</span><span>{job.progress}%</span>
              </div>
            </div>
          )}

          {/* Recent */}
          {recent.length > 0 && (
            <div>
              <div className="mono-label mb-3">Recent Videos</div>
              <div className="grid grid-cols-3 gap-3">
                {recent.map((v: any) => {
                  const type = TYPES.find(t => t.id === v.video_type)
                  return (
                    <div key={v.job_id} className="card p-0 overflow-hidden hover:-translate-y-1 transition-all">
                      <div className="h-28 flex items-center justify-center text-4xl"
                           style={{ background:`linear-gradient(135deg,${type?.color??'#1a3c6e'}18,${type?.color??'#2756a8'}28)` }}>
                        {type?.icon ?? '🎬'}
                      </div>
                      <div className="p-3">
                        <div className="mono-label mb-0.5" style={{ color:type?.color }}>{v.video_type?.replace('_',' ').toUpperCase()}</div>
                        <div className="font-semibold text-xs text-navy-2 leading-snug">{v.title}</div>
                        <div className="flex justify-between font-mono text-[10px] text-muted mt-1.5">
                          <span>{v.duration_sec}s</span>
                          <span className="text-accent">✓ AI Generated</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="card" style={{ background:'linear-gradient(135deg,#0f2044,#1a3c6e)',border:'none' }}>
            <div className="mono-label text-white/50 mb-4">How AI Video Generation Works</div>
            <div className="grid grid-cols-4 gap-6">
              {[
                { n:'1', t:'Fetch Live Data',  d:'NSE prices, indices, sector performance' },
                { n:'2', t:'AI Script',         d:'Claude generates crisp commentary' },
                { n:'3', t:'Render Animation',  d:'matplotlib + ffmpeg animates charts' },
                { n:'4', t:'Encode & Deliver',  d:'Compressed MP4, share-ready' },
              ].map(s => (
                <div key={s.n} className="text-center">
                  <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 text-accent font-bold font-mono text-sm flex items-center justify-center mx-auto mb-2.5">{s.n}</div>
                  <div className="font-semibold text-white text-xs mb-1">{s.t}</div>
                  <div className="text-white/45 text-[11px] leading-snug">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Market Breadth */}
        <div>
          <MarketBreadth />
        </div>
      </div>
    </div>
  )
}
