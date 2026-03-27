'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { X, Plus, Trash2, Upload } from 'lucide-react'
import { createProduct, updateProduct } from '@/lib/api'
import type { Product, ProductVariation } from '@/types'

interface Props {
  product?: Product
  onClose: () => void
  onSaved: () => void
  token: string
}

interface VariationForm {
  color: string
  name: string
  sizes: { size: string; stock: string }[]
}

const DEFAULT_VARIATION: VariationForm = { color: '#000000', name: 'Black', sizes: [{ size: 'S', stock: '0' }, { size: 'M', stock: '0' }, { size: 'L', stock: '0' }] }

export default function ProductForm({ product, onClose, onSaved, token }: Props) {
  const isEdit = !!product
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(product?.name ?? '')
  const [reference, setReference] = useState(product?.reference ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [collection, setCollection] = useState(product?.collection ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [sale, setSale] = useState(product?.sale?.toString() ?? '0')
  const [category, setCategory] = useState(product?.category ?? '')
  const [gender, setGender] = useState(product?.gender ?? '')
  const [variations, setVariations] = useState<VariationForm[]>(() => {
    if (product?.variations?.length) {
      return product.variations.map(v => ({
        color: v.color,
        name: v.name,
        sizes: Object.entries(v.sizes).map(([size, stock]) => ({ size, stock: String(stock) })),
      }))
    }
    return [{ ...DEFAULT_VARIATION }]
  })
  const [existingImages, setExistingImages] = useState<string[]>(product?.images ?? [])
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files)
    setNewFiles(prev => [...prev, ...arr])
    arr.forEach(f => {
      const reader = new FileReader()
      reader.onload = e => setNewPreviews(prev => [...prev, e.target?.result as string])
      reader.readAsDataURL(f)
    })
  }

  const removeExisting = (url: string) => {
    setExistingImages(prev => prev.filter(i => i !== url))
    setImagesToRemove(prev => [...prev, url])
  }

  const removeNew = (i: number) => {
    setNewFiles(prev => prev.filter((_, idx) => idx !== i))
    setNewPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  const addVariation = () => setVariations(prev => [...prev, { color: '#888888', name: '', sizes: [{ size: 'S', stock: '0' }] }])
  const removeVariation = (i: number) => setVariations(prev => prev.filter((_, idx) => idx !== i))
  const addSize = (vi: number) => setVariations(prev => prev.map((v, i) => i === vi ? { ...v, sizes: [...v.sizes, { size: '', stock: '0' }] } : v))
  const removeSize = (vi: number, si: number) => setVariations(prev => prev.map((v, i) => i === vi ? { ...v, sizes: v.sizes.filter((_, j) => j !== si) } : v))
  const updateVariation = (vi: number, key: keyof VariationForm, value: string) =>
    setVariations(prev => prev.map((v, i) => i === vi ? { ...v, [key]: value } : v))
  const updateSize = (vi: number, si: number, key: 'size' | 'stock', value: string) =>
    setVariations(prev => prev.map((v, i) => i === vi ? { ...v, sizes: v.sizes.map((s, j) => j === si ? { ...s, [key]: value } : s) } : v))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !price) { setError('Name and price are required.'); return }
    if (variations.length === 0) { setError('Add at least one color variation.'); return }
    if (!isEdit && newFiles.length === 0) { setError('Please add at least one image.'); return }

    setLoading(true)

    try {
      const fd = new FormData()
      fd.append('name', name.trim())
      fd.append('reference', reference.trim())
      fd.append('description', description.trim())
      fd.append('collection', collection.trim())
      fd.append('price', price)
      fd.append('sale', sale || '0')
      fd.append('category', category.trim())
      fd.append('gender', gender.trim())

      const variationsPayload = variations.map(v => ({
        color: v.color,
        name: v.name || v.color,
        sizes: Object.fromEntries(v.sizes.map(s => [s.size.toUpperCase(), Number(s.stock)])),
      }))
      fd.append('variations', JSON.stringify(variationsPayload))

      if (isEdit) fd.append('imagesToRemove', JSON.stringify(imagesToRemove))
      newFiles.forEach(f => fd.append('images', f))

      if (isEdit) {
        await updateProduct(product!._id, fd, token)
      } else {
        await createProduct(fd, token)
      }
      onSaved()
    } catch (err: any) {
      setError(err.message || 'Failed to save product.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', border: '1px solid #DEDEDE', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const, background: '#fff' }
  const labelStyle = { display: 'block', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6B6B6B', marginBottom: 6 }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
      <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 780, maxHeight: '90vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #DEDEDE', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{isEdit ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Basic info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Product Name *</label>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Reference</label>
              <input style={inputStyle} value={reference} onChange={e => setReference(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Collection</label>
              <input style={inputStyle} value={collection} onChange={e => setCollection(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Price *</label>
              <input style={inputStyle} type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Sale Price (0 = no sale)</label>
              <input style={inputStyle} type="number" min="0" step="0.01" value={sale} onChange={e => setSale(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <input style={inputStyle} value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. T-Shirts" />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select style={inputStyle} value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Select</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>

          {/* Images */}
          <div>
            <label style={{ ...labelStyle, marginBottom: 12 }}>Images {!isEdit && '*'}</label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {/* Existing */}
              {existingImages.map(url => (
                <div key={url} style={{ position: 'relative', width: 80, height: 100 }}>
                  <Image src={url} alt="" fill style={{ objectFit: 'cover' }} sizes="80px" />
                  <button type="button" onClick={() => removeExisting(url)} style={{ position: 'absolute', top: 2, right: 2, background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    <X size={10} />
                  </button>
                </div>
              ))}
              {/* New previews */}
              {newPreviews.map((src, i) => (
                <div key={i} style={{ position: 'relative', width: 80, height: 100 }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeNew(i)} style={{ position: 'absolute', top: 2, right: 2, background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    <X size={10} />
                  </button>
                </div>
              ))}
              {/* Upload btn */}
              <button type="button" onClick={() => fileRef.current?.click()} style={{ width: 80, height: 100, border: '2px dashed #DEDEDE', background: '#F8F8F8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#6B6B6B' }}>
                <Upload size={16} />
                <span style={{ fontSize: 10 }}>Add</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
            </div>
          </div>

          {/* Variations */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={labelStyle}>Color Variations</label>
              <button type="button" onClick={addVariation} style={{ fontSize: 11, color: '#0A4DCC', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={12} /> Add Color
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {variations.map((v, vi) => (
                <div key={vi} style={{ border: '1px solid #DEDEDE', padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="color" value={v.color} onChange={e => updateVariation(vi, 'color', e.target.value)} style={{ width: 32, height: 32, border: '1px solid #DEDEDE', padding: 2, cursor: 'pointer', borderRadius: '50%' }} />
                      <input placeholder="Color name" value={v.name} onChange={e => updateVariation(vi, 'name', e.target.value)} style={{ ...inputStyle, width: 140 }} />
                    </div>
                    {variations.length > 1 && (
                      <button type="button" onClick={() => removeVariation(vi)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Sizes */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-end' }}>
                    {v.sizes.map((s, si) => (
                      <div key={si} style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
                        <div>
                          <p style={{ fontSize: 9, color: '#888', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Size</p>
                          <input value={s.size} onChange={e => updateSize(vi, si, 'size', e.target.value)} placeholder="M" style={{ ...inputStyle, width: 52, textAlign: 'center' }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 9, color: '#888', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Stock</p>
                          <input type="number" min="0" value={s.stock} onChange={e => updateSize(vi, si, 'stock', e.target.value)} style={{ ...inputStyle, width: 64 }} />
                        </div>
                        {v.sizes.length > 1 && (
                          <button type="button" onClick={() => removeSize(vi, si)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#BABABA', paddingBottom: 10 }}>
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addSize(vi)} style={{ background: 'none', border: '1px dashed #DEDEDE', color: '#6B6B6B', padding: '6px 10px', cursor: 'pointer', fontSize: 11, marginBottom: 0, alignSelf: 'flex-end', height: 38 }}>
                      + Size
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p style={{ fontSize: 12, color: '#e53e3e', padding: '10px 14px', background: '#FFF5F5', border: '1px solid #FED7D7' }}>{error}</p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #DEDEDE' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid #DEDEDE', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ padding: '10px 24px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', background: loading ? '#888' : '#000', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
