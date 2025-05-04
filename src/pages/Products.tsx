
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import WhatsAppBanner from '@/components/WhatsAppBanner';
import { products } from '@/data/products';
import { Category } from '@/types';

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  // Extract unique categories from products
  const categories: Category[] = ['All', ...Array.from(
    new Set(products.map(product => product.category))
  )] as Category[];
  
  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory]);
  
  return (
    <Layout>
      <div className="vs-container py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
          <p className="text-gray-600 mt-2">Browse our selection of quality groceries</p>
        </div>
        
        {/* Category filter - scrollable on mobile */}
        <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="inline-flex md:flex md:flex-wrap min-w-full">
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>
        
        {/* Products grid - adaptive columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600">No products found in this category.</p>
          </div>
        )}
      </div>
      
      <WhatsAppBanner />
    </Layout>
  );
};

export default Products;
