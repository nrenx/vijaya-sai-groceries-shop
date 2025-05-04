// Test script to check if the product-images bucket exists
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env file manually
const envFile = readFileSync(resolve('.env'), 'utf8');
const envVars = {};

envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials are missing in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBucket() {
  console.log('Checking if product-images bucket exists...');

  try {
    // Method 1: List all buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
    } else {
      console.log('Buckets:', buckets);

      const productImagesBucket = buckets.find(bucket => bucket.name === 'product-images');
      if (productImagesBucket) {
        console.log('Found product-images bucket in the list of buckets');
        return;
      }
    }

    // Method 2: Try to get the bucket directly
    const { data: bucket, error: getBucketError } = await supabase.storage.getBucket('product-images');

    if (getBucketError) {
      console.error('Error getting bucket:', getBucketError);
    } else {
      console.log('Bucket details:', bucket);
      console.log('Found product-images bucket by getting it directly');
      return;
    }

    // Method 3: Try to list objects in the bucket
    const { data: objects, error: listObjectsError } = await supabase.storage.from('product-images').list();

    if (listObjectsError) {
      console.error('Error listing objects:', listObjectsError);
    } else {
      console.log('Objects in bucket:', objects);
      console.log('Found product-images bucket by listing objects');
      return;
    }

    console.log('Could not find product-images bucket with any method');

    // Try to create the bucket
    console.log('Attempting to create the product-images bucket...');
    const { data: createData, error: createError } = await supabase.storage.createBucket('product-images', {
      public: true
    });

    if (createError) {
      console.error('Error creating bucket:', createError);
    } else {
      console.log('Bucket created successfully:', createData);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the check
checkBucket();
