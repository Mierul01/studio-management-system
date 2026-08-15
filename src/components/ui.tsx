import type { ReactNode } from 'react'

const tones: Record<string, string> = {
  active: 'text-teal',
  lead: 'text-accent',
  paused: 'text-muted',
  planning: 'text-muted',
  review: 'text-amber',
  done: 'text-teal',
  todo: 'text-muted',
  doing: 'text-amber',
  draft: 'text-muted',
  sent: 'text-accent',
  paid: 'text-teal',
  overdue: 'text-danger',
  high: 'text-danger',
  medium: 'text-amber',
  low: 'text-muted',
  meeting: 'text-accent',
  deadline: 'text-danger',
  reminder: 'text-amber',
}

export function StatusPill({ status }: { status: string }) {
  return <span className={`status-pill ${tones[status] ?? 'text-ink-soft'}`}>{status}</span>
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
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : <span />}
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
      <div className="relative w-full max-w-md animate-rise rounded-2xl bg-paper p-6 shadow-xl">
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
    <div className="panel p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1.5 font-display text-xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
    </div>
  )
}
