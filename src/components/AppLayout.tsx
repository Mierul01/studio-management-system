import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import type { AppData } from '../types'

const pages = [
  { to: '/app', end: true, label: 'Dashboard', icon: '◈', action: { label: 'View projects', to: '/app/projects' }, sidebar: true },
  { to: '/app/clients', label: 'Clients', icon: '◎', action: { label: 'Go to projects', to: '/app/projects' }, sidebar: true },
  { to: '/app/projects', label: 'Projects', icon: '▣', action: { label: 'Open tasks', to: '/app/tasks' }, sidebar: true },
  { to: '/app/tasks', label: 'Tasks', icon: '☑', action: { label: 'Open calendar', to: '/app/calendar' }, sidebar: true },
  { to: '/app/invoices', label: 'Invoices', icon: '$', action: { label: 'Open reports', to: '/app/reports' }, sidebar: true },
  { to: '/app/time', label: 'Time', icon: '◷', action: { label: 'Open invoices', to: '/app/invoices' }, sidebar: true },
  { to: '/app/calendar', label: 'Calendar', icon: '▦', action: { label: 'Open tasks', to: '/app/tasks' }, sidebar: true },
  { to: '/app/reports', label: 'Reports', icon: '▤', action: { label: 'Open invoices', to: '/app/invoices' }, sidebar: true },
  { to: '/app/settings', label: 'Settings', icon: '⚙', action: { label: 'Open profile', to: '/app/profile' }, sidebar: true },
  { to: '/app/messages', label: 'Messages', icon: '✉', action: { label: 'Open clients', to: '/app/clients' }, sidebar: false },
  { to: '/app/files', label: 'Files', icon: '▤', action: { label: 'Open projects', to: '/app/projects' }, sidebar: false },
  { to: '/app/profile', label: 'Profile', icon: '◉', action: { label: 'Open settings', to: '/app/settings' }, sidebar: false },
  { to: '/app/help', label: 'Help', icon: '?', action: { label: 'Open dashboard', to: '/app' }, sidebar: false },
]

const nav = pages.filter((p) => p.sidebar)

const counts: Record<string, (data: AppData) => number | null> = {
  Dashboard: () => null,
  Clients: (d) => d.clients.length,
  Projects: (d) => d.projects.length,
  Tasks: (d) => d.tasks.filter((t) => t.status !== 'done').length,
  Invoices: (d) => d.invoices.length,
  Time: () => null,
  Calendar: (d) => d.events.length,
  Reports: () => null,
  Settings: () => null,
  Messages: (d) => d.messages.length,
  Files: (d) => d.files.length,
  Profile: () => null,
  Help: () => null,
}

function IconBell({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 9a6 6 0 1 1 12 0c0 3.5 1.5 5 1.5 5H4.5S6 12.5 6 9Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export default function AppLayout() {
  const { user, isDemo, logout } = useAuth()
  const { data, markMessageRead } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [notifyOpen, setNotifyOpen] = useState(false)
  const notifyRef = useRef<HTMLDivElement>(null)
  const unread = data.messages.filter((m) => !m.read).length
  const notifications = [...data.messages].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  )

  useEffect(() => {
    if (!notifyOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (notifyRef.current && !notifyRef.current.contains(e.target as Node)) {
        setNotifyOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotifyOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [notifyOpen])

  useEffect(() => {
    setNotifyOpen(false)
  }, [location.pathname])

  const current =
    pages.find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
    ) ?? pages[0]

  const count = counts[current.label]?.(data)
  const subtitle =
    count == null
      ? isDemo
        ? 'Demo workspace'
        : user?.company
      : `${String(count).padStart(2, '0')} ${current.label.toLowerCase()} found`

  const initials = user
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AT'

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-mist px-5">
        <p className="font-display text-2xl font-bold">Sign in optional</p>
        <p className="max-w-sm text-center text-muted">
          Log in, register, or try the demo to open the full Atelier workspace.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-primary" onClick={() => navigate('/login')}>
            Log in
          </button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/register')}>
            Register
          </button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/')}>
            Back home
          </button>
        </div>
      </div>
    )
  }

  const Sidebar = (
    <aside className="flex h-full w-[15.5rem] flex-col bg-accent text-white">
      <div className="flex shrink-0 items-center gap-2 px-4 pb-1 pt-4">
        <button
          type="button"
          className="font-display text-[15px] font-extrabold tracking-tight text-white"
          onClick={() => navigate('/')}
        >
          Atelier
        </button>
        {isDemo && (
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white">
            Demo
          </span>
        )}
        <button type="button" className="ml-auto text-white/80 lg:hidden" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>

      <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden pl-3 pr-0">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'is-active' : ''}`
            }
          >
            <span className="w-4 text-center opacity-80">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 px-4 pb-5 pt-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl bg-white/10 px-3 py-3 text-left hover:bg-white/15"
          onClick={() => navigate('/app/profile')}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-display text-[11px] font-bold text-accent">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-white">{user.name}</span>
            <span className="block truncate text-[11px] text-white/70">{user.company}</span>
          </span>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="app-shell flex h-screen overflow-hidden">
      <div className="flex min-h-0 w-full overflow-hidden bg-paper">
        <div className="hidden h-full shrink-0 lg:block">{Sidebar}</div>
        {open && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <div className="relative z-10 h-full shadow-xl">{Sidebar}</div>
          </div>
        )}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-paper">
          <header className="flex shrink-0 items-center justify-between gap-4 px-5 pb-1 pt-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-fog px-2 py-1 text-[11px] font-semibold text-ink-soft lg:hidden"
                onClick={() => setOpen(true)}
              >
                Menu
              </button>
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-bold leading-none text-ink">
                  {current.label}
                </h1>
                <p className="mt-1 text-xs text-muted">{subtitle}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="hidden rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-[0_6px_14px_rgba(43,89,255,0.22)] hover:bg-accent-deep sm:inline-flex"
                onClick={() => navigate(current.action.to)}
              >
                {current.action.label}
              </button>

              <div className="relative" ref={notifyRef}>
                <button
                  type="button"
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border border-fog text-ink-soft hover:border-accent/30 hover:text-accent"
                  aria-label="Notifications"
                  aria-expanded={notifyOpen}
                  onClick={() => setNotifyOpen((v) => !v)}
                >
                  <IconBell className="h-4 w-4" />
                  {unread > 0 && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
                  )}
                </button>

                {notifyOpen && (
                  <div className="absolute right-0 z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-fog bg-paper shadow-[0_18px_40px_rgba(30,36,51,0.16)]">
                    <div className="flex items-center justify-between border-b border-fog px-4 py-3">
                      <p className="text-sm font-semibold text-ink">Notifications</p>
                      {unread > 0 && (
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                          {unread} new
                        </span>
                      )}
                    </div>
                    <ul className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <li className="px-4 py-8 text-center text-sm text-muted">No notifications yet.</li>
                      ) : (
                        notifications.slice(0, 6).map((m) => (
                          <li key={m.id} className="border-b border-fog/70 last:border-0">
                            <button
                              type="button"
                              className={`w-full px-4 py-3 text-left hover:bg-mist ${m.read ? '' : 'bg-accent/[0.04]'}`}
                              onClick={() => {
                                markMessageRead(m.id)
                                setNotifyOpen(false)
                                navigate(`/app/messages?id=${m.id}`)
                              }}
                            >
                              <p className={`truncate text-sm ${m.read ? 'font-medium' : 'font-bold'} text-ink`}>
                                {m.subject}
                              </p>
                              <p className="truncate text-xs text-muted">
                                {m.from} · {new Date(m.at).toLocaleString()}
                              </p>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                    <div className="border-t border-fog p-2">
                      <button
                        type="button"
                        className="w-full rounded-xl px-2 py-2 text-xs font-semibold text-accent hover:bg-mist"
                        onClick={() => {
                          setNotifyOpen(false)
                          navigate('/app/messages')
                        }}
                      >
                        View all messages
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-fog text-ink-soft hover:border-accent/30 hover:text-accent"
                aria-label="Search"
                title="Search"
                onClick={() => navigate('/app/clients')}
              >
                <IconSearch className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-accent text-[10px] font-bold text-white shadow-[0_6px_12px_rgba(43,89,255,0.28)]"
                aria-label="Profile"
                title="Profile"
                onClick={() => navigate('/app/profile')}
              >
                {initials}
              </button>

              <button
                type="button"
                className="hidden text-xs font-semibold text-muted hover:text-danger sm:inline"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                Log out
              </button>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-3 sm:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
