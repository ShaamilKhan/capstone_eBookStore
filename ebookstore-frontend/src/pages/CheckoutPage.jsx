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
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
            step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > i + 1 ? <Check size={14} /> : i + 1}
          </div>
          <span className={`hidden sm:block ml-2 text-sm font-medium mr-4 ${step === i + 1 ? 'text-indigo-600' : 'text-gray-400'}`}>{label}</span>
          {i < 2 && <div className="w-12 h-0.5 bg-gray-200 mr-4" />}
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      <Progress />

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h2>
          {addresses.map(addr => (
            <label key={addr.id} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
              selectedAddr === addr.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input type="radio" name="address" checked={selectedAddr === addr.id}
                onChange={() => setSelectedAddr(addr.id)} className="mt-1" />
              <div>
                <p className="font-medium text-gray-800">{addr.label}</p>
                <p className="text-sm text-gray-500">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}</p>
              </div>
            </label>
          ))}

          {!showNewAddr ? (
            <button onClick={() => setShowNewAddr(true)}
              className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:underline">
              <Plus size={16} /> Add New Address
            </button>
          ) : (
            <div className="border border-gray-200 rounded-xl p-5 space-y-3">
              <h3 className="font-medium text-gray-800">New Address</h3>
              {[
                ['label', 'Label (e.g. Home)'], ['street', 'Street'], ['city', 'City'],
                ['state', 'State'], ['zipCode', 'Zip Code'], ['country', 'Country']
              ].map(([field, placeholder]) => (
                <input key={field} placeholder={placeholder} value={newAddr[field]}
                  onChange={e => setNewAddr(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              ))}
              <div className="flex gap-2">
                <button onClick={handleSaveAddress} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">Save</button>
                <button onClick={() => setShowNewAddr(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
              </div>
            </div>
          )}

          <button onClick={() => selectedAddr ? setStep(2) : toast.error('Please select an address')}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 mt-4">
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Review Order</h2>
          <div className="space-y-3 mb-6">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-100">
                <span className="text-gray-700">{item.product.title} × {item.quantity}</span>
                <span className="font-medium">${parseFloat(item.itemTotal).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-gray-900 pt-2">
              <span>Total</span>
              <span>${parseFloat(cart.total).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50">Back</button>
            <button onClick={() => navigate('/payment', { state: { addressId: selectedAddr } })}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700">
              Continue to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
