import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../api/products'
import { getCategories } from '../api/categories'
import { getBrands } from '../api/brands'
import { SlidersHorizontal, X, BookOpen } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-gray-100 rounded-xl" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
    </div>
  )
}

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands]       = useState([])
  const [total, setTotal]         = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading]     = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [filters, setFilters] = useState({
    search:     searchParams.get('search')     || '',
    categoryId: searchParams.get('categoryId') || '',
    brandId:    searchParams.get('brandId')    || '',
    minPrice:   searchParams.get('minPrice')   || '',
    maxPrice:   searchParams.get('maxPrice')   || '',
    sort:       searchParams.get('sort')       || 'relevance',
    page:       parseInt(searchParams.get('page') || '0')
  })

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400)
    return () => clearTimeout(t)
  }, [filters.search])

  useEffect(() => {
    Promise.all([getCategories(), getBrands()])
      .then(([c, b]) => { setCategories(c.data); setBrands(b.data) })
  }, [])

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const params = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (filters.categoryId) params.categoryId = filters.categoryId
    if (filters.brandId)    params.brandId    = filters.brandId
    if (filters.minPrice)   params.minPrice   = filters.minPrice
    if (filters.maxPrice)   params.maxPrice   = filters.maxPrice
    params.sort = filters.sort
    params.page = filters.page
    params.size = 12

    // Sync URL
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => v !== undefined && v !== '' && sp.set(k, v))
    setSearchParams(sp, { replace: true })

    getProducts(params)
      .then(res => {
        setProducts(res.data.content)
        setTotal(res.data.totalElements)
        setTotalPages(res.data.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [debouncedSearch, filters.categoryId, filters.brandId, filters.minPrice, filters.maxPrice, filters.sort, filters.page, setSearchParams])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const setFilter = (key, value) => setFilters(f => ({ ...f, [key]: value, page: 0 }))

  const clearFilters = () => setFilters({
    search: '', categoryId: '', brandId: '', minPrice: '', maxPrice: '', sort: 'relevance', page: 0
  })

  const Sidebar = () => (
    <aside className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search</label>
        <input
          type="text" value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          placeholder="Title or author…"
          className="input"
        />
      </div>
      {/* Categories */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
        <div className="space-y-1.5">
          {categories.map(c => (
            <label key={c.id} className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer hover:text-brand-600 transition-colors">
              <input type="radio" name="category"
                checked={filters.categoryId === String(c.id)}
                onChange={() => setFilter('categoryId', filters.categoryId === String(c.id) ? '' : String(c.id))}
                className="accent-brand-600"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>
      {/* Brands */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Publisher</label>
        <div className="space-y-1.5">
          {brands.map(b => (
            <label key={b.id} className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer hover:text-brand-600 transition-colors">
              <input type="radio" name="brand"
                checked={filters.brandId === String(b.id)}
                onChange={() => setFilter('brandId', filters.brandId === String(b.id) ? '' : String(b.id))}
                className="accent-brand-600"
              />
              {b.name}
            </label>
          ))}
        </div>
      </div>
      {/* Price */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price Range</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice}
            onChange={e => setFilter('minPrice', e.target.value)}
            className="input" style={{ padding: '0.375rem 0.5rem' }} />
          <input type="number" placeholder="Max" value={filters.maxPrice}
            onChange={e => setFilter('maxPrice', e.target.value)}
            className="input" style={{ padding: '0.375rem 0.5rem' }} />
        </div>
      </div>
      <button onClick={clearFilters} className="btn-ghost w-full">
        Clear Filters
      </button>
    </aside>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h1 className="text-xl font-black text-gray-900">Catalogue</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn-ghost gap-1 text-sm py-2 px-3">
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden mb-6 p-5 card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Filters</h3>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <Sidebar />
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-60 flex-shrink-0">
          <div className="card p-5">
            <h2 className="font-black text-gray-900 mb-5">Filters</h2>
            <Sidebar />
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{products.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{total}</span> books
              </p>
            </div>
            <select value={filters.sort} onChange={e => setFilter('sort', e.target.value)}
              className="input" style={{ width: 'auto', paddingTop: '0.375rem', paddingBottom: '0.375rem' }}>
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-violet-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} className="text-brand-400" />
              </div>
              <p className="text-lg font-bold text-gray-700">No books found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <Pagination currentPage={filters.page} totalPages={totalPages}
            onPageChange={p => setFilters(f => ({ ...f, page: p }))} />
        </div>
      </div>
    </div>
  )
}
