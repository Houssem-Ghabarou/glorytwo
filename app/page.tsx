'use client'

import { useEffect, useState, useMemo } from 'react'
import { getProducts } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/types'

function groupCollections(products: Product[]) {
  const map = new Map<string, { image: string; count: number }>()
  for (const p of products) {
    const name = p.collection?.trim()
    if (!name) continue
    if (!map.has(name)) map.set(name, { image: p.images?.[0] ?? '', count: 0 })
    map.get(name)!.count++
  }
  return Array.from(map.entries()).map(([name, d]) => ({ name, ...d }))
}

/* ─────────────────────────────────────────────
   Skeleton card
───────────────────────────────────────────── */
function Sk({ style }: { style?: React.CSSProperties }) {
  return <div className="sk" style={{ background: '#E8E8E8', ...style }} />
}

/* ─────────────────────────────────────────────
   Collection card — image fill + gradient overlay + button
───────────────────────────────────────────── */
function CollectionCard({ name, image, count }: { name: string; image: string; count: number }) {
  return (
    <Link
      href={`/shop?collection=${encodeURIComponent(name)}`}
      className="cc"
      style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden', background: '#111' }}
    >
      {/* Image */}
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes="33vw"
          style={{ objectFit: 'cover', transition: 'transform .65s cubic-bezier(.4,0,.2,1)', opacity: 0.88 }}
          className="cc-img"
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: '#222' }} />
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 20px 20px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: '0 0 4px' }}>
            {count} pieces
          </p>
          <p style={{ fontSize: 'clamp(16px,2vw,22px)', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
            {name}
          </p>
        </div>
        {/* CTA button — always visible */}
        <span className="cc-btn" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600,
          color: '#fff', border: '1px solid rgba(255,255,255,0.55)',
          padding: '7px 14px', width: 'fit-content',
          transition: 'background .2s, border-color .2s',
        }}>
          See Collection →
        </span>
      </div>
    </Link>
  )
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const collections = useMemo(() => groupCollections(products), [products])
  const hasCollections = collections.length >= 2

  /* ── loading ── */
  if (loading) return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 0 80px' }}>
      <div className="hairline-grid" style={{ gridTemplateColumns: '1fr 1fr', height: 500, marginBottom: 1 }}>
        <Sk style={{ height: '100%' }} />
        <div style={{ background: 'var(--color-bg)', padding: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Sk style={{ height: 10, width: 100 }} />
          <Sk style={{ height: 40, width: '80%' }} />
          <Sk style={{ height: 40, width: '60%' }} />
          <Sk style={{ height: 14, width: 80, marginTop: 8 }} />
          <Sk style={{ height: 44, width: 160, marginTop: 'auto' }} />
        </div>
      </div>
      <div className="hairline-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', margin: '0' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="product-tile">
            <Sk style={{ aspectRatio: '3/4' }} />
            <Sk style={{ height: 10, width: '60%', marginTop: 10 }} />
            <Sk style={{ height: 10, width: '30%', marginTop: 6 }} />
          </div>
        ))}
      </div>
      <style>{`.sk{animation:sk 1.5s ease-in-out infinite}@keyframes sk{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )

  /* ── empty ── */
  if (products.length === 0) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40 }}>
      <img src="/logo.svg" alt="Glory" style={{ height: 32, opacity: 0.18 }} />
      <p style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#6B6B6B', margin: 0 }}>
        New collection coming soon
      </p>
      <Link href="/shop" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: 2, textDecoration: 'none', color: '#000' }}>
        Browse Shop
      </Link>
    </div>
  )

  const hero = products[0]
  const gridProducts = products.slice(1, 9)

  return (
    <div>

      {/* ══════════════════════════════════════
          HERO — 50/50 editorial split
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div className="hero-grid hairline-grid" style={{ gridTemplateColumns: '1fr 1fr', height: 520 }}>

          {/* Image side */}
          <Link href={`/product/${hero._id}`} style={{ display: 'block', overflow: 'hidden', background: '#EBEBEB', textDecoration: 'none', position: 'relative' }}>
            {hero.images?.[0] ? (
              <Image
                src={hero.images[0]}
                alt={hero.name}
                fill priority
                sizes="(max-width:768px) 100vw, 50vw"
                style={{ objectFit: 'cover', transition: 'transform .7s cubic-bezier(.4,0,.2,1)' }}
                className="hero-img"
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: 'var(--color-placeholder)' }} />
            )}
            {/* Sale badge */}
            {hero.sale > 0 && (
              <span style={{ position: 'absolute', top: 16, left: 16, background: '#0A4DCC', color: '#fff', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '4px 9px', fontWeight: 700 }}>
                Sale
              </span>
            )}
          </Link>

          {/* Info side */}
          <div style={{ background: 'var(--color-bg)', padding: '44px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', height: '100%' }}>
            {/* Top */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#6B6B6B', margin: '0 0 24px' }}>
                SS25{hero.collection ? ` · ${hero.collection}` : ''}
              </p>
              <h1 style={{ fontSize: 'clamp(24px, 3vw, 42px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.025em', margin: '0 0 16px' }}>
                {hero.name}
              </h1>
              {hero.description && (
                <p style={{ fontSize: 12, color: '#6B6B6B', lineHeight: 1.7, maxWidth: 300, margin: '0 0 20px' }}>
                  {hero.description.length > 110 ? hero.description.slice(0, 110) + '…' : hero.description}
                </p>
              )}
              <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>
                {hero.sale > 0
                  ? <><span style={{ color: '#0A4DCC' }}>${hero.sale}</span>&nbsp;<span style={{ fontSize: 13, color: '#999', textDecoration: 'line-through', fontWeight: 400 }}>${hero.price}</span></>
                  : `$${hero.price}`}
              </p>
            </div>

            {/* Bottom */}
            <div>
              {hero.variations?.length > 0 && (
                <div style={{ display: 'flex', gap: 7, marginBottom: 22, flexWrap: 'wrap' }}>
                  {hero.variations.slice(0, 8).map(v => (
                    <span key={v.color} title={v.name} style={{ width: 16, height: 16, borderRadius: '50%', background: v.color, border: '1.5px solid rgba(0,0,0,0.12)', flexShrink: 0 }} />
                  ))}
                  {hero.variations.length > 8 && <span style={{ fontSize: 10, color: '#6B6B6B', alignSelf: 'center' }}>+{hero.variations.length - 8}</span>}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link
                  href={`/product/${hero._id}`}
                  className="btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  View Product
                </Link>
                <Link
                  href={hero.collection ? `/shop?collection=${encodeURIComponent(hero.collection)}` : '/shop'}
                  className="btn-outline"
                  style={{ textDecoration: 'none' }}
                >
                  {hero.collection ? `Shop ${hero.collection}` : 'See All Products'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COLLECTIONS — editorial grid with CTA per card
      ══════════════════════════════════════ */}
      {hasCollections && (
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
            <h2 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0 }}>Collections</h2>
            <Link href="/shop" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6B6B', textDecoration: 'none', borderBottom: '1px solid #BABABA', paddingBottom: 1 }}>
              All Collections
            </Link>
          </div>

          {/* Asymmetric editorial layout */}
          {collections.length === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, height: 420 }}>
              {collections.map(c => <CollectionCard key={c.name} {...c} />)}
            </div>
          )}
          {collections.length === 3 && (
            <div className="col3-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8, height: 460 }}>
              <div style={{ gridRow: '1 / 3' }}><CollectionCard {...collections[0]} /></div>
              <CollectionCard {...collections[1]} />
              <CollectionCard {...collections[2]} />
            </div>
          )}
          {collections.length >= 4 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, height: 400 }}>
              {collections.slice(0, 4).map(c => <CollectionCard key={c.name} {...c} />)}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════
          PRODUCTS GRID — with "See All" CTA
      ══════════════════════════════════════ */}
      {gridProducts.length > 0 && (
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: `${hasCollections ? '0' : '48px'} 32px 80px` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
            <h2 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0 }}>
              New Arrivals
            </h2>
            <Link href="/shop" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6B6B', textDecoration: 'none', borderBottom: '1px solid #BABABA', paddingBottom: 1 }}>
              View all {products.length}
            </Link>
          </div>

          <div className="hairline-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {gridProducts.map(p => (
              <div key={p._id} className="product-tile">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {/* Big CTA */}
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
                fontWeight: 600, textDecoration: 'none',
                color: '#fff', background: '#000',
                padding: '15px 36px',
                transition: 'background .2s',
              }}
              className="see-all-btn"
            >
              See All Products
              <span style={{ fontSize: 14, fontWeight: 400 }}>→</span>
            </Link>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid #DEDEDE', padding: '40px 32px 36px' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <img src="/footerlogo.svg" alt="Glory" className="footer-logo" style={{ height: 88, width: 'auto', display: 'block' }} />
          <p style={{ fontSize: 11, color: '#6B6B6B', margin: 0 }}>© 2025 Glory. All rights reserved.</p>
        </div>
      </footer>

      {/* ── interactions ── */}
      <style>{`
        .hero-grid:hover .hero-img    { transform: scale(1.03) !important; }
        .cc:hover .cc-img             { transform: scale(1.06) !important; }
        .cc:hover .cc-btn             { background: rgba(255,255,255,0.18) !important; border-color: #fff !important; }
        .see-all-btn:hover            { background: #0A4DCC !important; }
        @media (max-width: 768px) {
          .footer-logo { height: 64px !important; }
          .hero-grid { grid-template-columns: 1fr !important; height: auto !important; }
          .hero-grid > a { height: 340px !important; position: relative; }
          .col3-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
          .col3-grid > div:first-child { grid-row: auto !important; }
        }
      `}</style>
    </div>
  )
}
