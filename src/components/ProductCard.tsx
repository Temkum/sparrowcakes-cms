import { productData } from '@/utils/constants';
import ProductContent from './ui/ProductContent';
import { Eye, Heart, RefreshCw, ShoppingBag } from 'lucide-react';
import '@/styles/ProductCard.scss';
import { Link } from 'react-router-dom';
import { ProductFlags } from '@/types';

const ProductCard = () => {
  return (
    <>
      {productData.map((item, index) => (
        <div
          className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-6 mb-6 gi-product-box pro-gl-content"
          key={index}
        >
          <div className="gi-product-content">
            <div className="gi-product-inner">
              <div className="gi-pro-image-outer">
                <div className="gi-pro-image">
                  <Link to={`/products/${item.id}`}>
                    <div className="image">
                      <span className="label veg">
                        <span className="dot" />
                      </span>
                      <img
                        className="main-image"
                        src={item.images.main}
                        alt={item.name}
                      />
                      <img
                        className="hover-image"
                        src={item.images.hover}
                        alt="Product"
                      />
                    </div>
                    {/* <span className="flags">
                      {item.flags.map((flag, index) => (
                        <span
                          key={index}
                          className={flag === 'sale' ? 'sale' : 'new'}
                        >
                          {flag}
                        </span>
                      ))}
                    </span> */}
                    <span className="flags">
                      {item.flags.length > 0 && (
                        <span
                          className={item.flags === 'sale' ? 'sale' : 'new'}
                        >
                          {item.flags}
                        </span>
                      )}
                    </span>
                  </Link>
                  <div className="gi-pro-actions">
                    <Link
                      to={`/products/${item.id}`}
                      className="gi-btn-group wishlist"
                      title="Wishlist"
                    >
                      <Heart strokeWidth={2} size={18} color="#777" />
                    </Link>
                    <Link
                      to="#"
                      className="gi-btn-group quickview"
                      data-link-action="quickview"
                      title="Quick view"
                      data-bs-toggle="modal"
                      data-bs-target="#gi_quickview_modal"
                    >
                      <Eye strokeWidth={2} size={18} color="#777" />
                    </Link>
                    <Link
                      to="#"
                      className="gi-btn-group compare"
                      title="Compare"
                    >
                      <RefreshCw strokeWidth={2} size={18} color="#777" />
                    </Link>
                    <Link
                      to="#"
                      title="Add To Cart"
                      className="gi-btn-group add-to-cart"
                    >
                      <ShoppingBag strokeWidth={2} size={18} color="#777" />
                    </Link>
                  </div>
                </div>
              </div>
              <ProductContent
                product={{
                  ...item,
                  flags: item.flags as unknown as ProductFlags,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductCard;
