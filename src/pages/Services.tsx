import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, Building2, Map, MessageSquare, FileCheck, Shield, Navigation, Headphones, Sunset, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react'
import { services } from '../data/services'
import { Button } from '../components/ui/Button'
import SEO from '../components/ui/SEO'
import PageHeader from '../components/ui/PageHeader'

const iconMap: Record<string, React.ElementType> = {
  Plane, Building2, Map, MessageSquare, FileCheck, Shield, Navigation,
  HeadphonesIcon: Headphones, Sunset, Briefcase,
}

export default function Services() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      <SEO
        title="Our Services"
        description="Etak Travels offers flight booking, hotel reservations, tour packages, visa assistance, travel insurance, airport logistics and corporate travel management from Abuja, Nigeria."
        keywords="flight booking Nigeria, hotel reservations Abuja, visa assistance Dubai, tour packages Nigeria, corporate travel Abuja, travel insurance Nigeria, airport transfers Abuja"
        url="/services"
      />
      {/* Page header */}
      <PageHeader
        eyebrow="Our Services"
        title="Complete Travel Management"
        subtitle="From your first inquiry to your safe return, Etak Travels provides professional support at every stage of your journey."
        image="/images/headers/flights.jpg"
        centered
      />

      {/* Services grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F8FAFC]">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {services.map(service => {
              const Icon = iconMap[service.icon] ?? Plane
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="h-52 relative overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="w-11 h-11 rounded-xl bg-[#101B46] flex items-center justify-center shadow-lg">
                        <Icon size={20} className="text-[#08A9E0]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-[#101B46] text-xl mb-2">{service.title}</h3>
                    <p className="text-[#667085] text-sm leading-relaxed mb-4 flex-1">{service.shortDesc}</p>

                    <div className="mb-5">
                      <h4 className="text-xs font-semibold text-[#101B46] uppercase tracking-wide mb-2">Benefits</h4>
                      <ul className="flex flex-col gap-1.5">
                        {service.benefits.slice(0, 3).map(b => (
                          <li key={b} className="flex items-center gap-2 text-xs text-[#667085]">
                            <CheckCircle2 size={12} className="text-[#08A9E0] shrink-0" />{b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(selected === service.id ? null : service.id)}
                        className="flex-1 text-sm font-medium text-[#08A9E0] hover:text-[#0798C8] transition-colors py-2 border border-[#08A9E0] rounded-lg hover:bg-[#EAF8FD]"
                      >
                        {selected === service.id ? 'Close' : 'Learn More'}
                      </button>
                      <Link to="/contact" state={{ service: service.id }} className="flex-1">
                        <Button variant="primary" size="sm" className="w-full">Request <ArrowRight size={13} /></Button>
                      </Link>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {selected === service.id && (
                    <div className="border-t border-gray-100 p-6 bg-[#F8FAFC]">
                      <p className="text-sm text-[#172033] leading-relaxed mb-4">{service.description}</p>
                      <div>
                        <h4 className="text-xs font-semibold text-[#101B46] uppercase tracking-wide mb-2">Best for</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.travelerTypes.map(t => (
                            <span key={t} className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs text-[#667085]">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-14 sm:py-20 bg-white overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#101B46] to-[#45419A] flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageSquare size={28} className="text-[#08A9E0]" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#101B46] mb-4">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-[#667085] text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Contact our team and we'll help you figure out the best travel arrangement for your situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="primary" className="w-full sm:w-auto">Talk to Our Team <ArrowRight size={16} /></Button>
              </Link>
              <a href="tel:+2348032062242">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Call Us Directly</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
