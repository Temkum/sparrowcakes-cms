import axios from 'axios';
import axiosInstance from './axiosInstance';
import type {
  BulkDeletionError,
  ProductStats,
  ProductAPIResponse,
  PaginatedProductsResponse,
} from '@/types/product';

export const productService = {
  // Get all products with optional pagination
  async getProducts(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = '',
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedProductsResponse> {
    try {
      // Convert frontend's lowercase sort direction to uppercase for backend
      const backendSortDirection = sortDirection.toUpperCase() as
        | 'ASC'
        | 'DESC';

      const response = await axiosInstance.get('/products', {
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
            .map(
              ([key, value]) => `${key}=${encodeURIComponent(String(value))}`
            )
            .join('&');
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as { message?: string };
        throw new Error(errorData?.message || 'Failed to fetch products');
      }
      throw new Error('Failed to fetch products. Please try again.');
    }
  },

  async getProductStats(): Promise<ProductStats> {
    try {
      const response = await axiosInstance.get('/products/stats');
      console.log('product stats', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product stats:', error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as { message?: string };
        throw new Error(errorData?.message || 'Failed to fetch product stats');
      }
      throw new Error('Failed to fetch product stats. Please try again.');
    }
  },

  // Get a single product by ID
  async getProductById(id: number): Promise<ProductAPIResponse> {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      console.log('product', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as { message?: string };
        throw new Error(
          errorData?.message || `Failed to fetch product with ID ${id}`
        );
      }
      throw new Error('Failed to fetch product. Please try again.');
    }
  },

  // Create a new product
  async createProduct(productData: FormData): Promise<ProductAPIResponse> {
    try {
      const response = await axiosInstance.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
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
          throw new Error(
            validationErrors.map((e) => `${e.field}: ${e.message}`).join('\n')
          );
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
    productData: FormData
  ): Promise<ProductAPIResponse> {
    try {
      const response = await axiosInstance.put(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
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

  async deleteProduct(id: number): Promise<{ success: boolean }> {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as { message?: string };
        throw new Error(
          errorData?.message || `Failed to delete product with ID ${id}`
        );
      }
      throw new Error('Failed to delete product. Please try again.');
    }
  },

  // Bulk delete products
  async bulkDeleteProducts(ids: number[]): Promise<{
    success: boolean;
    deleted: number;
    errors?: BulkDeletionError[];
  }> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Invalid input: ids should be a non-empty array.');
    }

    // Make sure all IDs are valid numbers
    const validatedIds = ids.map((id) => parseInt(String(id), 10));

    // Check for invalid IDs after conversion
    if (validatedIds.some((id) => isNaN(id) || id <= 0)) {
      throw new Error('Invalid product IDs detected');
    }

    try {
      const response = await axiosInstance.delete('/products/bulk', {
        data: { ids: validatedIds },
      });

      return response.data;
    } catch (error) {
      console.error('Error in bulkDeleteProducts service:', error);

      // Handle different error formats
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as {
          message?: string;
          error?: string;
          errors?: Array<{ id: number; message: string }>;
        };

        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          'Failed to delete products. Please try again.';

        // If we have detailed errors, include them
        if (errorData?.errors && errorData.errors.length > 0) {
          return {
            success: false,
            deleted: 0,
            errors: errorData.errors.map((e) => ({
              id: e.id,
              message: e.message,
              name: 'BulkDeletionError',
            })),
          };
        }

        throw new Error(errorMessage);
      }

      // For non-Axios errors, rethrow as is
      throw error;
    }
  },

  // Fetch popular products from the backend
  async getPopularProducts(limit: number = 5) {
    try {
      const response = await axiosInstance.get('/products/popular', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular products:', error);
      throw new Error('Failed to fetch popular products. Please try again.');
    }
  },

  async getSimilarProducts(productId: number, limit: number = 6) {
    const parsedId = Number(productId);
    if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
      throw new Error('Invalid productId');
    }
    try {
      const response = await axiosInstance.get('/products/similar', {
        params: { productId: parsedId, limit },
      });
      console.log('similar products', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar products:', error);
      throw new Error('Failed to fetch similar products. Please try again.');
    }
  },

  async getProductReviews(productId: number) {
    try {
      const response = await axiosInstance.get('/products/product-reviews', {
        params: { productId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw new Error('Failed to fetch product reviews. Please try again.');
    }
  },

  async getProductWithReviews(productId: number) {
    // Validate productId is a valid number
    const parsedId = Number(productId);
    if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
      throw new Error('Invalid product ID');
    }

    try {
      // Use route parameter instead of query parameter
      const response = await axiosInstance.get(`/products/details/${parsedId}`);
      console.log('product with reviews', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product with reviews:', error);
      throw new Error(
        'Failed to fetch product with reviews. Please try again.'
      );
    }
  },

  async getSimilarProductsByCategory(categoryId: number, limit: number = 6) {
    const parsedId = Number(categoryId);
    if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
      throw new Error('Invalid categoryId');
    }
    try {
      const response = await axiosInstance.get(
        `/products/similar-by-category/${parsedId}`,
        {
          params: { limit },
        }
      );
      console.log('similar products by category', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar products by category:', error);
      throw new Error(
        'Failed to fetch similar products by category. Please try again.'
      );
    }
  },
};
