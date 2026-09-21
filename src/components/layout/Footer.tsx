import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, Plane } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { useRevealChildren } from '../../hooks/useInView'

const quickLinks = [
  { to: '/',            label: 'Home' },
  { to: '/about',       label: 'About Us' },
  { to: '/services',    label: 'Services' },
  { to: '/destinations',label: 'Destinations' },
  { to: '/tours',       label: 'Tours' },
  { to: '/contact',     label: 'Contact' },
]

const serviceLinks = [
  { to: '/services#flight-booking',   label: 'Flight Booking & Ticketing' },
  { to: '/services#hotel-reservations',label: 'Hotel Reservations' },
  { to: '/services#tour-packages',    label: 'Tour Packages' },
  { to: '/services#visa-assistance',  label: 'Visa Assistance' },
  { to: '/services#travel-insurance', label: 'Travel Insurance' },
  { to: '/services#corporate-travel', label: 'Corporate Travel' },
]

const socials = [
  { icon: FaFacebookF,  href: 'https://www.facebook.com/etaktravelsandtours',  label: 'Facebook' },
  { icon: FaInstagram,  href: 'https://www.instagram.com/etaktravelsandtours', label: 'Instagram' },
  { icon: FaTwitter,    href: '#', label: 'Twitter' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  { icon: FaWhatsapp,   href: 'https://wa.me/2348032062242',                   label: 'WhatsApp' },
]

export default function Footer() {
  const colsRef = useRevealChildren<HTMLDivElement>()

  return (
    <footer className="relative bg-[#0B1438] overflow-hidden">

      {/* ── Top wave divider ── */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1440 64" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,0 C480,64 960,0 1440,48 L1440,0 Z" fill="white" />
        </svg>
      </div>

      {/* ── Background decorations ── */}
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#08A9E0]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#08A9E0]/8 blur-3xl pointer-events-none" />

      {/* ── Floating plane decoration ── */}
      <div className="absolute top-24 right-16 text-[#08A9E0]/8 pointer-events-none hidden lg:block">
        <Plane size={120} className="rotate-12 animate-float" />
      </div>

      <div className="site-gutter relative z-10 w-full pt-24 pb-8">

        {/* ── Columns ── */}
        <div ref={colsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="reveal lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/brand/logo.png" alt="Etak Travels" className="h-14 w-14 object-contain" />
              <div>
                <div className="font-display font-bold text-white text-base leading-tight">Etak Travels</div>
                <div className="text-blue-300/70 text-xs">& Tours Expert Limited</div>
              </div>
            </Link>
            <p className="text-blue-200/70 text-sm leading-relaxed mb-5">
              Your reliable travel bridge to the world. Professional travel management for business, leisure, education, and international travel from Abuja, Nigeria.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-blue-300 hover:bg-[#08A9E0] hover:text-white hover:border-[#08A9E0] hover:shadow-lg hover:shadow-[#08A9E0]/25 hover:-translate-y-0.5 flex items-center justify-center transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="reveal stagger-2">
            <h4 className="font-semibold text-white mb-5 text-sm tracking-widest uppercase">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-blue-200/70 hover:text-[#08A9E0] text-sm transition-all duration-150 hover:translate-x-1.5 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#08A9E0]/40 group-hover:bg-[#08A9E0] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="reveal stagger-3">
            <h4 className="font-semibold text-white mb-5 text-sm tracking-widest uppercase">Our Services</h4>
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-blue-200/70 hover:text-[#08A9E0] text-sm transition-all duration-150 hover:translate-x-1.5 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#08A9E0]/40 group-hover:bg-[#08A9E0] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="reveal stagger-4">
            <h4 className="font-semibold text-white mb-5 text-sm tracking-widest uppercase">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#08A9E0]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-[#08A9E0]" />
                </div>
                <span className="text-blue-200/70 text-sm leading-relaxed">
                  Block C2, 2014, ACCI Ultra Modern Shopping Centre, Along Umaru Musa Yar'Adua (Airport Road), Piwoyi, Abuja, FCT, Nigeria.
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg bg-[#08A9E0]/10 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-[#08A9E0]" />
                </div>
                <a href="mailto:info@etaktravels.com" className="text-blue-200/70 hover:text-[#08A9E0] text-sm transition-colors">
                  info@etaktravels.com
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg bg-[#08A9E0]/10 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-[#08A9E0]" />
                </div>
                <div className="flex flex-col gap-1">
                  <a href="tel:+2348032062242" className="text-blue-200/70 hover:text-[#08A9E0] text-sm transition-colors">+234 803 206 2242</a>
                  <a href="tel:+2348173588783" className="text-blue-200/70 hover:text-[#08A9E0] text-sm transition-colors">+234 817 358 8783</a>
                </div>
              </li>
              <li className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <FaWhatsapp size={14} className="text-[#25D366]" />
                </div>
                <a href="https://wa.me/2348032062242" target="_blank" rel="noopener noreferrer" className="text-blue-200/70 hover:text-[#25D366] text-sm transition-colors">
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-blue-300/50 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Etak Travels & Tours Expert Limited. All rights reserved. RC 898792.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-blue-300/50 hover:text-[#08A9E0] text-xs transition-colors">Privacy Policy</Link>
            <span className="text-white/20">|</span>
            <Link to="/terms" className="text-blue-300/50 hover:text-[#08A9E0] text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
