const FeatureTools = () => {
  return (
    <div>
      <div className="gi-tools-sidebar-overlay" />
      <div className="gi-tools-sidebar">
        <a href="#" className="gi-tools-sidebar-toggle in-out">
          <i className="fi fi-rr-settings" />
        </a>
        <div className="gi-bar-title">
          <h6>Tools</h6>
          <a href="#" className="close-tools">
            <i className="ri-close-line" />
          </a>
        </div>
        <div className="gi-tools-detail">
          <div className="gi-tools-block">
            <h3>Select Color</h3>
            <ul className="gi-color">
              <li className="color-primary active-variant"></li>
              <li className="color-1"></li>
              <li className="color-2"></li>
              <li className="color-3"></li>
              <li className="color-4"></li>
              <li className="color-5"></li>
              <li className="color-6"></li>
              <li className="color-7"></li>
              <li className="color-8"></li>
              <li className="color-9"></li>
            </ul>
          </div>
          <div className="gi-tools-block">
            <h3>Modes</h3>
            <div className="gi-tools-rtl">
              <div
                className="mode-primary gi-tools-item rtl-mode mode active-mode ltr"
                data-gi-mode-tool="ltr"
              >
                <img src="/assets/images/ltr.png" alt="ltr" />
                <p>LTR</p>
              </div>
              <div
                className="gi-tools-item rtl-mode mode rtl"
                data-gi-mode-tool="rtl"
              >
                <img src="/assets/images/rtl.png" alt="rtl" />
                <p>RTL</p>
              </div>
            </div>
          </div>
          <div className="gi-tools-block">
            <h3>Dark Modes</h3>
            <div className="gi-tools-dark">
              <div
                className="mode-primary gi-tools-item mode-dark active-mode light"
                data-gi-mode-dark="light"
              >
                <img src="/assets/images/light.png" alt="light" />
                <p>Light</p>
              </div>
              <div
                className="gi-tools-item mode-dark dark"
                data-gi-mode-dark="dark"
              >
                <img src="/assets/images/dark.png" alt="dark" />
                <p>Dark</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureTools;
