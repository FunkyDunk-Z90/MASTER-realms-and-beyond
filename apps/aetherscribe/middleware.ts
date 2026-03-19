import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Aetherscribe SSO Middleware ───────────────────────────────────────────────
// Protects /hub/* and /onboarding routes.
// If the auth_token cookie is absent, redirects through the SSO flow
// (GET /api/auth/initiate) which stores the destination and kicks off OAuth.
//
// Note: this only checks for cookie *presence*, not validity.
// The AuthProvider's GET /api/v1/user/me call handles token validation —
// if the token is expired/invalid, AuthProvider sets user=null and AuthGuard
// redirects back to the landing page.

export function middleware(request: NextRequest): NextResponse {
    const authToken = request.cookies.get('auth_token')?.value

    if (!authToken) {
        const initiateUrl = new URL('/api/auth/initiate', request.url)
        initiateUrl.searchParams.set('returnTo', request.nextUrl.pathname)
        return NextResponse.redirect(initiateUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/hub/:path*',
        '/onboarding',
        '/my-account/:path*',
        '/settings/:path*',
    ],
}
