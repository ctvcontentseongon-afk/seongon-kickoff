-- Chạy SQL này trong Supabase SQL Editor
-- https://supabase.com → Project → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS project_history (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT        NOT NULL,
  website     TEXT,
  industry    TEXT,
  project_title TEXT,
  slides_count  INTEGER   DEFAULT 13,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index để query nhanh
CREATE INDEX IF NOT EXISTS idx_project_history_created
  ON project_history (created_at DESC);

-- Row Level Security (bảo mật: chỉ service role mới write được)
ALTER TABLE project_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
  ON project_history FOR SELECT USING (true);

CREATE POLICY "Allow service insert"
  ON project_history FOR INSERT
  WITH CHECK (true);
