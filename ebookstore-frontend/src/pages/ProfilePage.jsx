import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMe, updateMe } from '../api/auth'
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../api/addresses'
import { Gift, Edit2, Check, X, Plus, Trash2, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user: authUser, login, token } = useAuth()
  const [profile, setProfile]     = useState(null)
  const [addresses, setAddresses] = useState([])
  const [editing, setEditing]     = useState(false)
  const [editForm, setEditForm]   = useState({ fullName: '', phone: '' })
  const [showNewAddr, setShowNewAddr] = useState(false)
  const [newAddr, setNewAddr]     = useState({ label: '', street: '', city: '', state: '', zipCode: '', country: '' })
  const [editAddr, setEditAddr]   = useState(null)

  useEffect(() => {
    getMe().then(res => {
      setProfile(res.data)
      setEditForm({ fullName: res.data.fullName, phone: res.data.phone || '' })
    })
    getAddresses().then(res => setAddresses(res.data))
  }, [])

  const handleSaveProfile = async () => {
    try {
      const res = await updateMe(editForm)
      setProfile(res.data)
      login(token, res.data)
      setEditing(false)
      toast.success('Profile updated')
    } catch { toast.error('Failed to update profile') }
  }

  const handleAddAddress = async () => {
    try {
      const res = await addAddress(newAddr)
      setAddresses(prev => [...prev, res.data])
      setNewAddr({ label: '', street: '', city: '', state: '', zipCode: '', country: '' })
      setShowNewAddr(false)
      toast.success('Address added')
    } catch { toast.error('Failed to add address') }
  }

  const handleUpdateAddress = async (id) => {
    try {
      const res = await updateAddress(id, editAddr)
      setAddresses(prev => prev.map(a => a.id === id ? res.data : a))
      setEditAddr(null)
      toast.success('Address updated')
    } catch { toast.error('Failed to update address') }
  }

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return
    try {
      await deleteAddress(id)
      setAddresses(prev => prev.filter(a => a.id !== id))
      toast.success('Address deleted')
    } catch { toast.error('Failed to delete address') }
  }

  const handleSetDefault = async (id) => {
    try {
      const res = await setDefaultAddress(id)
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id ? res.data.isDefault : false })))
    } catch { toast.error('Failed to set default') }
  }

  if (!profile) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Personal Info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
          {!editing && (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:underline">
              <Edit2 size={15} /> Edit
            </button>
          )}
        </div>
        <div className="space-y-3">
          {editing ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                <input value={editForm.fullName} onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
                <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveProfile}
                  className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                  <Check size={14} /> Save
                </button>
                <button onClick={() => setEditing(false)}
                  className="flex items-center gap-1 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                  <X size={14} /> Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400">Name</span><p className="font-medium text-gray-800 mt-0.5">{profile.fullName}</p></div>
              <div><span className="text-gray-400">Email</span><p className="font-medium text-gray-800 mt-0.5">{profile.email}</p></div>
              <div><span className="text-gray-400">Phone</span><p className="font-medium text-gray-800 mt-0.5">{profile.phone || '—'}</p></div>
              <div>
                <span className="text-gray-400">Gift Points</span>
                <p className="mt-0.5">
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 font-bold px-3 py-0.5 rounded-full text-sm">
                    <Gift size={13} /> {profile.giftPoints} pts
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
          <button onClick={() => setShowNewAddr(true)}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:underline">
            <Plus size={15} /> Add New
          </button>
        </div>

        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id} className="border border-gray-200 rounded-xl p-4 relative">
              {editAddr?.id === addr.id ? (
                <div className="space-y-2">
                  {['label','street','city','state','zipCode','country'].map(field => (
                    <input key={field} placeholder={field} value={editAddr[field] || ''}
                      onChange={e => setEditAddr(p => ({ ...p, [field]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
                  ))}
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateAddress(addr.id)}
                      className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm">Save</button>
                    <button onClick={() => setEditAddr(null)}
                      className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{addr.label}
                        {addr.isDefault && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}</p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefault(addr.id)} title="Set as default"
                          className="p-1.5 text-gray-400 hover:text-amber-500"><Star size={14} /></button>
                      )}
                      <button onClick={() => setEditAddr({ ...addr })}
                        className="p-1.5 text-gray-400 hover:text-indigo-600"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {addresses.length === 0 && !showNewAddr && (
            <p className="text-sm text-gray-400 text-center py-4">No addresses saved yet.</p>
          )}

          {showNewAddr && (
            <div className="border border-indigo-200 rounded-xl p-4 space-y-2 bg-indigo-50">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">New Address</h4>
              {[
                ['label','Label (e.g. Home)'],['street','Street'],['city','City'],
                ['state','State'],['zipCode','Zip Code'],['country','Country']
              ].map(([field, placeholder]) => (
                <input key={field} placeholder={placeholder} value={newAddr[field]}
                  onChange={e => setNewAddr(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white" />
              ))}
              <div className="flex gap-2">
                <button onClick={handleAddAddress}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">Save</button>
                <button onClick={() => setShowNewAddr(false)}
                  className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-white">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
