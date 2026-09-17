import { Link } from 'react-router-dom'
import { destinations } from '../../data/destinations'
import { SectionHeader, Badge } from '../ui/index'
import { Button } from '../ui/Button'
import { ArrowRight } from 'lucide-react'

export default function FeaturedDestinations() {
  const featured = destinations.filter(d => d.featured)
  const rest = destinations.filter(d => !d.featured).slice(0, 2)
  const smallCards = [...featured.slice(1), ...rest].slice(0, 4)

  return (
    <section className="py-14 sm:py-20 bg-[#F8FAFC]">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeader
            eyebrow="Destinations"
            title="Where Would You Like to Go?"
            subtitle="Popular destinations for Nigerian travellers — from business hubs to leisure escapes."
          />
          <Link to="/destinations" className="shrink-0 self-start sm:self-auto">
            <Button variant="outline" size="sm">All Destinations <ArrowRight size={14} /></Button>
          </Link>
        </div>

        {/* Mobile: simple vertical stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
          {[...(featured[0] ? [featured[0]] : []), ...smallCards].map((dest, i) => (
            <div key={dest.id} className={`group relative rounded-2xl overflow-hidden bg-[#101B46] ${i === 0 ? 'sm:col-span-2 min-h-56' : 'min-h-48'}`}>
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101B46]/85 via-[#101B46]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {i === 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {dest.category.slice(0, 2).map(c => <Badge key={c} variant="blue">{c}</Badge>)}
                  </div>
                )}
                <h3 className={`font-display font-bold text-white ${i === 0 ? 'text-2xl' : 'text-xl'}`}>{dest.name}</h3>
                <p className="text-blue-200 text-xs mb-2">{dest.country}</p>
                <Link to={`/destinations#${dest.id}`} className="text-[#08A9E0] text-xs font-medium hover:underline flex items-center gap-1">
                  Explore <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: asymmetric grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {/* Large featured card spans 2 cols and 2 rows */}
          {featured[0] && (
            <div className="col-span-2 row-span-2 group relative rounded-2xl overflow-hidden bg-[#101B46] min-h-[420px]">
              <img
                src={featured[0].image}
                alt={featured[0].name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101B46]/90 via-[#101B46]/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {featured[0].category.map(c => <Badge key={c} variant="blue">{c}</Badge>)}
                </div>
                <h3 className="font-display text-3xl font-bold text-white mb-1">{featured[0].name}</h3>
                <p className="text-blue-200 text-sm mb-1">{featured[0].country}</p>
                <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-2">{featured[0].tagline}</p>
                <Link to={`/destinations#${featured[0].id}`}>
                  <Button variant="white" size="sm">Explore <ArrowRight size={14} /></Button>
                </Link>
              </div>
            </div>
          )}

          {/* Smaller cards */}
          {smallCards.map(dest => (
            <div key={dest.id} className="group relative rounded-2xl overflow-hidden bg-[#101B46] min-h-48">
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101B46]/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-xl font-bold text-white">{dest.name}</h3>
                <p className="text-blue-200 text-xs mb-2">{dest.country}</p>
                <Link to={`/destinations#${dest.id}`} className="text-[#08A9E0] text-xs font-medium hover:underline flex items-center gap-1">
                  Explore <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
