import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, MapPin, ArrowRight, Heart } from 'lucide-react'
import { destinations, destinationCategories } from '../data/destinations'
import { Badge } from '../components/ui/index'
import { Button } from '../components/ui/Button'
import SEO from '../components/ui/SEO'
import { useCart } from '../context/CartContext'
import PageHeader from '../components/ui/PageHeader'

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)
  const { toggle, has } = useCart()

  // Initialise query from URL param
  const query = searchParams.get('q') ?? ''
  const setQuery = (val: string) => {
    if (val) setSearchParams({ q: val }, { replace: true })
    else setSearchParams({}, { replace: true })
  }

  // Sync category from URL if it matches
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      const match = destinationCategories.find(c => c.label.toLowerCase().includes(q.toLowerCase()))
      if (match && match.id !== 'all') setCategory(match.id)
    }
  }, [])

  const filtered = destinations.filter(d => {
    const matchesQuery = !query || d.name.toLowerCase().includes(query.toLowerCase()) || d.country.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'all' || d.category.includes(category)
    return matchesQuery && matchesCategory
  })

  return (
    <>
      <SEO
        title="Destinations"
        description="Explore popular travel destinations from Nigeria — Dubai, London, Istanbul, Paris, New York, Accra, Nairobi and more. Etak Travels arranges flights, hotels and tours to destinations worldwide."
        keywords="travel destinations Nigeria, Dubai from Abuja, London from Nigeria, Istanbul tour Nigeria, Paris travel Nigeria, Accra from Abuja, international travel Nigeria"
        url="/destinations"
        image="/images/headers/destinations.jpg"
      />
      {/* Header */}
      <PageHeader
        eyebrow="Destinations"
        title="Explore the World with Etak"
        subtitle="Popular destinations for Nigerian travellers — from business hubs to leisure escapes and cultural experiences."
        image="/images/headers/destinations.jpg"
        centered
      >
        <div className="max-w-md mx-auto relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-[#172033] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#08A9E0] text-sm"
          />
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 sticky top-[64px] z-30">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="flex gap-1.5 overflow-x-auto py-3 scrollbar-hide">
            {destinationCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                  category === cat.id
                    ? 'bg-[#101B46] text-white border-[#101B46] shadow-sm'
                    : 'bg-white text-[#667085] border-gray-200 hover:border-[#101B46]/40 hover:text-[#101B46]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations grid */}
      <section className="py-12 sm:py-16 bg-[#F8FAFC]">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#667085] text-lg">No destinations found for your search.</p>
              <button onClick={() => { setQuery(''); setCategory('all') }} className="mt-4 text-[#08A9E0] font-medium hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(dest => (
                <div
                  key={dest.id}
                  id={dest.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                  onClick={() => setSelected(selected === dest.id ? null : dest.id)}
                >
                  <div className="relative h-52 overflow-hidden rounded-t-2xl">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101B46]/70 to-transparent" />
                    <button
                      onClick={e => { e.stopPropagation(); toggle({ id: dest.id, type: 'destination', title: dest.name, image: dest.image, subtitle: dest.country }) }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors z-10 ${
                        has(dest.id) ? 'bg-[#08A9E0] text-white' : 'bg-white/80 text-[#667085] hover:text-[#08A9E0]'
                      }`}
                    >
                      <Heart size={14} fill={has(dest.id) ? 'currentColor' : 'none'} />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {dest.category.slice(0, 2).map(c => <Badge key={c} variant="blue">{c}</Badge>)}
                      </div>
                      <h3 className="font-display font-bold text-white text-xl">{dest.name}</h3>
                      <p className="text-blue-200 text-xs flex items-center gap-1"><MapPin size={10} />{dest.country}</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-[#667085] text-sm italic mb-3">"{dest.tagline}"</p>
                    <button className="text-[#08A9E0] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                      {selected === dest.id ? 'Close details' : 'View details'} <ArrowRight size={14} />
                    </button>
                  </div>

                  {selected === dest.id && (
                    <div className="border-t border-gray-100 p-4 bg-[#F8FAFC]" onClick={e => e.stopPropagation()}>
                      <p className="text-sm text-[#172033] leading-relaxed mb-3">{dest.description}</p>
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-[#101B46] mb-2">Highlights</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {dest.highlights.map(h => (
                            <span key={h} className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs text-[#667085]">{h}</span>
                          ))}
                        </div>
                      </div>
                      {dest.travelTips && (
                        <div className="bg-[#EAF8FD] rounded-lg p-3 mb-3">
                          <p className="text-xs text-[#08A9E0] font-medium">Travel Note</p>
                          <p className="text-xs text-[#172033] mt-0.5">{dest.travelTips}</p>
                        </div>
                      )}
                      <Link to="/contact" state={{ destination: dest.name }}>
                        <Button variant="primary" size="sm" className="w-full">Plan a Trip Here</Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101B46] mb-4">Don't See Your Destination?</h2>
          <p className="text-[#667085] text-sm sm:text-base mb-6 sm:mb-8">We arrange travel to destinations worldwide. Contact us and we'll help plan your journey wherever you need to go.</p>
          <Link to="/contact">
            <Button size="lg" variant="primary">Enquire About Any Destination</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
