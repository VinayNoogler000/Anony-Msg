import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const token = await getToken({req: request});
    const url = request.nextUrl;

    // Redirect to dashboard if the user is already authenticated/
    // signed-in and trying to access sign-in, sign-up, verify, or home page
    if (token && (
        url.pathname === '/' ||
        url.pathname.startsWith("/sign-in") || 
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/verify")
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/sign-in",
        "/sign-up",
        "/dashboard/:path*",
        "/verify/:path*"
    ],
}