import axiosInstance from '@/services/axiosInstance';
import { CategoryResponse, CategoryListResponse } from '@/types/category';
import { AxiosError } from 'axios';

const CATEGORIES_ENDPOINT = '/categories';

const handleAxiosError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof AxiosError) {
    throw new Error(error.response?.data?.message || defaultMessage);
  }
  throw error;
};

const categoryService = {
  async getCategories(): Promise<CategoryResponse[]> {
    try {
      const response = await axiosInstance.get<CategoryResponse[]>(
        `${CATEGORIES_ENDPOINT}/all`
      );

      return response as unknown as CategoryResponse[];
    } catch (error) {
      throw handleAxiosError(error, 'Error fetching categories');
    }
  },

  async createCategory(categoryData: FormData): Promise<CategoryResponse> {
    try {
      // Transform FormData to match the expected structure
      const values = {
        name: categoryData.get('name') as string,
        slug: categoryData.get('slug') as string,
        description: (categoryData.get('description') as string) || '',
        isActive: categoryData.get('isActive') as unknown as boolean,
        image: categoryData.get('image') as File,
      };

      // Create new FormData with transformed values
      const transformedData = new FormData();
      transformedData.append('name', values.name);
      transformedData.append('slug', values.slug);
      transformedData.append('description', values.description);
      transformedData.append('isActive', values.isActive.toString());
      // Only append image if it exists
      if (values.image) {
        transformedData.append('image', values.image);
      }

      const response = await axiosInstance.post(
        CATEGORIES_ENDPOINT,
        transformedData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response as unknown as CategoryResponse;
    } catch (error) {
      throw handleAxiosError(error, 'Error creating category');
    }
  },

  async updateCategory(
    id: number,
    categoryData: FormData
  ): Promise<CategoryResponse> {
    try {
      // Log FormData contents for debugging
      /* for (const [key, value] of categoryData.entries()) {
        console.log(`${key}:`, value);
      } */

      const response = await axiosInstance.patch(
        `${CATEGORIES_ENDPOINT}/${id}`,
        categoryData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response as unknown as CategoryResponse;
    } catch (error) {
      console.error('Service error:', error);
      throw handleAxiosError(error, 'Error updating category');
    }
  },

  async deleteCategory(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${CATEGORIES_ENDPOINT}/${id}`);
    } catch (error) {
      throw handleAxiosError(error, 'Error deleting category');
    }
  },

  async deleteCategories(ids: number[]): Promise<void> {
    try {
      await axiosInstance.delete(`${CATEGORIES_ENDPOINT}`, {
        data: { ids },
      });
    } catch (error) {
      throw handleAxiosError(error, 'Error deleting categories');
    }
  },

  async getCategoriesPaginated(params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<CategoryListResponse> {
    try {
      const response = await axiosInstance.get(
        `${CATEGORIES_ENDPOINT}/paginated`,
        { params }
      );
      return response as unknown as CategoryListResponse;
    } catch (error) {
      throw handleAxiosError(error, 'Error fetching categories');
    }
  },
};

export default categoryService;
