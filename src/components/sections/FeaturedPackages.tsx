import { Link } from 'react-router-dom'
import { tours } from '../../data/tours'
import { SectionHeader } from '../ui/index'
import { Button } from '../ui/Button'
import { Clock, MapPin, ArrowRight, Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useRevealChildren } from '../../hooks/useInView'

export default function FeaturedPackages() {
  const featured = tours.filter(t => t.featured)
  const { toggle, has } = useCart()
  const gridRef = useRevealChildren<HTMLDivElement>()

  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC]">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeader
            eyebrow="Travel Packages"
            title="Curated Journeys, Carefully Planned"
            subtitle="Packages for individuals, families, and groups — contact us to discuss your itinerary."
          />
          <Link to="/tours" className="shrink-0">
            <Button variant="outline" size="sm">All Packages <ArrowRight size={14} /></Button>
          </Link>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((tour, i) => (
            <div
              key={tour.id}
              className={`reveal stagger-${i + 1} group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col`}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Subtle bottom gradient so text on image would be readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Category pill */}
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#101B46]/80 text-white text-[10px] font-semibold uppercase tracking-wide rounded-full backdrop-blur-sm">
                  {tour.category}
                </span>

                {/* Wishlist */}
                <button
                  onClick={e => { e.preventDefault(); toggle({ id: tour.id, type: 'tour', title: tour.title, image: tour.image, subtitle: tour.destination }) }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors duration-150 ${
                    has(tour.id) ? 'bg-[#08A9E0] text-white' : 'bg-white/90 text-[#667085] hover:text-[#08A9E0]'
                  }`}
                >
                  <Heart size={14} fill={has(tour.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-[#667085] mb-3">
                  <span className="flex items-center gap-1"><MapPin size={11} className="text-[#08A9E0]" />{tour.destination}</span>
                  <span className="flex items-center gap-1"><Clock size={11} className="text-[#08A9E0]" />{tour.duration}</span>
                </div>

                <h3 className="font-display font-bold text-[#101B46] text-lg mb-2 leading-snug">{tour.title}</h3>
                <p className="text-[#667085] text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{tour.description}</p>

                <ul className="flex flex-col gap-1.5 mb-5">
                  {tour.highlights.slice(0, 3).map(h => (
                    <li key={h} className="flex items-center gap-2 text-xs text-[#667085]">
                      <span className="w-1 h-1 rounded-full bg-[#08A9E0] shrink-0" />{h}
                    </li>
                  ))}
                </ul>

                <Link to={`/tours#${tour.id}`}>
                  <Button variant="primary" size="sm" className="w-full">
                    Request Details <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
