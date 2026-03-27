'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CollectionCardProps {
  name: string
  image: string
  count: number
}

export default function CollectionCard({ name, image, count }: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={`/shop?collection=${encodeURIComponent(name)}`}
      className="cc"
      style={{ 
        display: 'block', 
        textDecoration: 'none', 
        position: 'relative', 
        overflow: 'hidden', 
        background: '#111',
        borderRadius: 2,
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 16px 32px rgba(0, 0, 0, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Image */}
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ 
            objectFit: 'cover', 
            transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
            opacity: isHovered ? 1 : 0.88,
          }}
          className="cc-img"
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: '#222' }} />
      )}

      {/* Enhanced Gradient Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isHovered 
          ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)',
        transition: 'background 0.4s ease',
      }} />

      {/* Accent Line */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, #0A4DCC, transparent)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 20px 24px',
        display: 'flex', flexDirection: 'column', gap: 12,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.3s ease',
      }}>
        <div>
          <p 
            style={{ 
              fontSize: 10, 
              letterSpacing: '0.22em', 
              textTransform: 'uppercase', 
              color: isHovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', 
              margin: '0 0 4px',
              transition: 'color 0.3s ease',
              fontWeight: 600,
            }}
          >
            {count} pieces
          </p>
          <p 
            style={{ 
              fontSize: 'clamp(16px,2vw,22px)', 
              fontWeight: 800, 
              color: '#fff', 
              margin: 0, 
              letterSpacing: '-0.01em',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
            }}
          >
            {name}
          </p>
        </div>

        {/* CTA button with enhanced interaction */}
        <span 
          className="cc-btn" 
          style={{
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6,
            fontSize: 10, 
            letterSpacing: '0.16em', 
            textTransform: 'uppercase', 
            fontWeight: 700,
            color: isHovered ? '#0A4DCC' : '#fff', 
            border: `1.5px solid ${isHovered ? '#0A4DCC' : 'rgba(255,255,255,0.55)'}`,
            padding: '9px 16px', 
            width: 'fit-content',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: isHovered ? 'rgba(255,255,255,0.08)' : 'transparent',
            backdropFilter: isHovered ? 'blur(4px)' : 'none',
            borderRadius: 1,
            cursor: 'pointer',
          }}
        >
          <span style={{ transition: 'transform 0.3s ease', display: 'inline-block', transform: isHovered ? 'translateX(2px)' : 'translateX(0)' }}>
            See Collection
          </span>
          <span style={{ transition: 'transform 0.3s ease', display: 'inline-block', transform: isHovered ? 'translateX(3px)' : 'translateX(0)' }}>
            →
          </span>
        </span>
      </div>

      <style>{`
        .cc:hover .cc-img {
          transform: scale(1.06);
        }
      `}</style>
    </Link>
  )
}
