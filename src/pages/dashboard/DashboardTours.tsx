import { Link } from 'react-router-dom'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { tours } from '../../data/tours'
import { Button } from '../../components/ui/Button'

export default function DashboardTours() {
  return (
    <div className="p-4 sm:p-5 xl:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#101B46]">Tours & Packages</h1>
          <p className="text-sm text-[#667085] mt-0.5">Browse available tour packages</p>
        </div>
        <Link to="/tours">
          <Button variant="outline" size="sm">View all tours <ArrowRight size={14} /></Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {tours.map(tour => (
          <div key={tour.id} className="premium-card overflow-hidden flex flex-col">
            <div className="h-44 overflow-hidden">
              <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-3 text-xs text-[#667085] mb-2">
                <span className="flex items-center gap-1"><MapPin size={11} />{tour.destination}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{tour.duration}</span>
              </div>
              <h3 className="font-display font-bold text-[#101B46] text-base mb-1">{tour.title}</h3>
              <p className="text-xs text-[#667085] leading-relaxed mb-4 flex-1 line-clamp-2">{tour.description}</p>
              <Link to={`/contact?service=tour&package=${tour.id}`}>
                <Button variant="primary" size="sm" className="w-full">Enquire now</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

