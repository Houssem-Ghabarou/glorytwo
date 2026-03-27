export interface ProductVariation {
  color: string
  name: string
  sizes: Record<string, number>
}

export interface Product {
  _id: string
  name: string
  reference: string
  description: string
  collection: string
  price: number
  sale: number
  category: string
  gender: string
  images: string[]
  variations: ProductVariation[]
}

export interface CartItem {
  _id: string
  name: string
  price: number
  image: string
  color: string
  colorName: string
  size: string
  quantity: number
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  governorate: string
  zipCode: string
  agreeToTerms: boolean
}

export interface OrderItem {
  product: Product | string
  size: string
  color: string
  quantity: number
}

export interface Order {
  _id: string
  orderNumber: string
  customerInfo: CustomerInfo
  items: OrderItem[]
  total: number
  status: 'OnHold' | 'Pending' | 'Cancelled' | 'Confirmed'
  createdAt: string
  updatedAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}
