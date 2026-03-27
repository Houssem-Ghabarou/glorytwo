'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '@/types'

export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false)
  const price = product.sale > 0 ? product.sale : product.price
  const isOnSale = product.sale > 0

  return (
    <Link 
      href={`/product/${product._id}`} 
      style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Image Container with Dynamic Effects */}
      <div 
        style={{ 
          position: 'relative', 
          aspectRatio: '3/4', 
          overflow: 'hidden', 
          background: '#EBEBEB',
          borderRadius: 2,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 8px 24px rgba(0, 0, 0, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
        }}
        className="product-card-container"
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ 
              objectFit: 'cover', 
              transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
            }}
            className="product-img"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#EBEBEB' }} />
        )}

        {/* Overlay on Hover */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.15)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Sale Badge with Animation */}
        {isOnSale && (
          <span 
            style={{
              position: 'absolute', 
              top: 12, 
              left: 12,
              background: '#0A4DCC', 
              color: '#fff',
              fontSize: 9, 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase',
              padding: '5px 10px',
              fontWeight: 700,
              borderRadius: 1,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            Sale
          </span>
        )}

        {/* Quick Action Indicator */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              width: 36,
              height: 36,
              background: '#fff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              animation: 'slideUp 0.3s ease',
              fontSize: 18,
            }}
          >
            +
          </div>
        )}
      </div>

      {/* Info Section with Enhanced Typography */}
      <div style={{ paddingTop: 14 }}>
        <p 
          style={{ 
            fontSize: 12, 
            fontWeight: 500, 
            marginBottom: 6, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            color: '#1a1a1a',
            transition: 'color 0.2s ease',
          }}
          className="product-name"
        >
          {product.name}
        </p>
        
        {/* Price Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isOnSale ? (
            <>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0A4DCC' }}>
                ${product.sale}
              </span>
              <span style={{ fontSize: 11, color: '#999', textDecoration: 'line-through', fontWeight: 400 }}>
                ${product.price}
              </span>
            </>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
              ${price}
            </span>
          )}
        </div>

        {/* Collection Badge */}
        {product.collection && (
          <p 
            style={{
              fontSize: 10,
              color: '#0A4DCC',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: 6,
              opacity: 0.7,
            }}
          >
            {product.collection}
          </p>
        )}
      </div>

      <style>{`
        .product-img {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .product-card-container:hover .product-img {
          transform: scale(1.05);
        }

        .product-name {
          transition: color 0.2s ease;
        }

        .product-card-container:hover .product-name {
          color: #0A4DCC;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 2px 8px rgba(10, 77, 204, 0.3);
          }
          50% {
            box-shadow: 0 2px 12px rgba(10, 77, 204, 0.5);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Link>
  )
}
