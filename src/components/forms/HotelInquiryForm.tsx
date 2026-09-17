import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { LocationInput, DatePicker, TravellerSelector, type Travellers } from './FormWidgets'

interface Props { compact?: boolean }

export default function HotelInquiryForm({ compact: _compact }: Props) {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn]         = useState('')
  const [checkOut, setCheckOut]       = useState('')
  const [travellers, setTravellers]   = useState<Travellers>({ adults: 1, children: 0, infants: 0, class: 'economy' })
  const [rooms, setRooms]             = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/contact', {
      state: {
        type: 'hotel', destination, checkIn, checkOut, rooms,
        guests: `${travellers.adults} adult${travellers.adults !== 1 ? 's' : ''}${travellers.children ? `, ${travellers.children} child${travellers.children !== 1 ? 'ren' : ''}` : ''}`,
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <LocationInput
        label="Destination"
        value={destination}
        onChange={setDestination}
        placeholder="City or country"
        mode="hotel"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <DatePicker label="Check-in"  value={checkIn}  onChange={setCheckIn}  required />
        <DatePicker label="Check-out" value={checkOut} onChange={setCheckOut} min={checkIn} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Rooms counter */}
        <div>
          <label className="block text-xs font-semibold text-[#101B46] mb-1">Rooms</label>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white">
            <button type="button" onClick={() => setRooms(r => Math.max(1, r - 1))}
              className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-[#667085] hover:border-[#08A9E0] hover:text-[#08A9E0] transition-colors text-sm font-bold">−</button>
            <span className="flex-1 text-center text-sm font-semibold text-[#101B46]">{rooms}</span>
            <button type="button" onClick={() => setRooms(r => Math.min(10, r + 1))}
              className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-[#667085] hover:border-[#08A9E0] hover:text-[#08A9E0] transition-colors text-sm font-bold">+</button>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-xs font-semibold text-[#101B46] mb-1">Guests</label>
          <TravellerSelector value={travellers} onChange={setTravellers} showClass={false} />
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full mt-1">Request Hotel Assistance</Button>
      <p className="text-xs text-[#667085] text-center">This submits a travel inquiry — not a live booking.</p>
    </form>
  )
}
