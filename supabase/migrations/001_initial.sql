-- ============================================================
-- TOP 10 PROM — Initial Database Schema
-- DO NOT MODIFY — create new migration files for schema changes
-- ============================================================

-- ── PROFILES (extends Supabase auth.users) ────────────────────
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin')),
  shopping_intent TEXT,
  loyalty_points INTEGER DEFAULT 0,
  style_archetype TEXT,
  preferred_colors TEXT[],
  preferred_occasions TEXT[],
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── VENDORS (extends profiles for role=vendor) ────────────────
CREATE TABLE public.vendors (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  store_name TEXT NOT NULL,
  store_address TEXT,
  store_city TEXT,
  store_state TEXT,
  store_zip TEXT,
  store_phone TEXT,
  store_website TEXT,
  store_bio TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DRESSES (product catalog) ─────────────────────────────────
CREATE TABLE public.dresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  designer TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  wholesale_price DECIMAL(10,2),
  colors JSONB,            -- Array of {name, hex} objects
  sizes TEXT[],
  occasions TEXT[],
  silhouette TEXT,
  neckline TEXT,
  embellishment TEXT,
  image_urls TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_sale BOOLEAN DEFAULT false,
  is_exclusive BOOLEAN DEFAULT false,
  slug TEXT UNIQUE NOT NULL,
  stock_status TEXT DEFAULT 'in_stock'
    CHECK (stock_status IN ('in_stock', 'low_stock', 'backordered', 'discontinued')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── WISHLIST ITEMS ────────────────────────────────────────────
CREATE TABLE public.wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  dress_id TEXT NOT NULL,   -- References dress ID (mock or DB)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dress_id)
);

-- ── ORDERS ────────────────────────────────────────────────────
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'processing'
    CHECK (status IN ('processing', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2),
  shipping_cost DECIMAL(10,2),
  total DECIMAL(10,2),
  shipping_address JSONB,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── APPOINTMENTS ──────────────────────────────────────────────
CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  store_id INTEGER NOT NULL,
  store_name TEXT NOT NULL,
  occasion TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  party_size INTEGER DEFAULT 1,
  special_requests TEXT,
  status TEXT DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show')),
  how_heard TEXT,
  -- Guest info (for non-logged-in users)
  first_name TEXT,
  last_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── NEWSLETTER SUBSCRIBERS ────────────────────────────────────
CREATE TABLE public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all user-specific tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ─────────────────────────────────────────────────
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role has full access to profiles"
  ON public.profiles
  USING (auth.role() = 'service_role');

-- ── VENDORS ───────────────────────────────────────────────────
CREATE POLICY "Vendors can view own vendor record"
  ON public.vendors FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Vendors can update own vendor record"
  ON public.vendors FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role has full access to vendors"
  ON public.vendors
  USING (auth.role() = 'service_role');

-- ── DRESSES (public read) ─────────────────────────────────────
CREATE POLICY "Public dress catalog — anyone can read"
  ON public.dresses FOR SELECT
  USING (true);

CREATE POLICY "Service role manages dresses"
  ON public.dresses
  USING (auth.role() = 'service_role');

-- ── WISHLIST ──────────────────────────────────────────────────
CREATE POLICY "Users manage own wishlist"
  ON public.wishlist_items FOR ALL
  USING (auth.uid() = user_id);

-- ── ORDERS ────────────────────────────────────────────────────
CREATE POLICY "Customers view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Vendors view their store orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vendors
      WHERE vendors.id = auth.uid()
      AND vendors.id = orders.vendor_id
    )
  );

CREATE POLICY "Service role manages all orders"
  ON public.orders
  USING (auth.role() = 'service_role');

-- ── APPOINTMENTS ──────────────────────────────────────────────
CREATE POLICY "Users view own appointments"
  ON public.appointments FOR ALL
  USING (auth.uid() = customer_id);

CREATE POLICY "Service role manages all appointments"
  ON public.appointments
  USING (auth.role() = 'service_role');

-- ── NEWSLETTER ────────────────────────────────────────────────
CREATE POLICY "Service role manages newsletter"
  ON public.newsletter_subscribers
  USING (auth.role() = 'service_role');

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_wishlist_user_id ON public.wishlist_items(user_id);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_appointments_customer_id ON public.appointments(customer_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_dresses_designer ON public.dresses(designer);
CREATE INDEX idx_dresses_slug ON public.dresses(slug);
CREATE INDEX idx_dresses_occasions ON public.dresses USING GIN(occasions);
