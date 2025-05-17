import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  className?: string;
  onClick?: (rating: number) => void;
}

export function StarRating({
  rating,
  className = '',
  onClick,
}: StarRatingProps) {
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
          } ${
            onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''
          }`}
          onClick={() => onClick?.(star)}
        />
      ))}
    </div>
  );
}
