import { useEffect, useState } from 'react'
import { Users, Search, Mail, Phone, Calendar, UserCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Avatar from '../../components/ui/Avatar'

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
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.rpc('get_users_for_admin')
      if (error) console.error('get_users_for_admin error:', error)
      setUsers(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = users.filter(u => {
    const name = `${u.first_name} ${u.last_name}`.toLowerCase()
    return name.includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  })

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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-[#667085]">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[#667085]">
                    <Users size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>No users found</p>
                  </td>
                </tr>
              ) : filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        avatarUrl={user.avatar_url ?? undefined}
                        firstName={user.first_name}
                        lastName={user.last_name}
                        size={40}
                      />
                      <div>
                        <p className="font-medium text-[#101B46]">{user.first_name} {user.last_name}</p>
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
                      <div className="flex items-center gap-2 text-sm text-[#667085]">
                        <Mail size={14} />—
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      user.role === 'admin' ? 'bg-[#EAF8FD] text-[#087EAF]' : 'bg-gray-100 text-[#667085]'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#667085]">
                      <Calendar size={14} />
                      {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
