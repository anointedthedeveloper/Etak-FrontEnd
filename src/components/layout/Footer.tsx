import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, Globe, Send, MessageCircleMore, Users } from 'lucide-react'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/tours', label: 'Tours' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

const serviceLinks = [
  { to: '/services#flight-booking', label: 'Flight Booking & Ticketing' },
  { to: '/services#hotel-reservations', label: 'Hotel Reservations' },
  { to: '/services#tour-packages', label: 'Tour Packages' },
  { to: '/services#visa-assistance', label: 'Visa Assistance' },
  { to: '/services#travel-insurance', label: 'Travel Insurance' },
  { to: '/services#corporate-travel', label: 'Corporate Travel' },
]

export default function Footer() {
  return (
    <footer className="bg-[#101B46] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Etak Travels" className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-full" />
              <div>
                <div className="font-display font-bold text-white text-base leading-tight">Etak Travels</div>
                <div className="text-blue-300 text-xs">& Tours Expert Limited</div>
              </div>
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed mb-5">
              Your reliable travel bridge to the world. Professional travel management for business, leisure, education, and international travel from Abuja, Nigeria.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, href: '#', label: 'Facebook' },
                { icon: Send, href: '#', label: 'Twitter' },
                { icon: MessageCircleMore, href: '#', label: 'Instagram' },
                { icon: Users, href: '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#08A9E0] flex items-center justify-center transition-colors duration-150">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-blue-200 hover:text-[#08A9E0] text-sm transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Our Services</h4>
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-blue-200 hover:text-[#08A9E0] text-sm transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3">
                <MapPin size={16} className="text-[#08A9E0] shrink-0 mt-0.5" />
                <span className="text-blue-200 text-sm leading-relaxed">
                  Block C2, 2014, ACCI Ultra Modern Shopping Centre, Along Umaru Musa Yar'Adua (Airport Road), Piwoyi, Abuja, FCT, Nigeria.
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={16} className="text-[#08A9E0] shrink-0" />
                <a href="mailto:etaktravels15@gmail.com" className="text-blue-200 hover:text-[#08A9E0] text-sm transition-colors">
                  etaktravels15@gmail.com
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={16} className="text-[#08A9E0] shrink-0" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+2348032062242" className="text-blue-200 hover:text-[#08A9E0] text-sm transition-colors">+234 803 206 2242</a>
                  <a href="tel:+2348173588783" className="text-blue-200 hover:text-[#08A9E0] text-sm transition-colors">+234 817 358 8783</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-blue-300 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Etak Travels & Tours Expert Limited. All rights reserved. RC 898792.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-blue-300 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-blue-300 hover:text-white text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
