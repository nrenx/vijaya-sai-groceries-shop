
import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import { authService } from "@/services";
import { supabase } from "@/lib/supabase";

// Pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import DatabaseCheck from "./pages/DatabaseCheck";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsManagement from "./pages/admin/ProductsManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import CustomersManagement from "./pages/admin/CustomersManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";
import CouponsManagement from "./pages/admin/CouponsManagement";

// Create Auth Context
type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: any | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  user: null,
  loading: true,
});

// Auth Provider Component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for authentication on component mount
  useEffect(() => {
    console.log('AuthProvider - Initializing authentication check');

    const checkAuth = async () => {
      // Set a timeout to ensure we don't get stuck in loading state
      const timeoutId = setTimeout(() => {
        console.log('AuthProvider - Session check timed out, setting loading to false');
        setLoading(false);
        setIsAuthenticated(false);
        setUser(null);
      }, 5000); // 5 second timeout

      try {
        console.log('AuthProvider - Checking for existing session');
        const session = await authService.getSession();
        console.log('AuthProvider - Session check result:', !!session);

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);

        setIsAuthenticated(!!session);

        if (session) {
          console.log('AuthProvider - Session found, getting user details');
          const user = await authService.getUser();
          console.log('AuthProvider - User details retrieved:', user ? 'User found' : 'No user');
          setUser(user);
        } else {
          console.log('AuthProvider - No session found');
        }
      } catch (error) {
        // Clear the timeout since we got a response (an error)
        clearTimeout(timeoutId);

        console.error("Error checking authentication:", error);
        if (error instanceof Error) {
          console.log('Error name:', error.name);
          console.log('Error message:', error.message);
          console.log('Error stack:', error.stack);
        }
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        console.log('AuthProvider - Authentication check complete, setting loading to false');
        setLoading(false);
      }
    };

    // Set up auth state listener
    console.log('AuthProvider - Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider - Auth state changed:', event);
        console.log('AuthProvider - New session:', !!session);

        setIsAuthenticated(!!session);

        if (session) {
          console.log('AuthProvider - New session detected, getting user details');
          const user = await authService.getUser();
          console.log('AuthProvider - User details updated:', user ? 'User found' : 'No user');
          setUser(user);
        } else {
          console.log('AuthProvider - No session in auth state change');
          setUser(null);
        }

        setLoading(false);
      }
    );

    checkAuth();

    // Cleanup subscription
    return () => {
      console.log('AuthProvider - Cleaning up auth state subscription');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthProvider - Login attempt with email:', email);
    try {
      console.log('AuthProvider - Calling signIn method');
      const result = await authService.signIn(email, password);
      console.log('AuthProvider - SignIn result:', result ? 'Success' : 'Failed');

      if (result && result.user) {
        console.log('AuthProvider - User authenticated successfully');
        setUser(result.user);
        setIsAuthenticated(true);
      } else {
        console.log('AuthProvider - No user returned from signIn');
        throw new Error('Authentication failed - no user returned');
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        console.log('Error name:', error.name);
        console.log('Error message:', error.message);
      }
      throw error;
    }
  };

  const logout = async () => {
    console.log('AuthProvider - Logout attempt');
    try {
      console.log('AuthProvider - Calling signOut method');
      await authService.signOut();
      console.log('AuthProvider - SignOut successful');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      if (error instanceof Error) {
        console.log('Error name:', error.name);
        console.log('Error message:', error.message);
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log('ProtectedRoute - Auth State:', { isAuthenticated, loading, user });

  if (loading) {
    console.log('ProtectedRoute - Still loading authentication state');
    // Return a loading spinner with more information
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Checking authentication...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('ProtectedRoute - Authentication successful, rendering protected content');
  return children;
};

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simple check to ensure Supabase is initialized
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Just a simple check to make sure Supabase is initialized
        console.log('Checking Supabase connection...');
        console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

        // Set a timeout to ensure the app continues even if there's an issue
        const timeout = setTimeout(() => {
          console.log('Continuing app initialization due to timeout...');
          setIsLoading(false);
        }, 5000); // Wait 5 seconds

        // Try a simple query
        console.log('Attempting to query Supabase...');
        const { data, error } = await supabase.from('products').select('count(*)', { head: true });

        clearTimeout(timeout);

        if (error) {
          console.error('Supabase connection error:', error);
          console.log('Error code:', error.code);
          console.log('Error message:', error.message);
          console.log('Error details:', error.details);

          // If the error is because the table doesn't exist, that's okay
          // We'll handle that in the database check page
          if (error.code === '42P01') {
            console.log('Products table does not exist yet. This is expected for a new setup.');
          }
        } else {
          console.log('Supabase connection successful');
          console.log('Data:', data);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking connection:', error);
        if (error instanceof Error) {
          console.log('Error name:', error.name);
          console.log('Error message:', error.message);
          console.log('Error stack:', error.stack);
        }
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          {isLoading ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg">Loading...</p>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/db-check" element={<DatabaseCheck />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <ProductsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute>
                  <OrdersManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <ProtectedRoute>
                  <CustomersManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute>
                  <MessagesManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <SettingsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/coupons"
              element={
                <ProtectedRoute>
                  <CouponsManagement />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          )}
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
