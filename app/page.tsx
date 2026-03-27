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
function Sk({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return <div className={`sk ${className ?? ''}`} style={{ background: '#E8E8E8', ...style }} />
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
          sizes="(max-width: 768px) 100vw, 33vw"
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
    <div className="home-loading" style={{ maxWidth: 1440, margin: '0 auto', padding: '0 0 80px' }}>
      <div className="hairline-grid home-skeleton-hero" style={{ gridTemplateColumns: '1fr 1fr', height: 500, marginBottom: 1 }}>
        <Sk className="home-skeleton-hero-img" style={{ height: '100%', minHeight: 280 }} />
        <div className="home-skeleton-hero-copy" style={{ background: 'var(--color-bg)', padding: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Sk style={{ height: 10, width: 100 }} />
          <Sk style={{ height: 40, width: '80%' }} />
          <Sk style={{ height: 40, width: '60%' }} />
          <Sk style={{ height: 14, width: 80, marginTop: 8 }} />
          <Sk style={{ height: 44, width: 160, marginTop: 'auto' }} />
        </div>
      </div>
      <div className="hairline-grid home-skeleton-products" style={{ gridTemplateColumns: 'repeat(4,1fr)', margin: '0' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="product-tile">
            <Sk style={{ aspectRatio: '3/4' }} />
            <Sk style={{ height: 10, width: '60%', marginTop: 10 }} />
            <Sk style={{ height: 10, width: '30%', marginTop: 6 }} />
          </div>
        ))}
      </div>
      <style>{`
        .sk{animation:sk 1.5s ease-in-out infinite}
        @keyframes sk{0%,100%{opacity:1}50%{opacity:.4}}
        @media (max-width: 768px) {
          .home-loading { padding: 0 0 48px !important; }
          .home-skeleton-hero { grid-template-columns: 1fr !important; height: auto !important; margin-bottom: 8px !important; }
          .home-skeleton-hero-img { min-height: min(72vw, 380px) !important; height: 72vw !important; }
          .home-skeleton-hero-copy { padding: 24px 20px 28px !important; min-height: 0 !important; }
          .home-skeleton-products { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )

  /* ── empty ── */
  if (products.length === 0) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '40px 20px' }}>
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
          FULL-WIDTH HERO — brand introduction
      ══════════════════════════════════════ */}
      <section style={{ position: 'relative', width: '100vw', height: 'clamp(400px, 70vh, 700px)', overflow: 'hidden', marginLeft: 'calc(-50vw + 50%)' }}>
        {/* Background image */}
        {hero.images?.[0] ? (
          <Image
            src={hero.images[0]}
            alt="Glory"
            fill priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            className="hero-bg-img"
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#EBEBEB' }} />
        )}

        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
        }} />

        {/* Content overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', color: '#fff', padding: '40px 20px'
        }}>
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 80px)',
            fontWeight: 900, letterSpacing: '-0.03em',
            margin: '0 0 16px', lineHeight: 1.0
          }}>
            GLORY
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 2.5vw, 20px)',
            fontWeight: 300, letterSpacing: '0.15em',
            textTransform: 'uppercase', margin: '0 0 32px',
            maxWidth: 600, lineHeight: 1.6
          }}>
            Curated Fashion for the Discerning Taste
          </p>
          <Link
            href="/shop"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              fontWeight: 700, textDecoration: 'none',
              color: '#fff', background: 'rgba(255,255,255,0.15)',
              padding: '14px 32px', backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
            }}
            className="hero-cta"
          >
            Explore Collection
            <span>→</span>
          </Link>
        </div>

        <style>{`
          .hero-cta:hover {
            background: rgba(255,255,255,0.25) !important;
            border-color: rgba(255,255,255,0.5) !important;
          }
          @media (max-width: 768px) {
            .hero-cta {
              padding: 12px 24px !important;
              font-size: 10px !important;
            }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════
          COLLECTIONS — editorial grid with CTA per card
      ══════════════════════════════════════ */}
      {hasCollections && (
        <section className="home-section" style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
            <h2 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0 }}>Collections</h2>
            <Link href="/shop" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6B6B', textDecoration: 'none', borderBottom: '1px solid #BABABA', paddingBottom: 1 }}>
              All Collections
            </Link>
          </div>

          {/* Asymmetric editorial layout */}
          {collections.length === 2 && (
            <div className="home-collections-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, height: 420 }}>
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
            <div className="home-collections-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, height: 400 }}>
              {collections.slice(0, 4).map(c => <CollectionCard key={c.name} {...c} />)}
            </div>
          )}
        </section>
      )}



      {/* ══════════════════════════════════════
          PRODUCTS GRID — with "See All" CTA
      ══════════════════════════════════════ */}
      {gridProducts.length > 0 && (
        <section className="home-section home-section-products" style={{ maxWidth: 1440, margin: '0 auto', padding: `${hasCollections ? '0' : '48px'} 32px 80px` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
            <h2 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0 }}>
              New Arrivals
            </h2>
            <Link href="/shop" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6B6B', textDecoration: 'none', borderBottom: '1px solid #BABABA', paddingBottom: 1 }}>
              View all {products.length}
            </Link>
          </div>

          <div className="hairline-grid home-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
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
      <footer className="home-footer" style={{ borderTop: '1px solid #DEDEDE', padding: '40px 32px 36px' }}>
        <div className="home-footer-inner" style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
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
          .home-section { padding-left: 16px !important; padding-right: 16px !important; }
          .home-section-products { padding-bottom: 56px !important; }
          .hero-copy { padding: 28px 20px 32px !important; }
          .hero-grid { grid-template-columns: 1fr !important; height: auto !important; }
          .hero-grid > a { height: min(88vw, 420px) !important; min-height: 280px !important; position: relative; }
          .home-collections-2 {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .home-collections-2 .cc { min-height: 220px !important; aspect-ratio: 4/5; }
          .home-collections-4 {
            grid-template-columns: repeat(2, 1fr) !important;
            height: auto !important;
            gap: 6px !important;
          }
          .home-collections-4 .cc { min-height: 180px !important; }
          .col3-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
          .col3-grid > div:first-child { grid-row: auto !important; }
          .col3-grid .cc { min-height: 200px !important; }
          .home-footer { padding: 32px 16px 28px !important; }
          .home-footer-inner { flex-direction: column !important; align-items: flex-start !important; }
          .home-product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  )
}
