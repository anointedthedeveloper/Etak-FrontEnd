import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Menu, X, ChevronDown, User, LogOut, LayoutDashboard,
  Search, Home, Briefcase, Globe, Map, Info, Mail, ArrowRight,
  Heart, Trash2, MapPin, Clock,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { destinations } from '../../data/destinations'
import { tours } from '../../data/tours'

const navLinks = [
  { to: '/',             label: 'Home',         icon: Home },
  { to: '/about',        label: 'About Us',     icon: Info },
  { to: '/services',     label: 'Services',     icon: Briefcase },
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
        <div className={`absolute top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 ${mobile ? 'left-0 right-0' : 'left-0 w-80'}`}>
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
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen]     = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)

  const { isAuthenticated, user, logout } = useAuth()
  const { items, toggle, count } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || wishlistOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, wishlistOpen])

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
              <img src="/brand/logo.png" alt="Etak Travels" className="h-12 w-12 sm:h-14 sm:w-14 object-contain" />
              <div className="hidden sm:block leading-tight">
                <div className="font-display font-bold text-[#101B46] text-sm">Etak Travels</div>
                <div className="text-[#667085] text-xs">& Tours Expert Limited</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-150 ${
                      isActive
                        ? 'bg-[#EAF8FD] text-[#08A9E0]'
                        : 'text-[#172033] hover:text-[#08A9E0] hover:bg-gray-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={14} className={isActive ? 'text-[#08A9E0]' : 'text-[#667085]'} />
                      {label}
                      <span className={`absolute -bottom-[9px] left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-[#08A9E0] transition-all duration-200 ${isActive ? 'w-5' : 'w-0'}`} />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2">
              {searchOpen ? (
                <SearchBox onClose={() => setSearchOpen(false)} />
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full text-[#667085] hover:bg-gray-100 transition-colors"
                >
                  <Search size={17} />
                </button>
              )}

              {/* Wishlist */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative p-2 rounded-full text-[#667085] hover:bg-gray-100 transition-colors"
                title="Saved items"
              >
                <Heart size={17} />
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-[#172033] hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#08A9E0] flex items-center justify-center text-white text-xs font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <span className="max-w-[90px] truncate">{user?.firstName}</span>
                    <ChevronDown size={13} className={`text-[#667085] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-50">
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
                <Link to="/signup">
                  <button className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-semibold transition-colors">
                    Get Started <ArrowRight size={14} />
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile right actions */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative p-2 rounded-full text-[#667085] hover:bg-gray-100"
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
                className="p-2 rounded-full border border-gray-200 text-[#172033] hover:bg-gray-50"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[82%] max-w-xs bg-white shadow-2xl transition-transform duration-300 flex flex-col ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <img src="/brand/logo.png" alt="Etak Travels" className="h-10 w-10 object-contain" />
              <span className="font-display font-bold text-[#101B46] text-sm">Etak Travels</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 text-[#667085]">
              <X size={17} />
            </button>
          </div>

          {/* Mobile search */}
          <div className="px-4 pt-3 pb-1 relative">
            <SearchBox onClose={() => setMobileOpen(false)} mobile />
          </div>

          <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto mt-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#EAF8FD] text-[#08A9E0]' : 'text-[#172033] hover:bg-gray-50'
                  }`
                }
              >
                <Icon size={15} /> {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 flex flex-col gap-2.5 shrink-0">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-[#EAF8FD] rounded-2xl">
                  <div className="w-9 h-9 rounded-full bg-[#08A9E0] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
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
                <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center">
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
