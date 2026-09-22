import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, Building2, Map, HelpCircle, ArrowRight, MapPin, Phone } from 'lucide-react'
import FlightInquiryForm from '../forms/FlightInquiryForm'
import HotelInquiryForm from '../forms/HotelInquiryForm'
import TourInquiryForm from '../forms/TourInquiryForm'
import AssistanceInquiryForm from '../forms/AssistanceInquiryForm'
import ImageSlideshow from '../ui/ImageSlideshow'
import { destinations } from '../../data/destinations'

const HERO_SLIDE_IDS = ['dubai', 'istanbul', 'london', 'paris', 'new-york', 'nairobi']
const heroSlides = HERO_SLIDE_IDS
  .map(id => destinations.find(d => d.id === id))
  .filter((d): d is (typeof destinations)[number] => !!d)
  .map(d => ({ src: d.image, alt: d.name }))

// Each background photo carries its own editorial focus line, cycling in
// sync with the slideshow so the hero reads as purposeful slides rather
// than a generic rotating backdrop.
const heroFocus = [
  { label: 'Flights',  copy: 'Fares to Dubai, sorted end to end.' },
  { label: 'Culture',  copy: 'City breaks planned around what you love.' },
  { label: 'Hotels',   copy: 'Stays picked and booked to fit your budget.' },
  { label: 'Business', copy: 'Corporate travel, handled without the back-and-forth.' },
  { label: 'Tours',    copy: 'Curated itineraries for first-time explorers.' },
  { label: 'Assistance', copy: 'Visa and documentation support, start to finish.' },
]

const tabs = [
  { id: 'flights',    label: 'Flights',           icon: Plane },
  { id: 'hotels',     label: 'Hotels',            icon: Building2 },
  { id: 'tours',      label: 'Tours',             icon: Map },
  { id: 'assistance', label: 'Travel Assistance', icon: HelpCircle },
]

const serviceIcons = [
  { icon: Plane,      label: 'Flight Bookings',    sub: 'Best fares, global destinations' },
  { icon: Building2,  label: 'Hotel Reservations', sub: 'Top hotels, great rates' },
  { icon: Map,        label: 'Tour Packages',       sub: 'Explore new destinations' },
  { icon: HelpCircle, label: 'Travel Assistance',   sub: 'Support before, during & after' },
]

export default function Hero() {
  const [activeTab, setActiveTab] = useState('flights')
  const [slideIndex, setSlideIndex] = useState(0)
  const navigate = useNavigate()
  const focus = heroFocus[slideIndex % heroFocus.length]
  return (
    <section className="hero-shell relative flex flex-col overflow-hidden bg-[#0D1640] -mt-16 lg:-mt-[68px] xl:-mt-[72px] 2xl:-mt-20 min-h-[100svh] lg:h-[100svh]">

      {/* ── Background slideshow — real destination photography, always rotating ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <ImageSlideshow images={heroSlides} interval={6500} onIndexChange={setSlideIndex} />
        {/* Mobile: layered navy overlay keeps the photo visible while text stays crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07102D]/62 via-[#07102D]/40 to-[#07102D]/68 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07102D]/38 via-transparent to-[#07102D]/10 lg:hidden" />
        {/* Desktop: a richer navy wash keeps the image atmospheric without losing legibility */}
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-[#07102D]/76 via-[#0D1640]/48 to-[#0D1640]/14" />
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-t from-[#07102D]/30 via-transparent to-[#07102D]/12" />
      </div>


      {/* ── Main content ── */}
      <div className="hero-main site-gutter relative z-10 w-full pt-16 sm:pt-20 lg:pt-[68px] xl:pt-[72px] 2xl:pt-20 pb-4 flex-1">
        <div className="hero-grid grid lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-start lg:items-center max-w-[1600px] mx-auto">

          {/* ── LEFT — text sits directly on the photography on desktop (a scrim
               panel only on mobile, where the crop leaves less room to breathe) ── */}
          <div className="hero-copy rounded-panel bg-[#07102D]/45 p-4 pt-3 sm:p-5 lg:rounded-none lg:bg-transparent lg:p-0 lg:border-0 backdrop-blur-md lg:backdrop-blur-none border border-white/10">
            <div className="hero-eyebrow flex items-center gap-2.5 mb-3">
              <span className="text-[#08A9E0] text-xs sm:text-sm font-extrabold uppercase tracking-widest drop-shadow-lg">
                Your Journey Starts Here
              </span>
              <span
                key={slideIndex}
                title={focus.copy}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white/90 backdrop-blur-sm animate-fade-in"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#08A9E0] animate-breathe" />
                {focus.label}
              </span>
            </div>

            <h1 className="hero-title font-display font-extrabold text-white leading-tight mb-4
                           text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                style={{ textShadow: '0 2px 6px rgba(16,27,70,0.4), 0 1px 2px rgba(16,27,70,0.2)' }}>
              Your Reliable{' '}
              <span className="text-[#08A9E0]">Travel Bridge</span>{' '}
              to the World
            </h1>

            <p className="hero-sub text-white leading-relaxed mb-6 max-w-lg font-semibold text-sm sm:text-base lg:text-lg"
               style={{ textShadow: '0 2px 8px rgba(16,27,70,0.5), 0 1px 3px rgba(16,27,70,0.3)' }}>
              From flight reservations and hotel stays to carefully planned tours, we make every journey easier to arrange — for business, leisure, education, and beyond.
            </p>

            {/* Service list — an inline row of icon + label pairs rather than
                four boxed mini-cards, so it reads as one editorial line. */}
            <div className="hero-icons flex flex-wrap items-center gap-x-5 gap-y-3 mb-6 sm:mb-8">
              {serviceIcons.map(({ icon: Icon, label }, i) => (
                <div key={label} className="flex items-center gap-4">
                  {i > 0 && <span className="hidden sm:block w-px h-8 bg-white/20 shrink-0" aria-hidden="true" />}
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-[#08A9E0] shrink-0" />
                    <span
                      className="text-xs sm:text-sm font-semibold text-white leading-tight"
                      style={{ textShadow: '0 1px 4px rgba(16,27,70,0.5)' }}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="hero-ctas flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/contact')}
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-bold transition-all flex-1 sm:flex-none justify-center shadow-panel hover:shadow-[#08A9E0]/40 hover:-translate-y-0.5"
              >
                Plan Your Trip <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/services')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-gray-50 text-[#172033] text-sm font-bold border border-gray-200 shadow-panel transition-all flex-1 sm:flex-none justify-center hover:-translate-y-0.5"
              >
                <Building2 size={15} className="text-[#08A9E0]" /> Explore Services
              </button>
            </div>

            {/* Short desktop view: keep the trust cues near the message instead of below the fold. */}
            <div className="hero-copy-trust hidden lg:grid grid-cols-3 gap-2 mt-4">
              {[
                { icon: MapPin, label: 'CAC Registered' },
                { icon: Building2, label: 'Abuja, Nigeria' },
                { icon: Phone, label: 'End-to-end support' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-control bg-white/12 border border-white/15 px-2.5 py-2 text-white/90 backdrop-blur-sm">
                  <Icon size={13} className="text-[#08A9E0] shrink-0" />
                  <span className="text-[11px] font-semibold leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — Inquiry panel ── */}
          <div className="hero-panel pb-6 lg:pt-6">
            <div className="bg-white/[0.96] rounded-panel shadow-float border border-white/70 backdrop-blur-xl">
              {/* Tabs */}
              <div className="grid grid-cols-4 border-b border-gray-100 rounded-t-panel overflow-hidden">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex flex-col items-center gap-1 py-2.5 sm:py-3 px-1 text-xs font-medium transition-all duration-200 cursor-pointer ${
                      activeTab === id
                        ? 'bg-[#08A9E0] text-white shadow-sm shadow-[#08A9E0]/25'
                        : 'text-[#667085] hover:text-[#172033] hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={15} />
                    <span className="hidden xs:block sm:block leading-tight text-center">{label}</span>
                  </button>
                ))}
              </div>
              <div className="hero-form p-3 sm:p-4">
                {activeTab === 'flights'    && <FlightInquiryForm compact />}
                {activeTab === 'hotels'     && <HotelInquiryForm compact />}
                {activeTab === 'tours'      && <TourInquiryForm compact />}
                {activeTab === 'assistance' && <AssistanceInquiryForm compact />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div id="trust" className="hero-trust site-gutter relative z-10 pb-4 sm:pb-6 mt-auto pt-3 sm:pt-4">
        <div className="bg-white/[0.94] rounded-panel shadow-panel border border-white/70 px-4 sm:px-10 py-4 sm:py-5 max-w-[1600px] mx-auto backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-3 sm:gap-0 w-full sm:w-auto">
              {[
                { icon: MapPin,    title: 'CAC Registered',        sub: 'RC 898792' },
                { icon: Building2, title: 'Based in Abuja',         sub: 'FCT, Nigeria' },
                { icon: Phone,     title: 'Full Travel Management', sub: 'End-to-end support' },
              ].map(({ icon: Icon, title, sub }, idx) => (
                <div key={title} className="trust-item flex items-center sm:shrink-0">
                  {idx > 0 && <div className="trust-item-line hidden sm:block w-10 h-0.5 bg-[#08A9E0] rounded-full mx-4 xl:mx-6 shrink-0" />}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#EAF8FD] flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-[#08A9E0] sm:w-4 sm:h-4" />
                      <span className="absolute inset-0 rounded-full bg-[#08A9E0]/20 animate-[pulse-ring_2.5s_ease-out_infinite]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-[#101B46] leading-tight">{title}</p>
                      <p className="text-[10px] sm:text-xs text-[#667085] mt-0.5">{sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <span className="font-script text-[#08A9E0] text-2xl xl:text-3xl leading-none">Explore the World</span>
              <Plane size={18} className="text-[#08A9E0] -rotate-12 animate-float" />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
