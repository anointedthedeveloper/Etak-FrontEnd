import { supabase } from '../lib/supabase'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
}

// Map Supabase user metadata → our User shape
// Handles both email/password signups and Google OAuth
function mapUser(supabaseUser: import('@supabase/supabase-js').User): User {
  const meta = supabaseUser.user_metadata ?? {}

  // Google OAuth gives us `full_name` and `name`
  // Email signup gives us `first_name` / `last_name`
  let firstName = meta.first_name ?? ''
  let lastName  = meta.last_name  ?? ''

  if (!firstName && !lastName) {
    // Try Google's full_name
    const fullName = (meta.full_name ?? meta.name ?? '').trim()
    if (fullName) {
      const parts = fullName.split(' ')
      firstName = parts[0] ?? ''
      lastName  = parts.slice(1).join(' ') ?? ''
    } else {
      // Fall back to deriving from email  e.g. john.doe@gmail.com → John Doe
      const emailLocal = (supabaseUser.email ?? '').split('@')[0]
      const parts = emailLocal.replace(/[._-]+/g, ' ').split(' ')
      firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : ''
      lastName  = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : ''
    }
  }

  return {
    id: supabaseUser.id,
    firstName,
    lastName,
    email: supabaseUser.email ?? '',
    phone: meta.phone ?? '',
    createdAt: supabaseUser.created_at,
  }
}

export const authService = {
  async register(data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
  }): Promise<{ user: User }> {
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
        },
      },
    })

    if (error) throw new Error(error.message)
    if (!result.user) throw new Error('Registration failed. Please try again.')

    return { user: mapUser(result.user) }
  },

  async login(email: string, password: string): Promise<{ user: User }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Sign in failed. Please try again.')

    return { user: mapUser(data.user) }
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(error.message)
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const { data: result, error } = await supabase.auth.updateUser({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      },
    })

    if (error) throw new Error(error.message)
    if (!result.user) throw new Error('Profile update failed.')

    return mapUser(result.user)
  },

  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) throw new Error(error.message)
  },

  async getSession(): Promise<User | null> {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session?.user) return null
    return mapUser(data.session.user)
  },
}
