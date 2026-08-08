import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // Redirect to dashboard if the user is already authenticated/
    // signed-in and trying to access sign-in, sign-up, verify, or home page
    if (token && (url.pathname === "/sign-in" || url.pathname === "/sign-up" || url.pathname.startsWith("/verify") )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!token && ( url.pathname === "/dashboard" || url.pathname.startsWith("/u/") )) {
        const signInUrl = new URL("/sign-in", request.url);

        signInUrl.searchParams.set( 'callbackUrl', `${url.pathname}` );

        return NextResponse.redirect(signInUrl);
    }
    else if (!token && url.pathname.startsWith("/verify")) {
        const referer = request.headers.get("referer");

        if (referer) {
            const refererUrl = new URL(referer);
            
            if (refererUrl.pathname !== "/sign-up") {
                return NextResponse.redirect(new URL("/sign-in", request.url));
            }
            else return NextResponse.next();
        }

        // if no referrer:
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }


    return NextResponse.next();
}