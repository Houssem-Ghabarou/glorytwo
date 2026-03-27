'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutGrid, ShoppingBag, LogOut, Package } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [adminName, setAdminName] = useState('')

  useEffect(() => {
    // Don't guard the login page itself
    if (pathname === '/admin/login') { setReady(true); return }

    try {
      const user = JSON.parse(localStorage.getItem('glory_admin_user') || 'null')
      const token = localStorage.getItem('glory_admin_token')
      if (!token || !user || user.role !== 'admin') {
        router.replace('/admin/login')
        return
      }
      setAdminName(user.name || user.email || 'Admin')
    } catch {
      router.replace('/admin/login')
      return
    }
    setReady(true)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('glory_admin_token')
    localStorage.removeItem('glory_admin_user')
    router.replace('/admin/login')
  }

  if (!ready) return null

  // Login page — no sidebar
  if (pathname === '/admin/login') return <>{children}</>

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F8F8', fontFamily: 'BeatriceDeck, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#111', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid #222' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 18, letterSpacing: '0.08em', color: '#fff', textDecoration: 'none' }}>
            GLORY
          </Link>
          <p style={{ fontSize: 10, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>Admin</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          <Link
            href="/admin"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', marginBottom: 2,
              fontSize: 12, letterSpacing: '0.05em',
              color: pathname === '/admin' ? '#fff' : '#888',
              background: pathname === '/admin' ? '#1a1a1a' : 'transparent',
              textDecoration: 'none', borderRadius: 4,
              transition: 'all 0.15s',
            }}
          >
            <LayoutGrid size={15} />
            Dashboard
          </Link>
        </nav>

        {/* User + logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #222' }}>
          <p style={{ fontSize: 11, color: '#888', paddingLeft: 12, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {adminName}
          </p>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', fontSize: 12, color: '#666', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 4, letterSpacing: '0.05em', transition: 'color 0.15s' }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
