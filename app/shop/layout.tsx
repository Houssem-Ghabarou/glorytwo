import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse the Glory shop — collections, new arrivals, and premium fashion essentials.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
