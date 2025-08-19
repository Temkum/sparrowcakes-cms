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
      const cleanParams = {
        page: Number(page),
        limit: Number(limit),
        searchTerm: searchTerm?.trim() || undefined,
        sortBy,
        sortDirection: sortDirection.toUpperCase(),
      };

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

      // Transform data to add backwards compatibility fields
      const transformedItems = response.data.items.map((offer) => ({
        ...offer,
        // Add compatibility fields for frontend
        productId: offer.product_id,
        discountType: offer.discount_type,
        discountValue: offer.discount_value,
        startTime: offer.start_time,
        endTime: offer.end_time,
        isActive: offer.is_active,
        createdAt: offer.created_at,
        updatedAt: offer.updated_at,
        image_url: offer.product?.image_url,
      }));

      return {
        ...response.data,
        items: transformedItems,
      };
    } catch (error) {
      console.error('Error fetching offers:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Failed to fetch offers: ${message}`);
      }
      throw error;
    }
  },

  async getAllActiveOffers(): Promise<Offer[]> {
    try {
      const response = await axiosInstance.get('/offers/active');
      if (!response) {
        throw new Error('No data received from server');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching offers:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Failed to fetch offers: ${message}`);
      }
      throw error;
    }
  },

  async createOffer(offer: Partial<Offer>): Promise<Offer> {
    try {
      // Transform frontend format to backend format
      const backendOffer = {
        name: offer.name,
        product_id: offer.productId || offer.product_id,
        discount_type: offer.discountType || offer.discount_type,
        discount_value: offer.discountValue || offer.discount_value,
        start_time: offer.startTime || offer.start_time,
        end_time: offer.endTime || offer.end_time,
        is_active: offer.isActive ?? offer.is_active ?? true,
      };

      const response = await axiosInstance.post('/offers', backendOffer);

      // Transform response to include compatibility fields
      const transformedOffer = {
        ...response.data,
        productId: response.data.product_id,
        discountType: response.data.discount_type,
        discountValue: response.data.discount_value,
        startTime: response.data.start_time,
        endTime: response.data.end_time,
        isActive: response.data.is_active,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at,
        image_url: response.data.product?.image_url,
      };
      return transformedOffer;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  },

  async updateOffer(offer: Offer): Promise<Offer> {
    try {
      // Transform frontend format to backend format
      const backendOffer = {
        name: offer.name,
        product_id: offer.productId || offer.product_id,
        discount_type: offer.discountType || offer.discount_type,
        discount_value: offer.discountValue || offer.discount_value,
        start_time: offer.startTime || offer.start_time,
        end_time: offer.endTime || offer.end_time,
        is_active: offer.isActive ?? offer.is_active,
      };

      const response = await axiosInstance.put(
        `/offers/${offer.id}`,
        backendOffer
      );

      // Transform response to include compatibility fields
      const transformedOffer = {
        ...response.data,
        productId: response.data.product_id,
        discountType: response.data.discount_type,
        discountValue: response.data.discount_value,
        startTime: response.data.start_time,
        endTime: response.data.end_time,
        isActive: response.data.is_active,
        updatedAt: response.data.updated_at,
        image_url: response.data.product?.image_url,
      };

      return transformedOffer;
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
