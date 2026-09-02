import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, BookOpen, Menu, X, User, ChevronDown, LogOut, Package } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setMobileOpen(false)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <BookOpen size={24} />
            BookStore
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/catalogue" className="text-gray-600 hover:text-indigo-600 transition-colors">Catalogue</Link>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search books or authors…"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 text-sm font-medium"
                >
                  <User size={18} />
                  <span>{user?.fullName?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <Link to="/orders" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Package size={16} /> My Orders
                    </Link>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={16} /> Profile
                    </Link>
                    <hr className="my-1" />
                    <button onClick={() => { setDropdownOpen(false); logout() }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-3 bg-white">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search books…"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-gray-700">Home</Link>
          <Link to="/catalogue" onClick={() => setMobileOpen(false)} className="block text-gray-700">Catalogue</Link>
          <Link to="/cart" onClick={() => setMobileOpen(false)} className="block text-gray-700">Cart ({cartCount})</Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="block text-gray-700">My Orders</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block text-gray-700">Profile</Link>
              <button onClick={() => { setMobileOpen(false); logout() }} className="block text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-gray-700">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-indigo-600 font-medium">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
