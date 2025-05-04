/**
 * Utility to check if the user has admin privileges in Supabase
 */
export async function checkAdminPrivileges() {
  console.log('Checking admin privileges...');
  
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
    // Try to execute a privileged operation
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/check_admin_privileges`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('Error checking admin privileges:', responseText);
      
      return {
        success: false,
        error: `Error checking admin privileges: ${response.status} ${response.statusText}`,
        isAdmin: false
      };
    }
    
    const result = await response.json();
    console.log('Admin privileges check result:', result);
    
    return {
      success: true,
      isAdmin: result === true
    };
  } catch (error) {
    console.error('Error checking admin privileges:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      isAdmin: false
    };
  }
}
