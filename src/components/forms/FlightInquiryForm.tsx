import { useState } from 'react'
import { AlertCircle, Plane } from 'lucide-react'
import { Button } from '../ui/Button'
import { LocationInput, DatePicker, TravellerSelector, type Travellers } from './FormWidgets'
import { apiService } from '../../services/api'
import SubmitSuccess from './SubmitSuccess'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../ui/FormFields'

interface Props { compact?: boolean }

type Step = 'search' | 'contact'

// ── Main form ─────────────────────────────────────────────────────────────────
export default function FlightInquiryForm({ compact: _compact }: Props) {
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState<Step>('search')
  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip')

  const [from, setFrom] = useState('')
  const [to, setTo]     = useState('')
  const [departure, setDeparture]   = useState('')
  const [returnDate, setReturn]     = useState('')
  const [travellers, setTravellers] = useState<Travellers>({ adults: 1, children: 0, infants: 0, class: 'economy' })

  const [name, setName]   = useState(isAuthenticated ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() : '')
  const [email, setEmail] = useState(isAuthenticated ? (user?.email ?? '') : '')
  const [phone, setPhone] = useState(isAuthenticated ? (user?.phone ?? '') : '')

  const [fieldError, setFieldError] = useState(false)
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({})

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [submittedId, setSubmittedId]   = useState<string | null>(null)

  const sameLocation = from.trim().toLowerCase() === to.trim().toLowerCase() && from.trim() !== ''

  const handleContinue = () => {
    if (!from.trim() || !to.trim() || !departure || sameLocation) {
      setFieldError(true)
      return
    }
    setFieldError(false)
    setStep('contact')
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      const e: Record<string, string> = {}
      if (!name.trim())  e.name  = 'Required'
      if (!email.trim()) e.email = 'Required'
      if (!phone.trim()) e.phone = 'Required'
      if (Object.keys(e).length) { setContactErrors(e); return }
    }
    setContactErrors({})
    setSubmitStatus('loading')
    try {
      const { id } = await apiService.submitInquiry({
        type: 'flight',
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        details: { tripType, from, to, departure, returnDate, travellers },
        message: `Flight inquiry: ${from}→${to}, ${departure}${returnDate ? `–${returnDate}` : ''}, ${travellers.adults}A/${travellers.children}C/${travellers.infants}I, ${travellers.class}`,
      })
      setSubmittedId(id)
    } catch {
      setSubmitStatus('error')
    }
  }

  if (submittedId) {
    return <SubmitSuccess inquiryId={submittedId} type="flight" onReset={() => { setSubmittedId(null); setSubmitStatus('idle'); setStep('search') }} />
  }

  // ── Step: Search ──────────────────────────────────────────────────────────
  if (step === 'search') return (
    <div className="flex flex-col gap-3">
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
        <LocationInput label="From" value={from} onChange={v => { setFrom(v); setFieldError(false) }}
          placeholder="City or country" required error={fieldError && !from.trim() ? 'Required' : undefined} />
        <LocationInput label="To" value={to} onChange={v => { setTo(v); setFieldError(false) }}
          placeholder="City or country" required error={fieldError && !to.trim() ? 'Required' : sameLocation ? 'Must differ from origin' : undefined} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DatePicker label="Departure" value={departure}
          onChange={v => { setDeparture(v); if (returnDate && returnDate <= v) setReturn('') }} required
          error={fieldError && !departure ? 'Required' : undefined} />
        {tripType === 'round-trip' && (
          <DatePicker label="Return" value={returnDate} onChange={setReturn} min={departure} />
        )}
      </div>

      <TravellerSelector value={travellers} onChange={setTravellers} showClass />

      {fieldError && (!from.trim() || !to.trim() || !departure) && (
        <p className="text-xs text-red-500">Please fill in origin, destination and departure date.</p>
      )}
      {fieldError && sameLocation && (
        <p className="text-xs text-red-500">Origin and destination cannot be the same.</p>
      )}

      <Button type="button" variant="primary" className="w-full" onClick={handleContinue}>
        <Plane size={14} /> Continue to Contact
      </Button>
    </div>
  )

  // ── Step: Contact ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setStep('search')}
          className="text-xs text-[#08A9E0] flex items-center gap-1 hover:underline">
          Back
        </button>
        <p className="text-xs font-semibold text-[#101B46]">
          Flight inquiry
        </p>
      </div>

      <div className="p-2.5 bg-[#EAF8FD] rounded-control border border-[#08A9E0]/20 text-xs">
        <p className="font-semibold text-[#101B46]">
          {from} → {to}
        </p>
        <p className="text-[#667085]">
          {departure}{returnDate ? ` – ${returnDate}` : ''} · {travellers.adults} adult{travellers.adults > 1 ? 's' : ''}
        </p>
      </div>

      {!isAuthenticated && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Your Name" placeholder="Full name" value={name} onChange={e => { setName(e.target.value); setContactErrors(p => ({ ...p, name: '' })) }} required error={contactErrors.name} />
            <Input label="Email" type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setContactErrors(p => ({ ...p, email: '' })) }} required error={contactErrors.email} />
          </div>
          <Input label="Phone" type="tel" placeholder="+234 xxx xxx xxxx" value={phone} onChange={e => { setPhone(e.target.value); setContactErrors(p => ({ ...p, phone: '' })) }} required error={contactErrors.phone} />
        </>
      )}

      {submitStatus === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
        </div>
      )}

      <Button type="button" variant="primary" className="w-full" loading={submitStatus === 'loading'}
        onClick={() => handleSubmit()}>
        Submit Inquiry
      </Button>
      <p className="text-xs text-[#667085] text-center">This submits a travel inquiry — not a live booking.</p>
    </div>
  )
}
