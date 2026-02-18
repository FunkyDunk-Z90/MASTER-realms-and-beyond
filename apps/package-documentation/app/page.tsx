'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
    id: string
    label: string
    children?: NavItem[]
}

interface Package {
    id: string
    name: string
    version: string
    description: string
    color: string
    glow: string
    border: string
    tag: string
    deps: string[]
    exports: { name: string; description: string }[]
    sections: Section[]
}

interface Section {
    id: string
    title: string
    content: Block[]
}

type Block =
    | { type: 'text'; value: string }
    | { type: 'code'; lines: string[] }
    | { type: 'warning'; label: string; value: string }
    | { type: 'info'; label: string; value: string }
    | { type: 'table'; headers: string[]; rows: string[][] }
    | { type: 'rules'; items: string[] }

// ─── Data ─────────────────────────────────────────────────────────────────────

const packages: Package[] = [
    {
        id: 'errors',
        name: '@rnb/errors',
        version: '0.1.0',
        description: 'Centralised error class for all operational errors',
        color: '#ef4444',
        glow: 'rgba(239,68,68,0.15)',
        border: 'rgba(239,68,68,0.4)',
        tag: 'CORE',
        deps: [],
        exports: [
            {
                name: 'AppError',
                description:
                    'Extended Error class with statusCode, status, isOperational and optional field properties',
            },
        ],
        sections: [
            {
                id: 'errors-purpose',
                title: 'Purpose',
                content: [
                    {
                        type: 'text',
                        value: 'Every server in the monorepo throws the same AppError class. This guarantees that the global error handler in @rnb/middleware always knows what shape an operational error has, regardless of which server or controller threw it.',
                    },
                    {
                        type: 'warning',
                        label: 'RULE',
                        value: 'Servers must never create their own error classes. All intentional errors must use AppError from this package.',
                    },
                ],
            },
            {
                id: 'errors-api',
                title: 'API Reference',
                content: [
                    {
                        type: 'table',
                        headers: ['Property', 'Type', 'Description'],
                        rows: [
                            [
                                'message',
                                'string',
                                'Human-readable error message forwarded to the client',
                            ],
                            [
                                'statusCode',
                                'number',
                                'HTTP status code (400, 401, 403, 404, 409, 500 etc.)',
                            ],
                            [
                                'status',
                                'string',
                                '"fail" for 4xx, "error" for 5xx — auto-derived from statusCode',
                            ],
                            [
                                'isOperational',
                                'boolean',
                                'Always true — distinguishes known errors from unexpected crashes',
                            ],
                            [
                                'field?',
                                'string',
                                'Optional — field name for client-side form error highlighting',
                            ],
                        ],
                    },
                ],
            },
            {
                id: 'errors-usage',
                title: 'Usage',
                content: [
                    { type: 'text', value: 'Basic error:' },
                    {
                        type: 'code',
                        lines: [
                            "import { AppError } from '@rnb/errors'",
                            '',
                            "throw new AppError('Resource not found', 404)",
                        ],
                    },
                    {
                        type: 'text',
                        value: 'With field targeting for form validation:',
                    },
                    {
                        type: 'code',
                        lines: [
                            "throw new AppError('Email is already registered', 409, 'email')",
                            '',
                            '// Client receives:',
                            '// { status: "fail", message: "Email already registered", field: "email" }',
                        ],
                    },
                ],
            },
            {
                id: 'errors-codes',
                title: 'Status Codes',
                content: [
                    {
                        type: 'table',
                        headers: ['Code', 'When to use'],
                        rows: [
                            [
                                '400',
                                'Validation failure — missing or invalid fields',
                            ],
                            [
                                '401',
                                'Unauthenticated — no valid session or wrong credentials',
                            ],
                            [
                                '403',
                                'Authenticated but not authorised for this resource',
                            ],
                            ['404', 'Resource not found'],
                            [
                                '409',
                                'Conflict — e.g. duplicate email on signup',
                            ],
                            [
                                '500',
                                'Unexpected server error (avoid — let the handler catch these)',
                            ],
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'middleware',
        name: '@rnb/middleware',
        version: '0.1.0',
        description: 'Express request handling infrastructure',
        color: '#6366f1',
        glow: 'rgba(99,102,241,0.15)',
        border: 'rgba(99,102,241,0.4)',
        tag: 'INFRA',
        deps: ['@rnb/errors'],
        exports: [
            {
                name: 'catchAsync',
                description:
                    'Wraps async controllers so thrown errors flow to the global error handler',
            },
            {
                name: 'errorHandler',
                description:
                    'Global Express error handling middleware — must be registered last in app.ts',
            },
            {
                name: 'createOne',
                description: 'Generic Mongoose create handler',
            },
            {
                name: 'getAll',
                description: 'Generic Mongoose find all handler',
            },
            {
                name: 'getOne',
                description: 'Generic Mongoose findById handler',
            },
            {
                name: 'updateOne',
                description: 'Generic Mongoose findByIdAndUpdate handler',
            },
            {
                name: 'updateMany',
                description:
                    'Generic Mongoose bulkWrite handler for batch updates',
            },
            {
                name: 'deleteOne',
                description: 'Generic Mongoose findByIdAndDelete handler',
            },
        ],
        sections: [
            {
                id: 'middleware-catchasync',
                title: 'catchAsync',
                content: [
                    {
                        type: 'text',
                        value: 'Without catchAsync, any thrown error inside an async controller becomes an unhandled promise rejection and Express falls back to its default HTML error page instead of your JSON error handler.',
                    },
                    {
                        type: 'code',
                        lines: [
                            "import { catchAsync } from '@rnb/middleware'",
                            "import { AppError } from '@rnb/errors'",
                            '',
                            'export const getUser = catchAsync(async (req, res, next) => {',
                            '    const user = await UserModel.findById(req.params.id)',
                            '',
                            '    if (!user) {',
                            "        throw new AppError('User not found', 404)",
                            '    }',
                            '',
                            '    res.status(200).json({ user })',
                            '})',
                        ],
                    },
                ],
            },
            {
                id: 'middleware-errorhandler',
                title: 'errorHandler',
                content: [
                    {
                        type: 'text',
                        value: 'The global error handler must be the last middleware registered in app.ts. It distinguishes between operational errors (AppError) and unexpected crashes, and never leaks internals to the client.',
                    },
                    {
                        type: 'code',
                        lines: [
                            "import { errorHandler } from '@rnb/middleware'",
                            '',
                            '// app.ts — register AFTER all routes',
                            "app.use('/api/v1/identity', identityRoutes)",
                            "app.use('/api/v1/users', userRoutes)",
                            '',
                            'app.use(errorHandler)  // ← must be last',
                        ],
                    },
                    {
                        type: 'info',
                        label: 'RESPONSE',
                        value: 'AppError → { status, message, field? }   |   Unexpected → { status: "error", message: "Something went wrong." }',
                    },
                ],
            },
            {
                id: 'middleware-crud',
                title: 'Generic CRUD Handlers',
                content: [
                    {
                        type: 'text',
                        value: 'Accept a Mongoose model and return a fully wired Express route handler. Your model must implement a toClient() method returning the safe public document representation.',
                    },
                    {
                        type: 'code',
                        lines: [
                            '// Model requirement',
                            'interface I_BaseDoc extends Document {',
                            '    toClient(): unknown',
                            '}',
                        ],
                    },
                    {
                        type: 'code',
                        lines: [
                            "import { getAll, getOne, createOne, updateOne, deleteOne } from '@rnb/middleware'",
                            'import { ProductModel } from "../models/productModel"',
                            '',
                            "router.route('/')",
                            '    .get(getAll(ProductModel))',
                            '    .post(createOne(ProductModel))',
                            '',
                            "router.route('/:id')",
                            '    .get(getOne(ProductModel))',
                            '    .patch(updateOne(ProductModel))',
                            '    .delete(deleteOne(ProductModel))',
                        ],
                    },
                    {
                        type: 'text',
                        value: 'updateMany expects req.body.updates as an array:',
                    },
                    {
                        type: 'code',
                        lines: [
                            '// Request body shape for updateMany',
                            '{',
                            '    "updates": [',
                            '        { "id": "abc123", "fields": { "status": "active" } },',
                            '        { "id": "def456", "fields": { "status": "inactive" } }',
                            '    ]',
                            '}',
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'security',
        name: '@rnb/security',
        version: '0.1.0',
        description: 'JWT, cookies, tokens and formatting utilities',
        color: '#22c55e',
        glow: 'rgba(34,197,94,0.15)',
        border: 'rgba(34,197,94,0.4)',
        tag: 'AUTH',
        deps: [],
        exports: [
            {
                name: 'setAuthCookie',
                description:
                    'Signs a JWT and sets it as an httpOnly cookie on the response',
            },
            {
                name: 'createToken',
                description:
                    'Creates a signed JWT string without setting a cookie',
            },
            {
                name: 'extractToken',
                description:
                    'Extracts a JWT from either cookies or Authorization header',
            },
            {
                name: 'clearCookie',
                description: 'Clears an auth cookie on logout',
            },
            {
                name: 'formatEmail',
                description: 'Lowercases and trims an email string',
            },
            {
                name: 'formatDate',
                description: 'Formats a Date to "17 Feb 2026, 14:35:22"',
            },
        ],
        sections: [
            {
                id: 'security-setcookie',
                title: 'setAuthCookie',
                content: [
                    {
                        type: 'text',
                        value: 'The primary auth function used after a successful login or signup. Signs a 7-day JWT and attaches it as a secure httpOnly cookie. The cookie is not accessible from JavaScript, preventing XSS token theft.',
                    },
                    {
                        type: 'code',
                        lines: [
                            "import { setAuthCookie } from '@rnb/security'",
                            '',
                            'setAuthCookie(',
                            '    res,',
                            '    identity._id.toString(),',
                            '    env.JWT_SECRET,',
                            "    env.NODE_ENV === 'production'",
                            ')',
                        ],
                    },
                    {
                        type: 'info',
                        label: 'NOTE',
                        value: 'Pass isProd as env.NODE_ENV === "production". In production the cookie is Secure (HTTPS only). In development it works over HTTP.',
                    },
                ],
            },
            {
                id: 'security-createtoken',
                title: 'createToken',
                content: [
                    {
                        type: 'text',
                        value: 'Use when you need just the JWT string — for example, in a password reset link or email verification URL — without setting a cookie.',
                    },
                    {
                        type: 'code',
                        lines: [
                            "import { createToken } from '@rnb/security'",
                            '',
                            'const token = createToken(identity._id.toString(), env.JWT_SECRET)',
                            '// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."',
                        ],
                    },
                ],
            },
            {
                id: 'security-extract',
                title: 'extractToken',
                content: [
                    {
                        type: 'text',
                        value: 'Checks cookies first (httpOnly cookie from setAuthCookie), then falls back to the Authorization Bearer header for API clients.',
                    },
                    {
                        type: 'code',
                        lines: [
                            "import { extractToken } from '@rnb/security'",
                            '',
                            'export const protect = catchAsync(async (req, res, next) => {',
                            '    const token = extractToken(req)',
                            '',
                            '    if (!token) {',
                            "        throw new AppError('You are not logged in', 401)",
                            '    }',
                            '',
                            '    const decoded = jwt.verify(token, env.JWT_SECRET)',
                            '    // attach identity to req...',
                            '    next()',
                            '})',
                        ],
                    },
                ],
            },
            {
                id: 'security-clear',
                title: 'clearCookie',
                content: [
                    {
                        type: 'code',
                        lines: [
                            "import { clearCookie } from '@rnb/security'",
                            '',
                            'export const logout = catchAsync(async (req, res, next) => {',
                            "    clearCookie(res, 'auth_token')",
                            "    res.status(200).json({ status: 'success' })",
                            '})',
                        ],
                    },
                ],
            },
            {
                id: 'security-format',
                title: 'formatEmail / formatDate',
                content: [
                    {
                        type: 'code',
                        lines: [
                            "import { formatEmail, formatDate } from '@rnb/security'",
                            '',
                            "formatEmail('  John.DOE@Example.COM  ')",
                            "// 'john.doe@example.com'",
                            '',
                            'formatDate(new Date())',
                            "// '18 Feb 2026, 14:35:22'",
                            '',
                            'formatDate(undefined)',
                            '// undefined',
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'validators',
        name: '@rnb/validators',
        version: '0.1.0',
        description: 'Unified field validation with TypeScript type guards',
        color: '#f59e0b',
        glow: 'rgba(245,158,11,0.15)',
        border: 'rgba(245,158,11,0.4)',
        tag: 'VALIDATION',
        deps: ['@rnb/errors'],
        exports: [
            {
                name: 'validate',
                description:
                    'Unified validator — routes to correct logic via discriminated union type guards',
            },
        ],
        sections: [
            {
                id: 'validators-purpose',
                title: 'Purpose',
                content: [
                    {
                        type: 'text',
                        value: 'All validation logic is centralised here so that password strength rules, email checks, and name requirements are identical across every server. A change to the password rules propagates everywhere automatically.',
                    },
                    {
                        type: 'warning',
                        label: 'RULE',
                        value: 'Never write inline validation logic in a controller. Always call validate() from this package.',
                    },
                ],
            },
            {
                id: 'validators-inputs',
                title: 'Input Types',
                content: [
                    {
                        type: 'table',
                        headers: [
                            'field value',
                            'Required properties',
                            'Validates',
                        ],
                        rows: [
                            [
                                '"firstName" | "lastName"',
                                'firstName, lastName',
                                'Both names present and non-empty after trim',
                            ],
                            ['"email"', 'value', 'Email value is present'],
                            [
                                '"password"',
                                'password',
                                'Present, 9+ chars, uppercase, number, special char',
                            ],
                            [
                                '"passwordWithConfirm"',
                                'password, passwordConfirm',
                                'All password rules plus confirm match',
                            ],
                        ],
                    },
                ],
            },
            {
                id: 'validators-rules',
                title: 'Password Rules',
                content: [
                    {
                        type: 'rules',
                        items: [
                            'Minimum 9 characters',
                            'At least one uppercase letter (A–Z)',
                            'At least one number (0–9)',
                            'At least one special character  ( ! @ # $ % ^ & * etc. )',
                        ],
                    },
                ],
            },
            {
                id: 'validators-usage',
                title: 'Usage',
                content: [
                    { type: 'text', value: 'Signup — full validation:' },
                    {
                        type: 'code',
                        lines: [
                            "import { validate } from '@rnb/validators'",
                            '',
                            'validate({ field: "firstName", firstName, lastName })',
                            'validate({ field: "email", value: normalizedEmail })',
                            'validate({ field: "passwordWithConfirm", password, passwordConfirm })',
                        ],
                    },
                    {
                        type: 'text',
                        value: 'Login — single password, no confirm needed:',
                    },
                    {
                        type: 'code',
                        lines: [
                            'validate({ field: "email", value: normalizedEmail })',
                            'validate({ field: "password", password })',
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'utils',
        name: '@rnb/utils',
        version: '0.1.0',
        description: 'Generic utility functions',
        color: '#a855f7',
        glow: 'rgba(168,85,247,0.15)',
        border: 'rgba(168,85,247,0.4)',
        tag: 'UTILS',
        deps: [],
        exports: [
            {
                name: 'copyObj',
                description:
                    'Returns a new object containing only the specified keys — prevents mass assignment vulnerabilities',
            },
        ],
        sections: [
            {
                id: 'utils-copyobj',
                title: 'copyObj',
                content: [
                    {
                        type: 'text',
                        value: 'Used to whitelist fields from a request body before passing them to a model update. Prevents mass assignment vulnerabilities where a client sends extra fields that overwrite protected data.',
                    },
                    {
                        type: 'code',
                        lines: [
                            '// Signature',
                            'copyObj<T extends Record<string, unknown>>(',
                            '    obj: T,',
                            '    ...allowedFields: (keyof T)[]',
                            '): Partial<T>',
                        ],
                    },
                    {
                        type: 'code',
                        lines: [
                            "import { copyObj } from '@rnb/utils'",
                            '',
                            "// req.body: { firstName: 'John', role: 'admin', passwordHash: 'xyz' }",
                            'const safe = copyObj(req.body, "firstName", "lastName", "timezone")',
                            "// { firstName: 'John' }   ← role and passwordHash dropped",
                        ],
                    },
                    {
                        type: 'warning',
                        label: 'SECURITY',
                        value: 'Always use copyObj before passing req.body to a model update. Never pass req.body directly to findByIdAndUpdate.',
                    },
                    {
                        type: 'code',
                        lines: [
                            'export const updateMe = catchAsync(async (req, res, next) => {',
                            '    if (req.body.password) {',
                            "        throw new AppError('Use /update-password to change password', 400)",
                            '    }',
                            '',
                            '    const safe = copyObj(req.body, "firstName", "lastName", "nationality")',
                            '',
                            '    const identity = await IdentityModel.findByIdAndUpdate(',
                            '        req.identity._id, safe, { new: true, runValidators: true }',
                            '    )',
                            '',
                            '    res.status(200).json({ user: identity.getPublicInfo() })',
                            '})',
                        ],
                    },
                ],
            },
        ],
    },
]

const scenarios = [
    {
        id: 'scenario-signup',
        title: 'User Signup',
        tags: [
            '@rnb/validators',
            '@rnb/errors',
            '@rnb/security',
            '@rnb/middleware',
        ],
        code: [
            "import { validate } from '@rnb/validators'",
            "import { AppError } from '@rnb/errors'",
            "import { catchAsync } from '@rnb/middleware'",
            "import { formatEmail, setAuthCookie } from '@rnb/security'",
            '',
            'export const signup = catchAsync(async (req, res, next) => {',
            '    const { firstName, lastName, email, password, passwordConfirm } = req.body',
            '    const normalizedEmail = formatEmail(email)',
            '',
            '    validate({ field: "firstName", firstName, lastName })',
            '    validate({ field: "email", value: normalizedEmail })',
            '    validate({ field: "passwordWithConfirm", password, passwordConfirm })',
            '',
            '    const existing = await IdentityModel.findOne({ "contact.email": normalizedEmail })',
            '    if (existing) throw new AppError("Email already registered", 409, "email")',
            '',
            '    const identity = new IdentityModel({ ... })',
            '    identity.passwordConfirm = passwordConfirm',
            '    await identity.save()',
            '',
            '    setAuthCookie(res, identity._id.toString(), env.JWT_SECRET, env.NODE_ENV === "production")',
            '    res.status(201).json({ user: identity.getPublicInfo() })',
            '})',
        ],
    },
    {
        id: 'scenario-protect',
        title: 'Protected Route',
        tags: ['@rnb/security', '@rnb/errors', '@rnb/middleware'],
        code: [
            "import { extractToken } from '@rnb/security'",
            "import { AppError } from '@rnb/errors'",
            "import { catchAsync } from '@rnb/middleware'",
            '',
            'export const protect = catchAsync(async (req, res, next) => {',
            '    const token = extractToken(req)',
            '',
            '    if (!token) {',
            "        throw new AppError('You are not logged in', 401)",
            '    }',
            '',
            '    const decoded = jwt.verify(token, env.JWT_SECRET) as { sub: string }',
            '    const identity = await IdentityModel.findById(decoded.sub)',
            '',
            '    if (!identity) {',
            "        throw new AppError('Identity no longer exists', 401)",
            '    }',
            '',
            '    req.identity = identity',
            '    next()',
            '})',
        ],
    },
    {
        id: 'scenario-logout',
        title: 'Logout',
        tags: ['@rnb/security', '@rnb/middleware'],
        code: [
            "import { clearCookie } from '@rnb/security'",
            "import { catchAsync } from '@rnb/middleware'",
            '',
            'export const logout = catchAsync(async (req, res, next) => {',
            "    clearCookie(res, 'auth_token')",
            "    res.status(200).json({ status: 'success' })",
            '})',
        ],
    },
    {
        id: 'scenario-update',
        title: 'Safe Profile Update',
        tags: ['@rnb/utils', '@rnb/errors', '@rnb/middleware'],
        code: [
            "import { copyObj } from '@rnb/utils'",
            "import { AppError } from '@rnb/errors'",
            "import { catchAsync } from '@rnb/middleware'",
            '',
            'export const updateMe = catchAsync(async (req, res, next) => {',
            '    if (req.body.password) {',
            "        throw new AppError('Use /update-password to change your password', 400)",
            '    }',
            '',
            '    const safe = copyObj(req.body, "firstName", "lastName", "nationality")',
            '',
            '    const identity = await IdentityModel.findByIdAndUpdate(',
            '        req.identity._id, safe, { new: true, runValidators: true }',
            '    )',
            '',
            '    res.status(200).json({ user: identity.getPublicInfo() })',
            '})',
        ],
    },
]

// ─── Components ───────────────────────────────────────────────────────────────

function CodeBlock({ lines }: { lines: string[] }) {
    const [copied, setCopied] = useState(false)

    const copy = () => {
        navigator.clipboard.writeText(lines.join('\n'))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const colorize = (line: string) => {
        if (line.trim().startsWith('//'))
            return <span style={{ color: '#6b7280' }}>{line}</span>
        if (line.trim().startsWith('import')) {
            return (
                <span>
                    <span style={{ color: '#c084fc' }}>import </span>
                    <span style={{ color: '#e5e7eb' }}>
                        {line.replace(/^import\s+/, '').replace(/ from /, '')}
                    </span>
                    <span style={{ color: '#c084fc' }}> from </span>
                    <span style={{ color: '#86efac' }}>
                        {line.match(/from\s+(['"][^'"]+['"])/)?.[1] || ''}
                    </span>
                </span>
            )
        }
        return <span style={{ color: '#e5e7eb' }}>{line}</span>
    }

    return (
        <div
            style={{
                background: '#0d1117',
                border: '1px solid #21262d',
                borderRadius: '8px',
                overflow: 'hidden',
                margin: '12px 0',
                position: 'relative',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    background: '#161b22',
                    borderBottom: '1px solid #21262d',
                }}
            >
                <div style={{ display: 'flex', gap: '6px' }}>
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: '#ff5f57',
                        }}
                    />
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: '#febc2e',
                        }}
                    />
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: '#28c840',
                        }}
                    />
                </div>
                <button
                    onClick={copy}
                    style={{
                        background: 'none',
                        border: '1px solid #30363d',
                        borderRadius: '4px',
                        color: copied ? '#22c55e' : '#8b949e',
                        fontSize: '11px',
                        padding: '2px 10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                    }}
                >
                    {copied ? '✓ copied' : 'copy'}
                </button>
            </div>
            <div style={{ padding: '16px', overflowX: 'auto' }}>
                {lines.map((line, i) => (
                    <div
                        key={i}
                        style={{
                            fontFamily:
                                "'JetBrains Mono', 'Fira Code', monospace",
                            fontSize: '13px',
                            lineHeight: '1.7',
                            whiteSpace: 'pre',
                            minHeight: line === '' ? '1.7em' : undefined,
                        }}
                    >
                        <span
                            style={{
                                color: '#3d4451',
                                userSelect: 'none',
                                marginRight: '16px',
                                fontSize: '11px',
                            }}
                        >
                            {String(i + 1).padStart(2, ' ')}
                        </span>
                        {colorize(line)}
                    </div>
                ))}
            </div>
        </div>
    )
}

function InfoBox({
    label,
    value,
    type,
}: {
    label: string
    value: string
    type: 'info' | 'warning'
}) {
    const colors =
        type === 'warning'
            ? {
                  bg: 'rgba(239,68,68,0.08)',
                  border: 'rgba(239,68,68,0.3)',
                  label: '#ef4444',
                  text: '#fca5a5',
              }
            : {
                  bg: 'rgba(99,102,241,0.08)',
                  border: 'rgba(99,102,241,0.3)',
                  label: '#818cf8',
                  text: '#c7d2fe',
              }

    return (
        <div
            style={{
                display: 'flex',
                gap: '12px',
                padding: '14px 16px',
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                margin: '12px 0',
            }}
        >
            <span
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 700,
                    color: colors.label,
                    background: `${colors.border}`,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    alignSelf: 'flex-start',
                    marginTop: '1px',
                }}
            >
                {label}
            </span>
            <p
                style={{
                    margin: 0,
                    fontSize: '13px',
                    color: colors.text,
                    lineHeight: 1.6,
                }}
            >
                {value}
            </p>
        </div>
    )
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
    return (
        <div style={{ overflowX: 'auto', margin: '12px 0' }}>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px',
                }}
            >
                <thead>
                    <tr>
                        {headers.map((h, i) => (
                            <th
                                key={i}
                                style={{
                                    padding: '10px 14px',
                                    textAlign: 'left',
                                    background: '#161b22',
                                    color: '#8b949e',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    borderBottom: '1px solid #21262d',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr
                            key={i}
                            style={{ borderBottom: '1px solid #161b22' }}
                        >
                            {row.map((cell, j) => (
                                <td
                                    key={j}
                                    style={{
                                        padding: '10px 14px',
                                        color: j === 0 ? '#e2e8f0' : '#9ca3af',
                                        fontFamily:
                                            j === 0
                                                ? "'JetBrains Mono', monospace"
                                                : 'inherit',
                                        fontSize: j === 0 ? '12px' : '13px',
                                        background:
                                            i % 2 === 0
                                                ? 'transparent'
                                                : 'rgba(255,255,255,0.01)',
                                        verticalAlign: 'top',
                                    }}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function RulesList({ items }: { items: string[] }) {
    return (
        <div style={{ margin: '12px 0' }}>
            {items.map((item, i) => (
                <div
                    key={i}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        background:
                            i % 2 === 0
                                ? 'rgba(34,197,94,0.05)'
                                : 'transparent',
                        borderLeft: '2px solid rgba(34,197,94,0.3)',
                        marginBottom: '4px',
                        borderRadius: '0 4px 4px 0',
                    }}
                >
                    <span style={{ color: '#22c55e', fontSize: '14px' }}>
                        ✓
                    </span>
                    <span style={{ color: '#d1d5db', fontSize: '13px' }}>
                        {item}
                    </span>
                </div>
            ))}
        </div>
    )
}

function renderBlock(block: Block, i: number) {
    switch (block.type) {
        case 'text':
            return (
                <p
                    key={i}
                    style={{
                        color: '#9ca3af',
                        fontSize: '14px',
                        lineHeight: 1.7,
                        margin: '8px 0',
                    }}
                >
                    {block.value}
                </p>
            )
        case 'code':
            return <CodeBlock key={i} lines={block.lines} />
        case 'warning':
            return (
                <InfoBox
                    key={i}
                    label={block.label}
                    value={block.value}
                    type="warning"
                />
            )
        case 'info':
            return (
                <InfoBox
                    key={i}
                    label={block.label}
                    value={block.value}
                    type="info"
                />
            )
        case 'table':
            return (
                <DataTable key={i} headers={block.headers} rows={block.rows} />
            )
        case 'rules':
            return <RulesList key={i} items={block.items} />
    }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DocsPage() {
    const [activeId, setActiveId] = useState<string>('overview')
    const [activePkg, setActivePkg] = useState<string>('errors')
    const [activeScenario, setActiveScenario] =
        useState<string>('scenario-signup')
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    const currentPkg = packages.find((p) => p.id === activePkg)!
    const currentScenario = scenarios.find((s) => s.id === activeScenario)!

    const packageColors: Record<string, string> = {
        '@rnb/errors': '#ef4444',
        '@rnb/middleware': '#6366f1',
        '@rnb/security': '#22c55e',
        '@rnb/validators': '#f59e0b',
        '@rnb/utils': '#a855f7',
    }

    useEffect(() => {
        if (contentRef.current) contentRef.current.scrollTo(0, 0)
    }, [activeId, activePkg])

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #080c10; color: #e2e8f0; font-family: 'Syne', sans-serif; }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: #0d1117; }
                ::-webkit-scrollbar-thumb { background: #21262d; border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: #30363d; }
                .nav-item { transition: all 0.15s; }
                .nav-item:hover { background: rgba(255,255,255,0.04) !important; }
                .pkg-tab:hover { opacity: 0.9; }
                .section-link { transition: all 0.15s; }
                .section-link:hover { color: #e2e8f0 !important; padding-left: 18px !important; }
                .scenario-btn:hover { opacity: 0.8; }
            `}</style>

            <div
                style={{
                    display: 'flex',
                    height: '100vh',
                    overflow: 'hidden',
                    background: '#080c10',
                }}
            >
                {/* ── Sidebar ── */}
                <aside
                    style={{
                        width: '260px',
                        flexShrink: 0,
                        background: '#0d1117',
                        borderRight: '1px solid #21262d',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {/* Logo */}
                    <div
                        style={{
                            padding: '24px 20px 16px',
                            borderBottom: '1px solid #21262d',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    background:
                                        'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                @
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                        fontWeight: 700,
                                        fontSize: '13px',
                                        color: '#e2e8f0',
                                    }}
                                >
                                    rnb/packages
                                </div>
                                <div
                                    style={{
                                        fontSize: '10px',
                                        color: '#4b5563',
                                        marginTop: '1px',
                                    }}
                                >
                                    documentation
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '12px 0',
                        }}
                    >
                        {/* Overview */}
                        <div style={{ padding: '0 8px', marginBottom: '4px' }}>
                            <button
                                className="nav-item"
                                onClick={() => setActiveId('overview')}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    background:
                                        activeId === 'overview'
                                            ? 'rgba(99,102,241,0.15)'
                                            : 'transparent',
                                    border:
                                        activeId === 'overview'
                                            ? '1px solid rgba(99,102,241,0.3)'
                                            : '1px solid transparent',
                                    color:
                                        activeId === 'overview'
                                            ? '#818cf8'
                                            : '#6b7280',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                }}
                            >
                                Overview
                            </button>
                        </div>

                        {/* Packages */}
                        <div
                            style={{
                                padding: '12px 12px 4px',
                                fontSize: '10px',
                                fontFamily: "'JetBrains Mono', monospace",
                                color: '#374151',
                                letterSpacing: '0.08em',
                                fontWeight: 600,
                            }}
                        >
                            PACKAGES
                        </div>
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                style={{
                                    padding: '0 8px',
                                    marginBottom: '1px',
                                }}
                            >
                                <button
                                    className="nav-item"
                                    onClick={() => {
                                        setActiveId('package')
                                        setActivePkg(pkg.id)
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        background:
                                            activeId === 'package' &&
                                            activePkg === pkg.id
                                                ? `${pkg.glow}`
                                                : 'transparent',
                                        border:
                                            activeId === 'package' &&
                                            activePkg === pkg.id
                                                ? `1px solid ${pkg.border}`
                                                : '1px solid transparent',
                                        color:
                                            activeId === 'package' &&
                                            activePkg === pkg.id
                                                ? pkg.color
                                                : '#6b7280',
                                        fontSize: '12px',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span>{pkg.name}</span>
                                    <span
                                        style={{
                                            fontSize: '9px',
                                            background: `${pkg.glow}`,
                                            color: pkg.color,
                                            padding: '1px 6px',
                                            borderRadius: '3px',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {pkg.tag}
                                    </span>
                                </button>
                                {/* Sub sections */}
                                {activeId === 'package' &&
                                    activePkg === pkg.id && (
                                        <div
                                            style={{
                                                paddingLeft: '12px',
                                                marginTop: '2px',
                                            }}
                                        >
                                            {pkg.sections.map((s) => (
                                                <a
                                                    key={s.id}
                                                    href={`#${s.id}`}
                                                    className="section-link"
                                                    style={{
                                                        display: 'block',
                                                        padding: '5px 12px',
                                                        fontSize: '11px',
                                                        color: '#4b5563',
                                                        textDecoration: 'none',
                                                        transition: 'all 0.15s',
                                                        borderLeft: `1px solid #21262d`,
                                                    }}
                                                >
                                                    {s.title}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ))}

                        {/* Scenarios */}
                        <div
                            style={{
                                padding: '12px 12px 4px',
                                fontSize: '10px',
                                fontFamily: "'JetBrains Mono', monospace",
                                color: '#374151',
                                letterSpacing: '0.08em',
                                fontWeight: 600,
                                marginTop: '8px',
                            }}
                        >
                            SCENARIOS
                        </div>
                        <div style={{ padding: '0 8px' }}>
                            <button
                                className="nav-item"
                                onClick={() => setActiveId('scenarios')}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    background:
                                        activeId === 'scenarios'
                                            ? 'rgba(99,102,241,0.15)'
                                            : 'transparent',
                                    border:
                                        activeId === 'scenarios'
                                            ? '1px solid rgba(99,102,241,0.3)'
                                            : '1px solid transparent',
                                    color:
                                        activeId === 'scenarios'
                                            ? '#818cf8'
                                            : '#6b7280',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                }}
                            >
                                Real World Examples
                            </button>
                        </div>
                    </nav>

                    {/* Version footer */}
                    <div
                        style={{
                            padding: '12px 20px',
                            borderTop: '1px solid #21262d',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '10px',
                                fontFamily: "'JetBrains Mono', monospace",
                                color: '#374151',
                            }}
                        >
                            realms-and-beyond monorepo
                        </div>
                        <div
                            style={{
                                fontSize: '10px',
                                color: '#1f2937',
                                marginTop: '2px',
                            }}
                        >
                            v0.1.0 — internal
                        </div>
                    </div>
                </aside>

                {/* ── Main content ── */}
                <main
                    ref={contentRef}
                    style={{ flex: 1, overflowY: 'auto', padding: '48px 56px' }}
                >
                    {/* ─── OVERVIEW ─── */}
                    {activeId === 'overview' && (
                        <div>
                            <div style={{ marginBottom: '48px' }}>
                                <div
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                        fontSize: '11px',
                                        color: '#4b5563',
                                        marginBottom: '12px',
                                        letterSpacing: '0.1em',
                                    }}
                                >
                                    REALMS & BEYOND — SHARED PACKAGES
                                </div>
                                <h1
                                    style={{
                                        fontSize: '52px',
                                        fontWeight: 800,
                                        color: '#f1f5f9',
                                        lineHeight: 1.1,
                                        marginBottom: '20px',
                                    }}
                                >
                                    @rnb/
                                    <span style={{ color: '#6366f1' }}>
                                        packages
                                    </span>
                                </h1>
                                <p
                                    style={{
                                        fontSize: '16px',
                                        color: '#6b7280',
                                        maxWidth: '600px',
                                        lineHeight: 1.7,
                                    }}
                                >
                                    A collection of focused,
                                    responsibility-scoped shared packages for
                                    the Realms & Beyond monorepo.
                                    Security-critical logic is defined once and
                                    shared everywhere.
                                </p>
                            </div>

                            {/* Package cards */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '16px',
                                    marginBottom: '48px',
                                }}
                            >
                                {packages.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        onClick={() => {
                                            setActiveId('package')
                                            setActivePkg(pkg.id)
                                        }}
                                        style={{
                                            padding: '20px',
                                            borderRadius: '10px',
                                            background: '#0d1117',
                                            border: `1px solid ${pkg.border}`,
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: `0 0 20px ${pkg.glow}`,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontFamily:
                                                        "'JetBrains Mono', monospace",
                                                    fontSize: '13px',
                                                    color: pkg.color,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {pkg.name}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '9px',
                                                    background: pkg.glow,
                                                    color: pkg.color,
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {pkg.tag}
                                            </span>
                                        </div>
                                        <p
                                            style={{
                                                fontSize: '12px',
                                                color: '#6b7280',
                                                lineHeight: 1.5,
                                                marginBottom: '12px',
                                            }}
                                        >
                                            {pkg.description}
                                        </p>
                                        <div
                                            style={{
                                                fontSize: '10px',
                                                fontFamily:
                                                    "'JetBrains Mono', monospace",
                                                color: '#374151',
                                            }}
                                        >
                                            {pkg.exports.length} export
                                            {pkg.exports.length !== 1
                                                ? 's'
                                                : ''}{' '}
                                            · v{pkg.version}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Dependency graph */}
                            <div style={{ marginBottom: '40px' }}>
                                <h2
                                    style={{
                                        fontSize: '20px',
                                        fontWeight: 700,
                                        color: '#e2e8f0',
                                        marginBottom: '16px',
                                    }}
                                >
                                    Dependency Graph
                                </h2>
                                <p
                                    style={{
                                        fontSize: '13px',
                                        color: '#6b7280',
                                        marginBottom: '16px',
                                    }}
                                >
                                    Packages must be built in this order.
                                    @rnb/errors has no internal dependencies and
                                    always builds first.
                                </p>
                                <CodeBlock
                                    lines={[
                                        '@rnb/errors         — no internal dependencies',
                                        '     ↓',
                                        '@rnb/middleware     — depends on @rnb/errors',
                                        '@rnb/validators     — depends on @rnb/errors',
                                        '@rnb/security       — no internal dependencies',
                                        '@rnb/utils          — no internal dependencies',
                                    ]}
                                />
                            </div>

                            {/* Install */}
                            <div>
                                <h2
                                    style={{
                                        fontSize: '20px',
                                        fontWeight: 700,
                                        color: '#e2e8f0',
                                        marginBottom: '16px',
                                    }}
                                >
                                    Installation
                                </h2>
                                <CodeBlock
                                    lines={[
                                        '// package.json in your server',
                                        '"dependencies": {',
                                        '    "@rnb/errors":      "workspace:*",',
                                        '    "@rnb/middleware":  "workspace:*",',
                                        '    "@rnb/security":    "workspace:*",',
                                        '    "@rnb/validators":  "workspace:*",',
                                        '    "@rnb/utils":       "workspace:*"',
                                        '}',
                                        '',
                                        '// From repo root',
                                        'pnpm install',
                                        'pnpm run build',
                                    ]}
                                />
                            </div>
                        </div>
                    )}

                    {/* ─── PACKAGE ─── */}
                    {activeId === 'package' && (
                        <div>
                            {/* Package header */}
                            <div
                                style={{
                                    padding: '28px 32px',
                                    borderRadius: '12px',
                                    background: '#0d1117',
                                    border: `1px solid ${currentPkg.border}`,
                                    boxShadow: `0 0 40px ${currentPkg.glow}`,
                                    marginBottom: '40px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: '12px',
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                fontFamily:
                                                    "'JetBrains Mono', monospace",
                                                fontSize: '28px',
                                                fontWeight: 700,
                                                color: currentPkg.color,
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {currentPkg.name}
                                        </div>
                                        <p
                                            style={{
                                                fontSize: '14px',
                                                color: '#9ca3af',
                                                marginBottom: '16px',
                                            }}
                                        >
                                            {currentPkg.description}
                                        </p>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '8px',
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontFamily:
                                                        "'JetBrains Mono', monospace",
                                                    fontSize: '11px',
                                                    background:
                                                        'rgba(255,255,255,0.05)',
                                                    color: '#6b7280',
                                                    padding: '4px 10px',
                                                    borderRadius: '4px',
                                                }}
                                            >
                                                v{currentPkg.version}
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily:
                                                        "'JetBrains Mono', monospace",
                                                    fontSize: '11px',
                                                    background: currentPkg.glow,
                                                    color: currentPkg.color,
                                                    padding: '4px 10px',
                                                    borderRadius: '4px',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {currentPkg.tag}
                                            </span>
                                            {currentPkg.deps.length > 0 &&
                                                currentPkg.deps.map((d) => (
                                                    <span
                                                        key={d}
                                                        style={{
                                                            fontFamily:
                                                                "'JetBrains Mono', monospace",
                                                            fontSize: '11px',
                                                            background:
                                                                'rgba(255,255,255,0.03)',
                                                            color: '#4b5563',
                                                            padding: '4px 10px',
                                                            borderRadius: '4px',
                                                            border: '1px solid #21262d',
                                                        }}
                                                    >
                                                        dep: {d}
                                                    </span>
                                                ))}
                                            {currentPkg.deps.length === 0 && (
                                                <span
                                                    style={{
                                                        fontFamily:
                                                            "'JetBrains Mono', monospace",
                                                        fontSize: '11px',
                                                        color: '#374151',
                                                        padding: '4px 10px',
                                                    }}
                                                >
                                                    no internal deps
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Exports table */}
                            <div style={{ marginBottom: '40px' }}>
                                <h2
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                        color: '#e2e8f0',
                                        marginBottom: '16px',
                                    }}
                                >
                                    Exports
                                </h2>
                                <div
                                    style={{
                                        background: '#0d1117',
                                        border: '1px solid #21262d',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {currentPkg.exports.map((exp, i) => (
                                        <div
                                            key={exp.name}
                                            style={{
                                                display: 'flex',
                                                gap: '20px',
                                                padding: '14px 20px',
                                                borderBottom:
                                                    i <
                                                    currentPkg.exports.length -
                                                        1
                                                        ? '1px solid #161b22'
                                                        : 'none',
                                                alignItems: 'flex-start',
                                                background:
                                                    i % 2 === 0
                                                        ? 'transparent'
                                                        : 'rgba(255,255,255,0.01)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontFamily:
                                                        "'JetBrains Mono', monospace",
                                                    fontSize: '13px',
                                                    color: currentPkg.color,
                                                    minWidth: '160px',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {exp.name}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '13px',
                                                    color: '#6b7280',
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {exp.description}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sections */}
                            {currentPkg.sections.map((section) => (
                                <div
                                    key={section.id}
                                    id={section.id}
                                    style={{ marginBottom: '40px' }}
                                >
                                    <h2
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            color: '#e2e8f0',
                                            marginBottom: '16px',
                                            paddingBottom: '10px',
                                            borderBottom: `1px solid #21262d`,
                                        }}
                                    >
                                        {section.title}
                                    </h2>
                                    {section.content.map((block, i) =>
                                        renderBlock(block, i)
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ─── SCENARIOS ─── */}
                    {activeId === 'scenarios' && (
                        <div>
                            <div style={{ marginBottom: '40px' }}>
                                <div
                                    style={{
                                        fontFamily:
                                            "'JetBrains Mono', monospace",
                                        fontSize: '11px',
                                        color: '#4b5563',
                                        marginBottom: '12px',
                                        letterSpacing: '0.1em',
                                    }}
                                >
                                    END TO END
                                </div>
                                <h1
                                    style={{
                                        fontSize: '40px',
                                        fontWeight: 800,
                                        color: '#f1f5f9',
                                        marginBottom: '12px',
                                    }}
                                >
                                    Real World Scenarios
                                </h1>
                                <p
                                    style={{
                                        fontSize: '14px',
                                        color: '#6b7280',
                                        lineHeight: 1.7,
                                    }}
                                >
                                    Complete, production-ready patterns showing
                                    how the packages work together.
                                </p>
                            </div>

                            {/* Scenario tabs */}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '8px',
                                    marginBottom: '32px',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {scenarios.map((s) => (
                                    <button
                                        key={s.id}
                                        className="scenario-btn"
                                        onClick={() => setActiveScenario(s.id)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontFamily: 'inherit',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            background:
                                                activeScenario === s.id
                                                    ? '#6366f1'
                                                    : '#0d1117',
                                            color:
                                                activeScenario === s.id
                                                    ? '#fff'
                                                    : '#6b7280',
                                            border:
                                                activeScenario === s.id
                                                    ? '1px solid #6366f1'
                                                    : '1px solid #21262d',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        {s.title}
                                    </button>
                                ))}
                            </div>

                            {/* Active scenario */}
                            <div
                                style={{
                                    background: '#0d1117',
                                    border: '1px solid #21262d',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '20px 24px',
                                        borderBottom: '1px solid #21262d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: '12px',
                                    }}
                                >
                                    <h2
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            color: '#e2e8f0',
                                        }}
                                    >
                                        {currentScenario.title}
                                    </h2>
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '6px',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        {currentScenario.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                style={{
                                                    fontFamily:
                                                        "'JetBrains Mono', monospace",
                                                    fontSize: '10px',
                                                    padding: '3px 8px',
                                                    borderRadius: '4px',
                                                    background: `${packageColors[tag]}20`,
                                                    color: packageColors[tag],
                                                    border: `1px solid ${packageColors[tag]}40`,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ padding: '0' }}>
                                    <CodeBlock lines={currentScenario.code} />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    )
}
