import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protect /account and any sub-paths.
// The actual auth check (token validity) is done server-side in the page component.
// Middleware only checks for the cookie's existence for a fast redirect.

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth_token')?.value

    if (!authToken) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('returnTo', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/account/:path*'],
}
