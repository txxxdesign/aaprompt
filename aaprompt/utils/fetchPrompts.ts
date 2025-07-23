import { supabase } from "../lib/supabase";

export async function fetchPrompts() {
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false }); // 최신순

  if (error) {
    console.error("Error fetching prompts:", error);
    return [];
  }

  return data || [];
}