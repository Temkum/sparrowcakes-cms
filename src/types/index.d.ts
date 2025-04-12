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
  title: number;
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
  id: number;
  title: string;
  category: string;
  quantity: number;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  display: boolean;
  description: string;
  discount: number;
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
  onAddToCart?: (productId: number) => void;
}

interface ProductStats {
  totalProducts: number;
  productInventory: number;
  averagePrice: number;
}

interface CategoryForDisplay {
  id: number;
  name: string;
  itemCount: number;
  banners: Banner[];
}

interface Banner {
  image: string;
  discount: number;
  title: string;
  position?: 'left' | 'right';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Slide {
  tag: string;
  tagPercentage: string;
  title: string;
  description: string;
  image: string;
  backgroundColor: string;
}

interface CarouselApi {
  on: (event: string, callback: () => void) => void;
  selectedScrollSnap: () => number;
  next: () => void;
  prev: () => void;
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

interface Order {
  date: string;
  number: string;
  customer: string;
  status: 'Processing' | 'Cancelled' | 'Shipped' | 'New';
  currency: string;
  totalPrice: number;
  shippingCost: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  slug: string;
  description: string;
  isActive: boolean;
  updated_at: string;
  created_at: string;
}

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

interface OrdersProp {
  id: string;
  number: string;
  customer: string;
  status: 'Processing' | 'Delivered' | 'Shipped' | 'New' | 'Cancelled';
  currency: string;
  totalPrice: number;
  shippingCost: number;
  orderDate: string;
}

interface ProductDisplay {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  display: boolean;
}

interface Option {
  value: number;
  label: string;
}

interface DynamicCategoriesProps {
  name: string;
  label: string;
  isRequired?: boolean;
}

interface CreateCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

type ForgotPasswordFormValues = {
  email: string;
};

interface PasswordResetResponse {
  error?: {
    message: string;
  };
}

interface AxiosResponse<T = unknown, D = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: unknown;
  config: AxiosRequestConfig<D>;
  request?: unknown;
}
