import { create } from 'zustand';
import axiosInstance from '@/services/axiosInstance';
import { Review } from '@/types/review';
import { useAuthStore } from '@/store/auth';

interface ReviewsState {
  loading: boolean;
  reviews: Review[];
  fetchReviews: () => Promise<void>;
  createReview: (review: Partial<Review>) => Promise<void>;
  updateReview: (reviewId: number, review: Partial<Review>) => Promise<void>;
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
      const response = await axiosInstance.get('/reviews');
      set({ reviews: response, loading: false });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },
  createReview: async (review) => {
    try {
      const response = await axiosInstance.post('/reviews', review, {
        headers: getAuthHeader(),
      });
      console.log('Response:', response);
      set((state) => ({ reviews: [...state.reviews, response] }));
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },
  updateReview: async (reviewId, review) => {
    try {
      const response = await axiosInstance.put(`/reviews/${reviewId}`, review, {
        headers: getAuthHeader(),
      });
      set((state) => ({
        reviews: state.reviews.map((r) => (r.id === reviewId ? response : r)),
      }));
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
