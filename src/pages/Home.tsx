import BannerCTA from '@/components/BannerCTA';
import CategoryCarousel from '@/components/CategoryCarousel';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NewProducts from '@/components/NewProducts';
import OfferBanner from '@/components/OfferBanner';
import Services from '@/components/Services';
import TrendingProducts from '@/components/TrendingProducts';
import BackToTop from '@/components/ui/BackToTop';

const Home = () => {
  return (
    <>
      <Header />
      <CategoryCarousel />
      <BannerCTA />
      <NewProducts />
      <OfferBanner />
      <Services />
      <TrendingProducts />
      <Footer />
      <BackToTop />
    </>
  );
};

export default Home;
