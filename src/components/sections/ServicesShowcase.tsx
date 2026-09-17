import { Plane, Building2, Map, MessageSquare, FileCheck, Shield, Navigation, Headphones, Sunset, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { services } from '../../data/services'
import { SectionHeader, ImageSlot } from '../ui/index'
import { Button } from '../ui/Button'

const iconMap: Record<string, React.ElementType> = {
  Plane, Building2, Map, MessageSquare, FileCheck, Shield, Navigation,
  HeadphonesIcon: Headphones, Sunset, Briefcase,
}

export default function ServicesShowcase() {
  const [active, setActive] = useState(services[0].id)
  const activeService = services.find(s => s.id === active) ?? services[0]
  const Icon = iconMap[activeService.icon] ?? Plane

  return (
    <section className="py-20 bg-white">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <SectionHeader
          eyebrow="What We Offer"
          title="Travel Services Designed Around You"
          subtitle="From flight bookings to visa assistance, we handle every aspect of your journey with care and professionalism."
        />

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Service list */}
          <div className="lg:col-span-2 flex flex-col gap-1">
            {services.map(service => {
              const SIcon = iconMap[service.icon] ?? Plane
              return (
                <button
                  key={service.id}
                  onClick={() => setActive(service.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                    active === service.id
                      ? 'bg-[#101B46] text-white shadow-md'
                      : 'hover:bg-gray-50 text-[#172033]'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    active === service.id ? 'bg-[#08A9E0]' : 'bg-[#EAF8FD]'
                  }`}>
                    <SIcon size={17} className={active === service.id ? 'text-white' : 'text-[#08A9E0]'} />
                  </div>
                  <span className="text-sm font-medium">{service.title}</span>
                </button>
              )
            })}
          </div>

          {/* Active service detail */}
          <div className="lg:col-span-3 bg-gradient-to-br from-[#EAF8FD] to-white rounded-2xl p-8 flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#101B46] flex items-center justify-center shrink-0">
                <Icon size={26} className="text-[#08A9E0]" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-[#101B46] mb-2">{activeService.title}</h3>
                <p className="text-[#667085] leading-relaxed">{activeService.description}</p>
              </div>
            </div>

            <ImageSlot
              src={activeService.image}
              alt={activeService.title}
              className="w-full h-48 rounded-xl object-cover"
              label={`${activeService.title} — image coming soon`}
            />

            <div>
              <h4 className="text-sm font-semibold text-[#101B46] mb-3">What's included</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeService.benefits.map(b => (
                  <li key={b} className="flex items-center gap-2 text-sm text-[#172033]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#08A9E0] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <Link to={`/services#${activeService.id}`}>
              <Button variant="primary">Request This Service</Button>
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/services">
            <Button variant="outline">View All Services</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
