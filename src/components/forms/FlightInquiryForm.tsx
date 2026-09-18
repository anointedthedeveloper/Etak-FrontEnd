import { useState, useRef, useEffect } from 'react'
import { AlertCircle, Plane, ArrowRight, ChevronRight, ArrowLeft, Headphones } from 'lucide-react'
import { Button } from '../ui/Button'
import { DatePicker, TravellerSelector, type Travellers } from './FormWidgets'
import { apiService } from '../../services/api'
import { searchAirports as searchLocal } from '../../data/airports'
import SubmitSuccess from './SubmitSuccess'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../ui/FormFields'

interface Props { compact?: boolean }

interface Segment {
  marketing_carrier_code: string
  flight_number: string
  operating_carrier_name: string
  departure_airport: string
  departure_time_local: string
  arrival_airport: string
  arrival_time_local: string
  duration_minutes: number
  aircraft: string
}

interface Itinerary {
  price: { amount: number; currency: string }
  outbound: { carrier: string; duration_minutes: number; segments: Segment[] }
  cabin_class: string
  ignav_id: string
  bags?: { carry_on?: number; checked?: number }
}

type Step = 'search' | 'results' | 'contact'

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDuration(mins: number) {
  const h = Math.floor(mins / 60), m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
function fmtPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

const CABIN_MAP: Record<string, string> = {
  'economy': 'economy',
  'premium-economy': 'premium_economy',
  'business': 'business',
  'first': 'first',
}

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
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.length < 2) { setResults([]); setOpen(false); return }

    // Show local results immediately
    const local = searchLocal(q)
    if (local.length > 0) { setResults(local); setOpen(true) }

    // Then merge with API results
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const api = await apiService.searchAirports(q)
        // Merge: local first (deduped by code), then API extras
        const seen = new Set(local.map(x => x.code))
        const merged = [
          ...local,
          ...api.filter((a: { code: string }) => !seen.has(a.code)),
        ].slice(0, 8)
        setResults(merged)
        setOpen(true)
      } catch { /* keep local results */ }
      setLoading(false)
    }, 350)
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
        <Plane size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
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
          {loading && <span className="w-3 h-3 border-2 border-[#08A9E0] border-t-transparent rounded-full animate-spin block" />}
          {iataCode && !loading && <span className="text-[10px] font-bold text-[#08A9E0] bg-[#EAF8FD] px-1.5 py-0.5 rounded">{iataCode}</span>}
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

// ── Airline logo helper ───────────────────────────────────────────────────────
// Maps common IATA marketing carrier codes to their airline website domains
// for fetching favicons/logos via a public logo service.
const CARRIER_DOMAINS: Record<string, string> = {
  'P4': 'flyairpeace.com',
  'VK': 'arikair.com',
  '9J': 'danaair.com',
  'VM': 'maxair.ng',
  'ET': 'ethiopianairlines.com',
  'QR': 'qatarairways.com',
  'EK': 'emirates.com',
  'BA': 'britishairways.com',
  'LH': 'lufthansa.com',
  'TK': 'turkishairlines.com',
  'AF': 'airfrance.com',
  'KL': 'klm.com',
  'MS': 'egyptair.com',
  'AT': 'royalairmaroc.com',
  'KQ': 'kenya-airways.com',
  'WB': 'rwandair.com',
  'WT': 'nigerianairlines.ng',
  'W3': 'arikair.com',
  'AA': 'aa.com',
  'UA': 'united.com',
  'DL': 'delta.com',
}

function AirlineLogo({ code, name }: { code: string; name: string }) {
  const [failed, setFailed] = useState(false)
  const domain = CARRIER_DOMAINS[code]

  if (!domain || failed) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#EAF8FD] flex items-center justify-center shrink-0">
        <Plane size={14} className="text-[#08A9E0]" />
      </div>
    )
  }

  return (
    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={name}
        onError={() => setFailed(true)}
        className="w-6 h-6 object-contain"
      />
    </div>
  )
}

// ── Flight result row ─────────────────────────────────────────────────────────
// Flat list-row design matching the screenshot: logo | route+meta | airline | price | chevron
function FlightRow({ it, onSelect }: { it: Itinerary; onSelect: () => void }) {
  const seg   = it.outbound.segments
  const first = seg[0], last = seg[seg.length - 1]
  const stops = seg.length - 1
  const carrierCode = first.marketing_carrier_code

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#F0FAFF] transition-colors text-left group"
    >
      {/* Airline logo */}
      <AirlineLogo code={carrierCode} name={it.outbound.carrier} />

      {/* Route + duration/stops */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-[#101B46]">{first.departure_airport}</span>
          <ArrowRight size={9} className="text-[#08A9E0] shrink-0" />
          <span className="text-xs font-bold text-[#101B46]">{last.arrival_airport}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-[#667085]">{fmtDuration(it.outbound.duration_minutes)}</span>
          <span className="text-gray-300 text-[10px]">·</span>
          <span className={`text-[10px] font-medium ${stops === 0 ? 'text-green-600' : 'text-orange-500'}`}>
            {stops === 0 ? 'Direct' : `${stops} Stop${stops > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Airline name */}
      <div className="hidden sm:block w-24 shrink-0">
        <span className="text-[10px] text-[#667085] leading-tight line-clamp-2">{it.outbound.carrier}</span>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right mr-1">
        <span className="text-xs font-bold text-[#101B46] whitespace-nowrap">{fmtPrice(it.price.amount, it.price.currency)}</span>
      </div>

      {/* Chevron */}
      <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-[#08A9E0] group-hover:bg-[#08A9E0] transition-colors">
        <ChevronRight size={11} className="text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
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

  const [results, setResults]           = useState<Itinerary[]>([])
  const [cabinUnavailable, setCabinUnavailable] = useState(false)
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [searchError, setSearchError]   = useState('')
  const [fieldError, setFieldError]     = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Itinerary | null>(null)

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [submittedId, setSubmittedId]   = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fromIata || !toIata) {
      setFieldError(true)
      setSearchError('Please select airports from the dropdown suggestions.')
      setSearchStatus('error')
      return
    }
    if (!departure) {
      setSearchError('Please select a departure date.')
      setSearchStatus('error')
      return
    }
    setFieldError(false)
    setSearchStatus('loading')
    setSearchError('')
    setCabinUnavailable(false)

    const requestedCabin = CABIN_MAP[travellers.class] ?? 'economy'

    try {
      const data = await apiService.searchFlights({
        origin: fromIata,
        destination: toIata,
        departureDate: departure,
        adults: travellers.adults,
        cabinClass: requestedCabin,
      })

      let itineraries: Itinerary[] = data.itineraries ?? []

      // If non-economy returned no results, fall back to economy and flag it
      if (itineraries.length === 0 && requestedCabin !== 'economy') {
        const fallback = await apiService.searchFlights({
          origin: fromIata,
          destination: toIata,
          departureDate: departure,
          adults: travellers.adults,
          cabinClass: 'economy',
        })
        itineraries = fallback.itineraries ?? []
        if (itineraries.length > 0) setCabinUnavailable(true)
      }

      setResults(itineraries)
      setStep('results')
      setSearchStatus('idle')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Search failed. Please try again.'
      setSearchError(msg)
      setSearchStatus('error')
    }
  }

  const handleSubmit = async (flight?: Itinerary) => {
    const chosen = flight ?? selectedFlight
    setSubmitStatus('loading')
    try {
      const seg = chosen?.outbound.segments[0]
      const { id } = await apiService.submitInquiry({
        type: 'flight',
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        details: { tripType, from: fromDisplay, to: toDisplay, fromIata, toIata, departure, returnDate, travellers, selectedFlight: chosen ?? undefined },
        message: chosen
          ? `Flight: ${fromIata}→${toIata} ${departure}${returnDate ? `–${returnDate}` : ''}, ${travellers.adults}A ${travellers.class} — ${chosen.outbound.carrier} ${seg?.flight_number ?? ''} @ ${fmtPrice(chosen.price.amount, chosen.price.currency)}`
          : `Flight inquiry: ${fromDisplay}→${toDisplay}, ${departure}${returnDate ? `–${returnDate}` : ''}, ${travellers.adults}A/${travellers.children}C/${travellers.infants}I, ${travellers.class}`,
      })
      setSubmittedId(id)
    } catch {
      setSubmitStatus('error')
    }
  }

  if (submittedId) {
    return <SubmitSuccess inquiryId={submittedId} type="flight" onReset={() => { setSubmittedId(null); setSubmitStatus('idle'); setResults([]); setStep('search') }} />
  }

  // ── Step: Search ──────────────────────────────────────────────────────────
  if (step === 'search') return (
    <form onSubmit={handleSearch} className="flex flex-col gap-3">
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
          onChange={v => { setDeparture(v); if (returnDate && returnDate <= v) setReturn('') }} required />
        {tripType === 'round-trip' && (
          <DatePicker label="Return" value={returnDate} onChange={setReturn} min={departure} />
        )}
      </div>

      <TravellerSelector value={travellers} onChange={setTravellers} showClass />

      {searchStatus === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600">{searchError}</p>
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full" loading={searchStatus === 'loading'}>
        <Plane size={14} /> Search Flights
      </Button>

      <div className="border-t border-gray-100 pt-3">
        <Button type="button" variant="outline" size="sm" className="w-full"
          onClick={() => setStep('contact')}>
          Skip search — just send an inquiry
        </Button>
      </div>
    </form>
  )

  // ── Step: Results ─────────────────────────────────────────────────────
  if (step === 'results') return (
    <div className="flex flex-col gap-0">

      {/* Header row */}
      <div className="flex items-center justify-between px-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#08A9E0] flex items-center justify-center">
            <Plane size={10} className="text-white" />
          </div>
          <p className="text-xs font-bold text-[#101B46]">
            {results.length === 0 ? 'No flights found' : `${results.length} flights found`}
          </p>
        </div>
        <button type="button" onClick={() => setStep('search')}
          className="flex items-center gap-1 text-[11px] text-[#08A9E0] hover:text-[#0798C8] font-medium">
          <ArrowLeft size={10} /> Edit search
        </button>
      </div>

      {/* Cabin warning */}
      {cabinUnavailable && (
        <div className="flex items-center gap-2 mx-3 mb-2 px-2.5 py-2 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle size={12} className="text-amber-500 shrink-0" />
          <p className="text-[10px] text-amber-700">Showing economy — selected cabin unavailable.</p>
        </div>
      )}

      {/* No results */}
      {results.length === 0 ? (
        <div className="py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
            <Plane size={18} className="text-gray-300" />
          </div>
          <p className="text-xs text-[#667085]">No flights found for this route.</p>
          <button type="button" onClick={() => setStep('contact')}
            className="mt-2 text-xs text-[#08A9E0] hover:underline font-medium">
            Send a manual inquiry
          </button>
        </div>
      ) : (
        /* Scrollable flat list — divider-separated rows, no card borders */
        <div
          className="flight-results-scroll divide-y divide-gray-100"
          style={{ maxHeight: '295px', overflowY: 'auto', overflowX: 'hidden' }}
        >
          {results.map((it, i) => (
            <FlightRow key={i} it={it} onSelect={() => {
              setSelectedFlight(it)
              setStep('contact')
            }} />
          ))}
        </div>
      )}

      {/* Bottom CTA — headphones icon, matches screenshot */}
      <div className="border-t border-gray-100 mt-1 px-3 pt-3 pb-1">
        <button
          type="button"
          onClick={() => setStep('contact')}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#08A9E0] text-[#08A9E0] hover:bg-[#EAF8FD] text-xs font-semibold transition-colors"
        >
          <Headphones size={13} />
          Request assistance for this route
        </button>
      </div>
    </div>
  )

  // ── Step: Contact ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setStep(results.length > 0 ? 'results' : 'search')}
          className="text-xs text-[#08A9E0] flex items-center gap-1 hover:underline">
          <ArrowLeft size={11} /> Back
        </button>
        <p className="text-xs font-semibold text-[#101B46]">
          {selectedFlight ? 'Request selected flight' : 'Flight inquiry'}
        </p>
      </div>

      {selectedFlight && (
        <div className="p-2.5 bg-[#EAF8FD] rounded-xl border border-[#08A9E0]/20 text-xs">
          <p className="font-semibold text-[#101B46]">
            {selectedFlight.outbound.segments[0].departure_airport} → {selectedFlight.outbound.segments[selectedFlight.outbound.segments.length - 1].arrival_airport}
          </p>
          <p className="text-[#667085]">
            {selectedFlight.outbound.carrier} · {fmtPrice(selectedFlight.price.amount, selectedFlight.price.currency)} · {travellers.adults} adult{travellers.adults > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {!isAuthenticated && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Your Name" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
            <Input label="Email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <Input label="Phone (optional)" type="tel" placeholder="+234 xxx xxx xxxx" value={phone} onChange={e => setPhone(e.target.value)} />
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
