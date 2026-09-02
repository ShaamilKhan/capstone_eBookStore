import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, User, ChevronDown, LogOut, Package, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import LavalLogo from './LavalLogo'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch]           = useState('')

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setMobileOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="section">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center shadow-md">
              <LavalLogo size={28} />
            </div>
            <div className="leading-tight">
              <span className="font-black text-base gradient-text tracking-tight">Laval Books</span>
              <span className="hidden sm:block text-[9px] text-gray-400 font-medium tracking-widest uppercase -mt-0.5">Valley of Books</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg font-medium transition-all">Home</Link>
            <Link to="/catalogue" className="px-3 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg font-medium transition-all">Catalogue</Link>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search books or authors…"
              className="input pl-9 py-2 text-sm"
            />
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/cart" className="relative p-2.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-brand-500 to-violet-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 w-[18px] h-[18px] flex items-center justify-center shadow">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl hover:bg-brand-50 text-gray-700 hover:text-brand-600 transition-all text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.fullName?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate">{user?.fullName?.split(' ')[0]}</span>
                  <ChevronDown size={13} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-card-hover py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                    </div>
                    <Link to="/orders" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-all">
                      <Package size={15} /> My Orders
                    </Link>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-all">
                      <User size={15} /> Profile
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => { setDropdownOpen(false); logout() }}
                      className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost py-2 text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-2 text-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-gray-600 hover:bg-brand-50 rounded-xl transition-all" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm px-4 py-4 space-y-2 animate-fade-in">
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch}
              placeholder="Search books…" className="input pl-9 py-2 text-sm" />
          </div>
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl font-medium text-sm transition-all">Home</Link>
          <Link to="/catalogue" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl font-medium text-sm transition-all">Catalogue</Link>
          <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl font-medium text-sm transition-all">
            Cart {cartCount > 0 && <span className="badge bg-brand-100 text-brand-600">{cartCount}</span>}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-brand-50 rounded-xl font-medium text-sm transition-all">My Orders</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-brand-50 rounded-xl font-medium text-sm transition-all">Profile</Link>
              <button onClick={() => { setMobileOpen(false); logout() }} className="flex items-center gap-2 w-full px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-medium text-sm transition-all">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost flex-1 justify-center text-sm py-2">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center text-sm py-2">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
