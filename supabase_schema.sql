-- =========================================================================
-- LINA SHOP - SUPABASE DATABASE SCHEMA
-- Execute this SQL in your Supabase Project Dashboard -> SQL Editor
-- URL: https://jkdwpnmcnidfftebypet.supabase.co
-- =========================================================================

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  tracking_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  delegation TEXT,
  address TEXT NOT NULL,
  perfume_id TEXT NOT NULL,
  perfume_name TEXT NOT NULL,
  perfume_arabic_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  d17_tx_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  client_ip TEXT,
  user_id TEXT,
  items JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for tracking lookup
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON public.orders (tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders (phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- 2. D17 Payment Settings Table
CREATE TABLE IF NOT EXISTS public.d17_settings (
  id BIGSERIAL PRIMARY KEY,
  recipient_phone TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  instructions TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial D17 settings if not existing
INSERT INTO public.d17_settings (recipient_phone, recipient_name, instructions)
VALUES (
  '+216 55 889 900',
  'متجر لينا شوب - Lina Shop Perfumes',
  'يرجى إرسال المبلغ الإجمالي عبر تطبيق D17 التابع للبريد التونسي إلى الرقم الموضح، ثم نسخ رقم المعاملة وإدراجه أدناه.'
)
ON CONFLICT DO NOTHING;

-- 3. Store CMS Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id BIGSERIAL PRIMARY KEY,
  settings_key TEXT NOT NULL UNIQUE,
  settings_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Users Table (Customer & Admin accounts)
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  uid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  arabic_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  volume TEXT,
  badge TEXT,
  top_note TEXT,
  heart_note TEXT,
  base_note TEXT,
  longevity TEXT,
  sillage TEXT,
  season TEXT,
  rating TEXT,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d17_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read of products
CREATE POLICY "Public can view products"
  ON public.products FOR SELECT
  USING (true);

-- Allow public read of active store settings & D17 settings
CREATE POLICY "Public can view D17 settings"
  ON public.d17_settings FOR SELECT
  USING (true);

CREATE POLICY "Public can view store settings"
  ON public.store_settings FOR SELECT
  USING (true);

-- Allow public creation of orders (Checkout)
CREATE POLICY "Public can place orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Allow order tracking lookup by tracking number
CREATE POLICY "Public can track order by tracking number"
  ON public.orders FOR SELECT
  USING (true);

-- Service Role Key retains full bypass & unrestricted read/write on all tables!
