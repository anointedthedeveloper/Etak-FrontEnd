import { Link } from 'react-router-dom'
import { Bookmark, ArrowRight, Plane, Hotel, Map } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const bookingTypes = [
  { icon: Plane,  label: 'Flight Booking',    desc: 'Book international and domestic flights', to: '/contact?service=flight',  color: 'bg-blue-50 text-blue-600' },
  { icon: Hotel,  label: 'Hotel Reservation', desc: 'Reserve hotels and accommodations',       to: '/contact?service=hotel',   color: 'bg-purple-50 text-purple-600' },
  { icon: Map,    label: 'Tour Package',       desc: 'Browse and book curated tour packages',  to: '/tours',                   color: 'bg-green-50 text-green-600' },
]

export default function DashboardBookings() {
  return (
    <div className="p-6 xl:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#101B46]">Bookings</h1>
        <p className="text-sm text-[#667085] mt-0.5">Manage your flight, hotel and tour bookings</p>
      </div>

      {/* Empty state with quick start options */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <Bookmark size={26} className="text-gray-300" />
          </div>
          <p className="font-semibold text-[#172033] mb-1">No bookings yet</p>
          <p className="text-sm text-[#667085] max-w-sm">
            Your confirmed bookings will appear here once an inquiry has been processed by the Etak team.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {bookingTypes.map(({ icon: Icon, label, desc, to, color }) => (
            <Link key={label} to={to}>
              <div className="border border-gray-100 rounded-2xl p-5 hover:border-[#08A9E0] hover:shadow-md transition-all cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl ${color.split(' ')[0]} flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color.split(' ')[1]} />
                </div>
                <p className="font-semibold text-[#172033] text-sm mb-1">{label}</p>
                <p className="text-xs text-[#667085] mb-3">{desc}</p>
                <span className="text-xs font-medium text-[#08A9E0] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Get started <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
