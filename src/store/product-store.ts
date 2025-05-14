import { productService } from '../services/products.service';
import { create } from 'zustand';
import toast from 'react-hot-toast';
import {
  Product,
  ProductAPIResponse,
} from '@/pages/admin/products/types/product.types';
import { useAuthStore } from './auth';
import axios from 'axios';

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  averagePrice: number;
}

interface ValidationError {
  field: string;
  message: string;
}

interface ProductState {
  products: Product[];
  currentProduct: ProductAPIResponse | null | undefined;
  stats: ProductStats;
  loading: boolean;
  submitting: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  filter: ProductFilter;
  validationErrors: ValidationError[];

  // Actions
  setFilter: (filter: Partial<ProductFilter>) => void;
  resetFilter: () => void;
  loadProducts: () => Promise<void>;
  loadProduct: (id: number) => Promise<ProductAPIResponse | null>;
  loadStats: () => Promise<void>;
  createProduct: (formData: FormData) => Promise<Product | null>;
  updateProduct: (id: number, formData: FormData) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  bulkDeleteProducts: (ids: number[]) => Promise<boolean>;
  clearCurrentProduct: () => void;
  clearValidationErrors: () => void;
}

interface ProductFilter {
  searchTerm?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  stats: {
    totalProducts: 0,
    activeProducts: 0,
    averagePrice: 0,
  },
  loading: false,
  submitting: false,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  totalPages: 0,
  filter: {
    page: 1,
    pageSize: 10,
    sortBy: 'updatedAt',
    sortDirection: 'desc',
    searchTerm: '',
  },
  validationErrors: [],

  // Set filter and load products
  setFilter: (filter: Partial<ProductFilter>) => {
    set((state) => ({
      filter: { ...state.filter, ...filter },
    }));
  },

  // Reset filter to defaults
  resetFilter: () => {
    set({
      filter: {
        page: 1,
        pageSize: 10,
        sortBy: 'updatedAt',
        sortDirection: 'desc',
        searchTerm: '',
      },
    });
    get().loadProducts();
  },

  // Load product stats
  loadStats: async () => {
    try {
      const stats = await productService.getProductStats();
      set({ stats });
    } catch (error) {
      console.error('Error loading product stats:', error);
    }
  },
  // Load products with pagination and filtering
  loadProducts: async () => {
    set({ loading: true });

    try {
      const { filter } = get();

      const response = await productService.getProducts(
        Number(filter.page),
        Number(filter.pageSize),
        filter.searchTerm,
        filter.sortBy,
        filter.sortDirection || 'desc'
      );

      set({
        products: response.items || [],
        totalCount: response.totalCount || 0,
        currentPage: response.currentPage || 1,
        pageSize: response.pageSize || 10,
        totalPages: response.totalPages || 1,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to load products');
      console.error('Error loading products:', error);
    }
  },

  // Load single product by ID
  loadProduct: async (id: number): Promise<ProductAPIResponse | null> => {
    set({ loading: true });

    try {
      const response = await productService.getProductById(id);

      // Check if response exists and has the expected structure
      if (!response || !response.id) {
        set({ loading: false });
        toast.error('Product not found or invalid data received');

        return null;
      }

      // Transform dates to ensure they're valid
      const product: ProductAPIResponse = {
        id: response.id,
        name: response.name,
        slug: response.slug,
        description: response.description,
        created_at: new Date(response.created_at || '').toISOString(),
        updated_at: new Date(response.updated_at || '').toISOString(),
        availability: new Date(response.availability || '').toISOString(),
        // Ensure other fields match the Product type
        image_urls: Array.isArray(response.image_urls)
          ? response.image_urls
          : [],
        categories: Array.isArray(response.categories)
          ? response.categories
          : [],
        is_active: Boolean(response.is_active),
        price: Number(response.price),
        cost_per_unit: Number(response.cost_per_unit),
        discount: Number(response.discount),
        quantity: Number(response.quantity),
      };

      console.log('product store', product);

      set({
        currentProduct: product,
        loading: false,
      });

      return product;
    } catch (error: any) {
      set({ loading: false });
      console.error('Error loading product:', {
        error,
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });

      toast.error(
        error.response?.data?.message || 'Failed to load product details'
      );
      return null;
    }
  },

  // Create new product
  createProduct: async (formData: FormData): Promise<Product | null> => {
    set({ submitting: true, validationErrors: [] });

    try {
      const { token } = useAuthStore.getState();

      if (!token) {
        toast.error('You must be logged in to create a product');
        set({ submitting: false });
        return null;
      }

      const response = await productService.createProduct(formData, token);

      // Convert the response to a Product type
      const product: Product = {
        id: response.id,
        name: response.name,
        slug: response.slug,
        description: response.description,
        isActive: response.is_active,
        is_active: response.is_active,
        availability: response.availability,
        categories: response.categories || [],
        images: [],
        image_urls: response.image_urls || [],
        price: Number(response.price),
        discount: Number(response.discount),
        costPerUnit: Number(response.cost_per_unit),
        cost_per_unit: Number(response.cost_per_unit),
        createdAt: response.created_at,
        created_at: response.created_at,
        updatedAt: response.updated_at,
        updated_at: response.updated_at,
        quantity: Number(response.quantity || 0),
      };

      set({ submitting: false });
      toast.success('Product created successfully');

      return product;
    } catch (error: any) {
      set({ submitting: false });

      // Handle structured validation errors
      if (error.message.startsWith('[')) {
        try {
          const errors = JSON.parse(error.message);
          const formattedErrors = errors.map((e: any) => ({
            field: e.field || e.path || 'unknown',
            message: e.message || 'Validation error',
          }));
          set({ validationErrors: formattedErrors });
        } catch {
          // If parsing fails, treat as regular error
          toast.error(error.message);
        }
      } else if (error.message.includes('Slug')) {
        // Handle specific slug error
        set({
          validationErrors: [
            {
              field: 'slug',
              message: error.message,
            },
          ],
        });
      } else {
        // Handle other errors
        toast.error(error.message || 'Failed to create product');
      }

      return null;
    }
  },

  // Update existing product
  updateProduct: async (
    id: number,
    formData: FormData
  ): Promise<Product | null> => {
    set({ submitting: true, validationErrors: [] });

    try {
      const { token } = useAuthStore.getState();

      if (!token) {
        toast.error('You must be logged in to update a product');
        set({ submitting: false });
        return null;
      }

      const response = await productService.updateProduct(id, formData, token);

      // Convert the response to a Product type
      const product: Product = {
        id: response.id,
        name: response.name,
        slug: response.slug,
        description: response.description,
        isActive: response.is_active,
        is_active: response.is_active,
        availability: response.availability,
        categories: response.categories || [],
        images: [],
        image_urls: response.image_urls || [],
        price: Number(response.price),
        discount: Number(response.discount),
        costPerUnit: Number(response.cost_per_unit),
        cost_per_unit: Number(response.cost_per_unit),
        createdAt: response.created_at,
        created_at: response.created_at,
        updatedAt: response.updated_at,
        updated_at: response.updated_at,
        quantity: Number(response.quantity || 0),
      };

      set({
        submitting: false,
        currentProduct: response,
      });

      toast.success('Product updated successfully');

      return product;
    } catch (error: any) {
      set({ submitting: false });

      // Handle validation errors
      if (error.response?.data?.errors) {
        const formattedErrors = error.response.data.errors.map((e: string) => {
          const [field, message] = e.split(':');
          return { field: field.trim(), message: message.trim() };
        });

        set({ validationErrors: formattedErrors });
      } else {
        toast.error(error.message || 'Failed to update product');
      }

      console.error('Error updating product:', error);
      return null;
    }
  },

  // Delete product
  deleteProduct: async (id: number) => {
    try {
      const { token } = useAuthStore.getState();

      if (!token) {
        toast.error('Authentication token is missing');
        return false;
      }

      await productService.deleteProduct(id, token);

      // Update local state after successful deletion
      const updatedProducts = get().products.filter(
        (product) => product.id !== id
      );
      set((state) => ({
        products: updatedProducts,
        totalCount: state.totalCount - 1,
      }));

      // Refresh the products list and stats
      await get().loadProducts();
      await get().loadStats();

      toast.success('Product deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error deleting product:', error);
      return false;
    }
  },

  bulkDeleteProducts1: async (ids: number[]) => {
    try {
      set({ loading: true });

      const { token } = useAuthStore.getState();
      if (!token) {
        set({ loading: false });
        toast.error('Authentication token is missing');
        return false;
      }

      // Validate ids
      if (!Array.isArray(ids) || ids.length === 0) {
        set({ loading: false });
        toast.error('No products selected for deletion');
        return false;
      }

      // Ensure all IDs are numbers
      const validatedIds = ids.map((id) => Number(id));

      await productService.bulkDeleteProducts(validatedIds, token);

      // Update local state after successful deletion
      set((state) => ({
        products: state.products.filter(
          (product) => !validatedIds.includes(product.id!)
        ),
        totalCount: state.totalCount - validatedIds.length,
      }));

      // Refresh data
      await get().loadProducts();
      await get().loadStats();

      set({ loading: false });
      return true;
    } catch (error) {
      set({ loading: false });
      console.error('Error bulk deleting products:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Failed to delete selected products';
        toast.error(errorMessage);
      } else {
        toast.error('Failed to delete selected products');
      }

      return false;
    }
  },

  bulkDeleteProducts: async (ids: number[]) => {
    try {
      set({ loading: true });

      const { token } = useAuthStore.getState();
      if (!token) {
        set({ loading: false });
        toast.error('Authentication token is missing');
        return false;
      }

      // Validate ids
      if (!Array.isArray(ids) || ids.length === 0) {
        set({ loading: false });
        toast.error('No products selected for deletion');
        return false;
      }

      try {
        // First attempt: standard bulk delete
        await productService.bulkDeleteProducts(ids, token);

        // Update UI on success
        toast.success(`Successfully deleted ${ids.length} product(s)`);

        // Refresh product list
        await get().loadStats();
        await get().loadProducts();

        set({ loading: false });
        return true;
      } catch (bulkError) {
        console.error('Bulk delete failed:', bulkError);

        // Extract any useful error information
        let errorMessage = 'Database error occurred during bulk deletion';
        if (bulkError instanceof Error) {
          errorMessage = bulkError.message;
        }

        // If there's a specific database constraint error, show it
        if (
          errorMessage.includes('constraint') ||
          errorMessage.includes('reference')
        ) {
          toast.error(
            'Some products cannot be deleted because they are referenced by other items'
          );
          set({ loading: false });
          return false;
        }

        // Plan B: Try fallback to individual deletes if bulk fails
        let successCount = 0;
        let failureCount = 0;

        for (const id of ids) {
          try {
            await productService.deleteProduct(id, token);
            successCount++;
          } catch (singleError) {
            console.error(`Failed to delete product ${id}:`, singleError);
            failureCount++;
          }
        }

        // Report results of individual deletes
        if (successCount > 0 && failureCount > 0) {
          toast.error(
            `Partially succeeded: Deleted ${successCount} out of ${ids.length} products`
          );
        } else if (successCount > 0) {
          toast.success(`Successfully deleted ${successCount} product(s)`);
        } else {
          toast.error('Failed to delete any products');
          set({ loading: false });
          return false;
        }

        // Refresh data
        await get().loadProducts();

        set({ loading: false });
        return successCount > 0;
      }
    } catch (error) {
      set({ loading: false });
      console.error('Error in bulkDeleteProducts store method:', error);

      let errorMessage = 'Failed to delete selected products';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
      return false;
    }
  },
  // Clear current product from state
  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },

  // Clear validation errors
  clearValidationErrors: () => {
    set({ validationErrors: [] });
  },
}));

export default useProductStore;
