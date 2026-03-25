# AquaLuxe Commerce — CLAUDE.md

> Hướng dẫn làm việc cho Claude Code trong project này.
> Cập nhật lần cuối: 2026-03-25

---

## 1. Project Overview

**AquaLuxe** là nền tảng thương mại điện tử bán cá cảnh cao cấp (ornamental fish).
Monorepo Turborepo gồm:
- `apps/web-client` — React 19 + Vite + Tailwind v4 (frontend)
- `apps/api-server` — Backend API
- `packages/ui` — Shared UI components (Skeleton, v.v.)
- `packages/types` — Shared TypeScript types

---

## 2. Tech Stack

| Lĩnh vực | Công nghệ |
|----------|-----------|
| Frontend | React 19, Vite, TypeScript |
| Styling | Tailwind CSS v4 (`@theme {}` block, không dùng tailwind.config.js) |
| Animations | Framer Motion (micro-interactions) + GSAP + @gsap/react (carousel, ScrollTrigger) |
| State | Redux Toolkit + redux-persist |
| Data fetching | TanStack Query v5 |
| Icons | lucide-react (**KHÔNG dùng brand icons**: Facebook/Instagram/YouTube → inline SVG) |
| Package manager | pnpm@9 |
| Monorepo | Turborepo |

---

## 3. Lệnh thường dùng

```bash
# Development
pnpm dev              # Chạy tất cả apps
pnpm dev:client       # Chỉ chạy web-client

# Build & Check
pnpm build            # Build toàn bộ
pnpm lint             # ESLint
pnpm type-check       # TypeScript check
pnpm test             # Vitest
pnpm format           # Prettier
```

---

## 4. Design System v2 — Quy tắc bắt buộc

### 4.1 File chính
`apps/web-client/src/index.css` — Nguồn duy nhất cho design tokens.

### 4.2 Tailwind v4 Token Mapping

> **QUAN TRỌNG**: Tailwind v4 tự động convert `@theme` CSS vars thành utility classes.
> **BẮT BUỘC dùng semantic tokens, KHÔNG ĐƯỢC dùng hardcoded hex.**

| CSS Variable | Tailwind Class | Light | Dark |
|---|---|---|---|
| `--color-primary` | `text-primary` / `bg-primary` / `border-primary` | `#0094C4` | `#00CCEE` |
| `--color-primary-dark` | `text-primary-dark` / `bg-primary-dark` | `#0077A3` | `#00A8CC` |
| `--color-primary-light` | `text-primary-light` | `#33B6D8` | `#55DDFF` |
| `--color-secondary` | `text-secondary` / `bg-secondary` | `#FF5252` | `#FF6B6B` |
| `--color-accent` | `text-accent` / `bg-accent` | `#FFB300` | `#FFB300` |
| `--color-background` | `bg-background` | `#F2F8FC` | `#000F1E` |
| `--color-foreground` | `text-foreground` | `#0A1825` | `#D6EAFF` |
| `--color-card` | `bg-card` | `#FFFFFF` | `#041628` |
| `--color-card-foreground` | `text-card-foreground` | `#0A1825` | `#D6EAFF` |
| `--color-muted` | `bg-muted` | `#E4EFF8` | `#071F36` |
| `--color-muted-foreground` | `text-muted-foreground` | `#547698` | `#6496B8` |
| `--color-border` | `border-border` | `#CCE0ED` | `#0D2C45` |
| `--color-success` | `text-success` / `bg-success` | `#10b981` | same |
| `--color-danger` | `text-danger` / `bg-danger` | `#ef4444` | same |

### 4.3 Fonts

```tsx
// Heading (h1–h4): font-heading → Space Grotesk (tự động via global CSS)
// Body: font-display → Plus Jakarta Sans (mặc định body)
```

### 4.4 Shadows

```tsx
shadow-card     // --shadow-card
shadow-elevated // --shadow-elevated
```

### 4.5 Border Radius

```tsx
rounded-sm  // --radius-sm: 0.375rem
rounded-md  // --radius-md: 0.5rem
rounded-lg  // --radius-lg: 0.875rem
rounded-xl  // --radius-xl: 1.25rem
rounded-full // --radius-full: 9999px
```

---

## 5. Quy tắc Coding

### 5.1 Icons
- ✅ Dùng `lucide-react` cho UI icons
- ❌ KHÔNG dùng brand icons từ lucide (Facebook, Instagram, YouTube đã deprecated)
- ✅ Brand icons → inline SVG component (xem `Footer.tsx`)

### 5.2 GSAP Pattern

```tsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Luôn dùng scope + dependencies
useGSAP(() => { /* animations */ }, { scope: ref, dependencies: [] });
```

### 5.3 Accessibility
- Mọi image phải có `alt` text
- Icon-only buttons phải có `aria-label`
- Minimum touch target: `44x44px`
- Minimum font size: `text-xs` (12px), KHÔNG dùng `text-[10px]`
- Focus states: `focus-visible:outline-none focus-visible:ring-2`
- Contrast text trên nền tối: tối thiểu `text-white/80` (KHÔNG dùng `text-white/50`)
- Luôn support `useReducedMotion()` cho animations

### 5.4 Performance
- `loading="lazy"` cho images below-fold
- Bubble animations: tối đa 8 elements
- `memo()` cho ProductCard và các list items

### 5.5 Tailwind Specifics (v4)
- Cấu hình trong `@theme {}` block của `index.css` (KHÔNG có tailwind.config.js)
- Dùng `@layer utilities {}` để thêm custom utilities
- Scale hover: dùng `hover:scale-105` (KHÔNG dùng `scale-108` - không phải default)
- `cursor-pointer` bắt buộc cho mọi clickable element (cards, buttons)

---

## 6. Improvement Plan — UI/UX Overhaul

### Phase 1 — Design System Foundation 🔴 CRITICAL
**Mục tiêu**: Đồng bộ toàn bộ codebase với Design System v2, loại bỏ hardcoded hex.

| Task | File | Status |
|------|------|--------|
| 1.1 Tạo CLAUDE.md | `CLAUDE.md` | ✅ Done |
| 1.2 Cập nhật dark mode CSS vars | `index.css` | ✅ Done |
| 1.3 Replace hex → tokens: Header | `Header.tsx` | ✅ Done |
| 1.4 Replace hex → tokens: HomePage | `HomePage.tsx` | ✅ Done |
| 1.5 Replace hex → tokens: Footer | `Footer.tsx` | ✅ Done |
| 1.6 Replace hex → tokens: ProductCard | `ProductCard.tsx` | ✅ Done |
| 1.7 Replace hex → tokens: Sections + BlogCard + GsapCarousel + CartFlyContext | all | ✅ Done |
| 1.8 Review: 0 hardcoded hex còn lại, TypeScript pass | all | ✅ Done |

### Phase 2 — Component Fixes 🟠 IMPORTANT ✅ DONE
| 2.1 Fix trust badge contrast `/50`→`/80` | ✅ | 2.2 Fix Koi icon | ✅ | 2.3 scale-105 | ✅ | 2.4 text-xs | ✅ | 2.5 showAddToCart | ✅ | 2.6 cursor-pointer | ✅ |

### Phase 3 — Header Enhancement 🟠 IMPORTANT ✅ DONE
| 3.1 Mobile search | ✅ | 3.2 Mobile theme toggle | ✅ | 3.3 Sign In mobile | ✅ |

### Phase 4 — HomePage Enhancement 🟡 MEDIUM ✅ DONE
| 4.1 Hero CTA + min-h-screen | ✅ | 4.2 Stats icons | ✅ | 4.3 Bubbles 8 | ✅ | 4.4 Why AquaLuxe | ✅ | 4.5 Newsletter | ✅ |

### Phase 5 — Footer Enhancement 🟡 MEDIUM ✅ DONE
**Mục tiêu**: Tăng tính đầy đủ và conversion.

| Task | File | Status |
|------|------|--------|
| 5.1 Thêm payment method icons (Visa, Mastercard, PayPal SVG) | `Footer.tsx` | ✅ Done |
| 5.2 Secure Checkout badge + AI Advisor highlight | `Footer.tsx` | ✅ Done |

### Phase 6 — All Pages Refactor ✅ DONE
**Mục tiêu**: Áp dụng Design System v2 standards lên toàn bộ pages và components còn lại.
**Quy trình**: CODING → REVIEW → FIX → REPORT (parallel subagents)

#### Batch A — Auth Pages + Footer ✅ DONE
| Task | Files | Status |
|------|-------|--------|
| 6A.1 Refactor Auth pages | `LoginPage`, `RegisterPage`, `AdminLoginPage` | ✅ Done |
| 6A.2 Phase 5 Footer: payment icons + contact | `Footer.tsx` | ✅ Done |

#### Batch B — Shopping Flow ✅ DONE
| Task | Files | Status |
|------|-------|--------|
| 6B.1 Refactor shopping pages | `ProductListingPage`, `ProductDetailPage`, `CartPage`, `CheckoutPage` | ✅ Done |

#### Batch C — Account + Content Pages ✅ DONE
| Task | Files | Status |
|------|-------|--------|
| 6C.1 Refactor account pages | `ProfilePage`, `OrdersPage`, `OrderDetailPage`, `OrderSuccessPage` | ✅ Done |
| 6C.2 Refactor content pages | `WishlistPage`, `SearchPage`, `NotFoundPage`, `BlogListPage`, `BlogDetailPage` | ✅ Done |

#### Batch D — Admin Pages ✅ DONE
| Task | Files | Status |
|------|-------|--------|
| 6D.1 Refactor admin pages | `DashboardPage`, `ProductListPage`, `ProductFormPage`, `OrderListPage`, `OrderDetailPage(admin)`, `InventoryPage`, `BlogListPage(admin)`, `BlogFormPage`, `SpeciesPage` | ✅ Done |

#### Batch E — Remaining Components ✅ DONE
| Task | Files | Status |
|------|-------|--------|
| 6E.1 Refactor shared components | `WishlistButton`, `BackToTop`, `ReviewSection` | ✅ Done |
| 6E.2 Refactor admin components | `ConfirmDialog`, `DataTable`, `StatsCard`, `StatusBadge`, `RichTextEditor` | ✅ Done |
| 6E.3 Refactor icon components | `AnimatedIcon`, `StarRating` | ✅ Done |

---

## 7. Workflow Process

Mỗi phase tuân theo quy trình:

```
CODING → REVIEW/TEST → FIX → REPORT
```

1. **CODING**: Implement thay đổi
2. **REVIEW**: Đọc lại file đã sửa, check theo Pre-Delivery Checklist
3. **TEST**: Kiểm tra `pnpm lint` và `pnpm type-check` pass
4. **FIX**: Sửa các issues phát hiện trong Review/Test
5. **REPORT**: Tổng kết những gì đã thay đổi trong phase, liệt kê files affected

### Pre-Delivery Checklist
- [ ] Không có `text-[#...]` hoặc `bg-[#...]` hardcoded hex
- [ ] Không có `text-[10px]` — dùng `text-xs` tối thiểu
- [ ] Không có `scale-108` — dùng `scale-105`
- [ ] Không có `text-white/50` trên nền tối — dùng `/80` minimum
- [ ] Tất cả clickable elements có `cursor-pointer`
- [ ] Tất cả icon-only buttons có `aria-label`
- [ ] Images có `alt` text
- [ ] Focus states được định nghĩa

---

## 8. File Structure Key

```
apps/web-client/src/
├── index.css                    # ← Design System (source of truth)
├── pages/
│   ├── HomePage.tsx             # ← Main landing page
│   ├── ProductListingPage.tsx
│   ├── ProductDetailPage.tsx
│   └── ...
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # ← Global header
│   │   └── Footer.tsx           # ← Global footer
│   ├── ProductCard.tsx          # ← Product card component
│   ├── GsapCarousel.tsx         # ← Custom GSAP carousel
│   ├── ProductCarousel.tsx      # ← Wrapper cho GsapCarousel
│   ├── NewArrivalsSection.tsx   # ← GSAP ScrollTrigger section
│   ├── BestSellersSection.tsx   # ← GSAP ScrollTrigger section
│   └── BlogSection.tsx          # ← Blog section
├── store/                       # Redux slices
├── hooks/                       # Custom hooks
└── context/                     # React contexts
```
