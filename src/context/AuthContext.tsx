import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authService, type User } from '../services/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = authService.getSession()
    setUser(session.user)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password)
    setUser(user)
  }

  const register = async (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
    const { user } = await authService.register(data)
    setUser(user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return
    const updated = await authService.updateProfile(user.id, data)
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
