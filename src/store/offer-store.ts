import { create } from 'zustand';
import { Offer, OfferFilterProps } from '@/types/offer';
import offerService from '@/services/offer-service';

// interface Offer {
//   id: number;
//   product: {
//     name: string;
//     description: string;
//     price: number;
//     image_url: string;
//   };
//   discount_type: 'percentage' | 'fixed';
//   discount_value: number;
//   end_time: string;
// }

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
  updateOffer: (offer: Offer) => Promise<void>;
  createOffer: (offer: Offer) => Promise<void>;
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

  setFilter: (filter) => set({ filter }),

  loadOffers: async () => {
    set({ loading: true });
    const { filter } = get();
    const res = await offerService.getOffers({
      page: filter.page,
      limit: filter.limit,
      searchTerm: filter.searchTerm,
      sortBy: filter.sortBy,
      sortDirection: filter.sortDirection,
    });
    if (res) {
      set({ loading: false, offers: res.items, totalCount: res.total });
    }
  },
  updateOffer: async (offer) => {
    set({ loading: true });
    const res = await offerService.updateOffer(offer);
    console.log('update offer state', res);
    if (res) {
      set({ loading: false, currentOffer: res });
    }
  },
  createOffer: async (offer) => {
    set({ loading: true });
    const res = await offerService.createOffer(offer);
    console.log('create offer state', res);
    if (res) {
      set({ loading: false, currentOffer: res });
    }
    set({ loading: false });
  },
}));

export default useOffersStore;
