import { create } from 'zustand';
import categoryService from '@/services/categories.service';
import toast from 'react-hot-toast';
import {
  CategoryResponse,
  CategoryState,
  CategoryListResponse,
  CategoryListParams,
  CacheEntry,
} from '@/types/category';

const useCategoriesStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  cache: new Map<string, CacheEntry>(),
  retryAttempts: 3,

  loadCategories: async () => {
    set({ loading: true });
    try {
      const res: CategoryResponse[] = await categoryService.getCategories();
      set({ categories: res, loading: false });

      return res;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load categories';
      console.error('Error loading categories:', error);
      set({ loading: false, error: errorMessage });
      return [];
    }
  },

  loadUICategories: async () => {
    set({ loading: true });
    try {
      const res: CategoryResponse[] = await categoryService.getCategories();

      // transform response to CategoryResponse[]
      const transformedData = res.map((item) => ({
        ...item,
      }));
      set({ categories: transformedData, loading: false });
      console.log('transformedData', transformedData);

      return transformedData;
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

    try {
      const category = await categoryService.createCategory(categoryData);

      set({
        categories: [...get().categories, category],
        loading: false,
      });

      return category;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create category';
      console.error('Error creating category:', error);
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (
    id: number,
    categoryData: FormData
  ): Promise<CategoryResponse> => {
    set({ loading: true });

    try {
      const category = await categoryService.updateCategory(id, categoryData);
      // Update the categories list with the updated category
      set({
        categories: get().categories.map((c) =>
          c.id === id ? { ...c, ...category } : c
        ),
        loading: false,
      });
      return category;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update category';
      console.error('Error updating category:', error);
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
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
      await categoryService.deleteCategory(id);
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
      await categoryService.deleteCategories(ids);
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

  getCategoriesPaginated: async (
    params: Omit<CategoryListParams, 'categories'>
  ): Promise<CategoryListResponse> => {
    set({ loading: true });
    try {
      const response = await categoryService.getCategoriesPaginated(params);
      set({ categories: response.data, loading: false });
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load categories';
      console.error('Error loading categories:', error);
      set({ loading: false, error: errorMessage });
      return {
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0,
      };
    }
  },
}));

export default useCategoriesStore;
