import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Supabase URL atau Key tidak ditemukan! ` +
      `URL: ${supabaseUrl ? "✓" : "✗"}, KEY: ${supabaseKey ? "✓" : "✗"}`
    );
  }

  // tes

  return createBrowserClient(supabaseUrl, supabaseKey);
};