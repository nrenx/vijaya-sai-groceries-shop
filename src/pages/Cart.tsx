
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Minus, Trash, AlertTriangle, CheckCircle, Tag, X } from 'lucide-react';
import CheckoutForm from '@/components/CheckoutForm';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

const CartContent: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotalAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    generateWhatsAppOrderLink,
    clearCart
  } = useCart();
  
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [couponCode, setCouponCode] = useState('');

  // Handle quantity change
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  // Handle checkout form submission
  const handleCheckoutSubmit = (data: CustomerInfo) => {
    setCustomerInfo(data);
    setIsCheckoutFormOpen(false);
    
    // Open WhatsApp with customer info included
    const whatsappLink = generateWhatsAppOrderLink(data);
    window.open(whatsappLink, '_blank');
  };

  // Open checkout form
  const handleOpenCheckout = () => {
    setIsCheckoutFormOpen(true);
  };

  // Handle apply coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
    }
  };
  
  // Reset coupon code field when coupon is applied
  React.useEffect(() => {
    if (appliedCoupon) {
      setCouponCode('');
    }
  }, [appliedCoupon]);

  // Determine delivery message based on cart total
  const getDeliveryMessage = () => {
    if (totalAmount < 999) {
      return {
        text: "Your cart total is below ₹999. Delivery charges may apply.",
        icon: <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />,
        className: "bg-amber-50 text-amber-700"
      };
    } else {
      return {
        text: "Congratulations! You are eligible for free home delivery.",
        icon: <CheckCircle className="h-4 w-4 text-green-500 mr-2" />,
        className: "bg-green-50 text-green-700"
      };
    }
  };

  const deliveryMessage = getDeliveryMessage();

  // Mobile cart item component for better responsiveness
  const MobileCartItem = ({ item }: { item: any }) => (
    <div className="border-b p-4" key={item.id}>
      <div className="flex items-center mb-3">
        <div className="h-14 w-14 bg-gray-100 rounded-md overflow-hidden mr-3">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">{item.unit}</div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm font-medium">₹{item.price}</div>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-l-md" 
            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="px-3 py-1 border-t border-b h-8 flex items-center justify-center min-w-[40px] bg-white">
            {item.quantity}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-r-md" 
            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => removeFromCart(item.id)} 
            className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50" 
            aria-label="Remove item"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-2 text-right text-sm font-medium text-gray-900">
        Total: ₹{(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );

  return (
    <div className="vs-container py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products">
            <Button className="bg-primary hover:bg-primary/90 text-white">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Desktop View - Only visible on tablet and larger screens */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-14 w-14 bg-gray-100 rounded-md overflow-hidden">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.unit}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-md" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 border-t border-b h-8 flex items-center justify-center min-w-[40px] bg-white">
                            {item.quantity}
                          </span>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-md" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} aria-label="Increase quantity">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50" aria-label="Remove item">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile View - Only visible on small screens */}
            <div className="md:hidden bg-white rounded-lg shadow-md overflow-hidden">
              {cart.map(item => (
                <MobileCartItem item={item} key={item.id} />
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button variant="outline" className="text-red-500 hover:bg-red-50" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
              
              {/* Coupon Code Input */}
              {!appliedCoupon ? (
                <div className="mb-4">
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <div className="relative flex-grow">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Enter coupon code" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)} 
                        className="pl-9"
                      />
                    </div>
                    <Button type="submit" variant="outline" size="sm" disabled={!couponCode.trim()}>
                      Apply
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-md mb-4">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">{appliedCoupon.code}</p>
                      <p className="text-xs text-green-600">{appliedCoupon.successMessage}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoupon} className="h-6 w-6 p-0 rounded-full">
                    <X className="h-4 w-4 text-green-700" />
                  </Button>
                </div>
              )}
              
              {/* Mobile Order Summary Items - shown in mobile only */}
              <div className="md:hidden space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <div>
                      {item.name} <span className="text-gray-500">× {item.quantity}</span>
                    </div>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              {/* Desktop Order Summary Items - hidden in mobile */}
              <div className="hidden md:block space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500"> × {item.quantity}</span>
                    </div>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotalAmount.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>
                
                <div className={`p-3 rounded-md mt-2 flex items-center ${deliveryMessage.className}`}>
                  {deliveryMessage.icon}
                  <p className="text-sm font-medium">{deliveryMessage.text}</p>
                </div>
              </div>
              
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 h-auto mt-4" onClick={handleOpenCheckout}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Proceed to Buy via WhatsApp
              </Button>
              
              <div className="mt-4">
                <Link to="/products" className="text-primary hover:underline block text-center">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <CheckoutForm 
        isOpen={isCheckoutFormOpen}
        onClose={() => setIsCheckoutFormOpen(false)}
        onSubmit={handleCheckoutSubmit}
      />
    </div>
  );
};

// Create a separate Cart component that's wrapped by Layout component
const Cart: React.FC = () => {
  return (
    <Layout>
      <CartContent />
    </Layout>
  );
};

export default Cart;
