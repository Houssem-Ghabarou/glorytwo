import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'

export default function ProductCard({ product }: { product: Product }) {
  const price = product.sale > 0 ? product.sale : product.price
  const isOnSale = product.sale > 0

  return (
    <Link href={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#e8dfd0' }}>
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1)' }}
            className="product-img"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#e8dfd0' }} />
        )}
        {isOnSale && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: '#c8a96e', color: '#fff',
            fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '4px 10px', fontWeight: 600,
          }}>
            Sale
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ paddingTop: 12 }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem',
          fontWeight: 400, marginBottom: 6, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1a1a18',
        }}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          {isOnSale ? (
            <>
              <span style={{ fontSize: '0.92rem', fontWeight: 500, color: '#1a1a18' }}>${product.sale}</span>
              <span style={{ fontSize: '0.8rem', color: '#7a7468', textDecoration: 'line-through' }}>${product.price}</span>
            </>
          ) : (
            <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>${price}</span>
          )}
        </div>
      </div>

      <style>{`
        a:hover .product-img { transform: scale(1.04); }
      `}</style>
    </Link>
  )
}
