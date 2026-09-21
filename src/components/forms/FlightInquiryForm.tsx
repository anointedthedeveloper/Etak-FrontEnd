import { useState, useRef, useEffect } from 'react'
import { AlertCircle, Plane, MapPin } from 'lucide-react'
import { Button } from '../ui/Button'
import { DatePicker, TravellerSelector, type Travellers } from './FormWidgets'
import { apiService } from '../../services/api'
import { searchAirports as searchLocal } from '../../data/airports'
import SubmitSuccess from './SubmitSuccess'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../ui/FormFields'

interface Props { compact?: boolean }

type Step = 'search' | 'contact'

// ── Airport autocomplete ──────────────────────────────────────────────────────
function AirportInput({
  label, value, iataCode, onChange, placeholder, required, error,
}: {
  label: string; value: string; iataCode: string
  onChange: (display: string, iata: string) => void
  placeholder?: string; required?: boolean; error?: boolean
}) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<{ code: string; name: string; city: string; country: string; state?: string }[]>([])
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])
  useEffect(() => {
    const h = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const search = (q: string) => {
    setQuery(q)
    onChange(q, '')
    if (q.length < 2) { setResults([]); setOpen(false); return }

    const local = searchLocal(q)
    if (local.length > 0) { setResults(local); setOpen(true) }
  }

  const select = (r: { code: string; city: string; country: string; name: string }) => {
    const display = `${r.city} (${r.code})`
    setQuery(display)
    onChange(display, r.code)
    setOpen(false)
    setResults([])
  }

  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-xs font-semibold text-[#101B46] mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => search(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className={`w-full pl-8 pr-10 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 bg-white text-[#172033] placeholder-[#9CA3AF] ${
            error && !iataCode ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-[#08A9E0]'
          }`}
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {iataCode && <span className="text-[10px] font-bold text-[#08A9E0] bg-[#EAF8FD] px-1.5 py-0.5 rounded">{iataCode}</span>}
        </div>
      </div>
      {error && !iataCode && query.length > 0 && (
        <p className="text-[10px] text-red-500 mt-0.5">Select an airport from the list</p>
      )}
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden max-h-56 overflow-y-auto">
          {results.map((r, idx) => (
            <button
              key={`${r.code}-${idx}`}
              type="button"
              onMouseDown={e => { e.preventDefault(); select(r) }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[#EAF8FD] transition-colors border-b border-gray-50 last:border-0"
            >
              <span className="w-9 text-center text-xs font-bold text-[#08A9E0] bg-[#EAF8FD] rounded-lg py-1 shrink-0">{r.code}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#172033] truncate">{r.city}{(r as { state?: string }).state ? `, ${(r as { state?: string }).state}` : ''}</p>
                <p className="text-[10px] text-[#667085] truncate">{r.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────
export default function FlightInquiryForm({ compact: _compact }: Props) {
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState<Step>('search')
  const [tripType, setTripType] = useState<'round-trip' | 'one-way' | 'multi-city'>('round-trip')

  const [fromDisplay, setFromDisplay] = useState('')
  const [fromIata, setFromIata]       = useState('')
  const [toDisplay, setToDisplay]     = useState('')
  const [toIata, setToIata]           = useState('')
  const [departure, setDeparture]     = useState('')
  const [returnDate, setReturn]       = useState('')
  const [travellers, setTravellers]   = useState<Travellers>({ adults: 1, children: 0, infants: 0, class: 'economy' })

  const [name, setName]   = useState(isAuthenticated ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() : '')
  const [email, setEmail] = useState(isAuthenticated ? (user?.email ?? '') : '')
  const [phone, setPhone] = useState(isAuthenticated ? (user?.phone ?? '') : '')

  const [fieldError, setFieldError] = useState(false)
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({})

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [submittedId, setSubmittedId]   = useState<string | null>(null)

  const handleContinue = () => {
    if (!fromIata || !toIata || !departure) {
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
        details: { tripType, from: fromDisplay, to: toDisplay, fromIata, toIata, departure, returnDate, travellers },
        message: `Flight inquiry: ${fromDisplay}→${toDisplay}, ${departure}${returnDate ? `–${returnDate}` : ''}, ${travellers.adults}A/${travellers.children}C/${travellers.infants}I, ${travellers.class}`,
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
        <AirportInput label="From" value={fromDisplay} iataCode={fromIata}
          onChange={(d, c) => { setFromDisplay(d); setFromIata(c); setFieldError(false) }}
          placeholder="City or airport" required error={fieldError} />
        <AirportInput label="To" value={toDisplay} iataCode={toIata}
          onChange={(d, c) => { setToDisplay(d); setToIata(c); setFieldError(false) }}
          placeholder="City or airport" required error={fieldError} />
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

      {fieldError && (!fromIata || !toIata || !departure) && (
        <p className="text-xs text-red-500">Please fill in origin, destination and departure date.</p>
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

      <div className="p-2.5 bg-[#EAF8FD] rounded-xl border border-[#08A9E0]/20 text-xs">
        <p className="font-semibold text-[#101B46]">
          {fromDisplay} → {toDisplay}
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
