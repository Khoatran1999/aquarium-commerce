# AquaCommerce

> Full-stack e-commerce platform for ornamental fish, built as a **Senior-ready Frontend portfolio** project.

**Live Demo:** [Web Client](https://aquarium-web.vercel.app) · [Admin Panel](https://aquarium-admin.vercel.app) · [API](https://aquarium-api.vercel.app/api/health)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Monorepo (Turborepo + pnpm)         │
│                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │  web-client  │ │ admin-panel  │ │   api-server     │ │
│  │  React + TS  │ │  React + TS  │ │ Express + Prisma │ │
│  │  :3000       │ │  :3002       │ │ :3001            │ │
│  └──────┬───────┘ └──────┬───────┘ └────────┬─────────┘ │
│         │                │                   │           │
│         └────────┬───────┘                   │           │
│                  │                           │           │
│  ┌───────────────▼───────────────┐           │           │
│  │     Shared Packages           │           │           │
│  │  ┌────┐ ┌─────┐ ┌────────┐   │           │           │
│  │  │ ui │ │hooks│ │services│   │           │           │
│  │  └────┘ └─────┘ └────────┘   │           │           │
│  │  ┌─────┐                     │           │           │
│  │  │types│─────────────────────┼───────────┘           │
│  │  └─────┘                     │                       │
│  └───────────────────────────────┘                       │
│                                                         │
│                    PostgreSQL (Supabase)                 │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer         | Technology                                             |
| ------------- | ------------------------------------------------------ |
| **Monorepo**  | Turborepo, pnpm workspaces                             |
| **Frontend**  | React 19, TypeScript, Vite 6, SWC                      |
| **Styling**   | Tailwind CSS 4, custom aqua theme                      |
| **State**     | Redux Toolkit, Redux Persist, TanStack Query v5        |
| **Forms**     | React Hook Form + Zod validation                       |
| **Routing**   | React Router v7                                        |
| **Animation** | Framer Motion                                          |
| **Icons**     | Lucide React                                           |
| **Charts**    | Recharts (admin)                                       |
| **Backend**   | Node.js, Express, TypeScript                           |
| **ORM**       | Prisma 6 with PostgreSQL                               |
| **Auth**      | JWT (bcrypt + jsonwebtoken)                            |
| **Security**  | Helmet, CORS, Zod schema validation, role-based access |
| **Database**  | PostgreSQL on Supabase                                 |
| **Testing**   | Vitest, Testing Library                                |
| **CI/CD**     | Turborepo pipelines, Vercel deployment                 |
| **Tooling**   | ESLint 9 (flat config), Prettier, TypeScript 5.7       |

---

## Project Structure

```
aquarium-commerce/
├── apps/
│   ├── web-client/          # Customer-facing shop (port 3000)
│   │   ├── src/
│   │   │   ├── components/  # UI components (Header, Footer, ProductCard, etc.)
│   │   │   ├── pages/       # Route pages (Home, Products, Cart, Checkout, etc.)
│   │   │   ├── hooks/       # App-specific hooks (useProducts, useReviews, etc.)
│   │   │   ├── store/       # Redux slices (auth, cart, ui)
│   │   │   └── layouts/     # RootLayout with Header/Footer
│   │   └── package.json
│   │
│   ├── admin-panel/         # Admin dashboard (port 3002)
│   │   ├── src/
│   │   │   ├── components/  # Admin UI (DataTable, StatsCard, ConfirmDialog)
│   │   │   ├── pages/       # Dashboard, Products, Orders, Species, Inventory
│   │   │   ├── store/       # Admin auth + UI state
│   │   │   └── layouts/     # AdminLayout with sidebar
│   │   └── package.json
│   │
│   └── api-server/          # REST API (port 3001)
│       ├── prisma/
│       │   ├── schema.prisma  # 11 models, 6 enums
│       │   └── seed.ts        # 50 products, 20 species, demo users
│       ├── src/
│       │   ├── routes/      # auth, products, species, cart, orders, reviews, admin
│       │   ├── services/    # Business logic layer
│       │   ├── middleware/   # auth, validation, error handling
│       │   ├── schemas/     # Zod request schemas
│       │   └── config/      # Prisma client, JWT config
│       └── package.json
│
├── packages/
│   ├── ui/                  # 29 shared components (Button, Card, Badge, DataTable, etc.)
│   ├── hooks/               # Shared hooks (useDebounce, useLocalStorage, useMediaQuery, etc.)
│   ├── services/            # API client services (auth, products, cart, orders, admin, ai)
│   └── types/               # Shared TypeScript types & interfaces
│
├── turbo.json               # Pipeline config (dev, build, lint, type-check, test)
├── tsconfig.base.json       # Shared TS config
├── vitest.config.ts         # Root test config
└── package.json             # Root scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9 (`npm install -g pnpm`)
- **PostgreSQL** database (or [Supabase](https://supabase.com) free tier)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/aquarium-commerce.git
cd aquarium-commerce
pnpm install
```

### 2. Environment Setup

**API Server** — create `apps/api-server/.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
DIRECT_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-secret-key-min-32-chars"
CORS_ORIGINS="http://localhost:3000,http://localhost:3002"
PORT=3001
NODE_ENV=development
```

**Web Client** — create `apps/web-client/.env`:

```env
VITE_API_URL=http://localhost:3001
```

**Admin Panel** — create `apps/admin-panel/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Database Setup

```bash
cd apps/api-server

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed demo data (50 products, 20 species, sample users)
pnpm db:seed
```

### 4. Run Development

```bash
# From root — starts all apps in parallel
pnpm dev
```

| App         | URL                   |
| ----------- | --------------------- |
| Web Client  | http://localhost:3000 |
| API Server  | http://localhost:3001 |
| Admin Panel | http://localhost:3002 |

### 5. Demo Accounts

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| Admin | admin@aqualuxe.vn | admin123 |
| User  | user@aqualuxe.vn  | user123  |
| User  | fishfan@gmail.com | user123  |

---

## Available Scripts

```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Production build (all apps)
pnpm lint             # ESLint across all packages
pnpm test             # Run all Vitest tests
pnpm test:coverage    # Tests with coverage report
pnpm format           # Prettier format all files
pnpm format:check     # Check formatting
pnpm clean            # Remove all dist/ and node_modules/
```

---

## API Reference

**Base URL:** `http://localhost:3001/api`

### Authentication

| Method | Endpoint         | Auth | Description              |
| ------ | ---------------- | ---- | ------------------------ |
| POST   | `/auth/register` | No   | Register new account     |
| POST   | `/auth/login`    | No   | Login, returns JWT token |
| GET    | `/auth/me`       | Yes  | Get current user profile |
| PUT    | `/auth/profile`  | Yes  | Update profile           |

### Products (Public)

| Method | Endpoint                | Auth     | Description                         |
| ------ | ----------------------- | -------- | ----------------------------------- |
| GET    | `/products`             | No       | List with pagination, filters, sort |
| GET    | `/products/:slug`       | Optional | Product detail by slug              |
| GET    | `/products/:id/related` | No       | Related products (same species)     |

**Query Params for `/products`:**

- `page`, `limit` — Pagination (default: page=1, limit=20)
- `species` — Filter by species ID
- `waterType` — FRESHWATER, SALTWATER, BRACKISH
- `careLevel` — EASY, MODERATE, HARD, EXPERT
- `minPrice`, `maxPrice` — Price range
- `search` — Full-text search
- `sort` — `price_asc`, `price_desc`, `rating`, `newest`, `popular`

### Species (Public)

| Method | Endpoint       | Auth | Description      |
| ------ | -------------- | ---- | ---------------- |
| GET    | `/species`     | No   | List all species |
| GET    | `/species/:id` | No   | Species detail   |

### Cart

| Method | Endpoint              | Auth | Description          |
| ------ | --------------------- | ---- | -------------------- |
| GET    | `/cart`               | Yes  | Get user's cart      |
| POST   | `/cart/items`         | Yes  | Add item to cart     |
| PUT    | `/cart/items/:itemId` | Yes  | Update item quantity |
| DELETE | `/cart/items/:itemId` | Yes  | Remove item          |
| DELETE | `/cart`               | Yes  | Clear entire cart    |

### Orders

| Method | Endpoint             | Auth | Description        |
| ------ | -------------------- | ---- | ------------------ |
| POST   | `/orders`            | Yes  | Place new order    |
| GET    | `/orders`            | Yes  | List user's orders |
| GET    | `/orders/:id`        | Yes  | Order detail       |
| PUT    | `/orders/:id/cancel` | Yes  | Cancel order       |

### Reviews

| Method | Endpoint                      | Auth | Description           |
| ------ | ----------------------------- | ---- | --------------------- |
| GET    | `/reviews/product/:productId` | No   | Reviews for a product |
| POST   | `/reviews`                    | Yes  | Submit a review       |

### Admin (requires ADMIN role)

| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| GET    | `/admin/stats`                | Dashboard stats & analytics |
| GET    | `/admin/products`             | List all products           |
| POST   | `/admin/products`             | Create product              |
| PUT    | `/admin/products/:id`         | Update product              |
| DELETE | `/admin/products/:id`         | Delete product              |
| GET    | `/admin/species`              | List all species            |
| POST   | `/admin/species`              | Create species              |
| PUT    | `/admin/species/:id`          | Update species              |
| GET    | `/admin/orders`               | List all orders             |
| GET    | `/admin/orders/:id`           | Order detail                |
| PUT    | `/admin/orders/:id/status`    | Update order status         |
| POST   | `/admin/products/:id/restock` | Restock inventory           |
| GET    | `/admin/inventory-logs`       | Inventory audit logs        |
| GET    | `/admin/users`                | List all users              |

**Authentication:** Include JWT token in header:

```
Authorization: Bearer <token>
```

---

## Data Models

```
User ──── Cart ──── CartItem ──── Product ──── FishSpecies
  │                                  │              │
  ├── Order ──── OrderItem ──────────┘         FishImage
  │
  ├── Review ────────────────────────┘
  │
  └── AiChatSession ──── AiChatMessage
```

| Model         | Key Fields                                              |
| ------------- | ------------------------------------------------------- |
| User          | email, name, role (USER/ADMIN), password                |
| FishSpecies   | name, scientificName, careLevel, waterType, temperament |
| Product       | name, slug, price, size, available, avgRating           |
| Cart/CartItem | userId → cartId → productId, quantity, price            |
| Order         | status (7 states), subtotal, shippingFee, total         |
| Review        | userId + productId (unique), rating, comment            |
| InventoryLog  | productId, action (ADD/RESERVE/SELL/...), quantity      |

---

## Key Features

### Web Client

- Product listing with advanced filters (species, water type, care level, price range)
- Product detail with image gallery, reviews, related products
- Shopping cart with quantity management
- Multi-step checkout with form validation
- Order history & tracking
- User authentication & profile management
- Responsive mobile-first design
- SEO-friendly with React Helmet
- Smooth page transitions with Framer Motion

### Admin Panel

- Dashboard with revenue analytics & charts
- Product CRUD with species management
- Order management with status workflow
- Inventory tracking with restock & audit logs
- User management

### Backend

- RESTful API with 30 endpoints
- JWT authentication with role-based access
- Zod schema validation on all inputs
- Prisma ORM with optimized queries & indexes
- Graceful error handling with structured responses
- Gzip compression & security headers

---

## Performance Optimizations

- **Database:** Strategic composite indexes, `select` over `include` for list views
- **API:** Gzip compression, connection pooling, pagination on all list endpoints
- **Frontend:** Code splitting, lazy-loaded routes, React.memo where beneficial
- **Bundle:** Tree-shaking, SWC for fast compilation, Vite chunk optimization
- **Images:** Unsplash CDN with optimized dimensions (`w=600&h=600&fit=crop`)

---

## Tech Decisions

| Decision                       | Reasoning                                                    |
| ------------------------------ | ------------------------------------------------------------ |
| Turborepo monorepo             | Shared code, single dependency tree, parallel task execution |
| React 19 + Vite 6              | Latest features, fast HMR, SWC compilation                   |
| Redux Toolkit + TanStack Query | Server state (TQ) + client state (Redux) separation          |
| Prisma over raw SQL            | Type-safe queries, migrations, studio for debugging          |
| JWT over session-based auth    | Stateless, works across origins, simpler for SPA             |
| Zod for validation             | Shared schemas between frontend forms and backend API        |
| pnpm over npm/yarn             | Faster installs, disk-efficient, strict dependency hoisting  |
| Tailwind CSS 4                 | Utility-first, design tokens, zero runtime CSS               |

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment guides:

- **Frontend** → Vercel (zero-config)
- **API Server** → Vercel Functions / Railway
- **Database** → Supabase PostgreSQL

---

Kill port Terminal CMD

for %p in (3000 3001 3002 3003) do @for /f "tokens=5" %a in ('netstat -ano ^| findstr :%p') do taskkill /PID %a /F

## License

MIT
