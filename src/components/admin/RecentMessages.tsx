
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export const RecentMessages: React.FC = () => {
  // Mock data for recent messages
  const recentMessages = [
    { 
      id: 'MSG-001', 
      customerName: 'Rajesh Kumar', 
      source: 'WhatsApp', 
      message: 'I want to check if Basmati rice is available?',
      date: '2025-05-01',
      read: true
    },
    { 
      id: 'MSG-002', 
      customerName: 'Sneha Verma', 
      source: 'Website', 
      message: 'When will you restock sunflower oil?',
      date: '2025-05-02',
      read: false
    },
    { 
      id: 'MSG-003', 
      customerName: 'Vikram Singh', 
      source: 'WhatsApp', 
      message: 'Do you have organic lentils?',
      date: '2025-05-02',
      read: false
    },
    { 
      id: 'MSG-004', 
      customerName: 'Anita Gupta', 
      source: 'Website', 
      message: 'I want to place a bulk order.',
      date: '2025-05-03',
      read: true
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentMessages.map((message) => (
            <TableRow key={message.id}>
              <TableCell className="font-medium">{message.customerName}</TableCell>
              <TableCell>
                <Badge variant={message.source === 'WhatsApp' ? 'default' : 'secondary'}>
                  {message.source}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">{message.message}</TableCell>
              <TableCell>{message.date}</TableCell>
              <TableCell>
                <Badge variant={message.read ? 'outline' : 'default'} className={message.read ? 'bg-gray-100' : 'bg-vs-purple text-white'}>
                  {message.read ? 'Read' : 'New'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
