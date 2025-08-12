import ReviewsList, {
  mockCustomers,
  mockData,
  mockProducts,
  ReviewFilters,
  ReviewSubmission,
  ReviewWithDetails,
  SortOption,
} from '@/components/sparrow/ReviewsList';
import { useState } from 'react';

const ReviewsPageUI: React.FC = () => {
  const [reviews, setReviews] = useState(mockData.reviews);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSubmitReview = async (review: ReviewSubmission) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add optimistic update
    const newReview: ReviewWithDetails = {
      id: Date.now(),
      productId: review.productId || 1,
      customerId: 1,
      rating: review.rating,
      comment: review.comment,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: mockCustomers[0],
      product: mockProducts[0],
      helpfulCount: 0,
      isHelpful: false,
      isFeatured: false,
    };

    setReviews((prev) => [newReview, ...prev]);
  };

  const handleVoteHelpful = async (reviewId: number) => {
    // Optimistic update
    setReviews((prev) =>
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

  const handleSortChange = (sort: SortOption) => {
    console.log('Sort changed to:', sort);
    // Implement sorting logic
  };

  const handleFilterChange = (filters: ReviewFilters) => {
    console.log('Filters changed:', filters);
    // Implement filtering logic
  };

  return (
    <ReviewsList
      reviews={reviews}
      totalReviews={mockData.totalReviews}
      averageRating={mockData.averageRating}
      ratingBreakdown={mockData.ratingBreakdown}
      loading={loading}
      hasMore={true}
      onLoadMore={handleLoadMore}
      onSubmitReview={handleSubmitReview}
      onVoteHelpful={handleVoteHelpful}
      onSortChange={handleSortChange}
      onFilterChange={handleFilterChange}
      allowSubmit={true}
      showProductTags={true}
      featuredReviewIds={[1, 3]}
    />
  );
};

export default ReviewsPageUI;
