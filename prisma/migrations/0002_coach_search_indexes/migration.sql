-- Improve coach lookup performance for live search and admin filtering.
CREATE INDEX IF NOT EXISTS "asc_coaches_name_idx" ON "asc_coaches"("name");
CREATE INDEX IF NOT EXISTS "asc_coaches_title_role_idx" ON "asc_coaches"("title_role");
CREATE INDEX IF NOT EXISTS "asc_coaches_cluster_idx" ON "asc_coaches"("cluster");
