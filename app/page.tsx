'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
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

/* ── Scroll-reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal-section ${className ?? ''}`} style={style}>{children}</div>
}

/* ── Skeleton ── */
function Sk({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return <div className={`sk ${className ?? ''}`} style={{ background: '#e8dfd0', ...style }} />
}

/* ── Marquee ── */
function Marquee() {
  const items = ['New Arrivals', 'Curated Fashion', 'Timeless Elegance', 'Free Shipping Over 300 TND']
  return (
    <div style={{
      background: '#1a1a18', color: '#f5f0e8', padding: '14px 0',
      overflow: 'hidden', whiteSpace: 'nowrap',
    }}>
      <div className="marquee-track">
        {[...Array(3)].map((_, rep) =>
          items.map((item, i) => (
            <span key={`${rep}-${i}`}>
              <span style={{
                fontFamily: "'BeatriceDeck', sans-serif", fontSize: '0.85rem',
                letterSpacing: '0.25em', padding: '0 40px', opacity: 0.7,
              }}>{item.toUpperCase()}</span>
              <span style={{ color: '#c8a96e', opacity: 1, padding: '0 10px' }}>&#10022;</span>
            </span>
          ))
        )}
      </div>
    </div>
  )
}

/* ── Section label with decorative line ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase',
      color: '#c8a96e', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ display: 'block', width: 30, height: 1, background: '#c8a96e' }} />
      {children}
    </div>
  )
}

/* ── Collection card ── */
function CollectionCard({ name, image, count }: { name: string; image: string; count: number }) {
  return (
    <Link
      href={`/shop?collection=${encodeURIComponent(name)}`}
      className="cc"
      style={{
        display: 'block', textDecoration: 'none', position: 'relative',
        overflow: 'hidden', background: '#1a1a18', height: '100%',
      }}
    >
      {image ? (
        <Image
          src={image} alt={name} fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: 'cover', transition: 'transform .8s cubic-bezier(.23,1,.32,1)', opacity: 0.88 }}
          className="cc-img"
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #c9b89a 0%, #9a7f5e 100%)' }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(13,13,11,0.75) 0%, transparent 50%)',
        transition: 'opacity 0.4s',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 28, color: '#f5f0e8',
        transform: 'translateY(8px)', transition: 'transform 0.4s ease',
      }} className="cc-info">
        <p style={{
          fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#c8a96e', margin: '0 0 6px',
        }}>{count} pieces</p>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
          fontWeight: 400, lineHeight: 1.1, margin: '0 0 12px', color: '#f5f0e8',
        }}>{name}</p>
        <span className="cc-link" style={{
          fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#f5f0e8', display: 'inline-flex', alignItems: 'center', gap: 8,
          opacity: 0, transform: 'translateY(8px)', transition: 'all 0.4s ease 0.1s',
        }}>
          Shop Now <span>&#8594;</span>
        </span>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
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
        <div className="home-skeleton-hero-copy" style={{ background: 'var(--color-bg)', padding: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Sk style={{ height: 10, width: 100 }} />
          <Sk style={{ height: 50, width: '80%' }} />
          <Sk style={{ height: 50, width: '60%' }} />
          <Sk style={{ height: 14, width: 280, marginTop: 8 }} />
          <Sk style={{ height: 48, width: 180, marginTop: 'auto' }} />
        </div>
        <Sk className="home-skeleton-hero-img" style={{ height: '100%', minHeight: 280 }} />
      </div>
      <div style={{ background: '#1a1a18', height: 48 }} />
      <div className="hairline-grid home-skeleton-products" style={{ gridTemplateColumns: 'repeat(4,1fr)', margin: '40px 32px 0' }}>
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
          .home-skeleton-hero { grid-template-columns: 1fr !important; height: auto !important; }
          .home-skeleton-hero-img { min-height: min(72vw, 380px) !important; height: 72vw !important; }
          .home-skeleton-hero-copy { padding: 24px 20px 28px !important; }
          .home-skeleton-products { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )

  /* ── empty ── */
  if (products.length === 0) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '40px 20px' }}>
      <img src="/logo.svg" alt="Glory" style={{ height: 32, opacity: 0.18 }} />
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem',
        fontWeight: 300, fontStyle: 'italic', color: '#7a7468', margin: 0,
      }}>
        New collection coming soon
      </p>
      <Link href="/shop" style={{
        fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
        borderBottom: '1px solid #1a1a18', paddingBottom: 2, textDecoration: 'none', color: '#1a1a18',
      }}>
        Browse Shop
      </Link>
    </div>
  )

  const hero = products[0]
  const gridProducts = products.slice(1, 9)

  return (
    <div>

      {/* ══════════════════════════════════════
          HERO — split layout
      ══════════════════════════════════════ */}
      <section className="hero-split" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        minHeight: 'clamp(500px, 80vh, 800px)', overflow: 'hidden',
        position: 'relative', width: '100vw', marginLeft: 'calc(-50vw + 50%)',
      }}>
        {/* Text panel */}
        <div className="hero-text-panel" style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '80px 60px 80px 80px', position: 'relative', zIndex: 2,
        }}>
          <div className="hero-label" style={{
            fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase',
            color: '#c8a96e', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12,
            opacity: 0, animation: 'fadeUp 0.8s ease 0.2s forwards',
          }}>
            <span style={{ display: 'block', width: 40, height: 1, background: '#c8a96e' }} />
            Summer Collection 25
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3.2rem, 6vw, 6rem)', fontWeight: 300,
            lineHeight: 0.95, color: '#1a1a18', margin: '0 0 32px',
            opacity: 0, animation: 'fadeUp 0.9s ease 0.35s forwards',
          }}>
            Wear Your<br />
            <em style={{ fontStyle: 'italic', color: '#9a7a45' }}>Story</em><br />
            With Pride
          </h1>
          <p style={{
            fontSize: '0.9rem', lineHeight: 1.8, color: '#7a7468',
            maxWidth: 380, marginBottom: 48, fontWeight: 300,
            opacity: 0, animation: 'fadeUp 0.9s ease 0.5s forwards',
          }}>
            Curated fashion that speaks to the modern woman. Timeless pieces, contemporary spirit, crafted with intention.
          </p>
          <div style={{
            display: 'flex', gap: 20, alignItems: 'center',
            opacity: 0, animation: 'fadeUp 0.9s ease 0.65s forwards',
          }}>
            <Link href="/shop" className="hero-primary-btn" style={{
              background: '#1a1a18', color: '#f5f0e8',
              padding: '16px 40px', fontSize: '0.78rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none', fontWeight: 500,
              transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
            }}>
              Explore Collection
            </Link>
            <Link href="/shop" className="hero-ghost-btn" style={{
              color: '#1a1a18', fontSize: '0.78rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              textDecoration: 'none', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'gap 0.3s ease, color 0.3s ease',
            }}>
              View Lookbook <span>&#8594;</span>
            </Link>
          </div>
        </div>

        {/* Image panel */}
        <div className="hero-image-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          {hero.images?.[0] ? (
            <Image
              src={hero.images[0]} alt="Glory" fill priority
              sizes="50vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              className="hero-bg-img"
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(145deg, #d4c4a8 0%, #b8a882 40%, #8a7a5e 100%)',
            }} />
          )}
          {/* Product tag */}
          {hero && (
            <div className="hero-tag" style={{
              position: 'absolute', bottom: 40, left: 40,
              background: 'rgba(245,240,232,0.9)', backdropFilter: 'blur(8px)',
              padding: '16px 20px', zIndex: 3,
              opacity: 0, animation: 'fadeUp 0.8s ease 1s forwards',
            }}>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7468', margin: '0 0 4px' }}>Featured</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 600, color: '#1a1a18', margin: '0 0 4px' }}>
                {hero.name}
              </p>
              <p style={{ fontSize: '0.82rem', color: '#c8a96e', margin: 0 }}>
                {hero.price} TND
              </p>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator" style={{
          position: 'absolute', bottom: 40, right: 48,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          opacity: 0, animation: 'fadeIn 1s ease 1.2s forwards',
        }}>
          <div className="scroll-line" style={{
            width: 1, height: 60,
            background: 'linear-gradient(to bottom, #c8a96e, transparent)',
          }} />
          <span style={{
            fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: '#7a7468', writingMode: 'vertical-rl',
          }}>Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <Marquee />

      {/* ══════════════════════════════════════
          COLLECTIONS
      ══════════════════════════════════════ */}
      {hasCollections && (
        <Reveal style={{ maxWidth: 1440, margin: '0 auto', padding: '100px 80px' }} className="home-section">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 60 }}>
            <div>
              <SectionLabel>Curated For You</SectionLabel>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 300, lineHeight: 1.05, margin: 0,
              }}>
                Shop By<br /><em style={{ fontStyle: 'italic', color: '#9a7a45' }}>Category</em>
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost-link" style={{
              fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              textDecoration: 'none', fontWeight: 500, color: '#1a1a18',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'color 0.3s, gap 0.3s',
            }}>
              All Collections <span>&#8594;</span>
            </Link>
          </div>

          {collections.length === 2 && (
            <div className="home-collections-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: 480 }}>
              {collections.map(c => <CollectionCard key={c.name} {...c} />)}
            </div>
          )}
          {collections.length === 3 && (
            <div className="col3-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 16, height: 520 }}>
              <div style={{ gridRow: '1 / 3' }}><CollectionCard {...collections[0]} /></div>
              <CollectionCard {...collections[1]} />
              <CollectionCard {...collections[2]} />
            </div>
          )}
          {collections.length >= 4 && (
            <div className="home-collections-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, height: 460 }}>
              {collections.slice(0, 4).map(c => <CollectionCard key={c.name} {...c} />)}
            </div>
          )}
        </Reveal>
      )}

      {/* ══════════════════════════════════════
          PRODUCTS
      ══════════════════════════════════════ */}
      {gridProducts.length > 0 && (
        <Reveal className="home-section home-section-products" style={{ maxWidth: 1440, margin: '0 auto', padding: `${hasCollections ? '0' : '80px'} 80px 100px` }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 60 }}>
            <div>
              <SectionLabel>Just Landed</SectionLabel>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 300, lineHeight: 1.05, margin: 0,
              }}>
                New <em style={{ fontStyle: 'italic', color: '#9a7a45' }}>Arrivals</em>
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost-link" style={{
              fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              textDecoration: 'none', fontWeight: 500, color: '#1a1a18',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'color 0.3s, gap 0.3s',
            }}>
              View All <span>&#8594;</span>
            </Link>
          </div>

          <div className="hairline-grid home-product-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
            {gridProducts.map(p => (
              <div key={p._id} className="product-tile" style={{ background: 'transparent', padding: 0 }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 60, textAlign: 'center' }}>
            <Link href="/shop" className="see-all-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              fontWeight: 500, textDecoration: 'none',
              color: '#f5f0e8', background: '#1a1a18',
              padding: '16px 40px', transition: 'background .35s',
            }}>
              See All Products <span style={{ fontSize: 14, fontWeight: 300 }}>&#8594;</span>
            </Link>
          </div>
        </Reveal>
      )}

      {/* ══════════════════════════════════════
          BANNER — promotional
      ══════════════════════════════════════ */}
      <Reveal style={{ margin: '0 80px 100px' }} className="home-section home-banner-wrap">
        <section style={{
          background: '#1a1a18', display: 'grid', gridTemplateColumns: '1fr 1fr',
          overflow: 'hidden', position: 'relative',
        }} className="home-banner">
          <div style={{ padding: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: 24 }}>
              Limited Time Offer
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 300,
              lineHeight: 1.05, color: '#f5f0e8', margin: '0 0 20px',
            }}>
              End of<br />Season <em style={{ fontStyle: 'italic' }}>Sale</em>
            </h2>
            <p style={{
              color: 'rgba(245,240,232,0.5)', fontSize: '0.88rem',
              lineHeight: 1.8, maxWidth: 350, marginBottom: 40, fontWeight: 300,
            }}>
              Refresh your wardrobe with our curated sale selection. Timeless pieces at exceptional value.
            </p>
            <Link href="/shop" className="banner-cta" style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: '#c8a96e', color: '#f5f0e8', padding: '16px 40px',
              fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none', fontWeight: 500, width: 'fit-content',
              transition: 'background 0.3s',
            }}>
              Shop the Sale &#8594;
            </Link>
          </div>
          <div style={{ position: 'relative', minHeight: 400, overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, #2a2520 0%, #3d3328 50%, #1a1510 100%)',
            }} />
            {/* Decorative pattern */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.06,
              backgroundImage: 'repeating-linear-gradient(45deg, #c8a96e 0, #c8a96e 1px, transparent 0, transparent 50%)',
              backgroundSize: '20px 20px',
            }} />
            {/* Concentric circles */}
            {[400, 280, 160].map(size => (
              <div key={size} style={{
                position: 'absolute', width: size, height: size,
                border: '1px solid rgba(200,169,110,0.2)', borderRadius: '50%',
                top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              }} />
            ))}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              fontFamily: "'BeatriceDeck', sans-serif", fontSize: '8rem',
              color: '#c8a96e', opacity: 0.15, lineHeight: 1, fontWeight: 800,
            }}>40%</div>
            <div style={{ position: 'absolute', bottom: 40, right: 40, textAlign: 'right' }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem',
                fontWeight: 300, color: '#f5f0e8', lineHeight: 1,
              }}>200+</div>
              <div style={{
                fontSize: '0.65rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#c8a96e',
              }}>Items on sale</div>
            </div>
          </div>
        </section>
      </Reveal>


      {/* ── Styles ── */}
      <style>{`
        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(0.4); opacity: 0.4; }
        }

        .scroll-line { animation: scrollPulse 1.5s ease infinite; }
        .marquee-track {
          display: inline-flex;
          animation: marqueeScroll 20s linear infinite;
          white-space: nowrap;
        }

        /* Reveal on scroll */
        .reveal-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .reveal-section.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* Hover interactions */
        .cc:hover .cc-img { transform: scale(1.05) !important; }
        .cc:hover .cc-info { transform: translateY(0) !important; }
        .cc:hover .cc-link { opacity: 1 !important; transform: translateY(0) !important; }
        .hero-primary-btn:hover { background: #c8a96e !important; }
        .hero-ghost-btn:hover { color: #c8a96e !important; gap: 14px !important; }
        .see-all-btn:hover { background: #c8a96e !important; }
        .banner-cta:hover { background: #9a7a45 !important; }
        .btn-ghost-link:hover { color: #c8a96e !important; gap: 14px !important; }

        /* Responsive */
        @media (max-width: 1100px) {
          .hero-split { grid-template-columns: 1fr !important; }
          .hero-image-panel { min-height: 50vh !important; }
          .hero-text-panel { padding: 60px 40px !important; }
          .home-collections-4 { grid-template-columns: repeat(2, 1fr) !important; height: auto !important; }
          .home-collections-4 .cc { min-height: 240px !important; }
        }
        @media (max-width: 768px) {
          .hero-text-panel { padding: 48px 24px !important; }
          .hero-scroll-indicator { display: none !important; }
          .hero-tag { bottom: 20px !important; left: 20px !important; }
          .home-section { padding-left: 24px !important; padding-right: 24px !important; }
          .home-section-products { padding-bottom: 60px !important; }
          .home-banner-wrap { margin-left: 24px !important; margin-right: 24px !important; }
          .home-banner { grid-template-columns: 1fr !important; }
          .home-banner > div:first-child { padding: 48px 32px !important; }
          .home-banner > div:last-child { min-height: 280px !important; }
          .home-product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
          .home-collections-2 { grid-template-columns: 1fr !important; height: auto !important; }
          .home-collections-2 .cc { min-height: 260px !important; }
          .col3-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
          .col3-grid > div:first-child { grid-row: auto !important; }
          .col3-grid .cc { min-height: 220px !important; }
        }
      `}</style>
    </div>
  )
}
