import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '../ui/Button'
import { ImageSlot } from '../ui/index'

export default function FinalCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#101B46] to-[#45419A] min-h-80">
          {/* Background image slot */}
          <div className="absolute inset-0 opacity-20">
            <ImageSlot
              src="/src/assets/images/cta-travel.jpg"
              alt="Travel destination"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#101B46]/80 to-[#45419A]/60" />

          {/* Decorative elements */}
          <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-[#08A9E0]/10 blur-2xl" />
          <div className="absolute bottom-8 left-1/3 w-48 h-48 rounded-full bg-[#7654C8]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 sm:py-20">
            <span className="inline-block text-[#08A9E0] text-sm font-semibold tracking-widest uppercase mb-4">Ready to Travel?</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-2xl leading-tight">
              Let's Plan Your Next Journey Together
            </h2>
            <p className="text-blue-200 text-lg max-w-xl mb-8 leading-relaxed">
              Whether it's a business trip, a family holiday, or an international adventure — Etak Travels is here to make it happen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="primary">
                  Plan Your Trip <ArrowRight size={18} />
                </Button>
              </Link>
              <a href="tel:+2348032062242">
                <Button size="lg" variant="white">
                  <Phone size={18} /> Call Us Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
