# Database Setup for Vijaya Sai Provisions

This document provides instructions on how to set up the database for the Vijaya Sai Provisions website.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project in Supabase
3. Get your Supabase URL and anon key from the project settings

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase URL and anon key.

## Database Setup

### Option 1: Automatic Setup

1. Go to the `/db-check` page in the application
2. Click on the "Create Tables Automatically" button

### Option 2: Manual Setup

1. Go to the SQL Editor in your Supabase project
2. Copy the contents of the `create_products_table.sql` file
3. Paste it into the SQL Editor and run it
4. Run the following SQL to create the function:

```sql
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
```

5. Then call the function:

```sql
SELECT create_products_table();
```

6. Create a function to check admin privileges:

```sql
-- Function to check if the user has admin privileges
CREATE OR REPLACE FUNCTION check_admin_privileges()
RETURNS boolean AS $$
BEGIN
  -- Check if the user is authenticated and has admin role
  RETURN (SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND raw_app_meta_data->>'role' = 'admin'
  ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

7. Create a function to check if a storage bucket exists:

```sql
-- Function to check if a storage bucket exists
CREATE OR REPLACE FUNCTION check_bucket_exists(bucket_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Check if the bucket exists in the storage.buckets table
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = bucket_name
  ) INTO bucket_exists;

  RETURN bucket_exists;
END;
$$ LANGUAGE plpgsql;
```

8. Create a storage bucket for product images:

There are several ways to create the storage bucket:

**Option 1: Using the Supabase Dashboard (Recommended)**
1. Go to the Supabase Dashboard
2. Navigate to Storage
3. Click "Create a new bucket"
4. Enter "product-images" as the bucket name
5. Check "Public bucket" to make it public
6. Click "Create bucket"

**Option 2: Using SQL in the Supabase SQL Editor**
```sql
-- Insert directly into the storage.buckets table
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;
```

**Option 3: Using the Supabase REST API**
```bash
# Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_KEY with your actual values
curl -X POST 'https://YOUR_SUPABASE_URL/rest/v1/storage/buckets' \
  -H 'apikey: YOUR_SUPABASE_KEY' \
  -H 'Authorization: Bearer YOUR_SUPABASE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"id":"product-images","name":"product-images","public":true}'
```

**Option 4: Using the Supabase JavaScript Client**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY')

async function createBucket() {
  const { data, error } = await supabase.storage.createBucket('product-images', {
    public: true
  })

  if (error) {
    console.error('Error creating bucket:', error)
  } else {
    console.log('Bucket created successfully:', data)
  }
}

createBucket()
```

## Verifying the Setup

1. Go to the `/db-check` page in the application
2. The page should show that the database is connected and the tables are created
3. You can also check the Supabase dashboard to verify that the tables and storage bucket are created

## Troubleshooting

### Storage Bucket Creation Issues

If you're having trouble creating the storage bucket through the application:

1. **Check Permissions**: Make sure your Supabase API key has the necessary permissions to create storage buckets.

2. **Check for Existing Bucket**: The bucket might already exist with a different configuration. Try deleting it first from the Supabase dashboard.

3. **Create Manually**: Create the bucket manually through the Supabase dashboard:
   - Go to Storage in the Supabase dashboard
   - Click "Create a new bucket"
   - Name it "product-images"
   - Make it public
   - Click "Create bucket"

4. **Check Network Requests**: Open your browser's developer tools and check the network tab for any error responses when trying to create the bucket.

5. **SQL Method**: Try running the SQL command directly in the Supabase SQL editor:
   ```sql
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('product-images', 'product-images', true)
   ON CONFLICT (id) DO NOTHING;
   ```

## Sample Data

You can insert sample data using the following SQL:

```sql
INSERT INTO products (name, price, image, category, description, unit, stock)
VALUES
  ('Basmati Rice', 120.00, '/placeholder.svg', 'Grains', 'Premium quality basmati rice', '1 kg', 50),
  ('Sunflower Oil', 150.00, '/placeholder.svg', 'Oils', 'Pure sunflower cooking oil', '1 L', 30),
  ('Wheat Flour', 60.00, '/placeholder.svg', 'Grains', 'Stone-ground wheat flour', '1 kg', 40);
```

## Troubleshooting

If you encounter any issues with the database connection:

1. Check that your Supabase URL and anon key are correct
2. Make sure that your Supabase project is active
3. Check the browser console for any error messages
4. Try refreshing the page
5. Try restarting the application
