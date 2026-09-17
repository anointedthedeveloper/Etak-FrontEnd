import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plane, Hotel, Map, Users, ArrowRight,
  FileSearch, CheckCircle2, CalendarCheck,
  Sun, Sunrise, Moon, Pencil, FileText, Zap,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/index'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface Inquiry {
  id: string
  service: string | null
  status: string
  created_at: string
  message: string
}

const quickActions = [
  { label: 'Flight booking',    icon: Plane,  to: '/contact?service=flight', bg: 'bg-blue-50',   fg: 'text-blue-500'   },
  { label: 'Hotel reservation', icon: Hotel,  to: '/contact?service=hotel',  bg: 'bg-violet-50', fg: 'text-violet-500' },
  { label: 'Tour packages',     icon: Map,    to: '/dashboard/tours',        bg: 'bg-green-50',  fg: 'text-green-500'  },
  { label: 'Client management', icon: Users,  to: '/dashboard/clients',      bg: 'bg-orange-50', fg: 'text-orange-500' },
]

function getGreeting(): { text: string; Icon: React.ElementType } {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good morning',   Icon: Sunrise }
  if (h < 17) return { text: 'Good afternoon', Icon: Sun }
  return             { text: 'Good evening',   Icon: Moon }
}

export default function Dashboard() {
  const { user } = useAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const greeting = getGreeting()

  useEffect(() => {
    if (!user) return
    supabase
      .from('inquiries')
      .select('id, service, status, created_at, message')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (!error && data) setInquiries(data)
        setLoading(false)
      })
  }, [user])

  const total    = inquiries.length
  const active   = inquiries.filter(i => ['new', 'in_progress'].includes(i.status)).length
  const resolved = inquiries.filter(i => i.status === 'resolved').length

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  const shortId = (uuid: string) => `ETK-${uuid.slice(0, 6).toUpperCase()}`

  const stats = [
    { label: 'Total Inquiries', value: total,    icon: FileText,      bg: 'bg-blue-50',   fg: 'text-blue-500'   },
    { label: 'Active Bookings', value: active,   icon: Plane,         bg: 'bg-green-50',  fg: 'text-green-500'  },
    { label: 'Resolved',        value: resolved, icon: CheckCircle2,  bg: 'bg-violet-50', fg: 'text-violet-500' },
  ]

  return (
    <div className="p-4 sm:p-5 xl:p-6 min-h-full bg-[#F8FAFC]">
      <div className="grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_296px] gap-5 items-start">

        {/* ─── LEFT ─── */}
        <div className="space-y-5 min-w-0">

          {/* Hero banner — matches screenshot */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#101B46] via-[#1e3a8a] to-[#2d5be3] h-[200px] flex items-center">
            {/* subtle texture */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")" }}
            />
            {/* plane image on the right */}
            <div className="absolute right-0 top-0 h-full w-48 lg:w-64 xl:w-72 hidden md:block pointer-events-none overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=600&auto=format&fit=crop&crop=center"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a] to-transparent" />
            </div>

            {/* text */}
            <div className="relative z-10 px-7 py-6 max-w-md">
              <p className="text-blue-300 text-sm mb-1 flex items-center gap-1.5 font-medium">
                <greeting.Icon size={14} />
                {greeting.text}, {user?.firstName}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-1.5 leading-tight">
                Welcome back, Traveller
              </h1>
              <p className="text-blue-200 text-sm mb-4">
                Manage your inquiries, bookings and clients all in one place.
              </p>
              <p className="flex items-center gap-1.5 text-blue-300 text-xs font-semibold tracking-wider">
                <Plane size={12} />
                Explore • Book • Travel
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(({ label, value, icon: Icon, bg, fg }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={fg} />
                  </div>
                  <span className="text-sm text-[#667085] leading-tight">{label}</span>
                </div>
                <p className="text-5xl font-bold text-[#101B46] leading-none mb-2">
                  {loading ? <span className="text-3xl text-gray-200">—</span> : value}
                </p>
                <p className="text-xs flex items-center gap-1">
                  <span className="text-green-500 font-semibold">↑ 0%</span>
                  <span className="text-[#667085]">vs. last 7 days</span>
                </p>
              </div>
            ))}
          </div>

          {/* Inquiries */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <div>
                <h2 className="font-semibold text-[#172033]">My inquiries</h2>
                <p className="text-xs text-[#667085] mt-0.5">Track and manage all your customer inquiries.</p>
              </div>
              <Link to="/dashboard/inquiries"
                className="text-xs font-semibold text-[#08A9E0] hover:underline flex items-center gap-1 whitespace-nowrap">
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-7 w-7 rounded-full border-4 border-gray-100 border-t-[#08A9E0] animate-spin" />
              </div>
            ) : inquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                  <FileSearch size={24} className="text-gray-300" />
                </div>
                <p className="font-semibold text-[#172033] mb-1">No inquiries yet.</p>
                <p className="text-sm text-[#667085] mb-5">
                  When a customer makes an inquiry, it will appear here.
                </p>
                <Link to="/contact">
                  <Button variant="primary" size="md">
                    <Plane size={14} /> Submit your first inquiry
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-gray-100 bg-gray-50/50">
                      {['ID', 'Service', 'Date', 'Status'].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {inquiries.map(inq => (
                      <tr key={inq.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3.5 font-mono text-xs text-[#08A9E0] font-semibold">{shortId(inq.id)}</td>
                        <td className="px-6 py-3.5 font-medium text-[#172033] capitalize">{inq.service ?? 'General'}</td>
                        <td className="px-6 py-3.5 text-[#667085] text-xs">{formatDate(inq.created_at)}</td>
                        <td className="px-6 py-3.5"><StatusBadge status={inq.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT SIDEBAR ─── */}
        <div className="space-y-4 lg:sticky lg:top-0">

          {/* Request new service button */}
          <Link to="/contact">
            <Button variant="primary" size="lg" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Plane size={16} /> Request a new service
              </span>
              <ArrowRight size={15} />
            </Button>
          </Link>

          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#08A9E0] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {`${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#172033] truncate">{user?.email}</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 size={11} /> Verified
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#667085] mb-4">
              <CalendarCheck size={12} />
              Member since {user?.createdAt ? formatDate(user.createdAt) : '—'}
            </div>
            <Link to="/dashboard/profile">
              <Button variant="outline" size="sm" className="w-full">
                <Pencil size={13} /> Edit profile
              </Button>
            </Link>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={15} className="text-[#08A9E0]" />
              <h3 className="font-bold text-[#101B46] text-sm">Quick actions</h3>
            </div>
            <div className="space-y-1">
              {quickActions.map(({ label, icon: Icon, to, bg, fg }) => (
                <Link key={label} to={to}>
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                        <Icon size={13} className={fg} />
                      </div>
                      <span className="text-sm text-[#172033]">{label}</span>
                    </div>
                    <ArrowRight size={13} className="text-gray-300 group-hover:text-[#08A9E0] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Travel CTA card */}
          <div className="relative rounded-2xl overflow-hidden h-48">
            <img
              src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&auto=format&fit=crop"
              alt="Travel"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101B46]/95 via-[#101B46]/60 to-transparent" />
            <div className="relative z-10 p-5 h-full flex flex-col justify-end">
              <p className="text-[#08A9E0] text-xs font-bold uppercase tracking-widest mb-1">Explore the world</p>
              <p className="font-display text-white font-bold text-base leading-snug mb-3">
                Your next adventure<br />is just a click away
              </p>
              <Link to="/tours">
                <Button variant="white" size="sm">
                  Browse Packages <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
