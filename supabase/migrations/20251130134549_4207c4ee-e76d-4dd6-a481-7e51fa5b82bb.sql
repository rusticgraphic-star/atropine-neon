-- Create products table with full media and content support
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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
  features TEXT[] DEFAULT '{}',
  key_features JSONB DEFAULT '[]'::jsonb,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Admin full access for products
CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for slug lookups
CREATE INDEX idx_products_slug ON public.products(slug);

-- Create index for display order
CREATE INDEX idx_products_display_order ON public.products(display_order);

-- Insert existing products data
INSERT INTO public.products (name, slug, type, description, thumbnail, features, specs, display_order) VALUES
('4 Moving Average', '4-moving-average', 'free', 'Four customizable moving averages for trend analysis and confirmation', 
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/4ma-3-e1653501302698.png',
 ARRAY['4 customizable moving averages', 'Multiple MA types (SMA, EMA, WMA)', 'Color-coded trend identification', 'Real-time chart overlay', 'Zero lag indicator', 'Works on all timeframes'],
 '{"markets": "All Markets (Stocks, Futures, Forex, Crypto)", "timeframes": "All Timeframes", "alerts": "MA Crossover Alerts"}'::jsonb,
 1),

('Average Range Indicator', 'average-range-indicator', 'free', 'Measure price volatility and average candle range for better position sizing',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/TVSMOTOR_2022-04-15_14-37-38-e1653501128906.png',
 ARRAY['Calculate average candle range', 'Volatility measurement', 'Position sizing helper', 'Multi-timeframe support', 'Custom period settings', 'Percentage & points display'],
 '{"markets": "All Markets", "timeframes": "All Timeframes", "alerts": "Volatility Expansion Alerts"}'::jsonb,
 2),

('GAP Candle Indicator', 'gap-candle-indicator', 'free', 'Automatically detect and mark price gaps for trading opportunities',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/BANKNIFTY1_2022-04-15_15-47-34-e1653500707156.png',
 ARRAY['Auto gap detection', 'Gap fill tracking', 'Visual gap zones', 'Bullish & bearish gaps', 'Historical gap analysis', 'Alert on gap formation'],
 '{"markets": "Stocks, Index Futures", "timeframes": "Daily, Weekly", "alerts": "Gap Formation & Fill Alerts"}'::jsonb,
 3),

('Market Profile Indicator', 'market-profile-indicator', 'paid', 'Professional Market Profile with TPO, volume profile and value areas',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/04/BANKNIFTY1_2022-04-15_11-13-00-2-e1653502124325.png',
 ARRAY['TPO & Volume Profile', 'Value Area (VA) calculation', 'Point of Control (POC)', 'Initial Balance detection', 'Session analysis tools', 'Multiple profile types'],
 '{"markets": "All Markets", "timeframes": "Intraday & Daily", "alerts": "VA Break & POC Touch Alerts"}'::jsonb,
 4),

('Virgin & Narrow CPR with D/W/M CPR', 'virgin-cpr-dwm', 'paid', 'Central Pivot Range with virgin & narrow CPR detection across timeframes',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/05/Screenshot-202-3-e1657633940625.png',
 ARRAY['Virgin CPR identification', 'Narrow CPR detection', 'Daily/Weekly/Monthly CPR', 'Support & resistance levels', 'Trending day signals', 'Reversal zone alerts'],
 '{"markets": "All Markets", "timeframes": "All Timeframes", "alerts": "CPR Break & Virgin CPR Alerts"}'::jsonb,
 5),

('Virgin CPR', 'virgin-cpr', 'paid', 'Identify untested Central Pivot Range zones for high-probability trades',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/07/Screenshot-201-e1657647302449.png',
 ARRAY['Virgin CPR detection', 'Auto support/resistance', 'Breakout signals', 'Multi-day analysis', 'Backtesting capability', 'Clear visual markers'],
 '{"markets": "All Markets", "timeframes": "Daily & Intraday", "alerts": "Virgin CPR Test Alerts"}'::jsonb,
 6),

('VSA with Smart Volume', 'vsa-smart-volume', 'paid', 'Volume Spread Analysis with smart money detection and volume anomalies',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/04/BANKNIFTY1_2022-04-15_10-34-13-3-e1653501385447.png',
 ARRAY['Smart money tracking', 'Volume spread analysis', 'Effort vs result detection', 'Accumulation/distribution zones', 'No demand & supply bars', 'Institutional activity alerts'],
 '{"markets": "All Markets", "timeframes": "All Timeframes", "alerts": "Smart Money & Volume Anomaly Alerts"}'::jsonb,
 7),

('Auto Demand & Supply Strategy Indicator', 'demand-supply-zone', 'paid', 'Automated supply and demand zone detection with Smart Money Concepts',
 'https://i0.wp.com/atropine.in/wp-content/uploads/2022/04/ACC_2022-04-11_15-14-25_df3ea-1-e1653499999813.png',
 ARRAY['Auto S/D zone detection', 'Smart Money Concepts (SMC)', 'Order block identification', 'Fair value gaps', 'Imbalance detection', 'Entry/exit signals'],
 '{"markets": "All Markets", "timeframes": "All Timeframes", "alerts": "Zone Touch & Break Alerts"}'::jsonb,
 8);

-- Update paid products with pricing tiers
UPDATE public.products 
SET 
  price = '₹699',
  price_range = '₹699 – ₹39,999',
  pricing_tiers = '[
    {"id": "30d", "label": "30 Days Subscription", "price": "₹699", "duration": "30 days"},
    {"id": "1y", "label": "1 Year Subscription", "price": "₹2,199", "duration": "1 year"},
    {"id": "3y", "label": "3 Year Subscription", "price": "₹4,999", "duration": "3 years"},
    {"id": "5y", "label": "5 Year Subscription", "price": "₹9,999", "duration": "5 years"},
    {"id": "lifetime", "label": "Lifetime Subscription", "price": "₹39,999", "duration": "Lifetime"}
  ]'::jsonb
WHERE slug = 'market-profile-indicator';

UPDATE public.products 
SET 
  price = '₹699',
  price_range = '₹699 – ₹49,999',
  pricing_tiers = '[
    {"id": "30d", "label": "30 Days Subscription", "price": "₹699", "duration": "30 days"},
    {"id": "1y", "label": "1 Year Subscription", "price": "₹2,999", "duration": "1 year"},
    {"id": "3y", "label": "3 Year Subscription", "price": "₹9,999", "duration": "3 years"},
    {"id": "5y", "label": "5 Year Subscription", "price": "₹19,999", "duration": "5 years"},
    {"id": "lifetime", "label": "Lifetime Subscription", "price": "₹49,999", "duration": "Lifetime"}
  ]'::jsonb
WHERE slug = 'virgin-cpr-dwm';

UPDATE public.products 
SET 
  price = '₹499',
  price_range = '₹499 – ₹44,999',
  pricing_tiers = '[
    {"id": "30d", "label": "30 Days Subscription", "price": "₹499", "duration": "30 days"},
    {"id": "1y", "label": "1 Year Subscription", "price": "₹2,499", "duration": "1 year"},
    {"id": "3y", "label": "3 Year Subscription", "price": "₹8,999", "duration": "3 years"},
    {"id": "5y", "label": "5 Year Subscription", "price": "₹17,999", "duration": "5 years"},
    {"id": "lifetime", "label": "Lifetime Subscription", "price": "₹44,999", "duration": "Lifetime"}
  ]'::jsonb
WHERE slug = 'virgin-cpr';

UPDATE public.products 
SET 
  price = '₹699',
  price_range = '₹699 – ₹59,999',
  pricing_tiers = '[
    {"id": "30d", "label": "30 Days Subscription", "price": "₹699", "duration": "30 days"},
    {"id": "1y", "label": "1 Year Subscription", "price": "₹3,999", "duration": "1 year"},
    {"id": "3y", "label": "3 Year Subscription", "price": "₹14,999", "duration": "3 years"},
    {"id": "5y", "label": "5 Year Subscription", "price": "₹29,999", "duration": "5 years"},
    {"id": "lifetime", "label": "Lifetime Subscription", "price": "₹59,999", "duration": "Lifetime"}
  ]'::jsonb
WHERE slug IN ('vsa-smart-volume', 'demand-supply-zone');