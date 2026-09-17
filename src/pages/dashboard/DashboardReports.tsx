import { useEffect, useState } from 'react'
import { BarChart2, TrendingUp, FileSearch, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface Inquiry { id: string; status: string; service: string | null; created_at: string }

export default function DashboardReports() {
  const { user } = useAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('inquiries')
      .select('id, status, service, created_at')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) setInquiries(data)
        setLoading(false)
      })
  }, [user])

  const total    = inquiries.length
  const active   = inquiries.filter(i => ['new', 'in_progress'].includes(i.status)).length
  const resolved = inquiries.filter(i => i.status === 'resolved').length

  // Service breakdown
  const serviceMap: Record<string, number> = {}
  inquiries.forEach(i => {
    const key = i.service ?? 'General'
    serviceMap[key] = (serviceMap[key] ?? 0) + 1
  })
  const serviceBreakdown = Object.entries(serviceMap).sort((a, b) => b[1] - a[1])

  const stats = [
    { label: 'Total Inquiries', value: total,    icon: FileSearch,  color: 'text-blue-500',   bg: 'bg-blue-50' },
    { label: 'Active',          value: active,   icon: TrendingUp,  color: 'text-green-500',  bg: 'bg-green-50' },
    { label: 'Resolved',        value: resolved, icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  return (
    <div className="p-6 xl:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#101B46]">Reports</h1>
        <p className="text-sm text-[#667085] mt-0.5">Overview of your travel activity</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-4 border-gray-100 border-t-[#08A9E0] animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon size={17} className={color} />
                  </div>
                  <span className="text-sm text-[#667085]">{label}</span>
                </div>
                <p className="text-4xl font-bold text-[#101B46]">{value}</p>
              </div>
            ))}
          </div>

          {/* Service breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 size={18} className="text-[#08A9E0]" />
              <h2 className="font-display font-bold text-[#101B46] text-lg">By service type</h2>
            </div>
            {serviceBreakdown.length === 0 ? (
              <p className="text-sm text-[#667085]">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {serviceBreakdown.map(([service, count]) => (
                  <div key={service}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-[#172033] capitalize">{service}</span>
                      <span className="text-[#667085]">{count} {count === 1 ? 'inquiry' : 'inquiries'}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#08A9E0] rounded-full"
                        style={{ width: `${Math.round((count / total) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
