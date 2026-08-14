import { FormEvent, useState } from 'react'
import { useData } from '../context/DataContext'
import type { Task } from '../types'
import { EmptyState, Modal, PageHeader, StatusPill } from '../components/ui'

const columns: Task['status'][] = ['todo', 'doing', 'done']

export default function Tasks() {
  const { data, addTask, updateTask, deleteTask } = useData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    projectId: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    dueDate: '',
    assignee: 'You',
  })

  const projectName = (id: string) => data.projects.find((p) => p.id === id)?.name ?? '—'

  const startCreate = (status: Task['status'] = 'todo') => {
    setForm({
      title: '',
      projectId: data.projects[0]?.id ?? '',
      status,
      priority: 'medium',
      dueDate: new Date().toISOString().slice(0, 10),
      assignee: 'You',
    })
    setOpen(true)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    addTask(form)
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Kanban board for studio work."
        action={
          <button type="button" className="btn-primary text-sm" onClick={() => startCreate()} disabled={!data.projects.length}>
            Add task
          </button>
        }
      />

      {!data.projects.length ? (
        <EmptyState title="Add a project first" hint="Tasks need a project to live on." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((col) => {
            const items = data.tasks.filter((t) => t.status === col)
            return (
              <div key={col} className="rounded-xl bg-paper/70 p-3 border border-ink/8">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wide text-muted">{col}</h2>
                  <span className="text-xs text-muted">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((t) => (
                    <div key={t.id} className="panel p-3">
                      <p className="font-semibold text-sm">{t.title}</p>
                      <p className="mt-1 text-xs text-muted">{projectName(t.projectId)}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusPill status={t.priority} />
                        <span className="text-xs text-muted">{t.dueDate}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {columns
                          .filter((s) => s !== t.status)
                          .map((s) => (
                            <button
                              key={s}
                              type="button"
                              className="text-xs font-semibold text-teal"
                              onClick={() => updateTask(t.id, { status: s })}
                            >
                              → {s}
                            </button>
                          ))}
                        <button type="button" className="text-xs font-semibold text-danger" onClick={() => deleteTask(t.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="w-full rounded-lg border border-dashed border-fog py-2 text-xs font-semibold text-muted hover:border-ink/30"
                    onClick={() => startCreate(col)}
                  >
                    + Add
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={open} title="New task" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="field" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <select className="field" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
            {data.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })}>
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
          <select className="field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input className="field" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <button type="submit" className="btn-primary w-full">
            Add task
          </button>
        </form>
      </Modal>
    </div>
  )
}
