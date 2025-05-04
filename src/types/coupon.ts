
export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  successMessage: string;
  usageLimit: number;
  usageCount: number;
  expiryDate: string; // ISO date string
  isActive: boolean;
}
