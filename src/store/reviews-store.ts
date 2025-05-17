import { create } from 'zustand';
import axiosInstance from '@/services/axiosInstance';
import { Review, ReviewResponse } from '@/types/review';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

// Note: Our axios instance has a response interceptor that automatically extracts response.data
// This means we need to handle the typing differently than standard axios

interface ReviewsState {
  loading: boolean;
  reviews: ReviewResponse[];
  fetchReviews: () => Promise<void>;
  createReview: (review: Partial<Review>) => Promise<ReviewResponse>;
  updateReview: (
    reviewId: number,
    review: Partial<Review>
  ) => Promise<ReviewResponse>;
  deleteReview: (reviewId: number) => Promise<void>;
}

// Helper function to get auth token
const getAuthHeader = () => {
  const { token } = useAuthStore.getState();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const useReviewsStore = create<ReviewsState>((set) => ({
  loading: false,
  reviews: [],

  fetchReviews: async () => {
    set({ loading: true });

    try {
      // The axios interceptor already extracts the data
      const reviews = await axiosInstance.get('/reviews') as unknown as ReviewResponse[];
      set({ reviews, loading: false });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
      set({ loading: false });
      throw error;
    }
  },

  createReview: async (review) => {
    try {
      const reviewData = {
        comment: review.comment,
        customer_id: review.customerId,
        display: review.isActive,
        product_id: review.productId,
        rating: review.rating,
      };

      const response = await axiosInstance.post('/reviews', reviewData, {
        headers: getAuthHeader(),
      }) as unknown as ReviewResponse;

      console.log(response);

      // The axios interceptor already extracts the data, so this is already a ReviewResponse
      set((state) => ({ reviews: [...state.reviews, response] }));
      return response;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  updateReview: async (reviewId, review) => {
    try {
      const reviewData = {
        comment: review.comment,
        customer_id: review.customerId,
        display: review.isActive,
        product_id: review.productId,
        rating: review.rating,
      };

      const response = await axiosInstance.put(
        `/reviews/${reviewId}`,
        reviewData,
        {
          headers: getAuthHeader(),
        }
      ) as unknown as ReviewResponse;

      // The axios interceptor already extracts the data, so this is already a ReviewResponse
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r.id === reviewId ? response : r
        ),
      }));

      return response;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  deleteReview: async (reviewId) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`, {
        headers: getAuthHeader(),
      });

      set((state) => ({
        reviews: state.reviews.filter((review) => review.id !== reviewId),
      }));
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
}));

export default useReviewsStore;
