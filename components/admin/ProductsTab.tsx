'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Search, PackageX } from 'lucide-react'
import { deleteProduct } from '@/lib/api'
import ProductForm from './ProductForm'
import type { Product } from '@/types'

interface Props {
  products: Product[]
  token: string
  onRefresh: () => void
}

export default function ProductsTab({ products, token, onRefresh }: Props) {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    setDeletingId(p._id)
    try {
      await deleteProduct(p._id, token)
      onRefresh()
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.')
    } finally {
      setDeletingId(null)
    }
  }

  const openCreate = () => { setEditProduct(undefined); setShowForm(true) }
  const openEdit = (p: Product) => { setEditProduct(p); setShowForm(true) }
  const closeForm = () => setShowForm(false)
  const handleSaved = () => { setShowForm(false); onRefresh() }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B6B6B' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, fontSize: 13, border: '1px solid #DEDEDE', background: '#fff', outline: 'none', width: 220, fontFamily: 'inherit' }}
          />
        </div>
        <button
          onClick={openCreate}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#000', color: '#fff', border: 'none', padding: '9px 16px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <Plus size={13} /> New Product
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B6B6B' }}>
          <PackageX size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} strokeWidth={1} />
          <p style={{ fontSize: 13 }}>{search ? 'No products match your search.' : 'No products yet.'}</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #DEDEDE' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 100px 80px', gap: 0, padding: '10px 16px', borderBottom: '1px solid #DEDEDE', background: '#F8F8F8' }}>
            {['', 'Product', 'Collection', 'Price', 'Stock', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B6B' }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map(p => {
            const totalStock = p.variations?.reduce((sum, v) =>
              sum + Object.values(v.sizes).reduce((s, n) => s + Number(n), 0), 0) ?? 0
            const price = p.sale > 0 ? p.sale : p.price

            return (
              <div key={p._id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 100px 80px', gap: 0, padding: '12px 16px', borderBottom: '1px solid #F2F2F2', alignItems: 'center' }}>
                {/* Image */}
                <div style={{ position: 'relative', width: 40, height: 52, background: '#EBEBEB', overflow: 'hidden', flexShrink: 0 }}>
                  {p.images?.[0] ? (
                    <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="40px" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#DEDEDE' }} />
                  )}
                </div>

                {/* Name */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  {p.reference && <p style={{ fontSize: 10, color: '#6B6B6B', marginTop: 2 }}>{p.reference}</p>}
                </div>

                {/* Collection */}
                <p style={{ fontSize: 12, color: '#6B6B6B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.collection || '—'}</p>

                {/* Price */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{price.toFixed(3)} TND</p>
                  {p.sale > 0 && <p style={{ fontSize: 10, color: '#6B6B6B', textDecoration: 'line-through' }}>{p.price.toFixed(3)} TND</p>}
                </div>

                {/* Stock */}
                <span style={{ fontSize: 12, display: 'inline-block', padding: '2px 8px', background: totalStock === 0 ? '#FFF5F5' : '#F0FFF4', color: totalStock === 0 ? '#C53030' : '#276749', border: `1px solid ${totalStock === 0 ? '#FED7D7' : '#C6F6D5'}` }}>
                  {totalStock === 0 ? 'Out of stock' : `${totalStock} units`}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button onClick={() => openEdit(p)} style={{ background: 'none', border: '1px solid #DEDEDE', padding: '5px 8px', cursor: 'pointer', color: '#444' }}>
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => handleDelete(p)} disabled={deletingId === p._id} style={{ background: 'none', border: '1px solid #FED7D7', padding: '5px 8px', cursor: 'pointer', color: '#C53030', opacity: deletingId === p._id ? 0.5 : 1 }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={closeForm}
          onSaved={handleSaved}
          token={token}
        />
      )}
    </div>
  )
}
