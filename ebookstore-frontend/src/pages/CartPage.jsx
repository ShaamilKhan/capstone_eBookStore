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
      <div className="max-w-7xl mx-auto px-4 py-24 text-center page-enter">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-100 to-violet-100 flex items-center justify-center mx-auto mb-5">
          <ShoppingBag size={40} className="text-brand-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-7">Browse our catalogue and add some books!</p>
        <Link to="/catalogue" className="btn-primary">
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
    <div className="max-w-7xl mx-auto px-4 py-10 page-enter">
      <h1 className="text-2xl font-black text-gray-900 mb-2">Shopping Cart</h1>
      <p className="text-gray-500 text-sm mb-8">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card flex gap-4 p-4 hover:translate-y-0">
              <Link to={`/products/${item.product.id}`}>
                <div className="w-20 h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                  {item.product.imageUrl
                    ? <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl font-bold">{item.product.title?.[0]}</div>
                  }
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product.id}`}>
                  <h3 className="font-bold text-gray-900 hover:text-brand-600 line-clamp-1">{item.product.title}</h3>
                </Link>
                <p className="text-sm text-gray-500">{item.product.author}</p>
                <p className="text-sm font-semibold gradient-text mt-1">${parseFloat(item.product.price).toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden text-sm bg-white shadow-sm">
                    <button onClick={() => handleQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                      className="px-2.5 py-1.5 hover:bg-gray-50 disabled:opacity-40 font-medium">−</button>
                    <span className="px-3 py-1.5 border-x border-gray-200 font-medium">{item.quantity}</span>
                    <button onClick={() => handleQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-gray-50 font-medium">+</button>
                  </div>
                  <button onClick={() => handleRemove(item.id)} className="text-red-400 hover:text-red-600 p-1 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-gray-900">${parseFloat(item.itemTotal).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="card p-6 space-y-3 sticky top-24 hover:translate-y-0">
            <h3 className="font-black text-gray-900 text-lg mb-1">Order Summary</h3>
            <p className="text-gray-500 text-sm mb-3">Review your items before checkout</p>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${parseFloat(cart.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className={cart.shipping === 0 || cart.shipping === '0' || parseFloat(cart.shipping) === 0 ? 'text-green-600 font-semibold' : ''}>
                {parseFloat(cart.shipping) === 0 ? 'FREE' : `$${parseFloat(cart.shipping).toFixed(2)}`}
              </span>
            </div>
            <hr className="border-gray-100 my-2" />
            <div className="flex justify-between font-black text-gray-900">
              <span>Total</span>
              <span>${parseFloat(cart.total).toFixed(2)}</span>
            </div>
            <button onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-3 mt-2">
              Proceed to Checkout
            </button>
            <Link to="/catalogue" className="block text-center text-sm text-brand-600 hover:underline mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
