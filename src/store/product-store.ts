import { productService } from '../services/products.service';
import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Product,
  ProductAPIResponse,
  ValidationError,
  ProductStats,
  ProductFilter,
} from '@/types/product';

// Type guard for validation error responses
const isValidationErrorResponse = (
  resp: unknown
): resp is {
  success: boolean;
  errors: { field: string; message: string }[];
} => {
  if (!resp || typeof resp !== 'object') return false;
  const obj = resp as Record<string, unknown>;
  return (
    typeof obj.success === 'boolean' &&
    Array.isArray(obj.errors) &&
    obj.errors.every(
      (err): err is { field: string; message: string } =>
        typeof err === 'object' &&
        err !== null &&
        typeof (err as Record<string, unknown>).field === 'string' &&
        typeof (err as Record<string, unknown>).message === 'string'
    )
  );
};

// Utility function to transform API response to Product
const transformApiResponseToProduct = (
  response: ProductAPIResponse
): Product => ({
  id: response.id,
  name: response.name,
  slug: response.slug,
  description: response.description,
  isActive: response.is_active,
  availability: response.availability,
  categories: response.categories?.map((cat) => cat.id) || [],
  images: response.image_urls || [],
  imageUrls: response.image_urls || [],
  price: Number(response.price),
  discount: Number(response.discount),
  costPerUnit: Number(response.cost_per_unit),
  createdAt: response.created_at,
  updatedAt: response.updated_at,
  quantity: Number(response.quantity || 0),
});

interface ProductState {
  products: Product[];
  currentProduct: ProductAPIResponse | null;
  stats: ProductStats;

  // Separate loading states for different operations
  loadingProducts: boolean;
  loadingStats: boolean;
  loadingProduct: boolean;
  submitting: boolean;
  deleting: boolean;

  // Error state management
  error: string | null;

  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  filter: ProductFilter;
  validationErrors: ValidationError[];

  // Actions
  setFilter: (filter: Partial<ProductFilter>) => Promise<void>;
  resetFilter: () => Promise<void>;
  loadProducts: () => Promise<ProductAPIResponse[] | undefined>;
  loadProduct: (id: number) => Promise<ProductAPIResponse | null>;
  loadStats: () => Promise<void>;
  createProduct: (formData: FormData) => Promise<Product | null>;
  updateProduct: (id: number, formData: FormData) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  bulkDeleteProducts: (ids: number[]) => Promise<boolean>;
  clearCurrentProduct: () => void;
  clearValidationErrors: () => void;
  setError: (error: string | null) => void;
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  stats: {
    totalProducts: 0,
    activeProducts: 0,
    averagePrice: 0,
  },

  // Separate loading states
  loadingProducts: false,
  loadingStats: false,
  loadingProduct: false,
  submitting: false,
  deleting: false,

  // Error state
  error: null,

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

  // Set error state
  setError: (error: string | null) => {
    set({ error });
  },

  // Set filter and auto-reload products
  setFilter: async (filter: Partial<ProductFilter>) => {
    set((state) => ({
      filter: { ...state.filter, ...filter },
    }));

    // Auto-reload products when filter changes
    await get().loadProducts();
  },

  // Reset filter to defaults and reload
  resetFilter: async () => {
    set({
      filter: {
        page: 1,
        pageSize: 10,
        sortBy: 'updatedAt',
        sortDirection: 'desc',
        searchTerm: '',
      },
    });
    await get().loadProducts();
  },

  // Load product stats
  loadStats: async () => {
    set({ loadingStats: true, error: null });

    try {
      const stats = await productService.getProductStats();
      set({ stats });
    } catch (error) {
      console.error('Error loading product stats:', error);
      toast.error('Failed to load product stats');
    } finally {
      set({ loadingStats: false });
    }
  },

  // Load products with pagination and filtering
  loadProducts: async () => {
    set({ loadingProducts: true, error: null });

    try {
      const { filter } = get();

      const response = await productService.getProducts(
        Number(filter.page),
        Number(filter.pageSize),
        filter.searchTerm,
        filter.sortBy,
        filter.sortDirection || 'desc'
      );

      // Transform API response to Product type
      const transformedProducts: Product[] = response.items.map(
        transformApiResponseToProduct
      );

      set({
        products: transformedProducts,
        totalCount: response.meta?.totalItems || 0,
        currentPage: response.meta?.currentPage || 1,
        pageSize: response.meta?.itemsPerPage || 10,
        totalPages: response.meta?.totalPages || 1,
      });

      return response.items;
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');

      return [];
    } finally {
      set({ loadingProducts: false });
    }
  },

  // Load single product by ID
  loadProduct: async (id: number): Promise<ProductAPIResponse | null> => {
    set({ loadingProduct: true, error: null });

    try {
      const response = await productService.getProductById(id);

      if (!response) {
        return null;
      }

      const transformedProduct: ProductAPIResponse = {
        id: response.id,
        name: response.name,
        slug: response.slug,
        description: response.description,
        price: Number(response.price),
        cost_per_unit: Number(response.cost_per_unit),
        discount: Number(response.discount),
        quantity: Number(response.quantity || 0),
        image_urls: response.image_urls || [],
        is_active: response.is_active,
        created_at: response.created_at,
        updated_at: response.updated_at,
        availability: response.availability,
        categories: response.categories || [],
      };

      set({ currentProduct: transformedProduct });
      return transformedProduct;
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product details');

      return null;
    } finally {
      set({ loadingProduct: false });
    }
  },

  // Create new product
  createProduct: async (formData: FormData): Promise<Product | null> => {
    set({ submitting: true, validationErrors: [], error: null });

    try {
      const response:
        | ProductAPIResponse
        | { success: boolean; errors: { field: string; message: string }[] } =
        await productService.createProduct(formData);

      if (isValidationErrorResponse(response)) {
        set({
          validationErrors: response.errors.map(
            (err: { field: string; message: string }) => ({
              field: err.field,
              message: err.message,
            })
          ),
        });
        return null;
      }

      // Transform API response to Product type
      const newProduct: Product = transformApiResponseToProduct(response);

      set((state) => ({
        products: [...state.products, newProduct],
      }));

      toast.success('Product created successfully');

      // Refresh stats after creating
      await get().loadStats();

      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        if (errorData?.validation) {
          set({
            validationErrors: errorData.validation.map(
              (err: { field: string; message: string }) => ({
                field: err.field,
                message: err.message,
              })
            ),
          });
        } else {
          const message = errorData?.message || 'Failed to create product';
          set({ error: message });
          toast.error(message);
        }
      } else {
        const message = 'Failed to create product';
        set({ error: message });
        toast.error(message);
      }

      return null;
    } finally {
      set({ submitting: false });
    }
  },

  // Update existing product
  updateProduct: async (
    id: number,
    formData: FormData
  ): Promise<Product | null> => {
    set({ submitting: true, validationErrors: [], error: null });

    try {
      const response: ProductAPIResponse = await productService.updateProduct(
        id,
        formData
      );

      // Transform API response to Product type
      const updatedProduct: Product = transformApiResponseToProduct(response);

      set((state) => ({
        products: state.products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        ),
      }));

      toast.success('Product updated successfully');

      // Refresh stats after updating
      await get().loadStats();

      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        if (errorData?.validation) {
          set({
            validationErrors: errorData.validation.map(
              (err: { field: string; message: string }) => ({
                field: err.field,
                message: err.message,
              })
            ),
          });
        } else {
          const message = errorData?.message || 'Failed to update product';
          set({ error: message });
          toast.error(message);
        }
      } else {
        const message = 'Failed to update product';
        set({ error: message });
        toast.error(message);
      }

      return null;
    } finally {
      set({ submitting: false });
    }
  },

  // Delete single product - simplified approach
  deleteProduct: async (id: number): Promise<boolean> => {
    set({ deleting: true, error: null });

    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');

      // Refresh data after deletion
      await Promise.all([get().loadProducts(), get().loadStats()]);

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');

      return false;
    } finally {
      set({ deleting: false });
    }
  },

  // Simplified bulk delete
  bulkDeleteProducts: async (ids: number[]): Promise<boolean> => {
    if (!Array.isArray(ids) || ids.length === 0) {
      toast.error('No products selected for deletion');
      return false;
    }

    set({ deleting: true, error: null });

    try {
      await productService.bulkDeleteProducts(ids);
      toast.success(`Successfully deleted ${ids.length} product(s)`);

      // Refresh data after bulk deletion
      await Promise.all([get().loadProducts(), get().loadStats()]);

      return true;
    } catch (error) {
      console.error('Bulk delete failed:', error);
      toast.error('Failed to delete products');

      let message = 'Failed to delete products';

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;

        // Handle specific constraint errors
        if (message.includes('constraint') || message.includes('reference')) {
          message =
            'Some products cannot be deleted because they are referenced by other items';
        }
      }

      toast.error(message);

      return false;
    } finally {
      set({ deleting: false });
    }
  },

  // Clear current product from state
  clearCurrentProduct: () => {
    set({ currentProduct: null, error: null });
  },

  // Clear validation errors
  clearValidationErrors: () => {
    set({ validationErrors: [] });
  },
}));

export default useProductStore;
