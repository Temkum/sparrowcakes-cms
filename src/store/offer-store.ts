import { create } from 'zustand';
import { Offer, OfferFilterProps } from '@/types/offer';
import offerService from '@/services/offer-service';

interface OffersState {
  offers: Offer[];
  currentOffer: Offer | null;
  totalCount: number;
  loading: boolean;
  submitting: boolean;
  error?: string;
  filter: OfferFilterProps;
  setFilter: (filter: OfferFilterProps) => void;
  loadOffers: () => Promise<void>;
  loadActiveOffers: () => Promise<void>;
  updateOffer: (offer: Offer) => Promise<void>;
  createOffer: (offer: Partial<Offer>) => Promise<void>;
  clearError: () => void;
}

const useOffersStore = create<OffersState>((set, get) => ({
  offers: [],
  currentOffer: null,
  totalCount: 0,
  loading: false,
  submitting: false,
  error: undefined,
  filter: {
    page: 1,
    limit: 10,
    searchTerm: '',
    sortBy: 'created_at',
    sortDirection: 'DESC',
  },

  setFilter: (filter) => set({ filter, error: undefined }),

  clearError: () => set({ error: undefined }),

  loadActiveOffers: async () => {
    set({ loading: true, error: undefined });
    try {
      const res = await offerService.getAllActiveOffers();
      if (res) {
        set({
          loading: false,
          offers: res,
          totalCount: res.length,
          error: undefined,
        });
      }
    } catch (error) {
      console.error('Error loading active offers:', error);
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load active offers',
      });
    }
  },

  loadOffers: async () => {
    set({ loading: true, error: undefined });
    try {
      const { filter } = get();
      const res = await offerService.getOffers(filter);

      if (res) {
        set({
          loading: false,
          offers: res.items,
          totalCount: res.total,
          error: undefined,
        });
      }
    } catch (error) {
      console.error('Error loading offers:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load offers',
      });
    }
  },

  updateOffer: async (offer) => {
    set({ submitting: true, error: undefined });
    try {
      const updatedOffer = await offerService.updateOffer(offer);

      if (updatedOffer) {
        // Update the offer in the list
        set((state) => ({
          submitting: false,
          currentOffer: updatedOffer,
          offers: state.offers.map((o) =>
            o.id === updatedOffer.id ? updatedOffer : o
          ),
          error: undefined,
        }));
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      set({
        submitting: false,
        error:
          error instanceof Error ? error.message : 'Failed to update offer',
      });
      throw error; // Re-throw to allow component to handle
    }
  },

  createOffer: async (offer) => {
    set({ submitting: true, error: undefined });
    try {
      const createdOffer = await offerService.createOffer(offer);

      if (createdOffer) {
        set((state) => ({
          submitting: false,
          currentOffer: createdOffer,
          offers: [createdOffer, ...state.offers],
          totalCount: state.totalCount + 1,
          error: undefined,
        }));
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      set({
        submitting: false,
        error:
          error instanceof Error ? error.message : 'Failed to create offer',
      });
      throw error; // Re-throw to allow component to handle
    }
  },
}));

export default useOffersStore;
