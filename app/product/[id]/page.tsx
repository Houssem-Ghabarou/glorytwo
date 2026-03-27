import type { Metadata } from 'next'
import { getProduct } from '@/lib/api'
import ProductDetails from './ProductDetails'
import type { Product } from '@/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  let product: Product | null = null
  try {
    product = await getProduct(id)
  } catch {
    return { title: 'Product' }
  }
  if (!product) return { title: 'Product not found' }

  const desc =
    product.description?.trim().slice(0, 160) ||
    `Shop ${product.name} at Glory — premium fashion.`
  const img = product.images?.[0]

  return {
    title: product.name,
    description: desc,
    openGraph: {
      title: `${product.name} · Glory`,
      description: desc,
      type: 'website',
      ...(img ? { images: [{ url: img, alt: product.name, width: 1200, height: 1600 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} · Glory`,
      description: desc,
      ...(img ? { images: [img] } : {}),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let product: Product | null = null

  try {
    product = await getProduct(id)
  } catch {}

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px', color: '#6B6B6B' }}>
        <p style={{ fontSize: 13 }}>Product not found.</p>
      </div>
    )
  }

  return <ProductDetails product={product} />
}
