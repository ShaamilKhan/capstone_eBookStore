import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { placeOrder } from '../api/orders'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { CreditCard, Gift } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart, clearCartLocal } = useCart()
  const { user } = useAuth()
  const addressId = location.state?.addressId

  const [method, setMethod]     = useState('CREDIT_CARD')
  const [cardForm, setCardForm] = useState({ cardNumber: '', cardExpiry: '', cardCvv: '', holderName: '' })
  const [placing, setPlacing]   = useState(false)

  const giftPoints  = user?.giftPoints || 0
  const subtotal    = parseFloat(cart?.total || 0)
  const maxDiscount = Math.min(giftPoints * 0.01, subtotal * 0.20)
  const finalTotal  = method === 'GIFT_POINTS'
    ? Math.max(0, subtotal - maxDiscount)
    : subtotal

  const handlePlace = async () => {
    if (!addressId) {
      toast.error('No address selected — go back to checkout and select an address.')
      return
    }
    if (!cart || cart.items?.length === 0) {
      toast.error('Your cart is empty.')
      return
    }
    setPlacing(true)
    try {
      const payload = {
        addressId,
        paymentMethod: method,
        useGiftPoints: method === 'GIFT_POINTS',
        ...(method !== 'GIFT_POINTS' && {
          cardNumber: cardForm.cardNumber,
          cardExpiry: cardForm.cardExpiry,
          cardCvv:    cardForm.cardCvv
        })
      }
      const res = await placeOrder(payload)
      clearCartLocal()
      toast.success('Order placed successfully!')
      navigate(`/order-confirmation/${res.data.id}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  const items = cart?.items || []

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 page-enter">
      <h1 className="text-2xl font-black text-gray-900 mb-2">Payment</h1>
      <p className="text-gray-500 text-sm mb-8">Choose your payment method and place your order</p>

      {!addressId && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-800 text-sm">
          ⚠️ No address selected. Please go back to{' '}
          <a href="/checkout" className="underline font-semibold">Checkout</a> and select a delivery address.
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Payment method */}
        <div className="flex-1 space-y-5">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
            {[
              { id: 'CREDIT_CARD', label: 'Credit Card' },
              { id: 'DEBIT_CARD',  label: 'Debit Card'  },
              { id: 'GIFT_POINTS', label: `Gift Points (${giftPoints} pts)` }
            ].map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  method === m.id
                    ? 'bg-white shadow-sm text-brand-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {m.label}
              </button>
            ))}
          </div>

          {(method === 'CREDIT_CARD' || method === 'DEBIT_CARD') && (
            <div className="card p-6 space-y-4 hover:translate-y-0">
              <div className="flex items-center gap-2 text-gray-700 font-bold mb-1">
                <CreditCard size={18} className="text-brand-500" /> Card Details
              </div>
              <p className="text-gray-500 text-sm">Enter your card information securely</p>
              {[
                { key: 'holderName',  label: 'Cardholder Name', placeholder: 'John Doe'             },
                { key: 'cardNumber',  label: 'Card Number',      placeholder: '1234 5678 9012 3456'  },
                { key: 'cardExpiry',  label: 'Expiry (MM/YY)',   placeholder: '12/26'                },
                { key: 'cardCvv',     label: 'CVV',              placeholder: '***'                  }
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  <input
                    value={cardForm[key]}
                    onChange={e => setCardForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="input"
                  />
                </div>
              ))}
            </div>
          )}

          {method === 'GIFT_POINTS' && (
            <div className="card p-6 space-y-3 hover:translate-y-0">
              <div className="flex items-center gap-2 text-amber-600 font-bold">
                <Gift size={18} /> Gift Points Balance
              </div>
              <p className="text-gray-500 text-sm">Redeem your earned points as a discount</p>
              <p className="text-3xl font-black text-gray-900">{giftPoints} <span className="text-lg font-normal text-gray-400">pts</span></p>
              <p className="text-sm text-gray-500">100 pts = $1.00 discount</p>
              {giftPoints === 0 ? (
                <p className="text-sm text-red-500">You have no gift points to use.</p>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                  Max discount on this order: <span className="font-bold">${maxDiscount.toFixed(2)}</span>
                  {' '}(20% of ${subtotal.toFixed(2)})
                </div>
              )}
            </div>
          )}

          <button
            onClick={handlePlace}
            disabled={placing || (method === 'GIFT_POINTS' && giftPoints === 0)}
            className="btn-primary w-full py-3 text-base"
          >
            {placing ? 'Placing Order…' : `Place Order — $${finalTotal.toFixed(2)}`}
          </button>
        </div>

        {/* Order summary sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="card p-5 sticky top-24 hover:translate-y-0">
            <h3 className="font-black text-gray-900 mb-1">Order Summary</h3>
            <p className="text-gray-500 text-sm mb-4">Your items</p>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span className="line-clamp-1 flex-1 mr-2">{item.product.title} ×{item.quantity}</span>
                  <span>${parseFloat(item.itemTotal).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className="border-gray-100 my-2" />
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Subtotal</span>
              <span>${parseFloat(cart?.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Shipping</span>
              <span>{parseFloat(cart?.shipping || 0) === 0 ? 'FREE' : `$${parseFloat(cart?.shipping || 0).toFixed(2)}`}</span>
            </div>
            {method === 'GIFT_POINTS' && maxDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600 mb-1">
                <span>Gift Points Discount</span>
                <span>-${maxDiscount.toFixed(2)}</span>
              </div>
            )}
            <hr className="border-gray-100 my-2" />
            <div className="flex justify-between font-black text-gray-900">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
