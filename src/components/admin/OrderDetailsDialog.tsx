
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order, OrderStatus } from '@/types';

interface OrderDetailsDialogProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
  onStatusChange
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details - {order.id}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
            <p className="mt-1 font-medium">{order.customerName}</p>
            <p>{order.customerPhone}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
            <div className="flex items-center mt-1">
              <span className="font-medium mr-2">Status:</span>
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            <p><span className="font-medium">Created:</span> {formatDate(order.createdAt)}</p>
            <p><span className="font-medium">Last Updated:</span> {formatDate(order.updatedAt)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-2">
                          <img className="h-10 w-10 rounded-full" src={item.image} alt={item.name} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      ₹{item.price}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                    Total Amount:
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">
                    ₹{order.totalAmount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <DialogFooter>
          {order.status === 'Pending' && (
            <>
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
                onClick={() => {
                  onStatusChange(order.id, 'Processing');
                  onClose();
                }}
              >
                Mark as Processing
              </Button>
              <Button 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => {
                  onStatusChange(order.id, 'Cancelled');
                  onClose();
                }}
              >
                Cancel Order
              </Button>
            </>
          )}
          {order.status === 'Processing' && (
            <>
              <Button 
                variant="outline" 
                className="border-green-500 text-green-500 hover:bg-green-50"
                onClick={() => {
                  onStatusChange(order.id, 'Delivered');
                  onClose();
                }}
              >
                Mark as Delivered
              </Button>
              <Button 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => {
                  onStatusChange(order.id, 'Cancelled');
                  onClose();
                }}
              >
                Cancel Order
              </Button>
            </>
          )}
          <Button 
            variant="default"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
