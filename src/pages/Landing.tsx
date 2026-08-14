import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    title: 'Clients & pipeline',
    body: 'Keep every lead, retainer, and relationship in one living roster — not scattered across inboxes.',
  },
  {
    title: 'Projects that move',
    body: 'Track scope, budgets, and progress without opening five tools to answer “where are we?”',
  },
  {
    title: 'Invoices & time',
    body: 'Log hours, send invoices, and see what is paid, pending, or overdue at a glance.',
  },
]

const modules = [
  'Dashboard',
  'Clients',
  'Projects',
  'Tasks',
  'Invoices',
  'Time tracker',
  'Calendar',
  'Messages',
  'Files',
  'Reports',
  'Profile',
  'Settings',
]

export default function Landing() {
  const { user, enterDemo } = useAuth()
  const navigate = useNavigate()

  const tryDemo = () => {
    enterDemo()
    navigate('/app')
  }

  return (
    <div className="hero-atmosphere noise-overlay relative min-h-screen overflow-x-hidden">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Atelier
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <a href="#features" className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:inline">
            Features
          </a>
          <a href="#system" className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:inline">
            System
          </a>
          {user ? (
            <Link to="/app" className="btn-primary text-sm">
              Open app
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm px-3 py-2 sm:px-4">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm px-3 py-2 sm:px-5">
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-12">
        <div>
          <p className="animate-rise font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-ink sm:text-6xl md:text-7xl">
            Atelier
          </p>
          <h1 className="animate-rise-delay-1 mt-5 max-w-xl font-display text-2xl font-semibold leading-snug text-ink-soft sm:text-3xl">
            The operating system for freelance studios.
          </h1>
          <p className="animate-rise-delay-2 mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            A complete client-to-cash system — ready to demo, use, and sell as your own product.
          </p>
          <div className="animate-rise-delay-3 mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary">
              Sign in
            </Link>
            <Link to="/register" className="btn-ghost">
              Create account
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            Prefer a quick look? Use the demo below — no account needed.
          </p>
        </div>

        <div className="animate-rise-delay-2 relative">
          <div className="animate-drift absolute -right-4 -top-6 h-40 w-40 rounded-full bg-accent/20 blur-2xl animate-pulse-soft" />
          <div className="absolute -bottom-8 -left-6 h-44 w-44 rounded-full bg-teal/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-ink shadow-[0_30px_80px_rgba(12,26,31,0.25)]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber" />
              <span className="h-2.5 w-2.5 rounded-full bg-teal" />
              <span className="ml-2 text-xs text-white/50">atelier.app / dashboard</span>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-3">
              <div className="rounded-lg bg-white/5 p-3 sm:col-span-2">
                <p className="text-xs text-white/50">Revenue this month</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">$16,500</p>
                <svg viewBox="0 0 240 60" className="mt-3 w-full" aria-hidden>
                  <path
                    d="M0 45 C40 40, 60 20, 90 28 S140 50, 170 22 S210 10, 240 18"
                    fill="none"
                    stroke="#E25B2A"
                    strokeWidth="2.5"
                    strokeDasharray="240"
                    style={{ animation: 'draw-line 1.6s ease forwards' }}
                  />
                </svg>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs text-white/50">Active</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">4</p>
                <p className="text-xs text-teal-soft/80">projects</p>
              </div>
              <div className="rounded-lg bg-accent/90 p-3 sm:col-span-1">
                <p className="text-xs text-white/80">Overdue</p>
                <p className="mt-1 font-display text-xl font-bold text-white">1 invoice</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3 sm:col-span-2">
                <p className="text-xs text-white/50">Next up</p>
                <p className="mt-1 text-sm font-semibold text-white">Northwind design review · Thu 2:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 border-t border-ink/8 bg-paper/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Built for how studios actually work</h2>
          <p className="mt-3 max-w-xl text-muted">
            One product surface. Many menus. Everything functional — ready to sell or run your practice on.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title}>
                <h3 className="font-display text-xl font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="system" className="relative z-10">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">A complete system</h2>
          <p className="mt-3 max-w-xl text-muted">
            Every module ships working — not a brochure. Sell the whole workspace as one product.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {modules.map((m) => (
              <span
                key={m}
                className="rounded-lg border border-ink/10 bg-paper px-3 py-1.5 text-sm font-semibold text-ink-soft"
              >
                {m}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={tryDemo} className="btn-primary">
              Open the demo
            </button>
            <Link to="/register" className="btn-ghost">
              Register when ready
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-ink/8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-display text-lg font-bold text-ink">Atelier</p>
          <p>© {new Date().getFullYear()} Atelier Studio OS.</p>
          <button type="button" onClick={tryDemo} className="text-left font-semibold text-accent hover:underline">
            Launch demo →
          </button>
        </div>
      </footer>
    </div>
  )
}
