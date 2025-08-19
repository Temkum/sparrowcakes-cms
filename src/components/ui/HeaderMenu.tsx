import {
  ChevronDown,
  LayoutGrid,
  MapPin,
  MapPinPlusInside,
} from 'lucide-react';
import '../../styles/HeaderMenu.scss';
import { locations } from '../../utils/constants';
import { ILocation, IMenuItem } from '@/types';
import { mainMenu } from '../../utils/constants';
import { Link } from 'react-router-dom';

const HeaderMenu = () => {
  return (
    <div className="gi-header-cat d-none d-lg-block">
      <div className="container position-relative">
        <div className="gi-nav-bar">
          {/* Category Toggle */}
          <div className="gi-category-icon-block">
            <div className="gi-category-menu">
              <div className="gi-category-toggle">
                <LayoutGrid size={20} strokeWidth={1.5} color="white" />
                <span className="text">All Categories</span>
                <ChevronDown size={20} strokeWidth={1.5} className="gi-angle" />
              </div>
            </div>
            <div className="gi-cat-dropdown">
              <div className="gi-cat-block">
                <div className="gi-cat-tab">
                  <div
                    className="gi-tab-list nav flex-column nav-pills me-3"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <button
                      className="nav-link active"
                      id="v-pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-home"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-home"
                      aria-selected="true"
                    >
                      <i className="fi-rr-cupcake"></i>Dairy &amp; Bakery
                    </button>
                    <button
                      className="nav-link"
                      id="v-pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-profile"
                      aria-selected="false"
                    >
                      <i className="fi fi-rs-apple-whole"></i>Fruits &amp;
                      Vegetable
                    </button>
                    <button
                      className="nav-link"
                      id="v-pills-messages-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-messages"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-messages"
                      aria-selected="false"
                    >
                      <i className="fi fi-rr-popcorn"></i>Snack &amp; Spice
                    </button>
                    <button
                      className="nav-link"
                      id="v-pills-settings-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-settings"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-settings"
                      aria-selected="false"
                    >
                      <i className="fi fi-rr-drink-alt"></i>Juice &amp; Drinks{' '}
                    </button>
                  </div>
                  <div className="tab-content" id="v-pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="v-pills-home"
                      role="tabpanel"
                      aria-labelledby="v-pills-home-tab"
                    >
                      <div className="tab-list row">
                        <div className="col">
                          <h6 className="gi-col-title">Dairy</h6>
                          <ul className="cat-list">
                            <li>
                              <a href="shop-left-sidebar-col-3.html">Milk</a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Ice cream
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">Cheese</a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Frozen custard
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Frozen yogurt
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="col">
                          <h6 className="gi-col-title">Bakery</h6>
                          <ul className="cat-list">
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Cake and Pastry
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Rusk Toast
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Bread &amp; Buns
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Chocolate Brownie
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Cream Roll
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="v-pills-profile"
                      role="tabpanel"
                      aria-labelledby="v-pills-profile-tab"
                    >
                      <div className="tab-list row">
                        <div className="col">
                          <h6 className="gi-col-title">Fruits</h6>
                          <ul className="cat-list">
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Cauliflower
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Bell Peppers
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Broccoli
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">Cabbage</a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">Tomato</a>
                            </li>
                          </ul>
                        </div>
                        <div className="col">
                          <h6 className="gi-col-title">Vegetable</h6>
                          <ul className="cat-list">
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Cauliflower
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Bell Peppers
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Broccoli
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">Cabbage</a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">Tomato</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="v-pills-messages"
                      role="tabpanel"
                      aria-labelledby="v-pills-messages-tab"
                    >
                      <div className="tab-list row">
                        <div className="col">
                          <h6 className="gi-col-title">Snacks</h6>
                          <ul className="cat-list">
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                French fries
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                potato chips
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Biscuits &amp; Cookies
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">Popcorn</a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Rice Cakes
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="col">
                          <h6 className="gi-col-title">Spice</h6>
                          <ul className="cat-list">
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Cinnamon Powder
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Cumin Powder
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Fenugreek Powder
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Pepper Powder
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Long Pepper
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="v-pills-settings"
                      role="tabpanel"
                      aria-labelledby="v-pills-settings-tab"
                    >
                      <div className="tab-list row">
                        <div className="col">
                          <h6 className="gi-col-title">Juice</h6>
                          <ul className="cat-list">
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Mango Juice
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Coconut Water
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Tetra Pack
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Apple Juices
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Lychee Juice
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="col">
                          <h6 className="gi-col-title">soft drink</h6>
                          <ul className="cat-list">
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Breizh Cola
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Green Cola
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Jolt Cola
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Mecca Cola
                              </a>
                            </li>
                            <li>
                              <a href="shop-left-sidebar-col-3.html">
                                Topsia Cola
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Menu Start */}
          <div id="gi-main-menu-desk" className="d-none d-lg-block sticky-nav">
            <div className="nav-desk">
              <div className="row">
                <div className="col-md-12 align-self-center">
                  <div className="gi-main-menu">
                    <ul>
                      {mainMenu.map((item: IMenuItem, index: number) => (
                        <li className="dropdown drop-list" key={index}>
                          <Link to={item.link} className="dropdown-arrow">
                            {item.title}
                            {item.title === 'Home' ? (
                              ''
                            ) : (
                              <ChevronDown size={20} strokeWidth={1.3} />
                            )}
                          </Link>
                          {item.subMenu && item.subMenu.length > 0 && (
                            <ul className="sub-menu">
                              {item.subMenu.map((menu) => (
                                <li key={menu.text}>
                                  <a href={menu.link}>{menu.text}</a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Main Menu End */}

          <div className="gi-location-block">
            <div className="gi-location-menu">
              <div className="gi-location-toggle">
                <i className="fi fi-rr-marker location"></i>
                <MapPin
                  size={20}
                  strokeWidth={1.5}
                  className="location"
                  color="white"
                />
                <span className="gi-location-title d-1199 gi-location">
                  Yaounde
                </span>
                <ChevronDown
                  size={20}
                  strokeWidth={1.5}
                  className="location"
                  color="white"
                />
              </div>
              <div className="gi-location-content">
                <div className="gi-location-dropdown">
                  <div className="row gi-location-wrapper">
                    <ul className="loc-grid">
                      {locations.map((item: ILocation, index: number) => (
                        <li className="loc-list" key={index}>
                          <MapPinPlusInside size={15} strokeWidth={1.5} />
                          <span className="gi-detail ml-10">{item.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMenu;
