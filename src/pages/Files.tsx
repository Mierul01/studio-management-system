import { FormEvent, useState } from 'react'
import { useData } from '../context/DataContext'
import { EmptyState, Modal, PageHeader } from '../components/ui'

export default function Files() {
  const { data, addFile, deleteFile } = useData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'PDF',
    size: '1 MB',
    projectId: data.projects[0]?.id ?? '',
  })

  const projectName = (id: string) => data.projects.find((p) => p.id === id)?.name ?? '—'

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    addFile(form)
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Files"
        subtitle="Project assets and deliverables."
        action={
          <button type="button" className="btn-primary text-sm" onClick={() => setOpen(true)} disabled={!data.projects.length}>
            Add file
          </button>
        }
      />

      {data.files.length === 0 ? (
        <EmptyState title="No files" hint="Attach deliverables to projects." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.files.map((f) => (
            <div key={f.id} className="panel p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mist font-display text-sm font-bold text-teal">
                  {f.type.slice(0, 3)}
                </div>
                <button type="button" className="text-xs font-semibold text-danger" onClick={() => deleteFile(f.id)}>
                  Delete
                </button>
              </div>
              <p className="mt-3 font-semibold break-all">{f.name}</p>
              <p className="mt-1 text-xs text-muted">
                {projectName(f.projectId)} · {f.size} · {f.updatedAt}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} title="Add file" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="field" placeholder="File name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>PDF</option>
            <option>Figma</option>
            <option>Sheet</option>
            <option>Archive</option>
            <option>Image</option>
          </select>
          <input className="field" placeholder="Size" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
          <select className="field" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
            {data.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary w-full">
            Save
          </button>
        </form>
      </Modal>
    </div>
  )
}
