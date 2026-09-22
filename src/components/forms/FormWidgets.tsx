import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { MapPin, ChevronLeft, ChevronRight, ChevronDown, Users, Plus, Minus, Navigation } from 'lucide-react'
import { searchDestinations, getPopularDestinations, type SearchDestination as Destination } from '../../data/locationSearch'

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
  autoDetect?: boolean
  required?: boolean
  error?: string
}

export function LocationInput({ label, value, onChange, placeholder, autoDetect, required, error }: LocationInputProps) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [page, setPage] = useState(1)
  const wrapRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])
  useEffect(() => { setPage(1) }, [query])

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

  const popular = !query.trim() ? getPopularDestinations() : []
  const { results, hasMore } = query.trim() ? searchDestinations(query, page) : { results: [], hasMore: false }
  const listItems: Destination[] = query.trim() ? results : popular
  const showFreeText = query.trim().length > 1 && results.length === 0
  const showDropdown = open && (listItems.length > 0 || showFreeText)

  const select = (d: Destination) => {
    const val = `${d.city}, ${d.country}`
    setQuery(val); onChange(val); setOpen(false)
  }
  const useFreeText = () => { onChange(query); setOpen(false) }

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
          const addr = data?.address ?? {}
          const city = addr.city || addr.town || addr.village || addr.county || ''
          const country = addr.country || ''
          const { results: matches } = searchDestinations(city, 1)
          if (matches[0]) { select(matches[0]) }
          else {
            const val = [city, country].filter(Boolean).join(', ')
            setQuery(val); onChange(val)
          }
        } catch { /* silent */ }
        setDetecting(false)
      },
      () => setDetecting(false),
      { timeout: 8000, enableHighAccuracy: false }
    )
  }

  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-xs font-semibold text-[#101B46] mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div ref={anchorRef as React.RefObject<HTMLDivElement>} className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none">
          <MapPin size={13} />
        </div>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-8 pr-8 py-2.5 text-sm rounded-control border focus:outline-none focus:ring-2 bg-white text-[#172033] placeholder-[#9CA3AF] ${
            error ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-[#08A9E0]'
          }`}
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
      {error && <p className="text-[10px] text-red-500 mt-0.5">{error}</p>}

      <DropdownPortal anchorRef={anchorRef} open={showDropdown}>
        <div
          data-location-dropdown
          className="bg-white rounded-card shadow-float border border-gray-100 overflow-hidden"
          style={{ maxHeight: 300, overflowY: 'auto' }}
        >
          {!query.trim() && (
            <div className="px-3 py-1.5 text-[10px] font-semibold text-[#667085] uppercase tracking-wide bg-[#F8FAFC] border-b border-gray-100 sticky top-0">
              Popular Destinations
            </div>
          )}

          {listItems.map((d, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={e => { e.preventDefault(); select(d) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#EAF8FD] transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="w-7 h-7 rounded-lg bg-[#EAF8FD] flex items-center justify-center shrink-0">
                <MapPin size={12} className="text-[#08A9E0]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#172033] truncate">{d.city}, {d.country}</p>
                <p className="text-xs text-[#667085] truncate">{d.region}</p>
              </div>
            </button>
          ))}

          {hasMore && (
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); setPage(p => p + 1) }}
              className="w-full py-2.5 text-xs font-semibold text-[#08A9E0] hover:bg-[#EAF8FD] transition-colors border-t border-gray-100"
            >
              Load more results
            </button>
          )}

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
  error?: string
}

export function DatePicker({ label, value, onChange, min, required, error }: DatePickerProps) {
  const today = new Date(); today.setHours(0,0,0,0)
  // min is treated as exclusive (day after), so add 1 day
  const minDate = min
    ? (() => { const d = new Date(min + 'T00:00:00'); d.setDate(d.getDate() + 1); return d })()
    : today

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

  const prevMonthDays = new Date(view.year, view.month, 0).getDate()
  const firstDay      = new Date(view.year, view.month, 1).getDay()
  const daysInMonth   = new Date(view.year, view.month + 1, 0).getDate()

  const selectDay = (day: number) => {
    // Use local date parts to avoid UTC offset shifting the day
    const yyyy = view.year
    const mm = String(view.month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    onChange(`${yyyy}-${mm}-${dd}`)
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
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-control border focus:outline-none focus:ring-2 bg-white text-left ${
          error ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-[#08A9E0]'
        }`}
      >
        <span className={displayValue ? 'text-[#172033]' : 'text-[#9CA3AF]'}>
          {displayValue || 'Select date'}
        </span>
        <ChevronDown size={13} className="text-[#667085] shrink-0" />
      </button>
      {error && <p className="text-[10px] text-red-500 mt-0.5">{error}</p>}

      <DropdownPortal anchorRef={anchorRef} open={open}>
        <div data-datepicker-dropdown className="bg-white rounded-card shadow-float border border-gray-100 p-3 w-64">
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
            {Array.from({ length: firstDay }).map((_, i) => {
              const day = prevMonthDays - firstDay + i + 1
              return (
                <div key={`prev${i}`} className="w-full aspect-square flex items-center justify-center text-xs text-gray-300">
                  {day}
                </div>
              )
            })}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const disabled = isDisabled(day)
              const selected = isSelected(day)
              const todayDay = isToday(day)
              // fill remaining cells with next-month days (calculated at grid level)
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
            {Array.from({ length: (() => { const t = firstDay + daysInMonth; return t % 7 === 0 ? 0 : 7 - (t % 7) })() }).map((_, i) => (
              <div key={`next${i}`} className="w-full aspect-square flex items-center justify-center text-xs text-gray-300">
                {i + 1}
              </div>
            ))}
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
        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-control border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#08A9E0] bg-white text-left"
      >
        <Users size={13} className="text-[#667085] shrink-0" />
        <span className="flex-1 text-[#172033] truncate text-xs">{summary}</span>
        {showClass && <span className="text-[10px] text-[#08A9E0] font-semibold shrink-0 hidden sm:block">{classLabel}</span>}
        <ChevronDown size={13} className={`text-[#667085] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <DropdownPortal anchorRef={anchorRef} open={open}>
        <div data-traveller-dropdown className="bg-white rounded-card shadow-float border border-gray-100 p-4">
          <Counter label="Adults"   sub="Age 12+"       val={value.adults}   min={1}            onInc={() => set('adults',   value.adults + 1)}   onDec={() => set('adults',   value.adults - 1)} />
          <Counter label="Children" sub="Age 2–11"      val={value.children}                    onInc={() => set('children', value.children + 1)} onDec={() => set('children', value.children - 1)} />
          <Counter label="Infants"  sub="Under 2 (lap)" val={value.infants}  max={value.adults} onInc={() => set('infants',  value.infants + 1)}  onDec={() => set('infants',  value.infants - 1)} />

          {showClass && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-[#101B46] mb-2">Cabin Class</p>
              <div className="grid grid-cols-2 gap-1.5">
                {CLASSES.map(c => (
                  <button key={c.value} type="button" onClick={() => set('class', c.value)}
                    className={`px-3 py-2 rounded-control text-xs font-medium text-left transition-colors ${
                      value.class === c.value ? 'bg-[#101B46] text-white' : 'bg-gray-50 text-[#667085] hover:bg-[#EAF8FD] hover:text-[#08A9E0]'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="button" onClick={() => setOpen(false)}
            className="mt-3 w-full py-2 rounded-control bg-[#08A9E0] text-white text-sm font-semibold hover:bg-[#0798C8] transition-colors">
            Done
          </button>
        </div>
      </DropdownPortal>
    </div>
  )
}
