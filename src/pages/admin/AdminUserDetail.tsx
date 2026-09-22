import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, MessageSquare, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Avatar from '../../components/ui/Avatar'
import { StatusBadge } from '../../components/ui/index'

interface UserDetail {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  avatar_url: string | null
  role: string
  created_at: string
}

interface Enquiry {
  id: string
  service: string | null
  message: string
  status: string
  created_at: string
}

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function load() {
      const { data: users } = await supabase.rpc('get_users_for_admin')
      const found = (users ?? []).find((u: UserDetail) => u.id === id)
      setUser(found ?? null)

      const { data: enqs } = await supabase
        .from('inquiries')
        .select('id, service, message, status, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
      setEnquiries(enqs ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 rounded-full border-4 border-gray-100 border-t-[#08A9E0] animate-spin" />
    </div>
  )

  if (!user) return (
    <div className="text-center py-20 text-[#667085]">User not found.</div>
  )

  return (
    <div className="space-y-6 animate-fade-up">
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-sm text-[#667085] hover:text-[#08A9E0] transition-colors"
      >
        <ArrowLeft size={15} /> Back to Users
      </button>

      {/* Profile card */}
      <div className="premium-card rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <Avatar
            avatarUrl={user.avatar_url ?? undefined}
            firstName={user.first_name}
            lastName={user.last_name}
            size={64}
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-bold text-[#101B46]">
              {user.first_name || user.last_name
                ? `${user.first_name} ${user.last_name}`.trim()
                : user.email.split('@')[0]}
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-[#667085] mt-1">
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Mail size={15} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-[#667085]">Email</p>
              <p className="text-sm font-medium text-[#101B46] truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <Phone size={15} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-[#667085]">Phone</p>
              <p className="text-sm font-medium text-[#101B46]">{user.phone || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <Calendar size={15} className="text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-[#667085]">Joined</p>
              <p className="text-sm font-medium text-[#101B46]">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiries */}
      <div className="premium-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#08A9E0]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-[#08A9E0]" />
            <h3 className="font-semibold text-[#101B46]">Enquiries</h3>
          </div>
          <span className="rounded-full bg-[#EAF8FD] px-2.5 py-1 text-xs font-bold text-[#087EAF]">{enquiries.length}</span>
        </div>
        {enquiries.length === 0 ? (
          <div className="p-10 text-center text-[#667085]">
            <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No enquiries submitted yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {enquiries.map(e => (
              <div
                key={e.id}
                onClick={() => navigate(`/admin/enquiries?id=${e.id}`)}
                className="px-5 py-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#101B46] capitalize text-sm">{e.service ?? 'General'}</span>
                    <StatusBadge status={e.status} />
                  </div>
                  <p className="text-sm text-[#667085] truncate">{e.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <span className="text-xs text-[#667085]">{formatDate(e.created_at)}</span>
                  <ChevronRight size={14} className="text-[#667085]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
