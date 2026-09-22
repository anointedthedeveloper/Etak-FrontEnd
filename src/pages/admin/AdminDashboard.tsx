import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, MessageSquare, ArrowRight, CheckCircle2,
  Settings, AlertCircle, Sun, Sunrise, Moon, BarChart2,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { StatusBadge } from '../../components/ui/index'
import { EmptyState, LoadingState } from '../../components/ui/States'

interface RecentEnquiry {
  id: string
  name: string
  email: string
  service: string | null
  created_at: string
  status: string
}

interface DayBucket {
  key: string
  day: string
  date: string
  count: number
  isToday: boolean
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

function buildWeekBuckets(rows: { created_at: string }[]): DayBucket[] {
  const days: DayBucket[] = []
  const today = new Date(); today.setHours(0, 0, 0, 0)
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push({
      key: d.toISOString().slice(0, 10),
      day: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      count: 0,
      isToday: i === 0,
    })
  }
  const byKey = new Map(days.map(d => [d.key, d]))
  for (const row of rows) {
    const key = row.created_at.slice(0, 10)
    const bucket = byKey.get(key)
    if (bucket) bucket.count++
  }
  return days
}

/** Thin, single-hue weekly volume chart — bars grow from one baseline,
    the current day reads in the full accent, the rest in a lighter step. */
function WeeklyTrendChart({ data }: { data: DayBucket[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="premium-card rounded-card p-5 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <BarChart2 size={16} className="text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-[#101B46] text-sm">Enquiry Volume</h3>
            <p className="text-xs text-[#667085]">Last 7 days</p>
          </div>
        </div>
        <p className="text-2xl font-bold text-[#101B46] tabular-nums">{total}</p>
      </div>

      <div className="flex items-end gap-2.5 h-28 mt-5 border-b border-gray-100">
        {data.map(d => (
          <div key={d.key} className="group relative flex-1 flex flex-col items-center h-full justify-end">
            {/* Tooltip */}
            <div
              role="tooltip"
              className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-[#101B46] text-white text-[11px] font-semibold px-2.5 py-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 z-10 shadow-lg"
            >
              {d.count} {d.count === 1 ? 'enquiry' : 'enquiries'}
              <span className="block text-white/60 font-normal">{d.date}</span>
            </div>
            <button
              type="button"
              aria-label={`${d.count} enquiries on ${d.date}`}
              className={`w-full max-w-[28px] rounded-t-[4px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/40 cursor-default ${
                d.isToday ? 'bg-[#08A9E0]' : 'bg-[#08A9E0]/25 group-hover:bg-[#08A9E0]/45'
              }`}
              style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 8 : 2)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2.5 mt-2">
        {data.map(d => (
          <span key={d.key} className={`flex-1 text-center text-[10px] font-medium ${d.isToday ? 'text-[#101B46] font-bold' : 'text-[#667085]'}`}>
            {d.day}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Categorical magnitude breakdown — one hue, ordered by count, matching
    the same bar pattern used on the customer-facing Reports page. */
function ServiceBreakdown({ counts }: { counts: [string, number][] }) {
  const total = counts.reduce((sum, [, c]) => sum + c, 0)

  return (
    <div className="premium-card rounded-card p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
          <MessageSquare size={16} className="text-violet-500" />
        </div>
        <div>
          <h3 className="font-semibold text-[#101B46] text-sm">By Service Type</h3>
          <p className="text-xs text-[#667085]">All-time distribution</p>
        </div>
      </div>

      {counts.length === 0 ? (
        <p className="text-sm text-[#667085] flex-1 flex items-center justify-center">No data yet.</p>
      ) : (
        <div className="flex flex-col gap-3.5 flex-1 justify-center">
          {counts.slice(0, 5).map(([service, count]) => (
            <div key={service}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-[#172033] capitalize">{service}</span>
                <span className="text-[#667085] tabular-nums">{count} · {Math.round((count / total) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#08A9E0] rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((count / total) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
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
  const [weekBuckets, setWeekBuckets] = useState<DayBucket[]>([])
  const [serviceCounts, setServiceCounts] = useState<[string, number][]>([])
  const [loading, setLoading] = useState(true)
  const greeting = getGreeting()

  useEffect(() => {
    async function load() {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      sevenDaysAgo.setHours(0, 0, 0, 0)

      const [
        { count: users },
        { count: enquiries },
        { count: pending },
        { data: recent },
        { data: weekRows },
        { data: allServices },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('inquiries').select('id, name, email, service, created_at, status').order('created_at', { ascending: false }).limit(6),
        supabase.from('inquiries').select('created_at').gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('inquiries').select('service'),
      ])

      setTotalUsers(users ?? 0)
      setTotalEnquiries(enquiries ?? 0)
      setPendingCount(pending ?? 0)
      setRecentEnquiries(recent ?? [])
      setWeekBuckets(buildWeekBuckets(weekRows ?? []))

      const serviceMap: Record<string, number> = {}
      for (const row of allServices ?? []) {
        const key = row.service ?? 'General'
        serviceMap[key] = (serviceMap[key] ?? 0) + 1
      }
      setServiceCounts(Object.entries(serviceMap).sort((a, b) => b[1] - a[1]))

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
      <p className="text-sm text-[#08A9E0] font-medium flex items-center gap-1.5">
        <greeting.Icon size={14} /> {greeting.text}, Admin — here's what's happening today.
      </p>

      {/* Pending alert */}
      {!loading && pendingCount > 0 && (
        <Link
          to="/admin/enquiries"
          className="flex items-center gap-4 rounded-card border border-amber-200 bg-amber-50 px-5 py-4 hover:bg-amber-100/60 transition-colors group"
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
          <div key={stat.label} className="premium-card rounded-card p-5">
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

      {/* Charts */}
      {!loading && totalEnquiries > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeeklyTrendChart data={weekBuckets} />
          <ServiceBreakdown counts={serviceCounts} />
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map(({ to, label, desc, icon: Icon, bg, fg }) => (
          <Link key={to} to={to} className="premium-card rounded-card p-5 group">
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
      <div className="premium-card rounded-card overflow-hidden">
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
            <LoadingState />
          ) : recentEnquiries.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No enquiries yet"
              description="New customer inquiries will appear here."
            />
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
                  <span className="font-medium text-[#101B46] text-sm truncate">
                    {enquiry.name === 'Guest' ? enquiry.email?.split('@')[0] : enquiry.name}
                  </span>
                  <span className="text-xs text-[#667085] capitalize shrink-0">· {enquiry.service ?? 'General'}</span>
                </div>
                <p className="text-xs text-[#667085] truncate mt-0.5">{enquiry.email}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-[#667085] hidden sm:block">{timeAgo(enquiry.created_at)}</span>
                <StatusBadge status={enquiry.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
