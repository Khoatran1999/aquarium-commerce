# AquaCommerce – Final README (Feasibility-Validated, AI-Ready Spec)

> **Mục tiêu:** Xây dựng một **portfolio Frontend cấp Middle → Senior-ready** với **kiến trúc chuẩn, UI/UX xịn, realtime, AI, CI/CD cơ bản**. Toàn bộ đặc tả được gom trong **một file README duy nhất** để **Claude Agent phân tích và sinh code**.

> **Đánh giá khả thi:** Đã **tối ưu phạm vi** để hoàn thành trong **1–2 tuần**, tập trung **Frontend architecture + UI/UX + Realtime + AI**, backend ở mức **lean nhưng đúng nghiệp vụ**.
>
> ##

---

## 1. Feasibility Assessment – Đánh giá tính khả thi

### 1.1 Ràng buộc

- Mục tiêu: **Portfolio FE** (không phải sản phẩm thương mại)

### 1.2 Chiến lược tối ưu

| Thành phần | Quyết định                       | Lý do                                    |
| ---------- | -------------------------------- | ---------------------------------------- |
| Backend    | Lean API + Supabase              | Tiết kiệm thời gian, vẫn chuẩn nghiệp vụ |
| Auth       | Supabase Auth                    | Bỏ toàn bộ auth phức tạp                 |
| Realtime   | Socket.io (events cốt lõi)       | Đủ trình diễn kiến trúc                  |
| AI         | 1 chatbot + 1 recommend endpoint | Tối ưu effort / hiệu quả                 |
| Payment    | Mock flow                        | Không sa đà nghiệp vụ ngoài lõi          |

---

## 2. Project Overview

**Tên:** AquaCommerce

**Mô tả:** Website e-commerce bán cá cảnh gồm:

- Client shop
- Admin dashboard
- Backend API
- AI tư vấn + gợi ý
- Realtime order

**Định vị:** Frontend architecture + UX + system thinking

---

## 3. High-Level Architecture

```
Monorepo
│
├── apps/
│   ├── web-client    (React + TS + Redux + Tailwind)
│   ├── admin-panel   (React + TS + Redux + Tailwind)
│   └── api-server    (Node + Express + Prisma + PostgreSQL)
│
├── packages/
│   ├── ui            (shared UI components)
│   ├── hooks         (custom hooks)
│   ├── services      (API clients)
│   └── types         (shared types)
│
└── .github/workflows (CI/CD)
```

---

## 4. Tech Stack

### Frontend

- React + Vite
- Tailwind CSS + Shadcn UI
- Redux Toolkit
- TanStack Query
- React Hook Form + Zod
- Framer Motion
- Socket.io client
- Three.js

### Backend

- Node.js + Express
- Prisma ORM
- PostgreSQL (Supabase)
- Supabase Auth
- Socket.io

### AI

- Claude API / OpenAI API

### CI/CD

- GitHub Actions → Vercel

---

## 5. Scope Control – Phạm vi khả thi

### Must Have (bắt buộc)

- Auth (Supabase)
- Product listing + filter
- Product detail
- Cart + Checkout mock
- Realtime order status
- Admin dashboard cơ bản
- AI chat tư vấn

### Nice to Have

- AI recommend combo
- Animation nâng cao
- Dark mode

---

## 6. Business Features

### Client

- Auth (Supabase)
- Product listing + filter nâng cao
- Product detail
- Cart
- Checkout (mock payment)
- Order tracking realtime
- AI chat tư vấn chăm sóc cá
- Đánh giá

### Admin

- Dashboard realtime
- CRUD sản phẩm
- Quản lý tồn kho
- Quản lý đơn
- Thống kê

---

## 7. Authentication – Supabase

```
Frontend → Supabase Auth → JWT → API Server → PostgreSQL
```

Roles:

- user
- admin

---

## 8. Redux Architecture

```
store/
 ├── auth.slice.ts
 ├── product.slice.ts
 ├── cart.slice.ts
 ├── order.slice.ts
 ├── ui.slice.ts
 └── index.ts
```

- Redux: business + UI state

---

## 9. Frontend Architecture

```
src/
 ├── app/              # routing + layout
 ├── modules/          # domain modules
 │    ├── auth/
 │    ├── products/
 │    ├── cart/
 │    ├── orders/
 │    ├── admin/
 │    └── ai/
 ├── shared/
 │    ├── ui/
 │    ├── hooks/
 │    ├── services/
 │    ├── utils/
 │    └── types/
```

Principles:

- Feature-based architecture
- Domain separation
- High cohesion – low coupling

---

## 10. Realtime Architecture

```
Client → Socket.io → API Server → Admin Dashboard
```

Events:

- order_created
- order_updated
- inventory_updated

---

## 11. AI Architecture

### AI Chat

- Input: hồ cá, kinh nghiệm, nhu cầu
- Output: gợi ý cá + hướng dẫn chăm sóc

### AI Recommend

- Gợi ý sản phẩm tương tự
- Gợi ý combo cá

---

## 12. Database Design – Real Business Grade

### Core Entities

```
users
fish_species
fish_images
fish_batches
inventory
products
carts
cart_items
orders
order_items
inventory_logs
reviews
ai_chat_sessions
ai_chat_messages
```

###

```

```

### Inventory Flow

Add to cart:

```
available → reserved
```

Checkout success:

```
reserved → sold
```

Cancel cart:

```
reserved → available
```

---

## 13. API Scope (Lean)

### Phân tích API dựa trên nghiệp vụ

---

## 14. CI/CD Flow

```
Git push → GitHub Actions → Lint + Test → Vercel Deploy
```

---

##

---

## 19. Success Criteria

- UI/UX chuyên nghiệp
- Redux + Query clean
- Realtime chạy mượt
- AI hoạt động
- README đầy đủ system design

---
