/**
 * Utility to create a storage bucket for product images using SQL
 */
export async function createStorageBucketSQL() {
  console.log('Creating storage bucket using SQL...');

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
    // Try to directly insert into the storage.buckets table
    const insertBucketResponse = await fetch(`${supabaseUrl}/rest/v1/storage/buckets`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        id: 'product-images',
        name: 'product-images',
        public: true
      })
    });

    if (!insertBucketResponse.ok) {
      const responseText = await insertBucketResponse.text();
      console.error('Error inserting bucket:', responseText);

      // If the bucket already exists, that's fine
      if (insertBucketResponse.status === 400 && responseText.includes('already exists')) {
        console.log('Storage bucket already exists');
        return {
          success: true,
          message: 'Storage bucket already exists'
        };
      }

      return {
        success: false,
        error: `Error inserting bucket: ${insertBucketResponse.status} ${insertBucketResponse.statusText} - ${responseText}`
      };
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
