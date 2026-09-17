import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa'

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

const socials = [
  { icon: FaFacebookF,  href: 'https://www.facebook.com/etaktravelsandtours',  label: 'Facebook' },
  { icon: FaInstagram,  href: 'https://www.instagram.com/etaktravelsandtours', label: 'Instagram' },
  { icon: FaTwitter,    href: '#', label: 'Twitter' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/brand/logo.png" alt="Etak Travels" className="h-14 w-14 object-contain" />
              <div>
                <div className="font-display font-bold text-[#101B46] text-base leading-tight">Etak Travels</div>
                <div className="text-[#667085] text-xs">& Tours Expert Limited</div>
              </div>
            </Link>
            <p className="text-[#667085] text-sm leading-relaxed mb-5">
              Your reliable travel bridge to the world. Professional travel management for business, leisure, education, and international travel from Abuja, Nigeria.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-[#667085] hover:bg-[#08A9E0] hover:text-white hover:border-[#08A9E0] hover:shadow-md hover:shadow-[#08A9E0]/20 flex items-center justify-center transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[#101B46] mb-4 text-sm tracking-wide uppercase">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[#667085] hover:text-[#08A9E0] text-sm transition-colors duration-150 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-[#101B46] mb-4 text-sm tracking-wide uppercase">Our Services</h4>
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[#667085] hover:text-[#08A9E0] text-sm transition-colors duration-150 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-[#101B46] mb-4 text-sm tracking-wide uppercase">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3">
                <MapPin size={16} className="text-[#08A9E0] shrink-0 mt-0.5" />
                <span className="text-[#667085] text-sm leading-relaxed">
                  Block C2, 2014, ACCI Ultra Modern Shopping Centre, Along Umaru Musa Yar'Adua (Airport Road), Piwoyi, Abuja, FCT, Nigeria.
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={16} className="text-[#08A9E0] shrink-0" />
                <a href="mailto:info@etakstravel.com" className="text-[#667085] hover:text-[#08A9E0] text-sm transition-colors">
                  info@etakstravel.com
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={16} className="text-[#08A9E0] shrink-0" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+2348032062242" className="text-[#667085] hover:text-[#08A9E0] text-sm transition-colors">+234 803 206 2242</a>
                  <a href="tel:+2348173588783" className="text-[#667085] hover:text-[#08A9E0] text-sm transition-colors">+234 817 358 8783</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[#667085] text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Etak Travels & Tours Expert Limited. All rights reserved. RC 898792.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-[#667085] hover:text-[#08A9E0] text-xs transition-colors">Privacy Policy</Link>
            <span className="text-gray-300">|</span>
            <Link to="/terms" className="text-[#667085] hover:text-[#08A9E0] text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
