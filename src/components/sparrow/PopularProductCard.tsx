import { UIProduct } from '@/types';
import { Card } from '../ui/card';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFormatCurrency } from '@/hooks/format-currency';

const PopularProductCard = (product: UIProduct) => {
  const formatCurrency = useFormatCurrency();
  return (
    <>
      <Card className="group overflow-hidden">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50 p-6">
          <Link to={`/products/details/${product.id}`}>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </Link>
        </div>
        {/* Product Details */}
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            {product.category}
          </p>

          {/* Rating */}
          <div className="flex justify-center items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-300 text-yellow-300'
                    : i < product.rating
                    ? 'fill-rose-200 text-rose-200 opacity-50'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              ({product.totalReviews})
            </span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-sm mb-2 line-clamp-2">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex justify-center items-center gap-2">
            <span className="text-emerald-500 font-semibold">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default PopularProductCard;
