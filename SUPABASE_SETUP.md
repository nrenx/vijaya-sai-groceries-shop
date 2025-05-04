# Supabase Setup Instructions

This document provides instructions on how to set up your Supabase project for the Vijaya Sai Provisions website.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Click "New Project" and follow the steps to create a new project
3. Choose a name for your project (e.g., "vijaya-sai-provisions")
4. Set a secure database password (keep this safe, you'll need it for admin access)
5. Choose a region close to your target audience
6. Wait for your project to be created (this may take a few minutes)

## 2. Set Up the Database

### Option 1: Using the SQL Editor

1. In your Supabase project dashboard, go to the "SQL Editor" section
2. Copy the contents of the `setup-database.sql` file from this project
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL script
5. This will create all the necessary tables, indexes, and sample data

### Option 2: Using the Database Check Page

1. Start the application locally
2. Go to `/db-check` in your browser (e.g., http://localhost:8080/db-check)
3. The page will show you the current status of your database
4. If tables are missing, click "Create Tables Automatically"
5. This will create the basic tables and sample data

## 3. Configure Environment Variables

1. In your Supabase project dashboard, go to the "Settings" > "API" section
2. Find your project URL and anon/public key
3. Create or update the `.env` file in your project root with these values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart your application if it's already running

## 4. Verify the Setup

1. Go to `/db-check` in your browser
2. Verify that all tables and storage buckets are properly set up
3. If everything is green, your Supabase setup is complete!

## 5. Troubleshooting

If you encounter any issues:

1. Check the browser console for error messages
2. Verify that your Supabase URL and anon key are correct in the `.env` file
3. Make sure your Supabase project is active (not paused)
4. Check if the tables were created correctly in the "Table Editor" section of your Supabase dashboard
5. Ensure that the storage bucket "product-images" exists in the "Storage" section

## 6. Next Steps

After setting up Supabase:

1. Go to the admin panel (/admin) and log in
2. The default admin credentials are:
   - Email: admin@example.com
   - Password: password123
3. Change the admin password immediately after logging in
4. Start adding your products, categories, and other data

## 7. Backup and Restore

It's recommended to regularly backup your database:

1. Go to the "Database" section in your Supabase dashboard
2. Click on "Backups"
3. You can create manual backups or set up scheduled backups

To restore from a backup:

1. Go to the "Backups" section
2. Select the backup you want to restore
3. Click "Restore" and follow the instructions
