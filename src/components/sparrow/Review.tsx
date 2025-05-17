import { Card, CardContent } from '../ui/card';
import { Star } from 'lucide-react';
import { ReviewResponse, Customer } from '@/types/review';

// Extended customer type that includes the new fields we've added
interface ExtendedCustomer extends Customer {
  image_url?: string | null;
  occupation?: string | null;
}

// Extended review response that uses our extended customer type
interface ExtendedReviewResponse extends Omit<ReviewResponse, 'customer'> {
  customer: ExtendedCustomer;
}

interface ReviewComponentProps {
  review?: ReviewResponse | ExtendedReviewResponse;
  name?: string;
  occupation?: string;
  comment?: string;
  rating?: number;
  customerImage?: string;
}

const Review = ({
  review,
  name = 'Customer Name',
  occupation = 'Customer',
  comment = 'No comment provided',
  rating = 5,
  customerImage,
}: ReviewComponentProps) => {
  // Use review data if provided, otherwise use props
  const displayName = review?.customer?.name || name;
  // Use the customer's occupation if available
  const displayOccupation = (review?.customer as ExtendedCustomer)?.occupation || occupation;
  const displayComment = review?.comment || comment;
  const displayRating = review?.rating || rating;
  
  // Use customer image from review if available, otherwise use provided image or default
  const displayImage = (review?.customer as ExtendedCustomer)?.image_url || customerImage || '/placeholder-avatar.png';

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="relative bg-[#f8f8f8] p-6">
        {/* Decorative quote marks */}
        <span className="absolute text-[100px] leading-none font-serif text-[#f0f0f0] top-4 left-6">
          66
        </span>
        <span className="absolute text-[100px] leading-none font-serif text-[#f0f0f0] bottom-4 right-6">
          99
        </span>

        <CardContent className="relative z-10 flex flex-col items-center text-center space-y-4">
          {/* Profile Image */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={displayImage}
              alt={`${displayName}'s avatar`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default avatar if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-avatar.png';
              }}
            />
          </div>

          {/* Role/Occupation */}
          <span className="text-gray-500 text-sm">{displayOccupation}</span>

          {/* Name */}
          <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>

          {/* Quote/Comment */}
          <p className="text-gray-500 max-w-sm">
            "{displayComment}"
          </p>

          {/* Star Rating */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-5 h-5 ${i < displayRating ? 'fill-[#ff7b5c] text-[#ff7b5c]' : 'fill-gray-200 text-gray-200'}`} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Review;
