import axios from 'axios';
import axiosInstance from './axiosInstance';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const productService = {
  // Get all products with optional pagination
  async getProducts(page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get a single product by ID
  async getProductById(id: number) {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new product
  async createProduct(productData: FormData, token: string) {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;

        // Handle specific error cases
        if (errorData?.code === 'DUPLICATE_SLUG') {
          throw new Error(
            `Slug "${errorData.slug}" already exists. Please try a different one.`
          );
        }

        // Handle validation errors
        if (errorData?.errors) {
          throw new Error(JSON.stringify(errorData.errors));
        }

        // Handle generic error message
        if (errorData?.message) {
          throw new Error(errorData.message);
        }
      }
      throw new Error('Failed to create product. Please try again.');
    }
  },

  async updateProduct(id: number, productData: FormData, token: string) {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/products/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteProduct(id: number) {
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  },

  // Bulk delete products
  async bulkDeleteProducts(ids: string[]) {
    try {
      const response = await axios.post(`${API_URL}/products/bulk-delete`, {
        ids,
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw error;
    }
  },
};
