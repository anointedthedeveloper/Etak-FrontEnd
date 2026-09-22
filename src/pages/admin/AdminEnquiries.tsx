import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessageSquare, Reply, Search, CheckCircle, Clock, Send, Trash2, Phone, Mail } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/index'
import { EmptyState, LoadingState } from '../../components/ui/States'
import { LoadMore } from '../../components/ui/Pagination'
import { supabase } from '../../lib/supabase'

interface Response {
  id: string
  message: string
  created_at: string
  is_admin: boolean
}

interface Enquiry {
  id: string
  name: string
  email: string
  phone: string | null
  service: string | null
  message: string
  status: string
  created_at: string
  responses?: Response[]
}

export default function AdminEnquiries() {
  const [searchParams] = useSearchParams()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'new' | 'responded' | 'resolved'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function load() {
    const { data: inqs } = await supabase
      .from('inquiries')
      .select('id, name, email, phone, service, message, status, created_at')
      .order('created_at', { ascending: false })
    setEnquiries(inqs ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Auto-select from ?id= param
  useEffect(() => {
    const id = searchParams.get('id')
    if (id && enquiries.length > 0 && !selected) {
      const found = enquiries.find(e => e.id === id)
      if (found) { setSelected(found); setResponseText('') }
    }
  }, [searchParams, enquiries])

  // Load responses when enquiry selected
  useEffect(() => {
    if (!selected) return
    supabase
      .from('inquiry_responses')
      .select('id, message, created_at, is_admin')
      .eq('inquiry_id', selected.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setSelected(s => s ? { ...s, responses: data } : s)
      })
  }, [selected?.id])

  // Scroll to bottom of chat when responses load
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected?.responses?.length])

  const filtered = enquiries.filter(e => {
    const matchesFilter = filter === 'all' || e.status === filter
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.service ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })
  const visible = filtered.slice(0, visibleCount)

  const handleRespond = async () => {
    if (!selected || !responseText.trim()) return
    setSubmitting(true)
    await supabase.from('inquiry_responses').insert({
      inquiry_id: selected.id,
      message: responseText,
      is_admin: true,
    })
    await supabase.from('inquiries').update({ status: 'responded' }).eq('id', selected.id)
    setResponseText('')
    // Reload responses
    const { data } = await supabase
      .from('inquiry_responses')
      .select('id, message, created_at, is_admin')
      .eq('inquiry_id', selected.id)
      .order('created_at', { ascending: true })
    setSelected(s => s ? { ...s, status: 'responded', responses: data ?? [] } : s)
    setEnquiries(prev => prev.map(e => e.id === selected.id ? { ...e, status: 'responded' } : e))
    setSubmitting(false)
  }

  const handleResolve = async () => {
    if (!selected) return
    setResolving(true)
    await supabase.from('inquiries').update({ status: 'resolved' }).eq('id', selected.id)
    setSelected(s => s ? { ...s, status: 'resolved' } : s)
    setEnquiries(prev => prev.map(e => e.id === selected.id ? { ...e, status: 'resolved' } : e))
    setResolving(false)
  }

  const handleClear = async () => {
    if (!selected) return
    if (!window.confirm('Delete this enquiry permanently? This cannot be undone.')) return
    setClearing(true)
    await supabase.from('inquiry_responses').delete().eq('inquiry_id', selected.id)
    await supabase.from('inquiries').delete().eq('id', selected.id)
    setEnquiries(prev => prev.filter(e => e.id !== selected.id))
    setSelected(null)
    setClearing(false)
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-up">
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(20) }}
            className="w-full pl-9 pr-4 py-2.5 border border-[#08A9E0]/15 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/30"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value as typeof filter); setVisibleCount(20) }}
          className="px-4 py-2.5 border border-[#08A9E0]/15 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/30"
        >
          <option value="all">All Enquiries</option>
          <option value="new">New</option>
          <option value="responded">Responded</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 lg:gap-6 lg:h-[calc(100vh-220px)]">
        {/* List */}
        <div className="premium-card rounded-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#08A9E0]/10 flex items-center justify-between shrink-0">
            <h3 className="font-semibold text-[#101B46]">All Enquiries</h3>
            <span className="rounded-full bg-[#EAF8FD] px-2.5 py-1 text-xs font-bold text-[#087EAF]">{filtered.length}</span>
          </div>
          <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
            {loading ? (
              <LoadingState />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No enquiries found"
                description={searchTerm || filter !== 'all' ? 'Try a different search or filter.' : 'New customer enquiries will appear here.'}
              />
            ) : (
              <>
                {visible.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    onClick={() => { setSelected(enquiry); setResponseText('') }}
                    className={`p-4 cursor-pointer transition-all ${
                      selected?.id === enquiry.id ? 'bg-[#EAF8FD] border-l-4 border-[#08A9E0]' : 'hover:bg-[#F8FCFE]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[#101B46] truncate">{enquiry.name}</span>
                          <span className="shrink-0"><StatusBadge status={enquiry.status} /></span>
                        </div>
                        <p className="text-sm text-[#667085] truncate">{enquiry.service ?? 'General'}</p>
                        <p className="text-xs text-[#667085] mt-1">{formatDate(enquiry.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <LoadMore
                  shown={visible.length}
                  total={filtered.length}
                  onLoadMore={() => setVisibleCount(v => v + 20)}
                  itemLabel="enquiries"
                />
              </>
            )}
          </div>
        </div>

        {/* Detail / Chat */}
        <div className="premium-card rounded-card overflow-hidden flex flex-col min-h-[500px]">
          {selected ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-[#08A9E0]/10 bg-[#F8FCFE] flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#101B46]">{selected.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-[#667085]"><Mail size={10} />{selected.email}</span>
                    {selected.phone && <span className="flex items-center gap-1 text-xs text-[#667085]"><Phone size={10} />{selected.phone}</span>}
                  </div>
                  <p className="text-xs text-[#667085] mt-0.5">Service: <span className="font-medium capitalize">{selected.service ?? 'General'}</span></p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={selected.status} />
                  {selected.status !== 'resolved' && (
                    <button
                      onClick={handleResolve}
                      disabled={resolving}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={13} />
                      {resolving ? 'Resolving...' : 'Resolve'}
                    </button>
                  )}
                  <button
                    onClick={handleClear}
                    disabled={clearing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    {clearing ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              {/* Original message */}
              <div className="px-4 pt-4 pb-2">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-[#667085] uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Clock size={11} /> Original Message · {formatDate(selected.created_at)}
                  </p>
                  <p className="text-sm text-[#101B46] leading-relaxed">{selected.message}</p>
                </div>
              </div>

              {/* Chat thread */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
                {!selected.responses ? (
                  <LoadingState compact />
                ) : selected.responses.length === 0 ? (
                  <p className="text-xs text-center text-[#667085] py-4">No replies yet.</p>
                ) : selected.responses.map(r => (
                  <div key={r.id} className={`flex flex-col ${r.is_admin ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-semibold text-[#667085] px-1 mb-0.5">
                      {r.is_admin ? 'You (Admin)' : selected.name}
                    </span>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${r.is_admin ? 'bg-[#08A9E0] text-white' : 'bg-gray-100 text-[#101B46]'}`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{r.message}</p>
                      <p className={`text-[10px] mt-1 ${r.is_admin ? 'text-blue-100' : 'text-[#667085]'}`}>{formatDate(r.created_at)}</p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Reply box */}
              {selected.status !== 'resolved' && (
                <div className="p-4 border-t border-[#08A9E0]/10 bg-[#F8FCFE]/60">
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      placeholder="Type your response..."
                      value={responseText}
                      onChange={e => setResponseText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRespond() } }}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/30"
                    />
                    <Button
                      onClick={handleRespond}
                      variant="primary"
                      disabled={!responseText.trim()}
                      loading={submitting}
                      className="self-end px-3"
                    >
                      <Send size={15} />
                    </Button>
                  </div>
                  <p className="text-xs text-[#667085] mt-1.5 flex items-center gap-1">
                    <Reply size={11} /> Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              )}
              {selected.status === 'resolved' && (
                <div className="p-4 border-t border-[#08A9E0]/10 text-center">
                  <p className="text-xs text-green-600 flex items-center justify-center gap-1.5">
                    <CheckCircle size={13} /> This enquiry has been resolved
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState
                icon={MessageSquare}
                title="No enquiry selected"
                description="Choose an enquiry from the list to view and reply to the conversation."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
