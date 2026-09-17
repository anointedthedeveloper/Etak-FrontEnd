import { Link } from 'react-router-dom'
import { type ReactNode } from 'react'
import { Plane, Shield, Headphones } from 'lucide-react'

interface Props {
  children: ReactNode
}

const features = [
  { icon: Plane,      title: 'Trusted Travel Partner', sub: 'Safe, reliable and convenient' },
  { icon: Shield,     title: 'Secure Booking',         sub: 'Your information is always protected' },
  { icon: Headphones, title: '24/7 Support',           sub: "We're here whenever you need us" },
]

export default function AuthLayout({ children }: Props) {
  return (
    /* Exactly one viewport height, no page scroll */
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row">

      {/* ── LEFT PANEL — fixed height, no scroll ── */}
      <div className="relative lg:w-[48%] xl:w-[52%] h-44 sm:h-56 lg:h-full flex-shrink-0 overflow-hidden">
        {/* Hero image — scaled down to fit */}
        <img
          src="/brand/hero.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#101B46]/85 via-[#101B46]/65 to-[#1a6cc4]/40" />

        {/* Content — flex column fills the panel */}
        <div className="relative z-10 flex flex-col h-full px-8 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-10">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/brand/logo.png" alt="Etak Travels" className="h-14 w-14 lg:h-16 lg:w-16 object-contain" />
            <div>
              <div className="font-display font-bold text-white text-lg lg:text-xl leading-tight">Etak Travels</div>
              <div className="text-blue-200 text-sm">& Tours Expert Limited</div>
            </div>
          </Link>

          {/* Headline — hidden on small mobile, visible lg+ */}
          <div className="hidden lg:flex flex-col justify-center flex-1 min-h-0">
            <h1 className="font-display font-bold text-white leading-tight mb-4 text-4xl xl:text-5xl">
              Welcome to<br />
              <span className="text-[#08A9E0]">Etak Travels</span>
            </h1>
            <p className="text-blue-200 text-base xl:text-lg leading-relaxed mb-8 max-w-sm">
              Your journey, our priority. Create your account and start exploring the world with us.
            </p>

            {/* Feature tiles */}
            <div className="flex flex-col gap-4">
              {features.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#08A9E0]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold leading-none">{title}</p>
                    <p className="text-blue-300 text-xs mt-1">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tablet: short tagline */}
          <p className="lg:hidden text-white font-display text-lg sm:text-2xl font-bold mt-3">
            Welcome to <span className="text-[#08A9E0]">Etak Travels</span>
          </p>

          {/* Script tagline — bottom, desktop only */}
          <div className="hidden lg:flex items-center gap-2 mt-auto shrink-0">
            <span className="font-script text-white text-2xl xl:text-3xl leading-none">Explore the World</span>
            <Plane size={20} className="text-white -rotate-12" />
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — scrollable internally if form is tall ── */}
      <div className="flex-1 min-h-0 bg-[#F0F6FF] overflow-y-auto flex items-start lg:items-center justify-center p-5 sm:p-8 lg:p-10">
        <div className="w-full max-w-md py-2">
          {children}
        </div>
      </div>

    </div>
  )
}
