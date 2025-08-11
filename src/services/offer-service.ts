import axios from 'axios';
import axiosInstance from './axiosInstance';
import {
  Offer,
  OfferFilterProps,
  PaginatedOffersResponse,
} from '@/types/offer';

const offerService = {
  async getOffers({
    page = 1,
    limit = 10,
    searchTerm = '',
    sortBy = 'created_at',
    sortDirection = 'DESC',
  }: OfferFilterProps): Promise<PaginatedOffersResponse> {
    try {
      // Clean and normalize search parameters
      const cleanParams = {
        page: Number(page),
        limit: Number(limit),
        searchTerm: searchTerm?.trim() || undefined,
        sortBy,
        sortDirection: sortDirection.toUpperCase(),
      };

      // Fetch customers with pagination
      const response = await axiosInstance.get<PaginatedOffersResponse>(
        '/offers',
        {
          params: cleanParams,
          paramsSerializer: (params) => {
            return Object.entries(params)
              .filter(
                ([, value]) =>
                  value !== undefined && value !== null && value !== ''
              )
              .map(
                ([key, value]) => `${key}=${encodeURIComponent(String(value))}`
              )
              .join('&');
          },
        }
      );

      if (!response) {
        throw new Error('No data received from server');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching offers:', error);
      // Add more specific error handling
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Failed to fetch offers: ${message}`);
      }
      throw error;
    }
  },
  async createOffer(offer: Offer): Promise<Offer> {
    try {
      const response = await axiosInstance.post('/offers', offer);
      console.log('create response', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  },
  async updateOffer(offer: Offer): Promise<Offer> {
    try {
      const response = await axiosInstance.put(`/offers/${offer.id}`, offer);
      console.log('update response', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  },
  async deleteOffer(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/offers/${id}`);
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  },
};

export default offerService;
