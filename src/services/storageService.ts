import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const storageService = {
  /**
   * Upload an image to Supabase Storage
   */
  async uploadProductImage(file: File): Promise<string> {
    try {
      // Generate a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadProductImage:', error);
      throw error;
    }
  },
  
  /**
   * Delete an image from Supabase Storage
   */
  async deleteProductImage(imageUrl: string): Promise<void> {
    try {
      // Extract the file path from the URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const bucketName = pathParts[1]; // Usually 'product-images'
      const filePath = pathParts.slice(2).join('/');
      
      if (bucketName !== 'product-images') {
        console.warn('Not deleting image as it appears to be from a different source');
        return;
      }
      
      // Delete the file from Supabase Storage
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (error) {
        console.error('Error deleting image:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteProductImage:', error);
      throw error;
    }
  }
};
