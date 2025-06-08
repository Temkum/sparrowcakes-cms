import axiosInstance from './axiosInstance';
import {
  Order,
  OrderFilterProps,
  OrderHistoryItem,
  OrderResponse,
  OrderStats,
  OrderStatus,
} from '@/types/order';
import { AxiosResponse } from 'axios';

class OrderService {
  // Get all orders with pagination and filtering
  async getOrders(filter: OrderFilterProps): Promise<OrderResponse> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      type ApiResponse = OrderResponse | Order[] | { data: Order[] };
      const response = await axiosInstance.get<ApiResponse>('/orders', {
        params: queryParams,
      });
      console.log('Fetched orders service:', response);

      // Handle case where response.data is already the array of orders
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          meta: {
            total: response.data.length,
            page: 1,
            limit: response.data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        } as OrderResponse;
      }

      // Handle case where response has data property with array of orders
      if (
        response.data &&
        'data' in response.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data as OrderResponse;
      }

      throw new Error('Invalid order data format');
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get a single order by ID
  async getOrderById(id: string): Promise<Order> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      const response = await axiosInstance.get<Order>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      throw error;
    }
  }

  // Get all orders IDs with pagination and filtering
  async getAllFilteredOrdersIds(filter: OrderFilterProps): Promise<number[]> {
    try {
      // Convert numeric values to proper types and map to expected parameter names
      const params: Record<string, string | number | undefined> = {};

      // Map store's filter to API's expected parameters
      if (filter.page) params.page = Number(filter.page);

      // Use pageSize or fall back to limit
      const pageSize = filter.pageSize ?? filter.limit;
      if (pageSize) params.limit = Number(pageSize);

      // Use searchTerm or search
      const search = filter.searchTerm ?? filter.search;
      if (search) params.search = search;

      if (filter.sortBy) params.sortBy = filter.sortBy;

      // Map sortDirection to sortOrder
      const sortOrder = filter.sortOrder ?? filter.sortDirection;
      if (sortOrder) params.sortOrder = sortOrder;

      if (filter.status) params.status = filter.status;

      // Remove undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter((entry) => entry[1] !== undefined)
      ) as Record<string, string | number>;

      const response = await axiosInstance.get<number[]>('/orders/ids', {
        params: cleanParams,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Create a new order
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      // Validate required fields
      if (!orderData.order_number) {
        throw new Error('Order number is required');
      }

      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      const response = await axiosInstance.post<Order>('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Update an existing order
  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order> {
    try {
      if (!id) {
        throw new Error('Order ID is required for update');
      }

      const response = await axiosInstance.patch<Order>(
        `/orders/${id}`,
        orderData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating order with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete multiple orders
  async deleteOrders(ids: number[]): Promise<{ success: boolean }> {
    try {
      if (!ids.length) {
        throw new Error('No order IDs provided for deletion');
      }

      const response = await axiosInstance.delete<{ success: boolean }>(
        '/orders',
        {
          data: { ids },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting orders:', error);
      throw error;
    }
  }

  // Soft delete one or more orders
  async softDeleteOrders(ids: number[]): Promise<void> {
    try {
      // Convert all ids to integers and filter out invalid ones
      const validIds = ids
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0);

      if (!Array.isArray(validIds) || validIds.length === 0) {
        throw new Error('No valid order IDs provided for soft delete');
      }

      const response = await axiosInstance.delete('/orders', {
        data: { ids: validIds },
      });
      return response.data;
    } catch (error) {
      console.error('Error soft deleting orders:', error);
      throw error;
    }
  }

  // Get order statistics
  async getOrderStats(): Promise<OrderStats> {
    try {
      const response = await axiosInstance.get<OrderStats>('/orders/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      const validStatuses: OrderStatus[] = [
        'New',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ];

      if (!validStatuses.includes(status)) {
        throw new Error('Invalid order status');
      }

      const response = await axiosInstance.patch<Order>(
        `/orders/${id}/status`,
        {
          status,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating status for order with ID ${id}:`, error);
      throw error;
    }
  }

  // Get order history/timeline
  async getOrderHistory(id: number): Promise<OrderHistoryItem[]> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      const response = await axiosInstance.get<OrderHistoryItem[]>(
        `/orders/${id}/history`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching history for order with ID ${id}:`, error);
      throw error;
    }
  }

  // Add a note to an order
  async addOrderNote(id: number, note: string): Promise<{ success: boolean }> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      if (!note || note.trim() === '') {
        throw new Error('Note content is required');
      }

      const response = await axiosInstance.post<{ success: boolean }>(
        `/orders/${id}/notes`,
        { content: note }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding note to order with ID ${id}:`, error);
      throw error;
    }
  }

  // Generate invoice for an order
  async generateInvoice(id: number): Promise<AxiosResponse<Blob>> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      const response = await axiosInstance.get<Blob>(`/orders/${id}/invoice`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error(`Error generating invoice for order with ID ${id}:`, error);
      throw error;
    }
  }

  // Export orders in different formats
  async exportOrders(
    format: 'csv' | 'xlsx' | 'pdf',
    selectedIds?: number[]
  ): Promise<Blob> {
    try {
      const response = await axiosInstance.get(`/orders/export/${format}`, {
        params: { ids: selectedIds },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(
    id: number,
    emailData: {
      to: string;
      cc?: string[];
      template?: string;
    }
  ): Promise<AxiosResponse<{ success: boolean; messageId?: string }>> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      if (!emailData.to) {
        throw new Error('Recipient email is required');
      }

      const response = await axiosInstance.post<{
        success: boolean;
        messageId?: string;
      }>(`/orders/${id}/send-confirmation`, emailData);

      return response;
    } catch (error) {
      console.error(
        `Error sending confirmation for order with ID ${id}:`,
        error
      );
      throw error;
    }
  }
}

export const orderService = new OrderService();
