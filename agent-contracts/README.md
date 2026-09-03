# Multi-Agent Architecture — Laval Books Capstone

This folder documents how the Laval Books project was built using **3 specialised IBM BOB subagents** orchestrated by a central agent.

Each agent had a clearly defined responsibility and communicated with the others through **contracts** — shared documents that defined the boundaries between systems.

---

## Agent Overview

```
┌─────────────────────────────────────────────────────────┐
│                  ORCHESTRATOR AGENT                     │
│              (IBM BOB — Main Session)                   │
│  Reads capstone spec → breaks into 3 agent workstreams  │
└──────────┬──────────────────┬──────────────────┬────────┘
           │                  │                  │
    CONTRACT:           CONTRACT:          CONTRACT:
    OpenAPI spec        OpenAPI spec       OpenAPI spec
    DB schema           UI wireframes      Entity model
           │                  │                  │
           ▼                  ▼                  ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  BACKEND AGENT   │  │  FRONTEND AGENT  │  │  TESTING AGENT   │
│                  │  │                  │  │                  │
│ Spring Boot 3.2  │  │ React 18 + Vite  │  │ JUnit 5 + Mockito│
│ PostgreSQL       │  │ TailwindCSS 3    │  │ MockMvc + H2     │
│ JWT Security     │  │ Axios + Contexts │  │ Integration Tests│
│ Flyway Migrations│  │ 11 Pages         │  │ 32 Test Cases    │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Contracts Folder Structure

```
agent-contracts/
├── README.md                          ← This file (architecture overview)
├── 00-orchestrator-brief.md           ← Master brief given to all agents
├── backend-agent/
│   ├── requirements.md                ← What the backend agent was tasked with
│   ├── deliverables.md                ← What it delivered
│   └── api-contract.yaml              ← OpenAPI spec (source of truth)
├── frontend-agent/
│   ├── requirements.md                ← What the frontend agent was tasked with
│   ├── deliverables.md                ← What it delivered
│   └── ui-contract.md                 ← DTO shapes + page-to-API mapping
└── testing-agent/
    ├── requirements.md                ← What the testing agent was tasked with
    ├── deliverables.md                ← What it delivered
    └── test-contract.md               ← Test coverage matrix
```

---

## How Agents Communicated

### Step 1 — Orchestrator reads the spec
The orchestrator agent read the capstone PPT (`AI Specialist - Cloud FullStack - Capstone instructions.pptx`) and `IBM_BOB_PROMPTS.md`, then produced the **master brief** (`00-orchestrator-brief.md`) and split work into 3 streams.

### Step 2 — Backend Agent builds the API
- Received: DB schema requirements, OpenAPI spec template, security rules
- Produced: 40+ Java files, 4 Flyway migrations, `openapi.yaml`
- Published contract: DTO shapes + endpoint paths for the other agents to consume

### Step 3 — Frontend Agent builds the UI
- Received: `openapi.yaml` + DTO shapes from backend agent + wireframe descriptions
- Used `openapi.yaml` as the **single source of truth** for all Axios API calls
- Never needed to read backend Java code — only the contract

### Step 4 — Testing Agent writes tests
- Received: Entity model + service signatures from backend agent + `openapi.yaml`
- Wrote unit tests against service contracts (Mockito mocks)
- Wrote integration tests against controller contracts (MockMvc + H2)
- Reported back: 32 tests, 0 failures

---

## Contract Files Index

| Contract | Produced by | Consumed by |
|---|---|---|
| `openapi.yaml` | Orchestrator + Backend | Frontend, Testing |
| `V1__init_schema.sql` | Backend Agent | Testing Agent (H2 schema) |
| DTO records in `dto/` | Backend Agent | Frontend Agent |
| `application-test.properties` | Testing Agent | Testing Agent only |
| UI wireframes (PPT slides 5-10) | Orchestrator | Frontend Agent |
