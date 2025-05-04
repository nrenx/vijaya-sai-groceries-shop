-- Function to create the products table
CREATE OR REPLACE FUNCTION create_products_table()
RETURNS void AS $$
BEGIN
  -- Create the products table if it doesn't exist
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
  
  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  
  -- Enable Row Level Security
  ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY IF NOT EXISTS "Public can view products" 
    ON products FOR SELECT 
    USING (true);
  
  CREATE POLICY IF NOT EXISTS "Authenticated users can insert products" 
    ON products FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');
  
  CREATE POLICY IF NOT EXISTS "Authenticated users can update products" 
    ON products FOR UPDATE 
    USING (auth.role() = 'authenticated');
  
  CREATE POLICY IF NOT EXISTS "Authenticated users can delete products" 
    ON products FOR DELETE 
    USING (auth.role() = 'authenticated');
  
  -- Create trigger for updated_at
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  
  -- Drop the trigger if it exists
  DROP TRIGGER IF EXISTS update_products_updated_at ON products;
  
  -- Create the trigger
  CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;
