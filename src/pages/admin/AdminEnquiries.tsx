import { useEffect, useState } from 'react'
import { MessageSquare, Reply, Search } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/FormFields'
import { StatusBadge } from '../../components/ui/index'
import { supabase } from '../../lib/supabase'

interface Enquiry {
  id: string
  name: string
  email: string
  phone: string | null
  service: string | null
  message: string
  status: string
  created_at: string
  latestResponse?: string
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'new' | 'responded'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  async function load() {
    const { data: inqs } = await supabase
      .from('inquiries')
      .select('id, name, email, phone, service, message, status, created_at')
      .order('created_at', { ascending: false })

    if (!inqs) { setLoading(false); return }

    // Fetch latest response for each inquiry
    const { data: responses } = await supabase
      .from('inquiry_responses')
      .select('inquiry_id, message, created_at')
      .order('created_at', { ascending: false })

    const latestByInquiry: Record<string, string> = {}
    for (const r of responses ?? []) {
      if (!latestByInquiry[r.inquiry_id]) latestByInquiry[r.inquiry_id] = r.message
    }

    setEnquiries(inqs.map(i => ({ ...i, latestResponse: latestByInquiry[i.id] })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = enquiries.filter(e => {
    const matchesFilter = filter === 'all' || e.status === filter
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.service ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleRespond = async () => {
    if (!selectedEnquiry || !responseText.trim()) return
    setSubmitting(true)

    await supabase.from('inquiry_responses').insert({
      inquiry_id: selectedEnquiry.id,
      message: responseText,
      is_admin: true,
    })

    await supabase.from('inquiries').update({ status: 'responded' }).eq('id', selectedEnquiry.id)

    setResponseText('')
    setSelectedEnquiry(null)
    await load()
    setSubmitting(false)
  }

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#08A9E0] text-white flex items-center justify-center shadow-md shadow-[#08A9E0]/20"><MessageSquare size={17} /></div>
            <h1 className="font-display text-2xl font-bold text-[#101B46]">Enquiries</h1>
          </div>
          <p className="text-sm text-[#667085] mt-0.5">View and respond to customer inquiries</p>
        </div>
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-[#08A9E0]/15 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/30"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'new' | 'responded')}
            className="px-4 py-2.5 border border-[#08A9E0]/15 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/30"
          >
            <option value="all">All Enquiries</option>
            <option value="new">Pending</option>
            <option value="responded">Responded</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
        {/* List */}
        <div className="premium-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#08A9E0]/10 flex items-center justify-between">
            <h3 className="font-semibold text-[#101B46]">All Enquiries</h3>
            <span className="rounded-full bg-[#EAF8FD] px-2.5 py-1 text-xs font-bold text-[#087EAF]">{filtered.length}</span>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {loading ? (
              <p className="p-8 text-center text-sm text-[#667085]">Loading...</p>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-[#667085]">
                <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No enquiries found</p>
              </div>
            ) : filtered.map((enquiry) => (
              <div
                key={enquiry.id}
                onClick={() => { setSelectedEnquiry(enquiry); setResponseText('') }}
                className={`p-4 cursor-pointer transition-all ${
                  selectedEnquiry?.id === enquiry.id ? 'bg-[#EAF8FD] border-l-4 border-[#08A9E0]' : 'hover:bg-[#F8FCFE]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[#101B46] truncate">{enquiry.name}</span>
                      <span className="shrink-0"><StatusBadge status={enquiry.status === 'new' ? 'new' : 'responded'} /></span>
                    </div>
                    <p className="text-sm text-[#667085] truncate">{enquiry.service ?? 'General'}</p>
                    <p className="text-xs text-[#667085] mt-1">{new Date(enquiry.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="premium-card rounded-2xl overflow-hidden min-h-[420px]">
          {selectedEnquiry ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-[#08A9E0]/10 bg-[#F8FCFE]">
                <h3 className="font-semibold text-[#101B46]">Enquiry Details</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#667085] uppercase tracking-wide">From</label>
                  <p className="text-sm font-medium text-[#101B46] mt-1">{selectedEnquiry.name}</p>
                  <p className="text-sm text-[#667085]">{selectedEnquiry.email}</p>
                  {selectedEnquiry.phone && <p className="text-sm text-[#667085]">{selectedEnquiry.phone}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#667085] uppercase tracking-wide">Service</label>
                  <p className="text-sm font-medium text-[#101B46] mt-1">{selectedEnquiry.service ?? 'General'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#667085] uppercase tracking-wide">Message</label>
                  <p className="text-sm text-[#667085] mt-1 leading-relaxed">{selectedEnquiry.message}</p>
                </div>
                {selectedEnquiry.latestResponse && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <label className="text-xs font-semibold text-green-700 uppercase tracking-wide">Last Response</label>
                    <p className="text-sm text-green-800 mt-1 leading-relaxed">{selectedEnquiry.latestResponse}</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-[#08A9E0]/10 bg-[#F8FCFE]/60">
                <label className="text-xs font-semibold text-[#667085] uppercase tracking-wide mb-2 block">Your Response</label>
                <Textarea
                  placeholder="Type your response here..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                />
                <Button
                  onClick={handleRespond}
                  variant="primary"
                  size="lg"
                  className="w-full mt-3"
                  disabled={!responseText.trim()}
                  loading={submitting}
                >
                  <Reply size={16} className="mr-2" />
                  Send Response
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center">
              <div>
                <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-[#667085]">Select an enquiry to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
