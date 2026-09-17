import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface CartItem {
  id: string
  type: 'tour' | 'destination'
  title: string
  image: string
  subtitle: string // destination or country
}

interface CartContextType {
  items: CartItem[]
  toggle: (item: CartItem) => void
  has: (id: string) => boolean
  count: number
  clear: () => void
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = 'etak_saved'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const toggle = (item: CartItem) =>
    setItems(prev =>
      prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    )

  const has = (id: string) => items.some(i => i.id === id)

  return (
    <CartContext.Provider value={{ items, toggle, has, count: items.length, clear: () => setItems([]) }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
