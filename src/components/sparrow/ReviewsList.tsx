import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Filter, ChevronDown, Send, X } from 'lucide-react';

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

export interface ReviewWithDetails extends Review {
  customer: Customer;
  product?: Product;
  helpfulCount: number;
  isHelpful?: boolean;
  isFeatured?: boolean;
}

export interface ReviewSubmission {
  rating: number;
  comment: string;
  productId?: number;
  photo?: File | null;
}

export interface ReviewFilters {
  rating?: number;
  productId?: number;
  categoryId?: number;
}

export type SortOption = 'recent' | 'rating' | 'helpful';

export interface ReviewsPageProps {
  reviews: ReviewWithDetails[];
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Record<number, number>;

  loading?: boolean;
  hasMore?: boolean;

  onLoadMore?: () => void;
  onSubmitReview?: (review: ReviewSubmission) => Promise<void>;
  onVoteHelpful?: (reviewId: number) => Promise<void>;
  onSortChange?: (sort: SortOption) => void;
  onFilterChange?: (filters: ReviewFilters) => void;

  allowSubmit?: boolean;
  showProductTags?: boolean;
  featuredReviewIds?: number[];
}

const StarRating: React.FC<{
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
}> = ({ rating, size = 'md', interactive = false, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= (hoverRating || rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          } ${
            interactive
              ? 'cursor-pointer hover:scale-110 transition-transform'
              : ''
          }`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

const Avatar: React.FC<{
  name: string;
  imageUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
}> = ({ name, imageUrl, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-blue-500 text-white flex items-center justify-center font-medium`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ReviewsList: React.FC<ReviewsPageProps> = ({
  reviews,
  totalReviews,
  averageRating,
  ratingBreakdown,
  loading = false,
  hasMore = false,
  onLoadMore,
  onSubmitReview,
  onVoteHelpful,
  onSortChange,
  onFilterChange,
  allowSubmit = true,
  showProductTags = true,
  featuredReviewIds = [],
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterRating, setFilterRating] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitForm, setSubmitForm] = useState<ReviewSubmission>({
    rating: 0,
    comment: '',
    productId: undefined,
    photo: null,
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const featuredReviews = reviews.filter(
    (r) => featuredReviewIds.includes(r.id) || r.isFeatured
  );
  const regularReviews = reviews.filter(
    (r) => !featuredReviewIds.includes(r.id) && !r.isFeatured
  );

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    onSortChange?.(newSort);
  };

  const handleFilterChange = (rating?: number) => {
    setFilterRating(rating);
    onFilterChange?.({ rating });
  };

  const handleSubmitReview = async () => {
    if (!submitForm.rating || !submitForm.comment.trim()) {
      setToast({
        message: 'Please provide both a rating and comment',
        type: 'error',
      });
      return;
    }

    setSubmitLoading(true);
    try {
      await onSubmitReview?.(submitForm);
      setSubmitForm({
        rating: 0,
        comment: '',
        productId: undefined,
        photo: null,
      });
      setShowSubmitForm(false);
      setToast({ message: 'Review submitted successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to submit review:', error);
      setToast({
        message: 'Failed to submit review. Please try again.',
        type: 'error',
      });
    }
    setSubmitLoading(false);
  };

  const handleVoteHelpful = async (reviewId: number) => {
    try {
      await onVoteHelpful?.(reviewId);
    } catch (error) {
      console.error('Failed to vote:', error);
      setToast({ message: 'Failed to vote. Please try again.', type: 'error' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-in slide-REDACTED-from-right ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Customer Reviews
          </h1>
          <p className="text-gray-600">
            See what our customers are saying about our products
          </p>
        </div>
        <div className="bg-white rounded-xl border p-8 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={averageRating} size="lg" />
            <p className="text-gray-600 mt-2">
              Based on {totalReviews.toLocaleString()} reviews
            </p>
          </div>
          <div className="space onderhoud-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingBreakdown[rating] || 0;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {featuredReviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Reviews</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Avatar
                    name={review.customer.name}
                    imageUrl={review.customer.image_url}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {review.customer.name}
                      </h4>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {review.comment}
                </p>
                {showProductTags && review.product && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {review.product.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
            <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                filterRating
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {filterRating && (
                <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {filterRating}★
                </span>
              )}
            </button>
            {showFilters && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-4 min-w-48 z-10">
                <h5 className="font-medium text-gray-900 mb-3">
                  Filter by Rating
                </h5>
                <div className="space-y-2">
                  <button
                    onClick={() => handleFilterChange(undefined)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      !filterRating
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    All Ratings
                  </button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange(rating)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                        filterRating === rating
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <StarRating rating={rating} size="sm" />
                      <span>& Up</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {allowSubmit && (
          <button
            onClick={() => setShowSubmitForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Write a Review
          </button>
        )}
      </div>
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Write a Review</h3>
              <button
                onClick={() => setShowSubmitForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <StarRating
                  rating={submitForm.rating}
                  size="lg"
                  interactive
                  onRate={(rating) => setSubmitForm({ ...submitForm, rating })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={submitForm.comment}
                  onChange={(e) =>
                    setSubmitForm({ ...submitForm, comment: e.target.value })
                  }
                  placeholder="Share your experience with this product..."
                  className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitForm(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submitLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {regularReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg border p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <Avatar
                    name={review.customer.name}
                    imageUrl={review.customer.image_url}
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {review.customer.name}
                          </h4>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      {showProductTags && review.product && (
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {review.product.name}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <button
                        onClick={() => handleVoteHelpful(review.id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          review.isHelpful
                            ? 'text-blue-600'
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        <ThumbsUp
                          className={`w-4 h-4 ${
                            review.isHelpful ? 'fill-current' : ''
                          }`}
                        />
                        Helpful ({review.helpfulCount})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {hasMore && (
              <div className="text-center pt-6">
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More Reviews'}
                </button>
              </div>
            )}
            {reviews.length === 0 && !loading && (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-600">
                  Be the first to share your experience!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
