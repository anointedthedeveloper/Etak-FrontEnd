import { Link } from 'react-router-dom'
import { Bookmark, ArrowRight, Plane, Hotel, Map } from 'lucide-react'
import { EmptyState } from '../../components/ui/States'

const bookingTypes = [
  { icon: Plane,  label: 'Flight Booking',    desc: 'Book international and domestic flights', to: '/contact?service=flight',  color: 'bg-blue-50 text-blue-600' },
  { icon: Hotel,  label: 'Hotel Reservation', desc: 'Reserve hotels and accommodations',       to: '/contact?service=hotel',   color: 'bg-purple-50 text-purple-600' },
  { icon: Map,    label: 'Tour Package',       desc: 'Browse and book curated tour packages',  to: '/tours',                   color: 'bg-green-50 text-green-600' },
]

export default function DashboardBookings() {
  return (
    <div className="p-4 sm:p-5 xl:p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#101B46]">Bookings</h1>
        <p className="text-sm text-[#667085] mt-0.5">Manage your flight, hotel and tour bookings</p>
      </div>

      {/* Empty state with quick start options */}
      <div className="card-surface p-4 sm:p-5 xl:p-8">
        <EmptyState
          icon={Bookmark}
          title="No bookings yet"
          description="Your confirmed bookings will appear here once an inquiry has been processed by the Etak team."
          action={
            <div className="grid sm:grid-cols-3 gap-4 w-full mt-2">
              {bookingTypes.map(({ icon: Icon, label, desc, to, color }) => (
                <Link key={label} to={to}>
                  <div className="border border-line rounded-card p-5 hover:border-[#08A9E0] hover:shadow-card transition-all cursor-pointer group">
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
          }
        />
      </div>
    </div>
  )
}

