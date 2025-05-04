import { supabase } from '@/lib/supabase';

interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

export const customerService = {
  /**
   * Get all customers
   */
  async getCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
    
    return data.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      totalOrders: customer.total_orders,
      totalSpent: customer.total_spent,
      lastOrderDate: customer.last_order_date
    }));
  },
  
  /**
   * Get a customer by ID
   */
  async getCustomerById(id: number): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 means no rows returned
        return null;
      }
      
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalOrders: data.total_orders,
      totalSpent: data.total_spent,
      lastOrderDate: data.last_order_date
    };
  },
  
  /**
   * Get a customer by phone number
   */
  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching customer with phone ${phone}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalOrders: data.total_orders,
      totalSpent: data.total_spent,
      lastOrderDate: data.last_order_date
    };
  },
  
  /**
   * Update customer information
   */
  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update({
        name: updates.name,
        email: updates.email,
        phone: updates.phone
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating customer with ID ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalOrders: data.total_orders,
      totalSpent: data.total_spent,
      lastOrderDate: data.last_order_date
    };
  },
  
  /**
   * Search customers by name or phone
   */
  async searchCustomers(query: string): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name');
    
    if (error) {
      console.error(`Error searching customers with query "${query}":`, error);
      throw error;
    }
    
    return data.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      totalOrders: customer.total_orders,
      totalSpent: customer.total_spent,
      lastOrderDate: customer.last_order_date
    }));
  },
  
  /**
   * Get customer order history
   */
  async getCustomerOrders(customerId: number) {
    // First get the customer to get the phone number
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('phone')
      .eq('id', customerId)
      .single();
    
    if (customerError) {
      console.error(`Error fetching customer with ID ${customerId}:`, customerError);
      throw customerError;
    }
    
    // Then get all orders for this customer by phone
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', customer.phone)
      .order('created_at', { ascending: false });
    
    if (ordersError) {
      console.error(`Error fetching orders for customer ${customerId}:`, ordersError);
      throw ordersError;
    }
    
    return orders;
  },
  
  /**
   * Subscribe to customer changes
   */
  subscribeToCustomers(callback: () => void) {
    return supabase
      .channel('customers-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'customers' 
      }, callback)
      .subscribe();
  }
};
