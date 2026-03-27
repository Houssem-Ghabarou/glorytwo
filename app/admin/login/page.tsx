'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin } from '@/lib/api'
import { Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('glory_admin_user') || 'null')
      if (user?.role === 'admin') router.replace('/admin')
    } catch {}
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      const res = await loginAdmin(email.trim(), password)
      if (res.user?.role !== 'admin') {
        setError('Access denied. Admin only.')
        return
      }
      localStorage.setItem('glory_admin_token', res.token)
      localStorage.setItem('glory_admin_user', JSON.stringify(res.user))
      router.replace('/admin')
    } catch (err: any) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: '0.08em', color: '#fff', fontFamily: 'BeatriceDeck, sans-serif' }}>GLORY</span>
          <p style={{ fontSize: 11, color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 6 }}>Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '14px 16px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '14px 44px 14px 16px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ fontSize: 12, color: '#fc6060', padding: '10px 14px', background: 'rgba(252,96,96,0.08)', border: '1px solid rgba(252,96,96,0.2)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: '#0A4DCC', color: '#fff', border: 'none', padding: '14px 24px', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
