import { useState } from 'react'
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'

export default function AdminSettings() {
  const [form, setForm] = useState({ next: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.next.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (form.next !== form.confirm) { setError('Passwords do not match.'); return }
    setStatus('loading'); setError('')
    const { error: err } = await supabase.auth.updateUser({ password: form.next })
    if (err) { setError(err.message); setStatus('error'); return }
    setStatus('success')
    setForm({ next: '', confirm: '' })
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#08A9E0] text-white flex items-center justify-center shadow-md shadow-[#08A9E0]/20">
          <Shield size={17} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[#101B46]">Admin Settings</h1>
          <p className="text-sm text-[#667085] mt-0.5">Manage your admin account security</p>
        </div>
      </div>

      <div className="max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock size={16} className="text-[#08A9E0]" />
            <h2 className="font-semibold text-[#101B46]">Change Admin Password</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-[#172033] mb-1.5">New Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={form.next}
                onChange={e => setForm(f => ({ ...f, next: e.target.value }))}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 pr-11 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-[34px] text-[#667085]">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#172033] mb-1.5">Confirm Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="Repeat password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#08A9E0]"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="md" loading={status === 'loading'}>
                Update password
              </Button>
              {status === 'success' && (
                <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                  <CheckCircle2 size={15} /> Password updated
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
