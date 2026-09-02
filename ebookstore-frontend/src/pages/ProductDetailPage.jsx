import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById, getRelatedProducts } from '../api/products'
import { getProductReviews, createReview } from '../api/reviews'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { Truck, ShoppingCart, Package } from 'lucide-react'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct]     = useState(null)
  const [related, setRelated]     = useState([])
  const [reviews, setReviews]     = useState([])
  const [activeTab, setActiveTab] = useState('description')
  const [quantity, setQuantity]   = useState(1)
  const [adding, setAdding]       = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getProductById(id),
      getRelatedProducts(id),
      getProductReviews(id)
    ]).then(([p, rel, rev]) => {
      setProduct(p.data)
      setRelated(rel.data)
      setReviews(rev.data)
    }).finally(() => setLoading(false))
  }, [id])

  const deliveryDate = () => {
    if (!product) return ''
    const d = new Date()
    d.setDate(d.getDate() + product.estimatedDeliveryDays)
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const handleAddToCart = async () => {
    setAdding(true)
    try {
      await addToCart(product.id, quantity)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setSubmittingReview(true)
    try {
      const res = await createReview({ productId: product.id, ...reviewForm })
      setReviews(prev => [res.data, ...prev])
      toast.success('Review submitted!')
      setReviewForm({ rating: 5, comment: '' })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading product…" />
  if (!product) return <div className="text-center py-20 text-gray-400">Product not found</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 page-enter">
      {/* Product detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
        {/* Image */}
        <div className="flex items-start justify-center">
          <div className="w-full max-w-xs rounded-2xl overflow-hidden shadow-card border border-gray-100 aspect-[3/4]">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-50 to-violet-100 flex items-center justify-center text-brand-300 text-6xl font-black">
                {product.title?.[0]}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {product.categoryName && (
            <span className="badge bg-brand-100 text-brand-700">
              {product.categoryName}
            </span>
          )}
          <h1 className="text-3xl font-black text-gray-900">{product.title}</h1>
          <p className="text-lg text-gray-500">by {product.author}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {product.brand?.name && <span>Publisher: <span className="text-gray-600">{product.brand.name}</span></span>}
            {product.isbn && <span>ISBN: <span className="text-gray-600">{product.isbn}</span></span>}
            {product.pages && <span>Pages: <span className="text-gray-600">{product.pages}</span></span>}
            {product.language && <span>Language: <span className="text-gray-600">{product.language}</span></span>}
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={parseFloat(product.rating)} size="md" showValue />
            <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
          </div>

          <p className="text-3xl font-black gradient-text">${parseFloat(product.price).toFixed(2)}</p>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Truck size={16} className="text-brand-400" />
            <span>Estimated delivery: <span className="font-medium text-gray-700">{deliveryDate()}</span></span>
          </div>

          {product.stockQuantity > 0 ? (
            <p className="text-green-600 text-sm font-semibold flex items-center gap-1">
              <Package size={14} /> In Stock ({product.stockQuantity} left)
            </p>
          ) : (
            <p className="text-red-500 text-sm font-semibold">Out of Stock</p>
          )}

          {/* Quantity stepper */}
          {product.stockQuantity > 0 && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Qty:</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 font-medium">−</button>
                <span className="px-4 py-1.5 text-sm font-semibold border-x border-gray-200">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 font-medium">+</button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0 || adding}
            className="btn-primary w-full py-3 text-base"
          >
            <ShoppingCart size={18} />
            {adding ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          {['description', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors capitalize ${
                activeTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab} {tab === 'reviews' && `(${reviews.length})`}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'description' ? (
        <p className="text-gray-600 leading-relaxed max-w-3xl">{product.description || 'No description available.'}</p>
      ) : (
        <div className="max-w-2xl space-y-6">
          {isAuthenticated && (
            <form onSubmit={handleReviewSubmit} className="card p-5 space-y-3 hover:translate-y-0">
              <h3 className="font-bold text-gray-800">Write a Review</h3>
              <p className="text-gray-500 text-sm mt-0.5">Share your thoughts with other readers</p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Rating:</label>
                <select value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}
                  className="input" style={{ width: 'auto' }}>
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
                </select>
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                placeholder="Share your thoughts…"
                rows={3}
                className="input resize-none"
              />
              <button type="submit" disabled={submittingReview} className="btn-primary">
                {submittingReview ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          )}
          {reviews.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mx-auto mb-3">
                <span className="text-amber-400 text-xl">★</span>
              </div>
              <p className="text-gray-500 font-medium">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-1">Be the first to review this book!</p>
            </div>
          ) : reviews.map(r => (
            <div key={r.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold text-gray-800 text-sm">{r.fullName}</span>
                <StarRating rating={r.rating} size="sm" />
              </div>
              <p className="text-gray-600 text-sm">{r.comment}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-black text-gray-900 mb-1">Related Books</h2>
          <p className="text-gray-500 text-sm mb-5">You might also enjoy these titles</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
