import { useParams, Link, Navigate } from 'react-router-dom'
import {
  Plane, Building2, Map, MessageSquare, FileCheck, Shield,
  Navigation, Headphones, Sunset, Briefcase,
  ArrowRight, CheckCircle2, ChevronRight, Phone,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { services } from '../data/services'
import { Button } from '../components/ui/Button'
import SEO from '../components/ui/SEO'

const iconMap: Record<string, React.ElementType> = {
  Plane, Building2, Map, MessageSquare, FileCheck, Shield, Navigation,
  HeadphonesIcon: Headphones, Sunset, Briefcase,
}

// Extra rich content per service drawn from company profile
const serviceExtras: Record<string, { highlights: string[]; process: string[]; note?: string }> = {
  'flight-booking': {
    highlights: [
      'All major airlines including low-cost carriers',
      'Domestic & international routes',
      'Business, economy & first class',
      'Group bookings for any size',
      'Best fares searched & applied',
      'E-ticket delivery via email or in person',
    ],
    process: ['Submit your travel request', 'We search best available fares', 'Booking confirmation from you', 'Ticket issued & delivered'],
    note: 'Reservations are available with all major airlines including low-cost carriers. Each booking is subject to a fare search to find the cheapest price for that itinerary.',
  },
  'hotel-reservations': {
    highlights: [
      'Hotels within Nigeria and worldwide',
      'Corporate, preferred & negotiated rates',
      'Budget to luxury properties',
      'Hotel apartments for long stays',
      'Special requests handled',
      'Confirmed reservations before travel',
    ],
    process: ['Tell us your destination & dates', 'We source suitable properties', 'You confirm your preference', 'Reservation confirmed & sent'],
    note: 'We source accommodations at corporate, preferred and negotiated rates — from city business hotels to leisure resorts and private hotel apartments.',
  },
  'tour-packages': {
    highlights: [
      'Individual & group tour packages',
      'Flights + hotel + transfers bundled',
      'Guided city tours at destination',
      'Cultural & leisure experiences',
      'School & educational tour packages',
      'Flexible itineraries tailored to you',
    ],
    process: ['Share your destination & group size', 'We design your itinerary', 'Review & approve the package', 'Travel with full support'],
    note: 'Special packages are always arranged for school & educational tours. Tour guides can be pre-arranged at your city of destination.',
  },
  'travel-consulting': {
    highlights: [
      'Personalised destination advice',
      'Documentation & visa guidance',
      'Cost-conscious itinerary planning',
      'Pre-travel briefing for all clients',
      'Support for first-time travellers',
      'Ongoing relationship management',
    ],
    process: ['Book a consultation', 'We review your travel goals', 'Receive a personalised plan', 'Travel with confidence'],
    note: 'We effectively review client expectations to create the required comfort — our clear understanding of your wants is what sets us apart.',
  },
  'visa-assistance': {
    highlights: [
      'Dubai visa application support',
      'Full document checklist provided',
      'Application guidance step by step',
      'Processing timeline advice',
      'Follow-up support until approval',
      'Passport & visa requirement briefing',
    ],
    process: ['Submit your travel destination', 'Receive document checklist', 'We guide your application', 'Follow up until visa is ready'],
    note: 'We inform you of any visa requirement to undertake a journey and provide you with enough information on your visa application.',
  },
  'travel-insurance': {
    highlights: [
      'Medical emergency cover abroad',
      'Trip disruption protection',
      'Destination-specific coverage advice',
      'Competitive insurance rates',
      'Coverage for all travel durations',
      'Peace of mind for every journey',
    ],
    process: ['Tell us your destination & duration', 'We advise on coverage options', 'You select your plan', 'Insurance arranged before departure'],
    note: 'It is our commitment to ensure that your travels run smoothly — that is why we go the extra mile to provide you with the best insurance at competitive rates.',
  },
  'airport-logistics': {
    highlights: [
      'Airport transfer coordination',
      'Meet & greet at arrival',
      'Departure guidance & support',
      'Stress-free travel day management',
      'VIP & corporate transfer options',
      'Available 24/7, 365 days a year',
    ],
    process: ['Share your flight details', 'We arrange your transfer', 'Meet & greet confirmed', 'Smooth arrival or departure'],
    note: 'Our after-hours service is provided 24/7/365 days — we are always available to ensure your travel day runs without a hitch.',
  },
  'pre-post-travel': {
    highlights: [
      'Pre-travel document review',
      'Full travel briefing before departure',
      'Travel day support & check-in guidance',
      'Post-travel follow-up',
      'Ongoing client relationship',
      'Available 24/7 throughout your trip',
    ],
    process: ['Receive pre-travel briefing', 'Documents reviewed & confirmed', 'Travel day support provided', 'Post-travel follow-up call'],
    note: 'All our clients are held in high esteem — their preferences and travel policies are always adhered to throughout the entire journey.',
  },
  'holiday-packages': {
    highlights: [
      'Complete holiday planning',
      'Popular international destinations',
      'Family-friendly & couple getaways',
      'Cruise packages available',
      'Value-focused pricing',
      'Guided experiences included',
    ],
    process: ['Tell us your dream destination', 'We build your holiday package', 'Review & confirm the plan', 'Enjoy a seamless holiday'],
    note: 'Join us to uncover unique experiences — from city skylines to coastal mountain ranges and famous landmarks within Nigeria and worldwide.',
  },
  'corporate-travel': {
    highlights: [
      'Team & delegation travel management',
      'Conference & event logistics',
      'Corporate & negotiated rates',
      'Multi-destination itineraries',
      'Dedicated account support',
      'Serving government, civil & private firms',
    ],
    process: ['Submit your corporate travel brief', 'We plan the full itinerary', 'Team confirms & approves', 'Managed travel executed seamlessly'],
    note: 'We provide the same range of services and buying ability as the largest corporate travel agents — with the personal touch only an independent agency can offer.',
  },
}

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const service = services.find(s => s.id === serviceId)

  if (!service) return <Navigate to="/services" replace />

  const Icon = iconMap[service.icon] ?? Plane
  const extras = serviceExtras[service.id]
  const others = services.filter(s => s.id !== service.id).slice(0, 3)

  return (
    <>
      <SEO title={service.title} description={service.shortDesc} url={`/services/${service.id}`} />

      {/* ── Hero ── */}
      <div className="relative h-[380px] sm:h-[460px] overflow-hidden bg-[#0D1640]">
        <img
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1640] via-[#0D1640]/55 to-[#0D1640]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1640]/70 via-transparent to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-[76px] left-0 right-0 site-gutter">
          <nav className="flex items-center gap-1.5 text-xs text-white/40">
            <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link to="/services" className="hover:text-white/70 transition-colors">Services</Link>
            <ChevronRight size={11} />
            <span className="text-white/70">{service.title}</span>
          </nav>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 site-gutter pb-10">
          <div className="flex items-end gap-5 max-w-4xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#08A9E0] flex items-center justify-center shadow-2xl shrink-0 border-2 border-white/10">
              <Icon size={30} className="text-white" />
            </div>
            <div>
              <span className="inline-block text-[#08A9E0] text-[11px] font-bold tracking-[0.18em] uppercase mb-2">Our Services</span>
              <h1 className="font-display font-bold text-white text-2xl sm:text-4xl lg:text-5xl leading-tight">{service.title}</h1>
              <p className="text-white/60 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">{service.shortDesc}</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#08A9E0]/50 via-[#0798C8]/30 to-transparent" />
      </div>

      {/* ── Body ── */}
      <div className="bg-[#F8FAFC]">
        <div className="site-gutter w-full py-10 sm:py-14">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

            {/* ── Main ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* About */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h2 className="font-display font-bold text-[#101B46] text-lg sm:text-xl mb-4 flex items-center gap-2.5">
                  <span className="w-1 h-5 rounded-full bg-[#08A9E0] shrink-0" />
                  About This Service
                </h2>
                <p className="text-[#667085] leading-relaxed text-sm sm:text-[15px]">{service.description}</p>
                {extras?.note && (
                  <div className="mt-4 p-4 bg-[#EAF8FD] rounded-xl border border-[#08A9E0]/15">
                    <p className="text-sm text-[#087EAF] leading-relaxed italic">"{extras.note}"</p>
                  </div>
                )}
              </div>

              {/* What's included */}
              {extras?.highlights && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                  <h2 className="font-display font-bold text-[#101B46] text-lg sm:text-xl mb-5 flex items-center gap-2.5">
                    <span className="w-1 h-5 rounded-full bg-[#08A9E0] shrink-0" />
                    What's Included
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-2.5">
                    {extras.highlights.map(h => (
                      <li key={h} className="flex items-center gap-3 bg-[#F8FAFC] rounded-xl px-4 py-3 border border-gray-100">
                        <div className="w-5 h-5 rounded-full bg-[#EAF8FD] flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} className="text-[#08A9E0]" />
                        </div>
                        <span className="text-sm text-[#374151]">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How it works */}
              {extras?.process && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                  <h2 className="font-display font-bold text-[#101B46] text-lg sm:text-xl mb-5 flex items-center gap-2.5">
                    <span className="w-1 h-5 rounded-full bg-[#08A9E0] shrink-0" />
                    How It Works
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-0">
                    {extras.process.map((step, i) => (
                      <div key={step} className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 flex-1 relative">
                        {/* connector line */}
                        {i < extras.process.length - 1 && (
                          <div className="hidden sm:block absolute top-5 left-1/2 w-full h-px bg-gradient-to-r from-[#08A9E0]/40 to-[#08A9E0]/10 z-0" />
                        )}
                        <div className="w-10 h-10 rounded-full bg-[#08A9E0] flex items-center justify-center text-white font-bold text-sm shrink-0 z-10 shadow-md shadow-[#08A9E0]/25">
                          {i + 1}
                        </div>
                        <p className="text-xs sm:text-center text-[#374151] font-medium leading-snug sm:px-2">{step}</p>
                        {/* mobile connector */}
                        {i < extras.process.length - 1 && (
                          <div className="sm:hidden w-px h-4 bg-[#08A9E0]/30 ml-5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Best for */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h2 className="font-display font-bold text-[#101B46] text-lg sm:text-xl mb-4 flex items-center gap-2.5">
                  <span className="w-1 h-5 rounded-full bg-[#08A9E0] shrink-0" />
                  Best For
                </h2>
                <div className="flex flex-wrap gap-2">
                  {service.travelerTypes.map(t => (
                    <span key={t} className="px-4 py-2 bg-[#F8FAFC] border border-gray-200 rounded-full text-sm text-[#374151] font-medium hover:border-[#08A9E0]/40 hover:bg-[#EAF8FD] transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="flex flex-col gap-4">

              {/* CTA card */}
              <div className="bg-gradient-to-br from-[#101B46] to-[#0D2260] rounded-2xl p-6 text-white shadow-xl lg:sticky lg:top-24">
                <div className="w-12 h-12 rounded-xl bg-[#08A9E0]/15 border border-[#08A9E0]/25 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#08A9E0]" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1.5">Ready to Book?</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-5">
                  Get in touch and our team will handle everything — available 24/7, 365 days a year.
                </p>

                <Link to="/contact" state={{ service: service.id }} className="block mb-3">
                  <Button variant="primary" size="lg" className="w-full">
                    Request This Service <ArrowRight size={15} />
                  </Button>
                </Link>

                <a
                  href="tel:+2348032062242"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/15 text-white/65 hover:text-white hover:border-white/30 text-sm font-medium transition-colors mb-2"
                >
                  <Phone size={14} /> +234 803 206 2242
                </a>

                <a
                  href="https://wa.me/2348032062242"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#25D366]/30 text-[#25D366]/80 hover:text-[#25D366] hover:border-[#25D366]/50 text-sm font-medium transition-colors"
                >
                  <FaWhatsapp size={15} /> Chat on WhatsApp
                </a>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="text-[10px] text-white/35 text-center">Available 24 / 7 / 365 days</p>
                </div>
              </div>

              {/* Back */}
              <Link
                to="/services"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-gray-100 text-sm font-medium text-[#667085] hover:text-[#08A9E0] hover:border-[#08A9E0]/30 transition-all shadow-sm"
              >
                ← All Services
              </Link>

              {/* Quick benefits */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-xs font-bold text-[#101B46] uppercase tracking-wide mb-3">Key Benefits</p>
                <ul className="flex flex-col gap-2">
                  {service.benefits.map(b => (
                    <li key={b} className="flex items-center gap-2 text-xs text-[#667085]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#08A9E0] shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Other services ── */}
          {others.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-[#101B46] text-xl">Explore Other Services</h2>
                <Link to="/services" className="text-sm text-[#08A9E0] hover:underline flex items-center gap-1">
                  View all <ArrowRight size={13} />
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {others.map(s => {
                  const OtherIcon = iconMap[s.icon] ?? Plane
                  return (
                    <Link
                      key={s.id}
                      to={`/services/${s.id}`}
                      className="group bg-white rounded-2xl border border-gray-100 hover:border-[#08A9E0]/30 hover:shadow-lg transition-all overflow-hidden"
                    >
                      <div className="h-36 overflow-hidden relative">
                        <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101B46]/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 w-8 h-8 rounded-lg bg-[#101B46]/90 flex items-center justify-center">
                          <OtherIcon size={14} className="text-[#08A9E0]" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-[#101B46] text-sm mb-1 group-hover:text-[#08A9E0] transition-colors">{s.title}</h3>
                        <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">{s.shortDesc}</p>
                        <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-[#08A9E0]">
                          Learn more <ArrowRight size={11} />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
