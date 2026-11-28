-- =======================================================
-- FIX SUPABASE STORAGE PERMISSIONS & POLICIES (PAYMENT-ASSETS)
-- Run this in Supabase SQL Editor if you get:
-- "new row violates row-level security policy"
-- =======================================================

-- 1. Ensure the payment-assets bucket exists and is marked public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('payment-assets', 'payment-assets', true, 52428800, null)
ON CONFLICT (id) DO UPDATE 
SET public = true, file_size_limit = 52428800;

-- 2. Clean up previous policies on storage.objects for payment-assets
DROP POLICY IF EXISTS "Public can view payment assets" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can manage payment assets" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to payment-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to payment-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from payment-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to payment-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from payment-assets" ON storage.objects;

-- 3. Allow EVERYONE (anon and authenticated) to SELECT (view/download) images
CREATE POLICY "Allow public read from payment-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-assets');

-- 4. Allow EVERYONE (anon and authenticated) to INSERT (upload) thumbnails & screenshots
CREATE POLICY "Allow public uploads to payment-assets"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-assets');

-- 5. Allow updates to existing files in bucket
CREATE POLICY "Allow public updates to payment-assets"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'payment-assets')
WITH CHECK (bucket_id = 'payment-assets');

-- 6. Allow deletes if needed
CREATE POLICY "Allow public deletes from payment-assets"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'payment-assets');

-- 7. Also make sure site_config table allows update from anon/authenticated
DROP POLICY IF EXISTS "Allow all for site_config" ON public.site_config;
CREATE POLICY "Allow all for site_config" ON public.site_config
FOR ALL TO public
USING (true)
WITH CHECK (true);
