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
