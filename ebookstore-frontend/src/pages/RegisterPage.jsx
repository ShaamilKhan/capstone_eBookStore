import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import LavalLogo from '../components/LavalLogo'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    try {
      const res = await registerUser({ fullName: form.fullName, email: form.email, password: form.password, phone: form.phone })
      login(res.data.token, { id: res.data.id, fullName: res.data.fullName, email: res.data.email, giftPoints: res.data.giftPoints })
      toast.success('Account created!')
      navigate('/')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden flex-col justify-center items-center p-12 text-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-400/30 blur-3xl" />
        <div className="relative text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-8">
            <LavalLogo size={36} />
          </div>
          <h2 className="text-3xl font-black mb-1">Join Laval Books</h2>
          <p className="text-brand-300 text-xs tracking-widest uppercase mb-3">Valley of Books</p>
          <p className="text-indigo-200 text-base max-w-xs leading-relaxed">
            Create a free account and start exploring 42 hand-picked titles today.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-3 text-left max-w-xs mx-auto">
            {['Free to join', 'Earn gift points on every order', 'Personalised recommendations', 'Cancel orders within 48 hours'].map(f => (
              <div key={f} className="flex items-start gap-2 text-xs text-indigo-200">
                <span className="text-green-400 font-bold mt-0.5">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface overflow-y-auto">
        <div className="w-full max-w-md py-8 page-enter">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center">
              <LavalLogo size={26} />
            </div>
            <div className="leading-tight">
              <span className="font-black text-base gradient-text tracking-tight">Laval Books</span>
              <span className="block text-[9px] text-gray-400 tracking-widest uppercase -mt-0.5">Valley of Books</span>
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-8">Join thousands of readers today — it's free</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name',         name: 'fullName',       type: 'text',     placeholder: 'Jane Doe',          required: true },
              { label: 'Email',             name: 'email',          type: 'email',    placeholder: 'you@example.com',   required: true },
              { label: 'Phone (optional)',  name: 'phone',          type: 'tel',      placeholder: '+1 555 000 0000',   required: false },
            ].map(({ label, name, type, placeholder, required }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <input name={name} type={type} required={required}
                  value={form[name]} onChange={handleChange}
                  placeholder={placeholder} className="input" />
              </div>
            ))}

            {/* Password with toggle */}
            {[
              { label: 'Password',         name: 'password',        placeholder: 'At least 8 characters' },
              { label: 'Confirm Password', name: 'confirmPassword', placeholder: 'Repeat password' },
            ].map(({ label, name, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <div className="relative">
                  <input name={name} type={showPw ? 'text' : 'password'} required
                    value={form[name]} onChange={handleChange}
                    placeholder={placeholder} className="input pr-10" />
                  {name === 'password' && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</span>
                : <span className="flex items-center gap-2">Create Account <ArrowRight size={16} /></span>
              }
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
