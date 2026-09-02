import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAddresses, addAddress } from '../api/addresses'
import { useCart } from '../context/CartContext'
import { Check, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart } = useCart()
  const [step, setStep]             = useState(1)
  const [addresses, setAddresses]   = useState([])
  const [selectedAddr, setSelectedAddr] = useState(null)
  const [showNewAddr, setShowNewAddr] = useState(false)
  const [newAddr, setNewAddr]       = useState({ label: '', street: '', city: '', state: '', zipCode: '', country: '' })

  useEffect(() => {
    getAddresses().then(res => {
      setAddresses(res.data)
      const def = res.data.find(a => a.isDefault) || res.data[0]
      if (def) setSelectedAddr(def.id)
    })
  }, [])

  const handleSaveAddress = async () => {
    try {
      const res = await addAddress(newAddr)
      setAddresses(prev => [...prev, res.data])
      setSelectedAddr(res.data.id)
      setShowNewAddr(false)
      toast.success('Address added')
    } catch { toast.error('Failed to save address') }
  }

  const items = cart?.items || []

  const Progress = () => (
    <div className="flex items-center justify-center gap-0 mb-10">
      {['Address', 'Review', 'Payment'].map((label, i) => (
        <div key={label} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
            step > i + 1 ? 'bg-green-500 text-white shadow-sm' : step === i + 1 ? 'bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-glow' : 'bg-gray-100 text-gray-400'
          }`}>
            {step > i + 1 ? <Check size={14} /> : i + 1}
          </div>
          <span className={`hidden sm:block ml-2 text-sm font-semibold mr-4 ${step === i + 1 ? 'text-brand-600' : 'text-gray-400'}`}>{label}</span>
          {i < 2 && <div className={`w-12 h-0.5 mr-4 ${step > i + 1 ? 'bg-green-300' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 page-enter">
      <h1 className="text-2xl font-black text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-500 text-sm mb-6">Complete your order in a few easy steps</p>
      <Progress />

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Delivery Address</h2>
          <p className="text-gray-500 text-sm mb-4">Choose where to send your books</p>
          {addresses.map(addr => (
            <label key={addr.id} className={`flex items-start gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
              selectedAddr === addr.id ? 'border-brand-500 bg-brand-50 shadow-sm' : 'border-gray-200 hover:border-brand-200'
            }`}>
              <input type="radio" name="address" checked={selectedAddr === addr.id}
                onChange={() => setSelectedAddr(addr.id)} className="mt-1 accent-brand-600" />
              <div>
                <p className="font-semibold text-gray-800">{addr.label}</p>
                <p className="text-sm text-gray-500">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}</p>
              </div>
            </label>
          ))}

          {!showNewAddr ? (
            <button onClick={() => setShowNewAddr(true)}
              className="flex items-center gap-2 text-brand-600 text-sm font-semibold hover:underline">
              <Plus size={16} /> Add New Address
            </button>
          ) : (
            <div className="card p-5 space-y-3 hover:translate-y-0">
              <h3 className="font-bold text-gray-800">New Address</h3>
              {[
                ['label', 'Label (e.g. Home)'], ['street', 'Street'], ['city', 'City'],
                ['state', 'State'], ['zipCode', 'Zip Code'], ['country', 'Country']
              ].map(([field, placeholder]) => (
                <input key={field} placeholder={placeholder} value={newAddr[field]}
                  onChange={e => setNewAddr(p => ({ ...p, [field]: e.target.value }))}
                  className="input" />
              ))}
              <div className="flex gap-2">
                <button onClick={handleSaveAddress} className="btn-primary">Save</button>
                <button onClick={() => setShowNewAddr(false)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          <button onClick={() => selectedAddr ? setStep(2) : toast.error('Please select an address')}
            className="btn-primary w-full py-3 mt-4">
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Review Order</h2>
          <p className="text-gray-500 text-sm mb-4">Confirm your items before payment</p>
          <div className="card p-5 hover:translate-y-0 mb-6">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{item.product.title} × {item.quantity}</span>
                <span className="font-semibold">${parseFloat(item.itemTotal).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-black text-gray-900 pt-3 mt-1">
              <span>Total</span>
              <span>${parseFloat(cart.total).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-ghost flex-1 py-3">Back</button>
            <button onClick={() => navigate('/payment', { state: { addressId: selectedAddr } })}
              className="btn-primary flex-1 py-3">
              Continue to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
