import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Input } from '../components/ui/FormFields'
import { Button } from '../components/ui/Button'
import { authService } from '../services/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await authService.resetPassword(email)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101B46] via-[#1a2a6c] to-[#45419A] px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="Etak Travels" className="h-14 w-14 object-contain rounded-full" />
          </Link>
          <h1 className="font-display text-3xl font-bold text-white">Reset Your Password</h1>
          <p className="text-blue-200 text-sm">We’ll help you get back into your Etak account.</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          {submitted ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="text-green-600" size={32} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#101B46]">Check your email</h2>
              <p className="mt-3 text-sm text-[#667085]">
                If an account exists for <span className="font-semibold text-[#172033]">{email}</span>, a password reset link has been sent. Check your inbox and spam folder.
              </p>
              <Link to="/login" className="mt-6 inline-block text-[#08A9E0] hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
              />

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Send reset link
              </Button>

              <p className="text-center text-sm text-[#667085]">
                Remembered your password?{' '}
                <Link to="/login" className="font-medium text-[#08A9E0] hover:underline">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
