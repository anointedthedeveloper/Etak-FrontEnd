import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { LocationInput, DatePicker, TravellerSelector, type Travellers } from './FormWidgets'

interface Props { compact?: boolean }

export default function FlightInquiryForm({ compact: _compact }: Props) {
  const navigate = useNavigate()
  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip')
  const [from, setFrom]           = useState('')
  const [to, setTo]               = useState('')
  const [departure, setDeparture] = useState('')
  const [returnDate, setReturn]   = useState('')
  const [travellers, setTravellers] = useState<Travellers>({ adults: 1, children: 0, infants: 0, class: 'economy' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/contact', {
      state: {
        type: 'flight', tripType, from, to, departure, returnDate,
        travelers: `${travellers.adults} adult${travellers.adults !== 1 ? 's' : ''}${travellers.children ? `, ${travellers.children} child${travellers.children !== 1 ? 'ren' : ''}` : ''}${travellers.infants ? `, ${travellers.infants} infant${travellers.infants !== 1 ? 's' : ''}` : ''}`,
        travelClass: travellers.class,
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Trip type */}
      <div className="flex gap-1.5 flex-wrap">
        {(['round-trip', 'one-way', 'multi-city'] as const).map(t => (
          <button key={t} type="button" onClick={() => setTripType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              tripType === t ? 'bg-[#08A9E0] text-white' : 'bg-gray-100 text-[#667085] hover:bg-gray-200'
            }`}>
            {t === 'round-trip' ? 'Round Trip' : t === 'one-way' ? 'One Way' : 'Multi-City'}
          </button>
        ))}
      </div>

      {/* From / To */}
      <div className="grid grid-cols-2 gap-3">
        <LocationInput label="From" value={from} onChange={setFrom} placeholder="City or airport" mode="airport" autoDetect required />
        <LocationInput label="To"   value={to}   onChange={setTo}   placeholder="City or airport" mode="airport" required />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <DatePicker label="Departure" value={departure} onChange={setDeparture} required />
        {tripType === 'round-trip' && (
          <DatePicker label="Return" value={returnDate} onChange={setReturn} min={departure} />
        )}
      </div>

      {/* Travellers */}
      <TravellerSelector value={travellers} onChange={setTravellers} showClass />

      <Button type="submit" variant="primary" className="w-full mt-1">Request Flight Assistance</Button>
      <p className="text-xs text-[#667085] text-center">This submits a travel inquiry — not a live booking.</p>
    </form>
  )
}
