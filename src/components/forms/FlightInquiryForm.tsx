import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Select } from '../ui/FormFields'
import { Button } from '../ui/Button'

interface Props { compact?: boolean }

export default function FlightInquiryForm({ compact }: Props) {
  const navigate = useNavigate()
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip')
  const [form, setForm] = useState({ from: '', to: '', departure: '', returnDate: '', travelers: '1', travelClass: 'economy' })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/contact', { state: { type: 'flight', ...form, tripType } })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2 mb-1">
        {(['round-trip', 'one-way'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTripType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              tripType === t ? 'bg-[#08A9E0] text-white' : 'bg-gray-100 text-[#667085] hover:bg-gray-200'
            }`}
          >
            {t === 'round-trip' ? 'Round Trip' : 'One Way'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="From" placeholder="Departure city" value={form.from} onChange={e => set('from', e.target.value)} required />
        <Input label="To" placeholder="Destination city" value={form.to} onChange={e => set('to', e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Departure" type="date" value={form.departure} onChange={e => set('departure', e.target.value)} required min={new Date().toISOString().split('T')[0]} />
        {tripType === 'round-trip' && (
          <Input label="Return" type="date" value={form.returnDate} onChange={e => set('returnDate', e.target.value)} min={form.departure || new Date().toISOString().split('T')[0]} />
        )}
      </div>

      {!compact && (
        <div className="grid grid-cols-2 gap-3">
          <Select label="Travelers" value={form.travelers} onChange={e => set('travelers', e.target.value)}
            options={[1,2,3,4,5,6,7,8,9,10].map(n => ({ value: String(n), label: `${n} Traveller${n > 1 ? 's' : ''}` }))} />
          <Select label="Class" value={form.travelClass} onChange={e => set('travelClass', e.target.value)}
            options={[{ value: 'economy', label: 'Economy' }, { value: 'business', label: 'Business' }, { value: 'first', label: 'First Class' }]} />
        </div>
      )}

      {compact && (
        <div className="grid grid-cols-2 gap-3">
          <Select label="Travelers" value={form.travelers} onChange={e => set('travelers', e.target.value)}
            options={[1,2,3,4,5].map(n => ({ value: String(n), label: `${n} Traveller${n > 1 ? 's' : ''}` }))} />
          <Select label="Class" value={form.travelClass} onChange={e => set('travelClass', e.target.value)}
            options={[{ value: 'economy', label: 'Economy' }, { value: 'business', label: 'Business' }, { value: 'first', label: 'First' }]} />
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full mt-1">Request Flight Assistance</Button>
      <p className="text-xs text-[#667085] text-center">This submits a travel inquiry — not a live booking.</p>
    </form>
  )
}
