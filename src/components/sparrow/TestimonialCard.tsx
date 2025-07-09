import { TestimonialCardProps } from '@/types';
import { StarRating } from './StarRating';

export function TestimonialCard({
  image,
  name,
  role,
  quote,
  rating,
}: TestimonialCardProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-8 shadow-lg relative">
      <div className="flex flex-col items-center text-center">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 rounded-full object-cover -mt-16 mb-4 border-4 border-white ring-white"
        />
        <p className="text-gray-600 mb-2">{role}</p>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{name}</h3>
        <p className="text-gray-600 italic mb-6">"{quote}"</p>
        <StarRating rating={rating} />
      </div>
    </div>
  );
}
