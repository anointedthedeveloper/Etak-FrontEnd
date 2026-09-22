import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Plane } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [welcome, setWelcome] = useState(false)
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { navigate('/login', { replace: true }); return }

      const user = data.session.user
      const isGoogle = user.app_metadata?.provider === 'google'
      const isNew = (() => {
        const created = new Date(user.created_at).getTime()
        return Date.now() - created < 30_000  // created within last 30s = new signup
      })()

      if (isGoogle && isNew) {
        const meta = user.user_metadata ?? {}
        const name = (meta.full_name ?? meta.name ?? '').split(' ')[0] || 'there'
        setFirstName(name)
        setWelcome(true)
        setTimeout(() => navigate('/dashboard', { replace: true }), 3000)
      } else {
        navigate('/dashboard', { replace: true })
      }
    })
  }, [navigate])

  if (welcome) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-[#101B46] via-[#0D2260] to-[#087EAF] px-6 text-center">
        <div className="absolute inset-0 dot-grid opacity-[0.07] pointer-events-none" />

        <img src="/brand/logo.png" alt="Etak Travels" className="h-16 w-16 object-contain rounded-2xl border-2 border-white/20 shadow-xl mb-2" />

        <div className="animate-fade-up">
          <p className="text-[#08A9E0] text-xs font-bold tracking-[0.18em] uppercase mb-2">Welcome to Etak Travels</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Welcome, {firstName}! ✈
          </h1>
          <p className="text-blue-200/70 text-sm sm:text-base max-w-sm leading-relaxed">
            Your account is ready. Taking you to your dashboard now.
          </p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#08A9E0] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-1.5 w-1.5 rounded-full bg-[#08A9E0] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-1.5 w-1.5 rounded-full bg-[#08A9E0] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        <Plane size={80} className="absolute bottom-12 right-12 text-white/5 -rotate-12 hidden lg:block" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-white">
      <img src="/brand/logo.png" alt="Etak Travels" className="h-10 w-10 object-contain animate-breathe" />
      <div className="h-8 w-8 rounded-full border-4 border-gray-100 border-t-[#08A9E0] animate-spin" />
      <p className="text-sm text-[#667085]">Signing you in…</p>
    </div>
  )
}
