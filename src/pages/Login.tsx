import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, enterDemo } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const err = login(email, password)
    if (err) {
      setError(err)
      return
    }
    navigate('/app')
  }

  return (
    <div className="hero-atmosphere flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md animate-rise rounded-2xl border border-ink/10 bg-paper p-8 shadow-lg">
        <Link to="/" className="font-display text-2xl font-extrabold text-ink">
          Atelier
        </Link>
        <h1 className="mt-6 font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Optional — or skip and try the demo.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              className="field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Log in
          </button>
        </form>

        <button
          type="button"
          className="btn-ghost mt-3 w-full"
          onClick={() => {
            enterDemo()
            navigate('/app')
          }}
        >
          Try demo instead
        </button>

        <p className="mt-6 text-center text-sm text-muted">
          No account?{' '}
          <Link to="/register" className="font-semibold text-accent hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
