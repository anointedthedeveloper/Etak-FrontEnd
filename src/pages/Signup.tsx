import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle2, User, Mail, Phone, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/layout/AuthLayout'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
)

function FieldWrapper({ label, required, error, icon: Icon, children }: {
  label: string; required?: boolean; error?: string
  icon: React.ElementType; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[#172033]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
        {children}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function Signup() {
  const navigate = useNavigate()
  const { register, signInWithGoogle } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', terms: false })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string | boolean) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '', general: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'At least 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!form.terms) e.terms = 'You must accept the terms'
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

  const inputClass = (err?: string) =>
    `w-full pl-9 pr-4 py-2 rounded-xl border text-sm text-[#172033] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#08A9E0]/35 focus:border-[#08A9E0]/30 transition-colors bg-white ${err ? 'border-red-400' : 'border-[#08A9E0]/15 hover:border-[#08A9E0]/35'}`

  return (
    <AuthLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-[#08A9E0] flex items-center justify-center shrink-0 shadow-md shadow-[#08A9E0]/20">
          <User size={17} className="text-white" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-[#101B46]">Create Your Account</h2>
          <p className="text-xs text-[#667085]">Join Etak Travels and manage your journeys in one place</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-2.5">
          <FieldWrapper label="First Name" required error={errors.firstName} icon={User}>
            <input placeholder="First name" value={form.firstName} onChange={e => set('firstName', e.target.value)} className={inputClass(errors.firstName)} />
          </FieldWrapper>
          <FieldWrapper label="Last Name" required error={errors.lastName} icon={User}>
            <input placeholder="Last name" value={form.lastName} onChange={e => set('lastName', e.target.value)} className={inputClass(errors.lastName)} />
          </FieldWrapper>
        </div>

        <FieldWrapper label="Email Address" required error={errors.email} icon={Mail}>
          <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" className={inputClass(errors.email)} />
        </FieldWrapper>

        <FieldWrapper label="Phone Number" required error={errors.phone} icon={Phone}>
          <input type="tel" placeholder="+234 xxx xxx xxxx" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass(errors.phone)} />
        </FieldWrapper>

        <FieldWrapper label="Password" required error={errors.password} icon={Lock}>
          <input type={showPw ? 'text' : 'password'} placeholder="Create a password" value={form.password} onChange={e => set('password', e.target.value)} autoComplete="new-password" className={`${inputClass(errors.password)} pr-9`} />
          <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#172033]">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </FieldWrapper>

        <FieldWrapper label="Confirm Password" required error={errors.confirmPassword} icon={Lock}>
          <input type={showPw ? 'text' : 'password'} placeholder="Confirm your password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} autoComplete="new-password" className={`${inputClass(errors.confirmPassword)} pr-9`} />
          {form.confirmPassword && form.password === form.confirmPassword && (
            <CheckCircle2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
          )}
        </FieldWrapper>

        {/* Terms */}
        <div className="flex flex-col gap-0.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.terms} onChange={e => set('terms', e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300 text-[#08A9E0] focus:ring-[#08A9E0]" />
            <span className="text-xs text-[#667085]">
              I agree to the{' '}
              <Link to="/terms" className="text-[#08A9E0] font-medium hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-[#08A9E0] font-medium hover:underline">Privacy Policy</Link>
            </span>
          </label>
          {errors.terms && <p className="text-xs text-red-500 ml-5">{errors.terms}</p>}
        </div>

        {errors.general && (
          <div className="flex items-center gap-2 p-2.5 bg-red-50 rounded-xl border border-red-200">
            <AlertCircle size={13} className="text-red-500 shrink-0" />
            <p className="text-xs text-red-600">{errors.general}</p>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#08A9E0]/25 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            : 'Create Account →'}
        </button>
      </form>

      <p className="text-center text-xs text-[#667085] mt-3">
        Already have an account?{' '}
        <Link to="/login" className="text-[#08A9E0] font-semibold hover:underline">Sign in</Link>
      </p>

      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
        <div className="relative flex justify-center"><span className="bg-[#F0F6FF] px-3 text-xs text-[#667085]">or continue with</span></div>
      </div>

      <button onClick={signInWithGoogle} type="button"
        className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border-2 border-[#08A9E0]/15 bg-white text-sm font-semibold text-[#172033] hover:bg-[#F4FBFE] hover:border-[#08A9E0]/35 transition-all hover:-translate-y-0.5 cursor-pointer">
        <GoogleIcon /> Continue with Google
      </button>

      <div className="text-center mt-3">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#08A9E0] transition-colors">
          <ArrowLeft size={12} /> Back to Etak Travels
        </Link>
      </div>
    </AuthLayout>
  )
}
