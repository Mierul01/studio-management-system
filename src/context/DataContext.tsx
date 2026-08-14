import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { seedData } from '../data/seed'
import type {
  AppData,
  Client,
  Project,
  Task,
  Invoice,
  TimeEntry,
  Message,
  FileItem,
  CalendarEvent,
} from '../types'
import { uid } from '../types'
import { useAuth } from './AuthContext'

type DataContextValue = {
  data: AppData
  addClient: (c: Omit<Client, 'id' | 'createdAt'>) => void
  updateClient: (id: string, patch: Partial<Client>) => void
  deleteClient: (id: string) => void
  addProject: (p: Omit<Project, 'id'>) => void
  updateProject: (id: string, patch: Partial<Project>) => void
  deleteProject: (id: string) => void
  addTask: (t: Omit<Task, 'id'>) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void
  addInvoice: (i: Omit<Invoice, 'id'>) => void
  updateInvoice: (id: string, patch: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  addTimeEntry: (t: Omit<TimeEntry, 'id'>) => void
  deleteTimeEntry: (id: string) => void
  markMessageRead: (id: string) => void
  addFile: (f: Omit<FileItem, 'id' | 'updatedAt'>) => void
  deleteFile: (id: string) => void
  addEvent: (e: Omit<CalendarEvent, 'id'>) => void
  deleteEvent: (id: string) => void
  resetDemo: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

function storageKey(userId: string | undefined, isDemo: boolean) {
  if (isDemo) return 'atelier_data_demo'
  if (userId) return `atelier_data_${userId}`
  return null
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isDemo } = useAuth()
  const key = storageKey(user?.id, isDemo)

  const [data, setData] = useState<AppData>(() => {
    if (!key) return seedData
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as AppData) : structuredClone(seedData)
    } catch {
      return structuredClone(seedData)
    }
  })

  useEffect(() => {
    if (!key) return
    try {
      const raw = localStorage.getItem(key)
      setData(raw ? (JSON.parse(raw) as AppData) : structuredClone(seedData))
    } catch {
      setData(structuredClone(seedData))
    }
  }, [key])

  useEffect(() => {
    if (!key) return
    localStorage.setItem(key, JSON.stringify(data))
  }, [data, key])

  const value = useMemo<DataContextValue>(
    () => ({
      data,
      addClient: (c) =>
        setData((d) => ({
          ...d,
          clients: [
            ...d.clients,
            { ...c, id: uid('c'), createdAt: new Date().toISOString().slice(0, 10) },
          ],
        })),
      updateClient: (id, patch) =>
        setData((d) => ({
          ...d,
          clients: d.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteClient: (id) =>
        setData((d) => ({ ...d, clients: d.clients.filter((c) => c.id !== id) })),
      addProject: (p) =>
        setData((d) => ({ ...d, projects: [...d.projects, { ...p, id: uid('p') }] })),
      updateProject: (id, patch) =>
        setData((d) => ({
          ...d,
          projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      deleteProject: (id) =>
        setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) })),
      addTask: (t) =>
        setData((d) => ({ ...d, tasks: [...d.tasks, { ...t, id: uid('t') }] })),
      updateTask: (id, patch) =>
        setData((d) => ({
          ...d,
          tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      deleteTask: (id) =>
        setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) })),
      addInvoice: (i) =>
        setData((d) => ({ ...d, invoices: [...d.invoices, { ...i, id: uid('i') }] })),
      updateInvoice: (id, patch) =>
        setData((d) => ({
          ...d,
          invoices: d.invoices.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      deleteInvoice: (id) =>
        setData((d) => ({ ...d, invoices: d.invoices.filter((i) => i.id !== id) })),
      addTimeEntry: (t) =>
        setData((d) => ({
          ...d,
          timeEntries: [...d.timeEntries, { ...t, id: uid('te') }],
        })),
      deleteTimeEntry: (id) =>
        setData((d) => ({
          ...d,
          timeEntries: d.timeEntries.filter((t) => t.id !== id),
        })),
      markMessageRead: (id) =>
        setData((d) => ({
          ...d,
          messages: d.messages.map((m) => (m.id === id ? { ...m, read: true } : m)),
        })),
      addFile: (f) =>
        setData((d) => ({
          ...d,
          files: [
            ...d.files,
            { ...f, id: uid('f'), updatedAt: new Date().toISOString().slice(0, 10) },
          ],
        })),
      deleteFile: (id) =>
        setData((d) => ({ ...d, files: d.files.filter((f) => f.id !== id) })),
      addEvent: (e) =>
        setData((d) => ({ ...d, events: [...d.events, { ...e, id: uid('e') }] })),
      deleteEvent: (id) =>
        setData((d) => ({ ...d, events: d.events.filter((e) => e.id !== id) })),
      resetDemo: () => setData(structuredClone(seedData)),
    }),
    [data],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
