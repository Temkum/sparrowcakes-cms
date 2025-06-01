import { create } from 'zustand';
import categoryService from '@/services/categories.service';
import toast from 'react-hot-toast';
import { CategoryResponse, CategoryState } from '@/types/category';

// Helper function to retry failed operations
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxAttempts = 1,
  delay = 1000
): Promise<T> => {
  let lastError: Error = new Error('Operation failed');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === maxAttempts) break;
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};

const useCategoriesStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  cache: new Map(),
  retryAttempts: 2,

  loadCategories: async () => {
    set({ loading: true });
    try {
      // Check cache first
      const cacheKey = 'all-categories';
      const cachedData = get().cache.get(cacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < 300000) {
        // 5 minutes cache
        set({ categories: cachedData.data, loading: false });
        return cachedData.data;
      }

      const categories = await retryOperation(
        () => categoryService.getCategories(),
        3
      );

      // Update cache
      get().cache.set(cacheKey, {
        data: categories,
        timestamp: Date.now(),
      });

      set({ categories, loading: false });
      return categories;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load categories';
      console.error('Error loading categories:', error);
      set({ loading: false, error: errorMessage });
      return [];
    }
  },

  createCategory: async (categoryData: FormData) => {
    set({ loading: true });

    // Create optimistic update with temporary data
    const optimisticCategory: CategoryResponse = {
      id: -Date.now(), // temporary negative ID to avoid conflicts
      name: categoryData.get('name') as string,
      slug: (categoryData.get('slug') as string) || '',
      description: (categoryData.get('description') as string) || '',
      isActive: categoryData.get('isActive') === 'true',
      imageUrl: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Apply optimistic update
    set({ categories: [...get().categories, optimisticCategory] });

    try {
      const category = await retryOperation(
        () => categoryService.createCategory(categoryData),
        3
      );

      // Update with real data
      set({
        categories: get().categories.map((c) =>
          c.id === optimisticCategory.id ? category : c
        ),
        loading: false,
      });

      // Invalidate cache
      get().cache.clear();

      return category;
    } catch (error) {
      // Revert optimistic update
      set({
        categories: get().categories.filter(
          (c) => c.id !== optimisticCategory.id
        ),
        loading: false,
        error:
          error instanceof Error ? error.message : 'Failed to create category',
      });
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
      throw error;
    }
  },

  updateCategory: async (
    id: number,
    categoryData: FormData
  ): Promise<CategoryResponse> => {
    set({ loading: true });

    // Store previous state for rollback
    const previousCategories = get().categories;
    const existingCategory = previousCategories.find(
      (c: CategoryResponse) => c.id === id
    );

    if (!existingCategory) {
      set({ loading: false });
      const error = new Error('Category not found');
      toast.error(error.message);
      throw error;
    }

    // Create updated category for optimistic update
    const updatedCategory: CategoryResponse = {
      ...existingCategory,
      name: categoryData.get('name')?.toString() || '',
      slug: categoryData.get('slug')?.toString() || '',
      description: categoryData.get('description')?.toString() || '',
      isActive: categoryData.get('isActive') === 'true',
      imageUrl: categoryData.get('image')
        ? undefined
        : existingCategory.imageUrl,
      updated_at: new Date().toISOString(),
    } as CategoryResponse;

    // Apply optimistic update
    set({
      categories: previousCategories.map((c) =>
        c.id === id ? updatedCategory : c
      ),
    });

    try {
      // Send request with FormData directly
      const category = await retryOperation(
        () => categoryService.updateCategory(id, categoryData),
        3
      );

      return category;
    } catch (error: unknown) {
      // Revert optimistic update
      set({ categories: previousCategories, loading: false });
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update category';
      console.error('Error updating category:', error);
      toast.error(errorMessage);
      throw error;
    } finally {
      // Invalidate cache
      get().cache.clear();
    }
  },

  deleteCategory: async (id: number) => {
    set({ loading: true });

    // Store previous state for rollback
    const previousCategories = get().categories;

    // Apply optimistic update
    set({
      categories: get().categories.filter((c) => c.id !== id),
    });

    try {
      await retryOperation(async () => {
        await categoryService.deleteCategory(id);
      }, 3);

      // Invalidate cache
      get().cache.clear();

      set({ loading: false });
      toast.success('Category deleted successfully');
    } catch (error) {
      // Rollback to previous state
      set({
        categories: previousCategories,
        loading: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete category',
      });
      console.error(`Error deleting category with ID ${id}:`, error);
      toast.error('Failed to delete category');
      throw error;
    }
  },

  deleteCategories: async (ids: number[]) => {
    set({ loading: true });

    // Store previous state for rollback
    const previousCategories = get().categories;

    // Apply optimistic update
    set({
      categories: get().categories.filter((c) => !ids.includes(c.id)),
    });

    try {
      await retryOperation(async () => {
        await categoryService.deleteCategories(ids);
      }, 3);

      // Invalidate cache
      get().cache.clear();

      set({ loading: false });
      toast.success('Categories deleted successfully');
    } catch (error) {
      // Rollback to previous state
      set({
        categories: previousCategories,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete categories',
      });
      console.error('Error deleting categories:', error);
      toast.error('Failed to delete categories');
      throw error;
    }
  },
}));

export default useCategoriesStore;
