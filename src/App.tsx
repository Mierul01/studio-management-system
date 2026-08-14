import type { ReactNode } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Invoices from './pages/Invoices'
import TimeTracker from './pages/TimeTracker'
import CalendarPage from './pages/CalendarPage'
import Messages from './pages/Messages'
import Files from './pages/Files'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Help from './pages/Help'

function Protected({ children }: { children: ReactNode }) {
  const { user, enterDemo } = useAuth()
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-mist px-5">
        <p className="font-display text-2xl font-bold text-ink">Atelier</p>
        <p className="max-w-sm text-center text-muted">
          Login and register are optional. Try the demo, or create an account when you are ready.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-primary" onClick={enterDemo}>
            Try demo
          </button>
          <Link to="/login" className="btn-ghost">
            Log in
          </Link>
          <Link to="/register" className="btn-ghost">
            Register
          </Link>
        </div>
      </div>
    )
  }
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/app"
              element={
                <Protected>
                  <AppLayout />
                </Protected>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="clients" element={<Clients />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="time" element={<TimeTracker />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="messages" element={<Messages />} />
              <Route path="files" element={<Files />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}
