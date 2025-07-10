import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingBag } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '../ui/carousel';
import { useEffect, useState } from 'react';
import { UIProduct } from '@/types';
import useProductStore from '@/store/product-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';

function ProductCard({
  title,
  category,
  price,
  originalPrice,
  rating,
  image,
  onAddToCart,
}: UIProduct & { onAddToCart?: () => void }) {
  return (
    <Card className="group overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 p-6">
        <img
          src={image || '/placeholder.svg'}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Shopping Bag Button */}
      <div className="relative -mt-6 mb-2 z-10 flex justify-center">
        <button
          onClick={onAddToCart}
          className="p-2 bg-gray-50 rounded-full shadow-md hover:bg-white transition-colors border border-gray"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-4 h-4" color="green" />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">{category}</p>

        {/* Rating */}
        <div className="flex justify-center items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : i < rating
                  ? 'fill-yellow-400 text-yellow-400 opacity-50'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">({rating})</span>
        </div>

        {/* Title */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{title}</h3>

        {/* Price */}
        <div className="flex justify-center items-center gap-2">
          <span className="text-emerald-500 font-semibold">${price}</span>
          {originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

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
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-fit">
          Shop Now
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

// Helper to map Product (from store) to UIProduct for ProductCard
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
  return {
    id: product.id,
    title: product.name || '',
    category,
    price: product.price,
    originalPrice: product.price + (product.discount || 0),
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
}

export default function PopularProducts({
  onAddToCart,
}: {
  onAddToCart?: (id: number) => void;
}) {
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
                      const uiProduct = toUIProduct(product);
                      return (
                        <CarouselItem
                          key={uiProduct.id}
                          className="sm:basis-1/2 lg:basis-1/3"
                        >
                          <div className="p-1">
                            <ProductCard
                              {...uiProduct}
                              onAddToCart={() => onAddToCart?.(uiProduct.id)}
                            />
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
}
