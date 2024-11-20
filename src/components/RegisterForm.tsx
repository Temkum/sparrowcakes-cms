import '../styles/RegisterForm.scss';
import { Link } from 'react-router-dom';

export default function RegistrationForm() {
  /* const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    postCode: '',
    country: '',
    region: '',
  });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  }; */

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="register-title">Register</h2>
        <p className="register-subtitle">
          Best place to buy and sell digital products.
        </p>
        <form>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number*</label>
              <input
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" placeholder="Address Line 1" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input type="text" id="city" placeholder="City" required />
            </div>
            <div className="form-group">
              <label htmlFor="postcode">Post Code</label>
              <input type="text" id="postcode" placeholder="Post Code" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <select id="country" required>
                <option value="">Country</option>
                {/* Add country options here */}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="region">Region/State</label>
              <select id="region">
                <option value="">Region/State</option>
                {/* Add region/state options here */}
              </select>
            </div>
          </div>
          <div className="form-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>

            <button type="submit" className="register-button">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
