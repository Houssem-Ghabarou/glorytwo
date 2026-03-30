'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <footer style={{ background: '#0d0d0b', color: '#f5f0e8', padding: '80px 80px 40px' }} className="site-footer">
        <div className="footer-top" style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 60, marginBottom: 60,
        }}>
          <div>
            <img src="/logo.svg" alt="Glory" className="footer-logo" style={{ height: 48, width: 'auto', display: 'block', marginBottom: 20, filter: 'invert(1) brightness(0.9)' }} />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem', fontStyle: 'italic',
              color: 'rgba(245,240,232,0.4)', lineHeight: 1.6, marginBottom: 28,
            }}>
              Fashion is the armor to survive the reality of everyday life.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: 24 }}>Shop</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0 }}>
              {['New Arrivals', 'Collections', 'Sale'].map(item => (
                <li key={item}><Link href="/shop" className="footer-link" style={{ color: 'rgba(245,240,232,0.45)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: 24 }}>Help</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0 }}>
              {['Contact Us', 'Shipping Info', 'Returns', 'Size Guide'].map(item => (
                <li key={item}><Link href="/shop" className="footer-link" style={{ color: 'rgba(245,240,232,0.45)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: 24 }}>Follow</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0 }}>
              {['Instagram', 'Facebook', 'TikTok'].map(item => (
                <li key={item}><a href="#" className="footer-link" style={{ color: 'rgba(245,240,232,0.45)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 32, borderTop: '1px solid rgba(245,240,232,0.08)',
        }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', letterSpacing: '0.05em', margin: 0 }}>
            &copy; 2025 Glory. All rights reserved.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', letterSpacing: '0.08em', margin: 0 }}>
            Currency: <span style={{ color: '#c8a96e' }}>TND د.ت</span>
          </p>
        </div>
      </footer>

      <style>{`
        .footer-link:hover { color: #f5f0e8 !important; }
        @media (max-width: 1100px) {
          .footer-top { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .footer-top { grid-template-columns: 1fr !important; gap: 40px !important; }
          .site-footer { padding: 60px 24px 32px !important; }
          .footer-logo { height: 36px !important; }
        }
      `}</style>
    </>
  )
}
