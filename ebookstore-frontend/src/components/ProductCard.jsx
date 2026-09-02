import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import StarRating from './StarRating'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { id, title, author, price, imageUrl, rating, stockQuantity, brandName } = product

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await addToCart(id, 1)
      toast.success(`"${title}" added to cart!`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart')
    }
  }

  return (
    <Link to={`/products/${id}`} className="group block bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      {/* Book cover */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300 text-4xl font-bold">
            {title?.[0]}
          </div>
        )}
        {stockQuantity === 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{brandName}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">{title}</h3>
        <p className="text-xs text-gray-500">{author}</p>
        <StarRating rating={parseFloat(rating)} size="sm" />
        <div className="flex items-center justify-between mt-1">
          <span className="text-indigo-600 font-bold text-base">${parseFloat(price).toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={stockQuantity === 0}
            className="flex items-center gap-1 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart size={13} />
            Add
          </button>
        </div>
      </div>
    </Link>
  )
}
