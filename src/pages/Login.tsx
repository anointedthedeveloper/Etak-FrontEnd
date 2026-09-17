import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, User, Lock, ArrowLeft } from 'lucide-react'
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

export default function Login() {
  const navigate = useNavigate()
  const { login, signInWithGoogle } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '', general: '' }))
  }

  const validate = () => {
    const e: typeof errors = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : 'Sign in failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (err?: string) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[#172033] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#08A9E0] focus:border-transparent transition-colors bg-white ${err ? 'border-red-400' : 'border-gray-200'}`

  return (
    <AuthLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <div className="w-11 h-11 rounded-full bg-[#08A9E0] flex items-center justify-center shrink-0">
          <User size={20} className="text-white" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-[#101B46]">Welcome Back</h2>
          <p className="text-sm text-[#667085]">Sign in to your Etak Travels account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#172033]">Email Address <span className="text-red-500">*</span></label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              autoComplete="email"
              className={inputClass(errors.email)}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#172033]">Password <span className="text-red-500">*</span></label>
            <Link to="/forgot-password" className="text-xs text-[#08A9E0] hover:underline font-medium">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              autoComplete="current-password"
              className={`${inputClass(errors.password)} pr-11`}
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#172033]">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
        </div>

        {errors.general && (
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
            <AlertCircle size={14} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#08A9E0] hover:bg-[#0798C8] text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : 'Sign In →'}
        </button>
      </form>

      <p className="text-center text-sm text-[#667085] mt-5">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[#08A9E0] font-semibold hover:underline">Create one</Link>
      </p>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
        <div className="relative flex justify-center"><span className="bg-[#F0F6FF] px-3 text-xs text-[#667085]">or continue with</span></div>
      </div>

      <button
        onClick={signInWithGoogle}
        type="button"
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm font-semibold text-[#172033] hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
      >
        <GoogleIcon /> Continue with Google
      </button>

      <div className="text-center mt-5">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#667085] hover:text-[#08A9E0] transition-colors">
          <ArrowLeft size={14} /> Back to Etak Travels
        </Link>
      </div>
    </AuthLayout>
  )
}
