import { StarRatingProps } from '@/types';
import { Star } from 'lucide-react';

const StarRating = ({ item }: StarRatingProps) => {
  return (
    <>
      <span className="gi-pro-rating">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={15}
            className={`fill ${Math.round(item.rating) > i ? 'filled' : ''}`}
            color={Math.round(item.rating) > i ? '#f27d0c' : '#777'}
            fill={Math.round(item.rating) > i ? '#f27d0c' : '#777'}
          />
        ))}
      </span>
    </>
  );
};

export default StarRating;
