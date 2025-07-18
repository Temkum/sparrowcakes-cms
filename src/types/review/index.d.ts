export interface Review {
  id: number;
  productId: number;
  customerId: number;
  rating: number;
  comment: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewUI extends Review {
  customer: Customer;
}

export interface ReviewProps {
  review: Review;
  onEdit: (reviewId: number) => void;
  onDelete: (reviewId: number) => void;
}

export interface ReviewsResponse {
  items: ReviewResponseProps[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ReviewResponseProps {
  id: number;
  rating: number;
  comment: string;
  display: boolean;
  is_reported: boolean;
  is_approved: boolean;
  is_rejected: boolean;
  is_edited: boolean;
  is_deleted: boolean;
  user: User | null;
  product: Product;
  customer: Customer;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Customer {
  id: number;
  occupation: string;
  name: string;
  phone: string;
  email: string;
  image_url?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  cost_per_unit: number;
  discount: number;
  quantity: number;
  image_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  availability?: string;
  deleted_at?: string | null;
  categories?: number[];
  reviews: Review[];
}
