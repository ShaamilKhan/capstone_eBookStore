import { Link } from 'react-router-dom'
import { Mail, Phone, Clock, Heart } from 'lucide-react'
import LavalLogo from './LavalLogo'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      {/* Top gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-30" />

      <div className="section py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center">
                <LavalLogo size={28} />
              </div>
              <div className="leading-tight">
                <span className="font-black text-white text-base tracking-tight">Laval Books</span>
                <span className="block text-[9px] text-brand-400 font-medium tracking-widest uppercase -mt-0.5">Valley of Books</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Your destination for the best books across all genres. Discover, read, and grow with every page.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[['/', 'Home'], ['/catalogue', 'Catalogue'], ['/cart', 'Cart'], ['/orders', 'My Orders'], ['/profile', 'Profile']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-500 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-gray-500">
                <Mail size={14} className="text-brand-500 flex-shrink-0" />
                support@bookstore.com
              </li>
              <li className="flex items-center gap-2.5 text-gray-500">
                <Phone size={14} className="text-brand-500 flex-shrink-0" />
                +1 (800) 123-4567
              </li>
              <li className="flex items-center gap-2.5 text-gray-500">
                <Clock size={14} className="text-brand-500 flex-shrink-0" />
                Mon–Fri: 9am – 6pm
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} BookStore. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Made with <Heart size={11} className="text-brand-500" /> for Laval Books · IBM BOB
          </p>
        </div>
      </div>
    </footer>
  )
}
