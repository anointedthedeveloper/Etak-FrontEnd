// API service layer — mock implementations ready for real backend connection

export interface TravelInquiry {
  id: string
  userId: string
  type: 'flight' | 'hotel' | 'tour' | 'visa' | 'consultation'
  status: 'draft' | 'submitted' | 'under_review' | 'confirmed' | 'completed' | 'cancelled'
  details: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

const INQUIRIES_KEY = 'etak_inquiries'

function getInquiries(): TravelInquiry[] {
  const stored = localStorage.getItem(INQUIRIES_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveInquiries(inquiries: TravelInquiry[]) {
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries))
}

export const apiService = {
  async submitInquiry(
    userId: string,
    type: TravelInquiry['type'],
    details: Record<string, unknown>
  ): Promise<TravelInquiry> {
    await new Promise(r => setTimeout(r, 1000))
    const inquiry: TravelInquiry = {
      id: crypto.randomUUID(),
      userId,
      type,
      status: 'submitted',
      details,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const all = getInquiries()
    all.unshift(inquiry)
    saveInquiries(all)
    return inquiry
  },

  async getUserInquiries(userId: string): Promise<TravelInquiry[]> {
    await new Promise(r => setTimeout(r, 600))
    return getInquiries().filter(i => i.userId === userId)
  },

  async submitContactForm(data: Record<string, unknown>): Promise<void> {
    await new Promise(r => setTimeout(r, 1000))
    // In production: POST /api/contact
    console.info('Contact form submitted (mock):', data)
  },
}
