import {
  CustomerFilterProps,
  PaginatedCustomersResponse,
  CustomerStats,
} from '@/types/customer';
import axiosInstance from './axiosInstance';
import { Customer } from '@/types/customer';
import axios from 'axios';

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
        '/customers',
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
      console.log('response service', response);

      if (!response) {
        throw new Error('No data received from server');
      }

      return response.data;
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
  async getCustomerById(id: number): Promise<Customer> {
    try {
      const response = await axiosInstance.get<Customer>(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new customer
  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    if (!customerData) {
      throw new Error('Invalid customer data');
    }
    try {
      const response = await axiosInstance.post<Customer>(
        '/customers',
        customerData
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
    customerData: Partial<Customer>
  ): Promise<Customer> {
    try {
      const response = await axiosInstance.put<Customer>(
        `/customers/${id}`,
        customerData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating customer with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete multiple customers
  async deleteCustomers(ids: number[]): Promise<{ success: boolean }> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Invalid customer IDs');
    }
    try {
      const response = await axiosInstance.delete<{ success: boolean }>(
        '/customers',
        {
          data: { ids },
        }
      );
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
        '/customers/stats'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error;
    }
  },
};
