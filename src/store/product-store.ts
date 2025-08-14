import { create } from 'zustand';
import toast from 'react-hot-toast';
import { productService } from '@/services/products.service';
import {
  Product,
  ProductAPIResponse,
  ProductStats,
  ProductFilter,
  ValidationError,
} from '@/types/product';
import { Review } from '@/types/review';

const transformApiResponseToProduct = (
  response: ProductAPIResponse
): Product => ({
  id: response.id,
  name: response.name,
  slug: response.slug,
  images: response.image_urls || [],
  description: response.description,
  price: Number(response.price),
  discount: Number(response.discount),
  costPerUnit: Number(response.cost_per_unit),
  quantity: Number(response.quantity || 0),
  imageUrls: response.image_urls || [],
  isActive: response.is_active,
  availableFrom: response.available_from ? new Date(response.available_from) : null,
  availableTo: response.available_to ? new Date(response.available_to) : null,
  categories: response.categories?.map((cat) => cat.id) || [],
  reviews:
    response.reviews?.map((review) => ({
      id: review.id,
      productId: review.product?.id || 0,
      customerId: review.customer?.id || 0,
      rating: review.rating,
      comment: review.comment,
      isActive: review.display,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
    })) || [],
  totalReviews: response.reviews?.length || 0,
  createdAt: response.created_at,
  updatedAt: response.updated_at,
});

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  similarProducts: Product[];
  stats: ProductStats;
  loadingProducts: boolean;
  loadingStats: boolean;
  loadingProduct: boolean;
  loadingSimilarProducts: boolean;
  submitting: boolean;
  deleting: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  filter: ProductFilter;
  validationErrors: ValidationError[];
  loadingPopularProducts: boolean;
  popularProducts: Product[];
  loadingProductReviews: boolean;
  productReviews: Review[];
  loadingProductDetails: boolean;

  setFilter: (filter: Partial<ProductFilter>) => Promise<void>;
  resetFilter: () => Promise<void>;
  loadProducts: () => Promise<ProductAPIResponse[] | undefined>;
  loadProduct: (id: number) => Promise<Product | null>;
  loadSimilarProducts: (
    categoryIds: number[],
    excludeId: number
  ) => Promise<void>;
  loadStats: () => Promise<void>;
  createProduct: (formData: FormData) => Promise<Product | null>;
  updateProduct: (id: number, formData: FormData) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  bulkDeleteProducts: (ids: number[]) => Promise<boolean>;
  clearCurrentProduct: () => void;
  clearValidationErrors: () => void;
  setError: (error: string | null) => void;
  loadPopularProducts: (limit?: number) => Promise<void>;
  loadProductDetails: (id: number) => Promise<Product | null>;
  loadAllProductsForAdmin: () => Promise<ProductAPIResponse[] | undefined>;
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  similarProducts: [],
  stats: { totalProducts: 0, activeProducts: 0, averagePrice: 0 },
  loadingProducts: false,
  loadingStats: false,
  loadingProduct: false,
  loadingSimilarProducts: false,
  loadingPopularProducts: false,
  loadingProductReviews: false,
  loadingProductDetails: false,
  productReviews: [],
  popularProducts: [],
  submitting: false,
  deleting: false,
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
  setError: (error) => set({ error }),
  setFilter: async (filter) => {
    set((state) => ({ filter: { ...state.filter, ...filter } }));
    await get().loadProducts();
  },
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

  loadAllProducts: async () => {
    set({ loadingProducts: true, error: null });
    try {
      const response = await productService.getAllProducts();
      const transformedProducts: Product[] = response.map(
        transformApiResponseToProduct
      );
      set({
        products: transformedProducts,
        totalCount: response.length,
        currentPage: 1,
        pageSize: response.length,
        totalPages: 1,
      });
      return response;
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
      return [];
    } finally {
      set({ loadingProducts: false });
    }
  },

  loadAllProductsForAdmin: async () => {
    console.log('Store loadAllProductsForAdmin called');
    set({ loadingProducts: true, error: null });
    try {
      console.log('Calling productService.getAllProductsForAdmin...');
      const response = await productService.getAllProductsForAdmin();
      console.log('Admin products API response:', {
        responseLength: response?.length || 0,
        responseType: typeof response,
        isArray: Array.isArray(response),
      });

      if (response && Array.isArray(response)) {
        const transformedProducts: Product[] = response.map(
          transformApiResponseToProduct
        );
        console.log('Transformed products:', {
          transformedLength: transformedProducts.length,
          products: transformedProducts.map((p) => ({
            id: p.id,
            name: p.name,
            isActive: p.isActive,
            categories: p.categories?.length || 0,
            imageUrls: p.imageUrls?.length || 0,
          })),
        });

        set({
          products: transformedProducts,
          totalCount: response.length,
          currentPage: 1,
          pageSize: response.length,
          totalPages: 1,
        });
        console.log('Admin products loaded:', transformedProducts.length);
        return response;
      } else {
        console.error('Invalid response format:', response);
        set({
          products: [],
          totalCount: 0,
          currentPage: 1,
          pageSize: 10,
          totalPages: 0,
        });
        return [];
      }
    } catch (error) {
      console.error('Error loading admin products:', error);
      toast.error('Failed to load admin products');
      set({
        products: [],
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
      });
      return [];
    } finally {
      set({ loadingProducts: false });
    }
  },

  loadStats: async () => {
    set({ loadingStats: true, error: null });
    try {
      const stats = await productService.getProductStats();
      set({ stats: stats, loadingStats: false });
    } catch (error) {
      console.error('Error loading product stats:', error);
      toast.error('Failed to load product stats');
    } finally {
      set({ loadingStats: false });
    }
  },

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
      const transformedProducts: Product[] = response.items.map(
        transformApiResponseToProduct
      );
      set({
        products: transformedProducts,
        totalCount: response.totalCount || 0,
        currentPage: response.currentPage || 1,
        pageSize: response.pageSize || 10,
        totalPages: response.totalPages || 1,
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

  loadProduct: async (id: number): Promise<Product | null> => {
    set({ loadingProduct: true, error: null });
    try {
      const response = await productService.getProductById(id);
      if (!response) return null;
      const transformedProduct: Product =
        transformApiResponseToProduct(response);
      set({ currentProduct: transformedProduct });
      if (response.categories?.length) {
        await get().loadSimilarProducts(
          response.categories.map((cat) => cat.id),
          id
        );
      }
      return transformedProduct;
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product details');
      return null;
    } finally {
      set({ loadingProduct: false });
    }
  },

  loadProductDetails: async (id: number): Promise<Product | null> => {
    // Validate ID is a positive integer
    const parsedId = Number(id);
    if (isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
      set({ error: 'Invalid product ID', loadingProductDetails: false });
      toast.error('Invalid product ID');
      return null;
    }

    set({ loadingProductDetails: true, error: null });

    // Retry mechanism for network issues
    const maxRetries = 2;
    let lastError: Error | null = null;

    try {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await productService.getProductWithReviews(parsedId);
          if (!response) {
            throw new Error('Product not found');
          }
          const transformedProduct: Product =
            transformApiResponseToProduct(response);
          set({ currentProduct: transformedProduct, error: null });
          return transformedProduct;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          console.error(
            `Error loading product details (attempt ${attempt}):`,
            error
          );

          // Don't retry on 404 or 401 errors
          if (
            lastError.message.includes('not found') ||
            lastError.message.includes('Authentication required')
          ) {
            break;
          }

          // Wait before retrying (except on last attempt)
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          }
        }
      }

      const errorMessage =
        lastError?.message ||
        'Failed to fetch product with reviews. Please try again.';
      set({ error: errorMessage, currentProduct: null });
      toast.error(errorMessage);
      return null;
    } finally {
      set({ loadingProductDetails: false });
    }
  },

  loadSimilarProducts: async (_categoryIds: number[], excludeId: number) => {
    console.log('Store loadSimilarProducts called with:', {
      _categoryIds,
      excludeId,
    });

    // Validate excludeId
    if (
      !excludeId ||
      isNaN(excludeId) ||
      !Number.isInteger(excludeId) ||
      excludeId <= 0
    ) {
      console.error('Invalid excludeId in store:', {
        excludeId,
        type: typeof excludeId,
      });
      set({
        error: 'Invalid product ID for similar products',
        similarProducts: [],
      });
      return;
    }

    console.log('Calling productService.getSimilarProducts with:', {
      excludeId,
      limit: 6,
    });

    set({ loadingSimilarProducts: true, error: null });
    try {
      const response = await productService.getSimilarProducts(excludeId, 6);
      console.log(
        'Similar products response:',
        response?.length || 0,
        'products'
      );
      set({ similarProducts: response.map(transformApiResponseToProduct) });
    } catch (error) {
      console.error('Error loading similar products:', error);
      toast.error('Failed to load similar products');
      set({ similarProducts: [] });
    } finally {
      set({ loadingSimilarProducts: false });
    }
  },

  createProduct: async (formData: FormData) => {
    set({ submitting: true, validationErrors: [], error: null });
    try {
      const response = await productService.createProduct(formData);
      const newProduct = transformApiResponseToProduct(response);
      set((state) => ({ products: [...state.products, newProduct] }));
      // Refresh both products list and stats
      await Promise.all([get().loadAllProductsForAdmin(), get().loadStats()]);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
      set({ error: String(error) });
      return null;
    } finally {
      set({ submitting: false });
    }
  },
  updateProduct: async (id: number, formData: FormData) => {
    set({ submitting: true, validationErrors: [], error: null });
    try {
      const response = await productService.updateProduct(id, formData);
      const updatedProduct = transformApiResponseToProduct(response);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        ),
      }));
      // Refresh both products list and stats
      await Promise.all([get().loadAllProductsForAdmin(), get().loadStats()]);
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      set({ error: String(error) });
      return null;
    } finally {
      set({ submitting: false });
    }
  },
  deleteProduct: async (id: number) => {
    set({ deleting: true, error: null });
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      await Promise.all([get().loadAllProductsForAdmin(), get().loadStats()]);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      return false;
    } finally {
      set({ deleting: false });
    }
  },
  bulkDeleteProducts: async (ids: number[]) => {
    set({ deleting: true, error: null });
    try {
      await productService.bulkDeleteProducts(ids);
      toast.success(`Successfully deleted ${ids.length} product(s)`);
      await Promise.all([get().loadAllProductsForAdmin(), get().loadStats()]);
      return true;
    } catch (error) {
      console.error('Bulk delete failed:', error);
      toast.error('Failed to delete products');
      return false;
    } finally {
      set({ deleting: false });
    }
  },

  clearCurrentProduct: () => set({ currentProduct: null, error: null }),

  clearValidationErrors: () => set({ validationErrors: [] }),

  loadPopularProducts: async (limit = 5) => {
    set({ loadingPopularProducts: true });
    try {
      const products = await productService.getPopularProducts(limit);
      set({ popularProducts: products.map(transformApiResponseToProduct) });
    } catch (error) {
      console.error('Error loading popular products:', error);
      toast.error('Failed to load popular products');
      set({ similarProducts: [] });
    } finally {
      set({ loadingPopularProducts: false });
    }
  },

  getProductReviews: async (productId: number) => {
    set({ loadingProductReviews: true });
    try {
      const reviews = await productService.getProductReviews(productId);
      set({ productReviews: reviews });
    } catch (error) {
      console.error('Error loading product reviews:', error);
      toast.error('Failed to load product reviews');
    } finally {
      set({ loadingProductReviews: false });
    }
  },

  getSimilarProducts: async (productId: number, limit = 5) => {
    set({ loadingSimilarProducts: true });
    try {
      const products = await productService.getSimilarProducts(
        productId,
        limit
      );
      set({ similarProducts: products.map(transformApiResponseToProduct) });
    } catch (error) {
      console.error('Error loading similar products:', error);
      toast.error('Failed to load similar products');
    } finally {
      set({ loadingSimilarProducts: false });
    }
  },
}));

export default useProductStore;
