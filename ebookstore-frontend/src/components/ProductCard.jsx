import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { id, title, author, price, imageUrl, rating, stockQuantity } = product

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await addToCart(id, 1)
      toast.success(`"${title}" added!`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart')
    }
  }

  const stars = Math.round(parseFloat(rating) || 0)

  return (
    <Link to={`/products/${id}`} className="group card flex flex-col overflow-hidden">
      {/* Cover */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-brand-50 to-violet-50 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl} alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-300 text-4xl font-black select-none">
            {title?.[0]}
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {stockQuantity === 0 && (
          <span className="absolute top-2 left-2 badge bg-red-500/90 text-white backdrop-blur-sm">
            Out of Stock
          </span>
        )}
        {stockQuantity > 0 && stockQuantity <= 5 && (
          <span className="absolute top-2 left-2 badge bg-amber-400/90 text-white backdrop-blur-sm">
            Only {stockQuantity} left
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-1">{author}</p>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(n => (
            <Star key={n} size={11}
              className={n <= stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
            />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">{parseFloat(rating).toFixed(1)}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-bold text-brand-600 text-base">${parseFloat(price).toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={stockQuantity === 0}
            className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-violet-600 text-white text-xs px-3 py-1.5 rounded-lg
                       hover:shadow-md hover:-translate-y-0.5 active:translate-y-0
                       disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            <ShoppingCart size={12} />
            Add
          </button>
        </div>
      </div>
    </Link>
  )
}
