# Hướng dẫn chạy AquaLuxe ở Local

## Yêu cầu hệ thống

| Công cụ    | Phiên bản | Kiểm tra         |
|------------|-----------|------------------|
| Node.js    | 18+       | `node -v`        |
| pnpm       | 9.x       | `pnpm -v`        |
| PostgreSQL | 15+       | `psql --version` |

> Chưa có pnpm: `npm install -g pnpm`

---

## Bước 1 — Clone & cài dependencies

```bash
git clone <repo-url> aquarium-commerce
cd aquarium-commerce
pnpm install
```

---

## Bước 2 — Cấu hình biến môi trường

```bash
cp .env.example .env
```

Mở `.env` và điền các giá trị **bắt buộc**:

```env
# Database — PostgreSQL connection string
DATABASE_URL=postgresql://postgres:password@localhost:5432/aquarium_commerce

# JWT Secret — tạo bằng lệnh: openssl rand -base64 64
JWT_SECRET=your-secret-key-at-least-32-chars

# Ports (giữ nguyên nếu không conflict)
PORT=3001
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3000
```

### Biến tùy chọn

| Biến | Mô tả |
|------|-------|
| `VITE_SUPABASE_URL` | Supabase project URL (nếu dùng Supabase) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `OPENAI_API_KEY` | OpenAI API key (tính năng AI Chat) |
| `SEED_ADMIN_PASSWORD` | Mật khẩu admin khi seed data |
| `SEED_USER_PASSWORD` | Mật khẩu user khi seed data |

---

## Bước 3 — Thiết lập Database

```bash
# Vào thư mục API server
cd apps/api-server

# Tạo Prisma client
pnpm db:generate

# Chạy migrations (tạo bảng)
pnpm db:migrate

# Seed dữ liệu mẫu (sản phẩm, tài khoản, ...)
pnpm db:seed

# Quay về thư mục gốc
cd ../..
```

> **Xem/chỉnh sửa database trực quan:**
> ```bash
> cd apps/api-server && pnpm db:studio
> ```
> → Mở Prisma Studio tại `http://localhost:5555`

---

## Bước 4 — Chạy dự án

### Cách 1: Chạy tất cả cùng lúc (một terminal)

```bash
pnpm dev
```

### Cách 2: Chạy riêng từng phần (khuyến nghị — 2 terminal)

**Terminal 1 — API Server:**
```bash
pnpm dev:api
```
→ API chạy tại `http://localhost:3001`

**Terminal 2 — Web Client:**
```bash
pnpm dev:client
```
→ Web chạy tại `http://localhost:3000`

### Cách 3: Chỉ chạy Frontend (không cần backend)

Nếu chỉ muốn xem UI mà không có API:

```bash
cd apps/web-client
npx vite --port 3000
```

---

## Bước 5 — Truy cập ứng dụng

| Trang | URL |
|-------|-----|
| Trang chủ | http://localhost:3000 |
| Sản phẩm | http://localhost:3000/products |
| Giỏ hàng | http://localhost:3000/cart |
| AI Chat | http://localhost:3000/ai-chat |
| Admin Login | http://localhost:3000/admin/login |
| Admin Panel | http://localhost:3000/admin |
| API Health | http://localhost:3001/api/health |
| Prisma Studio | http://localhost:5555 |

### Tài khoản mặc định (sau khi seed)

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | `admin@aquacommerce.com` | Giá trị `SEED_ADMIN_PASSWORD` trong `.env` |
| User | `user@aquacommerce.com` | Giá trị `SEED_USER_PASSWORD` trong `.env` |

---

## Các lệnh hữu ích

| Lệnh | Mô tả |
|------|-------|
| `pnpm dev` | Chạy tất cả (API + Client) |
| `pnpm dev:api` | Chỉ chạy API server (port 3001) |
| `pnpm dev:client` | Chỉ chạy Web client (port 3000) |
| `pnpm build` | Build production |
| `pnpm lint` | Kiểm tra ESLint |
| `pnpm type-check` | Kiểm tra TypeScript |
| `pnpm format` | Format code với Prettier |
| `pnpm test` | Chạy tests |

**Lệnh database** (chạy trong `apps/api-server`):

| Lệnh | Mô tả |
|------|-------|
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Chạy migrations |
| `pnpm db:push` | Push schema (không tạo migration file) |
| `pnpm db:seed` | Seed dữ liệu mẫu |
| `pnpm db:studio` | Mở Prisma Studio |

---

## Cấu trúc dự án

```
aquarium-commerce/
├── apps/
│   ├── api-server/          # Express + Prisma + TypeScript (port 3001)
│   │   ├── src/             # Source code API
│   │   └── prisma/          # Schema & seed data
│   └── web-client/          # React 19 + Vite + Tailwind v4 (port 3000)
│       └── src/
│           ├── pages/           # Customer pages
│           ├── pages/admin/     # Admin pages
│           ├── components/      # Shared components
│           ├── context/         # React context (Cart, Theme, ...)
│           ├── hooks/           # Custom hooks
│           └── store/           # Redux store
├── packages/
│   ├── types/               # Shared TypeScript types
│   └── ui/                  # Shared UI components (Skeleton, ...)
├── .env                     # Biến môi trường (tạo từ .env.example)
├── .env.example             # Template biến môi trường
├── package.json             # Root scripts
├── pnpm-workspace.yaml      # Workspace config
└── turbo.json               # Turborepo pipeline config
```

---

## Xử lý lỗi thường gặp

### `pnpm: command not found`

```bash
npm install -g pnpm
```

### CORS error khi gọi API

Kiểm tra `CORS_ORIGINS` trong `.env`:
```env
CORS_ORIGINS=http://localhost:3000
```

### Database connection failed

- Đảm bảo PostgreSQL đang chạy
- Kiểm tra `DATABASE_URL` đúng định dạng:
  `postgresql://user:password@host:port/database`

### Port đã bị chiếm dụng

```bash
# Tìm process đang dùng port (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill process theo PID
taskkill /PID <PID> /F
```

### Prisma client chưa được generate

```bash
cd apps/api-server && pnpm db:generate
```

### Lỗi TypeScript hoặc ESLint

```bash
pnpm type-check
pnpm lint
```
