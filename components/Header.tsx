'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState, useEffect, useRef } from 'react'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/shop#collections' },
  { label: 'New Arrivals', href: '/shop' },
  { label: 'Sale', href: '/shop' },
]

export default function Header() {
  const { count, openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const dirY = useRef(0) // anchor Y when direction last changed
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 4)

      if (y <= 100) {
        setHidden(false)
        dirY.current = y
      } else if (y > dirY.current + 60) {
        // Scrolled 60px downward from anchor — hide
        setHidden(true)
        dirY.current = y
      } else if (y < dirY.current - 30) {
        // Scrolled 30px upward from anchor — show
        setHidden(false)
        dirY.current = y
      }

      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  if (isAdmin) return null

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: 'rgba(245, 240, 232, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(200, 169, 110, 0.2)' : 'transparent'}`,
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s ease',
      }}>
        <nav style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            height: scrolled ? 72 : 88,
            padding: '0 28px',
            transition: 'height 0.4s ease',
          }}>
            {/* Far left — hamburger */}
            <div
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menu"
              style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer' }}
              className="header-menu-btn"
            >
              <span style={{ display: 'block', width: 24, height: 1, background: '#1a1a18', transition: 'all 0.3s ease' }} />
              <span className="menu-line-2" style={{ display: 'block', width: 24, height: 1, background: '#1a1a18', transition: 'all 0.3s ease' }} />
              <span style={{ display: 'block', width: 24, height: 1, background: '#1a1a18', transition: 'all 0.3s ease' }} />
            </div>

            {/* Center — Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <img
                src="/logo.svg"
                alt="Glory"
                style={{ height: 42, width: 'auto', display: 'block' }}
              />
            </Link>

            {/* Far right — cart */}
            <button
              onClick={openCart}
              aria-label="Cart"
              style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex' }}
            >
              <ShoppingBag size={22} strokeWidth={1.2} />
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: -2, right: -6,
                  background: '#c8a96e', color: '#fff',
                  borderRadius: '50%', width: 17, height: 17,
                  fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
          </nav>
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: 88 }} />

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(13,13,11,0.7)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Side drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 300,
        width: 'min(85vw, 420px)',
        height: '100dvh',
        background: '#1a1a18',
        color: '#f5f0e8',
        display: 'flex',
        flexDirection: 'column',
        transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.5s cubic-bezier(0.77, 0, 0.18, 1)',
        overflowY: 'auto',
      }}>
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '28px 40px',
          borderBottom: '1px solid rgba(245,240,232,0.08)',
        }}>
          <span style={{
            fontFamily: "'BeatriceDeck', sans-serif",
            fontSize: '1.5rem', letterSpacing: '0.18em',
            color: '#f5f0e8', fontWeight: 700,
          }}>
            GLORY
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, display: 'flex', color: '#f5f0e8',
              opacity: 0.6, transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
          >
            <X size={22} strokeWidth={1.2} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px' }}>
          {NAV_LINKS.map((link, i) => (
            <Link
              key={`${link.href}-${i}`}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="nav-drawer-link"
              style={{
                display: 'block',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.2rem',
                fontWeight: 300,
                textDecoration: 'none',
                color: 'rgba(245,240,232,0.4)',
                padding: '12px 0',
                borderBottom: i < NAV_LINKS.length - 1 ? '1px solid rgba(245,240,232,0.06)' : 'none',
                transition: 'color 0.25s ease',
                lineHeight: 1.1,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer — socials */}
        <div style={{ padding: '40px', borderTop: '1px solid rgba(245,240,232,0.08)' }}>
          <div style={{
            fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#c8a96e', marginBottom: 16,
          }}>
            Follow us
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Instagram', 'Facebook', 'TikTok'].map(social => (
              <a
                key={social}
                href="#"
                className="nav-social-link"
                style={{
                  fontSize: '0.78rem', letterSpacing: '0.1em',
                  color: 'rgba(245,240,232,0.5)', textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .header-menu-btn:hover .menu-line-2 { width: 16px !important; }
        .nav-drawer-link:hover { color: #f5f0e8 !important; }
        .nav-social-link:hover { color: #c8a96e !important; }
      `}</style>
    </>
  )
}
