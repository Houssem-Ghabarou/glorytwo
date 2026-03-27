import { getProduct } from '@/lib/api'
import ProductDetails from './ProductDetails'
import type { Product } from '@/types'

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
