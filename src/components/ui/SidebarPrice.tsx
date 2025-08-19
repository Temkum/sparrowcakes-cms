const SidebarPrice = () => {
  return (
    <>
      <div className="gi-sidebar-block">
        <div className="gi-sb-title">
          <h3 className="gi-sidebar-title">Price</h3>
        </div>
        <div className="gi-sb-block-content gi-price-range-slider es-price-slider">
          <div className="gi-price-filter">
            <div className="gi-price-input">
              <label className="filter__label">
                From
                <input type="text" className="filter__input" />
              </label>
              <span className="gi-price-divider" />
              <label className="filter__label">
                To
                <input type="text" className="filter__input" />
              </label>
            </div>
            <div
              id="gi-sliderPrice"
              className="filter__slider-price"
              data-min={0}
              data-max={250}
              data-step={10}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarPrice;
