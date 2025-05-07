import axiosInstance from '@/services/axiosInstance';
import { Review } from '@/types/review';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createReview = async (
  review: Partial<Review>
): Promise<Review> => {
  try {
    const response = await axiosInstance.post('/reviews', review, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getReviews = async (): Promise<Review[]> => {
  try {
    const response = await axiosInstance.get('/reviews', {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const updateReview = async (
  id: number,
  review: Partial<Review>
): Promise<Review> => {
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
