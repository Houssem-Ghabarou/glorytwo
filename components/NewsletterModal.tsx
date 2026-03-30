'use client'

import { useEffect, useState, useRef } from 'react'
import { X } from 'lucide-react'

const STORAGE_KEY_SUBSCRIBED = 'glory_newsletter_subscribed'
const STORAGE_KEY_LAST_SHOWN  = 'glory_newsletter_last_shown'
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
const SCROLL_THRESHOLD = 0.18  // 18% down the page
const TIMEOUT_MS = 5000         // fallback: 5s

export default function NewsletterModal() {
  const [visible, setVisible]   = useState(false)
  const [email, setEmail]       = useState('')
  const [done, setDone]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const triggered               = useRef(false)

  useEffect(() => {
    // Never show if already subscribed
    if (localStorage.getItem(STORAGE_KEY_SUBSCRIBED) === 'true') return

    // Never show if shown within the last week
    const last = Number(localStorage.getItem(STORAGE_KEY_LAST_SHOWN) || 0)
    if (Date.now() - last < ONE_WEEK_MS) return

    function show() {
      if (triggered.current) return
      triggered.current = true
      setVisible(true)
      localStorage.setItem(STORAGE_KEY_LAST_SHOWN, String(Date.now()))
    }

    // Scroll trigger
    function onScroll() {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (scrolled >= SCROLL_THRESHOLD) show()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Timeout fallback
    const timer = setTimeout(show, TIMEOUT_MS)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [])

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [visible])

  function close() {
    setVisible(false)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)

    try {
      // TODO: replace with your actual newsletter endpoint
      // await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
      await new Promise(r => setTimeout(r, 800)) // simulated delay
      localStorage.setItem(STORAGE_KEY_SUBSCRIBED, 'true')
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(13,13,11,0.5)',
          backdropFilter: 'blur(3px)',
          animation: 'fadeIn 0.35s ease',
        }}
      />

      {/* Modal */}
      <div className="glory-newsletter-modal" style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 501,
        width: 'min(92vw, 780px)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
        animation: 'modalIn 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {/* Left — editorial dark panel */}
        <div className="glory-newsletter-modal-left" style={{
          background: '#1a1a18',
          color: '#f5f0e8',
          padding: '52px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: 10, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: '#c8a96e',
            fontWeight: 500,
          }}>
            Glory Studio
          </span>

          <div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32, fontWeight: 300, lineHeight: 1.15,
              letterSpacing: '-0.02em', margin: '0 0 16px',
            }}>
              First to know.<br />Always.
            </p>
            <p style={{
              fontSize: 12, color: 'rgba(245,240,232,0.45)',
              lineHeight: 1.7, letterSpacing: '0.02em',
            }}>
              New arrivals, exclusive drops,<br />and nothing else.
            </p>
          </div>

          <span style={{
            fontSize: 9, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)',
          }}>
            SS25 Collection
          </span>
        </div>

        {/* Right — form panel */}
        <div className="glory-newsletter-modal-right" style={{
          background: '#f5f0e8',
          padding: '52px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}>
          {/* Close */}
          <button
            onClick={close}
            aria-label="Close"
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, display: 'flex', color: '#1a1a18', opacity: 0.4,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
          >
            <X size={18} strokeWidth={1.4} />
          </button>

          {done ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26, fontWeight: 300, letterSpacing: '-0.01em',
                lineHeight: 1.3, marginBottom: 12,
              }}>
                You're in.
              </p>
              <p style={{ fontSize: 12, color: '#7a7468', lineHeight: 1.7 }}>
                Welcome to Glory. Expect only the essentials.
              </p>
            </div>
          ) : (
            <>
              <div>
                <p style={{
                  fontSize: 13, color: '#7a7468', lineHeight: 1.7,
                  letterSpacing: '0.01em', marginBottom: 32,
                }}>
                  Subscribe for early access to new collections and exclusive offers.
                </p>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="newsletter-email-input"
                    style={{
                      width: '100%',
                      minWidth: 0,
                      border: '1px solid #e0d8cc',
                      background: '#fdfcfa', padding: '13px 16px',
                      fontFamily: 'inherit',
                      outline: 'none', transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#1a1a18')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e0d8cc')}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="newsletter-submit-btn"
                    style={{
                      background: '#1a1a18', color: '#f5f0e8',
                      border: 'none', padding: '13px 0',
                      fontSize: 11, letterSpacing: '0.18em',
                      textTransform: 'uppercase', cursor: loading ? 'default' : 'pointer',
                      fontFamily: 'inherit', fontWeight: 500,
                      opacity: loading ? 0.6 : 1,
                      transition: 'background 0.3s, opacity 0.2s',
                    }}
                  >
                    {loading ? 'Subscribing…' : 'Subscribe'}
                  </button>
                </form>
              </div>

              <button
                onClick={close}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#7a7468', padding: 0, fontFamily: 'inherit',
                  textDecoration: 'underline', alignSelf: 'flex-start',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1a1a18')}
                onMouseLeave={e => (e.currentTarget.style.color = '#7a7468')}
              >
                No thanks
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -46%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        .newsletter-submit-btn:hover:not(:disabled) { background: #c8a96e !important; }
        @media (max-width: 560px) {
          .glory-newsletter-modal {
            grid-template-columns: 1fr !important;
          }
          .glory-newsletter-modal-left {
            padding: 36px 28px 28px !important;
          }
          .glory-newsletter-modal-left p:first-of-type {
            font-size: 26px !important;
          }
          .glory-newsletter-modal-right {
            padding: 32px 28px 36px !important;
          }
        }
      `}</style>
    </>
  )
}
