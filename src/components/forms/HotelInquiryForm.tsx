import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/FormFields'
import { LocationInput, DatePicker, TravellerSelector, type Travellers } from './FormWidgets'
import { apiService } from '../../services/api'
import SubmitSuccess from './SubmitSuccess'
import { useAuth } from '../../context/AuthContext'

interface Props { compact?: boolean }

export default function HotelInquiryForm({ compact: _compact }: Props) {
  const { user, isAuthenticated } = useAuth()
  const [destination, setDestination] = useState('')
  const [checkIn, setCheckIn]         = useState('')
  const [checkOut, setCheckOut]       = useState('')
  const [travellers, setTravellers]   = useState<Travellers>({ adults: 1, children: 0, infants: 0, class: 'economy' })
  const [rooms, setRooms]             = useState(1)
  const [name, setName]   = useState(isAuthenticated ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() : '')
  const [email, setEmail] = useState(isAuthenticated ? (user?.email ?? '') : '')
  const [phone, setPhone] = useState(isAuthenticated ? (user?.phone ?? '') : '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const handleCheckInChange = (val: string) => {
    setCheckIn(val)
    if (checkOut && checkOut <= val) setCheckOut('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const { id } = await apiService.submitInquiry({
        type: 'hotel',
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        details: { destination, checkIn, checkOut, rooms, travellers },
        message: `Hotel inquiry: ${destination}, ${checkIn} – ${checkOut}, ${rooms} room(s), ${travellers.adults}A/${travellers.children}C`,
      })
      setSubmittedId(id)
    } catch {
      setStatus('error')
    }
  }

  if (submittedId) {
    return <SubmitSuccess inquiryId={submittedId} type="hotel" onReset={() => { setSubmittedId(null); setStatus('idle') }} />
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <LocationInput label="Destination" value={destination} onChange={setDestination} placeholder="City or country" required />

      <div className="grid grid-cols-2 gap-3">
        <DatePicker label="Check-in"  value={checkIn}  onChange={handleCheckInChange}  required />
        <DatePicker label="Check-out" value={checkOut} onChange={setCheckOut} min={checkIn} />
      </div>

      <div className="grid grid-cols-2 gap-3">
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
        <div>
          <label className="block text-xs font-semibold text-[#101B46] mb-1">Guests</label>
          <TravellerSelector value={travellers} onChange={setTravellers} showClass={false} />
        </div>
      </div>

      {!isAuthenticated && (
        <div className="grid grid-cols-2 gap-3">
          <Input label="Your Name" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
      )}
      {!isAuthenticated && (
        <Input label="Phone (optional)" type="tel" placeholder="+234 xxx xxx xxxx" value={phone} onChange={e => setPhone(e.target.value)} />
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full mt-1" loading={status === 'loading'}>
        Request Hotel Assistance
      </Button>
      <p className="text-xs text-[#667085] text-center">This submits a travel inquiry — not a live booking.</p>
    </form>
  )
}
