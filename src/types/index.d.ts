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

interface ProductCardProps {
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onQuickView?: () => void;
}

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  className?: string;
}

interface Service {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface BannerProps {
  title: string;
  discount: number;
  image: string;
  backgroundColor: string;
  onClick?: () => void;
}

interface PopularProductsProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
}
