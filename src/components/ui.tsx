import type { ReactNode } from 'react'

const tones: Record<string, string> = {
  active: 'bg-teal-soft text-teal',
  lead: 'bg-[#eef3f7] text-ink-soft',
  paused: 'bg-[#f3ebe6] text-accent-deep',
  planning: 'bg-[#eef3f7] text-ink-soft',
  review: 'bg-[#f7f0e3] text-amber',
  done: 'bg-teal-soft text-teal',
  todo: 'bg-[#eef3f7] text-ink-soft',
  doing: 'bg-[#f7f0e3] text-amber',
  draft: 'bg-[#eef3f7] text-ink-soft',
  sent: 'bg-[#e8f0f7] text-[#2a5f8a]',
  paid: 'bg-teal-soft text-teal',
  overdue: 'bg-[#f8e8e6] text-danger',
  high: 'bg-[#f8e8e6] text-danger',
  medium: 'bg-[#f7f0e3] text-amber',
  low: 'bg-[#eef3f7] text-muted',
  meeting: 'bg-[#e8f0f7] text-[#2a5f8a]',
  deadline: 'bg-[#f8e8e6] text-danger',
  reminder: 'bg-[#f7f0e3] text-amber',
}

export function StatusPill({ status }: { status: string }) {
  return <span className={`status-pill ${tones[status] ?? 'bg-fog text-ink'}`}>{status}</span>
}

export function PageHeader({
  title: _title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  if (!subtitle && !action) return null
  return (
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : <span />}
      {action}
    </div>
  )
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="panel px-6 py-12 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </div>
  )
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md animate-rise rounded-xl bg-paper p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-muted hover:bg-mist"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="panel p-5">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}
