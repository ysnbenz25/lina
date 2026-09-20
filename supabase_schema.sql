-- =========================================================================
-- LINA SHOP - SUPABASE DATABASE & STORAGE SCHEMA
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
  order_notes TEXT,
  perfume_id TEXT NOT NULL,
  perfume_name TEXT NOT NULL,
  perfume_arabic_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  d17_tx_id TEXT,
  d17_recipient_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  client_ip TEXT,
  user_id TEXT,
  items JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
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
  '+216 27610626',
  'متجر لينا شوب - Lina Shop Perfumes',
  'يرجى فتح تطبيق D17 التابع للبريد التونسي، واختيار "تحويل أموال"، ثم إدخال رقم الهاتف وإتمام المعاملة، ونسخ رقم العملية هنا.'
)
ON CONFLICT DO NOTHING;

-- 3. Store CMS Settings Table (Homepage, Website, Theme, Delivery/Shipping, Content, SEO, Promotions, Categories)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id BIGSERIAL PRIMARY KEY,
  settings_key TEXT NOT NULL UNIQUE,
  settings_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Users & Customers Table
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
  gallery JSONB,
  sizes JSONB,
  gender TEXT DEFAULT 'unisex',
  badge TEXT,
  fragrance_type TEXT,
  inspired_by TEXT,
  volume TEXT,
  description TEXT,
  notes JSONB,
  in_stock BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_special_offer BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT TRUE,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Supabase Storage Bucket for Product Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.d17_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert products" ON public.products;
CREATE POLICY "Public can insert products" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update products" ON public.products;
CREATE POLICY "Public can update products" ON public.products FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete products" ON public.products;
CREATE POLICY "Public can delete products" ON public.products FOR DELETE USING (true);

-- Orders Policies
DROP POLICY IF EXISTS "Public can place orders" ON public.orders;
CREATE POLICY "Public can place orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can update orders" ON public.orders;
CREATE POLICY "Public can update orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

-- Store Settings Policies (Shipping, Delivery, Theme, Homepage, CMS)
DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert store settings" ON public.store_settings;
CREATE POLICY "Public can insert store settings" ON public.store_settings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update store settings" ON public.store_settings;
CREATE POLICY "Public can update store settings" ON public.store_settings FOR UPDATE USING (true) WITH CHECK (true);

-- D17 Settings Policies
DROP POLICY IF EXISTS "Public can view D17 settings" ON public.d17_settings;
CREATE POLICY "Public can view D17 settings" ON public.d17_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert D17 settings" ON public.d17_settings;
CREATE POLICY "Public can insert D17 settings" ON public.d17_settings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update D17 settings" ON public.d17_settings;
CREATE POLICY "Public can update D17 settings" ON public.d17_settings FOR UPDATE USING (true) WITH CHECK (true);

-- Storage Objects Policies (Bucket 'products')
DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;
CREATE POLICY "Public can read product images" ON storage.objects FOR SELECT USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Public can upload product images" ON storage.objects;
CREATE POLICY "Public can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');

DROP POLICY IF EXISTS "Public can update product images" ON storage.objects;
CREATE POLICY "Public can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Public can delete product images" ON storage.objects;
CREATE POLICY "Public can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'products');
