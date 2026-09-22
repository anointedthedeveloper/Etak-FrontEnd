import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Plane, Globe, Shield, Headphones } from 'lucide-react'
import { Input } from '../components/ui/FormFields'
import { Button } from '../components/ui/Button'
import SEO from '../components/ui/SEO'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: email, error: rpcError } = await supabase.rpc('admin_login', {
        p_username: credentials.username,
        p_password: credentials.password,
      })

      if (rpcError || !email) {
        setError('Invalid credentials. Please try again.')
        setLoading(false)
        return
      }

      // Sign into Supabase Auth so auth.uid() is set and RLS policies work
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: credentials.password,
      })

      if (authError) {
        setError('Invalid credentials. Please try again.')
        setLoading(false)
        return
      }

      localStorage.setItem('isAdmin', 'true')
      localStorage.setItem('adminTimestamp', Date.now().toString())
      navigate('/admin/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <>
      <SEO
        title="Admin Login"
        description="Admin login for Etak Travels management"
        url="/adlog"
        noIndex
      />
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#101B46] relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20">
              <Globe size={200} className="text-[#08A9E0]" />
            </div>
            <div className="absolute bottom-20 right-20">
              <Plane size={150} className="text-[#08A9E0] transform -rotate-45" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center h-full px-12 xl:px-16">
            <div className="max-w-md">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <img src="/brand/logo.png" alt="Etak Travels" className="h-16 w-16 object-contain" />
                <div>
                  <h1 className="font-display text-3xl font-bold text-white">Etak Travels</h1>
                  <p className="text-blue-200 text-sm">Admin Portal</p>
                </div>
              </div>

              {/* Description */}
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Welcome Back
              </h2>
              <p className="text-blue-200 text-lg mb-8 leading-relaxed">
                Access the admin dashboard to manage enquiries, users, and monitor your travel business performance.
              </p>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#08A9E0]/20 flex items-center justify-center">
                    <Shield size={24} className="text-[#08A9E0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Secure Access</h3>
                    <p className="text-blue-200 text-sm">Protected authentication system</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#08A9E0]/20 flex items-center justify-center">
                    <Globe size={24} className="text-[#08A9E0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Global Management</h3>
                    <p className="text-blue-200 text-sm">Manage travel operations worldwide</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#08A9E0]/20 flex items-center justify-center">
                    <Headphones size={24} className="text-[#08A9E0]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">24/7 Support</h3>
                    <p className="text-blue-200 text-sm">Round-the-clock assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-[#F8FAFC]">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <img src="/brand/logo.png" alt="Etak Travels" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="font-display text-xl font-bold text-[#101B46]">Etak Travels</h1>
                <p className="text-[#667085] text-xs">Admin Portal</p>
              </div>
            </div>

            <div className="bg-white rounded-panel shadow-panel border border-gray-100 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="hidden lg:flex items-center justify-center gap-3 mb-4">
                  <img src="/brand/logo.png" alt="Etak Travels" className="h-14 w-14 object-contain" />
                </div>
                <h1 className="font-display text-2xl font-bold text-[#101B46] mb-2">Admin Login</h1>
                <p className="text-sm text-[#667085]">Access the administration dashboard</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Username"
                  placeholder="Enter admin username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter admin password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  Sign In as Admin
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-[#667085] hover:text-[#08A9E0] transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
