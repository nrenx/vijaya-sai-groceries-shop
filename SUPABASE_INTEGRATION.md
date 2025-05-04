# Supabase Integration for Vijaya Sai Provisions

This document provides instructions for integrating Supabase as the backend for the Vijaya Sai Provisions website.

## Overview

Supabase is used to manage and store all critical data for both users and admins, supporting real-time synchronization and efficient data handling.

### Features Implemented

- **Products Management**: Store and retrieve products with categories
- **Orders Management**: Track and manage customer orders
- **Customers Management**: Store customer information and order history
- **Coupons Management**: Create and validate discount coupons
- **Messages Management**: Store and manage customer inquiries
- **Admin Authentication**: Secure admin panel access

## Setup Instructions

### 1. Create a Supabase Project

1. Sign up or log in at [https://app.supabase.io](https://app.supabase.io)
2. Create a new project
3. Note your project URL and anon key (found in Settings > API)

### 2. Set Up the Database Schema and Storage

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql` from this repository
3. Paste it into the SQL Editor and run the query
4. This will create all necessary tables, indexes, and sample data
5. Then, copy the contents of `supabase/storage.sql`
6. Paste it into a new SQL Editor query and run it
7. This will create a storage bucket for product images with appropriate permissions

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Update the Supabase URL and anon key with your project values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Set Up Admin Authentication

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add User"
3. Enter the admin email and password
4. This user will be able to log in to the admin panel

### 5. Install Dependencies and Run the Application

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Project Structure

The Supabase integration is organized as follows:

- `src/lib/supabase.ts` - Supabase client configuration
- `src/services/` - Service files for each entity (products, orders, etc.)
- `src/types/supabase.ts` - TypeScript definitions for Supabase tables
- `supabase/schema.sql` - SQL schema for setting up the database
- `supabase/README.md` - Detailed Supabase setup instructions

## Authentication Flow

1. Admin users log in through the `/admin/login` page
2. Authentication is handled by Supabase Auth
3. Authenticated sessions persist across page reloads
4. Protected routes require authentication

## Data Models

The following data models are implemented:

### Products
- ID, name, price, image, category, description, unit, stock
- Product images are stored in Supabase Storage in the "product-images" bucket

### Orders
- ID, customer name, phone, total amount, status, timestamps
- Related order items with product details and quantities

### Customers
- ID, name, email, phone, order statistics

### Coupons
- ID, code, discount type/value, usage limits, expiry date

### Messages
- ID, customer details, message content, read status

## Real-time Updates

The application uses Supabase's real-time capabilities to provide instant updates:

- Product changes reflect immediately on the user-facing side
- Order status updates are visible in real-time
- New messages appear instantly in the admin panel

## Security

- Row Level Security (RLS) policies restrict data access
- Only authenticated admins can modify data
- Public users can only read product information

## Troubleshooting

If you encounter issues:

1. Check browser console for API errors
2. Verify your Supabase credentials in the `.env` file
3. Ensure the SQL schema was applied correctly
4. Check that your admin user has the correct permissions

For more detailed setup instructions, see `supabase/README.md`.
