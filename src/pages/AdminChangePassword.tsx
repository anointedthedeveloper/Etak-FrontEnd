import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Input } from '../components/ui/FormFields'
import { Button } from '../components/ui/Button'
import SEO from '../components/ui/SEO'
import { changeAdminPassword } from '../lib/adminPassword'
import { supabase } from '../lib/supabase'

export default function AdminChangePassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ next: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') navigate('/adlog', { replace: true })
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.next.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (form.next !== form.confirm) { setError('Passwords do not match.'); return }
    setError('')
    setLoading(true)
    try {
      await changeAdminPassword(form.next)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password.')
    }
    setLoading(false)
  }

  const cancel = async () => {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminTimestamp')
    await supabase.auth.signOut()
    navigate('/adlog')
  }

  return (
    <>
      <SEO title="Set Admin Password" description="Set a new admin password" url="/admin/change-password" noIndex />
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white rounded-panel shadow-panel border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#08A9E0]">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#101B46] mb-2">Set a new password</h1>
            <p className="text-sm text-[#667085]">
              You're signed in with a temporary password. Choose your own to continue to the admin panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="New Password"
                type={showPw ? 'text' : 'password'}
                value={form.next}
                onChange={e => { setForm(f => ({ ...f, next: e.target.value })); setError('') }}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                required
                className="pr-11"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-[34px] text-[#667085] hover:text-[#08A9E0]">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Input
              label="Confirm Password"
              type={showPw ? 'text' : 'password'}
              value={form.confirm}
              onChange={e => { setForm(f => ({ ...f, confirm: e.target.value })); setError('') }}
              placeholder="Repeat password"
              autoComplete="new-password"
              required
            />
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Update password
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={cancel} className="text-sm text-[#667085] hover:text-[#08A9E0] transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
