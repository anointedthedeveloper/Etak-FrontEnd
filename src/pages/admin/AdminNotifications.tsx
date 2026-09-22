import { useEffect, useState } from 'react'
import { Bell, MessageSquare, User, CheckCheck, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { EmptyState, LoadingState } from '../../components/ui/States'

interface Notification {
  id: string
  type: 'new_enquiry' | 'client_reply'
  title: string
  body: string
  inquiry_id: string
  read: boolean
  created_at: string
}

export default function AdminNotifications() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data: newEnqs } = await supabase
      .from('inquiries')
      .select('id, name, service, created_at')
      .eq('status', 'new')
      .order('created_at', { ascending: false })

    const { data: replies } = await supabase
      .from('inquiry_responses')
      .select('id, inquiry_id, message, created_at, inquiries(name)')
      .eq('is_admin', false)
      .order('created_at', { ascending: false })
      .limit(50)

    const items: Notification[] = [
      ...(newEnqs ?? []).map(e => ({
        id: `enq-${e.id}`,
        type: 'new_enquiry' as const,
        title: 'New Enquiry',
        body: `${e.name} submitted a ${e.service ?? 'general'} enquiry`,
        inquiry_id: e.id,
        read: false,
        created_at: e.created_at,
      })),
      ...(replies ?? []).map((r: any) => ({
        id: `reply-${r.id}`,
        type: 'client_reply' as const,
        title: 'Client Reply',
        body: `${r.inquiries?.name ?? 'A client'} replied: "${r.message.slice(0, 60)}${r.message.length > 60 ? '…' : ''}"`,
        inquiry_id: r.inquiry_id,
        read: false,
        created_at: r.created_at,
      })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setNotifications(items)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

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
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-[#101B46]">Notifications</h2>
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

      <div className="premium-card rounded-card overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="New enquiries and client replies will show up here."
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
                    navigate(`/admin/enquiries?id=${n.inquiry_id}`)
                  }}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${!isRead ? 'bg-[#F0F9FE]' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'new_enquiry' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                    {n.type === 'new_enquiry'
                      ? <MessageSquare size={16} className="text-[#08A9E0]" />
                      : <User size={16} className="text-purple-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#101B46]">{n.title}</p>
                      <span className="text-xs text-[#667085] shrink-0">{formatDate(n.created_at)}</span>
                    </div>
                    <p className="text-sm text-[#667085] mt-0.5 truncate">{n.body}</p>
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
