/**
 * Alternative utility to create a storage bucket for product images
 * This uses the Supabase client directly
 */
import { supabase } from '@/lib/supabase';

export async function createStorageBucketAlt() {
  console.log('Creating storage bucket using Supabase client...');
  
  try {
    // First, check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return {
        success: false,
        error: `Error listing buckets: ${listError.message}`
      };
    }
    
    // Check if product-images bucket already exists
    const existingBucket = buckets.find(bucket => bucket.name === 'product-images');
    if (existingBucket) {
      console.log('Storage bucket already exists:', existingBucket);
      return {
        success: true,
        message: 'Storage bucket already exists'
      };
    }
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('product-images', {
      public: true
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
      return {
        success: false,
        error: `Error creating bucket: ${error.message}`
      };
    }
    
    console.log('Storage bucket created successfully:', data);
    return {
      success: true,
      message: 'Storage bucket created successfully'
    };
  } catch (error) {
    console.error('Unexpected error creating storage bucket:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
