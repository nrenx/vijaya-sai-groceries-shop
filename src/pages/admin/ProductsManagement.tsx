
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Product } from '@/types';
import { Edit, Trash2, Plus, Search, Filter, ChevronDown, Loader2 } from 'lucide-react';
import ProductFormDialog from '@/components/admin/ProductFormDialog';
import { productService } from '@/services';
import { useToast } from '@/hooks/use-toast';

const ProductsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'tabs' | 'accordion'>('tabs');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await productService.getProducts();
        setProducts(productsData);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(productsData.map(product => product.category))
        );

        setAvailableCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    // Set up real-time subscription
    const subscription = productService.subscribeToProducts(() => {
      fetchProducts();
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get products grouped by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Filter by search term
  const filteredProductsByCategory = Object.keys(productsByCategory).reduce((acc, category) => {
    const filteredProducts = productsByCategory[category].filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredProducts.length > 0) {
      acc[category] = filteredProducts;
    }

    return acc;
  }, {} as Record<string, Product[]>);

  // Handle add product
  const handleAddProduct = () => {
    setProductToEdit(null);
    setIsDialogOpen(true);
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsDialogOpen(true);
  };

  // Handle delete product
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete product. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  // Handle save product
  const handleSaveProduct = async (product: Product) => {
    try {
      // Update available categories if there's a new category
      if (product.category && !availableCategories.includes(product.category)) {
        setAvailableCategories([...availableCategories, product.category]);
      }

      if (product.id) {
        // Edit existing product
        await productService.updateProduct(product.id, product);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        // Add new product
        await productService.createProduct(product);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Get all categories for filter dropdown (including 'All')
  const filterCategories = ['All', ...availableCategories];

  // Render product table
  const renderProductTable = (products: Product[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length > 0 ? (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>₹{product.price}</TableCell>
              <TableCell>{product.unit}</TableCell>
              <TableCell>
                <span className={`font-medium ${
                  (product.stock || 0) < 10 ? 'text-red-600' :
                  (product.stock || 0) < 30 ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {product.stock || 0}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              No products found matching your criteria
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <p className="text-gray-600">Add, edit or remove products from inventory</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
            disabled={isLoading}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'tabs' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('tabs')}
            className="px-3"
            disabled={isLoading}
          >
            Tabs
          </Button>
          <Button
            variant={viewMode === 'accordion' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('accordion')}
            className="px-3"
            disabled={isLoading}
          >
            Accordion
          </Button>
        </div>

        <Button onClick={handleAddProduct} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            This could be due to a database connection issue. You can try again or continue with sample data.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Load sample products as fallback
                const sampleProducts = [
                  {
                    id: 1,
                    name: "Basmati Rice",
                    price: 120,
                    image: "/placeholder.svg",
                    category: "Grains",
                    description: "Premium quality basmati rice",
                    unit: "1 kg",
                    stock: 50
                  },
                  {
                    id: 2,
                    name: "Sunflower Oil",
                    price: 150,
                    image: "/placeholder.svg",
                    category: "Oils",
                    description: "Pure sunflower cooking oil",
                    unit: "1 L",
                    stock: 30
                  },
                  {
                    id: 3,
                    name: "Wheat Flour",
                    price: 60,
                    image: "/placeholder.svg",
                    category: "Grains",
                    description: "Stone-ground wheat flour",
                    unit: "1 kg",
                    stock: 40
                  }
                ];
                setProducts(sampleProducts);
                setAvailableCategories(['Grains', 'Oils']);
                setError(null);
                toast({
                  title: 'Sample Data Loaded',
                  description: 'Using sample data for demonstration. Changes will not be saved to the database.',
                  duration: 5000,
                });
              }}
            >
              Use Sample Data
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Note: When using sample data, changes will not be saved to the database.
          </p>
        </div>
      )}

      {/* Content when loaded successfully */}
      {!isLoading && !error && (
        viewMode === 'tabs' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Tabs defaultValue="All" value={selectedCategory} onValueChange={setSelectedCategory}>
              <div className="border-b px-4 overflow-x-auto">
                <TabsList className="w-auto inline-flex h-10">
                  <TabsTrigger value="All" className="px-4">
                    All Products
                    <Badge variant="outline" className="ml-2">
                      {products.length}
                    </Badge>
                  </TabsTrigger>
                  {availableCategories.map(category => (
                    <TabsTrigger key={category} value={category} className="px-4">
                      {category}
                      <Badge variant="outline" className="ml-2">
                        {productsByCategory[category]?.length || 0}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="All" className="border-0 p-0">
                <div className="border rounded-lg overflow-hidden">
                  {renderProductTable(filteredProducts)}
                </div>
              </TabsContent>

              {availableCategories.map(category => (
                <TabsContent key={category} value={category} className="border-0 p-0">
                  <div className="border rounded-lg overflow-hidden">
                    {renderProductTable(productsByCategory[category]?.filter(product =>
                      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    ) || [])}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ) : (
          <div className="space-y-4">
            <Accordion type="multiple" defaultValue={Object.keys(filteredProductsByCategory)}>
              {Object.keys(filteredProductsByCategory).length > 0 ? (
                Object.keys(filteredProductsByCategory).map((category) => (
                  <AccordionItem key={category} value={category} className="bg-white rounded-lg shadow overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-lg">{category}</span>
                          <Badge variant="outline">
                            {filteredProductsByCategory[category].length}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-0">
                      <div className="border-t">
                        {renderProductTable(filteredProductsByCategory[category])}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">No products found matching your criteria</p>
                </div>
              )}
            </Accordion>
          </div>
        )
      )}

      {isDialogOpen && (
        <ProductFormDialog
          product={productToEdit}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveProduct}
          categories={availableCategories}
        />
      )}
    </AdminLayout>
  );
};

export default ProductsManagement;
