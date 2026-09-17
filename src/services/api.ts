import { supabase } from '../lib/supabase'

export const apiService = {
  async submitContactForm(data: Record<string, unknown>): Promise<void> {
    // Get current user if logged in (optional — form works for guests too)
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id ?? null

    const { error } = await supabase.from('inquiries').insert({
      user_id:           userId,
      name:              data.name,
      email:             data.email,
      phone:             data.phone || null,
      service:           data.service || null,
      preferred_contact: data.preferredContact || null,
      travel_dates:      data.travelDates || null,
      message:           data.message,
      status:            'new',
    })

    if (error) throw new Error(error.message)
  },
}
