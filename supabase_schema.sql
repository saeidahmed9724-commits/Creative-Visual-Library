-- Supabase SQL Schema for Brands Table
-- You can run this directly in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Create the 'brands' table with the required columns: id, name, image_url, created_at
CREATE TABLE IF NOT EXISTS public.brands (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies allowing full read & write for anon clients
DROP POLICY IF EXISTS "Allow public read access" ON public.brands;
CREATE POLICY "Allow public read access" ON public.brands
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON public.brands;
CREATE POLICY "Allow public insert access" ON public.brands
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access" ON public.brands;
CREATE POLICY "Allow public update access" ON public.brands
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access" ON public.brands;
CREATE POLICY "Allow public delete access" ON public.brands
  FOR DELETE USING (true);

-- 4. Storage Bucket Policies for 'brand-images'
-- Ensures the 'brand-images' storage bucket exists, is Public, and allows public image uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-images', 'brand-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to brand-images
DROP POLICY IF EXISTS "Allow public read brand-images" ON storage.objects;
CREATE POLICY "Allow public read brand-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'brand-images');

-- Allow public upload / insert into brand-images
DROP POLICY IF EXISTS "Allow public upload brand-images" ON storage.objects;
CREATE POLICY "Allow public upload brand-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'brand-images');

-- Allow public update in brand-images
DROP POLICY IF EXISTS "Allow public update brand-images" ON storage.objects;
CREATE POLICY "Allow public update brand-images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'brand-images');

-- Allow public delete in brand-images
DROP POLICY IF EXISTS "Allow public delete brand-images" ON storage.objects;
CREATE POLICY "Allow public delete brand-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'brand-images');

