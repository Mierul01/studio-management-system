import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { formatMoney } from '../types'
import { PageHeader } from '../components/ui'

export default function Profile() {
  const { user, isDemo, updateProfile } = useAuth()
  const { data } = useData()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: '',
    company: '',
    role: '',
    phone: '',
    location: '',
    website: '',
    bio: '',
  })

  useEffect(() => {
    if (!user) return
    setForm({
      name: user.name,
      company: user.company,
      role: user.role,
      phone: user.phone,
      location: user.location,
      website: user.website,
      bio: user.bio,
    })
  }, [user])

  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const paid = data.invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const hours = data.timeEntries.reduce((s, t) => s + t.minutes, 0) / 60

  const onSave = (e: FormEvent) => {
    e.preventDefault()
    updateProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your public studio identity inside Atelier." />

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="panel overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-teal/30 via-mist to-accent/25" />
          <div className="px-5 pb-5">
            <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-paper bg-ink font-display text-2xl font-bold text-white shadow-md">
              {initials}
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted">
              {user.role || 'Studio owner'} · {user.company}
            </p>
            {isDemo && (
              <p className="mt-2 text-xs font-semibold text-accent">Demo profile — edits stay in this browser</p>
            )}
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Email</dt>
                <dd className="truncate font-medium">{user.email}</dd>
              </div>
              {user.phone && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Phone</dt>
                  <dd className="font-medium">{user.phone}</dd>
                </div>
              )}
              {user.location && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Location</dt>
                  <dd className="font-medium">{user.location}</dd>
                </div>
              )}
              {user.website && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Website</dt>
                  <dd className="truncate font-medium text-teal">{user.website.replace(/^https?:\/\//, '')}</dd>
                </div>
              )}
            </dl>
            {user.bio && <p className="mt-4 text-sm leading-relaxed text-ink-soft">{user.bio}</p>}

            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-ink/8 pt-4">
              <div>
                <p className="text-xs text-muted">Clients</p>
                <p className="font-display text-xl font-bold">{data.clients.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Projects</p>
                <p className="font-display text-xl font-bold">{data.projects.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Paid</p>
                <p className="font-display text-xl font-bold">{formatMoney(paid)}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">{hours.toFixed(1)} hours logged across the workspace</p>
          </div>
        </div>

        <form onSubmit={onSave} className="panel space-y-4 p-5">
          <h3 className="font-display text-lg font-bold">Edit profile</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Full name</label>
              <input
                className="field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Role / title</label>
              <input
                className="field"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Creative director"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Studio / company</label>
              <input
                className="field"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input
                className="field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 …"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Location</label>
              <input
                className="field"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, country"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Website</label>
              <input
                className="field"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <textarea
              className="field min-h-28"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Short intro for your studio…"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input className="field" value={user.email} disabled />
            <p className="mt-1 text-xs text-muted">Email is tied to your account and cannot be changed here.</p>
          </div>
          <button type="submit" className="btn-primary">
            {saved ? 'Saved' : 'Save profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
