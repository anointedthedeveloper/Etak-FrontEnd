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
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="h-9 w-9 rounded-full border-4 border-gray-100 border-t-[#08A9E0] animate-spin" />
    </div>
  )
}
