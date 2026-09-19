import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react'
import { Input } from '../components/ui/FormFields'
import { Button } from '../components/ui/Button'
import SEO from '../components/ui/SEO'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple admin authentication (in production, this should use a proper backend)
    if (credentials.username === 'admin' && credentials.password === 'etakadmin2024') {
      // Store admin session in localStorage
      localStorage.setItem('isAdmin', 'true')
      localStorage.setItem('adminTimestamp', Date.now().toString())
      navigate('/admin/dashboard')
    } else {
      setError('Invalid credentials. Please try again.')
    }

    setLoading(false)
  }

  return (
    <>
      <SEO
        title="Admin Login"
        description="Admin login for Etak Travels management"
        url="/adlog"
      />
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#101B46] flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={28} className="text-[#08A9E0]" />
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
                icon={<Lock size={16} className="text-[#667085]" />}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter admin password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                icon={<Lock size={16} className="text-[#667085]" />}
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
    </>
  )
}
