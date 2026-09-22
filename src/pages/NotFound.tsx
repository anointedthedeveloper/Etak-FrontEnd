import { Link, useNavigate } from 'react-router-dom'
import { Plane, Home, ArrowLeft, MapPin, Compass } from 'lucide-react'
import SEO from '../components/ui/SEO'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101B46] via-[#075D82] to-[#087EAF] flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." noIndex />

      {/* Decorative texture + blurs */}
      <div className="absolute inset-0 dot-grid opacity-[0.07] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#08A9E0]/10 blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#08A9E0]/20 blur-3xl pointer-events-none animate-float-rev" />
      <div className="absolute orbit-ring hidden md:block pointer-events-none" style={{ top: '50%', left: '50%', width: '640px', height: '640px', transform: 'translate(-50%,-50%)' }} />

      {/* Logo */}
      <Link to="/" className="animate-fade-in mb-8 flex items-center gap-2 relative z-10">
        <img src="/brand/logo.png" alt="Etak Travels" className="h-12 w-12 object-contain" />
        <div className="text-left">
          <div className="font-display font-bold text-white text-sm leading-tight">Etak Travels</div>
          <div className="text-blue-300 text-xs">& Tours Expert Limited</div>
        </div>
      </Link>

      {/* Eyebrow */}
      <span className="animate-fade-in relative z-10 inline-flex items-center gap-2 text-[#08A9E0] text-xs font-bold tracking-[0.18em] uppercase mb-4">
        <Compass size={13} className="animate-spin-slow" /> Error 404
      </span>

      {/* Big 404 */}
      <div className="animate-pop-in relative z-10 mb-4">
        <p className="font-display font-bold text-[#08A9E0] leading-none select-none"
           style={{ fontSize: 'clamp(6rem, 18vw, 12rem)' }}>
          404
        </p>
        {/* Plane flying through */}
        <Plane size={140} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 -rotate-12 pointer-events-none" />
      </div>

      {/* Message */}
      <div className="animate-fade-up relative z-10 max-w-md mb-9" style={{ animationDelay: '0.15s' }}>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
          Looks Like You've Gone Off Course
        </h1>
        <p className="text-blue-200 text-base leading-relaxed">
          The page you're looking for doesn't exist, may have moved, or the link might be outdated. Let's get you back on track.
        </p>
      </div>

      {/* Actions */}
      <div className="animate-slide-up relative z-10 flex flex-col sm:flex-row gap-3 mb-12" style={{ animationDelay: '0.3s' }}>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-bold transition-all shadow-lg shadow-[#08A9E0]/25 hover:shadow-xl hover:-translate-y-0.5"
        >
          <Home size={15} /> Back to Home
        </Link>
        <Link
          to="/contact"
          className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-colors"
        >
          <MapPin size={15} /> Plan a Trip
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-blue-200 hover:text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={15} /> Go Back
        </button>
      </div>

      {/* Quick links */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-blue-300 w-full max-w-md">
        {[
          { to: '/services',     label: 'Services' },
          { to: '/destinations', label: 'Destinations' },
          { to: '/tours',        label: 'Tours' },
          { to: '/about',        label: 'About Us' },
        ].map(({ to, label }) => (
          <Link key={to} to={to} className="hover:text-white transition-colors hover:underline">
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
