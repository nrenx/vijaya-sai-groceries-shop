import React, { useState, useEffect } from 'react';
import { checkDatabase } from '@/utils/checkDatabase';
import { testSupabaseCredentials } from '@/utils/testSupabase';
import { initializeDatabase } from '@/utils/initializeDatabase';
import { createStorageBucket } from '@/utils/createStorageBucket';
import { createStorageBucketAlt } from '@/utils/createStorageBucketAlt';
import { createStorageBucketSQL } from '@/utils/createStorageBucketSQL';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Key, Database, FolderPlus } from 'lucide-react';

const DatabaseCheck: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [credentialsStatus, setCredentialsStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSql, setShowSql] = useState(false);

  const testCredentials = async () => {
    setLoading(true);
    try {
      // Set a timeout to ensure we don't hang forever
      const timeoutPromise = new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({
            success: false,
            error: 'Connection timeout. Supabase might be unreachable.'
          });
        }, 10000); // 10 second timeout
      });

      // Race the actual test against the timeout
      const result = await Promise.race([
        testSupabaseCredentials(),
        timeoutPromise
      ]);

      console.log('Credentials test result:', result);
      setCredentialsStatus(result);
      setLoading(false);

      // If we got a response, consider it a success even if there was an error
      // This is because we might get a "table doesn't exist" error, which is fine
      if (result.success || result.code === '42P01') {
        return true;
      }

      return result.success;
    } catch (error) {
      console.error('Error testing credentials:', error);
      setCredentialsStatus({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setLoading(false);
      return false;
    }
  };

  const runCheck = async () => {
    setLoading(true);
    try {
      // Set a timeout for the entire check process
      const timeoutId = setTimeout(() => {
        console.log('Database check timed out');
        setStatus({
          connected: false,
          error: 'Database check timed out. Supabase might be unreachable.',
          tables: {}
        });
        setLoading(false);
      }, 10000); // 10 second timeout

      // First test the credentials
      const credentialsValid = await testCredentials();

      if (!credentialsValid) {
        setStatus({
          connected: false,
          error: 'Invalid Supabase credentials. Please check your .env file.',
          tables: {}
        });
        clearTimeout(timeoutId);
        setLoading(false);
        return;
      }

      // Then check the database
      try {
        const result = await checkDatabase();
        clearTimeout(timeoutId);
        setStatus(result);
      } catch (dbError) {
        console.error('Error checking database:', dbError);
        setStatus({
          connected: false,
          error: dbError instanceof Error ? dbError.message : 'Unknown database error',
          tables: {}
        });
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Error running database check:', error);
      setStatus({
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        tables: {}
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  const initializeTables = async () => {
    setLoading(true);
    try {
      const result = await initializeDatabase();

      if (result.success) {
        alert('Database initialized successfully!');
        runCheck();
      } else {
        console.error('Error initializing database:', result.error);
        alert('Error initializing database: ' + result.error);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      alert('Error initializing database: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const createBucket = async () => {
    setLoading(true);
    try {
      // First try with the alternative method
      console.log('Trying to create bucket with Supabase client...');
      const result = await createStorageBucketAlt();

      if (result.success) {
        alert('Storage bucket created successfully!');
        runCheck();
        return;
      }

      console.error('Error creating storage bucket with Supabase client:', result.error);

      // If that fails, try with the SQL method
      console.log('Trying to create bucket with SQL...');
      const sqlResult = await createStorageBucketSQL();

      if (sqlResult.success) {
        alert('Storage bucket created successfully!');
        runCheck();
        return;
      }

      console.error('Error creating storage bucket with SQL:', sqlResult.error);

      // If that fails, try with the direct API method
      console.log('Trying to create bucket with direct API...');
      const directResult = await createStorageBucket();

      if (directResult.success) {
        alert('Storage bucket created successfully!');
        runCheck();
      } else {
        console.error('Error creating storage bucket with direct API:', directResult.error);
        alert('Error creating storage bucket. Please try creating it manually in the Supabase dashboard.');
      }
    } catch (error) {
      console.error('Error creating storage bucket:', error);
      alert('Error creating storage bucket: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const showSetupInstructions = () => {
    alert(`
Database Setup Instructions:

1. Create a Supabase project
2. Get your Supabase URL and anon key
3. Add them to your .env file as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
4. Run the SQL in DATABASE_SETUP.md to create the necessary tables
5. Create a storage bucket named "product-images" and make it public

Troubleshooting Storage Bucket Creation:

If you're having trouble creating the storage bucket:
- Try creating it manually in the Supabase dashboard
- Go to Storage > Create a new bucket
- Name it "product-images" and make it public
- Check your browser console for detailed error messages
- Make sure your API key has the necessary permissions
    `);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Database Connection Check</span>
            {loading && <RefreshCw className="h-5 w-5 animate-spin" />}
          </CardTitle>
          <CardDescription>
            Check if your Supabase database is properly configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Checking database connection...</p>
            </div>
          ) : status ? (
            <div className="space-y-4">
              {/* Credentials Status */}
              <div className="flex items-center gap-2">
                <span className="font-semibold">Credentials Status:</span>
                {credentialsStatus?.success ? (
                  <span className="flex items-center text-green-600">
                    <Key className="h-5 w-5 mr-1" /> Valid
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-5 w-5 mr-1" /> Invalid
                  </span>
                )}
              </div>

              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <span className="font-semibold">Connection Status:</span>
                {status.connected ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" /> Connected
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <XCircle className="h-5 w-5 mr-1" /> Not Connected
                  </span>
                )}
              </div>

              {status.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{status.error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <h3 className="font-semibold">Tables:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span>Products Table:</span>
                    {status.tables?.products ? (
                      <span className="text-green-600">
                        <CheckCircle className="h-4 w-4 inline" />
                      </span>
                    ) : (
                      <span className="text-red-600">
                        <XCircle className="h-4 w-4 inline" />
                      </span>
                    )}
                  </div>
                  {status.tables?.productCount !== undefined && (
                    <div>
                      <span className="text-gray-600">
                        {status.tables.productCount} products
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span>Storage Bucket:</span>
                    {status.tables?.storage ? (
                      <span className="text-green-600">
                        <CheckCircle className="h-4 w-4 inline" />
                      </span>
                    ) : (
                      <div>
                        <span className="text-red-600">
                          <XCircle className="h-4 w-4 inline" />
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={createBucket}
                          className="ml-2 h-6 text-xs"
                        >
                          <FolderPlus className="h-3 w-3 mr-1" />
                          Create Bucket
                        </Button>
                      </div>
                    )}
                  </div>
                  {status.tables?.buckets && (
                    <div>
                      <span className="text-gray-600">
                        {status.tables.buckets.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {!status.connected || !status.tables?.products || !status.tables?.storage ? (
                <div className="mt-4">
                  <Button onClick={showSetupInstructions} className="mr-2">
                    Troubleshooting
                  </Button>
                  <Button onClick={() => setShowSql(!showSql)}>
                    {showSql ? 'Hide Setup Instructions' : 'Show Setup Instructions'}
                  </Button>

                  {showSql && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-md">
                      <h4 className="font-semibold mb-2">Database Setup Instructions</h4>
                      <p className="mb-2">
                        You need to run the SQL scripts to set up your database. You can do this in the Supabase SQL Editor.
                      </p>
                      <p className="mb-2">
                        <Button variant="outline" onClick={initializeTables}>
                          Create Tables Automatically
                        </Button>
                      </p>
                      <p className="text-xs text-gray-500">
                        Note: The automatic setup will create basic tables and sample data. For a complete setup, run the SQL scripts manually.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Database is properly configured</AlertTitle>
                  <AlertDescription>
                    Your Supabase database is set up correctly with all required tables and storage buckets.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to check database status</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={testCredentials} disabled={loading} variant="outline">
            <Key className="h-4 w-4 mr-2" />
            Test Credentials
          </Button>

          <Button onClick={runCheck} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Again
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DatabaseCheck;
