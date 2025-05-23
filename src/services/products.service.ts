import axios from 'axios';
import axiosInstance from './axiosInstance';
import {
  BulkDeletionError,
  PaginatedProductsResponse,
  ProductStats,
  ProductAPIResponse,
  Product,
} from '@/types/product';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const productService = {
  // Get all products with optional pagination
  async getProducts(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ) {
    try {
      // Convert frontend's lowercase sort direction to uppercase for backend
      const backendSortDirection = sortDirection.toUpperCase() as
        | 'ASC'
        | 'DESC';

      const response = await axiosInstance.get<
        object,
        PaginatedProductsResponse
      >(`${API_URL}/products`, {
        params: {
          page: Number(page),
          limit: Number(limit),
          searchTerm,
          sortBy,
          sortDirection: backendSortDirection,
        },
        paramsSerializer: (params) => {
          return Object.entries(params)
            .filter(
              ([, value]) =>
                value !== undefined && value !== null && value !== ''
            )
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductStats(): Promise<ProductStats> {
    try {
      const response = await axiosInstance.get(`${API_URL}/products/stats`);
      return response as unknown as ProductStats;
    } catch (error) {
      console.error('Error fetching product stats:', error);
      throw error;
    }
  },

  // Get a single product by ID
  async getProductById(id: number): Promise<ProductAPIResponse> {
    try {
      const response = await axiosInstance.get(`${API_URL}/products/${id}`);
      return response as unknown as ProductAPIResponse;
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
        const errorData = error.response?.data as {
          errors?: Array<{ field: string; message: string }>;
          code?: string;
          slug?: string;
          message?: string;
        };
        const validationErrors = errorData?.errors || [];

        // Handle specific error cases
        if (errorData?.code === 'DUPLICATE_SLUG') {
          throw new Error(
            `Slug "${errorData.slug}" already exists. Please try a different one.`
          );
        }

        if (validationErrors.length > 0) {
          return {
            success: false,
            errors: validationErrors,
          };
        }

        if (errorData?.message) {
          throw new Error(errorData.message);
        }
      }
      throw new Error('Failed to create product. Please try again.');
    }
  },

  async updateProduct(
    id: number,
    productData: FormData,
    token: string
  ): Promise<Product> {
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
      return response as unknown as Product;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as {
          errors?: Array<{ field: string; message: string }>;
          code?: string;
          slug?: string;
          message?: string;
        };
        const validationErrors = errorData?.errors || [];

        // Handle specific error cases
        if (errorData?.code === 'DUPLICATE_SLUG') {
          throw new Error(
            `Slug "${errorData.slug}" already exists. Please try a different one.`
          );
        }

        if (validationErrors.length > 0) {
          throw new Error(JSON.stringify(validationErrors));
        }

        if (errorData?.message) {
          throw new Error(errorData.message);
        }
      }
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteProduct(id: number, token: string) {
    try {
      const response = await axiosInstance.delete(`${API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  },

  // Bulk delete products
  async bulkDeleteProducts(ids: number[], token: string) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Invalid input: ids should be a non-empty array.');
    }

    try {
      // Make sure all IDs are valid numbers
      const validatedIds = ids.map((id) => parseInt(String(id), 10));

      // Check for invalid IDs after conversion
      if (validatedIds.some((id) => isNaN(id) || id <= 0)) {
        throw new Error('Invalid product IDs detected');
      }

      // Try the most common API format first
      const response = await axiosInstance.delete(
        `${API_URL}/products/bulk-delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { ids },
        }
      );

      return response;
    } catch (error) {
      console.error('Error in bulkDeleteProducts service:', error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data as {
          message?: string;
          error?: string;
        };

        console.error('API Response:', status, responseData);

        // Enrich error with more context
        const enhancedError = new Error(
          responseData?.message ||
            responseData?.error ||
            'A database error occurred during bulk deletion'
        ) as BulkDeletionError;

        // Add original response data to the error
        enhancedError.responseData = responseData;
        enhancedError.status = status;

        throw enhancedError;
      }

      throw error;
    }
  },
};
