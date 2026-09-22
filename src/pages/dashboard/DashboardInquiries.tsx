import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FileSearch, ArrowRight, Filter, X, MessageSquare, ChevronRight, Send } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/index'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface Response {
  id: string
  message: string
  created_at: string
  is_admin: boolean
}

interface Inquiry {
  id: string
  service: string | null
  status: string
  message: string
  created_at: string
  name: string
  email: string
  phone: string | null
  details: Record<string, unknown> | null
  responses?: Response[]
}

const statusFilters = ['all', 'new', 'in_progress', 'responded', 'resolved']

function DetailLabel({ label, value }: { label: string; value?: unknown }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-xs text-[#667085] font-medium">{label}</dt>
      <dd className="text-sm text-[#101B46] font-semibold mt-0.5">{String(value)}</dd>
    </div>
  )
}

function InquiryDetails({ details, service }: { details: Record<string, unknown> | null; service: string | null }) {
  if (!details) return null
  const d = details

  if (service === 'flight') return (
    <dl className="grid grid-cols-2 gap-3">
      <DetailLabel label="Trip Type"   value={d.tripType} />
      <DetailLabel label="From"        value={d.from} />
      <DetailLabel label="To"          value={d.to} />
      <DetailLabel label="Departure"   value={d.departure} />
      <DetailLabel label="Return"      value={d.returnDate} />
      <DetailLabel label="Class"       value={(d.travellers as Record<string,unknown>)?.class} />
    </dl>
  )

  if (service === 'hotel') return (
    <dl className="grid grid-cols-2 gap-3">
      <DetailLabel label="Destination" value={d.destination} />
      <DetailLabel label="Check-in"    value={d.checkIn} />
      <DetailLabel label="Check-out"   value={d.checkOut} />
      <DetailLabel label="Rooms"       value={d.rooms} />
    </dl>
  )

  if (service === 'tour') return (
    <dl className="grid grid-cols-2 gap-3">
      <DetailLabel label="Destination" value={d.destination} />
      <DetailLabel label="Travel Date" value={d.travelDate} />
      <DetailLabel label="Duration"    value={d.duration} />
      <DetailLabel label="Tour Type"   value={d.tourType} />
    </dl>
  )

  return (
    <dl className="grid grid-cols-2 gap-3">
      {Object.entries(d).map(([k, v]) => (
        <DetailLabel key={k} label={k} value={v} />
      ))}
    </dl>
  )
}

export default function DashboardInquiries() {
  const { user } = useAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [selected, setSelected]   = useState<Inquiry | null>(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('inquiries')
      .select('id, service, status, message, created_at, name, email, phone, details')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setInquiries(data)
        setLoading(false)
      })
  }, [user])

  // Load responses when an inquiry is selected
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

  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected?.responses?.length])

  const handleReply = async () => {
    if (!selected || !replyText.trim()) return
    setReplying(true)
    await supabase.from('inquiry_responses').insert({
      inquiry_id: selected.id,
      message: replyText,
      is_admin: false,
    })
    setReplyText('')
    const { data } = await supabase
      .from('inquiry_responses')
      .select('id, message, created_at, is_admin')
      .eq('inquiry_id', selected.id)
      .order('created_at', { ascending: true })
    setSelected(s => s ? { ...s, responses: data ?? [] } : s)
    setReplying(false)
  }

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter)
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const shortId = (uuid: string) => `ETK-${uuid.slice(0, 6).toUpperCase()}`

  return (
    <div className="p-4 sm:p-5 xl:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#101B46]">Inquiries</h1>
          <p className="text-sm text-[#667085] mt-0.5">All your submitted travel inquiries</p>
        </div>
        <Link to="/contact">
          <Button variant="primary" size="sm">New inquiry <ArrowRight size={14} /></Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={15} className="text-[#667085]" />
        {statusFilters.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer ${
              filter === s ? 'bg-[#101B46] text-white' : 'bg-gray-100 text-[#667085] hover:bg-gray-200'
            }`}>
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:min-h-[calc(100vh-260px)]">
        {/* Table */}
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all ${selected ? 'lg:flex-1 min-w-0' : 'w-full'}`}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 rounded-full border-4 border-gray-100 border-t-[#08A9E0] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <FileSearch size={26} className="text-gray-300" />
              </div>
              <p className="font-semibold text-[#172033] mb-1">No inquiries found</p>
              <p className="text-sm text-[#667085] mb-6">
                {filter !== 'all' ? 'Try changing the filter.' : 'Submit your first travel inquiry to get started.'}
              </p>
              {filter === 'all' && (
                <Link to="/contact"><Button variant="primary" size="sm">Submit an inquiry</Button></Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wide">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wide">Service</th>
                    {!selected && <th className="text-left px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wide hidden md:table-cell">Message</th>}
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wide">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(inq => (
                    <tr
                      key={inq.id}
                      onClick={() => setSelected(s => s?.id === inq.id ? null : inq)}
                      className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selected?.id === inq.id ? 'bg-[#EAF8FD]/60' : ''}`}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-[#08A9E0] font-semibold whitespace-nowrap">{shortId(inq.id)}</td>
                      <td className="px-6 py-4 font-medium text-[#172033] capitalize whitespace-nowrap">{inq.service ?? 'General'}</td>
                      {!selected && <td className="px-6 py-4 text-[#667085] max-w-xs truncate hidden md:table-cell">{inq.message}</td>}
                      <td className="px-6 py-4 text-[#667085] whitespace-nowrap">{formatDate(inq.created_at)}</td>
                      <td className="px-6 py-4"><StatusBadge status={inq.status} /></td>
                      <td className="px-6 py-4 text-[#667085]"><ChevronRight size={14} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-full lg:w-96 xl:w-[440px] shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden lg:sticky lg:top-0 lg:max-h-[calc(100vh-180px)]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <p className="font-mono text-xs text-[#08A9E0] font-semibold">{shortId(selected.id)}</p>
                <p className="font-semibold text-[#101B46] capitalize">{selected.service ?? 'General'} Inquiry</p>
                {selected.phone && (
                  <p className="text-xs text-[#667085] mt-0.5 flex items-center gap-1">
                    <span>📞</span> {selected.phone}
                  </p>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-[#667085]">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Status + date */}
              <div className="flex items-center justify-between">
                <StatusBadge status={selected.status} />
                <span className="text-xs text-[#667085]">{formatDate(selected.created_at)}</span>
              </div>

              {/* Structured details */}
              {selected.details && (
                <div>
                  <p className="text-xs font-semibold text-[#667085] uppercase tracking-wide mb-2">Inquiry Details</p>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <InquiryDetails details={selected.details} service={selected.service} />
                  </div>
                </div>
              )}

              {/* Message */}
              {selected.message && (
                <div>
                  <p className="text-xs font-semibold text-[#667085] uppercase tracking-wide mb-2">Message</p>
                  <p className="text-sm text-[#101B46] bg-gray-50 rounded-xl p-3 leading-relaxed">{selected.message}</p>
                </div>
              )}

              {/* Responses thread */}
              <div>
                <p className="text-xs font-semibold text-[#667085] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <MessageSquare size={12} /> Responses
                </p>
                {!selected.responses ? (
                  <div className="flex justify-center py-4">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-100 border-t-[#08A9E0] animate-spin" />
                  </div>
                ) : selected.responses.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-xl">
                    <p className="text-xs text-[#667085]">No responses yet.</p>
                    <p className="text-xs text-[#667085] mt-1">Our team will reply within 24 hours.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {selected.responses.map(r => (
                      <div key={r.id} className={`flex ${r.is_admin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${r.is_admin ? 'bg-[#EAF8FD] border border-[#08A9E0]/20' : 'bg-[#101B46] text-white'}`}>
                          <p className={`text-xs font-semibold mb-1 ${r.is_admin ? 'text-[#08A9E0]' : 'text-blue-200'}`}>
                            {r.is_admin ? 'Etak Travels' : 'You'}
                          </p>
                          <p className={`leading-relaxed ${r.is_admin ? 'text-[#101B46]' : 'text-white'}`}>{r.message}</p>
                          <p className={`text-[10px] mt-1 ${r.is_admin ? 'text-[#667085]' : 'text-blue-200'}`}>{formatDate(r.created_at)}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Reply box */}
            {selected.status !== 'resolved' && (
              <div className="px-5 py-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    placeholder="Reply to Etak Travels..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply() } }}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/30"
                  />
                  <Button
                    onClick={handleReply}
                    variant="primary"
                    disabled={!replyText.trim()}
                    loading={replying}
                    className="self-end px-3"
                  >
                    <Send size={15} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
