import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '../ui/Button'
import { useInView } from '../../hooks/useInView'

export default function FinalCTA() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <div
          ref={ref}
          className={`relative rounded-2xl overflow-hidden min-h-72 sm:min-h-80 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Background photo */}
          <img
            src="/images/sections/cta-bg.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Clean overlay — no blobs, no patterns */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#101B46]/95 via-[#101B46]/85 to-[#101B46]/60" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 py-12 sm:py-16 lg:py-20">
            <span className="text-[#08A9E0] text-xs font-bold tracking-[0.18em] uppercase mb-3 flex items-center gap-2">
              <span className="w-5 h-px bg-[#08A9E0]" />
              Ready to Travel?
              <span className="w-5 h-px bg-[#08A9E0]" />
            </span>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 max-w-2xl leading-tight">
              Let's Plan Your Next Journey Together
            </h2>

            <p className="text-blue-200/80 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
              Whether it's a business trip, a family holiday, or an international adventure — Etak Travels is here to make it happen.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto group">
                  Plan Your Trip <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="tel:+2348032062242" className="w-full sm:w-auto">
                <Button size="lg" variant="white" className="w-full sm:w-auto">
                  <Phone size={17} /> Call Us Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
