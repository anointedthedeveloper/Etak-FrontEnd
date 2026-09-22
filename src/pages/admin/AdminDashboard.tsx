import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, MessageSquare, TrendingUp, ArrowRight, CheckCircle2,
  Settings, AlertCircle, Sun, Sunrise, Moon,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { StatusBadge } from '../../components/ui/index'

interface RecentEnquiry {
  id: string
  name: string
  email: string
  service: string | null
  created_at: string
  status: string
}

function getGreeting(): { text: string; Icon: React.ElementType } {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good morning',   Icon: Sunrise }
  if (h < 17) return { text: 'Good afternoon', Icon: Sun }
  return             { text: 'Good evening',   Icon: Moon }
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?'
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const quickActions = [
  { to: '/admin/enquiries', label: 'View Enquiries', desc: 'Respond to customer inquiries', icon: MessageSquare, bg: 'bg-blue-50',   fg: 'text-blue-500' },
  { to: '/admin/users',     label: 'Manage Users',    desc: 'View all registered users',   icon: Users,          bg: 'bg-violet-50', fg: 'text-violet-500' },
  { to: '/admin/settings',  label: 'Account Settings',desc: 'Update your admin password',  icon: Settings,       bg: 'bg-orange-50', fg: 'text-orange-500' },
]

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalEnquiries, setTotalEnquiries] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([])
  const [loading, setLoading] = useState(true)
  const greeting = getGreeting()

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
        supabase.from('inquiries').select('id, name, email, service, created_at, status').order('created_at', { ascending: false }).limit(6),
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
    { label: 'Total Users',       value: totalUsers,                       icon: Users,          bg: 'bg-blue-50',   fg: 'text-blue-500' },
    { label: 'Total Enquiries',   value: totalEnquiries,                   icon: MessageSquare,  bg: 'bg-violet-50', fg: 'text-violet-500' },
    { label: 'Pending Responses', value: pendingCount,                     icon: AlertCircle,    bg: 'bg-amber-50',  fg: 'text-amber-500' },
    { label: 'Responded',         value: totalEnquiries - pendingCount,    icon: CheckCircle2,   bg: 'bg-green-50',  fg: 'text-green-500' },
  ]

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Greeting */}
      <div>
        <p className="text-sm text-[#08A9E0] font-medium flex items-center gap-1.5 mb-1">
          <greeting.Icon size={14} /> {greeting.text}, Admin
        </p>
        <h1 className="font-display text-2xl font-bold text-[#101B46]">Overview</h1>
        <p className="text-sm text-[#667085] mt-0.5">Here's what's happening across the platform today.</p>
      </div>

      {/* Pending alert */}
      {!loading && pendingCount > 0 && (
        <Link
          to="/admin/enquiries"
          className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 hover:bg-amber-100/60 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertCircle size={18} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">
              {pendingCount} enquir{pendingCount === 1 ? 'y' : 'ies'} awaiting a response
            </p>
            <p className="text-xs text-amber-700/80 mt-0.5">Clients are waiting — respond to keep response times low.</p>
          </div>
          <ArrowRight size={16} className="text-amber-600 group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="premium-card rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon size={16} className={stat.fg} />
              </div>
              <span className="text-sm text-[#667085] leading-tight">{stat.label}</span>
            </div>
            <p className="text-4xl font-bold text-[#101B46] leading-none">
              {loading ? <span className="text-2xl text-gray-200">—</span> : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map(({ to, label, desc, icon: Icon, bg, fg }) => (
          <Link key={to} to={to} className="premium-card rounded-2xl p-5 group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={18} className={fg} />
              </div>
              <ArrowRight size={15} className="text-gray-300 group-hover:text-[#08A9E0] group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-[#101B46] text-sm mb-0.5">{label}</h3>
            <p className="text-xs text-[#667085]">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent enquiries */}
      <div className="premium-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-[#101B46]">Recent Enquiries</h3>
            <p className="text-xs text-[#667085] mt-0.5">Latest submissions across all clients</p>
          </div>
          <Link to="/admin/enquiries" className="text-xs font-semibold text-[#08A9E0] hover:underline flex items-center gap-1 whitespace-nowrap">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-7 w-7 rounded-full border-4 border-gray-100 border-t-[#08A9E0] animate-spin" />
            </div>
          ) : recentEnquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-gray-300" />
              </div>
              <p className="font-semibold text-[#172033] mb-1">No enquiries yet</p>
              <p className="text-sm text-[#667085]">New customer inquiries will appear here.</p>
            </div>
          ) : recentEnquiries.map((enquiry) => (
            <Link
              key={enquiry.id}
              to="/admin/enquiries"
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/70 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-[#EAF8FD] text-[#087EAF] flex items-center justify-center text-xs font-bold shrink-0">
                {initials(enquiry.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#101B46] text-sm truncate">{enquiry.name}</span>
                  <span className="text-xs text-[#667085] capitalize shrink-0">· {enquiry.service ?? 'General'}</span>
                </div>
                <p className="text-xs text-[#667085] truncate mt-0.5">{enquiry.email}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-[#667085] hidden sm:block">{timeAgo(enquiry.created_at)}</span>
                <StatusBadge status={enquiry.status === 'new' ? 'new' : 'responded'} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trend footer note */}
      {!loading && totalEnquiries > 0 && (
        <div className="flex items-center gap-2 text-xs text-[#667085] px-1">
          <TrendingUp size={13} className="text-green-500" />
          {Math.round(((totalEnquiries - pendingCount) / totalEnquiries) * 100)}% of all enquiries have been responded to
        </div>
      )}
    </div>
  )
}
