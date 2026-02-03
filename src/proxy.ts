import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/payslip(.*)',
    '/company(.*)',
    '/employees(.*)',
    '/onboarding(.*)',
])

// Define public routes (no auth required)
const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/salary(.*)',
    '/calculators(.*)',
    '/blog(.*)',
    '/about(.*)',
    '/contact(.*)',
    '/privacy(.*)',
    '/terms(.*)',
    '/pricing(.*)',
    '/view(.*)',
    '/v/(.*)',
    '/payslip/verify(.*)',
    '/api/salary(.*)',
    '/api/og(.*)',
    '/api/stripe/webhook(.*)',
    '/api/employee(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    // Skip protection for public routes (like /v/* and /payslip/verify/*)
    if (isPublicRoute(req)) {
        return
    }

    // If it's a protected route and user is not signed in, redirect to sign-in
    if (isProtectedRoute(req)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
