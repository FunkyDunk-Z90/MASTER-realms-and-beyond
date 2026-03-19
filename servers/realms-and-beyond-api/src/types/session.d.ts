// export {} makes this a module so the declare module below augments
// the existing express-session types rather than replacing them.
export {}

declare module 'express-session' {
    interface SessionData {
        // The user's R&B identity — set once on first login, persists for 30 days
        userId?: string

        // Auth intent stored during the OAuth flow (cleared after code is issued)
        authIntent?: {
            client_id: string
            redirect_uri: string
            state: string
            code_challenge: string  // SHA256(code_verifier) — PKCE
            scopes: string[]
        }
    }
}
