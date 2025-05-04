/**
 * Simple test to check if the Supabase credentials are valid
 * This uses a direct fetch to the Supabase REST API instead of the Supabase client
 */
export async function testSupabaseCredentials() {
  console.log('Testing Supabase credentials...');

  // Check if environment variables are set
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl.trim() === '') {
    console.error('Supabase URL is missing or empty');
    return {
      success: false,
      error: 'Supabase URL is missing in .env file'
    };
  }

  if (!supabaseKey || supabaseKey.trim() === '') {
    console.error('Supabase anon key is missing or empty');
    return {
      success: false,
      error: 'Supabase anon key is missing in .env file'
    };
  }

  console.log('URL:', supabaseUrl);
  console.log('Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');

  // Create a timeout promise
  const timeout = new Promise<any>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Connection timed out after 8 seconds'));
    }, 8000);
  });

  try {
    // Race the connection test against the timeout
    return await Promise.race([
      testDirectConnection(supabaseUrl, supabaseKey),
      timeout
    ]);
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Test the connection by making a direct fetch to the Supabase REST API
 */
async function testDirectConnection(supabaseUrl: string, supabaseKey: string) {
  try {
    console.log('Testing direct connection to Supabase REST API...');

    // Construct the API URL for a simple health check
    const apiUrl = `${supabaseUrl}/rest/v1/products?select=count`;
    console.log('API URL:', apiUrl);

    // Make a direct fetch request to the Supabase REST API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      // If we get a 404, the table might not exist yet
      if (response.status === 404) {
        console.log('API endpoint not found, but connection might still be valid');
        return {
          success: true,
          data: { message: 'Connected, but API endpoint not found' }
        };
      }

      // If we get a 401 or 403, the credentials are invalid
      if (response.status === 401 || response.status === 403) {
        const errorText = await response.text();
        console.error('Authentication error:', errorText);
        return {
          success: false,
          error: 'Invalid Supabase credentials. Please check your .env file.',
          status: response.status
        };
      }

      // For other errors, return the error message
      const errorText = await response.text();
      console.error('Error connecting to Supabase:', errorText);
      return {
        success: false,
        error: `API error: ${response.status} ${response.statusText}`,
        status: response.status
      };
    }

    // Parse the response as JSON
    const data = await response.json();
    console.log('Supabase connection successful:', data);

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Exception testing Supabase connection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
