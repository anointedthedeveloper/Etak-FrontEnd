import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Input, Select, Textarea } from '../ui/FormFields'
import { Button } from '../ui/Button'
import { apiService } from '../../services/api'
import SubmitSuccess from './SubmitSuccess'
import { useAuth } from '../../context/AuthContext'

interface Props { compact?: boolean }

export default function AssistanceInquiryForm({ compact }: Props) {
  const { user, isAuthenticated } = useAuth()
  const [form, setForm] = useState({
    name:        isAuthenticated ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() : '',
    email:       isAuthenticated ? (user?.email ?? '') : '',
    serviceType: '',
    message:     '',
  })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const { id } = await apiService.submitInquiry({
        type:    'assistance',
        name:    form.name || undefined,
        email:   form.email || undefined,
        details: { serviceType: form.serviceType },
        message: form.message,
      })
      setSubmittedId(id)
    } catch {
      setStatus('error')
    }
  }

  if (submittedId) {
    return <SubmitSuccess inquiryId={submittedId} type="assistance" onReset={() => { setSubmittedId(null); setStatus('idle') }} />
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {!compact && !isAuthenticated && (
        <div className="grid grid-cols-2 gap-3">
          <Input label="Your Name" placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} required />
          <Input label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
        </div>
      )}
      <Select label="Service Needed" value={form.serviceType} onChange={e => set('serviceType', e.target.value)} placeholder="Select a service" required
        options={[
          { value: 'visa',        label: 'Visa Assistance' },
          { value: 'consulting',  label: 'Travel Consulting' },
          { value: 'insurance',   label: 'Travel Insurance' },
          { value: 'airport',     label: 'Airport Logistics' },
          { value: 'corporate',   label: 'Corporate Travel' },
          { value: 'other',       label: 'Other' },
        ]} />
      <Textarea label="Tell us about your travel needs" placeholder="Describe your travel plans or questions..." value={form.message} onChange={e => set('message', e.target.value)} rows={compact ? 3 : 4} required />

      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full mt-1" loading={status === 'loading'}>
        Request Assistance
      </Button>
      <p className="text-xs text-[#667085] text-center">We'll get back to you within 24 hours.</p>
    </form>
  )
}
