import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import CartDrawer from '@/components/CartDrawer'
import NewsletterModal from '@/components/NewsletterModal'

export const metadata: Metadata = {
  title: 'Glory — New Collection SS25',
  description: 'Premium fashion — new collection available now.',
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
