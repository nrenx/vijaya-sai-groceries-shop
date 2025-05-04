
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  unit: string;
  stock?: number; // Added stock for inventory tracking
}

export interface CartItem extends Product {
  quantity: number;
}

export type Category = "All" | "Grains" | "Oils" | "Snacks" | "Soaps" | "Spices" | "Others";

export type OrderStatus = "Pending" | "Processing" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  avatar?: string;
}

export interface CustomerMessage {
  id: string;
  customerName: string;
  customerPhone: string;
  message: string;
  source: "WhatsApp" | "Website";
  createdAt: string;
  read: boolean;
}

export interface SalesStatistics {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  topProducts: { product: string; sales: number }[];
}
