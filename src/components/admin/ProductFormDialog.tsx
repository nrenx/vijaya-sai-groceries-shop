
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Product } from '@/types';
import { ImagePlus, X, Trash2, AlertTriangle, ChevronDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { storageService } from '@/services';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProductFormDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: string[];
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  categories
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    image: '/placeholder.svg',
    category: '',
    description: '',
    unit: '',
    stock: 0
  });

  const [customCategory, setCustomCategory] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    // Update available categories
    setAvailableCategories(categories);

    if (product) {
      setFormData({ ...product });
      setImagePreview(product.image);
    } else {
      setFormData({
        name: '',
        price: 0,
        image: '/placeholder.svg',
        category: categories[0] || '',
        description: '',
        unit: '',
        stock: 0
      });
      setImagePreview('/placeholder.svg');
    }
  }, [product, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Convert numeric fields
    if (name === 'price' || name === 'stock') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create image preview URL for immediate display
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setSelectedFile(file);

      toast({
        title: "Image selected",
        description: "Image will be uploaded when you save the product",
        duration: 2000,
      });
    }
  };

  const uploadImageToSupabase = async (): Promise<string> => {
    if (!selectedFile) {
      // If no new file was selected, return the existing image URL
      return formData.image || '/placeholder.svg';
    }

    try {
      setIsUploading(true);

      // Upload the file to Supabase Storage
      const imageUrl = await storageService.uploadProductImage(selectedFile);

      // Clean up the object URL to prevent memory leaks
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }

      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Using placeholder instead.",
        variant: "destructive",
        duration: 3000,
      });
      return '/placeholder.svg';
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory && !availableCategories.includes(customCategory)) {
      const newCategories = [...availableCategories, customCategory];
      setAvailableCategories(newCategories);
      setFormData({ ...formData, category: customCategory });
      setCustomCategory('');
      toast({
        title: "Category added",
        description: `New category "${customCategory}" has been created`,
        duration: 2000,
      });
    }
  };

  const handleDeleteCategory = (category: string) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      // Don't allow deleting the last category
      if (availableCategories.length <= 1) {
        toast({
          title: "Cannot delete",
          description: "You must keep at least one category",
          variant: "destructive",
          duration: 2000,
        });
        setIsDeleteDialogOpen(false);
        return;
      }

      const updatedCategories = availableCategories.filter(c => c !== categoryToDelete);
      setAvailableCategories(updatedCategories);

      // If the currently selected category is being deleted, select the first available
      if (formData.category === categoryToDelete) {
        setFormData({ ...formData, category: updatedCategories[0] });
      }

      toast({
        title: "Category deleted",
        description: `Category "${categoryToDelete}" has been removed`,
        duration: 2000,
      });

      setIsDeleteDialogOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form data
    if (!formData.name || !formData.category || !formData.unit) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    try {
      // Upload image to Supabase Storage if a new file was selected
      if (selectedFile) {
        const imageUrl = await uploadImageToSupabase();

        // Update the form data with the new image URL
        setFormData(prev => ({ ...prev, image: imageUrl }));

        // Save the product with the new image URL
        onSave({ ...formData, image: imageUrl } as Product);
      } else {
        // No new image, just save the product as is
        onSave(formData as Product);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Image upload section */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">Image</Label>
                <div className="col-span-3">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center relative">
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                      )}
                      {imagePreview && (
                        <img src={imagePreview} alt="Product preview" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Choose Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>

              {/* Enhanced Category Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <div className="col-span-3 space-y-2">
                  {/* Custom dropdown with delete icons */}
                  <div className="relative">
                    <div
                      className="flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span>{formData.category || 'Select Category'}</span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 rounded-md border bg-popover shadow-md animate-in fade-in-80 zoom-in-95">
                        <div className="max-h-60 overflow-auto p-1">
                          {availableCategories.map(category => (
                            <div
                              key={category}
                              className="flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
                            >
                              <div
                                className="flex-1"
                                onClick={() => {
                                  setFormData({ ...formData, category });
                                  setIsDropdownOpen(false);
                                }}
                              >
                                {category}
                              </div>
                              <button
                                type="button"
                                className="p-1 hover:bg-red-100 rounded-full text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCategory(category);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="p-2 border-t">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add new category"
                              value={customCategory}
                              onChange={(e) => setCustomCategory(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddCustomCategory();
                              }}
                              disabled={!customCategory}
                              className="whitespace-nowrap"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="e.g. 1 kg, 500g, 1L"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock || 0}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="col-span-3 min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete category confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                Are you sure you want to delete the category <strong>{categoryToDelete}</strong>?
                This will remove it from all category selections.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCategory}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductFormDialog;
