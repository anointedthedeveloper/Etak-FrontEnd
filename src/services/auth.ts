// Mock authentication service — replace with real API calls when backend is ready

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
}

const STORAGE_KEY = 'etak_auth'

export const authService = {
  async register(data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
  }): Promise<{ user: User; token: string }> {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1200))

    // Check if email already "exists" in mock storage
    const existing = localStorage.getItem(`etak_user_${data.email}`)
    if (existing) throw new Error('An account with this email already exists.')

    const user: User = {
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    }
    const token = `mock_token_${crypto.randomUUID()}`

    // Store mock user (never store real passwords — this is mock only)
    localStorage.setItem(`etak_user_${data.email}`, JSON.stringify({ ...user, passwordHash: 'mock' }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))

    return { user, token }
  },

  async login(email: string, _password: string): Promise<{ user: User; token: string }> {
    await new Promise(r => setTimeout(r, 1000))

    const stored = localStorage.getItem(`etak_user_${email}`)
    if (!stored) throw new Error('No account found with this email address.')

    const userData = JSON.parse(stored)
    const user: User = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      createdAt: userData.createdAt,
    }
    const token = `mock_token_${crypto.randomUUID()}`
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))

    return { user, token }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY)
  },

  getSession(): AuthState {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { user: null, token: null }
    return JSON.parse(stored)
  },

  async resetPassword(email: string): Promise<void> {
    await new Promise(r => setTimeout(r, 1000))
    const stored = localStorage.getItem(`etak_user_${email}`)
    if (!stored) throw new Error('No account found with this email address.')
    // In production, this would trigger a real password reset email
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await new Promise(r => setTimeout(r, 800))
    const session = authService.getSession()
    if (!session.user || session.user.id !== userId) throw new Error('Unauthorised')
    const updated = { ...session.user, ...data }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...session, user: updated }))
    localStorage.setItem(`etak_user_${updated.email}`, JSON.stringify({ ...updated, passwordHash: 'mock' }))
    return updated
  },
}
