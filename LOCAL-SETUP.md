# Hướng dẫn chạy dự án AquaCommerce ở Local

## Yêu cầu hệ thống

| Công cụ    | Phiên bản tối thiểu | Kiểm tra         |
| ---------- | ------------------- | ---------------- |
| Node.js    | 18+                 | `node -v`        |
| pnpm       | 9.x                 | `pnpm -v`        |
| PostgreSQL | 15+ (hoặc Supabase) | `psql --version` |
| Git        | 2.x                 | `git -v`         |

> Nếu chưa có pnpm: `npm install -g pnpm`

---

## 1. Clone & cài đặt dependencies

```bash
git clone <repo-url> aquarium-commerce
cd aquarium-commerce
pnpm install
```

---

## 2. Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc:

```bash
cp .env.example .env
```

Mở `.env` và điền các giá trị **bắt buộc**:

```env
# ── Database (bắt buộc) ──
# PostgreSQL connection string (Supabase hoặc local)
DATABASE_URL=postgresql://postgres:password@localhost:5432/aquarium_commerce

# ── Security (bắt buộc) ──
# Tạo JWT secret: openssl rand -base64 64
JWT_SECRET=your-jwt-secret-at-least-32-characters-long

# ── API ──
PORT=3001
VITE_API_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3000
```

### Biến tùy chọn

| Biến                        | Mô tả                         |
| --------------------------- | ----------------------------- |
| `SUPABASE_URL`              | Supabase project URL          |
| `SUPABASE_ANON_KEY`         | Supabase anon key             |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key     |
| `OPENAI_API_KEY`            | OpenAI API key (tính năng AI) |
| `SEED_ADMIN_PASSWORD`       | Mật khẩu admin khi seed data  |
| `SEED_USER_PASSWORD`        | Mật khẩu user khi seed data   |

---

## 3. Thiết lập Database

```bash
# Tạo Prisma client
cd apps/api-server
pnpm db:generate

# Chạy migrations (tạo bảng trong database)
pnpm db:migrate

# Seed dữ liệu mẫu (sản phẩm, tài khoản admin, ...)
pnpm db:seed

# Quay về thư mục gốc
cd ../..
```

> **Xem database:** `cd apps/api-server && pnpm db:studio` → mở Prisma Studio tại `http://localhost:5555`

---

## 4. Chạy dự án

### Cách 1: Chạy tất cả cùng lúc

```bash
pnpm dev
```

### Cách 2: Chạy riêng từng phần (khuyến nghị)

Mở **2 terminal** riêng biệt:

**Terminal 1 – API Server:**

```bash
pnpm dev:api
```

→ API chạy tại `http://localhost:3001`

**Terminal 2 – Web Client:**

```bash
pnpm dev:client
```

→ Client chạy tại `http://localhost:3000`

---

## 5. Truy cập ứng dụng

| Trang           | URL                               |
| --------------- | --------------------------------- |
| **Trang chủ**   | http://localhost:3000             |
| **Sản phẩm**    | http://localhost:3000/products    |
| **Giỏ hàng**    | http://localhost:3000/cart        |
| **Admin Login** | http://localhost:3000/admin/login |
| **Admin Panel** | http://localhost:3000/admin       |
| **API Health**  | http://localhost:3001/api/health  |

### Tài khoản mặc định (sau khi seed)

- **Admin:** `admin@aquacommerce.com` / mật khẩu trong `SEED_ADMIN_PASSWORD`
- **User:** `user@aquacommerce.com` / mật khẩu trong `SEED_USER_PASSWORD`

---

## 6. Các lệnh hữu ích

| Lệnh              | Mô tả                      |
| ----------------- | -------------------------- |
| `pnpm dev`        | Chạy tất cả (API + Client) |
| `pnpm dev:api`    | Chỉ chạy API server        |
| `pnpm dev:client` | Chỉ chạy Web client        |
| `pnpm build`      | Build production           |
| `pnpm test`       | Chạy tất cả tests          |
| `pnpm test:watch` | Chạy tests ở chế độ watch  |
| `pnpm lint`       | Kiểm tra linting           |
| `pnpm type-check` | Kiểm tra TypeScript types  |
| `pnpm format`     | Format code với Prettier   |
| `pnpm clean`      | Xóa dist/ và node_modules  |

---

## 7. Cấu trúc dự án

```
aquarium-commerce/
├── apps/
│   ├── api-server/      # Express + Prisma API (port 3001)
│   └── web-client/      # React + Vite SPA (port 3000)
│       ├── src/pages/           # Trang khách hàng
│       └── src/pages/admin/     # Trang quản trị (Admin)
├── packages/
│   ├── hooks/           # Shared React hooks
│   ├── services/        # API service layer (axios)
│   ├── types/           # Shared TypeScript types
│   └── ui/              # Shared UI components
├── .env                 # Biến môi trường (tạo từ .env.example)
├── package.json         # Root scripts
└── turbo.json           # Turborepo config
```

---

## Xử lý lỗi thường gặp

### CORS error

Kiểm tra `CORS_ORIGINS` trong `.env` có chứa `http://localhost:3000`.

### Database connection failed

- Đảm bảo PostgreSQL đang chạy
- Kiểm tra `DATABASE_URL` trong `.env` chính xác

### Port đã bị chiếm

```bash
# Windows - tìm process dùng port 3001
netstat -ano | findstr :3001

# Kill process
taskkill /PID <PID> /F
```

### Prisma client chưa generate

```bash
cd apps/api-server && pnpm db:generate
```
