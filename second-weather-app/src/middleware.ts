export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/favorites/:path*',
    '/api/favorites/:path*',
  ],
}