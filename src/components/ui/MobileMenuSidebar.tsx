import { IMenuItem, ISubMenu, MobileMenuSidebarProps } from '@/types';
import { mainMenu } from '@/utils/constants';
import { Facebook, Instagram, MessageCircleMore, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileMenuSidebar = ({
  isSidebarOpen,
  toggleSidebar,
}: MobileMenuSidebarProps) => {
  return (
    <>
      <div
        className="gi-mobile-menu-overlay"
        onClick={toggleSidebar}
        style={{ display: isSidebarOpen ? 'block' : 'none' }}
      ></div>
      <div
        id="gi-mobile-menu"
        className={`gi-mobile-menu ${isSidebarOpen ? 'gi-menu-open' : ''}`}
      >
        <div className="gi-menu-title">
          <span className="menu_title">Cakes by Sparrow</span>
          <button className="gi-close-menu" onClick={toggleSidebar}>
            <X />
          </button>
        </div>
        <div className="gi-menu-inner">
          <div className="gi-menu-content">
            <ul>
              {mainMenu.map((item: IMenuItem, index: number) => (
                <li key={index} className="dropdown drop-list">
                  <Link to="/">{item.title}</Link>
                  <ul className="sub-menu">
                    {item.subMenu?.map((subItem: ISubMenu, index: number) => (
                      <li key={index}>
                        <Link to={subItem.link}>{subItem.text}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className="header-res-lan-curr">
            <div className="header-res-social">
              <div className="header-top-social">
                <ul className="mb-0">
                  <li className="list-inline-item">
                    <a
                      href="https://www.facebook.com/p/Cakes-by-sparrow-ventures-100064636363822"
                      target="_blank"
                    >
                      <Facebook color="white" strokeWidth={1.25} size={18} />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="https://wa.me/+237653761531" target="_blank">
                      <MessageCircleMore
                        strokeWidth={1.25}
                        color="white"
                        size={18}
                      />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a
                      href="https://www.instagram.com/cakes_by_sparrow"
                      target="_blank"
                    >
                      <Instagram color="white" strokeWidth={1.25} size={18} />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenuSidebar;
