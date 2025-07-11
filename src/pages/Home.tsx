import AnimatedReviews from '@/components/reviews/AnimatedReviews';
import BannerDeal from '@/components/sparrow/BannerDeal';
import LatestGist from '@/components/sparrow/BlogSection';
// import CategoriesSection from '@/components/sparrow/CategoriesSection';
import DynamicCategoriesSection from '@/components/sparrow/DynamicCategoriesSection';
import HeroBanner from '@/components/sparrow/HeroBanner';
// import HeroSlider from '@/components/sparrow/HeroSlider';
// import HeroCarousel from '@/components/sparrow/HeroCarousel';
import PopularProducts from '@/components/sparrow/PopularProducts';
import ProductBanners from '@/components/sparrow/ProductBanners';
import ProductGrid from '@/components/sparrow/ProductGrid';
import Services from '@/components/sparrow/Services';
import useProductStore from '@/store/product-storeold';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';
import { UIProduct } from '@/types';

// Helper to map Product (from store) to UIProduct for ProductGrid
function isCategoryObject(cat: unknown): cat is { id: number; name: string } {
  return (
    typeof cat === 'object' && cat !== null && 'id' in cat && 'name' in cat
  );
}

function toUIProduct(product: Product): UIProduct {
  // Handle category extraction
  let category = '';
  let categories: { id: number; name: string }[] = [];
  if (Array.isArray(product.categories) && product.categories.length > 0) {
    const catArr = product.categories.reduce<{ id: number; name: string }[]>(
      (acc, cat) => {
        if (isCategoryObject(cat)) acc.push({ id: cat.id, name: cat.name });
        return acc;
      },
      []
    );
    if (catArr.length > 0) {
      category = catArr[0].name || '';
      categories = catArr;
    }
  }
  // Handle image extraction (only string URLs)
  const imageUrl =
    Array.isArray(product.imageUrls) && product.imageUrls.length > 0
      ? product.imageUrls.find((img) => typeof img === 'string')
      : Array.isArray(product.images) && product.images.length > 0
      ? product.images.find((img) => typeof img === 'string')
      : '/placeholder.svg';
  // Handle images array (only string URLs)
  const images = Array.isArray(product.images)
    ? (product.images.filter((img) => typeof img === 'string') as string[])
    : [];
  // Handle availability as Date
  let availability: Date | undefined = undefined;
  if (product.availability) {
    if (typeof product.availability === 'string') {
      availability = new Date(product.availability);
    } else {
      availability = product.availability;
    }
  }
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;
  const totalReviews = reviews.length;

  const uiProduct: UIProduct = {
    id: product.id,
    title: product.name || '',
    category,
    price: product.price,
    originalPrice: product.price + (product.discount || 0),
    reviews,
    rating: averageRating,
    totalReviews,
    image: imageUrl || '/placeholder.svg',
    display: true,
    quantity: product.quantity,
    description: product.description,
    discount: product.discount,
    costPerUnit: product.costPerUnit,
    slug: product.slug,
    isActive: product.isActive,
    availability,
    categories,
    images,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  return uiProduct;
}

const Home = () => {
  const { products, loadingProducts, loadProducts } = useProductStore();

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCart = (productId: number) => {
    console.log(`Added product ${productId} to cart`);
  };

  const handleAddToWishlist = (productId: number) => {
    console.log(`Added product ${productId} to wishlist`);
  };

  const handleQuickView = (productId: number) => {
    console.log(`Quick view for product ${productId}`);
  };

  return (
    <>
      {/* <HeroSlider /> */}
      <HeroBanner />
      {/* <HeroCarousel /> */}
      {/* <CategoriesSection /> */}
      <DynamicCategoriesSection />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">Our Products</h1>
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <ProductGrid
            products={products.slice(0, 12).map(toUIProduct)}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onQuickView={handleQuickView}
            className="mb-8"
          />
        )}
      </div>
      <PopularProducts onAddToCart={handleAddToCart} />
      <ProductBanners />
      <Services />
      <BannerDeal />
      <AnimatedReviews />
      <LatestGist />
    </>
  );
};

export default Home;
