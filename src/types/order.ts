// src/types/order.ts - Updated to match backend Order model
export interface Order {
  id: string;
  client_name?: string;
  client_email?: string;
  service_name?: string;
  product_name?: string;
  pricing_tier_name?: string;
  total_amount: number | string; // API returns as string (decimal)
  currency: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  transaction_id?: string;
  notes?: string;
  due_date?: string;
  payment_count?: number;
  total_paid?: number | string; // API returns as number for this field
  attachment_count?: number;
  work_result_count?: number;
  date_created: string;
  date_updated?: string;
}

export interface Payment {
  id: string;
  order: string;
  amount: number;
  currency: string;
  method: string;
  transaction_id: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  date_created: string;
}

// Legacy interface for backward compatibility - will be deprecated
// LegacyOrder removed as per request; using Order only moving forward.

export interface OrderItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  sku?: string;
  image_url?: string;
  category?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ShippingAddress {
  id?: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default?: boolean;
}

export interface BillingAddress {
  id?: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default?: boolean;
}

export interface OrderSummary {
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
}

export interface OrderTracking {
  tracking_number: string;
  carrier: string;
  status: 'in_transit' | 'delivered' | 'exception' | 'pending';
  estimated_delivery: string;
  tracking_events: TrackingEvent[];
}

export interface TrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  description: string;
  status: string;
}

// Order creation and update interfaces
export interface CreateOrderData {
  business_id: string;
  items: CreateOrderItem[];
  shipping_address: ShippingAddress;
  billing_address?: BillingAddress;
  payment_method: string;
  notes?: string;
  delivery_date?: string;
}

export interface CreateOrderItem {
  product_id: string;
  quantity: number;
  price?: number; // Optional if price comes from product
  customizations?: Record<string, any>;
}

export interface UpdateOrderData {
  status?: Order['status'];
  delivery_date?: string;
  tracking_number?: string;
  notes?: string;
  shipping_address?: ShippingAddress;
}

// Order filtering and sorting interfaces
export interface OrderFilters {
  status?: Order['status'][];
  business?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  amount_range?: {
    min: number;
    max: number;
  };
  search_term?: string;
}

export interface OrderSortOptions {
  field: 'created_at' | 'updated_at' | 'amount' | 'status' | 'business';
  direction: 'asc' | 'desc';
}

// API response interfaces
export interface OrdersResponse {
  results: Order[];
  count: number;
  next?: string;
  previous?: string;
}

export interface OrderDetailResponse extends Order {
  tracking?: OrderTracking;
  refunds?: OrderRefund[];
  timeline?: OrderTimelineEvent[];
}

export interface OrderRefund {
  id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  processed_at?: string;
}

export interface OrderTimelineEvent {
  id: string;
  event_type: 'created' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Order statistics interfaces
export interface OrderStatistics {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  average_order_value: number;
  monthly_growth: number;
  top_businesses: Array<{
    business: string;
    order_count: number;
    total_revenue: number;
  }>;
  recent_orders: Order[];
}

// Utility types
export type OrderStatus = Order['status'];
export type OrderItemWithTotal = OrderItem & { total: number };
export type OrderWithSummary = Order & { summary: OrderSummary };

// Form validation interfaces
export interface OrderFormErrors {
  business?: string;
  items?: string;
  shipping_address?: Partial<Record<keyof ShippingAddress, string>>;
  billing_address?: Partial<Record<keyof BillingAddress, string>>;
  payment_method?: string;
  delivery_date?: string;
}

// Export utility functions type
export interface OrderUtils {
  calculateSubtotal: (items: OrderItem[]) => number;
  calculateTotal: (order: Order) => number;
  formatOrderNumber: (order: Order) => string;
  getStatusColor: (status: OrderStatus) => string;
  getStatusIcon: (status: OrderStatus) => string;
  isOrderEditable: (order: Order) => boolean;
  isOrderCancellable: (order: Order) => boolean;
  getDeliveryStatus: (order: Order) => 'on_time' | 'delayed' | 'delivered' | 'unknown';
}