
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="vs-container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-vs-purple">
              Vijaya Sai Provisions
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={`nav-link ${isActive('/') ? 'text-vs-purple font-semibold' : ''}`}>
              Home
            </Link>
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'text-vs-purple font-semibold' : ''}`}>
              Products
            </Link>
            <Link to="/cart" className={`nav-link flex items-center ${isActive('/cart') ? 'text-vs-purple font-semibold' : ''}`}>
              <ShoppingCart className="h-5 w-5 mr-1" />
              Cart
              {totalItems > 0 && (
                <Badge className="ml-1 bg-vs-purple text-white">{totalItems}</Badge>
              )}
            </Link>
          </div>
          
          {/* Mobile Navigation Icons */}
          <div className="flex md:hidden items-center space-x-4">
            <Link to="/cart" className="relative px-2">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-vs-purple text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                  {totalItems}
                </Badge>
              )}
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-700"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu - Animated slide down */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t mt-4 animate-accordion-down">
            <div className="flex flex-col space-y-3 py-4">
              <Link 
                to="/" 
                className={`nav-link py-2 px-4 ${isActive('/') ? 'bg-gray-100 text-vs-purple font-medium rounded-md' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`nav-link py-2 px-4 ${isActive('/products') ? 'bg-gray-100 text-vs-purple font-medium rounded-md' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/cart" 
                className={`nav-link py-2 px-4 flex items-center ${isActive('/cart') ? 'bg-gray-100 text-vs-purple font-medium rounded-md' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {totalItems > 0 && (
                  <Badge className="ml-2 bg-vs-purple text-white">{totalItems}</Badge>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
