import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Select } from '../ui/FormFields'
import { Button } from '../ui/Button'

interface Props { compact?: boolean }

export default function TourInquiryForm({ compact: _compact }: Props) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ destination: '', travelDate: '', duration: '', groupSize: '1', tourType: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/contact', { state: { type: 'tour', ...form } })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input label="Destination" placeholder="Where would you like to go?" value={form.destination} onChange={e => set('destination', e.target.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Travel Date" type="date" value={form.travelDate} onChange={e => set('travelDate', e.target.value)} min={new Date().toISOString().split('T')[0]} />
        <Select label="Duration" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="Select duration"
          options={['3-4 days', '5-7 days', '8-10 days', '11-14 days', '2+ weeks'].map(d => ({ value: d, label: d }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select label="Group Size" value={form.groupSize} onChange={e => set('groupSize', e.target.value)}
          options={['1', '2', '3-5', '6-10', '10+'].map(n => ({ value: n, label: n === '1' ? 'Solo' : `${n} people` }))} />
        <Select label="Tour Type" value={form.tourType} onChange={e => set('tourType', e.target.value)} placeholder="Select type"
          options={[{ value: 'leisure', label: 'Leisure' }, { value: 'educational', label: 'Educational' }, { value: 'business', label: 'Business' }, { value: 'holiday', label: 'Holiday' }]} />
      </div>
      <Button type="submit" variant="primary" className="w-full mt-1">Request Tour Information</Button>
      <p className="text-xs text-[#667085] text-center">This submits a travel inquiry — not a live booking.</p>
    </form>
  )
}
