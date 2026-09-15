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
          scrolled ? 'bg-white/90 shadow-sm border-b border-gray-100 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
              <img src="/logo.png" alt="Etak Travels & Tours Expert Limited" className="h-16 w-16 sm:h-20 sm:w-20 object-contain" />
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
                    `relative px-4 py-2 text-sm font-medium transition-colors duration-200 group ${
                      isActive
                        ? scrolled ? 'text-[#08A9E0]' : 'text-white'
                        : scrolled ? 'text-[#172033] hover:text-[#08A9E0]' : 'text-white/80 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {/* Underline indicator */}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-250 ${
                          isActive
                            ? 'w-5 bg-[#08A9E0]'
                            : 'w-0 bg-[#08A9E0] group-hover:w-5'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      scrolled ? 'text-[#172033] hover:bg-gray-50' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#08A9E0] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <span>{user?.firstName}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
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
                    <button className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${scrolled ? 'text-[#172033] hover:bg-gray-50' : 'text-white hover:bg-white/10'}`}>
                      Sign In
                    </button>
                  </Link>
                  <Link to="/contact">
                    <Button size="sm" variant={scrolled ? 'primary' : 'white'} className="shadow-sm hover:translate-y-[-1px]">Plan Your Trip</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className={`lg:hidden p-2.5 rounded-xl border transition-all duration-200 ${
                scrolled ? 'text-[#172033] border-gray-200 bg-white/80 hover:bg-gray-50' : 'text-white border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm'
              }`}
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
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[88%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <img src="/logo.png" alt="Etak Travels" className="h-14 w-14 object-contain" />
              <span className="font-display font-bold text-[#101B46]">Etak Travels</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-[#667085]">
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 flex flex-col gap-2">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-[#EAF8FD] text-[#08A9E0] shadow-sm' : 'text-[#172033] hover:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-[#08A9E0]' : 'bg-transparent'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-5 border-t border-gray-100 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-[#EAF8FD] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#08A9E0] flex items-center justify-center text-white text-sm font-bold shadow-sm">
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
