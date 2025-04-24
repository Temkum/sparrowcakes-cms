import axiosInstance from './axiosInstance';
import { Customer } from '@/types/customer';

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface CustomerResponse {
  data: Customer[];
  total: number;
}

export const customerService = {
  // Get all customers with pagination and filtering
  async getCustomers(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = '',
    sortBy: string = 'created_at',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<CustomerResponse> {
    try {
      const response = await axiosInstance.get(`${API_URL}/customers`, {
        params: {
          page,
          limit,
          searchTerm,
          sortBy,
          sortDirection: sortDirection.toUpperCase(),
        },
      });
      console.log('Fetched customers:', response);
      return response;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get a single customer by ID
  async getCustomerById(id: number) {
    try {
      const response = await axiosInstance.get(`${API_URL}/customers/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new customer
  async createCustomer(customerData: Partial<Customer>, token: string) {
    console.log('Creating customer with data:', customerData);
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
          },
        }
      );
      return response;
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
          },
        }
      );
      return response;
    } catch (error) {
      console.error(`Error updating customer with ID ${id}:`, error);
      throw error;
    }
  },

  // Get customer statistics
  async getCustomerStats() {
    try {
      const response = await axiosInstance.get(`${API_URL}/customers/stats`);
      return response;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error;
    }
  },
};
