import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export interface ProjectRecord {
  id?: string;
  client_name: string;
  website: string;
  industry: string;
  project_title: string;
  slides_count: number;
  created_at?: string;
}

export async function saveProjectHistory(record: ProjectRecord): Promise<void> {
  const db = getSupabase();
  if (!db) return; // DB không bắt buộc — app vẫn chạy khi chưa cấu hình
  await db.from("project_history").insert(record);
}

export async function getProjectHistory(limit = 10): Promise<ProjectRecord[]> {
  const db = getSupabase();
  if (!db) return [];
  const { data } = await db
    .from("project_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
}
