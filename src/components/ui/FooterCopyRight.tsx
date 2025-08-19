import { Link } from 'react-router-dom';

const FooterCopyRight = () => {
  return (
    <>
      <div className="footer-copy">
        <div className="footer-bottom-copy ">
          <div className="gi-copy">
            <p>
              Copyright ©{' '}
              <Link to={'/'} className="site-name">
                Cakes by Sparrow
              </Link>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterCopyRight;
