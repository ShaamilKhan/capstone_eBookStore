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

  if (!profile) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 rounded-full animate-spin"
        style={{ background: 'conic-gradient(from 0deg, #4f46e5, #7c3aed, #c7d2fe, #4f46e5)', WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))', mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))' }}
      />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 page-enter">
      {/* Personal Info */}
      <div className="card p-6 hover:translate-y-0">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-black text-gray-900">Personal Information</h2>
          {!editing && (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-sm text-brand-600 font-semibold hover:underline">
              <Edit2 size={15} /> Edit
            </button>
          )}
        </div>
        <p className="text-gray-500 text-sm mb-5">Manage your account details</p>
        <div className="space-y-3">
          {editing ? (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Full Name</label>
                <input value={editForm.fullName} onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))}
                  className="input" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Phone</label>
                <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  className="input" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveProfile} className="btn-primary">
                  <Check size={14} /> Save
                </button>
                <button onClick={() => setEditing(false)} className="btn-ghost">
                  <X size={14} /> Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">Name</span><p className="font-semibold text-gray-800 mt-1">{profile.fullName}</p></div>
              <div><span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">Email</span><p className="font-semibold text-gray-800 mt-1">{profile.email}</p></div>
              <div><span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">Phone</span><p className="font-semibold text-gray-800 mt-1">{profile.phone || '—'}</p></div>
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wide font-semibold">Gift Points</span>
                <p className="mt-1">
                  <span className="badge bg-amber-100 text-amber-700">
                    <Gift size={12} /> {profile.giftPoints} pts
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Addresses */}
      <div className="card p-6 hover:translate-y-0">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-black text-gray-900">Saved Addresses</h2>
          <button onClick={() => setShowNewAddr(true)}
            className="flex items-center gap-1 text-sm text-brand-600 font-semibold hover:underline">
            <Plus size={15} /> Add New
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-5">Your delivery destinations</p>

        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id} className="border border-gray-100 rounded-2xl p-4 relative bg-surface/50">
              {editAddr?.id === addr.id ? (
                <div className="space-y-2">
                  {['label','street','city','state','zipCode','country'].map(field => (
                    <input key={field} placeholder={field} value={editAddr[field] || ''}
                      onChange={e => setEditAddr(p => ({ ...p, [field]: e.target.value }))}
                      className="input" />
                  ))}
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateAddress(addr.id)} className="btn-primary">Save</button>
                    <button onClick={() => setEditAddr(null)} className="btn-ghost">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{addr.label}
                        {addr.isDefault && <span className="ml-2 badge bg-green-100 text-green-700">Default</span>}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}</p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefault(addr.id)} title="Set as default"
                          className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors"><Star size={14} /></button>
                      )}
                      <button onClick={() => setEditAddr({ ...addr })}
                        className="p-1.5 text-gray-400 hover:text-brand-600 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {addresses.length === 0 && !showNewAddr && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-violet-100 flex items-center justify-center mx-auto mb-3">
                <Plus size={20} className="text-brand-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No addresses saved yet.</p>
              <p className="text-xs text-gray-400 mt-0.5">Add an address to get started</p>
            </div>
          )}

          {showNewAddr && (
            <div className="border border-brand-200 rounded-2xl p-4 space-y-2 bg-brand-50">
              <h4 className="text-sm font-bold text-gray-800 mb-2">New Address</h4>
              {[
                ['label','Label (e.g. Home)'],['street','Street'],['city','City'],
                ['state','State'],['zipCode','Zip Code'],['country','Country']
              ].map(([field, placeholder]) => (
                <input key={field} placeholder={placeholder} value={newAddr[field]}
                  onChange={e => setNewAddr(p => ({ ...p, [field]: e.target.value }))}
                  className="input" />
              ))}
              <div className="flex gap-2 pt-1">
                <button onClick={handleAddAddress} className="btn-primary">Save</button>
                <button onClick={() => setShowNewAddr(false)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
