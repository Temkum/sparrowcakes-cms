import LatestGist from '@/components/sparrow/BlogSection';
import ProductGrid from '@/components/sparrow/ProductGrid';
import Testimonials from '@/components/sparrow/Testimonials';
import { products } from '@/utilities/data';

const Home = () => {
  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`);
  };

  const handleAddToWishlist = (productId: string) => {
    console.log(`Added product ${productId} to wishlist`);
  };

  const handleQuickView = (productId: string) => {
    console.log(`Quick view for product ${productId}`);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">Our Products</h1>
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onQuickView={handleQuickView}
          className="mb-8"
        />
      </div>
      <Testimonials />
      <LatestGist />
    </>
  );
};

export default Home;
