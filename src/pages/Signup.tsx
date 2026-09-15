import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/FormFields'
import { Button } from '../components/ui/Button'

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: '', color: 'bg-gray-200' },
    { label: 'Weak', color: 'bg-red-400' },
    { label: 'Fair', color: 'bg-orange-400' },
    { label: 'Good', color: 'bg-yellow-400' },
    { label: 'Strong', color: 'bg-green-500' },
  ]
  return { score, ...map[score] }
}

export default function Signup() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', terms: false })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string | boolean) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '', general: '' })) }
  const strength = getPasswordStrength(form.password)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!form.terms) e.terms = 'You must accept the terms and conditions'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password })
      navigate('/dashboard')
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101B46] via-[#1a2a6c] to-[#45419A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="Etak Travels" className="h-12 w-12 rounded-xl object-contain bg-white/10 p-1" />
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Create Your Account</h1>
          <p className="text-blue-200 text-sm">Join Etak Travels and manage your journeys in one place</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="First name" value={form.firstName} onChange={e => set('firstName', e.target.value)} error={errors.firstName} required />
              <Input label="Last Name" placeholder="Last name" value={form.lastName} onChange={e => set('lastName', e.target.value)} error={errors.lastName} required />
            </div>
            <Input label="Email Address" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} required autoComplete="email" />
            <Input label="Phone Number" type="tel" placeholder="+234 xxx xxx xxxx" value={form.phone} onChange={e => set('phone', e.target.value)} error={errors.phone} required />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#172033]">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-11 rounded-lg border text-sm text-[#172033] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#08A9E0] focus:border-transparent transition-colors ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#172033]">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {form.password && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-[#667085]">{strength.label}</span>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#172033]">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-11 rounded-lg border text-sm text-[#172033] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#08A9E0] focus:border-transparent transition-colors ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'}`}
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle2 size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={e => set('terms', e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#08A9E0] focus:ring-[#08A9E0]"
                />
                <span className="text-sm text-[#667085]">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#08A9E0] hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-[#08A9E0] hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 ml-6">{errors.terms}</p>}
            </div>

            {errors.general && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-1">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[#667085] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#08A9E0] font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-blue-300 text-xs mt-6">
          <Link to="/" className="hover:text-white transition-colors">← Back to Etak Travels</Link>
        </p>
      </div>
    </div>
  )
}
