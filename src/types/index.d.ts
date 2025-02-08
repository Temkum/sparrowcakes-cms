interface InputProps {
  type: string;
  placeholder: string;
  className?: string;
  icon?: React.ReactNode;
}

interface StarRatingProps {
  rating: number;
  className?: string;
}

interface TestimonialCardProps {
  image: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

interface BlogCardProps {
  author: string;
  category: string;
  title: string;
  image: string;
  date: {
    day: number;
    month: string;
  };
  slug: string;
}