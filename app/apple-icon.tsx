import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F2F2F2',
          borderRadius: 36,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: '0.06em', color: '#0a0a0a' }}>
          GL
        </span>
      </div>
    ),
    { ...size }
  )
}
