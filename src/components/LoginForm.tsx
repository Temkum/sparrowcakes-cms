import '@/styles/LoginForm.scss';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  return (
    <>
      {/* <section className="gi-login padding-tb-40">
        <div className="container">
          <div className="section-title-2">
            <h2 className="gi-title">
              Login
              <span />
            </h2>
            <p>Get access to your Orders, Wishlist and Recommendations.</p>
          </div>
          <div className="gi-login-content">
            <div className="gi-login-box">
              <div className="gi-login-wrapper">
                <div className="gi-login-container">
                  <div className="gi-login-form">
                    <form action="#" method="post">
                      <span className="gi-login-wrap">
                        <label>Email Address*</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your email add..."
                          required
                        />
                      </span>
                      <span className="gi-login-wrap">
                        <label>Password*</label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Enter your password"
                          required
                        />
                      </span>
                      <span className="gi-login-wrap gi-login-fp">
                        <label>
                          <a href="#">Forgot Password?</a>
                        </label>
                      </span>
                      <span className="gi-login-wrap gi-login-btn">
                        <span>
                          <a href="register.html" className="">
                            Create Account?
                          </a>
                        </span>
                        <button className="gi-btn-1 btn" type="submit">
                          Login
                        </button>
                      </span>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="gi-login-box d-n-991">
              <div className="gi-login-img">
                <img src="assets/img/common/login.png" alt="login" />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <div className="login-container">
        <div className="login-form">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">
            Get access to your Orders and Wishlist.
          </p>
          <form>
            <div className="form-group">
              <label htmlFor="email">Email Address*</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-footer">
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            <div className="create-account">
              <p>Don't have an account?</p>
              <Link to="/register">Create Account?</Link>
            </div>
          </form>
        </div>
        <div className="login-image">
          <img src="path/to/your/image.jpg" alt="Login visual" />
        </div>
      </div>
    </>
  );
};

export default LoginForm;
