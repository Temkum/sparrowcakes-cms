import { Badge } from '@mui/material';
import { Heart, Search, ShoppingBag, UserRound } from 'lucide-react';
import '../../styles/Header.scss';
import { Link } from 'react-router-dom';

const HeaderBottom = () => {
  return (
    <div className="gi-header-bottom d-lg-block">
      <div className="container position-relative">
        <div className="row">
          <div className="gi-flex">
            {/* Header Logo Start */}
            <div className="align-self-center gi-header-logo">
              <div className="header-logo">
                <Link to="/">
                  <img
                    src="/assets/images/sparrowcakes-logo.png"
                    alt="Site Logo"
                    className="logo-img"
                  />
                </Link>
              </div>
            </div>
            {/* Header Logo End */}
            {/* Header Search Start */}
            <div className="align-self-center gi-header-search">
              <div className="header-search">
                <form className="gi-search-group-form" action="#">
                  <input
                    className="form-control gi-search-bar"
                    placeholder="Search Products..."
                    type="text"
                  />
                  <button className="search_submit" type="submit">
                    <Search strokeWidth={1.25} color="#777" />
                  </button>
                </form>
              </div>
            </div>
            {/* Header Search End */}
            {/* Header Button Start */}
            <div className="gi-header-action align-self-center">
              <div className="gi-header-buttons">
                {/* Header User Start */}
                <div className="gi-acc-drop">
                  <a
                    href=""
                    className="gi-header-btn gi-header-user dropdown-toggle gi-user-toggle"
                    title="Account"
                  >
                    <div className="header-icon">
                      <UserRound strokeWidth={1.5} color="#0d0d0d" />
                    </div>
                    <div className="gi-btn-desc">
                      {/* <span className="gi-btn-title">Account</span> */}
                      <span className="gi-btn-stitle"></span>
                    </div>
                  </a>
                  <ul className="gi-dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/register">
                        Register
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/login">
                        Login
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* Header User End */}
                {/* Header wishlist Start */}
                <a
                  href="wishlist.html"
                  className="gi-header-btn gi-wish-toggle"
                  title="Wishlist"
                >
                  <div className="header-icon">
                    <Badge badgeContent={4} color="error">
                      <Heart strokeWidth={1.5} color="#0d0d0d" />
                      {/* <MailIcon color="action" /> */}
                    </Badge>
                  </div>
                  <div className="gi-btn-desc">
                    <span className="gi-btn-stitle">Wishlist</span>
                  </div>
                </a>
                {/* Header wishlist End */}
                {/* Header Cart Start */}
                <a
                  href=""
                  className="gi-header-btn gi-cart-toggle"
                  title="Cart"
                >
                  <div className="header-icon">
                    <ShoppingBag strokeWidth={1.5} color="#0d0d0d" />
                    <span className="main-label-note-new"></span>
                  </div>
                  <div className="gi-btn-desc">
                    <span className="gi-btn-stitle">Cart</span>
                  </div>
                </a>
                {/* Header Cart End */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
