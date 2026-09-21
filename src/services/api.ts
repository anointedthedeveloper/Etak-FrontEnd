import { supabase } from '../lib/supabase'


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
