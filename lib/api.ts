const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function apiFetch(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${endpoint}`, options)
  if (!res.ok) {
    let msg = 'Request failed'
    try {
      const err = await res.json()
      msg = err.message || err.error || msg
    } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export const getProducts = () =>
  apiFetch('/products/product', { cache: 'no-store' })

export const getProduct = (id: string) =>
  apiFetch(`/products/product/${id}`, { cache: 'no-store' })

export const createOrder = (data: object) =>
  apiFetch('/orders/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

export const getAllOrders = () =>
  apiFetch('/orders/order', { cache: 'no-store' })

export const updateOrderStatus = (id: string, status: string, token: string) =>
  apiFetch(`/orders/order/status/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })

export const cancelOrder = (id: string) =>
  apiFetch(`/orders/cancelorder/${id}`, { method: 'PUT' })

export const loginAdmin = (email: string, password: string) =>
  apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

export const createProduct = (formData: FormData, token: string) =>
  apiFetch('/products/product', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

export const updateProduct = (id: string, formData: FormData, token: string) =>
  apiFetch(`/products/product/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

export const deleteProduct = (id: string, token: string) =>
  apiFetch(`/products/product/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
