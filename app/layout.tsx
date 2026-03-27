import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import CartDrawer from '@/components/CartDrawer'
import NewsletterModal from '@/components/NewsletterModal'
import { getSiteUrl } from '@/lib/site'

const siteUrl = getSiteUrl()
const siteName = 'Glory'
const titleDefault = 'Glory — Fashion for the Bold'
const description =
  'Discover premium fashion at Glory. New collections, curated outerwear, and essentials — designed for the bold. Shop online with delivery updates.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titleDefault,
    template: `%s · ${siteName}`,
  },
  description,
  keywords: [
    'Glory',
    'fashion',
    'luxury fashion',
    'clothing',
    'outerwear',
    'womenswear',
    'menswear',
    'online boutique',
    'new collection',
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: titleDefault,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: titleDefault,
    description,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  category: 'fashion',
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
