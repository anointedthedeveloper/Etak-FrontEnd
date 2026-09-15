import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/tours', label: 'Tours' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
              <img src="/logo.png" alt="Etak Travels & Tours Expert Limited" className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-contain bg-white/10 p-1" />
              <div className="hidden sm:block">
                <div className={`font-display font-bold text-base leading-tight transition-colors ${scrolled ? 'text-[#101B46]' : 'text-white'}`}>
                  Etak Travels
                </div>
                <div className={`text-xs font-medium transition-colors ${scrolled ? 'text-[#667085]' : 'text-blue-100'}`}>
                  & Tours Expert Limited
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? scrolled ? 'text-[#08A9E0] bg-[#EAF8FD]' : 'text-white bg-white/20'
                        : scrolled ? 'text-[#172033] hover:text-[#08A9E0] hover:bg-gray-50' : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      scrolled ? 'text-[#172033] hover:bg-gray-50' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#08A9E0] flex items-center justify-center text-white text-xs font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <span>{user?.firstName}</span>
                    <ChevronDown size={14} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#172033] hover:bg-gray-50">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <Link to="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#172033] hover:bg-gray-50">
                        <User size={15} /> Profile
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <button className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${scrolled ? 'text-[#172033] hover:bg-gray-50' : 'text-white hover:bg-white/10'}`}>
                      Sign In
                    </button>
                  </Link>
                  <Link to="/contact">
                    <Button size="sm" variant={scrolled ? 'primary' : 'white'}>Plan Your Trip</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-[#172033] hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <img src="/logo.png" alt="Etak Travels" className="h-12 w-12 rounded-lg object-contain bg-white/10 p-1" />
              <span className="font-display font-bold text-[#101B46]">Etak Travels</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-[#667085]">
              <X size={20} />
            </button>
          </div>

          <nav className="p-5 flex flex-col gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#EAF8FD] text-[#08A9E0]' : 'text-[#172033] hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-5 border-t border-gray-100 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-[#EAF8FD] rounded-lg">
                  <div className="w-9 h-9 rounded-full bg-[#08A9E0] flex items-center justify-center text-white text-sm font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#101B46]">{user?.firstName} {user?.lastName}</div>
                    <div className="text-xs text-[#667085]">{user?.email}</div>
                  </div>
                </div>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full">Dashboard</Button>
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="text-sm text-red-600 font-medium py-2">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full">Plan Your Trip</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
