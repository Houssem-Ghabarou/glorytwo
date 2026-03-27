'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'

type Step = 'shipping' | 'review'

interface ShippingForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  governorate: string
  zipCode: string
  agreeToTerms: boolean
}

const EMPTY: ShippingForm = {
  firstName: '', lastName: '', email: '', phone: '',
  address1: '', address2: '', governorate: '', zipCode: '',
  agreeToTerms: false,
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<Step>('shipping')
  const [form, setForm] = useState<ShippingForm>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingForm, string>>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const shipping = 5
  const grandTotal = total + shipping

  if (items.length === 0 && step !== 'review') {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20 }}>Your cart is empty.</p>
        <Link href="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>Shop Now</Link>
      </div>
    )
  }

  const set = (field: keyof ShippingForm, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }))

  const validate = () => {
    const e: Partial<Record<keyof ShippingForm, string>> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.address1.trim()) e.address1 = 'Required'
    if (!form.governorate.trim()) e.governorate = 'Required'
    if (!form.agreeToTerms) e.agreeToTerms = 'You must agree to terms' as any
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (validate()) setStep('review')
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    setServerError('')
    try {
      const payload = {
        customerInfo: {
          ...form,
          agreeToTerms: true,
        },
        items: items.map(i => ({
          _id: i._id,
          color: i.color,
          size: i.size,
          quantity: i.quantity,
        })),
        userId: null,
      }
      const order = await createOrder(payload)
      clearCart()
      router.push(`/order-success?orderNumber=${order.orderNumber}`)
    } catch (err: any) {
      setServerError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Progress ── */}
      <div style={{ borderBottom: '1px solid #DEDEDE', padding: '20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: step === 'shipping' ? 700 : 400, color: step === 'shipping' ? '#000' : '#6B6B6B' }}>
            Shipping
          </span>
          <ChevronRight size={12} style={{ color: '#DEDEDE' }} />
          <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: step === 'review' ? 700 : 400, color: step === 'review' ? '#000' : '#6B6B6B' }}>
            Review & Confirm
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start' }} className="checkout-grid">

        {/* ── Left: Form / Review ── */}
        <div>
          {step === 'shipping' && (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 28 }}>Shipping Information</h2>

              <div className="checkout-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* First name */}
                <Field label="First Name *" error={errors.firstName as string}>
                  <input className="input-base" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                </Field>
                {/* Last name */}
                <Field label="Last Name *" error={errors.lastName as string}>
                  <input className="input-base" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                </Field>
                {/* Email */}
                <Field label="Email Address *" error={errors.email as string} full>
                  <input className="input-base" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                </Field>
                {/* Phone */}
                <Field label="Phone *" error={errors.phone as string} full>
                  <input className="input-base" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </Field>
                {/* Address 1 */}
                <Field label="Address *" error={errors.address1 as string} full>
                  <input className="input-base" value={form.address1} onChange={e => set('address1', e.target.value)} placeholder="Street, building, apt" />
                </Field>
                {/* Address 2 */}
                <Field label="Apt / Suite (optional)" full>
                  <input className="input-base" value={form.address2} onChange={e => set('address2', e.target.value)} />
                </Field>
                {/* Governorate */}
                <Field label="City / Governorate *" error={errors.governorate as string}>
                  <input className="input-base" value={form.governorate} onChange={e => set('governorate', e.target.value)} />
                </Field>
                {/* Zip */}
                <Field label="ZIP Code">
                  <input className="input-base" value={form.zipCode} onChange={e => set('zipCode', e.target.value)} />
                </Field>
              </div>

              {/* Terms */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 24, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.agreeToTerms}
                  onChange={e => set('agreeToTerms', e.target.checked)}
                  style={{ marginTop: 2, accentColor: '#0A4DCC' }}
                />
                <span style={{ fontSize: 12, color: '#444', lineHeight: 1.6 }}>
                  I agree to the terms and conditions and confirm that my order information is correct.
                </span>
              </label>
              {errors.agreeToTerms && (
                <p style={{ fontSize: 11, color: '#e53e3e', marginTop: 6 }}>You must agree to the terms.</p>
              )}

              <button
                onClick={handleContinue}
                className="btn-primary"
                style={{ marginTop: 32, width: '100%', textAlign: 'center', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Continue to Review
              </button>
            </>
          )}

          {step === 'review' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <button
                  onClick={() => setStep('shipping')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B' }}
                >
                  <ChevronLeft size={14} /> Edit
                </button>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Review Order</h2>
              </div>

              {/* Shipping summary */}
              <div style={{ background: '#fff', border: '1px solid #DEDEDE', padding: 20, marginBottom: 24 }}>
                <p className="label-xs" style={{ marginBottom: 10 }}>Delivering to</p>
                <p style={{ fontSize: 13, lineHeight: 1.8 }}>
                  {form.firstName} {form.lastName}<br />
                  {form.address1}{form.address2 && `, ${form.address2}`}<br />
                  {form.governorate}{form.zipCode && `, ${form.zipCode}`}<br />
                  {form.phone} · {form.email}
                </p>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {items.map(item => (
                  <div key={`${item._id}-${item.color}-${item.size}`} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #F2F2F2' }}>
                    <div style={{ position: 'relative', width: 60, height: 80, flexShrink: 0, background: '#EBEBEB', overflow: 'hidden' }}>
                      {item.image && <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="60px" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</p>
                      <p style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>{item.colorName} · {item.size} · Qty {item.quantity}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {serverError && (
                <div style={{ background: '#FFF5F5', border: '1px solid #FED7D7', padding: 14, marginBottom: 20 }}>
                  <p style={{ fontSize: 12, color: '#C53030' }}>{serverError}</p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', textAlign: 'center', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Placing Order…' : 'Place Order'}
              </button>

              <p style={{ fontSize: 11, color: '#6B6B6B', textAlign: 'center', marginTop: 12 }}>
                No payment required — pay on delivery
              </p>
            </>
          )}
        </div>

        {/* ── Right: Order Summary ── */}
        <div style={{ background: '#fff', border: '1px solid #DEDEDE', padding: 24, position: 'sticky', top: 80 }}>
          <p className="label-xs" style={{ marginBottom: 16 }}>Order Summary</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20, maxHeight: 320, overflowY: 'auto' }}>
            {items.map(item => (
              <div key={`${item._id}-${item.color}-${item.size}`} style={{ display: 'flex', gap: 12 }}>
                <div style={{ position: 'relative', width: 52, height: 68, flexShrink: 0, background: '#EBEBEB', overflow: 'hidden' }}>
                  {item.image && <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="52px" />}
                  <span style={{ position: 'absolute', top: -4, right: -4, background: '#000', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.quantity}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  <p style={{ fontSize: 10, color: '#6B6B6B', marginTop: 2 }}>{item.colorName} · {item.size}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #DEDEDE', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#6B6B6B' }}>Subtotal</span>
              <span style={{ fontSize: 12 }}>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#6B6B6B' }}>Shipping</span>
              <span style={{ fontSize: 12 }}>${shipping.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 12, borderTop: '1px solid #DEDEDE' }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 640px) {
          .checkout-form-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .checkout-grid > div:last-child { position: static !important; order: -1; }
        }
      `}</style>
    </div>
  )
}

function Field({ label, error, children, full }: { label: string; error?: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto', minWidth: 0 }}>
      <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6B6B', marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {error && <p style={{ fontSize: 11, color: '#e53e3e', marginTop: 4 }}>{error}</p>}
    </div>
  )
}
