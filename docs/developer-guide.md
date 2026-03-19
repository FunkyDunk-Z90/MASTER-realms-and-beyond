# Realms & Beyond — Developer Guide

**Version:** 1.1
**Authors:** Engineering Team
**Last Updated:** 2026-03-17

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Monorepo Architecture](#2-monorepo-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Development Setup](#4-development-setup)
5. [Package: `@rnb/errors`](#5-package-rnberrors)
6. [Package: `@rnb/validators`](#6-package-rnbvalidators)
7. [Package: `@rnb/middleware`](#7-package-rnbmiddleware)
8. [Package: `@rnb/security`](#8-package-rnbsecurity)
9. [Package: `@rnb/database`](#9-package-rnbdatabase)
10. [Package: `@rnb/ui`](#10-package-rnbui)
11. [Package: `@rnb/styles`](#11-package-rnbstyles)
12. [Package: `@rnb/assets`](#12-package-rnbassets)
13. [Package: `@rnb/types`](#13-package-rnbtypes)
14. [Server: `realms-and-beyond-api`](#14-server-realms-and-beyond-api)
15. [Server: `aetherscribe-api`](#15-server-aetherscribe-api)
16. [Server: `nexus-serve-api`](#16-server-nexus-serve-api)
17. [App: Aetherscribe](#17-app-aetherscribe)
18. [App: ByteBurger](#18-app-byteburger)
19. [App: NexusServe](#19-app-nexusserve)
20. [Authentication & Identity System](#20-authentication--identity-system)
21. [SSO — Adding Auth to a New App](#21-sso--adding-auth-to-a-new-app)
22. [Database Models Reference](#22-database-models-reference)
23. [API Reference](#23-api-reference)
24. [Design System](#24-design-system)
25. [Frontend Architecture](#25-frontend-architecture)
26. [Data Flow & Use Case Scenarios](#26-data-flow--use-case-scenarios)
27. [Environment Configuration](#27-environment-configuration)
28. [Code Conventions](#28-code-conventions)
29. [Dependency Graph](#29-dependency-graph)

---

## 1. Project Overview

**Realms & Beyond** is a multi-application platform built as a pnpm monorepo. It hosts several distinct products that share a single Identity and Access Management (IAM) system, a unified design language, and a set of reusable backend packages.

### Products

| Product              | Type          | Purpose                                   |
| -------------------- | ------------- | ----------------------------------------- |
| **Aetherscribe**     | Web App + API | RPG worldbuilding and campaign management           |
| **ByteBurger**       | Web App       | Online food ordering                                |
| **NexusServe**       | Web App + API | Restaurant point-of-sale and management             |
| **Realms Portal**    | Web App       | Public landing page — news, updates, app showcase   |
| **R&B Auth**         | Web App       | SSO login/register UI + account management portal   |
| **UI Documentation** | Web App       | Internal component and design-system docs           |

### Core Philosophy

Every product in the platform authenticates through a single **OAuth 2.0 auth server** (`realms-and-beyond-api`). Authentication uses the **Authorization Code Flow** — member apps never handle passwords directly. The `Identity` document in MongoDB is the canonical source of truth for who a user is.

The auth layer has two surfaces:

- **`realms-and-beyond-api`** (port 2611) — the OAuth auth server. Handles all credential verification, session management, auth code issuance, and JWT token exchange.
- **`apps/rnb-auth`** (port 3001) — the login/register UI. Renders the forms that users interact with. Forms POST directly to the auth server.

This means:

- Member apps are fully decoupled from password/identity logic.
- SSO works across all products: log in once, all apps recognise the session.
- Adding a new product requires registering it in the `OAuthApp` collection and wiring two middleware helpers from `@rnb/middleware`.

---

## 2. Monorepo Architecture

### Workspace Structure

```
realms-and-beyond/
├── apps/                        # Next.js frontend applications
│   ├── aetherscribe/            # RPG worldbuilding app
│   ├── byte-burger/             # Food ordering app
│   ├── nexus-serve/             # POS/management app
│   ├── realms-and-beyond/       # Public landing page (news, updates, about)
│   ├── rnb-auth/                # SSO login/register UI + account portal (port 3001)
│   └── documentation/           # Design system docs
│
├── packages/                    # Shared libraries (imported by apps & servers)
│   ├── assets/                  # @rnb/assets  — SVG icon components
│   ├── database/                # @rnb/database — Mongoose models
│   ├── errors/                  # @rnb/errors   — AppError class
│   ├── hooks/                   # @rnb/hooks    — Shared React hooks
│   ├── middleware/              # @rnb/middleware — Express middleware
│   ├── security/                # @rnb/security — JWT, cookies, tokens
│   ├── styles/                  # @rnb/styles   — SCSS design system
│   ├── types/                   # @rnb/types    — TypeScript type definitions
│   ├── ui/                      # @rnb/ui       — React components
│   └── validators/              # @rnb/validators — Zod schemas & env
│
├── servers/                     # Express backend API servers
│   ├── realms-and-beyond-api/   # IAM server (auth, identity)
│   ├── aetherscribe-api/        # Aetherscribe domain server
│   └── nexus-serve-api/         # NexusServe domain server
│
├── pnpm-workspace.yaml          # Workspace glob declarations
├── turbo.json                   # Turborepo task pipeline
└── package.json                 # Root workspace config
```

### Workspace Declaration

`pnpm-workspace.yaml` declares three workspace globs:

```yaml
packages:
    - 'apps/*'
    - 'packages/*'
    - 'servers/*'
```

All packages within these paths are resolvable via their `name` field in `package.json` using `workspace:*` as the version specifier.

### Turborepo Pipeline

The monorepo uses **Turborepo** for task orchestration. The `turbo.json` pipeline defines:

| Task        | Behaviour                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `build`     | Depends on `^build` (upstream packages must build first). Outputs `dist/**` and `.next/**`.                        |
| `dev`       | Depends on `^build` (packages compiled), then all dev servers run in parallel. `cache: false`, `persistent: true`. |
| `start`     | Depends on local `build`. Production server startup.                                                               |
| `lint`      | Depends on `^build`. Runs lint across all workspaces.                                                              |
| `typecheck` | Depends on `^build`. Runs `tsc --noEmit` across all workspaces.                                                    |
| `clean`     | No cache. Deletes build artifacts.                                                                                 |

The `^build` dependency syntax means "all packages that _I_ depend on must finish building before this task runs." This is essential because apps import packages via TypeScript source files (not compiled output), and the TS compiler resolves them through the `exports` field.

---

## 3. Technology Stack

### Backend

| Concern                | Technology                               |
| ---------------------- | ---------------------------------------- |
| Runtime                | Node.js 20+                              |
| Framework              | Express 5                                |
| Language               | TypeScript 5 (ESM, `"type": "module"`)   |
| Database               | MongoDB via Mongoose 9                   |
| Authentication         | OAuth 2.0 Authorization Code Flow + JWT  |
| Session management     | express-session + connect-mongo (SSO)    |
| Password hashing       | bcrypt (12 rounds)                       |
| Token security         | SHA-256 (crypto), timing-safe comparison |
| Environment validation | `envalid` (validators package)           |
| Dev server             | `tsx watch`                              |

### Frontend

| Concern          | Technology                                    |
| ---------------- | --------------------------------------------- |
| Framework        | Next.js 14+ (App Router)                      |
| Language         | TypeScript 5                                  |
| Styling          | SCSS (CSS Modules via `@rnb/styles`)          |
| State management | React Context (`AuthContext`, `ThemeContext`) |
| Icons            | `lucide-react`                                |
| Image handling   | `next/image`                                  |

### Shared

| Concern             | Technology                               |
| ------------------- | ---------------------------------------- |
| Schema validation   | Zod v4 (`z.email()`, `z.iso.datetime()`) |
| Package manager     | pnpm 9+                                  |
| Build orchestration | Turborepo                                |
| Type safety         | TypeScript strict mode throughout        |

---

## 4. Development Setup

### Prerequisites

- Node.js 20 or later
- pnpm 9 or later (`npm install -g pnpm`)
- MongoDB instance (local or Atlas)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd realms-and-beyond

# Install all workspace dependencies
pnpm install
```

### Environment Files

Each server requires its own `.env` file. Create these by copying the `.env.example` files:

```bash
cp servers/realms-and-beyond-api/.env.example servers/realms-and-beyond-api/.env
cp servers/aetherscribe-api/.env.example servers/aetherscribe-api/.env
```

See [Section 26 — Environment Configuration](#26-environment-configuration) for the full list of required variables.

### Running the Project

```bash
# Run everything in parallel (apps + servers + package watchers)
pnpm dev

# Run a specific workspace
pnpm --filter @rnb/realms-api dev
pnpm --filter @aetherscribe/app dev
```

### Building

```bash
# Build all packages and apps
pnpm build

# Build a specific package
pnpm --filter @rnb/database build
```

### Type Checking

```bash
pnpm typecheck
```

---

## 5. Package: `@rnb/errors`

**Path:** `packages/errors/`
**Consumed by:** All Express servers, `@rnb/middleware`

### Purpose

Provides a single `AppError` class that represents all expected, operational errors in the system. Controllers throw `AppError` instances; the global error handler in `@rnb/middleware` catches them and formats the response.

### `AppError`

```
packages/errors/src/AppError.ts
```

```typescript
class AppError extends Error {
    public statusCode: number   // HTTP status code (400, 401, 403, 404, 409, 500…)
    public status: string       // 'fail' for 4xx, 'error' for 5xx
    public isOperational: boolean  // true — only thrown for expected errors
    public field?: string       // Optional: which field caused the error (for forms)
}

constructor(message: string, statusCode: number, field?: string)
```

### Usage

```typescript
// Simple error
throw new AppError('Email already in use.', 409)

// With field hint (used by frontend to highlight the offending input)
throw new AppError('Invalid email format.', 400, 'email')

// Internal server error (non-operational errors should NOT use AppError —
// let them propagate as plain Error instances to the generic 500 handler)
throw new AppError('Database unavailable.', 503)
```

### Response shape from the error handler

```json
{
    "status": "fail",
    "message": "An account with this email already exists.",
    "field": "email"
}
```

The `field` property is only present when supplied. Frontends use this to set per-field error state in forms.

---

## 6. Package: `@rnb/validators`

**Path:** `packages/validators/`
**Consumed by:** All packages and servers

### Purpose

The single source of truth for all data shapes in the system. Contains:

1. **Zod schemas** — validate and parse incoming data at every boundary
2. **TypeScript types** — inferred from Zod schemas (no manual interface duplication)
3. **Environment validation** — `env` object with typed, validated process variables

### Directory Structure

```
packages/validators/src/
├── index.ts              # Master barrel export
├── validateEnv.ts        # Environment variable validation (envalid)
└── zod/
    ├── zod.index.ts      # Re-exports all schemas
    ├── zod.common.ts     # Shared primitives (ObjectId, Timestamp, Link…)
    ├── zod.identity.schema.ts   # Identity document schemas
    ├── zod.identity.methods.ts  # Identity method input/output schemas
    ├── zod.auth.ts       # Auth-related schemas (register, login, password reset)
    ├── zod.user.ts       # User roles, app access, per-app profiles
    ├── zod.session.ts    # Session and token refresh schemas
    ├── zod.contact.ts    # Address and phone schemas
    ├── zod.subscription.ts      # Subscription plans and limits
    ├── zod.aetherscribe.ts      # Aetherscribe domain schemas + account schemas
    ├── zod.byteburger.ts        # ByteBurger domain schemas
    ├── zod.nexusserve.ts        # NexusServe domain schemas
    ├── zod.pagination.ts        # Pagination request/response
    ├── zod.editing.ts    # Editing/modification metadata
    ├── zod.metrics.ts    # Analytics and metrics
    ├── zod.payment.ts    # Payment types
    ├── zod.errors.ts     # Error codes and error response shapes
    └── zod.apiResponse.ts       # API response wrappers, health check, async ops
```

### Environment Validation

`validateEnv.ts` uses `envalid` to validate all required environment variables at server startup. If any required variable is missing or malformed, the process exits immediately with a clear error message.

```typescript
export const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port({ default: 8000 }),
    DATABASE: str(),
    DATABASE_PASSWORD: str(),
    JWT_SECRET: str(),
    JWT_COOKIE_SECRET: str(),
    JWT_EXPIRES_IN: str(),
    JWT_COOKIE_EXPIRES_IN: str(),
    CLOUDINARY_NAME: str(),
    CLOUDINARY_API_KEY: str(),
    CLOUDINARY_SECRET: str(),
    CLOUDINARY_URL: str(),
    USER_DEFAULT_AVATAR: str(),
    RESEND_API_KEY: str(),
    MAILTRAP_HOST: str(),
    MAILTRAP_PORT: port(),
    MAILTRAP_PASSWORD: str(),
    MAILTRAP_USERNAME: str(),
    FRONTEND_URL: str({ default: 'http://localhost:3000' }),
})
```

The `env` object is imported wherever environment variables are needed — **never read `process.env` directly** in application code.

### Common Primitives (`zod.common.ts`)

| Schema           | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| `Z_ObjectId`     | MongoDB ObjectId — accepts string or `Types.ObjectId`                     |
| `Z_Timestamp`    | Unix timestamp (number)                                                   |
| `Z_Link`         | Navigation link `{ id, label, href, external?, icon?, className? }`       |
| `Z_Breadcrumb`   | `{ label, href, current? }`                                               |
| `Z_ColorVariant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` |
| `Z_Status`       | `'active' \| 'inactive' \| 'pending' \| 'archived' \| 'deleted'`          |
| `Z_Metadata`     | `Record<string, string \| number \| boolean \| string[] \| null>`         |

### Identity Schemas (`zod.identity.schema.ts`)

The `Z_IdentitySchema` is the complete shape of an Identity document as seen by consumers (post-`toClient()` serialisation). It has no sensitive fields — those are stripped server-side.

**Sub-schemas:**

| Schema                   | Key Fields                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `Z_IdentityProfile`      | `firstName`, `lastName`, `email`, `dateOfBirth?`, `nationality?`, `gender?`, `pronouns?`            |
| `Z_IdentityMedia`        | `avatarUrl?`, `bannerUrl?`, `avatarUpdatedAt?`                                                      |
| `Z_IdentityPreferences`  | `language`, `timezone`, `theme` (`light\|dark\|system`), `currency?`, `dateFormat?`                 |
| `Z_IdentityVerification` | `emailVerified`, `phoneVerified`, `identityVerified`, `twoFactorEnabled`, `twoFactorMethod?`        |
| `Z_IdentitySecurity`     | `password?` (hash), `passwordChangedAt?`, `passwordResetToken?`, `lastKnownIp?`, `trustedDevices[]` |
| `Z_LinkedService`        | `serviceName`, `serviceId`, `linkedAt`, `scopes[]`, `status`                                        |
| `Z_IdentityAudit`        | `termsAcceptedAt?`, `marketingConsent`, `deletionRequestedAt?`                                      |
| `Z_IdentityLifecycle`    | `status` (`active\|soft-deleted\|banned`), `deletedAt?`, `recoverableUntil?`                        |

### Identity Method Schemas (`zod.identity.methods.ts`)

These schemas validate the **inputs and outputs** of Mongoose instance methods. They enforce strong constraints at the method boundary rather than relying on the caller to pass correct data.

| Schema                           | Purpose                                        | Key Constraints                                                     |
| -------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| `Z_SetPassword`                  | Input to `setPassword()`                       | `plaintext`: 8–128 chars, uppercase, lowercase, digit, special char |
| `Z_VerifyPassword`               | Input to `verifyPassword()`                    | `plaintext`: required                                               |
| `Z_PasswordResetToken`           | Input to `validatePasswordResetToken()`        | `token`: 64-char lowercase hex                                      |
| `Z_PasswordResetTokenResult`     | Return from `generatePasswordResetToken()`     | `token`, `expiresAt` (ISO datetime)                                 |
| `Z_EmailVerificationToken`       | Input to `validateEmailVerificationToken()`    | `token`: 64-char lowercase hex                                      |
| `Z_EmailVerificationTokenResult` | Return from `generateEmailVerificationToken()` | `token`, `expiresAt` (ISO datetime)                                 |
| `Z_EnableTwoFactor`              | Input to `enableTwoFactor()`                   | `method`: `'totp'\|'sms'\|'email'\|'passkey'`                       |
| `Z_TrustedDevice`                | Input to `addTrustedDevice()` etc.             | `deviceId`: ObjectId string                                         |
| `Z_RecordLogin`                  | Input to `recordLogin()`                       | `ip`: non-empty string                                              |
| `Z_SoftDelete`                   | Input to `softDelete()`                        | `gracePeriodDays`: 1–90, default 30                                 |

### Auth Schemas (`zod.auth.ts`)

| Schema                    | Purpose                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `Z_RegisterRequest`       | Signup form validation — email, password, confirmPassword, firstName, lastName, agreeToTerms |
| `Z_LoginRequest`          | Login form validation — email, password                                                      |
| `Z_ForgotPasswordRequest` | Password reset initiation                                                                    |
| `Z_ResetPasswordRequest`  | Password reset completion — email, token, newPassword, confirmPassword                       |
| `Z_ChangePasswordRequest` | In-app password change                                                                       |
| `Z_Permissions`           | Full permission enum across all apps                                                         |
| `Z_AuthToken`             | JWT payload structure                                                                        |

### Subscription Schemas (`zod.subscription.ts`)

| Schema                        | Purpose                                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `Z_SubscriptionPlan`          | `'free' \| 'starter' \| 'pro' \| 'enterprise'`                                                 |
| `Z_SubscriptionStatus`        | `'active' \| 'paused' \| 'cancelled' \| 'expired' \| 'past_due'`                               |
| `Z_SubscriptionLimits`        | Resource caps: `maxWorlds`, `maxCharacters`, `maxStorageGB`, `maxCollaborators`, boolean flags |
| `Z_Subscription`              | Full subscription document                                                                     |
| `Z_CreateSubscriptionRequest` | `plan`, `billingCycle`, `paymentMethodId?`                                                     |

### Aetherscribe Account Schemas (`zod.aetherscribe.ts`)

| Schema / Export               | Purpose                                                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `Z_AetherscribeUsername`      | Username validation: 3–20 chars, alphanumeric + `_` + `-`, no leading/trailing specials, no consecutive specials |
| `Z_AetherscribeAccount`       | Full account document shape                                                                                      |
| `Z_CreateAetherscribeAccount` | Onboarding form: `username` + `plan`                                                                             |
| `SUBSCRIPTION_LIMITS`         | `Record<T_SubscriptionPlan, T_SubscriptionLimits>` — maps each plan to its resource caps                         |

**`SUBSCRIPTION_LIMITS` values:**

| Plan         | maxWorlds | maxCharacters | maxStorageGB | maxCollaborators | advancedFeatures | apiAccess | customDomain | prioritySupport |
| ------------ | --------- | ------------- | ------------ | ---------------- | ---------------- | --------- | ------------ | --------------- |
| `free`       | 1         | 10            | 1            | 0                | false            | false     | false        | false           |
| `starter`    | 5         | 50            | 5            | 3                | false            | false     | false        | false           |
| `pro`        | -1        | -1            | 20           | 10               | true             | true      | false        | false           |
| `enterprise` | -1        | -1            | 100          | -1               | true             | true      | true         | true            |

> `-1` means unlimited.

---

## 7. Package: `@rnb/middleware`

**Path:** `packages/middleware/`
**Consumed by:** All Express servers

### Purpose

Shared Express middleware and utility functions. Centralises error handling, authentication, async wrapping, and CRUD factories so they don't need to be reimplemented per server.

### Exports

#### `catchAsync(fn)`

Wraps an async controller function to catch rejected promises and forward them to Express's `next(err)` error chain. **Every async controller must be wrapped with this.**

```typescript
export const catchAsync =
    (fn: T_AsyncController): T_AsyncController =>
    (req, res, next) =>
        fn(req, res, next).catch(next)
```

Without this wrapper, an unhandled rejection in an async controller would crash the Node.js process (Express 4) or produce an unhandled 500 with no details.

#### `errorHandler`

Global Express error-handling middleware. Must be registered as the **last** middleware in `app.ts`.

```typescript
app.use(errorHandler)
```

Behaviour:

- If `err` is an `AppError` → responds with `{ status, message, field? }` at `err.statusCode`.
- Any other error → logs to console, responds with generic 500 message. This prevents leaking stack traces or internal details to clients.

#### `authenticate`

JWT authentication middleware. Reads the `auth_token` httpOnly cookie (or `Authorization: Bearer <token>` header as fallback), verifies the JWT against `env.JWT_SECRET`, fetches the corresponding `Identity` document from MongoDB, and attaches it to `req.identity`.

```typescript
// After this middleware runs, req.identity is a hydrated Mongoose document
// with all instance methods available
req.identity.toClient()         // strip sensitive fields
req.identity.verifyPassword(…)  // check password
req.identity._id.toString()     // get identity ID
```

If the token is missing, invalid, or the identity is inactive/banned, `authenticate` throws an `AppError` with the appropriate HTTP status code.

**Request augmentation:** The middleware extends Express's `Request` interface globally:

```typescript
declare global {
    namespace Express {
        interface Request {
            identity?: HydratedDocument<T_Identity, T_IdentityMethods>
        }
    }
}
```

This augmentation is declared in `authenticate.ts` and propagates to all servers that import from `@rnb/middleware`.

#### Token Utilities

| Function                  | Signature                     | Purpose                                               |
| ------------------------- | ----------------------------- | ----------------------------------------------------- |
| `hashToken(raw)`          | `(string) => string`          | SHA-256 hash a raw token before DB storage            |
| `generateSecureToken()`   | `() => string`                | Generate a 64-char cryptographically secure hex token |
| `safeCompareTokens(a, b)` | `(string, string) => boolean` | Constant-time comparison to prevent timing attacks    |
| `hoursFromNow(n)`         | `(number) => string`          | ISO datetime string `n` hours in the future           |
| `daysFromNow(n)`          | `(number) => string`          | ISO datetime string `n` days in the future            |

#### CRUD Handler Factories

Generic Mongoose CRUD operation factories for use when a controller is thin and just needs to proxy a Mongoose query. These call `doc.toClient()` on every outbound document if the method exists.

| Factory             | HTTP   | Description                              |
| ------------------- | ------ | ---------------------------------------- |
| `createOne(Model)`  | POST   | Create a new document                    |
| `getAll(Model)`     | GET    | Get all documents (with optional filter) |
| `getOne(Model)`     | GET    | Get document by `req.params.id`          |
| `updateOne(Model)`  | PATCH  | Update document by `req.params.id`       |
| `updateMany(Model)` | PATCH  | Bulk update                              |
| `deleteOne(Model)`  | DELETE | Hard delete document by `req.params.id`  |

#### `copyObj(obj, fields)`

Shallow-copies only the specified fields from an object. Used by controllers to selectively apply patch body fields without spreading unknown keys.

#### SSO Middleware — `createRequireSSOAuth(config)`

Factory that returns an Express middleware protecting routes that require R&B SSO authentication.

```typescript
import { createRequireSSOAuth, SSOConfig } from '@rnb/middleware'

const config: SSOConfig = {
    authServerUrl: 'http://localhost:2611',
    clientId: process.env.RNB_CLIENT_ID!,
    clientSecret: process.env.RNB_CLIENT_SECRET!,
    redirectUri: process.env.RNB_REDIRECT_URI!,
}

const requireAuth = createRequireSSOAuth(config)

// Apply to any route
router.get('/dashboard', requireAuth, handler)
```

**`SSOConfig` interface:**

| Field           | Type   | Description                                          |
| --------------- | ------ | ---------------------------------------------------- |
| `authServerUrl` | string | Base URL of the R&B auth server, e.g. `http://localhost:2611` |
| `clientId`      | string | This app's registered client ID                     |
| `clientSecret`  | string | This app's registered client secret (server-side only) |
| `redirectUri`   | string | This app's registered redirect URI (must match exactly) |

**Behaviour:**

1. If `req.session.user` exists → `next()` (already authenticated)
2. Saves `req.originalUrl` to `req.session.returnTo`
3. Generates CSRF `state` token, stores in `req.session.oauthState`
4. Redirects to `${authServerUrl}/auth/login?client_id=...&redirect_uri=...&state=...`

**Session augmentation:** This module extends `express-session`'s `SessionData` with:

```typescript
interface SessionData {
    user?: { id: string; email: string; displayName: string; roles: string[] }
    oauthState?: string
    returnTo?: string
}
```

#### SSO Middleware — `createSSOCallbackHandler(config)`

Factory that returns an Express route handler for the OAuth callback URL. Mount at the path registered as `redirectUri`.

```typescript
import { createSSOCallbackHandler } from '@rnb/middleware'

const ssoCallback = createSSOCallbackHandler(config)
router.get('/api/auth/callback', ssoCallback)
```

**Behaviour:**

1. Verifies `state` query param matches `req.session.oauthState` (CSRF protection — `403` on mismatch)
2. Validates `code` is present (`400` if missing)
3. Makes server-to-server `POST ${authServerUrl}/auth/token` with `{ code, client_id, client_secret, redirect_uri }`
4. On `invalid_code` or `code_expired` → redirects to `/api/auth/initiate` to restart the flow
5. On `invalid_client` → logs critical error, returns `500`
6. Stores the returned `user` object in `req.session.user`
7. Redirects to `req.session.returnTo` (the original URL before the login redirect)

---

## 8. Package: `@rnb/security`

**Path:** `packages/security/`
**Consumed by:** All Express servers

### Purpose

All JWT token and cookie operations. Separates the concern of _how_ tokens are created, set, and cleared from the controllers that call them.

### Exports

#### `createToken(identityId, jwtSecret)`

Creates a signed HS256 JWT with `{ sub: identityId }` payload. Expiry is hardcoded to **7 days**.

```typescript
const token = createToken(identity._id.toString(), env.JWT_SECRET)
```

#### `verifyToken(token, secret)`

Verifies a JWT and returns its payload `{ sub, iat, exp }`. Throws a `JsonWebTokenError` if the token is invalid or expired (caught by `authenticate` middleware which re-throws as an `AppError`).

#### `setAuthCookie(res, identityId, jwtSecret, isDev?)`

Creates the JWT via `createToken`, then sets it as an httpOnly cookie named `auth_token`.

```typescript
Cookie properties:
  httpOnly: true          // Not accessible from JavaScript
  secure: !isDev          // HTTPS-only in production
  sameSite: 'strict'      // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds
```

The `isDev` flag is critical — it must be `true` in development because localhost serves over HTTP. If `secure: true` is set in dev, the browser silently drops the cookie.

#### `clearCookie(res, isDev?)`

Clears the `auth_token` cookie with matching `httpOnly`, `sameSite`, and `secure` flags. **The flags must match** the original `Set-Cookie` call, otherwise the browser treats them as different cookies and the clear operation has no effect.

#### `extractToken(req)`

Returns the raw JWT string from either:

1. `req.cookies.auth_token` (preferred — httpOnly cookie)
2. `Authorization: Bearer <token>` header (fallback — for API clients)

Returns `undefined` if neither is present.

#### `AUTH_COOKIE_NAME`

Exported constant `'auth_token'`. Import this wherever the cookie name is referenced to ensure consistency.

#### `formatEmail(email)`

Normalises an email address: lowercase and trim. Apply before any email comparison or database write.

---

## 9. Package: `@rnb/database`

**Path:** `packages/database/`
**Consumed by:** `realms-and-beyond-api`, `aetherscribe-api`, and any server that needs to read/write user data

### Purpose

Contains all Mongoose models. Separating models into a shared package means:

- Multiple servers can use the same MongoDB collections without reimplementing schemas.
- Schema changes propagate to all consumers automatically.
- Type safety for Mongoose operations is centralised.

### The Identity Model

The `Identity` model is the core of the IAM system. It stores everything about a user at the platform level.

#### Schema Architecture

The root schema composes eight sub-schemas:

```
Identity {
  profile        → profileSchema
  contact?       → contactSchema  (optional — collected post-registration)
  audit          → auditSchema
  lifecycle      → lifecycleSchema
  media          → mediaSchema
  preferences    → preferencesSchema
  security       → securitySchema
  verification   → verificationSchema
  services[]     → servicesSchema   (linked product accounts)
  lastLoginAt?   → String (ISO datetime)
  createdAt      → Date (Mongoose timestamps)
  updatedAt      → Date (Mongoose timestamps)
}
```

#### Sub-Schema Field Reference

**profileSchema**

| Field         | Type   | Notes                                         |
| ------------- | ------ | --------------------------------------------- |
| `firstName`   | String | Required                                      |
| `lastName`    | String | Required                                      |
| `email`       | String | Required, unique, indexed, lowercase, trimmed |
| `dateOfBirth` | String | Optional                                      |
| `gender`      | String | Optional                                      |
| `nationality` | String | Optional                                      |
| `pronouns`    | String | Optional                                      |

**auditSchema** (GDPR fields)

| Field                 | Type    | Notes                                       |
| --------------------- | ------- | ------------------------------------------- |
| `marketingConsent`    | Boolean | Default: `false`                            |
| `termsAcceptedAt`     | String  | ISO datetime                                |
| `termsVersion`        | String  | Which version of T&C was accepted           |
| `privacyAcceptedAt`   | String  | ISO datetime                                |
| `dataResidency`       | String  | Geographic data storage region              |
| `deletionRequestedAt` | String  | ISO datetime — set on GDPR deletion request |

**lifecycleSchema**

| Field              | Type        | Notes                                                                  |
| ------------------ | ----------- | ---------------------------------------------------------------------- |
| `status`           | String enum | `'active' \| 'soft-deleted' \| 'banned'`. Indexed. Default: `'active'` |
| `deletedAt`        | String      | ISO datetime set on soft delete                                        |
| `recoverableUntil` | String      | ISO datetime — expiry of recovery window                               |

**mediaSchema**

| Field             | Type   | Notes          |
| ----------------- | ------ | -------------- |
| `avatarUrl`       | String | Cloudinary URL |
| `bannerUrl`       | String | Cloudinary URL |
| `avatarUpdatedAt` | String | ISO datetime   |

**preferencesSchema**

| Field        | Type        | Notes                                                |
| ------------ | ----------- | ---------------------------------------------------- |
| `language`   | String      | Required (e.g. `'en'`, `'de'`)                       |
| `timezone`   | String      | Required (e.g. `'UTC'`, `'Europe/Berlin'`)           |
| `theme`      | String enum | `'light' \| 'dark' \| 'system'`. Default: `'system'` |
| `currency`   | String      | Optional (e.g. `'EUR'`)                              |
| `dateFormat` | String      | Optional                                             |

**securitySchema**

| Field                        | Type       | Notes                                              |
| ---------------------------- | ---------- | -------------------------------------------------- |
| `password`                   | String     | bcrypt hash. Never send to client.                 |
| `passwordChangedAt`          | String     | ISO datetime                                       |
| `passwordResetToken`         | String     | SHA-256 hash of the raw reset token. Sparse index. |
| `passwordResetExpiresIn`     | String     | ISO datetime expiry of reset token                 |
| `emailVerificationToken`     | String     | SHA-256 hash. Sparse index.                        |
| `emailVerificationExpiresIn` | String     | ISO datetime expiry                                |
| `lastKnownIp`                | String     | Updated on every successful login                  |
| `trustedDevices`             | ObjectId[] | Array of trusted device IDs                        |
| `recoveryEmail`              | String     | Backup email for account recovery                  |
| `recoveryPhone`              | String     | Backup phone for account recovery                  |

**verificationSchema**

| Field              | Type        | Notes                                                |
| ------------------ | ----------- | ---------------------------------------------------- |
| `emailVerified`    | Boolean     | Required. Default: `false`                           |
| `phoneVerified`    | Boolean     | Default: `false`                                     |
| `identityVerified` | Boolean     | Default: `false`                                     |
| `twoFactorEnabled` | Boolean     | Default: `false`                                     |
| `twoFactorMethod`  | String enum | `'totp' \| 'sms' \| 'email' \| 'passkey'`. Optional. |
| `verifiedAt`       | String      | ISO datetime of last identity verification           |

**servicesSchema** (linked product accounts)

| Field         | Type        | Notes                                                     |
| ------------- | ----------- | --------------------------------------------------------- |
| `serviceName` | String      | Required. E.g. `'aetherscribe'`                           |
| `serviceId`   | ObjectId    | Required. Points to the product-specific account document |
| `linkedAt`    | String      | Required. ISO datetime of account creation                |
| `scopes`      | String[]    | Required. Permissions granted (e.g. `['read', 'write']`)  |
| `status`      | String enum | `'active' \| 'soft-deleted' \| 'banned'`                  |

#### Instance Methods

All methods are registered via the plugin pattern (`registerXxxMethods(schema)`) to keep the model file clean.

**Password Methods**

| Method                              | Signature                             | Description                                                                                                          |
| ----------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `setPassword(input)`                | `({ plaintext }) => Promise<void>`    | Validates plaintext against `Z_SetPassword`, hashes with bcrypt (12 rounds), saves. Clears any existing reset token. |
| `verifyPassword(input)`             | `({ plaintext }) => Promise<boolean>` | bcrypt comparison. Returns `false` if no password set.                                                               |
| `generatePasswordResetToken()`      | `() => Promise<{ token, expiresAt }>` | Generates 64-char hex token, stores SHA-256 hash, sets 1-hour TTL. Returns raw token (send to user via email).       |
| `validatePasswordResetToken(input)` | `({ token }) => boolean`              | Checks TTL and constant-time hash comparison. Does NOT consume the token.                                            |
| `clearPasswordResetToken()`         | `() => Promise<void>`                 | Wipes `passwordResetToken` and `passwordResetExpiresIn`. Call after a successful reset.                              |

**Email Verification Methods**

| Method                                  | Signature                             | Description                                             |
| --------------------------------------- | ------------------------------------- | ------------------------------------------------------- |
| `generateEmailVerificationToken()`      | `() => Promise<{ token, expiresAt }>` | 64-char hex, SHA-256 stored, 24-hour TTL.               |
| `validateEmailVerificationToken(input)` | `({ token }) => boolean`              | TTL check + timing-safe comparison.                     |
| `verifyEmail()`                         | `() => Promise<void>`                 | Sets `emailVerified = true`, clears verification token. |

**Verification Flag Methods**

| Method              | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `verifyPhone()`     | Sets `phoneVerified = true`                                   |
| `verifyIdentity()`  | Sets `identityVerified = true`, records `verifiedAt`          |
| `isFullyVerified()` | Returns `true` if email, phone, and identity are all verified |

**Two-Factor Methods**

| Method                        | Description                                                   |
| ----------------------------- | ------------------------------------------------------------- |
| `enableTwoFactor({ method })` | Enables 2FA with specified method. Throws if already enabled. |
| `disableTwoFactor()`          | Disables 2FA, clears method.                                  |

**Trusted Device Methods**

| Method                              | Description                                           |
| ----------------------------------- | ----------------------------------------------------- |
| `addTrustedDevice({ deviceId })`    | Adds device ObjectId to the trusted list. Idempotent. |
| `removeTrustedDevice({ deviceId })` | Removes device from trusted list.                     |
| `isTrustedDevice({ deviceId })`     | Returns boolean.                                      |

**Session Methods**

| Method                | Description                                                                        |
| --------------------- | ---------------------------------------------------------------------------------- |
| `recordLogin({ ip })` | Records `lastKnownIp` and updates `lastLoginAt`. Called on every successful login. |

**Lifecycle Methods**

| Method               | Description                                                                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `softDelete(input?)` | Sets status to `'soft-deleted'`, records `deletedAt`, computes `recoverableUntil` based on `gracePeriodDays` (default 30). Cannot soft-delete a banned account. |
| `restore()`          | Reverts to `'active'`. Throws if banned or if recovery window has expired.                                                                                      |
| `ban()`              | Sets status to `'banned'`. This is permanent and not recoverable via `restore()`.                                                                               |
| `isActive()`         | Returns `true` if `lifecycle.status === 'active'`. Used by `authenticate` middleware.                                                                           |
| `requestDeletion()`  | Records `audit.deletionRequestedAt`. GDPR right-to-erasure audit trail.                                                                                         |

#### Static Methods

| Static                                | Signature                               | Description                                                                                             |
| ------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `findByEmail(email)`                  | `(string) => Promise<Identity \| null>` | Finds by lowercase email AND `lifecycle.status === 'active'`. Returns `null` for banned/deleted.        |
| `findByPasswordResetToken(token)`     | `(string) => Promise<Identity \| null>` | Finds by SHA-256 hash of token AND non-expired TTL AND `lifecycle.status === 'active'`.                 |
| `findByEmailVerificationToken(token)` | `(string) => Promise<Identity \| null>` | Finds by SHA-256 hash AND non-expired TTL. Does not filter by lifecycle (unverified users need access). |

#### `toClient()`

The `toClient()` method strips every sensitive field before sending the document over the wire. **All API responses that include a user object must call `toClient()`.**

Fields stripped:

- `security.password` (bcrypt hash)
- `security.passwordResetToken` (SHA-256 hash)
- `security.passwordResetExpiresIn`
- `security.emailVerificationToken` (SHA-256 hash)
- `security.emailVerificationExpiresIn`
- `_id` and `__v` (Mongoose internals)

The method adds `id` (string form of `_id`) in place of `_id`.

```typescript
// ✓ Safe — only send to clients via toClient()
res.json({ user: identity.toClient() })

// ✗ Never do this — exposes password hash and reset tokens
res.json({ user: identity.toObject() })
```

### The AetherscribeProfile Model

Stores product-specific data for Aetherscribe users. A user must have a `realms-and-beyond` Identity before they can have an AetherscribeProfile.

```
AetherscribeProfile {
  _id            → ObjectId
  identityId     → ObjectId (ref: Identity, unique, indexed)
  username       → String (unique, lowercase, trimmed, indexed)
  subscription   → aetherscribeSubscriptionSchema
  status         → 'active' | 'banned'
  createdAt      → Date
  updatedAt      → Date
}

aetherscribeSubscriptionSchema {
  plan           → 'free' | 'starter' | 'pro' | 'enterprise'
  status         → 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due'
  startDate      → String (ISO datetime)
  limits         → {
    maxWorlds, maxCharacters, maxStorageGB, maxCollaborators,
    advancedFeatures, apiAccess, customDomain, prioritySupport
  }
}
```

The `identityId` field has a **unique constraint** — one user can only have one Aetherscribe account.

#### `toClient()`

Strips `_id` and `__v`, adds `id` as the string ObjectId.

---

## 10. Package: `@rnb/ui`

**Path:** `packages/ui/`
**Consumed by:** All Next.js frontend apps

### Purpose

All shared React components, contexts, and hooks. Apps import from `@rnb/ui` rather than redefining components. Because Next.js apps set `transpilePackages: ['@rnb/ui']`, source TypeScript/TSX is compiled inline — no pre-compilation step needed.

### Export Structure

```typescript
// packages/ui/src/index.ts
export * from './utils/indexUtils' // Button, Card, EntityCard, CartridgeCard, Frame, Dropdown, BurgerIcon
export * from './layout/indexLayout' // Navbar, Sidebar, Footer
export * from './context/indexContext' // ThemeProvider, ThemeInitializer, ThemeSwitcher, useTheme
export * from './auth/indexAuth' // AuthProvider, useAuth, AuthGuard, AuthForm, OnboardingForm
```

### Auth Components

#### `AuthProvider`

React Context provider that manages the user session. Wrap the entire application with this at the root layout level.

```tsx
// apps/aetherscribe/app/layout.tsx
<AuthProvider>{children}</AuthProvider>
```

**State:**

- `user: I_AuthUser | null` — the authenticated user object
- `isLoading: boolean` — true while the session check is in-flight
- `hasAetherscribeAccount: boolean` — derived: `user?.services?.some(s => s.serviceName === 'aetherscribe')`

**Methods:**

- `login(email, password)` — POST to `/api/v1/user/login`, sets user state
- `logout()` — POST to `/api/v1/user/logout`, clears user state
- `signup(data)` — POST to `/api/v1/user/signup`, sets user state
- `createAetherscribeAccount(username, plan)` — POST to Aetherscribe API, updates user state with linked service

**Session rehydration:** On mount, `AuthProvider` calls `GET /api/v1/user/me` with `credentials: 'include'`. This fetches the session from the httpOnly cookie. If the cookie is present and valid, `user` is populated. If the cookie is absent or expired, `user` is set to `null`. This is the only mechanism for persisting login across page refreshes.

**API base URLs:**

- `NEXT_PUBLIC_API_URL` → R&B IAM API (default: `http://localhost:2611`)
- `NEXT_PUBLIC_AETHERSCRIBE_API_URL` → Aetherscribe API (default: `http://localhost:2612`)

#### `I_AuthUser`

```typescript
interface I_AuthUser {
    id: string
    profile: {
        firstName: string
        lastName: string
        email: string
        dateOfBirth?: string
        nationality?: string
        gender?: string
        pronouns?: string
    }
    preferences?: { language: string; timezone: string; theme: string }
    verification?: {
        emailVerified: boolean
        phoneVerified: boolean
        identityVerified: boolean
        twoFactorEnabled: boolean
    }
    lifecycle?: { status: string }
    services?: I_LinkedService[]
}

interface I_LinkedService {
    serviceName: string
    serviceId: string
    linkedAt: string
    scopes: string[]
    status: string
}
```

#### `AuthGuard`

Protects layouts/pages that require both authentication AND a product account.

```tsx
<AuthGuard>
    <Navbar ... />
    <main>{children}</main>
</AuthGuard>
```

**Redirect logic:**

1. `isLoading === true` → show spinner (prevents flash of redirect)
2. `!user` → `router.replace('/')`
3. `user && !hasAetherscribeAccount` → `router.replace('/onboarding')`
4. `user && hasAetherscribeAccount` → render children

If you need to protect a route that does not require a product account (e.g. an admin route), use a custom guard instead of `AuthGuard`.

#### `AuthForm`

Login/signup form component with full client-side validation.

```tsx
<AuthForm onSuccess={() => router.push('/hub')} />
```

**Props:**

- `onSuccess?: () => void` — called after successful login or signup

**Validation rules:**

- Email: regex format check
- Password: min 8 chars, uppercase, lowercase, digit, special char
- Password confirm: must match password (signup only)
- Name fields: required (signup only)

**Features:**

- Toggle between login and signup modes
- Per-field error messages (cleared on change, set on blur)
- Full validation on submit (blocks submission if any errors)
- `Eye`/`EyeOff` Lucide icon visibility toggle on password fields
- `noValidate` disables browser native validation UI

#### `OnboardingForm`

Product account creation form. Shown after a user creates a platform account but before they access the product.

```tsx
<OnboardingForm
    onSuccess={() => router.replace('/hub')}
    aetherscribeApiUrl="http://localhost:2612"
/>
```

**Props:**

- `onSuccess?: () => void` — called after account created
- `aetherscribeApiUrl?: string` — API base URL override

**Features:**

- Username input with 500ms debounced availability check against `/check-username/:username`
- Live validation icon (`CheckCircle` / `XCircle` / `Loader` spinner)
- Plan picker — 4 cards (Free, Starter, Pro, Enterprise) with feature lists
- "Most Popular" badge on Pro plan
- Calls `createAetherscribeAccount(username, plan)` from `AuthContext`

### Layout Components

#### `Navbar`

Responsive navigation bar with:

- Logo (fills header height via `aspect-ratio: 1/1`)
- Navigation links with active state detection (Next.js `usePathname`)
- Theme switcher (always visible in `nav-actions` area)
- Mobile hamburger menu (slide-in from right)
- Logout button (inside mobile nav)

```tsx
<Navbar
    headerIcon={logo} // StaticImageData or string URL
    headerTitle="Aetherscribe" // string
    navItems={navLinks} // I_NavItem[]
    onLogout={logout} // () => void
    showThemeToggle // boolean (optional, default true)
/>
```

#### `Sidebar`

Collapsible sidebar for content-heavy pages (e.g. Aetherscribe Hub).

```tsx
<Sidebar
    sections={sidebarData} // I_SidebarSection[]
    searchFn={searchFn} // (query: string) => I_SearchResult[]
    defaultOpen={false} // boolean
/>
```

Features:

- Search bar with dynamic results
- Expandable/collapsible sections
- Persistence of open/closed state via `localStorage`
- Mobile overlay mode

#### `Footer`

```tsx
<Footer appName="Aetherscribe" />
```

### Context

#### `ThemeProvider`

Manages theme (palette) and mode (light/dark/system). Sets `data-theme` and `data-mode` attributes on `<html>`. Persists selections to `localStorage`.

```tsx
<ThemeProvider
    themeStorageKey="aether-theme"
    modeStorageKey="aether-mode"
    defaultTheme="global-theme"
    defaultMode="system"
>
```

**Available themes:** `'global-theme'` | `'monochrome'` | `'n64'`
**Available modes:** `'light'` | `'dark'` | `'system'`

#### `ThemeInitializer`

Server-rendered inline `<script>` tag that reads localStorage and sets `data-theme`/`data-mode` on `<html>` **before** the page renders. This eliminates Flash of Unstyled Content (FOUC). Must be placed in `<head>`.

```tsx
<head>
    <ThemeInitializer
        themeStorageKey="aether-theme"
        modeStorageKey="aether-mode"
    />
</head>
```

#### `useTheme()`

```typescript
const { theme, mode, setTheme, setMode, isDark } = useTheme()
```

### Utility Components

#### `Button`

Highly configurable button component with retro fantasy aesthetic variants.

```tsx
<Button
    variant="submit" // T_BtnVariant
    size="lg" // 'sm' | 'md' | 'lg'
    btnType="submit" // 'button' | 'submit' | 'reset'
    isLoading={false} // shows spinner, disables button
    isDisabled={false} // disables button
    leftOrnament="⚔" // decorative prefix character
    rightOrnament="✦" // decorative suffix character
    onClick={handler}
>
    Submit
</Button>
```

**Variants:**

| Variant     | Visual                                                         |
| ----------- | -------------------------------------------------------------- |
| `gold`      | Antique amber gold — primary CTA, BEM class `btn--gold`        |
| `royal`     | Deep royal — secondary CTA, BEM class `btn--royal`             |
| `crimson`   | Battle crimson — destructive confirm, BEM class `btn--crimson` |
| `parchment` | Warm parchment — subtle/tertiary, BEM class `btn--parchment`   |
| `ghost`     | Transparent with border — utility                              |
| `outline`   | Border only                                                    |
| `accent`    | Sage green accent                                              |
| `danger`    | Danger red                                                     |
| `warning`   | Warning amber                                                  |
| `submit`    | Form submission (styled as primary)                            |
| `success`   | Confirmation green                                             |

---

## 11. Package: `@rnb/styles`

**Path:** `packages/styles/`
**Consumed by:** All frontend apps (import via `@rnb/styles` in root layout)

### Purpose

The complete SCSS design system for all applications. A single import (`@rnb/styles`) pulls in the full design token set, themes, resets, typography, and all component styles.

### Architecture

```
packages/styles/
├── global.scss           ← Single entry point — import this in your app
├── _variables.scss       ← All SCSS design tokens
├── _mixins.scss          ← All SCSS mixins
├── _themes.scss          ← Theme barrel (imports theme files)
├── global/               ← Base styles
│   ├── _reset.scss
│   ├── _root.scss         ← CSS custom properties + scanline overlay
│   ├── _typography.scss
│   ├── _animations.scss
│   └── _utils.scss
├── themes/               ← Per-mode overrides
│   ├── _dark.scss
│   ├── _light.scss
│   └── _byte-burger.scss
├── mixins/               ← Individual mixin files
│   ├── _buttons.scss
│   ├── _flexbox.scss
│   ├── _forms.scss
│   ├── _grid.scss
│   ├── _responsive.scss
│   ├── _states.scss
│   ├── _typography.scss
│   └── _animations.scss
└── components/
    ├── buttons.scss
    ├── cards.scss
    ├── inputs.scss
    ├── modals.scss
    ├── navigation.scss
    ├── tables.scss
    └── ui/                ← Working component SCSS files
        ├── layout/
        │   ├── navbar.scss
        │   ├── sidebar.scss
        │   └── footer.scss
        ├── button.scss
        └── forms/
            ├── form.scss
            └── inputs.scss
```

### Design Tokens (`_variables.scss`)

All tokens are SCSS variables prefixed by category. Components `@use` this file directly, **not** through the barrel.

```scss
@use '../../../_variables' as *;
```

**Colour Palette**

| Variable          | Value     | Usage                               |
| ----------------- | --------- | ----------------------------------- |
| `$obsidian`       | `#0e0c09` | Default background                  |
| `$obsidian-mid`   | `#161310` | Header / sidebar background         |
| `$obsidian-light` | `#1d1a14` | Card / surface background           |
| `$amber`          | `#b89038` | Primary brand colour (antique gold) |
| `$amber-mid`      | `#cca840` | Primary hover state                 |
| `$phosphor`       | `#507040` | Accent colour (sage green)          |
| `$ghost`          | `#f2ece0` | Light mode background               |
| `$mist`           | `#c2b79e` | Body text (warm parchment)          |

**Spacing Aliases**

| Variable  | Value    | Usage                  |
| --------- | -------- | ---------------------- |
| `$small`  | `0.3rem` | Tight gaps, padding    |
| `$medium` | `0.5rem` | Standard inner padding |
| `$large`  | `1rem`   | Component padding      |
| `$xLarge` | `1.5rem` | Section padding        |

**Typography**

| Variable        | Value                | Role                                   |
| --------------- | -------------------- | -------------------------------------- |
| `$font-display` | `'Cinzel'`           | Headings — fantasy inscriptional serif |
| `$font-body`    | `'Share Tech Mono'`  | Body — monospaced terminal readout     |
| `$font-ui`      | `'Barlow Condensed'` | UI labels, tags, HUD elements          |

**Layout Dimensions**

| Variable         | Value                             |
| ---------------- | --------------------------------- |
| `$navbar-height` | Height of the top navigation bar  |
| `$sidebar-max`   | Maximum sidebar width (expanded)  |
| `$sidebar-min`   | Minimum sidebar width (collapsed) |
| `$footer-height` | Footer height                     |

**Decorative**

| Variable            | Value  | Usage                                                  |
| ------------------- | ------ | ------------------------------------------------------ |
| `$border-radius`    | `2px`  | All corners — pixel-sharp retro aesthetic              |
| `$scanline-opacity` | `0.03` | Scanline overlay on the `body` — signature R&B texture |

### CSS Custom Properties (Themes)

The design system uses CSS custom properties for runtime theme switching. The `data-theme` attribute on `<html>` selects the active theme.

**Theme application:**

```html
<html data-theme="global-theme" data-mode="dark"></html>
```

**Available themes:**

| Theme          | Description                                  | Primary           | Accent           |
| -------------- | -------------------------------------------- | ----------------- | ---------------- |
| `global-theme` | Default — warm dark + antique gold           | `#b89038` (amber) | `#507040` (sage) |
| `monochrome`   | Pure greyscale — dark `#111` + mid-gray      | `#7a7a7a`         | `#7a7a7a`        |
| `n64`          | Console charcoal + logo blue + C-button gold | `#0066CC`         | `#FFD200`        |

**CSS variable naming convention:**

```
--bg-color               Primary background
--bg-secondary-color     Cards, panels
--bg-surface-color       Raised surfaces
--bg-inset-color         Input fields, inset areas
--text-color             Primary body text
--text-secondary-color   De-emphasised text
--text-muted-color       Placeholder, labels
--text-heading-color     Heading text
--primary-color          Brand primary (amber/blue/gray by theme)
--primary-hover-color    Hover state of primary
--primary-deep-color     Pressed/active state
--primary-glow           Ambient glow (rgba)
--primary-glow-strong    Focus ring glow (rgba)
--accent-color           Secondary accent
--border-color           Default border
--border-strong-color    Emphasized border
--border-radius          Global border radius (2px)
--danger-color           Error / destructive
--warning-color          Caution
--success-color          Success / confirmation
--submit-color           Form submission CTA
--shadow-sm/md/lg        Box shadow levels
--rule-color             Horizontal rule
--transition-speed       0.18s
--transition-slow        0.35s
```

### Component Classes Reference

**Form classes**

| Class                      | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| `.form-wrapper`            | Outer container — grid, centered, max-width, bordered        |
| `.form-contents`           | Inner grid of fields — `gap: $xLarge`                        |
| `.form-title`              | H2 inside form wrapper                                       |
| `.field`                   | Flex column with `gap: $small` — wraps label + input + error |
| `.field-label`             | Label text — monospaced, uppercase, muted color              |
| `.field-error`             | Inline error text — danger red, small                        |
| `.field-hint`              | Hint text — muted, small                                     |
| `.input`                   | Text input — full width, inset background, amber focus glow  |
| `.input--error`            | Red border on input                                          |
| `.input--success`          | Green border on input                                        |
| `.input-wrapper`           | Relative container for input + toggle button                 |
| `.input-visibility-toggle` | Absolutely positioned show/hide button                       |
| `.auth-form`               | Width capped at 480px                                        |
| `.auth-form__row`          | 2-col grid (first + last name) — collapses on mobile         |
| `.onboarding-form`         | Full-width grid with section spacing                         |
| `.plan-grid`               | 4-col responsive grid of plan cards                          |
| `.plan-card`               | Individual plan card — bordered, hover/selected state        |
| `.plan-card--selected`     | Amber border + glow                                          |
| `.plan-card--highlight`    | Accent border — "most popular"                               |
| `.plan-card__badge`        | "Most Popular" badge                                         |

**Landing / onboarding page classes**

| Class               | Description                                 |
| ------------------- | ------------------------------------------- |
| `.landing-page`     | Full-viewport centered flex column          |
| `.landing-hero`     | Hero text block — centered grid             |
| `.landing-title`    | Display font, large, amber glow text shadow |
| `.landing-subtitle` | Body font, muted color                      |
| `.onboarding-page`  | Full-viewport flex column, top-aligned      |

**Auth loading**

| Class                    | Description                                  |
| ------------------------ | -------------------------------------------- |
| `.auth-loading`          | Centered flex container                      |
| `.auth-loading__spinner` | Spinning border animation (amber top border) |

---

## 12. Package: `@rnb/assets`

**Path:** `packages/assets/`
**Consumed by:** All frontend apps

### Purpose

SVG icon components as React components. All icons follow the same interface and can be passed as `headerIcon` props to `Navbar`.

### Available Icons

| Export                 | Icon                        |
| ---------------------- | --------------------------- |
| `aetherscribeLogo`     | Aetherscribe app logo       |
| `hubIcon`              | Hub/dashboard icon          |
| `ancestriesIcon`       | Ancestries section          |
| `bestiaryIcon`         | Bestiary/creatures section  |
| `campaignsIcon`        | Campaigns section           |
| `featsIcon`            | Feats/abilities section     |
| `itemsIcon`            | Items/inventory section     |
| `locationsIcon`        | Locations section           |
| `npcsIcon`             | NPC section                 |
| `originsIcon`          | Origins/backgrounds section |
| `playerCharactersIcon` | Character section           |
| `spellsIcon`           | Spells section              |
| `worldsIcon`           | Worlds section              |

---

## 13. Package: `@rnb/types`

**Path:** `packages/types/`

### Purpose

TypeScript type definitions organised by domain. Separate from `@rnb/validators` which contains Zod schemas — types here are manual interfaces used where Zod inference is not needed or not available.

### Domain Structure

```
packages/types/src/
├── identity/            # User identity and auth types
├── global/              # Shared types (API responses, errors, pagination)
│   └── common/          # Contact, editing, metrics, payment, user
├── aetherscribe/        # Aetherscribe domain types
│   └── rulesets/        # DnD5e, Aetherscape, generic ruleset types
├── byteburger/          # ByteBurger domain types
└── nexusserve/          # NexusServe domain types
```

> **Note:** Prefer Zod-inferred types from `@rnb/validators` over manual interfaces in `@rnb/types` wherever a schema exists for the data shape. Manual types in `@rnb/types` are for shapes that are not validated at runtime.

---

## 14. Server: `realms-and-beyond-api`

**Path:** `servers/realms-and-beyond-api/`
**Package name:** `@rnb/realms-api`
**Default port:** `2611`
**Role:** IAM (Identity and Access Management) — the single source of auth for the entire platform

### Architecture

```
src/
├── app.ts               # Express app — middleware, routes
├── server.ts            # DB connection + server startup
├── controllers/
│   └── identityController.ts   # All auth/identity endpoint logic
├── routes/
│   └── identityRouter.ts       # Route definitions
└── utils/
    └── buildIdentityDefaults.ts # Creates default identity field values
```

### `buildIdentityDefaults({ profile, req })`

Used during signup to construct the initial state of a new Identity document.

**Language detection:** Reads `Accept-Language` HTTP header, extracts first language tag (e.g. `en-GB` → `en`). Falls back to `'en'`.

**Timezone detection:** Reads custom `x-timezone` HTTP header if set by the client. Falls back to `'UTC'`. Frontend apps should send this header on the signup request.

**Initial values:**

```typescript
{
    profile,  // passed in from signup body
    security: { trustedDevices: [] },
    preferences: { language, timezone, theme: 'system' },
    verification: { emailVerified: false, phoneVerified: false, identityVerified: false, twoFactorEnabled: false },
    lifecycle: { status: 'active' },
    audit: { marketingConsent: false },
}
```

> **Important:** `security: { trustedDevices: [] }` **must** be included. Mongoose does not auto-initialise sub-documents, and the password methods access `this.security.password` on save. Without this, `setPassword` throws `TypeError: Cannot set properties of undefined`.

### Route Reference

| Method | Path                    | Auth      | Handler           | Description                             |
| ------ | ----------------------- | --------- | ----------------- | --------------------------------------- |
| POST   | `/api/v1/user/signup`   | Public    | `signup`          | Register a new platform account         |
| POST   | `/api/v1/user/login`    | Public    | `login`           | Authenticate and receive session cookie |
| POST   | `/api/v1/user/logout`   | Protected | `logout`          | Clear session cookie                    |
| GET    | `/api/v1/user/me`       | Protected | `getMyAccount`    | Get full user profile                   |
| GET    | `/api/v1/user/me/check` | Protected | `checkAuth`       | Lightweight session validity check      |
| PATCH  | `/api/v1/user/me`       | Protected | `updateMyAccount` | Update profile and preference fields    |
| DELETE | `/api/v1/user/me`       | Protected | `deleteMyAccount` | Soft-delete account (30-day recovery)   |

### Endpoint Detail

#### `POST /api/v1/user/signup`

**Body:**

```json
{
    "firstName": "Duncan",
    "lastName": "Saul",
    "email": "user@example.com",
    "password": "Secure1!",
    "passwordConfirm": "Secure1!"
}
```

**Process:**

1. Validate `firstName`/`lastName` not empty
2. Validate `password === passwordConfirm`
3. Validate password strength via `Z_SetPassword`
4. Normalise email (lowercase, trim) via `formatEmail()`
5. Check for duplicate email via `Identity.findByEmail()`
6. Create Identity document with `buildIdentityDefaults()`
7. Hash and save password via `identity.setPassword()`
8. Set auth cookie via `setAuthCookie()`
9. Respond `201` with `{ user: identity.toClient() }`

**Success response:** `201`

```json
{
  "user": {
    "id": "...",
    "profile": { "firstName": "Duncan", "lastName": "Saul", "email": "user@example.com" },
    "preferences": { "language": "en", "timezone": "UTC", "theme": "system" },
    "verification": { "emailVerified": false, ... },
    "lifecycle": { "status": "active" },
    "services": []
  }
}
```

**Error responses:**

- `400` — Validation failure (missing name, password mismatch, weak password)
- `409` — Email already registered

---

#### `POST /api/v1/user/login`

**Body:**

```json
{
    "email": "user@example.com",
    "password": "Secure1!"
}
```

**Process:**

1. Validate email and password present
2. Find Identity by email (`findByEmail` filters out inactive accounts)
3. `verifyPassword()` — bcrypt comparison
4. Normalise IP (strip IPv6-mapped IPv4 prefix `::ffff:`)
5. `recordLogin({ ip })` — update `lastKnownIp` and `lastLoginAt`
6. Set auth cookie
7. Respond `200` with user object

**Error responses:**

- `400` — Missing fields
- `401` — Invalid email or password (deliberately vague — does not reveal whether the email exists)

---

#### `GET /api/v1/user/me`

Returns the full user profile as `identity.toClient()`. Called by `AuthProvider` on mount to rehydrate session.

---

#### `GET /api/v1/user/me/check`

Lightweight ping. Returns `{ authenticated: true, userId }`. Used by clients that only need to verify the session is alive without fetching the full profile.

---

#### `PATCH /api/v1/user/me`

**Updatable fields:**

```json
{
    "firstName": "Duncan",
    "lastName": "Saul",
    "dateOfBirth": "1990-01-15",
    "nationality": "German",
    "gender": "male",
    "pronouns": "he/him",
    "language": "de",
    "timezone": "Europe/Berlin",
    "theme": "dark",
    "currency": "EUR",
    "dateFormat": "DD/MM/YYYY"
}
```

All fields are optional — only provided fields are updated. Empty string for `firstName`/`lastName` returns a 400.

---

#### `DELETE /api/v1/user/me`

Calls `identity.softDelete()` (30-day recovery window) and `identity.requestDeletion()` (GDPR audit), clears the auth cookie. The account can be recovered within 30 days by a support flow that calls `identity.restore()`.

---

## 15. Server: `aetherscribe-api`

**Path:** `servers/aetherscribe-api/`
**Package name:** `@aetherscribe/api`
**Default port:** `2612`
**Role:** Aetherscribe product server — manages user accounts, subscriptions, and (future) worldbuilding content

### Authentication

This server uses the **same JWT secret** and **same `authenticate` middleware** as `realms-and-beyond-api`. The `auth_token` httpOnly cookie set by the IAM server is sent automatically by the browser (same domain/localhost in development). The `authenticate` middleware reads this cookie, verifies the JWT, fetches the full Identity document, and attaches it to `req.identity`.

**This means the Aetherscribe API never handles auth itself** — it delegates entirely to the shared middleware and the shared Identity model.

### Route Reference

| Method | Path                                       | Auth      | Handler           | Description                    |
| ------ | ------------------------------------------ | --------- | ----------------- | ------------------------------ |
| GET    | `/api/v1/account/check-username/:username` | Public    | `checkUsername`   | Check if username is available |
| POST   | `/api/v1/account`                          | Protected | `createAccount`   | Create Aetherscribe account    |
| GET    | `/api/v1/account/me`                       | Protected | `getMyAccount`    | Get my Aetherscribe account    |
| PATCH  | `/api/v1/account/me`                       | Protected | `updateMyAccount` | Update plan                    |
| DELETE | `/api/v1/account/me`                       | Protected | `deleteMyAccount` | Remove account                 |

### Endpoint Detail

#### `GET /api/v1/account/check-username/:username`

Public endpoint. Called by the `OnboardingForm` with a 500ms debounce.

**Response:** `200`

```json
{ "available": true }
```

or

```json
{ "available": false, "message": "Username must be at least 3 characters." }
```

The `message` field is present when the username fails format validation (not just taken). The frontend uses this to display per-field errors without making a form submission.

---

#### `POST /api/v1/account`

Creates an AetherscribeProfile and links it into the identity's `services` array.

**Body:**

```json
{
    "username": "chronicler",
    "plan": "free"
}
```

**Process:**

1. Check `AetherscribeProfile.findOne({ identityId })` — throw 409 if already exists
2. Validate `username` via `Z_AetherscribeUsername` (3-20 chars, alphanumeric + `_`/`-`)
3. Validate `plan` via `Z_SubscriptionPlan`
4. Check username uniqueness in database (case-insensitive)
5. Create `AetherscribeProfile` with `SUBSCRIPTION_LIMITS[plan]` as the limits snapshot
6. Push `linkedService` entry into `identity.services`:
    ```json
    {
        "serviceName": "aetherscribe",
        "serviceId": "<AetherscribeProfile _id>",
        "linkedAt": "<ISO datetime>",
        "scopes": ["read", "write"],
        "status": "active"
    }
    ```
7. Save identity
8. Respond `201` with `{ account, user: identity.toClient() }`

The response includes the **updated identity** (with the new service entry). The frontend's `AuthProvider` calls `setUser(json.user)`, which triggers a re-render of `AuthGuard`. Since `hasAetherscribeAccount` is now `true`, the guard allows access to protected routes.

**Success response:** `201`

```json
{
  "account": {
    "id": "...",
    "identityId": "...",
    "username": "chronicler",
    "subscription": {
      "plan": "free",
      "status": "active",
      "startDate": "2026-03-15T12:00:00.000Z",
      "limits": { "maxWorlds": 1, "maxCharacters": 10, "maxStorageGB": 1, "maxCollaborators": 0, ... }
    },
    "status": "active"
  },
  "user": { ... }
}
```

---

#### `PATCH /api/v1/account/me`

Updates the subscription plan. The `limits` snapshot is recalculated from `SUBSCRIPTION_LIMITS[newPlan]` and saved alongside the plan change.

**Body:**

```json
{ "plan": "pro" }
```

---

#### `DELETE /api/v1/account/me`

Sets `AetherscribeProfile.status = 'banned'` (soft removal) and removes the `aetherscribe` entry from `identity.services`. The Identity itself is unaffected.

---

## 16. Server: `nexus-serve-api`

**Path:** `servers/nexus-serve-api/`

Currently minimal scaffolding. The architecture mirrors `aetherscribe-api` — Express app with CORS, cookie-parser, Morgan. Routes and controllers are to be developed when the NexusServe product is in active development.

---

## 17. App: Aetherscribe

**Path:** `apps/aetherscribe/`
**Framework:** Next.js 14+ (App Router)
**Default port:** `3000`

### Purpose

RPG worldbuilding and campaign management web application. Users create worlds, characters, NPCs, campaigns, factions, and maintain their relationships.

### Route Structure

```
app/
├── layout.tsx          # Root layout — ThemeProvider + AuthProvider
├── page.tsx            # Landing / auth gate (public)
├── not-found.tsx       # 404 page
├── onboarding/
│   └── page.tsx        # Aetherscribe account setup (requires platform auth)
├── hub/
│   ├── layout.tsx      # Hub layout — AuthGuard + Navbar + Sidebar + Footer
│   ├── page.tsx        # Hub dashboard
│   ├── worlds/page.tsx
│   ├── campaigns/page.tsx
│   ├── ancestries/page.tsx
│   ├── backgrounds/page.tsx
│   ├── bestiary/page.tsx
│   ├── feats/page.tsx
│   ├── items/page.tsx
│   ├── npcs/page.tsx
│   ├── spells/page.tsx
│   └── player-characters/
│       ├── page.tsx
│       └── [id]/page.tsx   # Individual character sheet
├── my-account/
│   ├── layout.tsx      # AuthGuard + Navbar + Footer
│   └── page.tsx
└── settings/
    ├── layout.tsx      # AuthGuard + Navbar + Footer
    └── page.tsx
```

### Root Layout (`app/layout.tsx`)

```tsx
<html lang="en" suppressHydrationWarning>
    <head>
        <ThemeInitializer
            themeStorageKey="aether-theme"
            modeStorageKey="aether-mode"
        />
    </head>
    <body className="app-wrapper">
        <ThemeProvider
            themeStorageKey="aether-theme"
            modeStorageKey="aether-mode"
        >
            <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
    </body>
</html>
```

`suppressHydrationWarning` is required because `ThemeInitializer` modifies the `<html>` element during SSR. The `@rnb/styles` import here loads the full design system.

### Landing Page (`app/page.tsx`)

The entry point for unauthenticated users. Handles all redirect logic:

```
isLoading → render null (prevent flash)
!isLoading && !user → show AuthForm
!isLoading && user && hasAetherscribeAccount → replace('/hub')
!isLoading && user && !hasAetherscribeAccount → replace('/onboarding')
```

`AuthForm.onSuccess` navigates to `/onboarding` (not `/hub`) because the user may not yet have an Aetherscribe account.

### Onboarding Page (`app/onboarding/page.tsx`)

```
isLoading → render null
!user → replace('/')
user && hasAetherscribeAccount → replace('/hub')
user && !hasAetherscribeAccount → show OnboardingForm
```

`OnboardingForm.onSuccess` navigates to `/hub`.

### Hub Layout (`app/hub/layout.tsx`)

```tsx
<AuthGuard>
    <Navbar
        headerIcon={aetherscribeLogo}
        headerTitle="Aetherscribe"
        navItems={navLinks}
        onLogout={logout}
    />
    <main className="page-wrapper">
        <Sidebar
            sections={sidebarData}
            searchFn={searchFn}
            defaultOpen={false}
        />
        <section className="section-wrapper">{children}</section>
    </main>
    <Footer appName="Aetherscribe" />
</AuthGuard>
```

The `AuthGuard` here will redirect to `/` if not authenticated, or to `/onboarding` if authenticated but no Aetherscribe account.

The search function in the hub searches `testAccountContent` (development data) across all content categories and returns up to 8 results as `{ id, label, href }` objects for the `Sidebar` search dropdown.

### Navigation (`data/navLinks.ts`)

Single source of truth for navigation links shared across all layouts:

```typescript
;[
    { label: 'Hub', href: '/hub', icon: HubIcon },
    { label: 'My Account', href: '/my-account', icon: AccountIcon },
    { label: 'Settings', href: '/settings', icon: SettingsIcon },
]
```

---

## 18. App: ByteBurger

**Path:** `apps/byte-burger/`

Online food ordering application with its own visual theme (`byte-burger.scss`). The ByteBurger theme uses a different palette — food-industry appropriate warm tones.

### Route Structure

```
app/
├── layout.tsx     # Root layout with ByteBurger theme
├── page.tsx       # Landing / menu browse
└── menu/page.tsx  # Full menu
```

---

## 19. App: NexusServe

**Path:** `apps/nexus-serve/`

Restaurant point-of-sale and management system. Currently scaffolded. Employee management, shift scheduling, inventory, and sales reporting will be built here.

---

## 20. Authentication & Identity System

This is one of the most important systems in the codebase. Understanding it in full is essential for every engineer.

### Concept: OAuth 2.0 SSO + IAM

The platform uses the **Authorization Code Flow** (OAuth 2.0) for all authentication. A user has one `Identity` document in MongoDB. Member apps never see passwords — they receive a short-lived one-time `code`, exchange it server-to-server for a JWT, then maintain their own session.

Key actors:

| Actor | Role |
|---|---|
| **Browser** | Follows redirects. Never touches secrets. |
| **Auth server** (`realms-and-beyond-api`, port 2611) | Identity store, SSO session, code issuance, token exchange |
| **Auth UI** (`apps/rnb-auth`, port 3001) | Renders login/register forms. Forms POST directly to auth server. |
| **Member app** | Receives the auth code callback, exchanges it, manages own session. |

### Full OAuth Flow

```
Browser              Member App Server      Auth Server (2611)       MongoDB
   │                       │                       │                    │
   │  GET /dashboard        │                       │                    │
   │─────────────────────→ │                       │                    │
   │  No session → 302     │                       │                    │
   │  ←── redirect to auth server                  │                    │
   │                                               │                    │
   │  GET /auth/login?client_id=APP&redirect_uri=…&state=… ──────────→ │
   │                                               │  validate client   │──→ OAuthApp
   │                                               │  check SSO session │──→ sessions
   │                                               │  (none) → 302 to rnb-auth login UI
   │  GET localhost:3001/login?client_id=…          │                    │
   │─────────────────────────────────────────────→ │                    │
   │  [login form rendered]                         │                    │
   │                                                                     │
   │  POST /auth/login { email, password, client_id, redirect_uri, state }
   │──────────────────────────────────────────────────────────────────→ │
   │                                               │  verifyPassword    │──→ Identity
   │                                               │  set SSO session   │──→ sessions
   │                                               │  create AuthCode   │──→ AuthCode
   │  302 → member_app/api/auth/callback?code=…&state=…                 │
   │←────────────────────────────────────────────────────────────────── │
   │                                               │                    │
   │  GET /api/auth/callback?code=…&state=…        │                    │
   │─────────────────────────────────────────────→ │                    │
   │                       │  verify state         │                    │
   │                       │  POST /auth/token { code, client_secret }  │
   │                       │──────────────────────────────────────────→ │
   │                       │                       │  delete AuthCode   │
   │                       │                       │  issue JWT         │
   │                       │  { access_token, user }                    │
   │                       │←────────────────────────────────────────── │
   │                       │  set app session                           │
   │  302 → /dashboard     │                                            │
   │←─────────────────────→│                                            │
   │  ✓ Authenticated       │                                            │
```

### SSO Fast-Path (Second Login)

When a user who already logged into App A visits App B:

1. App B redirects to `GET /auth/login?client_id=APP_B&…`
2. Auth server finds an existing SSO session (`req.session.userId` is set)
3. Auth server **skips the login UI entirely** — immediately issues a code and redirects
4. App B exchanges the code as normal

**The user never sees a login page.** This is the SSO fast-path.

### Session Mechanism (direct API usage)

```
┌─────────────────────────────────────────────────────────────┐
│              IDENTITY API (direct, non-OAuth)               │
│                                                             │
│  Browser                    IAM API            MongoDB      │
│  ──────────────────────────────────────────────────────     │
│  POST /api/v1/user/login                                    │
│  { email, password }  ──────────────→                      │
│                              findByEmail()   ──────────→   │
│                              verifyPassword()               │
│                              setAuthCookie() ←──────────   │
│                       ←── 200 { user }                     │
│  Set-Cookie: auth_token=<JWT>; HttpOnly; Secure             │
│                                                             │
│  GET /api/v1/user/me (subsequent request)                  │
│  Cookie: auth_token=<JWT>  ──────────────→                  │
│                              authenticate middleware         │
│                              verifyToken()                  │
│                              Identity.findById()  ────────→ │
│                              req.identity = identity        │
│                       ←── 200 { user }                     │
└─────────────────────────────────────────────────────────────┘
```

> The direct API (`/api/v1/user/*`) is used by the `rnb-auth` account portal and can be used by any server-side code that needs to act as the authenticated user. OAuth is used by all member apps in the browser flow.

### Token Security Design

**Why SHA-256 hash tokens before storing?**

Password reset tokens and email verification tokens are sent to users via email. If an attacker gains read access to the database, raw token storage would allow them to trigger password resets. By storing only the SHA-256 hash, a database breach does not expose usable tokens.

**Why timing-safe comparison?**

String equality (`===`) in JavaScript short-circuits on the first mismatched character. An attacker can measure response times to determine how many characters of their guess match the real token. `crypto.timingSafeEqual()` processes all characters in constant time regardless of where the mismatch occurs.

**Why bcrypt with 12 rounds?**

bcrypt is intentionally slow (work factor of 2^12 ≈ 4096 iterations per hash). This makes brute-force attacks computationally infeasible. 12 rounds is the recommended balance between security and server performance (approximately 200-300ms per hash on modern hardware).

### Token Storage in Database

Tokens are stored in the database as SHA-256 hashes:

```
User receives (email):  abc123def456...  (64-char hex — raw token)
Database stores:        sha256(abc123...) (64-char hex — hash)
```

When validating:

```typescript
// From controller/method:
const rawToken = req.params.token // What user provided
const hashedInput = hashToken(rawToken) // SHA-256 the input
const hashedStored = doc.security.passwordResetToken // What's in DB

// Constant-time compare:
return safeCompareTokens(hashedInput, hashedStored)
```

### The `authenticate` Middleware in Detail

```
Request arrives at protected route
        │
        ▼
extractToken(req)
        │
        ├── Cookie 'auth_token' present?  → use it
        ├── Authorization: Bearer?        → extract token
        └── Neither?                      → throw 401 "Not logged in"
        │
        ▼
verifyToken(token, JWT_SECRET)
        │
        ├── Valid JWT?                    → extract { sub }
        └── Invalid/expired?             → throw 401 "Invalid token"
        │
        ▼
Identity.findById(sub)
        │
        ├── Found?                        → continue
        └── Not found?                   → throw 401 "Account no longer exists"
        │
        ▼
identity.isActive()
        │
        ├── true                          → req.identity = identity; next()
        └── false (banned/deleted)        → throw 403 "Account suspended"
```

### Session Persistence in the Frontend

The `AuthProvider`'s `useEffect` on mount:

```typescript
fetch(`${rnbApiBase()}/me`, { credentials: 'include' })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => setUser(data?.user ?? null))
    .catch(() => setUser(null))
    .finally(() => setIsLoading(false))
```

`credentials: 'include'` is critical — it tells the browser to send cookies cross-origin (from `localhost:3000` to `localhost:2611`). Without it, the cookie would not be sent and every page load would appear as unauthenticated.

`isLoading` starts as `true` and is only set to `false` in `.finally()`. This prevents any flash of the login form or the protected page before the session check completes.

### CORS Configuration

Both API servers allow:

```
Origin: http://localhost:3000 (Next.js dev), http://localhost:5173 (Vite)
Methods: GET, POST, PATCH, DELETE
Credentials: true
```

`credentials: true` on the server and `credentials: 'include'` on the client are both required for cross-origin cookies to work. If either is missing, cookies are blocked.

---

## 21. SSO — Adding Auth to a New App

This section is the step-by-step guide for wiring R&B SSO into any new Express-based member app. The entire integration is four steps: register the app, set env vars, add two middleware calls, and handle the callback route.

### Step 1 — Register the App in MongoDB

Run the registration script from the auth server directory. Edit `APP_CONFIG` at the top of the script before running.

```bash
npx tsx servers/realms-and-beyond-api/scripts/registerApp.ts
```

The script creates an `OAuthApp` document with:

| Field          | What to set                                                  |
| -------------- | ------------------------------------------------------------ |
| `name`         | Human-readable name, e.g. `"Aetherscribe"`                   |
| `clientId`     | A unique string, e.g. `"aetherscribe-app"`                   |
| `clientSecret` | A long random secret (generate with `openssl rand -hex 32`) |
| `redirectUris` | The exact callback URL, e.g. `["http://localhost:3002/api/auth/callback"]` |
| `scopes`       | `["openid", "profile"]`                                     |

The script outputs the generated `clientId` and `clientSecret`. **Store the secret in the app's `.env` — it cannot be recovered after this.**

---

### Step 2 — Configure Environment Variables

Add three variables to the member app's `.env`:

```bash
RNB_CLIENT_ID=aetherscribe-app
RNB_CLIENT_SECRET=<secret from registration step>
RNB_REDIRECT_URI=http://localhost:3002/api/auth/callback
```

The auth server URL (`http://localhost:2611`) is typically hardcoded in the config object or added as a fourth env var (`RNB_AUTH_SERVER_URL`).

---

### Step 3 — Add `requireSSOAuth` Middleware

In the member app's Express setup, import the factory from `@rnb/middleware` and create an instance:

```typescript
import { createRequireSSOAuth, createSSOCallbackHandler } from '@rnb/middleware'

const ssoConfig = {
    authServerUrl: process.env.RNB_AUTH_SERVER_URL ?? 'http://localhost:2611',
    clientId: process.env.RNB_CLIENT_ID!,
    clientSecret: process.env.RNB_CLIENT_SECRET!,
    redirectUri: process.env.RNB_REDIRECT_URI!,
}

const requireAuth = createRequireSSOAuth(ssoConfig)
const ssoCallback = createSSOCallbackHandler(ssoConfig)
```

Apply `requireAuth` to any route that should be protected:

```typescript
router.get('/dashboard', requireAuth, dashboardHandler)
router.get('/settings', requireAuth, settingsHandler)
```

**What `requireAuth` does:**

1. Checks `req.session.user` — if present, calls `next()` immediately (session already established)
2. Saves `req.originalUrl` to `req.session.returnTo` so the user lands on the page they were trying to reach after login
3. Generates a CSRF `state` token and stores it in `req.session.oauthState`
4. Redirects to `${authServerUrl}/auth/login?client_id=...&redirect_uri=...&state=...`

The app session (`express-session`) must be configured in the member app for this to work:

```typescript
import session from 'express-session'
import MongoStore from 'connect-mongo'

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
    cookie: { httpOnly: true, secure: false /* true in prod */ },
}))
```

---

### Step 4 — Mount the Callback Handler

Register the callback route at the exact path that matches `redirectUri`:

```typescript
router.get('/api/auth/callback', ssoCallback)
```

**What `ssoCallback` does:**

1. Reads `code` and `state` from query params
2. CSRF check: `state` must match `req.session.oauthState` — returns `403` on mismatch
3. Makes a server-to-server `POST /auth/token` to the auth server with `{ code, client_id, client_secret, redirect_uri }`
4. Auth server validates the code, deletes it (single-use), returns `{ access_token, user }`
5. Stores user object in `req.session.user`
6. Redirects to `req.session.returnTo` (the original URL before the login redirect)

**After the callback, `req.session.user` contains:**

```typescript
{
    id: string           // MongoDB ObjectId of the Identity
    email: string
    displayName: string  // firstName + lastName
    roles: string[]
}
```

Access it in any protected controller via `req.session.user`:

```typescript
router.get('/dashboard', requireAuth, (req, res) => {
    res.json({ message: `Hello, ${req.session.user!.displayName}` })
})
```

---

### Session Augmentation (TypeScript)

`requireSSOAuth.ts` augments the `express-session` `SessionData` interface. Import from `@rnb/middleware` in the member app's entry point to activate this augmentation:

```typescript
// In app.ts or server.ts — the import is enough
import '@rnb/middleware'
```

This gives `req.session.user`, `req.session.oauthState`, and `req.session.returnTo` full TypeScript types without re-declaring them.

---

### Logout

To log a user out of the member app AND the R&B SSO session:

```typescript
router.post('/api/auth/logout', async (req, res) => {
    // 1. Destroy the member app session
    await new Promise<void>((resolve, reject) =>
        req.session.destroy((err) => (err ? reject(err) : resolve()))
    )

    // 2. Notify the auth server to destroy the SSO session
    await fetch(`${ssoConfig.authServerUrl}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: req.session.user?.id }),
    }).catch(() => {}) // non-critical if this fails

    res.redirect('/')
})
```

Destroying only the member app session leaves the SSO session intact — the user would be instantly re-authenticated on the next visit via the fast-path. Destroy both to force a full re-login.

---

### Checklist for a New App

- [ ] `OAuthApp` document created via `registerApp.ts`
- [ ] `RNB_CLIENT_ID`, `RNB_CLIENT_SECRET`, `RNB_REDIRECT_URI` in `.env`
- [ ] `express-session` + `connect-mongo` configured in `app.ts`
- [ ] `createRequireSSOAuth(config)` applied to protected routes
- [ ] `createSSOCallbackHandler(config)` mounted at the `redirectUri` path
- [ ] Logout route destroys app session AND calls `POST /auth/logout` on auth server
- [ ] `SESSION_SECRET` is a strong random value (not shared with any other secret)

---

## 22. Database Models Reference

### Identity Model Summary

| Path                              | Type        | Index            | Notes                          |
| --------------------------------- | ----------- | ---------------- | ------------------------------ |
| `profile.email`                   | String      | Unique + Regular | Lowercase, trimmed             |
| `lifecycle.status`                | String enum | Regular          | `active\|soft-deleted\|banned` |
| `security.passwordResetToken`     | String      | Sparse           | SHA-256 hash                   |
| `security.emailVerificationToken` | String      | Sparse           | SHA-256 hash                   |

### AetherscribeProfile Model Summary

| Path         | Type     | Index            | Notes                    |
| ------------ | -------- | ---------------- | ------------------------ |
| `identityId` | ObjectId | Unique           | One-to-one with Identity |
| `username`   | String   | Unique + Regular | Lowercase, trimmed       |

### OAuthApp Model

**Path:** `packages/database/src/sso/oauthAppModel.ts`
**Collection:** `oauthapps`

Stores registered member apps that are permitted to participate in the SSO flow.

| Field          | Type     | Notes                                                               |
| -------------- | -------- | ------------------------------------------------------------------- |
| `name`         | String   | Required. Human-readable label, e.g. `"Aetherscribe"`              |
| `clientId`     | String   | Required, unique. Identifier sent in OAuth params.                 |
| `clientSecret` | String   | Required. Server-side secret — never sent to the browser.          |
| `redirectUris` | String[] | Allowed callback URLs. Auth server rejects any unlisted URI.        |
| `scopes`       | String[] | Permitted scopes, e.g. `["openid", "profile"]`.                    |
| `active`       | Boolean  | Default `true`. Set to `false` to disable an app without deleting. |
| `createdAt`    | Date     | Mongoose timestamps.                                               |
| `updatedAt`    | Date     | Mongoose timestamps.                                               |

**Exported as:** `OAuthApp` from `@rnb/database`.

### AuthCode Model

**Path:** `packages/database/src/sso/authCodeModel.ts`
**Collection:** `authcodes`

Single-use, short-lived authorization codes issued after successful authentication.

| Field        | Type     | Notes                                                                   |
| ------------ | -------- | ----------------------------------------------------------------------- |
| `code`       | String   | Required, unique. Random 32-char hex string.                            |
| `clientId`   | String   | Required. The app that requested the code.                              |
| `userId`     | String   | Required. MongoDB ObjectId string of the authenticated Identity.        |
| `redirectUri`| String   | Required. Must match the URI used in the original auth request.         |
| `expiresAt`  | Date     | Required. 5 minutes from creation.                                     |

**TTL index:** `{ expiresAt: 1 }, { expireAfterSeconds: 0 }` — MongoDB auto-deletes expired codes. Codes are also explicitly deleted on successful token exchange (single-use enforcement).

**Exported as:** `AuthCode` from `@rnb/database`.

---

## 23. API Reference

### realms-and-beyond-api — Full Endpoint Table

Base URL: `http://localhost:2611`

| Method | Endpoint                | Auth | Status      | Description                |
| ------ | ----------------------- | ---- | ----------- | -------------------------- |
| POST   | `/api/v1/user/signup`   | —    | 201/400/409 | Create platform account    |
| POST   | `/api/v1/user/login`    | —    | 200/400/401 | Login + set cookie         |
| POST   | `/api/v1/user/logout`   | ✓    | 200         | Clear cookie               |
| GET    | `/api/v1/user/me`       | ✓    | 200/401     | Full user profile          |
| GET    | `/api/v1/user/me/check` | ✓    | 200/401     | Lightweight auth check     |
| PATCH  | `/api/v1/user/me`       | ✓    | 200/400/401 | Update profile/preferences |
| DELETE | `/api/v1/user/me`       | ✓    | 200/401     | Soft-delete account        |

### aetherscribe-api — Full Endpoint Table

Base URL: `http://localhost:2612`

| Method | Endpoint                                   | Auth | Status      | Description                 |
| ------ | ------------------------------------------ | ---- | ----------- | --------------------------- |
| GET    | `/api/v1/account/check-username/:username` | —    | 200         | Check username availability |
| POST   | `/api/v1/account`                          | ✓    | 201/400/409 | Create Aetherscribe account |
| GET    | `/api/v1/account/me`                       | ✓    | 200/401/404 | Get Aetherscribe account    |
| PATCH  | `/api/v1/account/me`                       | ✓    | 200/400/401 | Update plan                 |
| DELETE | `/api/v1/account/me`                       | ✓    | 200/401     | Remove account              |

### realms-and-beyond-api — SSO OAuth Endpoints

These endpoints implement the OAuth 2.0 Authorization Code Flow. They are consumed by the auth UI (`apps/rnb-auth`) and by member apps during the token exchange.

Base URL: `http://localhost:2611`

| Method | Endpoint           | Caller          | Description                                                                                        |
| ------ | ------------------ | --------------- | -------------------------------------------------------------------------------------------------- |
| GET    | `/auth/login`      | Browser (redirect) | Validates `client_id`/`redirect_uri`. If SSO session exists → fast-path code issue. Otherwise → redirect to login UI. |
| POST   | `/auth/login`      | Login form      | Verifies credentials, sets SSO session, issues `AuthCode`, redirects to `redirect_uri?code=…&state=…`. |
| GET    | `/auth/register`   | Browser (redirect) | Validates client. Redirects to register UI.                                                       |
| POST   | `/auth/register`   | Register form   | Creates Identity, sets SSO session, issues code, redirects to `redirect_uri`.                     |
| POST   | `/auth/token`      | Member app server | Exchanges `code` for `{ access_token, user }`. Requires `client_secret`. Deletes code on success. |
| POST   | `/auth/logout`     | Member app server | Destroys the SSO session for the given `userId`.                                                  |

#### `GET /auth/login` — Query Parameters

| Param          | Required | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `client_id`    | Yes      | Registered app identifier                            |
| `redirect_uri` | Yes      | Must exactly match a URI in `OAuthApp.redirectUris`  |
| `state`        | Yes      | CSRF token generated by member app, echoed back      |
| `error`        | No       | Error code from a failed login attempt (query-only)  |

#### `POST /auth/token` — Request Body

```json
{
    "code": "abc123...",
    "client_id": "aetherscribe-app",
    "client_secret": "<secret>",
    "redirect_uri": "http://localhost:3002/api/auth/callback"
}
```

**Success response `200`:**

```json
{
    "access_token": "<JWT>",
    "user": {
        "id": "...",
        "email": "user@example.com",
        "displayName": "Duncan Saul",
        "roles": []
    }
}
```

**Error codes:**

| Code             | HTTP | Meaning                                              |
| ---------------- | ---- | ---------------------------------------------------- |
| `invalid_code`   | 400  | Code not found (already used or never issued)        |
| `code_expired`   | 400  | Code is past its 5-minute TTL                        |
| `invalid_client` | 401  | `client_id`/`client_secret` do not match             |
| `uri_mismatch`   | 400  | `redirect_uri` does not match the one used at `/auth/login` |

### Standard Error Response Shape

```json
{
    "status": "fail",
    "message": "Human-readable error description.",
    "field": "email"
}
```

`status` is `"fail"` for 4xx errors and `"error"` for 5xx errors. `field` is optional and indicates which form field caused the error.

---

## 24. Design System

### Brand Identity

The Realms & Beyond visual language is:

- **Retro arcade / SNES-era RPG aesthetic** — pixel-sharp corners (`border-radius: 2px`), scanline overlays, amber glow
- **Warm and muted** — no neon or saturated colours. Obsidian blacks, antique amber gold, sage green
- **NOT** cyberpunk, cold blue, or bright high-saturation

### Typography

Three typefaces define the visual hierarchy:

| Role    | Font             | Application                                                     |
| ------- | ---------------- | --------------------------------------------------------------- |
| Display | Cinzel           | Page titles, section headings, all-caps inscriptional text      |
| Body    | Share Tech Mono  | Body copy, form labels, UI text — monospaced terminal aesthetic |
| UI      | Barlow Condensed | Tags, badges, HUD labels, compact navigation items              |

All three are loaded via Google Fonts in `global.scss`.

### Spacing System

The spacing system uses four named SCSS variables:

| Token     | Value    | Use                                   |
| --------- | -------- | ------------------------------------- |
| `$small`  | `0.3rem` | Gaps between tight adjacent elements  |
| `$medium` | `0.5rem` | Standard field padding, inner padding |
| `$large`  | `1rem`   | Component padding, section spacing    |
| `$xLarge` | `1.5rem` | Page-level section gaps               |

### Scanline Effect

The signature R&B texture is a subtle scanline overlay applied via CSS `::after` pseudo-element. It uses a repeating linear gradient at `$scanline-opacity: 0.03` — barely perceptible but adds depth to dark backgrounds.

### Shadow System

Shadows in R&B use **amber glow** rather than hard black drop shadows:

```css
--shadow-sm: 0 2px 8px rgba(184, 144, 56, 0.12);
--shadow-md: 0 4px 16px rgba(184, 144, 56, 0.18);
--shadow-lg: 0 8px 32px rgba(184, 144, 56, 0.24);
```

### Component Patterns

**Forms:** All form layouts use `.form-wrapper` + `.form-contents` → `.field` → `label` + `.input` pattern. Errors go in `.field-error` immediately below the input.

**Buttons:** The `Button` component maps variants to BEM modifiers. Regal variants (`gold`, `royal`, `crimson`, `parchment`) use `btn--*` class. Semantic variants (`danger`, `submit`, `success`) use the variant name directly.

**Borders:** `@include border` mixin applies `1px solid var(--border-color)` with the standard `$border-radius`.

---

## 25. Frontend Architecture

### Next.js App Router

All apps use the **App Router** (introduced in Next.js 13, stable in 14). Key conventions:

- **Layouts** (`layout.tsx`) wrap child routes and persist across navigations. Use for Navbar/Footer/Sidebar/AuthGuard wrapping.
- **Pages** (`page.tsx`) are the leaf route segments. Each directory with a `page.tsx` is a navigable route.
- **`'use client'`** directive marks a component as a Client Component. Required for hooks (`useState`, `useEffect`, `useRouter`, `useContext`).
- Components without `'use client'` are Server Components by default. They cannot use hooks but can be `async` and access backend data directly.

### Server vs Client Components

| Type             | Can use hooks | Can be async | Can access DB directly | Notes                                             |
| ---------------- | ------------- | ------------ | ---------------------- | ------------------------------------------------- |
| Server Component | No            | Yes          | Yes                    | Default. Rendered on server, no client JS bundle. |
| Client Component | Yes           | No           | No                     | Marked with `'use client'`.                       |

All auth components (`AuthProvider`, `AuthGuard`, `AuthForm`, `OnboardingForm`) are Client Components because they use `useState`, `useEffect`, and `useRouter`.

All layout files that use `useAuth()` are Client Components.

### `transpilePackages`

The apps' `next.config.js` includes:

```javascript
transpilePackages: ['@rnb/ui', '@rnb/assets', '@rnb/styles']
```

This tells Next.js to transpile these workspace packages inline rather than expecting pre-compiled output. Without this, importing TypeScript source from `@rnb/ui` would fail.

### Theme and Flash of Unstyled Content

FOUC is prevented by `ThemeInitializer`, which generates an inline `<script>` tag that runs **synchronously before the browser renders any HTML**. This script reads `localStorage` and sets `data-theme`/`data-mode` on `<html>` before React hydrates. Without it, the page would flash with the default theme on every page load for users who have selected a different theme.

---

## 26. Data Flow & Use Case Scenarios

### Scenario 1: New User Signup → Hub Access

```
User visits https://aetherscribe.app
        │
        ▼
app/page.tsx loads
AuthProvider.useEffect fires → GET /api/v1/user/me
        │
        ├── No cookie / 401 → user = null, isLoading = false
        └── Show landing page with AuthForm
        │
User fills signup form (firstName, lastName, email, password, passwordConfirm)
Client-side validation passes
        │
        ▼
AuthForm.handleSubmit
→ AuthContext.signup()
→ POST /api/v1/user/signup { firstName, lastName, email, password, passwordConfirm }
        │
        ▼
realms-and-beyond-api:
1. Validates input
2. Checks email uniqueness
3. Creates Identity document
4. Hashes password (bcrypt 12 rounds)
5. Sets auth_token cookie (JWT, 7d, httpOnly)
6. Returns 201 { user }
        │
        ▼
AuthContext: setUser(data.user)
        │
hasAetherscribeAccount = false (user.services is empty)
        │
        ▼
page.tsx useEffect fires: !hasAetherscribeAccount → router.replace('/onboarding')
        │
        ▼
onboarding/page.tsx renders OnboardingForm
        │
User types username "chronicler"
        │
        ▼ (500ms debounce)
GET /api/v1/account/check-username/chronicler
→ { available: true }
        │
User selects "Pro" plan, clicks "Begin Your Legend"
        │
        ▼
AuthContext.createAetherscribeAccount("chronicler", "pro")
→ POST /api/v1/account { username: "chronicler", plan: "pro" }
        │
        ▼
aetherscribe-api:
1. authenticate middleware: verify JWT cookie → req.identity
2. Check no existing account
3. Validate username format
4. Check username uniqueness
5. Create AetherscribeProfile
6. Push linkedService into identity.services
7. Save identity
8. Return 201 { account, user }
        │
        ▼
AuthContext: setUser(data.user)   ← user.services now has aetherscribe entry
        │
hasAetherscribeAccount = true
        │
        ▼
OnboardingForm.onSuccess → router.replace('/hub')
        │
        ▼
hub/layout.tsx renders
AuthGuard: user ✓, hasAetherscribeAccount ✓ → renders children
User is in the hub
```

---

### Scenario 2: Returning User Login

```
User visits https://aetherscribe.app
        │
AuthProvider.useEffect → GET /api/v1/user/me
        │
        ├── Cookie valid → 200 { user }
        │   setUser(data.user)
        │   hasAetherscribeAccount = true
        │   page.tsx: router.replace('/hub')
        │
        └── Cookie expired/absent → user = null
            Show landing page
            User submits email + password
            POST /api/v1/user/login
            Sets new cookie
            setUser(data.user)
            router.push('/onboarding') — checked in onboarding, has account → /hub
```

---

### Scenario 3: Existing Platform User, No Aetherscribe Account

A user who registered on the platform via another product visits Aetherscribe for the first time:

```
User logs in via AuthForm (existing R&B account)
setUser(data.user) — user.services has no 'aetherscribe' entry
hasAetherscribeAccount = false

page.tsx useEffect: router.replace('/onboarding')
        │
User creates Aetherscribe account via OnboardingForm
→ Same flow as Scenario 1 from the POST /api/v1/account step
```

---

### Scenario 4: Auth Guard Enforcement

```
User directly navigates to https://aetherscribe.app/hub/worlds
        │
hub/layout.tsx → AuthGuard renders
AuthProvider: isLoading = true
        │
        ▼
Show spinner (auth check in flight)
        │
        ▼ (GET /me resolves)
        ├── No session → router.replace('/') → landing page
        │
        ├── Session valid, no aetherscribe account → router.replace('/onboarding')
        │
        └── Session valid, has account → render hub layout + worlds page
```

---

### Scenario 5: Account Soft Delete

```
User clicks "Delete Account" in settings
        │
DELETE /api/v1/user/me
        │
identity.softDelete()    → lifecycle.status = 'soft-deleted', deletedAt, recoverableUntil (+30 days)
identity.requestDeletion() → audit.deletionRequestedAt
clearCookie(res, isDev)  → auth_token cleared
        │
Next request with old cookie:
authenticate() → Identity.findById(sub)
identity.isActive() → false  → throw 403 "Account suspended"
User cannot log in
        │
Within 30 days — support calls:
identity.restore() → lifecycle.status = 'active', deletedAt/recoverableUntil cleared
User can log in again
```

---

### Scenario 6: Password Reset Flow

```
User clicks "Forgot Password"
        │
POST /forgot-password { email }
        │
identity.generatePasswordResetToken()
→ Returns raw 64-char hex token
→ Stores SHA-256(token) in DB with 1-hour TTL
        │
Email service sends: https://app.com/reset?token=<raw>
        │
User clicks link, submits new password
        │
POST /reset-password { email, token, newPassword }
        │
identity = Identity.findByPasswordResetToken(token)
→ Queries by SHA-256(token), filters by TTL and lifecycle.status
        │
identity.validatePasswordResetToken({ token })
→ safeCompareTokens(SHA-256(input), stored) + TTL check
        │
identity.setPassword({ plaintext: newPassword })
→ bcrypt(newPassword, 12) → stores hash
→ Clears passwordResetToken + expiresIn
        │
Identity secured with new password
```

---

## 27. Environment Configuration

### `realms-and-beyond-api` — `.env`

```bash
NODE_ENV=development
PORT=2611

# MongoDB Atlas URI (replace <PASSWORD> placeholder)
DATABASE=mongodb+srv://<user>:<PASSWORD>@cluster.mongodb.net/rnb?retryWrites=true&w=majority
DATABASE_PASSWORD=your_db_password

# JWT — must match across all API servers on this platform
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_COOKIE_SECRET=your_cookie_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Cloudinary (for avatar/media uploads)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
USER_DEFAULT_AVATAR=https://res.cloudinary.com/.../default-avatar.png

# Email services
RESEND_API_KEY=re_xxxxxxxxxxxx
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USERNAME=your_username
MAILTRAP_PASSWORD=your_password

FRONTEND_URL=http://localhost:3000

# SSO session store
SESSION_SECRET=your_strong_random_session_secret_min_32_chars

# URL of the rnb-auth login UI (Next.js app, port 3001)
AUTH_UI_URL=http://localhost:3001
```

> **`SESSION_SECRET`** must be a long, random secret (generate with `openssl rand -hex 32`). It is used to sign the express-session cookie for the SSO session store. It is completely separate from `JWT_SECRET` and must not be shared.
>
> **`AUTH_UI_URL`** tells the auth server where to redirect the browser when a login UI is needed. In development this is `http://localhost:3001`. In production, set it to the deployed `rnb-auth` domain.

### `aetherscribe-api` — `.env`

```bash
NODE_ENV=development
PORT=2612

# Must connect to the same MongoDB database as realms-and-beyond-api
DATABASE=mongodb+srv://<user>:<PASSWORD>@cluster.mongodb.net/rnb?retryWrites=true&w=majority
DATABASE_PASSWORD=your_db_password

# Must be identical to realms-and-beyond-api JWT_SECRET
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
```

> **Critical:** `JWT_SECRET` must be identical across all servers. The `aetherscribe-api` uses the `authenticate` middleware from `@rnb/middleware` which verifies tokens signed by `realms-and-beyond-api`. If the secrets differ, all token verifications in the aetherscribe-api will fail with 401.

### Frontend `.env.local`

```bash
# apps/aetherscribe/.env.local
NEXT_PUBLIC_API_URL=http://localhost:2611
NEXT_PUBLIC_AETHERSCRIBE_API_URL=http://localhost:2612
```

These are injected as `process.env.NEXT_PUBLIC_*` values at build time. They are exposed to the browser (that is the purpose of the `NEXT_PUBLIC_` prefix). Never put secrets in `NEXT_PUBLIC_` variables.

### Member App (SSO client) — `.env`

Any Express app wired as an SSO member via `@rnb/middleware` needs these additional variables:

```bash
# Must connect to same MongoDB as realms-and-beyond-api
DATABASE=mongodb+srv://...

# SSO session signing secret — unique per app, never shared
SESSION_SECRET=your_member_app_session_secret

# OAuth client credentials from registerApp.ts script
RNB_CLIENT_ID=your-app-client-id
RNB_CLIENT_SECRET=your-app-client-secret
RNB_REDIRECT_URI=http://localhost:<port>/api/auth/callback

# URL of the auth server
RNB_AUTH_SERVER_URL=http://localhost:2611
```

> **`RNB_CLIENT_SECRET`** is a server-side secret. It is only ever used in the server-to-server `POST /auth/token` call. Never expose it in frontend code or `NEXT_PUBLIC_` env vars.

---

## 28. Code Conventions

### TypeScript

**Naming conventions:**

| Type                   | Convention                               | Example                                              |
| ---------------------- | ---------------------------------------- | ---------------------------------------------------- |
| Interface              | `I_` prefix, PascalCase                  | `I_AuthUser`, `I_ButtonProps`                        |
| Type alias             | `T_` prefix, PascalCase                  | `T_BtnVariant`, `T_SubscriptionPlan`                 |
| Zod schema             | `Z_` prefix, PascalCase                  | `Z_SetPassword`, `Z_IdentitySchema`                  |
| Inferred type from Zod | `T_` prefix                              | `type T_Identity = z.infer<typeof Z_IdentitySchema>` |
| React component        | PascalCase                               | `AuthForm`, `Navbar`                                 |
| Function/variable      | camelCase                                | `buildIdentityDefaults`, `setAuthCookie`             |
| Constant               | SCREAMING_SNAKE_CASE                     | `SUBSCRIPTION_LIMITS`, `AUTH_COOKIE_NAME`            |
| SCSS variable          | `$kebab-case`                            | `$font-display`, `$obsidian-mid`                     |
| CSS class              | `.kebab-case` with BEM where appropriate | `.plan-card`, `.plan-card--selected`                 |

**Strictness:**

All TypeScript is configured with `"strict": true`. This enables:

- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictPropertyInitialization`

**No `any` except in narrow Mongoose method registrations** where the schema generic is complex. These are annotated with comments explaining the exception.

### Zod Schema Conventions

- All schemas are exported as `Z_*` named exports
- All inferred types are exported immediately after the schema as `type T_* = z.infer<typeof Z_*>`
- Use `z.iso.datetime()` for ISO datetime strings (Zod v4 syntax — not `z.string().datetime()`)
- Use `z.email()` for email validation (Zod v4 syntax — not `z.string().email()`)
- Prefer `.safeParse()` in controllers (never let a parse error reach the global error handler uncaught)
- Use `.parse()` in Mongoose methods where the input is always expected to be valid (failures should propagate as method errors)

### File Structure

- Each feature/module gets its own file — no mega-files
- Barrel files (`index.ts`, `indexAuth.ts`, `indexUtils.ts`) re-export everything from the module
- Method registrations in the database package follow the `registerXxxMethods(schema)` pattern — never modify the schema directly in the model file

### Error Handling

- **Controllers:** Always use `catchAsync`. Throw `AppError` for expected failures. Never `try/catch` in a controller unless you need to recover from a specific error.
- **Middleware methods:** Use `Z_*.parse()` — let Zod errors propagate.
- **Never return error details from 5xx responses** — the global error handler replaces the message with a generic string.
- **Vague auth errors:** Login failures always return "Invalid email or password" regardless of whether the email was found. This prevents user enumeration attacks.

### SCSS Conventions

- Every component SCSS file starts with `@use '../../../_variables' as *` and `@use '../../../_mixins' as *`
- Never hardcode colour values — always use CSS custom properties (`var(--primary-color)`) or SCSS variables (`$amber`)
- Use CSS custom properties for theme-sensitive values (colors, shadows) and SCSS variables for structural values (spacing, font families)
- BEM methodology for complex components: `block`, `block__element`, `block--modifier`

### Git Conventions

- Commit messages are imperative: "Add AetherscribeProfile model" not "Added model"
- Feature branches follow: `feature/short-description`
- All changes to `@rnb/*` packages should be considered breaking if they change exported types — communicate these to consumers

---

## 29. Dependency Graph

The following diagram shows which workspaces depend on which:

```
                        ┌───────────────┐
                        │  @rnb/errors  │
                        └───────┬───────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
    ┌─────────▼────────┐               ┌──────────▼────────┐
    │ @rnb/validators  │               │  @rnb/middleware  │
    └─────────┬────────┘               └──────────┬────────┘
              │                                   │
              │    ┌──────────────────────────────┘
              │    │
    ┌─────────▼────▼───┐
    │  @rnb/security   │
    └─────────┬────────┘
              │
              │    ┌─────────────────┐
              │    │  @rnb/database  │──── @rnb/validators
              │    │                 │──── @rnb/middleware
              └────┤                 │
                   └────────┬────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
  realms-and-        aetherscribe-      nexus-serve-
  beyond-api             api               api
                          │
          ┌───────────────────────────────────────┐
          │  @rnb/styles  │  @rnb/ui  │ @rnb/assets │
          └───────────────────────────────────────┘
                          │
          ┌───────────────┼────────────────────┐
          ▼               ▼                    ▼
    aetherscribe     byte-burger          nexus-serve
       (app)           (app)               (app)
```

**Key rules from this graph:**

1. `@rnb/errors` has **no dependencies** — it's the foundation
2. `@rnb/validators` depends only on `zod` and `mongoose` (for ObjectId type) and `envalid`
3. `@rnb/middleware` depends on `@rnb/errors` and `@rnb/validators`
4. `@rnb/security` depends on `@rnb/validators` (for `env`) and `jsonwebtoken`
5. `@rnb/database` depends on `@rnb/validators` and `@rnb/middleware` (for token utilities)
6. All servers depend on `@rnb/database`, `@rnb/middleware`, `@rnb/security`, `@rnb/validators`, `@rnb/errors`
7. Frontend packages (`@rnb/ui`, `@rnb/styles`, `@rnb/assets`) are only consumed by apps — never by servers

**Circular dependency rule:** No package may import from a package that is higher in the dependency graph than itself. For example, `@rnb/validators` must never import from `@rnb/database`. Violations will cause build failures or runtime import errors.

---

## Appendix A: Common Development Tasks

### Adding a new endpoint to `realms-and-beyond-api`

1. Define a Zod schema in `@rnb/validators` if new input validation is needed
2. Write the controller function in `identityController.ts` (or create a new controller file)
3. Wrap with `catchAsync`
4. Throw `AppError` for all expected failures
5. Call `.toClient()` on any Identity document before including it in the response
6. Register the route in `identityRouter.ts`

### Adding a new product

1. Define the product account Zod schemas in `@rnb/validators/src/zod/zod.<product>.ts`
2. Create the Mongoose model in `@rnb/database/src/<product>/`
3. Export from `@rnb/database/src/index.ts`
4. Create a new server in `servers/<product>-api/`
5. Add `@rnb/*` workspace dependencies to the server's `package.json`
6. Register a unique `serviceName` (e.g. `'byteburger'`) in `servicesSchema` — the existing schema accepts any string, no changes needed
7. Add the `hasXxxAccount` derived state to `AuthContext` if the product needs onboarding
8. Create an `OnboardingForm` variant for the product's account setup
9. Update `AuthGuard` if the product's app needs to enforce account creation

### Adding a new theme

1. Add a new `T_ThemeName` to the union in `ThemeContext.tsx`
2. Add it to `VALID_THEMES` in `ThemeContext.tsx`
3. Add it to `THEME_OPTIONS` in `ThemeSwitcher.tsx`
4. Create a new `_<theme>.scss` file under `packages/styles/themes/`
5. Define all `[data-theme="<name>"]` CSS custom property overrides
6. Import the new theme file in `_themes.scss`

---

_End of Developer Guide_
