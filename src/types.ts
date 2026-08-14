export type User = {
  id: string
  name: string
  email: string
  company: string
  role: string
  phone: string
  location: string
  website: string
  bio: string
}

export type Client = {
  id: string
  name: string
  company: string
  email: string
  status: 'active' | 'lead' | 'paused'
  value: number
  notes: string
  createdAt: string
}

export type Project = {
  id: string
  name: string
  clientId: string
  status: 'planning' | 'active' | 'review' | 'done'
  budget: number
  dueDate: string
  progress: number
  description: string
}

export type Task = {
  id: string
  title: string
  projectId: string
  status: 'todo' | 'doing' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  assignee: string
}

export type Invoice = {
  id: string
  number: string
  clientId: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issuedAt: string
  dueDate: string
  note: string
}

export type TimeEntry = {
  id: string
  projectId: string
  description: string
  minutes: number
  date: string
  billable: boolean
}

export type Message = {
  id: string
  from: string
  subject: string
  preview: string
  body: string
  read: boolean
  at: string
}

export type FileItem = {
  id: string
  name: string
  type: string
  size: string
  projectId: string
  updatedAt: string
}

export type CalendarEvent = {
  id: string
  title: string
  date: string
  time: string
  type: 'meeting' | 'deadline' | 'reminder'
  projectId?: string
}

export type AppData = {
  clients: Client[]
  projects: Project[]
  tasks: Task[]
  invoices: Invoice[]
  timeEntries: TimeEntry[]
  messages: Message[]
  files: FileItem[]
  events: CalendarEvent[]
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
