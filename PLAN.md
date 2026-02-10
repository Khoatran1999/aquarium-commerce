# AquaCommerce – Kế hoạch triển khai chi tiết

> **Dự án:** AquaCommerce – E-commerce bán cá cảnh  
> **Mục tiêu:** Portfolio Frontend cấp Middle → Senior-ready  
> **Thời gian dự kiến:** 11–12 ngày  
> **Ngày bắt đầu:** 08/02/2026

> [!IMPORTANT]
> **Code Convention:** ALL code must be written in English — including variable names, function names, comments, error messages, success messages, validation messages, UI text, seed data, and aria-labels. Vietnamese is only used for planning documents and task discussions.

---

## Tổng quan Phases

```
Phase 0  ─── Monorepo Setup ──────────────────── 0.5 ngày  🔴 Critical
Phase 1  ─── Database & Backend Core ─────────── 1.5 ngày  🔴 Critical
Phase 2  ─── Shared Packages ─────────────────── 1.0 ngày  🔴 Critical
Phase 3  ─── Web Client – Layout & Auth ──────── 1. 0 ngày  🔴 Critical
Phase 4  ─── Web Client – Core Features ──────── 2.0 ngày  🔴 Critical
Phase 5  ─── Admin Dashboard ─────────────────── 2.0 ngày  🟡 High
Phase 6  ─── Polish & UX ────────────────────── 1.0 ngày  🟢 Medium
Phase 7  ─── Testing & CI/CD ─────────────────── 1.0 ngày  🟢 Medium
Phase 8  ─── Documentation & Final ───────────── 0.5 ngày  🟢 Medium
```

---

## Dependency Graph

```
Phase 0 (Monorepo)
  │
  ├──→ Phase 1 (Backend) ────────────────────┐
  │                                           │
  ├──→ Phase 2 (Shared Packages) ─────────────┤
  │                                           │
  │    ┌──────────────────────────────────────┘
  │    │
  │    ├──→ Phase 3 (Client Layout & Auth)
  │    │       │
  │    │       └──→ Phase 4 (Client Core Features)
  │    │               │
  │    │               └──→ Phase 5 (Admin Dashboard)
  │    │
  │    └──→ Phase 5 (Admin Dashboard)
  │
  └──→ Phase 6 (Polish) ←── Phase 4 + Phase 5
    │
    └──→ Phase 7 (CI/CD & Testing) ←── tất cả phases
      │
      └──→ Phase 8 (Docs) ←── cuối cùng
```

---

## PHASE 0: Khởi tạo Monorepo & Cấu hình cơ sở

**Thời gian:** 0.5 ngày (Ngày 1)  
**Mục tiêu:** Monorepo hoạt động với tất cả apps & packages scaffold xong

### Tasks

| #    | Task                        | Chi tiết                                                                                                                    | Output                                    |
| ---- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 0.1  | Khởi tạo monorepo Turborepo | `pnpm init`, `turbo.json`, workspace config trong `pnpm-workspace.yaml`                                                     | Root `package.json`, `turbo.json`         |
| 0.2  | Scaffold `apps/web-client`  | Copy from `/template` → `apps/web-client` (use provided Vite+React template), update package.json/env as needed             | Chạy được `pnpm dev --filter web-client`  |
| 0.2a | Apply templates             | Copy shared templates from `/template` into each target app, run initial install & build to verify structure                | Apps scaffolded from templates            |
| 0.3  | Scaffold `apps/admin-panel` | Copy from `/template` → `apps/admin-panel` (use provided Vite+React admin template), update package.json/env as needed      | Chạy được `pnpm dev --filter admin-panel` |
| 0.4  | Scaffold `apps/api-server`  | Copy from `/template` → `apps/api-server` (Node + Express template, includes `tsx` dev runner), update env and start script | Chạy được `pnpm dev --filter api-server`  |
| 0.5  | Tạo `packages/ui`           | Shared UI package, Shadcn UI base setup                                                                                     | Export được components                    |
| 0.6  | Tạo `packages/hooks`        | Shared hooks package                                                                                                        | Export được hooks                         |
| 0.7  | Tạo `packages/services`     | Shared API client package                                                                                                   | Export được service functions             |
| 0.8  | Tạo `packages/types`        | Shared types                                                                                                                | Export được types/interfaces              |
| 0.9  | Cấu hình chung              | `tsconfig.base.json`, ESLint flat config, Prettier, `.env.example`                                                          | Lint + format chạy được                   |
| 0.10 | Cấu hình Tailwind CSS       | Shared Tailwind config, theme tokens (colors, fonts, spacing cho aqua theme)                                                | Tailwind build OK                         |
| 0.11 | Cấu hình Shadcn UI          | Theme customization, CSS variables cho aqua palette                                                                         | Components render đúng theme              |

### Cấu trúc thư mục sau Phase 0

```
aquarium-commerce/
├── apps/
│   ├── web-client/          # Vite + React + TS
│   │   ├── src/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── admin-panel/         # Vite + React + TS
│   │   ├── src/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── api-server/          # Node + Express + TS
│       ├── src/
│       ├── prisma/
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── ui/                  # Shared components
│   │   ├── src/
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── hooks/               # Shared hooks
│   │   ├── src/
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── services/            # API clients
│   │   ├── src/
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── types/               # Shared types
│       ├── src/
│       ├── tsconfig.json
│       └── package.json
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── .eslintrc.js
├── .prettierrc
├── .env.example
├── .gitignore
└── README.md
```

### Definition of Done

- [ ] `pnpm install` thành công
- [ ] `pnpm dev` chạy được cả 3 apps
- [ ] `pnpm lint` không lỗi
- [ ] Packages import được từ apps
- [ ] Tailwind + Shadcn render đúng

---

## PHASE 1: Database & Backend Core

**Thời gian:** 1.5 ngày (Ngày 2–3)  
**Mục tiêu:** API server hoạt động đầy đủ CRUD, auth, inventory logic  
**Phụ thuộc:** Phase 0

### 1A – Database Setup (Ngày 2 sáng)

| #   | Task                   | Chi tiết                                                     |
| --- | ---------------------- | ------------------------------------------------------------ |
| 1.1 | Setup Supabase project | Tạo project trên Supabase, lấy connection string, API keys   |
| 1.2 | Prisma schema          | Toàn bộ 14 entities (xem bên dưới)                           |
| 1.3 | Migration              | `prisma migrate dev` → tạo tables                            |
| 1.4 | Seed data              | Script seed: 20+ loài cá, 50+ products, sample users, orders |

### Prisma Schema – Entities

```prisma
// Core entities cần triển khai:
users              // id, email, name, role(user/admin), avatar, supabase_id
fish_species       // id, name, scientific_name, description, care_level, temperament,
                   // min_tank_size, water_type, min_temp, max_temp, min_ph, max_ph
fish_images        // id, fish_species_id, url, alt_text, is_primary, sort_order
fish_batches       // id, fish_species_id, batch_code, origin, arrival_date, quantity, cost_price
inventory          // id, fish_batch_id, status(available/reserved/sold), quantity
products           // id, fish_species_id, name, slug, description, price, compare_price,
                   // size(S/M/L/XL), is_active, created_at
carts              // id, user_id, created_at, updated_at
cart_items          // id, cart_id, product_id, quantity, reserved_at
orders             // id, user_id, status(pending/confirmed/processing/shipping/delivered/cancelled),
                   // total, shipping_address, phone, note, created_at
order_items        // id, order_id, product_id, quantity, price
inventory_logs     // id, product_id, action(add/reserve/release/sell), quantity, reference_id, created_at
reviews            // id, user_id, product_id, rating(1-5), comment, created_at
ai_chat_sessions   // id, user_id, title, created_at
ai_chat_messages   // id, session_id, role(user/assistant), content, created_at
```

### 1B – Express Server & APIs (Ngày 2 chiều – Ngày 3)

| #    | Task                   | Endpoints                                                                                    |
| ---- | ---------------------- | -------------------------------------------------------------------------------------------- |
| 1.5  | Server base setup      | Express app, CORS, error handler, request logger                                             |
| 1.6  | Auth middleware        | Supabase JWT verify → `req.user`, role guard middleware                                      |
| 1.7  | Products API           | `GET /products` (filter, sort, paginate), `GET /products/:slug`, `GET /products/:id/reviews` |
| 1.8  | Cart API               | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id`           |
| 1.9  | Checkout & Orders API  | `POST /orders` (cart → order + inventory update), `GET /orders`, `GET /orders/:id`           |
| 1.10 | Reviews API            | `POST /reviews`, `GET /reviews?product_id=`, `DELETE /reviews/:id`                           |
| 1.11 | Admin: Products        | `POST /admin/products`, `PUT /admin/products/:id`, `DELETE /admin/products/:id`              |
| 1.12 | Admin: Orders          | `GET /admin/orders`, `PATCH /admin/orders/:id/status`                                        |
| 1.13 | Admin: Dashboard stats | `GET /admin/stats` (revenue, order count, product count, recent orders)                      |
| 1.14 | Admin: Inventory       | `GET /admin/inventory`, `POST /admin/inventory/adjust`                                       |
| 1.15 | Fish species API       | `GET /species`, `GET /species/:id` (dùng cho filter & AI context)                            |

### Inventory Flow Logic

```
Thêm vào cart:
  cart_items.create → inventory: available -= quantity, reserved += quantity
  → inventory_logs.create(action: 'reserve')

Checkout thành công:
  orders.create → inventory: reserved -= quantity, sold += quantity
  → inventory_logs.create(action: 'sell')

Hủy cart item / Cart expire:
  cart_items.delete → inventory: reserved -= quantity, available += quantity
  → inventory_logs.create(action: 'release')

Admin thêm hàng:
  inventory.update: available += quantity
  → inventory_logs.create(action: 'add')
```

### Server Structure

```
apps/api-server/src/
├── index.ts                 # Entry point
├── app.ts                   # Express app setup
├── config/
│   ├── env.ts               # Environment variables
│   ├── supabase.ts          # Supabase client
│   └── prisma.ts            # Prisma client
├── middleware/
│   ├── auth.ts              # JWT verify + role guard
│   ├── error-handler.ts     # Global error handler
│   ├── validate.ts          # Zod request validation
│   └── logger.ts            # Request logger
├── routes/
│   ├── index.ts             # Route aggregator
│   ├── products.ts
│   ├── cart.ts
│   ├── orders.ts
│   ├── reviews.ts
│   ├── species.ts
│   ├── ai.ts
│   └── admin/
│       ├── products.ts
│       ├── orders.ts
│       ├── inventory.ts
│       └── stats.ts
├── services/
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── order.service.ts
│   ├── review.service.ts
│   ├── inventory.service.ts
│   ├── ai.service.ts
│   └── stats.service.ts
├── utils/
│   ├── api-error.ts         # Custom error class
│   ├── response.ts          # Standardized response
│   └── pagination.ts        # Pagination helper
└── types/
    └── express.d.ts         # Express type extensions
```

### Definition of Done

- [ ] Tất cả API endpoints hoạt động qua Postman/Thunder Client
- [ ] Auth middleware block unauthorized requests
- [ ] Inventory reservation logic chính xác
- [ ] Seed data tạo được dataset đẹp
- [ ] Error handling trả đúng format

---

## PHASE 2: Shared Packages

**Thời gian:** 1 ngày (Ngày 3–4)  
**Mục tiêu:** Tất cả shared code sẵn sàng cho cả web-client và admin-panel  
**Phụ thuộc:** Phase 0, Phase 1 (types cần schema)

### 2.1 – packages/types

```
// Tất cả interfaces cần định nghĩa:

// === Domain Types ===
User                    // id, email, name, role, avatar
FishSpecies             // id, name, scientific_name, care_level, temperament, water params...
Product                 // id, name, slug, description, price, compare_price, size, species, images
ProductFilter           // search, species_id, min_price, max_price, size, water_type, sort_by
CartItem                // id, product, quantity
Cart                    // id, items, total
Order                   // id, items, status, total, shipping_address, created_at
OrderItem               // id, product, quantity, price
OrderStatus             // enum: pending, confirmed, processing, shipping, delivered, cancelled
Review                  // id, user, product_id, rating, comment, created_at
InventoryLog            // id, product_id, action, quantity, reference_id

// === AI Types ===
ChatSession             // id, title, created_at
ChatMessage             // id, role, content, created_at
AiRecommendation        // products, reason

// === API Types ===
ApiResponse<T>          // success, data, message, meta
PaginatedResponse<T>    // extends ApiResponse with pagination meta
PaginationParams        // page, limit, sort_by, sort_order
ApiError                // status, message, errors

// === Socket Types ===
SocketEvents            // order_created, order_updated, inventory_updated payloads

// === UI Types ===
Theme                   // light/dark
ToastType               // success, error, warning, info
```

### 2.2 – packages/services

```
// API Client Setup:
// - Axios instance với base URL, interceptors
// - Auto attach Supabase JWT token
// - Error transform → ApiError
// - Request/response logging (dev only)

// Service modules:
productService          // getProducts(filter), getProduct(slug), getProductReviews(id)
cartService             // getCart(), addItem(productId, qty), updateItem(id, qty), removeItem(id)
orderService            // createOrder(data), getOrders(), getOrder(id)
reviewService           // createReview(data), getReviews(productId)
authService             // getCurrentUser(), updateProfile(data)
aiService               // sendMessage(sessionId, message), getRecommendations(productId)
adminService            // getStats(), getOrders(), updateOrderStatus(), CRUD products, inventory
speciesService          // getSpecies(), getSpeciesById(id)
```

### 2.3 – packages/hooks

```
// Hooks cần triển khai:
useAuth()               // Supabase auth state, login, logout, register, user info
useDebounce(value, ms)  // Debounce input values (search, filter)
useLocalStorage(key)    // Persistent state in localStorage
useMediaQuery(query)    // Responsive breakpoint detection
useSocket()             // Socket.io connection + event listeners
useIntersection(ref)    // Intersection Observer for lazy loading
useClickOutside(ref)    // Click outside detection (dropdowns, modals)
```

### 2.4 – packages/ui (Shadcn-based)

```
Cần build sẵn các components:

Layout:        Container, Stack, Grid
Typography:    Heading, Text, Label
Forms:         Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider
Buttons:       Button, IconButton, ButtonGroup
Feedback:      Toast/Sonner, Alert, Badge, Progress, Spinner
Overlay:       Dialog, Sheet, Popover, Tooltip, DropdownMenu
Data Display:  Card, Avatar, Table/DataTable, Skeleton, Separator
Navigation:    Tabs, Breadcrumb, Pagination
Custom:
  - ProductCard          # Card hiển thị sản phẩm (ảnh, tên, giá, rating)
  - PriceDisplay         # Format giá VNĐ
  - RatingStars          # Hiển thị + input rating
  - StatusBadge          # Badge theo order status (color-coded)
  - EmptyState           # Illustration + message khi không có data
  - SearchInput          # Input với icon search + clear button
  - QuantitySelector     # +/- quantity input
  - ImageGallery         # Carousel ảnh sản phẩm
```

Note: The app shell and layout components (RootLayout, Header, Footer, MobileMenu, shared layout components) should be built directly from the pre-made templates in `/template`. Copy the relevant template files into `apps/web-client/src/` and adapt imports, styles, and env variables before running the initial build.

### Definition of Done

- [ ] Tất cả packages export đúng, import được từ apps
- [ ] Types cover toàn bộ domain
- [ ] Services gọi được API (test với api-server)
- [ ] Hooks hoạt động đúng
- [ ] UI components render đúng với Storybook hoặc test page

---

## PHASE 3: Web Client – Layout & Auth

**Thời gian:** 1 ngày (Ngày 4–5)  
**Mục tiêu:** App shell hoàn chỉnh, auth flow chạy end-to-end  
**Phụ thuộc:** Phase 0, Phase 2

### 3.1 – Routing

```
/                       → Home page
/products               → Product listing
/products/:slug         → Product detail
/cart                   → Cart page
/checkout               → Checkout page
/orders                 → Order history
/orders/:id             → Order detail
/profile                → User profile
/ai-chat                → AI chat page
/login                  → Login
/register               → Register
/forgot-password        → Forgot password
```

### 3.2 – Redux Store

```
// store/
//   ├── index.ts           → configureStore
//   ├── auth.slice.ts      → user, token, isAuthenticated, loading
//   ├── product.slice.ts   → filters, viewMode(grid/list), selectedCategory
//   ├── cart.slice.ts      → items, total, itemCount (synced with server)
//   ├── order.slice.ts     → currentOrder, realtimeUpdates
//   └── ui.slice.ts        → theme, sidebarOpen, toasts, globalLoading

// Middleware:
// - Redux Toolkit defaults (thunk, serializableCheck)
// - Optional: logger middleware (dev only)
```

### 3.3 – TanStack Query

```
// Setup:
// - QueryClient với defaultOptions (staleTime, gcTime, retry)
// - ReactQueryDevtools (dev only)

// Query Keys convention:
// ['products', filters]
// ['product', slug]
// ['cart']
// ['orders']
// ['order', id]
// ['reviews', productId]
// ['species']
// ['ai-chat', sessionId]
// ['admin', 'stats']
// ['admin', 'orders', filters]
// ['admin', 'products', filters]
// ['admin', 'inventory']
```

### 3.4 – Layout Components

```
RootLayout
├── Header
│   ├── Logo (link → /)
│   ├── Navigation (Products, AI Chat)
│   ├── SearchInput (→ /products?search=...)
│   ├── ThemeToggle
│   ├── CartIcon (badge with count)
│   └── UserMenu (avatar → dropdown: Profile, Orders, Logout)
├── MobileMenu (Sheet sidebar)
├── main (Outlet)
└── Footer
    ├── About links
    ├── Policy links
    └── Social links
```

### 3.5 – Auth Pages & Flow

```
Login Page:
- Email + Password form
- "Đăng nhập với Google" (Supabase OAuth)
- Link → Register, Forgot Password
- Redirect → previous page sau login

Register Page:
- Name + Email + Password + Confirm Password
- Zod validation
- Auto login sau register

Forgot Password:
- Email input → Supabase reset email

Auth Flow:
1. Supabase onAuthStateChange listener
2. Token → Redux auth slice
3. Token → Axios interceptor (auto attach header)
4. Protected routes: redirect to /login if !isAuthenticated
5. Admin routes: redirect to / if role !== 'admin'
```

### 3.6 – Three.js Hero Section

```
Landing Hero:
- Canvas background: underwater scene
- Animated fish swimming (2-3 fish models, simple geometry)
- Particle effects (bubbles)
- Gradient overlay
- Hero text: "Khám phá thế giới cá cảnh"
- CTA button: "Xem sản phẩm" → /products
- Responsive: simplified on mobile (fewer particles, smaller canvas)
- Performance: lazy load Three.js, requestAnimationFrame cleanup
```

### Definition of Done

- [ ] Routing hoạt động, tất cả routes accessible
- [ ] Redux store persist (redux-persist cho cart)
- [ ] Auth flow: register → login → protected routes → logout
- [ ] Header responsive, cart badge cập nhật
- [ ] Three.js hero render smooth, không memory leak
- [ ] Mobile menu hoạt động

---

## PHASE 4: Web Client – Core Features

**Thời gian:** 2 ngày (Ngày 5–7)  
**Mục tiêu:** Toàn bộ user-facing features hoạt động  
**Phụ thuộc:** Phase 1, Phase 2, Phase 3

### 4.1 – Home Page (Ngày 5 sáng)

```
Sections:
1. Hero (Three.js từ Phase 3)
2. Featured Categories
   - Cá nước ngọt, Cá nước mặn, Cá cảnh mini, Cá Koi
   - Card với icon/illustration + tên + số lượng sản phẩm
3. Sản phẩm nổi bật (carousel/grid 8 items)
4. Banner "Tư vấn AI" → link /ai-chat
5. Đánh giá từ khách hàng (testimonials)
6. Footer
```

### 4.2 – Product Listing (Ngày 5 chiều)

```
Layout: Sidebar filters + Grid/List content

Sidebar Filters:
- Search text (debounced)
- Loài cá (multi-select checkboxes)
- Khoảng giá (range slider)
- Kích thước (S/M/L/XL)
- Loại nước (ngọt/mặn/lợ)
- Mức chăm sóc (dễ/trung bình/khó)
- Tính cách (hiền/bình thường/hung dữ)
- Clear all filters button

Content:
- Sort by: Mới nhất, Giá tăng, Giá giảm, Phổ biến
- View toggle: Grid (2-4 cols responsive) / List
- ProductCard: Image, Name, Species, Price, Rating, "Thêm vào giỏ" button
- Pagination (page numbers + prev/next)
- Skeleton loading states
- Empty state khi không có kết quả
- URL sync: filters → query params → bookmarkable

Mobile:
- Filter button → Sheet sidebar
- 2 columns grid
```

### 4.3 – Product Detail (Ngày 6 sáng)

```
Layout:
┌─────────────────────────────────────────────┐
│  Breadcrumb: Home > Cá cảnh > [Tên cá]     │
├──────────────────┬──────────────────────────┤
│                  │  Tên sản phẩm            │
│  Image Gallery   │  Rating (stars + count)  │
│  (main + thumbs) │  Giá (sale + original)   │
│                  │  Size selector (S/M/L/XL)│
│                  │  Quantity selector        │
│                  │  "Thêm vào giỏ" button   │
│                  │  Stock status             │
├──────────────────┴──────────────────────────┤
│  Tabs:                                      │
│  ├── Mô tả chi tiết                        │
│  ├── Thông tin chăm sóc                    │
│  │   (nhiệt độ, pH, kích thước hồ,         │
│  │    tương thích với loài khác)            │
│  └── Đánh giá (reviews list + form)        │
├─────────────────────────────────────────────┤
│  Sản phẩm liên quan (4-item carousel)      │
│  AI gợi ý combo (Phase 7)                  │
└─────────────────────────────────────────────┘

Interactions:
- Image zoom on hover
- Add to cart → toast + cart badge update
- Size change → price update
- Review form (nếu đã mua + đã login)
```

### 4.4 – Cart (Ngày 6 chiều)

```
Cart Page:
┌──────────────────────────────────────────────┐
│  Giỏ hàng (3 sản phẩm)                     │
├──────────────────────────────────────────────┤
│  ┌─────┬───────────┬─────┬────────┬──────┐  │
│  │ Ảnh │ Tên + Size│ Qty │ Giá    │  X   │  │
│  ├─────┼───────────┼─────┼────────┼──────┤  │
│  │ ... │ ...       │ +-  │ xxx đ  │  X   │  │
│  └─────┴───────────┴─────┴────────┴──────┘  │
├──────────────────────────────────────────────┤
│  Tạm tính:                         xxx đ    │
│  Phí vận chuyển:                    xxx đ    │
│  ─────────────────────────────────────────── │
│  Tổng:                              xxx đ    │
│  [Tiến hành thanh toán]                      │
└──────────────────────────────────────────────┘

Mini Cart (Header dropdown):
- Tối đa 3 items hiển thị
- Link "Xem giỏ hàng" + "Thanh toán"

Behaviors:
- Quantity update → API + inventory check → optimistic update
- Remove item → confirm dialog → API + release inventory
- Empty cart → EmptyState + link shop
- Cart sync: localStorage backup + server sync khi login
```

### 4.5 – Checkout (Ngày 7 sáng)

```
Checkout Page (multi-step hoặc single page):

Step 1 - Shipping Info:
- Họ tên (required)
- Số điện thoại (required, validate VN format)
- Địa chỉ (required)
- Tỉnh/Thành → Quận/Huyện → Phường/Xã (select cascade)
- Ghi chú

Step 2 - Payment (MOCK):
- Radio: COD / Chuyển khoản / Ví điện tử
- Hiển thị thông tin thanh toán giả lập
- "Xác nhận đơn hàng" button

Step 3 - Confirmation:
- ✅ "Đặt hàng thành công!"
- Mã đơn hàng
- Tóm tắt đơn
- Links: "Theo dõi đơn hàng" / "Tiếp tục mua sắm"

Sidebar (desktop):
- Order summary (items, prices, total) – sticky

Validation: React Hook Form + Zod schemas
```

### 4.6 – Order History & Tracking (Ngày 7 sáng)

```
Order List Page:
- Tabs: Tất cả / Chờ xác nhận / Đang xử lý / Đang giao / Đã giao / Đã hủy
- Order cards: Mã đơn, Ngày, Trạng thái (StatusBadge), Tổng, Items preview
- Click → Order detail

Order Detail:
- Progress bar: Pending → Confirmed → Processing → Shipping → Delivered
- Realtime status update (Socket.io từ Phase 5)
- Items table
- Shipping info
- "Hủy đơn" button (nếu status = pending)
```

### 4.7 – Reviews (Ngày 7 chiều)

```
Review List (trong Product Detail tab):
- Average rating display (big number + stars)
- Rating distribution bar chart (5★: 60%, 4★: 25%...)
- Sort: Mới nhất, Rating cao, Rating thấp
- Review cards: Avatar, Name, Rating, Date, Comment
- Pagination

Review Form (modal hoặc inline):
- Rating stars (click to select)
- Comment textarea
- Submit → optimistic update → refetch
- Chỉ hiện nếu user đã mua sản phẩm này
```

### 4.8 – Animations (xuyên suốt)

```
Framer Motion applications:
- Page transitions (fade + slide)
- Product card hover (scale + shadow lift)
- Cart badge bounce khi thêm item
- Skeleton → content transition
- Filter panel slide (mobile)
- Toast enter/exit
- Modal/Sheet open/close
- Stagger children (product grid load)
- Scroll-triggered sections (home page)
- Button click feedback (scale)
```

### Definition of Done

- [ ] Home page các sections hiển thị đúng
- [ ] Product listing: filter, sort, paginate, URL sync
- [ ] Product detail: gallery, info, add to cart, reviews
- [ ] Cart: CRUD items, total calculation, mini cart
- [ ] Checkout: form validation, mock payment, confirmation
- [ ] Orders: list, detail, status display
- [ ] Reviews: create (nếu eligible), display
- [ ] Animations smooth, không jank
- [ ] Responsive: mobile → tablet → desktop

---

## PHASE 5: Realtime với Socket.io

**Thời gian:** 1 ngày (Ngày 7–8)  
**Mục tiêu:** Realtime events hoạt động end-to-end  
**Phụ thuộc:** Phase 1, Phase 4, Phase 6 (song song)

### Tasks

| #   | Task                      | Chi tiết                                                                       |
| --- | ------------------------- | ------------------------------------------------------------------------------ |
| 5.1 | Socket.io server setup    | Attach to Express server, CORS config, auth middleware (verify JWT on connect) |
| 5.2 | Room management           | `user:{userId}` room, `admin` room, join on connect                            |
| 5.3 | `useSocket` hook          | Connect/disconnect lifecycle, event listeners, reconnect logic                 |
| 5.4 | `order_created` event     | User checkout → emit to `admin` room → admin dashboard live feed               |
| 5.5 | `order_updated` event     | Admin update status → emit to `user:{userId}` → user order detail live update  |
| 5.6 | `inventory_updated` event | Stock change → emit to all → product listing/detail stock badge update         |
| 5.7 | Toast notifications       | Realtime toast trên cả client (order status) và admin (new order)              |
| 5.8 | Connection status UI      | Indicator: connected/disconnected/reconnecting trên header                     |

### Socket Events Schema

```
// Server → Client
'order:created'     → { orderId, userId, total, items, createdAt }
'order:updated'     → { orderId, status, updatedAt }
'inventory:updated' → { productId, available, reserved }

// Client → Server
'join:admin'        → {} (admin dashboard connect)
'join:user'         → { userId }
```

### Definition of Done

- [ ] Socket connect/disconnect không leak
- [ ] Admin nhận realtime khi user đặt hàng
- [ ] User nhận realtime khi admin cập nhật đơn
- [ ] Inventory cập nhật realtime
- [ ] Reconnect tự động khi mất kết nối
- [ ] Toast hiện đúng content

---

## PHASE 6: Admin Dashboard

**Thời gian:** 2 ngày (Ngày 8–10)  
**Mục tiêu:** Admin panel đầy đủ chức năng quản lý  
**Phụ thuộc:** Phase 1, Phase 2

### 6.1 – Admin Layout (Ngày 8)

```
Admin Layout:
├── Sidebar (collapsible)
│   ├── Logo
│   ├── Dashboard
│   ├── Sản phẩm
│   ├── Đơn hàng
│   ├── Tồn kho
│   ├── Loài cá
│   └── Cài đặt
├── Header
│   ├── Breadcrumb
│   ├── Notification bell (realtime count)
│   ├── Theme toggle
│   └── Admin avatar + dropdown
└── Main content area

Routing:
/admin                  → Dashboard
/admin/products         → Product management
/admin/products/new     → Create product
/admin/products/:id     → Edit product
/admin/orders           → Order management
/admin/orders/:id       → Order detail
/admin/inventory        → Inventory management
/admin/species          → Fish species management
```

### 6.2 – Dashboard Overview (Ngày 8)

```
Stats Cards (4 cards row):
- Doanh thu tháng này (VNĐ) + % so với tháng trước
- Đơn hàng mới hôm nay + trend
- Sản phẩm đang bán + sắp hết hàng count
- Khách hàng mới tháng + trend

Charts:
1. Revenue Trend (line chart – 7 ngày / 30 ngày / 12 tháng toggle)
2. Orders by Status (donut/pie chart)
3. Top 5 sản phẩm bán chạy (horizontal bar chart)

Live Feed:
- Realtime order feed (Socket.io)
- Danh sách đơn mới nhất (auto-prepend khi có order_created)
```

### 6.3 – Product Management (Ngày 9)

```
Product List:
- DataTable với: Ảnh, Tên, Loài, Giá, Tồn kho, Trạng thái, Actions
- Search + Filter (species, status, price range)
- Bulk actions: Activate/Deactivate, Delete
- Pagination

Create/Edit Product Form:
- Thông tin cơ bản: Tên, Slug (auto-generate), Mô tả (rich text)
- Giá: Giá bán, Giá so sánh
- Phân loại: Loài cá (select), Kích thước (S/M/L/XL)
- Ảnh: Upload multiple, drag-to-reorder, set primary
- SEO: Meta title, Meta description
- Trạng thái: Active/Inactive toggle
- Zod validation
```

### 6.4 – Order Management (Ngày 9)

```
Order List:
- DataTable: Mã đơn, Khách hàng, Ngày, Trạng thái, Tổng, Actions
- Filter by status tabs
- Search by order ID / customer name
- Date range filter

Order Detail:
- Customer info
- Items table
- Status timeline (progress bar)
- Update status dropdown → confirm → API + Socket emit
- Print invoice button (optional)

Status transitions:
pending → confirmed → processing → shipping → delivered
pending → cancelled (chỉ từ pending)
```

### 6.5 – Inventory Management (Ngày 10)

```
Inventory Dashboard:
- Overview: Total available, Total reserved, Low stock alerts
- DataTable: Sản phẩm, Available, Reserved, Sold, Actions
- Color-coded rows: đỏ nếu available < 5

Inventory Actions:
- "Nhập hàng" button → Dialog: Sản phẩm + Số lượng + Ghi chú
- Inventory log table: Thời gian, Sản phẩm, Action, Số lượng, Reference

Low Stock Alerts:
- Badge count trên sidebar
- Alert list: sản phẩm sắp hết (available < threshold)
- Realtime update qua Socket.io
```

### 6.6 – Admin Charts & Stats (Ngày 10)

```
Chart library: Recharts

Charts cần implement:
1. AreaChart: Revenue trend (responsive, tooltip, legend)
2. PieChart: Order status distribution
3. BarChart: Top selling products
4. LineChart: Daily orders count
5. Stats sparklines trong cards (tiny inline charts)

Data refresh: Auto refetch mỗi 30s + realtime update
```

### Definition of Done

- [ ] Dashboard stats hiển thị đúng dữ liệu
- [ ] CRUD products hoạt động end-to-end
- [ ] Order management: view, update status → realtime
- [ ] Inventory: view, adjust, alerts
- [ ] Charts render đúng data
- [ ] Realtime feed hoạt động
- [ ] Responsive (tablet + desktop)
- [ ] Protected: chỉ admin access được

---

## PHASE 7: AI Features

**Thời gian:** 1.5 ngày (Ngày 10–11)  
**Mục tiêu:** AI chat tư vấn + recommend hoạt động  
**Phụ thuộc:** Phase 1, Phase 4

### 7.1 – AI Backend (Ngày 10)

```
AI Chat Endpoint: POST /api/ai/chat
- Input: { sessionId?, message, context? }
- Process:
  1. Lấy/tạo session
  2. Lấy chat history (last 20 messages)
  3. Build system prompt (aquarium expert context)
  4. Call Claude/OpenAI API
  5. Save assistant message
  6. Return response + sessionId
- Rate limit: 10 messages / minute / user

AI Recommend Endpoint: POST /api/ai/recommend
- Input: { productId?, cart_items?, user_preferences? }
- Process:
  1. Lấy thông tin sản phẩm hiện tại / cart
  2. Lấy danh sách sản phẩm available
  3. Build prompt: tương thích loài, kích thước hồ, điều kiện nước
  4. Call AI → parse recommendations
  5. Map to actual products
  6. Return product suggestions + reasons

System Prompt (Chat):
"""
Bạn là chuyên gia tư vấn cá cảnh tại AquaCommerce. Nhiệm vụ:
- Tư vấn chọn loài cá phù hợp dựa trên: kích thước hồ, kinh nghiệm, ngân sách
- Hướng dẫn chăm sóc: nhiệt độ, pH, thức ăn, bạn cùng hồ
- Gợi ý combo cá tương thích
- Cảnh báo các loài KHÔNG nên nuôi chung
- Trả lời bằng tiếng Việt, thân thiện, chuyên nghiệp
Dữ liệu sản phẩm hiện có: [inject từ DB]
"""
```

### 7.2 – AI Chat UI (Ngày 11)

```
Chat Widget (floating):
1. Floating button (góc phải dưới)
   - Fish icon + pulse animation
   - Unread badge

2. Chat Panel (expand):
   ┌──────────────────────────────┐
   │  🐟 AquaBot – Tư vấn cá cảnh  │ [−] [×]
   ├──────────────────────────────┤
   │                              │
   │  💬 Bot: Xin chào! Tôi có   │
   │  thể giúp gì...             │
   │                              │
   │  👤 User: Tôi muốn nuôi cá  │
   │  trong hồ 60cm...           │
   │                              │
   │  💬 Bot: Với hồ 60cm, tôi   │
   │  gợi ý... [typing indicator]│
   │                              │
   ├──────────────────────────────┤
   │  [Nhanh: "Cá dễ nuôi" | "Combo"] │
   │  ┌─────────────────────┐ [➤]│
   │  │ Nhập tin nhắn...    │    │
   │  └─────────────────────┘    │
   └──────────────────────────────┘

Features:
- Message streaming (SSE hoặc chunk response)
- Quick reply suggestions
- Product cards inline (khi AI gợi ý sản phẩm → clickable cards)
- Chat history (sessions list)
- Markdown rendering trong messages
- Copy message button
- Responsive: full-screen trên mobile

Route /ai-chat:
- Full-page chat interface
- Session management sidebar
- Richer layout hơn floating widget
```

### 7.3 – AI Recommendations UI (Ngày 11)

```
Hiển thị tại:
1. Product Detail page: "Cá tương thích" section
   - Grid 4 cards: ảnh, tên, giá, lý do tương thích
   - "Xem thêm" link

2. Cart page: "Gợi ý thêm" section
   - Dựa trên items trong cart
   - "Bạn nên thêm [Cá X] vì tương thích với [Cá Y] trong giỏ"

3. Home page: "Gợi ý cho bạn" (nếu logged in + có history)
```

### Definition of Done

- [ ] AI chat trả lời đúng context cá cảnh
- [ ] Chat UI smooth, typing indicator, streaming
- [ ] Chat history persist across sessions
- [ ] AI recommend trả về sản phẩm thực tế từ DB
- [ ] Recommend UI hiển thị với lý do
- [ ] Rate limit hoạt động
- [ ] Error handling (AI API down → graceful fallback)

---

## PHASE 8: Polish & UX

**Thời gian:** 1 ngày (Ngày 11–12)  
**Mục tiêu:** Production-grade UX  
**Phụ thuộc:** Phase 4, Phase 6

### Tasks

| #    | Task               | Chi tiết                                                                   |
| ---- | ------------------ | -------------------------------------------------------------------------- |
| 8.1  | Responsive audit   | Test tất cả pages: 375px, 768px, 1024px, 1440px. Fix mọi layout break      |
| 8.2  | Dark mode          | CSS variables toggle, persist in localStorage, system preference detect    |
| 8.3  | Loading states     | Skeleton screens cho mọi page/section, Suspense boundaries hợp lý          |
| 8.4  | Error boundaries   | Global ErrorBoundary, per-route ErrorBoundary, 404 page, 500 page          |
| 8.5  | Toast system       | Sonner/react-hot-toast: success/error/warning/info, auto dismiss, stack    |
| 8.6  | Accessibility      | Semantic HTML, ARIA labels, focus management, keyboard nav, color contrast |
| 8.7  | Performance        | Lazy imports (React.lazy), Image lazy loading, Memoization audit           |
| 8.8  | Meta tags          | react-helmet-async: title, description, OG tags cho mỗi page               |
| 8.9  | Favicon & Branding | Custom favicon (fish icon), loading spinner branding                       |
| 8.10 | Micro-interactions | Button hover/active states, Input focus animations, Page scroll-to-top     |

### Aqua Theme – Design Tokens

```css
/* Color Palette */
--primary:
  #0ea5e9 /* Sky blue – nước */ --primary-dark: #0369a1 /* Deep ocean */ --secondary: #10b981
    /* Emerald – rong/cây thủy sinh */ --accent: #f59e0b /* Amber – cá vàng */ --danger: #ef4444
    --warning: #f59e0b --success: #10b981 --bg-primary: #f0f9ff /* Very light blue tint */
    --bg-dark: #0f172a /* Slate 900 */ /* Typography */ --font-heading: 'Inter',
  sans-serif --font-body: 'Inter',
  sans-serif /* Border Radius */ --radius-sm: 6px --radius-md: 8px --radius-lg: 12px
    --radius-full: 9999px /* Shadows – "underwater" feel */ --shadow-sm: 0 1px 3px
    rgba(14, 165, 233, 0.1) --shadow-md: 0 4px 6px rgba(14, 165, 233, 0.15) --shadow-lg: 0 10px 25px
    rgba(14, 165, 233, 0.2);
```

### Definition of Donea

- [ ] Không layout break ở bất kỳ breakpoint nào
- [ ] Dark mode toggle smooth, không flash
- [ ] Mọi async operation có loading state
- [ ] Error messages user-friendly
- [ ] Lighthouse accessibility score > 90
- [ ] Bundle size hợp lý (no unnecessary imports)

---

## PHASE 9: Testing & CI/CD

**Thời gian:** 1 ngày (Ngày 12–13)  
**Mục tiêu:** Test coverage cơ bản + auto deploy  
**Phụ thuộc:** Tất cả phases trước

### 9.1 – Testing

```
Test Strategy:
├── Unit Tests (Vitest)
│   ├── Utils: formatPrice, formatDate, validation helpers
│   ├── Redux slices: reducers, selectors
│   ├── Hooks: useDebounce, useLocalStorage
│   └── Services: request/response transforms
│
├── Component Tests (Vitest + Testing Library)
│   ├── ProductCard: render, props, click handler
│   ├── CartItem: quantity change, remove
│   ├── RatingStars: display, interaction
│   ├── SearchInput: debounce, clear
│   ├── StatusBadge: correct color per status
│   └── PriceDisplay: format, sale price
│
└── Integration Tests (Optional, nếu đủ thời gian)
    ├── Cart flow: add → update → remove
    └── Checkout flow: form → submit → confirmation

Target: 30-50% coverage trên critical paths
```

### 9.2 – CI/CD

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  lint:
    - pnpm install
    - pnpm lint

  typecheck:
    - pnpm install
    - pnpm type-check

  test:
    - pnpm install
    - pnpm test

  build:
    - pnpm install
    - pnpm build

# Vercel:
# - web-client: auto deploy on push to main
# - admin-panel: auto deploy on push to main
# - api-server: deploy to Vercel Serverless hoặc Railway
```

### 9.3 – Environment Setup

```
.env.example:
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# API
VITE_API_URL=http://localhost:3001

# Database
DATABASE_URL=

# AI
OPENAI_API_KEY= (hoặc CLAUDE_API_KEY)

# Socket
VITE_SOCKET_URL=http://localhost:3001
```

### Definition of Done

- [ ] `pnpm test` pass
- [ ] `pnpm lint` pass
- [ ] `pnpm build` thành công cho cả 3 apps
- [ ] GitHub Actions workflow chạy xanh
- [ ] Vercel deploy thành công
- [ ] `.env.example` đầy đủ

---

## PHASE 10: Documentation & Final

**Thời gian:** 0.5 ngày (Ngày 13–14)  
**Mục tiêu:** Dự án sẵn sàng demo & review  
**Phụ thuộc:** Tất cả

### Tasks

| #    | Task              | Chi tiết                                                        |
| ---- | ----------------- | --------------------------------------------------------------- |
| 10.1 | README update     | Architecture diagram, Setup guide, Screenshots, Tech decisions  |
| 10.2 | API docs          | Endpoint table với method, path, auth, request/response samples |
| 10.3 | Code cleanup      | Remove console.logs, unused imports, TODO comments              |
| 10.4 | Demo data check   | Seed data tạo dataset đẹp, ảnh sản phẩm có sẵn                  |
| 10.5 | Performance audit | Lighthouse run, fix critical issues                             |
| 10.6 | Final testing     | Manual smoke test toàn bộ flows                                 |

### Definition of Done

- [ ] README có đủ info để người khác setup & chạy
- [ ] Demo online hoạt động smooth
- [ ] Code clean, consistent style
- [ ] Không console errors trong production build
- [ ] Ảnh sản phẩm hiển thị đúng

---

## Tổng kết Timeline

```
Ngày 1:   Phase 0 – Monorepo Setup
Ngày 2-3: Phase 1 – Backend (DB + API)
Ngày 3-4: Phase 2 – Shared Packages
Ngày 4-5: Phase 3 – Client Layout & Auth
Ngày 5-7: Phase 4 – Client Core Features
Ngày 7-8: Phase 5 – Realtime Socket.io
Ngày 8-10: Phase 6 – Admin Dashboard
Ngày 10-11: Phase 7 – AI Features
Ngày 11-12: Phase 8 – Polish & UX
Ngày 12-13: Phase 9 – Testing & CI/CD
Ngày 13-14: Phase 10 – Documentation
```

### Risk & Mitigation

| Risk                           | Impact | Mitigation                                   |
| ------------------------------ | ------ | -------------------------------------------- |
| Supabase connection issues     | High   | Có fallback local SQLite cho dev             |
| AI API rate limit / cost       | Medium | Cache responses, mock mode cho dev           |
| Three.js performance on mobile | Medium | Simplified scene, lazy load, fallback static |
| Scope creep                    | High   | Strict Must Have vs Nice to Have boundary    |
| Socket.io reconnect issues     | Low    | Exponential backoff, fallback polling        |
| Bundle size quá lớn            | Medium | Dynamic imports, tree-shaking audit          |

### Nguyên tắc xuyên suốt

1. **Feature-based architecture** – Mỗi module tự chứa
2. **Type-safe end-to-end** – Shared types từ DB → API → Frontend
3. **Optimistic updates** – UI phản hồi ngay, sync sau
4. **Progressive enhancement** – Core chạy trước, enhance sau
5. **Mobile-first** – Design từ mobile lên
6. **Performance budget** – Lazy load, code split, memoize
7. **Accessibility** – Semantic HTML, ARIA, keyboard nav
