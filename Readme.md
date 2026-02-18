# Realms & Beyond — Monorepo

> Internal monorepo for all Realms & Beyond subsidiaries. Built with Turborepo and pnpm workspaces.

---

## Overview

This is a private monorepo housing all products under the Realms & Beyond holding company — spanning game design, gastronomy, POS & employee management, book editing, and TTRPG content creation. All subsidiaries share a unified codebase of packages, styles, types, and tooling.

**Stack:** Next.js · Express · Mongoose · TypeScript 5.9 · Turborepo · pnpm workspaces

---

## Repo Structure

```
realms-and-beyond/
├── apps/                        # Next.js frontend applications
│   ├── realms-and-beyond/       # Holding company landing page
│   ├── aetherscribe/            # TTRPG content creation app
│   ├── nexus-serve/             # POS & employee management app
│   ├── byte-burger/             # Byte Burger bistro website
│   ├── ui-documentation/        # UI component reference
│   └── package-documentation/   # Package reference & usage
├── servers/                     # Express + Mongoose API servers
│   ├── realms-and-beyond-api/   # Base account API (all subsidiaries)
│   ├── nexus-serve-api/         # POS & employee management API
│   └── aetherscribe-api/        # TTRPG content API
├── packages/                    # Shared internal packages
│   ├── assets/                  # Global brand assets
│   ├── errors/                  # Unified error handling
│   ├── middleware/              # Reusable Express middleware
│   ├── security/                # Server & frontend security utilities
│   ├── styles/                  # Shared SCSS design tokens & styles
│   ├── types/                   # Global TypeScript types
│   ├── ui/                      # Shared Next.js component library
│   └── validators/              # Form validation & env config
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Who Works Where

| Role                | Scope                    |
| ------------------- | ------------------------ |
| Frontend developer  | `apps/` only             |
| Core / backend team | `servers/` + `packages/` |

> **Frontend developers** — your work lives entirely inside `apps/`. Do not duplicate anything that already exists in `packages/ui` or `packages/styles`.
>
> **Servers and packages** are maintained by the core team. No new servers or packages should be created without approval.

---

## Prerequisites

Ensure these are installed before cloning:

```bash
node --version        # check .nvmrc for required version
npm install -g pnpm   # install pnpm if not present
npm install -g turbo  # optional but recommended
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-org/realms-and-beyond.git
cd realms-and-beyond
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Add your `.env` file

Each app and server requires its own `.env` file before it can run. See [Environment Files](#environment-files) below for all variables. Obtain values from your team lead.

### 4. Build packages

Packages must be compiled before apps or servers can consume them. Always do this before running anything for the first time:

```bash
pnpm build
```

> ⚠️ Any time you make a change to a package, you must rebuild it before those changes are visible elsewhere in the repo.

### 5. Start your app

```bash
# From root using Turbo filter
turbo dev --filter=aetherscribe

# Or navigate into the app
cd apps/aetherscribe
pnpm dev
```

---

## Sparse Checkout — Working on a Single App or Package

You don't need to pull the entire repo. Use Git sparse checkout to work on just the part you need.

> ⚠️ Always include the root config files and `packages/` — without them, `pnpm install` will fail.

```bash
# 1. Clone without checking out files
git clone --no-checkout https://github.com/your-org/realms-and-beyond.git
cd realms-and-beyond

# 2. Enable sparse checkout
git sparse-checkout init --cone

# 3. Specify what to pull (your app + all packages)
git sparse-checkout set apps/aetherscribe packages

# 4. Checkout your working branch
git checkout development

# 5. Install & build
pnpm install
pnpm build
```

To pull a server instead:

```bash
git sparse-checkout set servers/nexus-serve-api packages
```

---

## Environment Files

Environment variables are validated at runtime via `envalid` in `packages/validators/src/env.ts`. The app will throw on startup if any required variable is missing.

> ⚠️ Never commit `.env` files. Ensure `.env` and `.env.local` are in `.gitignore`. Get values from your team lead.

### Backend — `servers/{server-name}/.env`

```env
# Application
NODE_ENV=development              # development | production | test
PORT=8000                         # default: 8000

# Database
DATABASE=your_mongodb_connection_string
DATABASE_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_COOKIE_SECRET=your_jwt_cookie_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:secret@cloud_name
USER_DEFAULT_AVATAR=https://res.cloudinary.com/.../default.png

# Email
RESEND_API_KEY=re_your_resend_key
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USERNAME=your_mailtrap_username
MAILTRAP_PASSWORD=your_mailtrap_password
```

### Frontend — `apps/{app-name}/.env.local`

> These variables are not yet finalised. Values below are placeholders for local development. `NEXT_PUBLIC_` variables are exposed to the browser.

```env
# API Base URLs
NEXT_PUBLIC_BASE_API_URL=http://localhost:8000/api/v1/
NEXT_PUBLIC_NEXUS_API_URL=http://localhost:8001/api/v1/
NEXT_PUBLIC_AETHERSCRIBE_API_URL=http://localhost:8002/api/v1/

# Cloudinary (client-side uploads)
NEXT_PUBLIC_CLOUDINARY_NAME=your_cloud_name
```

Not all apps require all variables — only include what each specific app uses.

---

## Commands

### Root commands

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `pnpm install`       | Install all dependencies across the monorepo |
| `pnpm build`         | Build all packages                           |
| `pnpm build:servers` | Build all servers                            |
| `pnpm build:all`     | Build packages then servers                  |
| `pnpm clean`         | Clean all package build outputs              |

### Run a specific app (from root)

```bash
turbo dev --filter=aetherscribe
turbo dev --filter=nexus-serve
turbo dev --filter=byte-burger
turbo dev --filter=realms-and-beyond
turbo build --filter=<app-name>
```

### Run from inside an app

```bash
cd apps/aetherscribe
pnpm dev      # start dev server
pnpm build    # production build
pnpm lint     # lint check
```

### Rebuild a package after changes

```bash
# From root
pnpm build

# Or target a specific package
cd packages/validators
pnpm build
```

---

## Git Branch Strategy

| Branch        | Purpose                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------- |
| `main`        | Protected. Never work here directly. Merges only via approved PR from `publish`.            |
| `publish`     | The current live version. Promoted from `development` after QA.                             |
| `development` | Active integration branch. All feature work merges here first. Managed by a dedicated team. |

### Feature branch workflow

```bash
# Branch off development
git checkout development
git pull origin development
git checkout -b feature/your-feature-name

# Work and commit
git add .
git commit -m "feat: describe your change"

# Push and open a PR into development
git push origin feature/your-feature-name
```

> PRs into `development` are reviewed by the integration team. After testing they are promoted to `publish`, then to `main` via an approved pull request.

---

## Full Documentation

The full interactive monorepo documentation — covering all packages, apps, servers, env variables, and setup in detail — is available at:

```
apps/realms-and-beyond → /docs
```

Run the app locally and navigate to `/docs` to view it.

---

## Notes

- All API routes follow the format `api/v{versionNumber}/`
- Only use `pnpm` — never `npm` or `yarn`. Do not commit `package-lock.json` or `yarn.lock`
- This repo is in active development. No production servers are live yet
