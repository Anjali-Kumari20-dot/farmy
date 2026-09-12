import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../common/InputField";
import DecorativeLeaves from "../common/DecorativeLeaves";
import { WheatIcon, PhoneIcon, LockIcon, AlertCircleIcon } from "../common/Icons";
import { loginFarmer } from "../../api/auth";
import { useAuth } from "../../context/useAuth";
import "./AuthForms.css";

function LoginForm({ onForgotPassword }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginFarmer({ mobileNumber: phoneNumber, password });
      if (res.success && res.token) {
        login(res.token, res.farmer);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-wrapper">
      <div className="portal-pill">FARMER PORTAL / 01</div>
      <div className="portal-logo-icon">
        <WheatIcon size={32} />
      </div>

      <h2 className="auth-form-title">
        FARMER<br />LOGIN
      </h2>

      <p className="auth-form-subtitle">
        Welcome back. Sign in to manage your crop procurement.
      </p>

      {error && (
        <div className="auth-error-banner" role="alert">
          <AlertCircleIcon size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin}>
        <InputField
          id="login-phone"
          label="MOBILE NUMBER*"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="Enter 10-digit mobile number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
          required
          icon={<PhoneIcon size={17} />}
        />

        <InputField
          id="login-password"
          label="PASSWORD*"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          isPassword
          icon={<LockIcon size={17} />}
        />

        <div className="auth-form-options">
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>REMEMBER ME</span>
          </label>

          <button
            type="button"
            className="auth-link-btn"
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="auth-primary-btn" disabled={isSubmitting}>
          {isSubmitting ? "SIGNING IN..." : "LOGIN"}
          <span aria-hidden="true">&rarr;</span>
        </button>
      </form>

      <p className="auth-switch-text">
        Don't have an account?
        <Link to="/"> Create an account.</Link>
      </p>

      <DecorativeLeaves />
    </div>
  );
}

export default LoginForm;
