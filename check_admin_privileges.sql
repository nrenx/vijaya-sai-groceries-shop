-- Function to check if the user has admin privileges
CREATE OR REPLACE FUNCTION check_admin_privileges()
RETURNS boolean AS $$
BEGIN
  -- Check if the user is authenticated and has admin role
  RETURN (SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND raw_app_meta_data->>'role' = 'admin'
  ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
