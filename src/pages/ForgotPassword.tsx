import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { Input } from '../components/ui/FormFields'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabase'

type Step = 'email' | 'code' | 'password'

function getStrength(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep]         = useState<Step>('email')
  const [email, setEmail]       = useState('')
  const [code, setCode]         = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  const strength = getStrength(password)
  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setStep('code')
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 6) { setError('Enter the verification code.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })
    setLoading(false)
    if (err) { setError('Invalid or expired code. Try again.'); return }
    setStep('password')
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
    setTimeout(() => navigate('/login'), 2500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101B46] via-[#075D82] to-[#087EAF] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block mb-4">
            <img src="/brand/logo.png" alt="Etak Travels" className="h-14 w-14 object-contain mx-auto" />
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-blue-200 text-sm mt-1">
            {step === 'email'    && "We'll send a verification code to your email."}
            {step === 'code'     && `Enter the code sent to ${email}`}
            {step === 'password' && 'Choose a new password for your account.'}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          {done ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#101B46] mb-2">Password updated!</h2>
              <p className="text-sm text-[#667085]">Redirecting you to sign in…</p>
            </div>
          ) : step === 'email' ? (
            <form onSubmit={sendCode} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              {error && <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"><AlertCircle size={15} />{error}</p>}
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Send verification code
              </Button>
              <p className="text-center text-sm text-[#667085]">
                <Link to="/login" className="text-[#08A9E0] hover:underline">Back to sign in</Link>
              </p>
            </form>
          ) : step === 'code' ? (
            <form onSubmit={verifyCode} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#172033] mb-1.5">Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="00000000"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-center tracking-[0.5em] text-[#172033] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#08A9E0]"
                />
                <p className="text-xs text-[#667085] mt-1">Check your inbox and spam folder.</p>
              </div>
              {error && <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"><AlertCircle size={15} />{error}</p>}
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Verify code
              </Button>
              <button type="button" onClick={() => { setStep('email'); setCode(''); setError('') }} className="w-full text-sm text-[#667085] hover:text-[#08A9E0]">
                Use a different email
              </button>
            </form>
          ) : (
            <form onSubmit={updatePassword} className="space-y-5">
              <div>
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="Min. 8 characters"
                    className="pr-11"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-[34px] text-[#667085] hover:text-[#08A9E0]">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {password && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex gap-1 flex-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-[#667085]">{strengthLabels[strength]}</span>
                  </div>
                )}
              </div>
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showPw ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError('') }}
                  placeholder="Repeat password"
                  className="pr-11"
                />
                {confirm && confirm === password && <CheckCircle2 size={17} className="absolute right-3 top-[34px] text-green-500" />}
              </div>
              {error && <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"><AlertCircle size={15} />{error}</p>}
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Update password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
