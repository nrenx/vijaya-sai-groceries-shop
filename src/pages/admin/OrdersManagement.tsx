
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Order, OrderStatus } from '@/types';
import { Search, Filter, Eye, CheckSquare, XSquare } from 'lucide-react';
import { OrderDetailsDialog } from '@/components/admin/OrderDetailsDialog';

const OrdersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock orders data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'Arun Kumar',
      customerPhone: '+91 9876543210',
      totalAmount: 560,
      status: 'Delivered',
      createdAt: '2025-05-01T10:30:00',
      updatedAt: '2025-05-01T15:45:00',
      items: [
        { 
          id: 1, 
          name: 'Basmati Rice', 
          price: 120, 
          image: '/placeholder.svg', 
          category: 'Grains', 
          description: 'Premium quality basmati rice', 
          unit: '1 kg', 
          quantity: 2 
        },
        { 
          id: 4, 
          name: 'Turmeric Powder', 
          price: 45, 
          image: '/placeholder.svg', 
          category: 'Spices', 
          description: 'Organic turmeric powder', 
          unit: '100 g', 
          quantity: 1 
        },
      ]
    },
    {
      id: 'ORD-002',
      customerName: 'Priya Singh',
      customerPhone: '+91 9876543211',
      totalAmount: 890,
      status: 'Pending',
      createdAt: '2025-05-02T11:20:00',
      updatedAt: '2025-05-02T11:20:00',
      items: [
        { 
          id: 2, 
          name: 'Sunflower Oil', 
          price: 150, 
          image: '/placeholder.svg', 
          category: 'Oils', 
          description: 'Pure sunflower cooking oil', 
          unit: '1 L', 
          quantity: 2 
        },
        { 
          id: 5, 
          name: 'Potato Chips', 
          price: 30, 
          image: '/placeholder.svg', 
          category: 'Snacks', 
          description: 'Crispy potato chips', 
          unit: '100 g', 
          quantity: 3 
        },
      ]
    },
    {
      id: 'ORD-003',
      customerName: 'Ravi Patel',
      customerPhone: '+91 9876543212',
      totalAmount: 320,
      status: 'Processing',
      createdAt: '2025-05-02T15:40:00',
      updatedAt: '2025-05-02T16:10:00',
      items: [
        { 
          id: 9, 
          name: 'Coconut Oil', 
          price: 190, 
          image: '/placeholder.svg', 
          category: 'Oils', 
          description: 'Cold-pressed coconut oil', 
          unit: '500 ml', 
          quantity: 1 
        },
        { 
          id: 8, 
          name: 'Black Pepper', 
          price: 65, 
          image: '/placeholder.svg', 
          category: 'Spices', 
          description: 'Freshly ground black pepper', 
          unit: '50 g', 
          quantity: 2 
        },
      ]
    },
    {
      id: 'ORD-004',
      customerName: 'Neha Sharma',
      customerPhone: '+91 9876543213',
      totalAmount: 1250,
      status: 'Cancelled',
      createdAt: '2025-05-03T09:15:00',
      updatedAt: '2025-05-03T10:30:00',
      items: [
        { 
          id: 3, 
          name: 'Wheat Flour', 
          price: 60, 
          image: '/placeholder.svg', 
          category: 'Grains', 
          description: 'Stone-ground wheat flour', 
          unit: '1 kg', 
          quantity: 5 
        },
        { 
          id: 6, 
          name: 'Hand Soap', 
          price: 40, 
          image: '/placeholder.svg', 
          category: 'Soaps', 
          description: 'Aloe vera hand wash', 
          unit: '250 ml', 
          quantity: 2 
        },
        { 
          id: 10, 
          name: 'Dish Soap', 
          price: 50, 
          image: '/placeholder.svg', 
          category: 'Soaps', 
          description: 'Lemon dish washing liquid', 
          unit: '500 ml', 
          quantity: 1 
        },
      ]
    },
  ]);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } 
        : order
    ));
  };

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
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by order ID, customer name, or phone..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select 
            className="rounded-md border border-input bg-background px-3 py-2 text-sm" 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as OrderStatus | 'All')}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>₹{order.totalAmount}</TableCell>
                  <TableCell>
                    <div>
                      <div>{formatDate(order.createdAt).split(',')[0]}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(order.createdAt).split(',')[1]}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {order.status === 'Pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStatusChange(order.id, 'Processing')}
                        >
                          <CheckSquare className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                      {order.status === 'Processing' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStatusChange(order.id, 'Delivered')}
                        >
                          <CheckSquare className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {(order.status === 'Pending' || order.status === 'Processing') && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStatusChange(order.id, 'Cancelled')}
                        >
                          <XSquare className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No orders found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <OrderDetailsDialog 
          order={selectedOrder}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </AdminLayout>
  );
};

export default OrdersManagement;
