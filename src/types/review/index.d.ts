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

export interface ReviewProps {
  review: Review;
  onEdit: (reviewId: number) => void;
  onDelete: (reviewId: number) => void;
}

export interface ReviewResponse {
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
  customer: Customer; // Add this line
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  cost_per_unit: number;
  discount: number;
  quantity: number;
  image_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  availability: string;
}
