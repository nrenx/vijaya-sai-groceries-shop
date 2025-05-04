-- Run this script in the Supabase SQL Editor to set up your database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Processing', 'Delivered', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL UNIQUE,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  last_order_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
  discount_value DECIMAL(10, 2) NOT NULL,
  success_message TEXT NOT NULL,
  usage_limit INTEGER NOT NULL,
  usage_count INTEGER DEFAULT 0,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('WhatsApp', 'Website')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);

-- Create a storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the product-images bucket
-- Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update images" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
  );

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read products" 
  ON products FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert products" 
  ON products FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" 
  ON products FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" 
  ON products FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Similar policies for other tables
CREATE POLICY "Authenticated users can read orders" 
  ON orders FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert orders" 
  ON orders FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders" 
  ON orders FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete orders" 
  ON orders FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Sample data for products
INSERT INTO products (name, price, image, category, description, unit, stock)
VALUES
  ('Basmati Rice', 120.00, '/placeholder.svg', 'Grains', 'Premium quality basmati rice', '1 kg', 50),
  ('Sunflower Oil', 150.00, '/placeholder.svg', 'Oils', 'Pure sunflower cooking oil', '1 L', 30),
  ('Wheat Flour', 60.00, '/placeholder.svg', 'Grains', 'Stone-ground wheat flour', '1 kg', 40),
  ('Turmeric Powder', 45.00, '/placeholder.svg', 'Spices', 'Organic turmeric powder', '100 g', 25),
  ('Potato Chips', 30.00, '/placeholder.svg', 'Snacks', 'Crispy potato chips', '100 g', 60),
  ('Hand Soap', 40.00, '/placeholder.svg', 'Soaps', 'Aloe vera hand wash', '250 ml', 35),
  ('Red Lentils', 80.00, '/placeholder.svg', 'Grains', 'Organic red lentils', '500 g', 45),
  ('Black Pepper', 65.00, '/placeholder.svg', 'Spices', 'Freshly ground black pepper', '50 g', 30),
  ('Coconut Oil', 190.00, '/placeholder.svg', 'Oils', 'Cold-pressed coconut oil', '500 ml', 20),
  ('Dish Soap', 50.00, '/placeholder.svg', 'Soaps', 'Lemon dish washing liquid', '500 ml', 40)
ON CONFLICT (id) DO NOTHING;

-- Sample data for coupons
INSERT INTO coupons (code, discount_type, discount_value, success_message, usage_limit, expiry_date)
VALUES
  ('WELCOME10', 'percentage', 10.00, 'You received 10% off on your order!', 100, CURRENT_TIMESTAMP + INTERVAL '30 days'),
  ('FREEDEL', 'flat', 50.00, 'You won free delivery!', 50, CURRENT_TIMESTAMP + INTERVAL '14 days')
ON CONFLICT (code) DO NOTHING;
