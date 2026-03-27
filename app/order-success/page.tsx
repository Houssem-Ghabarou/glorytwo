'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const params = useSearchParams()
  const orderNumber = params.get('orderNumber') || ''

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <CheckCircle2 size={48} style={{ color: '#0A4DCC', margin: '0 auto 24px', display: 'block' }} strokeWidth={1.5} />

        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.01em' }}>
          Order Confirmed
        </h1>

        {orderNumber && (
          <p style={{ fontSize: 12, color: '#6B6B6B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Order #{orderNumber}
          </p>
        )}

        <p style={{ fontSize: 13, color: '#444', lineHeight: 1.8, marginBottom: 40 }}>
          Thank you for your order. We&apos;ve received it and will process it shortly.
          You&apos;ll receive a confirmation email soon.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>
            Continue Shopping
          </Link>
          <Link href="/" className="btn-outline" style={{ textDecoration: 'none' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  )
}
