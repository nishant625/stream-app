import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',  // Add the home page as a public route
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/webhooks/(.*)' ,
  '/api/uploadthing',
  '/:username' // Your webhook route
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Exclude Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Include API routes
    '/api/(.*)',
    // Include trpc routes
    '/trpc/(.*)',
    // Include the root path
    '/'
  ],
};