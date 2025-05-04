-- Function to create the storage bucket
CREATE OR REPLACE FUNCTION create_storage_bucket()
RETURNS void AS $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Check if the bucket already exists
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'product-images'
  ) INTO bucket_exists;
  
  -- Create the bucket if it doesn't exist
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('product-images', 'product-images', true);
  END IF;
END;
$$ LANGUAGE plpgsql;
