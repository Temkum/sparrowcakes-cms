import AnimatedReviews from '@/components/reviews/AnimatedReviews';
import BannerDeal from '@/components/sparrow/BannerDeal';
import LatestGist from '@/components/sparrow/BlogSection';
import CategoriesSection from '@/components/sparrow/CategoriesSection';
import HeroBanner from '@/components/sparrow/HeroBanner';
// import HeroSlider from '@/components/sparrow/HeroSlider';
import PopularProducts from '@/components/sparrow/PopularProducts';
import ProductBanners from '@/components/sparrow/ProductBanners';
import ProductGrid from '@/components/sparrow/ProductGrid';
import Services from '@/components/sparrow/Services';
import Testimonials from '@/components/sparrow/Testimonials';
import { products } from '@/utilities/data';

const Home = () => {
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
      <CategoriesSection />
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
      <PopularProducts products={products} onAddToCart={handleAddToCart} />
      <ProductBanners />
      <Services />
      <BannerDeal />
      <AnimatedReviews />
      <LatestGist />
    </>
  );
};

export default Home;
