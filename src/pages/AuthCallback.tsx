import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      navigate(data.session ? '/dashboard' : '/login', { replace: true })
    })
  }, [navigate])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-white">
      <img src="/brand/logo.png" alt="Etak Travels" className="h-10 w-10 object-contain animate-breathe" />
      <div className="h-8 w-8 rounded-full border-4 border-gray-100 border-t-[#08A9E0] animate-spin" />
      <p className="text-sm text-[#667085]">Signing you in…</p>
    </div>
  )
}
