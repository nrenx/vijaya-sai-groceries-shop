import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

// Cache for products
let productsCache: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const productService = {
  /**
   * Get all products with caching
   */
  async getProducts(): Promise<Product[]> {
    console.log('getProducts called');
    const now = Date.now();

    // Return cached products if available and not expired
    if (productsCache && (now - lastFetchTime < CACHE_DURATION)) {
      console.log('Using cached products');
      return productsCache;
    }

    console.log('Fetching products from Supabase...');

    try {
      // Create a promise that times out after 8 seconds
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Supabase query timed out after 8 seconds'));
        }, 8000);
      });

      // Fetch products from Supabase with timeout
      const fetchPromise = supabase
        .from('products')
        .select('*')
        .order('name');

      // Race the fetch against the timeout
      const { data, error } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('Error fetching products:', error);
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
        console.log('Error details:', error.details);
        throw error;
      }

      if (!data) {
        console.error('No data returned from Supabase');
        throw new Error('No data returned from Supabase');
      }

      console.log('Products fetched successfully:', data?.length || 0, 'products');

      // Transform and cache the products
      const products = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        description: item.description || undefined,
        unit: item.unit,
        stock: item.stock || undefined
      }));

      productsCache = products;
      lastFetchTime = now;

      return products;
    } catch (err) {
      console.error('Exception in getProducts:', err);
      if (err instanceof Error) {
        console.log('Error name:', err.name);
        console.log('Error message:', err.message);
        console.log('Error stack:', err.stack);
      }

      // If we have cached products, return them even if they're expired
      if (productsCache) {
        console.log('Returning expired cached products due to error');
        return productsCache;
      }

      throw err;
    }
  },

  /**
   * Get products with pagination
   */
  async getProductsPaginated(page: number = 1, pageSize: number = 20): Promise<{
    products: Product[];
    totalCount: number;
  }> {
    // Calculate range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Fetch products with pagination
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('name')
      .range(from, to);

    if (error) {
      console.error('Error fetching products with pagination:', error);
      throw error;
    }

    // Transform the products
    const products = data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description || undefined,
      unit: item.unit,
      stock: item.stock || undefined
    }));

    return {
      products,
      totalCount: count || 0
    };
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('name');

    if (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description || undefined,
      unit: item.unit,
      stock: item.stock || undefined
    }));
  },

  /**
   * Get a product by ID
   */
  async getProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 means no rows returned
        return null;
      }

      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.image,
      category: data.category,
      description: data.description || undefined,
      unit: data.unit,
      stock: data.stock || undefined
    };
  },

  /**
   * Create a new product
   */
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    // Clear the cache before creating a new product
    productsCache = null;
    lastFetchTime = 0;

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        unit: product.unit,
        stock: product.stock || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.image,
      category: data.category,
      description: data.description || undefined,
      unit: data.unit,
      stock: data.stock || undefined
    };
  },

  /**
   * Update an existing product
   */
  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    // Clear the cache before updating the product
    productsCache = null;
    lastFetchTime = 0;

    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        unit: product.unit,
        stock: product.stock,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.image,
      category: data.category,
      description: data.description || undefined,
      unit: data.unit,
      stock: data.stock || undefined
    };
  },

  /**
   * Delete a product
   */
  async deleteProduct(id: number): Promise<void> {
    // Clear the cache before deleting the product
    productsCache = null;
    lastFetchTime = 0;

    // First, get the product to get its image URL
    const product = await this.getProductById(id);

    // Delete the product from the database
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }

    // If the product has an image and it's stored in Supabase Storage, delete it
    if (product && product.image && product.image.includes('supabase.co')) {
      try {
        // Import dynamically to avoid circular dependencies
        const { storageService } = await import('./storageService');
        await storageService.deleteProductImage(product.image);
      } catch (imageError) {
        console.error(`Error deleting image for product ${id}:`, imageError);
        // Don't throw here, as the product was already deleted successfully
      }
    }
  },

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('category');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  },

  /**
   * Subscribe to product changes
   */
  subscribeToProducts(callback: () => void) {
    // Create a handler that invalidates the cache and calls the callback
    const handleChange = () => {
      // Invalidate the cache
      productsCache = null;
      lastFetchTime = 0;

      // Call the provided callback
      callback();
    };

    return supabase
      .channel('products-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, handleChange)
      .subscribe();
  },

  /**
   * Clear the products cache
   */
  clearCache() {
    productsCache = null;
    lastFetchTime = 0;
  }
};
