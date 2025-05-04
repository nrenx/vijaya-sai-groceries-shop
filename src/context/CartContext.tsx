
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { Coupon } from '@/types/coupon';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define the customer info interface
interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  subtotalAmount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discountAmount: number;
  generateWhatsAppOrderLink: (customerInfo?: CustomerInfo) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('vijaya-sai-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data:', error);
      }
    }
    
    const savedCoupon = localStorage.getItem('vijaya-sai-applied-coupon');
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (error) {
        console.error('Failed to parse coupon data:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vijaya-sai-cart', JSON.stringify(cart));
  }, [cart]);
  
  // Save applied coupon to localStorage whenever it changes
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('vijaya-sai-applied-coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('vijaya-sai-applied-coupon');
    }
  }, [appliedCoupon]);
  
  // Calculate total items and amount
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = subtotalAmount * (appliedCoupon.discountValue / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    
    // Make sure discount doesn't exceed total
    discountAmount = Math.min(discountAmount, subtotalAmount);
  }
  
  // Total after discount
  const totalAmount = Math.max(0, subtotalAmount - discountAmount);
  
  // Apply coupon function
  const applyCoupon = (code: string): boolean => {
    // Get coupons from localStorage
    const savedCoupons = localStorage.getItem('vijaya-sai-coupons');
    if (!savedCoupons) {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is invalid.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    try {
      const coupons: Coupon[] = JSON.parse(savedCoupons);
      const coupon = coupons.find(c => 
        c.code.toLowerCase() === code.toLowerCase() && c.isActive
      );
      
      if (!coupon) {
        toast({
          title: "Invalid coupon",
          description: "The coupon code you entered is invalid or inactive.",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
      
      // Check if coupon is expired
      if (new Date(coupon.expiryDate) < new Date()) {
        toast({
          title: "Expired coupon",
          description: "The coupon code you entered has expired.",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
      
      // Check if coupon has reached usage limit
      if (coupon.usageCount >= coupon.usageLimit) {
        toast({
          title: "Coupon limit reached",
          description: "This coupon has reached its usage limit.",
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
      
      // Apply coupon
      setAppliedCoupon(coupon);
      
      // Increment usage count
      const updatedCoupons = coupons.map(c => 
        c.id === coupon.id 
          ? { ...c, usageCount: c.usageCount + 1 } 
          : c
      );
      localStorage.setItem('vijaya-sai-coupons', JSON.stringify(updatedCoupons));
      
      toast({
        title: "Coupon applied",
        description: coupon.successMessage,
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to parse coupons:', error);
      toast({
        title: "Error",
        description: "There was an error applying your coupon.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  };
  
  // Remove coupon function
  const removeCoupon = () => {
    if (appliedCoupon) {
      // Get coupons from localStorage to decrement usage count
      const savedCoupons = localStorage.getItem('vijaya-sai-coupons');
      if (savedCoupons) {
        try {
          const coupons: Coupon[] = JSON.parse(savedCoupons);
          const updatedCoupons = coupons.map(c => 
            c.id === appliedCoupon.id 
              ? { ...c, usageCount: Math.max(0, c.usageCount - 1) } 
              : c
          );
          localStorage.setItem('vijaya-sai-coupons', JSON.stringify(updatedCoupons));
        } catch (error) {
          console.error('Failed to update coupon usage:', error);
        }
      }
      
      setAppliedCoupon(null);
      toast({
        title: "Coupon removed",
        description: "The coupon has been removed from your cart.",
        duration: 2000,
      });
    }
  };
  
  // Add product to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      let updatedCart;
      if (existingItem) {
        // Product exists in cart, update quantity
        updatedCart = prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
        toast({
          title: "Item updated",
          description: (
            <div className="flex flex-col gap-2">
              <div>{`${product.name} quantity updated in your cart`}</div>
              <Link to="/cart">
                <Button variant="outline" size="sm" className="mt-2">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Cart
                </Button>
              </Link>
            </div>
          ),
          duration: 3000,
        });
      } else {
        // Add new product to cart
        updatedCart = [...prevCart, { ...product, quantity }];
        toast({
          title: "Item added",
          description: (
            <div className="flex flex-col gap-2">
              <div>{`${product.name} added to your cart`}</div>
              <Link to="/cart">
                <Button variant="outline" size="sm" className="mt-2">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Cart
                </Button>
              </Link>
            </div>
          ),
          duration: 3000,
        });
      }
      
      return updatedCart;
    });
  };
  
  // Remove product from cart
  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.id === productId);
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} removed from your cart`,
          duration: 2000,
        });
      }
      return prevCart.filter(item => item.id !== productId);
    });
  };
  
  // Update product quantity
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    toast({
      title: "Cart cleared",
      description: "All items removed from your cart",
      duration: 2000,
    });
  };
  
  // Generate WhatsApp order link
  const generateWhatsAppOrderLink = (customerInfo?: CustomerInfo) => {
    const phoneNumber = "919951690420";
    
    // Create order message
    let orderText = "Hello, I would like to order the following items:\n\n";
    
    cart.forEach((item, index) => {
      orderText += `${index + 1}. ${item.name} (${item.unit}) x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    
    orderText += `\nSubtotal: ₹${subtotalAmount.toFixed(2)}`;
    
    // Add coupon information if applied
    if (appliedCoupon) {
      orderText += `\nCoupon Applied: ${appliedCoupon.code}`;
      orderText += `\nDiscount: ₹${discountAmount.toFixed(2)}`;
      orderText += `\n${appliedCoupon.successMessage}`;
    }
    
    orderText += `\nTotal Amount: ₹${totalAmount.toFixed(2)}`;

    // Add customer information if provided
    if (customerInfo) {
      orderText += `\n\n--- Customer Information ---\n`;
      orderText += `Name: ${customerInfo.name}\n`;
      orderText += `Phone: ${customerInfo.phone}\n`;
      orderText += `Delivery Address: ${customerInfo.address}`;
    }
    
    // Encode the text for URL
    const encodedText = encodeURIComponent(orderText);
    
    return `https://wa.me/${phoneNumber}?text=${encodedText}`;
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
      subtotalAmount,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      discountAmount,
      generateWhatsAppOrderLink
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
