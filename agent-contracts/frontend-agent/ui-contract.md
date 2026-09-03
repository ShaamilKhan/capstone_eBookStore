# Frontend Agent — UI Contract

**Produced by:** Frontend Agent  
**Consumed by:** Orchestrator (for verification)  
**Based on contract from:** Backend Agent (`openapi.yaml` + DTO shapes)

---

## Page → API Mapping

| Page | API calls made |
|---|---|
| `HomePage` | `GET /api/products/featured`, `GET /api/categories`, `GET /api/recommendations` (if logged in) |
| `CataloguePage` | `GET /api/products` (with filters), `GET /api/categories`, `GET /api/brands` |
| `ProductDetailPage` | `GET /api/products/:id`, `GET /api/products/:id/related`, `GET /api/reviews/product/:id` |
| `CartPage` | reads CartContext (already fetched) |
| `CheckoutPage` | `GET /api/addresses`, `POST /api/addresses` |
| `PaymentPage` | `POST /api/orders` |
| `OrderConfirmationPage` | `GET /api/orders/:id` |
| `OrderHistoryPage` | `GET /api/orders`, `GET /api/orders/:id`, `PUT /api/orders/:id/cancel` |
| `ProfilePage` | `GET /api/auth/me`, `PUT /api/auth/me`, `GET /api/addresses`, `POST/PUT/DELETE /api/addresses/:id` |
| `LoginPage` | `POST /api/auth/login` |
| `RegisterPage` | `POST /api/auth/register` |

---

## DTO Field Usage

### ProductSummaryResponse → ProductCard component
```
product.id          → Link href /products/:id
product.title       → h3 text
product.author      → p text
product.price       → formatted as $XX.XX
product.imageUrl    → img src
product.rating      → star rating display
product.stockQuantity → out-of-stock / low-stock badge
```

### CartResponse → CartPage + CartContext
```
cart.items[]        → line items list
cart.itemCount      → Navbar badge count
cart.subtotal       → summary subtotal row
cart.shipping       → summary shipping row (FREE if 0)
cart.total          → summary total row
```

### OrderSummaryResponse → OrderHistoryPage
```
order.id            → "#Order 123" heading
order.status        → coloured status badge (PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED)
order.totalAmount   → formatted price
order.placedAt      → formatted date
order.itemCount     → "2 items" text
```

### AuthResponse → AuthContext (stored in localStorage)
```
token       → localStorage 'token' → Axios Authorization header
id          → user.id
fullName    → Navbar display name + avatar initial
email       → dropdown display
giftPoints  → PaymentPage gift points display, ProfilePage badge
```

---

## State Management

### JWT Token lifecycle
```
Login/Register → res.data.token → localStorage.setItem('token')
                                → AuthContext.login(token, user)

App load       → localStorage.getItem('token')
               → GET /api/auth/me to re-validate
               → on 401: clear localStorage, setIsAuthenticated(false)

Logout         → localStorage.removeItem('token')
               → window.location.href = '/login'

Any 401 from API → axiosInstance interceptor clears localStorage → redirect /login
```

### Cart sync
```
isAuthenticated=true  → fetchCart() → GET /api/cart
isAuthenticated=false → cart=null, cartCount=0
addToCart()           → POST /api/cart → fetchCart()
removeFromCart()      → DELETE /api/cart/:id → fetchCart()
updateQuantity()      → PUT /api/cart/:id → fetchCart()
clearCartLocal()      → sets cart=null locally (called after order placed)
```

---

## Routing Structure

```
/                          → HomePage             (public)
/catalogue                 → CataloguePage         (public)
/products/:id              → ProductDetailPage      (public)
/login                     → LoginPage             (public)
/register                  → RegisterPage          (public)

<ProtectedRoute>           → redirects to /login if not authenticated
  /cart                    → CartPage
  /checkout                → CheckoutPage
  /payment                 → PaymentPage
  /order-confirmation/:id  → OrderConfirmationPage
  /orders                  → OrderHistoryPage
  /profile                 → ProfilePage
</ProtectedRoute>

*                          → redirect to /
```
