import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface RecentEnquiry {
  id: string
  name: string
  email: string
  service: string | null
  created_at: string
  status: string
}

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalEnquiries, setTotalEnquiries] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: users },
        { count: enquiries },
        { count: pending },
        { data: recent },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('inquiries').select('id, name, email, service, created_at, status').order('created_at', { ascending: false }).limit(5),
      ])
      setTotalUsers(users ?? 0)
      setTotalEnquiries(enquiries ?? 0)
      setPendingCount(pending ?? 0)
      setRecentEnquiries(recent ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const stats = [
    { label: 'Total Users',       value: totalUsers,      icon: Users,          color: 'bg-blue-500' },
    { label: 'Total Enquiries',   value: totalEnquiries,  icon: MessageSquare,  color: 'bg-green-500' },
    { label: 'Pending Responses', value: pendingCount,    icon: MessageSquare,  color: 'bg-yellow-500' },
    { label: 'Responded',         value: totalEnquiries - pendingCount, icon: TrendingUp, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#101B46]">Admin Dashboard</h1>
        <p className="text-sm text-[#667085] mt-0.5">Overview of platform activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="premium-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#101B46]">
              {loading ? '—' : stat.value}
            </h3>
            <p className="text-sm text-[#667085] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/enquiries" className="premium-card rounded-2xl p-6 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#101B46] mb-1">View Enquiries</h3>
              <p className="text-sm text-[#667085]">Manage and respond to customer inquiries</p>
            </div>
            <ArrowRight size={20} className="text-[#667085] group-hover:text-[#08A9E0] transition-colors" />
          </div>
        </Link>
        <Link to="/admin/users" className="premium-card rounded-2xl p-6 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#101B46] mb-1">Manage Users</h3>
              <p className="text-sm text-[#667085]">View all registered users and their details</p>
            </div>
            <ArrowRight size={20} className="text-[#667085] group-hover:text-[#08A9E0] transition-colors" />
          </div>
        </Link>
      </div>

      <div className="premium-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-[#101B46]">Recent Enquiries</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            <p className="p-6 text-sm text-[#667085]">Loading...</p>
          ) : recentEnquiries.length === 0 ? (
            <p className="p-6 text-sm text-[#667085]">No enquiries yet.</p>
          ) : recentEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[#101B46]">{enquiry.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      enquiry.status === 'new' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {enquiry.status === 'new' ? 'pending' : enquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#667085] mt-1">{enquiry.service ?? 'General'}</p>
                  <p className="text-xs text-[#667085] mt-0.5">
                    {enquiry.email} • {new Date(enquiry.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link to="/admin/enquiries" className="text-sm text-[#08A9E0] hover:underline ml-4">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
