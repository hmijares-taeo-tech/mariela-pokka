# Mariela Pokka — Architecture & Operations Guide (`CLAUDE.md`)

## 1. Project Overview
**Mariela Pokka** (*Arctic Luxury Woven by Nature*) is a luxury fashion house & e-commerce platform based in Rovaniemi, Finnish Lapland (`marielapokka.com`).
The platform was migrated 100% off Shopify to a self-hosted **Medusa.js v2 + PostgreSQL 16 + React (Vite) + Caddy 2** stack running on an OVHcloud VPS behind Cloudflare.

---

## 2. Repository Structure (`/home/hm1jar3s/Desarrollo/Mariela-Pokka`)

```text
Mariela-Pokka/
├── frontend/                     # React 19 + Vite 8 Storefront & Online Boutique
│   ├── src/
│   │   ├── App.jsx               # Main router state ('home' vs 'shop' / '/shop') & cart state
│   │   ├── services/medusa.js    # Medusa v2 Store API client (products, collections, regions, cart)
│   │   ├── components/
│   │   │   ├── ShopPage.jsx      # Dedicated Online Boutique (/shop) with sidebar filters, search, sorting, pagination
│   │   │   ├── Collections.jsx   # Curated 6-piece home showcase + CTA to enter full Boutique
│   │   │   ├── ProductModal.jsx  # Detailed product modal with gallery, shade/size selection & real variant stock
│   │   │   ├── CartDrawer.jsx    # Slide-over shopping bag & checkout drawer
│   │   │   ├── Navbar.jsx        # Floating header (Currency EUR/USD/GBP, Arctic audio, Boutique link, Cart)
│   │   │   ├── Hero.jsx          # Hero slideshow & metrics
│   │   │   ├── Philosophy.jsx    # "Silk of the North" 0.6mm reindeer leather craftsmanship section
│   │   │   ├── DesignerStory.jsx # Mariela Pokka biography
│   │   │   ├── Stories.jsx       # Monaco Fashion Week & editorial press
│   │   │   ├── Gallery.jsx       # Lookbook gallery
│   │   │   └── Footer.jsx        # Footer & Rovaniemi atelier contact
│   │   └── index.css             # Global luxury theme tokens (dark obsidian + gold palette)
│   └── dist/                     # Compiled production static bundle
│
├── backend/                      # Medusa.js v2 Monorepo
│   └── apps/backend/             # Medusa v2 Server Application (@medusajs/medusa 2.22.0)
│       ├── Dockerfile            # Production Node 22 Alpine image (builds server + admin UI)
│       ├── medusa-config.ts      # Database, CORS, JWT, and optional Stripe payment provider config
│       └── src/api/catalog-images/[filename]/route.ts # Local fallback image endpoint for dev
│
├── data/                         # Rescued Catalog, Database Backups & Product Photography
│   ├── images/                   # 749 high-resolution product images (250 MB, zero Shopify CDN dependency)
│   ├── medusa_backup.sql         # Full PostgreSQL 16 SQL dump (137 products, 892 variants, 6 collections, stock)
│   ├── medusa_mariela.dump       # Compressed PostgreSQL custom-format dump
│   └── catalog_normalized.json   # Normalized JSON catalog extracted from Shopify
│
└── deploy/                       # Production Infrastructure (Docker Compose + Caddy 2)
    ├── docker-compose.yml        # Orchestrates postgres, backend (Medusa v2), and caddy
    └── Caddyfile                 # Auto-HTTPS reverse proxy, static frontend server, and /catalog-images/* server
```

---

## 3. Production Infrastructure (OVHcloud VPS + Cloudflare + Docker + Caddy)

### Server Details
- **Provider**: OVHcloud VPS (Ubuntu Linux, 3.7 GiB RAM + 2 GiB Swap, 38 GB NVMe)
- **Public IP**: `51.81.35.63`
- **SSH Access**: `ssh ubuntu@51.81.35.63` (SSH public key pre-authorized)
- **Production Directory on VPS**: `/opt/mariela-pokka`
- **DNS & Edge**: Cloudflare (`marielapokka.com` and `www.marielapokka.com`, Zone ID `ac71645ce574bb38acbdf2ef5d2c80e6`, proxied with Full/Strict SSL). Titan Email (`MX`, `SPF`, `DKIM`) records are preserved in Cloudflare.

### Docker Compose Stack (`/opt/mariela-pokka/deploy/docker-compose.yml`)
1. **`mariela-caddy-prod` (`caddy:2-alpine`)**:
   - Exposes ports `80`, `443/tcp`, `443/udp` (HTTP/3).
   - Automatically manages Let's Encrypt TLS certificates for `marielapokka.com` and `www.marielapokka.com`.
   - Routes:
     - `/catalog-images/*` -> Served directly from `/srv/catalog-images` (mounted from `/opt/mariela-pokka/data/images`) with `Cache-Control: public, max-age=31536000, immutable`.
     - `/store/*`, `/admin/*`, `/auth/*`, `/app*`, `/health` -> Reverse-proxied to `backend:9000`.
     - `/*` -> Serves the compiled React + Vite SPA from `/srv/frontend` (mounted from `/opt/mariela-pokka/frontend/dist`) with `try_files {path} /index.html`.
2. **`mariela-backend-prod` (`deploy-backend` / Medusa.js v2)**:
   - Runs on internal Docker network port `9000` (not exposed directly to the public internet).
   - Connects to `postgres:5432/medusa-mariela`.
3. **`mariela-postgres-prod` (`postgres:16-alpine`)**:
   - Runs on internal Docker network port `5432` with persistent volume `deploy_postgres_data`.
   - Contains **137 products**, **892 variants**, **327 stocked inventory items**, **6 collections**, and **749 image records**.

---

## 4. Credentials & API Keys

- **Storefront URL**: `https://marielapokka.com`
- **Dedicated Online Boutique URL**: `https://marielapokka.com/shop`
- **Medusa Admin Panel URL**: `https://marielapokka.com/app`
  - **Admin Email**: `admin@marielapokka.com`
  - **Admin Password**: *(see private `.env` / shared credentials)*
- **Medusa Publishable API Key (`x-publishable-api-key`)**:
  - `pk_6be3221614edad88fef2bcafcf33e7314e29efa3f3c20519c0db55c240c437f4`
- **Default Europe (`EUR`) Region ID**:
  - `reg_01M5JF7HHTYV4NZ84W373EKARQ`

---

## 5. Standard Workflows for Making & Deploying Changes

### A) Deploying Frontend Changes (Fast — ~3 seconds)
Because Caddy mounts `/opt/mariela-pokka/frontend/dist` directly from the host filesystem on the VPS, updating the frontend does **not** require rebuilding Docker containers:
```bash
cd /home/hm1jar3s/Desarrollo/Mariela-Pokka/frontend
npm run build
rm -rf dist/catalog-images dist/images/images
rsync -avz --delete dist/ ubuntu@51.81.35.63:/opt/mariela-pokka/frontend/dist/
```

### B) Deploying Backend (Medusa v2) or Caddy Changes
```bash
rsync -avz --exclude 'node_modules' --exclude '.medusa' \
  /home/hm1jar3s/Desarrollo/Mariela-Pokka/backend/apps/backend/ \
  ubuntu@51.81.35.63:/opt/mariela-pokka/backend/apps/backend/

rsync -avz /home/hm1jar3s/Desarrollo/Mariela-Pokka/deploy/ \
  ubuntu@51.81.35.63:/opt/mariela-pokka/deploy/

ssh ubuntu@51.81.35.63 "cd /opt/mariela-pokka/deploy && docker compose up -d --build"
```

### C) Local Development
```bash
# 1. Start local PostgreSQL container
docker start mariela-postgres

# 2. Start Medusa v2 backend (http://localhost:9000)
cd /home/hm1jar3s/Desarrollo/Mariela-Pokka/backend/apps/backend && npx medusa develop

# 3. Start Vite frontend (http://localhost:5173)
cd /home/hm1jar3s/Desarrollo/Mariela-Pokka/frontend && npm run dev -- --port 5173 --host
```

