import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileSearch, ArrowRight, Filter } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/index'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface Inquiry {
  id: string
  service: string | null
  status: string
  message: string
  created_at: string
  name: string
  email: string
  phone: string | null
}

const statusFilters = ['all', 'new', 'in_progress', 'resolved']

export default function DashboardInquiries() {
  const { user } = useAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) return
    supabase
      .from('inquiries')
      .select('id, service, status, message, created_at, name, email, phone')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setInquiries(data)
        setLoading(false)
      })
  }, [user])

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  const shortId = (uuid: string) => `ETK-${uuid.slice(0, 6).toUpperCase()}`

  return (
    <div className="p-6 xl:p-8 space-y-6">
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
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer ${
              filter === s ? 'bg-[#101B46] text-white' : 'bg-gray-100 text-[#667085] hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
              <Link to="/contact">
                <Button variant="primary" size="sm">Submit an inquiry</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wide">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wide">Service</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wide hidden md:table-cell">Message</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wide">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(inq => (
                  <tr key={inq.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-[#08A9E0] font-semibold whitespace-nowrap">{shortId(inq.id)}</td>
                    <td className="px-6 py-4 font-medium text-[#172033] capitalize whitespace-nowrap">{inq.service ?? 'General'}</td>
                    <td className="px-6 py-4 text-[#667085] max-w-xs truncate hidden md:table-cell">{inq.message}</td>
                    <td className="px-6 py-4 text-[#667085] whitespace-nowrap">{formatDate(inq.created_at)}</td>
                    <td className="px-6 py-4"><StatusBadge status={inq.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
