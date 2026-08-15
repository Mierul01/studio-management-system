import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '../types'
import { uid } from '../types'

type AuthContextValue = {
  user: User | null
  isDemo: boolean
  login: (email: string, password: string) => string | null
  register: (name: string, email: string, password: string, company: string) => string | null
  updateProfile: (patch: Partial<Omit<User, 'id' | 'email'>>) => void
  enterDemo: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const USERS_KEY = 'atelier_users'
const SESSION_KEY = 'atelier_session'

type StoredUser = User & { password: string }

const emptyProfile = {
  role: 'Studio owner',
  phone: '',
  location: '',
  website: '',
  bio: '',
}

export const demoUser: User = {
  id: 'demo',
  name: 'Aiman Rahman',
  email: 'demo@atelier.my',
  company: 'Atelier KL',
  role: 'Creative director',
  phone: '+60 12-345 6789',
  location: 'Kuala Lumpur, Malaysia',
  website: 'https://atelier.my',
  bio: 'Studio reka bentuk di KL. Brand system, UI produk, dan campaign untuk pasukan kecil.',
}

function normalizeUser(raw: Partial<User> & { id: string; name: string; email: string; company: string }): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    company: raw.company,
    role: raw.role ?? emptyProfile.role,
    phone: raw.phone ?? '',
    location: raw.location ?? '',
    website: raw.website ?? '',
    bio: raw.bio ?? '',
  }
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const list = raw ? (JSON.parse(raw) as (StoredUser & { plan?: string })[]) : []
    return list.map((u) => {
      const { plan: _plan, ...rest } = u
      return { ...normalizeUser(rest), password: u.password }
    })
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function loadSession(): { user: User | null; isDemo: boolean } {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return { user: null, isDemo: false }
    const parsed = JSON.parse(raw) as { user: (User & { plan?: string }) | null; isDemo: boolean }
    if (!parsed.user) return { user: null, isDemo: parsed.isDemo }
    if (parsed.isDemo) return { user: demoUser, isDemo: true }
    const { plan: _plan, ...rest } = parsed.user
    return { user: normalizeUser(rest), isDemo: parsed.isDemo }
  } catch {
    return { user: null, isDemo: false }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = loadSession()
  const [user, setUser] = useState<User | null>(initial.user)
  const [isDemo, setIsDemo] = useState(initial.isDemo)

  const persist = (nextUser: User | null, demo: boolean) => {
    setUser(nextUser)
    setIsDemo(demo)
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: nextUser, isDemo: demo }))
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isDemo,
      login: (email, password) => {
        const users = loadUsers()
        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!found || found.password !== password) return 'Invalid email or password.'
        const { password: _, ...safe } = found
        persist(normalizeUser(safe), false)
        return null
      },
      register: (name, email, password, company) => {
        if (!name.trim() || !email.trim() || password.length < 4) {
          return 'Please fill all fields (password min 4 characters).'
        }
        const users = loadUsers()
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return 'An account with that email already exists.'
        }
        const next: StoredUser = {
          id: uid('user'),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          company: company.trim() || 'My Studio',
          ...emptyProfile,
        }
        saveUsers([...users, next])
        const { password: _, ...safe } = next
        persist(safe, false)
        return null
      },
      updateProfile: (patch) => {
        if (!user) return
        const next = normalizeUser({ ...user, ...patch })
        persist(next, isDemo)
        if (!isDemo) {
          const users = loadUsers()
          saveUsers(
            users.map((u) =>
              u.id === user.id
                ? { ...u, ...next, password: u.password }
                : u,
            ),
          )
        }
      },
      enterDemo: () => {
        persist(demoUser, true)
      },
      logout: () => persist(null, false),
    }),
    [user, isDemo],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
