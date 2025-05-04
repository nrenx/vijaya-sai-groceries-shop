
import React from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="vs-card group">
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800">{product.name}</h3>
        <div className="flex items-end justify-between mt-1">
          <div>
            <p className="text-sm text-gray-500">{product.unit}</p>
            <p className="font-semibold text-lg">₹{product.price}</p>
          </div>
          <Button 
            onClick={() => addToCart(product)} 
            size="sm" 
            className="bg-vs-purple hover:bg-vs-purple/90"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
