import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import CartDrawer from '@/components/CartDrawer'
import NewsletterModal from '@/components/NewsletterModal'

export const metadata: Metadata = {
  title: 'Glory — Fashion for the Bold',
  description: 'Premium fashion — new collection available now.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <CartDrawer />
          <NewsletterModal />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
