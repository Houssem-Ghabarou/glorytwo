import type { Product } from '@/types'

/** Local assets under /public — used when API is unreachable (demo mode). */
const IMG_A = '/publicimage1.jpg'
const IMG_B = '/publicimage2.webp'

const sizes = (xs: number, s: number, m: number, l: number, xl: number) => ({
  XS: xs,
  S: s,
  M: m,
  L: l,
  XL: xl,
})

export const DEMO_PRODUCTS: Product[] = [
  {
    _id: 'demo-prod-1',
    name: 'Meridian Wool Coat',
    reference: 'GL-SS25-001',
    description: 'Structured double-face wool with a clean dropped shoulder. Demo placeholder.',
    collection: 'Nocturne',
    price: 420,
    sale: 0,
    category: 'Outerwear',
    gender: 'Women',
    images: [IMG_A, IMG_B],
    variations: [
      { color: '#1a1a1a', name: 'Charcoal', sizes: sizes(2, 4, 6, 4, 2) },
      { color: '#3d2c29', name: 'Espresso', sizes: sizes(1, 3, 5, 3, 1) },
    ],
  },
  {
    _id: 'demo-prod-2',
    name: 'Arc Silk Shirt',
    reference: 'GL-SS25-014',
    description: 'Lightweight silk with a relaxed camp collar. Demo placeholder.',
    collection: 'Nocturne',
    price: 198,
    sale: 158,
    category: 'Tops',
    gender: 'Women',
    images: [IMG_B, IMG_A],
    variations: [
      { color: '#e8e4dc', name: 'Ivory', sizes: sizes(3, 5, 6, 4, 2) },
      { color: '#2c3e50', name: 'Ink', sizes: sizes(2, 4, 5, 4, 2) },
    ],
  },
  {
    _id: 'demo-prod-3',
    name: 'Velum Pleated Skirt',
    reference: 'GL-SS25-022',
    description: 'Sunray pleats with a hidden side zip. Demo placeholder.',
    collection: 'Luminous',
    price: 245,
    sale: 0,
    category: 'Bottoms',
    gender: 'Women',
    images: [IMG_A],
    variations: [
      { color: '#c9a227', name: 'Amber', sizes: sizes(2, 3, 5, 4, 1) },
    ],
  },
  {
    _id: 'demo-prod-4',
    name: 'Cipher Tailored Trousers',
    reference: 'GL-SS25-031',
    description: 'High-rise straight leg with pressed crease. Demo placeholder.',
    collection: 'Luminous',
    price: 210,
    sale: 189,
    category: 'Bottoms',
    gender: 'Men',
    images: [IMG_B],
    variations: [
      { color: '#1f2937', name: 'Graphite', sizes: sizes(2, 4, 5, 4, 3) },
      { color: '#4b5563', name: 'Slate', sizes: sizes(1, 3, 4, 3, 2) },
    ],
  },
  {
    _id: 'demo-prod-5',
    name: 'Aether Knit Crew',
    reference: 'GL-SS25-040',
    description: 'Fine-gauge merino with ribbed cuffs. Demo placeholder.',
    collection: 'Nocturne',
    price: 165,
    sale: 0,
    category: 'Knitwear',
    gender: 'Men',
    images: [IMG_A, IMG_B],
    variations: [
      { color: '#0f172a', name: 'Midnight', sizes: sizes(3, 5, 6, 5, 2) },
    ],
  },
  {
    _id: 'demo-prod-6',
    name: 'Solstice Linen Blazer',
    reference: 'GL-SS25-052',
    description: 'Unlined linen blend for warm evenings. Demo placeholder.',
    collection: 'Luminous',
    price: 310,
    sale: 0,
    category: 'Outerwear',
    gender: 'Women',
    images: [IMG_B, IMG_A],
    variations: [
      { color: '#faf8f5', name: 'Chalk', sizes: sizes(1, 3, 4, 3, 1) },
      { color: '#78716c', name: 'Stone', sizes: sizes(2, 3, 4, 3, 2) },
    ],
  },
  {
    _id: 'demo-prod-7',
    name: 'Echo Leather Belt',
    reference: 'GL-SS25-061',
    description: 'Vegetable-tanned leather with matte buckle. Demo placeholder.',
    collection: 'Nocturne',
    price: 85,
    sale: 0,
    category: 'Accessories',
    gender: 'Unisex',
    images: [IMG_A],
    variations: [
      { color: '#292524', name: 'Black', sizes: { '80': 3, '85': 5, '90': 4, '95': 2 } },
    ],
  },
  {
    _id: 'demo-prod-8',
    name: 'Nimbus Packable Parka',
    reference: 'GL-SS25-073',
    description: 'Water-resistant shell with packable hood. Demo placeholder.',
    collection: 'Luminous',
    price: 380,
    sale: 320,
    category: 'Outerwear',
    gender: 'Men',
    images: [IMG_B, IMG_A],
    variations: [
      { color: '#334155', name: 'Storm', sizes: sizes(2, 3, 4, 4, 2) },
    ],
  },
]

export function getDemoProductById(id: string): Product | null {
  return DEMO_PRODUCTS.find(p => p._id === id) ?? null
}
