import { FormEvent, useState } from 'react'
import { useData } from '../context/DataContext'
import { formatMoney, type Invoice } from '../types'
import { EmptyState, Modal, PageHeader, StatusPill } from '../components/ui'

export default function Invoices() {
  const { data, addInvoice, updateInvoice, deleteInvoice } = useData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    number: '',
    clientId: '',
    amount: 0,
    status: 'draft' as Invoice['status'],
    issuedAt: '',
    dueDate: '',
    note: '',
  })

  const clientName = (id: string) => data.clients.find((c) => c.id === id)?.company ?? '—'

  const startCreate = () => {
    const n = data.invoices.length + 1040
    setForm({
      number: `ATL-${n}`,
      clientId: data.clients[0]?.id ?? '',
      amount: 0,
      status: 'draft',
      issuedAt: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      note: '',
    })
    setOpen(true)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    addInvoice(form)
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="Draft, send, collect."
        action={
          <button type="button" className="btn-primary text-sm" onClick={startCreate} disabled={!data.clients.length}>
            New invoice
          </button>
        }
      />

      {data.invoices.length === 0 ? (
        <EmptyState title="No invoices" hint="Create an invoice when you are ready to bill." />
      ) : (
        <div className="panel overflow-hidden p-2 sm:p-3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs font-semibold uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Number</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.invoices.map((inv) => (
                  <tr key={inv.id} className="data-row">
                    <td className="px-4 py-3 font-semibold">{inv.number}</td>
                    <td className="px-4 py-3">{clientName(inv.clientId)}</td>
                    <td className="px-4 py-3 font-medium">{formatMoney(inv.amount)}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={inv.status} />
                    </td>
                    <td className="px-4 py-3 text-muted">{inv.dueDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-3">
                        {inv.status !== 'paid' && (
                          <button
                            type="button"
                            className="text-sm font-semibold"
                            onClick={() => updateInvoice(inv.id, { status: 'paid' })}
                          >
                            Mark paid
                          </button>
                        )}
                        {inv.status === 'draft' && (
                          <button
                            type="button"
                            className="text-sm font-semibold"
                            onClick={() => updateInvoice(inv.id, { status: 'sent' })}
                          >
                            Send
                          </button>
                        )}
                        <button type="button" className="text-sm font-semibold opacity-80" onClick={() => deleteInvoice(inv.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={open} title="New invoice" onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="field" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} required />
          <select className="field" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
            {data.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company}
              </option>
            ))}
          </select>
          <input className="field" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required />
          <select className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Invoice['status'] })}>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <input className="field" type="date" value={form.issuedAt} onChange={(e) => setForm({ ...form, issuedAt: e.target.value })} />
          <input className="field" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <input className="field" placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <button type="submit" className="btn-primary w-full">
            Create invoice
          </button>
        </form>
      </Modal>
    </div>
  )
}
