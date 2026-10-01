import { useEffect, useMemo, useState } from 'react'
import { Inbox, Mail, MailOpen, Trash2, Reply, RefreshCw, ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { EmptyState, LoadingState } from '../../components/ui/States'

const MAILBOX = 'info@etaktravels.com'

interface InboxMessage {
  id: string
  from_name: string | null
  from_email: string
  subject: string
  body_text: string | null
  body_html: string | null
  is_read: boolean
  received_at: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const sameDay = d.toDateString() === new Date().toDateString()
  return sameDay
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })
}

// Render HTML mail in a sandboxed iframe (no scripts, no same-origin) so
// untrusted sender markup cannot touch the admin session.
function MessageBody({ m }: { m: InboxMessage }) {
  if (m.body_html) {
    return (
      <iframe
        title="Message body"
        sandbox=""
        srcDoc={m.body_html}
        className="w-full min-h-[360px] rounded-lg border border-gray-100 bg-white"
      />
    )
  }
  return <pre className="whitespace-pre-wrap font-sans text-sm text-[#172033] leading-relaxed">{m.body_text || '(empty message)'}</pre>
}

export default function AdminInbox() {
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  async function load() {
    const { data, error: err } = await supabase
      .from('inbox_messages')
      .select('id, from_name, from_email, subject, body_text, body_html, is_read, received_at')
      .order('received_at', { ascending: false })
      .limit(200)
    if (err) setError(err.message)
    else { setError(''); setMessages(data ?? []) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const visible = useMemo(
    () => (filter === 'unread' ? messages.filter(m => !m.is_read) : messages),
    [messages, filter],
  )
  const selected = messages.find(m => m.id === selectedId) ?? null
  const unread = messages.filter(m => !m.is_read).length

  async function open(m: InboxMessage) {
    setSelectedId(m.id)
    if (!m.is_read) {
      setMessages(list => list.map(x => (x.id === m.id ? { ...x, is_read: true } : x)))
      await supabase.from('inbox_messages').update({ is_read: true }).eq('id', m.id)
    }
  }

  async function toggleRead(m: InboxMessage) {
    setMessages(list => list.map(x => (x.id === m.id ? { ...x, is_read: !m.is_read } : x)))
    await supabase.from('inbox_messages').update({ is_read: !m.is_read }).eq('id', m.id)
  }

  async function remove(m: InboxMessage) {
    if (!window.confirm('Delete this message permanently?')) return
    setMessages(list => list.filter(x => x.id !== m.id))
    setSelectedId(null)
    await supabase.from('inbox_messages').delete().eq('id', m.id)
  }

  const replyHref = (m: InboxMessage) =>
    `mailto:${m.from_email}?subject=${encodeURIComponent(/^re:/i.test(m.subject) ? m.subject : `Re: ${m.subject}`)}`

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-[#101B46] text-xl flex items-center gap-2">
            <Inbox size={20} className="text-[#08A9E0]" /> Inbox
          </h2>
          <p className="text-sm text-[#667085]">Mail received at <span className="font-medium text-[#172033]">{MAILBOX}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-white border border-gray-200 p-0.5 text-xs font-semibold">
            {(['all', 'unread'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full capitalize transition-colors ${filter === f ? 'bg-[#08A9E0] text-white' : 'text-[#667085] hover:text-[#101B46]'}`}
              >
                {f}{f === 'unread' && unread ? ` (${unread})` : ''}
              </button>
            ))}
          </div>
          <button onClick={() => { setLoading(true); load() }} className="p-2 rounded-full bg-white border border-gray-200 text-[#667085] hover:text-[#08A9E0]" title="Refresh">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <div className="p-4 rounded-card bg-red-50 border border-red-200 text-sm text-red-600">
          Could not load the inbox: {error}. Make sure migration 013 has been run in Supabase.
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No messages yet"
          description={`Mail sent to ${MAILBOX} will appear here once the inbound-email function is connected (see supabase/README.md).`}
        />
      ) : (
        <div className="grid lg:grid-cols-[360px_1fr] gap-4 items-start">
          {/* List */}
          <div className={`premium-card rounded-card overflow-hidden ${selected ? 'hidden lg:block' : ''}`}>
            {visible.length === 0 && <p className="p-6 text-sm text-center text-[#667085]">No unread messages.</p>}
            {visible.map(m => (
              <button
                key={m.id}
                onClick={() => open(m)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${
                  selectedId === m.id ? 'bg-[#EAF8FD]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {!m.is_read && <span className="w-2 h-2 rounded-full bg-[#08A9E0] shrink-0" />}
                  <span className={`text-sm truncate flex-1 ${m.is_read ? 'text-[#172033]' : 'font-bold text-[#101B46]'}`}>
                    {m.from_name || m.from_email}
                  </span>
                  <span className="text-[11px] text-[#667085] shrink-0">{formatDate(m.received_at)}</span>
                </div>
                <p className={`text-sm truncate mt-0.5 ${m.is_read ? 'text-[#667085]' : 'font-semibold text-[#172033]'}`}>{m.subject}</p>
                <p className="text-xs text-[#98A2B3] truncate">{(m.body_text ?? '').replace(/\s+/g, ' ').slice(0, 90)}</p>
              </button>
            ))}
          </div>

          {/* Reader */}
          <div className={`premium-card rounded-card p-5 sm:p-6 ${selected ? '' : 'hidden lg:block'}`}>
            {selected ? (
              <>
                <button onClick={() => setSelectedId(null)} className="lg:hidden flex items-center gap-1 text-sm text-[#08A9E0] mb-3">
                  <ArrowLeft size={14} /> Back
                </button>
                <h3 className="font-display font-bold text-[#101B46] text-lg leading-snug">{selected.subject}</h3>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pb-4 mb-4 border-b border-gray-100">
                  <div className="text-sm min-w-0">
                    <p className="font-semibold text-[#172033] truncate">{selected.from_name || selected.from_email}</p>
                    <p className="text-xs text-[#667085] truncate">{selected.from_email} · {new Date(selected.received_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a href={replyHref(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#08A9E0] text-white text-xs font-semibold hover:bg-[#0798C8]">
                      <Reply size={13} /> Reply
                    </a>
                    <button onClick={() => toggleRead(selected)} className="p-2 rounded-full text-[#667085] hover:bg-gray-100" title="Mark as unread">
                      {selected.is_read ? <Mail size={15} /> : <MailOpen size={15} />}
                    </button>
                    <button onClick={() => remove(selected)} className="p-2 rounded-full text-[#667085] hover:text-red-500 hover:bg-red-50" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <MessageBody m={selected} />
              </>
            ) : (
              <p className="text-sm text-[#667085] text-center py-16">Select a message to read it.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
