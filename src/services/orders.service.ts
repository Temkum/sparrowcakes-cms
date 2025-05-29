import axiosInstance from './axiosInstance';
import {
  Order,
  OrderFilterProps,
  OrderStats,
  OrderStatus,
} from '@/types/order';
import { AxiosResponse } from 'axios';

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
  async getOrders(filter: OrderFilter): Promise<OrderResponse> {
    try {
      const queryParams = Object.entries(filter)
        .filter(([, value]) => value !== undefined && value !== '')
        .reduce((params, [key, value]) => {
          params[key] = String(value);
          return params;
        }, {} as Record<string, string>);

      return await axiosInstance.get<object, OrderResponse>('/orders', {
        params: queryParams,
      });
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

      return await axiosInstance.get<object, Order>(`/orders/${id}`);
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

      return await axiosInstance.get<object, number[]>('/orders/ids', {
        params: cleanParams,
      });
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

      return await axiosInstance.post<object, Order>('/orders', orderData);
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

      return await axiosInstance.patch<object, Order>(
        `/orders/${id}`,
        orderData
      );
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

      return await axiosInstance.delete<object, { success: boolean }>(
        '/orders',
        {
          data: { ids },
        }
      );
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

      await axiosInstance.delete('/orders', {
        data: { ids: validIds },
      });
    } catch (error) {
      console.error('Error soft deleting orders:', error);
      throw error;
    }
  }

  // Get order statistics
  async getOrderStats(): Promise<OrderStats> {
    try {
      return await axiosInstance.get<object, OrderStats>('/orders/stats');
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

      return await axiosInstance.patch<object, Order>(`/orders/${id}/status`, {
        status,
      });
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

      return await axiosInstance.get<object, OrderHistoryItem[]>(
        `/orders/${id}/history`
      );
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

      return await axiosInstance.post<object, { success: boolean }>(
        `/orders/${id}/notes`,
        { content: note }
      );
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

      return await axiosInstance.get<Blob>(`/orders/${id}/invoice`, {
        responseType: 'blob',
      });
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
    console.log('Exporting orders with format:', format);
    console.log('Selected IDs:', selectedIds);
    try {
      // Create a filter object with selectedIds if provided
      const filter: Record<string, number[] | string | undefined> = {};

      // Add selected IDs if provided
      if (selectedIds && selectedIds.length > 0) {
        filter.selectedIds = selectedIds;
      }

      // Create the export DTO that matches the server's expected format
      const exportDto = {
        format, // Include format in the body as well
        filter,
      };

      // Log the export request for debugging
      console.log(
        'Export request (frontend):',
        JSON.stringify(exportDto, null, 2)
      );

      // First, request the export to be generated
      const exportResponse = await axiosInstance.post<
        object,
        {
          success: boolean;
          fileName: string;
          downloadUrl: string;
        }
      >(`/orders/export/${format}`, exportDto);

      console.log('Export response:', exportResponse);

      // Then download the file using the provided URL
      const downloadResponse = await axiosInstance.get<Blob>(
        exportResponse.downloadUrl,
        {
          responseType: 'blob',
        }
      );
      console.log('Download response:', downloadResponse);

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
    }
  ): Promise<AxiosResponse<{ success: boolean; messageId?: string }>> {
    try {
      if (!id) {
        throw new Error('Order ID is required');
      }

      if (!emailData.to) {
        throw new Error('Recipient email is required');
      }

      return await axiosInstance.post<{
        success: boolean;
        messageId?: string;
      }>(`/orders/${id}/send-confirmation`, emailData);
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
