import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../api/products'
import { getCategories } from '../api/categories'
import { getBrands } from '../api/brands'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
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
        <label className="block text-sm font-semibold text-gray-700 mb-1">Search</label>
        <input
          type="text" value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          placeholder="Title or author…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {/* Categories */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <div className="space-y-1">
          {categories.map(c => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="radio" name="category"
                checked={filters.categoryId === String(c.id)}
                onChange={() => setFilter('categoryId', filters.categoryId === String(c.id) ? '' : String(c.id))}
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>
      {/* Brands */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Publisher</label>
        <div className="space-y-1">
          {brands.map(b => (
            <label key={b.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="radio" name="brand"
                checked={filters.brandId === String(b.id)}
                onChange={() => setFilter('brandId', filters.brandId === String(b.id) ? '' : String(b.id))}
              />
              {b.name}
            </label>
          ))}
        </div>
      </div>
      {/* Price */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice}
            onChange={e => setFilter('minPrice', e.target.value)}
            className="w-1/2 border border-gray-300 rounded-lg px-2 py-1.5 text-sm" />
          <input type="number" placeholder="Max" value={filters.maxPrice}
            onChange={e => setFilter('maxPrice', e.target.value)}
            className="w-1/2 border border-gray-300 rounded-lg px-2 py-1.5 text-sm" />
        </div>
      </div>
      <button onClick={clearFilters}
        className="w-full text-sm text-indigo-600 border border-indigo-300 rounded-lg py-2 hover:bg-indigo-50 transition-colors">
        Clear Filters
      </button>
    </aside>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h1 className="text-xl font-bold text-gray-900">Catalogue</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700">
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={() => setSidebarOpen(false)}><X size={18} /></button>
          </div>
          <Sidebar />
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-60 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{products.length}</span> of{' '}
              <span className="font-medium text-gray-900">{total}</span> books
            </p>
            <select value={filters.sort} onChange={e => setFilter('sort', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
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
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">No books found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
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
