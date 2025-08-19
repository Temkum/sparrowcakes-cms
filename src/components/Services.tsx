const Services = () => {
  return (
    <section className="gi-service-section padding-tb-40">
      <div className="container">
        <div className="row m-tb-minus-12">
          <div className="gi-ser-content gi-ser-content-1 col-sm-6 col-md-6 col-lg-3 p-tp-12 wow fadeInUp">
            <div className="gi-ser-inner">
              <div className="gi-service-image">
                <i className="fi fi-ts-truck-moving" />
              </div>
              <div className="gi-service-desc">
                <h3>Free Shipping</h3>
                <p>Free shipping on all US order or order above $200</p>
              </div>
            </div>
          </div>
          <div
            className="gi-ser-content gi-ser-content-2 col-sm-6 col-md-6 col-lg-3 p-tp-12 wow fadeInUp"
            data-wow-delay=".4s"
          >
            <div className="gi-ser-inner">
              <div className="gi-service-image">
                <i className="fi fi-ts-hand-holding-seeding" />
              </div>
              <div className="gi-service-desc">
                <h3>24X7 Support</h3>
                <p>Contact us 24 hours a day, 7 days a week</p>
              </div>
            </div>
          </div>
          <div
            className="gi-ser-content gi-ser-content-3 col-sm-6 col-md-6 col-lg-3 p-tp-12 wow fadeInUp"
            data-wow-delay=".6s"
          >
            <div className="gi-ser-inner">
              <div className="gi-service-image">
                <i className="fi fi-ts-badge-percent" />
              </div>
              <div className="gi-service-desc">
                <h3>30 Days Return</h3>
                <p>Simply return it within 30 days for an exchange</p>
              </div>
            </div>
          </div>
          <div
            className="gi-ser-content gi-ser-content-4 col-sm-6 col-md-6 col-lg-3 p-tp-12 wow fadeInUp"
            data-wow-delay=".8s"
          >
            <div className="gi-ser-inner">
              <div className="gi-service-image">
                <i className="fi fi-ts-donate" />
              </div>
              <div className="gi-service-desc">
                <h3>Payment Secure</h3>
                <p>Contact us 24 hours a day, 7 days a week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
