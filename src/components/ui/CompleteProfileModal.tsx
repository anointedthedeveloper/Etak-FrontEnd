import { useState } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from './Button'
import { Input } from './FormFields'
import { supabase } from '../../lib/supabase'

interface Props {
  email: string
  initialFirstName?: string
  initialLastName?: string
  onComplete: (data: { firstName: string; lastName: string; phone: string }) => void
}

export default function CompleteProfileModal({ email, initialFirstName, initialLastName, onComplete }: Props) {
  const [form, setForm] = useState({
    firstName: initialFirstName ?? '',
    lastName:  initialLastName  ?? '',
    phone:     '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k: keyof typeof form, v: string) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName.trim()) { setError('First name is required.'); return }
    if (!form.phone.trim())     { setError('Phone number is required.'); return }
    setError('')
    setLoading(true)

    const { error: err } = await supabase.auth.updateUser({
      data: {
        first_name: form.firstName,
        last_name:  form.lastName,
        phone:      form.phone,
      },
    })

    setLoading(false)
    if (err) { setError(err.message); return }
    onComplete(form)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-[#101B46]">Complete your profile</h2>
            <p className="text-sm text-[#667085] mt-0.5">
              Just a few more details to finish setting up your account.
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#EAF8FD] flex items-center justify-center shrink-0 ml-3">
            <CheckCircle2 size={18} className="text-[#08A9E0]" />
          </div>
        </div>

        {/* Email — read only */}
        <div className="mb-4 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs text-[#667085] mb-0.5">Signed in as</p>
          <p className="text-sm font-medium text-[#172033]">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              placeholder="First name"
              value={form.firstName}
              onChange={e => set('firstName', e.target.value)}
              required
            />
            <Input
              label="Last name"
              placeholder="Last name"
              value={form.lastName}
              onChange={e => set('lastName', e.target.value)}
            />
          </div>

          <Input
            label="Phone number"
            type="tel"
            placeholder="+234 xxx xxx xxxx"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            required
          />

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
            Save and continue
          </Button>
        </form>
      </div>
    </div>
  )
}
