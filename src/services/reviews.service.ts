import axiosInstance from '@/services/axiosInstance';
import { ReviewResponse } from '@/types/review';
import { useAuthStore } from '@/store/auth';

// Helper function to get auth token
const getAuthHeader = () => {
  const { token } = useAuthStore.getState();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createReview = async (
  review: Partial<ReviewResponse>
): Promise<ReviewResponse> => {
  try {
    const response = await axiosInstance.post('/reviews', review, {
      headers: getAuthHeader(),
    });
    return response;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getReviews = async ({
  page = 1,
  limit = 10,
  searchTerm = '',
  sortBy = 'created_at',
  sortDirection = 'DESC',
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
} = {}): Promise<{
  items: ReviewResponse[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const params = {
      page,
      limit,
      searchTerm: searchTerm?.trim(),
      sortBy,
      sortDirection,
    };

    console.log('Reviews service - Request params:', params);
    const response = await axiosInstance.get<
      | ReviewResponse[]
      | { items: ReviewResponse[]; total: number; page: number; limit: number }
    >('/reviews', {
      params,
      headers: getAuthHeader(),
    });
    console.log('Reviews service - Raw response:', response);

    // If response is an array, wrap it in the expected format
    if (Array.isArray(response)) {
      return {
        items: response,
        total: response.length,
        page: page,
        limit: limit,
      };
    }

    // Fallback for unexpected response format
    return {
      items: [],
      total: 0,
      page: page,
      limit: limit,
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const updateReview = async (
  id: number,
  review: Partial<ReviewResponse>
): Promise<ReviewResponse> => {
  try {
    const response = await axiosInstance.put(`/reviews/${id}`, review, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/reviews/${id}`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
