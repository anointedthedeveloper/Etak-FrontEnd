import { Link } from 'react-router-dom'
import { destinations } from '../../data/destinations'
import { SectionHeader, Badge } from '../ui/index'
import { Button } from '../ui/Button'
import { ArrowRight, Heart, MapPin } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useInView } from '../../hooks/useInView'

export default function FeaturedDestinations() {
  const featured = destinations.filter(d => d.featured)
  const rest = destinations.filter(d => !d.featured).slice(0, 2)
  const smallCards = [...featured.slice(1), ...rest].slice(0, 4)
  const { toggle, has } = useCart()

  const { ref: headerRef, inView: headerVisible } = useInView<HTMLDivElement>()
  const { ref: gridRef,   inView: gridVisible }   = useInView<HTMLDivElement>({ threshold: 0.05 })

  const saveBtn = (dest: typeof destinations[0], size = 14, cls = 'top-3 right-3 w-8 h-8') => (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle({ id: dest.id, type: 'destination', title: dest.name, image: dest.image, subtitle: dest.country }) }}
      className={`absolute ${cls} rounded-full flex items-center justify-center shadow transition-colors duration-150 z-10 ${
        has(dest.id) ? 'bg-[#08A9E0] text-white' : 'bg-white/80 text-[#667085] hover:text-[#08A9E0]'
      }`}
    >
      <Heart size={size} fill={has(dest.id) ? 'currentColor' : 'none'} />
    </button>
  )

  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC]">
      <div className="site-gutter w-full">

        <div
          ref={headerRef}
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 transition-all duration-600 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <SectionHeader
            eyebrow="Destinations"
            title="Where Would You Like to Go?"
            subtitle="Popular destinations for Nigerian travellers — from business hubs to leisure escapes."
          />
          <Link to="/destinations" className="shrink-0 self-start sm:self-auto">
            <Button variant="outline" size="sm">All Destinations <ArrowRight size={14} /></Button>
          </Link>
        </div>

        {/* Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
          {[...(featured[0] ? [featured[0]] : []), ...smallCards].map((dest, i) => (
            <div
              key={dest.id}
              className={`group relative rounded-2xl overflow-hidden bg-[#101B46] cursor-pointer ${i === 0 ? 'sm:col-span-2 min-h-56' : 'min-h-48'}`}
            >
              <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 group-hover:-translate-y-1.5 transition-transform duration-500 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101B46]/90 via-[#101B46]/20 to-transparent" />
              {saveBtn(dest)}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {i === 0 && <div className="flex flex-wrap gap-1.5 mb-2">{dest.category.slice(0, 2).map(c => <Badge key={c} variant="blue">{c}</Badge>)}</div>}
                <h3 className={`font-display font-bold text-white ${i === 0 ? 'text-2xl' : 'text-xl'}`}>{dest.name}</h3>
                <p className="text-blue-200 text-xs mb-2 flex items-center gap-1"><MapPin size={10} />{dest.country}</p>
                <Link to={`/destinations#${dest.id}`} className="text-[#08A9E0] text-xs font-medium hover:underline flex items-center gap-1">Explore <ArrowRight size={11} /></Link>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: asymmetric grid */}
        <div ref={gridRef} className="hidden lg:grid grid-cols-3 gap-5">
          {featured[0] && (
            <div
              className={`col-span-2 row-span-2 group relative rounded-2xl overflow-hidden bg-[#101B46] min-h-[420px] cursor-pointer transition-all duration-600 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              <img src={featured[0].image} alt={featured[0].name} className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101B46]/95 via-[#101B46]/20 to-transparent" />
              {saveBtn(featured[0], 16, 'top-4 right-4 w-9 h-9')}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-3">{featured[0].category.map(c => <Badge key={c} variant="blue">{c}</Badge>)}</div>
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">{featured[0].name}</h3>
                <p className="text-blue-200 text-sm mb-1 flex items-center gap-1"><MapPin size={12} />{featured[0].country}</p>
                <p className="text-white/70 text-sm leading-relaxed mb-5 line-clamp-2">{featured[0].tagline}</p>
                <Link to={`/destinations#${featured[0].id}`}><Button variant="white" size="sm">Explore <ArrowRight size={14} /></Button></Link>
              </div>
            </div>
          )}

          {smallCards.map((dest, i) => (
            <div
              key={dest.id}
              className={`group relative rounded-2xl overflow-hidden bg-[#101B46] min-h-48 cursor-pointer transition-all duration-600 hover:-translate-y-0.5 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${(i + 1) * 80}ms` }}
            >
              <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 group-hover:-translate-y-1.5 transition-transform duration-500 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101B46]/85 to-transparent" />
              {saveBtn(dest)}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-xl font-bold text-white">{dest.name}</h3>
                <p className="text-blue-200 text-xs mb-2 flex items-center gap-1"><MapPin size={10} />{dest.country}</p>
                <Link to={`/destinations#${dest.id}`} className="text-[#08A9E0] text-xs font-medium hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Explore <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
