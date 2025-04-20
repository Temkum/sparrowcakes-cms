import { productService } from '../services/products.service';
import { create } from 'zustand';
import toast from 'react-hot-toast';
import { Product } from '@/pages/admin/products/types/product.types';
import { useAuthStore } from './auth';

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
  currentProduct: Product | null;
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
  loadProduct: (id: number) => Promise<Product | null>;
  loadStats: () => Promise<void>;
  createProduct: (formData: FormData) => Promise<Product | null>;
  updateProduct: (id: number, formData: FormData) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  bulkDeleteProducts: (ids: string[]) => Promise<boolean>;
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
      const response = await productService.getProductStats();
      set({ stats: response });
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
        products: response.items,
        totalCount: response.totalCount,
        currentPage: response.currentPage,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to load products');
      console.error('Error loading products:', error);
    }
  },

  // Load single product by ID
  loadProduct: async (id: number) => {
    set({ loading: true });
    try {
      const response = await productService.getProductById(id);
      set({
        currentProduct: response.data,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to load product details');
      console.error('Error loading product:', error);
      return null;
    }
  },

  // Create new product
  createProduct: async (formData: FormData) => {
    set({ submitting: true, validationErrors: [] });

    try {
      const response = await productService.createProduct(
        formData,
        useAuthStore.getState().token
      );
      set({ submitting: false });
      toast.success('Product created successfully');
      return response.data as Product;
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
      }
      // Handle specific slug error
      else if (error.message.includes('Slug')) {
        set({
          validationErrors: [
            {
              field: 'slug',
              message: error.message,
            },
          ],
        });
      }
      // Handle other errors
      else {
        toast.error(error.message || 'Failed to create product');
      }

      return null;
    }
  },

  // Update existing product
  updateProduct: async (id: number, formData: FormData) => {
    set({
      submitting: true,
      validationErrors: [],
    });

    try {
      const response = await productService.updateProduct(id, formData, '');

      set({
        currentProduct: response.data,
        submitting: false,
      });

      return response.data;
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
        toast.error('Failed to update product');
      }

      console.error('Error updating product:', error);
      return null;
    }
  },

  // Delete product
  deleteProduct: async (id: number) => {
    try {
      // const { token } = useAuthStore.getState();
      await productService.deleteProduct(id);

      // Update product list by filtering out the deleted product
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        totalCount: state.totalCount - 1,
      }));

      return true;
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error deleting product:', error);
      return false;
    }
  },

  bulkDeleteProducts: async (ids: string[]) => {
    try {
      set({ loading: true });
      await productService.bulkDeleteProducts(ids);

      // Refresh products after deletion
      await get().loadProducts();
      await get().loadStats();

      set({ loading: false });
      return true;
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to delete selected products');
      console.error('Error bulk deleting products:', error);
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
