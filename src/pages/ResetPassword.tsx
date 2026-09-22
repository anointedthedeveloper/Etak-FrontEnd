import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/FormFields'
import AuthLayout from '../components/layout/AuthLayout'

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: '',       color: 'bg-gray-200' },
    { label: 'Weak',   color: 'bg-red-400' },
    { label: 'Fair',   color: 'bg-orange-400' },
    { label: 'Good',   color: 'bg-yellow-400' },
    { label: 'Strong', color: 'bg-green-500' },
  ]
  return { score, ...map[score] }
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword]       = useState('')
  const [confirm, setConfirm]         = useState('')
  const [showPw, setShowPw]           = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [done, setDone]               = useState(false)
  const [hasSession, setHasSession]   = useState(false)

  const strength = getPasswordStrength(password)

  // Supabase sends the user here with a session already established
  // via the URL fragment (#access_token=...). We just need to confirm
  // there is a valid session before showing the form.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm)  { setError('Passwords do not match.'); return }
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
    setTimeout(() => navigate('/dashboard'), 2500)
  }

  return (
    <AuthLayout>
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-full bg-[#08A9E0] flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck size={19} className="text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-[#101B46]">Set New Password</h2>
            <p className="text-sm text-[#667085]">Choose a strong password for your account.</p>
          </div>
        </div>

        {done ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#101B46] mb-2">Password updated</h2>
              <p className="text-sm text-[#667085]">Redirecting you to the dashboard…</p>
            </div>
          ) : !hasSession ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <AlertCircle size={32} className="text-orange-500" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#101B46] mb-2">Link expired</h2>
              <p className="text-sm text-[#667085] mb-5">
                This reset link is no longer valid. Please request a new one.
              </p>
              <Link to="/forgot-password">
                <Button variant="primary" className="w-full">Request new link</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New password */}
              <div>
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    autoComplete="new-password"
                    required
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-[34px] text-[#667085] hover:text-[#172033]"
                  >
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {password && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex gap-1 flex-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-[#667085]">{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError('') }}
                  autoComplete="new-password"
                  required
                  className="pr-11"
                />
                {confirm && password === confirm && (
                  <CheckCircle2 size={17} className="absolute right-3 top-[34px] text-green-500" />
                )}
              </div>

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
          )}
      </div>
    </AuthLayout>
  )
}
