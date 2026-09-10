import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">

      {/* LEFT PANEL */}
      <section className="login-left">

        <div className="login-brand">
          <div className="login-brand-icon">🌱</div>
          <span>AGRICULTURE</span>
        </div>

        <div className="login-left-content">

          <p className="login-eyebrow">
            ROOTED IN SOIL
          </p>

          <h1>
            CROP
            <br />
            PROCUREMENT
            <br />
            CENTER
          </h1>

          <div className="login-gold-line"></div>

          <div className="login-image">
            <img
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=85"
              alt="Agricultural field"
            />
          </div>

        </div>

        <p className="login-ministry">
          MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION, INDIA
        </p>

      </section>


      {/* RIGHT PANEL */}
      <section className="login-right">

        <div className="login-form-container">

          <div className="login-portal-label">
            FARMER PORTAL / 01
          </div>

          <div className="login-icon">
            🌾
          </div>

          <h2>
            FARMER
            <br />
            LOGIN
          </h2>

          <p className="login-subtitle">
            Welcome back. Sign in to manage your crop procurement.
          </p>


          <form>

            {/* MOBILE NUMBER */}
            <div className="login-input-group">

              <label>MOBILE NUMBER</label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  ☎
                </span>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="login-input-group">

              <label>PASSWORD</label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "◉" : "◌"}
                </button>

              </div>

            </div>


            {/* OPTIONS */}
            <div className="login-options">

              <label className="remember">

                <input type="checkbox" />

                <span>REMEMBER ME</span>

              </label>

              <a href="#" className="forgot">
                Forgot password?
              </a>

            </div>


            {/* LOGIN BUTTON */}
            <button type="submit" className="login-button">
              LOGIN
              <span>→</span>
            </button>

          </form>


          {/* REGISTER LINK */}
          <p className="register-text">
            Don't have an account?
            <Link to="/">
              {" "}Create an account.
            </Link>
          </p>


          {/* DECORATION */}
          <div className="login-decoration">
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

export default Login;