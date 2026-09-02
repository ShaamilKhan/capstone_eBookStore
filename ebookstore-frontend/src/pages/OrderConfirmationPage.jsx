import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '../api/orders'
import { CheckCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrderById(orderId).then(res => setOrder(res.data)).finally(() => setLoading(false))
  }, [orderId])

  if (loading) return <LoadingSpinner message="Loading order…" />
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found</div>

  const deliveryDate = () => {
    const d = new Date(order.placedAt)
    const days = order.items?.[0]?.product?.estimatedDeliveryDays || 5
    d.setDate(d.getDate() + days)
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center page-enter">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center mx-auto mb-5">
        <CheckCircle size={44} className="text-green-500" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-1">Order <span className="font-bold text-gray-800">#{order.id}</span></p>
      <p className="text-gray-400 text-sm mb-8">
        Estimated delivery: <span className="font-semibold text-gray-700">{deliveryDate()}</span>
      </p>

      {/* Summary */}
      <div className="card p-6 text-left mb-8 space-y-4 hover:translate-y-0">
        <h3 className="font-black text-gray-900 mb-2">Order Receipt</h3>
        <div className="space-y-2">
          {order.items?.map(item => (
            <div key={item.id} className="flex justify-between text-sm text-gray-600">
              <span>{item.product.title} ×{item.quantity}</span>
              <span>${parseFloat(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between font-black text-gray-900">
          <span>Total</span><span>${parseFloat(order.totalAmount).toFixed(2)}</span>
        </div>
        {order.address && (
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Delivery to: </span>
            {order.address.street}, {order.address.city}, {order.address.country}
          </div>
        )}
        <div className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">Payment: </span>{order.paymentMethod?.replace('_', ' ')}
        </div>
        {order.giftPointsEarned > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 font-medium">
            🎁 You earned <span className="font-black">{order.giftPointsEarned} gift points</span> on this order!
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <Link to="/" className="btn-ghost">
          Continue Shopping
        </Link>
        <Link to="/orders" className="btn-primary">
          View My Orders
        </Link>
      </div>
    </div>
  )
}
