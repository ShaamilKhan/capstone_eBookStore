# E-Bookstore Capstone — IBM BOB Complete Prompt Guide

## How to Use This Guide

1. Open IBM BOB (or AWS Kiro) and start a new session
2. Run each prompt **in order** — Prompt 1 → 2 → 3 → 4
3. If BOB stops mid-output, follow up with:
   > "Continue from where you stopped, starting at [last file name you saw]"
4. Save each generated file into your project folder before moving to the next prompt
5. After all 4 prompts, follow the **Final Setup Steps** at the bottom

---

## Prompt 1 — Backend (Spring Boot + PostgreSQL)

> Paste this entire block into IBM BOB as your first message.

```
You are a senior Java backend engineer. Generate a complete Spring Boot 3.x backend 
for an E-Bookstore application. Generate every file completely — do not truncate.

---

## PROJECT SETUP

Group: com.ebookstore
Artifact: ebookstore-backend
Java: 17
Build: Maven
Port: 8080

---

## pom.xml dependencies to include:
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-validation
- postgresql (runtime)
- flyway-core
- flyway-database-postgresql
- lombok
- jjwt-api 0.12.3
- jjwt-impl 0.12.3
- jjwt-jackson 0.12.3
- springdoc-openapi-starter-webmvc-ui 2.3.0
- spring-boot-starter-test (test scope)

---

## application.properties

spring.application.name=ebookstore
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/ebookstore
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

jwt.secret=ebookstore_super_secret_jwt_key_2024_capstone_project
jwt.expiration=86400000

springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html

---

## DATABASE MIGRATIONS

### V1__init_schema.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    gift_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50),
    street VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500)
);

CREATE TABLE brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(500)
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150),
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    category_id BIGINT REFERENCES categories(id),
    brand_id BIGINT REFERENCES brands(id),
    image_url VARCHAR(500),
    isbn VARCHAR(20) UNIQUE,
    pages INTEGER,
    language VARCHAR(50) DEFAULT 'English',
    rating NUMERIC(3,2) DEFAULT 0,
    estimated_delivery_days INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    address_id BIGINT REFERENCES addresses(id),
    status VARCHAR(50) DEFAULT 'PENDING',
    total_amount NUMERIC(10,2),
    gift_points_used INTEGER DEFAULT 0,
    gift_points_earned INTEGER DEFAULT 0,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    placed_at TIMESTAMP DEFAULT NOW(),
    cancelled_at TIMESTAMP
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

### V2__seed_data.sql
INSERT INTO categories (name, description, image_url) VALUES
('Fiction', 'Novels, short stories, and imaginative literature', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'),
('Non-Fiction', 'Biographies, history, and true stories', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400'),
('Science', 'Physics, biology, chemistry, and scientific exploration', 'https://images.unsplash.com/photo-1532094349884-543559c79b20?w=400'),
('Technology', 'Programming, AI, software engineering, and tech', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400');

INSERT INTO brands (name, logo_url) VALUES
('Penguin Random House', 'https://via.placeholder.com/100x50?text=PRH'),
('HarperCollins', 'https://via.placeholder.com/100x50?text=HC'),
('O''Reilly Media', 'https://via.placeholder.com/100x50?text=OReilly');

INSERT INTO products (title, author, description, price, stock_quantity, category_id, brand_id, isbn, pages, rating, estimated_delivery_days) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of wealth, love, and the American Dream in the 1920s.', 12.99, 50, 1, 1, '978-0-7432-7356-5', 180, 4.5, 3),
('To Kill a Mockingbird', 'Harper Lee', 'A powerful story of racial injustice and moral growth in the American South.', 14.99, 45, 1, 1, '978-0-06-112008-4', 281, 4.8, 4),
('1984', 'George Orwell', 'A dystopian novel about totalitarianism, surveillance, and freedom.', 11.99, 60, 1, 2, '978-0-452-28423-4', 328, 4.7, 3),
('Brave New World', 'Aldous Huxley', 'A futuristic society where people are controlled through pleasure and conditioning.', 13.49, 40, 1, 2, '978-0-06-092987-0', 311, 4.3, 5),
('Sapiens', 'Yuval Noah Harari', 'A brief history of humankind from the Stone Age to the modern era.', 18.99, 70, 2, 1, '978-0-06-231609-7', 443, 4.6, 4),
('Educated', 'Tara Westover', 'A memoir about growing up in a survivalist family and pursuing education.', 16.99, 35, 2, 2, '978-0-399-59050-4', 352, 4.7, 3),
('A Brief History of Time', 'Stephen Hawking', 'An exploration of cosmology and the universe for general readers.', 15.99, 55, 3, 1, '978-0-553-38016-3', 212, 4.8, 5),
('The Selfish Gene', 'Richard Dawkins', 'A landmark work on evolutionary biology and gene-centred view of evolution.', 14.49, 42, 3, 2, '978-0-19-929114-4', 360, 4.5, 4),
('Clean Code', 'Robert C. Martin', 'A handbook of agile software craftsmanship and best coding practices.', 39.99, 80, 4, 3, '978-0-13-235088-4', 464, 4.7, 3),
('The Pragmatic Programmer', 'David Thomas & Andrew Hunt', 'Your journey to mastery in software development.', 44.99, 65, 4, 3, '978-0-13-595705-9', 352, 4.8, 4),
('Designing Data-Intensive Applications', 'Martin Kleppmann', 'The big ideas behind reliable, scalable, and maintainable systems.', 49.99, 55, 4, 3, '978-1-4493-7332-0', 616, 4.9, 5),
('You Don''t Know JS', 'Kyle Simpson', 'A deep dive into the core mechanisms of the JavaScript language.', 34.99, 90, 4, 3, '978-1-4919-0415-2', 278, 4.6, 3);

---

## JAVA PACKAGE STRUCTURE

Generate all files for: com.ebookstore

### Entities (use Lombok @Data, @Builder, @NoArgsConstructor, @AllArgsConstructor)

1. User.java — maps to users table, include @OneToMany for addresses, orders, cartItems
2. Address.java — maps to addresses table
3. Category.java — maps to categories table
4. Brand.java — maps to brands table
5. Product.java — maps to products table, @ManyToOne to Category and Brand
6. CartItem.java — maps to cart_items table, @ManyToOne to User and Product
7. Order.java — maps to orders table, @ManyToOne to User and Address, @OneToMany to OrderItem
8. OrderItem.java — maps to order_items table
9. Review.java — maps to reviews table

### DTOs (records or classes — never expose entity directly)

Auth:
- RegisterRequest (fullName, email, password, phone)
- LoginRequest (email, password)
- AuthResponse (token, id, fullName, email, giftPoints)
- UserProfileResponse (id, fullName, email, phone, giftPoints, createdAt)
- UpdateProfileRequest (fullName, phone)

Product:
- ProductSummaryResponse (id, title, author, price, imageUrl, rating, categoryName, brandName, stockQuantity)
- ProductDetailResponse (all fields including description, isbn, pages, language, estimatedDeliveryDays, reviewCount)
- ProductPageResponse (content: List<ProductSummaryResponse>, totalElements, totalPages, currentPage)

Cart:
- CartItemResponse (id, product: ProductSummaryResponse, quantity, itemTotal)
- CartResponse (items: List<CartItemResponse>, subtotal, shipping, total, itemCount)
- AddToCartRequest (productId, quantity)
- UpdateCartItemRequest (quantity)

Order:
- PlaceOrderRequest (addressId, paymentMethod, useGiftPoints, cardNumber, cardExpiry, cardCvv)
- OrderSummaryResponse (id, status, totalAmount, placedAt, itemCount, paymentMethod, paymentStatus)
- OrderDetailResponse (id, status, totalAmount, placedAt, cancelledAt, paymentMethod, paymentStatus,
  giftPointsUsed, giftPointsEarned, address: AddressResponse, items: List<OrderItemResponse>)
- OrderItemResponse (id, product: ProductSummaryResponse, quantity, unitPrice, subtotal)

Address:
- AddressRequest (label, street, city, state, zipCode, country, isDefault)
- AddressResponse (id, label, street, city, state, zipCode, country, isDefault)

Review:
- CreateReviewRequest (productId, rating, comment)
- ReviewResponse (id, userId, fullName, rating, comment, createdAt)

Common:
- PageResponse<T> (content, totalElements, totalPages, currentPage, pageSize)
- ErrorResponse (timestamp, status, error, message, path)

### Security classes

1. UserDetailsServiceImpl.java — loads user by email from UserRepository
2. JwtUtil.java — generateToken(UserDetails), extractUsername(token), isTokenValid(token, UserDetails),
   extractExpiration(token). Use HS256 with the jwt.secret from properties.
3. JwtAuthenticationFilter.java — extends OncePerRequestFilter, reads Bearer token from Authorization header,
   validates and sets authentication in SecurityContext
4. SecurityConfig.java:
   - Disable CSRF
   - Stateless session
   - Permit: GET /api/products/**, GET /api/categories/**, GET /api/brands/**,
             GET /api/reviews/product/**, POST /api/auth/**, /swagger-ui/**, /v3/api-docs/**
   - Authenticate all other requests
   - Add JwtAuthenticationFilter before UsernamePasswordAuthenticationFilter
   - BCryptPasswordEncoder bean
   - AuthenticationManager bean
   - CORS: allow http://localhost:5173

### Repositories (JpaRepository + custom queries)

1. UserRepository — findByEmail(String email): Optional<User>
2. ProductRepository:
   - findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author, Pageable): Page<Product>
   - findByCategoryIdAndBrandIdAndPriceBetween(Long catId, Long brandId, BigDecimal min, BigDecimal max, Pageable): Page<Product>
   - findTop8ByOrderByRatingDesc(): List<Product>
   - findTop4ByCategoryIdAndIdNot(Long categoryId, Long excludeId): List<Product>
   - findAll(Specification<Product> spec, Pageable pageable): Page<Product>
3. CartItemRepository — findByUserId(Long userId): List<CartItem>, findByUserIdAndProductId(Long, Long): Optional<CartItem>
4. OrderRepository — findByUserIdOrderByPlacedAtDesc(Long userId, Pageable): Page<Order>
5. OrderItemRepository — findByOrderId(Long orderId): List<OrderItem>
6. ReviewRepository — findByProductIdOrderByCreatedAtDesc(Long productId): List<Review>, countByProductId(Long): int
7. AddressRepository — findByUserId(Long userId): List<Address>

### Services

1. AuthService:
   - register(RegisterRequest): AuthResponse — hash password, save user, generate JWT
   - login(LoginRequest): AuthResponse — validate credentials, generate JWT
   - getCurrentUser(String email): UserProfileResponse
   - updateProfile(String email, UpdateProfileRequest): UserProfileResponse

2. ProductService:
   - getProducts(Long categoryId, Long brandId, String search, BigDecimal minPrice, BigDecimal maxPrice, String sort, int page, int size): ProductPageResponse
     Use Spring Data JPA Specification to build dynamic query
   - getProductById(Long id): ProductDetailResponse
   - getRelatedProducts(Long id): List<ProductSummaryResponse>
   - getFeaturedProducts(): List<ProductSummaryResponse>

3. CartService:
   - getCart(Long userId): CartResponse
     Shipping: free if subtotal >= 30, else $4.99
   - addItem(Long userId, AddToCartRequest): CartResponse
   - updateItem(Long userId, Long cartItemId, UpdateCartItemRequest): CartResponse
   - removeItem(Long userId, Long cartItemId): CartResponse
   - clearCart(Long userId): void

4. OrderService:
   - placeOrder(Long userId, PlaceOrderRequest): OrderDetailResponse
     Steps: validate address, calculate total, apply gift points if requested
     (100 points = $1, max use = 20% of order total), deduct stock, earn points (1 per $1),
     save order + items, clear cart, update user gift points
   - getOrders(Long userId, int page, int size): PageResponse<OrderSummaryResponse>
   - getOrderById(Long userId, Long orderId): OrderDetailResponse
   - cancelOrder(Long userId, Long orderId): OrderDetailResponse
     Validate: order belongs to user, placed_at > now - 48hrs, status is PENDING or CONFIRMED
     On cancel: restore stock, refund gift points used, set status CANCELLED, set cancelled_at

5. AddressService: CRUD operations, setDefault (unsets others first)

6. RecommendationService:
   - getRecommendations(Long userId): List<ProductSummaryResponse>
     Logic: get top 2 categories from user's order history → fetch top-rated products in those
     categories that user has NOT ordered before → return up to 6 results

7. ReviewService:
   - createReview(Long userId, CreateReviewRequest): ReviewResponse
     After saving, recalculate and update product.rating = avg of all reviews
   - getProductReviews(Long productId): List<ReviewResponse>

### Controllers (annotate with @RestController, @RequestMapping, @RequiredArgsConstructor)
Use @PreAuthorize("isAuthenticated()") or SecurityContext to get current user email.

1. AuthController — /api/auth
2. CategoryController — /api/categories
3. BrandController — /api/brands
4. ProductController — /api/products
5. CartController — /api/cart
6. OrderController — /api/orders
7. AddressController — /api/addresses
8. RecommendationController — /api/recommendations
9. ReviewController — /api/reviews

### GlobalExceptionHandler (@RestControllerAdvice)
Handle:
- ResourceNotFoundException (404) — throw when entity not found
- BadRequestException (400)
- UnauthorizedException (401)
- AccessDeniedException (403)
- MethodArgumentNotValidException (400) — from @Valid
- Generic Exception (500)

All return ErrorResponse format: { timestamp, status, error, message, path }

---

Generate every single Java file completely. Do not truncate. Do not use placeholder comments.
Write real, working, production-quality code for every method.
```

---

## Prompt 2 — Frontend (React + Vite + TailwindCSS)

> Open a new IBM BOB session (or continue if BOB supports it). Paste this entire block.

```
You are a senior React frontend engineer. Generate a complete React 18 frontend
for an E-Bookstore application that connects to a Spring Boot backend on http://localhost:8080.
Generate every file completely — do not truncate or skip any file.

---

## PROJECT INIT

Framework: Vite + React
Styling: TailwindCSS 3
Routing: React Router DOM v6
HTTP: Axios
Icons: lucide-react
Notifications: react-hot-toast

package.json dependencies:
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.6.0",
    "lucide-react": "^0.363.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.1.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}

---

## vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})

---

## tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4f46e5', hover: '#4338ca', light: '#eef2ff' },
        accent: { DEFAULT: '#f59e0b', hover: '#d97706' }
      }
    }
  },
  plugins: []
}

---

## src/api/axiosInstance.js

Create axios instance with:
- baseURL: '/api'
- Request interceptor: attach Authorization: Bearer <token> from localStorage('token')
- Response interceptor: on 401, remove token from localStorage, redirect to /login

---

## src/api/ — one file per domain

### auth.js
export const registerUser = (data) => axios.post('/auth/register', data)
export const loginUser = (data) => axios.post('/auth/login', data)
export const getMe = () => axios.get('/auth/me')
export const updateMe = (data) => axios.put('/auth/me', data)

### products.js
export const getProducts = (params) => axios.get('/products', { params })
export const getProductById = (id) => axios.get(`/products/${id}`)
export const getRelatedProducts = (id) => axios.get(`/products/${id}/related`)
export const getFeaturedProducts = () => axios.get('/products/featured')

### categories.js
export const getCategories = () => axios.get('/categories')

### brands.js
export const getBrands = () => axios.get('/brands')

### cart.js
export const getCart = () => axios.get('/cart')
export const addToCart = (data) => axios.post('/cart/items', data)
export const updateCartItem = (id, data) => axios.put(`/cart/items/${id}`, data)
export const removeCartItem = (id) => axios.delete(`/cart/items/${id}`)
export const clearCart = () => axios.delete('/cart')

### orders.js
export const placeOrder = (data) => axios.post('/orders', data)
export const getOrders = (params) => axios.get('/orders', { params })
export const getOrderById = (id) => axios.get(`/orders/${id}`)
export const cancelOrder = (id) => axios.put(`/orders/${id}/cancel`)

### addresses.js
export const getAddresses = () => axios.get('/addresses')
export const addAddress = (data) => axios.post('/addresses', data)
export const updateAddress = (id, data) => axios.put(`/addresses/${id}`, data)
export const deleteAddress = (id) => axios.delete(`/addresses/${id}`)
export const setDefaultAddress = (id) => axios.put(`/addresses/${id}/default`)

### recommendations.js
export const getRecommendations = () => axios.get('/recommendations')

### reviews.js
export const createReview = (data) => axios.post('/reviews', data)
export const getProductReviews = (productId) => axios.get(`/reviews/product/${productId}`)

---

## src/context/AuthContext.jsx

- State: { user, token, isAuthenticated, loading }
- On mount: if localStorage has token, call getMe() to restore session
- login(token, user): save to localStorage + state
- logout(): clear localStorage + state + redirect to /login
- Provide via AuthContext

## src/context/CartContext.jsx

- State: { cart, cartCount, loading }
- fetchCart(): calls getCart() API, updates state
- addToCart(productId, quantity): calls API then refreshes cart
- removeFromCart(cartItemId): calls API then refreshes cart
- updateQuantity(cartItemId, quantity): calls API then refreshes cart
- clearCartLocal(): clears local state (used after order placed)
- Auto-fetch cart on mount if user is authenticated

---

## src/components/

### Navbar.jsx
- Logo: "BookStore" with book icon (indigo)
- Links: Home, Catalogue
- Search bar (input that navigates to /catalogue?search=... on Enter)
- Cart icon (ShoppingCart from lucide) with red badge showing cartCount
- If authenticated: user avatar dropdown with links to My Orders, Profile, Logout
- If not: Login and Register buttons
- Mobile responsive with hamburger menu

### Footer.jsx
- 3 columns: About Us | Quick Links | Contact
- Copyright line
- Dark background (gray-900), white text

### ProductCard.jsx
Props: product (id, title, author, price, imageUrl, rating, stockQuantity, brandName)
- Image with aspect ratio 3:4, object-cover
- Title (truncate to 1 line), Author (gray-500)
- Star rating (filled/half/empty stars using amber color)
- Price in bold indigo
- "Add to Cart" button — disabled if stockQuantity === 0
- "Out of Stock" badge if stockQuantity === 0
- Clicking card navigates to /products/:id
- "Add to Cart" calls cartContext.addToCart with toast notification

### StarRating.jsx
Props: rating (0-5), size ('sm'|'md'|'lg'), showValue (bool)
Render filled stars (amber), partial last star, empty stars.

### LoadingSpinner.jsx
Centered spinner with optional message prop.

### Pagination.jsx
Props: currentPage, totalPages, onPageChange
Show prev/next buttons + page numbers (show max 5 page numbers with ellipsis).

### ProtectedRoute.jsx
If !isAuthenticated && !loading → redirect to /login with state: { from: location }
Else render children (or Outlet).

---

## src/pages/

### HomePage.jsx (/)
Sections:
1. Hero: full-width banner, "Discover Your Next Book", subtitle, "Shop Now" button → /catalogue
   Background: indigo gradient
2. Categories grid (2x2 on mobile, 4x1 on desktop): fetch from getCategories()
   Each card: image, category name, "Browse →" link to /catalogue?categoryId=X
3. "Featured Books" heading + 8 ProductCard grid (4 cols desktop, 2 mobile)
   Fetch from getFeaturedProducts()
4. If authenticated: "Recommended For You" section with 6 cards from getRecommendations()
   Show this section only if recommendations.length > 0

### LoginPage.jsx (/login)
- Email + password form with validation
- "Remember me" checkbox (store token in sessionStorage if unchecked)
- On success: call authContext.login, redirect to previous page or /
- Error toast on failure
- Link to /register

### RegisterPage.jsx (/register)
- Full name, email, password, confirm password, phone
- Client-side validation (passwords match, email format)
- On success: auto-login, redirect to /
- Link to /login

### CataloguePage.jsx (/catalogue)
Layout: sidebar (left, 1/4 width on desktop) + product grid (right, 3/4 width)

Sidebar filters:
- Search input (controlled, debounced 400ms)
- Categories: checkboxes, fetch from getCategories()
- Brands: checkboxes, fetch from getBrands()
- Price range: two number inputs (min/max)
- "Clear Filters" button

Product grid:
- Sort dropdown: Relevance | Price: Low to High | Price: High to Low | Rating
- Results count: "Showing X of Y books"
- ProductCard grid (3 cols desktop, 2 tablet, 1 mobile)
- Pagination at bottom
- Loading skeleton cards while fetching

URL sync: update query params on filter change, read from URL on mount.

### ProductDetailPage.jsx (/products/:id)
Layout: 2-column (image left, details right)

Left: book cover image, large
Right:
- Category badge (indigo pill)
- Title (2xl bold), Author (lg gray)
- Publisher name, ISBN, Pages, Language (small gray grid)
- StarRating + review count
- Price (2xl indigo bold)
- Estimated delivery: "Delivered by [date]" (add estimatedDeliveryDays to today)
- Quantity stepper (1 to stock)
- "Add to Cart" button (full width, indigo) — show loading state
- Stock status: "In Stock (X left)" or "Out of Stock"

Below: Tabs component
- "Description" tab: product description
- "Reviews" tab: list of ReviewResponse cards + "Write a Review" form (if authenticated and not yet reviewed)
  Review form: 1-5 star selector + textarea + Submit

Below tabs: "Related Books" section (4 ProductCard in a row)

### CartPage.jsx (/cart) — protected
Two-column layout (cart items left, order summary right):

Left — cart items list:
- Each item: image, title, author, unit price
- Quantity stepper (- n +) with update on change
- Remove button (trash icon)
- Show "Your cart is empty" with link to /catalogue if empty

Right — Order Summary card:
- Subtotal
- Shipping: "FREE" if subtotal >= 30, else "$4.99"
- Total (bold)
- "Proceed to Checkout" button → /checkout
- "Continue Shopping" link

### CheckoutPage.jsx (/checkout) — protected
Progress bar: [1. Address] → [2. Review] → [3. Payment]

Step 1 — Delivery Address:
- List saved addresses as selectable cards (radio-style)
- "Add New Address" expandable form
- "Continue" button advances to step 2

Step 2 — Review Order:
- List cart items (read-only)
- Order total
- "Continue to Payment" → /payment
- "Back" button

### PaymentPage.jsx (/payment) — protected
- Payment method tabs: Credit Card | Debit Card | Gift Points
- Credit/Debit form: cardholder name, card number (masked input), MM/YY expiry, CVV
- Gift Points tab: show balance, show how much discount (100pts = $1), max discount (20% of total)
- Order summary sidebar (sticky)
- "Place Order" button → calls placeOrder API → on success: redirect to /order-confirmation/:id

### OrderConfirmationPage.jsx (/order-confirmation/:orderId) — protected
- Green checkmark icon + "Order Placed Successfully!"
- Order ID (bold)
- Order summary: items, totals, address, payment method
- Estimated delivery date
- Gift points earned
- Two buttons: "Continue Shopping" → / | "View My Orders" → /orders

### OrderHistoryPage.jsx (/orders) — protected
- Page title: "My Orders"
- List of order cards:
  - Order ID, date, status badge (color-coded), item count, total
  - Expandable order detail (items list)
  - "Buy Again" button: adds all items to cart → toast
  - "Cancel Order" button: visible only if cancellable → confirm dialog → call cancelOrder API
- Empty state if no orders
- Pagination

### ProfilePage.jsx (/profile) — protected
Two sections:

1. Personal Info card:
   - Display full name, email (read-only), phone, gift points balance (gold badge)
   - "Edit" button → inline edit form for name and phone
   - "Save Changes" button

2. Saved Addresses card:
   - List addresses with label, full address, "Default" badge
   - Edit / Delete buttons per address
   - "Add New Address" button → modal form
   - Set as Default button

---

## src/App.jsx

import all pages and set up routes:

<BrowserRouter>
  <AuthProvider>
    <CartProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/catalogue" element={<><Navbar /><CataloguePage /><Footer /></>} />
        <Route path="/products/:id" element={<><Navbar /><ProductDetailPage /><Footer /></>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<><Navbar /><CartPage /><Footer /></>} />
          <Route path="/checkout" element={<><Navbar /><CheckoutPage /><Footer /></>} />
          <Route path="/payment" element={<><Navbar /><PaymentPage /><Footer /></>} />
          <Route path="/order-confirmation/:orderId" element={<><Navbar /><OrderConfirmationPage /><Footer /></>} />
          <Route path="/orders" element={<><Navbar /><OrderHistoryPage /><Footer /></>} />
          <Route path="/profile" element={<><Navbar /><ProfilePage /><Footer /></>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </CartProvider>
  </AuthProvider>
</BrowserRouter>

---

## src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

---

Generate every single JSX/JS file completely. Use real working code for every function.
Make the UI clean, modern, and professional. Every page must look polished.
Use proper loading states, error handling, and empty states throughout.
```

---

## Prompt 3 — OpenAPI Specification

> Paste this into IBM BOB (new session or continue). This generates the full API YAML file.

```
Generate a complete OpenAPI 3.0 YAML specification for the E-Bookstore backend API.
This spec should be production-quality and cover every single endpoint.
Save as: openapi.yaml

---

openapi: 3.0.3
info:
  title: E-Bookstore API
  description: Complete REST API for the E-Bookstore capstone application
  version: 1.0.0

servers:
  - url: http://localhost:8080
    description: Local development server

tags:
  - name: Authentication
  - name: Categories
  - name: Brands
  - name: Products
  - name: Cart
  - name: Orders
  - name: Addresses
  - name: Reviews
  - name: Recommendations

---

components.securitySchemes:
  BearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT

---

components.schemas — define ALL of the following fully with properties, types, required fields, and examples:

Auth schemas:
- RegisterRequest: fullName (required), email (required, format: email), password (required, minLength: 8), phone
- LoginRequest: email (required), password (required)
- AuthResponse: token, id, fullName, email, giftPoints
- UserProfileResponse: id, fullName, email, phone, giftPoints, createdAt
- UpdateProfileRequest: fullName, phone

Category & Brand schemas:
- CategoryResponse: id, name, description, imageUrl
- BrandResponse: id, name, logoUrl

Product schemas:
- ProductSummaryResponse: id, title, author, price, imageUrl, rating, categoryName, brandName, stockQuantity
- ProductDetailResponse: all ProductSummaryResponse fields + description, isbn, pages, language,
  estimatedDeliveryDays, reviewCount, category (object: id, name), brand (object: id, name)
- ProductPageResponse: content (array of ProductSummaryResponse), totalElements, totalPages, currentPage, pageSize

Cart schemas:
- CartItemResponse: id, product (ProductSummaryResponse), quantity, itemTotal
- CartResponse: items (array of CartItemResponse), subtotal, shipping, total, itemCount
- AddToCartRequest: productId (required, integer), quantity (integer, minimum: 1, default: 1)
- UpdateCartItemRequest: quantity (required, integer, minimum: 1)

Order schemas:
- PlaceOrderRequest: addressId (required), paymentMethod (required, enum: CREDIT_CARD, DEBIT_CARD, GIFT_POINTS),
  useGiftPoints (boolean, default: false), cardNumber, cardExpiry, cardCvv
- OrderItemResponse: id, product (ProductSummaryResponse), quantity, unitPrice, subtotal
- OrderSummaryResponse: id, status, totalAmount, placedAt, itemCount, paymentMethod, paymentStatus
- OrderDetailResponse: id, status, totalAmount, placedAt, cancelledAt, paymentMethod, paymentStatus,
  giftPointsUsed, giftPointsEarned, address (AddressResponse), items (array of OrderItemResponse)
- OrderPageResponse: content (array of OrderSummaryResponse), totalElements, totalPages, currentPage

Address schemas:
- AddressRequest: label, street, city, state, zipCode, country, isDefault (boolean)
- AddressResponse: id, label, street, city, state, zipCode, country, isDefault

Review schemas:
- CreateReviewRequest: productId (required), rating (required, integer, min: 1, max: 5), comment
- ReviewResponse: id, userId, fullName, rating, comment, createdAt

Common:
- ErrorResponse: timestamp (string, format: date-time), status (integer), error (string), message (string), path (string)

---

paths — define ALL endpoints with full detail:

/api/auth/register
  POST: public, body: RegisterRequest, responses: 201 AuthResponse, 400 ErrorResponse (validation or email taken)

/api/auth/login
  POST: public, body: LoginRequest, responses: 200 AuthResponse, 401 ErrorResponse

/api/auth/me
  GET: BearerAuth required, responses: 200 UserProfileResponse, 401 ErrorResponse
  PUT: BearerAuth required, body: UpdateProfileRequest, responses: 200 UserProfileResponse, 401 ErrorResponse

/api/categories
  GET: public, responses: 200 array of CategoryResponse

/api/categories/{id}
  GET: public, path param id (integer), responses: 200 CategoryResponse, 404 ErrorResponse

/api/brands
  GET: public, responses: 200 array of BrandResponse

/api/brands/{id}
  GET: public, path param id (integer), responses: 200 BrandResponse, 404 ErrorResponse

/api/products
  GET: public
  query params:
    - categoryId (integer, optional)
    - brandId (integer, optional)
    - search (string, optional)
    - minPrice (number, optional)
    - maxPrice (number, optional)
    - sort (string, enum: relevance, price_asc, price_desc, rating, default: relevance)
    - page (integer, default: 0)
    - size (integer, default: 12)
  responses: 200 ProductPageResponse

/api/products/featured
  GET: public, responses: 200 array of ProductSummaryResponse (max 8)

/api/products/{id}
  GET: public, path param id (integer), responses: 200 ProductDetailResponse, 404 ErrorResponse

/api/products/{id}/related
  GET: public, path param id (integer), responses: 200 array of ProductSummaryResponse (max 4)

/api/cart
  GET: BearerAuth required, responses: 200 CartResponse, 401 ErrorResponse
  DELETE: BearerAuth required, responses: 204, 401 ErrorResponse

/api/cart/items
  POST: BearerAuth required, body: AddToCartRequest
  responses: 200 CartResponse, 400 ErrorResponse (out of stock), 401 ErrorResponse, 404 ErrorResponse (product not found)

/api/cart/items/{id}
  PUT: BearerAuth required, path param id (integer), body: UpdateCartItemRequest
  responses: 200 CartResponse, 400 ErrorResponse, 401 ErrorResponse, 404 ErrorResponse
  DELETE: BearerAuth required, path param id (integer)
  responses: 200 CartResponse, 401 ErrorResponse, 404 ErrorResponse

/api/orders
  GET: BearerAuth required, query: page (default 0), size (default 10)
  responses: 200 OrderPageResponse, 401 ErrorResponse
  POST: BearerAuth required, body: PlaceOrderRequest
  responses: 201 OrderDetailResponse, 400 ErrorResponse (empty cart, insufficient stock), 401 ErrorResponse

/api/orders/{id}
  GET: BearerAuth required, path param id (integer)
  responses: 200 OrderDetailResponse, 401 ErrorResponse, 403 ErrorResponse, 404 ErrorResponse

/api/orders/{id}/cancel
  PUT: BearerAuth required, path param id (integer)
  responses: 200 OrderDetailResponse,
             400 ErrorResponse (outside 48hrs or wrong status — include message explaining why),
             401 ErrorResponse, 403 ErrorResponse, 404 ErrorResponse

/api/addresses
  GET: BearerAuth required, responses: 200 array of AddressResponse, 401 ErrorResponse
  POST: BearerAuth required, body: AddressRequest, responses: 201 AddressResponse, 400 ErrorResponse, 401 ErrorResponse

/api/addresses/{id}
  PUT: BearerAuth required, path param id (integer), body: AddressRequest
  responses: 200 AddressResponse, 401 ErrorResponse, 403 ErrorResponse, 404 ErrorResponse
  DELETE: BearerAuth required, path param id (integer)
  responses: 204, 401 ErrorResponse, 403 ErrorResponse, 404 ErrorResponse

/api/addresses/{id}/default
  PUT: BearerAuth required, path param id (integer)
  responses: 200 AddressResponse, 401 ErrorResponse, 403 ErrorResponse, 404 ErrorResponse

/api/reviews
  POST: BearerAuth required, body: CreateReviewRequest
  responses: 201 ReviewResponse, 400 ErrorResponse (already reviewed), 401 ErrorResponse, 404 ErrorResponse

/api/reviews/product/{productId}
  GET: public, path param productId (integer)
  responses: 200 array of ReviewResponse, 404 ErrorResponse

/api/recommendations
  GET: BearerAuth required
  responses: 200 array of ProductSummaryResponse (max 6), 401 ErrorResponse

---

For every path include:
- operationId (camelCase, e.g. registerUser, getProductById)
- summary (one line)
- description (2-3 sentences)
- Full parameter/body/response definitions with $ref to components
- At least one request example and one response example per endpoint
- security: [] for public endpoints, security: [BearerAuth: []] for protected

Generate the complete YAML. Do not truncate.
```

---

## Prompt 4 — Tests, Postman Collection, README & Config Files

> Paste this as the final IBM BOB session. This completes all remaining deliverables.

```
Generate the following files for the E-Bookstore capstone project.
Generate every file completely — do not truncate.

---

## FILE 1: Backend Unit Tests

Generate JUnit 5 + Mockito test classes. Place in src/test/java/com/ebookstore/

### AuthServiceTest.java
- testRegister_Success
- testRegister_EmailAlreadyExists: expect BadRequestException
- testLogin_Success
- testLogin_WrongPassword: expect BadRequestException
- testLogin_UserNotFound: expect BadRequestException

### ProductServiceTest.java
- testGetProductById_Success
- testGetProductById_NotFound: expect ResourceNotFoundException
- testGetFeaturedProducts
- testGetRelatedProducts

### CartServiceTest.java
- testGetCart_Empty
- testAddItem_Success
- testAddItem_OutOfStock: expect BadRequestException
- testAddItem_AlreadyInCart: verify quantity incremented
- testRemoveItem_Success
- testRemoveItem_NotOwner: expect AccessDeniedException

### OrderServiceTest.java
- testPlaceOrder_Success: verify stock decremented, gift points awarded, cart cleared
- testPlaceOrder_EmptyCart: expect BadRequestException
- testCancelOrder_Success: order < 48hrs, status PENDING
- testCancelOrder_TooLate: order > 48hrs, expect BadRequestException
- testCancelOrder_AlreadyCancelled: expect BadRequestException
- testCancelOrder_WrongUser: expect AccessDeniedException

---

## FILE 2: Integration Tests

### AuthControllerIntegrationTest.java
Use @SpringBootTest, @AutoConfigureMockMvc, @Transactional
- testRegister_Returns201
- testRegister_DuplicateEmail_Returns400
- testLogin_Returns200_WithToken
- testLogin_WrongCredentials_Returns401
- testGetMe_WithValidToken_Returns200
- testGetMe_WithoutToken_Returns401

### ProductControllerIntegrationTest.java
- testGetProducts_Returns200
- testGetProducts_WithCategoryFilter_Returns200
- testGetProducts_WithSearch_Returns200
- testGetProductById_Returns200
- testGetProductById_NotFound_Returns404

### CartControllerIntegrationTest.java
- testGetCart_WithAuth_Returns200
- testGetCart_WithoutAuth_Returns401
- testAddToCart_Returns200
- testUpdateCartItem_Returns200
- testRemoveCartItem_Returns200

### OrderControllerIntegrationTest.java
- testPlaceOrder_Returns201
- testGetOrders_Returns200
- testGetOrderById_Returns200
- testCancelOrder_Returns200
- testCancelOrder_AfterDeadline_Returns400

---

## FILE 3: Postman Collection (ebookstore.postman_collection.json)

Generate a complete Postman Collection v2.1 JSON with:
- Collection name: "E-Bookstore API"
- Collection variable: baseUrl = http://localhost:8080
- Collection variable: token = (empty, set by login test script)

Folders and requests:

AUTH folder:
  - POST Register: {{baseUrl}}/api/auth/register, body with sample user
  - POST Login: {{baseUrl}}/api/auth/login, body with sample credentials
    Test script: pm.environment.set("token", pm.response.json().token)
  - GET Me: {{baseUrl}}/api/auth/me, Authorization: Bearer {{token}}
  - PUT Update Profile: {{baseUrl}}/api/auth/me, Authorization: Bearer {{token}}

CATEGORIES folder:
  - GET All Categories: {{baseUrl}}/api/categories
  - GET Category by ID: {{baseUrl}}/api/categories/1

BRANDS folder:
  - GET All Brands: {{baseUrl}}/api/brands
  - GET Brand by ID: {{baseUrl}}/api/brands/1

PRODUCTS folder:
  - GET All Products: {{baseUrl}}/api/products
  - GET Products by Category: {{baseUrl}}/api/products?categoryId=1
  - GET Products with Search: {{baseUrl}}/api/products?search=clean
  - GET Featured Products: {{baseUrl}}/api/products/featured
  - GET Product by ID: {{baseUrl}}/api/products/1
  - GET Related Products: {{baseUrl}}/api/products/1/related

CART folder (all with Authorization: Bearer {{token}}):
  - GET Cart: {{baseUrl}}/api/cart
  - POST Add to Cart: {{baseUrl}}/api/cart/items, body: {"productId": 1, "quantity": 2}
  - PUT Update Cart Item: {{baseUrl}}/api/cart/items/1, body: {"quantity": 3}
  - DELETE Remove Item: {{baseUrl}}/api/cart/items/1
  - DELETE Clear Cart: {{baseUrl}}/api/cart

ADDRESSES folder (all with Authorization: Bearer {{token}}):
  - GET Addresses: {{baseUrl}}/api/addresses
  - POST Add Address: {{baseUrl}}/api/addresses, body with sample address
  - PUT Update Address: {{baseUrl}}/api/addresses/1
  - DELETE Address: {{baseUrl}}/api/addresses/1
  - PUT Set Default: {{baseUrl}}/api/addresses/1/default

ORDERS folder (all with Authorization: Bearer {{token}}):
  - POST Place Order: {{baseUrl}}/api/orders, body: {"addressId":1,"paymentMethod":"CREDIT_CARD","useGiftPoints":false,"cardNumber":"4111111111111111","cardExpiry":"12/26","cardCvv":"123"}
  - GET Order History: {{baseUrl}}/api/orders
  - GET Order by ID: {{baseUrl}}/api/orders/1
  - PUT Cancel Order: {{baseUrl}}/api/orders/1/cancel

REVIEWS folder:
  - POST Create Review (auth): {{baseUrl}}/api/reviews, body: {"productId":1,"rating":5,"comment":"Great book!"}
  - GET Product Reviews (public): {{baseUrl}}/api/reviews/product/1

RECOMMENDATIONS folder (auth):
  - GET Recommendations: {{baseUrl}}/api/recommendations

---

## FILE 4: README.md

# E-Bookstore — Full Stack Capstone

A complete online bookstore application built with React + Spring Boot + PostgreSQL.

## Features
- User registration and JWT authentication
- Browse books by category, brand, and search
- Product detail pages with reviews and related books
- Shopping cart with real-time updates
- Multi-step checkout (address → review → payment)
- Payment with credit/debit card or gift points
- Order history with Buy Again and Cancel Order (within 48hrs)
- AI-based book recommendations from order history
- Responsive design (mobile + desktop)

## Prerequisites
| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| npm | 9+ |
| PostgreSQL | 15+ |

## Database Setup
```sql
-- Run in psql or pgAdmin
CREATE DATABASE ebookstore;
-- If using default postgres user with password 'postgres', no further steps needed
-- Otherwise update application.properties with your credentials
```

## Backend Setup
```bash
# Navigate to backend folder
cd ebookstore-backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/v3/api-docs

## Frontend Setup
```bash
# Navigate to frontend folder
cd ebookstore-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
- Frontend: http://localhost:5173

## Running Tests
```bash
cd ebookstore-backend
mvn test
```

## Project Structure
```
ebookstore-backend/
├── src/main/java/com/ebookstore/
│   ├── config/          SecurityConfig, SwaggerConfig, CorsConfig
│   ├── controller/      REST controllers
│   ├── service/         Business logic
│   ├── repository/      JPA repositories
│   ├── entity/          JPA entities
│   ├── dto/             Request/Response DTOs
│   ├── exception/       Custom exceptions + GlobalExceptionHandler
│   └── security/        JWT filter, JwtUtil, UserDetailsServiceImpl
└── src/main/resources/
    ├── application.properties
    └── db/migration/    Flyway SQL scripts

ebookstore-frontend/
└── src/
    ├── api/             Axios API functions
    ├── components/      Shared UI components
    ├── context/         AuthContext, CartContext
    └── pages/           All page components
```

## Git Workflow
```bash
git init
git remote add origin https://github.com/<your-username>/ebookstore-capstone.git
git checkout -b feature/ebookstore-implementation
git add .
git commit -m "feat: complete e-bookstore full-stack implementation"
git push -u origin feature/ebookstore-implementation
```
Open a Pull Request on GitHub and share the link with your manager.

---

## FILE 5: .gitignore
```
# Maven
target/
*.class
*.jar
*.war
*.ear
.mvn/

# Spring Boot
application-local.properties
application-secret.properties

# Node
node_modules/
dist/
.env
.env.local
.env.production

# IDE
.idea/
.vscode/
*.iml
.classpath
.project
.settings/

# OS
.DS_Store
Thumbs.db
desktop.ini

# Logs
*.log
logs/
```

---

## FILE 6: docker-compose.yml (optional — for running PostgreSQL in Docker)
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: ebookstore-postgres
    environment:
      POSTGRES_DB: ebookstore
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```
To use: docker-compose up -d
Then run backend normally with mvn spring-boot:run

---

Generate all 6 files completely. Do not truncate any file.
```

---

## Final Setup Steps (After All 4 Prompts)

Follow these steps after collecting all generated code from IBM BOB:

### Step 1 — PostgreSQL
```sql
CREATE DATABASE ebookstore;
```

### Step 2 — Run Backend
```bash
cd ebookstore-backend
mvn clean install
mvn spring-boot:run
```
Verify: open http://localhost:8080/swagger-ui.html

### Step 3 — Run Frontend
```bash
cd ebookstore-frontend
npm install
npm run dev
```
Verify: open http://localhost:5173

### Step 4 — Test APIs
Import `ebookstore.postman_collection.json` into Postman or Insomnia.
Run in order: Register → Login → Browse Products → Add to Cart → Place Order

### Step 5 — Run Tests
```bash
cd ebookstore-backend
mvn test
```

### Step 6 — Push to GitHub
```bash
git init
git remote add origin https://github.com/<your-username>/ebookstore-capstone.git
git checkout -b feature/ebookstore-implementation
git add .
git commit -m "feat: complete e-bookstore full-stack implementation"
git push -u origin feature/ebookstore-implementation
```
Open a Pull Request and share the link with your manager.

### Step 7 — Record Demo Video
Cover these screens in your recording:
1. Homepage with featured books
2. Catalogue with filters
3. Product detail page
4. Add to cart
5. Checkout and payment flow
6. Order confirmation
7. Order history with Buy Again
8. Swagger UI showing API endpoints
9. Running tests in terminal

---

## Prompt Summary Table

| # | Prompt | Generates | Estimated Files |
|---|--------|-----------|-----------------|
| 1 | Backend | pom.xml, entities, DTOs, repositories, services, controllers, security, migrations, seed data | ~40 files |
| 2 | Frontend | package.json, vite config, tailwind config, contexts, components, pages, API layer | ~30 files |
| 3 | OpenAPI | openapi.yaml | 1 file |
| 4 | Tests + Config | JUnit tests, Postman collection, README, .gitignore, docker-compose.yml | ~10 files |

**Total: ~80 files — a complete full-stack application.**
