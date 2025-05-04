
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';

export const RecentOrders: React.FC = () => {
  // Mock data for recent orders
  const recentOrders = [
    { 
      id: 'ORD-001', 
      customerName: 'Arun Kumar', 
      amount: 560, 
      status: 'Delivered' as OrderStatus, 
      date: '2025-05-01' 
    },
    { 
      id: 'ORD-002', 
      customerName: 'Priya Singh', 
      amount: 890, 
      status: 'Pending' as OrderStatus, 
      date: '2025-05-02' 
    },
    { 
      id: 'ORD-003', 
      customerName: 'Ravi Patel', 
      amount: 320, 
      status: 'Processing' as OrderStatus, 
      date: '2025-05-02' 
    },
    { 
      id: 'ORD-004', 
      customerName: 'Neha Sharma', 
      amount: 1250, 
      status: 'Cancelled' as OrderStatus, 
      date: '2025-05-03' 
    },
  ];

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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>₹{order.amount}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
