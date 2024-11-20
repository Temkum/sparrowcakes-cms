const Sidebar = () => {
  return (
    <>
      <div className="filter-sidebar-overlay" />
      <div className="gi-shop-sidebar gi-filter-sidebar col-lg-3 col-md-12">
        <div className="sidebar-filter-title">
          <h5>Filters</h5>
          <a className="filter-close" href="#">
            ×
          </a>
        </div>
        <div id="shop_sidebar">
          <div className="gi-sidebar-wrap">
            {/* Sidebar Category Block */}
            <div className="gi-sidebar-block drop">
              <div className="gi-sb-title">
                <h3 className="gi-sidebar-title">Category</h3>
              </div>
              <div className="gi-sb-block-content p-t-15">
                <ul>
                  <li>
                    <a href="#" className="gi-sidebar-block-item main drop">
                      clothes
                    </a>
                    <ul style={{ display: 'block' }}>
                      <li>
                        <div className="gi-sidebar-sub-item">
                          <a href="#">
                            Men
                            <span>-25</span>
                          </a>
                        </div>
                      </li>
                      <li>
                        <div className="gi-sidebar-sub-item">
                          <a href="#">
                            Women
                            <span>-52</span>
                          </a>
                        </div>
                      </li>
                      <li>
                        <div className="gi-sidebar-sub-item">
                          <a href="#">
                            Boy
                            <span>-40</span>
                          </a>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="gi-sb-block-content">
                <ul>
                  <li>
                    <a href="#" className="gi-sidebar-block-item main drop">
                      cosmetics
                    </a>
                    <ul>
                      <li>
                        <div className="gi-sidebar-sub-item">
                          <a href="shop-left-sidebar-col-3.html">
                            Men
                            <span>-25</span>
                          </a>
                        </div>
                      </li>
                      <li>
                        <div className="gi-sidebar-sub-item">
                          <a href="shop-left-sidebar-col-3.html">
                            Women
                            <span>-52</span>
                          </a>
                        </div>
                      </li>
                      <li>
                        <div className="gi-sidebar-sub-item">
                          <a href="shop-left-sidebar-col-3.html">
                            Boy
                            <span>-40</span>
                          </a>
                        </div>
                      </li>
                      <li>
                        <div className="gi-sidebar-sub-item">
                          <a href="shop-left-sidebar-col-3.html">
                            Girl
                            <span>-35</span>
                          </a>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="gi-sb-block-content">
                <ul>
                  <li>
                    <a
                      href="shop-left-sidebar-col-3.html"
                      className="gi-sidebar-block-item main"
                    >
                      shoes<span>-15</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="gi-sb-block-content">
                <ul>
                  <li>
                    <a
                      href="shop-left-sidebar-col-3.html"
                      className="gi-sidebar-block-item main"
                    >
                      bag<span>-27</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="gi-sb-block-content">
                <ul>
                  <li>
                    <a href="#" className="gi-sidebar-block-item main drop">
                      electronics
                    </a>
                    <ul>
                      <li>
                        <div className="gi-sidebar-sub-item">
                          <a href="shop-left-sidebar-col-3.html">
                            Men
                            <span>-25</span>
                          </a>
                        </div>
                      </li>
                      <li>
                        <div className="gi-sidebar-sub-item">
                          <a href="shop-left-sidebar-col-3.html">
                            Women
                            <span>-52</span>
                          </a>
                        </div>
                      </li>
                      <li>
                        <div className="gi-sidebar-sub-item">
                          <a href="shop-left-sidebar-col-3.html">
                            Boy
                            <span>-40</span>
                          </a>
                        </div>
                      </li>
                      <li>
                        <div className="gi-sidebar-sub-item">
                          <a href="shop-left-sidebar-col-3.html">
                            Girl
                            <span>-35</span>
                          </a>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            {/* Sidebar Brand Block */}
            <div className="gi-sidebar-block">
              <div className="gi-sb-title">
                <h3 className="gi-sidebar-title">Brand</h3>
              </div>
              <div className="gi-sb-block-content">
                <ul>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" defaultChecked />
                      <a href="#">
                        <span>
                          <i className="fi-rr-cupcake" />
                          Zencart Dairy
                        </span>
                      </a>
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <a href="#">
                        <span>
                          <i className="fi fi-rs-apple-whole" />
                          Xeta Fruits
                        </span>
                      </a>
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <a href="#">
                        <span>
                          <i className="fi fi-rr-popcorn" />
                          Pili Snack
                        </span>
                      </a>
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <a href="#">
                        <span>
                          <i className="fi fi-rr-drink-alt" />
                          Indiana Juice
                        </span>
                      </a>
                      <span className="checked" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {/* Sidebar Weight Block */}
            <div className="gi-sidebar-block">
              <div className="gi-sb-title">
                <h3 className="gi-sidebar-title">Weight</h3>
              </div>
              <div className="gi-sb-block-content">
                <ul>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" defaultChecked />
                      <a href="#">500gm Pack</a>
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <a href="#">1kg Pack</a>
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <a href="#">2kg Pack</a>
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <a href="#">5kg Pack</a>
                      <span className="checked" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {/* Sidebar Color item */}
            <div className="gi-sidebar-block color-block gi-sidebar-block-clr">
              <div className="gi-sb-title">
                <h3 className="gi-sidebar-title">Color</h3>
              </div>
              <div className="gi-sb-block-content">
                <ul>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#c4d6f9' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#ff748b' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#000000' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li className="active">
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#2bff4a' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#ff7c5e' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#f155ff' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#ffef00' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#c89fff' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#7bfffa' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#56ffc1' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#ffdb9f' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#9f9f9f' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                  <li>
                    <div className="gi-sidebar-block-item">
                      <input type="checkbox" />
                      <span
                        className="gi-clr-block"
                        style={{ backgroundColor: '#6556ff' }}
                      />
                      <span className="checked" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {/* Sidebar Price Block */}
            <div className="gi-sidebar-block">
              <div className="gi-sb-title">
                <h3 className="gi-sidebar-title">Price</h3>
              </div>
              <div className="gi-sb-block-content gi-price-range-slider es-price-slider">
                <div className="gi-price-filter">
                  <div className="gi-price-input">
                    <label className="filter__label">
                      From
                      <input type="text" className="filter__input" />
                    </label>
                    <span className="gi-price-divider" />
                    <label className="filter__label">
                      To
                      <input type="text" className="filter__input" />
                    </label>
                  </div>
                  <div
                    id="gi-sliderPrice"
                    className="filter__slider-price"
                    data-min={0}
                    data-max={250}
                    data-step={10}
                  />
                </div>
              </div>
            </div>
            {/* Sidebar tags */}
            <div className="gi-sidebar-block">
              <div className="gi-sb-title">
                <h3 className="gi-sidebar-title">Tags</h3>
              </div>
              <div className="gi-tag-block gi-sb-block-content">
                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2">
                  Clothes
                </a>
                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2">
                  Fruits
                </a>
                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2">
                  Snacks
                </a>
                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2">
                  Dairy
                </a>
                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2">
                  Seafood
                </a>
                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2">
                  Fastfood
                </a>
                <a href="shop-left-sidebar-col-3.html" className="gi-btn-2">
                  Toys
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
