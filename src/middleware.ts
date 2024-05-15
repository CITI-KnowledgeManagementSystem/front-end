import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";



const isProtectedRoute = createRouteMatcher([
    '/dashboard/(.*)', '/prompt(.*)'
])

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        auth().protect();
    }
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};