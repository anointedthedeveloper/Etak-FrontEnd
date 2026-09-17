import { Link, useNavigate } from 'react-router-dom'
import { Plane, Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101B46] via-[#1a2a6c] to-[#45419A] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">

      {/* Decorative blurs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#08A9E0]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#45419A]/20 blur-3xl pointer-events-none" />

      {/* Logo */}
      <Link to="/" className="mb-10 flex items-center gap-2 relative z-10">
        <img src="/brand/logo.png" alt="Etak Travels" className="h-12 w-12 object-contain" />
        <div className="text-left">
          <div className="font-display font-bold text-white text-sm leading-tight">Etak Travels</div>
          <div className="text-blue-300 text-xs">& Tours Expert Limited</div>
        </div>
      </Link>

      {/* Big 404 */}
      <div className="relative z-10 mb-6">
        <p className="font-display font-bold text-[#08A9E0] leading-none select-none"
           style={{ fontSize: 'clamp(7rem, 20vw, 14rem)' }}>
          404
        </p>
        {/* Plane flying through */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
          <Plane size={160} className="text-white -rotate-12" />
        </div>
      </div>

      {/* Message */}
      <div className="relative z-10 max-w-md mb-10">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
          Destination Not Found
        </h1>
        <p className="text-blue-200 text-base leading-relaxed">
          Looks like this page took a wrong turn. The route you're looking for doesn't exist — but we can get you back on track.
        </p>
      </div>

      {/* Actions */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3 mb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-colors"
        >
          <ArrowLeft size={15} /> Go Back
        </button>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-semibold transition-colors"
        >
          <Home size={15} /> Back to Home
        </Link>
        <Link
          to="/contact"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-colors"
        >
          <Search size={15} /> Plan a Trip
        </Link>
      </div>

      {/* Quick links */}
      <div className="relative z-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-blue-300">
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
