import { useEffect, useMemo, useState } from 'react'
import { Inbox, Mail, MailOpen, Trash2, Reply, RefreshCw, ArrowLeft, X, Send, SendHorizonal, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { EmptyState, LoadingState } from '../../components/ui/States'
import Avatar from '../../components/ui/Avatar'

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

interface UserSuggestion {
  email: string
  name: string
  avatar_url?: string | null
}

// Tiny MD5 for Gravatar (no dependency needed)
function md5(str: string): string {
  str = str.trim().toLowerCase()
  function safeAdd(x: number, y: number) { const lsw = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff) }
  function bitRotateLeft(num: number, cnt: number) { return (num << cnt) | (num >>> (32 - cnt)) }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b) }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & c) | (~b & d), a, b, x, s, t) }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t) }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(b ^ c ^ d, a, b, x, s, t) }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(c ^ (b | ~d), a, b, x, s, t) }
  function coremd5(m: number[], l: number) {
    const n = (((l + 64) >>> 9) << 4) + 14
    const x = new Array<number>(n + 16).fill(0)
    for (let i = 0; i < l; i++) x[i >> 5] |= (m[i] & 0xff) << (i % 32)
    x[l >> 5] |= 0x80 << (l % 32); x[n] = l
    let [a, b, c, d] = [1732584193, -271733879, -1732584194, 271733878]
    for (let i = 0; i < x.length; i += 16) {
      const [oa, ob, oc, od] = [a, b, c, d]
      a = md5ff(a,b,c,d,x[i],7,-680876936); d = md5ff(d,a,b,c,x[i+1],12,-389564586); c = md5ff(c,d,a,b,x[i+2],17,606105819); b = md5ff(b,c,d,a,x[i+3],22,-1044525330)
      a = md5ff(a,b,c,d,x[i+4],7,-176418897); d = md5ff(d,a,b,c,x[i+5],12,1200080426); c = md5ff(c,d,a,b,x[i+6],17,-1473231341); b = md5ff(b,c,d,a,x[i+7],22,-45705983)
      a = md5ff(a,b,c,d,x[i+8],7,1770035416); d = md5ff(d,a,b,c,x[i+9],12,-1958414417); c = md5ff(c,d,a,b,x[i+10],17,-42063); b = md5ff(b,c,d,a,x[i+11],22,-1990404162)
      a = md5ff(a,b,c,d,x[i+12],7,1804603682); d = md5ff(d,a,b,c,x[i+13],12,-40341101); c = md5ff(c,d,a,b,x[i+14],17,-1502002290); b = md5ff(b,c,d,a,x[i+15],22,1236535329)
      a = md5gg(a,b,c,d,x[i+1],5,-165796510); d = md5gg(d,a,b,c,x[i+6],9,-1069501632); c = md5gg(c,d,a,b,x[i+11],14,643717713); b = md5gg(b,c,d,a,x[i],20,-373897302)
      a = md5gg(a,b,c,d,x[i+5],5,-701558691); d = md5gg(d,a,b,c,x[i+10],9,38016083); c = md5gg(c,d,a,b,x[i+15],14,-660478335); b = md5gg(b,c,d,a,x[i+4],20,-405537848)
      a = md5gg(a,b,c,d,x[i+9],5,568446438); d = md5gg(d,a,b,c,x[i+14],9,-1019803690); c = md5gg(c,d,a,b,x[i+3],14,-187363961); b = md5gg(b,c,d,a,x[i+8],20,1163531501)
      a = md5gg(a,b,c,d,x[i+13],5,-1444681467); d = md5gg(d,a,b,c,x[i+2],9,-51403784); c = md5gg(c,d,a,b,x[i+7],14,1735328473); b = md5gg(b,c,d,a,x[i+12],20,-1926607734)
      a = md5hh(a,b,c,d,x[i+5],4,-378558); d = md5hh(d,a,b,c,x[i+8],11,-2022574463); c = md5hh(c,d,a,b,x[i+11],16,1839030562); b = md5hh(b,c,d,a,x[i+14],23,-35309556)
      a = md5hh(a,b,c,d,x[i+1],4,-1530992060); d = md5hh(d,a,b,c,x[i+4],11,1272893353); c = md5hh(c,d,a,b,x[i+7],16,-155497632); b = md5hh(b,c,d,a,x[i+10],23,-1094730640)
      a = md5hh(a,b,c,d,x[i+13],4,681279174); d = md5hh(d,a,b,c,x[i],11,-358537222); c = md5hh(c,d,a,b,x[i+3],16,-722521979); b = md5hh(b,c,d,a,x[i+6],23,76029189)
      a = md5hh(a,b,c,d,x[i+9],4,-640364487); d = md5hh(d,a,b,c,x[i+12],11,-421815835); c = md5hh(c,d,a,b,x[i+15],16,530742520); b = md5hh(b,c,d,a,x[i+2],23,-995338651)
      a = md5ii(a,b,c,d,x[i],6,-198630844); d = md5ii(d,a,b,c,x[i+7],10,1126891415); c = md5ii(c,d,a,b,x[i+14],15,-1416354905); b = md5ii(b,c,d,a,x[i+5],21,-57434055)
      a = md5ii(a,b,c,d,x[i+12],6,1700485571); d = md5ii(d,a,b,c,x[i+3],10,-1894986606); c = md5ii(c,d,a,b,x[i+10],15,-1051523); b = md5ii(b,c,d,a,x[i+1],21,-2054922799)
      a = md5ii(a,b,c,d,x[i+8],6,1873313359); d = md5ii(d,a,b,c,x[i+15],10,-30611744); c = md5ii(c,d,a,b,x[i+6],15,-1560198380); b = md5ii(b,c,d,a,x[i+13],21,1309151649)
      a = md5ii(a,b,c,d,x[i+4],6,-145523070); d = md5ii(d,a,b,c,x[i+11],10,-1120210379); c = md5ii(c,d,a,b,x[i+2],15,718787259); b = md5ii(b,c,d,a,x[i+9],21,-343485551)
      a = safeAdd(a,oa); b = safeAdd(b,ob); c = safeAdd(c,oc); d = safeAdd(d,od)
    }
    return [a, b, c, d]
  }
  function rstr2binl(s: string) { const a: number[] = []; for (let i = 0; i < s.length * 8; i += 8) a[i >> 5] = (a[i >> 5] ?? 0) | (s.charCodeAt(i / 8) & 0xff) << (i % 32); return a }
  function binl2hex(b: number[]) { const h = '0123456789abcdef'; let s = ''; for (let i = 0; i < b.length * 4; i++) s += h[(b[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf] + h[(b[i >> 2] >> ((i % 4) * 8)) & 0xf]; return s }
  const encoded = unescape(encodeURIComponent(str))
  return binl2hex(coremd5(rstr2binl(encoded), encoded.length * 8))
}

function GravatarAvatar({ email, name, size = 32 }: { email: string; name?: string | null; size?: number }) {
  const initials = (name ?? email).split(/\s+/).map(p => p[0]).join('').slice(0, 2).toUpperCase() || '?'
  const hash = md5(email)
  const [failed, setFailed] = useState(false)

  return failed ? (
    <div style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="rounded-full bg-[#08A9E0] flex items-center justify-center text-white font-bold shrink-0">
      {initials}
    </div>
  ) : (
    <img
      src={`https://www.gravatar.com/avatar/${hash}?s=${size * 2}&d=404`}
      alt={initials}
      referrerPolicy="no-referrer"
      style={{ width: size, height: size }}
      className="rounded-full object-cover shrink-0"
      onError={() => setFailed(true)}
    />
  )
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
      <iframe title="Message body" sandbox="" srcDoc={m.body_html}
        className="w-full min-h-[360px] rounded-lg border border-gray-100 bg-white" />
    )
  }
  return <pre className="whitespace-pre-wrap font-sans text-sm text-[#172033] leading-relaxed">{m.body_text || '(empty message)'}</pre>
}

async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

async function callSendReply(payload: object) {
  const session = await getSession()
  return fetch(`${SUPABASE_URL}/functions/v1/send-reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
    body: JSON.stringify(payload),
  })
}

function ComposeModal({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [to, setTo] = useState('')
  const [toName, setToName] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  async function searchUsers(q: string) {
    if (q.length < 2) { setSuggestions([]); return }
    const { data } = await supabase.rpc('get_users_for_admin')
    if (!data) return
    const lower = q.toLowerCase()
    setSuggestions(
      (data as { email: string; first_name: string; last_name: string; avatar_url?: string | null }[])
        .filter(u => u.email?.toLowerCase().includes(lower) || `${u.first_name} ${u.last_name}`.toLowerCase().includes(lower))
        .slice(0, 6)
        .map(u => ({ email: u.email, name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim(), avatar_url: u.avatar_url }))
    )
  }

  async function send() {
    if (!to.trim() || !subject.trim() || !body.trim()) return
    setSending(true); setError('')
    const res = await callSendReply({ to: to.trim(), to_name: toName || undefined, subject, body })
    setSending(false)
    if (res.ok) { setSent(true); onSent(); setTimeout(onClose, 1200) }
    else setError(await res.text())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 animate-fade-up">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-[#101B46] text-base flex items-center gap-2">
            <PenSquare size={16} className="text-[#08A9E0]" /> New Message
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-[#667085]"><X size={16} /></button>
        </div>

        {/* To field with user search */}
        <div className="relative">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 focus-within:ring-2 focus-within:ring-[#08A9E0]">
            <Search size={13} className="text-[#667085] shrink-0" />
            <input
              value={to}
              onChange={e => { setTo(e.target.value); searchUsers(e.target.value); setShowSuggestions(true) }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="To: email or search user…"
              className="flex-1 text-sm text-[#172033] outline-none"
            />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {suggestions.map(s => (
                <button key={s.email} onMouseDown={() => { setTo(s.email); setToName(s.name); setSuggestions([]); setShowSuggestions(false) }}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#EAF8FD] text-sm flex items-center gap-2.5">
                  <Avatar avatarUrl={s.avatar_url ?? undefined} firstName={s.name.split(' ')[0]} lastName={s.name.split(' ')[1]} size={28} />
                  <span className="font-medium text-[#172033]">{s.name}</span>
                  <span className="text-[#667085] ml-1">{s.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject"
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#08A9E0]" />

        <textarea rows={7} value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message…"
          className="w-full rounded-xl border border-gray-200 p-3 text-sm text-[#172033] resize-none focus:outline-none focus:ring-2 focus:ring-[#08A9E0]" />

        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-sm text-[#667085] hover:bg-gray-100">Cancel</button>
          <button onClick={send} disabled={sending || sent || !to.trim() || !subject.trim() || !body.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#08A9E0] text-white text-sm font-semibold hover:bg-[#0798C8] disabled:opacity-50">
            <Send size={13} />
            {sent ? 'Sent!' : sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ReplyModal({ message, onClose, onSent }: { message: InboxMessage; onClose: () => void; onSent: () => void }) {
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const subject = /^re:/i.test(message.subject) ? message.subject : `Re: ${message.subject}`

  async function send() {
    if (!body.trim()) return
    setSending(true); setError('')
    const res = await callSendReply({ to: message.from_email, to_name: message.from_name, subject, body: body.trim(), message_id: message.message_id })
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
        <textarea rows={7} value={body} onChange={e => setBody(e.target.value)} placeholder="Write your reply…"
          className="w-full rounded-xl border border-gray-200 p-3 text-sm text-[#172033] resize-none focus:outline-none focus:ring-2 focus:ring-[#08A9E0]" />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-sm text-[#667085] hover:bg-gray-100">Cancel</button>
          <button onClick={send} disabled={sending || sent || !body.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#08A9E0] text-white text-sm font-semibold hover:bg-[#0798C8] disabled:opacity-50">
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
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    supabase.from('sent_replies').select('*').order('sent_at', { ascending: false }).limit(200)
      .then(({ data }) => { setSent(data ?? []); setLoading(false) })
  }, [])

  const selected = sent.find(s => s.id === selectedId) ?? null

  async function resend(s: SentReply) {
    setResending(true); setResent(false)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
      body: JSON.stringify({ to: s.to_email, to_name: s.to_name, subject: s.subject, body: s.body_text }),
    })
    setResending(false)
    if (res.ok) {
      setResent(true)
      const { data } = await supabase.from('sent_replies').select('*').order('sent_at', { ascending: false }).limit(200)
      setSent(data ?? [])
      setTimeout(() => setResent(false), 2000)
    }
  }

  if (loading) return <LoadingState />
  if (!sent.length) return <EmptyState icon={SendHorizonal} title="No sent messages yet" description="Replies you send will appear here." />

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-4 items-start">
      <div className={`premium-card rounded-card overflow-hidden ${selected ? 'hidden lg:block' : ''}`}>
        {sent.map(s => (
          <button key={s.id} onClick={() => { setSelectedId(s.id); setResent(false) }}
            className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${selectedId === s.id ? 'bg-[#EAF8FD]' : 'hover:bg-gray-50'}`}>
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
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pb-4 mb-4 border-b border-gray-100">
              <div className="text-sm min-w-0">
                <p className="font-semibold text-[#172033]">{selected.to_name || selected.to_email}</p>
                <p className="text-xs text-[#667085]">{selected.to_email} · {new Date(selected.sent_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => resend(selected)}
                disabled={resending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#08A9E0] text-white text-xs font-semibold hover:bg-[#0798C8] disabled:opacity-50"
              >
                <Send size={13} />
                {resent ? 'Sent!' : resending ? 'Sending…' : 'Send Again'}
              </button>
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
  const [search, setSearch] = useState('')

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

  const visible = useMemo(() => {
    let list = filter === 'unread' ? messages.filter(m => !m.is_read) : messages
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        m.from_email.toLowerCase().includes(q) ||
        (m.from_name ?? '').toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
      )
    }
    return list
  }, [messages, filter, search])

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
      {replying && selected && <ReplyModal message={selected} onClose={() => setReplying(false)} onSent={() => setSentCount(c => c + 1)} />}

      <div className="space-y-4 animate-fade-up">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-[#101B46] text-xl flex items-center gap-2">
              <Inbox size={20} className="text-[#08A9E0]" /> Mailbox
            </h2>
            <p className="text-sm text-[#667085]"><span className="font-medium text-[#172033]">{MAILBOX}</span></p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Inbox / Sent */}
            <div className="flex rounded-full bg-white border border-gray-200 p-0.5 text-xs font-semibold">
              <button onClick={() => setTab('inbox')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${tab === 'inbox' ? 'bg-[#08A9E0] text-white' : 'text-[#667085] hover:text-[#101B46]'}`}>
                <Inbox size={12} /> Inbox {unread ? `(${unread})` : ''}
              </button>
              <button onClick={() => setTab('sent')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${tab === 'sent' ? 'bg-[#08A9E0] text-white' : 'text-[#667085] hover:text-[#101B46]'}`}>
                <SendHorizonal size={12} /> Sent {sentCount ? `(${sentCount})` : ''}
              </button>
            </div>
            {tab === 'inbox' && (
              <>
                <div className="flex rounded-full bg-white border border-gray-200 p-0.5 text-xs font-semibold">
                  {(['all', 'unread'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-full capitalize transition-colors ${filter === f ? 'bg-[#101B46] text-white' : 'text-[#667085] hover:text-[#101B46]'}`}>
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

        {/* Search bar */}
        {tab === 'inbox' && (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or subject…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/30" />
          </div>
        )}

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
                {visible.length === 0 && <p className="p-6 text-sm text-center text-[#667085]">No messages found.</p>}
                {visible.map(m => (
                  <button key={m.id} onClick={() => open(m)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${selectedId === m.id ? 'bg-[#EAF8FD]' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-2.5">
                      <GravatarAvatar email={m.from_email} name={m.from_name} size={32} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          {!m.is_read && <span className="w-2 h-2 rounded-full bg-[#08A9E0] shrink-0" />}
                          <span className={`text-sm truncate flex-1 ${m.is_read ? 'text-[#172033]' : 'font-bold text-[#101B46]'}`}>
                            {m.from_name || m.from_email}
                          </span>
                          <span className="text-[11px] text-[#667085] shrink-0">{formatDate(m.received_at)}</span>
                        </div>
                        <p className={`text-sm truncate mt-0.5 ${m.is_read ? 'text-[#667085]' : 'font-semibold text-[#172033]'}`}>{m.subject}</p>
                        <p className="text-xs text-[#98A2B3] truncate">{(m.body_text ?? '').replace(/\s+/g, ' ').slice(0, 90)}</p>
                      </div>
                    </div>
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
                      <div className="flex items-center gap-3 text-sm min-w-0">
                        <GravatarAvatar email={selected.from_email} name={selected.from_name} size={36} />
                        <div className="min-w-0">
                          <p className="font-semibold text-[#172033] truncate">{selected.from_name || selected.from_email}</p>
                          <p className="text-xs text-[#667085] truncate">{selected.from_email} · {new Date(selected.received_at).toLocaleString()}</p>
                        </div>
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
