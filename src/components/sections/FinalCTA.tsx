import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '../ui/Button'

export default function FinalCTA() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="relative rounded-3xl overflow-hidden min-h-72 sm:min-h-80">
          {/* Real background image */}
          <img
            src="/images/sections/cta-bg.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#101B46]/92 via-[#101B46]/80 to-[#45419A]/70" />

          {/* Decorative blurs */}
          <div className="absolute top-6 right-6 w-28 h-28 rounded-full bg-[#08A9E0]/15 blur-2xl pointer-events-none" />
          <div className="absolute bottom-6 left-1/3 w-40 h-40 rounded-full bg-[#7654C8]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center px-6 py-12 sm:py-16 lg:py-20">
            <span className="text-[#08A9E0] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
              Ready to Travel?
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 max-w-2xl leading-tight">
              Let's Plan Your Next Journey Together
            </h2>
            <p className="text-blue-200 text-sm sm:text-base lg:text-lg max-w-xl mb-8 leading-relaxed">
              Whether it's a business trip, a family holiday, or an international adventure — Etak Travels is here to make it happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto">
                  Plan Your Trip <ArrowRight size={17} />
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
