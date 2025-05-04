
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/App';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", path: "/admin/customers", icon: Users },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare },
  { name: "Coupons", path: "/admin/coupons", icon: Tag },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Update sidebar state when screen size changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="bg-white shadow-md"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white shadow-md w-64 fixed inset-y-0 left-0 z-20 flex flex-col transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">Vijaya Sai Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-grow overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-primary text-white font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isMobile ? "p-5 pt-20" : "p-5 lg:p-8",
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
