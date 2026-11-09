# CINEVA - 3D Cinema Management & Ticket Booking SaaS Platform

A modern, multi-tenant 3D cinema booking SaaS platform featuring an interactive Three.js auditorium, real-time seat locks, and digital QR ticket verification.

---

## 🏗️ Architecture & Structure

```
cinema-ticket-booking/
├── apps/
│   └── customer-web/          # React + Vite + Three.js 3D customer ticket booking app (Port 3000)
├── services/
│   └── api/                   # Express + TypeScript cinema REST API & Prisma Engine (Port 5000)
├── packages/
│   └── shared/                # Cinema domain types, Zod schemas, and layout contracts
└── docs/                      # Architectural specifications and Phase 0.1-0.4 roadmap
```

---

## 🚀 Running the Project

### 1. Start Cinema API
```bash
cd services/api
npm install
npm run dev
```

### 2. Start Customer Web App (3D Interactive Booking)
```bash
cd apps/customer-web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
