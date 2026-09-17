import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Menu, X, ChevronDown, User, LogOut, LayoutDashboard,
  Search, Home, Briefcase, Globe, Map, Info, Mail, ArrowRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/',             label: 'Home',         icon: Home },
  { to: '/services',     label: 'Services',     icon: Briefcase },
  { to: '/destinations', label: 'Destinations', icon: Globe },
  { to: '/tours',        label: 'Tours',        icon: Map },
  { to: '/about',        label: 'About Us',     icon: Info },
  { to: '/contact',      label: 'Contact',      icon: Mail },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

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
                      {/* Active underline bar */}
                      <span className={`absolute -bottom-[9px] left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-[#08A9E0] transition-all duration-200 ${isActive ? 'w-5' : 'w-0'}`} />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search */}
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search..."
                    className="w-40 px-3 py-1.5 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#08A9E0]"
                    onBlur={() => setSearchOpen(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full text-[#667085] hover:bg-gray-100 transition-colors"
                >
                  <Search size={17} />
                </button>
              )}

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
                <Link to="/contact">
                  <button className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-semibold transition-colors">
                    Get Started <ArrowRight size={14} />
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-2 rounded-full border border-gray-200 text-[#172033] hover:bg-gray-50"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
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

          <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
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
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#08A9E0] text-white text-sm font-semibold">
                  Get Started <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
