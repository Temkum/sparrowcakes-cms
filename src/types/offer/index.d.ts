export interface Offer {
  id: number;
  name: string;
  product_id: number; // Match backend field name
  product?: {
    id: number;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
  };
  discount_type: 'percentage' | 'fixed'; // Match backend enum values
  discount_value: number;
  start_time: Date | string;
  end_time: Date | string;
  is_active: boolean; // Match backend field name
  created_at: Date | string; // Match backend field name
  updated_at: Date | string; // Match backend field name

  // For backwards compatibility with frontend display logic
  productId?: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  startTime?: Date | string;
  endTime?: Date | string;
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  image_url?: string;
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
