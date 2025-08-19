import ReviewsList, {
  ReviewFilters,
  ReviewSubmission,
  ReviewWithDetails,
  SortOption,
} from '@/components/sparrow/ReviewsList';
import { useEffect, useState } from 'react';
import { useReviewsStore } from '@/store/reviews-store';
import { ReviewResponseProps } from '@/types/review';

// Interface for creating reviews that matches the backend DTO
interface CreateReviewData {
  rating: number;
  comment: string;
  product_id: number;
  customer_id?: number;
  display?: boolean;
}

// Extended interface for UI reviews with additional properties
interface UIReviewWithExtras extends ReviewResponseProps {
  helpfulCount?: number;
  isHelpful?: boolean;
  isFeatured?: boolean;
}

const ReviewsPageUI: React.FC = () => {
  const {
    uiReviews,
    loading: storeLoading,
    fetchReviewsForUI,
  } = useReviewsStore();

  const [sort, setSort] = useState<SortOption>('recent');
  const [filters, setFilters] = useState<ReviewFilters>({});
  const [localReviews, setLocalReviews] = useState<ReviewWithDetails[]>([]);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    fetchReviewsForUI();
  }, [fetchReviewsForUI]);

  useEffect(() => {
    const enhancedReviews: ReviewWithDetails[] = uiReviews.map(
      (r: ReviewResponseProps) => ({
        ...r,
        productId: r.product?.id,
        customerId: r.customer?.id,
        isActive: r.display ?? true,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        customer: {
          ...r.customer,
          occupation: r.customer?.occupation ?? '',
        },
        helpfulCount: (r as UIReviewWithExtras).helpfulCount ?? 0,
        isHelpful: (r as UIReviewWithExtras).isHelpful ?? false,
        isFeatured: (r as UIReviewWithExtras).isFeatured ?? false,
      })
    );
    setLocalReviews(enhancedReviews);
  }, [uiReviews]);

  // Apply filters
  const filteredReviews = localReviews.filter((r) => {
    if (filters.rating) {
      return r.rating >= filters.rating;
    }
    return true;
  });

  // Apply sorting
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sort === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sort === 'rating') {
      return b.rating - a.rating;
    } else if (sort === 'helpful') {
      return b.helpfulCount - a.helpfulCount;
    }
    return 0;
  });

  // Compute aggregates from all reviews
  const totalReviews = uiReviews.length;
  const averageRating =
    totalReviews > 0
      ? uiReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  const ratingBreakdown = [1, 2, 3, 4, 5].reduce((acc, star) => {
    acc[star] = uiReviews.filter((r) => r.rating === star).length;
    return acc;
  }, {} as Record<number, number>);

  const handleLoadMore = async () => {
    setLocalLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate
    setLocalLoading(false);
  };

  const handleSubmitReview = async (submission: ReviewSubmission) => {
    const tempId = Date.now();
    const newReview: ReviewWithDetails = {
      id: tempId,
      productId: submission.productId ?? 136,
      customerId: 1,
      rating: submission.rating,
      comment: submission.comment,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: {
        id: 1,
        occupation: '',
        name: 'New Customer',
        phone: '',
        email: '',
        image_url: null,
      },
      product: {
        id: submission.productId ?? 136,
        name: 'Cake 1',
        slug: 'cake-1',
        description: '',
        price: 0,
        cost_per_unit: 0,
        discount: 0,
        quantity: 0,
        image_urls: [],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reviews: [],
      },
      helpfulCount: 0,
      isHelpful: false,
      isFeatured: false,
    };

    setLocalReviews((prev) => [newReview, ...prev]);

    try {
      await useReviewsStore.getState().createReview({
        rating: submission.rating,
        comment: submission.comment,
        product_id: newReview.productId,
      } as CreateReviewData);
    } catch (error) {
      setLocalReviews((prev) => prev.filter((r) => r.id !== tempId));
      console.error('Failed to submit review:', error);
    }
  };

  const handleVoteHelpful = async (reviewId: number) => {
    setLocalReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              helpfulCount: review.helpfulCount + 1,
              isHelpful: true,
            }
          : review
      )
    );
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
  };

  const handleFilterChange = (newFilters: ReviewFilters) => {
    setFilters(newFilters);
  };

  return (
    <ReviewsList
      reviews={sortedReviews}
      totalReviews={totalReviews}
      averageRating={averageRating}
      ratingBreakdown={ratingBreakdown}
      loading={storeLoading || localLoading}
      hasMore={false}
      onLoadMore={handleLoadMore}
      onSubmitReview={handleSubmitReview}
      onVoteHelpful={handleVoteHelpful}
      onSortChange={handleSortChange}
      onFilterChange={handleFilterChange}
      allowSubmit={true}
      showProductTags={true}
      featuredReviewIds={[37]}
    />
  );
};

export default ReviewsPageUI;
