import { Facebook, Instagram, MessageCircleMore } from 'lucide-react';
import { Link } from 'react-router-dom';

const FooterSocial = () => {
  return (
    <>
      <div className="gi-footer-social">
        <div className="gi-footer-widget">
          <div className="gi-footer-links gi-footer-dropdown">
            <ul className="align-itegi-center">
              <li className="gi-footer-link">
                <Link
                  to="https://www.facebook.com/p/Cakes-by-sparrow-ventures-100064636363822"
                  target="_blank"
                >
                  <Facebook color="white" strokeWidth={1.25} size={18} />
                </Link>
              </li>
              <li className="gi-footer-link">
                <Link to="https://wa.me/+237653761531" target="_blank">
                  <MessageCircleMore
                    strokeWidth={1.25}
                    color="white"
                    size={18}
                  />
                </Link>
              </li>
              <li className="gi-footer-link">
                <Link
                  to="https://www.instagram.com/cakes_by_sparrow"
                  target="_blank"
                >
                  <Instagram color="white" strokeWidth={1.25} size={18} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterSocial;
