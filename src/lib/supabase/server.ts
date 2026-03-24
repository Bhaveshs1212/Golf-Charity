import { cookies } from "next/headers";
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

export function getServerSupabase() {
  const { supabaseUrl, supabaseAnonKey } = env;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async getAll() {
        const store = await cookies();
        return store.getAll();
      },
      async setAll(updatedCookies: CookieToSet[]) {
        // In Server Components, setting cookies throws. Ignore here; actions/handlers set cookies.
        try {
          const store = await cookies();
          updatedCookies.forEach(({ name, value, options }) => {
            store.set(name, value, options);
          });
        } catch {
          // no-op
        }
      },
    },
  });
}
