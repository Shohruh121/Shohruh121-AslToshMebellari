// Supabase client — NOT used directly in client code
// All Supabase requests go through server-side proxy (/sb/* endpoints in vite.config.js)
// This ensures API keys are NEVER exposed in the browser
//
// If you need direct Supabase access in the future (e.g. for Supabase Auth),
// uncomment the lines below and ensure .env has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
//
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// );
