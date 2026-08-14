import { FormEvent, useMemo, useState } from 'react'
import { useData } from '../context/DataContext'
import type { CalendarEvent } from '../types'
import { Modal, PageHeader, StatusPill } from '../components/ui'

export default function CalendarPage() {
  const { data, addEvent, deleteEvent } = useData()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(new Date().toISOString().slice(0, 10))
  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    time: '10:00',
    type: 'meeting' as CalendarEvent['type'],
    projectId: '',
  })

  const year = Number(selected.slice(0, 4))
  const month = Number(selected.slice(5, 7)) - 1

  const days = useMemo(() => {
    const first = new Date(year, month, 1)
    const startPad = first.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = [...Array(startPad).fill(null)]
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [year, month])

  const dayEvents = data.events.filter((e) => e.date === selected)
  const monthLabel = new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const shiftMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1)
    setSelected(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    addEvent({
      title: form.title,
      date: form.date,
      time: form.time,
      type: form.type,
      projectId: form.projectId || undefined,
    })
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Meetings, deadlines, reminders."
        action={
          <button
            type="button"
            className="btn-primary text-sm"
            onClick={() => {
              setForm((f) => ({ ...f, date: selected }))
              setOpen(true)
            }}
          >
            Add event
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" className="btn-ghost px-3 py-1.5 text-sm" onClick={() => shiftMonth(-1)}>
              ←
            </button>
            <h2 className="font-display text-lg font-bold">{monthLabel}</h2>
            <button type="button" className="btn-ghost px-3 py-1.5 text-sm" onClick={() => shiftMonth(1)}>
              →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (d === null) return <div key={`e-${i}`} />
              const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
              const has = data.events.some((e) => e.date === iso)
              const active = iso === selected
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(iso)}
                  className={`relative rounded-lg py-3 text-sm font-medium transition ${
                    active ? 'bg-ink text-white' : 'hover:bg-mist'
                  }`}
                >
                  {d}
                  {has && (
                    <span
                      className={`absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                        active ? 'bg-accent' : 'bg-teal'
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="font-display text-lg font-bold">{selected}</h2>
          {dayEvents.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No events this day.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {dayEvents.map((e) => (
                <li key={e.id} className="rounded-lg bg-mist/80 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{e.title}</p>
                      <p className="text-xs text-muted">{e.time}</p>
                    </div>
                    <StatusPill status={e.type} />
                  </div>
                  <button type="button" className="mt-2 text-xs font-semibold text-danger" onClick={() => deleteEvent(e.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal open={open} title="New event" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="field" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input className="field" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CalendarEvent['type'] })}>
            <option value="meeting">Meeting</option>
            <option value="deadline">Deadline</option>
            <option value="reminder">Reminder</option>
          </select>
          <select className="field" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
            <option value="">No project</option>
            {data.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary w-full">
            Save event
          </button>
        </form>
      </Modal>
    </div>
  )
}
