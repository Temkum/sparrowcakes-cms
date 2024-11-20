import ProductCard from './ProductCard';

const Products = () => {
  return (
    <>
      <div className="shop-pro-content">
        <div className="shop-pro-inner">
          <div className="row">
            <ProductCard />
          </div>
        </div>
        {/* Pagination Start */}
        <div className="gi-pro-pagination">
          <span>Showing 1-12 of 21 item(s)</span>
          <ul className="gi-pro-pagination-inner">
            <li>
              <a className="active" href="#">
                1
              </a>
            </li>
            <li>
              <a href="#">2</a>
            </li>
            <li>
              <a href="#">3</a>
            </li>
            <li>
              <span>...</span>
            </li>
            <li>
              <a href="#">8</a>
            </li>
            <li>
              <a className="next" href="#">
                Next <i className="gicon gi-angle-right" />
              </a>
            </li>
          </ul>
        </div>
        {/* Pagination End */}
      </div>
    </>
  );
};

export default Products;
