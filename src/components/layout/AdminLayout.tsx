import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, MessageSquare, LogOut, ShieldCheck, Menu, X, Search, Settings, Bell, Plane } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const pageTitles: Record<string, { title: string; sub: string }> = {
  '/admin/dashboard': { title: 'Dashboard', sub: 'Overview of platform activity' },
  '/admin/enquiries': { title: 'Enquiries', sub: 'Respond to customer inquiries' },
  '/admin/users':     { title: 'Users',     sub: 'View all registered users' },
  '/admin/notifications': { title: 'Notifications', sub: 'New enquiries and client replies' },
}

function NavLinks({ pathname, pending, onNavigate }: { pathname: string; pending: number; onNavigate?: () => void }) {
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare, badge: pending },
    { to: '/admin/users',     label: 'Users',     icon: Users },
    { to: '/admin/settings',       label: 'Settings',       icon: Settings },
    { to: '/admin/notifications',   label: 'Notifications',  icon: Bell, badge: pending },
  ]

  return (
    <nav className="flex-1 px-3 py-6 space-y-1">
      {adminLinks.map((link) => {
        const isActive = pathname === link.to
        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-white text-[#087EAF] shadow-lg shadow-black/10'
                : 'text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
            }`}
          >
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-[#EAF8FD]' : 'bg-white/10'}`}>
              <link.icon size={16} />
            </span>
            <span className="flex-1">{link.label}</span>
            {!!link.badge && (
              <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                isActive ? 'bg-[#08A9E0] text-white' : 'bg-[#08A9E0] text-white shadow-sm shadow-[#08A9E0]/40'
              }`}>
                {link.badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pending, setPending] = useState(0)

  useEffect(() => {
    // Check if admin is authenticated
    const isAdmin = localStorage.getItem('isAdmin')
    const adminTimestamp = localStorage.getItem('adminTimestamp')

    if (!isAdmin || isAdmin !== 'true') {
      navigate('/adlog')
      return
    }

    // Check if session is expired (24 hours)
    if (adminTimestamp) {
      const elapsed = Date.now() - parseInt(adminTimestamp)
      const hours = elapsed / (1000 * 60 * 60)
      if (hours > 24) {
        localStorage.removeItem('isAdmin')
        localStorage.removeItem('adminTimestamp')
        navigate('/adlog')
      }
    }
  }, [navigate])

  useEffect(() => {
    async function loadPending() {
      const [{ count: newCount }, { count: replyCount }] = await Promise.all([
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('inquiry_responses').select('*', { count: 'exact', head: true }).eq('is_admin', false),
      ])
      setPending((newCount ?? 0) + (replyCount ?? 0))
    }
    loadPending()
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminTimestamp')
    navigate('/adlog')
  }

  const runSearch = (q: string) => {
    if (!q.trim()) return
    const lower = q.toLowerCase()
    if (['user', 'email', 'name'].some(k => lower.includes(k))) navigate(`/admin/users?q=${encodeURIComponent(q)}`)
    else navigate(`/admin/enquiries?q=${encodeURIComponent(q)}`)
  }

  const page = pageTitles[location.pathname] ?? { title: 'Admin', sub: '' }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="relative flex flex-col flex-grow bg-gradient-to-b from-[#101B46] via-[#075D82] to-[#087EAF] overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-[0.08] pointer-events-none" />
          <Plane size={140} className="absolute -bottom-6 -right-10 text-white/[0.04] rotate-12 pointer-events-none" />

          <div className="relative flex items-center gap-2 h-16 px-5 border-b border-white/10 shrink-0">
            <ShieldCheck size={22} className="text-[#08A9E0]" />
            <span className="font-display font-bold text-white">Admin Panel</span>
          </div>

          <div className="relative flex-1 overflow-y-auto flex flex-col">
            <NavLinks pathname={location.pathname} pending={pending} />

            {/* Admin identity card */}
            <div className="px-3 pb-3 mt-auto">
              <div className="flex items-center gap-3 rounded-xl bg-white/8 border border-white/10 px-3 py-3">
                <div className="relative w-9 h-9 rounded-full bg-[#08A9E0] flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} className="text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0D2260]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Administrator</p>
                  <p className="text-xs text-blue-200/70 truncate">Signed in</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative p-3 border-t border-white/10 shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#101B46] to-[#087EAF] border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-4 gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <ShieldCheck size={24} className="text-[#08A9E0]" />
            <span className="font-display font-bold text-white">Admin Panel</span>
          </div>
          <form className="flex-1 relative" onSubmit={e => { e.preventDefault(); runSearch((e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim()) }}>
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              name="q"
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40"
            />
          </form>
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            className="relative p-2 rounded-lg text-white hover:bg-white/10 shrink-0"
          >
            <span className="relative block w-5 h-5">
              <Menu size={20} className={`absolute inset-0 transition-all duration-300 ${mobileOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
              <X size={20} className={`absolute inset-0 transition-all duration-300 ${mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
            </span>
            {!!pending && !mobileOpen && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#08A9E0] ring-2 ring-[#101B46]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="fixed top-0 left-0 bottom-0 w-72 bg-gradient-to-b from-[#101B46] via-[#075D82] to-[#087EAF] overflow-y-auto flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 h-16 px-5 border-b border-white/10 shrink-0">
              <ShieldCheck size={22} className="text-[#08A9E0]" />
              <span className="font-display font-bold text-white">Admin Panel</span>
            </div>
            <NavLinks pathname={location.pathname} pending={pending} onNavigate={() => setMobileOpen(false)} />
            <div className="p-3 border-t border-white/10 shrink-0">
              <button
                onClick={() => { handleLogout(); setMobileOpen(false) }}
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        {/* Desktop topbar */}
        <div className="hidden lg:flex items-center justify-between gap-6 px-8 py-3.5 bg-white border-b border-gray-100">
          <div className="min-w-0">
            <h1 className="font-display font-bold text-[#101B46] text-lg leading-tight truncate">{page.title}</h1>
            {page.sub && <p className="text-xs text-[#667085] truncate">{page.sub}</p>}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <form className="relative w-64 xl:w-80" onSubmit={e => { e.preventDefault(); runSearch((e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim()) }}>
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
              <input
                name="q"
                type="text"
                placeholder="Search enquiries or users..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F4FBFE] border border-[#08A9E0]/15 text-sm text-[#172033] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/30"
              />
            </form>
            <Link
              to="/admin/notifications"
              className="relative p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-[#667085] shrink-0"
              title={pending ? `${pending} pending` : 'Notifications'}
            >
              <Bell size={18} />
              {!!pending && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </Link>
          </div>
        </div>
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="app-shell">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
