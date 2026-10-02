import { useEffect, useMemo, useState } from 'react'
import { Inbox, Mail, MailOpen, Trash2, Reply, RefreshCw, ArrowLeft, X, Send, SendHorizonal } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { EmptyState, LoadingState } from '../../components/ui/States'

const MAILBOX = 'info@etaktravels.com'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string

interface InboxMessage {
  id: string
  from_name: string | null
  from_email: string
  subject: string
  body_text: string | null
  body_html: string | null
  message_id: string | null
  is_read: boolean
  received_at: string
}

interface SentReply {
  id: string
  to_email: string
  to_name: string | null
  subject: string
  body_text: string
  sent_at: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const sameDay = d.toDateString() === new Date().toDateString()
  return sameDay
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })
}

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

function ReplyModal({ message, onClose, onSent }: { message: InboxMessage; onClose: () => void; onSent: () => void }) {
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const subject = /^re:/i.test(message.subject) ? message.subject : `Re: ${message.subject}`

  async function send() {
    if (!body.trim()) return
    setSending(true)
    setError('')
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
      body: JSON.stringify({
        to: message.from_email,
        to_name: message.from_name,
        subject,
        body: body.trim(),
        message_id: message.message_id,
      }),
    })
    setSending(false)
    if (res.ok) { setSent(true); onSent(); setTimeout(onClose, 1200) }
    else setError(await res.text())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 animate-fade-up">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-[#101B46] text-base flex items-center gap-2">
            <Reply size={16} className="text-[#08A9E0]" /> Reply
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-[#667085]"><X size={16} /></button>
        </div>
        <div className="text-sm space-y-1">
          <p><span className="text-[#667085]">To:</span> <span className="font-medium text-[#172033]">{message.from_name ? `${message.from_name} <${message.from_email}>` : message.from_email}</span></p>
          <p><span className="text-[#667085]">Subject:</span> <span className="font-medium text-[#172033]">{subject}</span></p>
        </div>
        <textarea
          rows={7}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Write your reply…"
          className="w-full rounded-xl border border-gray-200 p-3 text-sm text-[#172033] resize-none focus:outline-none focus:ring-2 focus:ring-[#08A9E0]"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-sm text-[#667085] hover:bg-gray-100">Cancel</button>
          <button
            onClick={send}
            disabled={sending || sent || !body.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#08A9E0] text-white text-sm font-semibold hover:bg-[#0798C8] disabled:opacity-50"
          >
            <Send size={13} />
            {sent ? 'Sent!' : sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SentTab() {
  const [sent, setSent] = useState<SentReply[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('sent_replies').select('*').order('sent_at', { ascending: false }).limit(200)
      .then(({ data }) => { setSent(data ?? []); setLoading(false) })
  }, [])

  const selected = sent.find(s => s.id === selectedId) ?? null

  if (loading) return <LoadingState />
  if (!sent.length) return <EmptyState icon={SendHorizonal} title="No sent replies yet" description="Replies you send will appear here." />

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-4 items-start">
      <div className={`premium-card rounded-card overflow-hidden ${selected ? 'hidden lg:block' : ''}`}>
        {sent.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${selectedId === s.id ? 'bg-[#EAF8FD]' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm truncate flex-1 text-[#172033]">{s.to_name || s.to_email}</span>
              <span className="text-[11px] text-[#667085] shrink-0">{formatDate(s.sent_at)}</span>
            </div>
            <p className="text-sm truncate mt-0.5 text-[#667085]">{s.subject}</p>
            <p className="text-xs text-[#98A2B3] truncate">{s.body_text.replace(/\s+/g, ' ').slice(0, 90)}</p>
          </button>
        ))}
      </div>

      <div className={`premium-card rounded-card p-5 sm:p-6 ${selected ? '' : 'hidden lg:block'}`}>
        {selected ? (
          <>
            <button onClick={() => setSelectedId(null)} className="lg:hidden flex items-center gap-1 text-sm text-[#08A9E0] mb-3">
              <ArrowLeft size={14} /> Back
            </button>
            <h3 className="font-display font-bold text-[#101B46] text-lg leading-snug">{selected.subject}</h3>
            <div className="mt-2 pb-4 mb-4 border-b border-gray-100 text-sm">
              <p className="font-semibold text-[#172033]">{selected.to_name || selected.to_email}</p>
              <p className="text-xs text-[#667085]">{selected.to_email} · {new Date(selected.sent_at).toLocaleString()}</p>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm text-[#172033] leading-relaxed">{selected.body_text}</pre>
          </>
        ) : (
          <p className="text-sm text-[#667085] text-center py-16">Select a message to read it.</p>
        )}
      </div>
    </div>
  )
}

export default function AdminInbox() {
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [replying, setReplying] = useState(false)
  const [tab, setTab] = useState<'inbox' | 'sent'>('inbox')
  const [sentCount, setSentCount] = useState(0)

  async function load() {
    const { data, error: err } = await supabase
      .from('inbox_messages')
      .select('id, from_name, from_email, subject, body_text, body_html, message_id, is_read, received_at')
      .order('received_at', { ascending: false })
      .limit(200)
    if (err) setError(err.message)
    else { setError(''); setMessages(data ?? []) }
    setLoading(false)
    const { count } = await supabase.from('sent_replies').select('*', { count: 'exact', head: true })
    setSentCount(count ?? 0)
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

  return (
    <>
      {replying && selected && (
        <ReplyModal
          message={selected}
          onClose={() => setReplying(false)}
          onSent={() => setSentCount(c => c + 1)}
        />
      )}

      <div className="space-y-4 animate-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-[#101B46] text-xl flex items-center gap-2">
              <Inbox size={20} className="text-[#08A9E0]" /> Mailbox
            </h2>
            <p className="text-sm text-[#667085]"><span className="font-medium text-[#172033]">{MAILBOX}</span></p>
          </div>
          <div className="flex items-center gap-2">
            {/* Inbox / Sent tabs */}
            <div className="flex rounded-full bg-white border border-gray-200 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setTab('inbox')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${tab === 'inbox' ? 'bg-[#08A9E0] text-white' : 'text-[#667085] hover:text-[#101B46]'}`}
              >
                <Inbox size={12} /> Inbox {unread ? `(${unread})` : ''}
              </button>
              <button
                onClick={() => setTab('sent')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${tab === 'sent' ? 'bg-[#08A9E0] text-white' : 'text-[#667085] hover:text-[#101B46]'}`}
              >
                <SendHorizonal size={12} /> Sent {sentCount ? `(${sentCount})` : ''}
              </button>
            </div>
            {tab === 'inbox' && (
              <>
                <div className="flex rounded-full bg-white border border-gray-200 p-0.5 text-xs font-semibold">
                  {(['all', 'unread'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-full capitalize transition-colors ${filter === f ? 'bg-[#101B46] text-white' : 'text-[#667085] hover:text-[#101B46]'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setLoading(true); load() }} className="p-2 rounded-full bg-white border border-gray-200 text-[#667085] hover:text-[#08A9E0]" title="Refresh">
                  <RefreshCw size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        {tab === 'sent' ? <SentTab /> : (
          loading ? <LoadingState /> : error ? (
            <div className="p-4 rounded-card bg-red-50 border border-red-200 text-sm text-red-600">
              Could not load the inbox: {error}. Make sure migration 013 has been run in Supabase.
            </div>
          ) : messages.length === 0 ? (
            <EmptyState icon={Inbox} title="No messages yet" description={`Mail sent to ${MAILBOX} will appear here once the inbound-email function is connected.`} />
          ) : (
            <div className="grid lg:grid-cols-[360px_1fr] gap-4 items-start">
              <div className={`premium-card rounded-card overflow-hidden ${selected ? 'hidden lg:block' : ''}`}>
                {visible.length === 0 && <p className="p-6 text-sm text-center text-[#667085]">No unread messages.</p>}
                {visible.map(m => (
                  <button
                    key={m.id}
                    onClick={() => open(m)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${selectedId === m.id ? 'bg-[#EAF8FD]' : 'hover:bg-gray-50'}`}
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
                        <button onClick={() => setReplying(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#08A9E0] text-white text-xs font-semibold hover:bg-[#0798C8]">
                          <Reply size={13} /> Reply
                        </button>
                        <button onClick={() => toggleRead(selected)} className="p-2 rounded-full text-[#667085] hover:bg-gray-100" title="Toggle read">
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
          )
        )}
      </div>
    </>
  )
}
