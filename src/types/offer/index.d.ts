export interface Offer {
  id: number;
  name: string;
  productId: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfferUi {
  id: number;
  productId: number;
}

export interface OfferFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
  offer?: Offer | null;
}

export interface OfferFilterProps {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface PaginatedOffersResponse {
  items: Offer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
