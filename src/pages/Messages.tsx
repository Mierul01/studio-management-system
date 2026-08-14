import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { PageHeader, EmptyState } from '../components/ui'

export default function Messages() {
  const { data, markMessageRead } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedId = searchParams.get('id')
  const [activeId, setActiveId] = useState<string | null>(
    requestedId && data.messages.some((m) => m.id === requestedId)
      ? requestedId
      : (data.messages[0]?.id ?? null),
  )
  const active = data.messages.find((m) => m.id === activeId)

  useEffect(() => {
    if (!requestedId) return
    if (!data.messages.some((m) => m.id === requestedId)) return
    setActiveId(requestedId)
    markMessageRead(requestedId)
  }, [requestedId, data.messages, markMessageRead])

  const openMessage = (id: string) => {
    setActiveId(id)
    markMessageRead(id)
    setSearchParams({ id }, { replace: true })
  }

  return (
    <div>
      <PageHeader title="Messages" subtitle="Client threads in one inbox." />

      {data.messages.length === 0 ? (
        <EmptyState title="Inbox empty" hint="Messages from clients will show up here." />
      ) : (
        <div className="panel grid min-h-[420px] overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
          <ul className="divide-y divide-ink/5 border-b border-ink/8 lg:border-b-0 lg:border-r">
            {data.messages.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={`w-full px-4 py-3 text-left transition ${
                    activeId === m.id ? 'bg-mist' : 'hover:bg-mist/60'
                  }`}
                  onClick={() => openMessage(m.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm ${m.read ? 'font-medium' : 'font-bold'}`}>{m.from}</p>
                    {!m.read && <span className="h-2 w-2 rounded-full bg-accent" />}
                  </div>
                  <p className="mt-0.5 text-sm font-semibold">{m.subject}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">{m.preview}</p>
                </button>
              </li>
            ))}
          </ul>
          <div className="p-5">
            {active ? (
              <>
                <p className="text-sm text-muted">{active.from}</p>
                <h2 className="font-display text-xl font-bold">{active.subject}</h2>
                <p className="mt-1 text-xs text-muted">{new Date(active.at).toLocaleString()}</p>
                <p className="mt-6 leading-relaxed text-ink-soft">{active.body}</p>
              </>
            ) : (
              <p className="text-muted">Select a message</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
