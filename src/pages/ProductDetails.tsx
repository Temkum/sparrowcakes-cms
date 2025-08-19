import Footer from '@/components/Footer';
import Header from '@/components/Header';
import RelatedProducts from '@/components/RelatedProducts';
import SingleProductContent from '@/components/SingleProductContent';
import SingleProductTabs from '@/components/SingleProductTabs';
import ProductDetailsImages from '@/components/ui/ProductDetailsImages';
import ProductDiscountCarousel from '@/components/ui/ProductDiscountCarousel';
import { generateRandomProducts } from '@/utils/functions';

const ProductDetails = () => {
  const products = generateRandomProducts(3);
  return (
    <>
      <Header />
      <section className="gi-single-product padding-tb-40">
        <div className="container">
          <div className="row">
            <div className="gi-pro-rightside gi-common-rightside col-md-12">
              {/* Single product content Start */}
              <div className="single-pro-block">
                <div className="single-pro-inner">
                  <div className="row">
                    {/* Product Gallery */}
                    <ProductDetailsImages />
                    {/* Single product content */}
                    <SingleProductContent product={products[0]} />
                  </div>
                </div>
              </div>
              {/* Add More and get discount content Start */}
              <div className="single-add-more m-tb-40">
                <div className="gi-add-more-slider section">
                  <ProductDiscountCarousel products={products} />
                </div>
              </div>
              {/* Single product tab start */}
              <div className="gi-single-pro-tab">
                <SingleProductTabs />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts />

      <Footer />
    </>
  );
};

export default ProductDetails;
