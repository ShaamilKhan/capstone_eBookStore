import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  if (loading) return <LoadingSpinner message="Loading cart…" />

  const items = cart?.items || []

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Browse our catalogue and add some books!</p>
        <Link to="/catalogue" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700">
          Browse Books
        </Link>
      </div>
    )
  }

  const handleQuantity = async (itemId, qty) => {
    try { await updateQuantity(itemId, qty) }
    catch (err) { toast.error(err?.response?.data?.message || 'Update failed') }
  }

  const handleRemove = async (itemId) => {
    try { await removeFromCart(itemId) }
    catch { toast.error('Failed to remove item') }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
              <Link to={`/products/${item.product.id}`}>
                <div className="w-20 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.product.imageUrl
                    ? <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl font-bold">{item.product.title?.[0]}</div>
                  }
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product.id}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-1">{item.product.title}</h3>
                </Link>
                <p className="text-sm text-gray-500">{item.product.author}</p>
                <p className="text-sm font-medium text-indigo-600 mt-1">${parseFloat(item.product.price).toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden text-sm">
                    <button onClick={() => handleQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                      className="px-2 py-1 hover:bg-gray-100 disabled:opacity-40">−</button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button onClick={() => handleQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100">+</button>
                  </div>
                  <button onClick={() => handleRemove(item.id)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">${parseFloat(item.itemTotal).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3 sticky top-24">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${parseFloat(cart.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className={cart.shipping === 0 || cart.shipping === '0' || parseFloat(cart.shipping) === 0 ? 'text-green-600 font-medium' : ''}>
                {parseFloat(cart.shipping) === 0 ? 'FREE' : `$${parseFloat(cart.shipping).toFixed(2)}`}
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>${parseFloat(cart.total).toFixed(2)}</span>
            </div>
            <button onClick={() => navigate('/checkout')}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors mt-4">
              Proceed to Checkout
            </button>
            <Link to="/catalogue" className="block text-center text-sm text-indigo-600 hover:underline mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
