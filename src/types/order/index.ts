export type OrderStatus =
  | 'New'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'all';

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
  id?: number;
  product_id: string | number;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Order {
  id: number;
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
  page: number;
  pageSize?: number;
  limit?: number; // Alias for pageSize
  searchTerm?: string; // For client-side filtering
  search?: string; // For API requests
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC'; // Client-side
  sortOrder?: 'ASC' | 'DESC'; // API parameter
  status?: OrderStatus;
  ids?: number[];
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface ApiOrderResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface OrderResponse {
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
  weeklyOrders: number[];
  monthlyOrders: number[];
  yearlyOrders: number[];
  topProducts: {
    productId: string;
    productName: string;
    totalSales: number;
    totalQuantity: number;
  }[];
  topCustomers: {
    customerId: number;
    customerName: string;
    totalSpent: number;
    totalOrders: number;
  }[];
}
