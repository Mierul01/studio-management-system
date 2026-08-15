import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { PageHeader } from '../components/ui'

export default function Settings() {
  const { isDemo, logout } = useAuth()
  const { resetDemo } = useData()
  const navigate = useNavigate()
  const [notify, setNotify] = useState({ email: true, overdue: true, weekly: false })
  const [currency, setCurrency] = useState('MYR')
  const [weekStart, setWeekStart] = useState('monday')

  return (
    <div>
      <PageHeader title="Settings" subtitle="Workspace preferences — profile lives on its own page." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel space-y-4 p-5">
          <h2 className="font-display text-lg font-bold">Workspace</h2>
          <div>
            <label className="mb-1 block text-sm font-medium">Default currency</label>
            <select className="field" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="MYR">MYR (RM)</option>
              <option value="SGD">SGD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Week starts on</label>
            <select className="field" value={weekStart} onChange={(e) => setWeekStart(e.target.value)}>
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
          <p className="text-sm text-muted">
            Manage your name, bio, and contact details on{' '}
            <button type="button" className="font-semibold text-accent hover:underline" onClick={() => navigate('/app/profile')}>
              Profile
            </button>
            .
          </p>
        </div>

        <div className="panel space-y-4 p-5">
          <h2 className="font-display text-lg font-bold">Notifications</h2>
          {(
            [
              ['email', 'Email digests'],
              ['overdue', 'Overdue invoice alerts'],
              ['weekly', 'Weekly studio summary'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-3 text-sm">
              <span>{label}</span>
              <input
                type="checkbox"
                checked={notify[key]}
                onChange={(e) => setNotify({ ...notify, [key]: e.target.checked })}
              />
            </label>
          ))}

          <h2 className="pt-4 font-display text-lg font-bold">Danger zone</h2>
          {isDemo && (
            <button type="button" className="btn-ghost w-full" onClick={resetDemo}>
              Reset demo data
            </button>
          )}
          <button
            type="button"
            className="btn-ghost w-full border-danger text-danger"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
