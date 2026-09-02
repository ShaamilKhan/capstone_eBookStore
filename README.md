# E-Bookstore — Full Stack Capstone

A complete online bookstore application built with **React + Spring Boot + PostgreSQL**, developed using IBM BOB (AI-assisted development).

## Features

- User registration and JWT authentication
- Browse books by category, brand, and search
- Product detail pages with reviews and related books
- Shopping cart with real-time updates
- Multi-step checkout (address → review → payment)
- Payment with credit/debit card or gift points
- Order history with Buy Again and Cancel Order (within 48 hrs)
- AI-based book recommendations from order history
- Responsive design (mobile + desktop)

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | Spring Boot 3.2, Java 17, Maven         |
| Database | PostgreSQL 15, Flyway migrations        |
| Security | JWT (jjwt 0.12.3), BCrypt               |
| Frontend | React 18, Vite 5, TailwindCSS 3         |
| API Docs | SpringDoc OpenAPI / Swagger UI          |

## Prerequisites

| Tool       | Version |
|------------|---------|
| Java       | 17+     |
| Maven      | 3.8+    |
| Node.js    | 18+     |
| npm        | 9+      |
| PostgreSQL | 15+     |

## Database Setup

```sql
-- Run in psql or pgAdmin
CREATE DATABASE ebookstore;
-- Default credentials: postgres / postgres
-- Update application.properties or set DB_USERNAME / DB_PASSWORD env vars
```

## Backend Setup

```bash
cd ebookstore-backend
mvn clean install
mvn spring-boot:run
```

- Backend:    http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs:   http://localhost:8080/v3/api-docs

## Frontend Setup

```bash
cd ebookstore-frontend
npm install
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
│   ├── config/          SecurityConfig
│   ├── controller/      REST controllers (9)
│   ├── service/         Business logic (7)
│   ├── repository/      JPA repositories (9)
│   ├── entity/          JPA entities (9)
│   ├── dto/             Request/Response DTOs (20+)
│   ├── exception/       Custom exceptions + GlobalExceptionHandler
│   └── security/        JWT filter, JwtUtil, UserDetailsServiceImpl
└── src/main/resources/
    ├── application.properties
    └── db/migration/    V1__init_schema.sql, V2__seed_data.sql

ebookstore-frontend/
└── src/
    ├── api/             Axios API functions (9 files)
    ├── components/      Shared UI components (7)
    ├── context/         AuthContext, CartContext
    └── pages/           11 page components
```

## API Testing

Import `ebookstore.postman_collection.json` into Postman or Insomnia.
Run in order: **Register → Login → Browse Products → Add to Cart → Place Order**

## Git Workflow

```bash
git init
git remote add origin https://github.com/<your-username>/ebookstore-capstone.git
git checkout -b feature/ebookstore-implementation
git add .
git commit -m "feat: complete e-bookstore full-stack implementation"
git push -u origin feature/ebookstore-implementation
```

Open a Pull Request and share the link with your manager.

## Environment Variables

| Variable      | Default              | Description             |
|---------------|----------------------|-------------------------|
| `DB_USERNAME` | `postgres`           | PostgreSQL username     |
| `DB_PASSWORD` | `postgres`           | PostgreSQL password     |
| `JWT_SECRET`  | *(set in properties)*| JWT signing secret      |

> **Security note:** For production, always set `JWT_SECRET` via environment variable — never commit secrets to version control.
