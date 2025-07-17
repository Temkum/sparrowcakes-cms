import React, { useState } from 'react';
import { Star, User } from 'lucide-react';

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
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

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
interface AnimatedReviewSectionProps {
  reviews: ReadonlyArray<Review>;
  loading: boolean;
  error: string | null;
}

const AnimatedReviewSection: React.FC<AnimatedReviewSectionProps> = ({
  reviews,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <section
        className="py-16 bg-gradient-to-br from-gray-50 to-gray-100"
        aria-label="Customer Reviews"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
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

  if (reviews.length === 0) {
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

  // Split reviews into rows
  const reviewsPerRow = Math.ceil(reviews.length / 3);
  const row1 = reviews.slice(0, reviewsPerRow);
  const row2 = reviews.slice(reviewsPerRow, reviewsPerRow * 2);
  const row3 = reviews.slice(reviewsPerRow * 2);

  return (
    <section
      className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
      aria-label="Customer Reviews"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what some of our satisfied
            customers have to say about their experience.
          </p>
        </div>

        {/* Sliding Reviews */}
        <div className="space-y-6">
          {/* Row 1 - Left to Right */}
          <SlidingRow reviews={row1} direction="left" speed={25} />

          {/* Row 2 - Right to Left */}
          {row2.length > 0 && (
            <SlidingRow reviews={row2} direction="right" speed={30} />
          )}

          {/* Row 3 - Left to Right (only on larger screens) */}
          {row3.length > 0 && (
            <div className="hidden lg:block">
              <SlidingRow reviews={row3} direction="left" speed={35} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnimatedReviewSection;
