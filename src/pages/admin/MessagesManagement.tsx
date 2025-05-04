
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, MessageSquare } from 'lucide-react';
import { CustomerMessage } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const MessagesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<CustomerMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messageSource, setMessageSource] = useState<'All' | 'WhatsApp' | 'Website'>('All');
  
  // Mock data for messages
  const messages: CustomerMessage[] = [
    { 
      id: 'MSG-001', 
      customerName: 'Rajesh Kumar', 
      customerPhone: '+91 9876543210',
      message: 'I want to check if Basmati rice is available?',
      source: 'WhatsApp',
      createdAt: '2025-05-01T10:35:00Z',
      read: true
    },
    { 
      id: 'MSG-002', 
      customerName: 'Sneha Verma',
      customerPhone: '+91 9876543211', 
      message: 'When will you restock sunflower oil? I need 2 bottles for next week.',
      source: 'Website',
      createdAt: '2025-05-02T08:15:00Z',
      read: false
    },
    { 
      id: 'MSG-003', 
      customerName: 'Vikram Singh',
      customerPhone: '+91 9876543212',
      message: 'Do you have organic lentils? Looking for a 5kg pack for a family function.',
      source: 'WhatsApp',
      createdAt: '2025-05-02T14:22:00Z',
      read: false
    },
    { 
      id: 'MSG-004', 
      customerName: 'Anita Gupta',
      customerPhone: '+91 9876543213',
      message: 'I want to place a bulk order for my restaurant. Please let me know what discounts are available for orders above ₹5000.',
      source: 'Website',
      createdAt: '2025-05-03T09:45:00Z',
      read: true
    },
    { 
      id: 'MSG-005', 
      customerName: 'Kumar Patel',
      customerPhone: '+91 9876543214',
      message: 'Are you open on Sunday? I need to pickup some groceries.',
      source: 'WhatsApp',
      createdAt: '2025-05-03T18:05:00Z',
      read: false
    },
  ];

  // Filter messages based on search term and source
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.customerPhone.includes(searchTerm);
    
    const matchesSource = messageSource === 'All' || message.source === messageSource;
    
    return matchesSearch && matchesSource;
  });

  const handleViewMessage = (message: CustomerMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Messages</h1>
        <p className="text-gray-600">Manage and respond to customer inquiries</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center">
          <select 
            className="rounded-md border border-input bg-background px-3 py-2 text-sm" 
            value={messageSource}
            onChange={e => setMessageSource(e.target.value as any)}
          >
            <option value="All">All Sources</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Website">Website</option>
          </select>
          <Button variant="outline" size="sm" className="ml-2">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id} className={!message.read ? "bg-vs-purple/5" : ""}>
                      <TableCell>
                        <div className="font-medium">{message.customerName}</div>
                        <div className="text-xs text-gray-500">{message.customerPhone}</div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{message.message}</TableCell>
                      <TableCell>
                        <Badge variant={message.source === 'WhatsApp' ? 'default' : 'secondary'}>
                          {message.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(message.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={message.read ? 'outline' : 'default'} className={message.read ? 'bg-gray-100' : 'bg-vs-purple text-white'}>
                          {message.read ? 'Read' : 'New'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No messages found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isDialogOpen && selectedMessage && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Message from {selectedMessage.customerName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Badge variant={selectedMessage.source === 'WhatsApp' ? 'default' : 'secondary'}>
                  {selectedMessage.source}
                </Badge>
                <span className="text-sm text-gray-500">{formatDate(selectedMessage.createdAt)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium">Contact:</div>
                <div className="text-sm">{selectedMessage.customerPhone}</div>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium">Message:</div>
                <div className="bg-gray-50 p-4 rounded-md text-gray-700">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => window.open(`https://wa.me/${selectedMessage.customerPhone.replace(/\s+/g, '')}`, '_blank')}
              >
                Reply via WhatsApp
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default MessagesManagement;
