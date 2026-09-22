import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Search, Phone, Calendar, UserCheck, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Avatar from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/index'

interface UserRow {
  id: string
  first_name: string
  last_name: string
  phone: string
  role: string
  created_at: string
  email: string
  avatar_url: string | null
}

export default function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(25)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.rpc('get_users_for_admin')
      if (error) console.error('AdminUsers error:', error)
      setUsers(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = users.filter(u => {
    const name = `${u.first_name ?? ''} ${u.last_name ?? ''}`.toLowerCase()
    return name.includes(searchTerm.toLowerCase()) ||
      (u.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  })
  const visible = filtered.slice(0, visibleCount)

  useEffect(() => { setVisibleCount(25) }, [searchTerm])

  const roleBadgeVariant = (role: string) => role === 'admin' ? 'blue' : role === 'staff' ? 'purple' : 'gray'

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex justify-end">
        <div className="relative w-full sm:w-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2.5 border border-[#08A9E0]/15 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="premium-card rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Users size={16} className="text-blue-500" />
            </div>
            <span className="text-sm text-[#667085]">Total Users</span>
          </div>
          <p className="text-4xl font-bold text-[#101B46] leading-none">{loading ? <span className="text-2xl text-gray-200">—</span> : users.length}</p>
        </div>
        <div className="premium-card rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <UserCheck size={16} className="text-green-500" />
            </div>
            <span className="text-sm text-[#667085]">Matching Search</span>
          </div>
          <p className="text-4xl font-bold text-[#101B46] leading-none">{loading ? <span className="text-2xl text-gray-200">—</span> : filtered.length}</p>
        </div>
      </div>

      <div className="premium-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#08A9E0]/10 flex items-center justify-between">
          <h3 className="font-semibold text-[#101B46]">All Users</h3>
          <span className="rounded-full bg-[#EAF8FD] px-2.5 py-1 text-xs font-bold text-[#087EAF]">{filtered.length}</span>
        </div>
        <p className="sm:hidden px-4 pt-2 text-[11px] text-[#667085]">Swipe left to see more →</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-[#667085]">
                    <div className="flex items-center justify-center">
                      <div className="h-7 w-7 rounded-full border-4 border-gray-100 border-t-[#08A9E0] animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-[#667085]">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Users size={24} className="text-gray-300" />
                    </div>
                    <p className="font-semibold text-[#172033] mb-1">No users found</p>
                    <p className="text-sm text-[#667085]">{searchTerm ? 'Try a different search term.' : 'Registered users will appear here.'}</p>
                  </td>
                </tr>
              ) : visible.map((user) => (
                <tr key={user.id} onClick={() => navigate(`/admin/users/${user.id}`)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        avatarUrl={user.avatar_url ?? undefined}
                        firstName={user.first_name}
                        lastName={user.last_name}
                        size={40}
                      />
                      <div>
                        <p className="font-medium text-[#101B46]">
                          {user.first_name || user.last_name
                            ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
                            : user.email?.split('@')[0] ?? '—'}
                        </p>
                        <p className="text-xs text-[#667085]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.phone ? (
                      <div className="flex items-center gap-2 text-sm text-[#667085]">
                        <Phone size={14} />{user.phone}
                      </div>
                    ) : (
                      <span className="text-sm text-[#667085]">No phone on file</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize inline-block">
                      <Badge variant={roleBadgeVariant(user.role)}>{user.role || 'user'}</Badge>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#667085]">
                      <Calendar size={14} />
                      {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <ChevronRight size={14} className="text-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && visible.length < filtered.length && (
          <div className="p-3 text-center border-t border-gray-100">
            <button
              onClick={() => setVisibleCount(v => v + 25)}
              className="text-xs font-semibold text-[#08A9E0] hover:underline"
            >
              Load more ({filtered.length - visible.length} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
