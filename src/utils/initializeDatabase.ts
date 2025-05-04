/**
 * Utility to initialize the database tables
 * This uses direct fetch requests to the Supabase REST API
 */

// Function to create the products table
export async function initializeDatabase() {
  console.log('Initializing database...');
  
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
    // Create the products table
    console.log('Creating products table...');
    
    // First, check if the products table exists
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/products?select=count`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (checkResponse.ok) {
      console.log('Products table already exists');
      return {
        success: true,
        message: 'Products table already exists'
      };
    }
    
    // Create the products table using the SQL API
    const createTableResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/create_products_table`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (!createTableResponse.ok) {
      console.error('Error creating products table:', await createTableResponse.text());
      return {
        success: false,
        error: `Error creating products table: ${createTableResponse.status} ${createTableResponse.statusText}`
      };
    }
    
    console.log('Products table created successfully');
    
    // Insert sample data
    console.log('Inserting sample data...');
    const sampleProducts = [
      {
        name: 'Basmati Rice',
        price: 120.00,
        image: '/placeholder.svg',
        category: 'Grains',
        description: 'Premium quality basmati rice',
        unit: '1 kg',
        stock: 50
      },
      {
        name: 'Sunflower Oil',
        price: 150.00,
        image: '/placeholder.svg',
        category: 'Oils',
        description: 'Pure sunflower cooking oil',
        unit: '1 L',
        stock: 30
      },
      {
        name: 'Wheat Flour',
        price: 60.00,
        image: '/placeholder.svg',
        category: 'Grains',
        description: 'Stone-ground wheat flour',
        unit: '1 kg',
        stock: 40
      }
    ];
    
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(sampleProducts)
    });
    
    if (!insertResponse.ok) {
      console.error('Error inserting sample data:', await insertResponse.text());
      return {
        success: false,
        error: `Error inserting sample data: ${insertResponse.status} ${insertResponse.statusText}`
      };
    }
    
    console.log('Sample data inserted successfully');
    
    // Create storage bucket
    console.log('Creating storage bucket...');
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
      // If the bucket already exists, that's fine
      if (createBucketResponse.status === 400 && (await createBucketResponse.text()).includes('already exists')) {
        console.log('Storage bucket already exists');
      } else {
        console.error('Error creating storage bucket:', await createBucketResponse.text());
        return {
          success: false,
          error: `Error creating storage bucket: ${createBucketResponse.status} ${createBucketResponse.statusText}`
        };
      }
    } else {
      console.log('Storage bucket created successfully');
    }
    
    return {
      success: true,
      message: 'Database initialized successfully'
    };
  } catch (error) {
    console.error('Error initializing database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
