export default function middleware(req) {
  console.log("Middleware running for:", req.url);
  return auth(req);
}

export { auth as middleware } from "@/auth"

export const config = {
  matcher: [],
}