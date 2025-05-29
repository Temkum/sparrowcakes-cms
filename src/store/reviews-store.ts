import { create } from 'zustand';
import toast from 'react-hot-toast';
import { ReviewResponseProps } from '@/types/review';
import * as reviewService from '@/services/reviews.service';

interface ReviewsState {
  loading: boolean;
  reviews: ReviewResponseProps[];
  totalCount: number;
  currentPage: number;
  pageSize: number;

  fetchReviews: (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    productId?: number;
    customerId?: number;
    display?: boolean;
  }) => Promise<void>;
  createReview: (review: Partial<ReviewResponseProps>) => Promise<void>;
  updateReview: (
    id: number,
    review: Partial<ReviewResponseProps>
  ) => Promise<void>;
  deleteReview: (id: number) => Promise<void>;
  toggleReviewDisplay: (id: number, display: boolean) => Promise<void>;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
  loading: false,
  reviews: [],
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,

  fetchReviews: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await reviewService.getReviews(params);
      console.log('response reviews store', response);
      set({
        reviews: response.items,
        totalCount: response.meta.total,
        currentPage: response.meta.page,
        pageSize: response.meta.limit,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
      set({ loading: false });
    }
  },

  createReview: async (review) => {
    set({ loading: true });
    try {
      await reviewService.createReview(review);
      toast.success('Review created successfully');
      // Refresh the reviews list
      const response = await reviewService.getReviews();
      console.log('response reviews store', response);
      set({
        reviews: response.items,
        totalCount: response.meta.total,
        currentPage: response.meta.page,
        pageSize: response.meta.limit,
        loading: false,
      });
    } catch (error) {
      console.error('Error creating review:', error);
      toast.error('Failed to create review');
      set({ loading: false });
    }
  },

  updateReview: async (id, review) => {
    set({ loading: true });
    try {
      await reviewService.updateReview(id, review);
      toast.success('Review updated successfully');
      // Refresh the reviews list
      const response = await reviewService.getReviews();
      console.log('response reviews store', response);
      set({
        reviews: response.items,
        totalCount: response.meta.total,
        currentPage: response.meta.page,
        pageSize: response.meta.limit,
        loading: false,
      });
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
      set({ loading: false });
    }
  },

  deleteReview: async (id) => {
    set({ loading: true });
    try {
      await reviewService.deleteReview(id);
      toast.success('Review deleted successfully');
      // Refresh the reviews list
      const response = await reviewService.getReviews();
      console.log('response reviews store', response);
      set({
        reviews: response.items,
        totalCount: response.meta.total,
        currentPage: response.meta.page,
        pageSize: response.meta.limit,
        loading: false,
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
      set({ loading: false });
    }
  },

  toggleReviewDisplay: async (id, display) => {
    set({ loading: true });
    try {
      await reviewService.toggleReviewDisplay(id, display);
      toast.success(`Review ${display ? 'shown' : 'hidden'} successfully`);
      // Refresh the reviews list
      const response = await reviewService.getReviews();
      set({
        reviews: response.items,
        totalCount: response.meta.total,
        currentPage: response.meta.page,
        pageSize: response.meta.limit,
        loading: false,
      });
    } catch (error) {
      console.error('Error toggling review display:', error);
      toast.error('Failed to update review visibility');
      set({ loading: false });
    }
  },
}));
