-- Function to check if a storage bucket exists
CREATE OR REPLACE FUNCTION check_bucket_exists(bucket_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Check if the bucket exists in the storage.buckets table
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = bucket_name
  ) INTO bucket_exists;
  
  RETURN bucket_exists;
END;
$$ LANGUAGE plpgsql;
