import axiosInstance from './axiosInstance';
import { Order, OrderFilterProps, OrderStats } from '@/types/order';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const orderService = {
  // Get all orders with pagination and filtering
  async getOrders({
    page = 1,
    limit = 10,
    searchTerm = '',
    sortBy = 'created_at',
    sortDirection = 'DESC',
    status,
  }: OrderFilterProps) {
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
        { params }
      );
      return response.data.items;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get a single order by ID
  async getOrderById(id: string) {
    try {
      const response = await axiosInstance.get<Order>(
        `${API_URL}/orders/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new order
  async createOrder(orderData: Partial<Order>, token: string) {
    console.log('Creating order with data:', orderData);

    try {
      const response = await axiosInstance.post<Order>(
        `${API_URL}/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update an existing order
  async updateOrder(id: string, orderData: Partial<Order>, token: string) {
    try {
      const response = await axiosInstance.patch<Order>(
        `${API_URL}/orders/${id}`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating order with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete multiple orders
  async deleteOrders(ids: string[], token: string) {
    try {
      const response = await axiosInstance.delete(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ids },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting orders:', error);
      throw error;
    }
  },

  // Get order statistics
  async getOrderStats(token: string) {
    try {
      const response = await axiosInstance.get<OrderStats>(
        `${API_URL}/orders/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  },
};
