'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, ChevronDown } from 'lucide-react'
import { updateOrderStatus, cancelOrder } from '@/lib/api'
import type { Order, Product } from '@/types'

const STATUSES = ['OnHold', 'Pending', 'Confirmed', 'Cancelled'] as const

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  OnHold:    { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
  Pending:   { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  Confirmed: { bg: '#F0FFF4', color: '#276749', border: '#C6F6D5' },
  Cancelled: { bg: '#FFF5F5', color: '#C53030', border: '#FED7D7' },
}

interface Props {
  orders: Order[]
  token: string
  onRefresh: () => void
}

export default function OrdersTab({ orders, token, onRefresh }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !q || o.orderNumber?.toLowerCase().includes(q) || o.customerInfo?.email?.toLowerCase().includes(q) || `${o.customerInfo?.firstName} ${o.customerInfo?.lastName}`.toLowerCase().includes(q)
    const matchStatus = !statusFilter || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatus = async (order: Order, status: string) => {
    setUpdatingId(order._id)
    try {
      await updateOrderStatus(order._id, status, token)
      onRefresh()
    } catch (err: any) {
      alert(err.message || 'Failed to update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCancel = async (order: Order) => {
    if (!window.confirm(`Cancel order ${order.orderNumber}?`)) return
    setUpdatingId(order._id)
    try {
      await cancelOrder(order._id)
      onRefresh()
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B6B6B' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, order#…"
            style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, fontSize: 13, border: '1px solid #DEDEDE', background: '#fff', outline: 'none', width: 280, fontFamily: 'inherit' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ fontSize: 12, border: '1px solid #DEDEDE', padding: '9px 12px', background: '#fff', outline: 'none', fontFamily: 'inherit' }}
        >
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#6B6B6B', marginLeft: 'auto' }}>{filtered.length} orders</span>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B6B6B' }}>
          <p style={{ fontSize: 13 }}>No orders found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map(order => {
            const st = STATUS_STYLE[order.status] || STATUS_STYLE.OnHold
            const isExpanded = expanded === order._id
            const name = `${order.customerInfo?.firstName || ''} ${order.customerInfo?.lastName || ''}`.trim() || 'Guest'

            return (
              <div key={order._id} style={{ background: '#fff', border: '1px solid #DEDEDE' }}>
                {/* Row header */}
                <div
                  style={{ display: 'grid', gridTemplateColumns: '160px 1fr 100px 100px 120px 32px', gap: 0, padding: '14px 16px', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setExpanded(isExpanded ? null : order._id)}
                >
                  {/* Order # */}
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600 }}>{order.orderNumber}</p>
                    <p style={{ fontSize: 10, color: '#6B6B6B', marginTop: 2 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  {/* Customer */}
                  <div>
                    <p style={{ fontSize: 13 }}>{name}</p>
                    <p style={{ fontSize: 11, color: '#6B6B6B' }}>{order.customerInfo?.email}</p>
                  </div>

                  {/* Items */}
                  <p style={{ fontSize: 12, color: '#6B6B6B' }}>{order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}</p>

                  {/* Total */}
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{order.total?.toFixed(3)} TND</p>

                  {/* Status badge */}
                  <span style={{ fontSize: 10, letterSpacing: '0.05em', padding: '3px 8px', background: st.bg, color: st.color, border: `1px solid ${st.border}`, display: 'inline-block', whiteSpace: 'nowrap' }}>
                    {order.status}
                  </span>

                  {/* Expand */}
                  <ChevronDown size={14} style={{ color: '#6B6B6B', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', justifySelf: 'center' }} />
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #F2F2F2', padding: '16px 16px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                      {/* Shipping info */}
                      <div>
                        <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 8 }}>Shipping</p>
                        <p style={{ fontSize: 12, lineHeight: 1.8 }}>
                          {name}<br />
                          {order.customerInfo?.address1}<br />
                          {order.customerInfo?.address2 && <>{order.customerInfo.address2}<br /></>}
                          {order.customerInfo?.governorate}{order.customerInfo?.zipCode && `, ${order.customerInfo.zipCode}`}<br />
                          {order.customerInfo?.phone}
                        </p>
                      </div>

                      {/* Status control */}
                      <div>
                        <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 8 }}>Update Status</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {STATUSES.filter(s => s !== order.status && s !== 'Cancelled').map(s => (
                            <button
                              key={s}
                              onClick={() => handleStatus(order, s)}
                              disabled={!!updatingId}
                              style={{ fontSize: 10, letterSpacing: '0.08em', padding: '5px 10px', background: '#fff', border: '1px solid #DEDEDE', cursor: 'pointer', fontFamily: 'inherit', opacity: updatingId ? 0.5 : 1 }}
                            >
                              → {s}
                            </button>
                          ))}
                          {order.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleCancel(order)}
                              disabled={!!updatingId}
                              style={{ fontSize: 10, letterSpacing: '0.08em', padding: '5px 10px', background: '#FFF5F5', border: '1px solid #FED7D7', color: '#C53030', cursor: 'pointer', fontFamily: 'inherit', opacity: updatingId ? 0.5 : 1 }}
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 10 }}>Items</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {order.items?.map((item, i) => {
                        const prod = typeof item.product === 'object' ? item.product as Product : null
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #F8F8F8' }}>
                            {prod?.images?.[0] && (
                              <div style={{ position: 'relative', width: 40, height: 52, flexShrink: 0, background: '#EBEBEB', overflow: 'hidden' }}>
                                <Image src={prod.images[0]} alt={prod.name} fill style={{ objectFit: 'cover' }} sizes="40px" />
                              </div>
                            )}
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 12, fontWeight: 500 }}>{prod?.name || 'Product'}</p>
                              <p style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>
                                Color: {item.color} · Size: {item.size} · Qty: {item.quantity}
                              </p>
                            </div>
                            {prod && (
                              <p style={{ fontSize: 12, fontWeight: 600 }}>
                                {((prod.sale > 0 ? prod.sale : prod.price) * item.quantity).toFixed(3)} TND
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
