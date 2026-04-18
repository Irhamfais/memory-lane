-- 1. Menonaktifkan (Disable) RLS sementara di tabel memories untuk testing/anon key
ALTER TABLE memories DISABLE ROW LEVEL SECURITY;

-- 2. Menambahkan kolom is_delivered untuk kebutuhan 'Story Queue' di Dashboard
ALTER TABLE memories ADD COLUMN IF NOT EXISTS is_delivered BOOLEAN DEFAULT FALSE;

-- 3. Membuat Storage Bucket 'memory-images' secara publik
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memory-images', 'memory-images', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Membuat Policy (Kebijakan) Supabase Storage agar semua orang bisa mengunggah dan membaca gambar
-- (Karena saat ini RLS dinonaktifkan dan kita melonggarkan anon key bypass)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'memory-images');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'memory-images');
