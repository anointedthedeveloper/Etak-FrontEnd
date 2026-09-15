import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plane, Building2, Map, HelpCircle, ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'
import FlightInquiryForm from '../forms/FlightInquiryForm'
import HotelInquiryForm from '../forms/HotelInquiryForm'
import TourInquiryForm from '../forms/TourInquiryForm'
import AssistanceInquiryForm from '../forms/AssistanceInquiryForm'

const tabs = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'hotels', label: 'Hotels', icon: Building2 },
  { id: 'tours', label: 'Tours', icon: Map },
  { id: 'assistance', label: 'Travel Assistance', icon: HelpCircle },
]

export default function Hero() {
  const [activeTab, setActiveTab] = useState('flights')
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#101B46] via-[#1a2a6c] to-[#45419A]">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2308A9E0' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Image slot overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#101B46]/90 via-[#101B46]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Headline */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#08A9E0] animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Abuja's Trusted Travel Partner</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Reliable{' '}
              <span className="text-[#08A9E0]">Travel Bridge</span>{' '}
              to the World
            </h1>

            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-lg">
              From flight reservations and hotel stays to carefully planned tours, we make every journey easier to arrange — for business, leisure, education, and beyond.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="primary" onClick={() => navigate('/contact')}>
                Plan Your Trip <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="white" onClick={() => navigate('/services')}>
                Explore Services
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { label: 'CAC Registered', sub: 'RC 898792' },
                { label: 'Based in Abuja', sub: 'FCT, Nigeria' },
                { label: 'Full Travel Management', sub: 'End-to-end support' },
              ].map(item => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-white font-semibold text-sm">{item.label}</span>
                  <span className="text-blue-300 text-xs">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Inquiry Panel */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="grid grid-cols-4 border-b border-gray-100">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                      activeTab === tab.id
                        ? 'text-[#08A9E0] border-b-2 border-[#08A9E0] bg-[#EAF8FD]'
                        : 'text-[#667085] hover:text-[#172033] hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="p-5">
              {activeTab === 'flights' && <FlightInquiryForm compact />}
              {activeTab === 'hotels' && <HotelInquiryForm compact />}
              {activeTab === 'tours' && <TourInquiryForm compact />}
              {activeTab === 'assistance' && <AssistanceInquiryForm compact />}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8">
        <a href="#trust" className="flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors">
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown size={18} className="animate-bounce" />
        </a>
      </div>
    </section>
  )
}
