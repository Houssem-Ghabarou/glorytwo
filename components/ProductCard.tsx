import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'

export default function ProductCard({ product }: { product: Product }) {
  const price = product.sale > 0 ? product.sale : product.price
  const isOnSale = product.sale > 0

  return (
    <Link href={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#EBEBEB' }}>
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' }}
            className="product-img"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#DEDEDE' }} />
        )}
        {isOnSale && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: '#0A4DCC', color: '#fff',
            fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '3px 8px',
          }}>
            Sale
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ paddingTop: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isOnSale ? (
            <>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0A4DCC' }}>${product.sale}</span>
              <span style={{ fontSize: 12, color: '#6B6B6B', textDecoration: 'line-through' }}>${product.price}</span>
            </>
          ) : (
            <span style={{ fontSize: 13 }}>${product.price}</span>
          )}
        </div>
      </div>

      <style>{`
        a:hover .product-img { transform: scale(1.04); }
      `}</style>
    </Link>
  )
}
