'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCart()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.35)',
            zIndex: 200,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0,
        height: '100%',
        width: 400,
        maxWidth: '100vw',
        background: '#fff',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 20px', borderBottom: '1px solid #DEDEDE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={16} strokeWidth={1.5} />
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '0.05em' }}>
              Cart {count > 0 && `(${count})`}
            </span>
          </div>
          <button
            onClick={closeCart}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#000' }}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B6B6B' }}>
              <ShoppingBag size={32} strokeWidth={1} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
              <p style={{ fontSize: 13 }}>Your cart is empty</p>
              <button
                onClick={closeCart}
                style={{ marginTop: 16, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {items.map(item => (
                <div key={`${item._id}-${item.color}-${item.size}`} style={{ display: 'flex', gap: 14 }}>
                  {/* Image */}
                  <div style={{ position: 'relative', width: 72, height: 96, flexShrink: 0, background: '#F2F2F2', overflow: 'hidden' }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="72px" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#DEDEDE' }} />
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: 11, color: '#6B6B6B', marginBottom: 8 }}>
                      {item.colorName} · {item.size}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Qty control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                      <button
                        onClick={() => updateQuantity(item._id, item.color, item.size, item.quantity - 1)}
                        style={{ width: 28, height: 28, border: '1px solid #DEDEDE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={10} />
                      </button>
                      <span style={{ width: 32, textAlign: 'center', fontSize: 12, borderTop: '1px solid #DEDEDE', borderBottom: '1px solid #DEDEDE', height: 28, lineHeight: '28px' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.color, item.size, item.quantity + 1)}
                        style={{ width: 28, height: 28, border: '1px solid #DEDEDE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item._id, item.color, item.size)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 4, alignSelf: 'flex-start' }}
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ borderTop: '1px solid #DEDEDE', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Subtotal</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>${total.toFixed(2)}</span>
            </div>
            <p style={{ fontSize: 11, color: '#6B6B6B', marginBottom: 18 }}>Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary"
              style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
