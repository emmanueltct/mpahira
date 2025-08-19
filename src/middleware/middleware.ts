import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public pages accessible by everyone (guest + buyer)
  const publicRoutes = ["/", "/login", "/register"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Read user from cookie
  const userCookie = req.cookies.get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based protection
  if (pathname.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/seller") && user.role !== "seller") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/buyer") && user.role !== "buyer") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
