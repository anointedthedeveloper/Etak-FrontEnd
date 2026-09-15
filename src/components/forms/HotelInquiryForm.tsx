import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Select } from '../ui/FormFields'
import { Button } from '../ui/Button'

interface Props { compact?: boolean }

export default function HotelInquiryForm({ compact: _compact }: Props) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ destination: '', checkIn: '', checkOut: '', rooms: '1', guests: '1' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/contact', { state: { type: 'hotel', ...form } })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input label="Destination" placeholder="City or country" value={form.destination} onChange={e => set('destination', e.target.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Check-in" type="date" value={form.checkIn} onChange={e => set('checkIn', e.target.value)} required min={new Date().toISOString().split('T')[0]} />
        <Input label="Check-out" type="date" value={form.checkOut} onChange={e => set('checkOut', e.target.value)} min={form.checkIn || new Date().toISOString().split('T')[0]} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select label="Rooms" value={form.rooms} onChange={e => set('rooms', e.target.value)}
          options={[1,2,3,4,5].map(n => ({ value: String(n), label: `${n} Room${n > 1 ? 's' : ''}` }))} />
        <Select label="Guests" value={form.guests} onChange={e => set('guests', e.target.value)}
          options={[1,2,3,4,5,6,7,8].map(n => ({ value: String(n), label: `${n} Guest${n > 1 ? 's' : ''}` }))} />
      </div>
      <Button type="submit" variant="primary" className="w-full mt-1">Request Hotel Assistance</Button>
      <p className="text-xs text-[#667085] text-center">This submits a travel inquiry — not a live booking.</p>
    </form>
  )
}
