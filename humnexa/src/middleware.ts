import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_ROUTES = [
  "/chat",
  "/settings",
  "/projects",
  "/apps",
  "/files",
  "/memory",
  "/prompts",
  "/notifications",
  "/admin",
];

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/pricing",
  "/about",
  "/contact",
  "/blog",
  "/privacy",
  "/terms",
  "/shared",
  "/careers",
  "/docs",
];

const AUTH_ROUTES = ["/login", "/signup"];

const isRouteMatch = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const { response, session } = await updateSession(request);

  if (isRouteMatch(pathname, PROTECTED_ROUTES) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isRouteMatch(pathname, AUTH_ROUTES) && session) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  if (isRouteMatch(pathname, PUBLIC_ROUTES)) {
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
