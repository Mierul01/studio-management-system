import { FormEvent, useEffect, useState } from 'react'
import { useData } from '../context/DataContext'
import { PageHeader, Modal } from '../components/ui'

function fmtMinutes(m: number) {
  const h = Math.floor(m / 60)
  const min = m % 60
  return `${h}h ${min}m`
}

export default function TimeTracker() {
  const { data, addTimeEntry, deleteTimeEntry } = useData()
  const [open, setOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [timerProject, setTimerProject] = useState(data.projects[0]?.id ?? '')
  const [timerDesc, setTimerDesc] = useState('')
  const [form, setForm] = useState({
    projectId: data.projects[0]?.id ?? '',
    description: '',
    minutes: 60,
    date: new Date().toISOString().slice(0, 10),
    billable: true,
  })

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const projectName = (id: string) => data.projects.find((p) => p.id === id)?.name ?? '—'
  const total = data.timeEntries.reduce((s, t) => s + t.minutes, 0)
  const billable = data.timeEntries.filter((t) => t.billable).reduce((s, t) => s + t.minutes, 0)

  const stopAndSave = () => {
    setRunning(false)
    const minutes = Math.max(1, Math.round(seconds / 60))
    if (timerProject) {
      addTimeEntry({
        projectId: timerProject,
        description: timerDesc || 'Timed session',
        minutes,
        date: new Date().toISOString().slice(0, 10),
        billable: true,
      })
    }
    setSeconds(0)
    setTimerDesc('')
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    addTimeEntry(form)
    setOpen(false)
  }

  const display = `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(
    Math.floor((seconds % 3600) / 60),
  ).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <div>
      <PageHeader
        title="Time"
        subtitle="Track billable hours against projects."
        action={
          <button type="button" className="btn-primary text-sm" onClick={() => setOpen(true)} disabled={!data.projects.length}>
            Log time
          </button>
        }
      />

      <div className="panel mb-6 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted">Live timer</p>
            <p className="font-display text-4xl font-bold tabular-nums tracking-tight">{display}</p>
          </div>
          <div className="flex flex-1 flex-col gap-2 sm:max-w-md">
            <select className="field" value={timerProject} onChange={(e) => setTimerProject(e.target.value)}>
              {data.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              className="field"
              placeholder="What are you working on?"
              value={timerDesc}
              onChange={(e) => setTimerDesc(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {!running ? (
              <button type="button" className="btn-primary" onClick={() => setRunning(true)} disabled={!timerProject}>
                Start
              </button>
            ) : (
              <button type="button" className="btn-primary bg-danger hover:bg-danger" onClick={stopAndSave}>
                Stop & save
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div className="panel p-4">
          <p className="text-sm text-muted">Total logged</p>
          <p className="font-display text-2xl font-bold">{fmtMinutes(total)}</p>
        </div>
        <div className="panel p-4">
          <p className="text-sm text-muted">Billable</p>
          <p className="font-display text-2xl font-bold">{fmtMinutes(billable)}</p>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <ul className="divide-y divide-ink/5">
          {data.timeEntries.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <div>
                <p className="font-semibold">{t.description}</p>
                <p className="text-xs text-muted">
                  {projectName(t.projectId)} · {t.date} · {t.billable ? 'Billable' : 'Non-billable'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold tabular-nums">{fmtMinutes(t.minutes)}</span>
                <button type="button" className="font-semibold text-danger" onClick={() => deleteTimeEntry(t.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Modal open={open} title="Log time" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <select className="field" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
            {data.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input className="field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input className="field" type="number" min={1} placeholder="Minutes" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: Number(e.target.value) })} />
          <input className="field" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.billable} onChange={(e) => setForm({ ...form, billable: e.target.checked })} />
            Billable
          </label>
          <button type="submit" className="btn-primary w-full">
            Save entry
          </button>
        </form>
      </Modal>
    </div>
  )
}
