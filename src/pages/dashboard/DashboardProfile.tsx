import { useState } from 'react'
import { User, Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/FormFields'
import { useAuth } from '../../context/AuthContext'

export default function DashboardProfile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    phone:     user?.phone     ?? '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await updateProfile(form)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.')
      setStatus('error')
    }
  }

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?'

  return (
    <div className="p-6 xl:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#101B46]">Profile</h1>
        <p className="text-sm text-[#667085] mt-0.5">Manage your personal information</p>
      </div>

      <div className="grid xl:grid-cols-[300px_1fr] gap-6 max-w-4xl">
        {/* Avatar card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#08A9E0] flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-[#172033]">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-[#667085] mt-0.5 break-all">{user?.email}</p>
          </div>
          <div className="w-full space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs text-[#667085] bg-gray-50 rounded-xl p-3">
              <Mail size={13} className="text-[#08A9E0] shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-2 text-xs text-[#667085] bg-gray-50 rounded-xl p-3">
                <Phone size={13} className="text-[#08A9E0] shrink-0" />
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-[#667085] bg-gray-50 rounded-xl p-3">
              <User size={13} className="text-[#08A9E0] shrink-0" />
              <span>Member since {formatDate(user?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-display font-bold text-[#101B46] text-lg mb-5">Edit information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="First name"
                value={form.firstName}
                onChange={e => set('firstName', e.target.value)}
                placeholder="First name"
                required
              />
              <Input
                label="Last name"
                value={form.lastName}
                onChange={e => set('lastName', e.target.value)}
                placeholder="Last name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#172033] mb-1.5">Email address</label>
              <input
                value={user?.email ?? ''}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-[#667085] bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-[#667085] mt-1">Email cannot be changed here.</p>
            </div>
            <Input
              label="Phone number"
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+234 xxx xxx xxxx"
            />

            {status === 'error' && error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="md" loading={status === 'loading'}>
                Save changes
              </Button>
              {status === 'success' && (
                <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                  <CheckCircle2 size={15} /> Profile updated
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
