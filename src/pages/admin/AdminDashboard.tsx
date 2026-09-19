import { Link } from 'react-router-dom'
import { Users, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  // Mock data - in production, this would come from the backend
  const stats = [
    { label: 'Total Users', value: '156', icon: Users, color: 'bg-blue-500', change: '+12%' },
    { label: 'Total Enquiries', value: '89', icon: MessageSquare, color: 'bg-green-500', change: '+8%' },
    { label: 'Pending Responses', value: '23', icon: MessageSquare, color: 'bg-yellow-500', change: '-5%' },
    { label: 'Growth Rate', value: '+18%', icon: TrendingUp, color: 'bg-purple-500', change: '+3%' },
  ]

  const recentEnquiries = [
    { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Flight Booking', date: '2 hours ago', status: 'pending' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', subject: 'Tour Package', date: '5 hours ago', status: 'pending' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', subject: 'Visa Assistance', date: '1 day ago', status: 'responded' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', subject: 'Hotel Reservation', date: '2 days ago', status: 'responded' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#101B46]">Admin Dashboard</h1>
        <p className="text-sm text-[#667085] mt-0.5">Overview of platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#101B46]">{stat.value}</h3>
            <p className="text-sm text-[#667085] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/enquiries"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-[#08A9E0] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#101B46] mb-1">View Enquiries</h3>
              <p className="text-sm text-[#667085]">Manage and respond to customer inquiries</p>
            </div>
            <ArrowRight size={20} className="text-[#667085] group-hover:text-[#08A9E0] transition-colors" />
          </div>
        </Link>
        <Link
          to="/admin/users"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-[#08A9E0] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#101B46] mb-1">Manage Users</h3>
              <p className="text-sm text-[#667085]">View all registered users and their details</p>
            </div>
            <ArrowRight size={20} className="text-[#667085] group-hover:text-[#08A9E0] transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Enquiries */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-[#101B46]">Recent Enquiries</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recentEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[#101B46]">{enquiry.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#667085] mt-1">{enquiry.subject}</p>
                  <p className="text-xs text-[#667085] mt-0.5">{enquiry.email} • {enquiry.date}</p>
                </div>
                <Link
                  to="/admin/enquiries"
                  className="text-sm text-[#08A9E0] hover:underline ml-4"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
