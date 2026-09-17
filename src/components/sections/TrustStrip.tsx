import { Plane, Building2, Map, FileCheck, Shield, Navigation } from 'lucide-react'
import { SectionHeader } from '../ui/index'

const trustItems = [
  { icon: Plane, label: 'Flight Booking & Ticketing' },
  { icon: Building2, label: 'Hotel Reservations' },
  { icon: Map, label: 'Tour Packages' },
  { icon: FileCheck, label: 'Visa Assistance' },
  { icon: Shield, label: 'Travel Insurance' },
  { icon: Navigation, label: 'Airport Logistics' },
]

export default function TrustStrip() {
  return (
    <section id="trust" className="py-10 sm:py-12 bg-white border-b border-gray-100">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="text-center mb-8">
          <SectionHeader
            eyebrow="Professional Travel Management"
            title=""
            centered
          />
          <p className="text-[#667085] text-sm -mt-8">Etak Travels & Tours Expert Limited — CAC Registered (RC 898792) — Abuja, Nigeria</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EAF8FD] transition-colors duration-150">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Icon size={18} className="text-[#08A9E0]" />
              </div>
              <span className="text-xs font-medium text-[#172033] text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
