# Aquarium Commerce (Starter)

This repo contains a minimal React + Redux frontend and a Node + Express backend wired to Supabase.

Quick start:

1) Copy `.env.example` to `.env` and fill in Supabase keys.

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

3) Backend

```bash
cd backend
npm install
npm run start
```

Notes:
- Frontend uses Vite + React + Redux Toolkit and `@supabase/supabase-js` for auth and data.
- Backend provides an example `/api/products` route that reads from a `products` table in Supabase.
- Replace the placeholder Supabase URL and keys in `.env` before running.
