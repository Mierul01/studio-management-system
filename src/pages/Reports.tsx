import { useData } from '../context/DataContext'
import { formatMoney } from '../types'
import { PageHeader, StatCard } from '../components/ui'

export default function Reports() {
  const { data } = useData()

  const byStatus = data.projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {})

  const invoiceTotals = {
    paid: data.invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    sent: data.invoices.filter((i) => i.status === 'sent').reduce((s, i) => s + i.amount, 0),
    overdue: data.invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
    draft: data.invoices.filter((i) => i.status === 'draft').reduce((s, i) => s + i.amount, 0),
  }

  const hoursByProject = data.projects.map((p) => ({
    name: p.name,
    minutes: data.timeEntries.filter((t) => t.projectId === p.id).reduce((s, t) => s + t.minutes, 0),
  }))
  const maxMinutes = Math.max(...hoursByProject.map((h) => h.minutes), 1)

  const clientValue = [...data.clients].sort((a, b) => b.value - a.value)

  return (
    <div>
      <PageHeader title="Reports" subtitle="Revenue, utilization, and pipeline." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Paid" value={formatMoney(invoiceTotals.paid)} />
        <StatCard label="Sent" value={formatMoney(invoiceTotals.sent)} />
        <StatCard label="Overdue" value={formatMoney(invoiceTotals.overdue)} />
        <StatCard label="Draft" value={formatMoney(invoiceTotals.draft)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="font-display text-lg font-bold">Hours by project</h2>
          <ul className="mt-4 space-y-3">
            {hoursByProject.map((h) => (
              <li key={h.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{h.name}</span>
                  <span className="text-muted">{(h.minutes / 60).toFixed(1)}h</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-fog">
                  <div
                    className="h-full rounded-full bg-teal"
                    style={{ width: `${(h.minutes / maxMinutes) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="font-display text-lg font-bold">Project status mix</h2>
          <ul className="mt-4 space-y-2">
            {Object.entries(byStatus).map(([status, count]) => (
              <li key={status} className="flex items-center justify-between rounded-lg bg-mist/80 px-3 py-2 text-sm">
                <span className="capitalize font-medium">{status}</span>
                <span className="font-bold">{count}</span>
              </li>
            ))}
          </ul>
          <h2 className="mt-6 font-display text-lg font-bold">Top clients by value</h2>
          <ul className="mt-3 space-y-2">
            {clientValue.map((c) => (
              <li key={c.id} className="flex justify-between text-sm">
                <span>{c.company}</span>
                <span className="font-semibold">{formatMoney(c.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
