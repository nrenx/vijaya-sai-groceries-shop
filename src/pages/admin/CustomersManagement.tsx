
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Mail, Phone } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

const CustomersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Mock data for customers
  const customers: Customer[] = [
    {
      id: 1,
      name: 'Arun Kumar',
      email: 'arun.kumar@example.com',
      phone: '+91 9876543210',
      orders: 4,
      totalSpent: 2450,
      lastOrder: '2025-05-01',
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      phone: '+91 9876543211',
      orders: 2,
      totalSpent: 1280,
      lastOrder: '2025-05-02',
    },
    {
      id: 3,
      name: 'Ravi Patel',
      email: 'ravi.patel@example.com',
      phone: '+91 9876543212',
      orders: 3,
      totalSpent: 1920,
      lastOrder: '2025-05-02',
    },
    {
      id: 4,
      name: 'Neha Sharma',
      email: 'neha.sharma@example.com',
      phone: '+91 9876543213',
      orders: 5,
      totalSpent: 3200,
      lastOrder: '2025-05-03',
    },
    {
      id: 5,
      name: 'Sanjay Gupta',
      email: 'sanjay.gupta@example.com',
      phone: '+91 9876543214',
      orders: 1,
      totalSpent: 750,
      lastOrder: '2025-04-28',
    },
  ];

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-600">Manage and view customer information</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search customers by name, email or phone..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center">
          <Button variant="outline" size="sm" className="ml-2">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-2 text-gray-500" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-2 text-gray-500" />
                            <span className="text-sm">{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-800">
                          {customer.orders} orders
                        </Badge>
                      </TableCell>
                      <TableCell>₹{customer.totalSpent}</TableCell>
                      <TableCell>{customer.lastOrder}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No customers found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default CustomersManagement;
