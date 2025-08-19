const SidebarBrand = () => {
  return (
    <div>
      <div className="gi-sidebar-block">
        <div className="gi-sb-title">
          <h3 className="gi-sidebar-title">Brand</h3>
        </div>
        <div className="gi-sb-block-content">
          <ul>
            <li>
              <div className="gi-sidebar-block-item">
                <input type="checkbox" defaultChecked />
                <a href="#">
                  <span>
                    <i className="fi-rr-cupcake" />
                    Zencart Dairy
                  </span>
                </a>
                <span className="checked" />
              </div>
            </li>
            <li>
              <div className="gi-sidebar-block-item">
                <input type="checkbox" />
                <a href="#">
                  <span>
                    <i className="fi fi-rs-apple-whole" />
                    Xeta Fruits
                  </span>
                </a>
                <span className="checked" />
              </div>
            </li>
            <li>
              <div className="gi-sidebar-block-item">
                <input type="checkbox" />
                <a href="#">
                  <span>
                    <i className="fi fi-rr-popcorn" />
                    Pili Snack
                  </span>
                </a>
                <span className="checked" />
              </div>
            </li>
            <li>
              <div className="gi-sidebar-block-item">
                <input type="checkbox" />
                <a href="#">
                  <span>
                    <i className="fi fi-rr-drink-alt" />
                    Indiana Juice
                  </span>
                </a>
                <span className="checked" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarBrand;
