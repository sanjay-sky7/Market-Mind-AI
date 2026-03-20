import { useEffect, useState } from 'react'
import clsx from 'clsx'

export interface ToastItem {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'danger' | 'info'
  duration?: number
}

let _addToast: ((t: Omit<ToastItem, 'id'>) => void) | null = null

export function toast(t: Omit<ToastItem, 'id'>) {
  _addToast?.(t)
}

const TYPE_STYLES: Record<ToastItem['type'], { bar: string; icon: string; bg: string }> = {
  success: { bar: '#00c875', icon: '✅', bg: 'rgba(0,200,117,0.08)' },
  warning: { bar: '#f5a623', icon: '⚠️', bg: 'rgba(245,166,35,0.08)' },
  danger:  { bar: '#e03152', icon: '🔴', bg: 'rgba(224,49,82,0.08)'  },
  info:    { bar: '#2756a8', icon: 'ℹ️',  bg: 'rgba(39,86,168,0.08)' },
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    _addToast = (t) => {
      const id = Math.random().toString(36).slice(2)
      setToasts(prev => [...prev, { ...t, id }])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), t.duration ?? 4200)
    }
    return () => { _addToast = null }
  }, [])

  return (
    <div className="fixed top-[72px] right-5 z-[200] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map(t => {
        const s = TYPE_STYLES[t.type]
        return (
          <div
            key={t.id}
            className="w-72 rounded-xl border border-border shadow-lg pointer-events-auto"
            style={{
              background: s.bg,
              backdropFilter: 'blur(16px)',
              borderLeft: `4px solid ${s.bar}`,
              animation: 'pageEnter 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm">{s.icon}</span>
                <span className="font-mono text-[11px] font-bold text-navy-2">{t.title}</span>
              </div>
              <p className="text-xs text-muted leading-snug pl-5">{t.message}</p>
            </div>
            <div className="h-0.5 mx-4 mb-3 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  background: s.bar,
                  animation: `shrink ${(t.duration ?? 4200) - 200}ms linear forwards`,
                  width: '100%',
                }}
              />
            </div>
          </div>
        )
      })}
      <style>{`
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  )
}
