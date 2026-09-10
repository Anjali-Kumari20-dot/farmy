import { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="page">
      {/* LEFT PANEL */}
      <section className="left-panel">
        <div className="brand">
          <div className="brand-icon">🌱</div>
          <span>AGRICULTURE</span>
        </div>

        <div className="left-content">
          <p className="eyebrow">GROW • HARVEST • PROSPER</p>

          <h1>
            FARMER
            <br />
            REGISTRATION
          </h1>

          <div className="gold-line"></div>

          <div className="image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=85"
              alt="Farmer working in agricultural field"
            />
          </div>
        </div>

        <p className="ministry">
          MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION, INDIA
        </p>
      </section>

      {/* RIGHT PANEL */}
      <section className="right-panel">
        <div className="form-container">

          <div className="portal-label">
            FARMER PORTAL / REGISTRATION
          </div>

          <div className="portal-icon">🌾</div>

          <h2>
            CREATE
            <br />
            ACCOUNT
          </h2>

          <p className="subtitle">
            Register as a farmer to access the crop procurement portal.
          </p>

          <form>
            {/* NAME */}
            <div className="input-group">
              <label>FULL NAME</label>

              <div className="input-wrapper">
                <span className="input-icon">♙</span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* MOBILE */}
            <div className="input-group">
              <label>MOBILE NUMBER</label>

              <div className="input-wrapper">
                <span className="input-icon">☎</span>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label>CREATE PASSWORD</label>

              <div className="input-wrapper">
                <span className="input-icon">♙</span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">
              <label>CONFIRM PASSWORD</label>

              <div className="input-wrapper">
                <span className="input-icon">♙</span>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? "◉" : "◌"}
                </button>
              </div>
            </div>

            <button type="submit" className="register-button">
              REGISTER
              <span>→</span>
            </button>
          </form>

          <p className="login-text">
            Already have an account?
            <Link to="/login"> Login here.</Link>
          </p>

          <div className="decorative-leaves">
            <span>·</span>
            <span>◒</span>
            <span>🌿</span>
            <span>◓</span>
            <span>·</span>
          </div>

        </div>
      </section>
    </div>
  );
}

export default App;