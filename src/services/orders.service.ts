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

export interface OrderFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: string;
}

export interface OrderResponse {
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

class OrderService {
  // Get all orders with pagination and filtering
  async getOrders(filter: OrderFilter, token: string): Promise<OrderResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const response = await fetch(`${API_URL}/orders?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch orders');
    }

    return response.json();
  }

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
  }

  // Get all orders IDs with pagination and filtering
  async getAllFilteredOrdersIds(
    filter: OrderFilterProps,
    token: string
  ): Promise<number[]> {
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

      const response = await axiosInstance.get<number[]>(
        `${API_URL}/orders/ids`,
        {
          params: cleanParams,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

  // Export orders in different formats
  async exportOrders(
    format: 'csv' | 'xlsx' | 'pdf',
    token: string,
    selectedIds?: number[]
  ): Promise<Blob> {
    try {
      // Prepare the filters object
      const filters: Record<string, number[] | string | undefined> = {};

      // Add selected IDs if provided
      if (selectedIds && selectedIds.length > 0) {
        filters.ids = selectedIds;
      }

      const exportDto = {
        format,
        filters,
      };

      // Log the export request for debugging
      console.log(
        'Export request (frontend):',
        JSON.stringify(exportDto, null, 2)
      );

      // First, request the export to be generated
      const exportResponse = await axiosInstance.post<{
        success: boolean;
        fileName: string;
        downloadUrl: string;
      }>(`${API_URL}/export/orders`, exportDto, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Then download the file using the provided URL
      const downloadResponse = await axiosInstance.get<Blob>(
        exportResponse.data.downloadUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              format === 'csv'
                ? 'text/csv'
                : format === 'xlsx'
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/pdf',
          },
          responseType: 'blob',
        }
      );

      return downloadResponse.data;
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }

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
  }
}

export const orderService = new OrderService();
