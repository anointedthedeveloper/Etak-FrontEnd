import { Link } from 'react-router-dom'
import { Plane, Building2, Map, MessageSquare, FileCheck, Shield, Navigation, Headphones, Sunset, Briefcase, ArrowRight } from 'lucide-react'
import { services } from '../data/services'
import { Button } from '../components/ui/Button'
import SEO from '../components/ui/SEO'
import PageHeader from '../components/ui/PageHeader'
import { useRevealChildren } from '../hooks/useInView'

const iconMap: Record<string, React.ElementType> = {
  Plane, Building2, Map, MessageSquare, FileCheck, Shield, Navigation,
  HeadphonesIcon: Headphones, Sunset, Briefcase,
}

export default function Services() {
  const gridRef = useRevealChildren<HTMLDivElement>()
  return (
    <>
      <SEO
        title="Our Services"
        description="Etak Travels offers flight booking, hotel reservations, tour packages, visa assistance, travel insurance, airport logistics and corporate travel management from Abuja, Nigeria."
        keywords="flight booking Nigeria, hotel reservations Abuja, visa assistance Dubai, tour packages Nigeria, corporate travel Abuja, travel insurance Nigeria, airport transfers Abuja"
        url="/services"
        image="/images/headers/flights.jpg"
        images={[
          { url: '/images/headers/flights.jpg', alt: 'Travel Services — Etak Travels Abuja Nigeria' },
          { url: '/images/services/flight.jpg', alt: 'Flight Booking & Ticketing — Etak Travels' },
          { url: '/images/services/hotel.jpg', alt: 'Hotel Reservations — Etak Travels' },
          { url: '/images/services/tours.jpg', alt: 'Tour Packages — Etak Travels' },
          { url: '/images/services/visa.jpg', alt: 'Visa Assistance — Etak Travels Nigeria' },
          { url: '/images/services/insurance.jpg', alt: 'Medical Travel Insurance — Etak Travels' },
          { url: '/images/services/corporate.jpg', alt: 'Corporate Travel Management — Etak Travels' },
          { url: '/images/services/airport.jpg', alt: 'Airport Logistics Assistance — Etak Travels' },
          { url: '/images/services/holiday.jpg', alt: 'Holiday Packages — Etak Travels Nigeria' },
          { url: '/images/services/consulting.jpg', alt: 'Travel Consulting — Etak Travels Abuja' },
          { url: '/images/services/support.jpg', alt: 'Pre & Post-Travel Support — Etak Travels' },
        ]}
      />
      <PageHeader
        eyebrow="Our Services"
        title="Complete Travel Management"
        subtitle="From your first inquiry to your safe return, Etak Travels provides professional support at every stage of your journey."
        image="/images/headers/flights.jpg"
        centered
      />

      <section className="py-12 sm:py-16 bg-[#F8FAFC]">
        <div className="site-gutter w-full">

          {/* intro strip */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <p className="text-xs font-semibold text-[#667085] uppercase tracking-widest shrink-0">10 Services Available</p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] ?? Plane
              return (
                <div
                  key={service.id}
                  className={`reveal stagger-${(i % 6) + 1} group relative bg-white rounded-card border border-gray-100 hover:border-[#08A9E0]/40 hover:shadow-panel transition-all duration-300 overflow-hidden flex flex-col`}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden shrink-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101B46]/70 via-[#101B46]/20 to-transparent" />

                    {/* Icon badge */}
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                      <Icon size={16} className="text-white" />
                    </div>

                    {/* Number */}
                    <div className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-[#08A9E0] flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{String(i + 1).padStart(2, '0')}</span>
                    </div>

                    {/* Title on image */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-display font-bold text-white text-base leading-snug">{service.title}</h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[#667085] text-xs leading-relaxed line-clamp-3 flex-1">{service.shortDesc}</p>

                    {/* Top 3 benefits */}
                    <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                      {service.benefits.slice(0, 3).map(b => (
                        <span key={b} className="text-[10px] font-medium text-[#087EAF] bg-[#EAF8FD] px-2 py-0.5 rounded-full">{b}</span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-50">
                      <Link to={`/services/${service.id}`} className="flex-1">
                        <button className="w-full text-xs font-semibold text-[#08A9E0] py-2 border border-[#08A9E0]/30 rounded-lg hover:bg-[#EAF8FD] hover:border-[#08A9E0] transition-all">
                          View Details
                        </button>
                      </Link>
                      <Link to="/contact" state={{ service: service.id }} className="flex-1">
                        <button className="w-full text-xs font-semibold text-white bg-[#08A9E0] hover:bg-[#0798C8] py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                          Request <ArrowRight size={11} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* 11th slot — spans 2 columns to fill the last row */}
            <div className="sm:col-span-2 xl:col-span-2 relative rounded-panel overflow-hidden min-h-[220px] flex">
              {/* Background image */}
              <img
                src="/images/sections/cta-bg.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#101B46]/95 via-[#101B46]/80 to-[#101B46]/40" />

              {/* Content */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 w-full p-8 sm:p-10">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-2 text-[#08A9E0] text-[11px] font-bold tracking-[0.18em] uppercase mb-3">
                    <span className="w-4 h-px bg-[#08A9E0]" /> Trusted Since 2010
                  </span>
                  <h3 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight mb-2">
                    Not Sure Which Service You Need?
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed max-w-md">
                    Over 15 years of helping travellers across Nigeria and beyond. Our team is available 24/7, 365 days a year — tell us your plans and we'll handle the rest.
                  </p>
                  {/* Stats row */}
                  <div className="flex items-center gap-6 mt-5">
                    {[['500+', 'Happy Clients'], ['16+', 'Years Experience'], ['24/7', 'Support']].map(([val, lbl]) => (
                      <div key={lbl}>
                        <p className="font-display font-bold text-white text-xl">{val}</p>
                        <p className="text-white/40 text-[10px] uppercase tracking-wide">{lbl}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
                  <Link to="/contact">
                    <button className="w-full sm:w-48 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-semibold transition-colors shadow-lg shadow-[#08A9E0]/25">
                      Talk to Our Team <ArrowRight size={15} />
                    </button>
                  </Link>
                  <a href="tel:+2348032062242">
                    <button className="w-full sm:w-48 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm font-medium transition-colors">
                      +234 803 206 2242
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-14 sm:py-20 bg-white overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="site-gutter relative z-10 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 rounded-card bg-gradient-to-br from-[#101B46] to-[#087EAF] flex items-center justify-center mx-auto mb-5 shadow-panel">
              <MessageSquare size={24} className="text-[#08A9E0]" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#101B46] mb-3">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-[#667085] text-sm sm:text-base mb-7 max-w-xl mx-auto leading-relaxed">
              Our team is available 24/7, 365 days a year. Contact us and we'll help you figure out the best travel arrangement for your situation.
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
