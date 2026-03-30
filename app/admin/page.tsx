'use client'

import { useEffect, useState, useCallback } from 'react'
import { getProducts, getAllOrders } from '@/lib/api'
import ProductsTab from '@/components/admin/ProductsTab'
import OrdersTab from '@/components/admin/OrdersTab'
import type { Product, Order } from '@/types'
import { Package, ShoppingBag, TrendingUp, Clock } from 'lucide-react'

type Tab = 'products' | 'orders'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')

  const fetchAll = useCallback(async () => {
    try {
      const [p, o] = await Promise.all([getProducts(), getAllOrders()])
      setProducts(p)
      setOrders(o)
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const t = localStorage.getItem('glory_admin_token') || ''
    setToken(t)
    fetchAll()
  }, [fetchAll])

  const pending = orders.filter(o => o.status === 'OnHold' || o.status === 'Pending').length
  const revenue = orders.filter(o => o.status === 'Confirmed').reduce((s, o) => s + (o.total || 0), 0)

  const stats = [
    { label: 'Products', value: products.length, icon: Package, color: '#0A4DCC' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: '#276749' },
    { label: 'Pending', value: pending, icon: Clock, color: '#B45309' },
    { label: 'Revenue', value: `${revenue.toFixed(3)} TND`, icon: TrendingUp, color: '#553C9A' },
  ]

  return (
    <div style={{ padding: '32px 32px 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>Dashboard</h1>
        <p style={{ fontSize: 12, color: '#6B6B6B', marginTop: 4 }}>Manage your store</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #DEDEDE', padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B' }}>{s.label}</span>
              <s.icon size={16} style={{ color: s.color }} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#000', lineHeight: 1 }}>{loading ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #DEDEDE', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {(['products', 'orders'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '12px 20px',
                fontSize: 12, letterSpacing: '0.08em', textTransform: 'capitalize',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: tab === t ? 700 : 400,
                color: tab === t ? '#000' : '#6B6B6B',
                borderBottom: tab === t ? '2px solid #000' : '2px solid transparent',
                marginBottom: -1,
                transition: 'all 0.15s',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'orders' && pending > 0 && (
                <span style={{ marginLeft: 6, background: '#B45309', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {pending}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ height: 52, background: '#EBEBEB', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : tab === 'products' ? (
        <ProductsTab products={products} token={token} onRefresh={fetchAll} />
      ) : (
        <OrdersTab orders={orders} token={token} onRefresh={fetchAll} />
      )}
    </div>
  )
}
