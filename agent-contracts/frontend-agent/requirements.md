# Frontend Agent — Requirements

**Agent Role:** Frontend Engineer  
**Assigned by:** Orchestrator Agent  
**Contract received from:** Backend Agent — `openapi.yaml` + DTO shapes  

---

## Mission

Build a modern, responsive React frontend for Laval Books. You must consume the backend API strictly through the published OpenAPI contract. Do not assume any endpoint shape — use `openapi.yaml` as the single source of truth.

---

## Tech Stack (Non-Negotiable)

| Requirement | Specification |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | TailwindCSS 3 |
| HTTP client | Axios |
| Routing | React Router v6 |
| Notifications | react-hot-toast |
| Icons | lucide-react |
| Port | 5173 (bound to 127.0.0.1) |

---

## API Contract Consumed (from Backend Agent)

All API calls must use `baseURL: '/api'` via Axios. Vite proxy forwards `/api/*` to `http://127.0.0.1:8080`.

### Auth endpoints used
```
POST /api/auth/register  → RegisterRequest  → AuthResponse
POST /api/auth/login     → LoginRequest     → AuthResponse
GET  /api/auth/me        → (token)          → UserProfileResponse
PUT  /api/auth/me        → UpdateProfileRequest → UserProfileResponse
```

### Product endpoints used
```
GET /api/products          → ProductPageResponse  (content[], totalElements, totalPages)
GET /api/products/featured → ProductSummaryResponse[]
GET /api/products/:id      → ProductDetailResponse
GET /api/products/:id/related → ProductSummaryResponse[]
```

### Cart, Orders, Addresses
```
GET/POST/PUT/DELETE /api/cart        → CartResponse
POST /api/orders                     → OrderDetailResponse
GET  /api/orders                     → PageResponse<OrderSummaryResponse>
GET  /api/orders/:id                 → OrderDetailResponse
PUT  /api/orders/:id/cancel          → OrderDetailResponse
GET/POST/PUT/DELETE /api/addresses   → AddressResponse
PUT  /api/addresses/:id/default      → AddressResponse
```

### Other
```
GET  /api/recommendations            → ProductSummaryResponse[]
GET  /api/reviews/product/:id        → ReviewResponse[]
POST /api/reviews                    → ReviewResponse
```

---

## DTO Field Reference (from Backend Agent)

### AuthResponse
```json
{ "token": "string", "id": 1, "email": "string", "fullName": "string", "giftPoints": 0 }
```

### ProductSummaryResponse
```json
{ "id": 1, "title": "string", "author": "string", "price": "19.99",
  "imageUrl": "string", "rating": "4.50", "categoryName": "string",
  "brandName": "string", "stockQuantity": 50 }
```

### CartResponse
```json
{ "items": [CartItemResponse], "itemCount": 2,
  "subtotal": "39.98", "shipping": "0.00", "total": "39.98" }
```

### OrderSummaryResponse
```json
{ "id": 1, "status": "CONFIRMED", "totalAmount": "29.99",
  "placedAt": "2026-01-01T10:00:00", "itemCount": 2,
  "paymentMethod": "CREDIT_CARD", "paymentStatus": "PAID" }
```

---

## Pages Required (11)

| Route | Page | Auth required |
|---|---|---|
| `/` | HomePage | No |
| `/catalogue` | CataloguePage | No |
| `/products/:id` | ProductDetailPage | No |
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |
| `/cart` | CartPage | Yes |
| `/checkout` | CheckoutPage | Yes |
| `/payment` | PaymentPage | Yes |
| `/order-confirmation/:id` | OrderConfirmationPage | Yes |
| `/orders` | OrderHistoryPage | Yes |
| `/profile` | ProfilePage | Yes |

---

## Global State Required

### AuthContext
- Store JWT token in `localStorage`
- Re-validate token with `GET /api/auth/me` on app load
- Expose: `user`, `token`, `isAuthenticated`, `login()`, `logout()`

### CartContext
- Fetch cart on login, clear on logout
- Expose: `cart`, `cartCount`, `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCartLocal()`

---

## Design Requirements

- Modern 2026 aesthetic — gradients, glassmorphism, smooth animations
- Mobile-responsive (hamburger menu on mobile)
- Toast notifications bottom-right (do not block navbar)
- Loading states on all async operations
- Empty states for cart, orders, no search results
- Brand name: **Laval Books** (Valley of Books)

---

## Contract Published to Orchestrator

On completion, report:
- All 11 pages implemented and wired to API
- `vite build` — 0 errors
- UI verified against all 9 screens in capstone spec (slide 12)
