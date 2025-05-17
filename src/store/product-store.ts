import { productService } from '../services/products.service';
import { create } from 'zustand';
import toast from 'react-hot-toast';
import { useAuthStore } from './auth';
import axios from 'axios';
import {
  Product,
  ProductAPIResponse,
  ValidationError,
  ProductStats,
  ProductFilter,
} from '@/types/product';
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
      set({ loading: true });
      const stats = await productService.getProductStats();
      console.log('store Stats', stats);
      set({ stats, loading: false });
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

      // Transform API response to Product type
      const transformedProducts: Product[] = response.items.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        isActive: item.is_active,
        availability: item.availability,
        categories: item.categories?.map((cat) => cat.id) || [],
        images: item.image_urls || [],
        imageUrls: item.image_urls || [],
        price: Number(item.price),
        discount: Number(item.discount),
        costPerUnit: Number(item.cost_per_unit),
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        quantity: Number(item.quantity || 0),
      }));

      set({
        products: transformedProducts,
        totalCount: response.meta?.totalItems || 0,
        currentPage: response.meta?.currentPage || 1,
        pageSize: response.meta?.itemsPerPage || 10,
        totalPages: response.meta?.totalPages || 1,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'Failed to load products';
        toast.error(message);
      } else {
        toast.error('Failed to load products');
      }
      console.error('Error loading products:', error);
    }
  },

  // Load single product by ID
  loadProduct: async (id: number): Promise<ProductAPIResponse | null> => {
    set({ loading: true });

    try {
      const product = await productService.getProductById(id);

      // Check if response exists and has the expected structure
      if (!product) {
        set({ loading: false });
        toast.error('Product not found or invalid data received');
        return null;
      }

      const transformedProduct: ProductAPIResponse = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        is_active: product.is_active,
        availability: product.availability,
        categories: product.categories,
        image_urls: product.image_urls,
        price: Number(product.price),
        discount: Number(product.discount),
        cost_per_unit: Number(product.cost_per_unit),
        created_at: product.created_at,
        updated_at: product.updated_at,
        quantity: Number(product.quantity || 0),
      };

      set({
        currentProduct: transformedProduct,
        loading: false,
      });

      return transformedProduct;
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product details');

      set({ loading: false });
      return null;
    }
  },

  // Create new product
  createProduct: async (formData: FormData): Promise<Product | null> => {
    set({ submitting: true, validationErrors: [] });

    try {
      const { token } = useAuthStore.getState();

      if (!token) {
        toast.error('Authentication token is missing');
        set({ submitting: false });
        return null;
      }

      const response = await productService.createProduct(formData, token);

      // Update products list
      set((state) => ({
        products: [...state.products],
        submitting: false,
      }));

      toast.success('Product created successfully');
      return response;
    } catch (error) {
      set({ submitting: false });

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
          toast.error(errorData?.message || 'Failed to create product');
        }
      } else {
        toast.error('Failed to create product');
      }

      console.error('Error creating product:', error);
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
        toast.error('Authentication token is missing');
        set({ submitting: false });
        return null;
      }

      const response = await productService.updateProduct(id, formData, token);
      console.log('response update product', response);

      if (!response.data) {
        toast.error('Failed to update product');
        set({ submitting: false });
        return null;
      }

      const updatedProductData = response.data;

      // Transform API response to Product type
      const updatedProduct: Product = {
        id: updatedProductData.id,
        name: updatedProductData.name,
        slug: updatedProductData.slug,
        description: updatedProductData.description,
        isActive: updatedProductData.is_active,
        availability: updatedProductData.availability,
        categories:
          updatedProductData.categories?.map((cat: Category) => cat.id) || [],
        images: updatedProductData.image_urls || [],
        imageUrls: updatedProductData.image_urls || [],
        price: Number(updatedProductData.price),
        discount: Number(updatedProductData.discount),
        costPerUnit: Number(updatedProductData.cost_per_unit),
        createdAt: updatedProductData.created_at,
        updatedAt: updatedProductData.updated_at,
        quantity: Number(updatedProductData.quantity || 0),
      };

      // Update products list
      set((state) => ({
        products: state.products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        ),
        submitting: false,
      }));

      toast.success('Product updated successfully');
      return updatedProduct;
    } catch (error) {
      set({ submitting: false });

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
          toast.error(errorData?.message || 'Failed to update product');
        }
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
