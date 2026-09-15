import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Select, Textarea } from '../ui/FormFields'
import { Button } from '../ui/Button'

interface Props { compact?: boolean }

export default function AssistanceInquiryForm({ compact }: Props) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', serviceType: '', message: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/contact', { state: { type: 'assistance', ...form } })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {!compact && (
        <div className="grid grid-cols-2 gap-3">
          <Input label="Your Name" placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} required />
          <Input label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
        </div>
      )}
      <Select label="Service Needed" value={form.serviceType} onChange={e => set('serviceType', e.target.value)} placeholder="Select a service" required
        options={[
          { value: 'visa', label: 'Visa Assistance' },
          { value: 'consulting', label: 'Travel Consulting' },
          { value: 'insurance', label: 'Travel Insurance' },
          { value: 'airport', label: 'Airport Logistics' },
          { value: 'corporate', label: 'Corporate Travel' },
          { value: 'other', label: 'Other' },
        ]} />
      <Textarea label="Tell us about your travel needs" placeholder="Describe your travel plans or questions..." value={form.message} onChange={e => set('message', e.target.value)} rows={compact ? 3 : 4} required />
      <Button type="submit" variant="primary" className="w-full mt-1">Request Assistance</Button>
      <p className="text-xs text-[#667085] text-center">We'll get back to you within 24 hours.</p>
    </form>
  )
}
