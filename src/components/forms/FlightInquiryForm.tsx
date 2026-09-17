import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { LocationInput, DatePicker, TravellerSelector, type Travellers } from './FormWidgets'
import { apiService } from '../../services/api'
import SubmitSuccess from './SubmitSuccess'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../ui/FormFields'

interface Props { compact?: boolean }

export default function FlightInquiryForm({ compact: _compact }: Props) {
  const { user, isAuthenticated } = useAuth()
  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip')
  const [from, setFrom]           = useState('')
  const [to, setTo]               = useState('')
  const [departure, setDeparture] = useState('')
  const [returnDate, setReturn]   = useState('')
  const [travellers, setTravellers] = useState<Travellers>({ adults: 1, children: 0, infants: 0, class: 'economy' })
  const [name, setName]   = useState(isAuthenticated ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() : '')
  const [email, setEmail] = useState(isAuthenticated ? (user?.email ?? '') : '')
  const [phone, setPhone] = useState(isAuthenticated ? (user?.phone ?? '') : '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const { id } = await apiService.submitInquiry({
        type: 'flight',
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        details: { tripType, from, to, departure, returnDate, travellers },
        message: `Flight inquiry: ${from} → ${to}, ${departure}${returnDate ? ` – ${returnDate}` : ''}, ${travellers.adults}A/${travellers.children}C/${travellers.infants}I, ${travellers.class}`,
      })
      setSubmittedId(id)
    } catch {
      setStatus('error')
    }
  }

  if (submittedId) {
    return <SubmitSuccess inquiryId={submittedId} type="flight" onReset={() => { setSubmittedId(null); setStatus('idle') }} />
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

      <div className="grid grid-cols-2 gap-3">
        <LocationInput label="From" value={from} onChange={setFrom} placeholder="City or airport" mode="airport" autoDetect required />
        <LocationInput label="To"   value={to}   onChange={setTo}   placeholder="City or airport" mode="airport" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DatePicker label="Departure" value={departure} onChange={setDeparture} required />
        {tripType === 'round-trip' && (
          <DatePicker label="Return" value={returnDate} onChange={setReturn} min={departure} />
        )}
      </div>

      <TravellerSelector value={travellers} onChange={setTravellers} showClass />

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
        Request Flight Assistance
      </Button>
      <p className="text-xs text-[#667085] text-center">This submits a travel inquiry — not a live booking.</p>
    </form>
  )
}
