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
    console.log('creating...');
    console.log('Service data', productData);
    console.log(token);
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
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update an existing product
  // In product.service.ts, fix the updateProduct method:
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
  // Delete a product
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
