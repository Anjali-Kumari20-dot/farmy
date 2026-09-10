import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  useEffect(() => {
    if (!otpSent || countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleForgotPassword = () => {
    setShowResetPassword(true);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
    setOtpError("");
    setResetError("");
    setResetSuccess("");
    setCountdown(60);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      setOtpError("Mobile number must contain exactly 10 digits.");
      return;
    }

    setOtpError("");
    setOtpSent(true);
    setOtp("");
    setOtpVerified(false);
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

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();

    if (resetPassword !== confirmResetPassword) {
      setResetError("Passwords do not match. Please enter the same password in both fields.");
      return;
    }

    setResetError("");
    setResetSuccess("Password reset successfully. You can now login with your new password.");
  };

  const handleBackToLogin = () => {
    setShowResetPassword(false);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
    setOtpError("");
    setResetPassword("");
    setConfirmResetPassword("");
    setResetError("");
    setResetSuccess("");
    setCountdown(60);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  };

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


          {!showResetPassword ? (
            <form>

              {/* MOBILE NUMBER */}
              <div className="login-input-group">

                <label>MOBILE NUMBER*</label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    ☎
                  </span>

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
              <div className="login-input-group">

                <label>PASSWORD*</label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">
                    🔒
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
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

                <button type="button" className="forgot" onClick={handleForgotPassword}>
                  Forgot password?
                </button>

              </div>


              {/* LOGIN BUTTON */}
              <button type="submit" className="login-button">
                LOGIN
                <span>→</span>
              </button>

            </form>
          ) : null}

          {showResetPassword && !otpVerified ? (
            <form className="reset-form" onSubmit={otpVerified ? undefined : handleSendOtp}>
              <div className="reset-header">
                <span className="reset-tag">PASSWORD RESET</span>
              </div>

              <button type="button" className="reset-login-link" onClick={handleBackToLogin}>
                ← Back to Login
              </button>

              <div className="login-input-group">
                <label>MOBILE NUMBER*</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">☎</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter your mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    required
                  />
                </div>
              </div>

              {!otpSent ? (
                <button type="submit" className="login-button reset-button">
                  SEND OTP
                  <span>→</span>
                </button>
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

                  <div className="login-input-group otp-group">
                    <label>ENTER OTP*</label>
                    <div className="login-input-wrapper">
                      <span className="login-input-icon">✦</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        required
                      />
                    </div>
                  </div>

                  {otpError ? <p className="password-error">{otpError}</p> : null}

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
            </form>
          ) : null}

          {showResetPassword && otpVerified ? (
            <form className="reset-form" onSubmit={handleResetPasswordSubmit}>
              <div className="reset-header">
                <span className="reset-tag">RESET PASSWORD</span>
              </div>

              <div className="login-input-group">
                <label>NEW PASSWORD*</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">🔒</span>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>

              <div className="login-input-group">
                <label>CONFIRM PASSWORD*</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">🔒</span>
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmResetPassword}
                    onChange={(e) => setConfirmResetPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  >
                    {showConfirmNewPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>

              {resetError ? <p className="password-error">{resetError}</p> : null}

              <button type="submit" className="login-button reset-button">
                RESET PASSWORD
                <span>→</span>
              </button>

              {resetSuccess ? (
                <div className="reset-success-box">
                  <p className="reset-success">{resetSuccess}</p>
                  <button type="button" className="reset-login-link" onClick={handleBackToLogin}>
                    Go to Login
                  </button>
                </div>
              ) : null}
            </form>
          ) : null}


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