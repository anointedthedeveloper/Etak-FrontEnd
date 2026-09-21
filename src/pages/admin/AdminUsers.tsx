import { useState } from 'react'
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react'

export default function AdminUsers() {
  const [users] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+234 803 206 2242', joinDate: '2024-01-15', status: 'active' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '+234 817 358 8783', joinDate: '2024-02-20', status: 'active' },
    { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', phone: '+234 803 206 2242', joinDate: '2024-03-10', status: 'active' },
    { id: 4, firstName: 'Sarah', lastName: 'Williams', email: 'sarah@example.com', phone: '+234 817 358 8783', joinDate: '2024-04-05', status: 'active' },
    { id: 5, firstName: 'David', lastName: 'Brown', email: 'david@example.com', phone: '+234 803 206 2242', joinDate: '2024-05-12', status: 'active' },
    { id: 6, firstName: 'Emily', lastName: 'Davis', email: 'emily@example.com', phone: '+234 817 358 8783', joinDate: '2024-06-18', status: 'active' },
    { id: 7, firstName: 'James', lastName: 'Wilson', email: 'james@example.com', phone: '+234 803 206 2242', joinDate: '2024-07-22', status: 'active' },
    { id: 8, firstName: 'Olivia', lastName: 'Taylor', email: 'olivia@example.com', phone: '+234 817 358 8783', joinDate: '2024-08-30', status: 'active' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#101B46]">Users</h1>
          <p className="text-sm text-[#667085] mt-0.5">View and manage all registered users</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#101B46]">{totalUsers}</h3>
          <p className="text-sm text-[#667085] mt-1">Total Users</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#101B46]">{activeUsers}</h3>
          <p className="text-sm text-[#667085] mt-1">Active Users</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-[#101B46]">All Users ({filteredUsers.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[#667085]">
                    <Users size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EAF8FD] flex items-center justify-center text-[#08A9E0] font-semibold">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-[#101B46]">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-[#667085]">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-[#667085]">
                          <Mail size={14} />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#667085]">
                          <Phone size={14} />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#667085]">
                        <Calendar size={14} />
                        {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.status === 'active' ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        )}
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
