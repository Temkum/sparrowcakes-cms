const NewProducts = () => {
  return (
    <section
      className="gi-product-tab gi-products padding-tb-40 wow fadeInUp"
      data-wow-duration="2s"
    >
      <div className="container">
        <div className="gi-tab-title">
          <div className="gi-main-title">
            <div className="section-title">
              <div className="section-detail">
                <h2 className="gi-title">
                  New <span>Arrivals</span>
                </h2>
                <p>Shop online for new arrivals and get free shipping!</p>
              </div>
            </div>
          </div>
          {/* Tab Start */}
          <div className="gi-pro-tab">
            <ul className="gi-pro-tab-nav nav">
              <li className="nav-item">
                <a className="nav-link active" data-bs-toggle="tab" href="#all">
                  All
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#snack">
                  Snack &amp; Spices
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#fruit">
                  Fruits
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#veg">
                  Vegetables
                </a>
              </li>
            </ul>
          </div>
          {/* Tab End */}
        </div>
        {/* New Product */}
        <div className="row m-b-minus-24px">
          <div className="col">
            <div className="tab-content">
              {/* 1st Product tab start */}
              <div className="tab-pane fade show active product-block" id="all">
                <div className="row">
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/3_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/3_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="sale">Sale</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Dried Fruits</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Californian Almonds Value 250g + 50g Pack
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$58.00</span>
                              <span className="old-price">$65.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/2_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/2_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="sale">Sale</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Dried Fruits</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Dates Value Pouch Dates Value Pouch
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$78.00</span>
                              <span className="old-price">$85.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/25_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/25_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="new">New</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Fresh fruit</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Fresh Lichi 500g pack
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <span className="qty">500 g</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$25.00</span>
                              <span className="old-price">$35.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/8_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/8_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Snacks</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Smoked Honey Spiced Nuts Almonds Pack
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$32.00</span>
                              <span className="old-price">$45.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/4_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/4_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="new">New</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Foods</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Banana Chips Snack crunchy &amp; spicy wafer
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$45.00</span>
                              <span className="old-price">$50.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/7_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/7_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Foods</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Mixed Nuts &amp; Almonds Dry Fruits 500g pack
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$49.00</span>
                              <span className="old-price">$65.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label nonveg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/9_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/9_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Foods</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Roasted Almonds, Pumpkin Snacks
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$49.00</span>
                              <span className="old-price">$65.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label nonveg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/19_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/19_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Eggs</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Farm Eggs - Brown
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">3 pcs</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$3.00</span>
                              <span className="old-price">$5.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/5_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/5_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="new">New</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Snacks</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              carrot &amp; broccoli soup Mix 250g pack
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$25.00</span>
                              <span className="old-price">$35.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box d-n-1199">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/17_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/17_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Tuber root</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Ginger - Organic
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">100 g</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$2.00</span>
                              <span className="old-price">$3.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 1st Product tab end */}
              {/* 2nd Product tab start */}
              <div className="tab-pane fade" id="snack">
                <div className="row">
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/1_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/1_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">chips &amp; fries</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Crunchy Triangle Chips Snacks
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$59.00</span>
                              <span className="old-price">$87.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/2_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/2_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="sale">Sale</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Dried Fruits</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Dates Value Pack Pouch
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$78.00</span>
                              <span className="old-price">$85.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/3_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/3_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="sale">Sale</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Dried Fruits</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Californian Almonds Value Pack
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$58.00</span>
                              <span className="old-price">$65.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/4_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/4_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="new">New</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Foods</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Banana Chips Snacks &amp; Spices
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$45.00</span>
                              <span className="old-price">$50.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/5_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/5_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="new">New</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Snacks</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Berry &amp; Graps Mix Snack
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$25.00</span>
                              <span className="old-price">$35.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/6_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/6_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="sale">Sale</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Dried Fruits</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Mixed Nuts Seeds &amp; Berries Pack
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$45.00</span>
                              <span className="old-price">$56.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/7_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/7_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Foods</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Mixed Nuts &amp; Almonds Dry Fruits
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$49.00</span>
                              <span className="old-price">$65.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/8_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/8_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Snacks</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Smoked Honey Spiced Nuts
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$32.00</span>
                              <span className="old-price">$45.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label nonveg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/9_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/9_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Foods</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Roasted Almonds, Pumpkin Snacks
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$49.00</span>
                              <span className="old-price">$65.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box d-n-1199">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/10_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/10_2.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Foods</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Healthy Nutmix, 200g Pack
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star sill" />
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$28.00</span>
                              <span className="old-price">$30.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 2nd Product tab end */}
              {/* 3rd Product tab start */}
              <div className="tab-pane fade" id="fruit">
                <div className="row">
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/21_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/21_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Fresh Fruits</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">Apple</a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <span className="qty">5 pcs</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$10.00</span>
                              <span className="old-price">$12.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/22_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/22_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="sale">Sale</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Fresh Fruit</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Kamalam Fruit
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">3 pcs</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$15.00</span>
                              <span className="old-price">$17.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/23_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/23_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="sale">Sale</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Fresh Fruits</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">Blue berry</a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">500 g</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$11.00</span>
                              <span className="old-price">$12.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/24_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/24_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="new">New</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Fresh Fruit</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">Cherry</a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">1 kg</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$20.00</span>
                              <span className="old-price">$21.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/25_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/25_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="new">New</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Fresh fruit</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">Lichi</a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <span className="qty">500 g</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$25.00</span>
                              <span className="old-price">$35.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/26_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/26_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="sale">Sale</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Fresh fruit</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">Star fruit</a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <span className="qty">1 kg</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$5.00</span>
                              <span className="old-price">$6.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/27_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/27_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Fresh fruits</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">Guava</a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">2 kg</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$10.00</span>
                              <span className="old-price">$12.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/28_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/28_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Snacks</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Mango - Kesar
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <span className="qty">20 kg</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$50.00</span>
                              <span className="old-price">$55.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/29_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/29_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">fresh fruit</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">Pineapple</a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">1 psc</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$15.00</span>
                              <span className="old-price">$16.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box d-n-1199">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/30_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/30_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Fresh fruit</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">banana</a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star sill" />
                              <span className="qty">12 psc</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$9.00</span>
                              <span className="old-price">$10.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 3rd Product tab end */}
              {/* 4th Product tab start */}
              <div className="tab-pane fade" id="veg">
                <div className="row">
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/11_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/11_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Vegetables</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Tomato - Hybrid
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <span className="qty">1 kg</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$5.00</span>
                              <span className="old-price">$7.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/12_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/12_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="sale">Sale</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Tuber root</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">Potato</a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">5 kg</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$15.00</span>
                              <span className="old-price">$17.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/13_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/13_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="sale">Sale</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Tuber root</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Onion - Hybrid
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">10 kg</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$25.00</span>
                              <span className="old-price">$30.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/14_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/14_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="new">New</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Vegetables</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Coriander Bunch
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">250 g</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$5.00</span>
                              <span className="old-price">$7.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/15_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/15_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="new">New</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Vegetables</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Capsicum - Red
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <span className="qty">3 pcs</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$2.00</span>
                              <span className="old-price">$3.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/16_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/16_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <span className="flags">
                              <span className="sale">Sale</span>
                            </span>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Vegetables</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">Sweet Corn</a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <span className="qty">2 pcs</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$6.00</span>
                              <span className="old-price">$8.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/17_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/17_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Tuber root</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Ginger - Organic
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">100 g</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$2.00</span>
                              <span className="old-price">$3.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/18_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/18_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Vegetables</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Lemon - Seedless
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <span className="qty">1 kg</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$8.00</span>
                              <span className="old-price">$9.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label nonveg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/19_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/19_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Eggs</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Farm Eggs - Brown
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <i className="gicon gi-star" />
                              <span className="qty">3 pcs</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$3.00</span>
                              <span className="old-price">$5.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 col-xs-6 gi-col-5 gi-product-box d-n-1199">
                    <div className="gi-product-content">
                      <div className="gi-product-inner">
                        <div className="gi-pro-image-outer">
                          <div className="gi-pro-image">
                            <a
                              href="product-left-sidebar.html"
                              className="image"
                            >
                              <span className="label veg">
                                <span className="dot" />
                              </span>
                              <img
                                className="main-image"
                                src="/assets/images/20_1.jpg"
                                alt="Product"
                              />
                              <img
                                className="hover-image"
                                src="/assets/images/20_1.jpg"
                                alt="Product"
                              />
                            </a>
                            <div className="gi-pro-actions">
                              <a
                                className="gi-btn-group wishlist"
                                title="Wishlist"
                              >
                                <i className="fi-rr-heart" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group quickview"
                                data-link-action="quickview"
                                title="Quick view"
                                data-bs-toggle="modal"
                                data-bs-target="#gi_quickview_modal"
                              >
                                <i className="fi-rr-eye" />
                              </a>
                              <a
                                href="#"
                                className="gi-btn-group compare"
                                title="Compare"
                              >
                                <i className="fi fi-rr-arrows-repeat" />
                              </a>
                              <a
                                href="#"
                                title="Add To Cart"
                                className="gi-btn-group add-to-cart"
                              >
                                <i className="fi-rr-shopping-basket" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="gi-pro-content">
                          <a href="shop-left-sidebar-col-3.html">
                            <h6 className="gi-pro-stitle">Vegetables</h6>
                          </a>
                          <h5 className="gi-pro-title">
                            <a href="product-left-sidebar.html">
                              Organic fresh Broccoli
                            </a>
                          </h5>
                          <div className="gi-pro-rat-price">
                            <span className="gi-pro-rating">
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star fill" />
                              <i className="gicon gi-star sill" />
                              <span className="qty">1 kg</span>
                            </span>
                            <span className="gi-price">
                              <span className="new-price">$10.00</span>
                              <span className="old-price">$11.00</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 4th Product tab end */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewProducts;
