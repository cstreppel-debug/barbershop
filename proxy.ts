import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write updated cookies onto the request so downstream reads see them
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Recreate the response with the mutated request, then stamp cookies
          // onto the response so the browser receives them
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshes the session if expired — MUST use getUser(), never getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    const redirectResponse = NextResponse.redirect(loginUrl);
    // Carry over any auth cookies that were just refreshed
    supabaseResponse.cookies
      .getAll()
      .forEach((cookie) =>
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      );
    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Alle routes behalve Next.js internals en statische bestanden.
     * Supabase heeft de proxy nodig op elke route om sessies te refreshen.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
