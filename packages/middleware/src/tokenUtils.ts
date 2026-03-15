import crypto from 'node:crypto'

// ─── Token Utilities ──────────────────────────────────────────────────────────

/** Hash a raw bearer token with SHA-256 before storing.
 *  The DB never holds the real token — only its hash. */
export const hashToken = (raw: string): string =>
    crypto.createHash('sha256').update(raw).digest('hex')

/** Generate a cryptographically secure 64-char hex token. */
export const generateSecureToken = (): string =>
    crypto.randomBytes(32).toString('hex')

/** Constant-time comparison of two SHA-256 hex strings.
 *  Prevents timing attacks when validating tokens. */
export const safeCompareTokens = (a: string, b: string): boolean => {
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

/** ISO datetime string `hours` from now. */
export const hoursFromNow = (hours: number): string =>
    new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()

/** ISO datetime string `days` from now. */
export const daysFromNow = (days: number): string =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
