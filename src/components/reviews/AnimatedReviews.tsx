import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import './reviews.css';

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

// Mock API function - replace with your actual API call
const fetchReviews = async (): Promise<Review[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data - replace with actual API call
  return [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Marketing Director',
      text: 'Absolutely exceptional service! The team went above and beyond to deliver exactly what we needed. The attention to detail and professionalism was outstanding.',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Product Manager',
      text: 'Great experience working with this team. They delivered on time and exceeded our expectations.',
      rating: 4,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'CEO',
      text: 'Outstanding results! The project was completed flawlessly and the communication throughout was excellent. Highly recommend their services to anyone looking for quality work.',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'CTO',
      text: 'Professional, reliable, and delivered exactly what was promised. The technical expertise was impressive.',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      title: 'Operations Manager',
      text: 'Fantastic work ethic and attention to detail. The final product exceeded all our expectations and was delivered ahead of schedule.',
      rating: 4,
      avatar:
        'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '6',
      name: 'James Wilson',
      title: 'Creative Director',
      text: 'Incredible creativity and technical skill. They brought our vision to life in ways we never imagined possible.',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '7',
      name: 'Anna Martinez',
      title: 'Brand Manager',
      text: 'Top-notch service with excellent communication. The team was responsive and delivered quality work.',
      rating: 4,
      avatar:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '8',
      name: 'Robert Davis',
      title: 'VP of Sales',
      text: 'Exceptional attention to detail and customer service. The results speak for themselves - highly recommended!',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
    },
  ];
};

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
const AnimatedReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews();
        // Filter for 4-5 star reviews only
        const highRatedReviews = data.filter((review) => review.rating >= 4);
        setReviews(highRatedReviews);
      } catch (err) {
        setError('Failed to load reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

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
      </div>{' '}
    </section>
  );
};

export default AnimatedReviews;
