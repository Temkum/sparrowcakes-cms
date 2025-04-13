import { productService } from '../services/products.service';
import { create } from 'zustand';
import toast from 'react-hot-toast';

// Define your types
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  costPerUnit: number;
  isActive: boolean;
  availability: Date;
  categories: { id: number; name: string }[];
  images: string[];
}

interface ValidationError {
  field: string;
  message: string;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
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
  createProduct: (formData: FormData, token: string) => Promise<Product | null>;
  updateProduct: (
    id: number,
    formData: FormData,
    token: string
  ) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
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
  },
  validationErrors: [],

  // Set filter and load products
  setFilter: (filter: Partial<ProductFilter>) => {
    set((state) => ({
      filter: { ...state.filter, ...filter },
    }));
    get().loadProducts();
  },

  // Reset filter to defaults
  resetFilter: () => {
    set({
      filter: {
        page: 1,
        pageSize: 10,
        sortBy: 'updatedAt',
        sortDirection: 'desc',
      },
    });
    get().loadProducts();
  },

  // Load all products with filter
  loadProducts: async () => {
    set({ loading: true });
    try {
      const response = await productService.getProducts();

      set({
        products: response.data.items,
        totalCount: response.data.totalCount,
        currentPage: response.data.currentPage,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
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
  createProduct: async (formData: FormData, token: string) => {
    set({
      submitting: true,
      validationErrors: [],
    });

    try {
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const response = await productService.createProduct(formData, token);

      set({ submitting: false });
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
        toast.error('Failed to create product');
      }

      console.error('Error creating product:', error);
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
      const response = await productService.updateProduct(id, formData);

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
