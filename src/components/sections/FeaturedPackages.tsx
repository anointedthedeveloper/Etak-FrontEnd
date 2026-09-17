import { Link } from 'react-router-dom'
import { tours } from '../../data/tours'
import { SectionHeader, ImageSlot } from '../ui/index'
import { Button } from '../ui/Button'
import { Clock, MapPin, ArrowRight } from 'lucide-react'

export default function FeaturedPackages() {
  const featured = tours.filter(t => t.featured)

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeader
            eyebrow="Travel Packages"
            title="Curated Journeys, Carefully Planned"
            subtitle="Carefully planned packages for individuals, families, and groups. Contact us to discuss your itinerary."
          />
          <Link to="/tours" className="shrink-0">
            <Button variant="outline" size="sm">All Packages <ArrowRight size={14} /></Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(tour => (
            <div key={tour.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="relative h-52">
                <ImageSlot
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                  label={tour.title}
                />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-[#667085] mb-3">
                  <span className="flex items-center gap-1"><MapPin size={12} />{tour.destination}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{tour.duration}</span>
                </div>
                <h3 className="font-display font-bold text-[#101B46] text-lg mb-2">{tour.title}</h3>
                <p className="text-[#667085] text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{tour.description}</p>

                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-[#101B46] mb-2">Highlights</h4>
                  <ul className="flex flex-col gap-1">
                    {tour.highlights.slice(0, 3).map(h => (
                      <li key={h} className="flex items-center gap-2 text-xs text-[#667085]">
                        <span className="w-1 h-1 rounded-full bg-[#08A9E0] shrink-0" />{h}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={`/tours#${tour.id}`}>
                  <Button variant="outline" size="sm" className="w-full">Request Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
