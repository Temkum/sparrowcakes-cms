import FooterRight from './ui/FooterRight';
import FooterCopyRight from './ui/FooterCopyRight';
import FooterSocial from './ui/FooterSocial';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="gi-footer m-t-40">
      <div className="footer-container">
        <div className="footer-top padding-tb-80">
          <div className="container">
            <div className="row m-minus-991">
              <div className="col-sm-12 col-lg-3 gi-footer-cat wow fadeInUp">
                <div className="gi-footer-widget gi-footer-company">
                  <img
                    src="/assets/images/sparrowcakes-logo.png"
                    className="gi-footer-logo"
                    alt="footer logo"
                  />
                  <p className="gi-footer-detail">
                    Cakes by Sparrow is the biggest market of pastry products.
                    Get your daily needs from our store.
                  </p>
                  <div className="gi-app-store">
                    <a href="#" className="app-img">
                      <img
                        src="/assets/images/android.png"
                        className="adroid"
                        alt="apple"
                      />
                    </a>
                    <a href="#" className="app-img">
                      <img
                        src="/assets/images/apple.png"
                        className="apple"
                        alt="apple"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="col-sm-12 col-lg-2 gi-footer-info wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <div className="gi-footer-widget">
                  <h4 className="gi-footer-heading">Category</h4>
                  <div className="gi-footer-links gi-footer-dropdown">
                    <ul className="align-itegi-center">
                      <li className="gi-footer-link">
                        <a href="shop-left-sidebar-col-3.html">
                          Dairy &amp; Milk
                        </a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="shop-banner-left-sidebar-col-3.html">
                          Snack &amp; Spice
                        </a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="shop-full-width-col-5.html">Fast Food</a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="shop-list-left-sidebar.html">
                          Juice &amp; Drinks
                        </a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="shop-list-full-col-2.html">Bakery</a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="shop-banner-right-sidebar-col-4.html">
                          Seafood
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="col-sm-12 col-lg-2 gi-footer-account wow fadeInUp"
                data-wow-delay="0.3s"
              >
                <div className="gi-footer-widget">
                  <h4 className="gi-footer-heading">Company</h4>
                  <div className="gi-footer-links gi-footer-dropdown">
                    <ul className="align-itegi-center">
                      <li className="gi-footer-link">
                        <a href="about-us.html">About us</a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="track-order.html">Delivery</a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="privacy-policy.html">Legal Notice</a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="terms-condition.html">
                          Terms &amp; conditions
                        </a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="checkout.html">Secure payment</a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="contact-us.html">Contact us</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="col-sm-12 col-lg-2 gi-footer-service wow fadeInUp"
                data-wow-delay="0.4s"
              >
                <div className="gi-footer-widget">
                  <h4 className="gi-footer-heading">Account</h4>
                  <div className="gi-footer-links gi-footer-dropdown">
                    <ul className="align-itegi-center">
                      <li className="gi-footer-link">
                        <a href="register.html">Sign In</a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="cart.html">View Cart</a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="privacy-policy.html">Return Policy</a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="#">Become a Vendor</a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="#">Affiliate Program</a>
                      </li>
                      <li className="gi-footer-link">
                        <a href="checkout.html">Payments</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="col-sm-12 col-lg-3 gi-footer-cont-social wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <div className="gi-footer-contact">
                  <div className="gi-footer-widget">
                    <h4 className="gi-footer-heading">Contact</h4>
                    <div className="gi-footer-links gi-footer-dropdown">
                      <ul className="align-itegi-center">
                        <li className="gi-footer-link gi-foo-location">
                          <span>
                            <MapPin
                              color="#5caf90"
                              size={1.5}
                              strokeWidth={1.4}
                              className="fi svg_img foo_svg"
                            />
                          </span>
                          <p className="ml-2">Buea, South West Region</p>
                        </li>
                        <li className="gi-footer-link gi-foo-call">
                          <span>
                            <Phone
                              color="#5caf90"
                              className="svg_img foo_svg"
                            />
                          </span>
                          <a href="tel: +00237 9876543210">+237 654 321 987</a>
                        </li>
                        <li className="gi-footer-link gi-foo-mail">
                          <span>
                            <Mail color="#5caf90" className="svg_img foo_svg" />
                          </span>
                          <a href="mailto:example@email.com">
                            nkoekeesther@gmail.com
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* footer social */}
                <FooterSocial />
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="gi-bottom-info">
                {/* Footer Copyright Start */}
                <FooterCopyRight />
                {/* Footer payment */}
                <FooterRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
