# Backend Agent — Requirements

**Agent Role:** Backend Engineer  
**Assigned by:** Orchestrator Agent  

---

## Mission

Build a production-ready Spring Boot REST API for the Laval Books e-bookstore. The API must serve as the single source of truth for all business logic. The frontend agent will consume this API strictly through the OpenAPI contract you publish.

---

## Tech Stack (Non-Negotiable)

| Requirement | Specification |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.2.3 |
| Build tool | Maven |
| Database | PostgreSQL 18 |
| ORM | Spring Data JPA + Hibernate |
| Migrations | Flyway (V1, V2, V3, V4) |
| Security | Spring Security 6 + JWT (JJWT 0.12, HMAC-SHA-512) |
| Password hashing | BCrypt (cost factor 10) |
| Port | 8080 |

---

## Database Schema Required

Design and implement 8 tables:

```
users          — id, full_name, email (unique), password_hash, phone, gift_points
addresses      — id, user_id (FK), label, street, city, state, zip_code, country, is_default
categories     — id, name (unique), description, image_url
brands         — id, name (unique), logo_url
products       — id, title, author, description, price, stock_quantity, category_id (FK), brand_id (FK),
                 image_url, isbn (unique), pages, language, rating, estimated_delivery_days
cart_items     — id, user_id (FK), product_id (FK), quantity, UNIQUE(user_id, product_id)
orders         — id, user_id (FK), address_id (FK), status, total_amount, gift_points_used,
                 gift_points_earned, payment_method, payment_status, placed_at, cancelled_at
order_items    — id, order_id (FK), product_id (FK), quantity, unit_price, subtotal
reviews        — id, user_id (FK), product_id (FK), rating (1-5), comment, UNIQUE(user_id, product_id)
```

---

## API Endpoints Required (25 total)

### Auth
- `POST /api/auth/register` — public
- `POST /api/auth/login` — public
- `GET  /api/auth/me` — protected
- `PUT  /api/auth/me` — protected

### Products
- `GET /api/products` — public, supports: search, categoryId, brandId, minPrice, maxPrice, sort, page, size
- `GET /api/products/featured` — public, top 8 by rating
- `GET /api/products/:id` — public
- `GET /api/products/:id/related` — public, same category

### Categories & Brands
- `GET /api/categories` — public
- `GET /api/brands` — public

### Cart (all protected)
- `GET    /api/cart`
- `POST   /api/cart`
- `PUT    /api/cart/:id`
- `DELETE /api/cart/:id`

### Orders (all protected)
- `POST /api/orders`
- `GET  /api/orders`
- `GET  /api/orders/:id`
- `PUT  /api/orders/:id/cancel`

### Addresses (all protected)
- `GET    /api/addresses`
- `POST   /api/addresses`
- `PUT    /api/addresses/:id`
- `DELETE /api/addresses/:id`
- `PUT    /api/addresses/:id/default`

### Other (protected)
- `GET  /api/recommendations`
- `GET  /api/reviews/product/:id` — public
- `POST /api/reviews` — protected

---

## Business Rules

| Rule | Detail |
|---|---|
| Gift points | Earn 1 pt per $1 spent. 100 pts = $1 discount. Max 20% of order total |
| Free shipping | Orders over $30.00 get free shipping. Otherwise $4.99 |
| Order cancellation | Only PENDING or CONFIRMED status, within 48 hours of placement |
| Stock validation | Reject order if any item exceeds available stock |
| Reviews | One review per user per product |

---

## Contract Published to Other Agents

On completion, publish:
1. `openapi.yaml` — full OpenAPI 3.0 spec (consumed by Frontend + Testing agents)
2. DTO record shapes in `src/main/java/com/ebookstore/dto/` (consumed by Frontend agent)
3. Service method signatures (consumed by Testing agent)
4. `V1__init_schema.sql` (consumed by Testing agent for H2 setup)

---

## Security Rules

```
PUBLIC:  POST /api/auth/register
         POST /api/auth/login
         GET  /api/products/**
         GET  /api/categories/**
         GET  /api/brands/**
         GET  /api/reviews/product/**
         GET  /swagger-ui/**
         GET  /v3/api-docs/**

PROTECTED (JWT required): everything else
UNAUTHENTICATED response:  HTTP 401 (not 500)
```
