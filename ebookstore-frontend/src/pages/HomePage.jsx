import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProducts } from '../api/products'
import { getCategories } from '../api/categories'
import { getRecommendations } from '../api/recommendations'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [featured, setFeatured]           = useState([])
  const [categories, setCategories]       = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading]             = useState(true)

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
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Your Next Book</h1>
          <p className="text-indigo-100 text-lg mb-8">
            Explore thousands of titles across all genres — delivered to your door.
          </p>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors"
          >
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/catalogue?categoryId=${cat.id}`}
              className="relative rounded-xl overflow-hidden h-40 group"
            >
              {cat.imageUrl && (
                <img src={cat.imageUrl} alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                <span className="text-white font-bold text-lg">{cat.name}</span>
                <span className="text-indigo-200 text-sm mt-1">Browse →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Books</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Recommendations */}
      {isAuthenticated && recommendations.length > 0 && (
        <section className="bg-indigo-50 py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended For You</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {recommendations.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
