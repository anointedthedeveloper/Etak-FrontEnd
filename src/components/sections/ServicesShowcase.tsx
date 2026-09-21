import { Plane, Building2, Map, MessageSquare, FileCheck, Shield, Navigation, Headphones, Sunset, Briefcase, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { services } from '../../data/services'
import { SectionHeader } from '../ui/index'
import { Button } from '../ui/Button'
import { useInView } from '../../hooks/useInView'

const iconMap: Record<string, React.ElementType> = {
  Plane, Building2, Map, MessageSquare, FileCheck, Shield, Navigation,
  HeadphonesIcon: Headphones, Sunset, Briefcase,
}

export default function ServicesShowcase() {
  const [active, setActive] = useState(services[0].id)
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeService = services.find(s => s.id === active) ?? services[0]
  const Icon = iconMap[activeService.icon] ?? Plane
  const { ref: sectionRef, inView } = useInView<HTMLElement>({ threshold: 0.1 })

  const selectService = (id: string) => {
    setActive(id)
    setMobileOpen(false)
  }

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-white">
      <div className={`site-gutter relative z-10 w-full transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <SectionHeader
          eyebrow="What We Offer"
          title="Travel Services Designed Around You"
          subtitle="From flight bookings to visa assistance, we handle every aspect of your journey with care and professionalism."
        />

        {/* Mobile: dropdown selector */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#101B46] text-white rounded-xl text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              <Icon size={16} className="text-[#08A9E0]" />
              {activeService.title}
            </span>
            <ChevronDown size={16} className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
          </button>
          {mobileOpen && (
            <div className="mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-10 relative">
              {services.map(service => {
                const SIcon = iconMap[service.icon] ?? Plane
                return (
                  <button
                    key={service.id}
                    onClick={() => selectService(service.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                      active === service.id ? 'bg-[#EAF8FD] text-[#08A9E0] font-medium' : 'text-[#172033] hover:bg-gray-50'
                    }`}
                  >
                    <SIcon size={15} />
                    {service.title}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Desktop: service list */}
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-1">
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
                    <SIcon size={16} className={active === service.id ? 'text-white' : 'text-[#08A9E0]'} />
                  </div>
                  <span className="text-sm font-medium">{service.title}</span>
                </button>
              )
            })}
          </div>

          {/* Active service detail */}
          <div className="lg:col-span-3 bg-gradient-to-br from-[#EAF8FD] to-white rounded-2xl p-5 sm:p-8 flex flex-col gap-5 sm:gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#101B46] flex items-center justify-center shrink-0">
                <Icon size={22} className="text-[#08A9E0]" />
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#101B46] mb-1 sm:mb-2">{activeService.title}</h3>
                <p className="text-[#667085] text-sm leading-relaxed">{activeService.description}</p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden h-40 sm:h-48 relative">
              <img
                src={activeService.image}
                alt={activeService.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

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
              <Button variant="primary" className="w-full sm:w-auto">Request This Service</Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <Link to="/services">
            <Button variant="outline">View All Services</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
