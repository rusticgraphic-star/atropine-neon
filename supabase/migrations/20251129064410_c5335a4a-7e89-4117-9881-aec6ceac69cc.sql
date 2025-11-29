-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  tv_username TEXT NOT NULL,
  notes TEXT,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  tier_label TEXT,
  price TEXT NOT NULL,
  payment_screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending_verification',
  activation_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update orders
CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can insert orders (checkout flow)
CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
TO anon
WITH CHECK (true);

-- Create site_config table for QR and settings
CREATE TABLE public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Everyone can read config
CREATE POLICY "Everyone can read config"
ON public.site_config FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can update config
CREATE POLICY "Admins can update config"
ON public.site_config FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert config
CREATE POLICY "Admins can insert config"
ON public.site_config FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default UPI ID
INSERT INTO public.site_config (key, value) VALUES ('upi_id', 'atropine@ybl');

-- Create storage bucket for QR codes and payment screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-assets', 'payment-assets', true);

-- Storage policies for payment-assets bucket
CREATE POLICY "Public can view payment assets"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'payment-assets');

-- Admins can upload QR codes
CREATE POLICY "Admins can upload payment assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-assets' AND
  public.has_role(auth.uid(), 'admin')
);

-- Anyone can upload payment screenshots (during checkout)
CREATE POLICY "Anyone can upload screenshots"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'payment-assets' AND
  (storage.foldername(name))[1] = 'screenshots'
);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_config_updated_at
BEFORE UPDATE ON public.site_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();