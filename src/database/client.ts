import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseKey = Deno.env.get("SUPABASE_KEY")
const supabaseUrl = Deno.env.get("SUPABASE_URL")

if (!supabaseKey || !supabaseUrl) {
  throw new Error("Supabase credentials not found")
}

export const supabaseClient = createClient(supabaseKey, supabaseUrl)
