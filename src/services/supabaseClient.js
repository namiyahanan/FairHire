import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  'https://fkydcodwcpvmjeqjwgcw.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_KiECnzQf_UjzxFGlMCXKvg_rEa7FJNs';


if (!supabaseUrl) {
  throw new Error(
    "[FairHire] Missing VITE_SUPABASE_URL environment variable. Check your .env file."
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "[FairHire] Missing VITE_SUPABASE_ANON_KEY environment variable. Check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
