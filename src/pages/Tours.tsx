import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Clock, MapPin, Users, ChevronDown, ChevronUp, ArrowRight, Heart } from 'lucide-react'
import { tours, tourCategories } from '../data/tours'
import { SectionHeader } from '../components/ui/index'
import { Button } from '../components/ui/Button'
import SEO from '../components/ui/SEO'
import { useCart } from '../context/CartContext'

export default function Tours() {
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const { toggle, has } = useCart()

  // Sync category filter if navigated from search
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      const match = tourCategories.find(c => c.label.toLowerCase().includes(q.toLowerCase()))
      if (match) setCategory(match.id)
    }
  }, [searchParams])

  const q = searchParams.get('q')?.toLowerCase() ?? ''
  const filtered = tours.filter(t => {
    const matchesCategory = category === 'all' || t.category === category || t.groupType === category
    const matchesQuery = !q || t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    return matchesCategory && matchesQuery
  })

  return (
    <>
      <SEO
        title="Tours & Travel Packages"
        description="Browse Etak Travels tour packages — Dubai, Istanbul, London, Accra and more. Carefully planned packages for individuals, families and groups departing from Nigeria."
        keywords="Etak tour packages, Dubai tour Nigeria, Istanbul tour Abuja, London package Nigeria, Accra tour Nigeria, group tours Nigeria, holiday packages Abuja"
        url="/tours"
        image="/images/headers/tours.jpg"
      />
      {/* Header */}
      <div className="relative bg-[#101B46] pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
        <img
          src="/images/headers/tours.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#101B46]/80 to-[#45419A]/70" />
        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-24 text-center">
          <span className="inline-block text-[#08A9E0] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">Tours & Packages</span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Curated Travel Experiences</h1>
          <p className="text-blue-200 text-base sm:text-lg max-w-2xl mx-auto">
            Carefully planned tour packages for individuals, families, and groups — tailored to your journey.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 sticky top-[72px] z-30">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-3 flex gap-2 overflow-x-auto">
          {tourCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                category === cat.id ? 'bg-[#101B46] text-white' : 'bg-gray-100 text-[#667085] hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>


      {/* Tours list */}
      <section className="py-12 sm:py-16 bg-[#F8FAFC]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#667085] text-lg">No tours found for your search.</p>
              <button
                onClick={() => { setCategory('all'); window.history.replaceState({}, '', '/tours') }}
                className="mt-4 text-[#08A9E0] font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
          <div className="flex flex-col gap-6">
            {filtered.map(tour => (
              <div key={tour.id} id={tour.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Image */}
                  <div className="relative h-52 md:h-auto min-h-48 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={e => { e.stopPropagation(); toggle({ id: tour.id, type: 'tour', title: tour.title, image: tour.image, subtitle: tour.destination }) }}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
                        has(tour.id) ? 'bg-[#08A9E0] text-white' : 'bg-white/90 text-[#667085] hover:text-[#08A9E0]'
                      }`}
                      title={has(tour.id) ? 'Remove from saved' : 'Save package'}
                    >
                      <Heart size={16} fill={has(tour.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-6 flex flex-col">
                    <div className="flex flex-wrap gap-3 text-xs text-[#667085] mb-3">
                      <span className="flex items-center gap-1"><MapPin size={12} />{tour.destination}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{tour.duration}</span>
                      <span className="flex items-center gap-1"><Users size={12} />{tour.groupType === 'group' ? 'Group Tour' : 'Individual / Private'}</span>
                    </div>

                    <h3 className="font-display font-bold text-[#101B46] text-2xl mb-3">{tour.title}</h3>
                    <p className="text-[#667085] text-sm leading-relaxed mb-4 flex-1">{tour.description}</p>

                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-[#101B46] uppercase tracking-wide mb-2">Highlights</h4>
                      <div className="flex flex-wrap gap-2">
                        {tour.highlights.map(h => (
                          <span key={h} className="px-2.5 py-1 bg-[#EAF8FD] text-[#08A9E0] rounded-full text-xs font-medium">{h}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setExpanded(expanded === tour.id ? null : tour.id)}
                        className="flex items-center gap-1 text-sm font-medium text-[#667085] hover:text-[#172033] transition-colors"
                      >
                        {expanded === tour.id ? <><ChevronUp size={16} /> Hide itinerary</> : <><ChevronDown size={16} /> View itinerary</>}
                      </button>
                      <Link to="/contact" state={{ tour: tour.id }}>
                        <Button variant="primary" size="sm">Request Details <ArrowRight size={13} /></Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Expanded itinerary */}
                {expanded === tour.id && (
                  <div className="border-t border-gray-100 p-6 bg-[#F8FAFC]">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-[#101B46] mb-4">Suggested Itinerary</h4>
                        <div className="flex flex-col gap-3">
                          {tour.itinerary.map(day => (
                            <div key={day.day} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#101B46] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                {day.day}
                              </div>
                              <div>
                                <div className="font-medium text-[#101B46] text-sm">{day.title}</div>
                                <div className="text-[#667085] text-xs leading-relaxed">{day.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#101B46] mb-4">Important Information</h4>
                        <ul className="flex flex-col gap-2">
                          {tour.importantInfo.map(info => (
                            <li key={info} className="flex items-start gap-2 text-sm text-[#667085]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#08A9E0] shrink-0 mt-1.5" />{info}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6">
                          <Link to="/contact" state={{ tour: tour.id }}>
                            <Button variant="secondary" className="w-full">Enquire About This Package</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Custom tour CTA */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 text-center">
          <SectionHeader
            eyebrow="Custom Tours"
            title="Need a Custom Itinerary?"
            subtitle="We design personalised travel packages for individuals, families, and groups. Tell us where you want to go and we'll plan the rest."
            centered
          />
          <Link to="/contact" state={{ type: 'tour' }}>
            <Button size="lg" variant="primary">Request a Custom Tour</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
