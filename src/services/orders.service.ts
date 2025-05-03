import axiosInstance from './axiosInstance';
import { Order, OrderFilterProps, OrderStats } from '@/types/order';
import { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export type OrderStatus =
  | 'new'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled';
// interface OrderFilterProps {
//   page?: number;
//   limit?: number;
//   searchTerm?: string;
//   sortBy?: string;
//   sortDirection?: 'ASC' | 'DESC';
//   status?: OrderStatus;
// }

// interface OrderStats {
//   total: number;
//   pending: number;
//   processing: number;
//   completed: number;
//   cancelled: number;
//   revenue: {
//     total: number;
//     thisMonth: number;
//     thisWeek: number;
//   };
// }

interface OrderHistoryItem {
  timestamp: string;
  status: OrderStatus;
  user: string;
  notes?: string;
}

export const orderService = {
  // Get all orders with pagination and filtering
  async getOrders(
    {
      page = 1,
      limit = 10,
      searchTerm = '',
      sortBy = 'created_at',
      sortDirection = 'DESC',
      status,
    }: OrderFilterProps,
    token: string
  ): Promise<AxiosResponse<{ items: Order[] }>> {
    try {
      const params = {
        page,
        limit,
        searchTerm: searchTerm?.trim(),
        sortBy,
        sortDirection,
        status,
      };

      const response = await axiosInstance.get<{ items: Order[] }>(
        `${API_URL}/orders`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get a single order by ID
  async getOrderById(id: string, token: string): Promise<AxiosResponse<Order>> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      const response = await axiosInstance.get<Order>(
        `${API_URL}/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new order
  async createOrder(
    orderData: Partial<Order>,
    token: string
  ): Promise<AxiosResponse<Order>> {
    console.log('Creating order with data:', orderData);

    try {
      // Validate required fields
      if (!orderData.order_number) {
        throw new Error('Order number is required');
      }

      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      const response = await axiosInstance.post<Order>(
        `${API_URL}/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Order created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update an existing order
  async updateOrder(
    id: string,
    orderData: Partial<Order>,
    token: string
  ): Promise<AxiosResponse<Order>> {
    try {
      if (!id) {
        throw new Error('Order ID is required for update');
      }

      const response = await axiosInstance.patch<Order>(
        `${API_URL}/orders/${id}`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error(`Error updating order with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete multiple orders
  async deleteOrders(ids: string[], token: string): Promise<AxiosResponse> {
    try {
      if (!ids.length) {
        throw new Error('No order IDs provided for deletion');
      }

      const response = await axiosInstance.delete(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ids },
      });
      return response;
    } catch (error) {
      console.error('Error deleting orders:', error);
      throw error;
    }
  },

  // Get order statistics
  async getOrderStats(token: string): Promise<AxiosResponse<OrderStats>> {
    try {
      const response = await axiosInstance.get<OrderStats>(
        `${API_URL}/orders/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    token: string
  ): Promise<AxiosResponse<Order>> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      if (!Object.values(OrderStatus).includes(status)) {
        throw new Error('Invalid order status');
      }

      const response = await axiosInstance.patch<Order>(
        `${API_URL}/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error(`Error updating status for order with ID ${id}:`, error);
      throw error;
    }
  },

  // Get order history/timeline
  async getOrderHistory(
    id: string,
    token: string
  ): Promise<AxiosResponse<OrderHistoryItem[]>> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      const response = await axiosInstance.get<OrderHistoryItem[]>(
        `${API_URL}/orders/${id}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error(`Error fetching history for order with ID ${id}:`, error);
      throw error;
    }
  },

  // Add a note to an order
  async addOrderNote(
    id: string,
    note: string,
    token: string
  ): Promise<AxiosResponse<{ success: boolean }>> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      if (!note || note.trim() === '') {
        throw new Error('Note content is required');
      }

      const response = await axiosInstance.post<{ success: boolean }>(
        `${API_URL}/orders/${id}/notes`,
        { content: note },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error(`Error adding note to order with ID ${id}:`, error);
      throw error;
    }
  },

  // Generate invoice for an order
  async generateInvoice(
    id: string,
    token: string
  ): Promise<AxiosResponse<Blob>> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      const response = await axiosInstance.get<Blob>(
        `${API_URL}/orders/${id}/invoice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );

      return response;
    } catch (error) {
      console.error(`Error generating invoice for order with ID ${id}:`, error);
      throw error;
    }
  },

  // Export orders in different formats
  async exportOrders(
    filter: OrderFilterProps,
    format: 'csv' | 'excel' | 'pdf',
    token: string
  ): Promise<AxiosResponse<Blob>> {
    try {
      const params = {
        page: filter.page || 1,
        limit: filter.limit || 100,
        searchTerm: filter.searchTerm?.trim() || '',
        sortBy: filter.sortBy || 'created_at',
        sortDirection: filter.sortDirection || 'DESC',
        status: filter.status,
        format,
      };

      const response = await axiosInstance.get<Blob>(
        `${API_URL}/orders/export`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );

      return response;
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  },

  // Send order confirmation email
  async sendOrderConfirmation(
    id: string,
    emailData: {
      to: string;
      cc?: string[];
      template?: string;
    },
    token: string
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
      }>(`${API_URL}/orders/${id}/send-confirmation`, emailData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error(
        `Error sending confirmation for order with ID ${id}:`,
        error
      );
      throw error;
    }
  },
};
