
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { useAuth } from '@/App';
import { LogIn } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, login, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Set a timeout to prevent the login from hanging
    const timeoutId = setTimeout(() => {
      console.log('Login request timed out');
      setIsLoading(false);
      setErrorMessage('Login request timed out. Please try again.');

      toast({
        title: 'Login timed out',
        description: 'The login request took too long. Please try again.',
        variant: 'destructive',
      });
    }, 10000); // 10 second timeout

    try {
      await login(email, password);

      // Clear the timeout since we got a response
      clearTimeout(timeoutId);

      toast({
        title: 'Login successful',
        description: 'Welcome back to the admin dashboard',
      });
      navigate('/admin');
    } catch (error: any) {
      // Clear the timeout since we got a response (an error)
      clearTimeout(timeoutId);

      console.error('Login error:', error);

      // Handle different error types
      if (error.message === 'Invalid login credentials') {
        setErrorMessage('Invalid email or password');
      } else {
        setErrorMessage(error.message || 'An error occurred during login');
      }

      toast({
        title: 'Login failed',
        description: errorMessage || 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Use your Supabase admin credentials to log in</p>
          {errorMessage && (
            <p className="mt-2 text-red-500">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
