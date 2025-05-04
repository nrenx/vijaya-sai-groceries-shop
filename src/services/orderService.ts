import { supabase } from '@/lib/supabase';
import { Order, CartItem, OrderStatus } from '@/types';

export const orderService = {
  /**
   * Get all orders
   */
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    // Fetch order items for each order
    const orders = await Promise.all(
      data.map(async (order) => {
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            id,
            quantity,
            price,
            products (*)
          `)
          .eq('order_id', order.id);

        if (itemsError) {
          console.error(`Error fetching items for order ${order.id}:`, itemsError);
          throw itemsError;
        }

        // Transform order items to match CartItem structure
        const items: CartItem[] = orderItems.map(item => ({
          id: item.products.id,
          name: item.products.name,
          price: item.price, // Use the price at the time of order
          image: item.products.image,
          category: item.products.category,
          description: item.products.description || undefined,
          unit: item.products.unit,
          quantity: item.quantity
        }));

        return {
          id: order.id,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          totalAmount: order.total_amount,
          status: order.status as OrderStatus,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items
        };
      })
    );

    return orders;
  },

  /**
   * Get an order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 means no rows returned
        return null;
      }

      console.error(`Error fetching order with ID ${id}:`, error);
      throw error;
    }

    // Fetch order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        id,
        quantity,
        price,
        products (*)
      `)
      .eq('order_id', id);

    if (itemsError) {
      console.error(`Error fetching items for order ${id}:`, itemsError);
      throw itemsError;
    }

    // Transform order items to match CartItem structure
    const items: CartItem[] = orderItems.map(item => ({
      id: item.products.id,
      name: item.products.name,
      price: item.price, // Use the price at the time of order
      image: item.products.image,
      category: item.products.category,
      description: item.products.description || undefined,
      unit: item.products.unit,
      quantity: item.quantity
    }));

    return {
      id: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      totalAmount: order.total_amount,
      status: order.status as OrderStatus,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items
    };
  },

  /**
   * Create a new order
   */
  async createOrder(
    customerName: string,
    customerPhone: string,
    items: CartItem[],
    totalAmount: number
  ): Promise<Order> {
    // Start a Supabase transaction
    const { data: order, error } = await supabase
      .from('orders')
      .insert([{
        customer_name: customerName,
        customer_phone: customerPhone,
        total_amount: totalAmount,
        status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      created_at: new Date().toISOString()
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // If there's an error with order items, we should delete the order
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    // Update or create customer record
    await this.updateCustomerStats(customerName, customerPhone, totalAmount);

    return {
      id: order.id,
      customerName,
      customerPhone,
      totalAmount,
      status: 'Pending',
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items
    };
  },

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error(`Error updating status for order ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update or create customer record with order stats
   */
  async updateCustomerStats(
    customerName: string,
    customerPhone: string,
    orderAmount: number
  ): Promise<void> {
    // Check if customer exists
    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', customerPhone)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching customer:', fetchError);
      throw fetchError;
    }

    const now = new Date().toISOString();

    if (existingCustomer) {
      // Update existing customer
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          name: customerName, // Update name in case it changed
          total_orders: existingCustomer.total_orders + 1,
          total_spent: existingCustomer.total_spent + orderAmount,
          last_order_date: now
        })
        .eq('id', existingCustomer.id);

      if (updateError) {
        console.error('Error updating customer stats:', updateError);
        throw updateError;
      }
    } else {
      // Create new customer
      const { error: insertError } = await supabase
        .from('customers')
        .insert([{
          name: customerName,
          phone: customerPhone,
          total_orders: 1,
          total_spent: orderAmount,
          last_order_date: now,
          created_at: now
        }]);

      if (insertError) {
        console.error('Error creating customer record:', insertError);
        throw insertError;
      }
    }
  },

  /**
   * Subscribe to order changes
   */
  subscribeToOrders(callback: () => void) {
    return supabase
      .channel('orders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, callback)
      .subscribe();
  }
};
