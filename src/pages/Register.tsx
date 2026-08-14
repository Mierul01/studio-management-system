import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, enterDemo } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const err = register(name, email, password, company)
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
        <h1 className="mt-6 font-display text-2xl font-bold">Create your studio</h1>
        <p className="mt-1 text-sm text-muted">Optional — accounts stay in this browser.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Your name</label>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Studio / company</label>
            <input className="field" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              className="field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              minLength={4}
              required
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Create account
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
          Skip — try demo
        </button>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
