const OfferBanner = () => {
  return (
    <section className="gi-offer-section padding-tb-40">
      <div className="container">
        {/*  Offer banners */}
        <div className="row">
          <div className="col-md-6 wow fadeInLeft" data-wow-duration="2s">
            <div className="gi-ofr-banners">
              <div className="gi-bnr-body">
                <div className="gi-bnr-img">
                  <span className="lbl">70% Off</span>
                  <img src="/assets/images/2.jpg" alt="banner" />
                </div>
                <div className="gi-bnr-detail">
                  <h5>Tasty Snack &amp; Fastfood</h5>
                  <p>The flavor of something special</p>
                  <a href="shop-left-sidebar-col-3.html" className="gi-btn-2">
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 wow fadeInRight" data-wow-duration="2s">
            <div className="gi-ofr-banners m-t-767">
              <div className="gi-bnr-body">
                <div className="gi-bnr-img">
                  <span className="lbl">50% Off</span>
                  <img src="/assets/images/3.jpg" alt="banner" />
                </div>
                <div className="gi-bnr-detail">
                  <h5>Fresh Fruits &amp; veggies</h5>
                  <p>A healthy meal for every one</p>
                  <a href="shop-left-sidebar-col-3.html" className="gi-btn-2">
                    Shop Now
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

export default OfferBanner;
