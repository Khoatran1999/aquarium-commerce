# Deployment Guide

## Overview

This project consists of three main applications that can be deployed separately:

1. **Web Client** - Customer-facing e-commerce site
2. **Admin Panel** - Administrative dashboard
3. **API Server** - Backend REST API

## Quick Deploy

### Option 1: Vercel (Recommended for Frontend)

#### Web Client

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/aquarium-commerce&project-name=aquarium-web&root-directory=apps/web-client)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy web-client
cd apps/web-client
vercel --prod
```

**Environment Variables:**

- `VITE_API_URL` - Your API URL (e.g., https://api.yourapp.com)
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

#### Admin Panel

```bash
cd apps/admin-panel
vercel --prod
```

**Environment Variables:** Same as Web Client

### Option 2: Railway (Recommended for API Server)

#### API Server

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yourusername/aquarium-commerce)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy API server
cd apps/api-server
railway up
```

**Environment Variables:**

- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection (for migrations)
- `JWT_SECRET` - Secret for JWT tokens
- `CORS_ORIGINS` - Allowed origins (comma-separated)
- `PORT` - Server port (Railway sets this automatically)
- `NODE_ENV=production`

#### Railway Configuration

Create `railway.json` in API server:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm prisma generate && pnpm build"
  },
  "deploy": {
    "startCommand": "node dist/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Option 3: Netlify (Alternative for Frontend)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy web-client
cd apps/web-client
pnpm build
netlify deploy --prod --dir=dist
```

**netlify.toml:**

```toml
[build]
  command = "cd ../.. && pnpm install && pnpm --filter web-client build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Option 4: Render (Alternative for API Server)

1. Connect your GitHub repository
2. Create a new Web Service
3. Configure:
   - **Build Command:** `cd apps/api-server && pnpm install && pnpm prisma generate && pnpm build`
   - **Start Command:** `cd apps/api-server && node dist/index.js`
   - **Environment:** Node

**Environment Variables:** Same as Railway

## Database Setup

### Supabase (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your connection string from Settings > Database
3. Run migrations:

```bash
cd apps/api-server
pnpm prisma migrate deploy
```

4. Seed data (optional):

```bash
pnpm prisma db seed
```

### Direct PostgreSQL

If using your own PostgreSQL:

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Run migrations
cd apps/api-server
pnpm prisma migrate deploy

# Generate Prisma client
pnpm prisma generate
```

## Environment Variables Summary

### Web Client & Admin Panel

| Variable                 | Required | Description            |
| ------------------------ | -------- | ---------------------- |
| `VITE_API_URL`           | ✅       | Backend API URL        |
| `VITE_SUPABASE_URL`      | ✅       | Supabase project URL   |
| `VITE_SUPABASE_ANON_KEY` | ✅       | Supabase anonymous key |

### API Server

| Variable         | Required | Description                                 |
| ---------------- | -------- | ------------------------------------------- |
| `DATABASE_URL`   | ✅       | PostgreSQL connection string                |
| `DIRECT_URL`     | ✅       | Direct database connection (for migrations) |
| `JWT_SECRET`     | ✅       | Secret for JWT tokens                       |
| `CORS_ORIGINS`   | ✅       | Allowed origins (comma-separated)           |
| `PORT`           | ⚠️       | Server port (default: 3001)                 |
| `NODE_ENV`       | ⚠️       | Environment (production/development)        |
| `OPENAI_API_KEY` | ❌       | OpenAI API key (if using AI features)       |

## Post-Deployment Checklist

- [ ] All environment variables are set correctly
- [ ] Database migrations have been applied
- [ ] API server is accessible and health check passes
- [ ] Frontend apps can communicate with API
- [ ] CORS is configured correctly
- [ ] SSL certificates are active (HTTPS)
- [ ] Domain DNS is pointing to deployment
- [ ] Custom domains are configured (if applicable)
- [ ] Error tracking is set up (Sentry, etc.)
- [ ] Analytics is configured (Google Analytics, etc.)
- [ ] Performance monitoring is active
- [ ] Backup strategy is in place for database

## Monitoring & Maintenance

### Health Checks

```bash
# API Server health check
curl https://api.yourapp.com/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-02-11T..."}
```

### Logs

**Vercel:**

```bash
vercel logs <project-name>
```

**Railway:**

```bash
railway logs
```

### Database Backups

**Supabase:** Automatic daily backups (available in dashboard)

**Manual backup:**

```bash
pg_dump $DATABASE_URL > backup.sql
```

## Troubleshooting

### Build Failures

1. Check pnpm version matches `packageManager` in root `package.json`
2. Ensure all dependencies are in `pnpm-lock.yaml`
3. Verify Prisma client is generated before build
4. Check build logs for specific errors

### Runtime Errors

1. **CORS errors:** Check `CORS_ORIGINS` environment variable
2. **Database errors:** Verify `DATABASE_URL` is correct and accessible
3. **Auth errors:** Check `JWT_SECRET` is set and matches across deployments
4. **404 errors:** Ensure rewrites/redirects are configured for SPA routing

### Performance Issues

1. Enable caching headers for static assets
2. Use CDN for frontend assets
3. Optimize database queries with indexes
4. Enable gzip compression on API server
5. Monitor response times with APM tools

## Scaling

### Frontend (Vercel/Netlify)

- Automatic global CDN
- Automatic scaling
- No configuration needed

### API Server

- **Railway:** Scale by adding replicas in dashboard
- **Render:** Upgrade to higher tier or add instances
- **Custom:** Use load balancer + multiple instances

### Database

- **Supabase:** Upgrade tier for more connections/storage
- **Custom:** Implement read replicas, connection pooling

## Security Checklist

- [ ] Environment variables are stored securely (not in code)
- [ ] JWT secret is strong and unique
- [ ] CORS is restrictive (only allow needed origins)
- [ ] HTTPS is enforced on all endpoints
- [ ] Database credentials are rotated regularly
- [ ] Rate limiting is enabled on API
- [ ] Input validation is in place
- [ ] SQL injection protection (using Prisma)
- [ ] XSS protection headers are set

## Cost Estimates

### Free Tier Deployments

**Vercel (Frontend):**

- ✅ Free for personal/hobby projects
- Generous bandwidth allowance
- Automatic HTTPS

**Railway (API):**

- ✅ $5/month credit
- Pay for usage beyond credit
- ~$5-20/month for small apps

**Supabase (Database):**

- ✅ Free tier: 500 MB database, 2 GB file storage
- Upgrade: $25/month for Pro

**Total:** ~$0-30/month for small-medium traffic

## Support

For deployment issues:

- Check deployment platform docs
- Review application logs
- Verify environment variables
- Contact support of respective platform
