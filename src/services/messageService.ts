import { supabase } from '@/lib/supabase';
import { CustomerMessage } from '@/types';

export const messageService = {
  /**
   * Get all customer messages
   */
  async getMessages(): Promise<CustomerMessage[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    
    return data.map(message => ({
      id: message.id,
      customerName: message.customer_name,
      customerPhone: message.customer_phone,
      message: message.message,
      source: message.source as 'WhatsApp' | 'Website',
      createdAt: message.created_at,
      read: message.read
    }));
  },
  
  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);
    
    if (error) {
      console.error('Error counting unread messages:', error);
      throw error;
    }
    
    return count || 0;
  },
  
  /**
   * Create a new message
   */
  async createMessage(message: Omit<CustomerMessage, 'id' | 'createdAt' | 'read'>): Promise<CustomerMessage> {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        customer_name: message.customerName,
        customer_phone: message.customerPhone,
        message: message.message,
        source: message.source,
        created_at: new Date().toISOString(),
        read: false
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating message:', error);
      throw error;
    }
    
    return {
      id: data.id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      message: data.message,
      source: data.source as 'WhatsApp' | 'Website',
      createdAt: data.created_at,
      read: data.read
    };
  },
  
  /**
   * Mark a message as read
   */
  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id);
    
    if (error) {
      console.error(`Error marking message ${id} as read:`, error);
      throw error;
    }
  },
  
  /**
   * Mark all messages as read
   */
  async markAllAsRead(): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('read', false);
    
    if (error) {
      console.error('Error marking all messages as read:', error);
      throw error;
    }
  },
  
  /**
   * Delete a message
   */
  async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting message ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Subscribe to message changes
   */
  subscribeToMessages(callback: () => void) {
    return supabase
      .channel('messages-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages' 
      }, callback)
      .subscribe();
  }
};
