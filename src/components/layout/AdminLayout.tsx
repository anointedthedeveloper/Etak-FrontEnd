import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, MessageSquare, LogOut, ShieldCheck, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

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

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminTimestamp')
    navigate('/adlog')
  }

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
    { to: '/admin/users', label: 'Users', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-[#101B46] via-[#075D82] to-[#087EAF] overflow-y-auto">
          <div className="flex items-center justify-center h-16 px-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck size={24} className="text-[#08A9E0]" />
              <span className="font-display font-bold text-white">Admin Panel</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {adminLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-[#087EAF] shadow-lg shadow-black/10'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#101B46] to-[#087EAF] border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-[#08A9E0]" />
            <span className="font-display font-bold text-white">Admin Panel</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-white hover:bg-white/10"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-[#101B46] via-[#075D82] to-[#087EAF] overflow-y-auto">
            <div className="flex items-center justify-center h-16 px-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck size={24} className="text-[#08A9E0]" />
                <span className="font-display font-bold text-white">Admin Panel</span>
              </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {adminLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                      ? 'bg-white text-[#087EAF] shadow-lg shadow-black/10'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <link.icon size={18} />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => { handleLogout(); setMobileOpen(false) }}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
