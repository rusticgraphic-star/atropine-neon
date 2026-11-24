-- ====================================================================
-- ATROPINE MASTER BACKEND SETUP (SUPABASE SQL SCRIPT)
-- Run this in Supabase SQL Editor to set up the entire backend database
-- ====================================================================

-- 1. Create enum for user roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

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

-- RLS policies for user_roles
DO $$ BEGIN
  CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('free', 'paid')),
  price TEXT,
  price_range TEXT,
  pricing_tiers JSONB,
  description TEXT NOT NULL,
  long_description TEXT,
  thumbnail TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  key_features JSONB,
  specs JSONB NOT NULL DEFAULT '{"markets": "All Markets", "timeframes": "All Timeframes", "alerts": "Available"}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 4. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
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

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 5. Create site_config table (QR and Settings)
CREATE TABLE IF NOT EXISTS public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Everyone can read config" ON public.site_config FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update config" ON public.site_config FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can insert config" ON public.site_config FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Default UPI ID
INSERT INTO public.site_config (key, value)
VALUES ('upi_id', '8668657835@ybl')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 6. Storage Bucket for Payment Screenshots & Media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-assets', 'payment-assets', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "Public can view payment assets" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'payment-assets');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can upload payment assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'payment-assets' AND public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can upload screenshots" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'payment-assets' AND (storage.foldername(name))[1] = 'screenshots');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 7. Seed Initial 8 Indicators
INSERT INTO public.products (name, slug, type, description, thumbnail, features, specs, display_order, price, price_range, pricing_tiers)
VALUES
('4 Moving Average', '4-moving-average', 'free', 'Four customizable moving averages for trend analysis and confirmation',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/4ma-3-e1653501302698.png',
 ARRAY['4 customizable moving averages', 'Multiple MA types (SMA, EMA, WMA)', 'Color-coded trend identification', 'Real-time chart overlay', 'Zero lag indicator', 'Works on all timeframes'],
 '{"markets": "All Markets (Stocks, Futures, Forex, Crypto)", "timeframes": "All Timeframes", "alerts": "MA Crossover Alerts"}'::jsonb,
 1, 'Free', NULL, NULL),

('Average Range Indicator', 'average-range-indicator', 'free', 'Measure price volatility and average candle range for better position sizing',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/TVSMOTOR_2022-04-15_14-37-38-e1653501128906.png',
 ARRAY['Calculate average candle range', 'Volatility measurement', 'Position sizing helper', 'Multi-timeframe support', 'Custom period settings', 'Percentage & points display'],
 '{"markets": "All Markets", "timeframes": "All Timeframes", "alerts": "Volatility Expansion Alerts"}'::jsonb,
 2, 'Free', NULL, NULL),

('GAP Candle Indicator', 'gap-candle-indicator', 'free', 'Automatically detect and mark price gaps for trading opportunities',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/BANKNIFTY1_2022-04-15_15-47-34-e1653500707156.png',
 ARRAY['Auto gap detection', 'Gap fill tracking', 'Visual gap zones', 'Bullish & bearish gaps', 'Historical gap analysis', 'Alert on gap formation'],
 '{"markets": "Stocks, Index Futures", "timeframes": "Daily, Weekly", "alerts": "Gap Formation & Fill Alerts"}'::jsonb,
 3, 'Free', NULL, NULL),

('Market Profile Indicator', 'market-profile-indicator', 'paid', 'Professional Market Profile with TPO, volume profile and value areas',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/04/BANKNIFTY1_2022-04-15_11-13-00-2-e1653502124325.png',
 ARRAY['TPO & Volume Profile', 'Value Area (VA) calculation', 'Point of Control (POC)', 'Initial Balance detection', 'Session analysis tools', 'Multiple profile types'],
 '{"markets": "All Markets", "timeframes": "Intraday & Daily", "alerts": "VA Break & POC Touch Alerts"}'::jsonb,
 4, '₹699', '₹699 – ₹39,999', '[{"id": "30d", "label": "30 Days Subscription", "price": "₹699", "duration": "30 days"}, {"id": "1y", "label": "1 Year Subscription", "price": "₹2,199", "duration": "1 year"}, {"id": "3y", "label": "3 Year Subscription", "price": "₹4,999", "duration": "3 years"}, {"id": "5y", "label": "5 Year Subscription", "price": "₹9,999", "duration": "5 years"}, {"id": "lifetime", "label": "Lifetime Subscription", "price": "₹39,999", "duration": "Lifetime"}]'::jsonb),

('Virgin & Narrow CPR with D/W/M CPR', 'virgin-cpr-dwm', 'paid', 'Central Pivot Range with virgin & narrow CPR detection across timeframes',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/Screenshot-202-3-e1657633940625.png',
 ARRAY['Virgin CPR identification', 'Narrow CPR detection', 'Daily/Weekly/Monthly CPR', 'Support & resistance levels', 'Trending day signals', 'Reversal zone alerts'],
 '{"markets": "All Markets", "timeframes": "All Timeframes", "alerts": "CPR Break & Virgin CPR Alerts"}'::jsonb,
 5, '₹699', '₹699 – ₹49,999', '[{"id": "30d", "label": "30 Days Subscription", "price": "₹699", "duration": "30 days"}, {"id": "1y", "label": "1 Year Subscription", "price": "₹2,999", "duration": "1 year"}, {"id": "3y", "label": "3 Year Subscription", "price": "₹9,999", "duration": "3 years"}, {"id": "5y", "label": "5 Year Subscription", "price": "₹19,999", "duration": "5 years"}, {"id": "lifetime", "label": "Lifetime Subscription", "price": "₹49,999", "duration": "Lifetime"}]'::jsonb),

('Virgin CPR', 'virgin-cpr', 'paid', 'Identify untested Central Pivot Range zones for high-probability trades',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/07/Screenshot-201-e1657647302449.png',
 ARRAY['Virgin CPR detection', 'Auto support/resistance', 'Breakout signals', 'Multi-day analysis', 'Backtesting capability', 'Clear visual markers'],
 '{"markets": "All Markets", "timeframes": "Daily & Intraday", "alerts": "Virgin CPR Test Alerts"}'::jsonb,
 6, '₹499', '₹499 – ₹44,999', '[{"id": "30d", "label": "30 Days Subscription", "price": "₹499", "duration": "30 days"}, {"id": "1y", "label": "1 Year Subscription", "price": "₹2,499", "duration": "1 year"}, {"id": "3y", "label": "3 Year Subscription", "price": "₹8,999", "duration": "3 years"}, {"id": "5y", "label": "5 Year Subscription", "price": "₹17,999", "duration": "5 years"}, {"id": "lifetime", "label": "Lifetime Subscription", "price": "₹44,999", "duration": "Lifetime"}]'::jsonb),

('VSA with Smart Volume', 'vsa-smart-volume', 'paid', 'Volume Spread Analysis with smart money detection and volume anomalies',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/04/BANKNIFTY1_2022-04-15_10-34-13-3-e1653501385447.png',
 ARRAY['Smart money tracking', 'Volume spread analysis', 'Effort vs result detection', 'Accumulation/distribution zones', 'No demand & supply bars', 'Institutional activity alerts'],
 '{"markets": "All Markets", "timeframes": "All Timeframes", "alerts": "Smart Money & Volume Anomaly Alerts"}'::jsonb,
 7, '₹699', '₹699 – ₹59,999', '[{"id": "30d", "label": "30 Days Subscription", "price": "₹699", "duration": "30 days"}, {"id": "1y", "label": "1 Year Subscription", "price": "₹3,999", "duration": "1 year"}, {"id": "3y", "label": "3 Year Subscription", "price": "₹14,999", "duration": "3 years"}, {"id": "5y", "label": "5 Year Subscription", "price": "₹29,999", "duration": "5 years"}, {"id": "lifetime", "label": "Lifetime Subscription", "price": "₹59,999", "duration": "Lifetime"}]'::jsonb),

('Auto Demand & Supply Strategy Indicator', 'demand-supply-zone', 'paid', 'Automated supply and demand zone detection with Smart Money Concepts',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/04/ACC_2022-04-11_15-14-25_df3ea-1-e1653499999813.png',
 ARRAY['Auto S/D zone detection', 'Smart Money Concepts (SMC)', 'Order block identification', 'Fair value gaps', 'Imbalance detection', 'Entry/exit signals'],
 '{"markets": "All Markets", "timeframes": "All Timeframes", "alerts": "Zone Touch & Break Alerts"}'::jsonb,
 8, '₹699', '₹699 – ₹59,999', '[{"id": "30d", "label": "30 Days Subscription", "price": "₹699", "duration": "30 days"}, {"id": "1y", "label": "1 Year Subscription", "price": "₹3,999", "duration": "1 year"}, {"id": "3y", "label": "3 Year Subscription", "price": "₹14,999", "duration": "3 years"}, {"id": "5y", "label": "5 Year Subscription", "price": "₹29,999", "duration": "5 years"}, {"id": "lifetime", "label": "Lifetime Subscription", "price": "₹59,999", "duration": "Lifetime"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  price_range = EXCLUDED.price_range,
  pricing_tiers = EXCLUDED.pricing_tiers;
