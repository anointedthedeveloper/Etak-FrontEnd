import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { MapPin, Plane, ChevronLeft, ChevronRight, ChevronDown, Users, Plus, Minus, Navigation } from 'lucide-react'
import { searchAirports, type Airport } from '../../data/airports'
import { searchHotelDestinations, getPopularDestinations, type HotelDestination } from '../../data/hotelDestinations'

// ─── Portal dropdown wrapper ──────────────────────────────────────────────────
// Renders children into document.body so overflow:hidden on parents never clips them

function DropdownPortal({ anchorRef, open, children }: {
  anchorRef: React.RefObject<HTMLElement | null>
  open: boolean
  children: React.ReactNode
}) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!open || !anchorRef.current) return
    const update = () => {
      if (anchorRef.current) setRect(anchorRef.current.getBoundingClientRect())
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, anchorRef])

  if (!open || !rect) return null

  // Flip upward if not enough space below
  const spaceBelow = window.innerHeight - rect.bottom
  const dropdownMaxH = 280
  const top = spaceBelow > dropdownMaxH ? rect.bottom + 4 : rect.top - dropdownMaxH - 4

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body
  )
}

// ─── LocationInput ────────────────────────────────────────────────────────────

interface LocationInputProps {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  mode: 'airport' | 'hotel'
  autoDetect?: boolean
  required?: boolean
}

export function LocationInput({ label, value, onChange, placeholder, mode, autoDetect, required }: LocationInputProps) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node) &&
          !(e.target as Element)?.closest('[data-location-dropdown]')) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const airportResults = mode === 'airport' ? searchAirports(query) : []
  const hotelResults   = mode === 'hotel'   ? searchHotelDestinations(query) : []
  const popularHotels  = mode === 'hotel' && !query.trim() ? getPopularDestinations() : []

  // Free-text fallback: if typed but no match, offer "Use: <typed>"
  const hasResults = airportResults.length > 0 || hotelResults.length > 0 || popularHotels.length > 0
  const showFreeText = query.trim().length > 1 && !hasResults

  const selectAirport = (a: Airport) => {
    const val = `${a.city} (${a.code})`
    setQuery(val); onChange(val); setOpen(false)
  }
  const selectHotel = (d: HotelDestination) => {
    const val = `${d.city}, ${d.country}`
    setQuery(val); onChange(val); setOpen(false)
  }
  const useFreeText = () => {
    onChange(query); setOpen(false)
  }

  const detectLocation = () => {
    if (!navigator.geolocation) return
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=en`
          )
          const data = await res.json().catch(() => ({}))
          const addr    = data?.address ?? {}
          const city    = addr.city || addr.town || addr.village || addr.county || ''
          const state   = addr.state || ''
          const country = addr.country || ''

          if (mode === 'airport') {
            // Try city first, then state
            const match = searchAirports(city)[0] || searchAirports(state)[0]
            if (match) { selectAirport(match) }
            else {
              const val = [city || state, country].filter(Boolean).join(', ')
              setQuery(val); onChange(val)
            }
          } else {
            const match = searchHotelDestinations(city)[0] || searchHotelDestinations(state)[0]
            if (match) { selectHotel(match) }
            else {
              const val = [city || state, country].filter(Boolean).join(', ')
              setQuery(val); onChange(val)
            }
          }
        } catch { /* silent */ }
        setDetecting(false)
      },
      () => setDetecting(false),
      { timeout: 8000, enableHighAccuracy: false }
    )
  }

  const showDropdown = open && (hasResults || showFreeText)
  const listItems = mode === 'airport' ? airportResults
    : hotelResults.length > 0 ? hotelResults
    : popularHotels

  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-xs font-semibold text-[#101B46] mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div ref={anchorRef as React.RefObject<HTMLDivElement>} className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none">
          {mode === 'airport' ? <Plane size={13} /> : <MapPin size={13} />}
        </div>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-8 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#08A9E0] bg-white text-[#172033] placeholder-[#9CA3AF]"
        />
        {autoDetect && (
          <button
            type="button"
            onClick={detectLocation}
            title="Detect my location"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#08A9E0] hover:text-[#0798C8] transition-colors"
          >
            {detecting
              ? <span className="w-3.5 h-3.5 border-2 border-[#08A9E0] border-t-transparent rounded-full animate-spin block" />
              : <Navigation size={13} />}
          </button>
        )}
      </div>

      <DropdownPortal anchorRef={anchorRef} open={showDropdown}>
        <div
          data-location-dropdown
          className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ maxHeight: 260, overflowY: 'auto' }}
        >
          {popularHotels.length > 0 && (
            <div className="px-3 py-1.5 text-[10px] font-semibold text-[#667085] uppercase tracking-wide bg-[#F8FAFC] border-b border-gray-100 sticky top-0">
              Popular Destinations
            </div>
          )}

          {listItems.map((item, i) => {
            const isAirport = mode === 'airport'
            const a = item as Airport
            const h = item as HotelDestination
            return (
              <button
                key={i}
                type="button"
                onMouseDown={e => { e.preventDefault(); isAirport ? selectAirport(a) : selectHotel(h) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#EAF8FD] transition-colors border-b border-gray-50 last:border-0"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EAF8FD] flex items-center justify-center shrink-0">
                  {isAirport ? <Plane size={12} className="text-[#08A9E0]" /> : <MapPin size={12} className="text-[#08A9E0]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#172033] truncate">
                    {isAirport ? `${a.city}, ${a.country}` : `${h.city}, ${h.country}`}
                  </p>
                  <p className="text-xs text-[#667085] truncate">
                    {isAirport ? a.name : h.region}
                  </p>
                </div>
                {isAirport && (
                  <span className="text-xs font-bold text-[#08A9E0] bg-[#EAF8FD] px-1.5 py-0.5 rounded shrink-0">{a.code}</span>
                )}
              </button>
            )
          })}

          {showFreeText && (
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); useFreeText() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#EAF8FD] transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <MapPin size={12} className="text-[#667085]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#172033]">Use "<span className="text-[#08A9E0]">{query}</span>"</p>
                <p className="text-xs text-[#667085]">Search with this text</p>
              </div>
            </button>
          )}
        </div>
      </DropdownPortal>
    </div>
  )
}

// ─── DatePicker ───────────────────────────────────────────────────────────────

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

interface DatePickerProps {
  label: string
  value: string
  onChange: (val: string) => void
  min?: string
  required?: boolean
}

export function DatePicker({ label, value, onChange, min, required }: DatePickerProps) {
  const today = new Date(); today.setHours(0,0,0,0)
  const minDate = min ? new Date(min + 'T00:00:00') : today

  const parsed = value ? new Date(value + 'T00:00:00') : null
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => {
    const d = parsed ?? today
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const wrapRef   = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node) &&
          !(e.target as Element)?.closest('[data-datepicker-dropdown]')) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Sync view when min changes (e.g. return date after departure selected)
  useEffect(() => {
    if (min && parsed && parsed < minDate) {
      setView({ year: minDate.getFullYear(), month: minDate.getMonth() })
    }
  }, [min]) // eslint-disable-line

  const prevMonth = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 })
  const nextMonth = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 })

  const firstDay    = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()

  const selectDay = (day: number) => {
    const d = new Date(view.year, view.month, day)
    onChange(d.toISOString().split('T')[0])
    setOpen(false)
  }

  const isDisabled = (day: number) => {
    const d = new Date(view.year, view.month, day); d.setHours(0,0,0,0)
    return d < minDate
  }
  const isSelected = (day: number) =>
    !!parsed && parsed.getFullYear() === view.year && parsed.getMonth() === view.month && parsed.getDate() === day
  const isToday = (day: number) =>
    today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === day

  const displayValue = parsed
    ? parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-xs font-semibold text-[#101B46] mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#08A9E0] bg-white text-left"
      >
        <span className={displayValue ? 'text-[#172033]' : 'text-[#9CA3AF]'}>
          {displayValue || 'Select date'}
        </span>
        <ChevronDown size={13} className="text-[#667085] shrink-0" />
      </button>

      <DropdownPortal anchorRef={anchorRef} open={open}>
        <div data-datepicker-dropdown className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 w-64">
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#667085]">
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-semibold text-[#101B46]">{MONTHS[view.month]} {view.year}</span>
            <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#667085]">
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => <div key={d} className="text-center text-[10px] font-semibold text-[#667085] py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const disabled = isDisabled(day)
              const selected = isSelected(day)
              const todayDay = isToday(day)
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                  className={`w-full aspect-square rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
                    selected  ? 'bg-[#08A9E0] text-white' :
                    todayDay  ? 'border border-[#08A9E0] text-[#08A9E0]' :
                    disabled  ? 'text-gray-300 cursor-not-allowed' :
                    'text-[#172033] hover:bg-[#EAF8FD]'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      </DropdownPortal>
    </div>
  )
}

// ─── TravellerSelector ────────────────────────────────────────────────────────

export interface Travellers {
  adults: number
  children: number
  infants: number
  class: string
}

const CLASSES = [
  { value: 'economy',         label: 'Economy' },
  { value: 'premium-economy', label: 'Premium Economy' },
  { value: 'business',        label: 'Business Class' },
  { value: 'first',           label: 'First Class' },
]

interface TravellerSelectorProps {
  value: Travellers
  onChange: (v: Travellers) => void
  showClass?: boolean
}

export function TravellerSelector({ value, onChange, showClass = true }: TravellerSelectorProps) {
  const [open, setOpen] = useState(false)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node) &&
          !(e.target as Element)?.closest('[data-traveller-dropdown]')) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const total = value.adults + value.children + value.infants
  const set = useCallback((k: keyof Travellers, v: number | string) => onChange({ ...value, [k]: v }), [value, onChange])

  const summary = [
    `${value.adults} Adult${value.adults !== 1 ? 's' : ''}`,
    value.children > 0 ? `${value.children} Child${value.children !== 1 ? 'ren' : ''}` : null,
    value.infants > 0  ? `${value.infants} Infant${value.infants !== 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(', ')

  const classLabel = CLASSES.find(c => c.value === value.class)?.label ?? 'Economy'

  const Counter = ({ label, sub, val, min = 0, max = 9, onInc, onDec }: {
    label: string; sub: string; val: number; min?: number; max?: number; onInc: () => void; onDec: () => void
  }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-[#172033]">{label}</p>
        <p className="text-xs text-[#667085]">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onDec} disabled={val <= min}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#667085] hover:border-[#08A9E0] hover:text-[#08A9E0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Minus size={13} />
        </button>
        <span className="w-6 text-center text-sm font-bold text-[#101B46]">{val}</span>
        <button type="button" onClick={onInc} disabled={val >= max || total >= 9}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#667085] hover:border-[#08A9E0] hover:text-[#08A9E0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Plus size={13} />
        </button>
      </div>
    </div>
  )

  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-xs font-semibold text-[#101B46] mb-1">
        {showClass ? 'Travellers & Class' : 'Guests'}
      </label>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#08A9E0] bg-white text-left"
      >
        <Users size={13} className="text-[#667085] shrink-0" />
        <span className="flex-1 text-[#172033] truncate text-xs">{summary}</span>
        {showClass && <span className="text-[10px] text-[#08A9E0] font-semibold shrink-0 hidden sm:block">{classLabel}</span>}
        <ChevronDown size={13} className={`text-[#667085] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <DropdownPortal anchorRef={anchorRef} open={open}>
        <div data-traveller-dropdown className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
          <Counter label="Adults"   sub="Age 12+"       val={value.adults}   min={1}            onInc={() => set('adults',   value.adults + 1)}   onDec={() => set('adults',   value.adults - 1)} />
          <Counter label="Children" sub="Age 2–11"      val={value.children}                    onInc={() => set('children', value.children + 1)} onDec={() => set('children', value.children - 1)} />
          <Counter label="Infants"  sub="Under 2 (lap)" val={value.infants}  max={value.adults} onInc={() => set('infants',  value.infants + 1)}  onDec={() => set('infants',  value.infants - 1)} />

          {showClass && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-[#101B46] mb-2">Cabin Class</p>
              <div className="grid grid-cols-2 gap-1.5">
                {CLASSES.map(c => (
                  <button key={c.value} type="button" onClick={() => set('class', c.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      value.class === c.value ? 'bg-[#101B46] text-white' : 'bg-gray-50 text-[#667085] hover:bg-[#EAF8FD] hover:text-[#08A9E0]'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="button" onClick={() => setOpen(false)}
            className="mt-3 w-full py-2 rounded-xl bg-[#08A9E0] text-white text-sm font-semibold hover:bg-[#0798C8] transition-colors">
            Done
          </button>
        </div>
      </DropdownPortal>
    </div>
  )
}
