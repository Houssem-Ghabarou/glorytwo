'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { CartItem } from '@/types'

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, color: string, size: string) => void
  updateQuantity: (id: string, color: string, size: string, qty: number) => void
  clearCart: () => void
  total: number
  count: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)
const CART_KEY = 'glory_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const exists = prev.find(
        i => i._id === item._id && i.color === item.color && i.size === item.size
      )
      if (exists) {
        return prev.map(i =>
          i._id === item._id && i.color === item.color && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
    setIsOpen(true)
  }

  const removeItem = (id: string, color: string, size: string) =>
    setItems(prev => prev.filter(i => !(i._id === id && i.color === color && i.size === size)))

  const updateQuantity = (id: string, color: string, size: string, qty: number) => {
    if (qty <= 0) { removeItem(id, color, size); return }
    setItems(prev =>
      prev.map(i =>
        i._id === id && i.color === color && i.size === size ? { ...i, quantity: qty } : i
      )
    )
  }

  const clearCart = () => setItems([])
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      total, count, isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
