# Backend Agent — Deliverables

**Status:** ✅ COMPLETE  
**Published contract:** `openapi.yaml`, DTO shapes, service signatures  

---

## Files Delivered

### Configuration
| File | Description |
|---|---|
| `pom.xml` | Maven — Java 21, Spring Boot 3.2.3, JJWT 0.12, Flyway, Lombok, H2 (test) |
| `application.properties` | DB URL, JWT secret (env var), Flyway config, port 8080 |

### Database Migrations
| File | Description |
|---|---|
| `V1__init_schema.sql` | Creates all 8 tables with FK constraints |
| `V2__seed_data.sql` | Seeds 12 books, 4 categories, 3 publishers |
| `V3__book_images.sql` | Adds Open Library cover image URLs |
| `V4__more_books.sql` | Adds 30 more books (total: 42 books) |

### JPA Entities (9)
`User`, `Address`, `Category`, `Brand`, `Product`, `CartItem`, `Order`, `OrderItem`, `Review`

### DTOs (20+)
`AuthResponse`, `RegisterRequest`, `LoginRequest`, `ProductSummaryResponse`, `ProductDetailResponse`,
`ProductPageResponse`, `CartResponse`, `CartItemResponse`, `AddToCartRequest`, `PlaceOrderRequest`,
`OrderSummaryResponse`, `OrderDetailResponse`, `OrderItemResponse`, `AddressRequest`, `AddressResponse`,
`ReviewResponse`, `CreateReviewRequest`, `UserProfileResponse`, `UpdateProfileRequest`, `PageResponse`, `ErrorResponse`

### Repositories (9)
`UserRepository`, `ProductRepository`, `CategoryRepository`, `BrandRepository`,
`CartItemRepository`, `OrderRepository`, `OrderItemRepository`, `AddressRepository`, `ReviewRepository`

### Services (7)
`AuthService`, `ProductService`, `CartService`, `OrderService`,
`AddressService`, `ReviewService`, `RecommendationService`

### Controllers (9)
`AuthController`, `ProductController`, `CategoryController`, `BrandController`,
`CartController`, `OrderController`, `AddressController`, `ReviewController`, `RecommendationController`

### Security (3)
`JwtUtil` — token generation + validation (HMAC-SHA-512)  
`JwtAuthenticationFilter` — validates every request  
`UserDetailsServiceImpl` — loads user from DB by email  
`SecurityConfig` — filter chain, CORS, public/protected routes, 401 entry point  

### Exception Handling
`GlobalExceptionHandler` — maps exceptions to HTTP status codes  
`ResourceNotFoundException` → 404  
`BadRequestException` → 400  
`UnauthorizedException` → 401  

---

## Contract Published

### To Frontend Agent
```
Endpoint shapes:   openapi.yaml
DTO field names:   see dto/ package
Auth flow:         POST /api/auth/login → {token, email, fullName, giftPoints}
Token usage:       Authorization: Bearer <token> header on all protected calls
Pagination shape:  {content: [], totalElements, totalPages, number, size}
```

### To Testing Agent
```
Service contracts: AuthService, ProductService, CartService, OrderService
Controller paths:  openapi.yaml
Test DB schema:    V1__init_schema.sql (use with H2 + create-drop)
Test JWT secret:   any 256-bit string works for testing
```

---

## Verification

```
mvn package -DskipTests   → BUILD SUCCESS
mvn spring-boot:run       → Started EbookstoreApplication in ~8 seconds
GET /api/products         → 200, 42 books returned
GET /api/auth/me (no JWT) → 401 Unauthorized
```
