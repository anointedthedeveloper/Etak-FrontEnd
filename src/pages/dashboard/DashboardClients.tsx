import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { History, Plane, Building2, Map, HelpCircle, ArrowRight, MapPin, Calendar, Users } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/index'
import { EmptyState, LoadingState } from '../../components/ui/States'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface Inquiry {
  id: string
  service: string | null
  status: string
  message: string
  created_at: string
  details: Record<string, unknown> | null
}

const serviceIcon = (service: string | null) => {
  switch (service) {
    case 'flight':     return Plane
    case 'hotel':      return Building2
    case 'tour':       return Map
    default:           return HelpCircle
  }
}

const serviceColor = (service: string | null) => {
  switch (service) {
    case 'flight':  return 'bg-blue-50 text-blue-600'
    case 'hotel':   return 'bg-amber-50 text-amber-600'
    case 'tour':    return 'bg-green-50 text-green-600'
    default:        return 'bg-gray-100 text-[#667085]'
  }
}

function TripSummary({ details, service }: { details: Record<string, unknown> | null; service: string | null }) {
  if (!details) return null
  const items: { icon: typeof MapPin; text: string }[] = []

  if (service === 'flight') {
    if (details.from && details.to) items.push({ icon: MapPin, text: `${details.from} → ${details.to}` })
    if (details.departure) items.push({ icon: Calendar, text: String(details.departure) })
    const t = details.travellers as Record<string, unknown> | undefined
    if (t?.adults) items.push({ icon: Users, text: `${t.adults} adult${Number(t.adults) > 1 ? 's' : ''}${t.class ? ` · ${t.class}` : ''}` })
  } else if (service === 'hotel') {
    if (details.destination) items.push({ icon: MapPin, text: String(details.destination) })
    if (details.checkIn) items.push({ icon: Calendar, text: `${details.checkIn}${details.checkOut ? ` – ${details.checkOut}` : ''}` })
    if (details.rooms) items.push({ icon: Building2, text: `${details.rooms} room(s)` })
  } else if (service === 'tour') {
    if (details.destination) items.push({ icon: MapPin, text: String(details.destination) })
    if (details.travelDate) items.push({ icon: Calendar, text: String(details.travelDate) })
    if (details.duration) items.push({ icon: History, text: String(details.duration) })
  }

  if (!items.length) return null
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
      {items.map(({ icon: Icon, text }, i) => (
        <span key={i} className="flex items-center gap-1 text-xs text-[#667085]">
          <Icon size={11} className="shrink-0" /> {text}
        </span>
      ))}
    </div>
  )
}

export default function DashboardClients() {
  const { user } = useAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('inquiries')
      .select('id, service, status, message, created_at, details')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setInquiries(data ?? []); setLoading(false) })
  }, [user])

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const shortId = (uuid: string) => `ETK-${uuid.slice(0, 6).toUpperCase()}`

  // Group by year/month
  const grouped = inquiries.reduce<Record<string, Inquiry[]>>((acc, inq) => {
    const key = new Date(inq.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    ;(acc[key] ??= []).push(inq)
    return acc
  }, {})

  return (
    <div className="p-4 sm:p-5 xl:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#101B46]">Travel History</h1>
          <p className="text-sm text-[#667085] mt-0.5">All your past and ongoing travel inquiries</p>
        </div>
        <Link to="/contact">
          <Button variant="primary" size="sm">New inquiry <ArrowRight size={14} /></Button>
        </Link>
      </div>

      {loading ? <LoadingState /> : inquiries.length === 0 ? (
        <div className="card-surface p-6">
          <EmptyState
            icon={History}
            title="No travel history yet"
            description="Your submitted inquiries will appear here as a timeline of your travel journey with Etak."
            action={<Link to="/contact"><Button variant="primary" size="sm">Submit an inquiry</Button></Link>}
          />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month}>
              <p className="text-xs font-bold text-[#667085] uppercase tracking-widest mb-3 px-1">{month}</p>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
                <div className="space-y-3">
                  {items.map(inq => {
                    const Icon = serviceIcon(inq.service)
                    const color = serviceColor(inq.service)
                    return (
                      <Link
                        key={inq.id}
                        to={`/dashboard/inquiries`}
                        className="flex gap-4 group"
                      >
                        {/* Icon dot on timeline */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white shadow-sm ${color}`}>
                          <Icon size={16} />
                        </div>
                        {/* Card */}
                        <div className="flex-1 card-surface p-4 rounded-xl group-hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-[#101B46] capitalize text-sm">
                                  {inq.service ?? 'General'} Inquiry
                                </span>
                                <span className="font-mono text-[10px] text-[#08A9E0] bg-[#EAF8FD] px-1.5 py-0.5 rounded">
                                  {shortId(inq.id)}
                                </span>
                              </div>
                              <TripSummary details={inq.details} service={inq.service} />
                              <p className="text-xs text-[#667085] mt-1.5 line-clamp-1">{inq.message}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <StatusBadge status={inq.status} />
                              <span className="text-[10px] text-[#98A2B3]">{formatDate(inq.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
