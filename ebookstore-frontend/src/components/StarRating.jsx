import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, size = 'md', showValue = false }) {
  const sizeMap = { sm: 14, md: 16, lg: 20 }
  const px = sizeMap[size] || 16
  const stars = []

  for (let i = 1; i <= 5; i++) {
    const fill = i <= Math.floor(rating) ? 'full'
               : i === Math.ceil(rating) && rating % 1 >= 0.5 ? 'half'
               : 'empty'
    stars.push(
      <span key={i} className="relative inline-block" style={{ width: px, height: px }}>
        <Star size={px} className="text-gray-300" fill="currentColor" />
        {fill !== 'empty' && (
          <span
            className="absolute inset-0 overflow-hidden text-amber-400"
            style={{ width: fill === 'full' ? '100%' : '50%' }}
          >
            <Star size={px} fill="currentColor" />
          </span>
        )}
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1">
      {stars}
      {showValue && <span className="text-sm text-gray-500 ml-1">{Number(rating).toFixed(1)}</span>}
    </span>
  )
}
