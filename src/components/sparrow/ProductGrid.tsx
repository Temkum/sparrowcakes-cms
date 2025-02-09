import ProductCard from './ProductCard';

const ProductGrid = ({
  products,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  className = '',
}: ProductGridProps) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onAddToCart={() => onAddToCart?.(product.id)}
          onAddToWishlist={() => onAddToWishlist?.(product.id)}
          onQuickView={() => onQuickView?.(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
