import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import CartDrawer from '@/components/CartDrawer'
import NewsletterModal from '@/components/NewsletterModal'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/Footer'
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          <CustomCursor />
          <Header />
          <CartDrawer />
          <NewsletterModal />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
