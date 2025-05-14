import {
  CustomerFilterProps,
  PaginatedCustomersResponse,
  CustomerStats,
} from '@/types/customer';
import axiosInstance from './axiosInstance';
import { Customer } from '@/types/customer';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const customerService = {
  // Get all customers with pagination and filtering
  async getCustomers({
    page = 1,
    limit = 10,
    searchTerm = '',
    sortBy = 'created_at',
    sortDirection = 'DESC',
  }: CustomerFilterProps): Promise<PaginatedCustomersResponse> {
    try {
      // Clean and normalize search parameters
      const cleanParams = {
        page: Number(page),
        limit: Number(limit),
        searchTerm: searchTerm?.trim() || undefined,
        sortBy,
        sortDirection: sortDirection.toUpperCase(),
      };

      // Fetch customers with pagination
      const response = await axiosInstance.get<PaginatedCustomersResponse>(
        `${API_URL}/customers`,
        {
          params: cleanParams,
          paramsSerializer: (params) => {
            return Object.entries(params)
              .filter(
                ([, value]) =>
                  value !== undefined && value !== null && value !== ''
              )
              .map(
                ([key, value]) => `${key}=${encodeURIComponent(String(value))}`
              )
              .join('&');
          },
        }
      );

      if (!response) {
        throw new Error('No data received from server');
      }

      return response;
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Add more specific error handling
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Failed to fetch customers: ${message}`);
      }
      throw error;
    }
  },

  // Get a single customer by ID
  async getCustomerById(id: number) {
    try {
      const response = await axiosInstance.get(`${API_URL}/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new customer
  async createCustomer(customerData: Partial<Customer>, token: string) {
    if (!token) {
      throw new Error('No authentication token found');
    }
    // Check if the token is valid
    if (!customerData) {
      throw new Error('Invalid customer data');
    }
    try {
      const response = await axiosInstance.post(
        `${API_URL}/customers`,
        customerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update an existing customer
  async updateCustomer(
    id: number,
    customerData: Partial<Customer>,
    token: string
  ) {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/customers/${id}`,
        customerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating customer with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete multiple customers
  async deleteCustomers(ids: number[], token: string) {
    if (!token) {
      throw new Error('No authentication token found');
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Invalid customer IDs');
    }
    try {
      const response = await axiosInstance.delete(`${API_URL}/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ids },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting customers:', error);
      throw error;
    }
  },

  // Get customer statistics
  async getCustomerStats(): Promise<CustomerStats> {
    try {
      const response = await axiosInstance.get<CustomerStats>(
        `${API_URL}/customers/stats`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error;
    }
  },
};
