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
  const navigate = useNavigate()
  const { items, toggle, count } = useCart()

  useEffect(() => {
    document.body.style.overflow = wishlistOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [wishlistOpen])

  return (
    <section className="relative flex flex-col overflow-hidden bg-white">

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
      </div>

      {/* ── Mobile Header (Only on Home) ── */}
      <div className="lg:hidden relative z-20 flex items-center justify-between px-4 py-3 bg-transparent">
        <div className="flex items-center gap-2">
          <img src="/brand/logo.png" alt="Etak Travels" className="h-20 w-20 object-contain" />
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
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-0 right-0 bottom-0 w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src="/brand/logo.png" alt="Etak Travels" className="h-10 w-10 object-contain" />
                <span className="font-display font-bold text-[#101B46]">Etak Travels</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-[#667085]"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="p-4">
              {['Home', 'About Us', 'Services', 'Destinations', 'Tours', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    navigate(item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`)
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left py-3 px-4 text-[#172033] hover:bg-gray-50 rounded-lg"
                >
                  {item}
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
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 pt-20 lg:pt-24 pb-0">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-14 items-start">

          {/* ── LEFT ── */}
          <div className="pt-4 sm:pt-8 pb-4">
            <p className="text-[#08A9E0] text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-3 drop-shadow-lg">
              Your Journey Starts Here
            </p>

            <h1 className="font-display font-extrabold text-white leading-tight mb-4
                           text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                           style={{ textShadow: '0 2px 6px rgba(16, 27, 70, 0.4), 0 1px 2px rgba(16, 27, 70, 0.2)' }}>
              Your Reliable{' '}
              <span className="text-[#08A9E0]">Travel Bridge</span>{' '}
              to the World
            </h1>

            <p className="text-white leading-relaxed mb-6 max-w-lg font-semibold
                          text-sm sm:text-base lg:text-lg"
                          style={{ textShadow: '0 2px 8px rgba(16, 27, 70, 0.5), 0 1px 3px rgba(16, 27, 70, 0.3)' }}>
              From flight reservations and hotel stays to carefully planned tours, we make every journey easier to arrange — for business, leisure, education, and beyond.
            </p>

            {/* Service icon strip — 2-col on mobile, 4-col from sm */}
            <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
              {serviceIcons.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1.5 p-2.5 sm:p-3 rounded-2xl bg-white/95 border border-gray-100 shadow-sm backdrop-blur-sm"
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
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/contact')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-bold transition-colors flex-1 sm:flex-none justify-center shadow-lg"
              >
                Plan Your Trip <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate('/services')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-gray-50 text-[#172033] text-sm font-bold border border-gray-200 shadow-lg transition-colors flex-1 sm:flex-none justify-center"
              >
                <Building2 size={15} className="text-[#08A9E0]" /> Explore Services
              </button>
            </div>
          </div>

          {/* ── RIGHT — Inquiry panel ── */}
          <div className="pb-6 lg:pt-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
              {/* Tabs */}
              <div className="grid grid-cols-4 border-b border-gray-100">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex flex-col items-center gap-1 py-3 sm:py-3.5 px-1 text-xs font-medium transition-all duration-150 cursor-pointer ${
                      activeTab === id
                        ? 'bg-[#08A9E0] text-white'
                        : 'text-[#667085] hover:text-[#172033] hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={15} />
                    <span className="hidden xs:block sm:block leading-tight text-center">{label}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-5">
                {activeTab === 'flights'    && <FlightInquiryForm compact />}
                {activeTab === 'hotels'     && <HotelInquiryForm compact />}
                {activeTab === 'tours'      && <TourInquiryForm compact />}
                {activeTab === 'assistance' && <AssistanceInquiryForm compact />}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Floating trust bar — sits over the hero image ── */}
      <div id="trust" className="relative z-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 pb-6 -mt-2">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Trust items */}
            <div className="flex items-center gap-6 sm:gap-10 lg:gap-14 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
              {[
                { icon: MapPin,    title: 'CAC Registered',        sub: 'RC 898792' },
                { icon: Building2, title: 'Based in Abuja',         sub: 'FCT, Nigeria' },
                { icon: Phone,     title: 'Full Travel Management', sub: 'End-to-end support' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#EAF8FD] flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#08A9E0]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#101B46] whitespace-nowrap">{title}</p>
                    <p className="text-xs text-[#667085]">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cursive "Explore the World" */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <span className="font-script text-[#08A9E0] text-2xl xl:text-3xl leading-none">
                Explore the World
              </span>
              <Plane size={18} className="text-[#08A9E0] -rotate-12" />
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
