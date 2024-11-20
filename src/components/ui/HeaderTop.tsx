import { HeaderTopProps } from '@/types';
import { Badge } from '@mui/material';
import {
  ChevronDown,
  Heart,
  Menu,
  MessageCircleMore,
  PhoneCall,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HeaderTop = ({ toggleSidebar }: HeaderTopProps) => {
  return (
    <>
      <div className="header-top">
        <div className="container">
          <div className="row align-itegi-center">
            <div className="col text-left header-top-left d-lg-block">
              <div className="header-top-social">
                <ul className="mb-0">
                  <li className="list-inline-item">
                    <Link to="#">
                      <PhoneCall strokeWidth={1.25} color="#777" />
                    </Link>
                    +237 675 827 455
                  </li>
                  <li className="list-inline-item">
                    <Link to="#">
                      <MessageCircleMore
                        strokeWidth={1.25}
                        color="#777"
                        size={18}
                      />
                    </Link>
                    +237 675 827 455
                  </li>
                </ul>
              </div>
            </div>
            <div className="col text-center header-top-center">
              <div className="header-top-message">
                World's Fastest Online Shopping Destination
              </div>
            </div>
            <div className="col header-top-right d-none d-lg-block">
              <div className="header-top-right-inner d-flex justify-content-end">
                <Link className="gi-help" to="faq.html">
                  Help?
                </Link>
                <Link className="gi-help" to="track-order.html">
                  Track Order?
                </Link>
                {/* Language Start */}
                <div className="header-top-lan-curr header-top-lan dropdown">
                  <button className="dropdown-toggle" data-bs-toggle="dropdown">
                    English
                    <ChevronDown strokeWidth={1.25} color="#777" />
                  </button>
                  <ul className="dropdown-menu">
                    <li className="active">
                      <Link className="dropdown-item" to="#">
                        English
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="#">
                        French
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="header-top-lan-curr header-top-curr dropdown">
                  <button className="dropdown-toggle" data-bs-toggle="dropdown">
                    Dollar
                    <ChevronDown strokeWidth={1.25} color="#777" />
                  </button>
                  <ul className="dropdown-menu">
                    <li className="active">
                      <Link className="dropdown-item" to="#">
                        USD $
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="#">
                        EUR €
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* responsive menu */}
            <div className="col header-top-res d-lg-none">
              <div className="gi-header-buttons">
                <div className="right-icons">
                  <Link to="login" className="gi-header-btn gi-header-user">
                    <div className="header-icon">
                      <UserRound strokeWidth={1.25} />
                    </div>
                  </Link>
                  <Link
                    to="wishlist.html"
                    className="gi-header-btn gi-wish-toggle"
                  >
                    <div className="header-icon">
                      <Badge badgeContent={4} color="error">
                        <Heart strokeWidth={1.5} color="#0d0d0d" />
                      </Badge>
                    </div>
                  </Link>
                  <Link to="#" className="gi-header-btn gi-cart-toggle">
                    <div className="header-icon">
                      <Badge badgeContent={4} color="error">
                        <ShoppingBag strokeWidth={1.25} />
                      </Badge>
                    </div>
                  </Link>
                  <span
                    className="gi-header-btn gi-site-menu-icon d-lg-none"
                    onClick={toggleSidebar}
                  >
                    <Menu strokeWidth={1.25} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderTop;
