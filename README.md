# AiCruzz — AI Video Creation SaaS Platform

A full-stack monorepo SaaS platform built with **Next.js 14**, **Node.js + Express**, and **PostgreSQL**.

---

## 📁 Project Structure

```
aicruzz/
├── apps/
│   ├── web/                    # Next.js 14 frontend (App Router)
│   └── api/                    # Node.js + Express + TypeScript backend
├── packages/
│   └── types/                  # Shared TypeScript interfaces
├── docker-compose.yml          # Local PostgreSQL via Docker
├── package.json                # Root dev scripts (concurrently)
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites

| Tool       | Version  |
|------------|----------|
| Node.js    | ≥ 18.x   |
| npm        | ≥ 9.x    |
| Docker     | any      |
| PostgreSQL | 15 (via Docker or local) |

---

### 2. Clone & Install

```bash
git clone https://github.com/yourname/aicruzz.git
cd aicruzz

# Install root + all app dependencies
npm run install:all
```

---

### 3. Set Up Environment Variables

**Backend (`apps/api/.env`):**
```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/aicruzz
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (`apps/web/.env.local`):**
```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

### 4. Start PostgreSQL (Docker)

```bash
# Start Postgres — schema is auto-applied on first run
docker compose up -d

# Verify it's running
docker compose ps
```

> The `schema.sql` is mounted at `/docker-entrypoint-initdb.d/` so the database
> and all tables are created automatically on first start.

**If you prefer a local PostgreSQL installation:**
```bash
psql -U postgres -c "CREATE DATABASE aicruzz;"
psql -U postgres -d aicruzz -f apps/api/schema.sql
```

---

### 5. Run the Full Stack

```bash
# Start both API + Web together
npm run dev
```

Or run them individually:

```bash
npm run dev:api     # Express API  → http://localhost:4000
npm run dev:web     # Next.js app  → http://localhost:3000
```

---

## 🌐 App URLs

| Service    | URL                          |
|------------|------------------------------|
| Web App    | http://localhost:3000        |
| API Server | http://localhost:4000        |
| API Health | http://localhost:4000/health |

---

## 📄 Pages

### Marketing
| Route        | Description      |
|--------------|------------------|
| `/`          | Homepage         |
| `/features`  | Features         |
| `/pricing`   | Pricing plans    |
| `/api-docs`  | API reference    |
| `/blog`      | Blog             |
| `/about`     | About page       |
| `/contact`   | Contact form     |

### Auth
| Route               | Description       |
|---------------------|-------------------|
| `/login`            | Login form        |
| `/signup`           | Registration form |
| `/forgot-password`  | Password reset    |

### Dashboard (requires login)
| Route                    | Description         |
|--------------------------|---------------------|
| `/dashboard`             | Overview + stats    |
| `/dashboard/create`      | Text → Video        |
| `/dashboard/avatar`      | Avatar videos       |
| `/dashboard/animation`   | Animation Studio    |
| `/dashboard/videos`      | My Videos           |
| `/dashboard/templates`   | Templates library   |
| `/dashboard/billing`     | Billing & plan      |
| `/dashboard/api-keys`    | API key management  |
| `/dashboard/settings`    | Profile & prefs     |

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:4000`

### Auth
```
POST   /api/v1/auth/register     Register new user
POST   /api/v1/auth/login        Login → returns JWT
GET    /api/v1/auth/me           Get current user  [🔒 auth]
PATCH  /api/v1/auth/me           Update profile    [🔒 auth]
```

### Videos
```
GET    /api/v1/videos            List videos       [🔒 auth]
POST   /api/v1/videos/generate   Queue video job   [🔒 auth]
GET    /api/v1/videos/:id        Get video         [🔒 auth]
GET    /api/v1/videos/:id/status Poll job status   [🔒 auth]
DELETE /api/v1/videos/:id        Delete video      [🔒 auth]
```

**Auth header format:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Flow

1. User POSTs to `/api/v1/auth/login` or `/api/v1/auth/register`
2. Server returns `{ token, user }`
3. Frontend stores token in `localStorage` via `lib/auth.ts → setToken()`
4. Axios interceptor in `lib/api.ts` auto-attaches `Authorization: Bearer <token>` on every request
5. On 401 response, token is cleared and user is redirected to `/login`
6. Dashboard layout (`app/(dashboard)/layout.tsx`) guards all protected routes

---

## 🗄️ Database Schema

Located at `apps/api/schema.sql`. Tables:

| Table           | Purpose                            |
|-----------------|------------------------------------|
| `users`         | User accounts + plan info          |
| `videos`        | Video generation records           |
| `api_keys`      | User API key management            |
| `jobs`          | AI worker job queue mirror         |
| `subscriptions` | Stripe subscription records        |
| `invoices`      | Billing history                    |

---

## 📦 Tech Stack

| Layer       | Technology                         |
|-------------|------------------------------------|
| Frontend    | Next.js 14, React 18, TypeScript   |
| Styling     | Custom CSS (no Tailwind)           |
| API Client  | Axios                              |
| Backend     | Node.js, Express, TypeScript       |
| Database    | PostgreSQL 15                      |
| Auth        | JWT (jsonwebtoken) + bcryptjs      |
| Dev runner  | concurrently + ts-node-dev         |

---

## 🚧 Not Yet Implemented (Phase 2)

- [ ] Python AI workers (text-to-video, avatar, animation)
- [ ] AWS S3 video storage
- [ ] Redis + Bull job queue
- [ ] Stripe billing integration
- [ ] Google OAuth
- [ ] Email (password reset, notifications)
- [ ] Admin panel routes
- [ ] API key routes (backend controller)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'feat: add my feature'`
4. Push and open a PR

---

*AiCruzz Platform v1.0 — SaaS Foundation*
