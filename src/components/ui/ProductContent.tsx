import { ProductContentProps } from '@/types';
import StarRating from './StarRating';
import { Link } from 'react-router-dom';

const ProductContent = ({ product }: ProductContentProps) => {
  return (
    <>
      <Link to={`/products/${product.id}`} className="gi-pro-content">
        <Link to={`/categories`}>
          <h6 className="gi-pro-stitle">{product.category}</h6>
        </Link>
        <h5 className="gi-pro-title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h5>
        <p className="gi-info">{product.description}</p>
        <div className="gi-pro-rat-price">
          <StarRating item={product} />

          <span className="gi-price">
            <span className="new-price">{product.price.new}</span>
            <span className="old-price">{product.price.old}</span>
          </span>
        </div>
      </Link>
    </>
  );
};

export default ProductContent;
