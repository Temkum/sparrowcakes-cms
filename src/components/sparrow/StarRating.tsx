import { Star } from 'lucide-react';

export function StarRating({ rating, className = '' }: StarRatingProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          className={`${
            star <= rating
              ? 'fill-orange-400 text-orange-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}
