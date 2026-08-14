import { FormEvent, useState } from 'react'
import { useData } from '../context/DataContext'
import { formatMoney, type Project } from '../types'
import { EmptyState, Modal, PageHeader, StatusPill } from '../components/ui'

export default function Projects() {
  const { data, addProject, updateProject, deleteProject } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState({
    name: '',
    clientId: '',
    status: 'planning' as Project['status'],
    budget: 0,
    dueDate: '',
    progress: 0,
    description: '',
  })

  const clientName = (id: string) => data.clients.find((c) => c.id === id)?.company ?? '—'

  const startCreate = () => {
    setEditing(null)
    setForm({
      name: '',
      clientId: data.clients[0]?.id ?? '',
      status: 'planning',
      budget: 0,
      dueDate: new Date().toISOString().slice(0, 10),
      progress: 0,
      description: '',
    })
    setOpen(true)
  }

  const startEdit = (p: Project) => {
    setEditing(p)
    setForm({
      name: p.name,
      clientId: p.clientId,
      status: p.status,
      budget: p.budget,
      dueDate: p.dueDate,
      progress: p.progress,
      description: p.description,
    })
    setOpen(true)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (editing) updateProject(editing.id, form)
    else addProject(form)
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Scope, budgets, and progress."
        action={
          <button type="button" className="btn-primary text-sm" onClick={startCreate} disabled={!data.clients.length}>
            New project
          </button>
        }
      />

      {data.projects.length === 0 ? (
        <EmptyState title="No projects" hint="Create a client first, then add a project." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.projects.map((p) => (
            <div key={p.id} className="panel p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-bold">{p.name}</h3>
                  <p className="text-sm text-muted">{clientName(p.clientId)}</p>
                </div>
                <StatusPill status={p.status} />
              </div>
              <p className="mt-3 text-sm text-ink-soft line-clamp-2">{p.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold">{formatMoney(p.budget)}</span>
                <span className="text-muted">Due {p.dueDate}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-fog">
                <div className="h-full rounded-full bg-accent" style={{ width: `${p.progress}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted">{p.progress}% complete</p>
              <div className="mt-4 flex gap-3">
                <button type="button" className="text-sm font-semibold text-teal" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button type="button" className="text-sm font-semibold text-danger" onClick={() => deleteProject(p.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} title={editing ? 'Edit project' : 'New project'} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="field" placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <select className="field" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
            {data.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company}
              </option>
            ))}
          </select>
          <select className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project['status'] })}>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
          <input className="field" type="number" placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
          <input className="field" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <label className="block text-sm">
            Progress: {form.progress}%
            <input className="mt-1 w-full" type="range" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
          </label>
          <textarea className="field min-h-20" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button type="submit" className="btn-primary w-full">
            Save
          </button>
        </form>
      </Modal>
    </div>
  )
}
