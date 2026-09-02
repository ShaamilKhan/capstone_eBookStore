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
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <CheckCircle size={72} className="mx-auto text-green-500 mb-5" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-1">Order <span className="font-semibold text-gray-800">#{order.id}</span></p>
      <p className="text-gray-400 text-sm mb-8">
        Estimated delivery: <span className="font-medium text-gray-700">{deliveryDate()}</span>
      </p>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left mb-8 space-y-4">
        <div className="space-y-2">
          {order.items?.map(item => (
            <div key={item.id} className="flex justify-between text-sm text-gray-600">
              <span>{item.product.title} ×{item.quantity}</span>
              <span>${parseFloat(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <hr />
        <div className="flex justify-between font-bold text-gray-900">
          <span>Total</span><span>${parseFloat(order.totalAmount).toFixed(2)}</span>
        </div>
        {order.address && (
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Delivery to: </span>
            {order.address.street}, {order.address.city}, {order.address.country}
          </div>
        )}
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Payment: </span>{order.paymentMethod?.replace('_', ' ')}
        </div>
        {order.giftPointsEarned > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-700 font-medium">
            🎁 You earned <span className="font-bold">{order.giftPointsEarned} gift points</span> on this order!
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <Link to="/" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 font-medium">
          Continue Shopping
        </Link>
        <Link to="/orders" className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-medium">
          View My Orders
        </Link>
      </div>
    </div>
  )
}
