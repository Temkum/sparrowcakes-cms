import { Card, CardContent } from '../ui/card';
import { Star } from 'lucide-react';

const Review = () => {
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
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20from%202025-02-07%2000-52-06-KBs7CaW2b5fcoj739gYjDxpHSE38Io.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Role */}
          <span className="text-gray-500 text-sm">Co Founder</span>

          {/* Name */}
          <h3 className="text-xl font-bold text-gray-900">Stephen Smith</h3>

          {/* Quote */}
          <p className="text-gray-500 max-w-sm">
            "elusmpsu dolor sit amet, conse cte tur ng elit, sed do eiusmod tem
            lacus vel facilisis."
          </p>

          {/* Star Rating */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#ff7b5c] text-[#ff7b5c]" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Review;
