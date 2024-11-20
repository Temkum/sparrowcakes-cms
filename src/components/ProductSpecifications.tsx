const ProductSpecifications = () => {
  return (
    <>
      <div className="gi-single-pro-tab">
        <div className="gi-single-pro-tab-wrapper">
          <div className="gi-single-pro-tab-nav">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="details-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#gi-spt-nav-details"
                  type="button"
                  role="tab"
                  aria-controls="gi-spt-nav-details"
                  aria-selected="true"
                >
                  Detail
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="info-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#gi-spt-nav-info"
                  type="button"
                  role="tab"
                  aria-controls="gi-spt-nav-info"
                  aria-selected="false"
                >
                  Specifications
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="vendor-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#gi-spt-nav-vendor"
                  type="button"
                  role="tab"
                  aria-controls="gi-spt-nav-vendor"
                  aria-selected="false"
                >
                  Vendor
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="review-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#gi-spt-nav-review"
                  type="button"
                  role="tab"
                  aria-controls="gi-spt-nav-review"
                  aria-selected="false"
                >
                  Reviews
                </button>
              </li>
            </ul>
          </div>
          <div className="tab-content  gi-single-pro-tab-content">
            <div id="gi-spt-nav-details" className="tab-pane fade show active">
              <div className="gi-single-pro-tab-desc">
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged.
                </p>
                <ul>
                  <li>
                    Any Product types that You want - Simple, Configurable
                  </li>
                  <li>Downloadable/Digital Products, Virtual Products</li>
                  <li>Inventory Management with Backordered items</li>
                  <li>Flatlock seams throughout.</li>
                </ul>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged.
                </p>
                <p>
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don't look
                  even slightly believable. If you are going to use a passage of
                  Lorem Ipsum, you need to be sure there isn't anything
                  embarrassing hidden in the middle of text. All the Lorem Ipsum
                  generators on the Internet tend to repeat predefined chunks as
                  necessary, making this the first true generator on the
                  Internet. It uses a dictionary of over 200 Latin words,
                  combined with a handful of model sentence structures, to
                  generate Lorem Ipsum which looks reasonable. The generated
                  Lorem Ipsum is therefore always free from repetition, injected
                  humour, or non-characteristic words etc.
                </p>
              </div>
            </div>
            <div id="gi-spt-nav-info" className="tab-pane fade">
              <div className="gi-single-pro-tab-moreinfo">
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries.
                </p>
                <ul>
                  <li>
                    <span>Model</span> SKU140
                  </li>
                  <li>
                    <span>Weight</span> 500 g
                  </li>
                  <li>
                    <span>Dimensions</span> 35 × 30 × 7 cm
                  </li>
                  <li>
                    <span>Color</span> Black, Pink, Red, White
                  </li>
                  <li>
                    <span>Size</span> 10 X 20
                  </li>
                </ul>
              </div>
            </div>
            <div id="gi-spt-nav-vendor" className="tab-pane fade">
              <div className="gi-single-pro-tab-moreinfo">
                <div className="gi-product-vendor">
                  <div className="gi-vendor-info">
                    <span>
                      <img src="assets/img/vendor/3.jpg" alt="vendor" />
                    </span>
                    <div>
                      <h5>Ocean Crate</h5>
                      <p>Products : 358</p>
                      <p>Sales : 5587</p>
                    </div>
                  </div>
                  <div className="gi-detail">
                    <ul>
                      <li>
                        <span>Phone No. :</span> +00 987654321
                      </li>
                      <li>
                        <span>Email. :</span> Example@gmail.com
                      </li>
                      <li>
                        <span>Address. :</span> 2548 Broaddus Maple Court,
                        Madisonville KY 4783, USA.
                      </li>
                    </ul>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div id="gi-spt-nav-review" className="tab-pane fade">
              <div className="row">
                <div className="gi-t-review-wrapper">
                  <div className="gi-t-review-item">
                    <div className="gi-t-review-avtar">
                      <img src="assets/img/user/1.jpg" alt="user" />
                    </div>
                    <div className="gi-t-review-content">
                      <div className="gi-t-review-top">
                        <div className="gi-t-review-name">Mariya Lykra</div>
                        <div className="gi-t-review-rating">
                          <i className="gicon gi-star fill" />
                          <i className="gicon gi-star fill" />
                          <i className="gicon gi-star fill" />
                          <i className="gicon gi-star fill" />
                          <i className="gicon gi-star-o" />
                        </div>
                      </div>
                      <div className="gi-t-review-bottom">
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                          when an unknown printer took a galley of type and
                          scrambled it to make a type specimen.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="gi-t-review-item">
                    <div className="gi-t-review-avtar">
                      <img src="assets/img/user/2.jpg" alt="user" />
                    </div>
                    <div className="gi-t-review-content">
                      <div className="gi-t-review-top">
                        <div className="gi-t-review-name">Moris Willson</div>
                        <div className="gi-t-review-rating">
                          <i className="gicon gi-star fill" />
                          <i className="gicon gi-star fill" />
                          <i className="gicon gi-star fill" />
                          <i className="gicon gi-star-o" />
                          <i className="gicon gi-star-o" />
                        </div>
                      </div>
                      <div className="gi-t-review-bottom">
                        <p>
                          Lorem Ipsum has been the industry's standard dummy
                          text ever since the 1500s, when an unknown printer
                          took a galley of type and scrambled it to make a type
                          specimen.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="gi-ratting-content">
                  <h3>Add a Review</h3>
                  <div className="gi-ratting-form">
                    <form action="#">
                      <div className="gi-ratting-star">
                        <span>Your rating:</span>
                        <div className="gi-t-review-rating">
                          <i className="gicon gi-star fill" />
                          <i className="gicon gi-star fill" />
                          <i className="gicon gi-star-o" />
                          <i className="gicon gi-star-o" />
                          <i className="gicon gi-star-o" />
                        </div>
                      </div>
                      <div className="gi-ratting-input">
                        <input
                          name="your-name"
                          placeholder="Name"
                          type="text"
                        />
                      </div>
                      <div className="gi-ratting-input">
                        <input
                          name="your-email"
                          placeholder="Email*"
                          type="email"
                          required
                        />
                      </div>
                      <div className="gi-ratting-input form-submit">
                        <textarea
                          name="your-commemt"
                          placeholder="Enter Your Comment"
                          defaultValue={''}
                        />
                        <button
                          className="gi-btn-2"
                          type="submit"
                          value="Submit"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSpecifications;
