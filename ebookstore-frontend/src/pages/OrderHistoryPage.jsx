import { useState, useEffect } from 'react'
import { getOrders, cancelOrder, getOrderById } from '../api/orders'
import { useCart } from '../context/CartContext'
import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED:   'bg-brand-100 text-brand-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700'
}

export default function OrderHistoryPage() {
  const { addToCart } = useCart()
  const [orders, setOrders]         = useState([])
  const [page, setPage]             = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading]       = useState(true)
  const [expanded, setExpanded]     = useState({})
  const [details, setDetails]       = useState({})

  const fetchOrders = (p = 0) => {
    setLoading(true)
    getOrders({ page: p, size: 10 }).then(res => {
      setOrders(res.data.content)
      setTotalPages(res.data.totalPages)
    }).catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders(page) }, [page])

  const toggleExpand = async (orderId) => {
    const isOpen = expanded[orderId]
    setExpanded(e => ({ ...e, [orderId]: !isOpen }))
    if (!isOpen && !details[orderId]) {
      try {
        const res = await getOrderById(orderId)
        setDetails(d => ({ ...d, [orderId]: res.data }))
      } catch {
        toast.error('Failed to load order details')
      }
    }
  }

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    try {
      await cancelOrder(orderId)
      toast.success('Order cancelled')
      setDetails(d => ({ ...d, [orderId]: undefined }))
      fetchOrders(page)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cannot cancel order')
    }
  }

  const handleBuyAgain = async (items) => {
    try {
      for (const item of items) {
        await addToCart(item.product.id, item.quantity)
      }
      toast.success('Items added to cart!')
    } catch {
      toast.error('Some items could not be added')
    }
  }

  const isCancellable = (order) => {
    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') return false
    const diff = (Date.now() - new Date(order.placedAt).getTime()) / (1000 * 60 * 60)
    return diff < 48
  }

  if (loading) return <LoadingSpinner message="Loading orders…" />

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 page-enter">
      <h1 className="text-2xl font-black text-gray-900 mb-1">My Orders</h1>
      <p className="text-gray-500 text-sm mb-6">Track and manage your purchases</p>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-100 to-violet-100 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={40} className="text-brand-400" />
          </div>
          <p className="text-gray-700 text-lg font-bold">No orders yet.</p>
          <p className="text-gray-400 text-sm mt-1">Start shopping to see your orders here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isOpen   = !!expanded[order.id]
            const detail   = details[order.id]

            return (
              <div key={order.id} className="card overflow-hidden">
                {/* Header row */}
                <div className="flex items-center justify-between p-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-black text-gray-900">Order #{order.id}</span>
                      <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.placedAt).toLocaleDateString()} ·{' '}
                      {order.itemCount} item{order.itemCount !== 1 ? 's' : ''} ·{' '}
                      <span className="font-semibold text-gray-700">${parseFloat(order.totalAmount).toFixed(2)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="text-gray-400 hover:text-brand-600 p-1 transition-colors"
                  >
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-surface/50">
                    {!detail ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        {detail.items?.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-sm text-gray-600 py-1 border-b border-gray-100 last:border-0">
                            <span className="flex-1 mr-4">{item.product.title} ×{item.quantity}</span>
                            <span className="font-semibold">${parseFloat(item.subtotal).toFixed(2)}</span>
                          </div>
                        ))}
                        {detail.address && (
                          <p className="text-xs text-gray-400 mt-1">
                            Delivered to: {detail.address.street}, {detail.address.city}
                          </p>
                        )}
                        <div className="flex gap-2 pt-2 flex-wrap">
                          <button
                            onClick={() => handleBuyAgain(detail.items)}
                            className="btn-primary text-sm py-2"
                          >
                            Buy Again
                          </button>
                          {isCancellable(order) && (
                            <button
                              onClick={() => handleCancel(order.id)}
                              className="border border-red-200 text-red-600 text-sm px-4 py-2 rounded-xl hover:bg-red-50 font-semibold transition-colors"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={p => setPage(p)} />
    </div>
  )
}
