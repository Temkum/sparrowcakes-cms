import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function ProductCard({
  title = 'Best snakes with hazel nut mix pack 200gm',
  category = 'Snacks',
  price = 120.25,
  originalPrice = 123.25,
  rating = 0,
  image = '/placeholder.svg',
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}: ProductCardProps) {
  return (
    <Card className="group relative max-w-sm overflow-hidden p-4">
      {/* Product Image with Hover Icons */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image || '/placeholder.svg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-sm"
        />

        {/* Hover Icons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onAddToWishlist}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>
          <button
            onClick={onQuickView}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Shopping Bag Icon */}
        <button
          onClick={onAddToCart}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10 cart-button"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-5 h-5 text-emerald-600 z-50" />
        </button>
      </div>

      <CardContent className="p-4 text-center">
        {/* Category */}
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
          <span className="text-emerald-600 font-semibold">
            ${price.toFixed(2)}
          </span>
          {originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
