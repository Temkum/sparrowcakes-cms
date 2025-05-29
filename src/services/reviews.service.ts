import axiosInstance from '@/services/axiosInstance';
import { ReviewResponseProps, ReviewsResponse } from '@/types/review';

export const createReview = async (
  review: Partial<ReviewResponseProps>
): Promise<ReviewResponseProps> => {
  try {
    return await axiosInstance.post<object, ReviewResponseProps>(
      '/reviews',
      review
    );
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getReviews = async ({
  page = 1,
  limit = 10,
  searchTerm = '',
  productId,
  customerId,
  display,
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  productId?: number;
  customerId?: number;
  display?: boolean;
} = {}): Promise<ReviewsResponse> => {
  try {
    // Build query parameters
    const params: Record<string, string | number | boolean | undefined> = {
      page,
      limit,
    };

    // Add optional filters only if they're defined
    if (searchTerm?.trim()) params.searchTerm = searchTerm.trim();
    if (productId !== undefined) params.productId = productId;
    if (customerId !== undefined) params.customerId = customerId;
    if (display !== undefined) params.display = display;

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    );

    console.log('Reviews service - Request params:', cleanParams);

    // Make the API request
    const response = await axiosInstance.get<object, ReviewsResponse>(
      '/reviews',
      {
        params: cleanParams,
      }
    );

    console.log('Reviews service - Raw response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const updateReview = async (
  id: number,
  review: Partial<ReviewResponseProps>
): Promise<ReviewResponseProps> => {
  try {
    return await axiosInstance.put<object, ReviewResponseProps>(
      `/reviews/${id}`,
      review
    );
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/reviews/${id}`);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Get review by ID
export const getReviewById = async (
  id: number
): Promise<ReviewResponseProps> => {
  try {
    return await axiosInstance.get<object, ReviewResponseProps>(
      `/reviews/${id}`
    );
  } catch (error) {
    console.error(`Error fetching review with ID ${id}:`, error);
    throw error;
  }
};

// Toggle review display status
export const toggleReviewDisplay = async (
  id: number,
  display: boolean
): Promise<ReviewResponseProps> => {
  try {
    return await axiosInstance.patch<object, ReviewResponseProps>(
      `/reviews/${id}/display`,
      { display }
    );
  } catch (error) {
    console.error(`Error toggling display for review with ID ${id}:`, error);
    throw error;
  }
};
