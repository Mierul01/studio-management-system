import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { formatMoney } from '../types'
import { StatCard, StatusPill } from '../components/ui'

export default function Dashboard() {
  const { data } = useData()
  const activeProjects = data.projects.filter((p) => p.status === 'active' || p.status === 'review')
  const unpaid = data.invoices.filter((i) => i.status === 'sent' || i.status === 'overdue')
  const unpaidTotal = unpaid.reduce((s, i) => s + i.amount, 0)
  const paidTotal = data.invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const openTasks = data.tasks.filter((t) => t.status !== 'done')
  const upcoming = [...data.events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)
  const clientName = (id: string) => data.clients.find((c) => c.id === id)?.company ?? '—'

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Paid revenue" value={formatMoney(paidTotal)} hint="From paid invoices" />
        <StatCard label="Outstanding" value={formatMoney(unpaidTotal)} hint={`${unpaid.length} open invoices`} />
        <StatCard label="Active projects" value={String(activeProjects.length)} hint="In flight or review" />
        <StatCard label="Open tasks" value={String(openTasks.length)} hint="Todo + doing" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold">Projects</h2>
            <Link to="/app/projects" className="text-xs font-semibold text-accent">
              All
            </Link>
          </div>
          <ul className="space-y-3">
            {data.projects.slice(0, 4).map((p) => (
              <li key={p.id} className="rounded-lg bg-mist/80 px-3 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted">{clientName(p.clientId)}</p>
                  </div>
                  <StatusPill status={p.status} />
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-fog">
                  <div className="h-full rounded-full bg-teal" style={{ width: `${p.progress}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold">Upcoming</h2>
            <Link to="/app/calendar" className="text-xs font-semibold text-accent">
              Calendar
            </Link>
          </div>
          <ul className="space-y-3">
            {upcoming.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg bg-mist/80 px-3 py-3">
                <div>
                  <p className="text-sm font-semibold">{e.title}</p>
                  <p className="text-xs text-muted">
                    {e.date} · {e.time}
                  </p>
                </div>
                <StatusPill status={e.type} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
