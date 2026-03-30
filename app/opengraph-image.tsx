import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Tokenlab — Structure your tokenomics'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0F',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Network SVG background */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="630" fill="url(#glow)" />
          <line x1="160" y1="100" x2="420" y2="220" stroke="#7C3AED" strokeOpacity="0.25" strokeWidth="1.5" />
          <line x1="420" y1="220" x2="700" y2="130" stroke="#7C3AED" strokeOpacity="0.25" strokeWidth="1.5" />
          <line x1="700" y1="130" x2="980" y2="310" stroke="#7C3AED" strokeOpacity="0.2"  strokeWidth="1.5" />
          <line x1="420" y1="220" x2="580" y2="420" stroke="#7C3AED" strokeOpacity="0.2"  strokeWidth="1.5" />
          <line x1="580" y1="420" x2="820" y2="440" stroke="#7C3AED" strokeOpacity="0.15" strokeWidth="1.5" />
          <line x1="160" y1="100" x2="260" y2="340" stroke="#7C3AED" strokeOpacity="0.15" strokeWidth="1.5" />
          <line x1="260" y1="340" x2="420" y2="220" stroke="#7C3AED" strokeOpacity="0.2"  strokeWidth="1.5" />
          <line x1="700" y1="130" x2="800" y2="50"  stroke="#7C3AED" strokeOpacity="0.15" strokeWidth="1.5" />
          <line x1="980" y1="310" x2="1080" y2="160" stroke="#7C3AED" strokeOpacity="0.15" strokeWidth="1.5" />
          <circle cx="160" cy="100" r="5" fill="#7C3AED" fillOpacity="0.8" />
          <circle cx="420" cy="220" r="8" fill="#7C3AED" fillOpacity="0.9" />
          <circle cx="700" cy="130" r="5" fill="#7C3AED" fillOpacity="0.7" />
          <circle cx="980" cy="310" r="6" fill="#7C3AED" fillOpacity="0.6" />
          <circle cx="580" cy="420" r="5" fill="#7C3AED" fillOpacity="0.5" />
          <circle cx="260" cy="340" r="4" fill="#7C3AED" fillOpacity="0.5" />
          <circle cx="800" cy="50"  r="4" fill="#7C3AED" fillOpacity="0.4" />
          <circle cx="1080" cy="160" r="4" fill="#7C3AED" fillOpacity="0.4" />
        </svg>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, position: 'relative' }}>
          <svg width="48" height="48" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#7C3AED" strokeWidth="1.5" />
            <circle cx="11" cy="11" r="6" fill="#7C3AED" fillOpacity="0.2" />
            <circle cx="11" cy="11" r="3" fill="#7C3AED" />
            <path d="M11 1 L11 4 M11 18 L11 21 M1 11 L4 11 M18 11 L21 11" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#E8E8F0', letterSpacing: '-0.02em' }}>
            Tokenlab
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <h1 style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#E8E8F0',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}>
            Structure your tokenomics.
          </h1>
          <p style={{
            fontSize: 24,
            color: '#6B6B8A',
            margin: '20px 0 0',
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.4,
          }}>
            Post-workshop tool for Web3 founders — 9 modules, AI Coach, PDF export.
          </p>
        </div>

        {/* Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 48,
          background: 'rgba(124,58,237,0.15)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 99,
          padding: '8px 20px',
          position: 'relative',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED', display: 'block' }} />
          <span style={{ fontSize: 16, fontWeight: 600, color: '#7C3AED', letterSpacing: '0.05em' }}>
            tokenlabapp.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
