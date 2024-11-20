const BannerCTA = () => {
  return (
    <section
      className="gi-banner padding-tb-40 wow fadeInUp"
      data-wow-duration="2s"
    >
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div
              className="gi-animated-banner"
              data-aos="fade-up"
              data-aos-duration={2000}
              data-aos-delay={200}
            >
              <h2 className="d-none">Offers</h2>
              <div className="gi-bnr-detail">
                <div className="gi-bnr-info">
                  <h2>
                    Fresh Fruits <br />
                    Healthy Products
                  </h2>
                  <h3>
                    30% off sale <span>Hurry up!!</span>
                  </h3>
                  <a href="" className="gi-btn-2">
                    Shop now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerCTA;
