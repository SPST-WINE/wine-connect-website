// lib/supabase/admin.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Creiamo il client solo quando serve (e non all'import),
 * così la build non esplode se la variabile manca su Vercel
 * prima di averla configurata.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!serviceKey) {
    // L’errore avverrà ora solo a runtime della route, non in build.
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
