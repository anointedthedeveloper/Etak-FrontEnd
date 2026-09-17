import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, Building2, Map, HelpCircle, ArrowRight, MapPin, Phone } from 'lucide-react'
import FlightInquiryForm from '../forms/FlightInquiryForm'
import HotelInquiryForm from '../forms/HotelInquiryForm'
import TourInquiryForm from '../forms/TourInquiryForm'
import AssistanceInquiryForm from '../forms/AssistanceInquiryForm'

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
  const navigate = useNavigate()

  return (
    <section className="relative flex flex-col overflow-hidden bg-white">

      {/* ── Background image ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img
          src="/brand/hero.png"
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-0 h-full w-full object-cover object-right"
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 pt-20 sm:pt-24 lg:pt-28 pb-0">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-14 items-start">

          {/* ── LEFT ── */}
          <div className="pt-4 sm:pt-8 pb-4">
            <p className="text-[#08A9E0] text-xs font-bold uppercase tracking-widest mb-3">
              Your Journey Starts Here
            </p>

            <h1 className="font-display font-bold text-[#101B46] leading-tight mb-4
                           text-3xl sm:text-4xl md:text-5xl xl:text-6xl">
              Your Reliable{' '}
              <span className="text-[#08A9E0]">Travel Bridge</span>{' '}
              to the World
            </h1>

            <p className="text-[#667085] leading-relaxed mb-6 max-w-lg
                          text-sm sm:text-base lg:text-lg">
              From flight reservations and hotel stays to carefully planned tours, we make every journey easier to arrange — for business, leisure, education, and beyond.
            </p>

            {/* Service icon strip — 2-col on mobile, 4-col from sm */}
            <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
              {serviceIcons.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1.5 p-2.5 sm:p-3 rounded-2xl bg-white/90 border border-gray-100 shadow-sm"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EAF8FD] flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#08A9E0]" />
                  </div>
                  <span className="text-xs font-semibold text-[#172033] leading-tight">{label}</span>
                  <span className="text-xs text-[#667085] leading-tight hidden sm:block">{sub}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/contact')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-semibold transition-colors flex-1 sm:flex-none justify-center"
              >
                Plan Your Trip <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate('/services')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-gray-50 text-[#172033] text-sm font-semibold border border-gray-200 shadow-sm transition-colors flex-1 sm:flex-none justify-center"
              >
                <Building2 size={15} className="text-[#08A9E0]" /> Explore Services
              </button>
            </div>
          </div>

          {/* ── RIGHT — Inquiry panel ── */}
          <div className="pb-6 lg:pt-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
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
