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

    // If logged in and name/email not provided, pull from session metadata
    const meta = session?.user?.user_metadata ?? {}
    const name  = payload.name  || (meta.full_name ?? `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim()) || null
    const email = payload.email || session?.user?.email || null

    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        user_id:      userId,
        name,
        email,
        phone:        payload.phone || null,
        service:      payload.type,
        message:      payload.message || JSON.stringify(payload.details),
        details:      payload.details,
        status:       'new',
      })
      .select('id')
      .single()

    if (error) throw new Error(error.message)
    return { id: data.id }
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
