'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types'

export default function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart()

  const [activeImg, setActiveImg] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.variations?.[0]?.color ?? '')
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const swipeRef = useRef<{ x: number } | null>(null)
  const images = product.images ?? []
  const imageCount = images.length

  const variation = product.variations?.find(v => v.color === selectedColor)
  const sizes = variation ? Object.entries(variation.sizes) : []
  const price = product.sale > 0 ? product.sale : product.price

  const sizeStock = (size: string) => {
    if (!variation) return 0
    return variation.sizes[size] ?? 0
  }

  const SWIPE_PX = 48

  const onGalleryPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (imageCount <= 1) return
    swipeRef.current = { x: e.clientX }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onGalleryPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeRef.current || imageCount <= 1) return
    const dx = swipeRef.current.x - e.clientX
    if (dx > SWIPE_PX) setActiveImg(i => Math.min(imageCount - 1, i + 1))
    else if (dx < -SWIPE_PX) setActiveImg(i => Math.max(0, i - 1))
    swipeRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }

  const onGalleryPointerCancel = () => {
    swipeRef.current = null
  }

  const handleAddToCart = () => {
    if (!selectedSize) return
    const colorName = variation?.name || selectedColor
    addItem({
      _id: product._id,
      name: product.name,
      price,
      image: product.images?.[0] ?? '',
      color: selectedColor,
      colorName,
      size: selectedSize,
      quantity: qty,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px 80px' }}>
      {/* Back */}
      <div style={{ padding: '20px 0' }}>
        <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a7468', textDecoration: 'none' }}>
          <ChevronLeft size={14} /> Shop
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }} className="product-layout">
        {/* ── Images ── */}
        <div>
          {/* Main image — swipe / drag horizontally to change photo */}
          <div
            role={imageCount > 1 ? 'region' : undefined}
            aria-label={imageCount > 1 ? `Photos ${activeImg + 1} of ${imageCount}. Swipe or drag sideways to change.` : undefined}
            onPointerDown={onGalleryPointerDown}
            onPointerUp={onGalleryPointerUp}
            onPointerCancel={onGalleryPointerCancel}
            style={{
              position: 'relative',
              aspectRatio: '3/4',
              background: '#e8dfd0',
              overflow: 'hidden',
              marginBottom: 8,
              cursor: imageCount > 1 ? 'grab' : 'default',
              touchAction: imageCount > 1 ? 'pan-y' : 'auto',
            }}
            className="product-gallery-main"
          >
            {product.images?.[activeImg] ? (
              <Image
                src={product.images[activeImg]}
                alt={imageCount > 1 ? `${product.name} — ${activeImg + 1} of ${imageCount}` : product.name}
                fill
                draggable={false}
                priority
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#e0d8cc' }} />
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    position: 'relative', width: 64, height: 80, flexShrink: 0,
                    background: '#e8dfd0', border: i === activeImg ? '2px solid #1a1a18' : '2px solid transparent',
                    cursor: 'pointer', padding: 0, overflow: 'hidden',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <Image src={img} alt="" fill style={{ objectFit: 'cover' }} sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div style={{ paddingTop: 8 }}>
          {product.collection && (
            <p style={{
              fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#c8a96e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ display: 'block', width: 20, height: 1, background: '#c8a96e' }} />
              {product.collection}
            </p>
          )}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, lineHeight: 1.1, marginBottom: 16,
          }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 28 }}>
            {product.sale > 0 ? (
              <>
                <span style={{ fontSize: 22, fontWeight: 500, color: '#1a1a18' }}>${product.sale}</span>
                <span style={{ fontSize: 16, color: '#7a7468', textDecoration: 'line-through' }}>${product.price}</span>
              </>
            ) : (
              <span style={{ fontSize: 22, fontWeight: 500 }}>${product.price}</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p style={{ fontSize: 13, lineHeight: 1.8, color: '#7a7468', marginBottom: 32, fontWeight: 300 }}>
              {product.description}
            </p>
          )}

          {/* ── Color ── */}
          {product.variations?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p className="label-xs" style={{ marginBottom: 12 }}>
                Color — <span style={{ color: '#1a1a18', textTransform: 'none', letterSpacing: 0 }}>{variation?.name || selectedColor}</span>
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.variations.map(v => (
                  <button
                    key={v.color}
                    onClick={() => { setSelectedColor(v.color); setSelectedSize('') }}
                    title={v.name || v.color}
                    style={{
                      width: 28, height: 28,
                      borderRadius: '50%',
                      background: v.color,
                      border: selectedColor === v.color ? '2px solid #1a1a18' : '2px solid #e0d8cc',
                      outline: selectedColor === v.color ? '1px solid #1a1a18' : 'none',
                      outlineOffset: 2,
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Size ── */}
          {sizes.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <p className="label-xs" style={{ marginBottom: 12 }}>Size</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {sizes.map(([size, stock]) => {
                  const outOfStock = Number(stock) === 0
                  const isSelected = selectedSize === size
                  return (
                    <button
                      key={size}
                      onClick={() => !outOfStock && setSelectedSize(size)}
                      disabled={outOfStock}
                      style={{
                        minWidth: 44, padding: '8px 12px',
                        fontSize: 12, fontFamily: 'inherit', letterSpacing: '0.05em',
                        border: isSelected ? '1px solid #1a1a18' : '1px solid #e0d8cc',
                        background: isSelected ? '#1a1a18' : outOfStock ? '#faf7f2' : '#fdfcfa',
                        color: isSelected ? '#f5f0e8' : outOfStock ? '#c4b9a8' : '#1a1a18',
                        cursor: outOfStock ? 'not-allowed' : 'pointer',
                        textDecoration: outOfStock ? 'line-through' : 'none',
                        transition: 'all 0.15s',
                      }}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
              {!selectedSize && (
                <p style={{ fontSize: 11, color: '#7a7468', marginTop: 8 }}>Please select a size</p>
              )}
            </div>
          )}

          {/* ── Qty ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <p className="label-xs">Qty</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 40, border: '1px solid #e0d8cc', background: '#fdfcfa', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>−</button>
              <span style={{ width: 44, textAlign: 'center', borderTop: '1px solid #e0d8cc', borderBottom: '1px solid #e0d8cc', height: 40, lineHeight: '40px', fontSize: 13 }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 40, border: '1px solid #e0d8cc', background: '#fdfcfa', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>+</button>
            </div>
          </div>

          {/* ── Add to cart ── */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="product-add-btn"
            style={{
              width: '100%', padding: '16px 24px',
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              fontFamily: 'inherit', fontWeight: 600,
              background: added ? '#c8a96e' : !selectedSize ? '#e0d8cc' : '#1a1a18',
              color: !selectedSize ? '#7a7468' : '#f5f0e8',
              border: 'none', cursor: !selectedSize ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <ShoppingBag size={14} />
            {added ? 'Added to Cart!' : 'Add to Cart'}
          </button>

          {/* ── Meta ── */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #e0d8cc', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {product.category && (
              <div>
                <p className="label-xs" style={{ marginBottom: 4 }}>Category</p>
                <p style={{ fontSize: 12 }}>{product.category}</p>
              </div>
            )}
            {product.gender && (
              <div>
                <p className="label-xs" style={{ marginBottom: 4 }}>Gender</p>
                <p style={{ fontSize: 12 }}>{product.gender}</p>
              </div>
            )}
            {product.reference && (
              <div>
                <p className="label-xs" style={{ marginBottom: 4 }}>Ref</p>
                <p style={{ fontSize: 12, color: '#7a7468' }}>{product.reference}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .product-gallery-main:active { cursor: grabbing; }
        .product-add-btn:hover:not(:disabled) { background: #c8a96e !important; }
        @media (max-width: 768px) {
          .product-layout { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </div>
  )
}
