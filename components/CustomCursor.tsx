'use client'

import { useEffect, useRef, useCallback } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)
  const visible = useRef(false)

  const animate = useCallback(() => {
    ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12
    ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12
    if (ringRef.current) {
      ringRef.current.style.left = ringPos.current.x + 'px'
      ringRef.current.style.top = ringPos.current.y + 'px'
    }
    raf.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    // Skip on touch devices
    if (typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      dot.style.left = e.clientX + 'px'
      dot.style.top = e.clientY + 'px'
      if (!visible.current) {
        visible.current = true
        dot.style.opacity = '1'
        ring.style.opacity = '0.6'
      }
    }

    const onLeave = () => {
      visible.current = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    // Scale up on interactive elements
    const onEnter = () => {
      dot.style.transform = 'translate(-50%, -50%) scale(2)'
      ring.style.transform = 'translate(-50%, -50%) scale(1.6)'
      ring.style.borderColor = '#c8a96e'
    }
    const onLeaveEl = () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)'
      ring.style.transform = 'translate(-50%, -50%) scale(1)'
      ring.style.borderColor = '#c8a96e'
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    const interactiveEls = document.querySelectorAll('a, button, [role="button"], .cc, .product-card, .lookbook-item, input, textarea, select')
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeaveEl)
    })

    // Also observe DOM changes for dynamically added elements
    const observer = new MutationObserver(() => {
      const els = document.querySelectorAll('a, button, [role="button"], .cc, .product-card, .lookbook-item, input, textarea, select')
      els.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeaveEl)
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeaveEl)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    raf.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeaveEl)
      })
      observer.disconnect()
      cancelAnimationFrame(raf.current)
    }
  }, [animate])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          width: 10, height: 10,
          background: '#c8a96e',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.15s ease',
          opacity: 0,
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: 36, height: 36,
          border: '1px solid #c8a96e',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.35s, width 0.35s, height 0.35s',
          opacity: 0,
        }}
      />
      <style>{`
        @media (pointer: coarse) {
          /* Hide custom cursor on touch devices */
        }
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  )
}
