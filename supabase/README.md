# Supabase Setup for Vijaya Sai Provisions

This directory contains the necessary files to set up the Supabase backend for the Vijaya Sai Provisions website.

## Prerequisites

1. A Supabase account and project
2. Supabase CLI (optional, for local development)

## Setup Instructions

### 1. Create a Supabase Project

If you haven't already, create a new Supabase project at [https://app.supabase.io](https://app.supabase.io).

### 2. Set Up the Database Schema and Storage

You need to set up both the database schema and storage buckets:

#### Option 1: Using the Supabase Web Interface

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `schema.sql` from this directory
4. Paste it into the SQL Editor and run the query
5. Then, copy the contents of `storage.sql`
6. Paste it into a new SQL Editor query and run it

#### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
supabase db push -f schema.sql
supabase db push -f storage.sql
```

#### Verify Storage Bucket Creation

After running the storage setup:

1. Go to the Storage section in your Supabase dashboard
2. You should see a bucket named "product-images"
3. Verify that the bucket is set to public access

### 3. Set Up Authentication

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Settings
3. Configure the authentication settings as needed
4. For admin access, create a user with email and password:
   - Go to Authentication > Users
   - Click "Add User"
   - Enter the admin email and password

### 4. Get Your API Keys

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the URL and anon key
4. Update your `.env` file with these values:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Schema

The database schema includes the following tables:

1. **products** - Stores product information
2. **orders** - Stores order information
3. **order_items** - Stores items within each order
4. **customers** - Stores customer information
5. **coupons** - Stores coupon codes and their details
6. **messages** - Stores customer messages

## Row Level Security (RLS)

The schema includes Row Level Security policies to ensure data security:

- Public users can read products
- Only authenticated users (admins) can modify products, orders, customers, etc.

## Sample Data

The schema includes sample data for products and coupons to get you started.

## Troubleshooting

If you encounter any issues:

1. Check that your Supabase URL and anon key are correct in the `.env` file
2. Ensure that the SQL script ran without errors
3. Verify that the authentication is set up correctly
4. Check the browser console for any API errors
