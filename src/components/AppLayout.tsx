import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

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

function IconBell({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 9a6 6 0 1 1 12 0c0 3.5 1.5 5 1.5 5H4.5S6 12.5 6 9Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

function IconHelp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8" />
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2" />
      <path d="M15 12H3m0 0 3-3m-3 3 3 3" />
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

  const todayLabel = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

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
    <aside className="flex h-full w-64 flex-col border-r border-ink/8 bg-paper">
      <div className="flex shrink-0 items-center gap-2.5 border-b border-ink/8 px-3 py-3">
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink"
          onClick={() => navigate('/')}
          aria-label="Atelier home"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path d="M5 18L12 5l7 13H5z" stroke="#E25B2A" strokeWidth="2" />
            <circle cx="12" cy="14.5" r="1.6" fill="#E25B2A" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="font-display text-base font-extrabold leading-tight text-ink"
              onClick={() => navigate('/')}
            >
              Atelier
            </button>
            {isDemo && (
              <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent-deep">
                Demo
              </span>
            )}
          </div>
          <p className="truncate text-[11px] text-muted">Studio OS</p>
        </div>
        <button type="button" className="lg:hidden text-muted" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col justify-start gap-0.5 overflow-hidden px-2 py-2">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-teal-soft font-semibold text-teal shadow-[inset_3px_0_0_0_var(--color-accent)]'
                  : 'font-medium text-ink-soft hover:bg-mist hover:text-ink'
              }`
            }
          >
            <span className="w-4 text-center opacity-70">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-ink/8 p-4">
        <button type="button" className="w-full text-left" onClick={() => navigate('/app/profile')}>
          <p className="truncate text-sm font-semibold hover:text-accent">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.company}</p>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="app-bg flex h-screen overflow-hidden">
      <div className="hidden h-screen w-64 shrink-0 lg:block">{Sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 h-full shadow-xl">{Sidebar}</div>
        </div>
      )}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-ink/8 bg-paper px-4 py-3 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-fog bg-paper px-2 py-1 text-[11px] font-semibold lg:hidden"
              onClick={() => setOpen(true)}
            >
              Menu
            </button>
            <div className="min-w-0">
              <p className="text-[11px] leading-none text-muted">{todayLabel}</p>
              <h1 className="mt-1 truncate font-display text-lg font-bold leading-none text-ink sm:text-xl">
                {current.label}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="hidden rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-deep sm:inline-flex"
              onClick={() => navigate(current.action.to)}
            >
              {current.action.label}
            </button>
            <div className="relative" ref={notifyRef}>
              <button
                type="button"
                className="relative flex h-8 w-8 items-center justify-center rounded-md border border-fog bg-paper text-ink-soft hover:border-ink/25 hover:text-ink"
                aria-label="Notifications"
                aria-expanded={notifyOpen}
                title="Notifications"
                onClick={() => setNotifyOpen((v) => !v)}
              >
                <IconBell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
                )}
              </button>

              {notifyOpen && (
                <div className="absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-ink/10 bg-paper shadow-xl">
                  <div className="flex items-center justify-between border-b border-ink/8 px-3 py-2.5">
                    <p className="text-sm font-semibold text-ink">Notifications</p>
                    {unread > 0 && (
                      <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent-deep">
                        {unread} new
                      </span>
                    )}
                  </div>
                  <ul className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <li className="px-3 py-6 text-center text-sm text-muted">No notifications yet.</li>
                    ) : (
                      notifications.slice(0, 6).map((m) => (
                        <li key={m.id} className="border-b border-ink/5 last:border-0">
                          <button
                            type="button"
                            className={`w-full px-3 py-2.5 text-left hover:bg-mist ${m.read ? '' : 'bg-teal-soft/40'}`}
                            onClick={() => {
                              markMessageRead(m.id)
                              setNotifyOpen(false)
                              navigate(`/app/messages?id=${m.id}`)
                            }}
                          >
                            <div className="flex items-start gap-2">
                              {!m.read && (
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                              )}
                              <div className={`min-w-0 flex-1 ${m.read ? 'pl-3.5' : ''}`}>
                                <p className={`truncate text-sm ${m.read ? 'font-medium' : 'font-bold'} text-ink`}>
                                  {m.subject}
                                </p>
                                <p className="truncate text-xs text-muted">
                                  {m.from} · {new Date(m.at).toLocaleString()}
                                </p>
                                <p className="mt-0.5 line-clamp-2 text-xs text-ink-soft">{m.preview}</p>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                  <div className="border-t border-ink/8 p-2">
                    <button
                      type="button"
                      className="w-full rounded-lg px-2 py-1.5 text-xs font-semibold text-accent hover:bg-mist"
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
              className="flex h-8 w-8 items-center justify-center rounded-md border border-fog bg-paper text-ink-soft hover:border-ink/25 hover:text-ink"
              aria-label="Help"
              title="Help"
              onClick={() => navigate('/app/help')}
            >
              <IconHelp className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-fog bg-paper text-ink-soft hover:border-ink/25 hover:text-ink"
              aria-label="Log out"
              title="Log out"
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              <IconLogout className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
