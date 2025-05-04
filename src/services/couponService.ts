import { supabase } from '@/lib/supabase';
import { Coupon } from '@/types/coupon';

export const couponService = {
  /**
   * Get all coupons
   */
  async getCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
    
    return data.map(coupon => ({
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discount_type as 'percentage' | 'flat',
      discountValue: coupon.discount_value,
      successMessage: coupon.success_message,
      usageLimit: coupon.usage_limit,
      usageCount: coupon.usage_count,
      expiryDate: coupon.expiry_date,
      isActive: coupon.is_active
    }));
  },
  
  /**
   * Get a coupon by code
   */
  async getCouponByCode(code: string): Promise<Coupon | null> {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching coupon with code ${code}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      code: data.code,
      discountType: data.discount_type as 'percentage' | 'flat',
      discountValue: data.discount_value,
      successMessage: data.success_message,
      usageLimit: data.usage_limit,
      usageCount: data.usage_count,
      expiryDate: data.expiry_date,
      isActive: data.is_active
    };
  },
  
  /**
   * Create a new coupon
   */
  async createCoupon(coupon: Omit<Coupon, 'id'>): Promise<Coupon> {
    const { data, error } = await supabase
      .from('coupons')
      .insert([{
        code: coupon.code.toUpperCase(),
        discount_type: coupon.discountType,
        discount_value: coupon.discountValue,
        success_message: coupon.successMessage,
        usage_limit: coupon.usageLimit,
        usage_count: coupon.usageCount || 0,
        expiry_date: coupon.expiryDate,
        is_active: coupon.isActive !== undefined ? coupon.isActive : true,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
    
    return {
      id: data.id,
      code: data.code,
      discountType: data.discount_type as 'percentage' | 'flat',
      discountValue: data.discount_value,
      successMessage: data.success_message,
      usageLimit: data.usage_limit,
      usageCount: data.usage_count,
      expiryDate: data.expiry_date,
      isActive: data.is_active
    };
  },
  
  /**
   * Update an existing coupon
   */
  async updateCoupon(id: string, coupon: Partial<Coupon>): Promise<Coupon> {
    const updates: any = {};
    
    if (coupon.code !== undefined) updates.code = coupon.code.toUpperCase();
    if (coupon.discountType !== undefined) updates.discount_type = coupon.discountType;
    if (coupon.discountValue !== undefined) updates.discount_value = coupon.discountValue;
    if (coupon.successMessage !== undefined) updates.success_message = coupon.successMessage;
    if (coupon.usageLimit !== undefined) updates.usage_limit = coupon.usageLimit;
    if (coupon.usageCount !== undefined) updates.usage_count = coupon.usageCount;
    if (coupon.expiryDate !== undefined) updates.expiry_date = coupon.expiryDate;
    if (coupon.isActive !== undefined) updates.is_active = coupon.isActive;
    
    const { data, error } = await supabase
      .from('coupons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating coupon with ID ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      code: data.code,
      discountType: data.discount_type as 'percentage' | 'flat',
      discountValue: data.discount_value,
      successMessage: data.success_message,
      usageLimit: data.usage_limit,
      usageCount: data.usage_count,
      expiryDate: data.expiry_date,
      isActive: data.is_active
    };
  },
  
  /**
   * Delete a coupon
   */
  async deleteCoupon(id: string): Promise<void> {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting coupon with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Validate a coupon code
   */
  async validateCoupon(code: string): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> {
    const coupon = await this.getCouponByCode(code);
    
    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code' };
    }
    
    // Check if coupon is active
    if (!coupon.isActive) {
      return { valid: false, message: 'This coupon is no longer active' };
    }
    
    // Check if coupon has expired
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    
    if (now > expiryDate) {
      return { valid: false, message: 'This coupon has expired' };
    }
    
    // Check if usage limit has been reached
    if (coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: 'This coupon has reached its usage limit' };
    }
    
    return { valid: true, coupon };
  },
  
  /**
   * Increment coupon usage count
   */
  async incrementCouponUsage(id: string): Promise<void> {
    const { data: coupon, error: fetchError } = await supabase
      .from('coupons')
      .select('usage_count')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error(`Error fetching coupon with ID ${id}:`, fetchError);
      throw fetchError;
    }
    
    const { error: updateError } = await supabase
      .from('coupons')
      .update({ usage_count: coupon.usage_count + 1 })
      .eq('id', id);
    
    if (updateError) {
      console.error(`Error incrementing usage count for coupon ${id}:`, updateError);
      throw updateError;
    }
  },
  
  /**
   * Subscribe to coupon changes
   */
  subscribeToCoupons(callback: () => void) {
    return supabase
      .channel('coupons-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'coupons' 
      }, callback)
      .subscribe();
  }
};
