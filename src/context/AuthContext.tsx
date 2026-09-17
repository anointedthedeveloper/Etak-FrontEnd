import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { authService, type User } from '../services/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load existing session on mount
    authService.getSession().then(u => {
      setUser(u)
      setIsLoading(false)
    })

    // Keep in sync with Supabase auth state changes
    // (login, logout, token refresh, magic link, OAuth, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata ?? {}
        setUser({
          id: session.user.id,
          firstName: meta.first_name ?? '',
          lastName: meta.last_name ?? '',
          email: session.user.email ?? '',
          phone: meta.phone ?? '',
          createdAt: session.user.created_at,
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password)
    setUser(user)
  }

  const register = async (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
    const { user } = await authService.register(data)
    setUser(user)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return
    const updated = await authService.updateProfile(user.id, data)
    setUser(updated)
  }

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle()
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateProfile, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
