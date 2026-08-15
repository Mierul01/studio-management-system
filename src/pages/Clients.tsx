import { FormEvent, useState } from 'react'
import { useData } from '../context/DataContext'
import { formatMoney, type Client } from '../types'
import { EmptyState, Modal, PageHeader, StatusPill } from '../components/ui'

export default function Clients() {
  const { data, addClient, updateClient, deleteClient } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    status: 'lead' as Client['status'],
    value: 0,
    notes: '',
  })

  const startCreate = () => {
    setEditing(null)
    setForm({ name: '', company: '', email: '', status: 'lead', value: 0, notes: '' })
    setOpen(true)
  }

  const startEdit = (c: Client) => {
    setEditing(c)
    setForm({
      name: c.name,
      company: c.company,
      email: c.email,
      status: c.status,
      value: c.value,
      notes: c.notes,
    })
    setOpen(true)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (editing) updateClient(editing.id, form)
    else addClient(form)
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle="Leads, retainers, and relationships."
        action={
          <button type="button" className="btn-primary text-sm" onClick={startCreate}>
            Add client
          </button>
        }
      />

      {data.clients.length === 0 ? (
        <EmptyState title="No clients yet" hint="Add your first client to start the pipeline." />
      ) : (
        <div className="panel overflow-hidden p-2 sm:p-3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="text-xs font-semibold uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.clients.map((c) => {
                  const initials = c.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                  return (
                    <tr key={c.id} className="data-row">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mist text-xs font-bold text-accent group-hover:bg-white/20">
                            {initials}
                          </span>
                          <div>
                            <p className="font-semibold">{c.name}</p>
                            <p className="text-xs text-muted">{c.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="px-4 py-3 font-medium">{formatMoney(c.value)}</td>
                      <td className="px-4 py-3 text-muted">{c.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button type="button" className="text-sm font-semibold" onClick={() => startEdit(c)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-sm font-semibold opacity-80"
                            onClick={() => deleteClient(c.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={open} title={editing ? 'Edit client' : 'New client'} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="field" placeholder="Contact name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="field" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <select className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Client['status'] })}>
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
          <input className="field" type="number" placeholder="Pipeline value" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
          <textarea className="field min-h-20" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button type="submit" className="btn-primary w-full">
            Save
          </button>
        </form>
      </Modal>
    </div>
  )
}
