import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    if (!otpSent || countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleRegister = (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      setPhoneError("Mobile number must contain exactly 10 digits.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match. Please enter the same password in both fields.");
      setPhoneError("");
      return;
    }

    setPasswordError("");
    setPhoneError("");
    localStorage.setItem(
      "farmy-profile",
      JSON.stringify({ name: fullName.trim(), phone: phoneNumber }),
    );
    setOtpSent(true);
    setOtp("");
    setOtpVerified(false);
    setOtpError("");
    setCountdown(60);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    if (otp === "1234") {
      setOtpVerified(true);
      setOtpError("");
      return;
    }

    setOtpError("Invalid OTP. Please enter the correct code.");
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    setOtp("");
    setOtpError("");
    setCountdown(60);
  };

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

          <div className="left-info-stack">
            <div className="left-info-card feature-card accent-card">
              <span className="info-badge">SMART PROCUREMENT</span>
              <h4>Efficient crop buying made transparent.</h4>
              <p>
                Farmers can book slots, check queue status, and track
                procurement steps without long delays or uncertainty.
              </p>
            </div>

            <div className="left-info-card feature-card">
              <span className="info-badge">SUPPORT</span>
              <h4>Guidance at every stage.</h4>
              <p>
                Clear updates and support channels help farmers move through
                registration, verification, and dispatch with ease.
              </p>
            </div>

            <div className="left-info-card feature-card">
              <span className="info-badge">ACCESSIBILITY</span>
              <h4>Simple and farmer-friendly operations.</h4>
              <p>
                Designed to reduce congestion, simplify scheduling, and make
                procurement processes smoother for rural communities.
              </p>
            </div>
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

          <form onSubmit={otpVerified ? undefined : handleRegister}>
            {!otpSent && !otpVerified ? (
              <>
                {/* NAME */}
                <div className="input-group">
                  <label>FULL NAME*</label>

                  <div className="input-wrapper">
                    <span className="input-icon">♙</span>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* MOBILE */}
                <div className="input-group">
                  <label>MOBILE NUMBER*</label>

                  <div className="input-wrapper">
                    <span className="input-icon">☎</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Enter mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="input-group">
                  <label>CREATE PASSWORD*</label>

                  <div className="input-wrapper">
                    <span className="input-icon">♙</span>

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                  <label>CONFIRM PASSWORD*</label>

                  <div className="input-wrapper">
                    <span className="input-icon">♙</span>

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
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

                {passwordError ? (
                  <p className="password-error">{passwordError}</p>
                ) : null}

                {phoneError ? <p className="password-error">{phoneError}</p> : null}

                <button type="submit" className="register-button">
                  REGISTER
                  <span>→</span>
                </button>
              </>
            ) : null}

            {otpSent && !otpVerified ? (
              <div className="otp-box">
                <div className="otp-header">
                  <span className="otp-tag">OTP VERIFICATION</span>
                  <span className="otp-timer">
                    {countdown > 0 ? `00:${String(countdown).padStart(2, "0")}` : "00:00"}
                  </span>
                </div>

                <p className="otp-message">
                  Enter the 4-digit OTP sent to your mobile number.
                </p>

                <div className="input-group otp-group">
                  <label>ENTER OTP*</label>

                  <div className="input-wrapper">
                    <span className="input-icon">✦</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      required
                    />
                  </div>
                </div>

                {otpError ? <p className="otp-error">{otpError}</p> : null}

                <button type="button" className="verify-button" onClick={handleOtpSubmit}>
                  VERIFY OTP
                </button>

                <button
                  type="button"
                  className="resend-button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? "Resend OTP in 1 minute" : "Resend OTP"}
                </button>
              </div>
            ) : null}

            {otpVerified ? (
              <div className="otp-success-box">
                <span className="otp-success-icon">✓</span>
                <p>OTP verified successfully. Your registration is complete. Kindly login.</p>
              </div>
            ) : null}
          </form>

          <p className="login-text">
            Already have an account?
            <Link to="/login"> Login here.</Link>
          </p>

          <div className="decorative-leaves top-leaves">
            <span>·</span>
            <span>◒</span>
            <span>🌿</span>
            <span>◓</span>
            <span>·</span>
          </div>

          <div className="website-description">
            <p className="desc-label">OUR MISSION</p>
            <h3>Smarter procurement for every farmer.</h3>
            <p>
              Farmers often face long waiting times, lack of information
              regarding procurement schedules, and uncertainty about
              procurement status. Our platform addresses these challenges by
              enabling farmer registration, slot booking, real-time queue
              management, instant SMS and app notifications, and transparent
              tracking of procurement and payment updates.
            </p>
            <ul>
              <li>Farmer registration and slot booking</li>
              <li>Real-time queue management</li>
              <li>SMS and app notifications</li>
              <li>Procurement and payment status tracking</li>
              <li>Reduced congestion at procurement centres</li>
            </ul>
          </div>

          <div className="decorative-leaves bottom-leaves">
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