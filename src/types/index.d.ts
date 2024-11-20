export interface ILocation {
  title: string;
}

export interface IMenuItem {
  link: string;
  title: string;
  subMenu?: ISubMenu[];
}

export interface ISubMenu {
  text: string;
  link: string;
}

interface MobileMenuSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: (e) => void;
}

interface HeaderTopProps {
  toggleSidebar: (e) => void;
}

interface Category {
  id: number;
  icon: JSX.Element;
  title: string;
  discount?: string;
  itemsCount: number;
  link: string;
}

interface CategoryCarouselProps {
  categories: Category[];
}

interface ProductImage {
  main: string;
  hover: string;
}

interface ProductPrice { 
  new: string;
  old: string | null;
}

interface ProductFlags {
  flag: string;
}

interface ProductContentProps {
  product: {
    id: number;
    category: string;
    name: string;
    description: string;
    images: ProductImage;
    price: ProductPrice;
    rating: number;
    flags?: ProductFlags;
  };
}

interface StarRatingProps {
  item: {
    rating: number;
  }
}

interface Product {
  id: string;
  title: string;
  rating: number; // between 0 to 5
  totalRatings: number;
  finalPrice: number;
  discount: number;
  mrp: string;
  sku: string;
  stockStatus: string;
  description: string;
  features: { key: string; value: string }[];
  weightOptions: number[];
  quantity: number;
  image: string;
  actions: {
    addToCart: boolean;
    wishlist: boolean;
    quickView: boolean;
  };
}

interface SingleProductContentProps {
  product: Product;
}

interface ProductDiscountCarouselProps {
  products: Product[];
}

type LoginProps = {
  toggleSidebar: HeaderTopProps['toggleSidebar'];
};

