import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '../ui/carousel';
import { useEffect, useState } from 'react';
import useProductStore from '@/store/product-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import PopularProductCard from './PopularProductCard';
import { Product } from '@/types/product';
import { UIProduct } from '@/types';

function PromoBanner() {
  return (
    <div className="relative h-full rounded-lg overflow-hidden">
      <img
        src="/assets/images/products-rightview.jpg"
        alt="Organic & Healthy Vegetables"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 p-6 flex flex-col justify-end">
        <h3 className="text-2xl font-bold text-white mb-2">
          Organic & Healthy Vegetables
        </h3>
        <p className="text-white text-lg font-semibold mb-4">25% OFF</p>
        <Button
          asChild
          className="bg-emerald-500 hover:bg-emerald-600 text-white w-fit"
        >
          <Link to="/products">Shop Now</Link>
        </Button>
      </div>
    </div>
  );
}

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

const PopularProducts = () => {
  const { popularProducts, loadingPopularProducts, loadPopularProducts } =
    useProductStore();
  const [initialized, setInitialized] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!initialized) {
      loadPopularProducts();
      setInitialized(true);
    }
  }, [initialized, loadPopularProducts]);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Popular Products
        </h2>
        <p className="text-center mb-8">
          Discover our most popular products, loved by our customers!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
              setApi={setApi}
            >
              <CarouselContent>
                {loadingPopularProducts
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <CarouselItem
                        key={i}
                        className="sm:basis-1/2 lg:basis-1/3"
                      >
                        <div className="p-1">
                          <Skeleton className="h-80 w-full rounded-lg" />
                        </div>
                      </CarouselItem>
                    ))
                  : popularProducts.map((product) => {
                      return (
                        <CarouselItem
                          key={product.id}
                          className="sm:basis-1/2 lg:basis-1/3"
                        >
                          <div className="p-1">
                            <PopularProductCard {...toUIProduct(product)} />
                          </div>
                        </CarouselItem>
                      );
                    })}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="lg:col-span-1">
            <PromoBanner />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
