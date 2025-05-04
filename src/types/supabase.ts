export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          price: number
          image: string
          category: string
          description: string | null
          unit: string
          stock: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          price: number
          image: string
          category: string
          description?: string | null
          unit: string
          stock?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          price?: number
          image?: string
          category?: string
          description?: string | null
          unit?: string
          stock?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          total_amount: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_phone: string
          total_amount: number
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string
          total_amount?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: string
          product_id: number
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: number
          order_id: string
          product_id: number
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: string
          product_id?: number
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: number
          name: string
          email: string | null
          phone: string
          total_orders: number
          total_spent: number
          last_order_date: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email?: string | null
          phone: string
          total_orders?: number
          total_spent?: number
          last_order_date?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string | null
          phone?: string
          total_orders?: number
          total_spent?: number
          last_order_date?: string | null
          created_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount_type: string
          discount_value: number
          success_message: string
          usage_limit: number
          usage_count: number
          expiry_date: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_type: string
          discount_value: number
          success_message: string
          usage_limit: number
          usage_count?: number
          expiry_date: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_type?: string
          discount_value?: number
          success_message?: string
          usage_limit?: number
          usage_count?: number
          expiry_date?: string
          is_active?: boolean
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          message: string
          source: string
          created_at: string
          read: boolean
        }
        Insert: {
          id?: string
          customer_name: string
          customer_phone: string
          message: string
          source: string
          created_at?: string
          read?: boolean
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string
          message?: string
          source?: string
          created_at?: string
          read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
