/**
 * LavalLogo — "Valley of Books"
 * The mark is a valley (V-shape mountain silhouette) with an open book rising from the centre.
 * Used in Navbar, Footer, Login, Register.
 */
export default function LavalLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Laval Books logo"
    >
      {/* Valley / mountain silhouette — two peaks dipping to a valley at centre */}
      <path
        d="M2 34 L10 16 L18 28 L20 24 L22 28 L30 16 L38 34 Z"
        fill="white"
        fillOpacity="0.18"
      />
      {/* Valley floor highlight */}
      <path
        d="M14 34 L20 22 L26 34 Z"
        fill="white"
        fillOpacity="0.10"
      />
      {/* Open book — left page */}
      <path
        d="M20 30 L12 27 L12 18 Q16 19.5 20 22 Z"
        fill="white"
        fillOpacity="0.95"
      />
      {/* Open book — right page */}
      <path
        d="M20 30 L28 27 L28 18 Q24 19.5 20 22 Z"
        fill="white"
        fillOpacity="0.75"
      />
      {/* Book spine */}
      <line x1="20" y1="22" x2="20" y2="30" stroke="white" strokeWidth="1.2" strokeOpacity="0.9" />
      {/* Left page lines */}
      <line x1="13.5" y1="21.5" x2="18.5" y2="23.5" stroke="white" strokeWidth="0.7" strokeOpacity="0.4" />
      <line x1="13.5" y1="23.5" x2="18.5" y2="25.5" stroke="white" strokeWidth="0.7" strokeOpacity="0.4" />
      {/* Right page lines */}
      <line x1="26.5" y1="21.5" x2="21.5" y2="23.5" stroke="white" strokeWidth="0.7" strokeOpacity="0.4" />
      <line x1="26.5" y1="23.5" x2="21.5" y2="25.5" stroke="white" strokeWidth="0.7" strokeOpacity="0.4" />
    </svg>
  )
}
