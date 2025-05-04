
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import CouponFormDialog from '@/components/admin/CouponFormDialog';
import { Coupon } from '@/types/coupon';
import { useToast } from '@/hooks/use-toast';
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

// Initial demo coupons
const initialCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    successMessage: 'You received 10% off on your order!',
    usageLimit: 100,
    usageCount: 0,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    isActive: true
  },
  {
    id: '2',
    code: 'FREEDEL',
    discountType: 'flat',
    discountValue: 50,
    successMessage: 'You won free delivery!',
    usageLimit: 50,
    usageCount: 5,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    isActive: true
  }
];

const CouponsManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Load coupons from localStorage on component mount
  useEffect(() => {
    const savedCoupons = localStorage.getItem('vijaya-sai-coupons');
    if (savedCoupons) {
      try {
        setCoupons(JSON.parse(savedCoupons));
      } catch (error) {
        console.error('Failed to parse coupons data:', error);
        // Initialize with demo coupons if parsing fails
        setCoupons(initialCoupons);
        localStorage.setItem('vijaya-sai-coupons', JSON.stringify(initialCoupons));
      }
    } else {
      // Initialize with demo coupons if none exist
      setCoupons(initialCoupons);
      localStorage.setItem('vijaya-sai-coupons', JSON.stringify(initialCoupons));
    }
  }, []);

  // Save coupons to localStorage whenever they change
  useEffect(() => {
    if (coupons.length > 0) {
      localStorage.setItem('vijaya-sai-coupons', JSON.stringify(coupons));
    }
  }, [coupons]);

  // Filter coupons based on search term
  const filteredCoupons = coupons.filter((coupon) => {
    return coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.successMessage.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle add coupon
  const handleAddCoupon = () => {
    setCouponToEdit(null);
    setIsDialogOpen(true);
  };

  // Handle edit coupon
  const handleEditCoupon = (coupon: Coupon) => {
    setCouponToEdit(coupon);
    setIsDialogOpen(true);
  };

  // Handle delete coupon
  const handleDeleteCoupon = (id: string) => {
    setCouponToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete coupon
  const confirmDeleteCoupon = () => {
    if (couponToDelete) {
      setCoupons(coupons.filter(coupon => coupon.id !== couponToDelete));
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Coupon deleted",
        description: "The coupon has been deleted successfully",
        duration: 2000,
      });
    }
  };

  // Handle save coupon
  const handleSaveCoupon = (coupon: Coupon) => {
    if (couponToEdit) {
      // Edit existing coupon
      setCoupons(coupons.map(c => c.id === coupon.id ? coupon : c));
      toast({
        title: "Coupon updated",
        description: `Coupon "${coupon.code}" has been updated successfully`,
        duration: 2000,
      });
    } else {
      // Add new coupon
      const newCoupon = {
        ...coupon,
        id: String(Date.now()), // Simple ID generation
        usageCount: 0,
        isActive: true
      };
      setCoupons([...coupons, newCoupon]);
      toast({
        title: "Coupon created",
        description: `Coupon "${newCoupon.code}" has been created successfully`,
        duration: 2000,
      });
    }
    setIsDialogOpen(false);
  };

  // Format expiry date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if coupon is expired
  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Coupons Management</h1>
        <p className="text-gray-600">Create and manage discount coupons for your store</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search coupons..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button onClick={handleAddCoupon}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Success Message</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium uppercase">{coupon.code}</TableCell>
                  <TableCell>{coupon.discountType === 'percentage' ? 'Percentage' : 'Flat'}</TableCell>
                  <TableCell>
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}%` 
                      : `₹${coupon.discountValue}`
                    }
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{coupon.successMessage}</TableCell>
                  <TableCell>{`${coupon.usageCount} / ${coupon.usageLimit}`}</TableCell>
                  <TableCell>{formatDate(coupon.expiryDate)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        !coupon.isActive ? "outline" : 
                        isExpired(coupon.expiryDate) ? "destructive" : 
                        "default"
                      }
                    >
                      {!coupon.isActive ? "Inactive" : 
                       isExpired(coupon.expiryDate) ? "Expired" : 
                       "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditCoupon(coupon)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteCoupon(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No coupons found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isDialogOpen && (
        <CouponFormDialog 
          coupon={couponToEdit}
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveCoupon}
        />
      )}

      {/* Delete coupon confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this coupon? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCoupon}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Coupon
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default CouponsManagement;
