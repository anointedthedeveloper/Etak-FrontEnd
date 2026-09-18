import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { authService, type User } from '../services/auth'
import { apiService } from '../services/api'
import CompleteProfileModal from '../components/ui/CompleteProfileModal'

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

function mapSession(supabaseUser: import('@supabase/supabase-js').User): User {
  const meta = supabaseUser.user_metadata ?? {}
  let firstName = meta.first_name ?? ''
  let lastName  = meta.last_name  ?? ''
  if (!firstName && !lastName) {
    const fullName = (meta.full_name ?? meta.name ?? '').trim()
    if (fullName) {
      const parts = fullName.split(' ')
      firstName = parts[0] ?? ''
      lastName  = parts.slice(1).join(' ') ?? ''
    } else {
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<User | null>(null)
  const [isLoading, setIsLoading]     = useState(true)
  const [needsProfile, setNeedsProfile] = useState(false)

  useEffect(() => {
    authService.getSession().then(u => {
      setUser(u)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mapped = mapSession(session.user)
        setUser(mapped)
        if (!mapped.phone) setNeedsProfile(true)
        // Claim any guest inquiries submitted before login (covers OAuth flow)
        apiService.claimPendingInquiries(mapped.id)
      } else {
        setUser(null)
        setNeedsProfile(false)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password)
    setUser(user)
    await apiService.claimPendingInquiries(user.id)
  }

  const register = async (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
    const { user } = await authService.register(data)
    setUser(user)
    await apiService.claimPendingInquiries(user.id)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    setNeedsProfile(false)
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return
    const updated = await authService.updateProfile(user.id, data)
    setUser(updated)
  }

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle()
  }

  const handleProfileComplete = (data: { firstName: string; lastName: string; phone: string }) => {
    setUser(u => u ? { ...u, ...data } : u)
    setNeedsProfile(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateProfile, signInWithGoogle }}>
      {children}
      {/* Profile completion modal — shown after OAuth login if phone is missing */}
      {needsProfile && user && (
        <CompleteProfileModal
          email={user.email}
          initialFirstName={user.firstName}
          initialLastName={user.lastName}
          onComplete={handleProfileComplete}
        />
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
