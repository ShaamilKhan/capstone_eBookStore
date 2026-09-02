import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Truck, Star } from 'lucide-react'
import { getFeaturedProducts } from '../api/products'
import { getCategories } from '../api/categories'
import { getRecommendations } from '../api/recommendations'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [featured, setFeatured]             = useState([])
  const [categories, setCategories]         = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
    Promise.all([
      getFeaturedProducts(),
      getCategories(),
      isAuthenticated ? getRecommendations() : Promise.resolve({ data: [] })
    ]).then(([feat, cats, recs]) => {
      setFeatured(feat.data)
      setCategories(cats.data)
      setRecommendations(recs.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (loading) return <LoadingSpinner message="Loading…" />

  return (
    <main className="page-enter">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-brand-400/20 blur-3xl" />

        <div className="relative section py-28 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium border border-white/20 mb-6">
            <Zap size={11} className="text-amber-300" /> 2026 Edition — 42 titles across 4 genres
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight tracking-tight">
            Your Next Favourite<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-200">
              Book is Here
            </span>
          </h1>
          <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Browse 42 hand-picked titles across Fiction, Non-Fiction, Science, and Technology — delivered to your door in days.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/catalogue"
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-brand-50 hover:shadow-glow transition-all duration-300">
              Browse Catalogue <ArrowRight size={16} />
            </Link>
            {!isAuthenticated && (
              <Link to="/register"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/25 font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/20 transition-all duration-300">
                Join Free
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 pt-10 border-t border-white/10">
            {[['42', 'Books'], ['4', 'Categories'], ['3', 'Publishers'], ['5★', 'Avg Rating']].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-black text-white">{n}</div>
                <div className="text-xs text-indigo-300 font-medium">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="section py-5">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              [Truck,  'Free shipping over $30',     'text-brand-500'],
              [Shield, 'Secure checkout',             'text-green-500'],
              [Star,   'Top-rated books only',        'text-amber-400'],
              [Zap,    'Instant order confirmation',  'text-violet-500'],
            ].map(([Icon, label, color]) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <Icon size={16} className={color} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Browse by Category</h2>
            <p className="text-gray-500 text-sm mt-1">Find books in the genre you love</p>
          </div>
          <Link to="/catalogue" className="btn-ghost text-sm hidden sm:inline-flex">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/catalogue?categoryId=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden h-44 cursor-pointer"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {cat.imageUrl ? (
                <img src={cat.imageUrl} alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-500 to-violet-600" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold text-base">{cat.name}</p>
                <p className="text-white/60 text-xs mt-0.5 group-hover:text-white/80 transition-colors">
                  Explore →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Books ── */}
      <section className="py-16 bg-gradient-to-b from-white to-surface">
        <div className="section">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Featured Books</h2>
              <p className="text-gray-500 text-sm mt-1">Handpicked titles our readers love</p>
            </div>
            <Link to="/catalogue" className="btn-ghost text-sm hidden sm:inline-flex">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Recommendations ── */}
      {isAuthenticated && recommendations.length > 0 && (
        <section className="py-16">
          <div className="section">
            <div className="mb-8">
              <span className="badge bg-brand-100 text-brand-600 mb-3">Personalised for you</span>
              <h2 className="text-2xl font-black text-gray-900">Recommended For You</h2>
              <p className="text-gray-500 text-sm mt-1">Based on your order history</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {recommendations.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

    </main>
  )
}
