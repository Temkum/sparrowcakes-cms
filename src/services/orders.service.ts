import axiosInstance from './axiosInstance';
import {
  Order,
  OrderFilterProps,
  OrderStats,
  OrderStatus,
} from '@/types/order';
import { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

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
  ): Promise<{ items: Order[] }> {
    try {
      const params = {
        page,
        limit,
        searchTerm: searchTerm?.trim(),
        sortBy,
        sortDirection,
        status,
      };

      const response = await axiosInstance.get<object, { items: Order[] }>(
        `${API_URL}/orders`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('response orders  ', response);

      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get a single order by ID
  async getOrderById(id: string, token: string): Promise<Order> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      const response = await axiosInstance.get<object, Order>(
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
  async createOrder(orderData: Partial<Order>, token: string): Promise<Order> {
    try {
      // Validate required fields
      if (!orderData.order_number) {
        throw new Error('Order number is required');
      }

      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      const response = await axiosInstance.post<object, Order>(
        `${API_URL}/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update an existing order
  async updateOrder(
    id: number,
    orderData: Partial<Order>,
    token: string
  ): Promise<Order> {
    try {
      if (!id) {
        throw new Error('Order ID is required for update');
      }

      const response = await axiosInstance.put<object, Order>(
        `${API_URL}/orders/${id}`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
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
  async deleteOrders(
    ids: number[],
    token: string
  ): Promise<{ success: boolean }> {
    try {
      if (!ids.length) {
        throw new Error('No order IDs provided for deletion');
      }

      const response = await axiosInstance.delete<object, { success: boolean }>(
        `${API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { ids },
        }
      );

      return response;
    } catch (error) {
      console.error('Error deleting orders:', error);
      throw error;
    }
  },

  // Soft delete one or more orders
  async softDeleteOrders(ids: number[], token: string): Promise<void> {
    // Convert all ids to integers and filter out invalid ones
    const validIds = ids
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);

    if (!Array.isArray(validIds) || validIds.length === 0) {
      throw new Error('No valid order IDs provided for soft delete');
    }
    if (!token) {
      throw new Error('No authentication token found');
    }
    try {
      await axiosInstance.delete(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ids: validIds },
      });
    } catch (error) {
      console.error('Error soft deleting orders:', error);
      throw error;
    }
  },

  // Get order statistics
  async getOrderStats(token: string): Promise<OrderStats> {
    try {
      const response = await axiosInstance.get<object, OrderStats>(
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
    id: number,
    status: OrderStatus,
    token: string
  ): Promise<Order> {
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

      const response = await axiosInstance.patch<object, Order>(
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
    id: number,
    token: string
  ): Promise<OrderHistoryItem[]> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      const response = await axiosInstance.get<object, OrderHistoryItem[]>(
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
    id: number,
    note: string,
    token: string
  ): Promise<{ success: boolean }> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      if (!note || note.trim() === '') {
        throw new Error('Note content is required');
      }

      const response = await axiosInstance.post<object, { success: boolean }>(
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
    id: number,
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
      // Prepare query params
      const params: Record<string, string> = {
        format,
      };
      if (filter.searchTerm) params.searchTerm = filter.searchTerm.trim();
      if (filter.sortBy) params.sortBy = filter.sortBy;
      if (filter.sortDirection) params.sortDirection = filter.sortDirection;
      if (filter.status) params.status = filter.status;
      if (filter.ids && filter.ids.length > 0)
        params.ids = filter.ids.join(',');

      const response = await axiosInstance.get<Blob>(
        `${API_URL}/orders/export`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              format === 'csv'
                ? 'text/csv'
                : format === 'excel'
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/pdf',
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
    id: number,
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
