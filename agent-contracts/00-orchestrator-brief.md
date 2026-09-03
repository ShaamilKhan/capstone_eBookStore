# Orchestrator Agent — Master Brief

**Project:** Laval Books — E-Bookstore Capstone  
**Tool:** IBM BOB (Agentic IDE)  
**Date:** 2026  

---

## Objective

Build a complete full-stack e-bookstore application using AI-assisted development. The orchestrator agent is responsible for reading the capstone specification, breaking the work into specialised agent streams, defining the contracts between agents, and verifying final delivery.

---

## Source Documents Read

1. `AI Specialist - Cloud FullStack - Capstone instructions.pptx` — 12 slides
2. `IBM_BOB_PROMPTS.md` — detailed prompt guide with all file specs

---

## Agent Assignments

### Backend Agent
**Goal:** Build the entire Spring Boot backend — entities, APIs, security, database migrations.

**Inputs provided:**
- Database schema (8 tables from slide 3 wireframes)
- API requirements (25 endpoints covering auth, products, cart, orders, reviews, addresses, recommendations)
- Security requirements (JWT stateless auth, BCrypt passwords)
- Business rules (gift points, free shipping threshold, 48hr cancellation window)
- Tech stack: Spring Boot 3.2, Java 21, Maven, PostgreSQL 18, Flyway

**Output expected:**
- Running REST API on port 8080
- `openapi.yaml` published as contract for other agents
- Flyway migrations V1–V4

---

### Frontend Agent
**Goal:** Build the entire React frontend — all pages, components, API integration, styling.

**Inputs provided:**
- `openapi.yaml` from backend agent (API contract)
- UI wireframe descriptions from PPT slides 5–10
- DTO shapes published by backend agent
- Tech stack: React 18, Vite 5, TailwindCSS 3, Axios, port 5173

**Output expected:**
- 11 pages covering all user journeys from the capstone spec
- Full API integration using `openapi.yaml` as source of truth
- Responsive, modern UI

---

### Testing Agent
**Goal:** Write comprehensive unit and integration tests for the backend.

**Inputs provided:**
- Service layer contracts (method signatures) from backend agent
- Controller endpoint contracts from `openapi.yaml`
- Entity model and repository interfaces
- Test environment spec: H2 in-memory DB, Flyway disabled, isolated JWT secret

**Output expected:**
- Unit tests for all 4 service classes (Mockito)
- Integration tests for Auth and Product controllers (MockMvc)
- All tests passing on `mvn test`

---

## Final Verification Checklist

- [x] Backend builds — `mvn package` SUCCESS
- [x] All 32 tests pass — `mvn test` 0 failures
- [x] Frontend builds — `vite build` 1574 modules, 0 errors
- [x] API endpoints verified via live smoke tests
- [x] 42 books seeded across 4 categories
- [x] JWT auth working (register → login → protected routes)
- [x] Git committed and pushed to GitHub
