import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export const alt = 'Glory — Fashion for the Bold'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F2F2F2',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: '#0a0a0a',
            lineHeight: 1,
          }}
        >
          GLORY
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 300,
            marginTop: 28,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: '#6B6B6B',
          }}
        >
          Fashion for the Bold
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            fontSize: 18,
            color: '#9a9a9a',
            letterSpacing: '0.2em',
          }}
        >
          SS25 · New collection
        </div>
      </div>
    ),
    { ...size }
  )
}
