import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, Building2, Map, HelpCircle, ArrowRight, MapPin, Phone, Menu, X, Heart } from 'lucide-react'
import FlightInquiryForm from '../forms/FlightInquiryForm'
import HotelInquiryForm from '../forms/HotelInquiryForm'
import TourInquiryForm from '../forms/TourInquiryForm'
import AssistanceInquiryForm from '../forms/AssistanceInquiryForm'
import { useCart } from '../../context/CartContext'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const navigate = useNavigate()
  const { items, toggle, count } = useCart()

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = wishlistOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [wishlistOpen])

  return (
    <section className="hero-shell relative flex flex-col overflow-hidden bg-[#0D1640] -mt-16 lg:-mt-[68px] xl:-mt-[72px] 2xl:-mt-20 min-h-[100svh] lg:h-[100svh]">

      {/* ── Background image ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img
          src="/brand/PhonePortrait.png"
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-0 h-full w-full object-cover object-right lg:hidden"
        />
        <img
          src="/brand/hero.png"
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-0 h-full w-full object-cover object-right hidden lg:block"
        />
        {/* Mobile: layered navy overlay keeps the portrait image visible while text stays crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07102D]/56 via-[#07102D]/34 to-[#07102D]/62 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07102D]/38 via-transparent to-[#07102D]/10 lg:hidden" />
        {/* Desktop: a richer navy wash keeps the image atmospheric without losing legibility */}
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-[#07102D]/72 via-[#0D1640]/42 to-[#0D1640]/10" />
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-t from-[#07102D]/26 via-transparent to-[#07102D]/10" />
      </div>


      {/* ── Mobile Header — only visible before navbar slides in ── */}
      <div className={`lg:hidden relative z-20 flex items-center justify-between px-4 py-3 bg-[#07102D]/28 backdrop-blur-sm transition-opacity duration-300 ${atTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-white/95 p-1.5 shadow-lg shadow-[#07102D]/30 ring-1 ring-white/80">
            <img src="/brand/logo.png" alt="Etak Travels" className="h-12 w-12 object-contain block" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWishlistOpen(true)}
            className="relative p-2 rounded-full text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <Heart size={20} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#08A9E0] text-white text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-white hover:bg-white/20 backdrop-blur-sm"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-0 right-0 bottom-0 w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src="/brand/logo.png" alt="Etak Travels" className="h-10 w-10 object-contain" />
                <span className="font-display font-bold text-[#101B46]">Etak Travels</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-[#667085]">
                <X size={20} />
              </button>
            </div>
            <nav className="p-4">
              {[
                { label: 'Home',         path: '/' },
                { label: 'About Us',     path: '/about' },
                { label: 'Services',     path: '/services' },
                { label: 'Destinations', path: '/destinations' },
                { label: 'Tours',        path: '/tours' },
                { label: 'Contact',      path: '/contact' },
              ].map(({ label, path }) => (
                <button
                  key={label}
                  onClick={() => { navigate(path); setMobileMenuOpen(false) }}
                  className="w-full text-left py-3 px-4 text-[#172033] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ── Mobile Wishlist Panel ── */}
      {wishlistOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setWishlistOpen(false)}>
          <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-[#08A9E0]" />
                <h2 className="font-display font-bold text-[#101B46] text-lg">Saved Items</h2>
                {count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#EAF8FD] text-[#08A9E0] text-xs font-semibold">{count}</span>
                )}
              </div>
              <button onClick={() => setWishlistOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 text-[#667085]">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-16">
                  <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center">
                    <Heart size={28} className="text-gray-300" />
                  </div>
                  <p className="text-[#667085] text-sm">No saved items yet.</p>
                  <p className="text-[#667085] text-xs">Tap the heart on any tour or destination to save it here.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-[#F8FAFC] rounded-xl p-3 border border-gray-100">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                          item.type === 'tour' ? 'bg-[#EAF8FD] text-[#08A9E0]' : 'bg-[#101B46]/10 text-[#101B46]'
                        }`}>
                          {item.type}
                        </span>
                        <p className="font-semibold text-[#101B46] text-sm mt-1 truncate">{item.title}</p>
                        <p className="text-[#667085] text-xs">{item.subtitle}</p>
                      </div>
                      <button
                        onClick={() => toggle(item)}
                        className="p-1.5 rounded-full text-[#667085] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 self-start"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    navigate('/contact', { state: { savedItems: items.map(i => i.title).join(', ') } })
                    setWishlistOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#08A9E0] text-white text-sm font-semibold hover:bg-[#0798C8] transition-colors"
                >
                  Enquire About Saved Items <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="hero-main site-gutter relative z-10 w-full pt-2 sm:pt-4 lg:pt-[68px] xl:pt-[72px] 2xl:pt-20 pb-4 flex-1">
        <div className="hero-grid grid lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-start lg:items-center max-w-[1600px] mx-auto">

          {/* ── LEFT ── */}
          <div className="hero-copy rounded-2xl bg-[#07102D]/42 p-4 pt-3 sm:p-5 lg:rounded-3xl lg:bg-[#07102D]/24 lg:p-6 lg:backdrop-blur-[2px] backdrop-blur-md border border-white/10">
            <p className="hero-eyebrow text-[#08A9E0] text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-3 drop-shadow-lg">
              Your Journey Starts Here
            </p>

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

            {/* Service icon strip */}
            <div className="hero-icons grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
              {serviceIcons.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1.5 p-2.5 sm:p-3 rounded-2xl bg-white/[0.92] border border-white/60 shadow-sm backdrop-blur-md hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EAF8FD] flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#08A9E0]" />
                  </div>
                  <span className="text-xs font-bold text-[#172033] leading-tight">{label}</span>
                  <span className="text-xs text-[#667085] leading-tight hidden sm:block">{sub}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="hero-ctas flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/contact')}
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-bold transition-all flex-1 sm:flex-none justify-center shadow-lg hover:shadow-[#08A9E0]/40 hover:-translate-y-0.5"
              >
                Plan Your Trip <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/services')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-gray-50 text-[#172033] text-sm font-bold border border-gray-200 shadow-lg transition-all flex-1 sm:flex-none justify-center hover:-translate-y-0.5"
              >
                <Building2 size={15} className="text-[#08A9E0]" /> Explore Services
              </button>
            </div>
          </div>

          {/* ── RIGHT — Inquiry panel ── */}
          <div className="hero-panel pb-6 lg:pt-6">
            <div className="bg-white/[0.96] rounded-2xl shadow-2xl shadow-[#07102D]/25 border border-white/70 backdrop-blur-xl hover:shadow-2xl transition-shadow duration-500">
              {/* Tabs */}
              <div className="grid grid-cols-4 border-b border-gray-100 rounded-t-2xl overflow-hidden">
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
        <div className="bg-white/[0.94] rounded-2xl shadow-lg shadow-[#07102D]/20 border border-white/70 px-4 sm:px-10 py-4 sm:py-5 max-w-[1600px] mx-auto backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-0 overflow-x-auto overflow-y-hidden pb-1 sm:pb-0 w-full sm:w-auto scrollbar-hide">
              {[
                { icon: MapPin,    title: 'CAC Registered',        sub: 'RC 898792' },
                { icon: Building2, title: 'Based in Abuja',         sub: 'FCT, Nigeria' },
                { icon: Phone,     title: 'Full Travel Management', sub: 'End-to-end support' },
              ].map(({ icon: Icon, title, sub }, idx) => (
                <div key={title} className="trust-item flex items-center shrink-0">
                  {idx > 0 && <div className="trust-item-line w-10 h-0.5 bg-[#08A9E0] rounded-full mx-6 shrink-0" />}
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-[#EAF8FD] flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-[#08A9E0]" />
                      <span className="absolute inset-0 rounded-full bg-[#08A9E0]/20 animate-[pulse-ring_2.5s_ease-out_infinite]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#101B46] whitespace-nowrap">{title}</p>
                      <p className="text-xs text-[#667085] mt-0.5">{sub}</p>
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
