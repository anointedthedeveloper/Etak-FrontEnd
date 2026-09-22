import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Menu, X, ChevronDown, User, LogOut, LayoutDashboard,
  Search, Home, Briefcase, Globe, Map, Info, Mail, ArrowRight,
  Heart, Trash2, MapPin, Clock,
  Plane, Building2, MessageSquare, FileCheck, Shield, Navigation, Headphones, Sunset,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import Avatar from '../ui/Avatar'
import { destinations } from '../../data/destinations'
import { tours } from '../../data/tours'
import { services } from '../../data/services'

const serviceIconMap: Record<string, React.ElementType> = {
  Plane, Building2, Map, MessageSquare, FileCheck, Shield, Navigation,
  HeadphonesIcon: Headphones, Sunset, Briefcase,
}

const navLinks = [
  { to: '/',             label: 'Home',         icon: Home },
  { to: '/about',        label: 'About Us',     icon: Info },
  { to: '/services',     label: 'Services',     icon: Briefcase, hasDropdown: true },
  { to: '/destinations', label: 'Destinations', icon: Globe },
  { to: '/tours',        label: 'Tours',        icon: Map },
  { to: '/contact',      label: 'Contact',      icon: Mail },
]

type Suggestion = {
  id: string
  label: string
  sublabel: string
  type: 'destination' | 'tour'
  image: string
  href: string
}

function buildSuggestions(q: string): Suggestion[] {
  if (!q.trim()) return []
  const lower = q.toLowerCase()

  const destMatches: Suggestion[] = destinations
    .filter(d =>
      d.name.toLowerCase().includes(lower) ||
      d.country.toLowerCase().includes(lower) ||
      d.region.toLowerCase().includes(lower) ||
      d.category.some(c => c.toLowerCase().includes(lower))
    )
    .slice(0, 4)
    .map(d => ({
      id: `dest-${d.id}`,
      label: d.name,
      sublabel: d.country,
      type: 'destination',
      image: d.image,
      href: `/destinations?q=${encodeURIComponent(d.name)}`,
    }))

  const tourMatches: Suggestion[] = tours
    .filter(t =>
      t.title.toLowerCase().includes(lower) ||
      t.destination.toLowerCase().includes(lower) ||
      t.category.toLowerCase().includes(lower) ||
      t.highlights.some(h => h.toLowerCase().includes(lower))
    )
    .slice(0, 4)
    .map(t => ({
      id: `tour-${t.id}`,
      label: t.title,
      sublabel: t.destination,
      type: 'tour',
      image: t.image,
      href: `/tours?q=${encodeURIComponent(t.title)}`,
    }))

  return [...destMatches, ...tourMatches].slice(0, 6)
}

function SearchBox({ onClose, mobile = false }: { onClose: () => void; mobile?: boolean }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    setSuggestions(buildSuggestions(query))
    setActiveIdx(-1)
  }, [query])

  const commit = useCallback((href: string) => {
    navigate(href)
    setQuery('')
    setSuggestions([])
    onClose()
  }, [navigate, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeIdx >= 0 && suggestions[activeIdx]) {
      commit(suggestions[activeIdx].href)
      return
    }
    const q = query.trim()
    if (!q) return
    // Smart routing: if query looks like a tour keyword go to tours, else destinations
    const tourKeywords = ['package', 'tour', 'days', 'night', 'business', 'cultural', 'explorer', 'discovery']
    const isTourSearch = tourKeywords.some(k => q.toLowerCase().includes(k)) ||
      tours.some(t => t.title.toLowerCase().includes(q.toLowerCase()) || t.destination.toLowerCase().includes(q.toLowerCase()))
    commit(isTourSearch ? `/tours?q=${encodeURIComponent(q)}` : `/destinations?q=${encodeURIComponent(q)}`)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)) }
    if (e.key === 'Escape')    { onClose() }
    if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); commit(suggestions[activeIdx].href) }
  }

  return (
    <div className={`relative ${mobile ? 'w-full' : ''}`}>
      <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${mobile ? 'w-full' : ''}`}>
        {mobile && <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search destinations or tours..."
          className={`text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#08A9E0] ${
            mobile
              ? 'w-full pl-9 pr-4 py-2.5 rounded-full'
              : 'w-56 px-3 py-1.5 rounded-full'
          }`}
        />
        {!mobile && (
          <>
            <button type="submit" className="p-1.5 rounded-full bg-[#08A9E0] text-white hover:bg-[#0798C8]">
              <Search size={14} />
            </button>
            <button type="button" onClick={onClose} className="p-1.5 rounded-full text-[#667085] hover:bg-gray-100">
              <X size={14} />
            </button>
          </>
        )}
      </form>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className={`absolute top-full mt-2 bg-white rounded-card shadow-float border border-gray-100 overflow-hidden z-50 ${mobile ? 'left-0 right-0' : 'left-0 w-80'}`}>
          {suggestions.map((s, i) => (
            <button
              key={s.id}
              onMouseDown={e => { e.preventDefault(); commit(s.href) }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                i === activeIdx ? 'bg-[#EAF8FD]' : 'hover:bg-gray-50'
              } ${i > 0 ? 'border-t border-gray-50' : ''}`}
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                <img src={s.image} alt={s.label} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#172033] truncate">{s.label}</p>
                <p className="text-xs text-[#667085] flex items-center gap-1">
                  {s.type === 'destination' ? <MapPin size={10} /> : <Clock size={10} />}
                  {s.sublabel}
                </p>
              </div>
              <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full shrink-0 ${
                s.type === 'tour' ? 'bg-[#EAF8FD] text-[#08A9E0]' : 'bg-[#101B46]/10 text-[#101B46]'
              }`}>
                {s.type}
              </span>
            </button>
          ))}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-[#F8FAFC]">
            <button
              onMouseDown={e => { e.preventDefault(); handleSubmit(e as unknown as React.FormEvent) }}
              className="text-xs text-[#08A9E0] font-medium hover:underline flex items-center gap-1"
            >
              <Search size={11} /> Search all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen]       = useState(false)
  const [userMenuOpen, setUserMenuOpen]   = useState(false)
  const [searchOpen, setSearchOpen]       = useState(false)
  const [wishlistOpen, setWishlistOpen]   = useState(false)
  const [servicesOpen, setServicesOpen]   = useState(false)
  const [servicesDropdown, setServicesDropdown] = useState(false)
  const [scrolled, setScrolled]           = useState(false)

  const { isAuthenticated, user, logout } = useAuth()
  const { items, toggle, count } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || wishlistOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, wishlistOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b overflow-visible transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 border-[#08A9E0]/20 shadow-[0_10px_34px_rgba(16,27,70,0.12)]'
          : 'bg-white/90 border-[#08A9E0]/15 shadow-[0_8px_30px_rgba(16,27,70,0.08)]'
      }`}>
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-28 3xl:px-40">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-14 lg:h-[60px] xl:h-16 2xl:h-[68px]' : 'h-16 lg:h-[68px] xl:h-[72px] 2xl:h-20'
          }`}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
              <img
                src="/brand/logo.png"
                alt="Etak Travels"
                className={`object-contain transition-all duration-300 ${
                  scrolled
                    ? 'h-9 w-9 sm:h-10 sm:w-10 xl:h-11 xl:w-11 2xl:h-12 2xl:w-12'
                    : 'h-11 w-11 sm:h-12 sm:w-12 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16'
                }`}
              />
              <div className="leading-tight">
                <div className="font-display font-bold text-[#087EAF] text-xs sm:text-sm xl:text-base 2xl:text-lg">Etak Travels</div>
                <div className="text-[#6E7190] text-[10px] sm:text-xs xl:text-[11px] 2xl:text-sm">& Tours Expert Limited</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 rounded-full bg-[#F2FAFD]/90 p-1 ring-1 ring-[#08A9E0]/12 overflow-visible">
              {navLinks.map(({ to, label, hasDropdown }) => (
                hasDropdown ? (
                  <div
                    key={to}
                    className="relative"
                    onMouseEnter={() => setServicesDropdown(true)}
                    onMouseLeave={() => setServicesDropdown(false)}
                  >
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) =>
                        `nav-underline relative flex items-center gap-1 px-3 py-2 xl:px-4 xl:py-2.5 2xl:px-5 text-sm xl:text-[15px] 2xl:text-base font-semibold rounded-full transition-all duration-200 ${
                          isActive
                            ? 'bg-[#08A9E0] text-[#07102D] shadow-md shadow-[#08A9E0]/25'
                            : 'text-[#565873] hover:text-[#087EAF] hover:bg-white hover:-translate-y-0.5 hover:shadow-sm'
                        }`
                      }
                    >
                      {label}
                      <ChevronDown size={13} className={`transition-transform duration-200 ${servicesDropdown ? 'rotate-180' : ''}`} />
                    </NavLink>
                    {/* Dropdown */}
                    {servicesDropdown && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[999]">
                        <div className="bg-white rounded-card shadow-float border border-gray-100 p-2 w-72">
                          {services.map(s => {
                            const SIcon = serviceIconMap[s.icon] ?? Plane
                            return (
                              <Link
                                key={s.id}
                                to={`/services/${s.id}`}
                                onClick={() => setServicesDropdown(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#374151] hover:bg-[#EAF8FD] hover:text-[#087EAF] transition-colors"
                              >
                                <div className="w-6 h-6 rounded-lg bg-[#EAF8FD] flex items-center justify-center shrink-0">
                                  <SIcon size={13} className="text-[#08A9E0]" />
                                </div>
                                {s.title}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `nav-underline relative px-3 py-2 xl:px-4 xl:py-2.5 2xl:px-5 text-sm xl:text-[15px] 2xl:text-base font-semibold rounded-full transition-all duration-200 ${
                        isActive
                          ? 'bg-[#08A9E0] text-[#07102D] shadow-md shadow-[#08A9E0]/25'
                          : 'text-[#565873] hover:text-[#087EAF] hover:bg-white hover:-translate-y-0.5 hover:shadow-sm'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                )
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 2xl:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                  className="p-2 xl:p-2.5 rounded-full text-[#6E7190] hover:text-[#087EAF] hover:bg-[#EAF8FD] transition-colors"
                aria-label="Search destinations and tours"
              >
                <Search size={17} className="xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative p-2 xl:p-2.5 rounded-full text-[#6E7190] hover:text-[#087EAF] hover:bg-[#EAF8FD] transition-colors"
                title="Saved items"
              >
                <Heart size={17} className="xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#08A9E0] text-white text-[10px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 px-3 py-1.5 xl:px-4 xl:py-2 rounded-full text-sm xl:text-[15px] font-medium text-[#172033] hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
                  >
                    <Avatar avatarUrl={user?.avatarUrl} firstName={user?.firstName} lastName={user?.lastName} size={28} />
                    <span className="max-w-[90px] xl:max-w-[110px] truncate">{user?.firstName}</span>
                    <ChevronDown size={13} className={`text-[#667085] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-card shadow-panel border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-sm font-semibold text-[#172033] truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-[#667085] truncate">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#172033] hover:bg-gray-50 rounded-lg mx-1">
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>
                      <Link to="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#172033] hover:bg-gray-50 rounded-lg mx-1">
                        <User size={14} /> Profile
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg mx-1 w-[calc(100%-8px)] text-left">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 xl:px-5 xl:py-2.5 rounded-full text-sm xl:text-[15px] font-semibold text-[#087EAF] border border-[#08A9E0]/20 hover:border-[#08A9E0]/50 hover:bg-[#EAF8FD] transition-all">
                    Sign In
                  </Link>
                  <Link to="/signup">
                    <button className="flex items-center gap-1.5 px-5 py-2 xl:px-6 xl:py-2.5 2xl:px-7 rounded-full bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm xl:text-[15px] font-semibold transition-all duration-300 shadow-md shadow-[#08A9E0]/25 hover:shadow-lg">
                      Get Started <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile right actions */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative p-2 rounded-full text-[#087EAF] hover:bg-[#EAF8FD]"
              >
                <Heart size={18} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#08A9E0] text-white text-[10px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="p-2 rounded-full border border-[#08A9E0]/20 text-[#087EAF] hover:bg-[#EAF8FD] transition-colors"
                aria-label="Toggle menu"
              >
                <span className="relative block w-[19px] h-[19px]">
                  <Menu size={19} className={`absolute inset-0 transition-all duration-300 ${mobileOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
                  <X size={19} className={`absolute inset-0 transition-all duration-300 ${mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
        {searchOpen && (
          <div className="animate-search-expand hidden lg:block absolute right-14 xl:right-20 2xl:right-28 top-[calc(100%+10px)] rounded-card bg-white/95 p-2 shadow-float ring-1 ring-[#08A9E0]/15 backdrop-blur-xl">
            <SearchBox onClose={() => setSearchOpen(false)} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#08A9E0]/60" />
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[82%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Drawer header — branded */}
          <div className="flex items-center justify-between px-5 py-4 bg-[#087EAF] shrink-0">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              <img src="/brand/logo.png" alt="Etak Travels" className="h-9 w-9 object-contain" />
              <div className="leading-tight">
                <div className="font-display font-bold text-white text-sm">Etak Travels</div>
                <div className="text-blue-300 text-[10px]">& Tours Expert Limited</div>
              </div>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-full hover:bg-white/15 text-white/70 hover:text-white transition-colors">
              <X size={17} />
            </button>
          </div>

          {/* Mobile search */}
          <div className="px-4 pt-3 pb-1 relative">
            <SearchBox onClose={() => setMobileOpen(false)} mobile />
          </div>

          <nav className="flex-1 p-4 flex flex-col gap-0.5 overflow-y-auto mt-1">
            {navLinks.map(({ to, label, hasDropdown }) => (
              hasDropdown ? (
                <div key={to}>
                  <div className="flex items-center">
                    <NavLink
                      to={to}
                      end={to === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex-1 flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[#EAF8FD] text-[#08A9E0] font-semibold'
                            : 'text-[#374151] hover:bg-gray-50 hover:text-[#101B46]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && <span className="w-1 h-4 rounded-full bg-[#08A9E0] mr-3 shrink-0" />}
                          {label}
                        </>
                      )}
                    </NavLink>
                    <button
                      onClick={() => setServicesOpen(v => !v)}
                      className="p-2 rounded-xl text-[#667085] hover:bg-gray-50 transition-colors"
                    >
                      <ChevronDown size={15} className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {servicesOpen && (
                    <div className="ml-4 mt-0.5 flex flex-col gap-0.5">
                      {services.map(s => {
                        const SIcon = serviceIconMap[s.icon] ?? Plane
                        return (
                          <Link
                            key={s.id}
                            to={`/services/${s.id}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-[#667085] hover:bg-[#EAF8FD] hover:text-[#087EAF] transition-colors"
                          >
                            <div className="w-5 h-5 rounded-md bg-[#EAF8FD] flex items-center justify-center shrink-0">
                              <SIcon size={11} className="text-[#08A9E0]" />
                            </div>
                            {s.title}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EAF8FD] text-[#08A9E0] font-semibold'
                        : 'text-[#374151] hover:bg-gray-50 hover:text-[#101B46]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="w-1 h-4 rounded-full bg-[#08A9E0] mr-3 shrink-0" />}
                      {label}
                    </>
                  )}
                </NavLink>
              )
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 flex flex-col gap-2.5 shrink-0">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-[#EAF8FD] rounded-card">
                  <Avatar avatarUrl={user?.avatarUrl} firstName={user?.firstName} lastName={user?.lastName} size={36} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#101B46] truncate">{user?.firstName} {user?.lastName}</div>
                    <div className="text-xs text-[#667085] truncate">{user?.email}</div>
                  </div>
                </div>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#08A9E0] text-white text-sm font-semibold">
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="text-sm text-red-500 font-medium py-1 text-center">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full flex items-center justify-center py-2.5 rounded-full border-2 border-[#08A9E0] text-[#08A9E0] text-sm font-semibold">
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#08A9E0] text-white text-sm font-semibold">
                  Get Started <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Wishlist slide-out panel */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${wishlistOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setWishlistOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 flex flex-col ${wishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-[#08A9E0]" />
              <h2 className="font-display font-bold text-[#101B46] text-lg">Saved Items</h2>
              {count > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#EAF8FD] text-[#08A9E0] text-xs font-semibold">{count}</span>
              )}
            </div>
            <button onClick={() => setWishlistOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 text-[#667085]">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-16">
                <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center animate-breathe">
                  <Heart size={28} className="text-gray-300" />
                </div>
                <p className="text-[#667085] text-sm">No saved items yet.</p>
                <p className="text-[#667085] text-xs">Tap the heart on any tour or destination to save it here.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 bg-[#F8FAFC] rounded-xl p-3 border border-gray-100">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${item.type === 'tour' ? 'bg-[#EAF8FD] text-[#08A9E0]' : 'bg-[#101B46]/10 text-[#101B46]'}`}>
                        {item.type}
                      </span>
                      <p className="font-semibold text-[#101B46] text-sm mt-1 truncate">{item.title}</p>
                      <p className="text-[#667085] text-xs flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />{item.subtitle}
                      </p>
                    </div>
                    <button
                      onClick={() => toggle(item)}
                      className="p-1.5 rounded-full text-[#667085] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 self-start"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t border-gray-100 flex flex-col gap-2 shrink-0">
              <Link
                to="/contact"
                state={{ savedItems: items.map(i => i.title).join(', ') }}
                onClick={() => setWishlistOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#08A9E0] text-white text-sm font-semibold hover:bg-[#0798C8] transition-colors"
              >
                Enquire About Saved Items <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => { items.forEach(i => toggle(i)) }}
                className="text-xs text-[#667085] hover:text-red-500 transition-colors text-center py-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
