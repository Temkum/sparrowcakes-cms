export type OrderStatus =
  | 'New'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface OrderCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string;
  occupation: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
}

export interface OrderItem {
  id?: string;
  product_id: string | number;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Order {
  id: string | number;
  order_number: string;
  customer_id: number;
  customer?: OrderCustomer;
  status: OrderStatus;
  currency: string;
  country: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
  items: OrderItem[];
  shipping_cost: number | string;
  total_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface OrderFilterProps {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  status?: OrderStatus;
}

export interface PaginatedOrdersResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderStats {
  totalOrders: number;
  activeOrders: number;
  newOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}
