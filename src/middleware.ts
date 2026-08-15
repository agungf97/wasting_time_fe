import { NextRequest, NextResponse } from "next/server";

const GUEST_ONLY_PATHS = ["/login", "/register", "/reset-password"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isGuestOnlyPath = GUEST_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (token && isGuestOnlyPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login/:path*", "/register/:path*", "/reset-password/:path*", "/verify-email/:path*"],
};