# Developer Setup & Auth Flow

This document covers everything a developer needs to get the monorepo running from scratch and explains how the SSO auth system works end-to-end.

---

## Table of Contents

1. [Monorepo Structure](#1-monorepo-structure)
2. [How the Auth System Works](#2-how-the-auth-system-works)
3. [First-Time Setup](#3-first-time-setup)
4. [Environment Variables](#4-environment-variables)
5. [Running the Stack](#5-running-the-stack)
6. [The OAuth Flow Step by Step](#6-the-oauth-flow-step-by-step)
7. [Adding a New First-Party App](#7-adding-a-new-first-party-app)
8. [Port Reference](#8-port-reference)

---

## 1. Monorepo Structure

```
realms-and-beyond/
├── apps/
│   ├── aetherscribe/          # Main RPG app — Next.js (port 3000)
│   └── realms-and-beyond/     # Public landing page
│
├── security/
│   ├── server/                # Auth server — Express (port 2611)
│   └── ui/                    # Login / register UI — Next.js (port 3001)
│
├── servers/
│   └── aetherscribe-api/      # Aetherscribe domain API — Express (port 8811)
│
└── packages/
    ├── database/              # Mongoose models shared across all servers
    ├── middleware/             # Shared Express middleware (authenticate, etc.)
    ├── validators/             # Zod schemas and shared types
    ├── ui/                    # Shared React components (AuthProvider, Navbar, etc.)
    └── styles/                # Global SCSS design system
```

**Critical rule:** Only Express servers (`security/server`, `servers/aetherscribe-api`) ever touch MongoDB directly. Next.js apps call backend HTTP APIs — they never import from `@rnb/database`.

---

## 2. How the Auth System Works

R&B uses a **centralised SSO** built on OAuth 2.0 Authorization Code Flow with PKCE and RS256 asymmetric JWT signing. There is no shared secret between apps — only a public key.

### The three layers

| Layer | What it does |
|---|---|
| **Auth server** (`security/server`, port 2611) | Issues tokens, manages SSO sessions, hosts JWKS endpoint |
| **Auth UI** (`security/ui`, port 3001) | Login and register forms — thin UI only, POSTs credentials to auth server |
| **Member app** (e.g. Aetherscribe, port 3000) | Redirects unauthenticated users through OAuth, holds the resulting JWT in an httpOnly cookie |

### Token signing

- The auth server has an **RSA private key** at `security/server/keys/private.pem`
- It signs JWTs with **RS256** (asymmetric — only the auth server can sign)
- Member apps and backend APIs verify tokens using the **public key** fetched from `GET /.well-known/jwks.json` (cached for 1 hour)
- The public key is safe to expose — it can only verify, not sign

### Sessions vs tokens

| Thing | What it is | Where it lives |
|---|---|---|
| **SSO session** | Server-side MongoDB session on the auth server | `connect-mongo` store, 30-day TTL |
| **`auth_token` cookie** | RS256-signed JWT, 1-hour expiry | httpOnly cookie on the member app domain |
| **refresh token** | Opaque 128-char hex token, 60-day expiry | MongoDB `RefreshToken` collection |

The SSO session means a user who is already logged in to one R&B app is automatically logged in to all others without seeing the login form again.

---

## 3. First-Time Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- Access to the MongoDB Atlas cluster (get the connection string from a lead)

### 3.1 — Install dependencies

From the repo root:

```bash
pnpm install
```

### 3.2 — Generate RSA keys

The auth server needs an RSA-2048 key pair. **This only needs to be done once per environment.** The keys are gitignored.

```bash
cd security/server
mkdir -p keys
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
```

> **Important:** If you rotate keys in production, all existing `auth_token` cookies become immediately invalid. Users will be logged out and must re-authenticate.

### 3.3 — Set up environment variables

Copy the example files and fill them in (see [Section 4](#4-environment-variables)):

```bash
cp security/server/.env.example  security/server/.env
cp security/ui/.env.example      security/ui/.env         # if it exists
cp apps/aetherscribe/.env.example apps/aetherscribe/.env
cp servers/aetherscribe-api/.env.example servers/aetherscribe-api/.env
```

### 3.4 — Seed the database

The seed script registers the Aetherscribe OAuth application in MongoDB and creates the first admin user. Run it from the security server directory:

```bash
cd security/server
pnpm seed
```

You will be prompted interactively:

```
🔌 Connecting to database...
✅ Connected.

✅ App "Aetherscribe" registered.
   clientId:     rnb-d34f123619c58ac7
   clientType:   confidential
   redirectUri:  http://localhost:3000/api/auth/callback
   isFirstParty: true

Enter your email address: you@realmsandbeyond.com
First name: Duncan
Last name: Saul
Password (min 8 chars): ••••••••

✅ CEO identity created.
   Name:  Duncan Saul
   Email: you@realmsandbeyond.com
   ID:    68abc123...

🏁 Seed complete.
```

**The seed script is idempotent** — safe to re-run. It skips creation if the app or user already exists.

---

## 4. Environment Variables

### `security/server/.env`

```env
PORT=2611
NODE_ENV=development

# MongoDB
DATABASE=mongodb+srv://<user>:<PASSWORD>@cluster.mongodb.net/
DATABASE_PASSWORD=<your-db-password>

# SSO session encryption — minimum 64 random characters
SESSION_SECRET=<64+ char random string>

# RS256 key ID — must match the kid embedded in your private key
# Generate: node -e "console.log(require('crypto').randomBytes(8).toString('hex'))"
JWT_KEY_ID=<8-byte hex>

# Where the auth UI lives (the login/register Next.js app)
AUTH_UI_URL=http://localhost:3001

# Comma-separated list of allowed CORS origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003

# Legacy identity API secrets (still used for account portal)
JWT_SECRET=<32+ char random string>
JWT_COOKIE_SECRET=<16+ char random string>
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

### `apps/aetherscribe/.env`

```env
# Exposed to browser — used by AuthProvider to call /api/v1/user/me
NEXT_PUBLIC_API_URL=http://localhost:3000

# Server-side only — Aetherscribe Express API
AETHERSCRIBE_API_URL=http://localhost:8811

# SSO OAuth client — get these from the seeded App document in MongoDB
RNB_AUTH_SERVER_URL=http://localhost:2611
RNB_CLIENT_ID=rnb-d34f123619c58ac7
RNB_CLIENT_SECRET=<the client secret from seed / MongoDB>
RNB_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

### `servers/aetherscribe-api/.env`

```env
PORT=8811
RNB_AUTH_SERVER_URL=http://localhost:2611
DATABASE=mongodb+srv://<user>:<PASSWORD>@cluster.mongodb.net/
DATABASE_PASSWORD=<your-db-password>
# ... other Aetherscribe-specific vars (Cloudinary, Mailtrap, etc.)
```

---

## 5. Running the Stack

You need four processes running simultaneously. Open four terminal tabs:

```bash
# Tab 1 — Auth server (OAuth + JWKS + Identity API)
cd security/server && pnpm dev

# Tab 2 — Auth UI (login and register pages)
cd security/ui && pnpm dev

# Tab 3 — Aetherscribe Next.js app
cd apps/aetherscribe && pnpm dev

# Tab 4 — Aetherscribe Express API (optional for auth, required for app features)
cd servers/aetherscribe-api && pnpm dev
```

Once all four are running, open [http://localhost:3000](http://localhost:3000).

---

## 6. The OAuth Flow Step by Step

This is what happens the moment an unauthenticated user visits a protected page (e.g. `/hub`) in Aetherscribe.

```
Browser                Aetherscribe (3000)    Auth Server (2611)    Auth UI (3001)
   │                          │                       │                    │
   │  GET /hub                │                       │                    │
   │─────────────────────────>│                       │                    │
   │                          │ middleware: no         │                    │
   │                          │ auth_token cookie      │                    │
   │                          │                       │                    │
   │  302 → /api/auth/initiate│                       │                    │
   │<─────────────────────────│                       │                    │
   │                          │                       │                    │
   │  GET /api/auth/initiate  │                       │                    │
   │─────────────────────────>│                       │                    │
   │                          │ Generates:             │                    │
   │                          │  - CSRF state token    │                    │
   │                          │  - PKCE code_verifier  │                    │
   │                          │  - PKCE code_challenge │                    │
   │                          │                        │                   │
   │                          │ Sets httpOnly cookies: │                    │
   │                          │  oauth_state           │                    │
   │                          │  oauth_code_verifier   │                    │
   │                          │  oauth_return_to=/hub  │                    │
   │                          │                        │                   │
   │  302 → /authorize?...    │                        │                   │
   │<─────────────────────────│                        │                   │
   │                          │                        │                   │
   │  GET /authorize?client_id=...&code_challenge=...  │                   │
   │──────────────────────────────────────────────────>│                   │
   │                          │                        │ Validates:        │
   │                          │                        │  - client_id      │
   │                          │                        │  - redirect_uri   │
   │                          │                        │ Saves authIntent  │
   │                          │                        │ to SSO session    │
   │                          │                        │                   │
   │  302 → /login?app_name=Aetherscribe               │                   │
   │<──────────────────────────────────────────────────│                   │
   │                                                   │                   │
   │  GET /login                                       │                   │
   │──────────────────────────────────────────────────────────────────────>│
   │                                                   │                   │ Shows
   │                                                   │                   │ login form
   │  POST /authorize (email + password)               │                   │
   │──────────────────────────────────────────────────>│                   │
   │           (form submitted directly to auth server)│                   │
   │                          │                        │ Verifies creds    │
   │                          │                        │ Sets session.userId│
   │                          │                        │ Creates AuthCode  │
   │                          │                        │ (5-min TTL, PKCE) │
   │                          │                        │                   │
   │  302 → /api/auth/callback?code=...&state=...      │                   │
   │<──────────────────────────────────────────────────│                   │
   │                          │                        │                   │
   │  GET /api/auth/callback?code=...&state=...        │                   │
   │─────────────────────────>│                        │                   │
   │                          │ Validates CSRF state   │                   │
   │                          │                        │                   │
   │                          │  POST /token           │                   │
   │                          │──────────────────────>│                   │
   │                          │  { code, code_verifier,│                   │
   │                          │    client_id,          │                   │
   │                          │    client_secret,      │                   │
   │                          │    redirect_uri }      │                   │
   │                          │                        │ Verifies PKCE:    │
   │                          │                        │ SHA256(verifier)  │
   │                          │                        │ == stored challenge│
   │                          │                        │ Issues RS256 JWT  │
   │                          │                        │ Issues refresh    │
   │                          │                        │ token             │
   │                          │  { access_token, ... } │                   │
   │                          │<──────────────────────│                   │
   │                          │                        │                   │
   │                          │ Sets auth_token cookie │                   │
   │                          │ Clears oauth_* cookies │                   │
   │                          │                        │                   │
   │  302 → /hub              │                        │                   │
   │<─────────────────────────│                        │                   │
   │                          │                        │                   │
   │  GET /hub (with auth_token cookie)                │                   │
   │─────────────────────────>│                        │                   │
   │                          │ middleware: cookie     │                   │
   │                          │ present → allow        │                   │
   │                          │                        │                   │
   │                          │ AuthProvider calls     │                   │
   │                          │ GET /api/v1/user/me    │                   │
   │                          │ (verifies JWT via JWKS)│                   │
   │  Page renders            │                        │                   │
   │<─────────────────────────│                        │                   │
```

### What each piece checks

| Component | What it validates |
|---|---|
| `middleware.ts` (Aetherscribe) | Cookie **presence** only — fast, no network call |
| `GET /api/v1/user/me` (Aetherscribe) | Full RS256 JWT signature via JWKS, expiry, then calls Aetherscribe API to check if user has a profile |
| `authenticate` middleware (`@rnb/middleware`) | Same RS256 check on Express APIs — uses `jwks-rsa` to cache public key |
| `GET /authorize` (auth server) | `client_id` exists in DB, `redirect_uri` is registered, PKCE params are present |
| `POST /token` (auth server) | PKCE: `SHA256(code_verifier) === stored code_challenge`, code not expired, `client_secret` matches (confidential clients) |

### SSO fast-path

If the user is already authenticated (has an active SSO session on the auth server from a previous login to any R&B app), `GET /authorize` skips the login redirect entirely — it issues the auth code immediately and redirects back to the member app. The user never sees the login form.

---

## 7. Adding a New First-Party App

### Option A — Seed script (recommended for initial setup)

Add an entry to `security/server/scripts/seed.ts` following the pattern of the Aetherscribe entry, then re-run `pnpm seed`.

### Option B — Developer portal (browser UI)

1. Start the auth server (`pnpm dev` in `security/server`)
2. Open [http://localhost:2611/developer](http://localhost:2611/developer) — or the equivalent deployed URL
3. Click **Register new app**
4. Fill in the app name, redirect URIs, and scopes
5. Copy the generated `clientId` and `clientSecret` into the new app's `.env`

### What a registered app needs in its `.env`

```env
RNB_AUTH_SERVER_URL=http://localhost:2611
RNB_CLIENT_ID=<generated clientId>
RNB_CLIENT_SECRET=<generated clientSecret>      # omit for public clients
RNB_REDIRECT_URI=http://localhost:<port>/api/auth/callback
```

The `redirect_uri` you pass at runtime **must exactly match** one of the `redirectUris` stored in the `App` document. Any mismatch is rejected by the auth server.

---

## 8. Port Reference

| Port | Service |
|---|---|
| `2611` | Auth server (OAuth, JWKS, Identity API) |
| `3000` | Aetherscribe (Next.js) |
| `3001` | Auth UI — login / register / account portal |
| `8811` | Aetherscribe API (Express) |

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| `Cannot GET /authorize` | Auth server not running or routes not mounted | Start `security/server` with `pnpm dev` |
| `Unknown client_id` | App not in MongoDB | Run `pnpm seed` from `security/server` |
| `redirect_uri not registered` | `.env` URI doesn't match DB | Update the `App` document's `redirectUris` array |
| `code_verifier mismatch` | PKCE cookies expired or tampered | OAuth cookies have 5-min TTL — restart the flow |
| `Invalid JWT signature` | Wrong public key or key mismatch after rotation | Verify `JWT_KEY_ID` matches the key pair in `keys/` |
| `JWT expired` | `auth_token` cookie is stale | Log out and log back in |
| `Failed to fetch JWKS` | Auth server unreachable from the verifying service | Ensure auth server is running; check `RNB_AUTH_SERVER_URL` |
