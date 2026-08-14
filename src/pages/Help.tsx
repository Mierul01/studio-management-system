import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui'

const topics = [
  {
    title: 'Getting started',
    body: 'Add clients first, then create projects and tasks. Invoices and time tracking attach to the work you already set up.',
    to: '/app/clients',
    link: 'Go to Clients',
  },
  {
    title: 'Billing & time',
    body: 'Log hours on Time, then create invoices from Invoices. Mark invoices sent or paid as you collect.',
    to: '/app/invoices',
    link: 'Go to Invoices',
  },
  {
    title: 'Your profile',
    body: 'Update your name, role, bio, and studio details on the Profile page. Settings holds workspace preferences.',
    to: '/app/profile',
    link: 'Open Profile',
  },
  {
    title: 'Messages & calendar',
    body: 'Unread client messages appear in Messages. Deadlines and meetings live on Calendar.',
    to: '/app/messages',
    link: 'Open Messages',
  },
]

export default function Help() {
  return (
    <div>
      <PageHeader title="Help" subtitle="Quick guides for running your studio in Atelier." />
      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((t) => (
          <div key={t.title} className="panel p-5">
            <h2 className="font-display text-lg font-bold">{t.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>
            <Link to={t.to} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
              {t.link} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
