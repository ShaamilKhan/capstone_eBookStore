export default function LoadingSpinner({ message = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 rounded-full animate-spin"
        style={{ background: 'conic-gradient(from 0deg, #4f46e5, #7c3aed, #c7d2fe, #4f46e5)', WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))', mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))' }}
      />
      {message && <p className="text-gray-500 text-sm">{message}</p>}
    </div>
  )
}
