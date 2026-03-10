# Realms & Beyond — Monorepo

> Internal monorepo for all Realms & Beyond subsidiaries. Built with Turborepo and pnpm workspaces.

---

## Overview

A private monorepo housing all products under the Realms & Beyond holding company — spanning TTRPG content creation, food ordering, and POS & employee management. All products share a unified package ecosystem: design system, component library, types, hooks, and server utilities.

**Stack:** Next.js 16 · React 19 · Express · Mongoose · TypeScript 5.9 · Turborepo · pnpm workspaces · SCSS

---

## Repo Structure

```
realms-and-beyond/
├── apps/
│   ├── aetherscribe/            # TTRPG worldbuilding & campaign management app
│   ├── byte-burger/             # Byte Burger food ordering platform
│   ├── nexus-serve/             # POS & employee management app
│   ├── realms-and-beyond/       # Holding company landing page
│   └── ui-documentation/        # R&B Codex — full monorepo developer docs
├── servers/
│   ├── realms-and-beyond-api/   # Base identity & account API
│   ├── nexus-serve-api/         # POS & employee management API
│   └── aetherscribe-api/        # TTRPG content API
├── packages/
│   ├── styles/                  # @rnb/styles — SCSS design system & themes
│   ├── ui/                      # @rnb/ui — shared React component library
│   ├── types/                   # @rnb/types — shared TypeScript interfaces
│   ├── hooks/                   # @rnb/hooks — shared React hooks
│   ├── errors/                  # @rnb/errors — AppError class
│   ├── middleware/              # @rnb/middleware — reusable Express middleware
│   ├── security/                # @rnb/security — JWT & auth utilities
│   ├── validators/              # @rnb/validators — form & env validation
│   └── assets/                  # @rnb/assets — shared brand images & icons
├── docs/                        # Architecture PDFs, concept art, design refs
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

| Tool    | Version  | Install                   |
| ------- | -------- | ------------------------- |
| Node.js | ≥ 20.x   | [nodejs.org](https://nodejs.org) |
| pnpm    | ≥ 10.18  | `npm install -g pnpm`     |
| Git     | any      | —                         |

---

## Getting Started

### 1. Clone

```bash
git clone https://github.com/your-org/realms-and-beyond.git
cd realms-and-beyond
```

### 2. Install all dependencies

```bash
pnpm install
```

### 3. Add environment files

Each app and server needs its own `.env` / `.env.local` before it can run. See [Environment Files](#environment-files) below. Get values from your team lead.

### 4. Build packages

Packages must be compiled before any app or server can consume them. Do this after every fresh install and after making changes to any package.

```bash
pnpm build:packages
```

### 5. Start dev servers

```bash
# Start everything in watch mode
pnpm dev

# Or start a single app
pnpm --filter aetherscribe dev
pnpm --filter ui-documentation dev
```

> ⚠️ After any change to a shared package, re-run `pnpm build:packages`. Turborepo caches outputs — only changed packages will rebuild.

---

## Sparse Checkout — Working on a Single App or Package

Use Git sparse checkout if you only need part of the repo.

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
git checkout main

# 5. Install & build
pnpm install
pnpm build:packages
```

To pull a server instead:

```bash
git sparse-checkout set servers/aetherscribe-api packages
```

---

## Environment Files

Environment variables are validated at runtime via `envalid` in `@rnb/validators`. Apps and servers will throw on startup if any required variable is missing.

> ⚠️ Never commit `.env` files. Ensure `.env` and `.env.local` are in `.gitignore`. Get values from your team lead.

### Backend — `servers/{server-name}/.env`

```env
NODE_ENV=development
PORT=8000

DATABASE=your_mongodb_connection_string
DATABASE_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret_min_32_chars
JWT_COOKIE_SECRET=your_jwt_cookie_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:secret@cloud_name
USER_DEFAULT_AVATAR=https://res.cloudinary.com/.../default.png

RESEND_API_KEY=re_your_resend_key
```

### Frontend — `apps/{app-name}/.env.local`

```env
NEXT_PUBLIC_BASE_API_URL=http://localhost:8000/api/v1/
NEXT_PUBLIC_NEXUS_API_URL=http://localhost:8001/api/v1/
NEXT_PUBLIC_AETHERSCRIBE_API_URL=http://localhost:8002/api/v1/

NEXT_PUBLIC_CLOUDINARY_NAME=your_cloud_name
```

Not all apps require all variables — only include what each specific app uses.

---

## Commands

### Root commands

| Command                 | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `pnpm install`          | Install all dependencies across the monorepo           |
| `pnpm dev`              | Start all apps and packages in watch mode              |
| `pnpm build`            | Build all workspaces in topological order              |
| `pnpm build:packages`   | Build only the packages in `packages/`                 |
| `pnpm build:services`   | Build only the API servers                             |
| `pnpm lint`             | Run ESLint across all workspaces                       |
| `pnpm typecheck`        | Run `tsc --noEmit` across all workspaces               |
| `pnpm clean`            | Remove all `dist/`, `.next/`, and build caches         |
| `pnpm update:all`       | Update all dependencies across all workspaces          |

### Scoped commands

```bash
# Dev a single app
pnpm --filter aetherscribe dev
pnpm --filter byte-burger dev

# Build a single package
pnpm --filter @rnb/ui build
pnpm --filter @rnb/styles build

# Typecheck a single workspace
pnpm --filter aetherscribe typecheck

# Add a dependency to a specific app
pnpm --filter aetherscribe add some-package
```

---

## Git Branch Strategy

| Branch        | Purpose                                                                      |
| ------------- | ---------------------------------------------------------------------------- |
| `main`        | Protected. Merges only via approved PR.                                      |
| `development` | Active integration branch. All feature work merges here first.               |

### Branch naming

| Type     | Pattern                      | Example                    |
| -------- | ---------------------------- | -------------------------- |
| Feature  | `feat/short-description`     | `feat/cartridge-card`      |
| Bug fix  | `fix/short-description`      | `fix/sidebar-active-state` |
| Design   | `ds/short-description`       | `ds/folder-restructure`    |
| Docs     | `docs/short-description`     | `docs/codex-overhaul`      |
| Refactor | `refactor/short-description` | `refactor/theme-context`   |
| Chore    | `chore/short-description`    | `chore/update-deps`        |

### Feature branch workflow

```bash
# Branch off main
git checkout main
git pull origin main
git checkout -b feat/your-feature-name

# Work, then stage specific files (not git add .)
git add packages/ui/src/utils/MyComponent.tsx
git commit -m "feat: add MyComponent to @rnb/ui"

# Push and open a PR
git push -u origin feat/your-feature-name
```

---

## Design System

The design system lives in `@rnb/styles`. Import it **once** at the root layout of each app — never at the component level.

```tsx
import '@rnb/styles'   // in app/layout.tsx only
```

### Themes

Activate a theme by setting `data-theme` on `<html>`. The `ThemeProvider` from `@rnb/ui` handles this automatically based on the user's localStorage preference.

| Theme ID      | Character                              |
| ------------- | -------------------------------------- |
| `arcade`      | Default — warm dark, amber glow        |
| `phosphor`    | CRT terminal — near-black + green      |
| `sovereign`   | Crimson authority — dark + crimson     |
| `void`        | Sci-fi — cold dark + teal + violet     |
| `dusk`        | Mystical — purple-dark + amethyst      |
| `parchment`   | Light mode — cream + olive             |
| `byte-burger` | Byte Burger app — hot-orange + mustard |
| `snes`        | 16-bit pixel — SNES blue + gold        |
| `n64`         | Console charcoal — N64 logo gradient   |

---

## Full Developer Documentation

The complete interactive monorepo documentation — covering all packages, components, apps, design system, and contributing guide — is available at:

```
apps/ui-documentation  →  http://localhost:3000
```

Run it locally:

```bash
pnpm --filter ui-documentation dev
```

---

## Notes

- Use **pnpm only** — never `npm` or `yarn`. Do not commit `package-lock.json` or `yarn.lock`
- All API routes follow the format `api/v{versionNumber}/`
- Always use unique `themeStorageKey` / `modeStorageKey` per app to prevent theme state bleeding across products
- This repo is in active development — no production servers are live yet
