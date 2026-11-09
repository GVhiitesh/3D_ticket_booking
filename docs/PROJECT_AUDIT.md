# Project Audit & Baseline Assessment

**Project:** Multi-Tenant Cinema Management & 3D Ticket Booking SaaS Platform  
**Audit Date:** November 5, 2026  
**Auditor:** Lead Software Architect & Full-Stack Engineering Team  
**Reference Document:** `docs/PHASE_0_SPECIFICATION.md` (Consolidated Phase 0.1–0.4 Product Specification)

---

## 1. Executive Summary

A comprehensive audit of the repository located at `c:\Users\G.V.Hiitesh\Desktop\app` was conducted. The current repository contains the codebase of a previous project, **"Apna Bazaar"** (an Indian local grocery mobile application and store management portal).

While the repository contains functional development toolchains, TypeScript configurations, and architectural patterns, the underlying domain models, business logic, schemas, and UI components belong to an entirely different product domain (quick-commerce grocery).

This audit outlines the findings across the monorepo structure, dependencies, database setup, authentication, and evaluates what can be salvaged versus what must be refactored or cleanly architected to build the **Multi-Tenant 3D Cinema Booking SaaS Platform**.

---

## 2. Repository & Monorepo Structure Inspection

### Current Structure:
```
app/
├── apps/
│   ├── admin/               # React 18 + Vite 5 + Tailwind CSS (Grocery admin)
│   └── mobile/              # React Native Expo 51 (Grocery customer app)
├── packages/
│   └── shared/              # Shared TypeScript interfaces & Zod validation schemas
├── services/
│   └── api/                 # Node.js + Express 4 + TypeScript backend
├── docs/
│   ├── PHASE_0_SPECIFICATION.md # Saved authoritative product specification
│   └── PUBLISHING_GUIDE.md  # Grocery app deployment notes
├── package.json             # Root npm workspaces configuration
└── skills-lock.json         # Agent skills lockfile
```

### Key Observations:
1. **Workspaces Configuration:** Root `package.json` defines workspaces (`packages/*`, `services/*`, `apps/*`). This is standard and effective for a modular monorepo.
2. **Current Target Applications:**
   - `apps/mobile`: A React Native Expo mobile app for grocery ordering.  
     *Per Phase 0.3 spec, Native Mobile applications are explicitly out of scope for the MVP.* The Customer Application must be a **responsive desktop and mobile web application**.
   - `apps/admin`: A single-page dashboard built with React + Vite + Tailwind CSS.
3. **Missing Applications:**
   - Dedicated **Customer Web Application** (`apps/customer-web` or `apps/web`) with Three.js / React Three Fiber support.
   - Separate future dashboards for **Cinema Owner Dashboard** and **Super Admin Dashboard**.

---

## 3. Technology Stack & Dependency Audit

| Area | Current Implementation | Target Requirements (Per Spec & Preferred Architecture) | Assessment & Action |
|---|---|---|---|
| **Monorepo / Package Manager** | npm workspaces | npm / pnpm workspaces | **Retain & clean**: Structure works well. |
| **Frontend Framework** | React 18, Vite 5, Tailwind CSS | React, TypeScript, Vite, Tailwind CSS, Lucide icons | **Adopt**: Fast build times, clean DX. |
| **3D Theatre Engine** | None | Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei` | **Missing**: Needs clean integration in customer web app. |
| **Backend Runtime** | Node.js + Express 4 + TypeScript | Node.js + NestJS (or modular Express + TypeScript) | **Evaluate**: NestJS provides enterprise-grade DI, modularity, tenant guards, and native Swagger docs. |
| **Database & ORM** | Mixed: Mongoose (MongoDB) in runtime code, unused Prisma schema for PostgreSQL | PostgreSQL 15+ with Prisma ORM | **Replace**: Deprecate Mongoose runtime; activate PostgreSQL with Prisma migrations. |
| **Real-time / WebSockets** | None | Socket.io / WebSocket for seat lock broadcasts | **Missing**: Must implement real-time seat lock state broadcasts. |
| **In-Memory Cache & Locks** | None | Redis (IORedis) for 10-minute atomic seat holds | **Missing**: Critical for concurrency & high-throughput lock engine. |
| **Payments** | Basic mock UPI / Razorpay SDK listed in package.json | Razorpay SDK (UPI, Cards, Netbanking) with server webhook verification | **Upgrade**: Add strict webhook verification, signature checks, and idempotency keys. |
| **Ticket & QR Code** | None | `qrcode` package with opaque, encrypted/signed ticket verification tokens | **Missing**: Must implement ticket generation & scanner API. |
| **Object Storage** | None | S3-compatible storage (MinIO / AWS S3) for posters, banners, seat layouts | **Missing**: Needed for movie posters and media assets. |

---

## 4. Database Schema & Multi-Tenancy Audit

### Current Database State:
- `services/api/prisma/schema.prisma` contains grocery models (`User`, `Address`, `Category`, `Product`, `Cart`, `CartItem`, `Order`, `Payment`, `Coupon`, `StoreSettings`).
- `services/api/src/index.ts` connects via `mongoose.connect()` to MongoDB on `mongodb://127.0.0.1:27017/apnabazaar`.
- **No multi-tenancy exists.** Models assume a single grocery store entity.

### Multi-Tenancy Requirements from Phase 0.1–0.4:
- Independent cinema companies and multi-branch cinema chains.
- Strict data isolation per cinema company (`TenantId`).
- Hierarchy: `Tenant (Company) -> Branches -> Theatres -> Screens -> Shows -> SeatInventory`.
- Cross-tenant shared identity: **Customers share a unified customer account** across cinemas.
- Operational permissions strictly scoped by tenant and branch assignment.

---

## 5. Security & Authentication Audit

1. **Password Hashing:** Existing codebase uses `bcrypt`, which is good and should be retained.
2. **JWT Authentication:** Existing JWT token implementation only encodes `id` and `role`. It lacks:
   - `tenantId` context for staff/owners.
   - Branch assignment validation.
   - Refresh token rotation.
   - Revocation / session invalidation.
3. **Tenant Boundary Enforcement:** Completely missing; must be implemented as server-side middleware / interceptors.

---

## 6. Reusable Code & Architectural Assets

We can retain and leverage:
1. **Toolchain & Configurations:**
   - Root `package.json` workspaces setup.
   - TypeScript configurations (`tsconfig.json`).
   - Tailwind CSS setup and utility conventions.
2. **Security & Utility Libraries:**
   - `bcrypt` password hashing utilities.
   - `zod` validation architecture in `packages/shared`.
   - `cors`, `helmet`, and request rate-limiting configurations.
3. **Clean Monorepo Organization:**
   - Separating shared contracts into `packages/shared`.
   - Independent service development.

---

## 7. Immediate Recommended Actions

1. **Formalize System Architecture:** Document the target system architecture in `docs/SYSTEM_ARCHITECTURE.md`.
2. **Formalize Technical Decisions:** Document technical choices, database design, and concurrency mechanisms in `docs/TECHNICAL_DECISIONS.md`.
3. **Formulate Customer App Roadmap:** Detail the exact roadmap for Stage 1 (Customer Application) in `docs/IMPLEMENTATION_ROADMAP.md`.
4. **Identify Google Stitch Design Requirements:** Catalog the exact screens, responsive states, design tokens, and 3D UI overlays needed from Google Stitch.
5. **Await User Approval:** Await client sign-off on the architecture and audit before beginning implementation.
