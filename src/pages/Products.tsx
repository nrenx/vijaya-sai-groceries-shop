
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import WhatsAppBanner from '@/components/WhatsAppBanner';
import { Category, Product } from '@/types';
import { productService } from '@/services';
import { Loader2 } from 'lucide-react';

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      // Set a timeout to ensure we don't get stuck in loading state
      const timeoutId = setTimeout(() => {
        console.log('Products - Fetch timed out, showing error state');
        setIsLoading(false);
        setError('Connection timed out. Please try again later.');
      }, 10000); // 10 second timeout

      try {
        setIsLoading(true);
        console.log('Products - Fetching products from Supabase...');
        const productsData = await productService.getProducts();

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);

        console.log('Products loaded:', productsData?.length || 0, 'products');

        if (productsData && productsData.length > 0) {
          setProducts(productsData);

          // Extract unique categories
          const uniqueCategories = ['All', ...Array.from(
            new Set(productsData.map(product => product.category))
          )] as Category[];

          setCategories(uniqueCategories);
          setError(null);
        } else {
          console.log('Products - No products found or empty array returned');
          setError('No products found. The store may be updating its inventory.');
        }
      } catch (err) {
        // Clear the timeout since we got a response (an error)
        clearTimeout(timeoutId);

        console.error('Error fetching products:', err);
        if (err instanceof Error) {
          console.log('Error name:', err.name);
          console.log('Error message:', err.message);
          console.log('Error stack:', err.stack);
        }
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    // Set up real-time subscription
    console.log('Products - Setting up real-time subscription');
    const subscription = productService.subscribeToProducts(() => {
      console.log('Products - Real-time update received, fetching products again');
      fetchProducts();
    });

    // Clean up subscription on unmount
    return () => {
      console.log('Products - Cleaning up real-time subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Filter products when category changes or products update
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  return (
    <Layout>
      <div className="vs-container py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
          <p className="text-gray-600 mt-2">Browse our selection of quality groceries</p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-vs-purple mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-16">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              This could be due to a database connection issue. You can try again or continue browsing with sample products.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-vs-purple text-white rounded-md hover:bg-vs-purple/90"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  // Import sample products
                  import('@/data/products').then(module => {
                    console.log('Using sample products as fallback');
                    setProducts(module.products);
                    setError(null);

                    // Extract unique categories from sample products
                    const uniqueCategories = ['All', ...Array.from(
                      new Set(module.products.map(product => product.category))
                    )] as Category[];

                    setCategories(uniqueCategories);
                  });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Use Sample Products
              </button>
            </div>
          </div>
        )}

        {/* Content when loaded successfully */}
        {!isLoading && !error && (
          <>
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
          </>
        )}
      </div>

      <WhatsAppBanner />
    </Layout>
  );
};

export default Products;
