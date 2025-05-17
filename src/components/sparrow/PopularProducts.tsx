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
          <span className="text-emerald-500 font-semibold">
            ${price.toFixed(2)}
          </span>
          {originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
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

export default function PopularProducts({
  products,
  onAddToCart,
}: PopularProductsProps) {
  const [api, setApi] = useState<CarouselApi>();

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
                {products.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="sm:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <ProductCard
                        {...product}
                        onAddToCart={() => onAddToCart?.(product.id)}
                      />
                    </div>
                  </CarouselItem>
                ))}
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
