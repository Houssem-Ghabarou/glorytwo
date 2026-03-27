'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getProducts } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/types'
import { Search, X, SlidersHorizontal } from 'lucide-react'

/* ─────────────────────────────────────────────
   Filter group — used in sidebar
───────────────────────────────────────────── */
function FilterGroup({
  label, options, value, onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  if (options.length === 0) return null
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B6B6B', margin: '0 0 12px', fontWeight: 600 }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button
          onClick={() => onChange('')}
          style={{
            textAlign: 'left', border: 'none', cursor: 'pointer',
            padding: '7px 10px', fontSize: 12, fontFamily: 'inherit',
            color: !value ? '#000' : '#6B6B6B',
            fontWeight: !value ? 600 : 400,
            background: !value ? '#EBEBEB' : 'transparent',
            transition: 'all .15s',
          } as React.CSSProperties}
        >
          All
        </button>
        {options.map(o => (
          <button
            key={o}
            onClick={() => onChange(value === o ? '' : o)}
            style={{
              textAlign: 'left', border: 'none', cursor: 'pointer',
              padding: '7px 10px', fontSize: 12, fontFamily: 'inherit',
              color: value === o ? '#000' : '#6B6B6B',
              fontWeight: value === o ? 600 : 400,
              background: value === o ? '#EBEBEB' : 'transparent',
              transition: 'all .15s',
            } as React.CSSProperties}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main shop content
───────────────────────────────────────────── */
function ShopContent() {
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [collection, setCollection] = useState(searchParams.get('collection') || '')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let r = products
    if (search) r = r.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (category) r = r.filter(p => p.category === category)
    if (gender) r = r.filter(p => p.gender === gender)
    if (collection) r = r.filter(p => p.collection === collection)
    return r
  }, [products, search, category, gender, collection])

  const categories   = useMemo(() => [...new Set(products.map(p => p.category).filter(Boolean))] as string[], [products])
  const genders      = useMemo(() => [...new Set(products.map(p => p.gender).filter(Boolean))] as string[], [products])
  const collections  = useMemo(() => [...new Set(products.map(p => p.collection).filter(Boolean))] as string[], [products])

  const hasFilters = !!(search || category || gender || collection)
  const clearAll   = () => { setSearch(''); setCategory(''); setGender(''); setCollection('') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', maxWidth: 1440, margin: '0 auto' }}>

      {/* ══ LEFT SIDEBAR — sticky filters ══ */}
      <aside
        className="shop-sidebar"
        style={{
          width: 220,
          flexShrink: 0,
          borderRight: '1px solid #DEDEDE',
          padding: '32px 24px',
          position: 'sticky',
          top: 68,           /* header height */
          height: 'calc(100vh - 68px)',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Sidebar title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', margin: 0 }}>
            Filter
          </p>
          {hasFilters && (
            <button
              onClick={clearAll}
              style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0A4DCC', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
            >
              Clear
            </button>
          )}
        </div>

        <FilterGroup label="Collection" options={collections} value={collection} onChange={setCollection} />
        <FilterGroup label="Category"   options={categories}  value={category}   onChange={setCategory} />
        <FilterGroup label="Gender"     options={genders}     value={gender}     onChange={setGender} />

        {/* Active chips at bottom of sidebar */}
        {hasFilters && (
          <div style={{ marginTop: 8, paddingTop: 20, borderTop: '1px solid #DEDEDE', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B6B6B', margin: '0 0 6px' }}>Active</p>
            {[
              collection && { label: collection,  clear: () => setCollection('') },
              category   && { label: category,    clear: () => setCategory('') },
              gender     && { label: gender,      clear: () => setGender('') },
              search     && { label: `"${search}"`, clear: () => setSearch('') },
            ].filter(Boolean).map((f: any) => (
              <span
                key={f.label}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, padding: '4px 8px', background: '#000', color: '#fff' }}
              >
                {f.label}
                <button onClick={f.clear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', padding: 0, marginLeft: 6 }}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Page title bar */}
        <div style={{ padding: '20px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <h1 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Shop</h1>
            {!loading && (
              <span style={{ fontSize: 11, color: '#6B6B6B' }}>— {filtered.length} products</span>
            )}
          </div>
        </div>

        {/* Mobile sticky filter bar — hidden on desktop */}
        <div className="mobile-filter-bar" style={{
          position: 'sticky', top: 88,
          zIndex: 50,
          background: '#F2F2F2',
          borderBottom: '1px solid #DEDEDE',
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {hasFilters ? (
            <button
              onClick={clearAll}
              style={{
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#0A4DCC', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', padding: 0, textDecoration: 'underline',
              }}
            >
              Reset
            </button>
          ) : (
            <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
              {loading ? '' : `${filtered.length} products`}
            </span>
          )}
          <button
            onClick={() => setFilterSheetOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: hasFilters ? '#000' : 'none',
              color: hasFilters ? '#fff' : '#000',
              border: '1px solid #000',
              padding: '7px 14px',
              fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
              fontFamily: 'inherit', cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={13} strokeWidth={1.5} />
            Filter
            {hasFilters && (
              <span style={{
                background: '#fff', color: '#000',
                borderRadius: '50%', width: 16, height: 16,
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {[collection, category, gender, search].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* ── Search bar — big, close to grid ── */}
        <div style={{ padding: '16px 28px 20px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6B6B6B', pointerEvents: 'none' }}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                paddingLeft: 46,
                paddingRight: search ? 44 : 16,
                paddingTop: 14,
                paddingBottom: 14,
                fontSize: 14,
                fontFamily: 'inherit',
                border: '1px solid #DEDEDE',
                background: '#fff',
                outline: 'none',
                transition: 'border-color .2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#000')}
              onBlur={e => (e.target.style.borderColor = '#DEDEDE')}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B',
                  display: 'flex', padding: 2,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── Product grid ── */}
        <div style={{ padding: '0 28px 80px', flex: 1 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 1, background: '#F0F0F0' }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ background: '#F2F2F2', padding: 14 }}>
                  <div style={{ aspectRatio: '3/4', background: '#E8E8E8' }} className="sk" />
                  <div style={{ height: 10, background: '#E8E8E8', marginTop: 10, width: '60%' }} className="sk" />
                  <div style={{ height: 10, background: '#E8E8E8', marginTop: 6,  width: '30%' }} className="sk" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B6B' }}>
              <p style={{ fontSize: 13, marginBottom: 16 }}>No products found.</p>
              {hasFilters && (
                <button onClick={clearAll} style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#000', fontFamily: 'inherit' }}>
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 1, background: '#F0F0F0' }}>
              {filtered.map(p => (
                <div key={p._id} style={{ background: '#F2F2F2', padding: 14 }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ MOBILE FILTER BOTTOM SHEET ══ */}
      {/* Backdrop */}
      <div
        onClick={() => setFilterSheetOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.4)',
          opacity: filterSheetOpen ? 1 : 0,
          pointerEvents: filterSheetOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 401,
        background: '#F2F2F2',
        borderTop: '1px solid #DEDEDE',
        borderRadius: '16px 16px 0 0',
        padding: '0 24px 40px',
        maxHeight: '80dvh',
        overflowY: 'auto',
        transform: filterSheetOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
      }}>
        {/* Sheet handle + header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 0 24px',
          position: 'sticky', top: 0, background: '#F2F2F2', zIndex: 1,
          borderBottom: '1px solid #DEDEDE', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', margin: 0 }}>
              Filter
            </p>
            {hasFilters && (
              <button
                onClick={clearAll}
                style={{
                  fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#0A4DCC', background: 'none', border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit', padding: 0,
                }}
              >
                Reset all
              </button>
            )}
          </div>
          <button
            onClick={() => setFilterSheetOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
          >
            <X size={18} strokeWidth={1.4} />
          </button>
        </div>

        <FilterGroup label="Collection" options={collections} value={collection} onChange={setCollection} />
        <FilterGroup label="Category"   options={categories}  value={category}   onChange={setCategory} />
        <FilterGroup label="Gender"     options={genders}     value={gender}     onChange={setGender} />

        {/* Apply button */}
        <button
          onClick={() => setFilterSheetOpen(false)}
          style={{
            width: '100%', background: '#000', color: '#fff',
            border: 'none', padding: '14px 0',
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            fontFamily: 'inherit', cursor: 'pointer', marginTop: 8,
          }}
        >
          {hasFilters ? `Show ${filtered.length} results` : 'Done'}
        </button>
      </div>

      <style>{`
        .sk { animation: sk 1.5s ease-in-out infinite; }
        @keyframes sk { 0%,100%{opacity:1} 50%{opacity:.4} }
        .mobile-filter-bar { display: none; }
        @media (max-width: 768px) {
          .shop-sidebar { display: none; }
          .mobile-filter-bar { display: flex; }
        }
      `}</style>
    </div>
  )
}

export default function ShopPage() {
  return <Suspense><ShopContent /></Suspense>
}
