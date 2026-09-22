import { useEffect, useState } from 'react'
import { Bell, MessageSquare, CheckCheck, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { EmptyState, LoadingState, ErrorState } from '../../components/ui/States'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface Notification {
  id: string
  title: string
  body: string
  inquiry_id: string
  read: boolean
  created_at: string
}

export default function DashboardNotifications() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (!user) return
    async function load() {
      const { data: inquiries, error: inquiriesError } = await supabase
        .from('inquiries')
        .select('id, service')
        .eq('user_id', user!.id)

      if (inquiriesError) { setLoadError(true); setLoading(false); return }
      if (!inquiries?.length) { setLoading(false); return }

      const ids = inquiries.map(i => i.id)
      const serviceMap = Object.fromEntries(inquiries.map(i => [i.id, i.service ?? 'General']))

      const { data: replies, error: repliesError } = await supabase
        .from('inquiry_responses')
        .select('id, inquiry_id, message, created_at')
        .in('inquiry_id', ids)
        .eq('is_admin', true)
        .order('created_at', { ascending: false })

      if (repliesError) { setLoadError(true); setLoading(false); return }

      setNotifications((replies ?? []).map(r => ({
        id: r.id,
        title: `Reply on your ${serviceMap[r.inquiry_id]} enquiry`,
        body: `"${r.message.slice(0, 80)}${r.message.length > 80 ? '…' : ''}"`,
        inquiry_id: r.inquiry_id,
        read: false,
        created_at: r.created_at,
      })))
      setLoading(false)
    }
    load()
  }, [user])

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const markAllRead = () => setReadIds(new Set(notifications.map(n => n.id)))
  const clearAll = () => setNotifications([])
  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length

  return (
    <div className="p-4 sm:p-5 xl:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#101B46]">Notifications</h1>
          <p className="text-sm text-[#667085] mt-0.5">{unreadCount} unread · {notifications.length} total</p>
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs text-[#08A9E0] hover:underline">
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            <button onClick={clearAll} className="flex items-center gap-1.5 text-xs text-red-500 hover:underline">
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        )}
      </div>

      <div className="card-surface overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : loadError ? (
          <div className="p-6">
            <ErrorState message="Couldn't load your notifications. Please try again shortly." />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="You'll be notified when Etak Travels replies to your enquiries."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(n => {
              const isRead = readIds.has(n.id)
              return (
                <div
                  key={n.id}
                  onClick={() => {
                    setReadIds(prev => new Set([...prev, n.id]))
                    navigate('/dashboard/inquiries')
                  }}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${!isRead ? 'bg-[#F0F9FE]' : ''}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <MessageSquare size={16} className="text-[#08A9E0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#101B46] capitalize">{n.title}</p>
                      <span className="text-xs text-[#667085] shrink-0">{formatDate(n.created_at)}</span>
                    </div>
                    <p className="text-sm text-[#667085] mt-0.5">{n.body}</p>
                  </div>
                  {!isRead && <span className="w-2 h-2 rounded-full bg-[#08A9E0] shrink-0 mt-1.5" />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
