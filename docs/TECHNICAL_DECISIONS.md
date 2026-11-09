# Technical Decisions & Architectural Trade-offs

**Project:** Multi-Tenant Cinema Management & 3D Ticket Booking SaaS Platform  
**Document Version:** 1.0  
**Status:** Under Client Review  
**Reference Document:** `docs/PHASE_0_SPECIFICATION.md`

---

## 1. Decision Log (Architecture Decision Records)

### ADR-001: Backend Architecture & Framework Selection
- **Status:** Proposed
- **Context:** The system requires enterprise-grade multi-tenancy, strict authorization barriers, transactional booking integrity, real-time WebSockets, and clean separation of concerns. The prompt prefers NestJS unless the existing backend makes another choice more appropriate. The current backend is a simple Express 4 JavaScript/TypeScript server with Mongoose and an unused Prisma schema.
- **Decision:** Adopt a **Modular Clean Service Architecture in Node.js/TypeScript** (either NestJS or Modular Express + Zod + Inversify/TSyringe).
- **Rationale:**
  - NestJS provides built-in dependency injection, modular encapsulation (TenantModule, SeatModule, BookingModule, PaymentModule), native Guard/Interceptor patterns for multi-tenant isolation, and automated OpenAPI/Swagger generation.
  - If retaining Express for low-overhead simplicity, we will structure it with strict Controller-Service-Repository layers and typed middleware pipelines.
- **Trade-offs:** NestJS adds a slight learning curve and decorator syntax overhead, but drastically improves maintainability and prevents architectural spaghetti across multiple developers.

---

### ADR-002: Authoritative Database — PostgreSQL (Prisma ORM) vs MongoDB
- **Status:** Approved
- **Context:** The existing repo contains Mongoose models for grocery, but ticket booking SaaS demands ACID transactional guarantees, foreign key integrity, row-level locks, and strict audit trails.
- **Decision:** Standardize exclusively on **PostgreSQL 15+ using Prisma ORM**. Completely retire the legacy MongoDB / Mongoose runtime.
- **Rationale:**
  - Double booking cannot be prevented purely in application memory or eventual-consistency document stores under high-concurrency loads.
  - PostgreSQL provides `SERIALIZABLE` isolation, `SELECT ... FOR UPDATE` row locks, and partial unique indexes (`UNIQUE (show_id, seat_code)`).
  - Prisma generates type-safe database queries synchronized directly with TypeScript models.
- **Trade-offs:** Requires running a PostgreSQL instance (easily provided via Docker for local dev and cloud RDS/Supabase/Neon for production).

---

### ADR-003: Two-Tier Concurrency & Seat Locking Engine
- **Status:** Approved
- **Context:** When a movie ticket opens (blockbuster release), hundreds of customers may click the same seat simultaneously. The system must guarantee:
  1. Sub-millisecond response times for seat selection feedback.
  2. Exactly one customer gets the hold.
  3. Automatic release after 10 minutes if unpaid.
  4. Absolute zero double-booking across online and box-office counter sales.
- **Decision:** Implement a **Two-Tier Locking Engine**:
  1. **Tier 1 (In-Memory Redis Fast Lock):** `SET seat_hold:{showId}:{seatCode} {userId} NX EX 600` provides instantaneous atomic mutual exclusion.
  2. **Tier 2 (PostgreSQL Transactional Lock):** Once Redis approves the atomic hold, a database transaction sets `status = 'HELD'`, assigns `heldByUserId`, and sets `holdExpiresAt = NOW() + INTERVAL '10 minutes'`.
  3. **Event Broadcast:** Emits `seat_locked` event to the show's Socket.IO room so all active browsers see the seat turn yellow/grey immediately.
- **Trade-offs:** Requires Redis dependency. If Redis is temporarily unavailable, PostgreSQL can fall back as the authoritative lock provider via `FOR UPDATE SKIP LOCKED`.

---

### ADR-004: 3D Auditorium Rendering Engine & 2D Fallback
- **Status:** Approved
- **Context:** 3D theatre exploration is the key product differentiator. However, rendering hundreds of individual seats with complex geometries can bottleneck mobile GPUs. In addition, users with accessibility requirements or disabled WebGL need a functional booking experience.
- **Decision:**
  - Use **Three.js + React Three Fiber (R3F) + `@react-three/drei`**.
  - Use `InstancedMesh` for rendering seats: 500 seats are rendered in **1 single draw call**, keeping frame rates pegged at 60 FPS.
  - Seat interactions (clicks, hover highlights) are handled via R3F raycasting.
  - Provide a toggleable **Responsive 2D Seating Grid Fallback** (SVG/CSS Grid) rendered from the same layout JSON so customers on lower-end devices or screen-readers can seamlessly book.
- **Trade-offs:** 3D asset overhead is avoided by generating seating procedurally from layout data rather than loading heavy static GLTF files.

---

### ADR-005: Multi-Tenant Customer Identity Architecture
- **Status:** Approved (Per Phase 0.1 & Phase 0.2 Specification)
- **Context:** Should customers create a separate account for every cinema chain they visit, or have a unified identity?
- **Decision:** **Unified Customer Identity across cinemas**, with **strictly isolated Tenant operations**.
  - A customer registers once and can book tickets at Cinema Chain A or Cinema Chain B.
  - Cinema Owners, Branch Managers, and Theatre Staff belong to specific `tenant_id` records and can only access data belonging to their company/branch.
  - Server middleware enforces:
    - If user is `CUSTOMER`, they can access only bookings where `customer_id == user.id`.
    - If user is `CINEMA_OWNER` or `BRANCH_MANAGER`, database queries are automatically filtered by `tenant_id == user.tenant_id`.
- **Trade-offs:** Simplifies customer onboarding dramatically, paving the way for the future Version 3 Centralized Marketplace.

---

### ADR-006: Payment Idempotency & QR Ticket Verification
- **Status:** Approved
- **Context:** Payment callbacks, webhooks, or browser refreshes can fire multiple times. Duplicate tickets or charges must never happen.
- **Decision:**
  - **Idempotency Keys:** Every checkout attempt receives a client/server-generated idempotency key and Razorpay `order_id`. Webhook handlers verify `payment_id` against database unique indexes before updating booking state.
  - **Cryptographic QR Tokens:** Ticket QR codes encode `TKT:<ticketId>:<HMAC_SHA256(ticketId + secret)>`. When scanned, the backend verifies signature and status (`ACTIVE` -> `CHECKED_IN`) atomically.
- **Trade-offs:** Requires an internal signing secret; completely prevents forgeable QR codes.

---

### ADR-007: Existing "Apna Bazaar" Codebase Transition Strategy
- **Status:** Proposed
- **Context:** The repository currently houses "Apna Bazaar" (grocery app).
- **Decision:**
  - **Preserve working tools:** Keep monorepo setup, typescript configs, and package manager infrastructure.
  - **Archive Grocery Code:** Move the grocery app files into an `archive/apna-bazaar/` directory or isolate it so no existing work is deleted, while giving the cinema SaaS clean workspaces:
    - `apps/customer-web/`: The 3D Cinema Customer Web Application.
    - `packages/shared/`: Cinema SaaS shared types, schemas, and DTOs.
    - `services/api/`: Cinema SaaS Backend with PostgreSQL Prisma schema.
  - **Never Delete Existing Code Without Explanation:** As mandated by Stage 0 guidelines, existing code is preserved cleanly.
