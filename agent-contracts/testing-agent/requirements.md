# Testing Agent — Requirements

**Agent Role:** QA / Test Engineer  
**Assigned by:** Orchestrator Agent  
**Contracts received from:**
- Backend Agent — service signatures, controller paths, entity model
- Backend Agent — `openapi.yaml` (endpoint contract to test against)
- Backend Agent — `V1__init_schema.sql` (for H2 test setup)

---

## Mission

Write comprehensive automated tests for the Laval Books backend. Tests must be independent of the production database. Use H2 in-memory database for integration tests. All tests must pass on `mvn test` with zero failures.

---

## Test Environment Contract (from Backend Agent)

```properties
# application-test.properties — isolated test config
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;NON_KEYWORDS=USER,VALUE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
spring.flyway.enabled=false
jwt.secret=test_secret_key_for_testing_only_minimum_256_bits_required_abc123
jwt.expiration=86400000
```

**Rules:**
- Never connect to the production PostgreSQL database
- Never use real credentials
- Never rely on production seed data — seed your own test data via `@Sql`
- Always use `@ActiveProfiles("test")` on integration test classes

---

## Service Contracts to Test (from Backend Agent)

### AuthService
```java
AuthResponse register(RegisterRequest request)
  // throws BadRequestException if email already exists

AuthResponse login(LoginRequest request)
  // throws BadRequestException if credentials invalid
  // returns JWT token on success

UserProfileResponse getCurrentUser(String email)
UserProfileResponse updateProfile(String email, UpdateProfileRequest request)
```

### ProductService
```java
ProductPageResponse getProducts(Long categoryId, Long brandId, String search,
                                BigDecimal minPrice, BigDecimal maxPrice,
                                String sort, int page, int size)

ProductDetailResponse getProductById(Long id)
  // throws ResourceNotFoundException if not found

List<ProductSummaryResponse> getRelatedProducts(Long id)
List<ProductSummaryResponse> getFeaturedProducts()
```

### CartService
```java
CartResponse getCart(Long userId)
CartResponse addToCart(Long userId, AddToCartRequest request)
  // throws BadRequestException if out of stock
CartResponse updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request)
CartResponse removeCartItem(Long userId, Long itemId)
```

### OrderService
```java
OrderDetailResponse placeOrder(Long userId, PlaceOrderRequest request)
  // throws BadRequestException if cart is empty
  // throws BadRequestException if insufficient stock
  // applies gift points discount if useGiftPoints=true

PageResponse<OrderSummaryResponse> getOrders(Long userId, int page, int size)
OrderDetailResponse getOrderById(Long userId, Long orderId)
OrderDetailResponse cancelOrder(Long userId, Long orderId)
  // throws BadRequestException if status is SHIPPED/DELIVERED
  // throws BadRequestException if more than 48 hours have passed
```

---

## Controller Contracts to Test (from openapi.yaml)

### Auth Controller
| Method | Path | Expected status |
|---|---|---|
| POST | /api/auth/register | 201 + token in body |
| POST | /api/auth/register (duplicate) | 400 |
| POST | /api/auth/login | 200 + token in body |
| POST | /api/auth/login (wrong creds) | 400 |
| GET  | /api/auth/me (with token) | 200 + user profile |
| GET  | /api/auth/me (no token) | 401 |

### Product Controller
| Method | Path | Expected status |
|---|---|---|
| GET | /api/products | 200 + {content: array} |
| GET | /api/products?categoryId=1 | 200 + {content: array} |
| GET | /api/products?search=clean | 200 + {content: array} |
| GET | /api/products/:validId | 200 + product object |
| GET | /api/products/999999 | 404 |

---

## Test Seed Data Required

For integration tests, seed a minimal dataset via `test-data.sql`:

```sql
INSERT INTO categories (name, description, image_url)
VALUES ('Technology', 'Tech books', 'https://example.com/cat.jpg');

INSERT INTO brands (name, logo_url)
VALUES ('OReilly', 'https://example.com/logo.jpg');

INSERT INTO products (title, author, description, price, stock_quantity,
                      category_id, brand_id, image_url, isbn, pages,
                      language, rating, estimated_delivery_days)
SELECT 'Clean Code', 'Robert C. Martin', 'A handbook', 39.99, 100,
       c.id, b.id, 'https://example.com/cover.jpg',
       '9780132350884', 431, 'English', 4.50, 5
FROM categories c, brands b
WHERE c.name = 'Technology' AND b.name = 'OReilly';
```

---

## Deliverable Expected

- 32 tests minimum, 0 failures
- Report back to orchestrator with full test run output
