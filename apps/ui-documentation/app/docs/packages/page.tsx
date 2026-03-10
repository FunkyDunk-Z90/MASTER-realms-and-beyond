import { Section, H3, P, CodeBlock, Callout, PropsTable } from '@rnb/ui'

export default function PackagesPage() {
    return (
        <>
            <div className="docs-hero">
                <p className="docs-eyebrow">Shared Packages</p>
                <h1 className="docs-h1">Package Reference</h1>
                <p className="docs-hero-sub">
                    Every package in <code className="docs-code-inline">packages/</code> is an
                    internal workspace dependency — consumed by apps and other packages via{' '}
                    <code className="docs-code-inline">workspace:*</code>. All packages compile
                    TypeScript to <code className="docs-code-inline">dist/</code> and must be
                    rebuilt after changes.
                </p>
            </div>

            {/* ── @rnb/types ── */}
            <Section id="types" title="@rnb/types" tag="packages/types/">
                <P>
                    The foundational types package. Contains all shared TypeScript interfaces and
                    type aliases used across apps, packages, and servers. Has zero dependencies.
                </P>

                <H3>Adding to a workspace</H3>
                <CodeBlock label="package.json" lang="json">{`{
  "dependencies": {
    "@rnb/types": "workspace:*"
  }
}`}</CodeBlock>

                <H3>Key exports</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Export</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">I_Link</code></td><td>Navigation link shape: id, label, href, optional icon</td></tr>
                            <tr><td><code className="docs-code-inline">T_ObjectId</code></td><td>MongoDB ObjectId as string type alias</td></tr>
                            <tr><td><code className="docs-code-inline">I_ApiResponse&lt;T&gt;</code></td><td>Standard API response envelope: status, message, data</td></tr>
                            <tr><td><code className="docs-code-inline">I_PaginatedResponse&lt;T&gt;</code></td><td>Paginated API response: results, total, page, limit</td></tr>
                            <tr><td><code className="docs-code-inline">I_User</code></td><td>Base user shape shared across auth surfaces</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>I_Link</H3>
                <CodeBlock label="Usage" lang="tsx">{`import { I_Link } from '@rnb/types'

const navLinks: I_Link[] = [
    { id: 'hub',  label: 'Hub',  href: '/hub'  },
    { id: 'docs', label: 'Docs', href: '/docs' },
]`}</CodeBlock>

                <H3>I_ApiResponse</H3>
                <CodeBlock label="Usage in hooks/server actions" lang="ts">{`import { I_ApiResponse } from '@rnb/types'

async function fetchCharacter(id: string): Promise<I_ApiResponse<Character>> {
    const res = await fetch(\`/api/characters/\${id}\`)
    return res.json()
}

// Response shape:
// { status: 'success', message: 'Character found', data: Character }
// { status: 'error',   message: 'Not found',        data: null }`}</CodeBlock>

                <H3>Adding a new type</H3>
                <CodeBlock label="packages/types/src/index.ts" lang="ts">{`// Add your interface or type alias here
export interface I_Campaign {
    id: T_ObjectId
    title: string
    description: string
    createdAt: string
    updatedAt: string
}

// Then rebuild the package
// pnpm --filter @rnb/types build`}</CodeBlock>

                <Callout type="tip">
                    Keep types in this package <strong>pure</strong> — no runtime code, no imports
                    from other R&amp;B packages. Types should be usable in both frontend and backend
                    without any dependency chain concerns.
                </Callout>
            </Section>

            {/* ── @rnb/hooks ── */}
            <Section id="hooks" title="@rnb/hooks" tag="packages/hooks/">
                <P>
                    Shared React hooks consumed by Next.js apps. Depends on{' '}
                    <code className="docs-code-inline">@rnb/types</code> and{' '}
                    <code className="docs-code-inline">axios</code> for HTTP requests.
                </P>

                <H3>Adding to a workspace</H3>
                <CodeBlock label="package.json" lang="json">{`{
  "dependencies": {
    "@rnb/hooks": "workspace:*"
  }
}`}</CodeBlock>

                <H3>Key exports</H3>
                <CodeBlock label="packages/hooks/src/index.ts" lang="ts">{`// Current exports — add new hooks here
export * from './useFetch'
export * from './useDebounce'
export * from './useLocalStorage'`}</CodeBlock>

                <H3>useFetch</H3>
                <CodeBlock label="Usage" lang="tsx">{`'use client'
import { useFetch } from '@rnb/hooks'

function CharacterList() {
    const { data, loading, error } = useFetch<Character[]>('/api/characters')

    if (loading) return <p>Loading...</p>
    if (error)   return <p>Error: {error.message}</p>

    return (
        <ul>
            {data?.map(c => <li key={c.id}>{c.name}</li>)}
        </ul>
    )
}`}</CodeBlock>

                <H3>useDebounce</H3>
                <CodeBlock label="Usage" lang="tsx">{`'use client'
import { useDebounce } from '@rnb/hooks'

function SearchBar() {
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 300)

    useEffect(() => {
        if (debouncedQuery) performSearch(debouncedQuery)
    }, [debouncedQuery])

    return <input value={query} onChange={e => setQuery(e.target.value)} />
}`}</CodeBlock>

                <H3>Adding a new hook</H3>
                <CodeBlock label="packages/hooks/src/useMyHook.ts" lang="ts">{`import { useState, useEffect } from 'react'

export function useMyHook(param: string) {
    const [state, setState] = useState<string | null>(null)

    useEffect(() => {
        // hook logic
        setState(param.toUpperCase())
    }, [param])

    return state
}`}</CodeBlock>
                <CodeBlock label="packages/hooks/src/index.ts" lang="ts">{`export * from './useMyHook'  // ← add export`}</CodeBlock>
            </Section>

            {/* ── @rnb/errors ── */}
            <Section id="errors" title="@rnb/errors" tag="packages/errors/">
                <P>
                    The most fundamental package — zero dependencies. Exports a single{' '}
                    <code className="docs-code-inline">AppError</code> class that extends the native{' '}
                    <code className="docs-code-inline">Error</code>. Used across both frontend and
                    API servers for consistent error handling.
                </P>

                <H3>AppError class</H3>
                <CodeBlock label="packages/errors/src/AppError.ts" lang="ts">{`export class AppError extends Error {
    statusCode: number
    status: 'fail' | 'error'
    isOperational: boolean
    field?: string

    constructor(message: string, statusCode: number, field?: string) {
        super(message)
        this.statusCode = statusCode
        this.status = statusCode >= 500 ? 'error' : 'fail'
        this.isOperational = true
        this.field = field

        Error.captureStackTrace(this, this.constructor)
    }
}`}</CodeBlock>

                <H3>Usage in Express API server</H3>
                <CodeBlock label="server route" lang="ts">{`import { AppError } from '@rnb/errors'

// Throw from a controller
if (!user) {
    throw new AppError('User not found', 404)
}

// Throw a field-specific validation error
if (!email) {
    throw new AppError('Email is required', 400, 'email')
}

// Global error handler catches it
app.use((err: AppError, req, res, next) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        field: err.field,
    })
})`}</CodeBlock>

                <H3>Usage in frontend</H3>
                <CodeBlock label="Next.js server action" lang="ts">{`import { AppError } from '@rnb/errors'

async function createCharacter(formData: FormData) {
    const name = formData.get('name')

    if (!name || typeof name !== 'string') {
        throw new AppError('Character name is required', 400, 'name')
    }

    // proceed...
}`}</CodeBlock>
            </Section>

            {/* ── @rnb/validators ── */}
            <Section id="validators" title="@rnb/validators" tag="packages/validators/">
                <P>
                    Form validation utilities and environment variable validation using{' '}
                    <code className="docs-code-inline">envalid</code>. Depends on{' '}
                    <code className="docs-code-inline">@rnb/errors</code> so validation failures
                    throw consistent <code className="docs-code-inline">AppError</code>s.
                </P>

                <H3>Environment validation</H3>
                <P>
                    Each API server should validate its environment at startup using the provided
                    <code className="docs-code-inline">validateEnv</code> utility. This will throw
                    at boot if required variables are missing — catching misconfigurations before
                    any requests are served.
                </P>
                <CodeBlock label="src/config/env.ts" lang="ts">{`import { validateEnv } from '@rnb/validators'
import { str, port, url } from 'envalid'

export const env = validateEnv({
    NODE_ENV:    str({ choices: ['development', 'production', 'test'] }),
    PORT:        port({ default: 5000 }),
    MONGO_URI:   url(),
    JWT_SECRET:  str({ minLength: 32 }),
})`}</CodeBlock>

                <H3>Form validation</H3>
                <CodeBlock label="Validating a form submission" lang="ts">{`import { validateFields } from '@rnb/validators'
import { AppError } from '@rnb/errors'

async function registerUser(data: { email: string; password: string }) {
    const errors = validateFields(data, {
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address',
        },
        password: {
            required: true,
            minLength: 8,
            message: 'Password must be at least 8 characters',
        },
    })

    if (errors.length > 0) {
        throw new AppError(errors[0].message, 400, errors[0].field)
    }

    // proceed with registration
}`}</CodeBlock>
            </Section>

            {/* ── @rnb/middleware ── */}
            <Section id="middleware" title="@rnb/middleware" tag="packages/middleware/">
                <P>
                    Reusable Express middleware. Depends on{' '}
                    <code className="docs-code-inline">@rnb/errors</code> and{' '}
                    <code className="docs-code-inline">mongoose</code>. Intended exclusively for
                    server-side use — do not import in Next.js app code.
                </P>

                <H3>Key exports</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Export</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">errorHandler</code></td><td>Global Express error handler — formats AppError and unhandled errors into consistent JSON responses</td></tr>
                            <tr><td><code className="docs-code-inline">notFound</code></td><td>404 catch-all middleware — throws AppError(404) for unknown routes</td></tr>
                            <tr><td><code className="docs-code-inline">asyncHandler</code></td><td>Wraps async route handlers to forward rejections to Express error pipeline</td></tr>
                            <tr><td><code className="docs-code-inline">protect</code></td><td>JWT auth middleware — verifies Bearer token and attaches user to req</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Usage in an Express app</H3>
                <CodeBlock label="src/app.ts" lang="ts">{`import express from 'express'
import { errorHandler, notFound, asyncHandler } from '@rnb/middleware'

const app = express()

// Routes
app.use('/api/characters', characterRouter)

// Error handling — must be last
app.use(notFound)
app.use(errorHandler)`}</CodeBlock>

                <CodeBlock label="src/controllers/characterController.ts" lang="ts">{`import { asyncHandler } from '@rnb/middleware'
import { AppError } from '@rnb/errors'

// asyncHandler eliminates try/catch boilerplate
export const getCharacter = asyncHandler(async (req, res) => {
    const character = await Character.findById(req.params.id)

    if (!character) {
        throw new AppError('Character not found', 404)
    }

    res.json({ status: 'success', data: character })
})`}</CodeBlock>
            </Section>

            {/* ── @rnb/security ── */}
            <Section id="security" title="@rnb/security" tag="packages/security/">
                <P>
                    JWT token creation, verification, and cookie management utilities. Uses{' '}
                    <code className="docs-code-inline">jsonwebtoken</code> under the hood.
                    Server-side only — do not import in Next.js app code.
                </P>

                <H3>Key exports</H3>
                <div className="docs-table-wrap">
                    <table className="docs-table">
                        <thead><tr><th>Export</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code className="docs-code-inline">signToken(payload, secret, expiresIn)</code></td><td>Sign a JWT with the given payload and secret</td></tr>
                            <tr><td><code className="docs-code-inline">verifyToken(token, secret)</code></td><td>Verify a JWT — returns decoded payload or throws</td></tr>
                            <tr><td><code className="docs-code-inline">sendCookie(res, name, token, maxAge)</code></td><td>Set an httpOnly, secure cookie on the response</td></tr>
                            <tr><td><code className="docs-code-inline">clearCookie(res, name)</code></td><td>Expire and clear a named cookie</td></tr>
                        </tbody>
                    </table>
                </div>

                <H3>Usage in an auth controller</H3>
                <CodeBlock label="src/controllers/authController.ts" lang="ts">{`import { signToken, sendCookie } from '@rnb/security'
import { asyncHandler } from '@rnb/middleware'

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.verifyPassword(password))) {
        throw new AppError('Invalid credentials', 401)
    }

    const token = signToken(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET!,
        '7d'
    )

    sendCookie(res, 'token', token, 7 * 24 * 60 * 60 * 1000)

    res.json({ status: 'success', data: { user } })
})`}</CodeBlock>

                <Callout type="warn">
                    Never import <code className="docs-code-inline">@rnb/security</code> in
                    Next.js app code or client components. JWT secrets and signing logic
                    must stay server-side. Use Next.js Server Actions or API Routes as the
                    boundary.
                </Callout>
            </Section>

            {/* ── @rnb/assets ── */}
            <Section id="assets" title="@rnb/assets" tag="packages/assets/">
                <P>
                    Brand images, icons, and other static assets shared across apps.
                    Assets are imported as Next.js static image imports for optimal optimisation.
                </P>

                <H3>Usage</H3>
                <CodeBlock label="Importing a brand image" lang="tsx">{`import Logo from '@rnb/assets/src/images/rnb-logo.png'
import { Image } from 'next/image'

<Image src={Logo} alt="Realms & Beyond" width={40} height={40} />`}</CodeBlock>

                <H3>Adding a new asset</H3>
                <CodeBlock label="Process" lang="text">{`1. Add the image/file to packages/assets/src/images/
2. Export it from packages/assets/package.json (exports: "./*")
3. Import it in the consuming app as a static import
4. Next.js will optimise it automatically via next/image`}</CodeBlock>

                <Callout type="info">
                    For app-specific assets (logo, hero images), keep them in the app&apos;s own{' '}
                    <code className="docs-code-inline">public/</code> directory. Use{' '}
                    <code className="docs-code-inline">@rnb/assets</code> only for shared brand
                    elements that appear in multiple apps (e.g. the R&amp;B wordmark).
                </Callout>
            </Section>
        </>
    )
}
