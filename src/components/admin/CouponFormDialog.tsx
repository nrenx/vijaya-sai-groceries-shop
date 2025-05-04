import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Coupon } from '@/types/coupon';
import { useToast } from '@/hooks/use-toast';

interface CouponFormDialogProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: Coupon) => void;
}

const CouponFormDialog: React.FC<CouponFormDialogProps> = ({
  coupon,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    successMessage: '',
    usageLimit: 100,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    isActive: true
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (coupon) {
      setFormData({
        ...coupon,
        expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0] // Format date for input
      });
    } else {
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        successMessage: '',
        usageLimit: 100,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        isActive: true
      });
    }
  }, [coupon]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convert numeric fields
    if (type === 'number') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name === 'isActive') {
      // Convert string to boolean for isActive field
      setFormData({ ...formData, [name]: value === "active" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.code || !formData.successMessage || !formData.expiryDate) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    // Convert expiry date from input format back to ISO string
    const expiryDateWithTime = new Date(formData.expiryDate as string);
    expiryDateWithTime.setHours(23, 59, 59, 999); // Set to end of day
    
    const couponData: Coupon = {
      id: coupon?.id || '',
      code: (formData.code as string).toUpperCase(), // Convert to uppercase
      discountType: formData.discountType as 'percentage' | 'flat',
      discountValue: formData.discountValue as number,
      successMessage: formData.successMessage as string,
      usageLimit: formData.usageLimit as number,
      usageCount: coupon?.usageCount || 0,
      expiryDate: expiryDateWithTime.toISOString(),
      isActive: formData.isActive as boolean
    };
    
    onSave(couponData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{coupon ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Coupon Code*
              </Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="col-span-3 uppercase"
                placeholder="e.g. SUMMER10"
                maxLength={15}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountType" className="text-right">
                Discount Type*
              </Label>
              <div className="col-span-3">
                <Select 
                  value={formData.discountType as string} 
                  onValueChange={(value) => handleSelectChange(value, 'discountType')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountValue" className="text-right">
                Discount Value*
              </Label>
              <Input
                id="discountValue"
                name="discountValue"
                type="number"
                min={formData.discountType === 'percentage' ? 1 : 5}
                max={formData.discountType === 'percentage' ? 100 : 1000}
                value={formData.discountValue}
                onChange={handleChange}
                className="col-span-3"
                required
              />
              <div className="col-span-4 col-start-2 text-sm text-gray-500">
                {formData.discountType === 'percentage' 
                  ? 'Enter a percentage between 1-100%' 
                  : 'Enter an amount in Rupees'}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="successMessage" className="text-right">
                Success Message*
              </Label>
              <Textarea
                id="successMessage"
                name="successMessage"
                value={formData.successMessage}
                onChange={handleChange}
                className="col-span-3 min-h-[80px]"
                placeholder="e.g. You got 10% off on your order!"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usageLimit" className="text-right">
                Usage Limit
              </Label>
              <Input
                id="usageLimit"
                name="usageLimit"
                type="number"
                min={1}
                value={formData.usageLimit}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDate" className="text-right">
                Expiry Date*
              </Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate as string}
                onChange={handleChange}
                className="col-span-3"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select 
                  value={formData.isActive ? "active" : "inactive"} 
                  onValueChange={(value) => handleSelectChange(value, 'isActive')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CouponFormDialog;
