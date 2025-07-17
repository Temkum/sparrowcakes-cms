import React, { useEffect, useState } from 'react';
import { Star, User } from 'lucide-react';
import { ReviewResponseProps } from '@/types/review';
import './reviews.css';
import { useReviewsStore } from '@/store/reviews-store';

// Types
interface Review {
  id: string;
  name: string;
  title?: string;
  text: string;
  rating: number;
  avatar?: string;
  date?: string;
}

interface ReviewCardProps {
  review: Review;
  className?: string;
}

// Transform store review to component review format
const transformReview = (storeReview: ReviewResponseProps): Review => ({
  id: storeReview.id?.toString() || '',
  name: storeReview.customerName || storeReview.customer?.name || 'Anonymous',
  title: storeReview.customer?.title || '',
  text: storeReview.comment || '',
  rating: storeReview.rating || 5,
  avatar: storeReview.customer?.avatar || storeReview.customerAvatar,
  date: storeReview.createdAt || '',
});

// Review Card Component
const ReviewCard: React.FC<ReviewCardProps> = ({ review, className = '' }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 min-h-[200px] flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          {review.avatar && !imageError ? (
            <img
              src={review.avatar}
              alt={`${review.name}'s avatar`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {review.name}
          </h3>
          {review.title && (
            <p className="text-xs text-gray-600 truncate">{review.title}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 text-sm leading-relaxed flex-1">
        {review.text}
      </p>
    </div>
  );
};

// Sliding Row Component
const SlidingRow: React.FC<{
  reviews: Review[];
  direction: 'left' | 'right';
  speed: number;
}> = ({ reviews, direction, speed }) => {
  // Create seamless infinite scroll by duplicating reviews
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex gap-6 ${
          direction === 'left' ? 'animate-slide-left' : 'animate-slide-right'
        }`}
        style={{
          animationDuration: `${speed}s`,
          width: `${duplicatedReviews.length * 320}px`,
        }}
      >
        {duplicatedReviews.map((review, index) => (
          <ReviewCard
            key={`${review.id}-${index}`}
            review={review}
            className="w-80 flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

// Main Component
const AnimatedReviews: React.FC = () => {
  const { uiReviews, loading, fetchReviewsForUI } = useReviewsStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setError(null);
        await fetchReviewsForUI();
      } catch (err) {
        setError('Failed to load reviews');
        console.error('Error fetching reviews:', err);
      }
    };

    loadReviews();
  }, [fetchReviewsForUI]);

  if (loading) {
    return (
      <section
        className="py-16 bg-gradient-to-br from-gray-50 to-gray-100"
        aria-label="Customer Reviews"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sweet Words From Our Customers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our cakes and pastries are crafted with love and the finest
              ingredients. Each bite is a delightful experience, and our
              commitment to quality ensures that every treat is as delicious as
              it is beautiful.
            </p>
            <p className="text-lg text-gray-600">Loading reviews...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="py-16 bg-gradient-to-br from-gray-50 to-gray-100"
        aria-label="Customer Reviews"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Transform store reviews to component format and filter for high ratings
  const transformedReviews = uiReviews
    .map(transformReview)
    .filter((review) => review.rating >= 4);

  if (transformedReviews.length === 0) {
    return (
      <section
        className="py-16 bg-gradient-to-br from-gray-50 to-gray-100"
        aria-label="Customer Reviews"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              No reviews available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Split reviews into rows of 10 each
  const reviewsPerRow = 10;
  const totalRows = Math.ceil(transformedReviews.length / reviewsPerRow);

  const rows = [];
  for (let i = 0; i < totalRows; i++) {
    const startIndex = i * reviewsPerRow;
    const endIndex = startIndex + reviewsPerRow;
    rows.push(transformedReviews.slice(startIndex, endIndex));
  }

  // Ensure we have at least 3 rows for better visual effect
  // If we have fewer reviews, we'll cycle through them
  const displayRows = [];
  if (rows.length >= 3) {
    displayRows.push(...rows.slice(0, 3));
  } else {
    // Cycle through available rows to create 3 display rows
    for (let i = 0; i < 3; i++) {
      const rowIndex = i % rows.length;
      displayRows.push(rows[rowIndex] || []);
    }
  }

  return (
    <section
      className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
      aria-label="Customer Reviews"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sweet Words From Our Customers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our cakes and pastries are crafted with love and the finest
            ingredients. Each bite is a delightful experience, and our
            commitment to quality ensures that every treat is as delicious as it
            is beautiful.
          </p>
        </div>

        {/* Sliding Reviews */}
        <div className="space-y-6">
          {/* Row 1 - Left to Right */}
          {displayRows[0] && displayRows[0].length > 0 && (
            <SlidingRow reviews={displayRows[0]} direction="left" speed={25} />
          )}

          {/* Row 2 - Right to Left */}
          {displayRows[1] && displayRows[1].length > 0 && (
            <SlidingRow reviews={displayRows[1]} direction="right" speed={30} />
          )}

          {/* Row 3 - Left to Right (only on larger screens) */}
          {displayRows[2] && displayRows[2].length > 0 && (
            <div className="hidden lg:block">
              <SlidingRow
                reviews={displayRows[2]}
                direction="left"
                speed={35}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnimatedReviews;
