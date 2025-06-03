import { Category } from './category/index';

export interface InputProps {
  type: string;
  placeholder: string;
  className?: string;
  icon?: React.ReactNode;
}

export interface StarRatingProps {
  rating: number;
  className?: string;
}

export interface TestimonialCardProps {
  image: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface BlogCardProps {
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

export interface ProductCardProps {
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

export interface UIProduct {
  id: number;
  title: string;
  category: string;
  quantity?: number;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  display: boolean;
  description?: string;
  discount?: number;
  costPerUnit?: number;
  slug?: string;
  isActive?: boolean;
  availability?: Date;
  categories?: { id: number; name: string }[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductGridProps {
  products: UIProduct[];
  onAddToCart?: (productId: number) => void;
  onAddToWishlist?: (productId: number) => void;
  onQuickView?: (productId: number) => void;
  className?: string;
}

export interface Service {
  icon: JSX.Element;
  title: string;
  description: string;
}

export interface BannerProps {
  title: string;
  discount: number;
  image: string;
  backgroundColor: string;
  onClick?: () => void;
}

export interface PopularProductsProps {
  products: UIProduct[];
  onAddToCart?: (productId: number) => void;
}

export interface CategoryForDisplay {
  id: number;
  name: string;
  itemCount: number;
  banners: Banner[];
}

export interface Banner {
  image: string;
  discount: number;
  title: string;
  position?: 'left' | 'right';
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Slide {
  tag: string;
  tagPercentage: string;
  title: string;
  description: string;
  image: string;
  backgroundColor: string;
}

export interface CarouselApi {
  on: (event: string, callback: () => void) => void;
  selectedScrollSnap: () => number;
  next: () => void;
  prev: () => void;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export interface Order {
  date: string;
  number: string;
  customer: string;
  status: 'Processing' | 'Cancelled' | 'Shipped' | 'New';
  currency: string;
  totalPrice: number;
  shippingCost: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export { Category };

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface OrdersProp {
  id: string | number;
  number: string;
  customer: string;
  status: 'Processing' | 'Delivered' | 'Shipped' | 'New' | 'Cancelled';
  currency: string;
  totalPrice: number;
  shippingCost: number;
  orderDate: string;
}

export interface ProductDisplay {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  display: boolean;
}

export interface Option {
  value: number;
  label: string;
}

export interface DynamicCategoriesProps {
  name: string;
  label: string;
  value: number[];
  onChange: (categories: number[]) => void;
  isRequired?: boolean;
}

export interface CreateCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export type ForgotPasswordFormValues = {
  email: string;
};

export interface PasswordResetResponse {
  error?: {
    message: string;
  };
}

export interface AxiosResponse<T = unknown, D = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: unknown;
  config: AxiosRequestConfig<D>;
  request?: unknown;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  isActive?: boolean;
  avatar?: string;
  role?: string;
}

export interface Team {
  name: string;
  logo: React.ComponentType;
  plan: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType;
  isActive?: boolean;
  items?: Array<{
    title: string;
    url: string;
  }>;
}

export interface ContentItem {
  name: string;
  url: string;
  icon: React.ComponentType;
}
