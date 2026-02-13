✅ Feature & UI Update Requirements – Home Page & Product System
═══════════════════════════════════════════════════════════════

## 📊 Current Codebase Analysis

### Architecture

- **Monorepo**: pnpm workspace + Turborepo
- **Backend**: Express.js + Prisma ORM (PostgreSQL / Supabase)
- **Frontend**: React 18 (Vite) + React Router + TanStack Query + Zustand + Framer Motion
- **Shared packages**: `@repo/types`, `@repo/services`, `@repo/hooks`, `@repo/ui`
- **Validation**: Zod schemas
- **Auth**: JWT + middleware (`authenticate`, `requireRole`, `optionalAuth`)

### Existing DB Models

User, FishSpecies, FishImage, Product, Cart, CartItem, Order, OrderItem, InventoryLog, Review, AiChatSession, AiChatMessage

### Existing HomePage Sections (top → bottom)

Hero → Categories → Featured Products → AI Advisor Banner → Testimonials

### Key Observations for Planning

- `careLevel` already exists on `FishSpecies` (enum: EASY/MODERATE/HARD/EXPERT) → accessible via `product.species.careLevel`
- `size` (FishSize enum: XS/S/M/L/XL) already exists on `Product` model
- `product.service.ts` already includes `species.careLevel` in list select → API already returns it
- Admin routes follow pattern: `router.use(authenticate, requireRole('ADMIN'))` + service layer
- Frontend services use axios (`apiClient`) from `@repo/services`
- Frontend hooks use TanStack Query with `queryKeys` pattern
- Admin pages: Dashboard, ProductList, ProductForm, OrderList, OrderDetail, Species, Inventory

---

## 🗓️ PHASE 1: Database Schema & Backend Foundation

**Duration estimate**: 2-3 days coding + 1 day testing
**Skills**: `backend-development`, `databases`

### 1.1 — Prisma Schema Changes

#### Blog Models (NEW)

```prisma
// schema.prisma — thêm vào cuối file

model BlogPost {
  id          String       @id @default(cuid())
  title       String
  slug        String       @unique
  excerpt     String?      @db.Text
  content     String       @db.Text
  coverImage  String?      @map("cover_image")
  status      BlogStatus   @default(DRAFT)
  authorId    String       @map("author_id")
  tags        String[]     @default([])
  viewCount   Int          @default(0) @map("view_count")
  publishedAt DateTime?    @map("published_at")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  author User @relation(fields: [authorId], references: [id])

  @@index([status, publishedAt])
  @@index([slug])
  @@map("blog_posts")
}

enum BlogStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

#### Wishlist Model (NEW)

```prisma
model Wishlist {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  productId String   @map("product_id")
  createdAt DateTime @default(now()) @map("created_at")

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@index([userId])
  @@map("wishlists")
}
```

#### Update User model

```prisma
// Thêm relations vào User model
model User {
  // ... existing fields ...
  blogPosts  BlogPost[]
  wishlists  Wishlist[]
}
```

#### Update Product model

```prisma
// Thêm relation vào Product model
model Product {
  // ... existing fields ...
  wishlists  Wishlist[]
}
```

#### Migration command

```bash
cd apps/api-server
npx prisma migrate dev --name add-blog-wishlist
```

### 1.2 — Backend: Blog Service & APIs

#### Files to create/modify:

| File                           | Action | Description                                             |
| ------------------------------ | ------ | ------------------------------------------------------- |
| `src/services/blog.service.ts` | CREATE | CRUD + list published, get by slug, increment view      |
| `src/routes/blog.routes.ts`    | CREATE | Public routes: `GET /api/blogs`, `GET /api/blogs/:slug` |
| `src/routes/admin.routes.ts`   | MODIFY | Add admin blog CRUD endpoints                           |
| `src/schemas/index.ts`         | MODIFY | Add `createBlogSchema`, `updateBlogSchema`              |
| `src/app.ts`                   | MODIFY | Register `/api/blogs` route                             |

#### Blog API Endpoints:

| Method | Endpoint                      | Auth   | Description                                             |
| ------ | ----------------------------- | ------ | ------------------------------------------------------- |
| GET    | `/api/blogs`                  | Public | List published blogs (paginated, sorted by publishedAt) |
| GET    | `/api/blogs/:slug`            | Public | Get single blog + increment viewCount                   |
| POST   | `/api/admin/blogs`            | Admin  | Create blog post                                        |
| PUT    | `/api/admin/blogs/:id`        | Admin  | Update blog post                                        |
| DELETE | `/api/admin/blogs/:id`        | Admin  | Delete blog post                                        |
| PATCH  | `/api/admin/blogs/:id/status` | Admin  | Toggle draft/published/archived                         |

### 1.3 — Backend: Wishlist Service & APIs

#### Files to create/modify:

| File                               | Action | Description                    |
| ---------------------------------- | ------ | ------------------------------ |
| `src/services/wishlist.service.ts` | CREATE | Add/remove/list wishlist items |
| `src/routes/wishlist.routes.ts`    | CREATE | User wishlist routes           |
| `src/schemas/index.ts`             | MODIFY | Add `addToWishlistSchema`      |
| `src/app.ts`                       | MODIFY | Register `/api/wishlist` route |

#### Wishlist API Endpoints:

| Method | Endpoint                         | Auth | Description                                |
| ------ | -------------------------------- | ---- | ------------------------------------------ |
| GET    | `/api/wishlist`                  | User | Get user's wishlist (with product details) |
| POST   | `/api/wishlist`                  | User | Add product to wishlist `{ productId }`    |
| DELETE | `/api/wishlist/:productId`       | User | Remove product from wishlist               |
| GET    | `/api/wishlist/check/:productId` | User | Check if product is in wishlist            |

### 1.4 — Backend: New Arrivals & Best Sellers Endpoints

#### Thêm endpoints vào `product.routes.ts`:

| Method | Endpoint                     | Auth   | Description                                   |
| ------ | ---------------------------- | ------ | --------------------------------------------- |
| GET    | `/api/products/new-arrivals` | Public | Products sorted by `createdAt DESC`, limit 12 |
| GET    | `/api/products/best-sellers` | Public | Products sorted by `sold DESC`, limit 12      |

> **Note**: Có thể dùng lại `listProducts` service hiện tại với sort params, hoặc tạo service riêng để tối ưu query.

### Phase 1 — Testing Checklist

- [ ] Unit tests: `blog.service.test.ts` — CRUD operations, slug generation, status toggle
- [ ] Unit tests: `wishlist.service.test.ts` — add/remove/list, duplicate handling
- [ ] Integration tests: Blog API endpoints (public + admin)
- [ ] Integration tests: Wishlist API endpoints
- [ ] Integration tests: New Arrivals / Best Sellers endpoints
- [ ] Schema validation tests: new Zod schemas in `schemas.test.ts`
- [ ] Edge cases: unauthorized access, not-found, duplicate wishlist items

```bash
# Run backend tests
cd apps/api-server
pnpm test
```

---

## 🗓️ PHASE 2: Shared Types & Services

**Duration estimate**: 1 day coding + 0.5 day testing
**Skills**: `web-frameworks`, `vercel-react-best-practices`

### 2.1 — Update `@repo/types`

#### File: `packages/types/src/index.ts`

Thêm types mới:

```typescript
// ── Blog ───────────────────────────────────
export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: BlogStatus;
  authorId: string;
  tags: string[];
  viewCount: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: Pick<User, 'id' | 'name' | 'avatar'>;
}

export interface BlogFilter {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  status?: BlogStatus;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  status?: BlogStatus;
}

// ── Wishlist ───────────────────────────────
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product?: Product;
}
```

### 2.2 — Create Frontend Services

#### File: `packages/services/src/blog.service.ts` (CREATE)

```typescript
// getBlogs(filter), getBlogBySlug(slug)
```

#### File: `packages/services/src/wishlist.service.ts` (CREATE)

```typescript
// getWishlist(), addToWishlist(productId), removeFromWishlist(productId), checkWishlist(productId)
```

#### File: `packages/services/src/index.ts` (MODIFY)

```typescript
// Export new services
export { default as blogService } from './blog.service';
export { default as wishlistService } from './wishlist.service';
```

### Phase 2 — Testing Checklist

- [ ] Type-check passes: `pnpm -w typecheck` hoặc `tsc --noEmit`
- [ ] Service functions return correct types
- [ ] Export barrel file updated correctly

---

## 🗓️ PHASE 3: Frontend Core Features

**Duration estimate**: 3-4 days coding + 1 day testing
**Skills**: `frontend-design`, `ui-styling`, `aesthetic`, `web-frameworks`

### 3.1 — Frontend Hooks

#### Files to create:

| File                                       | Description                                                          |
| ------------------------------------------ | -------------------------------------------------------------------- |
| `apps/web-client/src/hooks/useBlogs.ts`    | `useBlogs(filter)`, `useBlog(slug)`                                  |
| `apps/web-client/src/hooks/useWishlist.ts` | `useWishlist()`, `useToggleWishlist()`, `useIsWishlisted(productId)` |

#### Update: `apps/web-client/src/hooks/queryKeys.ts`

```typescript
// Thêm query keys
blogs: {
  all: ['blogs'] as const,
  list: (filter?: Record<string, unknown>) => ['blogs', 'list', filter] as const,
  detail: (slug: string) => ['blogs', 'detail', slug] as const,
},
wishlist: {
  all: ['wishlist'] as const,
  list: () => ['wishlist', 'list'] as const,
  check: (productId: string) => ['wishlist', 'check', productId] as const,
},
```

### 3.2 — Wishlist Store (Zustand)

#### File: `apps/web-client/src/store/wishlist.slice.ts` (CREATE)

- Local state cache cho wishlist items (optimistic UI)
- Toggle action (add/remove) gọi API + invalidate query
- Sync with server khi login/logout

### 3.3 — Wishlist UI Components

| File                                | Description                                                |
| ----------------------------------- | ---------------------------------------------------------- |
| `src/components/WishlistButton.tsx` | Heart icon button, toggle wishlist, animated               |
| `src/pages/WishlistPage.tsx`        | Dedicated page: grid of wishlisted products, remove button |

#### Integration points:

- **ProductCard.tsx**: Thêm `<WishlistButton>` overlay ở góc trên phải ảnh
- **ProductDetailPage.tsx**: Thêm `<WishlistButton>` cạnh nút Add to Cart
- **RootLayout.tsx / Header**: Thêm Wishlist nav link với badge count

### 3.4 — Blog UI Components

| File                             | Description                                             |
| -------------------------------- | ------------------------------------------------------- |
| `src/components/BlogCard.tsx`    | Card hiển thị: coverImage, title, excerpt, date, tags   |
| `src/components/BlogSection.tsx` | Section cho HomePage: 3 latest posts + "View All" link  |
| `src/pages/BlogListPage.tsx`     | Full blog listing page, paginated, search/filter by tag |
| `src/pages/BlogDetailPage.tsx`   | Single blog post, SEO meta tags, related posts          |

#### HomePage integration:

```
Hero → Categories → Featured Products → **Blog Section** (NEW) → AI Advisor → Testimonials
```

### 3.5 — New Arrivals & Best Sellers Sections

| File                                    | Description                                                      |
| --------------------------------------- | ---------------------------------------------------------------- |
| `src/components/ProductCarousel.tsx`    | Reusable SwiperJS carousel wrapper cho product cards             |
| `src/components/NewArrivalsSection.tsx` | Sử dụng `ProductCarousel` + `useProducts({ sortBy: 'newest' })`  |
| `src/components/BestSellersSection.tsx` | Sử dụng `ProductCarousel` + `useProducts({ sortBy: 'popular' })` |

#### SwiperJS Setup:

```bash
cd apps/web-client
pnpm add swiper
```

#### Carousel Config:

```typescript
// ProductCarousel.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Config: slidesPerView responsive, autoplay 4s, navigation arrows, pagination dots
```

#### HomePage integration:

```
Hero → Categories → **New Arrivals** (carousel) → **Best Sellers** (carousel) → Featured Products → Blog Section → AI Advisor → Testimonials
```

### 3.6 — Product Card Enhancement

#### Modify: `src/components/ProductCard.tsx`

Thêm hiển thị:

- **Care Level**: Badge màu (`EASY`=green, `MODERATE`=yellow, `HARD`=orange, `EXPERT`=red) → data từ `product.species?.careLevel`
- **Size**: Badge/text → data từ `product.size` (XS/S/M/L/XL)
- **Wishlist button**: overlay góc phải

```tsx
// Ví dụ layout mới trong ProductCard
<div className="mt-2 flex gap-1.5">
  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
    {product.species?.careLevel}
  </span>
  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
    Size: {product.size}
  </span>
</div>
```

#### Modify: `ProductDetailPage.tsx`

- Thêm Care Level & Size vào specs section
- Thêm WishlistButton

### Phase 3 — Testing Checklist

- [ ] Unit tests: `ProductCard.test.tsx` — renders careLevel, size badges
- [ ] Unit tests: `WishlistButton.test.tsx` — toggle state, loading, auth guard
- [ ] Unit tests: `BlogCard.test.tsx` — renders title, excerpt, date
- [ ] Unit tests: `ProductCarousel.test.tsx` — renders slides, handles empty data
- [ ] Component tests: `HomePage` renders all new sections in correct order
- [ ] Integration: Wishlist flow (add → check → remove → verify)
- [ ] Responsive test: Carousel breakpoints (mobile/tablet/desktop)
- [ ] A11y: keyboard navigation on carousel, focus management on wishlist

```bash
cd apps/web-client
pnpm test
pnpm test -- --coverage
```

---

## 🗓️ PHASE 4: Admin Panel for Blog

**Duration estimate**: 2 days coding + 0.5 day testing
**Skills**: `frontend-design`, `ui-styling`

### 4.1 — Admin Blog Management Pages

| File                               | Description                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| `src/pages/admin/BlogListPage.tsx` | DataTable: list all posts, filter by status, search                                   |
| `src/pages/admin/BlogFormPage.tsx` | Form: title, slug (auto-gen), content (rich editor), tags, cover image, status toggle |

#### Rich Text Editor Options:

- **TipTap** (recommended — headless, React-native, lightweight)
- **React Quill** (simpler but heavier)

```bash
cd apps/web-client
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
```

### 4.2 — Admin Hooks & Services

| File                                     | Description                                                          |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `packages/services/src/admin.service.ts` | MODIFY: thêm blog CRUD functions                                     |
| `apps/web-client/src/hooks/useBlogs.ts`  | MODIFY: thêm admin mutations (create, update, delete, toggle status) |

### 4.3 — Admin Layout & Routing

#### Modify: `src/layouts/AdminLayout.tsx`

- Thêm "Blog" vào sidebar navigation

#### Modify: Router config

- Thêm routes: `/admin/blogs`, `/admin/blogs/new`, `/admin/blogs/:id/edit`

### Phase 4 — Testing Checklist

- [ ] Admin blog CRUD: create → edit → toggle status → delete
- [ ] Slug auto-generation from title
- [ ] Rich text editor renders & saves content correctly
- [ ] Admin auth guard (only ADMIN can access)
- [ ] Image upload for cover image
- [ ] Validate required fields (title, content)

---

## 🗓️ PHASE 5: Icon System Upgrade (AnimateIcons)

**Duration estimate**: 1-2 days coding + 0.5 day testing
**Skills**: `ui-styling`, `aesthetic`

### 5.1 — Install & Setup

```bash
cd apps/web-client
pnpm add animateicons
```

### 5.2 — Icon Replacement Plan

#### Audit current icon usage:

Scan toàn bộ codebase tìm SVG inline icons / emoji icons (🐟, ✨, ★, etc.)

#### Components to update:

| Location            | Current           | Replace With                             |
| ------------------- | ----------------- | ---------------------------------------- |
| Header/Nav          | SVG inline icons  | AnimateIcons nav icons                   |
| ProductCard         | Emoji fallback 🐟 | AnimateIcon fish placeholder             |
| WishlistButton      | Heart SVG         | AnimateIcon heart (animated fill/unfill) |
| Cart icon (header)  | SVG shopping cart | AnimateIcon cart (bounce on add)         |
| Add to Cart button  | Text only         | AnimateIcon + text                       |
| Admin actions       | Text buttons      | AnimateIcon edit/delete/add              |
| Rating stars        | ★ ☆ text          | AnimateIcon star (animated)              |
| Toast notifications | None              | AnimateIcon check/error/warning          |

### 5.3 — Animation Patterns

```typescript
// Wrapper component cho consistent animation behavior
interface AnimatedIconProps {
  icon: string;
  trigger: 'hover' | 'click' | 'loop' | 'morph';
  size?: number;
  className?: string;
}
```

#### Animation states:

- **Hover**: Icon nhẹ nhàng animate khi hover (scale/rotate)
- **Click**: Quick bounce/pulse animation
- **Loading**: Spinning/pulsing animation
- **Success**: Checkmark morph animation

### Phase 5 — Testing Checklist

- [ ] Visual regression: Screenshot test trước/sau thay icon
- [ ] All icons render correctly ở các breakpoints
- [ ] Animation performance (no jank on mobile)
- [ ] Accessibility: `aria-label` trên tất cả icon buttons
- [ ] Dark mode: icons hiển thị đúng contrast

---

## 🗓️ PHASE 6: Integration Testing & Polish

**Duration estimate**: 2 days
**Skills**: `web-testing`, `debugging`, `code-review`

### 6.1 — End-to-End Tests (Playwright)

| Test File                         | Flow                                                                     |
| --------------------------------- | ------------------------------------------------------------------------ |
| `tests/e2e/blog.spec.ts`          | Home → Blog section → Blog list → Blog detail → Back                     |
| `tests/e2e/wishlist.spec.ts`      | Login → Product list → Add wishlist → Navigate to Wishlist page → Remove |
| `tests/e2e/home-sections.spec.ts` | Home page loads all sections in order, carousels slide                   |
| `tests/e2e/product-card.spec.ts`  | Product cards show careLevel, size, wishlist button                      |

### 6.2 — Performance & Optimization

- [ ] Lazy load blog & wishlist routes (`React.lazy`)
- [ ] Image optimization for blog cover images
- [ ] Carousel: lazy load off-screen slides
- [ ] Bundle size check after AnimateIcons integration
- [ ] Lighthouse score check (Performance, Accessibility, SEO)

### 6.3 — SEO for Blog

- [ ] `<Helmet>` meta tags on BlogDetailPage (title, description, og:image)
- [ ] Structured data (JSON-LD) for blog posts
- [ ] Sitemap generation consideration

### 6.4 — Responsive & Cross-browser

- [ ] Mobile: carousel touch/swipe works
- [ ] Tablet: layout adapts correctly
- [ ] Desktop: all sections render properly
- [ ] Dark mode: all new components support dark theme

---

## 📁 Complete File Change Map

### NEW Files (~20 files)

```
apps/api-server/
├── src/services/blog.service.ts
├── src/services/wishlist.service.ts
├── src/routes/blog.routes.ts
├── src/routes/wishlist.routes.ts

packages/services/src/
├── blog.service.ts
├── wishlist.service.ts

apps/web-client/src/
├── hooks/useBlogs.ts
├── hooks/useWishlist.ts
├── store/wishlist.slice.ts
├── components/WishlistButton.tsx
├── components/BlogCard.tsx
├── components/BlogSection.tsx
├── components/ProductCarousel.tsx
├── components/NewArrivalsSection.tsx
├── components/BestSellersSection.tsx
├── pages/WishlistPage.tsx
├── pages/BlogListPage.tsx
├── pages/BlogDetailPage.tsx
├── pages/admin/BlogListPage.tsx
├── pages/admin/BlogFormPage.tsx
```

### MODIFIED Files (~15 files)

```
apps/api-server/prisma/schema.prisma    → Add Blog, Wishlist models
apps/api-server/src/app.ts              → Register new routes
apps/api-server/src/schemas/index.ts    → Add blog/wishlist schemas
apps/api-server/src/routes/admin.routes.ts → Add blog admin endpoints
apps/api-server/src/routes/product.routes.ts → Add new-arrivals, best-sellers

packages/types/src/index.ts             → Add Blog, Wishlist types
packages/services/src/index.ts          → Export new services
packages/services/src/admin.service.ts  → Add blog admin functions

apps/web-client/src/App.tsx             → Add new routes
apps/web-client/src/hooks/index.ts      → Export new hooks
apps/web-client/src/hooks/queryKeys.ts  → Add blog, wishlist keys
apps/web-client/src/components/ProductCard.tsx → Add careLevel, size, wishlist
apps/web-client/src/pages/HomePage.tsx  → Add new sections
apps/web-client/src/pages/ProductDetailPage.tsx → Add wishlist, careLevel, size
apps/web-client/src/layouts/AdminLayout.tsx → Add Blog nav item
```

### Dependencies to Install

```bash
# web-client
pnpm --filter web-client add swiper animateicons
pnpm --filter web-client add @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
```

---

## ⏱️ Timeline Summary

| Phase     | Scope                    | Coding        | Testing      | Total           |
| --------- | ------------------------ | ------------- | ------------ | --------------- |
| 1         | DB Schema + Backend APIs | 2-3 days      | 1 day        | 3-4 days        |
| 2         | Shared Types + Services  | 1 day         | 0.5 day      | 1.5 days        |
| 3         | Frontend Core Features   | 3-4 days      | 1 day        | 4-5 days        |
| 4         | Admin Blog Panel         | 2 days        | 0.5 day      | 2.5 days        |
| 5         | Icon System Upgrade      | 1-2 days      | 0.5 day      | 1.5-2.5 days    |
| 6         | Integration & Polish     | –             | 2 days       | 2 days          |
| **Total** |                          | **9-12 days** | **5.5 days** | **~15-18 days** |

---

## 🎯 Expected Outcome

- More engaging Home Page layout (New Arrivals, Best Sellers carousels, Blog section)
- Fully functional Blog system (public + admin CRUD + SEO)
- Complete Wishlist feature (add/remove, dedicated page, auth-aware)
- Improved UI animation & interaction (AnimateIcons throughout)
- More informative Product cards (careLevel badge, size badge, wishlist button)
