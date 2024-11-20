import ProductCard from './ProductCard';
import '@/styles/related-products.scss';

const RelatedProducts = () => {
  return (
    <>
      <section className="gi-related-product gi-new-product padding-tb-40">
        <div className="container">
          <div className="row overflow-hidden m-b-minus-24px">
            <div className="gi-new-prod-section col-lg-12">
              <div className="gi-products">
                <div
                  className="section-title-2"
                  data-aos="fade-up"
                  data-aos-duration={2000}
                  data-aos-delay={200}
                >
                  <h2 className="gi-title">
                    Related <span>Products</span>
                  </h2>
                  <p>Browse The Collection of Top Products</p>
                </div>
                <div
                  className="gi-new-block m-minus-lr-12"
                  data-aos="fade-up"
                  data-aos-duration={2000}
                  data-aos-delay={300}
                >
                  <div className="new-product-carousel owl-carousel gi-product-slider">
                    <ProductCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RelatedProducts;
