import { ProductGridProps } from '@/types';
import ProductCard from './ProductCard';

const ProductGrid = ({
  products,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  className = '',
}: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <div className={`text-center ${className}`}>
        <p>No products available at the moment, please check back later!</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-6 ${className}`}
    >
      {products ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={() => onAddToCart?.(product.id)}
            onAddToWishlist={() => onAddToWishlist?.(product.id)}
            onQuickView={() => onQuickView?.(product.id)}
          />
        ))
      ) : (
        <p>No products at the moment, please check back later!</p>
      )}
    </div>
  );
};

export default ProductGrid;
