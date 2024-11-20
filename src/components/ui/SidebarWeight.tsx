const SidebarWeight = () => {
  return (
    <div>
      <div className="gi-sidebar-block">
        <div className="gi-sb-title">
          <h3 className="gi-sidebar-title">Weight</h3>
        </div>
        <div className="gi-sb-block-content">
          <ul>
            <li>
              <div className="gi-sidebar-block-item">
                <input type="checkbox" defaultChecked />
                <a href="#">500gm Pack</a>
                <span className="checked" />
              </div>
            </li>
            <li>
              <div className="gi-sidebar-block-item">
                <input type="checkbox" />
                <a href="#">1kg Pack</a>
                <span className="checked" />
              </div>
            </li>
            <li>
              <div className="gi-sidebar-block-item">
                <input type="checkbox" />
                <a href="#">2kg Pack</a>
                <span className="checked" />
              </div>
            </li>
            <li>
              <div className="gi-sidebar-block-item">
                <input type="checkbox" />
                <a href="#">5kg Pack</a>
                <span className="checked" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarWeight;
