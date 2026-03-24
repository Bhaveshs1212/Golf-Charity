import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

type CookieToSet = {
  name: string;
  value: string;
  options?: {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "lax" | "strict" | "none";
  };
};

const protectedPrefixes = [
  "/dashboard",
  "/scores",
  "/draw",
  "/charity",
  "/winnings",
  "/subscription",
  "/settings",
  "/admin",
];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const requiresAuth = protectedPrefixes.some((prefix) =>
    url.pathname.startsWith(prefix),
  );

  if (!requiresAuth || !env.supabaseUrl || !env.supabaseAnonKey) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/scores/:path*",
    "/draw/:path*",
    "/charity/:path*",
    "/winnings/:path*",
    "/subscription/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
