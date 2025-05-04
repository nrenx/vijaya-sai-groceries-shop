/**
 * Utility to create a storage bucket for product images
 */
export async function createStorageBucket() {
  console.log('Creating storage bucket...');

  // Get Supabase credentials from environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials are missing');
    return {
      success: false,
      error: 'Supabase credentials are missing in .env file'
    };
  }

  try {
    // Create storage bucket
    console.log('Creating storage bucket...');

    // First, try to list buckets to see if it already exists
    const listBucketsResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (listBucketsResponse.ok) {
      const buckets = await listBucketsResponse.json();
      console.log('Existing buckets:', buckets);

      // Check if product-images bucket already exists
      const existingBucket = buckets.find((bucket: any) => bucket.name === 'product-images');
      if (existingBucket) {
        console.log('Storage bucket already exists:', existingBucket);
        return {
          success: true,
          message: 'Storage bucket already exists'
        };
      }
    }

    // Try creating the bucket
    const createBucketResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 'product-images',
        name: 'product-images',
        public: true
      })
    });

    if (!createBucketResponse.ok) {
      // Get the full response text for debugging
      const responseText = await createBucketResponse.text();
      console.log('Full response from bucket creation:', responseText);

      // If the bucket already exists, that's fine
      if (createBucketResponse.status === 400 && responseText.includes('already exists')) {
        console.log('Storage bucket already exists');
        return {
          success: true,
          message: 'Storage bucket already exists'
        };
      } else {
        console.error('Error creating storage bucket:', responseText);
        return {
          success: false,
          error: `Error creating storage bucket: ${createBucketResponse.status} ${createBucketResponse.statusText} - ${responseText}`
        };
      }
    }

    console.log('Storage bucket created successfully');
    return {
      success: true,
      message: 'Storage bucket created successfully'
    };
  } catch (error) {
    console.error('Error creating storage bucket:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
