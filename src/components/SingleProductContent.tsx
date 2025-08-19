import { SingleProductContentProps } from '@/types';
import { Link } from 'react-router-dom';
import StarRating from './ui/StarRating';
import { Eye, Heart } from 'lucide-react';
import '@/styles/SingleProductContent.scss';

const SingleProductContent: React.FC<SingleProductContentProps> = ({
  product,
}) => {
  return (
    <div className="single-pro-desc single-pro-desc-no-sidebar m-t-991">
      <div className="single-pro-content">
        {/* Product Title */}
        <h5 className="gi-single-title">{product.title || 'Product Title'}</h5>

        {/* Rating Section */}
        <div className="gi-single-rating-wrap">
          <div className="gi-single-rating">
            <StarRating item={product} />
          </div>
          <span className="gi-read-review">
            |&nbsp;&nbsp;
            <Link to="#gi-spt-nav-review">
              {product.totalRatings || 0} Ratings
            </Link>
          </span>
        </div>

        {/* Price and Stock */}
        <div className="gi-single-price-stoke">
          <div className="gi-single-price">
            <div className="final-price">
              ${product.finalPrice || '0.00'}
              <span className="price-des">{product.discount || '-0%'}</span>
            </div>
            <div className="mrp">
              M.R.P. : <span>${product.mrp || '0.00'}</span>
            </div>
          </div>
          <div className="gi-single-stoke">
            <span className="gi-single-sku">SKU#: {product.sku || 'N/A'}</span>
            <span className="gi-single-ps-title">
              {product.stockStatus || 'OUT OF STOCK'}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="gi-single-desc">
          {product.description || 'No description available.'}
        </div>

        {/* Features List */}
        <div className="gi-single-list">
          <ul>
            {product.features?.map(
              (feature: { key: string; value: string }, index: number) => (
                <li key={index}>
                  <strong>{feature.key} :</strong> {feature.value}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Weight Options */}
        <div className="gi-pro-variation">
          <div className="gi-pro-variation-inner gi-pro-variation-size">
            <span>Weight</span>
            <div className="gi-pro-variation-content">
              <ul>
                {product.weightOptions?.map((weight: number, index: number) => (
                  <li key={index} className={weight === 250 ? 'active' : ''}>
                    <span>{weight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="gi-single-qty">
          <div className="qty-plus-minus">
            {/* <input
              className="qty-input"
              type="number"
              name="ms_qtybtn"
              defaultValue={1}
              min={1}
            /> */}
            <button className="minus-button">
              <span>-</span>
            </button>
            <span>0</span>
            <button className="plus-button">
              <span>+</span>
            </button>
          </div>
          <div className="gi-single-cart">
            <button className="btn btn-primary gi-btn-1">Add To Cart</button>
          </div>
          <div className="gi-single-wishlist">
            <Link to="#" className="gi-btn-group wishlist" title="Wishlist">
              <Heart strokeWidth={1.75} color="#777" size={18} />
            </Link>
          </div>
          <div className="gi-single-quickview">
            <Link
              to="#"
              className="gi-btn-group quickview"
              data-link-action="quickview"
              title="Quick view"
              data-bs-toggle="modal"
              data-bs-target="#gi_quickview_modal"
            >
              <Eye strokeWidth={1.75} color="#777" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductContent;
