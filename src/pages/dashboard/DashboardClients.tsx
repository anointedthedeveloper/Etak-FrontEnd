import { Users } from 'lucide-react'

export default function DashboardClients() {
  return (
    <div className="p-4 sm:p-5 xl:p-7 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#101B46]">Clients</h1>
        <p className="text-sm text-[#667085] mt-0.5">View and manage your travel clients</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <Users size={26} className="text-gray-300" />
        </div>
        <p className="font-semibold text-[#172033] mb-1">No clients yet</p>
        <p className="text-sm text-[#667085] max-w-sm">
          Client records will appear here as you submit inquiries and Etak processes your bookings.
        </p>
      </div>
    </div>
  )
}

