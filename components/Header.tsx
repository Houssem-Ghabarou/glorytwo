'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, ArrowLeft } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/shop#collections' },
]

export default function Header() {
  const { count, openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
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
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: '#F2F2F2',
        borderBottom: `1px solid ${scrolled ? '#DEDEDE' : 'transparent'}`,
        transition: 'border-color 0.25s',
      }}>
        <nav style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            height: 88,
            padding: '0 28px',
          }}>
            {/* Far left — hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex' }}
            >
              <Menu size={24} strokeWidth={1.3} />
            </button>

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
              <ShoppingBag size={24} strokeWidth={1.3} />
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: -2, right: -6,
                  background: '#0A4DCC', color: '#fff',
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

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.45)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
          backdropFilter: menuOpen ? 'blur(2px)' : 'none',
        }}
      />

      {/* Side drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 300,
        width: 'min(80vw, 360px)',
        height: '100dvh',
        background: '#0A0A0A',
        color: '#F5F5F0',
        display: 'flex',
        flexDirection: 'column',
        transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.45s cubic-bezier(0.76, 0, 0.24, 1)',
        overflow: 'hidden',
      }}>
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '28px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
            Menu
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#F5F5F0' }}
          >
            <X size={20} strokeWidth={1.2} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px' }}>
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                fontSize: 36,
                fontWeight: 300,
                letterSpacing: '-0.02em',
                textDecoration: 'none',
                color: '#F5F5F0',
                padding: '14px 0',
                borderBottom: i < NAV_LINKS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                transition: 'opacity 0.2s',
                lineHeight: 1.1,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer — back home shortcut */}
        <div style={{ padding: '28px 40px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              textDecoration: 'none', color: 'rgba(255,255,255,0.45)',
              fontWeight: 500, transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F5F5F0')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Home
          </Link>
        </div>
      </div>
    </>
  )
}
