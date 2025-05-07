import { create } from 'zustand';
import axiosInstance from '@/services/axiosInstance';
import { Review } from '@/types/review';

interface ReviewsState {
  reviews: Review[];
  fetchReviews: () => Promise<void>;
  createReview: (review: Partial<Review>) => Promise<void>;
  updateReview: (reviewId: number, review: Partial<Review>) => Promise<void>;
  deleteReview: (reviewId: number) => Promise<void>;
}

const useReviewsStore = create<ReviewsState>((set) => ({
  reviews: [],
  fetchReviews: async () => {
    try {
      const response = await axiosInstance.get('/reviews');
      set({ reviews: response.data });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },
  createReview: async (review) => {
    try {
      const response = await axiosInstance.post('/reviews', review);
      set((state) => ({ reviews: [...state.reviews, response.data] }));
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },
  updateReview: async (reviewId, review) => {
    try {
      const response = await axiosInstance.put(`/reviews/${reviewId}`, review);
      set((state) => ({
        reviews: state.reviews.map((r) =>
          r.id === reviewId ? response.data : r
        ),
      }));
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },
  deleteReview: async (reviewId) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
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
