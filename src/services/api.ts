import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error?.message || 'Request failed')
  return json.data
}

export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  adults: number
  cabinClass: string
  maxStops?: number
}

export interface Airport {
  code: string
  name: string
  city: string
  country: string
}

export interface InquiryPayload {
  type: 'flight' | 'hotel' | 'tour' | 'assistance' | 'contact'
  name?: string
  email?: string
  phone?: string
  details: Record<string, unknown>
  message?: string
}

export const apiService = {
  async submitInquiry(payload: InquiryPayload): Promise<{ id: string }> {
    const { data: sessionData } = await supabase.auth.getSession()
    const session = sessionData.session
    const userId = session?.user?.id ?? null

    const meta = session?.user?.user_metadata ?? {}
    const name  = payload.name?.trim()
      || (meta.full_name ?? `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim())
      || session?.user?.email?.split('@')[0]
      || 'Guest'
    const email = payload.email?.trim() || session?.user?.email || 'noreply@etaktravels.com'

    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        user_id: userId,
        name,
        email,
        phone:   payload.phone || null,
        service: payload.type,
        message: payload.message || JSON.stringify(payload.details),
        details: payload.details,
        status:  'new',
      })
      .select('id')
      .single()

    if (error) throw new Error(error.message)

    // Save guest inquiry id so it can be claimed after signup/login
    if (!userId) {
      const pending = JSON.parse(localStorage.getItem('pendingInquiryIds') || '[]') as string[]
      pending.push(data.id)
      localStorage.setItem('pendingInquiryIds', JSON.stringify(pending))
    }

    return { id: data.id }
  },

  async claimPendingInquiries(userId: string): Promise<void> {
    const pending = JSON.parse(localStorage.getItem('pendingInquiryIds') || '[]') as string[]
    if (!pending.length) return
    await supabase.from('inquiries').update({ user_id: userId }).in('id', pending)
    localStorage.removeItem('pendingInquiryIds')
  },

  async searchFlights(params: FlightSearchParams) {
    return apiFetch('/api/flights/search', { method: 'POST', body: JSON.stringify(params) })
  },

  async searchAirports(q: string): Promise<Airport[]> {
    return apiFetch(`/api/flights/airports?q=${encodeURIComponent(q)}`)
  },

  async getBookingLinks(ignavId: string) {
    return apiFetch('/api/flights/booking-links', { method: 'POST', body: JSON.stringify({ ignavId }) })
  },

  // Legacy — kept for Contact page
  async submitContactForm(data: Record<string, unknown>): Promise<void> {
    await apiService.submitInquiry({
      type:    (data.type as InquiryPayload['type']) || 'contact',
      name:    data.name as string,
      email:   data.email as string,
      phone:   data.phone as string,
      message: data.message as string,
      details: data,
    })
  },
}
