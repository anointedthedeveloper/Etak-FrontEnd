import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Bookmark, Users, Map, BarChart2,
  Settings, LogOut, Plane, Bell, Search, Menu, X, ChevronDown,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'

const navItems = [
  { to: '/dashboard',           label: 'Dashboard',        icon: LayoutDashboard, end: true },
  { to: '/dashboard/inquiries', label: 'Inquiries',        icon: FileText },
  { to: '/dashboard/bookings',  label: 'Bookings',         icon: Bookmark },
  { to: '/dashboard/clients',   label: 'Clients',          icon: Users },
  { to: '/dashboard/tours',     label: 'Tours & Packages', icon: Map },
  { to: '/dashboard/reports',   label: 'Reports',          icon: BarChart2 },
  { to: '/dashboard/settings',  label: 'Settings',         icon: Settings },
]

function SidebarContent({
  mobile,
  onClose,
  onLogout,
}: {
  mobile: boolean
  onClose: () => void
  onLogout: () => void
}) {
  return (
    <div className="flex flex-col h-full bg-white/95 border-r border-[#08A9E0]/10 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
        <Link to="/" className="flex items-center gap-2" onClick={mobile ? onClose : undefined}>
          <img src="/brand/logo.png" alt="Etak Travels" className="h-10 w-10 object-contain" />
          <div>
            <div className="font-display font-bold text-[#101B46] text-sm leading-tight">Etak Travels</div>
            <div className="text-[#667085] text-xs">RC 898792</div>
          </div>
        </Link>
        {mobile && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#667085] hover:bg-gray-100">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#08A9E0] text-white shadow-md shadow-[#08A9E0]/20'
                  : 'text-[#667085] hover:bg-[#EAF8FD] hover:text-[#087EAF]'
              }`
            }
          >
            <Icon size={16} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Promo card */}
      <div className="mx-3 mb-3 rounded-2xl bg-gradient-to-br from-[#101B46] to-[#087EAF] p-4 text-white shadow-lg shadow-[#08A9E0]/20 shrink-0">
        <Plane size={20} className="text-[#08A9E0] mb-2" />
        <p className="font-bold text-sm leading-snug mb-1">Your journey<br />our priority</p>
        <p className="text-blue-200 text-xs">More destinations.<br />More possibilities.</p>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-6 py-4 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 shrink-0"
      >
        <LogOut size={15} /> Sign out
      </button>
    </div>
  )
}

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-[#F7F7FC] overflow-hidden">

      {/* ── Desktop sidebar (always visible lg+) ── */}
      <div className="hidden lg:flex flex-col w-56 xl:w-60 shrink-0 h-full">
        <SidebarContent mobile={false} onClose={() => {}} onLogout={handleLogout} />
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 z-10">
            <SidebarContent mobile onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-[#08A9E0]/10 px-4 sm:px-5 py-2.5 flex items-center gap-3 shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-[#667085] hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <form
            className="flex-1 max-w-xs sm:max-w-sm relative"
            onSubmit={e => {
              e.preventDefault()
              const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim()
              if (!q) return
              const lower = q.toLowerCase()
              if (['client','user','contact'].some(k => lower.includes(k))) navigate(`/dashboard/clients?q=${encodeURIComponent(q)}`)
              else if (['booking','flight','hotel'].some(k => lower.includes(k))) navigate(`/dashboard/bookings?q=${encodeURIComponent(q)}`)
              else navigate(`/dashboard/inquiries?q=${encodeURIComponent(q)}`)
            }}
          >
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input
              name="q"
              type="text"
              placeholder="Search inquiries, clients, or bookings..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#F4FBFE] border border-[#08A9E0]/10 text-sm text-[#172033] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/35 focus:border-[#08A9E0]/30"
            />
          </form>

          <div className="ml-auto flex items-center gap-2">
            {/* Bell */}
            <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors text-[#667085]">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Avatar avatarUrl={user?.avatarUrl} firstName={user?.firstName} lastName={user?.lastName} size={28} />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-[#172033] leading-none max-w-[120px] truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-[#667085] leading-none mt-0.5 max-w-[120px] truncate">
                    {user?.email?.split('@')[0]}
                  </p>
                </div>
                <ChevronDown size={13} className={`text-[#667085] transition-transform shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-[#172033] truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-[#667085] truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#172033] hover:bg-gray-50"
                  >
                    <Settings size={13} /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut size={13} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content — scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="app-shell">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
